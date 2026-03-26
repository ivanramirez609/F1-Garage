import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Decal, useTexture } from '@react-three/drei';
import logoImg from '../../assets/logo.png';
import * as THREE from 'three';
import gsap from 'gsap';

const getCarConfig = (carId) => {
  switch (carId) {
    case '1988 MP4/4':
      return {
        chassisColor: '#ffffff', // White base
        wingColor: '#ee1111',   // Red accents
        scale: 1.0,
        chassisSize: [1.6, 0.4, 3.8],
        frontWingSize: [2.8, 0.05, 0.6],
        rearWingSize: [2.6, 0.05, 0.7],
      };
    case '1998 MP4/13':
      return {
        chassisColor: '#c0c0c0', // Silver
        wingColor: '#111111',   // Black accents
        scale: 1.1,
        chassisSize: [1.4, 0.45, 4.0], // Narrow track
        frontWingSize: [2.0, 0.1, 0.7],
        rearWingSize: [1.8, 0.1, 0.8],
      };
    case '2008 MP4-23':
      return {
        chassisColor: '#dddddd', // Chrome-like
        wingColor: '#cc0000',   // Red Vodafone accents
        scale: 1.15,
        chassisSize: [1.4, 0.5, 4.2],
        frontWingSize: [2.4, 0.1, 0.9], // Complex aero
        rearWingSize: [2.0, 0.2, 0.8],
      };
    case '2024 MCL38':
    default:
      return {
        chassisColor: '#ff8000', // Papaya orange
        wingColor: '#111111',   // Carbon fiber black
        scale: 1.25, // Much larger modern cars
        chassisSize: [1.6, 0.5, 4.8],
        frontWingSize: [2.6, 0.1, 1.0],
        rearWingSize: [2.2, 0.2, 1.0],
      };
  }
};

const PlaceholderCar = ({ isExploded, carId, company }) => {
  const groupRef = useRef();
  
  const chassisRef = useRef();
  const frontWingRef = useRef();
  const rearWingRef = useRef();
  const engineRef = useRef();
  const wheelFLRef = useRef();
  const wheelFRRef = useRef();
  const wheelRLRef = useRef();
  const wheelRRRef = useRef();
  const [aiColors, setAiColors] = useState(null);
  const defaultLogoTexture = useTexture(logoImg);
  const [dynamicLogo, setDynamicLogo] = useState(null);

  const config = getCarConfig(carId);

  const normalizedCompany = company ? company.toLowerCase().trim() : '';
  let chassisColor = config.chassisColor;
  let wingColor = config.wingColor;

  useEffect(() => {
    if (company) {
      const fetchColors = async () => {
        try {
          const response = await fetch('http://localhost:3001/api/color', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ company })
          });
          if (response.ok) {
             const data = await response.json();
             setAiColors(data);
          }
        } catch (error) {
           console.error("Failed to fetch company colors:", error);
        }
      };
      fetchColors();
    } else {
       setAiColors(null);
    }
  }, [company]);

  useEffect(() => {
    if (normalizedCompany) {
      let isSubscribed = true;
      const domain = `${normalizedCompany.replace(/\s+/g, '')}.com`;
      const url = `http://localhost:3001/api/logo?domain=${domain}`;
      
      const loader = new THREE.TextureLoader();
      loader.setCrossOrigin('anonymous');
      
      loader.load(
        url,
        (texture) => {
          texture.colorSpace = THREE.SRGBColorSpace;
          texture.anisotropy = 16;
          if (isSubscribed) setDynamicLogo(texture);
        },
        undefined,
        (err) => {
          console.warn('Failed to load company logo from gstatic:', err);
          if (isSubscribed) setDynamicLogo(null);
        }
      );
      
      return () => { isSubscribed = false; };
    } else {
      setDynamicLogo(null);
    }
  }, [normalizedCompany]);

  const activeLogoTexture = dynamicLogo || defaultLogoTexture;

  if (aiColors) {
    chassisColor = aiColors.chassis;
    wingColor = aiColors.wing;
  }

  useEffect(() => {
    // Define the expanded positions
    const expandedPositions = {
      chassis: [0, 0, 0],
      frontWing: [0, 0, 3 + (config.scale * 0.5)],
      rearWing: [0, 0.5, -3 - (config.scale * 0.5)],
      engine: [0, 1.5, -1],
      wheelFL: [2.5, 0, 1.5],
      wheelFR: [-2.5, 0, 1.5],
      wheelRL: [2.5, 0, -1.5],
      wheelRR: [-2.5, 0, -1.5],
    };

    // Original positions (assembled state)
    const originalPositions = {
      chassis: [0, 0, 0],
      frontWing: [0, 0, 2 * config.scale],
      rearWing: [0, 0.5, -1.8 * config.scale],
      engine: [0, 0.2, -1],
      wheelFL: [1 * config.scale, 0, 1.5 * config.scale],
      wheelFR: [-1 * config.scale, 0, 1.5 * config.scale],
      wheelRL: [1 * config.scale, 0, -1.5 * config.scale],
      wheelRR: [-1 * config.scale, 0, -1.5 * config.scale],
    };

    const targetPositions = isExploded ? expandedPositions : originalPositions;
    const refs = {
      chassis: chassisRef,
      frontWing: frontWingRef,
      rearWing: rearWingRef,
      engine: engineRef,
      wheelFL: wheelFLRef,
      wheelFR: wheelFRRef,
      wheelRL: wheelRLRef,
      wheelRR: wheelRRRef,
    };

    // Animate each component to its target position using GSAP
    Object.keys(refs).forEach((key) => {
      if (refs[key].current) {
        gsap.to(refs[key].current.position, {
          x: targetPositions[key][0],
          y: targetPositions[key][1],
          z: targetPositions[key][2],
          duration: 1.5,
          ease: "back.out(1.2)",
          overwrite: "auto"
        });
        
        if (isExploded && key !== 'chassis' && !key.includes('wheel')) {
           gsap.to(refs[key].current.rotation, {
              y: "+=0.2",
              duration: 3,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut"
           });
        } else if (!isExploded) {
            gsap.to(refs[key].current.rotation, {
              x: 0, y: 0, z: 0,
              duration: 1,
              ease: "power2.out",
              overwrite: "auto"
            });
        }
      }
    });
  }, [isExploded, config.scale]);

  useFrame((state) => {
      if (groupRef.current && !isExploded) {
          groupRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.05;
      }
  });

  return (
    <group ref={groupRef} scale={config.scale}>
      {/* Chassis */}
      <mesh ref={chassisRef} position={[0, 0, 0]}>
        <boxGeometry args={config.chassisSize} />
        <meshStandardMaterial color={chassisColor} metalness={0.7} roughness={0.2} />
        <Decal
          position={[0, config.chassisSize[1]/2, 0.5]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={[1.2, 1.2, 1.2]}
        >
          <meshStandardMaterial
            map={activeLogoTexture}
            transparent
            polygonOffset
            polygonOffsetFactor={-1}
            roughness={0.5}
            metalness={0.1}
          />
        </Decal>
      </mesh>
      
      {/* Engine Block */}
      <mesh ref={engineRef} position={[0, 0.2, -1]}>
        <boxGeometry args={[0.8, 0.6, 1]} />
        <meshStandardMaterial color="#333333" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Front Wing */}
      <mesh ref={frontWingRef} position={[0, 0, 2 * config.scale]}>
        <boxGeometry args={config.frontWingSize} />
        <meshStandardMaterial color={wingColor} metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Rear Wing */}
      <mesh ref={rearWingRef} position={[0, 0.5, -1.8 * config.scale]}>
        <boxGeometry args={config.rearWingSize} />
        <meshStandardMaterial color={wingColor} metalness={0.8} roughness={0.3} />
        <Decal
          position={[0, config.rearWingSize[1]/2, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={[0.8, 0.8, 1]}
        >
          <meshStandardMaterial
            map={activeLogoTexture}
            transparent
            polygonOffset
            polygonOffsetFactor={-1}
            roughness={0.5}
            metalness={0.1}
          />
        </Decal>
      </mesh>

      {/* Wheels */}
      <mesh ref={wheelFLRef} position={[1 * config.scale, 0, 1.5 * config.scale]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.4, 0.4, 0.3, 32]} />
        <meshStandardMaterial color="#050505" roughness={0.9} />
      </mesh>
      <mesh ref={wheelFRRef} position={[-1 * config.scale, 0, 1.5 * config.scale]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.4, 0.4, 0.3, 32]} />
        <meshStandardMaterial color="#050505" roughness={0.9} />
      </mesh>
      <mesh ref={wheelRLRef} position={[1 * config.scale, 0, -1.5 * config.scale]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.4, 0.4, 0.4, 32]} />
        <meshStandardMaterial color="#050505" roughness={0.9} />
      </mesh>
      <mesh ref={wheelRRRef} position={[-1 * config.scale, 0, -1.5 * config.scale]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.4, 0.4, 0.4, 32]} />
        <meshStandardMaterial color="#050505" roughness={0.9} />
      </mesh>
    </group>
  );
};

export function CarModel({ carId, isExploded, company }) {
  // Pass the carId and company into the placeholder so it can customize itself
  return <PlaceholderCar isExploded={isExploded} carId={carId} company={company} />;
}
