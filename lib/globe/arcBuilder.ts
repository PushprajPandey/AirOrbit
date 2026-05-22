import type * as THREE from 'three';
import { sampleGreatCircle } from '@/lib/globe/greatCircle';

export function buildRouteArc(
  THREE_NS: typeof THREE,
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
  radius: number
): {
  tube: THREE.Mesh;
  curve: THREE.CatmullRomCurve3;
  dispose: () => void;
} {
  const points = sampleGreatCircle(lat1, lon1, lat2, lon2, 60, radius, 0.3);
  const vectors = points.map(
    (p) => new THREE_NS.Vector3(p.x, p.y, p.z)
  );
  const curve = new THREE_NS.CatmullRomCurve3(vectors);
  const geometry = new THREE_NS.TubeGeometry(curve, 60, 0.005, 8, false);
  const material = new THREE_NS.MeshBasicMaterial({ color: 0x0ea5e9 });
  const tube = new THREE_NS.Mesh(geometry, material);

  const dispose = () => {
    geometry.dispose();
    material.dispose();
  };

  return { tube, curve, dispose };
}
