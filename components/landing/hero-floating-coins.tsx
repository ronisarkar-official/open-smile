import React from 'react';
import { GumroadCoin } from './gumroad-coin';

export function HeroFloatingCoins() {
	return (
		<div
			aria-hidden="true"
			className="pointer-events-none absolute inset-0 -z-10 select-none overflow-hidden">
			<div
				className="absolute -top-3 left-1 sm:top-2 sm:left-4 lg:top-6 lg:left-8 animate-coin-1"
				style={{ '--coin-rot': '-36deg' } as React.CSSProperties}>
				<GumroadCoin
					rx={54}
					ry={33}
					depth={19}
					rotation={-36}
					variant="classic"
					className="w-20 sm:w-28 lg:w-32 h-auto"
				/>
			</div>

			<div
				className="absolute -bottom-8 -left-6 sm:-bottom-12 sm:-left-8 lg:-bottom-16 lg:-left-12 animate-coin-2"
				style={{ '--coin-rot': '-18deg' } as React.CSSProperties}>
				<GumroadCoin
					rx={108}
					ry={72}
					depth={34}
					rotation={-18}
					variant="classic"
					className="w-36 sm:w-52 lg:w-68 xl:w-76 h-auto"
				/>
			</div>

			<div
				className="absolute -top-2 right-2 sm:top-2 sm:right-6 lg:top-3 lg:right-10 xl:right-16 animate-coin-3"
				style={{ '--coin-rot': '28deg' } as React.CSSProperties}>
				<GumroadCoin
					rx={48}
					ry={29}
					depth={16}
					rotation={28}
					variant="wink"
					className="w-16 sm:w-22 lg:w-28 h-auto"
				/>
			</div>

			<div
				className="absolute -bottom-8 right-8 sm:-bottom-10 sm:right-16 lg:-bottom-12 lg:right-28 xl:right-36 animate-coin-1"
				style={{ '--coin-rot': '-24deg' } as React.CSSProperties}>
				<GumroadCoin
					rx={82}
					ry={52}
					depth={27}
					rotation={-24}
					variant="classic"
					className="w-28 sm:w-40 lg:w-52 h-auto"
				/>
			</div>

			<div
				className="hidden sm:block absolute top-1/2 -right-6 lg:-right-10 -translate-y-1/2 animate-coin-2"
				style={{ '--coin-rot': '-52deg' } as React.CSSProperties}>
				<GumroadCoin
					rx={58}
					ry={27}
					depth={22}
					rotation={-52}
					variant="classic"
					className="w-24 sm:w-32 lg:w-40 h-auto"
				/>
			</div>
		</div>
	);
}
