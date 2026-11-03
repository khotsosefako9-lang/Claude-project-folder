# Vendored browser libraries

Pinned copies so HyperFrames compositions load them from project files (renders make no network fetches).
Versions match `package.json`; refresh with `npm install` then re-copy.

| Library | Version | Files | Load with |
| --- | --- | --- | --- |
| [Three.js](https://github.com/mrdoob/three.js) | 0.187.0 | `three/three.module.js`, `three/three.core.js` | `import * as THREE from "./lib/three/three.module.js";` |
| [mo·js](https://github.com/mojs/mojs) (`@mojs/core`) | 1.7.1 | `mojs/mo.umd.js` | `<script src="lib/mojs/mo.umd.js"></script>` inside `<body>` → global `mojs` |

Three.js addons (OrbitControls, GLTFLoader, …) are in `node_modules/three/examples/jsm/`; copy the ones a video needs into `lib/three/addons/`.

In HyperFrames, neither library may run on its own clock: drive Three.js from an `hf-seek` listener (`e.detail.time`), and create mo·js tweens/timelines paused and set their progress from that time instead of calling `play()`.
