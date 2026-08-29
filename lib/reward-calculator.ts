/**
 * Server-only coin calculation. Must run in the API layer that inserts
 * into coin_ledger — never in client code. The result is computed once,
 * server-side, and returned to the client as an already-locked value;
 * the client's scratch-card reveal is a pure animation over this number,
 * never a source of truth for it.
 *
 * Uses a seeded PRNG (mulberry32) instead of Math.random() so every
 * coin award is reproducible from its seed alone — useful for disputes,
 * debugging, and audit logs ("this score + this seed always produces
 * this exact result").
 */

export interface SmileTier {
	name: string;
	minScore: number;
	minCoins: number;
	maxCoins: number;
}

export const SMILE_TIERS: SmileTier[] = [
	{ name: 'RADIANT', minScore: 92, minCoins: 7, maxCoins: 14 },
	{ name: 'GLOWING', minScore: 75, minCoins: 5, maxCoins: 10 },
	{ name: 'WARM', minScore: 55, minCoins: 3, maxCoins: 7 },
	{ name: 'GENTLE', minScore: 35, minCoins: 2, maxCoins: 5 },
	{ name: 'SUBTLE', minScore: 15, minCoins: 1, maxCoins: 3 },
	{ name: 'FAINT', minScore: 11, minCoins: 1, maxCoins: 2 },
	{ name: 'NONE', minScore: 0, minCoins: 0, maxCoins: 0 },
];

const LUCKY_DROP_CHANCE = 0.1;
const LUCKY_BONUS_MIN = 2;
const LUCKY_BONUS_MAX = 5;

export interface CoinCalculationResult {
	totalCoins: number;
	baseCoins: number;
	luckyBonus: number;
	isLuckyDrop: boolean;
	tier: string;
	streakMultiplier: number;
	seed: number;
	message?: string;
}

function mulberry32(seed: number) {
	let state = seed;
	return function random() {
		state |= 0;
		state = (state + 0x6d2b79f5) | 0;
		let t = Math.imul(state ^ (state >>> 15), 1 | state);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

function getTier(clampedScore: number): SmileTier {
	return (
		SMILE_TIERS.find((tier) => clampedScore >= tier.minScore) ??
		SMILE_TIERS[SMILE_TIERS.length - 1]
	);
}

export function calculateSmileCoins(
	smileScore: number,
	streakMultiplier = 1.0,
	seed: number = Date.now() ^ Math.floor(Math.random() * 0xffffffff),
): CoinCalculationResult {
	const clampedScore = Math.max(0, Math.min(100, Math.round(smileScore)));
	const tier = getTier(clampedScore);
	const random = mulberry32(seed);

	if (clampedScore <= 10 || tier.maxCoins === 0) {
		return {
			totalCoins: 0,
			baseCoins: 0,
			luckyBonus: 0,
			isLuckyDrop: false,
			tier: tier.name,
			streakMultiplier,
			seed,
			message: 'Oops! Nothing here you might be lucky next time',
		};
	}

	const baseCoins =
		Math.floor(random() * (tier.maxCoins - tier.minCoins + 1)) + tier.minCoins;

	const isLuckyDrop = random() < LUCKY_DROP_CHANCE;
	const luckyBonus =
		isLuckyDrop ?
			Math.floor(random() * (LUCKY_BONUS_MAX - LUCKY_BONUS_MIN + 1)) +
			LUCKY_BONUS_MIN
		:	0;

	const totalCoins = Math.max(
		1,
		Math.round((baseCoins + luckyBonus) * streakMultiplier),
	);

	return {
		totalCoins,
		baseCoins,
		luckyBonus,
		isLuckyDrop,
		tier: tier.name,
		streakMultiplier,
		seed,
	};
}
