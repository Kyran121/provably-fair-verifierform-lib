import type { Component } from 'svelte';
import type { z } from 'zod';

export type ControlType = 'text' | 'number' | 'select';

export interface Control {
  id: string;
  name: string;
  label: string;
  type: ControlType;
  required?: boolean; //defaults to false
  disabled?: boolean; //defaults to false
  syncToUrl?: boolean; //defaults to true
  default?: string | number;
  options?: string[];
  attrs?: Record<string, unknown>;
}

export interface GameDefinition<T extends z.ZodTypeAny = z.ZodTypeAny> {
  name: string;
  controls: Control[];
  schema: T;
  ResultComponent: Component<{ formValues: Record<string, unknown> }>;
  ExplanationComponent?: Component<{ formValues: Record<string, unknown> }>;
}
