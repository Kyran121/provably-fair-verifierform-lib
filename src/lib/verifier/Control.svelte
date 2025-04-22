<script lang="ts">
  import type { Control } from '$lib/verifier/types';

  let { control, value = $bindable() }: { control: Control; value: string } = $props();

  let violation = $derived((value === undefined || value === '') && control.required);
</script>

<div class="group relative z-0 mb-5 w-full">
  {#if control.type === 'select' && control.options}
    <select
      id={control.id}
      name={control.name}
      bind:value
      {...control.required && { required: true }}
      class={[
        'text-md block w-full appearance-none border-0 border-b-2 bg-transparent px-0 py-2.5 text-gray-900',
        'dark:border-gray-60 border-gray-300 focus:border-blue-600 dark:text-white dark:focus:border-blue-500',
        'peer focus:ring-0 focus:outline-none'
      ]}
      placeholder=""
      aria-invalid={violation}
      {...violation && { 'aria-errormessage': `${control.id}-error-message` }}
    >
      {#each control.options as opt}
        <option value={opt.value}>{opt.label}</option>
      {/each}
    </select>
  {:else}
    <input
      id={control.id}
      name={control.name}
      type={control.type}
      bind:value
      {...control.required && { required: true }}
      class={[
        'text-md block w-full appearance-none border-0 border-b-1 bg-transparent px-0 py-2.5 text-gray-900',
        'dark:border-gray-60 dark:text-white',
        violation && 'border-red-600 dark:border-red-500',
        !violation && 'border-gray-300 focus:border-blue-600 dark:focus:border-blue-500',
        'focus:ring-0 focus:outline-none',
        'peer'
      ]}
      placeholder=""
      autocomplete="off"
      aria-invalid={violation}
      {...violation && { 'aria-errormessage': `${control.id}-error-message` }}
      {...control.attrs}
    />
  {/if}
  <label
    for={control.id}
    class={[
      'absolute -translate-y-6 scale-90 transform text-sm text-gray-500 duration-300 peer-focus:font-medium dark:text-gray-400',
      'top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4',
      violation && 'peer-focus:text-red-600 peer-focus:dark:text-red-500',
      !violation && 'peer-focus:text-blue-600 peer-focus:dark:text-blue-500',
      'peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-6 peer-focus:scale-100'
    ]}
  >
    {control.label}{control.required ? '*' : ''}
  </label>
  {#if violation}
    <p id={`${control.id}-error-message`} class="mt-2 text-xs text-red-600 dark:text-red-500">
      Required
    </p>
  {/if}
</div>
