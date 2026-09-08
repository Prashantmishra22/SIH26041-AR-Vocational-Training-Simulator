import React, { useState } from 'react';
import { TrainingModule } from '../types';
import { Layers, Flame, ShieldAlert, CheckCircle2, Play, Sparkles, Clock, HelpCircle, HardHat, Compass } from 'lucide-react';

interface TrainingPageProps {
  modules: TrainingModule[];
}

export const TrainingPage: React.FC<TrainingPageProps> = ({ modules }) => {
  const [selectedModule, setSelectedModule] = useState<TrainingModule>(modules[0]);
  const [selectedStepIndex, setSelectedStepIndex] = useState<number>(0);

  const activeStep = selectedModule.steps[selectedStepIndex] || selectedModule.steps[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center space-x-2">
            <Layers className="w-6 h-6 text-amber-400" />
            <span>Augmented Reality Safety Training Curriculum</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Interactive AR hazard simulations, step sequences, and localized voice guidance for Jharkhand industries
          </p>
        </div>
      </div>

      {/* Module Selector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {modules.map((m) => {
          const isSelected = selectedModule.id === m.id;
          return (
            <div
              key={m.id}
              onClick={() => {
                setSelectedModule(m);
                setSelectedStepIndex(0);
              }}
              className={`glass-card rounded-2xl p-5 border transition-all cursor-pointer relative overflow-hidden group ${
                isSelected
                  ? 'border-amber-500 bg-amber-500/5 shadow-xl shadow-amber-500/10 ring-1 ring-amber-500'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {m.sector}
                </span>
                <span className="text-xs font-bold text-amber-400 font-['JetBrains_Mono',monospace]">
                  {m.arStepsCount} AR Tasks
                </span>
              </div>

              <h3 className="text-base font-bold text-white mt-3 group-hover:text-amber-300 transition-colors">
                {m.title}
              </h3>
              <p className="text-xs text-amber-400/90 font-medium mt-0.5">{m.titleHindi}</p>
              <p className="text-[11px] text-purple-300/80 mt-0.5">{m.titleSantali}</p>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{m.estimatedMinutes} mins</span>
                </span>
                <span className="text-emerald-400 font-bold font-['JetBrains_Mono',monospace]">
                  {m.completionRate}% Completion
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive AR Task Step Inspector */}
      <div className="glass-card rounded-2xl border border-slate-800 p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-6 border-b border-slate-800 gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-amber-500/20 text-amber-300 text-xs font-bold px-2.5 py-0.5 rounded border border-amber-500/30">
                STEP-BY-STEP AR SIMULATION BREAKDOWN
              </span>
              <span className="text-xs text-slate-400">{selectedModule.complianceStandard}</span>
            </div>
            <h2 className="text-xl font-bold text-white mt-2">{selectedModule.title}</h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">{selectedModule.description}</p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1.5 rounded-xl border border-slate-700">
              Pass Threshold: <strong className="text-emerald-400 font-['JetBrains_Mono',monospace]">{selectedModule.passThreshold}%</strong>
            </span>
          </div>
        </div>

        {/* Steps Stepper Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto py-4 border-b border-slate-800/60">
          {selectedModule.steps.map((step, idx) => {
            const isStepActive = idx === selectedStepIndex;
            return (
              <button
                key={step.stepNumber}
                onClick={() => setSelectedStepIndex(idx)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isStepActive
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800 hover:bg-slate-800'
                }`}
              >
                <span>Task {step.stepNumber}</span>
                <span className="text-[10px] opacity-80 truncate max-w-[120px]">{step.title}</span>
              </button>
            );
          })}
        </div>

        {/* Active Step Details & Simulation Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Step Metadata & Instructions */}
          <div className="space-y-4">
            <div className="bg-slate-900/90 rounded-xl p-5 border border-slate-800 space-y-3">
              <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                <ShieldAlert className="w-4 h-4" />
                <span>Simulated Industrial Hazard</span>
              </div>
              <h3 className="text-base font-bold text-white">{activeStep.title}</h3>
              <p className="text-xs text-rose-400 font-semibold bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/20">
                Hazard: {activeStep.arHazardType}
              </p>
              <p className="text-xs text-slate-300 leading-relaxed">{activeStep.description}</p>
            </div>

            <div className="bg-slate-900/90 rounded-xl p-5 border border-slate-800 space-y-2">
              <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4" />
                <span>Mandatory Worker AR Action</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                {activeStep.actionRequired}
              </p>
            </div>
          </div>

          {/* AR Viewport Simulator Preview Box */}
          <div className="relative rounded-2xl bg-black/60 border border-slate-800 overflow-hidden flex flex-col items-center justify-center p-8 min-h-[260px] text-center">
            {/* AR Crosshair HUD Overlay */}
            <div className="absolute inset-0 pointer-events-none hazard-stripes opacity-10"></div>
            <div className="w-24 h-24 rounded-full border-2 border-dashed border-amber-500/50 flex items-center justify-center animate-pulse mb-3">
              <Compass className="w-10 h-10 text-amber-400" />
            </div>

            <span className="text-xs font-bold text-amber-300 font-['JetBrains_Mono',monospace] tracking-wider uppercase">
              AR Surface Detection & Tracking Active
            </span>
            <p className="text-[11px] text-slate-400 max-w-sm mt-1">
              Mid-range smartphone camera tracking plane geometry without wearable headset.
            </p>
            <div className="mt-4 flex items-center space-x-3 text-[10px] text-slate-500">
              <span>Resolution: 1080p 60fps</span>
              <span>•</span>
              <span>Audio: Hindi / Santali TTS</span>
              <span>•</span>
              <span>Fallback: 3D Touch Mode</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
