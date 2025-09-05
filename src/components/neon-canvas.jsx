"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { Stars, OrbitControls } from "@react-three/drei"
import { useRef } from "react"
import * as THREE from "three"

function Knot() {
  const ref = useRef()
  useFrame((_, delta) => {
    if (!ref.current) return
    ref.current.rotation.x += delta * 0.25
    ref.current.rotation.y += delta * 0.35
  })
  return (
    <mesh ref={ref} position={[0, 0, 0]}>
      <torusKnotGeometry args={[1.1, 0.32, 220, 24]} />
      <meshStandardMaterial
        color={"#00F5FF"}
        emissive={"#00F5FF"}
        emissiveIntensity={1.4}
        metalness={0.2}
        roughness={0.15}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

export default function NeonCanvas() {
  return (
    <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 5], fov: 50 }} className="w-full h-[70vh] md:h-[80vh]">
      <color attach="background" args={["#0B0F13"]} />
      <ambientLight intensity={0.3} />
      <pointLight position={[4, 6, 4]} intensity={1.5} color={"#FF008C"} />
      <pointLight position={[-6, -3, -2]} intensity={0.8} color={"#00F5FF"} />
      <Stars radius={50} depth={60} count={2000} factor={3} saturation={0} fade speed={0.4} />
      <Knot />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
    </Canvas>
  )
}
