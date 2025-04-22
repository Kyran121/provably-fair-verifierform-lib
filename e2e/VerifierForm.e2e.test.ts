import { expect, test } from '@playwright/test';

const CLIENT_SEED = 'ec75fca98de6f2d9';
const SERVER_SEED = '735249f062ac025044a8523aa92e034803f02d6b75129abc97e8b1be19aab9b4';

test.describe('VerifierForm E2E Tests', () => {
  test('computes result for game when all required fields are given', async ({ page }) => {
    page.goto('/');

    const results = ['93.08', '0.61', '71.73'];

    const game = page.getByLabel('Select Game:');
    await expect(game).toHaveValue('dice');

    const clientSeed = page.getByLabel('Client Seed*');
    await clientSeed.fill(CLIENT_SEED);

    const serverSeed = page.getByLabel('Server Seed*');
    await serverSeed.fill(SERVER_SEED);

    const nonce = page.getByLabel('Nonce*');

    for (let i = 20; i < 23; i++) {
      await nonce.clear();
      await nonce.fill(i.toString());

      const result = page.getByTestId('dice-result');
      await expect(result).toBeVisible();
      await expect(result).toContainText(results[i - 20]);

      const btn = page.getByText('Show Explanation');
      await expect(btn).toBeVisible();
      await btn.click();

      const explanation = page.getByTestId('dice-explanation');
      await expect(explanation).toBeVisible();

      await expect(page).toHaveURL((url) => {
        return (
          url.searchParams.get('game') === 'dice' &&
          url.searchParams.get('clientseed') === CLIENT_SEED &&
          url.searchParams.get('serverseed') === SERVER_SEED &&
          url.searchParams.get('nonce') === i.toString()
        );
      });
    }
  });

  test('required fields reset when game is changed', async ({ page }) => {
    page.goto('/');

    const game = page.getByLabel('Select Game:');
    await expect(game).toHaveValue('dice');

    const clientSeed = page.getByLabel('Client Seed*');
    await clientSeed.fill(CLIENT_SEED);

    const serverSeed = page.getByLabel('Server Seed*');
    await serverSeed.fill(SERVER_SEED);

    const nonce = page.getByLabel('Nonce*');
    await nonce.fill('20');

    await game.selectOption('limbo');

    await expect(clientSeed).toHaveValue('');
    await expect(serverSeed).toHaveValue('');
    await expect(nonce).toHaveValue('');

    await expect(page).toHaveURL((url) => {
      return (
        url.searchParams.get('game') === 'limbo' &&
        !url.searchParams.has('clientseed') &&
        !url.searchParams.has('serverseed') &&
        !url.searchParams.has('nonce')
      );
    });
  });
});
