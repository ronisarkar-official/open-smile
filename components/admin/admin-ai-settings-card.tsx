'use client';

import * as React from 'react';
import {
	Sparkles,
	Bot,
	KeyRound,
	Globe,
	Sliders,
	Check,
	RotateCw,
	Eye,
	EyeOff,
	Activity,
	CheckCircle2,
	XCircle,
	ExternalLink,
	Zap,
	HelpCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import {
	AIConfig,
	AIProvider,
	AI_PROVIDER_PRESETS,
	DEFAULT_AI_CONFIG,
	AITestResult,
} from '@/lib/ai/types';

interface AdminAiSettingsCardProps {
	currentSettings?: Record<string, any>;
	onSettingsUpdated?: () => void;
}

const POPULAR_MODELS: Record<AIProvider, string[]> = {
	custom: ['gpt-4o-mini', 'llama-3.3-70b', 'deepseek-chat', 'custom-model'],
	groq: ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'mixtral-8x7b-32768'],
	openrouter: ['openai/gpt-4o-mini', 'anthropic/claude-3.5-sonnet', 'deepseek/deepseek-chat', 'meta-llama/llama-3.3-70b-instruct'],
	openai: ['gpt-4o-mini', 'gpt-4o', 'gpt-3.5-turbo'],
	gemini: ['gemini-2.5-flash', 'gemini-flash-latest', 'gemini-2.5-pro'],
	deepseek: ['deepseek-chat', 'deepseek-reasoner'],
	mistral: ['mistral-small-latest', 'mistral-large-latest'],
	ollama: ['llama3', 'mistral', 'qwen2.5', 'phi3'],
};

export function AdminAiSettingsCard({
	currentSettings,
	onSettingsUpdated,
}: AdminAiSettingsCardProps) {
	const { toast } = useToast();

	const storedConfig = (currentSettings?.ai_config?.value || {}) as Partial<AIConfig>;

	const [enabled, setEnabled] = React.useState<boolean>(
		storedConfig.enabled !== undefined ? storedConfig.enabled : DEFAULT_AI_CONFIG.enabled,
	);
	const [provider, setProvider] = React.useState<AIProvider>(
		storedConfig.provider || DEFAULT_AI_CONFIG.provider,
	);
	const [baseUrl, setBaseUrl] = React.useState<string>(
		storedConfig.baseUrl || DEFAULT_AI_CONFIG.baseUrl,
	);
	const [apiKey, setApiKey] = React.useState<string>(storedConfig.apiKey || '');
	const [model, setModel] = React.useState<string>(
		storedConfig.model || DEFAULT_AI_CONFIG.model,
	);
	const [temperature, setTemperature] = React.useState<number>(
		typeof storedConfig.temperature === 'number' ? storedConfig.temperature : DEFAULT_AI_CONFIG.temperature,
	);
	const [maxTokens, setMaxTokens] = React.useState<number>(
		typeof storedConfig.maxTokens === 'number' ? storedConfig.maxTokens : DEFAULT_AI_CONFIG.maxTokens,
	);
	const [systemPersona, setSystemPersona] = React.useState<string>(
		storedConfig.systemPersona || DEFAULT_AI_CONFIG.systemPersona,
	);

	const [showApiKey, setShowApiKey] = React.useState(false);
	const [isTesting, setIsTesting] = React.useState(false);
	const [isSaving, setIsSaving] = React.useState(false);
	const [testResult, setTestResult] = React.useState<AITestResult | null>(null);

	React.useEffect(() => {
		if (currentSettings?.ai_config?.value) {
			const c = currentSettings.ai_config.value as Partial<AIConfig>;
			if (c.enabled !== undefined) setEnabled(c.enabled);
			if (c.provider) setProvider(c.provider);
			if (c.baseUrl) setBaseUrl(c.baseUrl);
			if (c.apiKey !== undefined) setApiKey(c.apiKey);
			if (c.model) setModel(c.model);
			if (typeof c.temperature === 'number') setTemperature(c.temperature);
			if (typeof c.maxTokens === 'number') setMaxTokens(c.maxTokens);
			if (c.systemPersona) setSystemPersona(c.systemPersona);
		}
	}, [currentSettings]);

	const handleProviderChange = (newProvider: AIProvider) => {
		setProvider(newProvider);
		const preset = AI_PROVIDER_PRESETS[newProvider];
		if (preset) {
			setBaseUrl(preset.defaultBaseUrl);
			setModel(preset.defaultModel);
		}
		setTestResult(null);
	};

	const handleTestConnection = async () => {
		setIsTesting(true);
		setTestResult(null);

		try {
			const res = await fetch('/api/admin/ai/test', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					enabled,
					provider,
					baseUrl,
					apiKey,
					model,
					temperature,
					maxTokens,
					systemPersona,
				}),
			});

			const data = (await res.json()) as AITestResult;
			setTestResult(data);

			if (data.healthy) {
				toast({
					title: 'AI Connection Healthy! ✅',
					description: `Connected to ${data.model} via ${data.provider} in ${data.latencyMs}ms.`,
					variant: 'success',
				});
			} else {
				toast({
					title: 'AI Connection Failed ⚠️',
					description: data.error || 'Provider rejected request.',
					variant: 'error',
				});
			}
		} catch (err: any) {
			setTestResult({
				healthy: false,
				latencyMs: 0,
				provider,
				model,
				error: err?.message || 'Connection test encountered network error.',
			});
			toast({
				title: 'Test Error',
				description: err?.message || 'Could not test connection',
				variant: 'error',
			});
		} finally {
			setIsTesting(false);
		}
	};

	const handleSave = async () => {
		setIsSaving(true);
		try {
			const payload: AIConfig = {
				enabled,
				provider,
				baseUrl: baseUrl.trim(),
				apiKey: apiKey.trim(),
				model: model.trim(),
				temperature: Number(temperature),
				maxTokens: Number(maxTokens),
				systemPersona: systemPersona.trim(),
			};

			const res = await fetch('/api/admin/settings', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					key: 'ai_config',
					value: payload,
					description: 'Global AI Provider, Custom API endpoints, and model configurations',
				}),
			});

			const json = await res.json();
			if (!res.ok) throw new Error(json.error || 'Failed to save AI configuration');

			toast({
				title: 'AI Settings Saved! 🚀',
				description: 'Active model and provider endpoints updated successfully.',
				variant: 'success',
			});

			if (onSettingsUpdated) {
				onSettingsUpdated();
			}
		} catch (err: any) {
			toast({
				title: 'Save Failed',
				description: err?.message || 'Could not update AI settings',
				variant: 'error',
			});
		} finally {
			setIsSaving(false);
		}
	};

	const activePreset = AI_PROVIDER_PRESETS[provider] || AI_PROVIDER_PRESETS.custom;
	const modelSuggestions = POPULAR_MODELS[provider] || POPULAR_MODELS.custom;

	return (
		<div className="border-[length:var(--border-width)] border-black rounded-xl bg-card p-4 sm:p-6 shadow-brutal space-y-6">
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-[length:var(--border-width)] border-black/15 pb-4">
				<div className="flex items-center gap-3">
					<div className="size-10 rounded-lg border-[length:var(--border-width)] border-black bg-accent text-accent-foreground flex items-center justify-center shadow-brutal-xs">
						<Sparkles className="size-5" />
					</div>
					<div>
						<div className="flex items-center gap-2">
							<h2 className="font-title font-black text-lg sm:text-xl text-foreground">
								AI Engine & Custom Provider Settings
							</h2>
							<span className="font-mono text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded border border-black bg-primary text-primary-foreground shadow-brutal-xs">
								Live
							</span>
						</div>
						<p className="font-mono text-xs text-muted-foreground mt-0.5">
							Configure OpenAI, Groq, OpenRouter, Google Gemini, Ollama, or any custom LLM endpoint
						</p>
					</div>
				</div>

				<div className="flex items-center gap-3 bg-muted/30 border border-black/20 p-2 rounded-lg">
					<Label htmlFor="ai-master-toggle" className="font-mono text-xs font-bold uppercase tracking-wider cursor-pointer">
						Enable AI Services
					</Label>
					<Switch
						id="ai-master-toggle"
						checked={enabled}
						onCheckedChange={setEnabled}
					/>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
				<div className="lg:col-span-8 space-y-5">
					<div className="space-y-2">
						<Label className="font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
							<Bot className="size-3.5" />
							<span>Select AI Provider / Protocol</span>
						</Label>
						<div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
							{(Object.keys(AI_PROVIDER_PRESETS) as AIProvider[]).map((key) => {
								const preset = AI_PROVIDER_PRESETS[key];
								const isSelected = provider === key;
								return (
									<button
										key={key}
										type="button"
										onClick={() => handleProviderChange(key)}
										className={cn(
											'border-[length:var(--border-width)] rounded-lg p-2.5 font-mono text-left transition-all cursor-pointer flex flex-col justify-between',
											isSelected
												? 'border-black bg-accent text-black shadow-brutal-xs translate-x-0.5 -translate-y-0.5'
												: 'border-black/20 bg-background text-foreground hover:border-black',
										)}
									>
										<div className="font-black text-xs uppercase truncate">{preset.name}</div>
										<div className="text-[10px] text-muted-foreground truncate mt-0.5">
											{preset.defaultModel}
										</div>
									</button>
								);
							})}
						</div>
						<p className="font-mono text-[11px] text-muted-foreground mt-1">
							{activePreset.description}
						</p>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label className="font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
								<Globe className="size-3.5" />
								<span>API Base URL (Endpoint)</span>
							</Label>
							<Input
								value={baseUrl}
								onChange={(e) => setBaseUrl(e.target.value)}
								placeholder="https://api.openai.com/v1"
								className="border-[length:var(--border-width)] border-black font-mono text-xs bg-background"
							/>
							<span className="font-mono text-[10px] text-muted-foreground block">
								OpenAI-compatible root endpoint (will append /chat/completions)
							</span>
						</div>

						<div className="space-y-2">
							<Label className="font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
								<KeyRound className="size-3.5" />
								<span>API Key / Token</span>
							</Label>
							<div className="relative">
								<Input
									type={showApiKey ? 'text' : 'password'}
									value={apiKey}
									onChange={(e) => setApiKey(e.target.value)}
									placeholder={activePreset.placeholderKey}
									className="border-[length:var(--border-width)] border-black font-mono text-xs bg-background pr-10"
								/>
								<button
									type="button"
									onClick={() => setShowApiKey(!showApiKey)}
									className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-black cursor-pointer"
								>
									{showApiKey ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
								</button>
							</div>
							<span className="font-mono text-[10px] text-muted-foreground block">
								{apiKey ? 'Custom key entered' : 'Leave empty to use GEMINI_API_KEY / OPENAI_API_KEY from .env.local'}
							</span>
						</div>
					</div>

					<div className="space-y-2">
						<Label className="font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-between">
							<span>Model Identifier</span>
							<span className="text-[10px] text-muted-foreground font-normal">Click chip to apply</span>
						</Label>
						<Input
							value={model}
							onChange={(e) => setModel(e.target.value)}
							placeholder="e.g. gpt-4o-mini or llama-3.3-70b-versatile"
							className="border-[length:var(--border-width)] border-black font-mono text-xs bg-background"
						/>
						<div className="flex flex-wrap gap-1.5 pt-1">
							{modelSuggestions.map((m) => (
								<button
									key={m}
									type="button"
									onClick={() => setModel(m)}
									className={cn(
										'border border-black rounded px-2 py-0.5 font-mono text-[10px] font-bold cursor-pointer transition-all',
										model === m ? 'bg-primary text-primary-foreground shadow-brutal-xs' : 'bg-muted/40 hover:bg-muted text-foreground',
									)}
								>
									{m}
								</button>
							))}
						</div>
					</div>

					<div className="space-y-2">
						<Label className="font-mono text-xs font-bold uppercase tracking-wider">
							System Brand Voice & AI Instructions
						</Label>
						<textarea
							value={systemPersona}
							onChange={(e) => setSystemPersona(e.target.value)}
							rows={3}
							className="w-full border-[length:var(--border-width)] border-black rounded-lg p-3 font-mono text-xs bg-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-black resize-none"
							placeholder="Define the brand persona, tone of voice, and guidelines for AI generated copy..."
						/>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div className="space-y-2 border border-black/20 p-3 rounded-lg bg-muted/20">
							<div className="flex items-center justify-between">
								<Label className="font-mono text-xs font-bold uppercase tracking-wider">
									Temperature
								</Label>
								<span className="font-mono text-xs font-black tabular-nums">{temperature}</span>
							</div>
							<input
								type="range"
								min={0.0}
								max={1.0}
								step={0.05}
								value={temperature}
								onChange={(e) => setTemperature(parseFloat(e.target.value))}
								className="w-full cursor-pointer accent-black"
							/>
							<div className="flex justify-between text-[10px] font-mono text-muted-foreground">
								<span>Precise (0.0)</span>
								<span>Creative (1.0)</span>
							</div>
						</div>

						<div className="space-y-2 border border-black/20 p-3 rounded-lg bg-muted/20">
							<div className="flex items-center justify-between">
								<Label className="font-mono text-xs font-bold uppercase tracking-wider">
									Max Token Limit
								</Label>
								<span className="font-mono text-xs font-black tabular-nums">{maxTokens} tokens</span>
							</div>
							<input
								type="range"
								min={200}
								max={2500}
								step={50}
								value={maxTokens}
								onChange={(e) => setMaxTokens(parseInt(e.target.value, 10))}
								className="w-full cursor-pointer accent-black"
							/>
							<div className="flex justify-between text-[10px] font-mono text-muted-foreground">
								<span>Short (200)</span>
								<span>Extended (2500)</span>
							</div>
						</div>
					</div>
				</div>

				<div className="lg:col-span-4 space-y-4">
					<div className="border-[length:var(--border-width)] border-black rounded-xl p-4 bg-muted/30 space-y-3.5 shadow-brutal-xs">
						<div className="flex items-center gap-2 border-b border-black/15 pb-2">
							<Activity className="size-4 text-primary" />
							<h3 className="font-mono text-xs font-black uppercase tracking-wider">
								Provider Diagnostics
							</h3>
						</div>

						<p className="font-sans text-xs text-muted-foreground">
							Perform a zero-impact handshake test with your configured endpoint, API key, and model before saving.
						</p>

						<Button
							type="button"
							onClick={handleTestConnection}
							disabled={isTesting}
							variant="outline"
							className="w-full border-[length:var(--border-width)] border-black bg-card hover:bg-muted font-mono text-xs font-bold uppercase shadow-brutal-xs brutal-lift flex items-center justify-center gap-2 py-2.5"
						>
							{isTesting ? (
								<>
									<RotateCw className="size-3.5 animate-spin text-primary" />
									<span>Pinging Endpoint...</span>
								</>
							) : (
								<>
									<Zap className="size-3.5 text-primary" />
									<span>Test AI Connection</span>
								</>
							)}
						</Button>

						{testResult && (
							<div
								className={cn(
									'border-[length:var(--border-width)] border-black rounded-lg p-3 text-xs font-mono space-y-2 shadow-brutal-xs',
									testResult.healthy ? 'bg-emerald-500/10 border-emerald-600' : 'bg-destructive/10 border-destructive',
								)}
							>
								<div className="flex items-center justify-between font-black uppercase tracking-wider">
									<span className="flex items-center gap-1.5">
										{testResult.healthy ? (
											<CheckCircle2 className="size-4 text-emerald-600" />
										) : (
											<XCircle className="size-4 text-destructive" />
										)}
										<span>{testResult.healthy ? 'Online & Ready' : 'Handshake Failed'}</span>
									</span>
									<span className="tabular-nums text-[10px]">
										{testResult.latencyMs}ms
									</span>
								</div>

								{testResult.healthy && testResult.sampleResponse && (
									<div className="text-[11px] bg-background/80 p-2 rounded border border-black/10 text-foreground">
										<span className="text-muted-foreground block text-[9px] uppercase font-bold">Sample Reply:</span>
										"{testResult.sampleResponse}"
									</div>
								)}

								{!testResult.healthy && testResult.error && (
									<div className="text-[11px] text-destructive break-words">
										{testResult.error}
									</div>
								)}
							</div>
						)}

						<div className="pt-2 border-t border-black/10">
							<Button
								type="button"
								onClick={handleSave}
								disabled={isSaving}
								className="w-full py-3 border-[length:var(--border-width)] border-black bg-accent text-black hover:bg-accent/90 font-mono text-xs font-black uppercase tracking-wider shadow-brutal-xs brutal-lift flex items-center justify-center gap-2"
							>
								{isSaving ? (
									<>
										<RotateCw className="size-4 animate-spin text-black" />
										<span>Saving Engine Config...</span>
									</>
								) : (
									<>
										<Check className="size-4" />
										<span>Save AI Configuration</span>
									</>
								)}
							</Button>
						</div>
					</div>

					<div className="border border-black/20 rounded-xl p-3.5 bg-background text-[11px] font-mono space-y-2">
						<div className="font-bold uppercase tracking-wider flex items-center gap-1.5 text-foreground">
							<HelpCircle className="size-3.5 text-accent-foreground" />
							<span>Setup Cheatsheet</span>
						</div>
						<ul className="list-disc pl-4 space-y-1 text-muted-foreground">
							<li><strong>Any Custom LLM:</strong> Set Base URL to your proxy or local server and choose model.</li>
							<li><strong>Groq:</strong> Fast LPU inference with Llama 3.3.</li>
							<li><strong>Google Gemini:</strong> Uses official OpenAI-compatible endpoint with your Gemini key.</li>
							<li><strong>Ollama:</strong> Runs completely offline on localhost:11434 without an API key.</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}
