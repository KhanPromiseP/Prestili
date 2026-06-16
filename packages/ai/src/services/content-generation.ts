import { AIProvider } from '../types/providers';
import { PROMPT_TEMPLATES, fillTemplate } from '../prompts/templates';

export interface SlideContent {
  title: string;
  subtitle: string;
  bodyText: string[];
  bulletPoints: string[];
  callToAction: string;
  suggestedVisuals: string[];
}

export interface ContentGenerationOptions {
  title: string;
  description: string;
  audience: string;
  tone: string;
}

export class ContentGenerationService {
  constructor(private provider: AIProvider) {}

  async generateSlideContent(options: ContentGenerationOptions): Promise<SlideContent> {
    const prompt = fillTemplate(PROMPT_TEMPLATES.GENERATE_SLIDE_CONTENT, {
      title: options.title,
      description: options.description,
      audience: options.audience,
      tone: options.tone,
    });
    return this.provider.generateJSON<SlideContent>(prompt);
  }

  async generateSlideContentStream(options: ContentGenerationOptions): Promise<AsyncGenerator<SlideContent>> {
    const prompt = fillTemplate(PROMPT_TEMPLATES.GENERATE_SLIDE_CONTENT, {
      title: options.title,
      description: options.description,
      audience: options.audience,
      tone: options.tone,
    });
    return this.provider.generateJSONStream<SlideContent>(prompt);
  }

  async rewriteContent(content: string, audience: string, tone: string, goal: string): Promise<SlideContent> {
    const prompt = fillTemplate(PROMPT_TEMPLATES.REWRITE_CONTENT, {
      content,
      audience,
      tone,
      goal,
    });
    return this.provider.generateJSON<SlideContent>(prompt);
  }

  async rewriteContentStream(content: string, audience: string, tone: string, goal: string): Promise<AsyncGenerator<SlideContent>> {
    const prompt = fillTemplate(PROMPT_TEMPLATES.REWRITE_CONTENT, {
      content,
      audience,
      tone,
      goal,
    });
    return this.provider.generateJSONStream<SlideContent>(prompt);
  }

  async summarizeContent(content: string, maxLength: number): Promise<{ summary: string; keyPoints: string[]; wordCount: number }> {
    const prompt = fillTemplate(PROMPT_TEMPLATES.SUMMARIZE_CONTENT, {
      content,
      maxLength: maxLength.toString(),
    });
    return this.provider.generateJSON<{ summary: string; keyPoints: string[]; wordCount: number }>(prompt);
  }
}
