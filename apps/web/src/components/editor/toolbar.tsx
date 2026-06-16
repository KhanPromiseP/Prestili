'use client';

import { TOOLBAR_TOOLS } from '@prestili/shared';
import { useEditorStore } from '@/stores/editor';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export function Toolbar({ currentTool, onToolSelect, onToggleAI, showAIPanel }: { 
  currentTool: string; 
  onToolSelect: (tool: string) => void;
  onToggleAI: () => void;
  showAIPanel: boolean;
}) {
  const { undo, redo, history, presentationId } = useEditorStore();
  const router = useRouter();

  const handleSave = async () => {
    if (!presentationId || !history.present) return;

    try {
      const response = await fetch(`/api/presentations/${presentationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          document: history.present,
          slideCount: Object.keys(history.present.slides || {}).length,
        }),
      });

      if (response.ok) {
        alert('Presentation saved successfully!');
      } else {
        alert('Failed to save presentation');
      }
    } catch (error) {
      console.error('Error saving presentation:', error);
      alert('Failed to save presentation');
    }
  };

  return (
    <div className="h-14 border-b border-gray-200 bg-white flex items-center px-4 gap-2">
      <div className="flex items-center gap-2 border-r border-gray-200 pr-4">
        <button
          onClick={() => router.push('/')}
          className="p-2 hover:bg-gray-100 rounded transition"
          title="Dashboard"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </button>
        <button
          onClick={undo}
          className="p-2 hover:bg-gray-100 rounded transition"
          title="Undo"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
          </svg>
        </button>
        <button
          onClick={redo}
          className="p-2 hover:bg-gray-100 rounded transition"
          title="Redo"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
          </svg>
        </button>
      </div>

      <div className="flex items-center gap-1">
        {TOOLBAR_TOOLS.map((tool) => (
          <ToolButton 
            key={tool.id} 
            tool={tool} 
            currentTool={currentTool}
            onToolSelect={onToolSelect}
          />
        ))}
      </div>

      <div className="ml-auto flex items-center gap-2">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Zoom:</span>
          <select defaultValue="1" className="bg-gray-100 border border-gray-300 rounded px-2 py-1">
            <option value="0.5">50%</option>
            <option value="0.75">75%</option>
            <option value="1">100%</option>
            <option value="1.25">125%</option>
            <option value="1.5">150%</option>
            <option value="2">200%</option>
          </select>
        </div>
        <button 
          onClick={() => handleSave()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Save
        </button>
        <button
          onClick={onToggleAI}
          className={`px-4 py-2 rounded hover:opacity-90 transition ${
            showAIPanel ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          AI
        </button>
      </div>
    </div>
  );
}

function ToolButton({ tool, currentTool, onToolSelect }: { 
  tool: (typeof TOOLBAR_TOOLS)[number];
  currentTool: string;
  onToolSelect: (toolId: string) => void;
}) {
  return (
    <button
      onClick={() => onToolSelect(tool.id)}
      className={cn(
        'p-2 hover:bg-gray-100 rounded transition flex items-center gap-2',
        'text-sm font-medium',
        currentTool === tool.id && 'bg-gray-200'
      )}
      title={tool.name}
    >
      {getToolIcon(tool.id)}
      <span>{tool.name}</span>
    </button>
  );
}

function getToolIcon(toolId: string) {
  const icons: Record<string, JSX.Element> = {
    select: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
      </svg>
    ),
    text: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
      </svg>
    ),
    rectangle: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth={2} />
      </svg>
    ),
    circle: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" strokeWidth={2} />
      </svg>
    ),
    triangle: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3l10 18H2L12 3z" />
      </svg>
    ),
    line: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeWidth={2} d="M4 20L20 4" />
      </svg>
    ),
    arrow: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 20L20 4m0 0l-4 4m4-4l-4-4" />
      </svg>
    ),
    image: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  };

  return icons[toolId] || icons.select;
}
