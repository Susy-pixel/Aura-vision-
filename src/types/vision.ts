export type ConfidenceLevel = 'HIGH CONFIDENCE' | 'MEDIUM CONFIDENCE' | 'LOW CONFIDENCE' | 'INCONCLUSIVE';
export type ImageQuality = 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Insufficient';

export interface DetectedEntity {
  id: string;
  name: string;
  confidence: 'High' | 'Medium' | 'Low';
  description: string;
  boundingBox?: {
    ymin: number;
    xmin: number;
    ymax: number;
    xmax: number;
  };
}

export interface PossibleAlternative {
  label: string;
  whyPossible: string;
}

export interface VisualAttributes {
  colorPalette: string[];
  shapeGeometry: string;
  texture: string;
  approximateSizeCategory: string;
  patterns: string;
  materials: string;
  distinctiveCharacteristics: string[];
}

export interface AnalysisResponseData {
  primaryIdentification: string;
  category: string;
  confidenceLevel: ConfidenceLevel;
  imageQuality: ImageQuality;
  qualityDetails: string;
  qualityWarning: string | null;
  description: string;
  sceneContext: string;
  visibleEvidence: string[];
  whyThisResult: string;
  attributes: VisualAttributes;
  detectedObjects: DetectedEntity[];
  possibleAlternatives: PossibleAlternative[];
  ambiguityWarning: string | null;
  inconclusiveReason: string | null;
}

export interface AnalysisRecord {
  id: string;
  timestamp: string;
  imageThumb: string;
  imageFull: string;
  fileName: string;
  fileSize: number;
  result: AnalysisResponseData;
}

export interface DemoPreset {
  id: string;
  title: string;
  category: string;
  description: string;
  imageSrc: string;
  expectedConfidence: ConfidenceLevel;
  difficultyNote?: string;
  isUncertaintyTest?: boolean;
}
