'use client';

import { useState } from 'react';
import BusinessIntentForm from './BusinessIntentForm';
import StrategyCards from './StrategyCards';
import NegotiationPanel from './NegotiationPanel';
import BusinessBlueprint from './BusinessBlueprint';

const STEPS = [
  { id: 1, label: 'Business Intent', icon: '🎯' },
  { id: 2, label: 'AI Strategy', icon: '🧠' },
  { id: 3, label: 'Negotiate & Source', icon: '🤝' },
  { id: 4, label: 'Business Blueprint', icon: '📋' },
];

export default function ProWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [wizardData, setWizardData] = useState({
    wasteType: '',
    investmentLimit: 200000,
    category: '',
    strategies: [],
    selectedStrategy: null,
    matchedListings: [],
    acceptedDeals: [],
    blueprint: null,
  });

  const updateData = (updates) => {
    setWizardData((prev) => ({ ...prev, ...updates }));
  };

  const goToStep = (step) => {
    if (step >= 1 && step <= 4) setCurrentStep(step);
  };

  return (
    <div className="min-h-screen pro-dark-bg">
      {/* Hero header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 to-transparent pointer-events-none" />
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-yellow-400/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6 relative z-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-widest mb-4">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              Powered by Gemini AI Pro
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              <span className="gold-shimmer-text">Go Pro</span>
              <span className="text-slate-300 ml-3">Business Automation</span>
            </h1>
            <p className="text-slate-400 mt-3 max-w-2xl mx-auto">
              AI-powered strategy, automated negotiation, and complete business blueprints — all from your waste idea.
            </p>
          </div>

          {/* Step indicator */}
          <div className="flex items-center justify-center gap-0 max-w-3xl mx-auto">
            {STEPS.map((step, idx) => {
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;

              return (
                <div key={step.id} className="flex items-center flex-1">
                  <button
                    onClick={() => {
                      if (isCompleted) goToStep(step.id);
                    }}
                    disabled={!isCompleted && !isActive}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300 w-full justify-center ${
                      isActive
                        ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-black shadow-lg shadow-amber-500/25 scale-105'
                        : isCompleted
                        ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 cursor-pointer'
                        : 'bg-slate-800/50 text-slate-500'
                    }`}
                  >
                    <span className="text-lg">{isCompleted ? '✓' : step.icon}</span>
                    <span className="hidden sm:inline text-xs font-bold">{step.label}</span>
                  </button>
                  {idx < STEPS.length - 1 && (
                    <div
                      className={`h-0.5 w-6 flex-shrink-0 mx-1 rounded ${
                        isCompleted ? 'bg-amber-500' : 'bg-slate-700'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Step content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="animate-fade-in-up">
          {currentStep === 1 && (
            <BusinessIntentForm
              data={wizardData}
              onUpdate={updateData}
              onNext={() => goToStep(2)}
            />
          )}
          {currentStep === 2 && (
            <StrategyCards
              data={wizardData}
              onUpdate={updateData}
              onNext={() => goToStep(3)}
              onBack={() => goToStep(1)}
            />
          )}
          {currentStep === 3 && (
            <NegotiationPanel
              data={wizardData}
              onUpdate={updateData}
              onNext={() => goToStep(4)}
              onBack={() => goToStep(2)}
            />
          )}
          {currentStep === 4 && (
            <BusinessBlueprint
              data={wizardData}
              onUpdate={updateData}
              onBack={() => goToStep(3)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
