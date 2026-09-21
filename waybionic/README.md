This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Arm Viewer Prototype

The home page mission section uses the September 21, 2026 CAD export at
`public/models/mechanical_arm-09-21-26.glb`. The original export is unchanged.
Open [the local arm viewer](http://127.0.0.1:3000/#mission) after starting the app.

- **Play demo / Pause demo:** start or pause a repeating 15-second motion sequence.
- **Joints:** adjust base, shoulder, and elbow with mouse, touch, or keyboard. Manual input pauses the demo.
- **Reset:** restore the exported pose and default camera.
- **View controls:** drag to orbit, use the zoom buttons, or expand to fullscreen. Normal mouse-wheel input scrolls the page; Ctrl/Cmd-wheel zooms the model. Fullscreen also supports unmodified wheel zoom.

The viewer reuses Three.js, GLTFLoader, and OrbitControls. It loads the model near
the viewport and renders only while the pose or camera changes, pausing offscreen
and in hidden tabs. The camera fits the current pose on load and resize, then
smoothly reframes during joint movement. Manual orbit or zoom keeps the user's
view until another pose command or reset. Loading failures and lost WebGL
contexts provide a reload action.

The home hero fills the dynamic viewport below the fixed navbar, with its artwork
also constrained by available height for landscape phones. The mission layout
stacks below 900px and expands on wider screens. Canvas height follows the viewport
instead of a fixed desktop size, and viewer buttons have 44px touch targets.

`src/app/components/armRig.ts` groups the existing CAD parts around the exported
bearing origins and axes; it does not deform or replace the meshes. The sliders
are offsets from the exported pose: base -90 to 90 degrees, shoulder -20 to 30,
and elbow -35 to 35. These are **illustrative prototype ranges**, not verified
mechanical limits. SolidWorks mates, collision detection, motor constraints,
wrist articulation, and hardware control are not implemented.

Run the asset-based tests with Node 22.18+ (verified locally on Node 24):

```bash
npm run test:arm
npx tsc --noEmit
npm run build
```

The tests check mesh preservation, connected pivots, reset, bounded input, demo
continuity, the motion envelope, and portrait/landscape camera framing against the
actual GLB. Browser checks cover 320, 390, 768, 1440, and 2560px layouts, touch
sliders, orientation changes, hero boundaries, and rendered motion without clipping.
Also check orbit/zoom, fullscreen, page scrolling, and model-download recovery.

## About Page Content

The About page combines the existing CAD viewer with the mission, assembly
descriptions, engineering themes, and two public project links. Sections are
content-sized rather than inheriting the site's full-screen section minimum.
The source content was checked on September 21, 2026:

- [WayBionic public profile](https://github.com/Waybionic/.github/blob/main/profile/README.md): Calgary-based student team, mission, and research priorities.
- [Ground-station README](https://github.com/Waybionic/waybionic_ground_station/blob/main/README.md) and [build instructions](https://github.com/Waybionic/waybionic_ground_station/blob/main/BuildInstructions.md): ROS 2 description/bringup packages, placeholder model, RViz, and joint-state visualization.
- [Stepper motor sketch](https://github.com/Waybionic/StepperMotors/blob/main/4_stepper.ino): exploratory joystick, stepper, and speed-control code, not a validated controller.
- The supplied September 2026 GLB: hardware assembly descriptions. The design and public software model are separate artifacts, not an integrated clinical system.

Repository summaries are static editorial content, not live GitHub status. Update
the wording and snapshot date together as the public projects develop.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
