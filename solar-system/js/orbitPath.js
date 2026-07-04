import * as THREE from "three";

// Construit une ligne d'orbite circulaire (approximation ; l'excentricité
// réelle est faible pour toutes les planètes et l'écart visuel est
// négligeable à cette échelle, sauf pour Mercure/Mars où il reste léger).
export function createOrbitLine(radius) {
  const curve = new THREE.EllipseCurve(0, 0, radius, radius, 0, Math.PI * 2, false, 0);
  const points2D = curve.getPoints(128);
  const points3D = points2D.map((p) => new THREE.Vector3(p.x, 0, p.y));

  const geometry = new THREE.BufferGeometry().setFromPoints(points3D);
  const material = new THREE.LineBasicMaterial({
    color: 0x555577,
    transparent: true,
    opacity: 0.4,
  });

  return new THREE.LineLoop(geometry, material);
}
