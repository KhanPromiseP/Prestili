'use client';

import { useState } from 'react';
import { useEditorStore } from '@/stores/editor';
import { Element } from '@prestili/shared';

export function AIPanel() {
  const [activeTab, setActiveTab] = useState<'rewrite' | 'resources' | 'design'>('rewrite');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  
  const { selectedElements, updateElement, addElement, currentSlideId } = useEditorStore();

  const handleRewriteSlide = async () => {
    if (!currentSlideId) return;
    
    setIsProcessing(true);
    try {
      // Get current slide elements
      const state = useEditorStore.getState();
      const slides = state.history.present?.slides || {};
      const currentSlide = slides[currentSlideId];
      
      if (!currentSlide || !currentSlide.elements) {
        alert('No content to rewrite');
        return;
      }

      // Get text content from current slide
      const textElements = currentSlide.elements.filter((el: any) => el.type === 'text');
      const currentContent = textElements.map((el: any) => el.content).join('\n');

      // Use agent-based content optimization
      const response = await fetch('/api/ai/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Slide Rewrite',
          description: currentContent,
          audience: 'General',
          tone: 'Professional',
          format: 'mixed',
          feedback: 'Improve content quality and structure',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to rewrite slide');
      }

      const newContent = await response.json();

      // Update text elements with new content
      if (newContent.bullets && Array.isArray(newContent.bullets)) {
        textElements.forEach((el: any, index: number) => {
          if (newContent.bullets[index]) {
            updateElement(el.id, { content: newContent.bullets[index] });
          }
        });
      }

      // Add highlights if available
      if (newContent.highlights && Array.isArray(newContent.highlights)) {
        newContent.highlights.forEach((highlight: string, index: number) => {
          const highlightElement: Element = {
            id: `highlight-${Date.now()}-${index}`,
            type: 'text',
            content: `★ ${highlight}`,
            position: { x: 100, y: 400 + (index * 50) },
            size: { width: 800, height: 45 },
            style: {
              fontSize: 24,
              fontWeight: 'bold',
              color: '#3B82F6',
              opacity: 1,
            },
          };
          addElement(highlightElement);
        });
      }

      alert('Slide rewritten successfully');
    } catch (error) {
      console.error('Error rewriting slide:', error);
      alert('Failed to rewrite slide');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!selectedElementId) {
      alert('Please select an element first');
      return;
    }

    setIsProcessing(true);
    try {
      // Generate image based on context using Pexels
      const state = useEditorStore.getState();
      const slides = state.history.present?.slides || {};
      if (!currentSlideId) return;
      const currentSlide = slides[currentSlideId];
      
      if (!currentSlide || !currentSlide.elements) {
        return;
      }

      const textElements = currentSlide.elements.filter((el: any) => el.type === 'text');
      const context = textElements.map((el: any) => el.content).join(' ');

      // Use Pexels API to get relevant image
      const response = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(context.substring(0, 30))}&per_page=1`, {
        headers: {
          'Authorization': process.env.PEXELS_API_KEY || '',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch image from Pexels');
      }
      
      const data = await response.json();
      let imageUrl;
      if (data.photos && data.photos.length > 0) {
        imageUrl = data.photos[0].src.large;
      } else {
        // Fallback to placeholder
        imageUrl = `https://via.placeholder.com/400x300?text=${encodeURIComponent(context.substring(0, 20))}`;
      }

      // Add image element
      const imageElement: Element = {
        id: `image-${Date.now()}`,
        type: 'image',
        content: imageUrl,
        position: { x: 200, y: 200 },
        size: { width: 400, height: 300 },
        style: {
          opacity: 1,
        },
      };
      addElement(imageElement);

      alert('Image added successfully');
    } catch (error) {
      console.error('Error generating image:', error);
      alert('Failed to generate image');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApplyDesign = async () => {
    if (!currentSlideId) return;

    setIsProcessing(true);
    try {
      const response = await fetch('/api/ai/design', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          primaryColor: '#3B82F6',
          secondaryColor: '#10B981',
          typography: 'Modern',
          layoutStyle: 'Professional',
          visualStyle: 'Clean',
          content: {},
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to apply design');
      }

      const design = await response.json();

      // Apply design to current slide
      const state = useEditorStore.getState();
      const slides = state.history.present?.slides || {};
      const currentSlide = slides[currentSlideId];

      if (currentSlide && design.backgroundColor) {
        const updatedSlides = {
          ...slides,
          [currentSlideId]: {
            ...currentSlide,
            backgroundColor: design.backgroundColor,
          },
        };
        useEditorStore.setState({
          history: {
            ...state.history,
            present: {
              ...state.history.present,
              slides: updatedSlides,
            },
          },
        });
      }

      if (currentSlide?.elements && design.textColor) {
        currentSlide.elements.forEach((element: any) => {
          if (element.type === 'text') {
            updateElement(element.id, {
              style: {
                ...element.style,
                color: design.textColor,
              },
            });
          }
        });
      }

      alert('Design applied successfully');
    } catch (error) {
      console.error('Error applying design:', error);
      alert('Failed to apply design');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-80 border-l border-border bg-background p-4 overflow-y-auto">
      <h3 className="font-semibold mb-4">AI Assistant</h3>
      
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveTab('rewrite')}
          className={`px-3 py-1 text-sm rounded ${
            activeTab === 'rewrite' ? 'bg-primary text-primary-foreground' : 'bg-secondary'
          }`}
        >
          Rewrite
        </button>
        <button
          onClick={() => setActiveTab('resources')}
          className={`px-3 py-1 text-sm rounded ${
            activeTab === 'resources' ? 'bg-primary text-primary-foreground' : 'bg-secondary'
          }`}
        >
          Resources
        </button>
        <button
          onClick={() => setActiveTab('design')}
          className={`px-3 py-1 text-sm rounded ${
            activeTab === 'design' ? 'bg-primary text-primary-foreground' : 'bg-secondary'
          }`}
        >
          Design
        </button>
      </div>

      {activeTab === 'rewrite' && (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Use AI to rewrite your slide content with different tones and styles.
          </p>
          <button
            onClick={handleRewriteSlide}
            disabled={isProcessing}
            className="w-full px-4 py-2 bg-primary text-primary-foreground rounded hover:opacity-90 transition disabled:opacity-50"
          >
            {isProcessing ? 'Rewriting...' : 'Rewrite Current Slide'}
          </button>
        </div>
      )}

      {activeTab === 'resources' && (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Generate images and resources for your slides using AI.
          </p>
          <button
            onClick={handleGenerateImage}
            disabled={isProcessing}
            className="w-full px-4 py-2 bg-primary text-primary-foreground rounded hover:opacity-90 transition disabled:opacity-50"
          >
            {isProcessing ? 'Generating...' : 'Generate Image'}
          </button>
        </div>
      )}

      {activeTab === 'design' && (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Apply AI-powered design suggestions to enhance your slide visuals.
          </p>
          <button
            onClick={handleApplyDesign}
            disabled={isProcessing}
            className="w-full px-4 py-2 bg-primary text-primary-foreground rounded hover:opacity-90 transition disabled:opacity-50"
          >
            {isProcessing ? 'Applying...' : 'Apply Design'}
          </button>
        </div>
      )}
    </div>
  );
}
