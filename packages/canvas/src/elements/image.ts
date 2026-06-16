import Konva from 'konva';
import { Style } from '@prestili/shared';

export class ImageElement {
  private image: Konva.Image;
  private konvaImage: Konva.Image | null = null;

  constructor(config: {
    id: string;
    image: HTMLImageElement | string;
    position: { x: number; y: number };
    size: { width: number; height: number };
    style: Style;
    draggable?: boolean;
  }) {
    this.image = new Konva.Image({
      id: config.id,
      x: config.position.x,
      y: config.position.y,
      width: config.size.width,
      height: config.size.height,
      opacity: config.style.opacity || 1,
      draggable: config.draggable || false,
      image: undefined,
    });

    if (typeof config.image === 'string') {
      this.loadImage(config.image);
    } else {
      this.image.image(config.image);
    }
  }

  private loadImage(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        this.image.image(img);
        resolve();
      };
      img.onerror = reject;
      img.src = src;
    });
  }

  getNode(): Konva.Image {
    return this.image;
  }

  setImage(image: HTMLImageElement | string): void {
    if (typeof image === 'string') {
      this.loadImage(image);
    } else {
      this.image.image(image);
    }
  }

  setStyle(style: Partial<Style>): void {
    if (style.opacity) this.image.opacity(style.opacity);
  }

  setPosition(position: { x: number; y: number }): void {
    this.image.position(position);
  }

  getPosition(): { x: number; y: number } {
    return this.image.position();
  }

  setSize(size: { width: number; height: number }): void {
    this.image.width(size.width);
    this.image.height(size.height);
  }

  getSize(): { width: number; height: number } {
    return {
      width: this.image.width(),
      height: this.image.height(),
    };
  }

  setRotation(rotation: number): void {
    this.image.rotation(rotation);
  }

  getRotation(): number {
    return this.image.rotation();
  }

  destroy(): void {
    this.image.destroy();
  }
}
