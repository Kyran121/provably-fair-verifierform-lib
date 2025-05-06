<script lang="ts">
  import type { Control } from '$lib/verifier/types';
  import VerifierForm from '$lib/verifier/VerifierForm.svelte';
  import DiceResult from '../stake/DiceResult.svelte';
  import DiceExplanation from '../stake/DiceExplanation.svelte';
  import LimboResult from '../stake/LimboResult.svelte';
  import CrashResult from '../stake/CrashResult.svelte';

  const controls: Control[] = [
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
      attrs: {
        min: 0
      }
    }
  ];
</script>

<VerifierForm
  games={{
    dice: {
      name: 'Dice',
      controls,
      ResultComponent: DiceResult,
      ExplanationComponent: DiceExplanation
    },
    limbo: {
      name: 'Limbo',
      controls,
      ResultComponent: LimboResult
    },
    crash: {
      name: 'Crash',
      controls: [
        controls[0],
        {
          id: 'serverseed',
          name: 'serverseed',
          label: 'Server Seed',
          type: 'text',
          disabled: true,
          syncToUrl: false,
          attrs: {
            value: '0000000000000000001b34dc6a1e86083f95500b096231436e9b25cbdd0075c4'
          }
        }
      ],
      ResultComponent: CrashResult
    }
  }}
/>
