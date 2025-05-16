<script lang="ts">
  import type { FloatExplanationStepProps } from './types';
  import { hmac as createHmac } from '@stablelib/hmac';
  import { SHA256 } from '@stablelib/sha256';
  import { encode as toUInt8Array } from '@stablelib/utf8';
  import { encode as toHex } from '@stablelib/hex';
  import { fade } from 'svelte/transition';

  const HEX_CHARS_IN_HMAC = 64;
  const HEX_CHARS_FOR_FLOAT = 8;

  const { stepNumber, resultIndex, seed, float }: FloatExplanationStepProps = $props();

  const round = $derived(Math.floor(resultIndex / HEX_CHARS_FOR_FLOAT));
  const cursor = $derived((resultIndex * HEX_CHARS_FOR_FLOAT) % HEX_CHARS_IN_HMAC);
  const hmac = $derived(
    toHex(
      createHmac(
        SHA256,
        toUInt8Array(seed.serverSeed),
        toUInt8Array(`${seed.clientSeed}:${seed.nonce}:${round}`)
      )
    )
  );
  const hexes = $derived(hmac.substring(cursor, cursor + HEX_CHARS_FOR_FLOAT).match(/.{1,2}/g));
  const bytes = $derived(hexes?.map((hex) => parseInt(hex, 16)));
</script>

{#key cursor}
  <div transition:fade={{ duration: 500 }}>
    <div class="text-center">
      <p class="mb-2 text-xl">Step {stepNumber}</p>
      <p class="text-base">Extract float based on client seed, server seed, and nonce</p>
      <p class="mb-7 text-sm text-gray-500 dark:text-gray-400">
        Refer to scripts on the <a
          class="text-blue-500 hover:underline"
          target="_blank"
          href="https://stake.com/provably-fair/implementation">implementation</a
        >
        and
        <a
          class="text-blue-500 hover:underline"
          target="_blank"
          href="https://stake.com/provably-fair/conversions">conversion</a
        > pages
      </p>
    </div>

    <div
      class="bg-gray-200 p-5 font-mono text-xs text-gray-500 dark:bg-gray-800 dark:text-gray-400"
    >
      <p>resultIndex = {resultIndex}</p>
      <p>hexCharsInHmac = {HEX_CHARS_IN_HMAC}</p>
      <p>hexCharsForFloat = {HEX_CHARS_FOR_FLOAT}</p>
      <p class="mt-4">round</p>
      <p>
        = <span class="font-bold text-blue-500">&lbrace;resultIndex&rbrace;</span> /
        <span class="font-bold text-blue-500">&lbrace;hexCharsForFloat&rbrace;</span>
      </p>
      <p>
        = <span class="font-bold text-blue-500">{resultIndex}</span> /
        <span class="font-bold text-blue-500">{HEX_CHARS_FOR_FLOAT}</span>
      </p>
      <p>= {round}</p>

      <p class="mt-4">cursor</p>
      <p>
        = (<span class="font-bold text-blue-500">&lbrace;resultIndex&rbrace;</span> *
        <span class="font-bold text-blue-500">&lbrace;hexCharsForFloat&rbrace;</span>) %
        <span class="font-bold text-blue-500">&lbrace;hexCharsInHmac&rbrace;</span>
      </p>
      <p>
        = (<span class="font-bold text-blue-500">{resultIndex}</span> *
        <span class="font-bold text-blue-500">{HEX_CHARS_FOR_FLOAT}</span>) %
        <span class="font-bold text-blue-500">{HEX_CHARS_IN_HMAC}</span>
      </p>
      <p>= {cursor}</p>

      <p class="mt-4">hmac</p>
      <p>= hmac_sha256(</p>
      <p class="indent-8">
        key &nbsp;= <span class="font-bold text-blue-500">&lbrace;serverseed&rbrace;</span>
      </p>
      <p class="indent-8">
        data = <span class="font-bold text-blue-500"
          >&lbrace;clientseed&rbrace;:&lbrace;nonce&rbrace;:&lbrace;round&rbrace;</span
        >
      </p>
      <p class="indent-4">)</p>
      <p>= hmac_sha256(</p>
      <p class="truncate indent-8">
        key &nbsp;= <span class="font-bold text-blue-500">{seed.serverSeed}</span>
      </p>
      <p class="truncate indent-8">
        data = <span class="font-bold text-blue-500">{seed.clientSeed}:{seed.nonce}:{round}</span>
      </p>
      <p class="indent-4">)</p>
      <p class="break-all">= <span class="text-xs">{hmac}</span></p>

      <p class="mt-4">hexes</p>
      <p>= substring(</p>
      <p class="indent-8">
        value = <span class="font-bold text-blue-500">&lbrace;hmac&rbrace;</span>
      </p>
      <p class="indent-8">
        start = <span class="font-bold text-blue-500">&lbrace;cursor&rbrace;</span>
      </p>
      <p class="indent-8">
        take &nbsp;= <span class="font-bold text-blue-500">&lbrace;hexCharsForFloat&rbrace;</span>
      </p>
      <p class="indent-4">)</p>
      <p>= substring(</p>
      <p class="truncate indent-8">value = <span class="font-bold text-blue-500">{hmac}</span></p>
      <p class="indent-8">start = <span class="font-bold text-blue-500">{cursor}</span></p>
      <p class="indent-8">
        take &nbsp;= <span class="font-bold text-blue-500">{HEX_CHARS_FOR_FLOAT}</span>
      </p>
      <p class="indent-4">)</p>
      <p class="break-all">
        = {hmac.substring(0, cursor)}<span class="text-base font-bold text-blue-500"
          >{hmac.substring(cursor, cursor + HEX_CHARS_FOR_FLOAT)}</span
        ><span class="text-xs text-gray-400">{hmac.substring(cursor + HEX_CHARS_FOR_FLOAT)}</span>
      </p>
    </div>
    <div class="relative mt-4 overflow-x-auto">
      <table
        class="w-full bg-gray-200 text-left text-sm text-gray-500 rtl:text-right dark:bg-gray-800 dark:text-gray-400"
      >
        <tbody>
          <tr class="border-b border-gray-300 dark:border-gray-700">
            <th
              scope="row"
              class="px-6 py-4 font-medium whitespace-nowrap text-gray-900 dark:text-white">hex</th
            >
            {#each hexes! as hex}
              <td class="px-6 py-4 font-mono">{hex}</td>
            {/each}
          </tr>
          <tr class="border-none border-gray-200 dark:border-gray-700">
            <th
              scope="row"
              class="px-6 py-4 font-medium whitespace-nowrap text-gray-900 dark:text-white">byte</th
            >
            {#each bytes! as byte}
              <td class="px-6 py-4 font-mono">{byte}</td>
            {/each}
          </tr>
        </tbody>
      </table>
    </div>
    <div class="relative mt-4 overflow-x-auto font-mono">
      <table
        class="w-full bg-gray-200 text-left text-sm text-gray-500 rtl:text-right dark:bg-gray-800 dark:text-gray-400"
      >
        <tbody>
          {#each bytes! as byte, i}
            <tr class="border-b border-gray-300 dark:border-gray-700">
              <td class="px-4"></td>
              <td class="px-2 py-4">{(byte / 256 ** (i + 1)).toFixed(12)}</td>
              <td class="px-6 py-4">({('' + byte).padStart(3, '0')} / (256 ^ {i + 1}))</td>
            </tr>
          {/each}
          <tr class="border-none border-gray-200 dark:border-gray-700">
            <td class="px-4">=</td>
            <td class="px-2 py-4">{float.toFixed(12)}</td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
{/key}
