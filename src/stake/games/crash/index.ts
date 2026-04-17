import { z } from 'zod';
import NoopResult from '../../NoopResult.svelte';
import type { GameDefinition } from '$lib';

export const gameDefinition: GameDefinition = {
  name: 'Crash',
  schema: z.object({
    gamehash: z.string(),
  }),
  controls: [
    {
      id: 'gamehash',
      name: 'gamehash',
      label: 'Game Hash',
      type: 'text',
      required: true,
    },
    {
      id: 'blockhash',
      name: 'blockhash',
      label: 'Block Hash',
      type: 'text',
      disabled: true,
      syncToUrl: false,
      attrs: {
        value: '0000000000000000001b34dc6a1e86083f95500b096231436e9b25cbdd0075c4',
      },
    },
  ],
  ResultComponent: NoopResult,
};
