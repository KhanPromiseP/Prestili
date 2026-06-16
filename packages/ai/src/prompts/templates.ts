export const PROMPT_TEMPLATES = {
  // Content Analysis
  ANALYZE_CONTENT: `
You are a presentation content analyzer. Analyze the following content and provide insights about:
- Key themes and topics
- Suggested structure (sections, slides)
- Recommended visual elements
- Tone and style suggestions

Content: {content}

Provide your analysis in JSON format with the following structure:
{
  "themes": string[],
  "structure": {
    "sections": { "title": string, "slideCount": number }[],
    "totalSlides": number
  },
  "visualElements": string[],
  "tone": string,
  "style": string
}
`,

  // Structure Generation
  GENERATE_STRUCTURE: `
You are a presentation structure expert. Generate a presentation structure based on the following topic and requirements:

Topic: {topic}
Target Audience: {audience}
Duration: {duration} minutes
Purpose: {purpose}

Generate a detailed presentation structure in JSON format:
{
  "title": string,
  "sections": [
    {
      "id": string,
      "title": string,
      "description": string,
      "slides": [
        {
          "id": string,
          "title": string,
          "description": string,
          "suggestedElements": string[],
          "estimatedDuration": number
        }
      ]
    }
  ],
  "totalSlides": number,
  "estimatedDuration": number
}
`,

  // Content Generation
  GENERATE_SLIDE_CONTENT: `
You are a presentation content writer. Generate content for a slide with the following specifications:

Slide Title: {title}
Slide Description: {description}
Target Audience: {audience}
Tone: {tone}

Generate content in JSON format:
{
  "title": string,
  "subtitle": string,
  "bodyText": string[],
  "bulletPoints": string[],
  "callToAction": string,
  "suggestedVisuals": string[]
}
`,

  // Design System Application
  APPLY_DESIGN_SYSTEM: `
You are a presentation design expert. Apply the following design system to generate visual specifications:

Design System:
- Primary Color: {primaryColor}
- Secondary Color: {secondaryColor}
- Typography: {typography}
- Layout Style: {layoutStyle}
- Visual Style: {visualStyle}

Slide Content: {content}

Generate visual specifications in JSON format:
{
  "backgroundColor": string,
  "textColor": string,
  "accentColor": string,
  "fontFamily": string,
  "fontSize": number,
  "layout": string,
  "elementStyles": {
    "headings": { "fontSize": number, "fontWeight": string, "color": string },
    "body": { "fontSize": number, "fontWeight": string, "color": string },
    "bulletPoints": { "fontSize": number, "color": string }
  },
  "spacing": {
    "padding": number,
    "margin": number,
    "lineHeight": number
  }
}
`,

  // Asset Selection
  SUGGEST_ASSETS: `
You are a presentation asset curator. Suggest appropriate assets (images, icons, charts) for the following slide:

Slide Content: {content}
Theme: {theme}
Style: {style}

Suggest assets in JSON format:
{
  "images": [
    {
      "description": string,
      "keywords": string[],
      "style": string,
      "position": string
    }
  ],
  "icons": [
    {
      "name": string,
      "keywords": string[],
      "style": string
    }
  ],
  "charts": [
    {
      "type": string,
      "data": object,
      "description": string
    }
  ]
}
`,

  // Global Map Generation
  GENERATE_GLOBAL_MAP: `
You are a presentation navigation expert. Generate a global map (overview) for the following presentation structure:

Presentation Structure: {structure}

Generate a global map in JSON format:
{
  "overview": {
    "title": string,
    "description": string,
    "totalSlides": number,
    "totalSections": number
  },
  "sections": [
    {
      "id": string,
      "title": string,
      "slideRange": { "start": number, "end": number },
      "thumbnail": string,
      "keyPoints": string[]
    }
  ],
  "navigation": {
    "mode": string,
    "cameraPoints": [
      {
        "slideId": string,
        "position": { "x": number, "y": number },
        "zoom": number
      }
    ]
  }
}
`,

  // Quality Validation
  VALIDATE_QUALITY: `
You are a presentation quality validator. Validate the quality of the following slide:

Slide Content: {content}
Design Specifications: {design}

Provide validation in JSON format:
{
  "score": number,
  "issues": [
    {
      "type": string,
      "severity": "low" | "medium" | "high",
      "message": string,
      "suggestion": string
    }
  ],
  "strengths": string[],
  "improvements": string[]
}
`,

  // Rewrite Content
  REWRITE_CONTENT: `
You are a presentation content editor. Rewrite the following content to improve clarity, engagement, and impact:

Original Content: {content}
Target Audience: {audience}
Tone: {tone}
Goal: {goal}

Provide rewritten content in JSON format:
{
  "title": string,
  "subtitle": string,
  "bodyText": string[],
  "bulletPoints": string[],
  "callToAction": string
}
`,

  // Summarize Content
  SUMMARIZE_CONTENT: `
You are a presentation content summarizer. Summarize the following content for a slide:

Content: {content}
MaxLength: {maxLength} words

Provide summary in JSON format:
{
  "summary": string,
  "keyPoints": string[],
  "wordCount": number
}
`,
};

export function fillTemplate(template: string, variables: Record<string, string>): string {
  let filled = template;
  for (const [key, value] of Object.entries(variables)) {
    filled = filled.replace(new RegExp(`{${key}}`, 'g'), value);
  }
  return filled;
}
