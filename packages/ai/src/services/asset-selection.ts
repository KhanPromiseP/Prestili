import { AIProvider } from '../types/providers';
import { PROMPT_TEMPLATES, fillTemplate } from '../prompts/templates';

export interface AssetSuggestions {
  images: {
    description: string;
    keywords: string[];
    style: string;
    position: string;
  }[];
  icons: {
    name: string;
    keywords: string[];
    style: string;
  }[];
  charts: {
    type: string;
    data: any;
    description: string;
  }[];
}

export interface AssetSelectionOptions {
  content: string;
  theme: string;
  style: string;
}

export class AssetSelectionService {
  constructor(private provider: AIProvider) {}

  async suggestAssets(options: AssetSelectionOptions): Promise<AssetSuggestions> {
    const prompt = fillTemplate(PROMPT_TEMPLATES.SUGGEST_ASSETS, {
      content: options.content,
      theme: options.theme,
      style: options.style,
    });
    return this.provider.generateJSON<AssetSuggestions>(prompt);
  }

  async suggestAssetsStream(options: AssetSelectionOptions): Promise<AsyncGenerator<AssetSuggestions>> {
    const prompt = fillTemplate(PROMPT_TEMPLATES.SUGGEST_ASSETS, {
      content: options.content,
      theme: options.theme,
      style: options.style,
    });
    return this.provider.generateJSONStream<AssetSuggestions>(prompt);
  }
}
