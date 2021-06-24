/**
 * Expressions allow for composition of complex regular expressions in a clear, concise,
 * and declarative manner.
 *
 * Every expression should begin with a call to `compile`, followed by the individual
 * methods used to build the regular expression. In addition, regular expression `Flags`
 * can be switched on or off at any time.
 *
 * A simple example would be to perform a case-insensitive search of a string for
 * the pattern `foo`, optionally followed by `bar`. With `expressive-ts`, representing
 * this logic is as simple as the following
 *
 * @example
 * import { pipe } from 'fp-ts/lib/function'
 * import * as E from 'expressive-ts/lib/Expression'
 *
 * const expression = pipe(
 *   E.compile,
 *   E.caseInsensitive,
 *   E.string('foo'),
 *   E.maybe('bar')
 * )
 *
 * const regex = pipe(expression, E.toRegex)
 * regex.test('foo') // => true
 * regex.test('foobar') // => true
 * regex.test('bar') // => false
 *
 * pipe(expression, E.toRegexString) // => /(?:foo)(?:bar)?/i
 *
 * @since 0.0.1
 */
import * as M from 'fp-ts/Monoid'
import * as T from 'fp-ts/Traced'
import * as R from 'fp-ts/Record'
import * as S from 'fp-ts/string'
import * as B from 'fp-ts/boolean'
import * as Reader from 'fp-ts/Reader'
import { identity, Endomorphism, flow, pipe } from 'fp-ts/function'
import * as L from 'monocle-ts/Lens'

// -------------------------------------------------------------------------------------
// models
// -------------------------------------------------------------------------------------

/**
 * @category models
 * @since 0.0.1
 */
export interface ExpressionBuilder extends T.Traced<Expression, Expression> {}

/**
 * @category models
 * @since 0.0.1
 */
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

/**
 * @category model
 * @since 0.0.1
 */
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

// -------------------------------------------------------------------------------------
// destructors
// -------------------------------------------------------------------------------------

const flagsToChar: Record<keyof Flags, string> = {
  allowMultiple: 'g',
  caseInsensitive: 'i',
  lineByLine: 'm',
  singleLine: 's',
  unicode: 'u',
  sticky: 'y'
}

const toFlags: (flags: Flags) => string = R.foldMapWithIndex(S.Monoid)((k, v) => (v ? flagsToChar[k] : ''))

/**
 * @category destructors
 * @since 0.0.1
 */
export const toRegex: (builder: ExpressionBuilder) => RegExp = (builder) => {
  const expression = builder(monoidExpression.empty)
  const flags = toFlags(expression.flags)
  return new RegExp(expression.pattern, flags)
}

/**
 * @category destructors
 * @since 0.0.1
 */
export const toRegexString: (builder: ExpressionBuilder) => string = (builder) => {
  return `${toRegex(builder)}`
}

// -------------------------------------------------------------------------------------
// pipeables
// -------------------------------------------------------------------------------------

const expressionLens = L.id<Expression>()
const expressionFlagsLens = pipe(expressionLens, L.prop('flags'))
const getWithFlag = <K extends keyof Flags>(flag: K): ((flag: boolean) => (wa: ExpressionBuilder) => Expression) => {
  const flagLens = pipe(expressionFlagsLens, L.prop(flag))
  return (value: boolean) => {
    const exp = pipe(monoidExpression.empty, flagLens.set(value))
    return (wa: ExpressionBuilder) => wa(exp)
  }
}

/**
 * @category pipeables
 * @since 0.0.1
 */
export const withMultiple: (flag: boolean) => (wa: ExpressionBuilder) => Expression = getWithFlag('allowMultiple')

/**
 * @category pipeables
 * @since 0.0.1
 */
export const withCaseInsensitive: (flag: boolean) => (wa: ExpressionBuilder) => Expression =
  getWithFlag('caseInsensitive')

/**
 * @category pipeables
 * @since 0.0.1
 */
export const withLineByLine: (flag: boolean) => (wa: ExpressionBuilder) => Expression = getWithFlag('lineByLine')

/**
 * @category pipeables
 * @since 0.0.1
 */
export const withSingleLine: (flag: boolean) => (wa: ExpressionBuilder) => Expression = getWithFlag('singleLine')

/**
 * @category pipeables
 * @since 0.0.1
 */
export const withSticky: (flag: boolean) => (wa: ExpressionBuilder) => Expression = getWithFlag('sticky')

/**
 * @category pipeables
 * @since 0.0.1
 */
export const withUnicode: (flag: boolean) => (wa: ExpressionBuilder) => Expression = getWithFlag('unicode')

// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------

const stringConcat = M.concatAll(S.Monoid)
const doublePipe =
  <A, B>(f: (a: A) => (a: A) => B) =>
  (a: A): B =>
    f(a)(a)

const expressionPropReplacer = (prop: keyof Expression, reader: Reader.Reader<Expression, string[]>) =>
  doublePipe(flow(reader, stringConcat, pipe(expressionLens, L.prop(prop)).set))

const add: (value: string) => Endomorphism<ExpressionBuilder> = (value) =>
  T.map(
    flow(
      expressionPropReplacer('source', (e) => [e.source, value]),
      expressionPropReplacer('pattern', (e) => [e.prefix, e.source, e.suffix])
    )
  )

const prefix: (value: string) => Endomorphism<ExpressionBuilder> = (value) =>
  T.map(expressionPropReplacer('prefix', (e) => [e.prefix, value]))

const suffix: (value: string) => Endomorphism<ExpressionBuilder> = (value) =>
  T.map(expressionPropReplacer('suffix', (e) => [value, e.suffix]))

/**
 * @category combinators
 * @since 0.0.1
 */
export const allowMultiple: Endomorphism<ExpressionBuilder> = (wa) => C.extend(wa, withMultiple(true))

/**
 * @category combinators
 * @since 0.0.1
 */
export const caseInsensitive: Endomorphism<ExpressionBuilder> = (wa) => C.extend(wa, withCaseInsensitive(true))

/**
 * @category combinators
 * @since 0.0.1
 */
export const lineByLine: Endomorphism<ExpressionBuilder> = (wa) => C.extend(wa, withLineByLine(true))

/**
 * @category combinators
 * @since 0.0.1
 */
export const singleLine: Endomorphism<ExpressionBuilder> = (wa) => C.extend(wa, withSingleLine(true))

/**
 * @category combinators
 * @since 0.0.1
 */
export const sticky: Endomorphism<ExpressionBuilder> = (wa) => C.extend(wa, withSticky(true))

/**
 * @category combinators
 * @since 0.0.1
 */
export const unicode: Endomorphism<ExpressionBuilder> = (wa) => C.extend(wa, withUnicode(true))

/**
 * @category combinators
 * @since 0.0.1
 */
export const compile: ExpressionBuilder = identity

/**
 * @category combinators
 * @since 0.0.1
 */
export const startOfInput: Endomorphism<ExpressionBuilder> = add('^')

/**
 * @category combinators
 * @since 0.0.1
 */
export const endOfInput: Endomorphism<ExpressionBuilder> = add('$')

/**
 * @category combinators
 * @since 0.0.1
 */
export const string: (value: string) => Endomorphism<ExpressionBuilder> = (value) => add(`(?:${sanitize(value)})`)

/**
 * @category combinators
 * @since 0.0.1
 */
export const maybe: (value: string) => Endomorphism<ExpressionBuilder> = (value) => add(`(?:${sanitize(value)})?`)

/**
 * @deprecated
 * @category combinators
 * @since 0.0.1
 */
export const or: (value: string) => Endomorphism<ExpressionBuilder> = (value) =>
  flow(prefix(`(?:`), suffix(`)`), add(`)|(?:`), string(value))

/**
 * @category combinators
 * @since 0.0.2
 */
export const orExpression: Endomorphism<ExpressionBuilder> = add(`|`)

/**
 * @category combinators
 * @since 0.0.1
 */
export const anything: Endomorphism<ExpressionBuilder> = add(`(?:.*)`)

/**
 * @category combinators
 * @since 0.0.1
 */
export const anythingBut: (value: string) => Endomorphism<ExpressionBuilder> = (value) =>
  add(`(?:[^${sanitize(value)}]*)`)

/**
 * @category combinators
 * @since 0.0.1
 */
export const something: Endomorphism<ExpressionBuilder> = add(`(?:.+)`)

/**
 * @category combinators
 * @since 0.0.1
 */
export const somethingBut: (value: string) => Endomorphism<ExpressionBuilder> = (value) =>
  add(`(?:[^${sanitize(value)}]+)`)

/**
 * @category combinators
 * @since 0.0.1
 */
export const anyOf: (value: string) => Endomorphism<ExpressionBuilder> = (value) => add(`[${sanitize(value)}]`)

/**
 * @category combinators
 * @since 0.0.1
 */
export const not: (value: string) => Endomorphism<ExpressionBuilder> = (value) => add(`(?!${sanitize(value)})`)

/**
 * @category combinators
 * @since 0.0.1
 */
export const range: (from: string, to: string) => Endomorphism<ExpressionBuilder> = (from, to) =>
  add(`[${sanitize(from)}-${sanitize(to)}]`)

/**
 * @category combinators
 * @since 0.0.1
 */
export const lineBreak: Endomorphism<ExpressionBuilder> = add(`(?:\\r\\n|\\r|\\n)`)

/**
 * @category combinators
 * @since 0.0.1
 */
export const tab: Endomorphism<ExpressionBuilder> = add(`\\t`)

/**
 * @category combinators
 * @since 0.0.1
 */
export const word: Endomorphism<ExpressionBuilder> = add(`\\w+`)

/**
 * @category combinators
 * @since 0.0.1
 */
export const digit: Endomorphism<ExpressionBuilder> = add(`\\d`)

/**
 * @category combinators
 * @since 0.0.1
 */
export const whitespace: Endomorphism<ExpressionBuilder> = add(`\\s`)

/**
 * @category combinators
 * @since 0.0.1
 */
export const zeroOrMore: Endomorphism<ExpressionBuilder> = add(`*`)

/**
 * @category combinators
 * @since 0.0.1
 */
export const zeroOrMoreLazy: Endomorphism<ExpressionBuilder> = add(`*?`)

/**
 * @category combinators
 * @since 0.0.1
 */
export const oneOrMore: Endomorphism<ExpressionBuilder> = add(`+`)

/**
 * @category combinators
 * @since 0.0.1
 */
export const oneOrMoreLazy: Endomorphism<ExpressionBuilder> = add(`+?`)

/**
 * @category combinators
 * @since 0.0.1
 */
export const exactly: (amount: number) => Endomorphism<ExpressionBuilder> = (amount) => add(`{${amount}}`)

/**
 * @category combinators
 * @since 0.0.1
 */
export const atLeast: (min: number) => Endomorphism<ExpressionBuilder> = (min) => add(`{${min},}`)

/**
 * @category combinators
 * @since 0.0.1
 */
export const between: (min: number, max: number) => Endomorphism<ExpressionBuilder> = (min, max) =>
  add(`{${min},${max}}`)

/**
 * @category combinators
 * @since 0.0.1
 */
export const betweenLazy: (min: number, max: number) => Endomorphism<ExpressionBuilder> = (min, max) =>
  add(`{${min},${max}}?`)

/**
 * @category combinators
 * @since 0.0.1
 */
export const beginCapture: Endomorphism<ExpressionBuilder> = add(`(`)

/**
 * @category combinators
 * @since 0.0.1
 */
export const endCapture: Endomorphism<ExpressionBuilder> = add(`)`)

// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------

/**
 * @category instances
 * @since 0.0.1
 */
export const monoidFlags: M.Monoid<Flags> = M.struct({
  allowMultiple: B.MonoidAny,
  caseInsensitive: B.MonoidAny,
  lineByLine: B.MonoidAny,
  singleLine: B.MonoidAny,
  sticky: B.MonoidAny,
  unicode: B.MonoidAny
})

/**
 * @category instances
 * @since 0.0.1
 */
export const monoidExpression: M.Monoid<Expression> = M.struct({
  prefix: S.Monoid,
  pattern: S.Monoid,
  suffix: S.Monoid,
  source: S.Monoid,
  flags: monoidFlags
})

const C = T.getComonad(monoidExpression)

// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------

// Regular expression to match meta characters
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/regexp
const toEscape = /([\].|*?+(){}^$\\:=[])/g

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/lastMatch
const lastMatch = '$&'

// Escape meta characters
const sanitize: (value: string) => string = (value) => value.replace(toEscape, `\\${lastMatch}`)
