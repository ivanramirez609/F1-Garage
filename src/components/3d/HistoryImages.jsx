import { Image } from '@react-three/drei';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function HistoryImages({ carId }) {
  const groupRef = useRef();

  if (carId !== 'McLaren-Mercedes MP4/10') {
      return null;
  }

  const images = [
    { url: '/images/mp4_10/image1.jpg', position: [-3, 2, -2], rotation: [0, Math.PI / 6, 0] },
    { url: '/images/mp4_10/image2.jpg', position: [3, 2, -2], rotation: [0, -Math.PI / 6, 0] },
    { url: '/images/mp4_10/image3.jpg', position: [-4, 1.5, 2], rotation: [0, Math.PI / 6, 0] },
    { url: '/images/mp4_10/image4.jpg', position: [4, 1.5, 2], rotation: [0, -Math.PI / 6, 0] },
  ];

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (groupRef.current) {
        groupRef.current.children.forEach((child, i) => {
          if (images[i]) {
            const originalPos = images[i].position;
            child.position.y = originalPos[1] + Math.sin(time + i * 1.5) * 0.1;
          }
        });
    }
  });

  return (
    <group ref={groupRef}>
      {images.map((img, i) => (
        <Image 
          key={i}
          url={img.url}
          position={img.position}
          rotation={img.rotation}
          scale={[2.5, 2, 1]} // Slightly larger
          transparent
          opacity={0.8}
        />
      ))}
    </group>
  );
}
