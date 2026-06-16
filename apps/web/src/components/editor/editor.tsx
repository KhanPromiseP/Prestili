'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Toolbar } from './toolbar';
import { EditorCanvas } from './canvas';
import { PropertiesPanel } from './properties-panel';
import { LayersPanel } from './layers-panel';
import { SlidesPanel } from './slides-panel';
import { AIPanel } from '../ai/ai-panel';

export function Editor() {
  const router = useRouter();
  const [currentTool, setCurrentTool] = useState('select');
  const [showAIPanel, setShowAIPanel] = useState(false);

  useEffect(() => {
    // Check if there's a topic from home page AI generation
    const topic = localStorage.getItem('ai_generation_topic');
    if (topic) {
      // Redirect to creation page instead of opening AI panel
      localStorage.removeItem('ai_generation_topic');
      router.push('/create');
    }
  }, [router]);

  return (
    <div className="h-screen flex flex-col bg-white">
      <Toolbar 
        currentTool={currentTool} 
        onToolSelect={setCurrentTool}
        onToggleAI={() => setShowAIPanel(!showAIPanel)}
        showAIPanel={showAIPanel}
      />
      <div className="flex-1 flex overflow-hidden">
        {/* Left sidebar - Slides */}
        <div className="w-72 border-r border-gray-200 bg-gray-50 flex flex-col flex-shrink-0 z-10">
          <SlidesPanel />
        </div>

        {/* Main canvas area */}
        <div className="flex-1 relative bg-gray-100 min-w-0 flex items-center justify-center overflow-auto p-8">
          <div className="relative shadow-2xl bg-white rounded-lg overflow-hidden" style={{ width: '1200px', height: '800px', minHeight: '600px', minWidth: '800px' }}>
            <EditorCanvas currentTool={currentTool} />
          </div>
        </div>

        {/* Right sidebar - Properties & Layers */}
        <div className="w-80 border-l border-gray-200 bg-gray-50 flex flex-col flex-shrink-0 z-10">
          <PropertiesPanel />
          <div className="flex-1 border-t border-gray-200 overflow-hidden">
            <LayersPanel />
          </div>
        </div>

        {/* AI Panel */}
        {showAIPanel && (
          <div className="w-80 border-l border-gray-200 bg-gray-50 flex-shrink-0 z-20">
            <AIPanel />
          </div>
        )}
      </div>
    </div>
  );
}
