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

  const pauseLabel = document.getElementById("pause-label");
  const pauseIcon = document.getElementById("pause-icon");

  pauseButton.addEventListener("click", () => {
    simState.paused = !simState.paused;
    pauseLabel.textContent = simState.paused ? "Lecture" : "Pause";
    pauseIcon.innerHTML = simState.paused ? "&#9654;" : "&#10073;&#10073;";
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
      infoPanel.innerHTML = factCard("Soleil", [["Rayon", "696 000 km"]]);
      infoPanel.classList.remove("hidden");
      return;
    }

    const body = bodies.find((b) => b.mesh === hitMesh);
    if (body) {
      const d = body.data;
      infoPanel.innerHTML = factCard(d.name, [
        ["Rayon", `${d.radiusKm.toLocaleString("fr-FR")} km`],
        ["Distance au Soleil", `${d.distanceKm1e6.toLocaleString("fr-FR")} millions de km`],
        ["Période orbitale", `${d.orbitalPeriodDays.toLocaleString("fr-FR")} j`],
        [
          "Rotation",
          `${Math.abs(d.rotationPeriodHours).toLocaleString("fr-FR")} h${
            d.rotationPeriodHours < 0 ? " (rétrograde)" : ""
          }`,
        ],
      ]);
      infoPanel.classList.remove("hidden");
    }
  });
}

function factCard(name, facts) {
  const rows = facts
    .map(([label, value]) => `<div class="fact"><dt>${label}</dt><dd>${value}</dd></div>`)
    .join("");
  return `<p class="eyebrow">Fiche</p><h3>${name}</h3><dl class="fact-list">${rows}</dl>`;
}
