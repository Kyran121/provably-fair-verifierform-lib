<script lang="ts">
  import { VerifierForm } from '$lib';
  import { gameDefinition as crashGameDefinition } from '../stake/games/crash';
  import { gameDefinition as diceGameDefinition } from '../stake/games/dice';
  import { gameDefinition as plinkoGameDefinition } from '../stake/games/plinko';
  import { gameDefinition as slideGameDefinition } from '../stake/games/slide';
  import { gameDefinition as wheelGameDefinition } from '../stake/games/wheel';

  const games = {
    dice: diceGameDefinition,
    plinko: plinkoGameDefinition,
    slide: slideGameDefinition,
    crash: crashGameDefinition,
    wheel: wheelGameDefinition,
  };
</script>

<VerifierForm {games} />
