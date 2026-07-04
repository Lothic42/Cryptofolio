import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { SUN, PLANETS } from "./planets.js";
import { createSun, createPlanet } from "./celestialBody.js";
import { createStarfield } from "./starfield.js";
import { createSimState, setupSpeedControls, setupPlanetPicking } from "./ui.js";
import {
  CAMERA_FOV,
  CAMERA_NEAR,
  CAMERA_FAR,
  CAMERA_INITIAL_POSITION,
  CONTROLS_MIN_DISTANCE,
  CONTROLS_MAX_DISTANCE,
  STAR_COUNT,
  STAR_FIELD_RADIUS,
} from "./config.js";

const canvasContainer = document.getElementById("scene-container");

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  CAMERA_FOV,
  window.innerWidth / window.innerHeight,
  CAMERA_NEAR,
  CAMERA_FAR
);
camera.position.set(
  CAMERA_INITIAL_POSITION.x,
  CAMERA_INITIAL_POSITION.y,
  CAMERA_INITIAL_POSITION.z
);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
canvasContainer.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enablePan = true;
controls.screenSpacePanning = true;
controls.minDistance = CONTROLS_MIN_DISTANCE;
controls.maxDistance = CONTROLS_MAX_DISTANCE;
controls.target.set(0, 0, 0);

// Éclairage : le Soleil est la source de lumière de la scène. Un decay
// faible évite que les planètes lointaines (Neptune) soient invisibles,
// contrairement à une atténuation physique réaliste en carré inverse.
const sunLight = new THREE.PointLight(0xffffff, 3, 0, 0.6);
sunLight.position.set(0, 0, 0);
scene.add(sunLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);

const sunMesh = createSun(SUN);
scene.add(sunMesh);

const starfield = createStarfield(STAR_COUNT, STAR_FIELD_RADIUS);
scene.add(starfield);

const bodies = PLANETS.map((data, index) => createPlanet(data, index, PLANETS.length));
bodies.forEach((body) => {
  scene.add(body.orbitGroup);
  scene.add(body.orbitLine);
});

const simState = createSimState();
setupSpeedControls(simState);
setupPlanetPicking({ camera, renderer, bodies, sun: sunMesh });

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const realDeltaSeconds = clock.getDelta();
  if (!simState.paused) {
    simState.simClockDays += simState.simDaysPerSecond * realDeltaSeconds;
  }

  bodies.forEach((body) => body.update(simState.simClockDays));

  controls.update();
  renderer.render(scene, camera);
}

animate();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
