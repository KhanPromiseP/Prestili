import { AIProvider } from '../types/providers';
import { PROMPT_TEMPLATES, fillTemplate } from '../prompts/templates';

export interface GlobalMap {
  overview: {
    title: string;
    description: string;
    totalSlides: number;
    totalSections: number;
  };
  sections: {
    id: string;
    title: string;
    slideRange: { start: number; end: number };
    thumbnail: string;
    keyPoints: string[];
  }[];
  navigation: {
    mode: string;
    cameraPoints: {
      slideId: string;
      position: { x: number; y: number };
      zoom: number;
    }[];
  };
}

export class GlobalMapService {
  constructor(private provider: AIProvider) {}

  async generateGlobalMap(structure: any): Promise<GlobalMap> {
    const prompt = fillTemplate(PROMPT_TEMPLATES.GENERATE_GLOBAL_MAP, {
      structure: JSON.stringify(structure),
    });
    return this.provider.generateJSON<GlobalMap>(prompt);
  }

  async generateGlobalMapStream(structure: any): Promise<AsyncGenerator<GlobalMap>> {
    const prompt = fillTemplate(PROMPT_TEMPLATES.GENERATE_GLOBAL_MAP, {
      structure: JSON.stringify(structure),
    });
    return this.provider.generateJSONStream<GlobalMap>(prompt);
  }
}
