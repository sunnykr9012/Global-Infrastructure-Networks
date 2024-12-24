"use client";

import { useRef } from 'react';
import { Points, Point } from '@react-three/drei';
import { Vector3, Points as ThreePoints } from 'three';
import { useFrame } from '@react-three/fiber';
import { createFlowingPoints } from '../lib/animationUtils';

interface SatelliteConnectionProps {
  start: Vector3;
  end: Vector3;
  color: string;
}

export default function SatelliteConnection({ start, end, color }: SatelliteConnectionProps) {
  const pointsRef = useRef<ThreePoints>(null);
  const flowRef = useRef<Vector3[]>(createFlowingPoints(start, end));
  const progressRef = useRef(0);
  const pointPositions = useRef<Vector3[]>(Array(12).fill(null).map(() => new Vector3()));

  useFrame((_, delta) => {
    if (pointsRef.current && pointsRef.current.geometry.attributes.position) {
      progressRef.current = (progressRef.current + delta * 0.4) % 1;

      pointPositions.current.forEach((point, index) => {
        const t = (progressRef.current + index / pointPositions.current.length) % 1;
        const flowIndex = Math.floor(t * flowRef.current.length);
        if (flowRef.current[flowIndex]) {
          point.copy(flowRef.current[flowIndex]);
        }
      });

      const positions = pointsRef.current.geometry.attributes.position;
      pointPositions.current.forEach((point, i) => {
        positions.setXYZ(i, point.x, point.y, point.z);
      });
      positions.needsUpdate = true;
    }
  });

  return (
    <Points ref={pointsRef}>
      <pointsMaterial
        size={0.015}
        color={color}
        transparent
        opacity={0.8}
        sizeAttenuation
      />
      {pointPositions.current.map((_, i) => (
        <Point key={i} position={[0, 0, 0]} />
      ))}
    </Points>
  );
}