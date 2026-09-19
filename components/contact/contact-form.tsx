"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Send,
	CheckCircle2,
	AlertCircle,
	Loader2,
	Sparkles,
	Mail,
	User,
	MessageSquare,
	Tag,
} from "lucide-react";

const SUBJECT_PRESETS = [
	"General Inquiry",
	"Feature Feedback",
	"Reward / Voucher Claim",
	"Bug or Anti-Cheat Report",
	"Partnership & Press",
	"Other",
];

export function ContactForm() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [selectedPreset, setSelectedPreset] = useState(SUBJECT_PRESETS[0]);
	const [customSubject, setCustomSubject] = useState("");
	const [message, setMessage] = useState("");
	const [honeypot, setHoneypot] = useState("");

	const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
	const [errorMessage, setErrorMessage] = useState("");

	const finalSubject =
		selectedPreset === "Other"
			? customSubject.trim() || "Other Inquiry"
			: customSubject.trim()
				? `${selectedPreset}: ${customSubject.trim()}`
				: selectedPreset;

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (honeypot) return;

		if (!name.trim() || name.trim().length < 2) {
			setStatus("error");
			setErrorMessage("Please enter your name (at least 2 characters).");
			return;
		}

		if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
			setStatus("error");
			setErrorMessage("Please enter a valid email address so we can reply.");
			return;
		}

		if (!message.trim() || message.trim().length < 5) {
			setStatus("error");
			setErrorMessage("Please write a message (at least 5 characters).");
			return;
		}

		setStatus("loading");
		setErrorMessage("");

		try {
			const res = await fetch("/api/contact", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					name: name.trim(),
					email: email.trim(),
					subject: finalSubject,
					message: message.trim(),
				}),
			});

			const data = await res.json();

			if (!res.ok) {
				throw new Error(data.error || "Failed to deliver message. Please try again.");
			}

			setStatus("success");
		} catch (err) {
			setStatus("error");
			setErrorMessage(
				err instanceof Error ? err.message : "Something went wrong. Please try again.",
			);
		}
	};

	const handleReset = () => {
		setName("");
		setEmail("");
		setSelectedPreset(SUBJECT_PRESETS[0]);
		setCustomSubject("");
		setMessage("");
		setErrorMessage("");
		setStatus("idle");
	};

	if (status === "success") {
		return (
			<div className="border-(length:--border-width) border-black rounded-2xl bg-card p-6 sm:p-10 shadow-brutal-lg text-center dark:border-white">
				<div className="flex flex-col items-center">
					<div className="mb-4 flex size-14 items-center justify-center border-[length:var(--border-width)] border-black rounded-full bg-success text-success-foreground shadow-brutal-xs dark:border-white">
						<CheckCircle2 className="size-8 stroke-[2.5]" />
					</div>

					<div className="mb-3 inline-flex items-center gap-1.5 border-[length:var(--border-width)] border-black rounded-md bg-[#181829] px-3.5 py-1 text-xs font-mono font-bold uppercase tracking-wider text-accent shadow-brutal-xs dark:border-white">
						<Sparkles className="size-3 text-accent" />
						<span>Message Dispatched</span>
					</div>

					<h3 className="font-heading text-2xl sm:text-3xl font-black text-foreground uppercase tracking-tight">
						We Got Your Message!
					</h3>

					<p className="mx-auto mt-3 max-w-md text-sm sm:text-base font-semibold text-muted-foreground leading-relaxed text-pretty">
						Thanks, <strong className="text-foreground">{name}</strong>! Your inquiry has been received. Our team will review it and reply to <span className="text-foreground font-bold underline decoration-primary/40 underline-offset-4">{email}</span> within 24 hours.
					</p>

					<div className="mt-8 flex justify-center">
						<Button
							type="button"
							variant="outline"
							size="lg"
							onClick={handleReset}
							className="border-black font-bold uppercase shadow-brutal-sm dark:border-white hover:bg-muted"
						>
							Send Another Message
						</Button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="border-[length:var(--border-width)] border-black rounded-2xl bg-card p-6 sm:p-8 lg:p-10 shadow-brutal-lg dark:border-white">
			<div className="mb-8 flex items-center justify-between border-b-[length:var(--border-width)] border-border pb-5">
				<div>
					<h2 className="font-heading text-xl sm:text-2xl font-black text-foreground uppercase tracking-tight">
						Send A Message
					</h2>
					<p className="text-xs sm:text-sm font-semibold text-muted-foreground mt-0.5">
						Delivered directly to our engineering &amp; support team.
					</p>
				</div>
				<div className="hidden sm:inline-flex items-center gap-1.5 border-[length:var(--border-width)] border-black rounded-md bg-[#181829] px-3 py-1 text-xs font-mono font-bold uppercase tracking-wider text-accent shadow-brutal-xs dark:border-white">
					<Mail className="size-3.5" />
					<span>Quick Dispatch</span>
				</div>
			</div>

			{status === "error" && errorMessage && (
				<div
					role="alert"
					className="mb-6 flex items-start gap-3 border-[length:var(--border-width)] border-destructive rounded-lg bg-destructive/10 p-4 text-destructive shadow-brutal-xs"
				>
					<AlertCircle className="size-5 shrink-0 mt-0.5" />
					<div className="text-sm font-bold leading-snug">{errorMessage}</div>
				</div>
			)}

			<form onSubmit={handleSubmit} className="space-y-5" noValidate>
				{/* Honeypot */}
				<input
					type="text"
					name="website_company_extra"
					value={honeypot}
					onChange={(e) => setHoneypot(e.target.value)}
					className="sr-only"
					tabIndex={-1}
					autoComplete="off"
				/>

				<div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
					{/* Name */}
					<div className="flex flex-col gap-1.5">
						<label htmlFor="contact-name" className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-foreground">
							<User className="size-3.5 text-primary" />
							<span>Your Name <span className="text-destructive">*</span></span>
						</label>
						<Input
							id="contact-name"
							type="text"
							required
							placeholder="e.g. Alex Chen"
							value={name}
							onChange={(e) => setName(e.target.value)}
							disabled={status === "loading"}
							className="border-black text-sm font-semibold rounded-lg shadow-brutal-xs focus-visible:outline-primary dark:border-white"
						/>
					</div>

					{/* Email */}
					<div className="flex flex-col gap-1.5">
						<label htmlFor="contact-email" className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-foreground">
							<Mail className="size-3.5 text-secondary" />
							<span>Your Email <span className="text-destructive">*</span></span>
						</label>
						<Input
							id="contact-email"
							type="email"
							required
							placeholder="alex@example.com"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							disabled={status === "loading"}
							className="border-black text-sm font-semibold rounded-lg shadow-brutal-xs focus-visible:outline-secondary dark:border-white"
						/>
					</div>
				</div>

				{/* Subject Category Dropdown */}
				<div className="flex flex-col gap-1.5">
					<label htmlFor="contact-category" className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-foreground">
						<Tag className="size-3.5 text-accent-foreground" />
						<span>Topic Category</span>
					</label>
					<Select
						value={selectedPreset}
						onValueChange={(value) => setSelectedPreset(value)}
						disabled={status === "loading"}
					>
						<SelectTrigger
							id="contact-category"
							className="border-black text-sm font-semibold rounded-lg shadow-brutal-xs focus-visible:outline-secondary dark:border-white"
						>
							<SelectValue placeholder="Select topic category" />
						</SelectTrigger>
						<SelectContent>
							{SUBJECT_PRESETS.map((preset) => (
								<SelectItem
									key={preset}
									value={preset}
									className="text-sm font-semibold cursor-pointer"
								>
									{preset}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				{/* Custom Subject Specifics */}
				<div className="flex flex-col gap-1.5">
					<label htmlFor="contact-subject" className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
						Specific Subject / Headline
					</label>
					<Input
						id="contact-subject"
						type="text"
						placeholder={`e.g. Question about ${selectedPreset}`}
						value={customSubject}
						onChange={(e) => setCustomSubject(e.target.value)}
						disabled={status === "loading"}
						className="border-black text-sm font-semibold rounded-lg shadow-brutal-xs focus-visible:outline-primary dark:border-white"
					/>
				</div>

				{/* Message */}
				<div className="flex flex-col gap-1.5">
					<div className="flex items-center justify-between">
						<label htmlFor="contact-message" className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-foreground">
							<MessageSquare className="size-3.5 text-warning" />
							<span>Message <span className="text-destructive">*</span></span>
						</label>
						<span className={`text-[11px] font-mono font-semibold ${message.length > 2800 ? "text-destructive" : "text-muted-foreground"}`}>
							{message.length} / 3000
						</span>
					</div>
					<Textarea
						id="contact-message"
						required
						rows={5}
						placeholder="How can we help you today? Please include any relevant details..."
						value={message}
						maxLength={3000}
						onChange={(e) => setMessage(e.target.value)}
						disabled={status === "loading"}
						className="border-black text-sm font-semibold rounded-lg shadow-brutal-xs focus-visible:outline-primary dark:border-white min-h-[140px] resize-y"
					/>
				</div>

				{/* Submit Button */}
				<div className="pt-2">
					<Button
						type="submit"
						size="lg"
						disabled={status === "loading"}
						className="w-full border-black font-heading text-base font-black tracking-wider uppercase shadow-brutal-md hover:shadow-brutal-lg transition-all active:scale-[0.99] dark:border-white"
					>
						{status === "loading" ? (
							<>
								<Loader2 className="mr-2 size-4 animate-spin" />
								Sending Message...
							</>
						) : (
							<>
								<Send className="mr-2 size-4" />
								Send Message Now
							</>
						)}
					</Button>
				</div>
			</form>
		</div>
	);
}
