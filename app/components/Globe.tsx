"use client";

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';
import CountryOutlines from './CountryOutlines';
import CountryLabels from './CountryLabels';
import NetworkConnection from './NetworkConnection';
import GNSSNetwork from './GNSSNetwork';
import { createNetworkPoints, createOptimizedConnections } from '../lib/networkUtils';

const GLOBE_RADIUS = 1;
const GRID_POINTS = 40;
const CLOUD_POINTS = 30;
const INTERNET_POINTS = 50;

export default function Globe() {
  const globeRef = useRef<THREE.Mesh>(null);
  
  const energyPointsRef = useRef(createNetworkPoints(GRID_POINTS, GLOBE_RADIUS * 1.1, 'energy'));
  const cloudPointsRef = useRef(createNetworkPoints(CLOUD_POINTS, GLOBE_RADIUS * 1.2, 'cloud'));
  const internetPointsRef = useRef(createNetworkPoints(INTERNET_POINTS, GLOBE_RADIUS * 1.15, 'internet'));

  const energyConnectionsRef = useRef(createOptimizedConnections(energyPointsRef.current, 'energy'));
  const cloudConnectionsRef = useRef(createOptimizedConnections(cloudPointsRef.current, 'cloud'));
  const internetConnectionsRef = useRef(createOptimizedConnections(internetPointsRef.current, 'internet'));

  useFrame((state, delta) => {
    if (globeRef.current) {
      globeRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <group>
      <Sphere ref={globeRef} args={[GLOBE_RADIUS, 64, 64]}>
        <meshPhongMaterial
          color="#1a237e"
          transparent
          opacity={0.8}
          wireframe
        />
      </Sphere>

      <CountryOutlines radius={GLOBE_RADIUS} />
      <CountryLabels radius={GLOBE_RADIUS} />
      <GNSSNetwork radius={GLOBE_RADIUS} />

      {/* Network Connections */}
      {[
        { connections: energyConnectionsRef.current, color: "#f44336", type: "energy" },
        { connections: cloudConnectionsRef.current, color: "#4caf50", type: "cloud" },
        { connections: internetConnectionsRef.current, color: "#2196f3", type: "internet" }
      ].map(({ connections, color, type }) => 
        connections.map((connection, index) => (
          <NetworkConnection
            key={`${type}-${index}`}
            start={connection[0]}
            end={connection[1]}
            color={color}
            type={type as 'energy' | 'cloud' | 'internet'}
          />
        ))
      )}
    </group>
  );
}