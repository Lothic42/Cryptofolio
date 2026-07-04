import * as THREE from "three";
import { DIST_SCALE, PLANET_RADIUS_SCALE, SUN_RADIUS_SCALE } from "./config.js";
import { createOrbitLine } from "./orbitPath.js";

export function createSun(sunData) {
  const radius = sunData.radiusKm * SUN_RADIUS_SCALE;
  const geometry = new THREE.SphereGeometry(radius, 48, 48);
  const material = new THREE.MeshBasicMaterial({ color: sunData.color });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = sunData.name;
  return mesh;
}

// Crée une planète avec sa hiérarchie de groupes :
// orbitGroup (position orbitale, tourne autour du Soleil)
//   -> tiltGroup (inclinaison axiale fixe)
//        -> mesh (le spin de la planète est appliqué directement sur son rotation.y)
export function createPlanet(data, index, totalCount) {
  const scaledRadius = data.radiusKm * PLANET_RADIUS_SCALE;
  const scaledDistance = data.distanceKm1e6 * DIST_SCALE;

  const geometry = new THREE.SphereGeometry(scaledRadius, 32, 32);
  const material = new THREE.MeshStandardMaterial({ color: data.color, roughness: 1 });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = data.name;

  const tiltGroup = new THREE.Group();
  tiltGroup.rotation.z = THREE.MathUtils.degToRad(data.axialTiltDeg);
  tiltGroup.add(mesh);

  const orbitGroup = new THREE.Group();
  orbitGroup.add(tiltGroup);

  const orbitLine = createOrbitLine(scaledDistance);

  // Phases initiales réparties uniformément pour éviter un alignement de
  // départ purement cosmétique, sans effet sur les vitesses relatives.
  const initialPhase = (index / totalCount) * Math.PI * 2;

  return {
    data,
    mesh,
    tiltGroup,
    orbitGroup,
    orbitLine,
    scaledDistance,
    initialPhase,
    update(simClockDays) {
      const orbitAngle = initialPhase + (Math.PI * 2 * simClockDays) / data.orbitalPeriodDays;
      orbitGroup.position.x = Math.cos(orbitAngle) * scaledDistance;
      orbitGroup.position.z = Math.sin(orbitAngle) * scaledDistance;

      const simClockHours = simClockDays * 24;
      const spinAngle = (Math.PI * 2 * simClockHours) / data.rotationPeriodHours;
      mesh.rotation.y = spinAngle;
    },
  };
}
