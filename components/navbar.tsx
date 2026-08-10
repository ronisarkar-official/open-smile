'use client';

import React from 'react';
import Link from 'next/link';
import { Book, LogOut, Menu, Sunset, Trees, Zap } from 'lucide-react';
import { useSession, signOut } from '@/lib/auth-client';
import { Logo } from '@/components/logo';

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet';

interface MenuItem {
	title: string;
	url: string;
	description?: string;
	icon?: React.ReactNode;
	items?: MenuItem[];
}

interface NavbarProps {
	logo?: {
		url?: string;
		src?: string;
		alt?: string;
		title?: string;
	};
	menu?: MenuItem[];
	mobileExtraLinks?: {
		name: string;
		url: string;
	}[];
}

const Navbar = ({
	logo = {
		url: '/',
	},
	menu = [
		{ title: 'Home', url: '#' },
		{
			title: 'Products',
			url: '#',
			items: [
				{
					title: 'Blog',
					description: 'The latest industry news, updates, and info',
					icon: <Book className="size-5 shrink-0" />,
					url: '#',
				},
				{
					title: 'Company',
					description: 'Our mission is to innovate and empower the world',
					icon: <Trees className="size-5 shrink-0" />,
					url: '#',
				},
				{
					title: 'Careers',
					description: 'Browse job listing and discover our workspace',
					icon: <Sunset className="size-5 shrink-0" />,
					url: '#',
				},
				{
					title: 'Support',
					description:
						'Get in touch with our support team or visit our community forums',
					icon: <Zap className="size-5 shrink-0" />,
					url: '#',
				},
			],
		},
		{
			title: 'Resources',
			url: '#',
			items: [
				{
					title: 'Help Center',
					description: 'Get all the answers you need right here',
					icon: <Zap className="size-5 shrink-0" />,
					url: '#',
				},
				{
					title: 'Contact Us',
					description: 'We are here to help you with any questions you have',
					icon: <Sunset className="size-5 shrink-0" />,
					url: '#',
				},
				{
					title: 'Status',
					description: 'Check the current status of our services and APIs',
					icon: <Trees className="size-5 shrink-0" />,
					url: '#',
				},
				{
					title: 'Terms of Service',
					description: 'Our terms and conditions for using our services',
					icon: <Book className="size-5 shrink-0" />,
					url: '#',
				},
			],
		},
		{
			title: 'Blog',
			url: '#',
		},
	],
	mobileExtraLinks = [
		{ name: 'Press', url: '#' },
		{ name: 'Contact', url: '#' },
		{ name: 'Imprint', url: '#' },
		{ name: 'Sitemap', url: '#' },
	],
}: NavbarProps) => {
	const { data: session, isPending } = useSession();
	return (
		<section className="py-4 w-full">
			<div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
				<nav className="hidden justify-between lg:flex">
					<div className="flex items-center gap-6">
						<Link
							href={logo.url ?? '/'}
							className="flex items-center gap-2 transition-opacity hover:opacity-90">
							<Logo />
						</Link>
						<div className="flex items-center">
							<NavigationMenu>
								<NavigationMenuList>
									{menu.map((item) => renderMenuItem(item))}
								</NavigationMenuList>
							</NavigationMenu>
						</div>
					</div>
					<div className="flex items-center gap-2">
						{isPending ?
							<div className="h-8 w-20 animate-pulse rounded-md bg-muted" />
						: session?.user ?
							<div className="flex items-center gap-3">
								{session.user.image ?
									<img
										src={session.user.image}
										alt={session.user.name ?? 'User'}
										className="size-8 rounded-full"
									/>
								:	<div className="size-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
										{session.user.name?.charAt(0).toUpperCase() ?? 'U'}
									</div>
								}
								<span className="text-sm font-medium">{session.user.name}</span>
								<Button
									variant="outline"
									size="sm"
									onClick={() => signOut()}>
									<LogOut className="mr-1.5 size-3.5" />
									Sign out
								</Button>
							</div>
						:	<>
								<Button
									asChild
									variant="ghost"
									size="sm">
									<Link href="/login">Log in</Link>
								</Button>
								<Button
									asChild
									size="sm">
									<Link href="/signup">Sign up</Link>
								</Button>
							</>
						}
					</div>
				</nav>
				<div className="block lg:hidden">
					<div className="flex items-center justify-between">
						<Link
							href={logo.url ?? '/'}
							className="flex items-center gap-2 transition-opacity hover:opacity-90">
							<Logo />
						</Link>
						<Sheet>
							<SheetTrigger asChild>
								<Button
									variant="outline"
									size="icon">
									<Menu className="size-4" />
								</Button>
							</SheetTrigger>
							<SheetContent className="overflow-y-auto">
								<SheetHeader>
									<SheetTitle>
										<Link
											href={logo.url ?? '/'}
											className="flex items-center gap-2 transition-opacity hover:opacity-90">
											<Logo />
										</Link>
									</SheetTitle>
								</SheetHeader>
								<div className="my-6 flex flex-col gap-6">
									<Accordion
										type="single"
										collapsible
										className="flex w-full flex-col gap-4">
										{menu.map((item) => renderMobileMenuItem(item))}
									</Accordion>
									<div className="border-t py-4">
										<div className="grid grid-cols-2 justify-start">
											{mobileExtraLinks.map((link, idx) => (
												<Link
													key={idx}
													className="inline-flex h-10 items-center gap-2 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-accent-foreground"
													href={link.url}>
													{link.name}
												</Link>
											))}
										</div>
									</div>
									<div className="flex flex-col gap-3">
										{session?.user ?
											<>
												<div className="flex items-center gap-3 px-1 py-2">
													{session.user.image ?
														<img
															src={session.user.image}
															alt={session.user.name ?? 'User'}
															className="size-8 rounded-full"
														/>
													:	<div className="size-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
															{session.user.name?.charAt(0).toUpperCase() ??
																'U'}
														</div>
													}
													<span className="text-sm font-medium">
														{session.user.name}
													</span>
												</div>
												<Button
													variant="outline"
													onClick={() => signOut()}>
													<LogOut className="mr-1.5 size-4" />
													Sign out
												</Button>
											</>
										:	<>
												<Button
													asChild
													variant="outline">
													<Link href="/login">Log in</Link>
												</Button>
												<Button asChild>
													<Link href="/signup">Sign up</Link>
												</Button>
											</>
										}
									</div>
								</div>
							</SheetContent>
						</Sheet>
					</div>
				</div>
			</div>
		</section>
	);
};

const renderMenuItem = (item: MenuItem) => {
	if (item.items) {
		return (
			<NavigationMenuItem
				key={item.title}
				className="text-muted-foreground">
				<NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
				<NavigationMenuContent>
					<ul className="w-80 p-3">
						{item.items.map((subItem) => (
							<li key={subItem.title}>
								<NavigationMenuLink asChild>
									<Link
										className="flex select-none gap-4 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-muted hover:text-accent-foreground"
										href={subItem.url}>
										{subItem.icon}
										<div>
											<div className="text-sm font-semibold">
												{subItem.title}
											</div>
											{subItem.description && (
												<p className="text-sm leading-snug text-muted-foreground">
													{subItem.description}
												</p>
											)}
										</div>
									</Link>
								</NavigationMenuLink>
							</li>
						))}
					</ul>
				</NavigationMenuContent>
			</NavigationMenuItem>
		);
	}

	return (
		<Link
			key={item.title}
			className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-accent-foreground"
			href={item.url}>
			{item.title}
		</Link>
	);
};

const renderMobileMenuItem = (item: MenuItem) => {
	if (item.items) {
		return (
			<AccordionItem
				key={item.title}
				value={item.title}
				className="border-b-0">
				<AccordionTrigger className="py-0 font-semibold hover:no-underline">
					{item.title}
				</AccordionTrigger>
				<AccordionContent className="mt-2">
					{item.items.map((subItem) => (
						<Link
							key={subItem.title}
							className="flex select-none gap-4 rounded-md p-3 leading-none outline-none transition-colors hover:bg-muted hover:text-accent-foreground"
							href={subItem.url}>
							{subItem.icon}
							<div>
								<div className="text-sm font-semibold">{subItem.title}</div>
								{subItem.description && (
									<p className="text-sm leading-snug text-muted-foreground">
										{subItem.description}
									</p>
								)}
							</div>
						</Link>
					))}
				</AccordionContent>
			</AccordionItem>
		);
	}

	return (
		<Link
			key={item.title}
			href={item.url}
			className="font-semibold">
			{item.title}
		</Link>
	);
};

export { Navbar };
