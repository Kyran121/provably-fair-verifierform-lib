import type { Component } from 'svelte';

export type ControlType = 'text' | 'number' | 'select';

export interface Control {
	id: string;
	name: string;
	label: string;
	type: ControlType;
	required: boolean;
	options?: { label: string; value: string }[];
	attrs?: Record<string, any>;
}

export interface GameDefinition {
	name: string;
	controls: Control[];
	ResultComponent: Component<{ formValues: Record<string, any> }>;
	ExplanationComponent?: Component<{ formValues: Record<string, any> }>;
}
