"use client";

import { Html } from '@react-three/drei';
import { useEffect, useState } from 'react';
import { Vector3 } from 'three';
import { CountryFeature } from '../lib/types';
import { latLongToVector3 } from '../lib/networkUtils';

interface CountryLabelsProps {
  radius: number;
}

export default function CountryLabels({ radius }: CountryLabelsProps) {
  const [majorCountries, setMajorCountries] = useState<{ name: string; position: Vector3 }[]>([]);

  useEffect(() => {
    // Only show labels for major countries to avoid cluttering
    const importantLocations = [
      { name: "USA", lat: 39.8283, lng: -98.5795 },
      { name: "China", lat: 35.8617, lng: 104.1954 },
      { name: "India", lat: 20.5937, lng: 78.9629 },
      { name: "Russia", lat: 61.5240, lng: 105.3188 },
      { name: "Brazil", lat: -14.2350, lng: -51.9253 },
      { name: "Germany", lat: 51.1657, lng: 10.4515 }
    ];

    const positions = importantLocations.map(loc => ({
      name: loc.name,
      position: latLongToVector3(loc.lat, loc.lng, radius * 1.1)
    }));

    setMajorCountries(positions);
  }, [radius]);

  return (
    <group>
      {majorCountries.map((country, index) => (
        <Html
          key={index}
          position={country.position}
          center
          style={{
            backgroundColor: 'rgba(0,0,0,0.7)',
            padding: '2px 6px',
            borderRadius: '4px',
            fontSize: '10px',
            color: 'white',
            pointerEvents: 'none'
          }}
        >
          {country.name}
        </Html>
      ))}
    </group>
  );
}