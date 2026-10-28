import React, { useState, useEffect } from 'react';
import {
  SimulationState,
  UserPreferences,
  DecisionStepId,
  ChoiceKey,
} from './types';
import { DECISION_STEPS } from './data/scenarioData';
import { Navbar } from './components/Navbar';
import { Onboarding } from './components/Onboarding';
import { CrisisHeader } from './components/CrisisHeader';
import { DecisionCard } from './components/DecisionCard';
import { ConsequenceModal } from './components/ConsequenceModal';
import { OutcomeScreen } from './components/OutcomeScreen';
import { DeliverablesModal } from './components/DeliverablesModal';
import { setMuted, getMuted, playTensionTick, playAlertSound, playClickSound } from './utils/audio';

const INITIAL_PREFERENCES: UserPreferences = {
  level: 'beginner',
  role: 'backend',
  goal: 'recovery',
};

const INITIAL_STATE: SimulationState = {
  screen: 'onboarding',
  preferences: INITIAL_PREFERENCES,
  currentStepId: 1,
  choicesMade: {},
  lastChoice: undefined,
  timeRemainingSeconds: 60,
  patientsWaiting: 300,
  downtimeMinutes: 0,
  systemHealth: 20,
  kvkkViolationsCount: 0,
  timerActive: false,
};

export default function App() {
  const [state, setState] = useState<SimulationState>(INITIAL_STATE);
  const [isDeliverablesOpen, setIsDeliverablesOpen] = useState(false);
  const [isMutedLocal, setIsMutedLocal] = useState(getMuted());
  const [isMobileView, setIsMobileView] = useState(true);

  // 60-Second countdown timer for "experienced" mode
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (
      state.screen === 'crisis' &&
      state.preferences.level === 'experienced' &&
      state.timeRemainingSeconds > 0
    ) {
      timer = setInterval(() => {
        setState((prev) => {
          if (prev.timeRemainingSeconds <= 1) {
            // Time ran out! Auto-select risky B choice
            playAlertSound();
            const currentStep = DECISION_STEPS.find((s) => s.id === prev.currentStepId)!;
            const consequence = currentStep.consequences.B;

            return {
              ...prev,
              timeRemainingSeconds: 0,
              screen: 'consequence',
              lastChoice: 'B',
              choicesMade: { ...prev.choicesMade, [prev.currentStepId]: 'B' },
              patientsWaiting: Math.max(0, prev.patientsWaiting + consequence.patientsWaitingDelta),
              systemHealth: Math.max(0, Math.min(100, prev.systemHealth + consequence.systemHealthDelta)),
              downtimeMinutes: prev.downtimeMinutes + consequence.downtimeDeltaMinutes,
            };
          }

          if (prev.timeRemainingSeconds <= 10) {
            playTensionTick();
          }

          return {
            ...prev,
            timeRemainingSeconds: prev.timeRemainingSeconds - 1,
          };
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [state.screen, state.preferences.level, state.currentStepId, state.timeRemainingSeconds]);

  const handleStartSimulation = () => {
    setState((prev) => ({
      ...prev,
      screen: 'crisis',
      currentStepId: 1,
      choicesMade: {},
      lastChoice: undefined,
      timeRemainingSeconds: 60,
      patientsWaiting: 300,
      systemHealth: 20,
      downtimeMinutes: 0,
    }));
  };

  const handleSelectChoice = (key: ChoiceKey) => {
    const currentStep = DECISION_STEPS.find((s) => s.id === state.currentStepId)!;
    const consequence = currentStep.consequences[key];

    setState((prev) => ({
      ...prev,
      screen: 'consequence',
      lastChoice: key,
      choicesMade: { ...prev.choicesMade, [prev.currentStepId]: key },
      patientsWaiting: Math.max(0, prev.patientsWaiting + consequence.patientsWaitingDelta),
      systemHealth: Math.max(0, Math.min(100, prev.systemHealth + consequence.systemHealthDelta)),
      downtimeMinutes: prev.downtimeMinutes + consequence.downtimeDeltaMinutes,
      kvkkViolationsCount:
        consequence.kvkkRiskLevel === 'critical'
          ? prev.kvkkViolationsCount + 1
          : prev.kvkkViolationsCount,
    }));
  };

  const handleProceedAfterConsequence = () => {
    if (state.currentStepId >= 3) {
      // Completed all 3 decisions, show outcome!
      setState((prev) => ({
        ...prev,
        screen: 'outcome',
      }));
    } else {
      const nextStepId = (state.currentStepId + 1) as DecisionStepId;
      setState((prev) => ({
        ...prev,
        screen: 'crisis',
        currentStepId: nextStepId,
        timeRemainingSeconds: 60,
        lastChoice: undefined,
      }));
    }
  };

  const handleReset = () => {
    setState(INITIAL_STATE);
  };

  const handleToggleMute = () => {
    const nextMuted = !isMutedLocal;
    setIsMutedLocal(nextMuted);
    setMuted(nextMuted);
  };

  const currentStep = DECISION_STEPS.find((s) => s.id === state.currentStepId) || DECISION_STEPS[0];

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Global Navigation */}
      <Navbar
        isMuted={isMutedLocal}
        onToggleMute={handleToggleMute}
        isMobileView={isMobileView}
        onToggleMobileView={() => setIsMobileView(!isMobileView)}
        onOpenDeliverables={() => setIsDeliverablesOpen(true)}
        onReset={handleReset}
      />

      {/* Main Content Area: Supports realistic Mobile Phone Simulator or Full Responsive View */}
      <main className="flex-1 flex flex-col items-center justify-start p-0 sm:p-4">
        {isMobileView ? (
          /* Realistic Phone Mockup Frame */
          <div className="w-full max-w-[440px] sm:max-w-[430px] my-1 sm:my-5 bg-slate-950 border-4 sm:border-[8px] border-slate-800 rounded-3xl sm:rounded-[48px] shadow-2xl overflow-hidden flex flex-col h-[calc(100vh-4.5rem)] sm:h-[800px] ring-1 ring-slate-700/50">
            {/* Phone Top Notch / Dynamic Island */}
            <div className="h-7 bg-slate-950 flex items-center justify-center pt-1 select-none shrink-0 border-b border-slate-900">
              <div className="w-24 h-4 bg-black rounded-full flex items-center justify-end px-2">
                <div className="w-2 h-2 rounded-full bg-slate-900 border border-slate-800" />
              </div>
            </div>

            {/* Inner Phone Screen */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col pb-6 bg-[#090d16]">
              {state.screen === 'onboarding' && (
                <Onboarding
                  preferences={state.preferences}
                  onChangePreferences={(prefs) => setState((p) => ({ ...p, preferences: prefs }))}
                  onStartSimulation={handleStartSimulation}
                />
              )}

              {(state.screen === 'crisis' || state.screen === 'consequence') && (
                <>
                  <CrisisHeader
                    currentStepId={state.currentStepId}
                    timestamp={currentStep.timestamp}
                    patientsWaiting={state.patientsWaiting}
                    timeRemainingSeconds={state.timeRemainingSeconds}
                    preferences={state.preferences}
                    systemHealth={state.systemHealth}
                  />
                  <DecisionCard
                    step={currentStep}
                    preferences={state.preferences}
                    onSelectChoice={handleSelectChoice}
                  />
                </>
              )}

              {state.screen === 'outcome' && (
                <OutcomeScreen
                  state={state}
                  onReset={handleReset}
                />
              )}
            </div>

            {/* Phone Bottom Home Indicator */}
            <div className="h-5 bg-slate-950 flex items-center justify-center select-none shrink-0 border-t border-slate-900">
              <div className="w-32 h-1 bg-slate-700 rounded-full" />
            </div>
          </div>
        ) : (
          /* Full Responsive View */
          <div className="w-full max-w-4xl flex-1 flex flex-col">
            {state.screen === 'onboarding' && (
              <Onboarding
                preferences={state.preferences}
                onChangePreferences={(prefs) => setState((p) => ({ ...p, preferences: prefs }))}
                onStartSimulation={handleStartSimulation}
              />
            )}

            {(state.screen === 'crisis' || state.screen === 'consequence') && (
              <>
                <CrisisHeader
                  currentStepId={state.currentStepId}
                  timestamp={currentStep.timestamp}
                  patientsWaiting={state.patientsWaiting}
                  timeRemainingSeconds={state.timeRemainingSeconds}
                  preferences={state.preferences}
                  systemHealth={state.systemHealth}
                />
                <DecisionCard
                  step={currentStep}
                  preferences={state.preferences}
                  onSelectChoice={handleSelectChoice}
                />
              </>
            )}

            {state.screen === 'outcome' && (
              <OutcomeScreen
                state={state}
                onReset={handleReset}
              />
            )}
          </div>
        )}
      </main>

      {/* Consequence Modal (Ne Oldu? Neden Oldu?) */}
      {state.screen === 'consequence' && state.lastChoice && (
        <ConsequenceModal
          step={currentStep}
          choiceKey={state.lastChoice}
          onProceed={handleProceedAfterConsequence}
          isLastStep={state.currentStepId === 3}
        />
      )}

      {/* Assignment Deliverables Modal (spec.md, DESIGN.md, 20-sample Eval, Cypress, README) */}
      <DeliverablesModal
        isOpen={isDeliverablesOpen}
        onClose={() => setIsDeliverablesOpen(false)}
      />
    </div>
  );
}
