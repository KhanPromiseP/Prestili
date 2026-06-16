import { AIProvider } from '../types/providers';
import { PROMPT_TEMPLATES, fillTemplate } from '../prompts/templates';

export interface DesignSpecifications {
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  fontFamily: string;
  fontSize: number;
  layout: string;
  elementStyles: {
    headings: { fontSize: number; fontWeight: string; color: string };
    body: { fontSize: number; fontWeight: string; color: string };
    bulletPoints: { fontSize: number; color: string };
  };
  spacing: {
    padding: number;
    margin: number;
    lineHeight: number;
  };
}

export interface DesignSystemOptions {
  primaryColor: string;
  secondaryColor: string;
  typography: string;
  layoutStyle: string;
  visualStyle: string;
  content: string;
}

export class DesignSystemService {
  constructor(private provider: AIProvider) {}

  async applyDesignSystem(options: DesignSystemOptions): Promise<DesignSpecifications> {
    const prompt = fillTemplate(PROMPT_TEMPLATES.APPLY_DESIGN_SYSTEM, {
      primaryColor: options.primaryColor,
      secondaryColor: options.secondaryColor,
      typography: options.typography,
      layoutStyle: options.layoutStyle,
      visualStyle: options.visualStyle,
      content: options.content,
    });
    return this.provider.generateJSON<DesignSpecifications>(prompt);
  }

  async applyDesignSystemStream(options: DesignSystemOptions): Promise<AsyncGenerator<DesignSpecifications>> {
    const prompt = fillTemplate(PROMPT_TEMPLATES.APPLY_DESIGN_SYSTEM, {
      primaryColor: options.primaryColor,
      secondaryColor: options.secondaryColor,
      typography: options.typography,
      layoutStyle: options.layoutStyle,
      visualStyle: options.visualStyle,
      content: options.content,
    });
    return this.provider.generateJSONStream<DesignSpecifications>(prompt);
  }
}
