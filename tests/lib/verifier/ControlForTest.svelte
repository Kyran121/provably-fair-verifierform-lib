<script lang="ts">
  import type { Control } from '$lib/verifier/types';
  import InputControl from '$lib/verifier/Control.svelte';

  let { control, value }: { control: Control; value?: string } = $props();

  let boundValue = $state<string>(value || '');
</script>

<InputControl {control} bind:value={boundValue} />
