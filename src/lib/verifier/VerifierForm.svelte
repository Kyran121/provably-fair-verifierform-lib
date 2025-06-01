<script lang="ts">
  import type { GameDefinition } from '$lib/verifier/types';

  import { page } from '$app/state';
  import { goto, afterNavigate } from '$app/navigation';
  import type { Control as TControl } from '$lib/verifier/types';
  import Control from './Control.svelte';
  import { untrack } from 'svelte';
  import { browser } from '$app/environment';

  let { games }: { games: Record<string, GameDefinition> } = $props();

  type GameId = keyof typeof games;
  const gameIds = Object.keys(games) as GameId[];

  // === Reactive State Setup ===

  let formValues = $state<Record<string, string | number | null>>(
    Object.fromEntries(browser ? page.url.searchParams.entries() : [])
  );

  let game = $derived(formValues.game as string);
  let controls = $derived(games[game]?.controls);
  let schema = $derived(games[game]?.schema);
  let Result = $derived(games[game]?.ResultComponent);
  let Explanation = $derived(games[game]?.ExplanationComponent);

  let firstNavigation = $state(true);
  let showExplanation = $state(false);

  // === Inspections ===

  // $inspect(formValues);

  // === Control Mapping ===

  let controlsMap = $derived(
    controls?.reduce(
      (acc, control) => {
        acc[control.id] = control;
        return acc;
      },
      {} as Record<string, TControl>
    )
  );

  // === Validation Logic ===

  // Validate the current form values with the selected game's schema
  let validationResult = $derived.by(() => {
    const cleaned = Object.fromEntries(
      Object.entries(formValues)
        .filter(([, v]) => v !== null && v !== '')
        .map(([k, v]) => (controlsMap[k]?.type === 'number' ? [k, parseInt(v as string)] : [k, v]))
    );
    return schema?.safeParse(cleaned);
  });

  // Extract field errors safely
  let validationErrors = $derived.by(() => {
    if (!validationResult || validationResult.success) return {};
    return validationResult.error.flatten().fieldErrors;
  });

  // Whether the form is valid
  let formValid = $derived(validationResult?.success === true);

  // === URL Sync ===

  let changeTimeout: number | undefined = undefined;

  // 2. Reactive: update URL when state changes
  $effect(() => {
    // clear previous delay
    if (changeTimeout !== undefined) {
      clearTimeout(changeTimeout);
    }
    // check for control change
    if (browser && game && game in games && game === page.url.searchParams.get('game')) {
      // filter to url synced control values
      const urlSyncedValues = Object.entries(formValues).filter(
        ([k, v]) =>
          (controlsMap[k] && 'syncToUrl' in controlsMap[k] ? controlsMap[k].syncToUrl : true) &&
          v !== null
      ) as string[][];

      const qs = new URLSearchParams(urlSyncedValues).toString();
      if (qs !== page.url.searchParams.toString()) {
        showExplanation = false;

        // delay navigation in case user is still typing
        changeTimeout = setTimeout(() => shallowNavigate(`?${qs}`), 350);
      }
    }
  });

  // 3. Lifecycle: sync state when URL (navigation) changes
  afterNavigate(() => {
    const game = page.url.searchParams.get('game');
    const newFormValues: Record<string, string | number | null> = formValues;
    if (game && game in games) {
      // check for control changes
      if (browser) {
        for (const [key, val] of page.url.searchParams.entries()) {
          if (key === 'game') continue;
          if (controlsMap[key]?.type === 'select') {
            // set to first option if invalid option
            if (!controlsMap[key].options!.includes(val)) {
              newFormValues[key] = controlsMap[key].options![0];
            }
          } else if (formValues[key] !== val) {
            newFormValues[key] = controlsMap[key]?.type === 'number' ? parseInt(val) : val;
          }
        }
      }
      // remove empty/null values
      for (const key of Object.keys(newFormValues)) {
        if (
          !page.url.searchParams.has(key) ||
          newFormValues[key] === null ||
          newFormValues[key] === ''
        ) {
          delete newFormValues[key];
        }
      }
    }
    // mount hook
    if (firstNavigation) {
      untrack(() => (firstNavigation = false));

      //if game is invalid, set to first game
      if (!(game && game in games)) {
        changeGame(gameIds[0]);
        return;
      }

      //set default inputs for game if not set
      for (const key in controlsMap) {
        if (!(key in newFormValues)) {
          if (controlsMap[key].type === 'select') {
            // set to first option if value is not provided
            newFormValues[key] = controlsMap[key].options![0];
          } else if ('default' in controlsMap[key] && controlsMap[key].default !== undefined) {
            // set to default value if value is not provided
            newFormValues[key] = controlsMap[key].default;
          }
        }
      }
    }

    formValues = newFormValues;
  });

  function handleGameChange(event: Event) {
    const selectedGame = (event.target as HTMLSelectElement).value;
    changeGame(selectedGame);
  }

  function changeGame(game: string) {
    const newFormValues: Record<string, string | number | null> = {};
    newFormValues.game = game;
    for (const control of games[game].controls) {
      if (control.type === 'select') {
        newFormValues[control.id] = control.options![0];
      } else if ('default' in control && control.default !== undefined) {
        newFormValues[control.id] = control.default;
      }
    }
    formValues = newFormValues;
    showExplanation = false;

    const qs = new URLSearchParams(Object.entries(newFormValues) as string[][]).toString();
    shallowNavigate(`?${qs}`);
  }

  function shallowNavigate(path: string) {
    goto(path, {
      replaceState: true,
      keepFocus: true,
      noScroll: true
    });
  }
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
      class="block w-full border-0 border-b-1 bg-transparent p-2 focus:border-purple-400 focus:ring-0 focus:outline-none dark:text-white"
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
      <Control
        {control}
        bind:value={formValues[control.id] as string}
        error={validationErrors[control.id]?.[0]}
      />
    {/each}
  </div>

  <!-- Result and Explanation Panels -->
  {#if formValid && Result}
    <div class="mb-4 rounded dark:text-white">
      <Result {formValues} />
    </div>
    <!-- Explanation Toggle -->
    {#if Explanation}
      <button
        class={[
          'm-auto block px-5 py-2.5 text-sm font-medium text-white focus:ring-0 focus:outline-none',
          'bg-purple-400 hover:bg-purple-500'
        ]}
        onclick={() => (showExplanation = !showExplanation)}
      >
        {showExplanation ? 'Hide Explanation' : 'Show Explanation'}
      </button>
      <div class={['dark:text-white', showExplanation ? '' : 'hidden']}>
        <Explanation {formValues} />
      </div>
    {/if}
  {/if}
</div>
