import Konva from 'konva';
import { Element, Style } from '@prestili/shared';

export class TextElement {
  private text: Konva.Text;

  constructor(config: {
    id: string;
    text: string;
    position: { x: number; y: number };
    style: Style;
    draggable?: boolean;
  }) {
    this.text = new Konva.Text({
      id: config.id,
      text: config.text,
      x: config.position.x,
      y: config.position.y,
      fontSize: config.style.fontSize || 16,
      fontFamily: config.style.fontFamily || 'Arial',
      fontStyle: config.style.fontWeight === 'bold' ? 'bold' : 'normal',
      fill: config.style.color || '#000000',
      opacity: config.style.opacity || 1,
      draggable: config.draggable || false,
      rotation: config.style.rotation || 0,
    });
  }

  getNode(): Konva.Text {
    return this.text;
  }

  setText(text: string): void {
    this.text.text(text);
  }

  getText(): string {
    return this.text.text();
  }

  setStyle(style: Partial<Style>): void {
    if (style.fontSize) this.text.fontSize(style.fontSize);
    if (style.fontFamily) this.text.fontFamily(style.fontFamily);
    if (style.fontWeight) this.text.fontStyle(style.fontWeight === 'bold' ? 'bold' : 'normal');
    if (style.color) this.text.fill(style.color);
    if (style.opacity) this.text.opacity(style.opacity);
  }

  setPosition(position: { x: number; y: number }): void {
    this.text.position(position);
  }

  getPosition(): { x: number; y: number } {
    return this.text.position();
  }

  setSize(size: { width: number; height: number }): void {
    this.text.width(size.width);
    this.text.height(size.height);
  }

  getSize(): { width: number; height: number } {
    return {
      width: this.text.width(),
      height: this.text.height(),
    };
  }

  setRotation(rotation: number): void {
    this.text.rotation(rotation);
  }

  getRotation(): number {
    return this.text.rotation();
  }

  destroy(): void {
    this.text.destroy();
  }
}
