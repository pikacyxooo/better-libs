/**
 * @return 浏览器类型
 */
export const detectCSSPrefix = function (): { css: string; js: string } {
  if (!window.getComputedStyle) {
    return { css: '', js: '' };
  }
  const mapJsObj = {
    '-webkit-': 'webkit',
    '-moz-': 'Moz',
    '-ms-': 'ms',
    '-o-': 'O',
  };
  let obj = { css: '', js: '' };
  let prefix: any;
  const rxPrefixes = /^(?:O|Moz|webkit|ms)|(?:-(?:o|moz|webkit|ms)-)/;
  const styles = window.getComputedStyle(document.createElement('div'), null);
  for (let style in styles) {
    prefix =
      style.match(rxPrefixes) ||
      (+style === (style as unknown) && styles[style].match(rxPrefixes));
    if (prefix) {
      break;
    }
  }

  prefix = prefix[0];
  if (prefix.slice(0, 1) === '-') {
    obj['css'] = prefix;
    obj['js'] = mapJsObj[prefix];
  } else {
    obj['css'] = `-${prefix.toLowerCase()}-`;
    obj['js'] = prefix;
  }
  return obj;
};

/**
 * 添加css前缀
 * @param dom dom节点
 * @param cssProp css属性
 * @param val css属性值
 */
export const addPrefixCss = function (
  dom: HTMLElement,
  cssProp: string,
  val: string
): void {
  const prefixObj = detectCSSPrefix();
  const cssText = dom.style.cssText;
  let str = '';
  str += `${prefixObj['css'] + cssProp}:${val};`;
  str += `${cssProp}:${val};`;
  dom.style.cssText = cssText + str;
};

/**
 * 添加js前缀
 * @param dom dom节点
 * @param cssProp css属性
 * @param val css属性值
 */
export const addPrefixJs = function (
  dom: HTMLElement,
  cssProp: string,
  val: string
): void {
  const prefixObj = detectCSSPrefix();
  const prefixProp =
    prefixObj['js'] +
    cssProp.slice(0, 1).toLocaleUpperCase() +
    cssProp.slice(1);
  dom.style[prefixProp] = val;
  dom.style[cssProp] = val;
};
