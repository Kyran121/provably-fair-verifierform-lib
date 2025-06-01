<script lang="ts">
  import type { Snippet } from 'svelte';
  import { STEP_CONTAINER_BG_COLOR, STEP_CONTAINER_TEXT_COLOR } from '../../constants';

  const { className, children }: { className?: string; children: Snippet } = $props();
</script>

<div class="{className} {STEP_CONTAINER_BG_COLOR} {STEP_CONTAINER_TEXT_COLOR}">
  {@render children()}
</div>
