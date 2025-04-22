<script lang="ts">
  const { formValues }: { formValues: Record<string, any> } = $props();
</script>

<p id="dummy-explanation">
  Explanation for clientSeed={formValues.clientseed} serverSeed={formValues.serverseed} nonce={formValues.nonce}
  {formValues.optional ? `optional=${formValues.optional}` : ''}
</p>
