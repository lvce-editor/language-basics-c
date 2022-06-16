import {
  initialLineState,
  State,
  tokenizeLine,
  TokenMap,
  TokenType,
} from '../src/tokenizeC.js'

const DEBUG = true

const expectTokenize = (text, state = initialLineState.state) => {
  const lineState = {
    state,
  }
  const tokens = []
  const lines = text.split('\n')
  for (let i = 0; i < lines.length; i++) {
    const result = tokenizeLine(lines[i], lineState)
    lineState.state = result.state
    tokens.push(...result.tokens.map((token) => token.type))
    tokens.push(TokenType.NewLine)
  }
  tokens.pop()
  return {
    toEqual(...expectedTokens) {
      if (DEBUG) {
        expect(tokens.map((token) => TokenMap[token])).toEqual(
          expectedTokens.map((token) => TokenMap[token])
        )
      } else {
        expect(tokens).toEqual(expectedTokens)
      }
    },
  }
}

test('empty', () => {
  expectTokenize(``).toEqual()
})

test('whitespace', () => {
  expectTokenize(' ').toEqual(TokenType.Whitespace)
})

test('keywords', () => {
  // see https://www.programiz.com/c-programming/list-all-keywords-c-language
  expectTokenize('auto').toEqual(TokenType.Keyword)
  expectTokenize('break').toEqual(TokenType.Keyword)
  expectTokenize('case').toEqual(TokenType.Keyword)
  expectTokenize('char').toEqual(TokenType.Keyword)
  expectTokenize('const').toEqual(TokenType.Keyword)
  expectTokenize('continue').toEqual(TokenType.Keyword)
  expectTokenize('default').toEqual(TokenType.Keyword)
  expectTokenize('do').toEqual(TokenType.Keyword)
  expectTokenize('double').toEqual(TokenType.Keyword)
  expectTokenize('else').toEqual(TokenType.Keyword)
  expectTokenize('enum').toEqual(TokenType.Keyword)
  expectTokenize('extern').toEqual(TokenType.Keyword)
  expectTokenize('float').toEqual(TokenType.Keyword)
  expectTokenize('for').toEqual(TokenType.Keyword)
  expectTokenize('goto').toEqual(TokenType.Keyword)
  expectTokenize('if').toEqual(TokenType.Keyword)
  expectTokenize('int').toEqual(TokenType.Keyword)
  expectTokenize('long').toEqual(TokenType.Keyword)
  expectTokenize('register').toEqual(TokenType.Keyword)
  expectTokenize('return').toEqual(TokenType.Keyword)
  expectTokenize('short').toEqual(TokenType.Keyword)
  expectTokenize('signed').toEqual(TokenType.Keyword)
  expectTokenize('sizeof').toEqual(TokenType.Keyword)
  expectTokenize('static').toEqual(TokenType.Keyword)
  expectTokenize('struct').toEqual(TokenType.Keyword)
  expectTokenize('switch').toEqual(TokenType.Keyword)
  expectTokenize('typedef').toEqual(TokenType.Keyword)
  expectTokenize('union').toEqual(TokenType.Keyword)
  expectTokenize('unsigned').toEqual(TokenType.Keyword)
  expectTokenize('void').toEqual(TokenType.Keyword)
  expectTokenize('volatile').toEqual(TokenType.Keyword)
  expectTokenize('while').toEqual(TokenType.Keyword)
})

test('include', () => {
  expectTokenize(`#include <stdio.h>`).toEqual(
    TokenType.Include,
    TokenType.Whitespace,
    TokenType.Import
  )
})

test('line comment', () => {
  expectTokenize(`// comment`).toEqual(TokenType.Comment, TokenType.Comment)
})

test('variable name', () => {
  expectTokenize(`int x`).toEqual(
    TokenType.Keyword,
    TokenType.Whitespace,
    TokenType.VariableName
  )
})

test('punctuation', () => {
  expectTokenize(`( ) { } ;`).toEqual(
    TokenType.Punctuation,
    TokenType.Whitespace,
    TokenType.Punctuation,
    TokenType.Whitespace,
    TokenType.Punctuation,
    TokenType.Whitespace,
    TokenType.Punctuation,
    TokenType.Whitespace,
    TokenType.Punctuation
  )
})

test('double quoted string', () => {
  expectTokenize(`"hello world"`).toEqual(
    TokenType.PunctuationString,
    TokenType.String,
    TokenType.PunctuationString
  )
})

test('integer number', () => {
  expectTokenize(`0`).toEqual(TokenType.Numeric)
})

test('emoji', () => {
  expectTokenize(`😀`).toEqual(TokenType.PlainText)
})

test('hello world program', () => {
  expectTokenize(`#include <stdio.h>
int main() {
    printf("Hello, World!");
    return 0;
}
`).toEqual(
    TokenType.Include,
    TokenType.Whitespace,
    TokenType.Import,
    TokenType.NewLine,
    TokenType.Keyword,
    TokenType.Whitespace,
    TokenType.VariableName,
    TokenType.Punctuation,
    TokenType.Punctuation,
    TokenType.Whitespace,
    TokenType.Punctuation,
    TokenType.NewLine,
    TokenType.Whitespace,
    TokenType.VariableName,
    TokenType.Punctuation,
    TokenType.PunctuationString,
    TokenType.String,
    TokenType.PunctuationString,
    TokenType.Punctuation,
    TokenType.Punctuation,
    TokenType.NewLine,
    TokenType.Whitespace,
    TokenType.Keyword,
    TokenType.Whitespace,
    TokenType.Numeric,
    TokenType.Punctuation,
    TokenType.NewLine,
    TokenType.Punctuation,
    TokenType.NewLine
  )
})

test('function with multiple arguments', () => {
  expectTokenize(`int main(int argc, char const *argv[])`).toEqual(
    TokenType.Keyword,
    TokenType.Whitespace,
    TokenType.VariableName,
    TokenType.Punctuation,
    TokenType.Keyword,
    TokenType.Whitespace,
    TokenType.VariableName,
    TokenType.Punctuation,
    TokenType.Whitespace,
    TokenType.Keyword,
    TokenType.Whitespace,
    TokenType.Keyword,
    TokenType.Whitespace,
    TokenType.Punctuation,
    TokenType.VariableName,
    TokenType.Punctuation,
    TokenType.Punctuation,
    TokenType.Punctuation
  )
})
