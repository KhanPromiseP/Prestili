'use client';

import { useEditorStore } from '@/stores/editor';
import { Element } from '@prestili/shared';

export function LayersPanel() {
  const { selectedElements, setSelectedElements, history } = useEditorStore();
  const elements = history.present?.elements || [];

  const handleElementClick = (elementId: string) => {
    setSelectedElements([elementId]);
  };

  const handleVisibilityToggle = (elementId: string) => {
    // TODO: Implement visibility toggle
  };

  const handleLockToggle = (elementId: string) => {
    // TODO: Implement lock toggle
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b border-border">
        <h3 className="font-semibold text-xs">Layers</h3>
      </div>

      <div className="flex-1 overflow-auto p-3">
        {elements.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-4">No elements yet</p>
        ) : (
          <div className="space-y-1.5">
            {[...elements].reverse().map((element: Element) => (
              <div
                key={element.id}
                onClick={() => handleElementClick(element.id)}
                className={`
                  flex items-center gap-2 p-1.5 rounded cursor-pointer transition
                  ${selectedElements.includes(element.id) ? 'bg-secondary' : 'hover:bg-secondary/50'}
                `}
              >
                <div className="flex-1 flex items-center gap-2">
                  <span className="text-xs capitalize">{element.type}</span>
                  {element.type === 'text' && (
                    <span className="text-[10px] text-muted-foreground truncate max-w-20">
                      {element.content}
                    </span>
                  )}
                </div>
                <div className="flex gap-0.5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleVisibilityToggle(element.id);
                    }}
                    className="p-0.5 hover:bg-background rounded"
                    title="Toggle visibility"
                  >
                    {element.visible !== false ? (
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    ) : (
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    )}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLockToggle(element.id);
                    }}
                    className="p-0.5 hover:bg-background rounded"
                    title="Toggle lock"
                  >
                    {element.locked ? (
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    ) : (
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
