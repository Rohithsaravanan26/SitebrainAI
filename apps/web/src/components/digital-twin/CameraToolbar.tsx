import * as React from 'react';
import { Box, Mountain, Square, RotateCcw, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CameraPreset } from './DigitalTwinCanvas';

interface CameraToolbarProps {
  onPreset: (preset: CameraPreset) => void;
  activePreset?: CameraPreset;
}

const PRESETS: { id: CameraPreset; label: string; icon: React.ReactNode; shortcut: string }[] = [
  { id: 'isometric', label: 'Isometric', icon: <Box className="h-3.5 w-3.5" />, shortcut: '1' },
  { id: 'top', label: 'Top Plan', icon: <Square className="h-3.5 w-3.5" />, shortcut: '2' },
  { id: 'front', label: 'Elevation', icon: <Mountain className="h-3.5 w-3.5" />, shortcut: '3' },
  { id: 'reset', label: 'Reset', icon: <RotateCcw className="h-3.5 w-3.5" />, shortcut: 'R' },
];

export const CameraToolbar: React.FC<CameraToolbarProps> = ({
  onPreset,
  activePreset = 'isometric',
}) => {
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === '1') onPreset('isometric');
      if (e.key === '2') onPreset('top');
      if (e.key === '3') onPreset('front');
      if (e.key === 'r' || e.key === 'R') onPreset('reset');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onPreset]);

  return (
    <div className="flex items-center gap-1 bg-slate-900/90 border border-slate-700/80 rounded-sm px-1.5 py-1 backdrop-blur-none">
      <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 px-1.5 shrink-0">
        VIEW
      </span>
      <div className="w-px h-4 bg-slate-700" />
      {PRESETS.map((preset) => (
        <button
          key={preset.id}
          onClick={() => onPreset(preset.id)}
          title={`${preset.label} (${preset.shortcut})`}
          className={cn(
            'flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm text-[11px] font-medium transition-colors',
            activePreset === preset.id
              ? 'bg-orange-700 text-white'
              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
          )}
        >
          {preset.icon}
          <span className="hidden sm:inline">{preset.label}</span>
          <kbd className="hidden lg:inline text-[9px] font-mono bg-slate-700/80 text-slate-400 px-1 py-px rounded-sm ml-0.5">
            {preset.shortcut}
          </kbd>
        </button>
      ))}
    </div>
  );
};
