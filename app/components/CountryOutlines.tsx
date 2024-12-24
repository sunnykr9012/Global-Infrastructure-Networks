"use client";

import { useEffect, useState } from 'react';
import { Line } from '@react-three/drei';
import { CountryData, CountryFeature } from '../lib/types';
import { processCountryCoordinates } from '../lib/countryUtils';

interface CountryOutlinesProps {
  radius: number;
}

export default function CountryOutlines({ radius }: CountryOutlinesProps) {
  const [countries, setCountries] = useState<CountryFeature[]>([]);

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson')
      .then(res => res.json())
      .then((data: CountryData) => {
        const features = data.features.map(feature => ({
          coordinates: feature.geometry.coordinates,
          name: feature.properties.name
        }));
        setCountries(features);
      });
  }, []);

  return (
    <group>
      {countries.map((country, countryIndex) => (
        country.coordinates.map((polygon, polygonIndex) => {
          const points = processCountryCoordinates([polygon], radius)[0];
          return (
            <Line
              key={`${countryIndex}-${polygonIndex}`}
              points={points}
              color="#ffffff"
              lineWidth={0.5}
              transparent
              opacity={0.3}
            />
          );
        })
      ))}
    </group>
  );
}