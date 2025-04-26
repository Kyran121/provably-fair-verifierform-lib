<script lang="ts">
  import type { GameDefinition } from '$lib/verifier/types';

  import { page } from '$app/state';
  import { goto, afterNavigate } from '$app/navigation';
  import type { Control as TControl } from '$lib/verifier/types';
  import Control from './Control.svelte';

  let { games }: { games: Record<string, GameDefinition> } = $props();
  let showExplanation = $state(false);

  let changeTimeout: number | undefined = undefined;

  // 1. Initialize state from URL query params
  let formValues = $state<Record<string, string | number | null>>(
    Object.fromEntries(page.url.searchParams.entries())
  );

  let game = $derived(formValues.game as string);
  let controls = $derived(games[game]?.controls);
  let Result = $derived(games[game]?.ResultComponent);
  let Explanation = $derived(games[game]?.ExplanationComponent);

  let controlsMap = $derived(
    controls?.reduce(
      (acc, control) => {
        acc[control.id] = control;
        return acc;
      },
      {} as Record<string, TControl>
    )
  );

  // 2. Reactive: update URL when state changes
  $effect(() => {
    // clear any debounce
    if (changeTimeout !== undefined) {
      clearTimeout(changeTimeout);
      changeTimeout = undefined;
    }

    // check for control change
    if (game && game in games && game === page.url.searchParams.get('game')) {
      const qs = new URLSearchParams(
        Object.entries(formValues).filter(([, v]) => v !== null) as string[][]
      ).toString();

      if (qs !== page.url.searchParams.toString()) {
        showExplanation = false;

        // debounce
        changeTimeout = setTimeout(() => {
          shallowNavigate(`?${qs}`);
          changeTimeout = undefined;
        }, 350);
      }
    }
  });

  // 3. Lifecycle: sync state when URL (navigation) changes
  afterNavigate(() => {
    // set to first game in dropdown if game is invalid
    if (!page.url.searchParams.has('game') || !(page.url.searchParams.get('game')! in games)) {
      const firstGame = Object.keys(games)[0];
      shallowNavigate(`?game=${firstGame}`);
      return;
    }
    // check for game change
    if (game !== page.url.searchParams.get('game')) {
      formValues = { game: page.url.searchParams.get('game') };
      showExplanation = false;
      return;
    }
    // check for control changes
    for (const [key, val] of page.url.searchParams.entries()) {
      if (formValues[key] !== val) {
        if (controlsMap[key].type === 'number') {
          formValues[key] = val === 'null' ? null : parseInt(val);
        } else {
          formValues[key] = val === '' ? null : val;
        }
      }
    }
    // Remove keys no longer in URL or which are null/empty
    for (const key of Object.keys(formValues)) {
      if (!page.url.searchParams.has(key) || formValues[key] === null) {
        delete formValues[key];
      }
    }
  });

  function handleGameChange(event: Event) {
    const selectedGame = (event.target as HTMLSelectElement).value;
    shallowNavigate(`?game=${selectedGame}`);
  }

  function shallowNavigate(path: string) {
    goto(path, {
      replaceState: true,
      keepFocus: true,
      noScroll: true
    });
  }

  const allRequiredFilled = $derived(
    controls?.every((c) => {
      if (!c.required) return true;
      const val = formValues[c.id];
      return val !== undefined && val !== '' && !(typeof val === 'number' && isNaN(val));
    })
  );
</script>

<div class="mx-auto max-w-xl rounded-b-lg p-4">
  <!-- Game selection dropdown -->
  <div class="mb-7">
    <label for="game" class="mb-1 block font-semibold text-black dark:text-white"
      >Select Game:</label
    >
    <select
      id="game"
      onchange={handleGameChange}
      class="block w-full border-0 border-b-2 bg-transparent p-2 focus:ring-0 focus:outline-none dark:text-white"
    >
      {#each Object.entries(games) as [gameId, gameDef] (gameId)}
        <option value={gameId} {...game === gameId ? { selected: true } : {}}>{gameDef.name}</option
        >
      {/each}
    </select>
  </div>

  <!-- Dynamic Form Controls -->
  <div class="mb-6 space-y-3">
    {#each controls as control (control.id)}
      <Control {control} bind:value={formValues[control.id] as string} />
    {/each}
  </div>

  <!-- Result and Explanation Panels -->
  {#if allRequiredFilled && Result}
    <div class="mb-4 rounded dark:text-white">
      <Result {formValues} />
    </div>
    <!-- Explanation Toggle -->
    {#if Explanation}
      <button
        class="m-auto block bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:ring-0 focus:ring-blue-300 focus:outline-none dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        onclick={() => (showExplanation = !showExplanation)}
      >
        {showExplanation ? 'Hide Explanation' : 'Show Explanation'}
      </button>
      {#if showExplanation}
        <div class="mt-4 dark:text-white">
          <Explanation {formValues} />
        </div>
      {/if}
    {/if}
  {/if}
</div>
