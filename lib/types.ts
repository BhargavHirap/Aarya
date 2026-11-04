export type Language = 'mr' | 'en';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: number;
  status?: 'sending' | 'sent' | 'failed';
}

export interface ChatResponse {
  reply: string;
  language: Language;
  source: 'ai' | 'fallback';
}

export interface Scheme {
  id: string;
  nameMr: string;
  nameEn: string;
  category: string;
  summaryMr: string;
  summaryEn: string;
  eligibilityMr: string;
  eligibilityEn: string;
  documents: string[];
  applicationStepsMr: string[];
  applicationStepsEn: string[];
  officialUrl: string;
  lastVerified: string;
  sourceLabel: string;
}

export interface EligibilityAnswers {
  helpType: string;
  state: string;
  status: string;
  aware: string;
  documents: string[];
}

export interface EligibilityResult {
  preliminary: true;
  notice: string;
  guidance: string;
  nextSteps: string[];
  checklist: string[];
  verifyAt: string;
}
