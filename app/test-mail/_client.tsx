"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
	Mail,
	Send,
	Eye,
	CheckCircle2,
	AlertTriangle,
	Loader2,
	Smartphone,
	Monitor,
	KeyRound,
	UserPlus,
	ShieldAlert,
	Rocket,
	ArrowLeft,
	Copy,
	Check,
	ExternalLink,
	Code,
	FileText,
} from "lucide-react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	getOTPEmailHtml,
	getWelcomeEmailHtml,
	getResetPasswordEmailHtml,
	getLoginNotificationEmailHtml,
	getBetaWaitlistEmailHtml,
} from "@/backend/mailer/templates";

type TemplateType = "otp" | "welcome" | "reset-password" | "login-alert" | "beta-waitlist";

interface TemplateOption {
	id: TemplateType;
	label: string;
	description: string;
	badge: string;
	badgeBg: string;
	badgeText: string;
	icon: React.ComponentType<{ className?: string }>;
}

const TEMPLATES: TemplateOption[] = [
	{
		id: "otp",
		label: "OTP Verification",
		description: "6-digit code inside a high-contrast yellow Neubrutalist card.",
		badge: "SECURITY",
		badgeBg: "#FFD23F",
		badgeText: "#0f0f0f",
		icon: KeyRound,
	},
	{
		id: "welcome",
		label: "Welcome Onboarding",
		description: "Level 1 unlock badge, how-to-earn steps & camera CTA button.",
		badge: "ONBOARDING",
		badgeBg: "#C6F135",
		badgeText: "#0f0f0f",
		icon: UserPlus,
	},
	{
		id: "reset-password",
		label: "Reset Password",
		description: "Password recovery with primary button & security warning note.",
		badge: "ACCOUNT",
		badgeBg: "#FF2D78",
		badgeText: "#ffffff",
		icon: KeyRound,
	},
	{
		id: "login-alert",
		label: "Security Alert",
		description: "Sign-in alert with IP, client device, timestamp & secure button.",
		badge: "ALERT",
		badgeBg: "#EF4444",
		badgeText: "#ffffff",
		icon: ShieldAlert,
	},
	{
		id: "beta-waitlist",
		label: "Beta Waitlist",
		description: "Priority early access card with on-device AI & streak perks.",
		badge: "WAITLIST",
		badgeBg: "#7B61FF",
		badgeText: "#ffffff",
		icon: Rocket,
	},
];

export default function TestMailClient() {
	const [email, setEmail] = useState("test@example.com");
	const [template, setTemplate] = useState<TemplateType>("otp");
	const [name, setName] = useState("Alex");
	const [customCode, setCustomCode] = useState("849201");
	const [loading, setLoading] = useState(false);
	const [result, setResult] = useState<{
		success: boolean;
		message: string;
		deliveryMode?: string;
	} | null>(null);

	const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
	const [previewHeight, setPreviewHeight] = useState<"standard" | "large" | "full">("large");
	const [activeTab, setActiveTab] = useState<"visual" | "html" | "text">("visual");
	const [copiedHtml, setCopiedHtml] = useState(false);
	const [copiedText, setCopiedText] = useState(false);

	const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";

	const renderedHtml = useMemo(() => {
		const safeName = name.trim() || "Alex";
		const safeCode = customCode.trim() || "849201";
		const safeEmail = email.trim() || "user@example.com";

		switch (template) {
			case "otp":
				return getOTPEmailHtml(safeCode);
			case "welcome":
				return getWelcomeEmailHtml(safeName, origin);
			case "reset-password":
				return getResetPasswordEmailHtml(`${origin}/reset-password?token=sample_token_xyz&email=${encodeURIComponent(safeEmail)}`);
			case "login-alert":
				return getLoginNotificationEmailHtml({
					time: new Date().toUTCString(),
					ip: "127.0.0.1 (Localhost)",
					userAgent: "Chrome 128 (Windows 11)",
				}, origin);
			case "beta-waitlist":
			default:
				return getBetaWaitlistEmailHtml();
		}
	}, [template, name, customCode, email, origin]);

	const renderedPlainText = useMemo(() => {
		const safeName = name.trim() || "Alex";
		const safeCode = customCode.trim() || "849201";
		const safeEmail = email.trim() || "user@example.com";

		switch (template) {
			case "otp":
				return `[Open Smile] Verification Code: ${safeCode}\n\nYour one-time verification code is:\n${safeCode}\n\nThis code will expire in 5 minutes.\nIf you did not request this code, you can safely ignore this email.\n\n— The Open Smile Team`;
			case "welcome":
				return `Welcome to Open Smile! 🎉\n\nHi ${safeName},\n\nYour Open Smile account is ready. Get ready to turn your daily smiles into real rewards.\n\nCapture smiles, score your genuine smile rating with on-device AI, earn coins, and redeem them for real vouchers.\n\nStart smiling now: ${origin}/capture\n\n— The Open Smile Team`;
			case "reset-password":
				return `[Open Smile] Reset your password\n\nWe received a request to reset the password for your Open Smile account.\n\nOpen the link below to set a new password (valid for 1 hour):\n${origin}/reset-password?token=sample_token_xyz&email=${encodeURIComponent(safeEmail)}\n\nIf you did not request a password reset, you can safely ignore this email.\n\n— The Open Smile Team`;
			case "login-alert":
				return `[Open Smile] Security Alert: New Sign-in Detected\n\nWe noticed a new sign-in to your Open Smile account.\n\nDate/Time: ${new Date().toUTCString()}\nIP Address: 127.0.0.1\nDevice: Chrome 128 (Windows 11)\n\nIf this was you, no action is needed.\nIf you didn't perform this sign-in, please secure your account immediately:\n${origin}/forgot-password\n\n— The Open Smile Team`;
			case "beta-waitlist":
			default:
				return `[Open Smile] You're on the Beta List! 🚀\n\nThanks for joining the Open Smile waitlist.\n\nYou have secured early access to our AI-powered smile rewards platform. We will notify you the moment beta invites roll out.\n\n— The Open Smile Team`;
		}
	}, [template, name, customCode, email, origin]);

	async function handleSendTest(e: React.FormEvent) {
		e.preventDefault();
		if (!email.trim()) {
			setResult({
				success: false,
				message: "Please enter a valid recipient email address.",
			});
			return;
		}

		setLoading(true);
		setResult(null);

		try {
			const res = await fetch("/api/test-mail", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					email: email.trim(),
					type: template,
					name: name.trim(),
					customCode: customCode.trim(),
				}),
			});

			const data = await res.json();

			if (!res.ok) {
				throw new Error(data.error || "Failed to send test email");
			}

			setResult({
				success: true,
				message: data.message,
				deliveryMode: data.deliveryMode,
			});
		} catch (err) {
			setResult({
				success: false,
				message: err instanceof Error ? err.message : "An unexpected error occurred",
			});
		} finally {
			setLoading(false);
		}
	}

	function handleCopyHtml() {
		navigator.clipboard.writeText(renderedHtml);
		setCopiedHtml(true);
		setTimeout(() => setCopiedHtml(false), 2000);
	}

	function handleCopyText() {
		navigator.clipboard.writeText(renderedPlainText);
		setCopiedText(true);
		setTimeout(() => setCopiedText(false), 2000);
	}

	function handleOpenNewTab() {
		const blob = new Blob([renderedHtml], { type: "text/html" });
		const url = URL.createObjectURL(blob);
		window.open(url, "_blank");
	}

	const heightClasses = {
		standard: "min-h-[680px] h-[680px]",
		large: "min-h-[860px] h-[860px]",
		full: "min-h-[1060px] h-[1060px]",
	}[previewHeight];


	return (
		<div className="min-h-[100dvh] bg-background text-foreground flex flex-col selection:bg-primary selection:text-white pb-12">
			{/* Top Brand Bar */}
			<header className="sticky top-0 z-50 border-b-2 border-black bg-card/95 backdrop-blur-md px-4 sm:px-8 py-3.5 shadow-sm">
				<div className="max-w-[1500px] mx-auto flex items-center justify-between gap-4">
					<div className="flex items-center gap-4">
						<Link
							href="/"
							className="inline-flex items-center justify-center h-9 w-9 bg-background border-2 border-black rounded-[var(--radius,7px)] shadow-[2px_2px_0px_#000] hover:shadow-[3px_3px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all text-foreground"
							title="Back to home"
						>
							<ArrowLeft className="w-4 h-4" />
						</Link>
						<div className="flex items-center gap-2 sm:gap-3">
							<Logo className="h-7 sm:h-8 w-auto text-foreground" />
							<span className="hidden sm:inline-block text-xs font-black uppercase tracking-wider bg-warning text-black px-2 py-0.5 border-1.5 border-black rounded-[4px] shadow-[1.5px_1.5px_0px_#000]">
								MAIL LAB
							</span>
						</div>
					</div>

					<div className="flex items-center gap-2">
						<span className="text-xs font-bold text-muted-foreground hidden lg:inline">
							Sender: <code className="text-foreground font-mono bg-muted px-1.5 py-0.5 rounded border border-black/20">&quot;Open Smile&quot; &lt;...&gt;</code>
						</span>
						<Button
							variant="outline"
							size="sm"
							onClick={handleOpenNewTab}
							className="border-2 border-black shadow-[2px_2px_0px_#000] font-bold text-xs h-9 cursor-pointer"
						>
							<ExternalLink className="w-3.5 h-3.5 mr-1.5" />
							Open in New Tab
						</Button>
					</div>
				</div>
			</header>

			{/* Main Workspace */}
			<main className="flex-1 max-w-[1500px] w-full mx-auto p-4 sm:p-6 md:p-8">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
					
					{/* Left Column: Form & Template Controls (5 Cols) */}
					<div className="lg:col-span-5 space-y-6">
						<div className="bg-card border-2 border-black rounded-[var(--radius,7px)] shadow-[var(--brutal-shadow-md)] p-5 sm:p-6 space-y-6">
							
							{/* Section Header */}
							<div className="flex items-center justify-between pb-3 border-b-2 border-black">
								<div className="flex items-center gap-2">
									<div className="p-1.5 bg-primary text-white border-1.5 border-black rounded shadow-[1.5px_1.5px_0px_#000]">
										<Mail className="w-4 h-4" />
									</div>
									<h2 className="font-extrabold text-base uppercase tracking-tight">
										1. Configure & Dispatch
									</h2>
								</div>
								<span className="text-[11px] font-black uppercase tracking-wider bg-accent text-black px-2 py-0.5 border border-black rounded shadow-[1px_1px_0px_#000]">
									SMTP TESTER
								</span>
							</div>

							<form onSubmit={handleSendTest} className="space-y-5">
								{/* Recipient Email Address */}
								<div className="space-y-2">
									<Label htmlFor="email" className="font-bold text-xs uppercase tracking-wider text-foreground">
										Recipient Email Address
									</Label>
									<div className="relative">
										<Input
											id="email"
											type="email"
											placeholder="you@example.com"
											value={email}
											onChange={(e) => setEmail(e.target.value)}
											className="bg-background border-2 border-black rounded-[var(--radius,7px)] shadow-[2px_2px_0px_#000] focus:shadow-[3px_3px_0px_#000] font-mono text-sm pl-9 h-11"
											required
										/>
										<Mail className="w-4 h-4 absolute left-3 top-3.5 text-muted-foreground" />
									</div>
									<div className="flex flex-wrap items-center gap-1.5 pt-0.5">
										<span className="text-[11px] font-bold text-muted-foreground mr-1">Presets:</span>
										<button
											type="button"
											onClick={() => setEmail("test@example.com")}
											className="text-[11px] font-bold px-2 py-0.5 bg-muted border border-black rounded hover:bg-warning transition-colors cursor-pointer"
										>
											test@example.com
										</button>
										<button
											type="button"
											onClick={() => setEmail("user@opensmile.app")}
											className="text-[11px] font-bold px-2 py-0.5 bg-muted border border-black rounded hover:bg-accent transition-colors cursor-pointer"
										>
											user@opensmile.app
										</button>
									</div>
								</div>

								{/* Template Selector */}
								<div className="space-y-2.5">
									<Label className="font-bold text-xs uppercase tracking-wider text-foreground">
										Select Email Template
									</Label>
									<div className="grid grid-cols-1 gap-2">
										{TEMPLATES.map((tmpl) => {
											const Icon = tmpl.icon;
											const isSelected = template === tmpl.id;
											return (
												<button
													key={tmpl.id}
													type="button"
													onClick={() => setTemplate(tmpl.id)}
													className={`w-full text-left p-3 border-2 border-black rounded-[var(--radius,7px)] transition-all flex items-start gap-3 cursor-pointer ${
														isSelected
															? "bg-muted shadow-[3px_3px_0px_#000] -translate-y-0.5 ring-2 ring-primary/50"
															: "bg-card hover:bg-muted/50 shadow-[1.5px_1.5px_0px_#000]"
													}`}
												>
													<div
														className={`p-2 border-1.5 border-black rounded shrink-0 shadow-[1px_1px_0px_#000] ${
															isSelected ? "bg-primary text-white" : "bg-background text-foreground"
														}`}
													>
														<Icon className="w-4 h-4" />
													</div>
													<div className="flex-1 min-w-0">
														<div className="flex items-center justify-between gap-2">
															<span className="font-extrabold text-sm text-foreground">
																{tmpl.label}
															</span>
															<span
																className="text-[10px] font-black uppercase px-1.5 py-0.5 border border-black rounded"
																style={{ backgroundColor: tmpl.badgeBg, color: tmpl.badgeText }}
															>
																{tmpl.badge}
															</span>
														</div>
														<p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
															{tmpl.description}
														</p>
													</div>
												</button>
											);
										})}
									</div>
								</div>

								{/* Dynamic Parameters */}
								{template === "otp" && (
									<div className="space-y-2 p-3.5 bg-background border-2 border-black rounded-[var(--radius,7px)] shadow-[2px_2px_0px_#000]">
										<Label htmlFor="customCode" className="font-bold text-xs uppercase tracking-wider text-foreground">
											Custom OTP Verification Code
										</Label>
										<Input
											id="customCode"
											type="text"
											maxLength={8}
											value={customCode}
											onChange={(e) => setCustomCode(e.target.value)}
											className="bg-card border-2 border-black rounded font-mono font-black text-lg tracking-[6px] text-center h-11"
										/>
									</div>
								)}

								{template === "welcome" && (
									<div className="space-y-2 p-3.5 bg-background border-2 border-black rounded-[var(--radius,7px)] shadow-[2px_2px_0px_#000]">
										<Label htmlFor="userName" className="font-bold text-xs uppercase tracking-wider text-foreground">
											Recipient First Name
										</Label>
										<Input
											id="userName"
											type="text"
											value={name}
											onChange={(e) => setName(e.target.value)}
											placeholder="e.g. Alex"
											className="bg-card border-2 border-black rounded font-semibold text-sm h-11"
										/>
									</div>
								)}

								{/* Submit Button */}
								<Button
									type="submit"
									disabled={loading}
									className="w-full bg-primary hover:bg-primary/90 text-white font-black text-sm uppercase tracking-wider h-12 border-2 border-black rounded-[var(--radius,7px)] shadow-[3px_3px_0px_#000] hover:shadow-[4px_4px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
								>
									{loading ? (
										<>
											<Loader2 className="w-4 h-4 animate-spin mr-2" />
											Sending Test Email...
										</>
									) : (
										<>
											<Send className="w-4 h-4 mr-2" />
											Send Test Email ({TEMPLATES.find((t) => t.id === template)?.label})
										</>
									)}
								</Button>
							</form>

							{/* Feedback Notification */}
							{result && (
								<div
									className={`p-4 border-2 border-black rounded-[var(--radius,7px)] shadow-[3px_3px_0px_#000] flex items-start gap-3 ${
										result.success ? "bg-green-100 text-green-950" : "bg-red-100 text-red-950"
									}`}
								>
									{result.success ? (
										<CheckCircle2 className="w-5 h-5 text-green-700 shrink-0 mt-0.5" />
									) : (
										<AlertTriangle className="w-5 h-5 text-red-700 shrink-0 mt-0.5" />
									)}
									<div className="text-xs space-y-1">
										<p className="font-bold">{result.message}</p>
										{result.deliveryMode === "dev-console" && (
											<p className="text-muted-foreground text-[11px]">
												💡 <em>Note: Running in Development Mode without live Gmail credentials. Output logged to terminal.</em>
											</p>
										)}
									</div>
								</div>
							)}
						</div>
					</div>

					{/* Right Column: Live Interactive Email Preview (7 Cols) */}
					<div className="lg:col-span-7 space-y-4">
						<div className="bg-card border-2 border-black rounded-[var(--radius,7px)] shadow-[var(--brutal-shadow-md)] p-5 sm:p-6 space-y-4">
							
							{/* Header Toolbar */}
							<div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b-2 border-black">
								<div className="flex items-center gap-2">
									<div className="p-1.5 bg-accent text-black border-1.5 border-black rounded shadow-[1.5px_1.5px_0px_#000]">
										<Eye className="w-4 h-4" />
									</div>
									<h2 className="font-extrabold text-base uppercase tracking-tight">
										2. Live Template Inspector
									</h2>
								</div>

								{/* Tabs, Size & Device Controls */}
								<div className="flex items-center flex-wrap gap-2">
									{/* View Mode Tabs */}
									<div className="flex border-2 border-black bg-background rounded p-0.5 shadow-[1.5px_1.5px_0px_#000]">
										<button
											type="button"
											onClick={() => setActiveTab("visual")}
											className={`px-2.5 py-1 text-xs font-extrabold rounded transition-colors cursor-pointer flex items-center gap-1.5 ${
												activeTab === "visual"
													? "bg-black text-white"
													: "bg-transparent text-foreground hover:bg-black/10"
											}`}
										>
											<Eye className="w-3.5 h-3.5" /> Preview
										</button>
										<button
											type="button"
											onClick={() => setActiveTab("text")}
											className={`px-2.5 py-1 text-xs font-extrabold rounded transition-colors cursor-pointer flex items-center gap-1.5 ${
												activeTab === "text"
													? "bg-black text-white"
													: "bg-transparent text-foreground hover:bg-black/10"
											}`}
										>
											<FileText className="w-3.5 h-3.5" /> Plaintext
										</button>
										<button
											type="button"
											onClick={() => setActiveTab("html")}
											className={`px-2.5 py-1 text-xs font-extrabold rounded transition-colors cursor-pointer flex items-center gap-1.5 ${
												activeTab === "html"
													? "bg-black text-white"
													: "bg-transparent text-foreground hover:bg-black/10"
											}`}
										>
											<Code className="w-3.5 h-3.5" /> HTML
										</button>
									</div>

									{/* Height Selector */}
									{activeTab === "visual" && (
										<div className="flex border-2 border-black bg-background rounded p-0.5 shadow-[1.5px_1.5px_0px_#000]">
											<button
												type="button"
												onClick={() => setPreviewHeight("standard")}
												className={`px-2 py-1 text-[11px] font-extrabold rounded transition-colors cursor-pointer ${
													previewHeight === "standard" ? "bg-black text-white" : "text-foreground hover:bg-black/10"
												}`}
												title="Compact view (680px)"
											>
												680px
											</button>
											<button
												type="button"
												onClick={() => setPreviewHeight("large")}
												className={`px-2 py-1 text-[11px] font-extrabold rounded transition-colors cursor-pointer ${
													previewHeight === "large" ? "bg-black text-white" : "text-foreground hover:bg-black/10"
												}`}
												title="Expanded view (860px)"
											>
												860px
											</button>
											<button
												type="button"
												onClick={() => setPreviewHeight("full")}
												className={`px-2 py-1 text-[11px] font-extrabold rounded transition-colors cursor-pointer ${
													previewHeight === "full" ? "bg-black text-white" : "text-foreground hover:bg-black/10"
												}`}
												title="Full height view (1060px)"
											>
												Full
											</button>
										</div>
									)}

									{/* Device Switcher */}
									{activeTab === "visual" && (
										<div className="flex border-2 border-black bg-background rounded p-0.5 shadow-[1.5px_1.5px_0px_#000]">
											<button
												type="button"
												onClick={() => setPreviewDevice("desktop")}
												className={`p-1.5 rounded transition-colors cursor-pointer ${
													previewDevice === "desktop"
														? "bg-primary text-white"
														: "text-foreground hover:bg-black/10"
												}`}
												title="Desktop viewport (580px)"
											>
												<Monitor className="w-3.5 h-3.5" />
											</button>
											<button
												type="button"
												onClick={() => setPreviewDevice("mobile")}
												className={`p-1.5 rounded transition-colors cursor-pointer ${
													previewDevice === "mobile"
														? "bg-primary text-white"
														: "text-foreground hover:bg-black/10"
												}`}
												title="Mobile viewport (375px)"
											>
												<Smartphone className="w-3.5 h-3.5" />
											</button>
										</div>
									)}

									{/* Copy Button */}
									<button
										type="button"
										onClick={activeTab === "text" ? handleCopyText : handleCopyHtml}
										className="h-8 px-2.5 flex items-center gap-1.5 text-xs font-bold bg-background border-2 border-black rounded shadow-[1.5px_1.5px_0px_#000] hover:bg-muted transition-colors cursor-pointer"
										title="Copy content to clipboard"
									>
										{(activeTab === "text" ? copiedText : copiedHtml) ? (
											<>
												<Check className="w-3.5 h-3.5 text-green-600" /> Copied
											</>
										) : (
											<>
												<Copy className="w-3.5 h-3.5" /> Copy {activeTab === "text" ? "Text" : "HTML"}
											</>
										)}
									</button>
								</div>
							</div>

							{/* Preview Body with Increased Size */}
							{activeTab === "visual" && (
								<div className={`bg-[#e9e6df] border-2 border-black rounded-[var(--radius,7px)] p-2 sm:p-6 ${heightClasses} flex items-start justify-center overflow-auto shadow-inner transition-all duration-300`}>
									<div
										className={`bg-white border-2 border-black rounded-[var(--radius,7px)] shadow-[4px_4px_0px_#000] transition-all duration-300 overflow-hidden w-full ${
											previewDevice === "mobile"
												? "max-w-[390px] h-full"
												: "max-w-[640px] h-full"
										}`}
									>
										{/* Instant synchronous srcDoc rendering */}
										<iframe
											srcDoc={renderedHtml}
											title="Open Smile Live Email Preview"
											className="w-full h-full border-0 bg-[#faf8f5]"
											sandbox="allow-same-origin allow-popups"
										/>
									</div>
								</div>
							)}

							{activeTab === "text" && (
								<div className={`border-2 border-black rounded-[var(--radius,7px)] bg-muted/40 p-4 ${heightClasses} font-mono text-xs text-foreground overflow-auto whitespace-pre-wrap leading-relaxed shadow-inner`}>
									{renderedPlainText}
								</div>
							)}

							{activeTab === "html" && (
								<div className={`border-2 border-black rounded-[var(--radius,7px)] bg-[#1e1e1e] p-4 ${heightClasses} font-mono text-xs text-emerald-400 overflow-auto whitespace-pre-wrap leading-relaxed shadow-inner select-all`}>
									{renderedHtml}
								</div>
							)}

							{/* Meta Footer */}
							<div className="flex flex-wrap items-center justify-between text-xs text-muted-foreground pt-1 gap-2">
								<span className="flex items-center gap-1.5">
									<span className="w-2 h-2 rounded-full bg-green-500 inline-block animate-pulse" />
									Live instant sync with <code>globals.css</code> Neubrutalism tokens
								</span>
								<span className="font-mono text-[11px] font-semibold text-foreground">
									Preview Height: {previewHeight.toUpperCase()} • 4px Shadow
								</span>
							</div>

						</div>
					</div>

				</div>
			</main>
		</div>
	);
}
