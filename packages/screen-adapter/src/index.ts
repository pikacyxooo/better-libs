/**
 * @module ScreenAdapter 屏幕适配组件
 */
import { addPrefixCss, addPrefixJs } from "./utils/styleUtil";
import { SCREEN_PARAMS } from "./ScreenConst";

interface ScreenAdapterOption {
  wrapper: string;
  width?: number;
  height?: number;
  mode?: string;
  direction?: string;
}

class ScreenAdapter {
  private width: number;
  private height: number;
  private dom: HTMLElement | null;
  private mode: string;
  private direction: string;
  private cd: number | null;

  /**
   * 屏幕适配组件，自定义参数
   * @param options 适配参数配置
   * @example
   */
  constructor(options: ScreenAdapterOption) {
    this.width = 0;
    this.height = 0;
    this.dom = document.querySelector(options.wrapper);
    this.mode = options.mode || "fill";
    this.direction = options.direction || "vertical";
    this._initSize(options);
    this._initDom();

    window.addEventListener(
      "orientationchange" in window ? "orientationchange" : "resize",
      () => {
        if (this.cd) return;
        this.cd = window.setTimeout(() => {
          this._initSize(options);
          this._parseResize();
          this.cd = null;
        }, 350);
      }
    );
  }
  /**
   * 判断屏幕方向是水平还是垂直
   */
  static detectOrient(): string {
    let _sw = screen.width;
    let _sh = screen.height;
    const _cw = document.documentElement.clientWidth;
    _sw = _sw < _sh ? _sw : _sh;
    if (_sw === _cw) {
      return "vertical";
    } else {
      return "horizontal";
    }
  }

  /**
   * @ignore
   * 初始化dom节点
   */
  private _initDom() {
    if (!this.dom) return;
    let style = "";
    style += `width: ${this.width}px;`;
    style += `height: ${this.height}px;`;
    this.dom.style.cssText = style;
    addPrefixCss(this.dom, "transform-origin", "0% 0%");
    // addPrefixCss(this.dom, 'transition', 'transform 0.1s ease-in-out');
    this._parseResize();
  }

  private _initSize(options: ScreenAdapterOption) {
    if (options.width && options.height) {
      this.width = options.width;
      this.height = options.height;
    } else {
      let _cw = document.documentElement.clientWidth;
      let _ch = document.documentElement.clientHeight;
      let _t = _cw;
      _cw = _cw < _ch ? _t : _ch;
      _ch = _t >= _ch ? _t : _ch;
      if (options.direction === "vertical") {
        this.width = _cw;
        this.height = _ch;
      } else {
        this.width = _ch;
        this.height = _cw;
      }
    }
  }

  /**
   * @ignore
   * 计算宽高比
   */
  private _calcRatio(cw: number, ch: number): [number, number] {
    let widthRatio, heightRatio;
    if (this.direction === ScreenAdapter.detectOrient()) {
      widthRatio = cw / this.width;
      heightRatio = ch / this.height;
    } else {
      widthRatio = cw / this.height;
      heightRatio = ch / this.width;
    }
    return [widthRatio, heightRatio];
  }

  /**
   * @ignore
   * 当屏幕resize执行
   */
  private _parseResize() {
    if (!this.dom) return;
    let _cw = document.documentElement.clientWidth;
    let _ch = document.documentElement.clientHeight;
    const [widthRatio, heightRatio] = this._calcRatio(_cw, _ch);
    let cssVal = "";
    if (this.direction === ScreenAdapter.detectOrient()) {
      if (this.mode === SCREEN_PARAMS.FILL) {
        cssVal = `matrix(${widthRatio},0,0,${heightRatio},0,0)`;
      } else if (this.mode === SCREEN_PARAMS.WIDTH) {
        cssVal = `matrix(${widthRatio},0,0,${widthRatio},0,0)`;
      } else if (this.mode === SCREEN_PARAMS.HEIGHT) {
        cssVal = `matrix(${heightRatio},0,0,${heightRatio},0,0)`;
      }
    } else {
      if (this.mode === SCREEN_PARAMS.FILL) {
        cssVal = `matrix(0,${heightRatio},-${widthRatio},0,${_cw},0)`;
      } else if (this.mode === SCREEN_PARAMS.WIDTH) {
        cssVal = `matrix(0,${heightRatio},-${heightRatio},0,${_cw},0)`;
      } else if (this.mode === SCREEN_PARAMS.HEIGHT) {
        cssVal = `matrix(0,${widthRatio},-${widthRatio},0,${_cw},0)`;
      }
    }
    addPrefixCss(this.dom, "transform", cssVal);
    addPrefixCss(this.dom, "width", this.width + "px;");
    addPrefixCss(this.dom, "height", this.height + "px;");
  }
}

export default ScreenAdapter;
