import type { Metadata } from 'next';
import { RewardsView } from '@/components/rewards/rewards-view';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
	title: 'Rewards & Marketplace | Open Smile',
	description: 'Redeem coins for brand vouchers, scratch cards from daily smiles, and explore gift rewards.',
};

export default function RewardsPage() {
	return <RewardsView />;
}
