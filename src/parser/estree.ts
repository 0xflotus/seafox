export interface _Node {
  start?: number;
  end?: number;
  loc?: SourceLocation | null;
}

export interface SourceLocation {
  source?: string | null;
  start: Position;
  end: Position;
}

export interface Position {
  /** >= 1 */
  line: number;
  /** >= 0 */
  column: number;
}

export type CommentType = 'Line' | 'Block' | 'HTMLOpen' | 'HTMLClose';

export interface Comment extends _Node {
  type: CommentType;
  value: string;
  start?: number;
  end?: number;
  loc?: SourceLocation | null;
}

export interface Program extends _Node {
  type: 'Program';
  body: Statement[];
  sourceType: 'module' | 'script';
}

export type Node =
  | ArrayExpression
  | ArrayPattern
  | ArrowFunctionExpression
  | AssignmentExpression
  | AssignmentPattern
  | AwaitExpression
  | BigIntLiteral
  | BinaryExpression
  | BlockStatement
  | BreakStatement
  | CallExpression
  | CatchClause
  | ClassBody
  | ClassDeclaration
  | ClassExpression
  | ConditionalExpression
  | ContinueStatement
  | DebuggerStatement
  | DoWhileStatement
  | EmptyStatement
  | ExportAllDeclaration
  | ExportDefaultDeclaration
  | ExportNamedDeclaration
  | ExportNamespaceSpecifier
  | ExportSpecifier
  | ExpressionStatement
  | ForInStatement
  | ForOfStatement
  | ForStatement
  | FunctionDeclaration
  | FunctionExpression
  | Identifier
  | IfStatement
  | Import
  | ImportDeclaration
  | ImportDefaultSpecifier
  | ImportNamespaceSpecifier
  | ImportSpecifier
  | ImportExpression
  | JSXAttribute
  | JSXClosingElement
  | JSXClosingFragment
  | JSXElement
  | JSXEmptyExpression
  | JSXExpressionContainer
  | JSXFragment
  | JSXIdentifier
  | JSXNamespacedName
  | JSXOpeningElement
  | JSXOpeningFragment
  | JSXSpreadAttribute
  | JSXSpreadChild
  | JSXMemberExpression
  | JSXText
  | LabeledStatement
  | Literal
  | LogicalExpression
  | ChainingExpression
  | Chain
  | MemberExpression
  | MetaProperty
  | MethodDefinition
  | NewExpression
  | ObjectExpression
  | ObjectPattern
  | Program
  | ParenthesizedExpression
  | Property
  | RestElement
  | ReturnStatement
  | SequenceExpression
  | SpreadElement
  | Super
  | SwitchCase
  | SwitchStatement
  | TaggedTemplateExpression
  | TemplateElement
  | TemplateLiteral
  | ThisExpression
  | ThrowStatement
  | TryStatement
  | UpdateExpression
  | UnaryExpression
  | VariableDeclaration
  | VariableDeclarator
  | WhileStatement
  | WithStatement
  | YieldExpression;

export type BindingPattern = ArrayPattern | ObjectPattern;
export type BindingName = BindingPattern | Identifier;
export type ClassElement = FunctionExpression | MethodDefinition;
export type ExportDeclaration = ClassDeclaration | ClassExpression | FunctionDeclaration | VariableDeclaration;
export type Expression =
  | ArrowFunctionExpression
  | AssignmentExpression
  | BinaryExpression
  | ConditionalExpression
  | JSXClosingElement
  | JSXClosingFragment
  | JSXExpressionContainer
  | JSXOpeningElement
  | JSXOpeningFragment
  | JSXSpreadChild
  | LogicalExpression
  | NewExpression
  | RestElement
  | SequenceExpression
  | SpreadElement
  | UnaryExpression
  | YieldExpression;

export type ForInitialiser = Expression | VariableDeclaration;
export type ImportClause = ImportDefaultSpecifier | ImportNamespaceSpecifier | ImportSpecifier;
export type IterationStatement = DoWhileStatement | ForInStatement | ForOfStatement | ForStatement | WhileStatement;
export type JSXChild = JSXElement | JSXExpression | JSXFragment | JSXText;
export type JSXExpression = JSXEmptyExpression | JSXSpreadChild | JSXExpressionContainer;
export type JSXTagNameExpression = JSXIdentifier | JSXMemberExpression;
export type LeftHandSideExpression =
  | CallExpression
  | ClassExpression
  | ClassDeclaration
  | FunctionExpression
  | LiteralExpression
  | ChainingExpression
  | Chain
  | MemberExpression
  | PrimaryExpression
  | TaggedTemplateExpression;
export type LiteralExpression = BigIntLiteral | Literal | TemplateLiteral;
export type ObjectLiteralElementLike = MethodDefinition | Property | SpreadElement;
export type Parameter = AssignmentPattern | RestElement | ArrayPattern | ObjectPattern | Identifier;
export type DestructuringPattern =
  | Identifier
  | ObjectPattern
  | ArrayPattern
  | RestElement
  | AssignmentPattern
  | MemberExpression;
export type PrimaryExpression =
  | ArrayExpression
  | ArrayPattern
  | ClassExpression
  | FunctionExpression
  | Identifier
  | Import
  | JSXElement
  | JSXFragment
  | JSXOpeningElement
  | Literal
  | LiteralExpression
  | MetaProperty
  | ObjectExpression
  | ObjectPattern
  | Super
  | TemplateLiteral
  | ThisExpression;
export type PropertyName = Expression;
export type Statement =
  | BlockStatement
  | BreakStatement
  | ContinueStatement
  | DebuggerStatement
  | FunctionDeclaration
  | EmptyStatement
  | ExpressionStatement
  | IfStatement
  | IterationStatement
  | ImportDeclaration
  | LabeledStatement
  | ModuleBlock
  | ReturnStatement
  | SwitchStatement
  | ThrowStatement
  | TryStatement
  | VariableDeclaration
  | WithStatement;

interface ClassDeclarationBase extends _Node {
  id: Identifier | null;
  body: ClassBody;
  superClass?: LeftHandSideExpression | null;
}

export interface ArrayExpression extends _Node {
  type: 'ArrayExpression';
  elements: (Expression | SpreadElement | null)[];
}

export interface ArrayPattern extends _Node {
  type: 'ArrayPattern';
  elements: (DestructuringPattern | null)[];
}

export interface ArrowFunctionExpression extends _Node {
  type: 'ArrowFunctionExpression';
  params: Parameter[];
  body: Expression | BlockStatement;
  async: boolean;
  expression: boolean;
}

export type AssignmentOperator =
  | '='
  | '<<='
  | '>>='
  | '>>>='
  | '**='
  | '+='
  | '-='
  | '*='
  | '/='
  | '%='
  | '^='
  | '|='
  | '&=';

export interface AssignmentExpression extends _Node {
  type: 'AssignmentExpression';
  operator: AssignmentOperator;
  left: Expression;
  right: Expression;
}

export interface AssignmentPattern extends _Node {
  type: 'AssignmentPattern';
  left: BindingName;
  right?: Expression;
}

export interface AwaitExpression extends _Node {
  type: 'AwaitExpression';
  argument: Expression;
}

export interface BigIntLiteral extends _Node {
  type: 'BigIntLiteral';
  raw?: string;
  value: number | null;
}

export interface BinaryExpression extends _Node {
  type: 'BinaryExpression';
  operator: string;
  left: Expression;
  right: Expression;
}

export interface BlockStatement extends _Node {
  type: 'BlockStatement';
  body: Statement[];
}

export interface BreakStatement extends _Node {
  type: 'BreakStatement';
  label: Identifier | null;
}

export interface ImportExpression extends _Node {
  type: 'ImportExpression';
  source: Expression;
}

export interface CallExpression extends _Node {
  type: 'CallExpression';
  callee: LeftHandSideExpression;
  arguments: (Expression | SpreadElement)[];
  optional: boolean;
  shortCircuited: boolean;
}

export interface CatchClause extends _Node {
  type: 'CatchClause';
  param: BindingName | null;
  body: BlockStatement;
}

export interface ClassBody extends _Node {
  type: 'ClassBody';
  body: ClassElement[];
}

export interface ClassDeclaration extends ClassDeclarationBase {
  type: 'ClassDeclaration';
}

export interface ClassExpression extends ClassDeclarationBase {
  type: 'ClassExpression';
}

export interface ConditionalExpression extends _Node {
  type: 'ConditionalExpression';
  test: Expression;
  consequent: Expression;
  alternate: Expression;
}

export interface ContinueStatement extends _Node {
  type: 'ContinueStatement';
  label: Identifier | null;
}

export interface DebuggerStatement extends _Node {
  type: 'DebuggerStatement';
}

export interface DoWhileStatement extends _Node {
  type: 'DoWhileStatement';
  test: Expression;
  body: Statement;
}

export interface EmptyStatement extends _Node {
  type: 'EmptyStatement';
}

export interface ExportAllDeclaration extends _Node {
  type: 'ExportAllDeclaration';
  source: Expression | null;
  exported: Identifier | null;
}

export interface ExportDefaultDeclaration extends _Node {
  type: 'ExportDefaultDeclaration';
  declaration: ExportDeclaration | Expression;
}

export interface ExportNamespaceSpecifier extends _Node {
  type: 'ExportNamespaceSpecifier';
  specifier: Identifier;
}

export interface ExportNamedDeclaration extends _Node {
  type: 'ExportNamedDeclaration';
  declaration: ExportDeclaration | null;
  specifiers: (ExportNamespaceSpecifier | ExportSpecifier)[];
  source: Literal | null;
}

export interface ExportSpecifier extends _Node {
  type: 'ExportSpecifier';
  local: Identifier;
  exported: Identifier;
}

export interface ExpressionStatement extends _Node {
  type: 'ExpressionStatement';
  expression: Expression;
  directive?: string;
}

export interface ForInStatement extends _Node {
  type: 'ForInStatement';
  left: ForInitialiser;
  right: Expression;
  body: Statement;
}

export interface ForOfStatement extends _Node {
  type: 'ForOfStatement';
  left: ForInitialiser;
  right: Expression;
  body: Statement;
  await: boolean;
}

export interface ForStatement extends _Node {
  type: 'ForStatement';
  init: Expression | ForInitialiser | null;
  test: Expression | null;
  update: Expression | null;
  body: Statement;
}

export interface FunctionDeclaration extends _Node {
  type: 'FunctionDeclaration';
  id: Identifier | null;
  generator: boolean;
  async: boolean;
  params: Parameter[];
  body?: BlockStatement | null;
}

export interface FunctionExpression extends _Node {
  type: 'FunctionExpression';
  id: Identifier | null;
  generator: boolean;
  async: boolean;
  params: Parameter[];
  body?: BlockStatement | null;
}

export interface Identifier extends _Node {
  type: 'Identifier';
  name: string;
  pattern?: boolean;
}

export interface IfStatement extends _Node {
  type: 'IfStatement';
  test: Expression;
  consequent: Statement;
  alternate: Statement | null;
}

export interface Import extends _Node {
  type: 'Import';
}

export interface ImportDeclaration extends _Node {
  type: 'ImportDeclaration';
  source: Literal;
  specifiers: ImportClause[];
}

export interface ImportDefaultSpecifier extends _Node {
  type: 'ImportDefaultSpecifier';
  local: Identifier;
}

export interface ImportNamespaceSpecifier extends _Node {
  type: 'ImportNamespaceSpecifier';
  local: Identifier;
}

export interface ImportSpecifier extends _Node {
  type: 'ImportSpecifier';
  local: Identifier;
  imported: Identifier;
}

export interface JSXNamespacedName extends _Node {
  type: 'JSXNamespacedName';
  namespace: JSXIdentifier | JSXMemberExpression;
  name: JSXIdentifier;
}

export interface JSXAttribute extends _Node {
  type: 'JSXAttribute';
  name: JSXIdentifier;
  value: Literal | JSXExpression | null;
}

export interface JSXClosingElement extends _Node {
  type: 'JSXClosingElement';
  name: JSXTagNameExpression;
}

export interface JSXClosingFragment extends _Node {
  type: 'JSXClosingFragment';
}

export interface JSXElement extends _Node {
  type: 'JSXElement';
  openingElement: JSXOpeningElement;
  closingElement: JSXClosingElement | null;
  children: JSXChild[];
}

export interface JSXEmptyExpression extends _Node {
  type: 'JSXEmptyExpression';
}

export interface JSXExpressionContainer extends _Node {
  type: 'JSXExpressionContainer';
  expression: Expression | JSXEmptyExpression;
}

export interface JSXFragment extends _Node {
  type: 'JSXFragment';
  openingFragment: JSXOpeningFragment;
  closingFragment: JSXClosingFragment;
  children: JSXChild[];
}

export interface JSXIdentifier extends _Node {
  type: 'JSXIdentifier';
  name: string;
}

export interface JSXMemberExpression extends _Node {
  type: 'JSXMemberExpression';
  object: JSXTagNameExpression;
  property: JSXIdentifier;
}

export interface JSXOpeningElement extends _Node {
  type: 'JSXOpeningElement';
  selfClosing: boolean;
  name: JSXTagNameExpression;
  attributes: JSXAttribute[];
}

export interface JSXOpeningFragment extends _Node {
  type: 'JSXOpeningFragment';
}

export interface JSXSpreadAttribute extends _Node {
  type: 'JSXSpreadAttribute';
  argument: Expression;
}

export interface JSXSpreadChild extends _Node {
  type: 'JSXSpreadChild';
  expression: Expression | JSXEmptyExpression;
}

export interface JSXText extends _Node {
  type: 'JSXText';
  value: string;
  raw?: string;
}

export interface LabeledStatement extends _Node {
  type: 'LabeledStatement';
  label: Identifier;
  body: Statement;
}

export interface Literal extends _Node {
  type: 'Literal';
  raw?: string;
  value: boolean | number | RegExp | string | null;
  regex?: {
    pattern: string;
    flags: string;
  };
}

export type LogicalOperator = '||' | '&&' | '??';

export interface LogicalExpression extends _Node {
  type: 'LogicalExpression';
  operator: LogicalOperator;
  left: Expression;
  right: Expression;
}

export interface ChainingExpression extends _Node {
  type: 'ChainingExpression';
  base: Expression;
  chain: [Chain];
}

export interface Chain extends _Node {
  optional: boolean;
}

export interface MemberChain extends Chain {
  type: 'MemberChain';
  computed: boolean;
  property: Expression;
}

export interface CallChain extends Chain {
  type: 'CallChain';
  arguments: [Expression];
}

export interface MemberExpression extends _Node {
  type: 'MemberExpression';
  object: Expression | Super;
  property: Expression | Identifier;
  computed?: boolean;
  optional: boolean;
  shortCircuited: boolean;
}

export interface MetaProperty extends _Node {
  type: 'MetaProperty';
  meta: Identifier;
  property: Identifier;
}

export interface MethodDefinition extends _Node {
  type: 'MethodDefinition';
  key: PropertyName;
  value: FunctionExpression;
  computed: boolean;
  static: boolean;
  kind: 'method' | 'get' | 'set' | 'constructor';
}

export interface NewExpression extends _Node {
  type: 'NewExpression';
  callee: LeftHandSideExpression;
  arguments: Expression[];
}

export interface ObjectExpression extends _Node {
  type: 'ObjectExpression';
  properties: ObjectLiteralElementLike[];
}

export interface ObjectPattern extends _Node {
  type: 'ObjectPattern';
  properties: (Property | RestElement)[];
}

export interface ParenthesizedExpression extends _Node {
  type: 'ParenthesizedExpression';
  expression: Expression;
}

export interface Property extends _Node {
  type: 'Property';
  key: PropertyName;
  value: Expression | AssignmentPattern | BindingName;
  computed: boolean;
  method: boolean;
  shorthand: boolean;
  kind: 'init' | 'get' | 'set';
}

export interface RestElement extends _Node {
  type: 'RestElement';
  argument: DestructuringPattern;
  value?: AssignmentPattern;
}

export interface ReturnStatement extends _Node {
  type: 'ReturnStatement';
  argument: Expression | null;
}

export interface SequenceExpression extends _Node {
  type: 'SequenceExpression';
  expressions: Expression[];
}

export interface SpreadElement extends _Node {
  type: 'SpreadElement';
  argument: ArrayPattern | ObjectPattern | Identifier | Expression | Identifier | Literal;
}

export interface Super extends _Node {
  type: 'Super';
}

export interface SwitchCase extends _Node {
  type: 'SwitchCase';
  test: Expression | null;
  consequent: Statement[];
}

export interface SwitchStatement extends _Node {
  type: 'SwitchStatement';
  discriminant: Expression;
  cases: SwitchCase[];
}

export interface TaggedTemplateExpression extends _Node {
  type: 'TaggedTemplateExpression';
  tag: LeftHandSideExpression;
  quasi: TemplateLiteral;
}

export interface TemplateElement extends _Node {
  type: 'TemplateElement';
  value: {
    raw: string;
    cooked: string;
  };
  tail: boolean;
}

export interface TemplateLiteral extends _Node {
  type: 'TemplateLiteral';
  quasis: TemplateElement[];
  expressions: Expression[];
}

export interface ThisExpression extends _Node {
  type: 'ThisExpression';
}

export interface ThrowStatement extends _Node {
  type: 'ThrowStatement';
  argument: Statement | null;
}

export interface TryStatement extends _Node {
  type: 'TryStatement';
  block: BlockStatement;
  handler: CatchClause | null;
  finalizer: BlockStatement | null;
}

export interface ModuleBlock extends _Node {
  type: 'ModuleBlock';
  body: Statement[];
}

export interface NamespaceExportDeclaration extends _Node {
  type: 'NamespaceExportDeclaration';
  id: Identifier;
}

export type UnaryOperator = '-' | '+' | '!' | '~' | 'typeof' | 'void' | 'delete';
export type UpdateOperator = '++' | '--';

export interface UpdateExpression extends _Node {
  type: 'UpdateExpression';
  operator: string;
  prefix: boolean;
  argument: LeftHandSideExpression | Literal | UnaryExpression;
}

export interface UnaryExpression extends _Node {
  type: 'UnaryExpression';
  operator: UnaryOperator;
  prefix: boolean;
  argument: LeftHandSideExpression | Literal | UnaryExpression;
}

export type VariableDeclarationKind = 'let' | 'const' | 'var';

export interface VariableDeclaration extends _Node {
  type: 'VariableDeclaration';
  declarations: VariableDeclarator[];
  kind: VariableDeclarationKind;
}

export interface VariableDeclarator extends _Node {
  type: 'VariableDeclarator';
  id: BindingName;
  init: Expression | null;
}

export interface WhileStatement extends _Node {
  type: 'WhileStatement';
  test: Expression;
  body: Statement;
}

export interface WithStatement extends _Node {
  type: 'WithStatement';
  object: Expression;
  body: Statement;
}

export interface YieldExpression extends _Node {
  type: 'YieldExpression';
  delegate: boolean;
  argument: Expression | null;
}
