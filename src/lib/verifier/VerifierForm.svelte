<script lang="ts">
  import type { GameDefinition } from '$lib/verifier/types';

  import { page } from '$app/state';
  import { goto, afterNavigate } from '$app/navigation';
  import type { Control as TControl } from '$lib/verifier/types';
  import Control from './Control.svelte';
  import { untrack } from 'svelte';
  import { browser } from '$app/environment';
  import { effectWithPrevious } from '$lib/util/effect-with-previous.svelte';

  let { games }: { games: Record<string, GameDefinition> } = $props();

  type GameId = keyof typeof games;
  const gameIds = Object.keys(games) as GameId[];

  // === Reactive State Setup ===

  let formValues = $state<Record<string, unknown>>(
    Object.fromEntries(browser ? page.url.searchParams.entries() : [])
  );

  let game = $derived(formValues.game as string);
  let allControls = $derived(getControls(game));
  let controls = $derived(getVisibleControls(game, formValues));
  let schema = $derived(games[game]?.schema);
  let Result = $derived(games[game]?.ResultComponent);
  let Explanation = $derived(games[game]?.ExplanationComponent);

  let firstNavigation = $state(true);
  let showExplanation = $state(false);

  let hiddenControlMap = $derived(getVisibilityMap(allControls, formValues));
  let hiddenControlState = $derived({ game, hiddenControlMap });

  // === Inspections ===

  // $inspect(formValues);

  effectWithPrevious(
    () => hiddenControlState,
    (prev, curr) => {
      // no previous state or game changes we ignore
      if (prev === undefined || prev.game !== curr.game) return;
      // If the visibility map changes, we need to update the controls
      // if any control is visible now that was hidden before, we need to ensure
      // its value is set to a default if it has one, or cleared if it doesn't
      for (const key in curr.hiddenControlMap) {
        if (curr.hiddenControlMap[key] && !prev.hiddenControlMap[key]) {
          // Control is now visible, set default or clear value
          const control = controlsMap[key];
          if (control) {
            formValues[key] = control.default !== undefined ? control.default : null;
          }
        } else if (!curr.hiddenControlMap[key] && prev.hiddenControlMap[key]) {
          // Control is now hidden, clear its value
          delete formValues[key];
        }
      }
    }
  );

  // === Control Mapping ===

  let controlsMap = $derived(getControlsMap(allControls));

  // === Validation Logic ===

  // Validate the current form values with the selected game's schema
  let validationResult = $derived.by(() => {
    const cleaned = Object.fromEntries(
      Object.entries(formValues)
        .filter(([k, v]) => v !== null && v !== '' && showControl(controlsMap[k], formValues))
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
    //check for control change
    if (browser && game && game in games && game === page.url.searchParams.get('game')) {
      //filter to url synced control values
      const urlSyncedValues = Object.entries(formValues).filter(
        ([k, v]) =>
          (controlsMap[k] && 'syncToUrl' in controlsMap[k] ? controlsMap[k].syncToUrl : true) &&
          v !== null
      ) as string[][];

      //clear previous delay
      if (changeTimeout !== undefined) {
        clearTimeout(changeTimeout);
      }

      const searchParams = new URLSearchParams(urlSyncedValues);
      if (!areSearchParamsEqual(searchParams, page.url.searchParams)) {
        showExplanation = false;

        //delay navigation in case user is still typing
        changeTimeout = setTimeout(() => shallowNavigate(`?${searchParams.toString()}`), 350);
      }
    }
  });

  // 3. Lifecycle: sync state when URL (navigation) changes
  afterNavigate(() => {
    const game = page.url.searchParams.get('game');

    //if game control is not set or invalid, set to first game
    if (game === null || !(game in games)) {
      changeGame(gameIds[0]);
      return;
    }

    //note: afterNavigate() is not a subscriber to signals it refers to
    const searchParams = page.url.searchParams;
    const controlsMap = getControlsMap(getControls(game));

    const controlChanges: Record<string, unknown> = { game };

    //if first navigation, set default values for controls having no value
    if (firstNavigation) {
      untrack(() => (firstNavigation = false));

      for (const key in controlsMap) {
        if (!searchParams.has(key)) {
          if (controlsMap[key].type === 'select') {
            controlChanges[key] = controlsMap[key].options![0];
          } else if ('default' in controlsMap[key] && controlsMap[key].default !== undefined) {
            controlChanges[key] = controlsMap[key].default;
          }
        }
      }
    }

    //populate searchParams into control changes
    for (const [key, val] of searchParams) {
      //game is set already, skip
      if (key === 'game') continue;

      //if select option is not valid, set to first option
      if (controlsMap[key].type === 'select' && !controlsMap[key].options?.includes(val)) {
        controlChanges[key] = controlsMap[key].options![0];
      } else {
        controlChanges[key] = controlsMap[key].type === 'number' ? parseInt(val) : val;
      }
    }

    //remove null/empty controls, and hidden controls
    for (const key of Object.keys(controlChanges)) {
      if (controlChanges[key] === null || controlChanges[key] === '') {
        delete controlChanges[key];
      }
    }

    if (!shallowEqual(formValues, controlChanges)) {
      formValues = controlChanges;
    }
  });

  function handleGameChange(event: Event) {
    const selectedGame = (event.target as HTMLSelectElement).value;
    changeGame(selectedGame);
  }

  function changeGame(game: string) {
    const controlChanges: Record<string, string | number | null> = {};

    //set new game
    controlChanges.game = game;

    //set default values for controls
    for (const control of games[game].controls) {
      if (control.type === 'select') {
        controlChanges[control.id] = control.options![0];
      } else if ('default' in control && control.default !== undefined) {
        controlChanges[control.id] = control.default;
      }
    }

    formValues = controlChanges;
    showExplanation = false;

    const qs = new URLSearchParams(Object.entries(controlChanges) as string[][]).toString();
    shallowNavigate(`?${qs}`);
  }

  function getControls(game: string) {
    return games[game]?.controls;
  }

  function getVisibleControls(game: string, formValues: Record<string, unknown>) {
    return games[game]?.controls.filter((control) => showControl(control, formValues));
  }

  function getVisibilityMap(
    controls: TControl[],
    formValues: Record<string, unknown>
  ): Record<string, boolean> {
    return (controls || []).reduce(
      (acc, control) => {
        acc[control.id] = showControl(control, formValues);
        return acc;
      },
      {} as Record<string, boolean>
    );
  }

  function showControl(control: TControl, formValues: Record<string, unknown>) {
    return !control || !('hide' in control) || !control?.hide?.(formValues);
  }

  function getControlsMap<TControl extends { id: string }>(
    controls: TControl[] | undefined
  ): Record<string, TControl> {
    return (controls || []).reduce(
      (acc, control) => {
        acc[control.id] = control;
        return acc;
      },
      {} as Record<string, TControl>
    );
  }

  function shallowNavigate(path: string) {
    goto(path, {
      replaceState: true,
      keepFocus: true,
      noScroll: true
    });
  }

  function shallowEqual<T extends Record<string, unknown>>(obj1: T, obj2: T): boolean {
    if (obj1 === obj2) return true;

    const keys1 = Object.keys(obj1) as (keyof T)[];
    const keys2 = Object.keys(obj2) as (keyof T)[];

    if (keys1.length !== keys2.length) return false;

    for (const key of keys1) {
      if (obj1[key] !== obj2[key]) return false;
    }

    return true;
  }

  function areSearchParamsEqual(a: URLSearchParams, b: URLSearchParams): boolean {
    const aEntries = Array.from(a.entries());
    const bEntries = Array.from(b.entries());

    if (aEntries.length !== bEntries.length) {
      return false;
    }

    const aMap = new Map(aEntries);
    const bMap = new Map(bEntries);

    for (const [key, value] of aMap) {
      if (bMap.get(key) !== value) {
        return false;
      }
    }

    return true;
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
          'bg-purple-500 hover:bg-purple-600'
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
