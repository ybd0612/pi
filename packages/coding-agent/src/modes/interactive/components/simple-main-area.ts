import type { AssistantMessage } from "@earendil-works/pi-ai/compat";
import { Container, type TUI } from "@earendil-works/pi-tui";
import type {
	AssistantMessageRenderer,
	MainAreaRendererOptions,
	MainAreaRendererSelection,
	ToolExecutionRenderer,
} from "../renderers.ts";
import { AssistantMessageComponent } from "./assistant-message.ts";
import { ToolExecutionComponent, type ToolExecutionOptions } from "./tool-execution.ts";

type ToolResult = Parameters<ToolExecutionComponent["updateResult"]>[0];

class CompactAssistantMessageComponent extends Container implements AssistantMessageRenderer {
	private readonly details: AssistantMessageComponent;

	constructor(_ui: TUI, message: AssistantMessage | undefined, options: MainAreaRendererOptions) {
		super();
		this.details = new AssistantMessageComponent(
			message,
			true,
			options.markdownTheme,
			options.hiddenThinkingLabel,
			options.outputPad,
			options.markdownTransformers,
		);
		if (message) this.updateContent(message, false);
	}

	updateContent(message: AssistantMessage, isStreaming = false): void {
		this.details.updateContent(message, isStreaming);
		if (isStreaming) {
			if (this.children.includes(this.details)) this.removeChild(this.details);
			return;
		}
		if (!message.content.some((content) => content.type === "toolCall") && !this.children.includes(this.details)) {
			this.addChild(this.details);
		}
	}

	setHideThinkingBlock(hide: boolean): void {
		this.details.setHideThinkingBlock(hide);
	}

	setHiddenThinkingLabel(label: string): void {
		this.details.setHiddenThinkingLabel(label);
	}

	setOutputPad(padding: number): void {
		this.details.setOutputPad(padding);
	}
}

class CompactToolExecutionComponent extends Container implements ToolExecutionRenderer {
	private readonly details: ToolExecutionComponent;

	constructor(
		_ui: TUI,
		cwd: string,
		toolName: string,
		toolCallId: string,
		args: unknown,
		definition: ReturnType<MainAreaRendererOptions["getToolDefinition"]>,
		options: ToolExecutionOptions,
	) {
		super();
		this.details = new ToolExecutionComponent(toolName, toolCallId, args, options, definition, _ui, cwd);
	}

	updateArgs(args: unknown): void {
		this.details.updateArgs(args);
	}

	markExecutionStarted(): void {
		this.details.markExecutionStarted();
	}

	setArgsComplete(): void {
		this.details.setArgsComplete();
	}

	updateResult(result: ToolResult, isPartial = false): void {
		this.details.updateResult(result, isPartial);
	}

	setShowImages(show: boolean): void {
		this.details.setShowImages(show);
	}

	setImageWidthCells(width: number): void {
		this.details.setImageWidthCells(width);
	}

	setExpanded(expanded: boolean): void {
		this.details.setExpanded(expanded);
	}
}

export function createMainAreaRenderer(simple: boolean, options: MainAreaRendererOptions): MainAreaRendererSelection {
	return {
		simple,
		createAssistant: (message) =>
			simple
				? new CompactAssistantMessageComponent(options.ui, message, options)
				: new AssistantMessageComponent(
						message,
						options.hideThinkingBlock,
						options.markdownTheme,
						options.hiddenThinkingLabel,
						options.outputPad,
						options.markdownTransformers,
					),
		createTool: (toolName, toolCallId, args) =>
			simple
				? new CompactToolExecutionComponent(
						options.ui,
						options.cwd,
						toolName,
						toolCallId,
						args,
						options.getToolDefinition(toolName),
						{ showImages: options.showImages, imageWidthCells: options.imageWidthCells },
					)
				: new ToolExecutionComponent(
						toolName,
						toolCallId,
						args,
						{ showImages: options.showImages, imageWidthCells: options.imageWidthCells },
						options.getToolDefinition(toolName),
						options.ui,
						options.cwd,
					),
	};
}
