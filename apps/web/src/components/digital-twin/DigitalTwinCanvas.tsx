'use client';

import React, { useEffect, useRef, useImperativeHandle, forwardRef, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import type { SpatialAnnotation } from '@sitebrain/types';

// ─── Type Definitions ───────────────────────────────────────────
export type CameraPreset = 'isometric' | 'top' | 'front' | 'reset';

export type ProgressLayer = 'completed' | 'in-progress' | 'remaining';

export interface LayerVisibility {
  completed: boolean;
  inProgress: boolean;
  remaining: boolean;
  annotations: boolean;
}

export interface DigitalTwinCanvasHandle {
  setCameraPreset: (preset: CameraPreset) => void;
  setLayerVisibility: (layers: LayerVisibility) => void;
  addAnnotationPin: (annotation: SpatialAnnotation) => void;
  removeAnnotationPin: (annotationId: string) => void;
  highlightElement: (elementId: string | null) => void;
}

interface BuildingElement {
  id: string;
  mesh: THREE.Mesh | THREE.LineSegments;
  status: ProgressLayer;
  label: string;
  floor: number;
}

interface AnnotationPin {
  id: string;
  group: THREE.Group;
}

interface Props {
  annotations: SpatialAnnotation[];
  layers: LayerVisibility;
  onElementClick?: (elementId: string, label: string) => void;
  onAnnotationClick?: (annotation: SpatialAnnotation) => void;
}

// ─── Material Library ───────────────────────────────────────────
const MATERIALS = {
  completed: new THREE.MeshStandardMaterial({
    color: 0x10b981,
    roughness: 0.6,
    metalness: 0.1,
  }),
  completedColumn: new THREE.MeshStandardMaterial({
    color: 0x1e40af,
    roughness: 0.5,
    metalness: 0.15,
  }),
  inProgress: new THREE.MeshStandardMaterial({
    color: 0xf97316,
    roughness: 0.55,
    metalness: 0.1,
  }),
  remaining: new THREE.MeshStandardMaterial({
    color: 0x475569,
    roughness: 0.8,
    metalness: 0.0,
    transparent: true,
    opacity: 0.18,
  }),
  wireframeRemaining: new THREE.LineBasicMaterial({
    color: 0x64748b,
    transparent: true,
    opacity: 0.4,
  }),
  annotationRfi: new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.4 }),
  annotationSafety: new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.4 }),
  annotationDefect: new THREE.MeshStandardMaterial({ color: 0x8b5cf6, roughness: 0.4 }),
  annotationQuality: new THREE.MeshStandardMaterial({ color: 0x06b6d4, roughness: 0.4 }),
  grid: new THREE.LineBasicMaterial({ color: 0x334155, transparent: true, opacity: 0.5 }),
  groundPlane: new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.95 }),
};

// ─── Canvas Component ───────────────────────────────────────────
const DigitalTwinCanvas = forwardRef<DigitalTwinCanvasHandle, Props>(
  ({ annotations, layers, onElementClick, onAnnotationClick }, ref) => {
    const mountRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const controlsRef = useRef<OrbitControls | null>(null);
    const elementsRef = useRef<BuildingElement[]>([]);
    const annotationPinsRef = useRef<AnnotationPin[]>([]);
    const frameRef = useRef<number>(0);
    const raycasterRef = useRef(new THREE.Raycaster());
    const mouseRef = useRef(new THREE.Vector2());
    const clickableMeshesRef = useRef<THREE.Object3D[]>([]);

    // ── Build procedural 3D building geometry ──────────────────
    const buildModel = useCallback((scene: THREE.Scene) => {
      const elements: BuildingElement[] = [];
      const clickables: THREE.Object3D[] = [];

      // Floor definitions: label, y-base, progressStatus, columnColor
      const FLOORS: { label: string; y: number; status: ProgressLayer; }[] = [
        { label: 'Foundation',   y: 0,    status: 'completed'   },
        { label: 'Podium L1',    y: 1.5,  status: 'completed'   },
        { label: 'Podium L2',    y: 4.0,  status: 'completed'   },
        { label: 'Podium L3',    y: 6.5,  status: 'completed'   },
        { label: 'Tower L4',     y: 9.2,  status: 'completed'   },
        { label: 'Tower L5',     y: 11.9, status: 'completed'   },
        { label: 'Tower L6',     y: 14.6, status: 'completed'   },
        { label: 'Tower L7',     y: 17.3, status: 'completed'   },
        { label: 'Tower L8',     y: 20.0, status: 'completed'   },
        { label: 'Tower L9',     y: 22.7, status: 'completed'   },
        { label: 'Tower L10',    y: 25.4, status: 'completed'   },
        { label: 'Tower L11',    y: 28.1, status: 'completed'   },
        { label: 'Tower L12',    y: 30.8, status: 'in-progress' },
        { label: 'Tower L13',    y: 33.5, status: 'in-progress' },
        { label: 'Tower L14',    y: 36.2, status: 'in-progress' },
        { label: 'Tower L15',    y: 38.9, status: 'remaining'   },
        { label: 'Tower L16',    y: 41.6, status: 'remaining'   },
        { label: 'Tower L17',    y: 44.3, status: 'remaining'   },
        { label: 'Tower L18',    y: 47.0, status: 'remaining'   },
        { label: 'Tower L19',    y: 49.7, status: 'remaining'   },
        { label: 'Tower L20',    y: 52.4, status: 'remaining'   },
      ];

      FLOORS.forEach((floor, idx) => {
        const floorNum = idx + 1;
        const isWide = idx <= 3; // Podium wider
        const w = isWide ? 18 : 12;
        const d = isWide ? 14 : 10;
        const slabH = 0.35;

        // ── Slab ──────────────────────────────────
        if (floor.status === 'remaining') {
          // Wireframe ghost slab
          const geo = new THREE.BoxGeometry(w, slabH, d);
          const edges = new THREE.EdgesGeometry(geo);
          const slab = new THREE.LineSegments(edges, MATERIALS.wireframeRemaining.clone());
          slab.position.set(0, floor.y, 0);
          slab.name = `slab-${floor.label}`;
          (slab as any).__elementId = `slab-${floor.label}`;
          (slab as any).__label = `${floor.label} — Slab`;
          scene.add(slab);
          elements.push({ id: `slab-${floor.label}`, mesh: slab, status: floor.status, label: `${floor.label} — Slab`, floor: floorNum });
        } else {
          const slabGeo = new THREE.BoxGeometry(w, slabH, d);
          const mat = floor.status === 'completed' ? MATERIALS.completed.clone() : MATERIALS.inProgress.clone();
          const slab = new THREE.Mesh(slabGeo, mat);
          slab.position.set(0, floor.y, 0);
          slab.receiveShadow = true;
          slab.castShadow = true;
          slab.name = `slab-${floor.label}`;
          (slab as any).__elementId = `slab-${floor.label}`;
          (slab as any).__label = `${floor.label} — Slab`;
          scene.add(slab);
          elements.push({ id: `slab-${floor.label}`, mesh: slab, status: floor.status, label: `${floor.label} — Slab`, floor: floorNum });
          clickables.push(slab);
        }

        // ── Columns (4 corners) ────────────────────
        if (idx < FLOORS.length - 1) {
          const nextFloor = FLOORS[idx + 1];
          const colH = nextFloor.y - floor.y - slabH;
          const colR = isWide ? 0.4 : 0.3;
          const xOff = w / 2 - colR * 2;
          const zOff = d / 2 - colR * 2;

          const colPositions = [
            [xOff, zOff], [-xOff, zOff], [xOff, -zOff], [-xOff, -zOff],
          ];

          colPositions.forEach(([cx, cz], ci) => {
            if (floor.status === 'remaining') {
              const colGeo = new THREE.CylinderGeometry(colR, colR, colH, 6);
              const edges = new THREE.EdgesGeometry(colGeo);
              const col = new THREE.LineSegments(edges, MATERIALS.wireframeRemaining.clone());
              col.position.set(cx, floor.y + slabH + colH / 2, cz);
              col.name = `col-${floor.label}-${ci}`;
              scene.add(col);
              elements.push({ id: `col-${floor.label}-${ci}`, mesh: col, status: floor.status, label: `${floor.label} — Column ${ci + 1}`, floor: floorNum });
            } else {
              const colGeo = new THREE.CylinderGeometry(colR, colR, colH, 8);
              const mat = floor.status === 'completed' ? MATERIALS.completedColumn.clone() : MATERIALS.inProgress.clone();
              const col = new THREE.Mesh(colGeo, mat);
              col.position.set(cx, floor.y + slabH + colH / 2, cz);
              col.castShadow = true;
              col.receiveShadow = true;
              col.name = `col-${floor.label}-${ci}`;
              (col as any).__elementId = `col-${floor.label}-${ci}`;
              (col as any).__label = `${floor.label} — Column ${ci + 1}`;
              scene.add(col);
              elements.push({ id: `col-${floor.label}-${ci}`, mesh: col, status: floor.status, label: `${floor.label} — Column ${ci + 1}`, floor: floorNum });
              clickables.push(col);
            }
          });

          // ── Core Shear Wall (centre) ────────────
          const coreW = isWide ? 5.0 : 3.5;
          const coreD = isWide ? 3.0 : 2.5;
          if (floor.status === 'remaining') {
            const coreGeo = new THREE.BoxGeometry(coreW, colH, coreD);
            const edges = new THREE.EdgesGeometry(coreGeo);
            const core = new THREE.LineSegments(edges, MATERIALS.wireframeRemaining.clone());
            core.position.set(0, floor.y + slabH + colH / 2, 0);
            scene.add(core);
            elements.push({ id: `core-${floor.label}`, mesh: core, status: floor.status, label: `${floor.label} — Core Wall`, floor: floorNum });
          } else {
            const coreGeo = new THREE.BoxGeometry(coreW, colH, coreD);
            const mat = floor.status === 'completed' ? MATERIALS.completedColumn.clone() : MATERIALS.inProgress.clone();
            const core = new THREE.Mesh(coreGeo, mat);
            core.position.set(0, floor.y + slabH + colH / 2, 0);
            core.castShadow = true;
            (core as any).__elementId = `core-${floor.label}`;
            (core as any).__label = `${floor.label} — Core Wall`;
            scene.add(core);
            elements.push({ id: `core-${floor.label}`, mesh: core, status: floor.status, label: `${floor.label} — Core Wall`, floor: floorNum });
            clickables.push(core);
          }
        }
      });

      // ── Ground Plane ───────────────────────────────
      const groundGeo = new THREE.PlaneGeometry(80, 80);
      const ground = new THREE.Mesh(groundGeo, MATERIALS.groundPlane);
      ground.rotation.x = -Math.PI / 2;
      ground.position.y = -0.5;
      ground.receiveShadow = true;
      scene.add(ground);

      // ── Site Grid ─────────────────────────────────
      const gridHelper = new THREE.GridHelper(80, 40, 0x1e293b, 0x1e293b);
      gridHelper.position.y = -0.48;
      (gridHelper.material as THREE.Material).transparent = true;
      (gridHelper.material as THREE.Material).opacity = 0.4;
      scene.add(gridHelper);

      return { elements, clickables };
    }, []);

    // ── Annotation Pin Geometry ────────────────────────────────
    const buildAnnotationPin = useCallback((annotation: SpatialAnnotation): THREE.Group => {
      const group = new THREE.Group();
      group.name = `annotation-${annotation.id}`;
      (group as any).__annotationId = annotation.id;

      let mat: THREE.MeshStandardMaterial;
      switch (annotation.category) {
        case 'SAFETY_HAZARD': mat = MATERIALS.annotationSafety.clone(); break;
        case 'DEFECT':        mat = MATERIALS.annotationDefect.clone(); break;
        case 'QUALITY_INSPECTION': mat = MATERIALS.annotationQuality.clone(); break;
        default:              mat = MATERIALS.annotationRfi.clone(); break;
      }

      // Diamond pin head
      const headGeo = new THREE.OctahedronGeometry(0.5, 0);
      const head = new THREE.Mesh(headGeo, mat);
      head.position.y = 0;
      head.castShadow = true;
      group.add(head);

      // Vertical stem
      const stemGeo = new THREE.CylinderGeometry(0.05, 0.05, 1.2, 6);
      const stemMat = mat.clone();
      const stem = new THREE.Mesh(stemGeo, stemMat);
      stem.position.y = -0.9;
      group.add(stem);

      group.position.set(annotation.position_x, annotation.position_y + 0.9, annotation.position_z);
      return group;
    }, []);

    // ── Three.js Initialisation ────────────────────────────────
    useEffect(() => {
      if (!mountRef.current) return;

      const container = mountRef.current;
      const W = container.clientWidth;
      const H = container.clientHeight;

      // Scene
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x0a0f1a);
      scene.fog = new THREE.FogExp2(0x0a0f1a, 0.008);
      sceneRef.current = scene;

      // Camera
      const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 500);
      camera.position.set(40, 30, 40);
      camera.lookAt(0, 25, 0);
      cameraRef.current = camera;

      // Renderer
      const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
      renderer.setSize(W, H);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.2;
      container.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      // Lights
      const ambient = new THREE.AmbientLight(0x94a3b8, 0.6);
      scene.add(ambient);

      const dirLight = new THREE.DirectionalLight(0xffecd2, 1.5);
      dirLight.position.set(30, 60, 25);
      dirLight.castShadow = true;
      dirLight.shadow.mapSize.set(2048, 2048);
      dirLight.shadow.camera.near = 1;
      dirLight.shadow.camera.far = 200;
      dirLight.shadow.camera.left = -50;
      dirLight.shadow.camera.right = 50;
      dirLight.shadow.camera.top = 80;
      dirLight.shadow.camera.bottom = -30;
      dirLight.shadow.bias = -0.0003;
      scene.add(dirLight);

      const fillLight = new THREE.DirectionalLight(0x3b82f6, 0.4);
      fillLight.position.set(-20, 30, -20);
      scene.add(fillLight);

      const rimLight = new THREE.PointLight(0xf97316, 0.8, 80);
      rimLight.position.set(-15, 20, -15);
      scene.add(rimLight);

      // OrbitControls
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.07;
      controls.screenSpacePanning = false;
      controls.minDistance = 5;
      controls.maxDistance = 120;
      controls.maxPolarAngle = Math.PI / 2.1;
      controls.target.set(0, 25, 0);
      controls.update();
      controlsRef.current = controls;

      // Build Model
      const { elements, clickables } = buildModel(scene);
      elementsRef.current = elements;
      clickableMeshesRef.current = clickables;

      // Add initial annotation pins
      annotations.forEach((ann) => {
        const pin = buildAnnotationPin(ann);
        scene.add(pin);
        annotationPinsRef.current.push({ id: ann.id, group: pin });
      });

      // Animate
      const animate = () => {
        frameRef.current = requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
      };
      animate();

      // Resize
      const onResize = () => {
        if (!container) return;
        const W2 = container.clientWidth;
        const H2 = container.clientHeight;
        camera.aspect = W2 / H2;
        camera.updateProjectionMatrix();
        renderer.setSize(W2, H2);
      };
      window.addEventListener('resize', onResize);

      // Click / Raycast
      const onPointerDown = (e: PointerEvent) => {
        if (!mountRef.current) return;
        const rect = mountRef.current.getBoundingClientRect();
        mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        raycasterRef.current.setFromCamera(mouseRef.current, camera);

        // Test annotation pins first
        const annotationGroups = annotationPinsRef.current.map((p) => p.group);
        const annotationHits = raycasterRef.current.intersectObjects(annotationGroups, true);
        if (annotationHits.length > 0) {
          let obj: THREE.Object3D | null = annotationHits[0].object;
          while (obj && !(obj as any).__annotationId) obj = obj.parent;
          if (obj && (obj as any).__annotationId) {
            const id = (obj as any).__annotationId as string;
            const annotation = annotations.find((a) => a.id === id);
            if (annotation && onAnnotationClick) onAnnotationClick(annotation);
            return;
          }
        }

        // Test building elements
        const hits = raycasterRef.current.intersectObjects(clickableMeshesRef.current, false);
        if (hits.length > 0) {
          const hit = hits[0].object;
          const elementId = (hit as any).__elementId as string;
          const label = (hit as any).__label as string;
          if (elementId && onElementClick) onElementClick(elementId, label);
        }
      };
      renderer.domElement.addEventListener('pointerdown', onPointerDown);

      return () => {
        cancelAnimationFrame(frameRef.current);
        window.removeEventListener('resize', onResize);
        renderer.domElement.removeEventListener('pointerdown', onPointerDown);
        controls.dispose();
        renderer.dispose();
        if (container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ── Layer visibility updates ───────────────────────────────
    useEffect(() => {
      elementsRef.current.forEach((el) => {
        let visible = false;
        if (el.status === 'completed')   visible = layers.completed;
        if (el.status === 'in-progress') visible = layers.inProgress;
        if (el.status === 'remaining')   visible = layers.remaining;
        el.mesh.visible = visible;
      });
      annotationPinsRef.current.forEach((p) => {
        p.group.visible = layers.annotations;
      });
    }, [layers]);

    // ── Sync annotation pins with prop changes ─────────────────
    useEffect(() => {
      if (!sceneRef.current) return;
      const scene = sceneRef.current;
      const existingIds = new Set(annotationPinsRef.current.map((p) => p.id));
      const propIds = new Set(annotations.map((a) => a.id));

      // Add new
      annotations.forEach((ann) => {
        if (!existingIds.has(ann.id)) {
          const pin = buildAnnotationPin(ann);
          pin.visible = layers.annotations;
          scene.add(pin);
          annotationPinsRef.current.push({ id: ann.id, group: pin });
        }
      });

      // Remove deleted
      annotationPinsRef.current = annotationPinsRef.current.filter((p) => {
        if (!propIds.has(p.id)) {
          scene.remove(p.group);
          return false;
        }
        return true;
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [annotations]);

    // ── Imperative Handle ──────────────────────────────────────
    useImperativeHandle(ref, () => ({
      setCameraPreset: (preset: CameraPreset) => {
        const camera = cameraRef.current;
        const controls = controlsRef.current;
        if (!camera || !controls) return;

        const presets: Record<CameraPreset, { pos: THREE.Vector3; target: THREE.Vector3 }> = {
          isometric: { pos: new THREE.Vector3(40, 30, 40), target: new THREE.Vector3(0, 25, 0) },
          top:       { pos: new THREE.Vector3(0, 90, 0.01), target: new THREE.Vector3(0, 25, 0) },
          front:     { pos: new THREE.Vector3(0, 25, 55), target: new THREE.Vector3(0, 25, 0) },
          reset:     { pos: new THREE.Vector3(40, 30, 40), target: new THREE.Vector3(0, 25, 0) },
        };
        const { pos, target } = presets[preset];
        camera.position.copy(pos);
        controls.target.copy(target);
        controls.update();
      },

      setLayerVisibility: (newLayers: LayerVisibility) => {
        elementsRef.current.forEach((el) => {
          let visible = false;
          if (el.status === 'completed')   visible = newLayers.completed;
          if (el.status === 'in-progress') visible = newLayers.inProgress;
          if (el.status === 'remaining')   visible = newLayers.remaining;
          el.mesh.visible = visible;
        });
        annotationPinsRef.current.forEach((p) => {
          p.group.visible = newLayers.annotations;
        });
      },

      addAnnotationPin: (annotation: SpatialAnnotation) => {
        if (!sceneRef.current) return;
        const exists = annotationPinsRef.current.some((p) => p.id === annotation.id);
        if (!exists) {
          const pin = buildAnnotationPin(annotation);
          sceneRef.current.add(pin);
          annotationPinsRef.current.push({ id: annotation.id, group: pin });
        }
      },

      removeAnnotationPin: (annotationId: string) => {
        if (!sceneRef.current) return;
        annotationPinsRef.current = annotationPinsRef.current.filter((p) => {
          if (p.id === annotationId) {
            sceneRef.current!.remove(p.group);
            return false;
          }
          return true;
        });
      },

      highlightElement: (elementId: string | null) => {
        elementsRef.current.forEach((el) => {
          if (el.mesh instanceof THREE.Mesh) {
            const mat = el.mesh.material as THREE.MeshStandardMaterial;
            mat.emissive.set(el.id === elementId ? 0xffffff : 0x000000);
            mat.emissiveIntensity = el.id === elementId ? 0.15 : 0;
          }
        });
      },
    }), [buildAnnotationPin]);

    return (
      <div
        ref={mountRef}
        className="w-full h-full"
        style={{ background: '#0a0f1a' }}
      />
    );
  }
);

DigitalTwinCanvas.displayName = 'DigitalTwinCanvas';
export default DigitalTwinCanvas;
