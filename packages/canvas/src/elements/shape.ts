import Konva from 'konva';
import { Style } from '@prestili/shared';

export type ShapeType = 'rectangle' | 'circle' | 'ellipse' | 'triangle' | 'line' | 'arrow';

export class ShapeElement {
  private shape: Konva.Shape | Konva.Rect | Konva.Circle | Konva.Ellipse | Konva.Line;

  constructor(config: {
    id: string;
    type: ShapeType;
    position: { x: number; y: number };
    size: { width: number; height: number };
    style: Style;
    draggable?: boolean;
  }) {
    const { id, type, position, size, style, draggable = false } = config;

    const commonProps = {
      id,
      x: position.x,
      y: position.y,
      fill: style.backgroundColor || '#cccccc',
      stroke: style.strokeColor || '#000000',
      strokeWidth: style.strokeWidth || 1,
      opacity: style.opacity || 1,
      draggable,
      shadowColor: style.shadowColor,
      shadowBlur: style.shadowBlur,
      shadowOffsetX: style.shadowOffsetX,
      shadowOffsetY: style.shadowOffsetY,
      rotation: style.rotation || 0,
    };

    switch (type) {
      case 'rectangle':
        this.shape = new Konva.Rect({
          ...commonProps,
          width: size.width,
          height: size.height,
        });
        break;
      case 'circle':
        this.shape = new Konva.Circle({
          ...commonProps,
          radius: Math.min(size.width, size.height) / 2,
        });
        break;
      case 'ellipse':
        this.shape = new Konva.Ellipse({
          ...commonProps,
          radiusX: size.width / 2,
          radiusY: size.height / 2,
        });
        break;
      case 'triangle':
        this.shape = new Konva.Shape({
          ...commonProps,
          sceneFunc: (context) => {
            context.beginPath();
            context.moveTo(0, 0);
            context.lineTo(size.width, size.height);
            context.lineTo(-size.width, size.height);
            context.closePath();
            context.fillStrokeShape(this.shape);
          },
        });
        break;
      case 'line':
        this.shape = new Konva.Line({
          ...commonProps,
          points: [0, 0, size.width, size.height],
          stroke: style.strokeColor || '#000000',
          strokeWidth: style.strokeWidth || 2,
        });
        break;
      case 'arrow':
        this.shape = new Konva.Arrow({
          ...commonProps,
          points: [0, 0, size.width, size.height],
          pointerLength: 10,
          pointerWidth: 10,
        });
        break;
      default:
        this.shape = new Konva.Rect({
          ...commonProps,
          width: size.width,
          height: size.height,
        });
    }
  }

  getNode(): Konva.Shape | Konva.Rect | Konva.Circle | Konva.Ellipse | Konva.Line | Konva.Arrow {
    return this.shape;
  }

  setStyle(style: Partial<Style>): void {
    if (style.backgroundColor) this.shape.fill(style.backgroundColor);
    if (style.strokeColor) this.shape.stroke(style.strokeColor);
    if (style.strokeWidth) this.shape.strokeWidth(style.strokeWidth);
    if (style.opacity) this.shape.opacity(style.opacity);
    if (style.shadowColor) this.shape.shadowColor(style.shadowColor);
    if (style.shadowBlur) this.shape.shadowBlur(style.shadowBlur);
    if (style.shadowOffsetX) this.shape.shadowOffsetX(style.shadowOffsetX);
    if (style.shadowOffsetY) this.shape.shadowOffsetY(style.shadowOffsetY);
    if (style.rotation !== undefined) this.shape.rotation(style.rotation);
  }

  setPosition(position: { x: number; y: number }): void {
    this.shape.position(position);
  }

  getPosition(): { x: number; y: number } {
    return this.shape.position();
  }

  setSize(size: { width: number; height: number }): void {
    if (this.shape instanceof Konva.Rect) {
      this.shape.width(size.width);
      this.shape.height(size.height);
    } else if (this.shape instanceof Konva.Circle) {
      this.shape.radius(Math.min(size.width, size.height) / 2);
    } else if (this.shape instanceof Konva.Ellipse) {
      this.shape.radiusX(size.width / 2);
      this.shape.radiusY(size.height / 2);
    }
  }

  getSize(): { width: number; height: number } {
    return {
      width: this.shape.width(),
      height: this.shape.height(),
    };
  }

  setRotation(rotation: number): void {
    this.shape.rotation(rotation);
  }

  getRotation(): number {
    return this.shape.rotation();
  }

  destroy(): void {
    this.shape.destroy();
  }
}
