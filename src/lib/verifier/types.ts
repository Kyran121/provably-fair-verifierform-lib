import type { Component } from 'svelte';

export type ControlType = 'text' | 'number' | 'select';

export interface Control {
  id: string;
  name: string;
  label: string;
  type: ControlType;
  required?: boolean; //defaults to false
  disabled?: boolean; //defaults to false
  syncToUrl?: boolean; //defaults to true
  options?: string[];
  attrs?: Record<string, unknown>;
}

export interface GameDefinition {
  name: string;
  controls: Control[];
  ResultComponent: Component<{ formValues: Record<string, unknown> }>;
  ExplanationComponent?: Component<{ formValues: Record<string, unknown> }>;
}
