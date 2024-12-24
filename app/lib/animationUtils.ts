import { Vector3 } from 'three';

export function interpolatePoints(start: Vector3, end: Vector3, steps: number): Vector3[] {
  const points: Vector3[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    // Add slight curve to the path
    const mid = new Vector3().lerpVectors(start, end, 0.5);
    const height = start.distanceTo(end) * 0.15; // Increased curve height
    mid.add(new Vector3(0, height, 0));
    
    if (t < 0.5) {
      const p = new Vector3().lerpVectors(start, mid, t * 2);
      points.push(p);
    } else {
      const p = new Vector3().lerpVectors(mid, end, (t - 0.5) * 2);
      points.push(p);
    }
  }
  return points;
}

export function createFlowingPoints(start: Vector3, end: Vector3): Vector3[] {
  return interpolatePoints(start, end, 20); // Increased steps for smoother animation
}