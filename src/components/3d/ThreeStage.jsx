import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Grid } from '@react-three/drei';
import { Suspense } from 'react';
import { CarModel } from './CarModel';
import { HistoryImages } from './HistoryImages';

export function ThreeStage({ currentCar, isExploded, customColor, showHistory }) {
  return (
    <Canvas
      camera={{ position: [5, 3, 5], fov: 45 }}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1 // Underneath the UI overlays
      }}
    >
      <color attach="background" args={['#0a0b0f']} />
      
      {/* Lighting & Environment */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow />
      <directionalLight position={[-10, 10, -5]} intensity={0.5} color="#00ccff" />
      
      {/* PBR Environment map for nice reflections on metallic parts */}
      <Environment preset="night" background blur={0.5} />

      <Suspense fallback={null}>
         <group position={[0, -0.5, 0]}>
             {/* The Car itself */}
            <CarModel carId={currentCar} isExploded={isExploded} customColor={customColor} />
            
            {showHistory && <HistoryImages carId={currentCar} />}

            {/* Garage Floor Aesthetics */}
            <ContactShadows 
               position={[0, 0, 0]} 
               opacity={0.7} 
               scale={20} 
               blur={2} 
               far={4} 
            />
            
            {/* High-tech grid representing the engineering stage */}
            <Grid 
                renderOrder={-1} 
                position={[0, -0.01, 0]} 
                infiniteGrid 
                fadeDistance={20} 
                fadeStrength={5} 
                cellSize={1} 
                sectionSize={5} 
                cellColor="#222" 
                sectionColor="#444" 
            />
         </group>
      </Suspense>

      {/* Camera Controls */}
      <OrbitControls 
        makeDefault
        minDistance={3}
        maxDistance={12}
        maxPolarAngle={Math.PI / 2 - 0.05} // Prevent camera from going under the floor
        enableDamping
        dampingFactor={0.05}
        autoRotate={!isExploded} // Slowly spin when assembled
        autoRotateSpeed={0.5}
      />
    </Canvas>
  );
}
