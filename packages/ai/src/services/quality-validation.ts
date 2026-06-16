import { AIProvider } from '../types/providers';
import { PROMPT_TEMPLATES, fillTemplate } from '../prompts/templates';

export interface QualityValidation {
  score: number;
  issues: {
    type: string;
    severity: 'low' | 'medium' | 'high';
    message: string;
    suggestion: string;
  }[];
  strengths: string[];
  improvements: string[];
}

export interface QualityValidationOptions {
  content: string;
  design: any;
}

export class QualityValidationService {
  constructor(private provider: AIProvider) {}

  async validateQuality(options: QualityValidationOptions): Promise<QualityValidation> {
    const prompt = fillTemplate(PROMPT_TEMPLATES.VALIDATE_QUALITY, {
      content: options.content,
      design: JSON.stringify(options.design),
    });
    return this.provider.generateJSON<QualityValidation>(prompt);
  }

  async validateQualityStream(options: QualityValidationOptions): Promise<AsyncGenerator<QualityValidation>> {
    const prompt = fillTemplate(PROMPT_TEMPLATES.VALIDATE_QUALITY, {
      content: options.content,
      design: JSON.stringify(options.design),
    });
    return this.provider.generateJSONStream<QualityValidation>(prompt);
  }
}
