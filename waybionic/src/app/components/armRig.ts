import * as THREE from 'three';

export const ARM_JOINTS = [
  { id: 'base', label: 'Base', min: -90, max: 90 },
  { id: 'shoulder', label: 'Shoulder', min: -20, max: 30 },
  { id: 'elbow', label: 'Elbow', min: -35, max: 35 },
] as const;

export type JointId = (typeof ARM_JOINTS)[number]['id'];
export type ArmPose = Record<JointId, number>;

export const HOME_POSE: ArmPose = { base: 0, shoulder: 0, elbow: 0 };

const DEMO_POSES: ArmPose[] = [
  HOME_POSE,
  { base: -40, shoulder: 18, elbow: -25 },
  { base: 35, shoulder: -12, elbow: 25 },
  { base: 60, shoulder: 22, elbow: -18 },
  { base: -25, shoulder: 8, elbow: 20 },
  HOME_POSE,
];

export function getDemoPose(seconds: number): ArmPose {
  const segment = (Math.max(0, seconds) / 3) % (DEMO_POSES.length - 1);
  const index = Math.floor(segment);
  const blend = THREE.MathUtils.smootherstep(segment - index, 0, 1);
  const start = DEMO_POSES[index];
  const end = DEMO_POSES[index + 1];

  return {
    base: THREE.MathUtils.lerp(start.base, end.base, blend),
    shoulder: THREE.MathUtils.lerp(start.shoulder, end.shoulder, blend),
    elbow: THREE.MathUtils.lerp(start.elbow, end.elbow, blend),
  };
}

export function getArmCameraFrame(bounds: THREE.Box3, direction: THREE.Vector3, aspect: number, fieldOfView: number) {
  const target = bounds.getCenter(new THREE.Vector3());
  const verticalFov = THREE.MathUtils.degToRad(fieldOfView);
  const horizontalFov = 2 * Math.atan(Math.tan(verticalFov / 2) * aspect);
  const viewRotation = new THREE.Matrix4().lookAt(direction, new THREE.Vector3(), THREE.Object3D.DEFAULT_UP).invert();
  let distance = 0;
  for (const horizontal of [bounds.min.x, bounds.max.x]) {
    for (const vertical of [bounds.min.y, bounds.max.y]) {
      for (const depth of [bounds.min.z, bounds.max.z]) {
        const corner = new THREE.Vector3(horizontal, vertical, depth).sub(target).applyMatrix4(viewRotation);
        distance = Math.max(distance,
          Math.abs(corner.x) / Math.tan(horizontalFov / 2) + corner.z,
          Math.abs(corner.y) / Math.tan(verticalFov / 2) + corner.z,
        );
      }
    }
  }
  return { target, distance: distance * 1.12 };
}

export function createArmRig(model: THREE.Object3D) {
  const assembly = model.getObjectByName('full-arm-smaller');
  if (!assembly) throw new Error('The expected arm assembly is missing.');

  const part = (name: string) => {
    const object = assembly.getObjectByName(name);
    if (!object) throw new Error(`The arm part "${name}" is missing.`);
    return object;
  };

  const baseBearing = part('outer_ring_sweep_loose-1');
  const shoulderBearing = part('outer-ring-Nema23-1');
  const elbowBearing = part('outer_ring_sweep_loose-2');
  const fixedParts = new Set([
    'bottom-base-assembly', 'stepper-base', 'sweep_gearbox_redone',
    'outer_ring_sweep_loose-1', 'heatSetInsertm3-4', 'm3-20long-1',
    'heatSetInsertm3-2', 'heatSetInsertm3-3', 'heatSetInsertm3-1_1',
  ]);
  const shoulderParts = [
    'j2shouldersplit', 'bottom-j2-nema23-v2_wHole-1',
    'outer_ring_sweep_loose-2', 'stepper_j2_sweep-3', 'Stepper-2_1',
    'sweep_gearbox_redone_1',
  ].map(part);
  const elbowParts = [
    '3rd_joint_bend-1', 'diff-assembly-pulleyupdate',
    'straight_bevel_pinion_iso-1_1', 'Biomed_Lock_Mechanism_V2_HT_20260815',
    'BevelGearShaftV2-1', 'BevelGearShaftV2-2', 'm3-12long-6', 'heatSetInsertm3-7',
  ].map(part);

  model.updateMatrixWorld(true);
  const originalParts = [...assembly.children];
  const homeBounds = new THREE.Box3().setFromObject(model);

  function createJoint(id: JointId, bearing: THREE.Object3D, parent: THREE.Object3D) {
    const origin = bearing.getWorldPosition(new THREE.Vector3());
    const worldAxis = new THREE.Vector3(0, 0, 1).transformDirection(bearing.matrixWorld);
    const axis = worldAxis.transformDirection(parent.matrixWorld.clone().invert());
    const pivot = new THREE.Group();
    pivot.name = `arm-joint-${id}`;
    pivot.position.copy(parent.worldToLocal(origin));
    parent.add(pivot);
    pivot.updateMatrixWorld(true);
    return { pivot, axis };
  }

  const base = createJoint('base', baseBearing, assembly);
  originalParts.filter(object => !fixedParts.has(object.name)).forEach(object => base.pivot.attach(object));

  const shoulder = createJoint('shoulder', shoulderBearing, base.pivot);
  [...shoulderParts, ...elbowParts].forEach(object => shoulder.pivot.attach(object));

  const elbow = createJoint('elbow', elbowBearing, shoulder.pivot);
  elbowParts.forEach(object => elbow.pivot.attach(object));

  const joints = { base, shoulder, elbow };
  const pose = { ...HOME_POSE };

  function setPose(next: ArmPose) {
    for (const joint of ARM_JOINTS) {
      const angle = Number.isFinite(next[joint.id]) ? next[joint.id] : 0;
      pose[joint.id] = THREE.MathUtils.clamp(angle, joint.min, joint.max);
      joints[joint.id].pivot.quaternion.setFromAxisAngle(
        joints[joint.id].axis, THREE.MathUtils.degToRad(pose[joint.id]),
      );
    }
    model.updateMatrixWorld(true);
  }

  const motionBounds = new THREE.Box3();
  for (const baseAngle of [-90, -45, 0, 45, 90]) {
    for (const shoulderAngle of [-20, 0, 15, 30]) {
      for (const elbowAngle of [-35, 0, 35]) {
        setPose({ base: baseAngle, shoulder: shoulderAngle, elbow: elbowAngle });
        motionBounds.union(new THREE.Box3().setFromObject(model));
      }
    }
  }
  setPose(HOME_POSE);

  return { joints, homeBounds, motionBounds, pose, setPose };
}

export type ArmRig = ReturnType<typeof createArmRig>;