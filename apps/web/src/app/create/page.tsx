'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useEditorStore } from '@/stores/editor';

interface AIGenerationForm {
  inputType: 'topic' | 'text' | 'upload';
  topic: string;
  textContent: string;
  uploadedFile: File | null;
  useAIKnowledge: boolean;
  slideCount?: number;
  targetAudience?: string;
}

interface SlideOutline {
  id: string;
  title: string;
  description: string;
  content?: any;
}

interface Section {
  id: string;
  title: string;
  slides: SlideOutline[];
}

interface PresentationStructure {
  title?: string;
  description?: string;
  sections: Section[];
}

export default function CreatePage() {
  const router = useRouter();
  const { addSlide, addElement, setCurrentSlide } = useEditorStore();
  
  const [step, setStep] = useState<'form' | 'outline' | 'generating' | 'complete'>('form');
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState<AIGenerationForm>({
    inputType: 'topic',
    topic: '',
    textContent: '',
    uploadedFile: null,
    useAIKnowledge: true,
    slideCount: undefined,
    targetAudience: undefined,
  });
  const [structure, setStructure] = useState<PresentationStructure | null>(null);
  const [editingSlide, setEditingSlide] = useState<string | null>(null);
  const [slideContent, setSlideContent] = useState('');
  const [showOptional, setShowOptional] = useState(false);

  // Function to get image from Pexels API
  const getPexelsImage = async (query: string): Promise<string | null> => {
    try {
      const response = await Promise.race([
        fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1`, {
          headers: {
            'Authorization': process.env.PEXELS_API_KEY || '',
          },
        }),
        new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error('Pexels API timeout')), 10000)
        )
      ]);
      
      if (!response.ok) {
        if (response.status === 401) {
          console.warn('Pexels API key is invalid or expired. Skipping image generation.');
        } else {
          console.error('Pexels API error:', response.statusText);
        }
        return null;
      }
      
      const data = await response.json();
      if (data.photos && data.photos.length > 0) {
        return data.photos[0].src.large;
      }
      
      return null;
    } catch (error) {
      console.warn('Error fetching image from Pexels, skipping image:', error);
      return null;
    }
  };

  // Agent-based content optimization system
  const optimizeSlideContent = async (
    slide: any, 
    design: any, 
    hasImage: boolean,
    maxIterations: number = 2 // Reduced from 3 to 2 to prevent long loops
  ): Promise<any> => {
    let content = slide.content;
    let iteration = 0;
    let qualityScore = 0;
    const maxTotalTime = 60000; // 60 seconds max total time
    const startTime = Date.now();
    
    while (iteration < maxIterations && qualityScore < 0.8) {
      // Check if we've exceeded max time
      if (Date.now() - startTime > maxTotalTime) {
        console.warn(`Content optimization timeout after ${maxTotalTime}ms, using current content`);
        break;
      }
      
      iteration++;
      
      try {
        // Step 1: Analyze content requirements based on layout (with timeout)
        const layoutAnalysis = await Promise.race([
          fetch('/api/ai/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              content: slide.title + ' ' + slide.description,
              context: {
                hasImage,
                designStyle: design.layoutStyle,
                visualStyle: design.visualStyle,
                previousContent: content,
              },
            }),
          }),
          new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error('Analysis timeout')), 15000)
          )
        ]) as Response;
        
        const analysis = await layoutAnalysis.json();
        
        // Step 2: Generate optimized content based on analysis (with timeout)
        const contentResponse = await Promise.race([
          fetch('/api/ai/content', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title: slide.title,
              description: slide.description,
              audience: formData.targetAudience || 'General',
              tone: 'Professional',
              format: analysis.suggestedFormat || 'mixed',
              maxLength: analysis.suggestedMaxLength || 500,
              hasImage: hasImage,
              previousContent: content,
              feedback: iteration > 1 ? 'Improve content quality and structure' : undefined,
            }),
          }),
          new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error('Content generation timeout')), 30000)
          )
        ]) as Response;
        
        content = await contentResponse.json();
        
        // Step 3: Validate content quality (with timeout)
        const validateResponse = await Promise.race([
          fetch('/api/ai/validate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              content: content,
              design: design,
              criteria: {
                readability: true,
                engagement: true,
                clarity: true,
                completeness: true,
              },
            }),
          }),
          new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error('Validation timeout')), 15000)
          )
        ]) as Response;
        
        const validation = await validateResponse.json();
        qualityScore = validation.score || 0;
        
        // If quality is low, provide feedback for next iteration
        if (qualityScore < 0.8 && iteration < maxIterations) {
          console.log(`Content quality score: ${qualityScore}, optimizing... (iteration ${iteration})`);
        }
      } catch (error) {
        console.warn(`Content optimization iteration ${iteration} failed:`, error);
        // If any step fails, break the loop and use current content
        break;
      }
    }
    
    return content;
  };

  // Layout analysis agent
  const analyzeSlideLayout = async (content: any, hasImage: boolean, design: any): Promise<{
    contentPosition: any;
    imagePosition: any;
    contentSize: any;
    format: string;
  }> => {
    const layoutResponse = await fetch('/api/ai/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: content,
        task: 'layout_analysis',
        context: {
          hasImage,
          designSystem: design,
        },
      }),
    });
    
    const layoutAnalysis = await layoutResponse.json();
    
    return {
      contentPosition: layoutAnalysis.contentPosition || { x: 100, y: 200 },
      imagePosition: layoutAnalysis.imagePosition || { x: 700, y: 250 },
      contentSize: layoutAnalysis.contentSize || { width: 900, height: 400 },
      format: layoutAnalysis.suggestedFormat || 'mixed',
    };
  };

  const retryWithBackoff = async (fn: () => Promise<Response>, maxRetries = 2, baseDelay = 1000, timeoutMs = 60000): Promise<Response> => {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const response = await Promise.race([
          fn(),
          new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error('Request timeout')), timeoutMs)
          )
        ]) as Response;
        
        if (response.ok) {
          return response;
        }
        
        // If it's a rate limit error (429), retry with backoff
        if (response.status === 429) {
          const delay = baseDelay * Math.pow(2, attempt);
          console.log(`Rate limited. Retrying in ${delay}ms (attempt ${attempt + 1}/${maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        
        // For other errors, don't retry
        return response;
      } catch (error) {
        if (attempt === maxRetries - 1) {
          throw error;
        }
        const delay = baseDelay * Math.pow(2, attempt);
        console.log(`Error occurred. Retrying in ${delay}ms (attempt ${attempt + 1}/${maxRetries})`, error);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    throw new Error('Max retries exceeded');
  };

  const handleGenerateOutline = async () => {
    setIsGenerating(true);
    try {
      // Prepare request body based on input type
      let requestBody: any = {};

      if (formData.inputType === 'topic') {
        requestBody = {
          topic: formData.topic,
          inputType: 'topic',
          useAIKnowledge: formData.useAIKnowledge,
        };
      } else if (formData.inputType === 'text') {
        requestBody = {
          content: formData.textContent,
          inputType: 'text',
          useAIKnowledge: formData.useAIKnowledge,
        };
      } else if (formData.inputType === 'upload') {
        // For now, we'll handle file upload separately
        alert('File upload coming soon');
        setIsGenerating(false);
        return;
      }

      // Add optional parameters if provided
      if (formData.slideCount) requestBody.slideCount = formData.slideCount;
      if (formData.targetAudience) requestBody.audience = formData.targetAudience;

      const response = await retryWithBackoff(async () => {
        return await fetch('/api/ai/structure', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
        });
      }, 2, 1500, 180000);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate outline after retries');
      }

      const generatedStructure = await response.json();
      setStructure(generatedStructure);
      setStep('outline');
    } catch (error) {
      console.error('Error generating outline:', error);
      alert('Failed to generate outline. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEditSlide = async (slideId: string) => {
    setEditingSlide(slideId);
    // Find the slide and set its content for editing
    let slideContent = '';
    for (const section of structure?.sections || []) {
      const slide = section.slides.find(s => s.id === slideId);
      if (slide) {
        slideContent = slide.description || '';
        break;
      }
    }
    setSlideContent(slideContent);
  };

  const handleSaveSlideEdit = async () => {
    if (!editingSlide || !structure) return;

    // Update the structure with edited content
    const updatedStructure = { ...structure, sections: [...(structure.sections || [])] };
    for (let i = 0; i < updatedStructure.sections.length; i++) {
      const section = updatedStructure.sections[i];
      const slideIndex = section.slides.findIndex(s => s.id === editingSlide);
      if (slideIndex !== -1) {
        updatedStructure.sections[i].slides[slideIndex].description = slideContent;
        break;
      }
    }
    setStructure(updatedStructure);
    setEditingSlide(null);
    setSlideContent('');
  };

  const handleRegenerateSlide = async (slideId: string) => {
    // Find the slide
    let slide: SlideOutline | null = null;
    for (const section of structure?.sections || []) {
      const found = section.slides.find(s => s.id === slideId);
      if (found) {
        slide = found;
        break;
      }
    }

    if (!slide) return;

    try {
      const response = await fetch('/api/ai/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: slide.title,
          description: slide.description,
          audience: formData.targetAudience || 'General',
          tone: 'Professional',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to regenerate slide');
      }

      const content = await response.json();
      
      // Update the structure with new content
      if (!structure || !structure.sections) return;
      const updatedStructure: PresentationStructure = {
        ...structure,
        sections: structure.sections.map(section => ({
          ...section,
          slides: section.slides.map(slide => 
            slide.id === slideId ? { ...slide, content } : slide
          )
        }))
      };
      setStructure(updatedStructure);
    } catch (error) {
      console.error('Error regenerating slide:', error);
      alert('Failed to regenerate slide');
    }
  };

  const handleAddSlide = () => {
    if (!structure) return;

    const newSlide: SlideOutline = {
      id: `slide-${Date.now()}`,
      title: 'New Slide',
      description: 'Add your content here',
    };

    const updatedStructure = { ...structure };
    if (updatedStructure.sections.length > 0) {
      updatedStructure.sections[0].slides.push(newSlide);
    } else {
      updatedStructure.sections = [{
        id: `section-${Date.now()}`,
        title: 'New Section',
        slides: [newSlide],
      }];
    }
    setStructure(updatedStructure);
  };

  const handleFinalGeneration = async () => {
    if (!structure) return;

    setIsGenerating(true);
    setStep('generating');

    try {
      // Clear existing slides
      const state = useEditorStore.getState();
      const currentSlides = state.history.present?.slides || {};
      Object.keys(currentSlides).forEach(slideId => {
        // Don't delete, just create new ones
      });

      // Step 1: Analyze the content (with retry logic)
      let analysis = {};
      try {
        const analyzeResponse = await retryWithBackoff(async () => {
          return await fetch('/api/ai/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              content: formData.inputType === 'text' ? formData.textContent : formData.topic,
              inputType: formData.inputType,
            }),
          });
        }, 2, 1500);
        
        if (analyzeResponse.ok) {
          analysis = await analyzeResponse.json();
        } else {
          console.warn('Analyze endpoint failed after retries, using default analysis');
        }
      } catch (error) {
        console.warn('Analyze endpoint error after retries, using default analysis:', error);
      }

      // Step 2: Generate design system (with retry logic)
      let design = {
        primaryColor: '#3B82F6',
        secondaryColor: '#10B981',
        backgroundColor: '#FFFFFF',
        textColor: '#000000',
        visualStyle: 'Clean',
        layoutStyle: 'Professional',
      };
      try {
        const designResponse = await retryWithBackoff(async () => {
          return await fetch('/api/ai/design', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              primaryColor: '#3B82F6',
              secondaryColor: '#10B981',
              typography: 'Modern',
              layoutStyle: 'Professional',
              visualStyle: 'Clean',
              content: structure,
              analysis: analysis,
            }),
          });
        }, 2, 1500);
        
        if (designResponse.ok) {
          const designData = await designResponse.json();
          design = { ...design, ...designData };
        } else {
          console.warn('Design endpoint failed after retries, using default design');
        }
      } catch (error) {
        console.warn('Design endpoint error after retries, using default design:', error);
      }

      // Step 3: Generate global map (with retry logic)
      let globalMap = {};
      try {
        const globalMapResponse = await retryWithBackoff(async () => {
          return await fetch('/api/ai/global-map', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              structure: structure,
              design: design,
            }),
          });
        }, 2, 1500);
        
        if (globalMapResponse.ok) {
          globalMap = await globalMapResponse.json();
        } else {
          console.warn('Global map endpoint failed after retries, using default');
        }
      } catch (error) {
        console.warn('Global map endpoint error after retries, using default:', error);
      }

      // Step 4: Generate content for each slide and create actual slides in editor
      let slideCount = 0;
      const totalSlidesToCreate = formData.slideCount ? Math.min(formData.slideCount, 50) : 50;

      for (const section of structure.sections) {
        for (const slide of section.slides) {
          if (slideCount >= totalSlidesToCreate) break;

          // Step 5: Get assets for this slide using Pexels (with retry logic)
          let assets = { images: [] };
          try {
            const assetsResponse = await retryWithBackoff(async () => {
              return await fetch('/api/ai/assets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  content: slide.title + ' ' + slide.description,
                  theme: design.visualStyle || 'Clean',
                  style: design.layoutStyle || 'Professional',
                }),
              });
            }, 1, 1000);
            
            if (assetsResponse.ok) {
              assets = await assetsResponse.json();
            }
          } catch (error) {
            console.warn('Assets endpoint error after retries, skipping images:', error);
          }

          // Determine if we'll have an image
          const hasImage = assets.images && assets.images.length > 0;
          let imageUrl = null;
          if (hasImage && assets.images[0]) {
            const imageSuggestion = assets.images[0] as any;
            imageUrl = await getPexelsImage(imageSuggestion.keywords?.join(',') || '');
          }

          // Step 6: Use agent-based content optimization
          const optimizedContent = await optimizeSlideContent(slide, design, hasImage);

          // Step 7: Analyze optimal layout based on content and image presence
          const layoutAnalysis = await analyzeSlideLayout(optimizedContent, hasImage, design);

          // Create slide in editor with background color
          const slideIdResult = addSlide();
          const slideId = typeof slideIdResult === 'string' ? slideIdResult : Object.keys(useEditorStore.getState().history.present?.slides || {}).pop() || '';
          
          // Apply background color from design system
          if (design.backgroundColor && slideId) {
            const editorState = useEditorStore.getState();
            const slides = editorState.history.present?.slides || {};
            const currentSlide = slides[slideId];
            if (currentSlide) {
              useEditorStore.setState({
                history: {
                  ...editorState.history,
                  present: {
                    ...editorState.history.present,
                    slides: {
                      ...slides,
                      [slideId]: {
                        ...currentSlide,
                        backgroundColor: design.backgroundColor,
                      },
                    },
                  },
                },
              });
            }
          }

          // Add decorative background element (gradient or shape)
          const bgElement = {
            id: `bg-${Date.now()}`,
            type: 'shape' as const,
            shape: 'rectangle' as const,
            content: '',
            position: { x: 0, y: 0 },
            size: { width: 1200, height: 800 },
            style: {
              fill: design.secondaryColor || '#10B981',
              opacity: 0.1,
              rotation: 0,
            },
          };
          addElement(bgElement);

          // Add title element with better styling
          const titleElement = {
            id: `title-${Date.now()}`,
            type: 'text' as const,
            content: slide.title,
            position: { x: 600, y: 80 },
            size: { width: 1000, height: 120 },
            style: {
              fontSize: 64,
              fontWeight: 'bold' as const,
              color: design.textColor || '#000000',
              opacity: 1,
              textAlign: 'center' as const,
            },
          };
          addElement(titleElement);

          // Add subtitle/description if available
          if (slide.description) {
            const subtitleElement = {
              id: `subtitle-${Date.now()}`,
              type: 'text' as const,
              content: slide.description,
              position: { x: 600, y: 180 },
              size: { width: 800, height: 60 },
              style: {
                fontSize: 28,
                fontWeight: 'normal' as const,
                color: design.textColor || '#333333',
                opacity: 0.8,
                textAlign: 'center' as const,
              },
            };
            addElement(subtitleElement);
          }

          // Add decorative elements (shapes, lines) for Prezi-like feel
          const accentLine = {
            id: `accent-${Date.now()}`,
            type: 'shape' as const,
            shape: 'rectangle' as const,
            content: '',
            position: { x: 350, y: 220 },
            size: { width: 500, height: 6 },
            style: {
              fill: design.primaryColor || '#3B82F6',
              opacity: 1,
              rotation: 0,
            },
          };
          addElement(accentLine);

          // Add content based on format analysis
          if (optimizedContent && typeof optimizedContent === 'object' && optimizedContent !== null) {
            const contentPosition = layoutAnalysis.contentPosition;
            
            // Handle different content formats
            if (layoutAnalysis.format === 'points' && optimizedContent.bullets && Array.isArray(optimizedContent.bullets)) {
              const bullets = optimizedContent.bullets as string[];
              bullets.forEach((bullet: string, index: number) => {
                const bulletElement = {
                  id: `bullet-${Date.now()}-${index}`,
                  type: 'text' as const,
                  content: `• ${bullet}`,
                  position: { x: 600, y: contentPosition.y + (index * 70) },
                  size: { width: layoutAnalysis.contentSize.width, height: 60 },
                  style: {
                    fontSize: 32,
                    fontWeight: 'normal' as const,
                    color: design.textColor || '#333333',
                    opacity: 1,
                    textAlign: 'center' as const,
                  },
                };
                addElement(bulletElement);
              });
            } else if (layoutAnalysis.format === 'paragraph' && optimizedContent.paragraphs && Array.isArray(optimizedContent.paragraphs)) {
              const paragraphs = optimizedContent.paragraphs as string[];
              paragraphs.forEach((paragraph: string, index: number) => {
                const paragraphElement = {
                  id: `paragraph-${Date.now()}-${index}`,
                  type: 'text' as const,
                  content: paragraph,
                  position: { x: 600, y: contentPosition.y + (index * 100) },
                  size: { width: layoutAnalysis.contentSize.width, height: 90 },
                  style: {
                    fontSize: 30,
                    fontWeight: 'normal' as const,
                    color: design.textColor || '#333333',
                    opacity: 1,
                    lineHeight: 1.6,
                    textAlign: 'center' as const,
                  },
                };
                addElement(paragraphElement);
              });
            } else if (layoutAnalysis.format === 'mixed') {
              // Handle mixed format with highlights
              if (optimizedContent.bullets && Array.isArray(optimizedContent.bullets)) {
                const bullets = optimizedContent.bullets as string[];
                bullets.forEach((bullet: string, index: number) => {
                  const bulletElement = {
                    id: `bullet-${Date.now()}-${index}`,
                    type: 'text' as const,
                    content: `• ${bullet}`,
                    position: { x: 600, y: contentPosition.y + (index * 70) },
                    size: { width: layoutAnalysis.contentSize.width, height: 60 },
                    style: {
                      fontSize: 32,
                      fontWeight: 'normal' as const,
                      color: design.textColor || '#333333',
                      opacity: 1,
                      textAlign: 'center' as const,
                    },
                  };
                  addElement(bulletElement);
                });
              }
              
              // Add highlights if available
              if (optimizedContent.highlights && Array.isArray(optimizedContent.highlights)) {
                const highlights = optimizedContent.highlights as string[];
                highlights.forEach((highlight: string, index: number) => {
                  const highlightElement = {
                    id: `highlight-${Date.now()}-${index}`,
                    type: 'text' as const,
                    content: `★ ${highlight}`,
                    position: { x: 600, y: contentPosition.y + (optimizedContent.bullets?.length || 0) * 70 + (index * 60) + 30 },
                    size: { width: layoutAnalysis.contentSize.width, height: 55 },
                    style: {
                      fontSize: 28,
                      fontWeight: 'bold' as const,
                      color: design.primaryColor || '#3B82F6',
                      opacity: 1,
                      textAlign: 'center' as const,
                    },
                  };
                  addElement(highlightElement);
                });
              }
            }
          }

          // Add image from Pexels if available
          if (imageUrl) {
            const imagePosition = layoutAnalysis.imagePosition;
            const imageElement = {
              id: `image-${Date.now()}`,
              type: 'image' as const,
              content: imageUrl,
              position: { x: 400, y: 450 },
              size: { width: 400, height: 300 },
              style: {
                opacity: 1,
                borderRadius: 16,
              },
            };
            addElement(imageElement);
          }

          slideCount++;
        }
        if (slideCount >= totalSlidesToCreate) break;
      }

      // Step 6: Validate the presentation (with retry logic)
      try {
        const validateResponse = await retryWithBackoff(async () => {
          return await fetch('/api/ai/validate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              structure: structure,
              design: design,
              globalMap: globalMap,
            }),
          });
        }, 1, 1000);
        
        if (validateResponse.ok) {
          const validation = await validateResponse.json();
          if (!validation.valid) {
            console.warn('Presentation validation warnings:', validation.warnings);
          }
        } else {
          console.warn('Validation endpoint failed after retries, skipping validation');
        }
      } catch (error) {
        console.warn('Validation endpoint error after retries, skipping validation:', error);
      }

      // Save presentation to database
      const editorState = useEditorStore.getState();
      const slides = editorState.history.present?.slides || {};
      
      // First, ensure a default project exists
      let projectId = 'default';
      try {
        const projectResponse = await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'My Presentations',
            description: 'Default project for presentations',
          }),
        });
        if (projectResponse.ok) {
          const project = await projectResponse.json();
          projectId = project.id;
        } else {
          console.error('Failed to create project:', await projectResponse.text());
        }
      } catch (error) {
        console.error('Error creating project:', error);
      }

      const presentationData = {
        projectId: projectId,
        title: structure.title || 'Untitled Presentation',
        description: structure.description || 'Created with AI',
        document: {
          slides: slides,
          design: design,
          globalMap: globalMap,
        },
      };

      try {
        const saveResponse = await fetch('/api/presentations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(presentationData),
        });

        if (saveResponse.ok) {
          const savedPresentation = await saveResponse.json();
          console.log('Presentation saved successfully:', savedPresentation);
          // Store the presentation ID in localStorage for later use
          localStorage.setItem('current_presentation_id', savedPresentation.id);
        } else {
          const errorData = await saveResponse.json();
          console.error('Failed to save presentation to database:', errorData);
        }
      } catch (error) {
        console.error('Error saving presentation:', error);
      }

      setStep('complete');
      setTimeout(() => {
        router.push('/editor');
      }, 2000);
    } catch (error) {
      console.error('Error generating presentation:', error);
      alert('Failed to generate presentation');
      setStep('outline');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="border-b border-white/10 bg-white/5 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">P</span>
            </div>
            <span className="text-white font-semibold">Prestili</span>
          </div>
          <button
            onClick={() => router.push('/')}
            className="text-white/70 hover:text-white transition"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="flex items-center justify-center space-x-4 mb-8">
          <div className={`flex items-center ${step === 'form' ? 'text-white' : 'text-white/50'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'form' ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-white/20'}`}>
              1
            </div>
            <span className="ml-2">Details</span>
          </div>
          <div className="w-16 h-0.5 bg-white/20"></div>
          <div className={`flex items-center ${step === 'outline' || step === 'generating' || step === 'complete' ? 'text-white' : 'text-white/50'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'outline' || step === 'generating' || step === 'complete' ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-white/20'}`}>
              2
            </div>
            <span className="ml-2">Outline</span>
          </div>
          <div className="w-16 h-0.5 bg-white/20"></div>
          <div className={`flex items-center ${step === 'generating' || step === 'complete' ? 'text-white' : 'text-white/50'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'generating' || step === 'complete' ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-white/20'}`}>
              3
            </div>
            <span className="ml-2">Generate</span>
          </div>
        </div>

        {/* Form Step */}
        {step === 'form' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <h1 className="text-3xl font-bold text-white mb-2">Create Your Presentation</h1>
              <p className="text-gray-300 mb-8">Choose how you want to start - with a topic, your content, or upload a file</p>

              <div className="space-y-8">
                {/* Input Type Selection */}
                <div>
                  <label className="block text-white font-medium mb-4">How would you like to start?</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, inputType: 'topic' })}
                      className={`p-6 rounded-xl border-2 transition-all ${
                        formData.inputType === 'topic'
                          ? 'border-purple-500 bg-purple-500/20'
                          : 'border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10'
                      }`}
                    >
                      <div className="text-3xl mb-2">💡</div>
                      <div className="text-white font-semibold">Topic</div>
                      <div className="text-gray-400 text-sm mt-1">Just give me a topic</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, inputType: 'text' })}
                      className={`p-6 rounded-xl border-2 transition-all ${
                        formData.inputType === 'text'
                          ? 'border-purple-500 bg-purple-500/20'
                          : 'border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10'
                      }`}
                    >
                      <div className="text-3xl mb-2">📝</div>
                      <div className="text-white font-semibold">Text</div>
                      <div className="text-gray-400 text-sm mt-1">Paste your content</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, inputType: 'upload' })}
                      className={`p-6 rounded-xl border-2 transition-all ${
                        formData.inputType === 'upload'
                          ? 'border-purple-500 bg-purple-500/20'
                          : 'border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10'
                      }`}
                    >
                      <div className="text-3xl mb-2">📁</div>
                      <div className="text-white font-semibold">Upload</div>
                      <div className="text-gray-400 text-sm mt-1">PDF, DOCX files</div>
                    </button>
                  </div>
                </div>

                {/* Topic Input */}
                {formData.inputType === 'topic' && (
                  <div>
                    <label className="block text-white font-medium mb-2">What&apos;s your presentation about?</label>
                    <input
                      type="text"
                      value={formData.topic}
                      onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                      placeholder="e.g., Introduction to Machine Learning"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                    />
                  </div>
                )}

                {/* Text Input */}
                {formData.inputType === 'text' && (
                  <div>
                    <label className="block text-white font-medium mb-2">Paste your content</label>
                    <textarea
                      value={formData.textContent}
                      onChange={(e) => setFormData({ ...formData, textContent: e.target.value })}
                      placeholder="Paste your notes, outline, or any content you want to turn into a presentation..."
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition h-40 resize-none"
                    />
                  </div>
                )}

                {/* Upload Input */}
                {formData.inputType === 'upload' && (
                  <div>
                    <label className="block text-white font-medium mb-2">Upload your file</label>
                    <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center hover:border-white/40 transition cursor-pointer">
                      <div className="text-4xl mb-2">📄</div>
                      <div className="text-white font-medium">Drop your file here or click to upload</div>
                      <div className="text-gray-400 text-sm mt-1">Supports PDF, DOCX</div>
                    </div>
                  </div>
                )}

                {/* Knowledge Base Choice */}
                {(formData.inputType === 'text' || formData.inputType === 'upload') && (
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <label className="block text-white font-medium mb-3">Knowledge Base</label>
                    <div className="space-y-3">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name="knowledge"
                          checked={formData.useAIKnowledge}
                          onChange={() => setFormData({ ...formData, useAIKnowledge: true })}
                          className="w-4 h-4 text-purple-500"
                        />
                        <div>
                          <div className="text-white font-medium">AI + Your Content</div>
                          <div className="text-gray-400 text-sm">AI will enhance your content with additional knowledge and context</div>
                        </div>
                      </label>
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name="knowledge"
                          checked={!formData.useAIKnowledge}
                          onChange={() => setFormData({ ...formData, useAIKnowledge: false })}
                          className="w-4 h-4 text-purple-500"
                        />
                        <div>
                          <div className="text-white font-medium">Your Content Only</div>
                          <div className="text-gray-400 text-sm">Use only your provided content without additional AI knowledge</div>
                        </div>
                      </label>
                    </div>
                  </div>
                )}

                {/* Optional Parameters */}
                <div className="border-t border-white/10 pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-white font-medium">Optional Settings</label>
                    <button
                      type="button"
                      onClick={() => setShowOptional(!showOptional)}
                      className="text-purple-400 text-sm hover:text-purple-300 transition"
                    >
                      {showOptional ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  
                  {showOptional && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-white font-medium mb-2">Number of Slides (optional)</label>
                        <input
                          type="number"
                          value={formData.slideCount || ''}
                          onChange={(e) => setFormData({ ...formData, slideCount: e.target.value ? parseInt(e.target.value) : undefined })}
                          placeholder="Let AI decide"
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                          min="5"
                          max="50"
                        />
                        <p className="text-gray-400 text-xs mt-1">Leave empty for AI to determine optimal count</p>
                      </div>

                      <div>
                        <label className="block text-white font-medium mb-2">Target Audience (optional)</label>
                        <input
                          type="text"
                          value={formData.targetAudience || ''}
                          onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value || undefined })}
                          placeholder="e.g., Technical professionals, students"
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleGenerateOutline}
                  disabled={isGenerating || (formData.inputType === 'topic' && !formData.topic) || (formData.inputType === 'text' && !formData.textContent)}
                  className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  {isGenerating ? 'Generating Outline...' : 'Generate Outline'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Outline Step */}
        {step === 'outline' && structure && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-white">Presentation Outline</h1>
                <button
                  onClick={handleAddSlide}
                  className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition"
                >
                  + Add Slide
                </button>
              </div>

              {structure.sections.map((section, sectionIndex) => (
                <div key={section.id} className="mb-8">
                  <h2 className="text-xl font-semibold text-white mb-4">{section.title}</h2>
                  <div className="space-y-3">
                    {section.slides.map((slide, slideIndex) => (
                      <div
                        key={slide.id}
                        className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-white/30 transition"
                      >
                        {editingSlide === slide.id ? (
                          <div className="space-y-3">
                            <input
                              type="text"
                              value={slide.title}
                              onChange={(e) => {
                                const updatedStructure = { ...structure };
                                updatedStructure.sections[sectionIndex].slides[slideIndex].title = e.target.value;
                                setStructure(updatedStructure);
                              }}
                              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                            <textarea
                              value={slideContent}
                              onChange={(e) => setSlideContent(e.target.value)}
                              placeholder="Slide description..."
                              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 h-24 resize-none"
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={handleSaveSlideEdit}
                                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => {
                                  setEditingSlide(null);
                                  setSlideContent('');
                                }}
                                className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-white font-medium mb-1">{slide.title}</h3>
                              <p className="text-gray-300 text-sm">{slide.description}</p>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEditSlide(slide.id)}
                                className="p-2 text-white/70 hover:text-white transition"
                                title="Edit"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleRegenerateSlide(slide.id)}
                                className="p-2 text-white/70 hover:text-white transition"
                                title="Regenerate with AI"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => setStep('form')}
                  className="px-6 py-3 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition"
                >
                  Back
                </button>
                <button
                  onClick={handleFinalGeneration}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:opacity-90 transition"
                >
                  Generate Presentation
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Generating Step */}
        {step === 'generating' && (
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 border border-white/20">
              <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
              <h2 className="text-2xl font-bold text-white mb-2">Generating Your Presentation</h2>
              <p className="text-gray-300">This may take a moment...</p>
            </div>
          </div>
        )}

        {/* Complete Step */}
        {step === 'complete' && (
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 border border-white/20">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Presentation Created!</h2>
              <p className="text-gray-300 mb-6">Redirecting to editor...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
