<script lang="ts">
  import type { Control } from '$lib/verifier/types';

  let {
    control,
    value = $bindable(),
    error,
  }: { control: Control; value: string; error?: string } = $props();
</script>

<div class={['group relative z-0 w-full', control.disabled ? 'mt-7' : 'mt-5']}>
  {#if control.type === 'select' && control.options}
    <select
      id={control.id}
      name={control.name}
      bind:value
      {...control.required && { required: true }}
      {...control.disabled && { disabled: true }}
      class={[
        'text-md block w-full appearance-none border-0 border-b-2 bg-transparent px-0 py-2.5 text-gray-900',
        'border-gray-300 focus:border-purple-500 dark:border-gray-400 dark:text-white focus:dark:border-purple-400',
        'peer focus:ring-0 focus:outline-none',
      ]}
      placeholder=""
      {...error && { 'aria-invalid': true, 'aria-errormessage': `${control.id}-error-message` }}
    >
      {#each control.options as opt (opt)}
        <option value={opt}>{opt}</option>
      {/each}
    </select>
  {:else if 'syncToUrl' in control ? control.syncToUrl : true}
    <input
      id={control.id}
      name={control.name}
      type={control.type}
      bind:value
      {...control.required && { required: true }}
      {...control.disabled && { disabled: true }}
      class={[
        'text-md block w-full appearance-none border-0 border-b-1 bg-transparent px-0 py-2.5 text-gray-900',
        'disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 disabled:shadow-none',
        'dark:text-white dark:disabled:border-gray-700 dark:disabled:bg-gray-800/20',
        error && 'border-red-600 dark:border-red-500',
        !error &&
          'border-gray-300 focus:border-purple-500 dark:border-gray-400 focus:dark:border-purple-400',
        'focus:ring-0 focus:outline-none',
        'peer',
      ]}
      placeholder=""
      autocomplete="off"
      {...error && { 'aria-invalid': true, 'aria-errormessage': `${control.id}-error-message` }}
      {...control.attrs}
    />
  {:else}
    <input
      id={control.id}
      name={control.name}
      type={control.type}
      disabled
      class={!control.disabled
        ? [
            'text-md block w-full appearance-none border-0 border-b-1 bg-transparent px-0 py-2.5 text-gray-900',
            'dark:text-white',
            error && 'border-red-600 dark:border-red-500',
            !error &&
              'border-gray-300 focus:border-purple-500 dark:border-gray-400 focus:dark:border-purple-400',
            'focus:ring-0 focus:outline-none',
            'peer',
          ]
        : [
            'text-md dark:border-gray-60 peer block w-full appearance-none border-0 border-b-1 border-gray-300',
            'bg-transparent px-0 py-2.5 text-gray-900 disabled:border-gray-200 disabled:bg-gray-50 dark:text-white',
            'disabled:text-gray-500 disabled:shadow-none dark:disabled:border-gray-700 disabled:dark:text-gray-400',
            'dark:disabled:bg-gray-800/20',
          ]}
      placeholder=""
      autocomplete="off"
      {...error && { 'aria-invalid': true, 'aria-errormessage': `${control.id}-error-message` }}
      {...control.attrs}
    />
  {/if}
  {#if control.disabled}
    <label
      for={control.id}
      class="-z1 absolute top-3 left-0 origin-[0] -translate-y-6 scale-90 transform text-sm text-gray-500 dark:text-gray-400"
    >
      {control.label} (disabled)
    </label>
  {:else}
    <label
      for={control.id}
      class={[
        'absolute -translate-y-6 scale-90 transform text-sm text-gray-500 duration-300 peer-focus:font-medium dark:text-gray-400',
        'top-3 left-0 -z-10 origin-[0] peer-focus:start-0',
        error && 'peer-focus:text-red-600 peer-focus:dark:text-red-500',
        !error && 'peer-focus:text-purple-500 peer-focus:dark:text-purple-400',
        'peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-6 peer-focus:scale-100',
      ]}
    >
      {control.label}{control.required ? '*' : ''}
    </label>
    {#if error}
      <p id={`${control.id}-error-message`} class="mt-2 text-xs text-red-600 dark:text-red-500">
        {error}
      </p>
    {/if}
  {/if}
</div>
