"use client";

import { useRef, useEffect } from 'react';
import { Line, Points, Point } from '@react-three/drei';
import { Vector3, Points as ThreePoints } from 'three';
import { useFrame } from '@react-three/fiber';
import { createFlowingPoints } from '../lib/animationUtils';

interface NetworkConnectionProps {
  start: Vector3;
  end: Vector3;
  color: string;
  type: 'energy' | 'cloud' | 'internet';
}

export default function NetworkConnection({ start, end, color, type }: NetworkConnectionProps) {
  const pointsRef = useRef<ThreePoints>(null);
  const flowRef = useRef<Vector3[]>(createFlowingPoints(start, end));
  const progressRef = useRef(0);
  const pointPositions = useRef<Vector3[]>(Array(8).fill(null).map(() => new Vector3()));
  
  useFrame((state, delta) => {
    if (pointsRef.current && pointsRef.current.geometry.attributes.position) {
      progressRef.current = (progressRef.current + delta * (type === 'internet' ? 0.5 : 0.3)) % 1;
      
      pointPositions.current.forEach((point, index) => {
        const t = (progressRef.current + index / pointPositions.current.length) % 1;
        const flowIndex = Math.floor(t * flowRef.current.length);
        if (flowRef.current[flowIndex]) {
          point.copy(flowRef.current[flowIndex]);
        }
      });

      // Update positions in geometry
      const positions = pointsRef.current.geometry.attributes.position;
      pointPositions.current.forEach((point, i) => {
        positions.setXYZ(i, point.x, point.y, point.z);
      });
      positions.needsUpdate = true;
    }
  });

  return (
    <group>
      <Line
        points={[start, end]}
        color={color}
        lineWidth={1}
        transparent
        opacity={0.3}
      />
      <Points ref={pointsRef}>
        <pointsMaterial
          size={0.02}
          color={color}
          transparent
          opacity={0.8}
          sizeAttenuation
        />
        {pointPositions.current.map((_, i) => (
          <Point key={i} position={[0, 0, 0]} />
        ))}
      </Points>
    </group>
  );
}