<script lang="ts">
  import FloatGenerator from './generator/FloatGenerator';

  const { formValues }: { formValues: Record<string, any> } = $props();

  let crashPoint = $state<number>(0);

  $effect(() => {
    const floatGenerator = FloatGenerator({
      clientSeed: formValues.clientseed,
      serverSeed: formValues.serverseed,
      nonce: formValues.nonce
    });
    crashPoint =
      Math.floor(
        (16777216 / (Math.floor(floatGenerator.next().value * 16777216) + 1)) * (1 - 0.01) * 100
      ) / 100;
  });
</script>

<p id="limbo-result" class="text-center text-base">
  you crashed at <span class="text-xl text-blue-500">{crashPoint.toFixed(2)}x</span>
</p>
