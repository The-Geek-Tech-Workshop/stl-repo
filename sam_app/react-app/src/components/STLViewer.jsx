import React, { useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { OrbitControls, useLoader } from '@react-three/drei';

function Model({ url }) {
  const geom = useLoader(STLLoader, url);
  return (
    <mesh geometry={geom}>
      <meshStandardMaterial color="gray" />
    </mesh>
  );
}

const STLViewer = ({ fileUrl }) => {
  return (
    <div style={{ height: '500px', width: '100%' }}>
      <Canvas camera={{ position: [0, 0, 100], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        <Suspense fallback={null}>
          <Model url={fileUrl} />
        </Suspense>
        <OrbitControls />
      </Canvas>
    </div>
  );
};

export default STLViewer;