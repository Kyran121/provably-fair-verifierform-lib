<script lang="ts">
  import FloatGenerator from './generator/FloatGenerator';
  import { debouncer } from './debounce.svelte';
  import type { StakeSeed } from './types';

  const { formValues }: { formValues: Record<string, unknown> } = $props();

  const seed = $derived<StakeSeed>({
    clientSeed: formValues.clientseed as string,
    serverSeed: formValues.serverseed as string,
    nonce: formValues.nonce as number
  });

  const rollNumberDebounced = $derived.by(
    debouncer(
      () => seed,
      (seed) => {
        const floatGenerator = FloatGenerator(seed);
        return Math.floor(floatGenerator.next().value * 10001) / 100;
      },
      350
    )
  );
</script>

{#if rollNumberDebounced.debouncing}
  <p class="text-center text-base">
    <span class="text-sm text-gray-500 italic dark:text-gray-400">Computing...</span>
  </p>
{:else}
  <p data-testid="dice-result" class="text-center text-base">
    you rolled a <span class="text-xl text-blue-500">{rollNumberDebounced.value!.toFixed(2)}</span>
  </p>
{/if}
