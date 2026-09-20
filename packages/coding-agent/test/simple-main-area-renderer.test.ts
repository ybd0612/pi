import { describe, expect, test } from "vitest";
import { createMainAreaRenderer } from "../src/modes/interactive/renderers.ts";

describe("main area renderer selection", () => {
	test("selects compact and full renderers without changing the lifecycle boundary", () => {
		const options = {
			ui: undefined as never,
			cwd: process.cwd(),
			markdownTheme: undefined as never,
			hideThinkingBlock: false,
			hiddenThinkingLabel: "Thinking...",
			outputPad: 1,
			markdownTransformers: [],
			showImages: true,
			imageWidthCells: 60,
			getToolDefinition: () => undefined,
		};

		expect(createMainAreaRenderer(true, options).simple).toBe(true);
		expect(createMainAreaRenderer(false, options).simple).toBe(false);
		expect(typeof createMainAreaRenderer(true, options).createAssistant).toBe("function");
		expect(typeof createMainAreaRenderer(true, options).createTool).toBe("function");
	});
});
