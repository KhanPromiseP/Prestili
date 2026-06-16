import { AIProvider } from '../types/providers';
import { PROMPT_TEMPLATES, fillTemplate } from '../prompts/templates';

export interface ContentAnalysis {
  themes: string[];
  structure: {
    sections: { title: string; slideCount: number }[];
    totalSlides: number;
  };
  visualElements: string[];
  tone: string;
  style: string;
}

export class ContentAnalysisService {
  constructor(private provider: AIProvider) {}

  async analyzeContent(content: string): Promise<ContentAnalysis> {
    const prompt = fillTemplate(PROMPT_TEMPLATES.ANALYZE_CONTENT, { content });
    return this.provider.generateJSON<ContentAnalysis>(prompt);
  }

  async analyzeContentStream(content: string): Promise<AsyncGenerator<ContentAnalysis>> {
    const prompt = fillTemplate(PROMPT_TEMPLATES.ANALYZE_CONTENT, { content });
    return this.provider.generateJSONStream<ContentAnalysis>(prompt);
  }
}
