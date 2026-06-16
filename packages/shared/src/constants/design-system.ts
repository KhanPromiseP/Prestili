import { DesignSystem } from '../types/presentation';

export const DEFAULT_DESIGN_SYSTEM: DesignSystem = {
  typography: {
    headingFont: 'Inter',
    bodyFont: 'Inter',
    scale: [12, 14, 16, 18, 24, 32, 48, 64, 96],
    weights: [400, 500, 600, 700],
    spacing: [4, 8, 12, 16, 24, 32, 48, 64, 96],
  },
  colors: {
    primary: ['#2563EB', '#1D4ED8', '#1E40AF'],
    secondary: ['#64748B', '#475569', '#334155'],
    accent: ['#F59E0B', '#D97706', '#B45309'],
    neutral: ['#FFFFFF', '#F8FAFC', '#F1F5F9', '#E2E8F0', '#CBD5E1', '#94A3B8', '#64748B', '#475569', '#334155', '#1E293B', '#0F172A'],
  },
  layouts: [],
  spacing: {
    base: 8,
    scale: [4, 8, 12, 16, 24, 32, 48, 64, 96],
  },
};

export const DEFAULT_SLIDE_SIZE = {
  width: 1920,
  height: 1080,
};

export const DEFAULT_ASPECT_RATIOS = [
  { label: '16:9', value: '16:9', width: 1920, height: 1080 },
  { label: '4:3', value: '4:3', width: 1600, height: 1200 },
  { label: '1:1', value: '1:1', width: 1080, height: 1080 },
  { label: '9:16', value: '9:16', width: 1080, height: 1920 },
];

export const TOOLBAR_TOOLS = [
  { id: 'select', name: 'Select', icon: 'cursor', type: 'selection' },
  { id: 'text', name: 'Text', icon: 'type', type: 'text' },
  { id: 'rectangle', name: 'Rectangle', icon: 'square', type: 'shape' },
  { id: 'circle', name: 'Circle', icon: 'circle', type: 'shape' },
  { id: 'triangle', name: 'Triangle', icon: 'triangle', type: 'shape' },
  { id: 'line', name: 'Line', icon: 'minus', type: 'shape' },
  { id: 'arrow', name: 'Arrow', icon: 'arrow-right', type: 'shape' },
  { id: 'image', name: 'Image', icon: 'image', type: 'image' },
];
