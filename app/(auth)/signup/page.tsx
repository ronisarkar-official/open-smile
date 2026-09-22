'use client';

import { useState, useEffect, Suspense } from 'react';
import { signIn } from '@/lib/auth-client';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
	Eye,
	EyeOff,
	Mail,
	Lock,
	User,
	Loader2,
	Gift,
	CheckCircle2,
	ShieldCheck,
	ArrowRight,
	Check,
} from 'lucide-react';
import { GitHubIcon, GoogleIcon } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

function SignupForm() {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const [socialLoading, setSocialLoading] = useState<
		'github' | 'google' | null
	>(null);
	const [referralCode, setReferralCode] = useState<string>('');
	const [showReferralInput, setShowReferralInput] = useState(false);
	const [hasAutoRef, setHasAutoRef] = useState(false);
	const [agreedToTerms, setAgreedToTerms] = useState(false);

	const router = useRouter();
	const searchParams = useSearchParams();
	const redirectTo = searchParams.get('redirectTo');
	const refParam = searchParams.get('ref');

	useEffect(() => {
		if (refParam) {
			const cleanRef = decodeURIComponent(refParam).trim().toUpperCase();
			setReferralCode(cleanRef);
			setHasAutoRef(true);
			if (typeof document !== 'undefined') {
				const maxAge = 30 * 24 * 60 * 60;
				document.cookie = `ref_code=${encodeURIComponent(cleanRef)}; max-age=${maxAge}; path=/; SameSite=Lax`;
				try {
					localStorage.setItem('opensmile_ref_code', cleanRef);
				} catch {}
			}
		} else if (typeof document !== 'undefined') {
			const match = document.cookie.match(/ref_code=([^;]+)/);
			if (match?.[1]) {
				setReferralCode(decodeURIComponent(match[1]).trim().toUpperCase());
				setHasAutoRef(true);
			} else {
				try {
					const localRef = localStorage.getItem('opensmile_ref_code');
					if (localRef) {
						const cleanLocal = localRef.trim().toUpperCase();
						setReferralCode(cleanLocal);
						setHasAutoRef(true);
						const maxAge = 30 * 24 * 60 * 60;
						document.cookie = `ref_code=${encodeURIComponent(cleanLocal)}; max-age=${maxAge}; path=/; SameSite=Lax`;
					}
				} catch {}
			}
		}
	}, [refParam]);

	const hasMinLength = password.length >= 8;

	async function handleSocialSignIn(provider: 'github' | 'google') {
		try {
			sessionStorage.setItem('opensmile_is_new_signup', 'true');
			const codeToPreserve = (referralCode || refParam || '').trim().toUpperCase();
			if (codeToPreserve && typeof document !== 'undefined') {
				const maxAge = 30 * 24 * 60 * 60;
				document.cookie = `ref_code=${encodeURIComponent(codeToPreserve)}; max-age=${maxAge}; path=/; SameSite=Lax`;
				try {
					localStorage.setItem('opensmile_ref_code', codeToPreserve);
				} catch {}
			}
		} catch {}
		try {
			setSocialLoading(provider);
			setError('');
			await signIn.social({
				provider,
				callbackURL: redirectTo || '/dashboard',
			});
		} catch (err: unknown) {
			const message =
				err instanceof Error ?
					err.message
				:	'Failed to initiate social login. Please try again.';
			setError(message);
			setSocialLoading(null);
		}
	}

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setError('');

		if (!agreedToTerms) {
			setError(
				'Please accept the Terms of Service & Privacy Policy to continue.',
			);
			return;
		}

		if (!hasMinLength) {
			setError('Password must be at least 8 characters long.');
			return;
		}

		setLoading(true);

		try {
			const res = await fetch('/api/auth/send-otp', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					email,
					name,
					password,
					type: 'signup',
					referral_code: referralCode.trim() || undefined,
				}),
			});

			const data = await res.json();

			if (!res.ok) {
				throw new Error(data.error || 'Failed to send verification OTP');
			}

			sessionStorage.setItem(
				'pending_auth',
				JSON.stringify({ email, ticket: data.signupTicket }),
			);

			const redirectQuery =
				redirectTo ? `&redirectTo=${encodeURIComponent(redirectTo)}` : '';
			router.push(
				`/verify-otp?email=${encodeURIComponent(email)}&flow=signup${redirectQuery}`,
			);
		} catch (err: unknown) {
			const message =
				err instanceof Error ?
					err.message
				:	'Something went wrong. Please try again.';
			setError(message);
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="space-y-2.5 sm:space-y-3">
			{/* Header */}
			<div className="space-y-0.5">
				<h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-foreground leading-tight">
					Create Account
				</h1>
				<p className="text-[11px] sm:text-xs font-medium text-muted-foreground leading-tight">
					Score smiles on-device &amp; earn real gift vouchers.
				</p>
			</div>

			{/* Social Login Buttons */}
			<div className="grid grid-cols-2 gap-2">
				<Button
					type="button"
					variant="outline"
					className="w-full h-8 gap-1.5 text-xs font-bold border-(length:--border-width) border-black shadow-brutal-xs hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all dark:border-white"
					disabled={loading || Boolean(socialLoading)}
					onClick={() => handleSocialSignIn('github')}>
					{socialLoading === 'github' ?
						<Loader2 className="size-3.5 animate-spin" />
					:	<GitHubIcon className="size-3.5" />}
					<span>GitHub</span>
				</Button>
				<Button
					type="button"
					variant="outline"
					className="w-full h-8 gap-1.5 text-xs font-bold border-(length:--border-width) border-black shadow-brutal-xs hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all dark:border-white"
					disabled={loading || Boolean(socialLoading)}
					onClick={() => handleSocialSignIn('google')}>
					{socialLoading === 'google' ?
						<Loader2 className="size-3.5 animate-spin" />
					:	<GoogleIcon className="size-3.5" />}
					<span>Google</span>
				</Button>
			</div>

			{/* Divider */}
			<div className="relative py-0.5">
				<div className="absolute inset-0 flex items-center">
					<span className="w-full border-t border-black/15 dark:border-white/15" />
				</div>
				<div className="relative flex justify-center text-[9px] uppercase font-mono">
					<span className="bg-card px-2 font-bold text-muted-foreground">
						or with email
					</span>
				</div>
			</div>

			{/* Form Fields */}
			<form
				onSubmit={handleSubmit}
				className="space-y-2">
				{error && (
					<div className="rounded border-(length:--border-width) border-destructive bg-destructive/10 px-2.5 py-1.5 text-[11px] font-bold text-destructive shadow-brutal-xs">
						{error}
					</div>
				)}

				{/* Full Name */}
				<div className="space-y-0.5">
					<Label
						htmlFor="name"
						className="text-[10px] font-bold uppercase tracking-wider font-mono">
						Full name
					</Label>
					<div className="relative">
						<User className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
						<Input
							id="name"
							type="text"
							placeholder="e.g. Alex Rivera"
							className="h-8 pl-8 text-xs border-(length:--border-width) border-black dark:border-white rounded-md bg-background focus-visible:ring-1"
							value={name}
							onChange={(e) => setName(e.target.value)}
							required
						/>
					</div>
				</div>

				{/* Email */}
				<div className="space-y-0.5">
					<Label
						htmlFor="email"
						className="text-[10px] font-bold uppercase tracking-wider font-mono">
						Email address
					</Label>
					<div className="relative">
						<Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
						<Input
							id="email"
							type="email"
							placeholder="alex@example.com"
							className="h-8 pl-8 text-xs border-(length:--border-width) border-black dark:border-white rounded-md bg-background focus-visible:ring-1"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					</div>
				</div>

				{/* Password */}
				<div className="space-y-0.5">
					<div className="flex items-center justify-between">
						<Label
							htmlFor="password"
							className="text-[10px] font-bold uppercase tracking-wider font-mono">
							Password
						</Label>
						{password.length > 0 && (
							<span className="text-[9px] font-mono font-bold text-muted-foreground">
								{hasMinLength ?
									<span className="text-success inline-flex items-center gap-0.5">
										<Check className="size-2.5" /> 8+ chars
									</span>
								:	<span>Min 8 chars</span>}
							</span>
						)}
					</div>
					<div className="relative">
						<Lock className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
						<Input
							id="password"
							type={showPassword ? 'text' : 'password'}
							placeholder="Min. 8 characters"
							className="h-8 pl-8 pr-8 text-xs border-(length:--border-width) border-black dark:border-white rounded-md bg-background focus-visible:ring-1"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							minLength={8}
						/>
						<button
							type="button"
							onClick={() => setShowPassword(!showPassword)}
							aria-label={showPassword ? 'Hide password' : 'Show password'}
							className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-muted-foreground hover:text-foreground">
							{showPassword ?
								<EyeOff className="size-3.5" />
							:	<Eye className="size-3.5" />}
						</button>
					</div>
				</div>

				{/* Referral Badge or Expandable Input */}
				{hasAutoRef || referralCode ?
					<div className="flex items-center justify-between rounded border-(length:--border-width) border-black bg-[#C6EED5] px-2.5 py-1 text-[10px] font-mono shadow-brutal-xs dark:border-white dark:bg-[#142A1D]">
						<div className="flex items-center gap-1.5">
							<Gift className="size-3 text-success shrink-0" />
							<span>
								Code:{' '}
								<strong className="text-foreground">{referralCode}</strong>
							</span>
						</div>
						<span className="inline-flex items-center gap-0.5 font-bold text-success">
							<CheckCircle2 className="size-3" /> Bonus Unlocked
						</span>
					</div>
				:	<div>
						{!showReferralInput ?
							<button
								type="button"
								onClick={() => setShowReferralInput(true)}
								className="inline-flex items-center gap-1 text-[11px] font-bold font-mono text-primary hover:underline">
								<Gift className="size-3" /> Have an invite code?
							</button>
						:	<div className="space-y-0.5 animate-in fade-in-50">
								<Label
									htmlFor="referral"
									className="text-[10px] font-bold uppercase tracking-wider font-mono">
									Referral code
								</Label>
								<Input
									id="referral"
									type="text"
									placeholder="e.g. SMILE42"
									className="h-7 text-[11px] font-mono uppercase border-(length:--border-width) border-black dark:border-white rounded-md bg-background"
									value={referralCode}
									onChange={(e) =>
										setReferralCode(e.target.value.toUpperCase())
									}
								/>
							</div>
						}
					</div>
				}

				<label className="flex items-start gap-2.5 pt-0.5 cursor-pointer select-none group">
					<div className="relative flex items-center justify-center shrink-0 mt-0.5">
						<input
							type="checkbox"
							id="terms"
							checked={agreedToTerms}
							onChange={(e) => setAgreedToTerms(e.target.checked)}
							className="peer sr-only"
						/>
						<div className="size-4.5 rounded-lg border border-black dark:border-white bg-card peer-checked:bg-primary transition-all flex items-center justify-center shadow-[1.5px_1.5px_0px_#000] dark:shadow-[1.5px_1.5px_0px_#fff]">
							{agreedToTerms && (
								<Check className="size-3.5 stroke-[3.5] text-black" />
							)}
						</div>
					</div>
					<span className="text-xs sm:text-[13px] leading-snug text-muted-foreground">
						I agree to the{' '}
						<Link
							href="/terms"
							target="_blank"
							className="font-bold underline underline-offset-2 text-foreground hover:text-primary transition-colors"
							onClick={(e) => e.stopPropagation()}>
							Terms of Service
						</Link>
						,{' '}
						<Link
							href="/privacy"
							target="_blank"
							className="font-bold underline underline-offset-2 text-foreground hover:text-primary transition-colors"
							onClick={(e) => e.stopPropagation()}>
							Privacy Policy
						</Link>
						, and{' '}
						<Link
							href="/rules"
							target="_blank"
							className="font-bold underline underline-offset-2 text-foreground hover:text-primary transition-colors"
							onClick={(e) => e.stopPropagation()}>
							Fair Play Rules
						</Link>
						.
					</span>
				</label>

				{/* Submit Button */}
				<Button
					type="submit"
					className="w-full h-8.5 gap-1.5 text-xs font-black uppercase tracking-wider border-(length:--border-width) border-black bg-primary text-primary-foreground shadow-brutal-xs hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 transition-all dark:border-white"
					disabled={loading}>
					{loading ?
						<>
							<Loader2 className="size-3.5 animate-spin" />
							<span>Sending OTP…</span>
						</>
					:	<>
							<span>Create Account</span>
							<ArrowRight className="size-3.5" />
						</>
					}
				</Button>
			</form>

			{/* Switcher & Trust Line */}
			<div className="pt-1.5 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-[11px]">
				<span className="text-muted-foreground">
					Have an account?{' '}
					<Link
						href={
							redirectTo ?
								`/login?redirectTo=${encodeURIComponent(redirectTo)}`
							:	'/login'
						}
						className="font-bold text-foreground underline underline-offset-2 hover:text-primary transition-colors">
						Sign in
					</Link>
				</span>
				<span className="inline-flex items-center gap-1 font-mono text-[9px] font-bold text-muted-foreground">
					<ShieldCheck className="size-3 text-success" /> 100% On-Device AI
				</span>
			</div>
		</div>
	);
}

export default function SignupPage() {
	return (
		<Suspense
			fallback={
				<div className="h-48 flex items-center justify-center text-xs font-mono text-muted-foreground">
					<Loader2 className="size-4 animate-spin mr-2" />
					Loading…
				</div>
			}>
			<SignupForm />
		</Suspense>
	);
}
