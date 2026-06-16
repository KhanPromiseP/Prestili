import Konva from 'konva';
import { AnimationType } from '@prestili/shared';

export class AnimationEngine {
  private animations: Map<string, Konva.Animation> = new Map();

  animateNode(
    node: Konva.Node,
    config: {
      type: AnimationType;
      duration: number;
      easing?: (t: number) => number;
      onFinish?: () => void;
    }
  ): void {
    const { type, duration, easing = Konva.Easings.EaseInOut, onFinish } = config;

    let tween: Konva.Tween;

    switch (type) {
      case 'fade-in':
        tween = new Konva.Tween({
          node,
          opacity: 1,
          duration: duration / 1000,
          easing,
          onFinish,
        });
        break;
      case 'fade-out':
        tween = new Konva.Tween({
          node,
          opacity: 0,
          duration: duration / 1000,
          easing,
          onFinish,
        });
        break;
      case 'zoom-in':
        tween = new Konva.Tween({
          node,
          scaleX: 1,
          scaleY: 1,
          duration: duration / 1000,
          easing,
          onFinish,
        });
        node.scale({ x: 0, y: 0 });
        break;
      case 'zoom-out':
        tween = new Konva.Tween({
          node,
          scaleX: 0,
          scaleY: 0,
          duration: duration / 1000,
          easing,
          onFinish,
        });
        break;
      case 'slide-left':
        tween = new Konva.Tween({
          node,
          x: node.x() - 100,
          duration: duration / 1000,
          easing,
          onFinish,
        });
        break;
      case 'slide-right':
        tween = new Konva.Tween({
          node,
          x: node.x() + 100,
          duration: duration / 1000,
          easing,
          onFinish,
        });
        break;
      case 'slide-up':
        tween = new Konva.Tween({
          node,
          y: node.y() - 100,
          duration: duration / 1000,
          easing,
          onFinish,
        });
        break;
      case 'slide-down':
        tween = new Konva.Tween({
          node,
          y: node.y() + 100,
          duration: duration / 1000,
          easing,
          onFinish,
        });
        break;
      case 'rotate-in':
        tween = new Konva.Tween({
          node,
          rotation: 0,
          duration: duration / 1000,
          easing,
          onFinish,
        });
        node.rotation(-360);
        break;
      case 'rotate-out':
        tween = new Konva.Tween({
          node,
          rotation: 360,
          duration: duration / 1000,
          easing,
          onFinish,
        });
        break;
      default:
        tween = new Konva.Tween({
          node,
          opacity: 1,
          duration: duration / 1000,
          easing,
          onFinish,
        });
    }

    tween.play();
  }

  play(): void {
    this.animations.forEach((animation) => animation.start());
  }

  pause(): void {
    this.animations.forEach((animation) => animation.stop());
  }

  stop(): void {
    this.animations.forEach((animation) => {
      animation.stop();
      // animation.destroy(); // Konva Animation doesn't have destroy method
    });
    this.animations.clear();
  }
}
