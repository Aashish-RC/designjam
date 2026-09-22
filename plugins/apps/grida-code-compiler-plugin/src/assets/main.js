// src/compiler/reactTailwind.ts
function compileToReactTailwind(node) {
  const componentName = sanitizeComponentName(node.name || "Component");
  const jsx = compileNodeToJsx(node, 2);
  return `import React from 'react';

export interface ${componentName}Props {
  className?: string;
}

export const ${componentName}: React.FC<${componentName}Props> = ({ className = '' }) => {
  return (
${jsx}
  );
};

export default ${componentName};
`;
}
function compileNodeToJsx(node, indentLevel) {
  const indent = " ".repeat(indentLevel * 2);
  const classes = [];
  if (node.layoutMode === "flex" || node.flexDirection) {
    classes.push("flex");
    if (node.flexDirection === "column") {
      classes.push("flex-col");
    } else {
      classes.push("flex-row");
    }
    if (node.justifyContent === "center") classes.push("justify-center");
    else if (node.justifyContent === "space-between") classes.push("justify-between");
    else if (node.justifyContent === "flex-end") classes.push("justify-end");
    if (node.alignItems === "center") classes.push("items-center");
    else if (node.alignItems === "flex-start") classes.push("items-start");
    else if (node.alignItems === "flex-end") classes.push("items-end");
    if (node.gap) {
      classes.push(`gap-[${node.gap}px]`);
    }
  }
  if (node.paddingTop || node.paddingRight || node.paddingBottom || node.paddingLeft) {
    if (node.paddingTop === node.paddingBottom && node.paddingLeft === node.paddingRight && node.paddingTop === node.paddingLeft) {
      classes.push(`p-[${node.paddingTop}px]`);
    } else {
      if (node.paddingTop) classes.push(`pt-[${node.paddingTop}px]`);
      if (node.paddingRight) classes.push(`pr-[${node.paddingRight}px]`);
      if (node.paddingBottom) classes.push(`pb-[${node.paddingBottom}px]`);
      if (node.paddingLeft) classes.push(`pl-[${node.paddingLeft}px]`);
    }
  }
  if (node.width && !node.layoutMode) {
    classes.push(`w-[${Math.round(node.width)}px]`);
  }
  if (node.height && !node.layoutMode) {
    classes.push(`h-[${Math.round(node.height)}px]`);
  }
  if (node.backgroundColor) {
    classes.push(formatTailwindColor("bg", node.backgroundColor));
  }
  if (node.borderRadius) {
    classes.push(`rounded-[${node.borderRadius}px]`);
  }
  if (node.borderWidth && node.borderColor) {
    classes.push(`border-[${node.borderWidth}px]`);
    classes.push(formatTailwindColor("border", node.borderColor));
  }
  if (node.type === "text") {
    if (node.textColor) classes.push(formatTailwindColor("text", node.textColor));
    if (node.fontSize) classes.push(`text-[${Math.round(node.fontSize)}px]`);
    if (node.fontWeight) {
      if (node.fontWeight === "700" || node.fontWeight === 700 || node.fontWeight === "bold") classes.push("font-bold");
      else if (node.fontWeight === "600" || node.fontWeight === 600 || node.fontWeight === "semibold") classes.push("font-semibold");
      else if (node.fontWeight === "500" || node.fontWeight === 500 || node.fontWeight === "medium") classes.push("font-medium");
    }
  }
  if (node.opacity !== void 0 && node.opacity < 1) {
    classes.push(`opacity-${Math.round(node.opacity * 100)}`);
  }
  const classAttr = classes.length > 0 ? ` className="${classes.join(" ")}"` : "";
  if (node.type === "text") {
    const text = node.textContent || "Text";
    return `${indent}<p${classAttr}>${escapeHtml(text)}</p>`;
  }
  if (node.children && node.children.length > 0) {
    const childrenJsx = node.children.map((c) => compileNodeToJsx(c, indentLevel + 1)).join("\n");
    return `${indent}<div${classAttr}>
${childrenJsx}
${indent}</div>`;
  }
  return `${indent}<div${classAttr} />`;
}
function sanitizeComponentName(name) {
  const clean = name.replace(/[^a-zA-Z0-9]/g, " ").trim();
  const pascal = clean.split(/\s+/).map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join("");
  return pascal || "CustomComponent";
}
function formatTailwindColor(prefix, hex) {
  if (hex.startsWith("#")) {
    return `${prefix}-[${hex}]`;
  }
  return `${prefix}-[${hex}]`;
}
function escapeHtml(text) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// src/compiler/flutterDart.ts
function compileToFlutterDart(node) {
  const widgetName = sanitizeWidgetName(node.name || "CustomWidget");
  const widgetBody = compileNodeToWidget(node, 2);
  return `import 'package:flutter/material.dart';

class ${widgetName} extends StatelessWidget {
  const ${widgetName}({super.key});

  @override
  Widget build(BuildContext context) {
    return ${widgetBody};
  }
}
`;
}
function compileNodeToWidget(node, indentLevel) {
  const indent = " ".repeat(indentLevel * 2);
  if (node.type === "text") {
    const text = (node.textContent || "Text").replace(/'/g, "\\'");
    let styleProps = [];
    if (node.textColor) styleProps.push(`color: ${hexToColor(node.textColor)}`);
    if (node.fontSize) styleProps.push(`fontSize: ${Math.round(node.fontSize)}.0`);
    if (node.fontWeight) {
      if (node.fontWeight === "700" || node.fontWeight === 700 || node.fontWeight === "bold") {
        styleProps.push("fontWeight: FontWeight.bold");
      } else if (node.fontWeight === "600" || node.fontWeight === 600 || node.fontWeight === "semibold") {
        styleProps.push("fontWeight: FontWeight.w600");
      } else if (node.fontWeight === "500" || node.fontWeight === 500) {
        styleProps.push("fontWeight: FontWeight.w500");
      }
    }
    const styleStr = styleProps.length > 0 ? `, style: TextStyle(${styleProps.join(", ")})` : "";
    return `Text('${text}'${styleStr})`;
  }
  let childWidget = "";
  if (node.children && node.children.length > 0) {
    const isColumn = node.flexDirection === "column";
    const flexType = isColumn ? "Column" : "Row";
    const childrenStr = node.children.map((c) => `${indent}    ${compileNodeToWidget(c, indentLevel + 2)},`).join("\n");
    let flexProps = [];
    if (node.justifyContent === "center") flexProps.push("mainAxisAlignment: MainAxisAlignment.center");
    else if (node.justifyContent === "space-between") flexProps.push("mainAxisAlignment: MainAxisAlignment.spaceBetween");
    if (node.alignItems === "center") flexProps.push("crossAxisAlignment: CrossAxisAlignment.center");
    const flexPropsStr = flexProps.length > 0 ? `${flexProps.join(", ")}, ` : "";
    childWidget = `
${indent}  child: ${flexType}(
${indent}    ${flexPropsStr}children: [
${childrenStr}
${indent}    ],
${indent}  ),`;
  }
  let decorProps = [];
  if (node.backgroundColor) {
    decorProps.push(`color: ${hexToColor(node.backgroundColor)}`);
  }
  if (node.borderRadius) {
    decorProps.push(`borderRadius: BorderRadius.circular(${node.borderRadius}.0)`);
  }
  if (node.borderWidth && node.borderColor) {
    decorProps.push(`border: Border.all(color: ${hexToColor(node.borderColor)}, width: ${node.borderWidth}.0)`);
  }
  let containerProps = [];
  if (node.width && !node.layoutMode) containerProps.push(`width: ${Math.round(node.width)}.0`);
  if (node.height && !node.layoutMode) containerProps.push(`height: ${Math.round(node.height)}.0`);
  if (node.paddingTop || node.paddingRight || node.paddingBottom || node.paddingLeft) {
    const p = node.paddingTop || 0;
    containerProps.push(`padding: const EdgeInsets.all(${p}.0)`);
  }
  if (decorProps.length > 0) {
    containerProps.push(`decoration: BoxDecoration(${decorProps.join(", ")})`);
  }
  const propsStr = containerProps.length > 0 ? `
${indent}  ${containerProps.join(`,
${indent}  `)},` : "";
  return `Container(${propsStr}${childWidget}
${indent})`;
}
function hexToColor(hex) {
  const clean = hex.replace("#", "");
  if (clean.length === 6) {
    return `const Color(0xFF${clean.toUpperCase()})`;
  }
  return `const Color(0xFF${clean.toUpperCase()})`;
}
function sanitizeWidgetName(name) {
  const clean = name.replace(/[^a-zA-Z0-9]/g, " ").trim();
  const pascal = clean.split(/\s+/).map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join("");
  return pascal || "CustomWidget";
}

// src/compiler/svelteCompiler.ts
function compileToSvelte(node) {
  const componentName = node.name || "Component";
  return `<script lang="ts">
  // Generated Svelte Component: ${componentName}
  let { class: className = '' } = $props();
<\/script>

<div class="component-root {className}">
  ${compileSvelteInner(node, 1)}
</div>

<style>
  /* Optional scoped overrides */
</style>
`;
}
function compileSvelteInner(node, indentLevel) {
  const indent = "  ".repeat(indentLevel);
  if (node.type === "text") {
    return `${indent}<p style="color: ${node.textColor || "#fff"}; font-size: ${node.fontSize || 14}px;">${node.textContent || ""}</p>`;
  }
  if (node.children && node.children.length > 0) {
    const childrenStr = node.children.map((c) => compileSvelteInner(c, indentLevel + 1)).join("\n");
    return `${indent}<div style="display: flex; flex-direction: ${node.flexDirection || "column"}; gap: ${node.gap || 0}px;">
${childrenStr}
${indent}</div>`;
  }
  return `${indent}<div />`;
}

// src/main.ts
var activeFramework = "react-tailwind";
var currentNode = null;
var currentGeneratedCode = "";
var codeOutput = document.getElementById("code-output");
var nodeInfo = document.getElementById("node-info");
var btnCopy = document.getElementById("btn-copy");
document.querySelectorAll(".nav-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".nav-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    activeFramework = btn.dataset.framework || "react-tailwind";
    renderCode();
  });
});
function renderCode() {
  if (!currentNode) {
    codeOutput.textContent = "// Select a layer or artboard on the canvas to inspect code";
    return;
  }
  nodeInfo.textContent = `Target: ${currentNode.name} (${currentNode.type})`;
  if (activeFramework === "react-tailwind") {
    currentGeneratedCode = compileToReactTailwind(currentNode);
  } else if (activeFramework === "flutter") {
    currentGeneratedCode = compileToFlutterDart(currentNode);
  } else {
    currentGeneratedCode = compileToSvelte(currentNode);
  }
  codeOutput.textContent = currentGeneratedCode;
}
btnCopy.addEventListener("click", async () => {
  if (!currentGeneratedCode) return;
  try {
    await navigator.clipboard.writeText(currentGeneratedCode);
    const orig = btnCopy.textContent;
    btnCopy.textContent = "Copied to Clipboard!";
    setTimeout(() => {
      btnCopy.textContent = orig;
    }, 1200);
  } catch (err) {
    console.error("Failed to copy code:", err);
  }
});
window.addEventListener("message", (event) => {
  if (event.data?.type === "selection-change") {
    currentNode = event.data.content?.selectedNode || null;
    renderCode();
  }
});
parent.postMessage({ type: "request-selection" }, "*");
