# 🧪 Provably Fair VerifierForm Lib

A SvelteKit 2/Svelte 5 library that provides a reusable `VerifierForm` component to help you **quickly build provably fair verifiers** for a variety of games on a crypto casino platform.

Designed for flexibility and reusability, it supports dynamic game configurations, reactive form inputs, result/explanation rendering, and seamless URL query parameter binding for shareable verification links.

---

## ✨ Features

- 🎮 Dynamic game config with pluggable form controls and result/explanation components
- 🔄 Two-way binding with URL query parameters for sharable verification links
- 🧠 Smart reactivity using Svelte 5 runes API
- ⚡ Debounced updates to prevent excessive navigation
- 🧪 Testing-friendly with `Vitest` and `@testing-library/svelte`
- 🧩 Tailored for reuse in SvelteKit subprojects

---

## 🗂 Project Structure

```text
src/
├── lib/
│   └── verifier/
│       ├── VerifierForm.svelte          # Core reactive form logic
|       ├── Control.svelte               # Reactive form control logic
│       └── types.ts                     # Shared types for game definition, controls
│
└── routes/
    └── +page.svelte                     # Example usage (can be stripped out for packaging)
```

---

## 🚀 Getting Started

### Install dependencies

```bash
pnpm install
```

### Run dev server

```bash
pnpm dev
```

Visit [http://localhost:5173](http://localhost:5173) to try out the form with a sample game.

---

## 📦 Using the Library

Install via workspace or `npm link` in a consuming SvelteKit project:

```bash
pnpm install ../provably-fair-verifierform-lib
```

### Import types and components:

```ts
import VerifierForm from 'provably-fair-verifierform-lib';
import type { GameDefinition, Control } from 'provably-fair-verifierform-lib';
```

---

## 🎮 Define a Game

Each game must define:

```ts
const diceGame: GameDefinition = {
  name: 'Dice',
  controls: [
    { id: 'clientseed', label: 'Client Seed', type: 'text', required: true },
    { id: 'serverseed', label: 'Server Seed', type: 'text', required: true },
    { id: 'nonce', label: 'Nonce', type: 'number', required: true }
  ],
  ResultComponent: DiceResult,
  ExplanationComponent: DiceExplanation
};
```

Use with:

```svelte
<VerifierForm {games} />
```

---

## 🧪 Testing

```bash
pnpm test
```

- Mocks `$app/state` and `$app/navigation` for stable test runs
- Example tests provided for form interactivity and result rendering

---

## 🔧 Built With

- [Svelte 5](https://github.com/sveltejs/rfcs/pull/53)
- [Tailwind CSS](https://tailwindcss.com)
- [Vitest](https://vitest.dev)
- [@testing-library/svelte](https://testing-library.com/docs/svelte-testing-library/intro/)

---
