import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { before, test } from 'node:test';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { ARM_JOINTS, createArmRig, getArmCameraFrame, getDemoPose, HOME_POSE } from './armRig.ts';

let source;

before(async () => {
  const file = await readFile(new URL('../../../public/models/mechanical_arm-09-21-26.glb', import.meta.url));
  const gltf = await new GLTFLoader().parseAsync(
    file.buffer.slice(file.byteOffset, file.byteOffset + file.byteLength), '',
  );
  source = gltf.scene;
});

function nearVector(actual, expected, message) {
  assert.ok(actual.distanceTo(expected) < 0.00001, message);
}

test('rigging preserves every exported mesh and its home transform', () => {
  const model = source.clone(true);
  model.updateMatrixWorld(true);
  const original = new Map();
  model.traverse(object => {
    if (object.isMesh) original.set(object.uuid, object.matrixWorld.clone());
  });
  assert.ok(original.size >= 72);
  createArmRig(model);
  let meshCount = 0;
  model.traverse(object => {
    if (!object.isMesh) return;
    meshCount++;
    const expected = original.get(object.uuid);
    object.matrixWorld.elements.forEach((value, index) => {
      assert.ok(Math.abs(value - expected.elements[index]) < 0.00001, object.name);
    });
  });
  assert.equal(meshCount, original.size);
});

test('base, shoulder and elbow move downstream parts while keeping their bearings connected', () => {
  for (const id of ['base', 'shoulder', 'elbow']) {
    const model = source.clone(true);
    const rig = createArmRig(model);
    const base = model.getObjectByName('bottom-base-assembly');
    const tip = model.getObjectByName('Biomed_Lock_Mechanism_V2_HT_20260815');
    const originalBase = base.getWorldPosition(new THREE.Vector3());
    const originalTip = tip.getWorldPosition(new THREE.Vector3());
    const pivot = rig.joints[id].pivot;
    const originalPivot = pivot.getWorldPosition(new THREE.Vector3());
    rig.setPose({ ...HOME_POSE, [id]: 20 });
    nearVector(base.getWorldPosition(new THREE.Vector3()), originalBase, `${id}: fixed base`);
    nearVector(pivot.getWorldPosition(new THREE.Vector3()), originalPivot, `${id}: bearing`);
    assert.ok(tip.getWorldPosition(new THREE.Vector3()).distanceTo(originalTip) > 0.01, id);
    rig.setPose(HOME_POSE);
    nearVector(tip.getWorldPosition(new THREE.Vector3()), originalTip, `${id}: reset`);
  }
});

test('prototype limits clamp invalid and out-of-range requests', () => {
  const rig = createArmRig(source.clone(true));
  rig.setPose({ base: 500, shoulder: -500, elbow: Number.NaN });
  assert.deepEqual(rig.pose, { base: 90, shoulder: -20, elbow: 0 });
});

test('demo loops smoothly and stays inside the prototype limits', () => {
  assert.deepEqual(getDemoPose(0), HOME_POSE);
  assert.deepEqual(getDemoPose(15), HOME_POSE);
  for (let time = 0; time <= 30; time += 0.05) {
    const pose = getDemoPose(time);
    for (const joint of ARM_JOINTS) {
      assert.ok(pose[joint.id] >= joint.min && pose[joint.id] <= joint.max);
    }
  }
});

test('the motion envelope contains intermediate poses and preserves the home pose', () => {
  const model = source.clone(true);
  const rig = createArmRig(model);
  assert.deepEqual(rig.pose, HOME_POSE);
  assert.equal(rig.motionBounds.isEmpty(), false);
  const envelope = rig.motionBounds.clone().expandByScalar(0.015);
  for (const base of [-70, -20, 20, 70]) {
    for (const shoulder of [-15, 10, 25]) {
      for (const elbow of [-30, -10, 10, 30]) {
        rig.setPose({ base, shoulder, elbow });
        assert.ok(envelope.containsBox(new THREE.Box3().setFromObject(model)));
      }
    }
  }
});

test('pose-aware camera framing keeps portrait and landscape views inside the canvas', () => {
  const model = source.clone(true);
  const rig = createArmRig(model);
  const direction = new THREE.Vector3(-1.8, 0.75, 3).normalize();
  const poses = [HOME_POSE, { base: 90, shoulder: 30, elbow: 35 }, { base: -90, shoulder: -20, elbow: -35 }];
  for (let time = 0; time < 15; time += 0.5) poses.push(getDemoPose(time));

  for (const aspect of [0.6, 0.85, 1.25, 2.5]) {
    for (const pose of poses) {
      rig.setPose(pose);
      const bounds = new THREE.Box3().setFromObject(model).expandByScalar(0.015);
      const frame = getArmCameraFrame(bounds, direction, aspect, 38);
      const camera = new THREE.PerspectiveCamera(38, aspect, 0.001, 100);
      camera.position.copy(frame.target).addScaledVector(direction, frame.distance);
      camera.lookAt(frame.target);
      camera.updateMatrixWorld(true);
      for (const horizontal of [bounds.min.x, bounds.max.x]) {
        for (const vertical of [bounds.min.y, bounds.max.y]) {
          for (const depth of [bounds.min.z, bounds.max.z]) {
            const point = new THREE.Vector3(horizontal, vertical, depth).project(camera);
            assert.ok(Math.abs(point.x) < 0.95 && Math.abs(point.y) < 0.95, JSON.stringify({ aspect, pose }));
            assert.ok(point.z > -1 && point.z < 1);
          }
        }
      }
    }
    const homeFrame = getArmCameraFrame(rig.homeBounds, direction, aspect, 38);
    const motionFrame = getArmCameraFrame(rig.motionBounds, direction, aspect, 38);
    assert.ok(homeFrame.distance < motionFrame.distance * 0.85);
  }
});