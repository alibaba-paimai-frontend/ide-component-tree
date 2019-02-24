import { isExist, uniq } from 'ide-lib-utils';
import { debugError } from './debug';
var esprima = require('esprima');
var estraverse = require('estraverse-fb');

const CONFIG_BABEL = {
  presets: ['es2015', 'stage-2', 'react']
};

declare const Babel: any;

// 属性函数放在全局变量 window 下
export const REG_FN_GLOBAL = /window\[\'(__[\w_\-\$@]+)\'\]/gi;

// 属性函数属性以 `__` 开头
export const REG_FN_ATTR = /\"(__[\w\-_\$@]+)\"/gi;

// 函数抽取的信息
export interface IFunctionInfo {
  name: string;
  loc: boolean;
  range: number[];
  content: string;
  fnBody: string;
}

export interface IFunctionSet {
  [propName: string]: IFunctionInfo | false;
}

export default class REPL {
  astConfig: object;
  code: string;
  ast: object;
  constructor(code?: string, astConfig?: object) {
    // http://esprima.readthedocs.io/en/4.0/syntactic-analysis.html
    this.astConfig = Object.assign(
      {},
      {
        jsx: true,
        loc: true,
        range: true
      },
      astConfig
    );

    this.code = code;

    // 解析获取语法树
    this.ast = this.code ? esprima.parseScript(this.code, this.astConfig) : {};
  }

  static babelCompile(code: string) {
    try {
      if (!isExist(Babel)) {
        debugError('Babel 还没初始化完成，不存在 Babel 对象');
        return code;
      }
      return Babel.transform(code, CONFIG_BABEL).code;
    } catch (err) {
      debugError('Babel 编译出错: %o', err);
      alert(`Babel 编译出错: ${JSON.stringify(err)}`);
      return code;
    }
  }

  // 遍历AST函数
  traverse(fns: object) {
    if (!this.code || !this.ast) {
      return;
    }
    estraverse.traverse(this.ast, fns);
    return this;
  }

  /* ----------------------------------------------------
        实用函数
    ----------------------------------------------------- */

  // 获取函数位置
  extractFunctionByName = (name: string): IFunctionInfo | false => {
    if (!name) return false;

    let info: IFunctionInfo = {
      name: name,
      loc: false,
      range: [],
      content: '',
      fnBody: ''
    };

    this.traverse({
      enter: (node: any, parent: any) => {
        // 获取函数
        if (node.type == 'MemberExpression' && node.property.value == name) {
          info.loc = parent.loc;
          info.range = parent.range;
          info.content = this.code.slice(info.range[0], info.range[1]);
          let rightRange = parent.right.range; // 函数体的范围
          info.fnBody = this.code.slice(rightRange[0], rightRange[1]);
        }
      }
    });

    return info;
  };

  /**
   * 提取 window 下所有的函数名声明
   * 约定所有的自定义函数都是以 `window.__` 开始的
   *
   * @export
   * @param {string} events
   * @returns {string[]}
   */
  static extractFunctionNames = (
    str: string,
    reg: RegExp = REG_FN_GLOBAL
  ): string[] => {
    let names = [];
    let result;
    while ((result = reg.exec(str)) !== null) {
      names.push(result[1]); // 将第一个分组放入到结果集中
    }
    return uniq(names);
  };

  extractAllFunction = (): IFunctionSet => {
    let fns: IFunctionSet = {};
    REPL.extractFunctionNames(this.code).forEach(name => {
      fns[name] = this.extractFunctionByName(name);
    });

    return fns;
  };
}

/**
 * 从字符串中提取出所有的函数（从函数面板中）
 *
 * @export
 * @param {string} events
 * @returns {IFunctionSet}
 */
export function extractFunctionsFromWindowString(str: string): IFunctionSet {
  // 获取回调函数，进行解析
  const repl = new REPL(str); // 扔到解析器中
  return repl.extractAllFunction(); // 提取出所有函数对象
}

/**
 * 从属性字符串中解析获得所有的函数名
 *
 * @export
 * @param {string} str
 * @returns {string[]}
 */
export function extractFunctionNamesFromAttr(str: string): string[] {
  return REPL.extractFunctionNames(str, REG_FN_ATTR);
}
