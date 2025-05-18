import type { GameDefinition } from '$lib';
import { z } from 'zod';
import NoopResult from '../../NoopResult.svelte';
import {
  CLIENT_SEED_SERVER_SEED_NONCE_CONTROLS,
  CLIENT_SEED_SERVER_SEED_NONCE_SCHEMA
} from '../../controlSetup';

export const gameDefinition: GameDefinition = {
  name: 'Plinko',
  schema: CLIENT_SEED_SERVER_SEED_NONCE_SCHEMA.extend({
    risk: z.enum(['low', 'medium', 'high']),
    rows: z.number().min(8).max(16)
  }),
  controls: [
    ...CLIENT_SEED_SERVER_SEED_NONCE_CONTROLS,
    {
      id: 'risk',
      name: 'risk',
      label: 'Risk',
      type: 'select',
      options: ['low', 'medium', 'high']
    },
    {
      id: 'rows',
      name: 'rows',
      label: 'Rows',
      type: 'number',
      required: true,
      default: 8,
      attrs: {
        min: 8,
        max: 16
      }
    }
  ],
  ResultComponent: NoopResult
};
