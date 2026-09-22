import { z } from "zod";
import { Tool } from "../Tool";
import type { ToolResponse } from "../ToolResponse";
import { TextResponse } from "../ToolResponse";
import "reflect-metadata";
import { PenpotMcpServer } from "../PenpotMcpServer";
import { ExecuteCodePluginTask } from "../tasks/ExecuteCodePluginTask";
import { ExecuteCodeTaskParams } from "@penpot/mcp-common";

/**
 * Arguments schema for ProceduralGeneratorTool (infused from Graphite procedural engine)
 */
export class ProceduralGeneratorArgs {
    static schema = {
        generatorType: z
            .enum(["spiral", "radial_array", "harmonic_wave"])
            .describe("The procedural generator type to synthesize."),
        name: z
            .string()
            .optional()
            .describe("Optional name for the generated procedural shape layer."),
        turns: z
            .number()
            .positive()
            .optional()
            .describe("For spiral: Number of full revolutions (default: 4)."),
        radius: z
            .number()
            .positive()
            .optional()
            .describe("Radius of spiral or outer radius of radial array (default: 100)."),
        count: z
            .number()
            .int()
            .positive()
            .optional()
            .describe("For radial array: Number of repeating symmetric elements (default: 16)."),
        frequency: z
            .number()
            .positive()
            .optional()
            .describe("For harmonic wave: Oscillation cycles (default: 2)."),
        amplitude: z
            .number()
            .positive()
            .optional()
            .describe("For harmonic wave: Peak wave height (default: 40)."),
        color: z
            .string()
            .optional()
            .describe("Hex stroke/fill color (default: '#0ea5e9')."),
    };

    generatorType!: "spiral" | "radial_array" | "harmonic_wave";
    name?: string;
    turns?: number;
    radius?: number;
    count?: number;
    frequency?: number;
    amplitude?: number;
    color?: string;
}

/**
 * Tool for synthesizing procedural mathematical graphics into Penpot (infused from Graphite)
 */
export class ProceduralGeneratorTool extends Tool<ProceduralGeneratorArgs> {
    constructor(mcpServer: PenpotMcpServer) {
        super(mcpServer, ProceduralGeneratorArgs.schema);
    }

    public getToolName(): string {
        return "generate_procedural_vector";
    }

    public getToolDescription(): string {
        return (
            "Generates procedural, mathematical vector graphics (spirals, radial symmetry arrays, harmonic waves) " +
            "infused from the Graphite procedural engine, and inserts them directly as native editable vector shapes in Penpot."
        );
    }

    protected async executeCore(args: ProceduralGeneratorArgs): Promise<ToolResponse> {
        const color = args.color || "#0ea5e9";
        const shapeName = args.name || `Graphite Procedural ${args.generatorType}`;
        let svg = "";

        if (args.generatorType === "spiral") {
            const turns = args.turns || 4;
            const radius = args.radius || 100;
            const size = radius * 2 + 40;
            const cx = size / 2;
            const cy = size / 2;
            const totalAngle = turns * 2 * Math.PI;
            const b = radius / totalAngle;
            const steps = 240;

            let pathData = "";
            for (let i = 0; i <= steps; i++) {
                const theta = (i / steps) * totalAngle;
                const r = b * theta;
                const x = cx + r * Math.cos(theta);
                const y = cy + r * Math.sin(theta);
                pathData += (i === 0 ? `M ${x.toFixed(2)} ${y.toFixed(2)}` : ` L ${x.toFixed(2)} ${y.toFixed(2)}`);
            }
            svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}"><path d="${pathData}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" /></svg>`;
        } else if (args.generatorType === "radial_array") {
            const count = args.count || 16;
            const outerRadius = args.radius || 100;
            const innerRadius = outerRadius * 0.3;
            const size = outerRadius * 2 + 40;
            const cx = size / 2;
            const cy = size / 2;
            const stepAngle = (2 * Math.PI) / count;
            let elements = "";

            for (let i = 0; i < count; i++) {
                const angle = i * stepAngle;
                const deg = (angle * 180) / Math.PI;
                const length = outerRadius - innerRadius;
                elements += `<path d="M 0 0 C 14 ${-length / 2}, 14 ${-length}, 0 ${-length} C -14 ${-length}, -14 ${-length / 2}, 0 0 Z" transform="translate(${cx}, ${cy}) rotate(${deg})" fill="${color}" opacity="0.8" />`;
            }
            svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}"><g id="graphite-radial-array">${elements}</g></svg>`;
        } else {
            // Harmonic wave
            const width = 300;
            const height = 150;
            const freq = args.frequency || 2;
            const amp = args.amplitude || 40;
            const steps = 100;
            const stepX = width / steps;
            let d = "";

            for (let i = 0; i <= steps; i++) {
                const x = i * stepX;
                const y = (height / 2) + amp * Math.sin((i / steps) * freq * 2 * Math.PI);
                d += (i === 0 ? `M ${x.toFixed(2)} ${y.toFixed(2)}` : ` L ${x.toFixed(2)} ${y.toFixed(2)}`);
            }
            svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}"><path d="${d}" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" /></svg>`;
        }

        const sanitizedSvg = JSON.stringify(svg);
        const code = `
            const shape = penpot.createShapeFromSvg(${sanitizedSvg});
            if (shape) {
                shape.name = "${shapeName}";
                shape.x = penpot.viewport.center.x - (shape.width / 2);
                shape.y = penpot.viewport.center.y - (shape.height / 2);
                penpot.selection = [shape];
                return { id: shape.id, name: shape.name, width: shape.width, height: shape.height };
            }
            return { error: "Failed to create shape" };
        `;

        const taskParams: ExecuteCodeTaskParams = { code };
        const task = new ExecuteCodePluginTask(taskParams);
        const result = await this.mcpServer.pluginBridge.executePluginTask(task);

        return new TextResponse(
            JSON.stringify(
                {
                    message: "Procedural shape successfully synthesized into Penpot canvas",
                    generatorType: args.generatorType,
                    shape: result.data,
                },
                null,
                2
            )
        );
    }
}
