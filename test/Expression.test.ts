import * as assert from 'assert'
import { pipe } from 'fp-ts/lib/function'

import * as _ from '../src/Expression'

describe('Expression', () => {
  describe('modifiers', () => {
    describe('allowMultiple', () => {
      it('should set the `g` flag', () => {
        assert.strictEqual(pipe(_.compile, _.string('foo'), _.allowMultiple, _.toRegexString), '/(?:foo)/g')
      })
    })

    describe('caseInsensitive', () => {
      it('should set the `i` flag', () => {
        assert.strictEqual(pipe(_.compile, _.string('foo'), _.caseInsensitive, _.toRegexString), '/(?:foo)/i')
      })
    })

    describe('lineByLine', () => {
      it('should set the `m` flag', () => {
        assert.strictEqual(pipe(_.compile, _.string('foo'), _.lineByLine, _.toRegexString), '/(?:foo)/m')
      })
    })

    describe('singleLine', () => {
      it('should set the `s` flag', () => {
        assert.strictEqual(pipe(_.compile, _.string('foo'), _.singleLine, _.toRegexString), '/(?:foo)/s')
      })
    })

    describe('sticky', () => {
      it('should set the `y` flag', () => {
        assert.strictEqual(pipe(_.compile, _.string('foo'), _.sticky, _.toRegexString), '/(?:foo)/y')
      })
    })

    describe('unicode', () => {
      it('should set the `u` flag', () => {
        assert.strictEqual(pipe(_.compile, _.string('foo'), _.unicode, _.toRegexString), '/(?:foo)/u')
      })
    })

    describe('multiple flags', () => {
      it('should support setting multiple flags', () => {
        assert.strictEqual(
          pipe(_.compile, _.string('foo'), _.allowMultiple, _.caseInsensitive, _.toRegexString),
          '/(?:foo)/gi'
        )
      })
    })
  })

  describe('combinators', () => {
    describe('startOfInput', () => {
      it('should add a start of input boundary', () => {
        assert.strictEqual(pipe(_.compile, _.startOfInput, _.string('foo'), _.toRegexString), '/^(?:foo)/')
      })
    })

    describe('endOfInput', () => {
      it('should add an end of input boundary', () => {
        assert.strictEqual(pipe(_.compile, _.string('foo'), _.endOfInput, _.toRegexString), '/(?:foo)$/')
      })
    })

    describe('string', () => {
      it('should match an exact string', () => {
        assert.strictEqual(pipe(_.compile, _.string('foo'), _.toRegexString), '/(?:foo)/')
      })
    })

    describe('maybe', () => {
      it('should match an optional string', () => {
        assert.strictEqual(pipe(_.compile, _.maybe('foo'), _.toRegexString), '/(?:foo)?/')
      })
    })

    describe('or', () => {
      it('should match the preceding value or the subsequent value', () => {
        assert.strictEqual(pipe(_.compile, _.string('foo'), _.or('bar'), _.toRegexString), '/(?:(?:foo))|(?:(?:bar))/')
      })
    })

    describe('orMap', () => {
      it('should match unicode regex', () => {
        assert.strictEqual(
          pipe(
            _.compile,
            _.range('a', 'z'),
            _.range('A', 'Z'),
            _.orMap,
            _.range('A', 'Z'),
            _.exactly(2),
            _.range('a', 'z'),
            _.toRegexString
          ),
          '/[a-z][A-Z]|[A-Z]{2}[a-z]/'
        )
      })
    })

    describe('anything', () => {
      it('should match anything', () => {
        assert.strictEqual(pipe(_.compile, _.anything, _.toRegexString), '/(?:.*)/')
      })
    })

    describe('anythingBut', () => {
      it('should match anything except the specified value', () => {
        assert.strictEqual(pipe(_.compile, _.anythingBut('foo'), _.toRegexString), '/(?:[^foo]*)/')
      })
    })

    describe('something', () => {
      it('should match something', () => {
        assert.strictEqual(pipe(_.compile, _.something, _.toRegexString), '/(?:.+)/')
      })
    })

    describe('somethingBut', () => {
      it('should match something except for the specified value', () => {
        assert.strictEqual(pipe(_.compile, _.somethingBut('foo'), _.toRegexString), '/(?:[^foo]+)/')
      })
    })

    describe('anyOf', () => {
      it('should match any of the specified values', () => {
        assert.strictEqual(pipe(_.compile, _.anyOf('foo'), _.toRegexString), '/[foo]/')
      })
    })

    describe('not', () => {
      it('should not match the specified value', () => {
        assert.strictEqual(pipe(_.compile, _.not('foo'), _.toRegexString), '/(?!foo)/')
      })
    })

    describe('range', () => {
      it('should match a range of values', () => {
        assert.strictEqual(pipe(_.compile, _.range('a', 'z'), _.toRegexString), '/[a-z]/')
      })
    })

    describe('lineBreak', () => {
      it('should match a line terminator', () => {
        assert.strictEqual(pipe(_.compile, _.lineBreak, _.toRegexString), '/(?:\\r\\n|\\r|\\n)/')
      })
    })

    describe('tab', () => {
      it('should match a tab character', () => {
        assert.strictEqual(pipe(_.compile, _.tab, _.toRegexString), '/\\t/')
      })
    })

    describe('word', () => {
      it('should match a word', () => {
        assert.strictEqual(pipe(_.compile, _.word, _.toRegexString), '/\\w+/')
      })
    })

    describe('digit', () => {
      it('should match a digit', () => {
        assert.strictEqual(pipe(_.compile, _.digit, _.toRegexString), '/\\d/')
      })
    })

    describe('whitespace', () => {
      it('should match whitespace', () => {
        assert.strictEqual(pipe(_.compile, _.whitespace, _.toRegexString), '/\\s/')
      })
    })

    describe('zeroOrMore', () => {
      it('should match zero or more of the preceding value', () => {
        assert.strictEqual(pipe(_.compile, _.string('foo'), _.zeroOrMore, _.toRegexString), '/(?:foo)*/')
      })
    })

    describe('zeroOrMoreLazy', () => {
      it('should lazily match zero or more of the preceding value', () => {
        assert.strictEqual(pipe(_.compile, _.string('foo'), _.zeroOrMoreLazy, _.toRegexString), '/(?:foo)*?/')
      })
    })

    describe('oneOrMore', () => {
      it('should match one or more of the preceding value', () => {
        assert.strictEqual(pipe(_.compile, _.string('foo'), _.oneOrMore, _.toRegexString), '/(?:foo)+/')
      })
    })

    describe('oneOrMoreLazy', () => {
      it('should lazily match one or more of the preceding value', () => {
        assert.strictEqual(pipe(_.compile, _.string('foo'), _.oneOrMoreLazy, _.toRegexString), '/(?:foo)+?/')
      })
    })

    describe('exactly', () => {
      it('should match the preceding value exactly the specified number of times', () => {
        assert.strictEqual(pipe(_.compile, _.string('foo'), _.exactly(4), _.toRegexString), '/(?:foo){4}/')
      })
    })

    describe('atLeast', () => {
      it('should match the preceding value at least the specified number of times', () => {
        assert.strictEqual(pipe(_.compile, _.string('foo'), _.atLeast(4), _.toRegexString), '/(?:foo){4,}/')
      })
    })

    describe('between', () => {
      it('should match the preceding value between the specified minimum and maximum number of times', () => {
        assert.strictEqual(pipe(_.compile, _.string('foo'), _.between(1, 9), _.toRegexString), '/(?:foo){1,9}/')
      })
    })

    describe('betweenLazy', () => {
      it('should lazily match the preceding value between the specified minimum and maximum number of times', () => {
        assert.strictEqual(pipe(_.compile, _.string('foo'), _.betweenLazy(1, 9), _.toRegexString), '/(?:foo){1,9}?/')
      })
    })

    describe('beginCapture & endCapture', () => {
      it('should begin and end a capturing group', () => {
        assert.strictEqual(
          pipe(_.compile, _.beginCapture, _.string('foo'), _.endCapture, _.toRegexString),
          '/((?:foo))/'
        )
      })
    })
  })

  describe('complex expressions', () => {
    it('should handle complex expressions', () => {
      const expression = pipe(
        _.compile,
        _.startOfInput,
        _.string('http'),
        _.maybe('s'),
        _.string('://'),
        _.maybe('www.'),
        _.anythingBut(' '),
        _.endOfInput
      )

      assert.strictEqual(pipe(expression, _.toRegexString), '/^(?:http)(?:s)?(?:\\:\\/\\/)(?:www\\.)?(?:[^ ]*)$/')

      assert.strictEqual(pipe(expression, _.toRegex).test('https://www.google.com'), true)
      assert.strictEqual(pipe(expression, _.toRegex).test('https://google.com'), true)
      assert.strictEqual(pipe(expression, _.toRegex).test('http://google.com'), true)
      assert.strictEqual(pipe(expression, _.toRegex).test('http:/google.com'), false)
      assert.strictEqual(pipe(expression, _.toRegex).test('http://goog le.com'), false)
    })
  })
})
