import { Context } from './parser/bits';
import { Options, create } from './parser/core';
import { Program } from './parser/estree';
import { nextToken } from './scanner/scan';
import { skipHashBang } from './scanner/comments';
import { parseModuleItemListAndDirectives } from './parser/module';
import { parseStatementList } from './parser/statements';
import { ScopeKind } from './parser/scope';
import { Errors, report } from './errors';

/**
 * Parse a script, optionally with various options.
 */
export function parseScript(source: string, options?: Options): Program {
  let context = Context.Empty;
  if (options != null) {
    if (options.next) context |= Context.OptionsNext;
    if (options.loc) context |= Context.OptionsLoc;
    if (options.disableWebCompat) context |= Context.OptionsDisableWebCompat;
    if (options.directives) context |= Context.OptionsDirectives | Context.OptionsRaw;
    if (options.raw) context |= Context.OptionsRaw;
    if (options.globalReturn) context |= Context.OptionsGlobalReturn;
    if (options.impliedStrict) context |= Context.Strict;
  }

  const parser = create(source);

  skipHashBang(parser, source);

  nextToken(parser, context | Context.AllowEscapedKeyword, /* allowRegExp */ 1);

  const body = parseStatementList(parser, context | Context.InGlobal, {
    parent: void 0,
    type: ScopeKind.Block
  });

  return context & Context.OptionsLoc
    ? {
        type: 'Program',
        sourceType: 'script',
        body,
        start: 0,
        end: source.length,
        loc: {
          start: {
            line: 1,
            column: 0
          },
          end: {
            line: parser.lineBase,
            column: parser.index - parser.offset
          }
        }
      }
    : {
        type: 'Program',
        sourceType: 'script',
        body
      };
}

/**
 * Parse a module, optionally with various options.
 */
export function parseModule(source: string, options?: Options): Program {
  let context = Context.Strict | Context.Module;

  if (options != null) {
    if (options.next) context |= Context.OptionsNext;
    if (options.loc) context |= Context.OptionsLoc;
    if (options.disableWebCompat) context |= Context.OptionsDisableWebCompat;
    if (options.directives) context |= Context.OptionsDirectives | Context.OptionsRaw;
    if (options.globalReturn) context |= Context.OptionsGlobalReturn;
    if (options.raw) context |= Context.OptionsRaw;
  }

  const parser = create(source);

  skipHashBang(parser, source);

  nextToken(parser, context | Context.AllowEscapedKeyword, /* allowRegExp */ 1);

  const scope = {
    parent: void 0,
    type: ScopeKind.Block
  };

  const body = parseModuleItemListAndDirectives(parser, context | Context.InGlobal, scope);

  for (const key in parser.exportedBindings) {
    if (key[0] === '#' && !(scope as any)[key]) report(parser, Errors.UndeclaredExportedBinding, key.slice(1));
  }
  return context & Context.OptionsLoc
    ? {
        type: 'Program',
        sourceType: 'module',
        body,
        start: 0,
        end: source.length,
        loc: {
          start: {
            line: 1,
            column: 0
          },
          end: {
            line: parser.lineBase,
            column: parser.index - parser.offset
          }
        }
      }
    : {
        type: 'Program',
        sourceType: 'module',
        body
      };
}

/**
 * Parse a module or a script, optionally with various options.
 */
export function parse(source: string, options?: Options): Program {
  return options && options.module ? parseModule(source, options) : parseScript(source, options);
}
