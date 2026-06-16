'use client';

import { useEffect, useRef } from 'react';
import Konva from 'konva';
import { PresentationStage, TextElement, ShapeElement, ShapeType } from '@prestili/canvas';
import { generateId, Element, DEFAULT_SLIDE_SIZE } from '@prestili/shared';
import { useEditorStore } from '@/stores/editor';

export function EditorCanvas({ currentTool }: { currentTool: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<PresentationStage | null>(null);
  const { selectedElements, addElement, updateElement, setSelectedElements, history, isPlaying, currentSlideId } = useEditorStore();

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const stage = new PresentationStage(
      'canvas-container',
      DEFAULT_SLIDE_SIZE.width,
      DEFAULT_SLIDE_SIZE.height
    );

    stageRef.current = stage;

    // Add a background layer
    const backgroundLayer = new Konva.Layer();
    stage.addLayer('background', backgroundLayer);

    // Add a main elements layer
    const elementsLayer = new Konva.Layer();
    stage.addLayer('elements', elementsLayer);

    // Add a transformer layer for selection
    const transformerLayer = new Konva.Layer();
    stage.addLayer('transformer', transformerLayer);

    // Draw slide background
    const background = new Konva.Rect({
      x: 0,
      y: 0,
      width: DEFAULT_SLIDE_SIZE.width,
      height: DEFAULT_SLIDE_SIZE.height,
      fill: '#ffffff',
      id: 'slide-background',
    });
    backgroundLayer.add(background);
    backgroundLayer.batchDraw();

    return () => {
      stage.destroy();
    };
  }, [containerRef]);

  // Re-render elements when they change
  useEffect(() => {
    const elementsLayer = stageRef.current?.getLayer('elements');
    const backgroundLayer = stageRef.current?.getLayer('background');
    if (!elementsLayer || !backgroundLayer) return;

    // Clear existing elements
    elementsLayer.destroyChildren();

    // Get current slide elements
    const slides = history.present?.slides || {};
    const currentSlide = currentSlideId ? slides[currentSlideId] : null;
    const elements = currentSlide?.elements || history.present?.elements || [];

    // Update slide background color
    const background = backgroundLayer.findOne('#slide-background') as Konva.Rect;
    if (background && currentSlide?.backgroundColor) {
      background.fill(currentSlide.backgroundColor);
      backgroundLayer.batchDraw();
    }

    // Render all elements
    elements.forEach((element: Element) => {
      renderElement(element);
    });
  }, [history.present?.slides, history.present?.elements, currentSlideId]);

  // Update transformer when selection changes
  useEffect(() => {
    const transformerLayer = stageRef.current?.getLayer('transformer');
    const elementsLayer = stageRef.current?.getLayer('elements');
    if (!transformerLayer || !elementsLayer) return;

    transformerLayer.destroyChildren();

    if (selectedElements.length > 0) {
      const transformer = new Konva.Transformer({
        nodes: selectedElements.map((id) => elementsLayer.findOne(`#${id}`)).filter(Boolean) as any[],
        rotateEnabled: true,
        enabledAnchors: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
        boundBoxFunc: (oldBox, newBox) => {
          // Limit resize
          if (newBox.width < 20 || newBox.height < 20) {
            return oldBox;
          }
          return newBox;
        },
      });
      transformerLayer.add(transformer);
      transformerLayer.batchDraw();
    }
  }, [selectedElements]);

  const handleCanvasClick = (e: any) => {
    if (currentTool === 'select') {
      // Handle selection
      const clickedNode = e.target;
      // Check if it's a valid Konva node with an id method and not the stage itself
      if (clickedNode && clickedNode.id && typeof clickedNode.id === 'function' && clickedNode.id() && clickedNode.className !== 'Stage') {
        setSelectedElements([clickedNode.id()]);
      } else {
        setSelectedElements([]);
      }
    } else if (currentTool === 'text') {
      addTextElement();
    } else if (currentTool === 'rectangle' || currentTool === 'circle' || currentTool === 'triangle' || currentTool === 'line' || currentTool === 'arrow') {
      addShapeElement(currentTool as ShapeType);
    }
  };

  const addTextElement = () => {
    const element: Element = {
      id: generateId(),
      type: 'text',
      content: 'Double-click to edit',
      position: { x: 100, y: 100 },
      size: { width: 400, height: 50 },
      style: {
        fontSize: 24,
        fontWeight: 'normal',
        fontFamily: 'Arial',
        color: '#000000',
      },
    };
    addElement(element);
    renderElement(element);
  };

  const addShapeElement = (type: ShapeType) => {
    const element: Element = {
      id: generateId(),
      type: 'shape',
      content: type,
      position: { x: 200, y: 200 },
      size: { width: 200, height: 200 },
      style: {
        backgroundColor: '#cccccc',
        strokeColor: '#000000',
        strokeWidth: 2,
      },
    };
    addElement(element);
    renderElement(element);
  };

  const renderElement = (element: Element) => {
    if (!stageRef.current) return;

    const elementsLayer = stageRef.current.getLayer('elements');
    if (!elementsLayer) return;

    if (element.type === 'text') {
      const textEl = new TextElement({
        id: element.id,
        text: element.content,
        position: element.position,
        style: element.style,
        draggable: true,
      });
      elementsLayer.add(textEl.getNode());
      
      // Add event listeners for editing
      textEl.getNode().on('dblclick', () => {
        const newText = prompt('Enter text:', element.content);
        if (newText !== null) {
          updateElement(element.id, { content: newText });
          textEl.setText(newText);
        }
      });

      textEl.getNode().on('dragend', () => {
        const pos = textEl.getPosition();
        updateElement(element.id, { position: pos });
      });

      textEl.getNode().on('transformend', () => {
        const node = textEl.getNode();
        const scaleX = node.scaleX();
        const scaleY = node.scaleY();
        const rotation = node.rotation();

        // Reset scale to avoid accumulation
        node.scale({ x: 1, y: 1 });

        // Update size based on scale
        const newSize = {
          width: element.size.width * scaleX,
          height: element.size.height * scaleY,
        };

        updateElement(element.id, {
          size: newSize,
          position: node.position(),
          style: {
            ...element.style,
            rotation,
          },
        });
      });
    } else if (element.type === 'shape') {
      const shapeEl = new ShapeElement({
        id: element.id,
        type: element.content as ShapeType,
        position: element.position,
        size: element.size,
        style: element.style,
        draggable: true,
      });
      elementsLayer.add(shapeEl.getNode());

      shapeEl.getNode().on('click', (e: any) => {
        e.cancelBubble = true;
        setSelectedElements([element.id]);
      });

      shapeEl.getNode().on('dragend', () => {
        const pos = shapeEl.getPosition();
        updateElement(element.id, { position: pos });
      });

      shapeEl.getNode().on('transformend', () => {
        const node = shapeEl.getNode();
        const scaleX = node.scaleX();
        const scaleY = node.scaleY();
        const rotation = node.rotation();

        // Reset scale to avoid accumulation
        node.scale({ x: 1, y: 1 });

        // Update size based on scale
        const newSize = {
          width: element.size.width * scaleX,
          height: element.size.height * scaleY,
        };

        updateElement(element.id, {
          size: newSize,
          position: node.position(),
          style: {
            ...element.style,
            rotation,
          },
        });
      });
    }

    elementsLayer.batchDraw();
  };

  return (
    <div className="flex-1 bg-muted/30 flex items-center justify-center overflow-auto p-8">
      <div
        id="canvas-container"
        ref={containerRef}
        className="bg-white shadow-2xl rounded-lg"
        onClick={handleCanvasClick}
        style={{
          width: DEFAULT_SLIDE_SIZE.width,
          height: DEFAULT_SLIDE_SIZE.height,
          transform: `scale(${useEditorStore.getState().zoom})`,
          transformOrigin: 'center center',
          display: isPlaying ? 'block' : 'block',
        }}
      />
    </div>
  );
}
