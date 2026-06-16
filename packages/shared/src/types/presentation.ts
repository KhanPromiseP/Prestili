export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Style {
  fontSize?: number;
  fontWeight?: string;
  fontFamily?: string;
  color?: string;
  backgroundColor?: string;
  opacity?: number;
  rotation?: number;
  strokeWidth?: number;
  strokeColor?: string;
  shadowColor?: string;
  shadowBlur?: number;
  shadowOffsetX?: number;
  shadowOffsetY?: number;
}

export interface Element {
  id: string;
  type: ElementType;
  content: any;
  position: Position;
  size: Size;
  style: Style;
  animation?: ElementAnimation;
  locked?: boolean;
  visible?: boolean;
  groupId?: string;
}

export type ElementType = 'text' | 'image' | 'shape' | 'video' | 'chart' | 'icon';

export interface ElementAnimation {
  entrance?: AnimationType;
  exit?: AnimationType;
  emphasis?: AnimationType;
  duration?: number;
  delay?: number;
  easing?: string;
}

export type AnimationType = 
  | 'fade-in' 
  | 'fade-out' 
  | 'slide-left' 
  | 'slide-right' 
  | 'slide-up' 
  | 'slide-down' 
  | 'zoom-in' 
  | 'zoom-out' 
  | 'rotate-in' 
  | 'rotate-out';

export interface Slide {
  id: string;
  elements: Element[];
  layout: LayoutConfig;
  animation: SlideAnimation;
  speakerNotes: string;
  background?: BackgroundConfig;
}

export interface LayoutConfig {
  type: string;
  columns?: number;
  spacing?: number;
}

export interface SlideAnimation {
  transition: AnimationType;
  duration: number;
}

export interface BackgroundConfig {
  type: 'solid' | 'gradient' | 'image';
  value: string;
}

export interface Section {
  id: string;
  title: string;
  slides: string[];
  spatialPosition: Position;
}

export interface GlobalMapConfig {
  mode: GlobalMapMode;
  cameraPath: CameraPoint[];
}

export type GlobalMapMode = 'tree' | 'flow' | 'cluster' | 'spiral' | 'constellation';

export interface CameraPoint {
  x: number;
  y: number;
  zoom: number;
  slideId: string;
}

export interface PresentationDocument {
  id: string;
  projectId: string;
  metadata: PresentationMetadata;
  structure: PresentationStructure;
  designSystem: DesignSystem;
}

export interface PresentationMetadata {
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  version: number;
  theme?: string;
  aspectRatio?: string;
}

export interface PresentationStructure {
  sections: Section[];
  slides: Record<string, Slide>;
  globalMap: GlobalMapConfig;
}

export interface DesignSystem {
  typography: TypographySystem;
  colors: ColorSystem;
  layouts: LayoutTemplate[];
  spacing: SpacingSystem;
}

export interface TypographySystem {
  headingFont: string;
  bodyFont: string;
  scale: number[];
  weights: number[];
  spacing: number[];
}

export interface ColorSystem {
  primary: string[];
  secondary: string[];
  accent: string[];
  neutral: string[];
}

export interface LayoutTemplate {
  id: string;
  name: string;
  type: string;
  thumbnail?: string;
}

export interface SpacingSystem {
  base: number;
  scale: number[];
}
