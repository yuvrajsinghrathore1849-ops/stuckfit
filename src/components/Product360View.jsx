import React, { useRef, Suspense, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stage, Center, useGLTF, Html, useTexture } from '@react-three/drei';
import * as THREE from 'three';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <Html center>
          <div style={{ color: '#d32f2f', background: 'white', padding: '1rem', borderRadius: '8px', textAlign: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <h4 style={{margin: '0 0 0.5rem 0'}}>Error Loading 3D Model</h4>
            <p style={{fontSize: '0.8rem', margin: 0}}>{this.state.error?.message || "Invalid or corrupt .glb file"}</p>
          </div>
        </Html>
      );
    }
    return this.props.children;
  }
}

// Loads an actual 3D model (GLB/GLTF)
const RealModel = ({ url }) => {
  const { scene } = useGLTF(url);

  // Clean the scene BEFORE Stage measures it
  React.useMemo(() => {
    if (scene) {
      const toRemove = [];
      scene.traverse((child) => {
        if (child.isLight || child.isCamera) {
          toRemove.push(child);
        }
        if (child.isMesh && child.material) {
          // Clone material to avoid mutating cached GLTF data
          child.material = child.material.clone();
          // Reset the base color to white so it doesn't darken or tint the model's built-in texture/design
          child.material.color = new THREE.Color(0xffffff);
          // Ensure vertex colors don't override the texture
          child.material.vertexColors = false;
          child.material.needsUpdate = true;
        }
      });
      toRemove.forEach(child => child.removeFromParent());
    }
  }, [scene]);

  return <primitive object={scene} />;
};

// A placeholder 3D T-shirt/Torso representation or abstract showcase object
const PlaceholderModel = () => {
  const meshRef = useRef();

  // Rotate slowly for presentation
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <mesh ref={meshRef} castShadow receiveShadow>
      {/* We use a compound shape or simple cylinder/box as placeholder */}
      <cylinderGeometry args={[1, 1.2, 3, 32]} />
      <meshStandardMaterial 
        color="#2a3f5f" 
        roughness={0.4} 
        metalness={0.8}
      />
    </mesh>
  );
};

const Product360View = ({ title = "Interactive 3D View", description = "Drag to rotate. Zoom to see details.", modelUrl }) => {
  return (
    <div className="product-360-container" style={{ width: '100%', padding: '2rem 0' }}>
      <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div className="section-header center" style={{ marginBottom: '1rem' }}>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        
        {/* 3D Canvas Container */}
        <div 
          style={{ 
            width: '100%', 
            maxWidth: '800px', 
            height: '500px', 
            borderRadius: '16px',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            position: 'relative',
            cursor: 'grab'
          }}
          onMouseDown={(e) => e.currentTarget.style.cursor = 'grabbing'}
          onMouseUp={(e) => e.currentTarget.style.cursor = 'grab'}
          onMouseLeave={(e) => e.currentTarget.style.cursor = 'grab'}
        >
          <Canvas shadows camera={{ position: [0, 0, 8], fov: 45 }}>
            <color attach="background" args={['#eef2f5']} />
            
            <ErrorBoundary>
              <Suspense fallback={<Html center>Loading 3D...</Html>}>
                <Stage environment="city" intensity={0.6}>
                  {modelUrl ? <RealModel url={modelUrl} /> : <PlaceholderModel />}
                </Stage>
              </Suspense>
            </ErrorBoundary>

            <OrbitControls 
              enableZoom={true} 
              autoRotate={!modelUrl} 
              maxPolarAngle={Math.PI / 2} 
              minPolarAngle={0} 
            />
          </Canvas>
          
          <div style={{
            position: 'absolute',
            bottom: '16px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(255,255,255,0.8)',
            padding: '8px 16px',
            borderRadius: '20px',
            fontSize: '0.9rem',
            fontWeight: '600',
            pointerEvents: 'none',
            color: '#333'
          }}>
            360° Drag to Rotate
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product360View;
