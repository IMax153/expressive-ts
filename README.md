![Expressive-ts Logo](./assets/logo.png)

![Build Status Badge](https://github.com/IMax153/expressive-ts/workflows/Build/badge.svg)

> `expressive-ts` is a functional programming library designed to simplify building complex regular expressions.

# Expressive-ts

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of contents**

- [Installation](#installation)
- [Why?](#why)
- [Usage](#usage)
- [Documentation](#documentation)
- [Prior Art](#prior-art)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installation

```
npm install fp-ts expressive-ts
```

or

```
yarn add fp-ts expressive-ts
```

**Note**: `fp-ts` is a peer dependency of `expressive-ts`

## Why?

The expressive nature of the `expressive-ts` API makes it incredibly easy to understand the purpose of an otherwise cryptic regular expression. Function composition is a core component of the API. By composing together the various functions provided by `expressive-ts`, extremely complex regular expressions can be built easily.

## Usage

Lets imagine that we would like to recognize and validate a basic URL. Here's how it would look using `expressive-ts`.

```typescript
import { pipe } from 'fp-ts/lib/function'
import * as E from 'expressive-ts/lib/Expression'

const expression = pipe(
  E.compile, // expressions always begin with a call to `compile`
  E.startOfInput,
  E.string('http'),
  E.maybe('s'),
  E.string('://'),
  E.maybe('www.'),
  E.anythingBut(' '),
  E.endOfInput,
  E.toRegex
)

assert.strictEqual(expression.test('https://www.google.com'), true)
assert.strictEqual(expression.test('https://google.com'), true)
assert.strictEqual(expression.test('http://google.com'), true)
assert.strictEqual(expression.test('http:/google.com'), false)
assert.strictEqual(expression.test('http://goog le.com'), false)
```

## Documentation

- [Docs](https://imax153.github.io/expressive-ts/)

## Prior Art

- [Super Expressive](https://github.com/francisrstokes/super-expressive/) (@francisrstokes)
- [Verbal Expressions](https://github.com/VerbalExpressions/JSVerbalExpressions/) (@VerbalExpressions)
