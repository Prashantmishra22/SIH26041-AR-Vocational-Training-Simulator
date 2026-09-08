export type Sector = 'MINING' | 'STEEL' | 'MICA';
export type Language = 'hi' | 'sat' | 'en';
export type WorkerStatus = 'CERTIFIED' | 'IN_TRAINING' | 'PENDING' | 'FAILED';
export type ModuleId = 'fire_safety_01' | 'gas_leak_02' | 'ppe_heavy_machinery_03' | 'confined_space_04' | 'electrical_safety_05';

export interface Worker {
  id: string;
  workerId: string;
  name: string;
  phone: string;
  sector: Sector;
  company: string;
  facility: string;
  district: string;
  preferredLanguage: Language;
  experienceYears: number;
  status: WorkerStatus;
  avatarUrl?: string;
  createdAt: string;
  lastActive: string;
  completedModulesCount: number;
  averageScore: number;
  certificates: Certificate[];
  attempts: Attempt[];
}

export interface TrainingModule {
  id: ModuleId;
  title: string;
  titleHindi: string;
  titleSantali: string;
  sector: Sector;
  description: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  estimatedMinutes: number;
  arStepsCount: number;
  questionCount: number;
  passThreshold: number; // e.g. 70
  thumbnailUrl: string;
  complianceStandard: string; // e.g. "DGMS Standard 1952 Sec 22"
  completionRate: number; // e.g. 89.4
  avgScore: number;
  totalTrained: number;
  steps: {
    stepNumber: number;
    title: string;
    description: string;
    arHazardType: string;
    actionRequired: string;
  }[];
}

export interface Attempt {
  id: string;
  workerId: string;
  workerName: string;
  moduleId: ModuleId;
  moduleTitle: string;
  score: number;
  practicalScore: number;
  theoryScore: number;
  passed: boolean;
  timeSpentSeconds: number;
  completedAt: string;
  isOfflineSync: boolean;
  languageUsed: Language;
  answersSummary: {
    total: number;
    correct: number;
    wrong: number;
  };
}

export interface Certificate {
  id: string;
  certificateNumber: string; // e.g. "JH-SAFE-2026-BCCL-08492"
  workerId: string;
  workerName: string;
  workerCompany: string;
  moduleId: ModuleId;
  moduleTitle: string;
  score: number;
  issueDate: string;
  expiryDate: string;
  qrCodeUrl: string;
  verificationHash: string;
  status: 'VALID' | 'EXPIRED' | 'REVOKED';
  issuer: string;
  dgmsReference: string;
}

export interface KPISummary {
  totalWorkers: number;
  activeTrainees: number;
  certifiedWorkers: number;
  complianceRate: number;
  averageScore: number;
  offlineSyncPending: number;
  monthlyGrowthPercent: number;
  passRatePercent: number;
}

export interface DistrictMetric {
  district: string;
  totalWorkers: number;
  certifiedCount: number;
  complianceRate: number;
  primarySector: Sector;
}

export interface LanguageMetric {
  language: Language;
  label: string;
  usersCount: number;
  percentage: number;
}
