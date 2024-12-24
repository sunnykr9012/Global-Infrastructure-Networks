import { Vector3 } from 'three';

interface OrbitConfig {
  satellites: number;
  inclination: number;
  phase: number;
}

const GNSS_CONSTELLATIONS: OrbitConfig[] = [
  { satellites: 8, inclination: 55, phase: 0 },    // GPS
  { satellites: 6, inclination: 64.8, phase: 120 }, // GLONASS
  { satellites: 6, inclination: 56, phase: 240 },   // Galileo
  { satellites: 7, inclination: 55.5, phase: 180 }, // BeiDou
];

export function createSatelliteOrbits(orbitRadius: number): Vector3[][] {
  const orbits: Vector3[][] = [];

  GNSS_CONSTELLATIONS.forEach(({ satellites, inclination, phase }) => {
    const orbit: Vector3[] = [];
    const points = 50; // Points per orbit for smooth visualization

    for (let i = 0; i < points; i++) {
      const angle = (i / points) * Math.PI * 2;
      const x = orbitRadius * Math.cos(angle);
      const y = orbitRadius * Math.sin(angle) * Math.sin(inclination * Math.PI / 180);
      const z = orbitRadius * Math.sin(angle) * Math.cos(inclination * Math.PI / 180);
      
      const position = new Vector3(x, y, z);
      position.applyAxisAngle(new Vector3(0, 1, 0), phase * Math.PI / 180);
      orbit.push(position);
    }
    orbits.push(orbit);
  });

  return orbits;
}

export function createSatelliteConnections(orbits: Vector3[][]): [Vector3, Vector3][] {
  const connections: [Vector3, Vector3][] = [];
  const allSatellites: Vector3[] = orbits.flat();

  allSatellites.forEach((satellite, i) => {
    // Find nearest satellites for connections
    const nearestSatellites = allSatellites
      .map((target, index) => ({ target, index }))
      .filter(({ index }) => index !== i)
      .sort((a, b) => 
        satellite.distanceTo(a.target) - satellite.distanceTo(b.target)
      )
      .slice(0, 3); // Connect to 3 nearest satellites

    nearestSatellites.forEach(({ target }) => {
      // Avoid duplicate connections
      const connectionExists = connections.some(([start, end]) => 
        (start.equals(satellite) && end.equals(target)) ||
        (start.equals(target) && end.equals(satellite))
      );

      if (!connectionExists && satellite.distanceTo(target) < 2) {
        connections.push([satellite, target]);
      }
    });
  });

  return connections;
}