'use client';

import React, { useEffect, useId, useRef, useState } from 'react';
import { AlertCircle, LoaderCircle, Maximize2, Minimize2, Pause, Play, RotateCcw, SlidersHorizontal, ZoomIn, ZoomOut } from 'lucide-react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { ARM_JOINTS, createArmRig, getArmCameraFrame, getDemoPose, HOME_POSE, type ArmPose, type ArmRig, type JointId } from './armRig';
import styles from './CADViewer.module.css';

interface CADViewerProps {
  modelPath: string;
}

interface ViewerActions {
  play: (playing: boolean) => void;
  setJoint: (joint: JointId, angle: number) => void;
  reset: () => void;
  zoom: (factor: number) => void;
}

function disposeObject(object: THREE.Object3D) {
  const geometries = new Set<THREE.BufferGeometry>();
  const materials = new Set<THREE.Material>();
  const textures = new Set<THREE.Texture>();
  object.traverse(child => {
    if (!(child instanceof THREE.Mesh)) return;
    geometries.add(child.geometry);
    for (const material of Array.isArray(child.material) ? child.material : [child.material]) {
      materials.add(material);
      for (const value of Object.values(material)) {
        if (value instanceof THREE.Texture) textures.add(value);
      }
    }
  });
  textures.forEach(texture => texture.dispose());
  materials.forEach(material => material.dispose());
  geometries.forEach(geometry => geometry.dispose());
}

export default function CADViewer({ modelPath }: CADViewerProps) {
  const viewerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const actionsRef = useRef<ViewerActions | null>(null);
  const controlId = useId();
  const [active, setActive] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [error, setError] = useState('');
  const [playing, setPlaying] = useState(false);
  const [showJoints, setShowJoints] = useState(false);
  const [pose, setPose] = useState<ArmPose>({ ...HOME_POSE });
  const [fullscreen, setFullscreen] = useState(false);
  const [canFullscreen, setCanFullscreen] = useState(false);

  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;
    setCanFullscreen(Boolean(document.fullscreenEnabled));
    const handleFullscreen = () => setFullscreen(document.fullscreenElement === viewer);
    document.addEventListener('fullscreenchange', handleFullscreen);
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        setActive(true);
        observer.disconnect();
      }
    }, { rootMargin: '240px' });
    observer.observe(viewer);
    return () => {
      observer.disconnect();
      document.removeEventListener('fullscreenchange', handleFullscreen);
    };
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    if (!active || !stage) return;

    setStatus('loading');
    setPlaying(false);
    setPose({ ...HOME_POSE });
    setError('');
    const abortController = new AbortController();
    let disposed = false;
    let frame = 0;
    let lastTime = 0;
    let lastReadout = 0;
    let visible = true;
    let demoPlaying = false;
    let demoTime = 0;
    let rig: ArmRig | null = null;
    let armModel: THREE.Object3D | null = null;
    let automaticFraming = true;
    let targetPose = { ...HOME_POSE };
    const currentPose = { ...HOME_POSE };
    let sphere: THREE.Sphere | null = null;
    let frameBounds: THREE.Box3 | null = null;
    let environment: THREE.WebGLRenderTarget | null = null;
    let renderer: THREE.WebGLRenderer;

    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    } catch {
      setError('3D graphics are unavailable in this browser.');
      setStatus('error');
      return () => abortController.abort();
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.85;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.shadowMap.autoUpdate = false;
    renderer.domElement.setAttribute('role', 'img');
    renderer.domElement.setAttribute('aria-label', 'WayBionic mechanical arm, September 2026 CAD assembly');
    stage.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.001, 100);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enablePan = false;
    controls.maxPolarAngle = Math.PI * 0.82;
    controls.minPolarAngle = 0.12;
    renderer.domElement.style.touchAction = 'pan-y';

    const viewDirection = new THREE.Vector3(-1.8, 0.75, 3).normalize();
    const hemisphere = new THREE.HemisphereLight(0xffffff, 0x776577, 1.5);
    scene.add(hemisphere);
    const keyLight = new THREE.DirectionalLight(0xffffff, 3);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.normalBias = 0.001;
    keyLight.shadow.bias = -0.0001;
    scene.add(keyLight, keyLight.target);

    function requestRender() {
      if (!disposed && !frame && visible && !document.hidden) frame = requestAnimationFrame(render);
    }

    function fitCamera(resetDirection = false) {
      if (!sphere || !frameBounds) return;
      const direction = resetDirection ? viewDirection : camera.position.clone().sub(controls.target).normalize();
      const { target, distance } = getArmCameraFrame(frameBounds, direction, camera.aspect, camera.fov);
      controls.target.copy(target);
      camera.position.copy(target).addScaledVector(direction, distance);
      camera.near = sphere.radius / 100;
      camera.far = distance * 15;
      camera.updateProjectionMatrix();
      controls.minDistance = sphere.radius * 1.2;
      controls.maxDistance = distance * 2.5;
      controls.update();
      requestRender();
    }

    function resize() {
      const width = stage!.clientWidth;
      const height = stage!.clientHeight;
      if (!width || !height) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      fitCamera();
      requestRender();
    }

    function render(time: number) {
      frame = 0;
      if (disposed || !visible || document.hidden) return;
      const delta = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 0;
      lastTime = time;
      let moving = false;

      if (rig) {
        if (demoPlaying) {
          demoTime += delta;
          targetPose = getDemoPose(demoTime);
        }
        for (const joint of ARM_JOINTS) {
          const difference = Math.abs(currentPose[joint.id] - targetPose[joint.id]);
          currentPose[joint.id] = difference < 0.01
            ? targetPose[joint.id]
            : THREE.MathUtils.damp(currentPose[joint.id], targetPose[joint.id], 12, delta);
          moving ||= difference > 0.01;
        }
        if (moving || demoPlaying) {
          rig.setPose(currentPose);
          if (armModel && frameBounds) frameBounds.setFromObject(armModel).expandByScalar(0.015);
          renderer.shadowMap.needsUpdate = true;
        }
        if (demoPlaying && time - lastReadout > 100) {
          setPose({ ...currentPose });
          lastReadout = time;
        }
      }

      let framingMoving = false;
      if (automaticFraming && frameBounds) {
        const offset = camera.position.clone().sub(controls.target);
        const direction = offset.clone().normalize();
        const desired = getArmCameraFrame(frameBounds, direction, camera.aspect, camera.fov);
        framingMoving = Math.abs(offset.length() - desired.distance) > 0.00001
          || controls.target.distanceTo(desired.target) > 0.00001;
        const blend = framingMoving ? 1 - Math.exp(-16 * delta) : 1;
        controls.target.lerp(desired.target, blend);
        const distance = THREE.MathUtils.lerp(offset.length(), desired.distance, blend);
        camera.position.copy(controls.target).addScaledVector(direction, distance);
      }
      const cameraMoving = controls.update();
      renderer.render(scene, camera);
      if (moving || demoPlaying || cameraMoving || framingMoving) requestRender();
    }

    function handleManualView() {
      automaticFraming = false;
    }

    function handleWheel(event: WheelEvent) {
      if (!event.ctrlKey && !event.metaKey && document.fullscreenElement !== viewerRef.current) {
        event.stopImmediatePropagation();
      }
    }

    function handleVisibility() {
      lastTime = 0;
      requestRender();
    }

    function handleContextLost(event: Event) {
      event.preventDefault();
      if (disposed) return;
      demoPlaying = false;
      cancelAnimationFrame(frame);
      frame = 0;
      actionsRef.current = null;
      setPlaying(false);
      setError('The 3D view was interrupted. Please reload the arm.');
      setStatus('error');
    }

    controls.addEventListener('change', requestRender);
    controls.addEventListener('start', handleManualView);
    renderer.domElement.addEventListener('wheel', handleWheel, { capture: true, passive: true });
    renderer.domElement.addEventListener('webglcontextlost', handleContextLost);
    document.addEventListener('visibilitychange', handleVisibility);
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(stage);
    const visibilityObserver = new IntersectionObserver(entries => {
      visible = entries.some(entry => entry.isIntersecting);
      lastTime = 0;
      requestRender();
    });
    visibilityObserver.observe(stage);
    resize();

    async function loadModel() {
      try {
        const response = await fetch(modelPath, { signal: abortController.signal });
        if (!response.ok) throw new Error('Unable to download the arm.');
        const buffer = await response.arrayBuffer();
        if (disposed) return;
        const gltf = await new GLTFLoader().parseAsync(buffer, '');
        if (disposed) {
          disposeObject(gltf.scene);
          return;
        }
        const model = gltf.scene;
        armModel = model;
        scene.add(model);
        rig = createArmRig(model);

        const room = new RoomEnvironment();
        const pmrem = new THREE.PMREMGenerator(renderer);
        environment = pmrem.fromScene(room, 0.04);
        scene.environment = environment.texture;
        room.dispose();
        pmrem.dispose();

        model.traverse(child => {
          if (!(child instanceof THREE.Mesh)) return;
          child.castShadow = true;
          child.receiveShadow = true;
          for (const material of Array.isArray(child.material) ? child.material : [child.material]) {
            if (material instanceof THREE.MeshStandardMaterial) {
              material.roughness = Math.max(material.roughness, 0.32);
              material.envMapIntensity = 0.7;
            }
          }
        });

        frameBounds = rig.homeBounds.clone().expandByScalar(0.015);
        sphere = rig.motionBounds.getBoundingSphere(new THREE.Sphere());
        const floor = new THREE.Mesh(
          new THREE.PlaneGeometry(sphere.radius * 6, sphere.radius * 6),
          new THREE.ShadowMaterial({ opacity: 0.16 }),
        );
        floor.rotation.x = -Math.PI / 2;
        floor.position.set(sphere.center.x, rig.homeBounds.min.y - 0.002, sphere.center.z);
        floor.receiveShadow = true;
        scene.add(floor);

        keyLight.position.copy(sphere.center).add(new THREE.Vector3(-1, 2, 1));
        keyLight.target.position.copy(sphere.center);
        const shadowSize = sphere.radius * 2;
        Object.assign(keyLight.shadow.camera, {
          left: -shadowSize, right: shadowSize, top: shadowSize, bottom: -shadowSize,
          near: 0.1, far: 6,
        });
        keyLight.shadow.camera.updateProjectionMatrix();
        renderer.shadowMap.needsUpdate = true;
        fitCamera(true);

        actionsRef.current = {
          play(next) {
            demoPlaying = next;
            if (next) automaticFraming = true;
            if (!next) {
              targetPose = { ...currentPose };
              setPose({ ...currentPose });
            }
            lastTime = 0;
            setPlaying(next);
            requestRender();
          },
          setJoint(joint, angle) {
            automaticFraming = true;
            if (demoPlaying) targetPose = { ...currentPose };
            demoPlaying = false;
            demoTime = 0;
            setPlaying(false);
            const definition = ARM_JOINTS.find(item => item.id === joint)!;
            targetPose = { ...targetPose, [joint]: THREE.MathUtils.clamp(angle, definition.min, definition.max) };
            setPose({ ...targetPose });
            requestRender();
          },
          reset() {
            automaticFraming = true;
            demoPlaying = false;
            demoTime = 0;
            targetPose = { ...HOME_POSE };
            setPlaying(false);
            setPose({ ...HOME_POSE });
            fitCamera(true);
            requestRender();
          },
          zoom(factor) {
            automaticFraming = false;
            const offset = camera.position.clone().sub(controls.target);
            const distance = THREE.MathUtils.clamp(offset.length() * factor, controls.minDistance, controls.maxDistance);
            camera.position.copy(controls.target).add(offset.setLength(distance));
            controls.update();
            requestRender();
          },
        };
        setStatus('ready');
        requestRender();
      } catch {
        if (disposed) return;
        setError('The arm could not be loaded. Please try again.');
        setStatus('error');
      }
    }

    void loadModel();

    return () => {
      disposed = true;
      abortController.abort();
      cancelAnimationFrame(frame);
      actionsRef.current = null;
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      document.removeEventListener('visibilitychange', handleVisibility);
      renderer.domElement.removeEventListener('wheel', handleWheel, true);
      renderer.domElement.removeEventListener('webglcontextlost', handleContextLost);
      controls.removeEventListener('change', requestRender);
      controls.removeEventListener('start', handleManualView);
      controls.dispose();
      disposeObject(scene);
      environment?.dispose();
      keyLight.shadow.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [active, attempt, modelPath]);

  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement === viewerRef.current) await document.exitFullscreen();
      else await viewerRef.current?.requestFullscreen();
    } catch {
      setCanFullscreen(false);
    }
  }

  const ready = status === 'ready';

  return (
    <div ref={viewerRef} className={styles.viewer} role="region" aria-label="Interactive arm viewer" data-testid="arm-viewer" data-state={status} data-playing={playing}>
      <div className={styles.heading}>
        <div className={styles.title}>
          <h3>Mechanical arm</h3>
          <span>{playing ? 'Demo running' : 'Prototype / Sep 2026'}</span>
        </div>
        <div className={styles.viewTools}>
          <button type="button" className={styles.iconButton} aria-label="Zoom out" data-tooltip="Zoom out" disabled={!ready} onClick={() => actionsRef.current?.zoom(1.2)}><ZoomOut size={17} /></button>
          <button type="button" className={styles.iconButton} aria-label="Zoom in" data-tooltip="Zoom in" disabled={!ready} onClick={() => actionsRef.current?.zoom(1 / 1.2)}><ZoomIn size={17} /></button>
          {canFullscreen && <button type="button" className={styles.iconButton} aria-label={fullscreen ? 'Exit fullscreen' : 'Expand viewer'} data-tooltip={fullscreen ? 'Exit fullscreen' : 'Expand viewer'} disabled={!ready} onClick={toggleFullscreen}>{fullscreen ? <Minimize2 size={17} /> : <Maximize2 size={17} />}</button>}
        </div>
      </div>

      <div className={styles.stage} ref={stageRef} data-testid="arm-stage" aria-busy={status === 'loading'}>
        {status === 'loading' && <div className={styles.status} role="status"><LoaderCircle className={styles.spinner} size={24} /><span>Loading arm...</span></div>}
        {status === 'error' && <div className={styles.status} role="alert"><AlertCircle size={24} /><span>{error}</span><button type="button" className={styles.secondaryButton} onClick={() => setAttempt(value => value + 1)}><RotateCcw size={16} />Reload arm</button></div>}
      </div>

      <div className={styles.toolbar}>
        <button type="button" className={styles.playButton} disabled={!ready} aria-pressed={playing} onClick={() => actionsRef.current?.play(!playing)}>
          {playing ? <Pause size={17} fill="currentColor" /> : <Play size={17} fill="currentColor" />}
          {playing ? 'Pause demo' : 'Play demo'}
        </button>
        <button type="button" className={styles.secondaryButton} disabled={!ready} aria-label="Joint controls" aria-expanded={showJoints} aria-controls={`${controlId}-joints`} onClick={() => setShowJoints(value => !value)}><SlidersHorizontal size={17} />Joints</button>
        <button type="button" className={styles.iconButton} aria-label="Reset arm and view" data-tooltip="Reset arm and view" disabled={!ready} onClick={() => actionsRef.current?.reset()}><RotateCcw size={18} /></button>
      </div>

      <div className={styles.joints} id={`${controlId}-joints`} hidden={!showJoints}>
        {ARM_JOINTS.map(joint => (
          <div className={styles.joint} key={joint.id}>
            <label htmlFor={`${controlId}-${joint.id}`}>{joint.label}</label>
            <input id={`${controlId}-${joint.id}`} type="range" min={joint.min} max={joint.max} step={1} value={Math.round(pose[joint.id])} aria-valuetext={`${Math.round(pose[joint.id])} degrees`} disabled={!ready} onChange={event => actionsRef.current?.setJoint(joint.id, Number(event.target.value))} />
            <output htmlFor={`${controlId}-${joint.id}`}>{Math.round(pose[joint.id])}&deg;</output>
          </div>
        ))}
      </div>
    </div>
  );
}