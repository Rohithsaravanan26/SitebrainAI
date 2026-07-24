'use client';

import type { Metadata } from 'next';
import * as React from 'react';
import dynamic from 'next/dynamic';
import {
  Cpu,
  BarChart2,
  CheckSquare,
  Clock,
  Layers,
  Maximize2,
  Info,
  X,
} from 'lucide-react';
import type { SpatialAnnotation } from '@sitebrain/types';
import { CameraToolbar } from '@/components/digital-twin/CameraToolbar';
import { LayerControlPanel } from '@/components/digital-twin/LayerControlPanel';
import { AnnotationsList } from '@/components/digital-twin/AnnotationsList';
import { ProgressLegend } from '@/components/digital-twin/ProgressLegend';
import type {
  DigitalTwinCanvasHandle,
  CameraPreset,
  LayerVisibility,
} from '@/components/digital-twin/DigitalTwinCanvas';

// Dynamically load the Three.js canvas — no SSR
const DigitalTwinCanvas = dynamic(
  () => import('@/components/digital-twin/DigitalTwinCanvas'),
  { ssr: false, loading: () => <CanvasLoadingSkeleton /> }
);

// ─── Loading Skeleton ─────────────────────────────────────────
function CanvasLoadingSkeleton() {
  return (
    <div className="w-full h-full bg-slate-950 flex flex-col items-center justify-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-orange-700/20 border border-orange-700/40">
        <Cpu className="h-5 w-5 text-orange-500 animate-pulse" />
      </div>
      <div className="text-center">
        <p className="text-xs font-bold text-slate-300 font-mono">Initialising WebGL Engine</p>
        <p className="text-[11px] text-slate-600 font-mono mt-0.5">Loading Three.js renderer…</p>
      </div>
      <div className="w-40 h-0.5 bg-slate-800 rounded-full overflow-hidden">
        <div className="h-full w-1/2 bg-orange-600 rounded-full animate-pulse" />
      </div>
    </div>
  );
}

// ─── KPI Stats ─────────────────────────────────────────────────
const MODEL_KPIS = [
  { label: 'Total Elements', value: '284',  sub: 'BIM-REV-12',             icon: <Layers className="h-4 w-4 text-slate-400" />     },
  { label: 'Completed',      value: '184',  sub: '64.8% of structure',     icon: <CheckSquare className="h-4 w-4 text-emerald-500" /> },
  { label: 'In Progress',    value: '48',   sub: 'Lvl 12 – 14 active',     icon: <Clock className="h-4 w-4 text-orange-500" />     },
  { label: 'Progress Score', value: '67%',  sub: '+3% vs. last week',      icon: <BarChart2 className="h-4 w-4 text-blue-400" />   },
];

// ─── Main Page Component ────────────────────────────────────────
export default function DigitalTwinPage() {
  const canvasRef = React.useRef<DigitalTwinCanvasHandle>(null);
  const [activePreset, setActivePreset] = React.useState<CameraPreset>('isometric');
  const [layers, setLayers] = React.useState<LayerVisibility>({
    completed: true,
    inProgress: true,
    remaining: true,
    annotations: true,
  });
  const [annotations, setAnnotations] = React.useState<SpatialAnnotation[]>([]);
  const [selectedAnnotation, setSelectedAnnotation] = React.useState<SpatialAnnotation | null>(null);
  const [selectedElement, setSelectedElement] = React.useState<{ id: string; label: string } | null>(null);
  const [showLayers, setShowLayers] = React.useState(false);
  const [showLegend, setShowLegend] = React.useState(true);
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [fullscreen, setFullscreen] = React.useState(false);

  const handleCameraPreset = React.useCallback((preset: CameraPreset) => {
    setActivePreset(preset);
    canvasRef.current?.setCameraPreset(preset);
  }, []);

  const handleLayerChange = React.useCallback((newLayers: LayerVisibility) => {
    setLayers(newLayers);
    canvasRef.current?.setLayerVisibility(newLayers);
  }, []);

  const handleAnnotationSelect = React.useCallback((ann: SpatialAnnotation) => {
    setSelectedAnnotation((prev) => (prev?.id === ann.id ? null : ann));
    canvasRef.current?.highlightElement(null);
  }, []);

  const handleAnnotationAdd = React.useCallback((ann: SpatialAnnotation) => {
    setAnnotations((prev) => [ann, ...prev]);
    canvasRef.current?.addAnnotationPin(ann);
  }, []);

  const handleElementClick = React.useCallback((elementId: string, label: string) => {
    setSelectedElement({ id: elementId, label });
    canvasRef.current?.highlightElement(elementId);
    setSelectedAnnotation(null);
  }, []);

  const handleAnnotationClick = React.useCallback((ann: SpatialAnnotation) => {
    setSelectedAnnotation(ann);
    setSelectedElement(null);
    canvasRef.current?.highlightElement(null);
  }, []);

  const dismissElement = () => {
    setSelectedElement(null);
    canvasRef.current?.highlightElement(null);
  };

  return (
    <div className={`flex flex-col ${fullscreen ? 'fixed inset-0 z-50 bg-slate-950' : 'h-[calc(100vh-48px-48px)]'}`}>
      {/* ── Top Bar ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 h-12 bg-slate-900 border-b border-slate-800 shrink-0">
        {/* Left: Model info */}
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-xs font-bold text-white leading-tight">Digital Twin — Structural Model</h1>
            <p className="text-[10px] font-mono text-slate-500 leading-tight">
              Harbor City Tower · Block C · BIM-REV-12 · Three.js WebGL
            </p>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-900 px-2 py-0.5 rounded-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            RENDERER LIVE
          </span>
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowLegend((s) => !s)}
            title="Toggle Legend"
            className="p-1.5 text-slate-500 hover:text-slate-300 hover:bg-slate-800 rounded-sm transition-colors"
          >
            <Info className="h-4 w-4" />
          </button>
          <button
            onClick={() => setSidebarOpen((s) => !s)}
            title="Toggle Annotations Panel"
            className="hidden md:flex p-1.5 text-slate-500 hover:text-slate-300 hover:bg-slate-800 rounded-sm transition-colors"
          >
            <Layers className="h-4 w-4" />
          </button>
          <button
            onClick={() => setFullscreen((s) => !s)}
            title="Fullscreen"
            className="p-1.5 text-slate-500 hover:text-slate-300 hover:bg-slate-800 rounded-sm transition-colors"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* ── KPI Strip ──────────────────────────────────────────── */}
      <div className="flex items-center border-b border-slate-800 bg-slate-900/80 px-4 py-1.5 gap-6 overflow-x-auto shrink-0">
        {MODEL_KPIS.map((kpi) => (
          <div key={kpi.label} className="flex items-center gap-2 shrink-0">
            {kpi.icon}
            <div>
              <p className="text-sm font-bold font-mono text-slate-100 leading-tight">{kpi.value}</p>
              <p className="text-[10px] font-mono text-slate-500 leading-tight">{kpi.label}</p>
            </div>
            <p className="text-[10px] text-slate-600 font-mono hidden lg:block">· {kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* ── Main Content Area ──────────────────────────────────── */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* ── Canvas Column ────────────────────────────────────── */}
        <div className="relative flex-1 min-w-0">
          {/* Three.js Canvas */}
          <div className="w-full h-full">
            <DigitalTwinCanvas
              ref={canvasRef}
              annotations={annotations}
              layers={layers}
              onElementClick={handleElementClick}
              onAnnotationClick={handleAnnotationClick}
            />
          </div>

          {/* ── Canvas Overlay Toolbar (top-left) ────────────── */}
          <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
            <CameraToolbar onPreset={handleCameraPreset} activePreset={activePreset} />

            {/* Layer Toggle Button */}
            <div className="relative">
              <button
                onClick={() => setShowLayers((s) => !s)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/90 border border-slate-700/80 rounded-sm text-[11px] text-slate-300 hover:text-white hover:bg-slate-800/90 transition-colors"
              >
                <Layers className="h-3.5 w-3.5" />
                <span>Layers</span>
                <span className={`w-1.5 h-1.5 rounded-full ml-0.5 ${Object.values(layers).every(Boolean) ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              </button>
              {showLayers && (
                <div className="absolute top-full mt-1 left-0 z-20">
                  <LayerControlPanel layers={layers} onChange={handleLayerChange} />
                </div>
              )}
            </div>
          </div>

          {/* ── Legend (bottom-left) ─────────────────────────── */}
          {showLegend && (
            <div className="absolute bottom-4 left-3 z-10">
              <ProgressLegend />
            </div>
          )}

          {/* ── Selected Element Info Card ───────────────────── */}
          {selectedElement && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 bg-slate-900/95 border border-slate-700 rounded-sm px-4 py-2.5 flex items-center gap-4 shadow-lg">
              <div>
                <p className="text-xs font-semibold text-slate-100">{selectedElement.label}</p>
                <p className="text-[10px] font-mono text-slate-400">{selectedElement.id}</p>
              </div>
              <button onClick={dismissElement} className="text-slate-500 hover:text-slate-300 transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* ── OrbitControls hint ──────────────────────────── */}
          <div className="absolute bottom-4 right-4 z-10 text-[10px] font-mono text-slate-600 text-right leading-relaxed pointer-events-none">
            <p>Left drag — Orbit</p>
            <p>Right drag — Pan</p>
            <p>Scroll — Zoom</p>
            <p>Click — Select element</p>
          </div>
        </div>

        {/* ── Annotations Sidebar ───────────────────────────────── */}
        {sidebarOpen && (
          <div className="w-72 xl:w-80 shrink-0 overflow-hidden hidden md:flex flex-col border-l border-slate-800">
            <AnnotationsList
              annotations={annotations}
              selectedId={selectedAnnotation?.id}
              onSelect={handleAnnotationSelect}
              onAdd={handleAnnotationAdd}
            />
          </div>
        )}
      </div>
    </div>
  );
}
