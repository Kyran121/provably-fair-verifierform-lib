<script lang="ts">
  import type { StakeSeed } from '../../types';
  import FloatGenerator from '../../generator/FloatGenerator';
  import FloatGenerationStep from './FloatGenerationStep.svelte';
  import DiceResultStep from './DiceResultStep.svelte';
  import { debouncer } from '../../debounce.svelte';

  const { formValues }: { formValues: Record<string, unknown> } = $props();

  let seed = $derived<StakeSeed>({
    clientSeed: formValues.clientseed as string,
    serverSeed: formValues.serverseed as string,
    nonce: formValues.nonce as number,
  });

  const floatDebounced = $derived.by(
    debouncer(
      () => seed,
      (seed) => {
        const floatGenerator = FloatGenerator(seed);
        return floatGenerator.next().value;
      },
      350
    )
  );
</script>

<div class="mt-5 border-0 text-center dark:text-white">
  <div id="step-content" class="pb-4 text-left text-sm dark:bg-gray-900 dark:text-white">
    {#if floatDebounced.debouncing}
      <p class="text-center text-base">
        <span class="text-sm text-gray-500 italic dark:text-gray-400">Computing...</span>
      </p>
    {:else}
      <FloatGenerationStep stepNumber={1} resultIndex={0} {seed} float={floatDebounced.value!} />
      <DiceResultStep stepNumber={2} float={floatDebounced.value!} />
    {/if}
  </div>
</div>
