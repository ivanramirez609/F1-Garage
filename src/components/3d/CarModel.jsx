import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useTexture, Decal } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { getBrandAssets } from '../../utils/brandMapping';

const LogoDecals = ({ logoUrl }) => {
  if (!logoUrl) return null;
  const texture = useTexture(logoUrl);
  return (
    <>
      <Decal position={[0.7, 0.4, 0]} rotation={[0, Math.PI / 2, 0]} scale={[0.8, 0.4, 1]} map={texture} />
      <Decal position={[-0.7, 0.4, 0]} rotation={[0, -Math.PI / 2, 0]} scale={[0.8, 0.4, 1]} map={texture} />
      <Decal position={[0, 0.7, 1.3]} rotation={[-Math.PI / 8, 0, 0]} scale={[0.6, 0.3, 1]} map={texture} />
    </>
  );
};

const getCarConfig = (carId, isGoogley) => {
  switch (carId) {
    case '1988 MP4/4':
      return {
        chassisColor: '#ffffff', // White base
        wingColor: '#ee1111',   // Red accents
        scale: 1.0,
        modelPath: '/models/mclaren.glb',
      };
    case '1998 MP4/13':
      return {
        chassisColor: '#c0c0c0', // Silver
        wingColor: '#111111',   // Black accents
        scale: 1.1,
        modelPath: '/models/mclaren.glb',
      };
    case '2008 MP4-23':
      return {
        chassisColor: '#dddddd', // Chrome-like
        wingColor: '#cc0000',   // Red Vodafone accents
        scale: 1.15,
        modelPath: '/models/mclaren.glb',
      };
    case 'Yardley McLaren M23':
      return {
        chassisColor: '#ffffff', // White base
        wingColor: '#ee1111',   // Red accents
        scale: 2,
        modelPath: isGoogley ? '/models/Yardley_Mclaren_1970_Google.glb' : '/models/Yardley_McLaren_1970.glb',
      };
    case 'McLaren-Mercedes MP4/10':
      return {
        chassisColor: '#ff0000', // Red
        wingColor: '#ffffff',   // White
        scale: 2,
        modelPath: isGoogley ? '/models/McLaren_1980_Google.glb' : '/models/McLaren_1980.glb',
      };
    case 'McLaren MP4-13':
      return {
        chassisColor: '#ffffff', // White base
        wingColor: '#ff0000',   // Red accents
        scale: 2,
        modelPath: isGoogley ? '/models/McLaren_1990_Google.glb' : '/models/Mclaren_1990.glb',
      };
    case '2025 MCL38':
    case '2024 MCL38':
    default:
      return {
        chassisColor: '#ff8000', // Papaya orange
        wingColor: '#111111',   // Carbon fiber black
        scale: 1.25,
        modelPath: '/models/mclaren.glb',
      };
  }
};

const MclarenModel = ({ isExploded, carId, companyName }) => {
  const groupRef = useRef();
  const meshRef = useRef();
  
  const isGoogley = companyName && companyName.toLowerCase().trim() === 'google';
  const config = getCarConfig(carId, isGoogley);
  
  const { color, logoUrl } = getBrandAssets(companyName);

  // Load the appropriate GLTF model
  const { scene, nodes } = useGLTF(config.modelPath);

  useEffect(() => {
    if (meshRef.current) {
      if (isExploded) {
        // Animate elevation and give it a subtle hover spin
        gsap.to(meshRef.current.position, {
          y: 1.5,
          duration: 1.5,
          ease: "back.out(1.2)",
          overwrite: "auto"
        });
        gsap.to(meshRef.current.rotation, {
          y: "+=0.3",
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });
      } else {
        // Return to normal resting position
        gsap.to(meshRef.current.position, {
          y: 0,
          duration: 1,
          ease: "back.out(1.2)",
          overwrite: "auto"
        });
        gsap.to(meshRef.current.rotation, {
          x: 0, y: 0, z: 0,
          duration: 1,
          ease: "power2.out",
          overwrite: "auto"
        });
      }
    }
  }, [isExploded]);

  useFrame((state) => {
    // Subtle idle floating animation when fully assembled
      if (groupRef.current && !isExploded) {
          groupRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.05;
      }
  });

  if (carId === 'Yardley McLaren M23' || carId === 'McLaren-Mercedes MP4/10' || carId === 'McLaren MP4-13') {
    return (
      <group ref={groupRef} scale={config.scale}>
        <primitive object={scene} />
      </group>
    );
  }

  return (
    <group ref={groupRef} scale={config.scale}>
      <mesh ref={meshRef} geometry={nodes.Mesh10.geometry} position={[0, -0.5, 0]}>
        {/* Apply dynamic brand color */}
        <meshStandardMaterial color={color} metalness={0.7} roughness={0.2} />
        <LogoDecals logoUrl={logoUrl} />
      </mesh>
    </group>
  );
};

export function CarModel({ carId, isExploded, companyName }) {
  return <MclarenModel isExploded={isExploded} carId={carId} companyName={companyName} />;
}

useGLTF.preload('/models/mclaren.glb');
useGLTF.preload('/models/Yardley_McLaren_1970.glb');
useGLTF.preload('/models/McLaren_1980.glb');
useGLTF.preload('/models/Mclaren_1990.glb');
useGLTF.preload('/models/Yardley_Mclaren_1970_Google.glb');
useGLTF.preload('/models/McLaren_1980_Google.glb');
useGLTF.preload('/models/McLaren_1990_Google.glb');
