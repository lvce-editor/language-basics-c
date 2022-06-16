/**
 * @enum number
 */
export const State = {
  TopLevelContent: 1,
  AfterInclude: 2,
  InsideLineComment: 3,
  InsideDoubleQuoteString: 4,
}

export const StateMap = {
  [State.TopLevelContent]: 'TopLevelContent',
  [State.AfterInclude]: 'AfterInclude',
  [State.InsideLineComment]: 'InsideLineComment',
  [State.InsideDoubleQuoteString]: 'InsideDoubleQuoteString',
}

/**
 * @enum number
 */
export const TokenType = {
  Whitespace: 2,
  Punctuation: 3,
  CurlyOpen: 6,
  CurlyClose: 7,
  PropertyColon: 8,
  VariableName: 10,
  None: 57,
  Unknown: 881,
  Numeric: 883,
  NewLine: 884,
  Include: 885,
  Import: 886,
  Keyword: 887,
  Comment: 888,
  PunctuationString: 889,
  String: 890,
  PlainText: 891,
}

export const TokenMap = {
  [TokenType.Whitespace]: 'Whitespace',
  [TokenType.Punctuation]: 'Punctuation',
  [TokenType.CurlyOpen]: 'Punctuation',
  [TokenType.PropertyColon]: 'Punctuation',
  [TokenType.VariableName]: 'VariableName',
  [TokenType.None]: 'None',
  [TokenType.Unknown]: 'Unknown',
  [TokenType.Numeric]: 'Numeric',
  [TokenType.NewLine]: 'NewLine',
  [TokenType.Include]: 'Include',
  [TokenType.Import]: 'Import',
  [TokenType.Keyword]: 'Keyword',
  [TokenType.Comment]: 'Comment',
  [TokenType.PunctuationString]: 'PunctuationString',
  [TokenType.String]: 'String',
  [TokenType.PlainText]: 'PlainText',
}

const RE_SELECTOR = /^[\.a-zA-Z\d\-\:>]+/
const RE_WHITESPACE = /^ +/
const RE_CURLY_OPEN = /^\{/
const RE_CURLY_CLOSE = /^\}/
const RE_PROPERTY_NAME = /^[a-zA-Z\-]+\b/
const RE_COLON = /^:/
const RE_PROPERTY_VALUE = /^[^;]+/
const RE_SEMICOLON = /^;/
const RE_COMMA = /^,/
const RE_ANYTHING = /^.*/
const RE_NUMERIC = /^(([0-9]+\.?[0-9]*)|(\.[0-9]+))/
const RE_ANYTHING_UNTIL_CLOSE_BRACE = /^[^\}]+/
const RE_INCLUDE = /^#include\b/
const RE_IMPORT = /^<[^>]*>/
const RE_KEYWORD =
  /^(?:while|volatile|void|unsigned|union|typedef|switch|struct|static|sizeof|signed|short|return|register|long|int|if|goto|for|float|extern|enum|else|double|do|default|continue|const|char|case|break|auto)\b/
const RE_LINE_COMMENT_START = /^\/\//
const RE_ANYTHING_UNTIL_END = /^.+/s
const RE_VARIABLE_NAME = /^[a-zA-Z][a-zA-Z\d\_]*/
const RE_PUNCTUATION = /^[\(\)=\+\-><\.:\/\{\};,\[\]\*]/
const RE_DOUBLE_QUOTE = /^"/
const RE_STRING_DOUBLE_QUOTE_CONTENT = /^[^"]+/

export const initialLineState = {
  state: State.TopLevelContent,
  tokens: [],
}

export const isEqualLineState = (lineStateA, lineStateB) => {
  return lineStateA.state === lineStateB.state
}

/**
 * @param {string} line
 */
export const tokenizeLine = (line, lineState) => {
  let next = null
  let index = 0
  let tokens = []
  let token = TokenType.None
  let state = lineState.state
  while (index < line.length) {
    const part = line.slice(index)
    switch (state) {
      case State.TopLevelContent:
        if ((next = part.match(RE_KEYWORD))) {
          token = TokenType.Keyword
          state = State.TopLevelContent
        } else if ((next = part.match(RE_WHITESPACE))) {
          token = TokenType.Whitespace
          state = State.TopLevelContent
        } else if ((next = part.match(RE_VARIABLE_NAME))) {
          token = TokenType.VariableName
          state = State.TopLevelContent
        } else if ((next = part.match(RE_DOUBLE_QUOTE))) {
          token = TokenType.PunctuationString
          state = State.InsideDoubleQuoteString
        } else if ((next = part.match(RE_INCLUDE))) {
          token = TokenType.Include
          state = State.AfterInclude
        } else if ((next = part.match(RE_LINE_COMMENT_START))) {
          token = TokenType.Comment
          state = State.InsideLineComment
        } else if ((next = part.match(RE_PUNCTUATION))) {
          token = TokenType.Punctuation
          state = State.TopLevelContent
        } else if ((next = part.match(RE_NUMERIC))) {
          token = TokenType.Numeric
          state = State.TopLevelContent
        } else if ((next = part.match(RE_ANYTHING_UNTIL_END))) {
          token = TokenType.PlainText
          state = State.TopLevelContent
        } else {
          part //?
          throw new Error('no')
        }
        break
      case State.AfterInclude:
        if ((next = part.match(RE_WHITESPACE))) {
          token = TokenType.Whitespace
          state = State.AfterInclude
        } else if ((next = part.match(RE_IMPORT))) {
          token = TokenType.Import
          state = State.TopLevelContent
        } else {
          throw new Error('no')
        }
        break
      case State.InsideLineComment:
        if ((next = part.match(RE_ANYTHING_UNTIL_END))) {
          token = TokenType.Comment
          state = State.TopLevelContent
        } else {
          throw new Error('no')
        }
        break
      case State.InsideDoubleQuoteString:
        if ((next = part.match(RE_STRING_DOUBLE_QUOTE_CONTENT))) {
          token = TokenType.String
          state = State.InsideDoubleQuoteString
        } else if ((next = part.match(RE_DOUBLE_QUOTE))) {
          token = TokenType.PunctuationString
          state = State.TopLevelContent
        } else {
          throw new Error('no')
        }
        break
      default:
        throw new Error('no')
    }
    index += next[0].length
    tokens.push({
      type: token,
      length: next[0].length,
    })
  }
  return {
    state,
    tokens,
  }
}
