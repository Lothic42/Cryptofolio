import * as THREE from "three";
import {
  DEFAULT_SIM_DAYS_PER_SECOND,
  MIN_SIM_DAYS_PER_SECOND,
  MAX_SIM_DAYS_PER_SECOND,
  SIM_SPEED_STEP,
} from "./config.js";

export function createSimState() {
  return {
    simDaysPerSecond: DEFAULT_SIM_DAYS_PER_SECOND,
    paused: false,
    simClockDays: 0,
  };
}

export function setupSpeedControls(simState) {
  const slider = document.getElementById("speed-slider");
  const speedLabel = document.getElementById("speed-value");
  const pauseButton = document.getElementById("pause-toggle");

  slider.min = String(MIN_SIM_DAYS_PER_SECOND);
  slider.max = String(MAX_SIM_DAYS_PER_SECOND);
  slider.step = String(SIM_SPEED_STEP);
  slider.value = String(simState.simDaysPerSecond);
  speedLabel.textContent = simState.simDaysPerSecond.toFixed(1);

  slider.addEventListener("input", () => {
    simState.simDaysPerSecond = parseFloat(slider.value);
    speedLabel.textContent = simState.simDaysPerSecond.toFixed(1);
  });

  pauseButton.addEventListener("click", () => {
    simState.paused = !simState.paused;
    pauseButton.textContent = simState.paused ? "Lecture" : "Pause";
  });
}

export function setupPlanetPicking({ camera, renderer, bodies, sun }) {
  const infoPanel = document.getElementById("info-panel");
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const pickableMeshes = [sun, ...bodies.map((b) => b.mesh)];

  renderer.domElement.addEventListener("click", (event) => {
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(pointer, camera);
    const intersections = raycaster.intersectObjects(pickableMeshes, false);

    if (intersections.length === 0) {
      infoPanel.classList.add("hidden");
      return;
    }

    const hitMesh = intersections[0].object;

    if (hitMesh === sun) {
      infoPanel.innerHTML = `<h3>Soleil</h3><p>Rayon : 696 000 km</p>`;
      infoPanel.classList.remove("hidden");
      return;
    }

    const body = bodies.find((b) => b.mesh === hitMesh);
    if (body) {
      const d = body.data;
      infoPanel.innerHTML = `
        <h3>${d.name}</h3>
        <p>Rayon : ${d.radiusKm.toLocaleString("fr-FR")} km</p>
        <p>Distance au Soleil : ${d.distanceKm1e6.toLocaleString("fr-FR")} millions de km</p>
        <p>Période orbitale : ${d.orbitalPeriodDays.toLocaleString("fr-FR")} jours</p>
        <p>Période de rotation : ${Math.abs(d.rotationPeriodHours).toLocaleString("fr-FR")} h${
        d.rotationPeriodHours < 0 ? " (rétrograde)" : ""
      }</p>
      `;
      infoPanel.classList.remove("hidden");
    }
  });
}
