export interface EditorState {
  presentationId: string | null;
  selectedElements: string[];
  clipboard: ClipboardData | null;
  history: HistoryState;
  zoom: number;
  pan: { x: number; y: number };
  isPlaying: boolean;
  currentSlideId: string | null;
}

export interface ClipboardData {
  elements: any[];
  operation: 'copy' | 'cut';
}

export interface HistoryState {
  past: any[];
  present: any;
  future: any[];
}

export interface Tool {
  id: string;
  name: string;
  icon: string;
  type: 'selection' | 'text' | 'shape' | 'image' | 'draw';
}

export interface ToolbarAction {
  type: 'undo' | 'redo' | 'delete' | 'duplicate' | 'group' | 'ungroup' | 'bring-forward' | 'send-backward';
}

export interface PropertyPanelProps {
  elementId: string;
  onUpdate: (elementId: string, updates: any) => void;
}
