export interface ThreatVector {
  category: string;
  score: number;
  benchmark: number;
  description: string;
  status: 'safe' | 'suspicious' | 'critical';
}

export interface ModelInfo {
  model_id: string;
  model_name: string;
  latency_ms: number;
  confidence: number;
  engine_type: 'gemini-ai' | 'heuristic-engine';
}

export interface ModelComparisonResult {
  id: string;
  name: string;
  family: string;
  role: string;
  scam_threat_index: number;
  payment_risk: number;
  domain_risk: number;
  latency_ms: number;
  confidence: number;
  consensus_agreement: number;
  reasoning_focus: string;
}

export interface AttackStage {
  stage: number;
  name: string;
  status: 'detected' | 'high_risk' | 'dormant' | 'clean';
  tactic: string;
  mitre_ref: string;
  evidence: string;
}

export interface FeatureAttribution {
  id: string;
  feature: string;
  weight: number; // e.g. +38 or -25
  category: 'payment' | 'domain' | 'identity' | 'urgency' | 'legitimacy';
  explanation: string;
}

export interface ScamAnalysisResult {
  scam_threat_index: number;
  payment_risk_score: number;
  domain_risk_score: number;
  red_flags: string[];
  verdict: string;
  vectors?: ThreatVector[];
  model_info?: ModelInfo;
  models_comparison?: ModelComparisonResult[];
  attack_stages?: AttackStage[];
  feature_weights?: FeatureAttribution[];
}

export interface PresetSample {
  id: string;
  category: 'job' | 'rental' | 'email' | 'safe';
  title: string;
  subtitle: string;
  badge: string;
  text: string;
}

export interface UploadedFileInfo {
  name: string;
  size: number;
  mimeType: string;
  dataBase64?: string;
  extractedText?: string;
  previewUrl?: string;
}

