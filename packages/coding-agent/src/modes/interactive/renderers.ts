import type { AssistantMessage } from "@earendil-works/pi-ai/compat";
import type { Component, MarkdownTheme, TUI } from "@earendil-works/pi-tui";
import type { MarkdownTransformer } from "../../core/extensions/types.ts";
import type { ToolExecutionComponent } from "./components/tool-execution.ts";

export interface AssistantMessageRenderer extends Component {
	updateContent(message: AssistantMessage, isStreaming?: boolean): void;
	setHideThinkingBlock(hide: boolean): void;
	setHiddenThinkingLabel(label: string): void;
	setOutputPad(padding: number): void;
}

export interface ToolExecutionRenderer extends Component {
	updateArgs(args: unknown): void;
	markExecutionStarted(): void;
	setArgsComplete(): void;
	updateResult(result: Parameters<ToolExecutionComponent["updateResult"]>[0], isPartial?: boolean): void;
	setExpanded(expanded: boolean): void;
	setShowImages(show: boolean): void;
	setImageWidthCells(width: number): void;
}

export interface MainAreaRendererSelection {
	readonly simple: boolean;
	createAssistant(message?: AssistantMessage): AssistantMessageRenderer;
	createTool(toolName: string, toolCallId: string, args: unknown): ToolExecutionRenderer;
}

export interface MainAreaRendererOptions {
	ui: TUI;
	cwd: string;
	markdownTheme: MarkdownTheme;
	hideThinkingBlock: boolean;
	hiddenThinkingLabel: string;
	outputPad: number;
	markdownTransformers: readonly MarkdownTransformer[];
	showImages: boolean;
	imageWidthCells: number;
	getToolDefinition: (toolName: string) => ConstructorParameters<typeof ToolExecutionComponent>[4];
}

export type MainAreaRendererFactory = (simple: boolean) => MainAreaRendererSelection;
export { createMainAreaRenderer } from "./components/simple-main-area.ts";
