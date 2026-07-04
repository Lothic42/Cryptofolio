import * as THREE from "three";

export function createStarfield(count, radius) {
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    // Distribution uniforme sur une coquille sphérique.
    const u = Math.random();
    const v = Math.random();
    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);
    const r = radius * (0.8 + Math.random() * 0.2);

    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 1.5,
    sizeAttenuation: false,
  });

  return new THREE.Points(geometry, material);
}
