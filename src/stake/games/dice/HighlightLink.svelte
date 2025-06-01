<script lang="ts">
  import type { Snippet } from 'svelte';
  import { TEXT_HIGHLIGHT_COLOR } from '../../constants';

  const { className, href, children }: { className?: string; href: string; children: Snippet } =
    $props();
</script>

<a class="{TEXT_HIGHLIGHT_COLOR} hover:underline {className}" target="_blank" {href}
  >{@render children()}</a
>
