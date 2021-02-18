---
title: Expression.ts
nav_order: 1
parent: Modules
---

## Expression overview

Expressions allow for composition of complex regular expressions in a clear, concise,
and declarative manner.

Every expression should begin with a call to `compile`, followed by the individual
methods used to build the regular expression. In addition, regular expression `Flags`
can be switched on or off at any time.

A simple example would be to perform a case-insensitive search of a string for
the pattern `foo`, optionally followed by `bar`. With `expressive-ts`, representing
this logic is as simple as the following

**Example**

```ts
import { pipe } from 'fp-ts/lib/function'
import * as E from 'expressive-ts/lib/Expression'

const expression = pipe(E.compile, E.caseInsensitive, E.string('foo'), E.maybe('bar'))

const regex = pipe(expression, E.toRegex)
regex.test('foo') // => true
regex.test('foobar') // => true
regex.test('bar') // => false

pipe(expression, E.toRegexString) // => /(?:foo)(?:bar)?/i
```

Added in v0.0.1

---

<h2 class="text-delta">Table of contents</h2>

- [combinators](#combinators)
  - [allowMultiple](#allowmultiple)
  - [anyOf](#anyof)
  - [anything](#anything)
  - [anythingBut](#anythingbut)
  - [atLeast](#atleast)
  - [beginCapture](#begincapture)
  - [between](#between)
  - [betweenLazy](#betweenlazy)
  - [caseInsensitive](#caseinsensitive)
  - [compile](#compile)
  - [digit](#digit)
  - [endCapture](#endcapture)
  - [endOfInput](#endofinput)
  - [exactly](#exactly)
  - [lineBreak](#linebreak)
  - [lineByLine](#linebyline)
  - [maybe](#maybe)
  - [not](#not)
  - [oneOrMore](#oneormore)
  - [oneOrMoreLazy](#oneormorelazy)
  - [orExpression](#orexpression)
  - [range](#range)
  - [singleLine](#singleline)
  - [something](#something)
  - [somethingBut](#somethingbut)
  - [startOfInput](#startofinput)
  - [sticky](#sticky)
  - [string](#string)
  - [tab](#tab)
  - [unicode](#unicode)
  - [whitespace](#whitespace)
  - [word](#word)
  - [zeroOrMore](#zeroormore)
  - [zeroOrMoreLazy](#zeroormorelazy)
  - [~~or~~](#or)
- [destructors](#destructors)
  - [toRegex](#toregex)
  - [toRegexString](#toregexstring)
- [instances](#instances)
  - [monoidExpression](#monoidexpression)
  - [monoidFlags](#monoidflags)
- [model](#model)
  - [Flags (interface)](#flags-interface)
- [models](#models)
  - [Expression (interface)](#expression-interface)
  - [ExpressionBuilder (interface)](#expressionbuilder-interface)
- [pipeables](#pipeables)
  - [withCaseInsensitive](#withcaseinsensitive)
  - [withLineByLine](#withlinebyline)
  - [withMultiple](#withmultiple)
  - [withSingleLine](#withsingleline)
  - [withSticky](#withsticky)
  - [withUnicode](#withunicode)

---

# combinators

## allowMultiple

**Signature**

```ts
export declare const allowMultiple: Endomorphism<ExpressionBuilder>
```

Added in v0.0.1

## anyOf

**Signature**

```ts
export declare const anyOf: (value: string) => Endomorphism<ExpressionBuilder>
```

Added in v0.0.1

## anything

**Signature**

```ts
export declare const anything: Endomorphism<ExpressionBuilder>
```

Added in v0.0.1

## anythingBut

**Signature**

```ts
export declare const anythingBut: (value: string) => Endomorphism<ExpressionBuilder>
```

Added in v0.0.1

## atLeast

**Signature**

```ts
export declare const atLeast: (min: number) => Endomorphism<ExpressionBuilder>
```

Added in v0.0.1

## beginCapture

**Signature**

```ts
export declare const beginCapture: Endomorphism<ExpressionBuilder>
```

Added in v0.0.1

## between

**Signature**

```ts
export declare const between: (min: number, max: number) => Endomorphism<ExpressionBuilder>
```

Added in v0.0.1

## betweenLazy

**Signature**

```ts
export declare const betweenLazy: (min: number, max: number) => Endomorphism<ExpressionBuilder>
```

Added in v0.0.1

## caseInsensitive

**Signature**

```ts
export declare const caseInsensitive: Endomorphism<ExpressionBuilder>
```

Added in v0.0.1

## compile

**Signature**

```ts
export declare const compile: ExpressionBuilder
```

Added in v0.0.1

## digit

**Signature**

```ts
export declare const digit: Endomorphism<ExpressionBuilder>
```

Added in v0.0.1

## endCapture

**Signature**

```ts
export declare const endCapture: Endomorphism<ExpressionBuilder>
```

Added in v0.0.1

## endOfInput

**Signature**

```ts
export declare const endOfInput: Endomorphism<ExpressionBuilder>
```

Added in v0.0.1

## exactly

**Signature**

```ts
export declare const exactly: (amount: number) => Endomorphism<ExpressionBuilder>
```

Added in v0.0.1

## lineBreak

**Signature**

```ts
export declare const lineBreak: Endomorphism<ExpressionBuilder>
```

Added in v0.0.1

## lineByLine

**Signature**

```ts
export declare const lineByLine: Endomorphism<ExpressionBuilder>
```

Added in v0.0.1

## maybe

**Signature**

```ts
export declare const maybe: (value: string) => Endomorphism<ExpressionBuilder>
```

Added in v0.0.1

## not

**Signature**

```ts
export declare const not: (value: string) => Endomorphism<ExpressionBuilder>
```

Added in v0.0.1

## oneOrMore

**Signature**

```ts
export declare const oneOrMore: Endomorphism<ExpressionBuilder>
```

Added in v0.0.1

## oneOrMoreLazy

**Signature**

```ts
export declare const oneOrMoreLazy: Endomorphism<ExpressionBuilder>
```

Added in v0.0.1

## orExpression

**Signature**

```ts
export declare const orExpression: Endomorphism<ExpressionBuilder>
```

Added in v0.0.1

## range

**Signature**

```ts
export declare const range: (from: string, to: string) => Endomorphism<ExpressionBuilder>
```

Added in v0.0.1

## singleLine

**Signature**

```ts
export declare const singleLine: Endomorphism<ExpressionBuilder>
```

Added in v0.0.1

## something

**Signature**

```ts
export declare const something: Endomorphism<ExpressionBuilder>
```

Added in v0.0.1

## somethingBut

**Signature**

```ts
export declare const somethingBut: (value: string) => Endomorphism<ExpressionBuilder>
```

Added in v0.0.1

## startOfInput

**Signature**

```ts
export declare const startOfInput: Endomorphism<ExpressionBuilder>
```

Added in v0.0.1

## sticky

**Signature**

```ts
export declare const sticky: Endomorphism<ExpressionBuilder>
```

Added in v0.0.1

## string

**Signature**

```ts
export declare const string: (value: string) => Endomorphism<ExpressionBuilder>
```

Added in v0.0.1

## tab

**Signature**

```ts
export declare const tab: Endomorphism<ExpressionBuilder>
```

Added in v0.0.1

## unicode

**Signature**

```ts
export declare const unicode: Endomorphism<ExpressionBuilder>
```

Added in v0.0.1

## whitespace

**Signature**

```ts
export declare const whitespace: Endomorphism<ExpressionBuilder>
```

Added in v0.0.1

## word

**Signature**

```ts
export declare const word: Endomorphism<ExpressionBuilder>
```

Added in v0.0.1

## zeroOrMore

**Signature**

```ts
export declare const zeroOrMore: Endomorphism<ExpressionBuilder>
```

Added in v0.0.1

## zeroOrMoreLazy

**Signature**

```ts
export declare const zeroOrMoreLazy: Endomorphism<ExpressionBuilder>
```

Added in v0.0.1

## ~~or~~

**Signature**

```ts
export declare const or: (value: string) => Endomorphism<ExpressionBuilder>
```

Added in v0.0.1

# destructors

## toRegex

**Signature**

```ts
export declare const toRegex: (builder: ExpressionBuilder) => RegExp
```

Added in v0.0.1

## toRegexString

**Signature**

```ts
export declare const toRegexString: (builder: ExpressionBuilder) => string
```

Added in v0.0.1

# instances

## monoidExpression

**Signature**

```ts
export declare const monoidExpression: M.Monoid<Expression>
```

Added in v0.0.1

## monoidFlags

**Signature**

```ts
export declare const monoidFlags: M.Monoid<Flags>
```

Added in v0.0.1

# model

## Flags (interface)

**Signature**

```ts
export interface Flags {
  /**
   * Sets the global search flag (`g`) which indicates that the expression should be
   * tested against all possible matches in the input.
   */
  readonly allowMultiple: boolean
  /**
   * Sets the case-insensitive search flag (`i`) which indicates that the expression
   * should not distinguish between uppercase and lowercase characters in the input.
   */
  readonly caseInsensitive: boolean
  /**
   * Sets the multi-line search flag (`m`) which indicates that the expression should
   * treat a multiline input as multiple lines.
   */
  readonly lineByLine: boolean
  /**
   * Sets the dotAll flag (`s`) which indicates that the expression should allow the
   * dot special character (`.`) to additionally match line terminator characters in
   * the input.
   */
  readonly singleLine: boolean
  /**
   * Sets the sticky flag (`s`) which indicates that the expression should match only
   * beginning at the index indicated by the `lastIndex` property of the expression.
   */
  readonly sticky: boolean
  /**
   * Sets the unicode flag (`u`) which enables various Unicode-related features within
   * the expression.
   */
  readonly unicode: boolean
}
```

Added in v0.0.1

# models

## Expression (interface)

**Signature**

```ts
export interface Expression {
  /**
   * The expression pattern prefix.
   */
  readonly prefix: string
  /**
   * The expression pattern.
   */
  readonly pattern: string
  /**
   * The expression pattern suffix.
   */
  readonly suffix: string
  /**
   * The expression source.
   */
  readonly source: string
  /**
   * The expression flags.
   */
  readonly flags: Flags
}
```

Added in v0.0.1

## ExpressionBuilder (interface)

**Signature**

```ts
export interface ExpressionBuilder extends T.Traced<Expression, Expression> {}
```

Added in v0.0.1

# pipeables

## withCaseInsensitive

**Signature**

```ts
export declare const withCaseInsensitive: (flag: boolean) => (wa: ExpressionBuilder) => Expression
```

Added in v0.0.1

## withLineByLine

**Signature**

```ts
export declare const withLineByLine: (flag: boolean) => (wa: ExpressionBuilder) => Expression
```

Added in v0.0.1

## withMultiple

**Signature**

```ts
export declare const withMultiple: (flag: boolean) => (wa: ExpressionBuilder) => Expression
```

Added in v0.0.1

## withSingleLine

**Signature**

```ts
export declare const withSingleLine: (flag: boolean) => (wa: ExpressionBuilder) => Expression
```

Added in v0.0.1

## withSticky

**Signature**

```ts
export declare const withSticky: (flag: boolean) => (wa: ExpressionBuilder) => Expression
```

Added in v0.0.1

## withUnicode

**Signature**

```ts
export declare const withUnicode: (flag: boolean) => (wa: ExpressionBuilder) => Expression
```

Added in v0.0.1
