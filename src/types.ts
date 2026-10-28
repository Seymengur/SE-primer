export type ExperienceLevel = 'beginner' | 'intermediate' | 'experienced';

export type UserRole = 'backend' | 'frontend' | 'devops' | 'fullstack';

export type LearningGoal = 'recovery' | 'architecture' | 'kvkk';

export type DecisionStepId = 1 | 2 | 3;

export type ChoiceKey = 'A' | 'B';

export interface DecisionChoice {
  key: ChoiceKey;
  title: string;
  subtitle: string;
  description: string;
  technicalDetails: string;
  badge: string;
  badgeColor: string;
}

export interface DecisionStep {
  id: DecisionStepId;
  category: string;
  title: string;
  timestamp: string;
  context: string;
  choices: {
    A: DecisionChoice;
    B: DecisionChoice;
  };
  beginnerHint: string;
  consequences: {
    A: {
      whatHappened: string;
      whyItHappened: string;
      technicalLog: string;
      downtimeDeltaMinutes: number;
      patientsWaitingDelta: number;
      systemHealthDelta: number;
      kvkkRiskLevel: 'low' | 'medium' | 'high' | 'critical';
    };
    B: {
      whatHappened: string;
      whyItHappened: string;
      technicalLog: string;
      downtimeDeltaMinutes: number;
      patientsWaitingDelta: number;
      systemHealthDelta: number;
      kvkkRiskLevel: 'low' | 'medium' | 'high' | 'critical';
    };
  };
}

export interface UserPreferences {
  level: ExperienceLevel;
  role: UserRole;
  goal: LearningGoal;
}

export interface SimulationState {
  screen: 'onboarding' | 'crisis' | 'consequence' | 'outcome';
  preferences: UserPreferences;
  currentStepId: DecisionStepId;
  choicesMade: Record<number, ChoiceKey>;
  lastChoice?: ChoiceKey;
  timeRemainingSeconds: number;
  patientsWaiting: number;
  downtimeMinutes: number;
  systemHealth: number; // 0 - 100
  kvkkViolationsCount: number;
  timerActive: boolean;
}

export interface TutorMessage {
  id: string;
  role: 'user' | 'tutor';
  text: string;
  timestamp: string;
  isGuidingQuestion?: boolean;
}

export interface EvalSample {
  id: number;
  studentQuery: string;
  tutorResponse: string;
  errorType: 'Hata Yok' | 'Doğrudan Cevap Sızdırma' | 'Zayıf Yönlendirme' | 'Kapsam Dışı';
  status: 'GEÇTİ' | 'KALDI';
  comment: string;
}
