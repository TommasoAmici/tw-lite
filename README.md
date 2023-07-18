# tw-lite

This small library can be used to generate React styled components with
TailwindCSS without relying on a CSS-in-JS library and Babel macros.

This library can replace a good chunk of the functionality of
[twin.macro](https://github.com/ben-rogerson/twin.macro).

It is published on the [npm registry as `tw-lite`](https://www.npmjs.com/package/tw-lite).

## Goals

- Compatible with any bundler
- No Babel macros
- No CSS-in-JS required
- Compatible with [styled-components](https://styled-components.com), [emotion](https://emotion.sh/docs/introduction), etc.

## Non-goals

- No parsing of Tailwind config to validate class names
- No support for custom syntax

## Installation

```sh
npm install tw-lite
yarn add tw-lite
pnpm add tw-lite
bun add tw-lite
```

## Usage

All the examples below expect the following import:

```js
import tw from 'tw-lite'
```

You can use the `tw` import to create and style new components:

```js
const Input = tw("input")`border hover:border-black`
```

And clone and style existing components:

```js
const PurpleInput = tw(Input)`border-purple-500`
```

### Transient props

You can define transient props that will be passed to the component, you can
leverage these props to add dynamic styles:

```tsx
type Props = {
  $isEnabled: boolean;
  $variant: "primary" | "secondary";
}

const Button = tw("button")<Props>`
  ${props => props.$variant === "primary" ? "bg-blue-500" : "bg-gray-500"}
  ${props => props.$isEnabled ? "cursor-pointer" : "cursor-not-allowed"}
`

<Button $isEnabled $variant="primary">Click me!</Button>
// this will render
<button class="bg-blue-500 cursor-pointer">Click me!</button>
```

Transient props should be prefixed with `$` so they are not passed to HTML tags
to avoid polluting the DOM with extra attributes. However, they are always
forwarded to React components.

### Good old CSS

Since `tw-lite` doesn't parse the Tailwind classes, it can also be used with any
CSS class, for example regular CSS, CSS Modules or Sass classes.

```js
// .btn and .btn-primary can be defined in a CSS or Sass stylesheet
const Button = tw("button")`btn btn-primary`
```

```js
import styles from "./Button.module.css"

const Button = tw("button")`${styles.button} text-lg`
```

See the [examples](./examples/) directory for more.

## How it works

The `tw` function is a tagged template literal that takes a string of Tailwind
classes and returns a component with those classes applied.

Unlike with `twin.macro`, you must configure Tailwind as usual to generate the
final stylesheet. This utility will not parse your Tailwind config to generate
styles.

This however has a key benefit as your bundle size will be smaller.

Since `tw-lite` doesn't depend on Babel macros, this means it can be used with
any bundler, including Bun, Vite, and esbuild without any additional setup.
