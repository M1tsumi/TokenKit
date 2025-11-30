

Here is a fully rewritten, professional, AI-ready project prompt. It’s structured, explicit, and optimized for generating consistent, high-quality output from an AI system.

---

# **📘 Professional AI Prompt — Theme-Kit Project Specification**

**Objective:**
Create **Theme-Kit**, a cross-framework, framework-agnostic SDK designed to manage **design tokens** (colors, typography, spacing, shadows, etc.) in modern web applications. The system should serve as a **single source of truth** for design systems across React, Vue, Angular, and vanilla JavaScript. The project must emphasize scalability, strong TypeScript support, and ease of integration.

---

## **1. Overview**

Theme-Kit is a **modular, scalable SDK** that centralizes design tokens and enables consistent theming across front-end ecosystems. The product should be designed for long-term maintainability and strong developer DX.

The AI should produce an implementation that prioritizes:

* **Framework-agnostic architecture**
* **Strong TypeScript typing** throughout the entire codebase
* **Simple, intuitive public APIs**
* **Extendable and modular design** for future token categories
* **Robust CLI tooling**
* **Optional per-framework adapters**

---

## **2. Core Features**

The project must include the following:

### **2.1 Unified Token Store**

A central ThemeKit class that loads, merges, and validates design tokens, including but not limited to:

* Colors
* Typography
* Spacing
* Shadows
* Borders
* Custom token categories

### **2.2 Multi-Framework Adapters**

Adapters must be created for:

* React
* Vue
* Angular
* Vanilla JS

Each adapter should provide idiomatic patterns (e.g., React context, Vue plugin, Angular module).

### **2.3 TypeScript First**

* Full TypeScript implementation
* Auto-generated token types
* IntelliSense-ready definitions
* Strong typing for theme switching and custom overrides

### **2.4 Dynamic Theme Switching**

ThemeKit should support:

* Light/dark mode
* Multi-theme support
* Overridable custom themes
* Persistence via localStorage or provided callback

### **2.5 CLI Tooling**

A dedicated CLI should provide:

* `generate`: output tokens as JSON, SCSS, CSS variables, or JS/TS modules
* `validate`: enforce naming conventions, detect duplicate tokens
* Config file support (`themekit.config.js`)
* Optional watch mode

### **2.6 Scalable Architecture**

The system must be structured so token categories are easy to add without breaking existing APIs.

---

## **3. Installation Requirements**

Example install instructions the AI should generate:

```bash
npm install theme-kit
# or
yarn add theme-kit
```

---

## **4. Usage Requirements**

AI-generated documentation must include examples for:

### **4.1 Defining Tokens**

Provide a sample `tokens.json` such as:

```json
{
  "colors": {
    "primary": "#4A90E2",
    "secondary": "#50E3C2",
    "background": "#FFFFFF",
    "text": "#333333"
  },
  "typography": {
    "fontFamily": "Inter, sans-serif",
    "fontSize": {
      "sm": "12px",
      "md": "16px",
      "lg": "20px"
    }
  },
  "spacing": {
    "sm": "4px",
    "md": "8px",
    "lg": "16px"
  }
}
```

### **4.2 Initialization API**

```ts
import { ThemeKit } from "theme-kit";
import tokens from "./tokens.json";

const theme = new ThemeKit(tokens);
```

### **4.3 Framework Integration**

**React Example**

```tsx
import { ThemeProvider } from "theme-kit/react";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Button>Click Me</Button>
    </ThemeProvider>
  );
}
```

**Vue Example**

```ts
createApp(App).use(ThemePlugin, { theme }).mount("#app");
```

**Angular Example**

```ts
imports: [ThemeModule.forRoot({ theme })]
```

### **4.4 Theme Switching**

```ts
theme.switch("dark");
theme.switch("custom", customTokens);
```

### **4.5 CLI Examples**

```bash
npx theme-kit generate --format css
npx theme-kit validate
```

---

## **5. Best Practices To Include**

The AI must incorporate the following guidance into documentation:

* Keep tokens atomic rather than semantic.
* Track token changes through version control.
* Run token validation in CI/CD pipelines.
* Introduce new token categories gradually.

---

## **6. Roadmap (AI should generate this section as part of documentation)**

Examples:

* Plugin ecosystem for community adapters (Svelte, SolidJS)
* Design tool syncing (Figma, Sketch)
* Multi-brand token support
* Performance and tree-shaking improvements

---

## **7. Contributing Guidelines**

The AI should implement standard contributing documentation including:

```bash
git checkout -b feature/new-token-type
git commit -m "Add shadow tokens"
git push origin feature/new-token-type
```

---

## **8. License**

Default license: **MIT**
The AI should prepare a full MIT license file.

---

# **Instruction to AI**

Produce the full Theme-Kit project including:

* TypeScript codebase
* Framework adapters
* CLI implementation
* Configuration system
* Documentation (README.md)
* Folder structure
* Token validation logic
* Example projects (React/Vue/Angular)
* Tests where appropriate

Make output production-ready, well-organized, and consistent with industry standards.

---

If you'd like, I can also:
✅ Convert this into a **requirements document**
✅ Turn it into a **GitHub README**
✅ Create a **software architecture diagram**
✅ Produce the **entire file/folder tree** for the project

Just tell me!
