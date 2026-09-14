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

export const DEFAULT_LUCKY_DROP_CHANCE = 0.1;
export const DEFAULT_LUCKY_BONUS_MIN = 2;
export const DEFAULT_LUCKY_BONUS_MAX = 5;

export interface CaptureRewardConfig {
	coin_multiplier?: number;
	min_smile_score_threshold?: number;
	scratch_min_coins?: number;
	scratch_max_coins?: number;
	lucky_drop_enabled?: boolean;
	lucky_drop_chance?: number;
	lucky_bonus_min?: number;
	lucky_bonus_max?: number;
	tiers?: SmileTier[];
}

export interface CoinCalculationResult {
	totalCoins: number;
	baseCoins: number;
	luckyBonus: number;
	isLuckyDrop: boolean;
	tier: string;
	streakMultiplier: number;
	coinMultiplier: number;
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

export function getTier(clampedScore: number, tiers: SmileTier[] = SMILE_TIERS): SmileTier {
	const sorted = [...tiers].sort((a, b) => b.minScore - a.minScore);
	return (
		sorted.find((tier) => clampedScore >= tier.minScore) ??
		sorted[sorted.length - 1] ?? { name: 'NONE', minScore: 0, minCoins: 0, maxCoins: 0 }
	);
}

export function calculateSmileCoins(
	smileScore: number,
	streakMultiplier = 1.0,
	seed: number = Date.now() ^ Math.floor(Math.random() * 0xffffffff),
	minScoreThresholdOrConfig?: number | CaptureRewardConfig,
): CoinCalculationResult {
	const config: CaptureRewardConfig =
		typeof minScoreThresholdOrConfig === 'number'
			? { min_smile_score_threshold: minScoreThresholdOrConfig }
			: (minScoreThresholdOrConfig || {});

	const activeTiers =
		Array.isArray(config.tiers) && config.tiers.length > 0
			? config.tiers
			: SMILE_TIERS;

	const minScoreThreshold =
		typeof config.min_smile_score_threshold === 'number'
			? config.min_smile_score_threshold
			: 11;

	const coinMultiplier =
		typeof config.coin_multiplier === 'number' && config.coin_multiplier > 0
			? config.coin_multiplier
			: 1.0;

	const luckyDropEnabled = config.lucky_drop_enabled !== false;
	const luckyDropChance =
		typeof config.lucky_drop_chance === 'number'
			? config.lucky_drop_chance
			: DEFAULT_LUCKY_DROP_CHANCE;

	const luckyBonusMin =
		typeof config.lucky_bonus_min === 'number'
			? config.lucky_bonus_min
			: DEFAULT_LUCKY_BONUS_MIN;

	const luckyBonusMax =
		typeof config.lucky_bonus_max === 'number'
			? config.lucky_bonus_max
			: DEFAULT_LUCKY_BONUS_MAX;

	const clampedScore = Math.max(0, Math.min(100, Math.round(smileScore)));
	const tier = getTier(clampedScore, activeTiers);
	const random = mulberry32(seed);

	if (clampedScore < minScoreThreshold || tier.maxCoins === 0) {
		return {
			totalCoins: 0,
			baseCoins: 0,
			luckyBonus: 0,
			isLuckyDrop: false,
			tier: tier.name,
			streakMultiplier,
			coinMultiplier,
			seed,
			message: 'Oops! Nothing here you might be lucky next time',
		};
	}

	const minRange = Math.min(tier.minCoins, tier.maxCoins);
	const maxRange = Math.max(tier.minCoins, tier.maxCoins);
	const baseCoins = Math.floor(random() * (maxRange - minRange + 1)) + minRange;

	const isLuckyDrop = luckyDropEnabled && random() < luckyDropChance;
	const minLucky = Math.min(luckyBonusMin, luckyBonusMax);
	const maxLucky = Math.max(luckyBonusMin, luckyBonusMax);
	const luckyBonus = isLuckyDrop
		? Math.floor(random() * (maxLucky - minLucky + 1)) + minLucky
		: 0;

	let calculatedTotal = Math.round((baseCoins + luckyBonus) * streakMultiplier * coinMultiplier);

	if (typeof config.scratch_min_coins === 'number' && config.scratch_min_coins > 0) {
		calculatedTotal = Math.max(config.scratch_min_coins, calculatedTotal);
	}
	if (typeof config.scratch_max_coins === 'number' && config.scratch_max_coins > 0) {
		calculatedTotal = Math.min(config.scratch_max_coins, calculatedTotal);
	}

	const totalCoins = Math.max(1, calculatedTotal);

	return {
		totalCoins,
		baseCoins,
		luckyBonus,
		isLuckyDrop,
		tier: tier.name,
		streakMultiplier,
		coinMultiplier,
		seed,
	};
}
