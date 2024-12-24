"use client";

import { useRef } from 'react';
import { Line, Sphere } from '@react-three/drei';
import { Vector3 } from 'three';
import { useFrame } from '@react-three/fiber';
import { createSatelliteOrbits, createSatelliteConnections } from '../lib/gnssUtils';
import SatelliteConnection from './SatelliteConnection';

export default function GNSSNetwork({ radius }: { radius: number }) {
  const satellitesRef = useRef<Vector3[][]>(createSatelliteOrbits(radius * 1.8));
  const connectionsRef = useRef(createSatelliteConnections(satellitesRef.current));
  const rotationRef = useRef(0);

  useFrame((_, delta) => {
    rotationRef.current += delta * 0.1;
  });

  return (
    <group rotation={[0, rotationRef.current, 0]}>
      {satellitesRef.current.map((orbit, orbitIndex) => (
        <group key={`orbit-${orbitIndex}`}>
          {/* Orbit path */}
          <Line
            points={orbit}
            color="#ffeb3b"
            lineWidth={0.5}
            transparent
            opacity={0.3}
          />
          {/* Satellites */}
          {orbit.map((pos, satIndex) => (
            <group key={`sat-${orbitIndex}-${satIndex}`} position={pos}>
              <Sphere args={[0.02, 8, 8]}>
                <meshBasicMaterial color="#ffeb3b" />
              </Sphere>
            </group>
          ))}
        </group>
      ))}

      {/* Inter-satellite connections */}
      {connectionsRef.current.map((connection, index) => (
        <SatelliteConnection
          key={`connection-${index}`}
          start={connection[0]}
          end={connection[1]}
          color="#ffeb3b"
        />
      ))}
    </group>
  );
}