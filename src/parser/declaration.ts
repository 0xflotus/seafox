import { nextToken } from '../scanner/scan';
import { Token } from '../token';
import { Errors, report } from '../errors';
import * as ESTree from './estree';
import { ScopeState, ScopeKind, addVarName, addBlockName, declareUnboundVariable } from './scope';
import {
  ParserState,
  Context,
  BindingKind,
  FunctionFlag,
  ClassFlags,
  Origin,
  expectSemicolon,
  setLoc,
  validateFunctionName,
  isStrictReservedWord,
  consumeOpt
} from './common';
import {
  parseFunctionLiteral,
  parseClassTail,
  parseIdentifierFromValue,
  parseBindingPattern,
  parseImportExpression,
  parseMemberExpression,
  parseExpressionStatement,
  parseAssignmentExpression,
  parseImportMetaExpression,
  parseExpression
} from './expressions';

/**
 * Parse function declaration
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param scope
 * @param flags FunctionFlag
 */
export function parseFunctionDeclaration(
  parser: ParserState,
  context: Context,
  scope: ScopeState,
  flags: FunctionFlag,
  origin: Origin
): ESTree.FunctionDeclaration {
  return parseFunctionDeclarationRest(parser, context, scope, flags, origin, parser.start, parser.line, parser.column);
}

/**
 * Parse async function declaration
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param scope ScopeState
 * @param flags FunctionFlag
 * @param origin Origin
 * @param start  Start position
 * @param line  Line position
 * @param column Column position
 */
export function parseFunctionDeclarationRest(
  parser: ParserState,
  context: Context,
  scope: ScopeState,
  flags: FunctionFlag,
  origin: Origin,
  start: number,
  line: number,
  column: number
): ESTree.FunctionDeclaration {
  nextToken(parser, context, /* allowRegExp */ 1);

  const isGenerator =
    flags & FunctionFlag.AllowGenerator && consumeOpt(parser, context, Token.Multiply, /* allowRegExp */ 0);
  const isAsync = flags & FunctionFlag.IsAsync ? 1 : 0;

  let id: ESTree.Identifier | null = null;
  let firstRestricted: Token | undefined;

  // Create a new parent function scope
  let parent: ScopeState = {
    parent: void 0,
    type: ScopeKind.Block
  };

  if (parser.token === Token.LeftParen) {
    if (flags & FunctionFlag.RequireIdentifier) report(parser, Errors.DeclNoName, 'Function');
  } else {
    const { token, tokenValue, start, line, column } = parser;

    validateFunctionName(parser, context | ((context & 0b0000000000000000000_1100_00000000) << 11), token);

    // In ES6, a function behaves as a lexical binding, except in
    // a script scope, or the initial scope of eval or another function.
    if ((origin & 0b00000000000000000000000000000100) > 0 && (context & 0b00000000000000000000100000000000) === 0) {
      addVarName(parser, context, scope, tokenValue, BindingKind.Variable);
    } else {
      addBlockName(parser, context, scope, tokenValue, BindingKind.FunctionLexical, origin);
    }

    if ((flags & 0b00000000000000000000000000010000) > 0) declareUnboundVariable(parser, tokenValue);

    parent = {
      parent,
      type: ScopeKind.FunctionRoot,
      scopeError: void 0
    };

    firstRestricted = token;

    nextToken(parser, context, /* allowRegExp */ 0);

    id = parseIdentifierFromValue(parser, context, tokenValue, start, line, column);
  }

  return parseFunctionLiteral(
    parser,
    ((context | 0b00000100111011000000000000000000) ^ 0b00000000111011000000000000000000) |
      ((isAsync * 2 + isGenerator) << 21),
    parent,
    id,
    firstRestricted,
    flags,
    'FunctionDeclaration',
    /* isMethod */ 0,
    start,
    line,
    column
  );
}

/**
 * Parse class declaration
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param scope Lexical scope
 * @param flags FunctionFlag
 */
export function parseClassDeclaration(
  parser: ParserState,
  context: Context,
  scope: ScopeState,
  flags: ClassFlags
): ESTree.ClassDeclaration {
  const { start, line, column } = parser;

  nextToken(parser, context | Context.AllowEscapedKeyword, /* allowRegExp */ 0);

  // Second set of context masks to fix 'super' edge cases
  const inheritedContext = (context | Context.InConstructor) ^ Context.InConstructor;

  context |= Context.Strict;

  let id: ESTree.Identifier | null = null;

  if (
    parser.token & (Token.Keyword | Token.FutureReserved | Token.IsIdentifier) &&
    parser.token !== Token.ExtendsKeyword
  ) {
    const { token, start, line, column, tokenValue } = parser;

    if (isStrictReservedWord(parser, context, token, 0)) report(parser, Errors.UnexpectedStrictReserved);

    // A named class creates a new lexical scope with a const binding of the
    // class name for the "inner name".
    addBlockName(parser, context, scope, tokenValue, BindingKind.Class, Origin.None);

    if (flags & ClassFlags.Export) declareUnboundVariable(parser, tokenValue);

    nextToken(parser, context, /* allowRegExp */ 0);

    id = parseIdentifierFromValue(parser, context, tokenValue, start, line, column);
  } else {
    // Only under the "export default" context, class declaration does not require the class name.
    //
    //     ExportDeclaration:
    //         ...
    //         export default ClassDeclaration[~Yield, +Default]
    //         ...
    //
    //     ClassDeclaration[Yield, Default]:
    //         ...
    //         [+Default] class ClassTail[?Yield]
    //
    if ((flags & 0b00000000000000000000000000000001) === 0) report(parser, Errors.DeclNoName, 'Class');
  }

  return parseClassTail(
    parser,
    context,
    inheritedContext,
    id,
    0,
    1,
    'ClassDeclaration',
    start,
    line,
    column
  ) as ESTree.ClassDeclaration;
}

/**
 * Parse variable statement or lexical declaration
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param kind BindingKind
 * @param origin Origin
 */
export function parseVariableStatementOrLexicalDeclaration(
  parser: ParserState,
  context: Context,
  scope: ScopeState,
  kind: BindingKind,
  origin: Origin
): ESTree.VariableDeclaration {
  const { start, line, column } = parser;

  nextToken(parser, context | Context.AllowEscapedKeyword, /* allowRegExp */ 0);

  const declarations = parseVariableDeclarationListAndDeclarator(parser, context, scope, kind, origin);

  expectSemicolon(parser, context);

  return context & Context.OptionsLoc
    ? {
        type: 'VariableDeclaration',
        kind: kind & BindingKind.Const ? 'const' : kind & BindingKind.Let ? 'let' : 'var',
        declarations,
        start,
        end: parser.endIndex,
        loc: setLoc(parser, line, column)
      }
    : {
        type: 'VariableDeclaration',
        kind: kind & BindingKind.Const ? 'const' : kind & BindingKind.Let ? 'let' : 'var',
        declarations
      };
}

/**
 * Parse variable declaration list and variable declarator
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param kind VarKind
 * @param origin Origin
 */
export function parseVariableDeclarationListAndDeclarator(
  parser: ParserState,
  context: Context,
  scope: ScopeState,
  kind: BindingKind,
  origin: Origin
): ESTree.VariableDeclarator[] {
  let id: ESTree.BindingName;
  let type: BindingKind;
  let init: ESTree.Expression | null = null;

  const list: ESTree.VariableDeclarator[] = [];

  while (parser.token !== Token.Comma) {
    const { start, line, column } = parser;

    // This little 'trick' speeds up the validation below
    type =
      kind |
      ((parser.token & 0b00000010000000000000000000000000) === 0b00000010000000000000000000000000
        ? BindingKind.Pattern
        : 0);

    id = parseBindingPattern(parser, context, scope, kind, origin);

    // Always set the 'initializer' to 'null' for each iteration
    init = null;

    if (parser.token === Token.Assign) {
      nextToken(parser, context, /* allowRegExp */ 1);
      init = parseExpression(parser, context, 0);
    } else if (
      (type & 0b00000000000000000000010000100000) !== 0 &&
      (parser.token & 0b00000000010000000000000000000000) !== 0b00000000010000000000000000000000
    ) {
      report(parser, Errors.DeclarationMissingInitializer, kind & BindingKind.Const ? 'const' : 'destructuring');
    }

    list.push(
      context & Context.OptionsLoc
        ? {
            type: 'VariableDeclarator',
            init,
            id,
            start,
            end: parser.endIndex,
            loc: setLoc(parser, line, column)
          }
        : {
            type: 'VariableDeclarator',
            init,
            id
          }
    );

    if ((parser.token as Token) !== Token.Comma) break;

    nextToken(parser, context, /* allowRegExp */ 1);
  }

  return list;
}

export function parseImportCallDeclaration(
  parser: ParserState,
  context: Context,
  start: number,
  line: number,
  column: number
): ESTree.ExpressionStatement {
  let expr: any = parseImportExpression(parser, context, start, line, column);
  /** MemberExpression :
   *   1. PrimaryExpression
   *   2. MemberExpression [ AssignmentExpression ]
   *   3. MemberExpression . IdentifierName
   *   4. MemberExpression TemplateLiteral
   *
   * CallExpression :
   *   1. MemberExpression Arguments
   *   2. CallExpression ImportCall
   *   3. CallExpression Arguments
   *   4. CallExpression [ AssignmentExpression ]
   *   5. CallExpression . IdentifierName
   *   6. CallExpression TemplateLiteral
   *
   *  UpdateExpression ::
   *   ('++' | '--')? LeftHandSideExpression
   *
   */

  expr = parseMemberExpression(parser, context, expr, 1, 0, start, line, column);

  /**
   * ExpressionStatement[Yield, Await]:
   *  [lookahead ∉ { {, function, async [no LineTerminator here] function, class, let [ }]Expression[+In, ?Yield, ?Await]
   */
  return parseExpressionStatement(parser, context, expr, start, line, column);
}

export function parseImportMetaDeclaration(
  parser: ParserState,
  context: Context,
  start: number,
  line: number,
  column: number
): ESTree.ExpressionStatement {
  let expr: any =
    context & Context.OptionsLoc
      ? {
          type: 'Identifier',
          name: 'import',
          start,
          end: parser.endIndex,
          loc: setLoc(parser, line, column)
        }
      : {
          type: 'Identifier',
          name: 'import'
        };

  expr = parseImportMetaExpression(parser, context, expr, start, line, column);

  /** MemberExpression :
   *   1. PrimaryExpression
   *   2. MemberExpression [ AssignmentExpression ]
   *   3. MemberExpression . IdentifierName
   *   4. MemberExpression TemplateLiteral
   *
   * CallExpression :
   *   1. MemberExpression Arguments
   *   2. CallExpression ImportCall
   *   3. CallExpression Arguments
   *   4. CallExpression [ AssignmentExpression ]
   *   5. CallExpression . IdentifierName
   *   6. CallExpression TemplateLiteral
   *
   *  UpdateExpression ::
   *   ('++' | '--')? LeftHandSideExpression
   */

  expr = parseMemberExpression(parser, context, expr, 1, 0, start, line, column);

  /** AssignmentExpression :
   *   1. ConditionalExpression
   *   2. LeftHandSideExpression = AssignmentExpression
   */

  expr = parseAssignmentExpression(parser, context, 0, 0, expr, start, line, column);

  /**
   * ExpressionStatement[Yield, Await]:
   *  [lookahead ∉ { {, function, async [no LineTerminator here] function, class, let [ }]Expression[+In, ?Yield, ?Await]
   */

  return parseExpressionStatement(parser, context, expr, start, line, column);
}
