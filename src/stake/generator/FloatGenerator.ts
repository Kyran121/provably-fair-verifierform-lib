import type { StakeSeed } from '../types';
import ByteGenerator from './ByteGenerator';

// Convert the hash output from the rng byteGenerator to floats
export default function* FloatGenerator(seed: StakeSeed): Generator<number, number, number> {
	const { serverSeed, clientSeed, nonce, cursor = 0 } = seed;

	// Random number generator function
	const rng = ByteGenerator({ serverSeed, clientSeed, nonce, cursor });

	while (true) {
		// Get first 4 bytes from rng function and convert to float
		let result = 0;
		for (let i = 0; i < 4; i++) {
			result += rng.next().value / 256 ** (i + 1);
		}
		yield result;
	}
}
