import Konva from 'konva';
import { Element, Position, Size } from '@prestili/shared';

export class PresentationStage {
  private stage: Konva.Stage;
  private layers: Map<string, Konva.Layer> = new Map();
  private container: string;

  constructor(container: string, width: number, height: number) {
    this.container = container;
    this.stage = new Konva.Stage({
      container,
      width,
      height,
    });
  }

  getStage(): Konva.Stage {
    return this.stage;
  }

  addLayer(id: string, layer: Konva.Layer): void {
    this.layers.set(id, layer);
    this.stage.add(layer);
  }

  getLayer(id: string): Konva.Layer | undefined {
    return this.layers.get(id);
  }

  removeLayer(id: string): void {
    const layer = this.layers.get(id);
    if (layer) {
      layer.destroy();
      this.layers.delete(id);
    }
  }

  setSize(size: Size): void {
    this.stage.width(size.width);
    this.stage.height(size.height);
  }

  getSize(): Size {
    return {
      width: this.stage.width(),
      height: this.stage.height(),
    };
  }

  scale(scale: { x: number; y: number }): void {
    this.stage.scale(scale);
  }

  getScale(): { x: number; y: number } {
    return this.stage.scale();
  }

  position(position: Position): void {
    this.stage.position(position);
  }

  getPosition(): Position {
    return this.stage.position();
  }

  destroy(): void {
    this.stage.destroy();
  }

  batchDraw(): void {
    this.stage.batchDraw();
  }
}
