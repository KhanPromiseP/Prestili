export interface GenerationInput {
  type: 'title' | 'prompt' | 'outline' | 'notes' | 'text' | 'upload';
  content: string;
  options?: GenerationOptions;
}

export interface GenerationOptions {
  slideCount?: number;
  audience?: string;
  tone?: string;
  industry?: string;
  duration?: number;
}

export interface GenerationOutput {
  presentation: any;
  structure: any;
  design: any;
}

export interface DesignRequest {
  content: any;
  theme?: string;
  style?: string;
}

export interface RewriteRequest {
  content: string;
  instruction: string;
  tone?: string;
}

export interface SummarizeRequest {
  content: string;
  maxLength?: number;
}

export interface AssetContext {
  topic: string;
  slideId: string;
  elementType: string;
  style?: string;
}

export interface AssetSuggestion {
  type: 'image' | 'icon' | 'chart';
  url: string;
  source: string;
  relevance: number;
}
