'use client';

import * as React from 'react';
import {
	Sparkles,
	Bot,
	KeyRound,
	Globe,
	Check,
	RotateCw,
	Eye,
	EyeOff,
	Activity,
	CheckCircle2,
	XCircle,
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
		<div className="border-[length:var(--border-width)] border-black rounded-xl bg-card p-3 sm:p-4 shadow-brutal space-y-3">
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b-[length:var(--border-width)] border-black/15 pb-2.5">
				<div className="flex items-center gap-2.5 min-w-0">
					<div className="size-8 rounded-lg border-[length:var(--border-width)] border-black bg-accent text-accent-foreground flex items-center justify-center shadow-brutal-xs shrink-0">
						<Sparkles className="size-4" />
					</div>
					<div className="min-w-0">
						<div className="flex items-center gap-2">
							<h2 className="font-title font-black text-sm sm:text-base text-foreground truncate">
								AI Engine & Model Gateway
							</h2>
							<span className={cn(
								"font-mono text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded border border-black shadow-brutal-xs",
								enabled ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
							)}>
								{enabled ? "ACTIVE" : "STANDBY"}
							</span>
						</div>
						<p className="font-mono text-[11px] text-muted-foreground truncate">
							Configure OpenAI, Groq, OpenRouter, Google Gemini, Ollama, or custom endpoint
						</p>
					</div>
				</div>

				<div className="flex items-center gap-2 self-start sm:self-auto bg-muted/20 border border-black/20 px-2 py-1 rounded-lg">
					<Label htmlFor="ai-master-toggle" className="font-mono text-[11px] font-bold uppercase tracking-wider cursor-pointer">
						AI Services
					</Label>
					<Switch
						id="ai-master-toggle"
						checked={enabled}
						onCheckedChange={setEnabled}
						className="scale-90"
					/>
				</div>
			</div>

			<div className="space-y-1.5">
				<div className="flex items-center justify-between gap-2">
					<Label className="font-mono text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5">
						<Bot className="size-3 text-primary" />
						<span>Provider / Protocol</span>
					</Label>
					<span className="font-mono text-[10px] text-muted-foreground truncate hidden sm:inline">
						{activePreset.description}
					</span>
				</div>

				<div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-1.5">
					{(Object.keys(AI_PROVIDER_PRESETS) as AIProvider[]).map((key) => {
						const preset = AI_PROVIDER_PRESETS[key];
						const isSelected = provider === key;
						return (
							<button
								key={key}
								type="button"
								onClick={() => handleProviderChange(key)}
								className={cn(
									'border rounded-md px-2 py-1.5 font-mono text-left transition-all active:scale-[0.96] flex flex-col justify-between cursor-pointer',
									isSelected
										? 'border-black bg-accent text-black shadow-brutal-xs font-black'
										: 'border-black/20 bg-background text-foreground/85 hover:border-black hover:bg-muted/40',
								)}
							>
								<div className="text-[10px] font-black uppercase truncate leading-tight">
									{preset.name.replace(' (OpenAI-Compatible)', '').replace(' (Local AI)', '')}
								</div>
								<div className="text-[8px] text-muted-foreground truncate leading-none mt-0.5">
									{preset.defaultModel.split('/').pop()}
								</div>
							</button>
						);
					})}
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
				<div className="lg:col-span-8 space-y-2.5">
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
						<div className="space-y-1">
							<div className="flex items-center justify-between">
								<Label className="font-mono text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
									<Globe className="size-3 text-muted-foreground" />
									<span>Base URL</span>
								</Label>
								<span className="font-mono text-[9px] text-muted-foreground truncate">
									append /chat/completions
								</span>
							</div>
							<Input
								value={baseUrl}
								onChange={(e) => setBaseUrl(e.target.value)}
								placeholder="https://api.openai.com/v1"
								className="border-[length:var(--border-width)] border-black font-mono text-xs bg-background h-8 rounded-md"
							/>
						</div>

						<div className="space-y-1">
							<div className="flex items-center justify-between">
								<Label className="font-mono text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
									<KeyRound className="size-3 text-muted-foreground" />
									<span>API Key / Secret</span>
								</Label>
								<span className="font-mono text-[9px] text-muted-foreground truncate">
									{apiKey ? 'Custom key set' : 'Falls back to .env'}
								</span>
							</div>
							<div className="relative">
								<Input
									type={showApiKey ? 'text' : 'password'}
									value={apiKey}
									onChange={(e) => setApiKey(e.target.value)}
									placeholder={activePreset.placeholderKey}
									className="border-[length:var(--border-width)] border-black font-mono text-xs bg-background pr-8 h-8 rounded-md"
								/>
								<button
									type="button"
									onClick={() => setShowApiKey(!showApiKey)}
									className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-black cursor-pointer"
								>
									{showApiKey ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
								</button>
							</div>
						</div>
					</div>

					<div className="space-y-1">
						<div className="flex items-center justify-between">
							<Label className="font-mono text-[10px] font-black uppercase tracking-wider">
								Model Identifier
							</Label>
							<div className="flex items-center gap-1 overflow-x-auto scrollbar-none max-w-[60%]">
								{modelSuggestions.map((m) => (
									<button
										key={m}
										type="button"
										onClick={() => setModel(m)}
										className={cn(
											'border border-black rounded px-1.5 py-0.5 font-mono text-[9px] font-bold cursor-pointer transition-all shrink-0 active:scale-[0.96]',
											model === m ? 'bg-primary text-primary-foreground shadow-brutal-xs' : 'bg-muted/30 hover:bg-muted text-foreground',
										)}
									>
										{m.split('/').pop()}
									</button>
								))}
							</div>
						</div>
						<Input
							value={model}
							onChange={(e) => setModel(e.target.value)}
							placeholder="e.g. gpt-4o-mini or gemini-2.5-flash"
							className="border-[length:var(--border-width)] border-black font-mono text-xs bg-background h-8 rounded-md"
						/>
					</div>

					<div className="space-y-1">
						<div className="flex items-center justify-between">
							<Label className="font-mono text-[10px] font-black uppercase tracking-wider">
								System Brand Persona & Prompt
							</Label>
							<span className="font-mono text-[9px] text-muted-foreground">
								Guides copy tone & notification voice
							</span>
						</div>
						<textarea
							value={systemPersona}
							onChange={(e) => setSystemPersona(e.target.value)}
							rows={2}
							className="w-full border-[length:var(--border-width)] border-black rounded-md p-2 font-mono text-xs bg-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-black resize-y min-h-[48px] leading-relaxed"
							placeholder="Define the brand persona, tone of voice, and guidelines for AI generated copy..."
						/>
					</div>

					<div className="border border-black/20 p-2.5 rounded-lg bg-muted/15 grid grid-cols-1 sm:grid-cols-2 gap-3">
						<div className="space-y-1">
							<div className="flex items-center justify-between font-mono text-[10px]">
								<span className="font-black uppercase text-foreground">Temperature</span>
								<span className="font-black tabular-nums">{temperature}</span>
							</div>
							<input
								type="range"
								min={0.0}
								max={1.0}
								step={0.05}
								value={temperature}
								onChange={(e) => setTemperature(parseFloat(e.target.value))}
								className="w-full h-2 cursor-pointer accent-black"
							/>
							<div className="flex justify-between text-[8px] font-mono text-muted-foreground leading-none">
								<span>Precise (0.0)</span>
								<span>Creative (1.0)</span>
							</div>
						</div>

						<div className="space-y-1">
							<div className="flex items-center justify-between font-mono text-[10px]">
								<span className="font-black uppercase text-foreground">Max Tokens</span>
								<span className="font-black tabular-nums">{maxTokens}</span>
							</div>
							<input
								type="range"
								min={200}
								max={2500}
								step={50}
								value={maxTokens}
								onChange={(e) => setMaxTokens(parseInt(e.target.value, 10))}
								className="w-full h-2 cursor-pointer accent-black"
							/>
							<div className="flex justify-between text-[8px] font-mono text-muted-foreground leading-none">
								<span>Compact (200)</span>
								<span>Long (2500)</span>
							</div>
						</div>
					</div>
				</div>

				<div className="lg:col-span-4 flex flex-col gap-2">
					<div className="border-[length:var(--border-width)] border-black rounded-lg p-2.5 bg-muted/20 space-y-2 shadow-brutal-xs flex-1 flex flex-col justify-between">
						<div className="space-y-2">
							<div className="flex items-center justify-between border-b border-black/15 pb-1.5">
								<div className="flex items-center gap-1.5 font-mono text-[11px] font-black uppercase tracking-wider">
									<Activity className="size-3 text-primary" />
									<span>Diagnostics & Actions</span>
								</div>
								{testResult && (
									<span className="font-mono text-[9px] font-bold tabular-nums">
										{testResult.latencyMs}ms
									</span>
								)}
							</div>

							<div className="grid grid-cols-2 gap-2">
								<Button
									type="button"
									onClick={handleSave}
									disabled={isSaving}
									className="h-8 border-[length:var(--border-width)] border-black bg-accent text-black hover:bg-accent/90 font-mono text-xs font-black uppercase tracking-wider shadow-brutal-xs brutal-lift active:scale-[0.96] flex items-center justify-center gap-1"
								>
									{isSaving ? (
										<RotateCw className="size-3 animate-spin text-black" />
									) : (
										<Check className="size-3" />
									)}
									<span>Save</span>
								</Button>

								<Button
									type="button"
									onClick={handleTestConnection}
									disabled={isTesting}
									variant="outline"
									className="h-8 border-[length:var(--border-width)] border-black bg-card hover:bg-muted font-mono text-xs font-bold uppercase shadow-brutal-xs brutal-lift active:scale-[0.96] flex items-center justify-center gap-1"
								>
									{isTesting ? (
										<RotateCw className="size-3 animate-spin text-primary" />
									) : (
										<Zap className="size-3 text-primary" />
									)}
									<span>Test</span>
								</Button>
							</div>

							{testResult ? (
								<div
									className={cn(
										'border border-black rounded-md p-2 text-xs font-mono space-y-1 shadow-brutal-xs',
										testResult.healthy ? 'bg-emerald-500/10 border-emerald-600' : 'bg-destructive/10 border-destructive',
									)}
								>
									<div className="flex items-center justify-between font-black uppercase text-[10px]">
										<span className="flex items-center gap-1">
											{testResult.healthy ? (
												<CheckCircle2 className="size-3 text-emerald-600" />
											) : (
												<XCircle className="size-3 text-destructive" />
											)}
											<span>{testResult.healthy ? 'Connected' : 'Failed'}</span>
										</span>
										<span className="tabular-nums text-[9px]">{testResult.model}</span>
									</div>

									{testResult.healthy && testResult.sampleResponse && (
										<div className="text-[10px] bg-background/80 p-1.5 rounded border border-black/10 text-foreground line-clamp-3 leading-snug">
											"{testResult.sampleResponse}"
										</div>
									)}

									{!testResult.healthy && testResult.error && (
										<div className="text-[10px] text-destructive break-words line-clamp-3">
											{testResult.error}
										</div>
									)}
								</div>
							) : (
								<div className="border border-dashed border-black/25 rounded-md p-2 text-center text-muted-foreground font-mono text-[10px]">
									Click "Test" to verify credentials and response latency.
								</div>
							)}
						</div>

						<div className="border border-black/15 rounded-md p-2 bg-background text-[10px] font-mono space-y-1">
							<div className="font-bold uppercase tracking-wider flex items-center gap-1 text-foreground">
								<HelpCircle className="size-3 text-accent-foreground" />
								<span>Provider Cheatsheet</span>
							</div>
							<ul className="space-y-0.5 text-muted-foreground text-[9px] leading-tight">
								<li>• <strong>Groq:</strong> Ultra-fast Llama 3.3 inference</li>
								<li>• <strong>Gemini:</strong> OpenAI protocol + Gemini key</li>
								<li>• <strong>Ollama:</strong> Localhost:11434 (no key needed)</li>
								<li>• <strong>Custom:</strong> Any OpenAI-compatible proxy</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
