import { ImageResponse } from 'next/og';
import { getUserPublicProfileByUsername } from '@/lib/db';

export const alt = 'Open Smile Profile';
export const size = {
	width: 1200,
	height: 630,
};
export const contentType = 'image/png';

export default async function OpenGraphImage({
	params,
}: {
	params: Promise<{ username: string }>;
}) {
	const { username } = await params;
	const profile = await getUserPublicProfileByUsername(username);

	const name = profile?.name || 'Smiler';
	const userHandle = profile?.username || username;
	const streakCount = profile?.stats.streakCount || 0;
	const totalSmiles = profile?.stats.totalSmiles || 0;
	const tierName = profile?.stats.tierName || 'Bronze Smiler';

	return new ImageResponse(
		(
			<div
				style={{
					height: '100%',
					width: '100%',
					display: 'flex',
					flexDirection: 'column',
					backgroundColor: '#faf8f5',
					padding: '44px 48px',
					fontFamily: 'sans-serif',
					border: '14px solid #0f0f0f',
					boxSizing: 'border-box',
					justifyContent: 'space-between',
				}}
			>
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						width: '100%',
					}}
				>
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							gap: '16px',
						}}
					>
						<div
							style={{
								backgroundColor: '#FF2D78',
								color: '#000000',
								fontWeight: 900,
								fontSize: '22px',
								padding: '8px 20px',
								border: '3px solid #0f0f0f',
								borderRadius: '7px',
								boxShadow: '4px 4px 0px #0f0f0f',
							}}
						>
							OPEN SMILE
						</div>
						<div
							style={{
								fontSize: '18px',
								fontWeight: 800,
								color: '#0f0f0f',
								letterSpacing: '0.5px',
							}}
						>
							AI SMILE REWARDS
						</div>
					</div>

					<div
						style={{
							backgroundColor: '#C6F135',
							color: '#0f0f0f',
							fontWeight: 900,
							fontSize: '17px',
							padding: '8px 18px',
							border: '3px solid #0f0f0f',
							borderRadius: '7px',
							boxShadow: '3px 3px 0px #0f0f0f',
						}}
					>
						VERIFIED SMILER
					</div>
				</div>

				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						gap: '8px',
						marginTop: '12px',
					}}
				>
					<div
						style={{
							fontSize: '54px',
							fontWeight: 900,
							color: '#0f0f0f',
							lineHeight: 1.1,
							letterSpacing: '-1.5px',
						}}
					>
						{name}
					</div>
					<div
						style={{
							fontSize: '26px',
							fontWeight: 700,
							color: '#57534e',
						}}
					>
						@{userHandle}
					</div>
				</div>

				<div
					style={{
						display: 'flex',
						gap: '24px',
						width: '100%',
						marginTop: '8px',
					}}
				>
					<div
						style={{
							flex: 1,
							backgroundColor: '#C6F135',
							border: '4px solid #0f0f0f',
							borderRadius: '12px',
							boxShadow: '5px 5px 0px #0f0f0f',
							padding: '20px 22px',
							display: 'flex',
							flexDirection: 'column',
							gap: '4px',
						}}
					>
						<div
							style={{
								fontSize: '15px',
								fontWeight: 800,
								color: '#0f0f0f',
								textTransform: 'uppercase',
								letterSpacing: '0.5px',
							}}
						>
							Daily Streak
						</div>
						<div
							style={{
								fontSize: '42px',
								fontWeight: 900,
								color: '#0f0f0f',
							}}
						>
							🔥 {streakCount} Days
						</div>
					</div>

					<div
						style={{
							flex: 1,
							backgroundColor: '#FF2D78',
							border: '4px solid #0f0f0f',
							borderRadius: '12px',
							boxShadow: '5px 5px 0px #0f0f0f',
							padding: '20px 22px',
							display: 'flex',
							flexDirection: 'column',
							gap: '4px',
						}}
					>
						<div
							style={{
								fontSize: '15px',
								fontWeight: 800,
								color: '#000000',
								textTransform: 'uppercase',
								letterSpacing: '0.5px',
							}}
						>
							Total Smiles
						</div>
						<div
							style={{
								fontSize: '42px',
								fontWeight: 900,
								color: '#000000',
							}}
						>
							😊 {totalSmiles}
						</div>
					</div>

					<div
						style={{
							flex: 1,
							backgroundColor: '#7B61FF',
							border: '4px solid #0f0f0f',
							borderRadius: '12px',
							boxShadow: '5px 5px 0px #0f0f0f',
							padding: '20px 22px',
							display: 'flex',
							flexDirection: 'column',
							gap: '4px',
						}}
					>
						<div
							style={{
								fontSize: '15px',
								fontWeight: 800,
								color: '#FFFFFF',
								textTransform: 'uppercase',
								letterSpacing: '0.5px',
							}}
						>
							Status Tier
						</div>
						<div
							style={{
								fontSize: '32px',
								fontWeight: 900,
								color: '#FFFFFF',
							}}
						>
							🏆 {tierName}
						</div>
					</div>
				</div>

				<div
					style={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						borderTop: '3px solid #0f0f0f',
						paddingTop: '16px',
						marginTop: '12px',
					}}
				>
					<div
						style={{
							fontSize: '18px',
							fontWeight: 800,
							color: '#0f0f0f',
						}}
					>
						open-smile.vercel.app/u/{userHandle}
					</div>
					<div
						style={{
							fontSize: '16px',
							fontWeight: 700,
							color: '#57534e',
						}}
					>
						Smile more, win more · On-Device AI Rewards
					</div>
				</div>
			</div>
		),
		{
			...size,
		}
	);
}
