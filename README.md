# 🧪 Provably Fair VerifierForm Lib

![Vitest Lines Badge](https://gist.githubusercontent.com/Kyran121/3297558a26163acee4e360d24d9ea776/raw/lines-badge.svg) ![Vitest Branches Badge](https://gist.githubusercontent.com/Kyran121/3297558a26163acee4e360d24d9ea776/raw/branches-badge.svg)

A SvelteKit 2/Svelte 5 library that provides a reusable `VerifierForm` component to help **quickly build provably fair verifiers** for a variety of games on a crypto casino platform.

Designed with flexibility and reusability, it supports dynamic game configurations, reactive form inputs (with zod support for validation), result/explanation rendering, and seamless URL query parameter binding for shareable verification links.

---

## ✨ Features

- 🎮 Dynamic game config with pluggable form controls, zod schema, and result/explanation components
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

To use the `VerifierForm` component, you must define one or more games by providing a `GameDefinition` object. Each game includes:

- A `name` (string)
- A list of `controls` that define the form fields for user input
- A `schema` (Zod) used for validation
- A `ResultComponent` that displays the result
- An optional `ExplanationComponent` for additional context

```ts
import { z } from 'zod';
import type { GameDefinition } from 'provably-fair-verifierform-lib';

export const diceGame: GameDefinition = {
  name: 'Dice',
  controls: [
    { id: 'clientseed', name: 'Client Seed', label: 'Client Seed', type: 'text', required: true },
    { id: 'serverseed', name: 'Server Seed', label: 'Server Seed', type: 'text', required: true },
    { id: 'nonce', name: 'Nonce', label: 'Nonce', type: 'number', required: true }
  ],
  schema: z.object({
    clientseed: z.string(),
    serverseed: z.string(),
    nonce: z.coerce.number()
  }),
  ResultComponent: DiceResult,
  ExplanationComponent: DiceExplanation
};
```

### Control Options

Each item in the `controls` array is a `Control` object that defines a single input field. The following options are available:

| Field       | Type                                 | Description                                                            |
| ----------- | ------------------------------------ | ---------------------------------------------------------------------- |
| `id`        | `string`                             | A unique identifier for the control (used as the key in `formValues`). |
| `name`      | `string`                             | A display name for the control (used in accessibility and labels).     |
| `label`     | `string`                             | The visible label shown in the form UI.                                |
| `type`      | `'text'` \| `'number'` \| `'select'` | Type of input rendered.                                                |
| `required`  | `boolean` _(default: false)_         | Whether the input is mandatory.                                        |
| `disabled`  | `boolean` _(default: false)_         | Whether the input is disabled in the UI.                               |
| `syncToUrl` | `boolean` _(default: true)_          | Whether the control should sync its value to the URL query parameters. |
| `default`   | `string` \| `number`                 | The default value to prefill the control with.                         |
| `options`   | `string[]`                           | Required if `type` is `'select'`. Defines the list of options.         |
| `attrs`     | `Record<string, unknown>`            | Additional attributes to pass directly to the input element.           |

This allows fine-grained control over form behavior and serialization.

Use with:

```svelte
<VerifierForm {games} />
```

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
