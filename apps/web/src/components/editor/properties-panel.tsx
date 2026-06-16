'use client';

import { useEditorStore } from '@/stores/editor';
import { Element, Style } from '@prestili/shared';

export function PropertiesPanel() {
  const { selectedElements, updateElement, history } = useEditorStore();
  const selectedElement = history.present?.elements?.find(
    (el: Element) => el.id === selectedElements[0]
  );

  if (!selectedElement) {
    return (
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold mb-3 text-sm">Properties</h3>
        <p className="text-xs text-muted-foreground">Select an element to edit its properties</p>
      </div>
    );
  }

  const handleStyleChange = (updates: Partial<Style>) => {
    updateElement(selectedElement.id, { style: { ...selectedElement.style, ...updates } });
  };

  return (
    <div className="p-4 border-b border-border overflow-auto max-h-80">
      <h3 className="font-semibold mb-3 text-sm">Properties</h3>

      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium mb-1 block">Type</label>
          <div className="text-sm text-muted-foreground capitalize">{selectedElement.type}</div>
        </div>

        {selectedElement.type === 'text' && (
          <>
            <div>
              <label className="text-sm font-medium mb-1 block">Font Size</label>
              <input
                type="number"
                value={selectedElement.style.fontSize || 16}
                onChange={(e) => handleStyleChange({ fontSize: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-border rounded"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Font Weight</label>
              <select
                value={selectedElement.style.fontWeight || 'normal'}
                onChange={(e) => handleStyleChange({ fontWeight: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded"
              >
                <option value="normal">Normal</option>
                <option value="bold">Bold</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Color</label>
              <input
                type="color"
                value={selectedElement.style.color || '#000000'}
                onChange={(e) => handleStyleChange({ color: e.target.value })}
                className="w-full h-10 border border-border rounded"
              />
            </div>
          </>
        )}

        {selectedElement.type === 'shape' && (
          <>
            <div>
              <label className="text-sm font-medium mb-1 block">Fill Color</label>
              <input
                type="color"
                value={selectedElement.style.backgroundColor || '#cccccc'}
                onChange={(e) => handleStyleChange({ backgroundColor: e.target.value })}
                className="w-full h-10 border border-border rounded"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Stroke Color</label>
              <input
                type="color"
                value={selectedElement.style.strokeColor || '#000000'}
                onChange={(e) => handleStyleChange({ strokeColor: e.target.value })}
                className="w-full h-10 border border-border rounded"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Stroke Width</label>
              <input
                type="number"
                value={selectedElement.style.strokeWidth || 1}
                onChange={(e) => handleStyleChange({ strokeWidth: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-border rounded"
              />
            </div>
          </>
        )}

        <div>
          <label className="text-sm font-medium mb-1 block">Opacity</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={selectedElement.style.opacity || 1}
            onChange={(e) => handleStyleChange({ opacity: Number(e.target.value) })}
            className="w-full"
          />
        </div>

        <div className="pt-4 border-t border-border">
          <h4 className="text-sm font-medium mb-2">Position</h4>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-muted-foreground">X</label>
              <input
                type="number"
                value={selectedElement.position.x}
                onChange={(e) => updateElement(selectedElement.id, { position: { ...selectedElement.position, x: Number(e.target.value) } })}
                className="w-full px-2 py-1 border border-border rounded text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Y</label>
              <input
                type="number"
                value={selectedElement.position.y}
                onChange={(e) => updateElement(selectedElement.id, { position: { ...selectedElement.position, y: Number(e.target.value) } })}
                className="w-full px-2 py-1 border border-border rounded text-sm"
              />
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2">Size</h4>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-muted-foreground">Width</label>
              <input
                type="number"
                value={selectedElement.size.width}
                onChange={(e) => updateElement(selectedElement.id, { size: { ...selectedElement.size, width: Number(e.target.value) } })}
                className="w-full px-2 py-1 border border-border rounded text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Height</label>
              <input
                type="number"
                value={selectedElement.size.height}
                onChange={(e) => updateElement(selectedElement.id, { size: { ...selectedElement.size, height: Number(e.target.value) } })}
                className="w-full px-2 py-1 border border-border rounded text-sm"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
