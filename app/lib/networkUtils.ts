import { Vector3 } from 'three';

// Strategic infrastructure points based on major global hubs
const MAJOR_HUBS = [
  { lat: 40.7128, lng: -74.0060 }, // New York
  { lat: 51.5074, lng: -0.1278 },  // London
  { lat: 35.6762, lng: 139.6503 }, // Tokyo
  { lat: 22.3193, lng: 114.1694 }, // Hong Kong
  { lat: 1.3521, lng: 103.8198 },  // Singapore
  { lat: -33.8688, lng: 151.2093 }, // Sydney
  { lat: 52.5200, lng: 13.4050 },  // Berlin
  { lat: 25.2048, lng: 55.2708 },  // Dubai
];

export function createNetworkPoints(count: number, radius: number, type: 'energy' | 'cloud' | 'internet'): Vector3[] {
  const points: Vector3[] = [];
  
  // Add major hub points first
  MAJOR_HUBS.forEach(hub => {
    points.push(latLongToVector3(hub.lat, hub.lng, radius));
  });

  // Add additional distributed points
  while (points.length < count) {
    // Bias towards populated areas by limiting random generation
    const lat = (Math.random() * 140 - 70); // Avoid extreme poles
    const lng = Math.random() * 360 - 180;
    points.push(latLongToVector3(lat, lng, radius));
  }

  return points;
}

export function createOptimizedConnections(points: Vector3[], type: 'energy' | 'cloud' | 'internet'): [Vector3, Vector3][] {
  const connections: [Vector3, Vector3][] = [];
  const maxDistance = type === 'internet' ? 2 : (type === 'cloud' ? 1.5 : 1.2);

  points.forEach((point, i) => {
    // Connect to nearest points based on infrastructure type
    const maxConnections = type === 'internet' ? 4 : (type === 'cloud' ? 3 : 2);
    let connectionCount = 0;

    // Sort other points by distance
    const nearestPoints = points
      .map((target, index) => ({ target, index }))
      .filter(({ index }) => index !== i)
      .sort((a, b) => 
        point.distanceTo(a.target) - point.distanceTo(b.target)
      );

    // Connect to nearest points within maximum distance
    for (const { target } of nearestPoints) {
      if (connectionCount >= maxConnections) break;
      if (point.distanceTo(target) <= maxDistance) {
        connections.push([point, target]);
        connectionCount++;
      }
    }
  });

  return connections;
}

export function latLongToVector3(lat: number, lng: number, radius: number): Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new Vector3(x, y, z);
}