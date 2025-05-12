<script lang="ts">
  import { z } from 'zod';
  import type { GameDefinition } from '$lib/verifier/types';
  import { VerifierForm } from '$lib';
  import DiceResult from '../stake/DiceResult.svelte';
  import DiceExplanation from '../stake/DiceExplanation.svelte';
  import NoopResult from '../stake/NoopResult.svelte';

  const diceSchema = z.object({
    clientseed: z.string(),
    serverseed: z.string(),
    nonce: z.number().nonnegative()
  });

  const slideSchema = z.object({
    slidehash: z.string(),
    blockhash: z.string()
  });

  const games = {
    dice: {
      name: 'Dice',
      schema: diceSchema,
      controls: [
        {
          id: 'clientseed',
          name: 'clientseed',
          label: 'Client Seed',
          type: 'text',
          required: true
        },
        {
          id: 'serverseed',
          name: 'serverseed',
          label: 'Server Seed',
          type: 'text',
          required: true
        },
        {
          id: 'nonce',
          name: 'nonce',
          label: 'Nonce',
          type: 'number',
          required: true,
          attrs: { min: 0 }
        }
      ],
      ResultComponent: DiceResult,
      ExplanationComponent: DiceExplanation
    },
    slide: {
      name: 'Slide',
      schema: slideSchema,
      controls: [
        {
          id: 'slidehash',
          name: 'slidehash',
          label: 'Slide Hash',
          type: 'text',
          required: true
        },
        {
          id: 'blockhash',
          name: 'blockhash',
          label: 'Block Hash',
          type: 'select',
          options: [
            '0000000000000000000b20f796f5421cac95c4efb06c6bbf6408d6f9b5d7b9dc',
            '00000000000000000000644330e1340fc6e894a95c37060bdd180ed11d068944'
          ]
        }
      ],
      ResultComponent: NoopResult
    }
  } satisfies Record<string, GameDefinition>;
</script>

<VerifierForm {games} />
