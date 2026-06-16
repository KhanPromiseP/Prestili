import { AIProvider } from '../types/providers';
import { PROMPT_TEMPLATES, fillTemplate } from '../prompts/templates';

export interface PresentationStructure {
  title: string;
  sections: {
    id: string;
    title: string;
    description: string;
    slides: {
      id: string;
      title: string;
      description: string;
      suggestedElements: string[];
      estimatedDuration: number;
    }[];
  }[];
  totalSlides: number;
  estimatedDuration: number;
}

export interface StructureGenerationOptions {
  topic?: string;
  content?: string;
  inputType?: 'topic' | 'text' | 'upload';
  audience?: string;
  duration?: number;
  purpose?: string;
  useAIKnowledge?: boolean;
  slideCount?: number;
}

export class StructureGenerationService {
  constructor(private provider: AIProvider) {}

  async generateStructure(options: StructureGenerationOptions): Promise<PresentationStructure> {
    const prompt = fillTemplate(PROMPT_TEMPLATES.GENERATE_STRUCTURE, {
      topic: options.topic || (options.content ? 'Content-based presentation' : 'General presentation'),
      audience: options.audience || 'General audience',
      duration: options.duration?.toString() || '10',
      purpose: options.purpose || 'Informative',
    });
    return this.provider.generateJSON<PresentationStructure>(prompt);
  }

  async generateStructureStream(options: StructureGenerationOptions): Promise<AsyncGenerator<PresentationStructure>> {
    const prompt = fillTemplate(PROMPT_TEMPLATES.GENERATE_STRUCTURE, {
      topic: options.topic || (options.content ? 'Content-based presentation' : 'General presentation'),
      audience: options.audience || 'General audience',
      duration: options.duration?.toString() || '10',
      purpose: options.purpose || 'Informative',
    });
    return this.provider.generateJSONStream<PresentationStructure>(prompt);
  }
}
