import { SHA256 } from '@stablelib/sha256';
import { hmac as createHmac } from '@stablelib/hmac';
import { encode as toUInt8Array } from '@stablelib/utf8';
import type { StakeSeed } from '../types';

// Random number generation based on following inputs: serverSeed, clientSeed, nonce and cursor
export default function* ByteGenerator(seed: StakeSeed): Generator<number, number, number> {
  const { serverSeed, clientSeed, nonce, cursor = 0 } = seed;

  // Setup curser variables
  let currentRound = Math.floor(cursor / 32);
  let currentRoundCursor = cursor;
  currentRoundCursor -= currentRound * 32;

  // Generate outputs until cursor requirement fullfilled
  while (true) {
    // HMAC function used to output provided inputs into bytes
    const hmac = createHmac(
      SHA256,
      toUInt8Array(serverSeed),
      toUInt8Array(`${clientSeed}:${nonce}:${currentRound}`)
    );

    // Update curser for next iteration of loop
    while (currentRoundCursor < 32) {
      yield Number(hmac[currentRoundCursor]);
      currentRoundCursor += 1;
    }
    currentRoundCursor = 0;
    currentRound += 1;
  }
}
