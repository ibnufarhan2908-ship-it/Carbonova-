import { useEffect, useRef, useState, useMemo } from 'react'
import * as THREE from 'three'
import type { Molecule, AtomType } from '../../types/chemistry'
import ChemicalFormula from '../ChemicalFormula'
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Play,
  Pause,
  AlertCircle,
} from 'lucide-react'

interface Molecule3DProps {
  molecule: Molecule
  className?: string
  height?: number
  showControls?: boolean
}

// Atom color palette matching chemistry conventions
const ATOM_3D_COLORS: Record<AtomType, { color: number; radius: number; label: string }> = {
  C: { color: 0x1e293b, radius: 0.44, label: 'Karbon (Hitam/Arang)' },
  H: { color: 0xf8fafc, radius: 0.26, label: 'Hidrogen (Putih)' },
  O: { color: 0xef4444, radius: 0.38, label: 'Oksigen (Merah)' },
  N: { color: 0x3b82f6, radius: 0.38, label: 'Nitrogen (Biru)' },
  Cl: { color: 0x10b981, radius: 0.44, label: 'Klorin (Hijau)' },
  Br: { color: 0xb45309, radius: 0.46, label: 'Bromin (Cokelat)' },
}

/**
 * Check if WebGL is supported by the current browser environment
 */
function isWebGLAvailable(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    )
  } catch {
    return false
  }
}

export default function Molecule3D({
  molecule,
  className = '',
  height = 360,
  showControls = true,
}: Molecule3DProps) {
  const hasWebGL = useMemo(() => isWebGLAvailable(), [])
  const [webGLError, setWebGLError] = useState<boolean>(!hasWebGL)
  const [autoRotate, setAutoRotate] = useState<boolean>(true)

  const containerRef = useRef<HTMLDivElement>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const moleculeGroupRef = useRef<THREE.Group | null>(null)
  const animFrameRef = useRef<number | null>(null)

  // Drag interaction states
  const isDraggingRef = useRef<boolean>(false)
  const previousPointerPositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })

  // Calculate 3D coordinates from molecule atoms
  const computed3DAtoms = useMemo(() => {
    const atoms = molecule.atoms
    if (atoms.length === 0) return []

    // Calculate center of mass in 2D
    const avgX = atoms.reduce((sum, a) => sum + a.x, 0) / atoms.length
    const avgY = atoms.reduce((sum, a) => sum + a.y, 0) / atoms.length

    // Find bounding box for scaling
    const maxDist = Math.max(
      ...atoms.map((a) => Math.hypot(a.x - avgX, a.y - avgY)),
      1
    )
    const scale = 2.6 / maxDist

    // Pre-build adjacency to assign realistic 3D Z-offsets to tetrahedral / trigonal atoms
    const neighborsMap = new Map<string, string[]>()
    molecule.bonds.forEach((b) => {
      if (!neighborsMap.has(b.from)) neighborsMap.set(b.from, [])
      if (!neighborsMap.has(b.to)) neighborsMap.set(b.to, [])
      neighborsMap.get(b.from)!.push(b.to)
      neighborsMap.get(b.to)!.push(b.from)
    })

    return atoms.map((atom, idx) => {
      const nx = (atom.x - avgX) * scale
      const ny = -(atom.y - avgY) * scale // Invert Y for 3D coordinate space

      // If atom already has z specified, use it
      if (typeof atom.z === 'number') {
        return { ...atom, px: nx, py: ny, pz: atom.z }
      }

      // Generate realistic 3D depth offsets based on bonding & element
      let nz = 0
      const neighbors = neighborsMap.get(atom.id) || []

      if (atom.element === 'H') {
        // Offset hydrogens alternatively in front (+z) and behind (-z) to reveal 3D tetrahedral structure
        nz = (idx % 2 === 0 ? 0.75 : -0.75)
      } else if (atom.element === 'C') {
        if (neighbors.length === 4) {
          // Tetrahedral carbon center
          nz = ((idx % 2) - 0.5) * 0.35
        } else if (neighbors.length === 3) {
          // Trigonal planar carbon
          nz = 0
        } else {
          // Linear or other
          nz = 0
        }
      } else if (atom.element === 'O' || atom.element === 'N') {
        nz = (idx % 2 === 0 ? 0.4 : -0.4)
      }

      return {
        ...atom,
        px: nx,
        py: ny,
        pz: nz,
      }
    })
  }, [molecule])

  // Initialize Three.js Scene
  useEffect(() => {
    if (webGLError) return

    const container = containerRef.current
    if (!container) return

    const width = container.clientWidth || 400
    const currentHeight = height

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'default' })
      renderer.setSize(width, currentHeight)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.shadowMap.enabled = false
      rendererRef.current = renderer
    } catch (err) {
      console.warn('Gagal menginisialisasi WebGL Three.js:', err)
      setWebGLError(true)
      return
    }

    container.innerHTML = ''
    container.appendChild(renderer.domElement)

    // Scene setup
    const scene = new THREE.Scene()
    sceneRef.current = scene

    // Camera setup
    const camera = new THREE.PerspectiveCamera(45, width / currentHeight, 0.1, 100)
    camera.position.set(0, 0, 7.2)
    cameraRef.current = camera

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2)
    scene.add(ambientLight)

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2)
    keyLight.position.set(5, 7, 6)
    scene.add(keyLight)

    const fillLight = new THREE.DirectionalLight(0x5de0e6, 0.9)
    fillLight.position.set(-6, -3, -4)
    scene.add(fillLight)

    const backLight = new THREE.DirectionalLight(0xffffff, 0.6)
    backLight.position.set(0, -6, 5)
    scene.add(backLight)

    // Create Molecule 3D Model Group
    const molGroup = new THREE.Group()
    moleculeGroupRef.current = molGroup
    scene.add(molGroup)

    const sphereGeomCache = new Map<number, THREE.SphereGeometry>()
    const getSphereGeom = (radius: number) => {
      const key = Math.round(radius * 100)
      if (!sphereGeomCache.has(key)) {
        sphereGeomCache.set(key, new THREE.SphereGeometry(radius, 32, 32))
      }
      return sphereGeomCache.get(key)!
    }

    // Map for atom coordinates lookup
    const atomCoordMap = new Map<string, THREE.Vector3>()

    // 1. Create Atom Meshes
    computed3DAtoms.forEach((atom) => {
      const config = ATOM_3D_COLORS[atom.element] || {
        color: 0x64748b,
        radius: 0.38,
        label: atom.element,
      }
      const geom = getSphereGeom(config.radius)

      const mat = new THREE.MeshStandardMaterial({
        color: config.color,
        roughness: atom.element === 'C' ? 0.3 : 0.25,
        metalness: atom.element === 'C' ? 0.4 : 0.15,
      })

      const mesh = new THREE.Mesh(geom, mat)
      mesh.position.set(atom.px, atom.py, atom.pz)
      mesh.castShadow = false
      mesh.receiveShadow = false
      molGroup.add(mesh)

      atomCoordMap.set(atom.id, new THREE.Vector3(atom.px, atom.py, atom.pz))
    })

    // 2. Create Bond Cylinders
    const bondMaterial = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.35,
      metalness: 0.3,
    })

    const createCylinderBetweenPoints = (
      p1: THREE.Vector3,
      p2: THREE.Vector3,
      radius = 0.08,
      offsetVec?: THREE.Vector3
    ) => {
      const start = p1.clone()
      const end = p2.clone()

      if (offsetVec) {
        start.add(offsetVec)
        end.add(offsetVec)
      }

      const distance = start.distanceTo(end)
      if (distance < 0.001) return

      const cylinderGeom = new THREE.CylinderGeometry(radius, radius, distance, 16)
      const cylinder = new THREE.Mesh(cylinderGeom, bondMaterial)

      const midpoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5)
      cylinder.position.copy(midpoint)

      const orientation = new THREE.Vector3().subVectors(end, start).normalize()
      const up = new THREE.Vector3(0, 1, 0)
      const quaternion = new THREE.Quaternion().setFromUnitVectors(up, orientation)
      cylinder.setRotationFromQuaternion(quaternion)

      molGroup.add(cylinder)
    }

    molecule.bonds.forEach((bond) => {
      const p1 = atomCoordMap.get(bond.from)
      const p2 = atomCoordMap.get(bond.to)
      if (!p1 || !p2) return

      const bondVector = new THREE.Vector3().subVectors(p2, p1)
      const bondDir = bondVector.clone().normalize()

      let arbitrary = new THREE.Vector3(0, 1, 0)
      if (Math.abs(bondDir.dot(arbitrary)) > 0.9) {
        arbitrary = new THREE.Vector3(1, 0, 0)
      }
      const normal = new THREE.Vector3().crossVectors(bondDir, arbitrary).normalize()

      if (bond.order === 1) {
        createCylinderBetweenPoints(p1, p2, 0.085)
      } else if (bond.order === 2) {
        const offset = normal.clone().multiplyScalar(0.12)
        createCylinderBetweenPoints(p1, p2, 0.065, offset)
        createCylinderBetweenPoints(p1, p2, 0.065, offset.clone().negate())
      } else if (bond.order === 3) {
        createCylinderBetweenPoints(p1, p2, 0.055)
        const offset = normal.clone().multiplyScalar(0.15)
        createCylinderBetweenPoints(p1, p2, 0.055, offset)
        createCylinderBetweenPoints(p1, p2, 0.055, offset.clone().negate())
      }
    })

    // Animation Loop
    let lastTime = performance.now()
    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate)

      const now = performance.now()
      const delta = (now - lastTime) / 1000
      lastTime = now

      if (autoRotate && molGroup && !isDraggingRef.current) {
        molGroup.rotation.y += delta * 0.45
      }

      renderer.render(scene, camera)
    }
    animate()

    // Handle Resize
    const handleResize = () => {
      if (!container || !renderer || !camera) return
      const newWidth = container.clientWidth
      camera.aspect = newWidth / currentHeight
      camera.updateProjectionMatrix()
      renderer.setSize(newWidth, currentHeight)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
      if (container && renderer.domElement) {
        try {
          container.removeChild(renderer.domElement)
        } catch {
          // ignore cleanup errors
        }
      }
      renderer.dispose()
    }
  }, [molecule, computed3DAtoms, height, autoRotate, webGLError])

  // Drag rotation handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true
    previousPointerPositionRef.current = { x: e.clientX, y: e.clientY }
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current || !moleculeGroupRef.current) return

    const deltaX = e.clientX - previousPointerPositionRef.current.x
    const deltaY = e.clientY - previousPointerPositionRef.current.y

    moleculeGroupRef.current.rotation.y += deltaX * 0.008
    moleculeGroupRef.current.rotation.x += deltaY * 0.008

    previousPointerPositionRef.current = { x: e.clientX, y: e.clientY }
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    isDraggingRef.current = false
    try {
      ;(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId)
    } catch {
      // ignore
    }
  }

  const handleWheel = (e: React.WheelEvent) => {
    if (!cameraRef.current) return
    e.preventDefault()
    const zoomDelta = e.deltaY * 0.005
    cameraRef.current.position.z = Math.min(13, Math.max(3.2, cameraRef.current.position.z + zoomDelta))
  }

  const handleZoomIn = () => {
    if (!cameraRef.current) return
    cameraRef.current.position.z = Math.max(3.2, cameraRef.current.position.z - 0.8)
  }

  const handleZoomOut = () => {
    if (!cameraRef.current) return
    cameraRef.current.position.z = Math.min(13, cameraRef.current.position.z + 0.8)
  }

  const handleResetCamera = () => {
    if (cameraRef.current) cameraRef.current.position.set(0, 0, 7.2)
    if (moleculeGroupRef.current) moleculeGroupRef.current.rotation.set(0, 0, 0)
    setAutoRotate(true)
  }

  return (
    <div className={`relative bg-gradient-to-b from-slate-900 to-[#101C3A] rounded-3xl border border-slate-700/80 overflow-hidden shadow-lg ${className}`}>
      {/* Top Header */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between gap-2 pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          <span className="px-3 py-1 rounded-full bg-slate-900/90 text-white font-extrabold text-xs border border-slate-700 flex items-center gap-1.5 shadow-sm">
            <span>{molecule.name}</span>
            <span className="text-[#5DE0E6] font-mono">
              <ChemicalFormula formula={molecule.formula} />
            </span>
          </span>

          <span className="hidden sm:inline-block px-2.5 py-1 rounded-full bg-teal-950/80 text-[#5DE0E6] font-bold text-[11px] border border-teal-800/80">
            {molecule.category}
          </span>
        </div>
      </div>

      {/* Main Molecule Visualizer Viewport (Always 3D) */}
      <div
        ref={containerRef}
        style={{ height: `${height}px` }}
        className="w-full cursor-grab active:cursor-grabbing touch-none select-none relative"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onWheel={handleWheel}
      />

      {/* Error Banner if WebGL failed */}
      {webGLError && (
        <div className="absolute top-14 left-4 right-4 z-20 p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-200 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
          <span>Browser Anda tidak mendukung akselerasi WebGL untuk menampilkan model 3D.</span>
        </div>
      )}

      {/* Bottom Floating Control Bar */}
      {showControls && (
        <div className="absolute bottom-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
          {/* Color Legend */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 text-[10px] text-slate-300 pointer-events-auto backdrop-blur-xs">
            <span className="font-bold text-slate-400">Atom:</span>
            <span className="inline-flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-950 border border-slate-500" />
              <span>C (Hitam)</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-white border border-slate-400" />
              <span>H (Putih)</span>
            </span>
            {molecule.atoms.some((a) => a.element === 'O') && (
              <span className="inline-flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 border border-red-300" />
                <span>O (Merah)</span>
              </span>
            )}
            {molecule.atoms.some((a) => a.element === 'N') && (
              <span className="inline-flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 border border-blue-300" />
                <span>N (Biru)</span>
              </span>
            )}
          </div>

          {/* Interactive Zoom & Rotate Buttons */}
          <div className="flex items-center gap-1 p-1 bg-slate-900/90 rounded-2xl border border-slate-700/80 pointer-events-auto backdrop-blur-xs">
            <button
              onClick={() => setAutoRotate(!autoRotate)}
              className={`p-1.5 rounded-xl text-xs font-bold transition-colors ${
                autoRotate ? 'bg-[#1DAA9A] text-white' : 'text-slate-400 hover:text-white'
              }`}
              title={autoRotate ? 'Hentikan Putaran Otomatis' : 'Putar Otomatis'}
            >
              {autoRotate ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={handleZoomIn}
              className="p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              title="Perbesar (Zoom In)"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleZoomOut}
              className="p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              title="Perkecil (Zoom Out)"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleResetCamera}
              className="p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              title="Reset Posisi Kamera"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
