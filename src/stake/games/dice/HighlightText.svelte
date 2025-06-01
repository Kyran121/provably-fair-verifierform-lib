<script lang="ts">
  import type { Snippet } from 'svelte';
  import { TEXT_HIGHLIGHT_COLOR } from '../../constants';

  const { className, children }: { className?: string; children: Snippet } = $props();
</script>

<span class="font-bold {TEXT_HIGHLIGHT_COLOR} {className}">{@render children()}</span>
