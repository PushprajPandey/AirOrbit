export function latLonToVector3(
  lat: number,
  lon: number,
  radius: number
): { x: number; y: number; z: number } {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lon + 180) * Math.PI) / 180;
  return {
    x: -(radius * Math.sin(phi) * Math.cos(theta)),
    z: radius * Math.sin(phi) * Math.sin(theta),
    y: radius * Math.cos(phi),
  };
}

export function sampleGreatCircle(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
  segments: number,
  radius: number,
  arcHeight: number
): { x: number; y: number; z: number }[] {
  const points: { x: number; y: number; z: number }[] = [];
  const toRad = (d: number) => (d * Math.PI) / 180;
  const toDeg = (r: number) => (r * 180) / Math.PI;

  const φ1 = toRad(lat1);
  const λ1 = toRad(lon1);
  const φ2 = toRad(lat2);
  const λ2 = toRad(lon2);

  const Δ =
    2 *
    Math.asin(
      Math.sqrt(
        Math.sin((φ2 - φ1) / 2) ** 2 +
          Math.cos(φ1) * Math.cos(φ2) * Math.sin((λ2 - λ1) / 2) ** 2
      )
    );

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const A = Math.sin((1 - t) * Δ) / Math.sin(Δ);
    const B = Math.sin(t * Δ) / Math.sin(Δ);
    const x = A * Math.cos(φ1) * Math.cos(λ1) + B * Math.cos(φ2) * Math.cos(λ2);
    const y = A * Math.cos(φ1) * Math.sin(λ1) + B * Math.cos(φ2) * Math.sin(λ2);
    const z = A * Math.sin(φ1) + B * Math.sin(φ2);
    const φ = Math.atan2(z, Math.sqrt(x * x + y * y));
    const λ = Math.atan2(y, x);
    const lift = Math.sin(t * Math.PI) * arcHeight;
    const v = latLonToVector3(toDeg(φ), toDeg(λ), radius + lift);
    points.push(v);
  }

  return points;
}
