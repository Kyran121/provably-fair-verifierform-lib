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
          type: 'select',
          options: [
            '0000000000000000000b20f796f5421cac95c4efb06c6bbf6408d6f9b5d7b9dc',
            '00000000000000000000644330e1340fc6e894a95c37060bdd180ed11d068944'
          ]
        }
      ],
      ResultComponent: CrashResult
    }
  }}
/>
