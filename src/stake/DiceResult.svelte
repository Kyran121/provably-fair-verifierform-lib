<script lang="ts">
  import FloatGenerator from './generator/FloatGenerator';

  const { formValues }: { formValues: Record<string, unknown> } = $props();

  let rollNumber = $state<number>(0);

  $effect(() => {
    const floatGenerator = FloatGenerator({
      clientSeed: formValues.clientseed as string,
      serverSeed: formValues.serverseed as string,
      nonce: formValues.nonce as number
    });
    rollNumber = Math.floor(floatGenerator.next().value * 10001) / 100;
  });
</script>

<p data-testid="dice-result" class="text-center text-base">
  you rolled a <span class="text-xl text-blue-500">{rollNumber.toFixed(2)}</span>
</p>
