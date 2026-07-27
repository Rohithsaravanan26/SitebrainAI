import * as React from 'react';
import { Cloud, CloudRain, Wind, Thermometer, Eye, Droplets } from 'lucide-react';
import { WidgetShell } from '../shared/WidgetShell';

export const WeatherWidget: React.FC = () => {
  return (
    <WidgetShell
      title="Site Weather"
      subtitle="Sydney CBD • Live feed pending"
      action={
        <span className="text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded-sm">
          API NOT CONNECTED
        </span>
      }
    >
      {/* Current Conditions */}
      <div className="flex items-start gap-4 mb-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-slate-100 dark:bg-slate-800 shrink-0">
          <Cloud className="h-7 w-7 text-slate-400" />
        </div>
        <div>
          <div className="text-3xl font-bold font-mono text-slate-900 dark:text-slate-100">
            --°C
          </div>
          <p className="text-xs text-slate-500 font-mono">Partly Cloudy — Placeholder</p>
        </div>
      </div>

      {/* Metric Grid */}
      <div className="grid grid-cols-2 gap-2">
        {[
          {
            icon: <Wind className="h-3.5 w-3.5" />,
            label: 'Wind Speed',
            value: '-- km/h',
            note: 'Crane ops threshold: 72km/h',
          },
          {
            icon: <Droplets className="h-3.5 w-3.5" />,
            label: 'Humidity',
            value: '--%',
            note: 'Concrete pour threshold',
          },
          {
            icon: <CloudRain className="h-3.5 w-3.5" />,
            label: 'Precipitation',
            value: '-- mm',
            note: '24-hour forecast',
          },
          {
            icon: <Eye className="h-3.5 w-3.5" />,
            label: 'Visibility',
            value: '-- km',
            note: 'Site safety threshold: 1km',
          },
        ].map((item) => (
          <div
            key={item.label}
            className="p-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-sm"
          >
            <div className="flex items-center gap-1.5 text-slate-500 mb-1">
              {item.icon}
              <span className="text-[10px] font-medium uppercase tracking-wider">{item.label}</span>
            </div>
            <p className="text-base font-bold font-mono text-slate-400 dark:text-slate-500">
              {item.value}
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">{item.note}</p>
          </div>
        ))}
      </div>

      {/* Integration Notice */}
      <div className="mt-3 p-2 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-sm text-[11px] text-amber-800 dark:text-amber-300 font-mono">
        Connect Bureau of Meteorology / OpenWeatherMap API to populate live site weather and crane
        wind hold alerts.
      </div>
    </WidgetShell>
  );
};
