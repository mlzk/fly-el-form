import { unref, getCurrentScope, onScopeDispose, ref, readonly, getCurrentInstance, onMounted, nextTick, watch, defineComponent, openBlock, createElementBlock, createElementVNode, warn, inject, computed, isRef, provide, renderSlot, mergeProps, normalizeClass, createVNode, Transition, withCtx, withDirectives, normalizeStyle, toDisplayString, vShow, shallowReactive, createBlock, createCommentVNode, resolveDynamicComponent, Fragment, withModifiers, isVNode, render, reactive, h, resolveComponent } from "vue";
const requireTypes = {
  "el-input": "string",
  "el-input-number": "number",
  "el-radio": "boolean",
  "el-radio-group": "string",
  "el-checkbox": "boolean",
  "el-checkbox-group": "array",
  "el-switch": "boolean",
  "el-select": "string",
  // 默认
  "el-time-select": "string",
  "el-date-picker": "date",
  // 默认
  "el-cascader": "array",
  "el-rate": "number",
  "el-slider": "number",
  "el-color-picker": "string"
};
const hasOwnPropertySafely = (obj, key) => {
  if (!obj || !key) return false;
  return Object.prototype.hasOwnProperty.call(obj, key);
};
var _a;
const isClient = typeof window !== "undefined";
const isString$1 = (val) => typeof val === "string";
const noop = () => {
};
isClient && ((_a = window == null ? void 0 : window.navigator) == null ? void 0 : _a.userAgent) && /iP(ad|hone|od)/.test(window.navigator.userAgent);
function resolveUnref(r) {
  return typeof r === "function" ? r() : unref(r);
}
function identity(arg) {
  return arg;
}
function tryOnScopeDispose(fn) {
  if (getCurrentScope()) {
    onScopeDispose(fn);
    return true;
  }
  return false;
}
function tryOnMounted(fn, sync = true) {
  if (getCurrentInstance())
    onMounted(fn);
  else if (sync)
    fn();
  else
    nextTick(fn);
}
function useTimeoutFn(cb, interval, options = {}) {
  const {
    immediate = true
  } = options;
  const isPending = ref(false);
  let timer = null;
  function clear() {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  }
  function stop() {
    isPending.value = false;
    clear();
  }
  function start(...args) {
    clear();
    isPending.value = true;
    timer = setTimeout(() => {
      isPending.value = false;
      timer = null;
      cb(...args);
    }, resolveUnref(interval));
  }
  if (immediate) {
    isPending.value = true;
    if (isClient)
      start();
  }
  tryOnScopeDispose(stop);
  return {
    isPending: readonly(isPending),
    start,
    stop
  };
}
function unrefElement(elRef) {
  var _a2;
  const plain = resolveUnref(elRef);
  return (_a2 = plain == null ? void 0 : plain.$el) != null ? _a2 : plain;
}
const defaultWindow = isClient ? window : void 0;
function useEventListener(...args) {
  let target;
  let events;
  let listeners;
  let options;
  if (isString$1(args[0]) || Array.isArray(args[0])) {
    [events, listeners, options] = args;
    target = defaultWindow;
  } else {
    [target, events, listeners, options] = args;
  }
  if (!target)
    return noop;
  if (!Array.isArray(events))
    events = [events];
  if (!Array.isArray(listeners))
    listeners = [listeners];
  const cleanups = [];
  const cleanup = () => {
    cleanups.forEach((fn) => fn());
    cleanups.length = 0;
  };
  const register = (el, event, listener, options2) => {
    el.addEventListener(event, listener, options2);
    return () => el.removeEventListener(event, listener, options2);
  };
  const stopWatch = watch(() => [unrefElement(target), resolveUnref(options)], ([el, options2]) => {
    cleanup();
    if (!el)
      return;
    cleanups.push(...events.flatMap((event) => {
      return listeners.map((listener) => register(el, event, listener, options2));
    }));
  }, { immediate: true, flush: "post" });
  const stop = () => {
    stopWatch();
    cleanup();
  };
  tryOnScopeDispose(stop);
  return stop;
}
function useSupported(callback, sync = false) {
  const isSupported = ref();
  const update = () => isSupported.value = Boolean(callback());
  update();
  tryOnMounted(update, sync);
  return isSupported;
}
const _global = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
const globalKey = "__vueuse_ssr_handlers__";
_global[globalKey] = _global[globalKey] || {};
var __getOwnPropSymbols$g = Object.getOwnPropertySymbols;
var __hasOwnProp$g = Object.prototype.hasOwnProperty;
var __propIsEnum$g = Object.prototype.propertyIsEnumerable;
var __objRest$2 = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$g.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$g)
    for (var prop of __getOwnPropSymbols$g(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$g.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
function useResizeObserver(target, callback, options = {}) {
  const _a2 = options, { window: window2 = defaultWindow } = _a2, observerOptions = __objRest$2(_a2, ["window"]);
  let observer;
  const isSupported = useSupported(() => window2 && "ResizeObserver" in window2);
  const cleanup = () => {
    if (observer) {
      observer.disconnect();
      observer = void 0;
    }
  };
  const stopWatch = watch(() => unrefElement(target), (el) => {
    cleanup();
    if (isSupported.value && window2 && el) {
      observer = new ResizeObserver(callback);
      observer.observe(el, observerOptions);
    }
  }, { immediate: true, flush: "post" });
  const stop = () => {
    cleanup();
    stopWatch();
  };
  tryOnScopeDispose(stop);
  return {
    isSupported,
    stop
  };
}
var SwipeDirection;
(function(SwipeDirection2) {
  SwipeDirection2["UP"] = "UP";
  SwipeDirection2["RIGHT"] = "RIGHT";
  SwipeDirection2["DOWN"] = "DOWN";
  SwipeDirection2["LEFT"] = "LEFT";
  SwipeDirection2["NONE"] = "NONE";
})(SwipeDirection || (SwipeDirection = {}));
var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
const _TransitionPresets = {
  easeInSine: [0.12, 0, 0.39, 0],
  easeOutSine: [0.61, 1, 0.88, 1],
  easeInOutSine: [0.37, 0, 0.63, 1],
  easeInQuad: [0.11, 0, 0.5, 0],
  easeOutQuad: [0.5, 1, 0.89, 1],
  easeInOutQuad: [0.45, 0, 0.55, 1],
  easeInCubic: [0.32, 0, 0.67, 0],
  easeOutCubic: [0.33, 1, 0.68, 1],
  easeInOutCubic: [0.65, 0, 0.35, 1],
  easeInQuart: [0.5, 0, 0.75, 0],
  easeOutQuart: [0.25, 1, 0.5, 1],
  easeInOutQuart: [0.76, 0, 0.24, 1],
  easeInQuint: [0.64, 0, 0.78, 0],
  easeOutQuint: [0.22, 1, 0.36, 1],
  easeInOutQuint: [0.83, 0, 0.17, 1],
  easeInExpo: [0.7, 0, 0.84, 0],
  easeOutExpo: [0.16, 1, 0.3, 1],
  easeInOutExpo: [0.87, 0, 0.13, 1],
  easeInCirc: [0.55, 0, 1, 0.45],
  easeOutCirc: [0, 0.55, 0.45, 1],
  easeInOutCirc: [0.85, 0, 0.15, 1],
  easeInBack: [0.36, 0, 0.66, -0.56],
  easeOutBack: [0.34, 1.56, 0.64, 1],
  easeInOutBack: [0.68, -0.6, 0.32, 1.6]
};
__spreadValues({
  linear: identity
}, _TransitionPresets);
/**
* @vue/shared v3.5.13
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
!!(process.env.NODE_ENV !== "production") ? Object.freeze({}) : {};
!!(process.env.NODE_ENV !== "production") ? Object.freeze([]) : [];
const hasOwnProperty$4 = Object.prototype.hasOwnProperty;
const hasOwn = (val, key) => hasOwnProperty$4.call(val, key);
const isFunction$1 = (val) => typeof val === "function";
const isString = (val) => typeof val === "string";
const isObject$1 = (val) => val !== null && typeof val === "object";
var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
var freeSelf = typeof self == "object" && self && self.Object === Object && self;
var root = freeGlobal || freeSelf || Function("return this")();
var Symbol$1 = root.Symbol;
var objectProto$4 = Object.prototype;
var hasOwnProperty$3 = objectProto$4.hasOwnProperty;
var nativeObjectToString$1 = objectProto$4.toString;
var symToStringTag$1 = Symbol$1 ? Symbol$1.toStringTag : void 0;
function getRawTag(value) {
  var isOwn = hasOwnProperty$3.call(value, symToStringTag$1), tag = value[symToStringTag$1];
  try {
    value[symToStringTag$1] = void 0;
    var unmasked = true;
  } catch (e) {
  }
  var result = nativeObjectToString$1.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag$1] = tag;
    } else {
      delete value[symToStringTag$1];
    }
  }
  return result;
}
var objectProto$3 = Object.prototype;
var nativeObjectToString = objectProto$3.toString;
function objectToString(value) {
  return nativeObjectToString.call(value);
}
var nullTag = "[object Null]", undefinedTag = "[object Undefined]";
var symToStringTag = Symbol$1 ? Symbol$1.toStringTag : void 0;
function baseGetTag(value) {
  if (value == null) {
    return value === void 0 ? undefinedTag : nullTag;
  }
  return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
}
function isObjectLike(value) {
  return value != null && typeof value == "object";
}
var symbolTag = "[object Symbol]";
function isSymbol(value) {
  return typeof value == "symbol" || isObjectLike(value) && baseGetTag(value) == symbolTag;
}
function arrayMap(array, iteratee) {
  var index = -1, length = array == null ? 0 : array.length, result = Array(length);
  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}
var isArray = Array.isArray;
var INFINITY$1 = 1 / 0;
var symbolProto = Symbol$1 ? Symbol$1.prototype : void 0, symbolToString = symbolProto ? symbolProto.toString : void 0;
function baseToString(value) {
  if (typeof value == "string") {
    return value;
  }
  if (isArray(value)) {
    return arrayMap(value, baseToString) + "";
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : "";
  }
  var result = value + "";
  return result == "0" && 1 / value == -INFINITY$1 ? "-0" : result;
}
function isObject(value) {
  var type = typeof value;
  return value != null && (type == "object" || type == "function");
}
var asyncTag = "[object AsyncFunction]", funcTag = "[object Function]", genTag = "[object GeneratorFunction]", proxyTag = "[object Proxy]";
function isFunction(value) {
  if (!isObject(value)) {
    return false;
  }
  var tag = baseGetTag(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}
var coreJsData = root["__core-js_shared__"];
var maskSrcKey = function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || "");
  return uid ? "Symbol(src)_1." + uid : "";
}();
function isMasked(func) {
  return !!maskSrcKey && maskSrcKey in func;
}
var funcProto$1 = Function.prototype;
var funcToString$1 = funcProto$1.toString;
function toSource(func) {
  if (func != null) {
    try {
      return funcToString$1.call(func);
    } catch (e) {
    }
    try {
      return func + "";
    } catch (e) {
    }
  }
  return "";
}
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
var reIsHostCtor = /^\[object .+?Constructor\]$/;
var funcProto = Function.prototype, objectProto$2 = Object.prototype;
var funcToString = funcProto.toString;
var hasOwnProperty$2 = objectProto$2.hasOwnProperty;
var reIsNative = RegExp(
  "^" + funcToString.call(hasOwnProperty$2).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
);
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}
function getValue(object, key) {
  return object == null ? void 0 : object[key];
}
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : void 0;
}
function eq(value, other) {
  return value === other || value !== value && other !== other;
}
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, reIsPlainProp = /^\w*$/;
function isKey(value, object) {
  if (isArray(value)) {
    return false;
  }
  var type = typeof value;
  if (type == "number" || type == "symbol" || type == "boolean" || value == null || isSymbol(value)) {
    return true;
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) || object != null && value in Object(object);
}
var nativeCreate = getNative(Object, "create");
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
  this.size = 0;
}
function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}
var HASH_UNDEFINED$1 = "__lodash_hash_undefined__";
var objectProto$1 = Object.prototype;
var hasOwnProperty$1 = objectProto$1.hasOwnProperty;
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED$1 ? void 0 : result;
  }
  return hasOwnProperty$1.call(data, key) ? data[key] : void 0;
}
var objectProto = Object.prototype;
var hasOwnProperty = objectProto.hasOwnProperty;
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? data[key] !== void 0 : hasOwnProperty.call(data, key);
}
var HASH_UNDEFINED = "__lodash_hash_undefined__";
function hashSet(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = nativeCreate && value === void 0 ? HASH_UNDEFINED : value;
  return this;
}
function Hash(entries) {
  var index = -1, length = entries == null ? 0 : entries.length;
  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}
Hash.prototype.clear = hashClear;
Hash.prototype["delete"] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;
function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}
var arrayProto = Array.prototype;
var splice = arrayProto.splice;
function listCacheDelete(key) {
  var data = this.__data__, index = assocIndexOf(data, key);
  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  --this.size;
  return true;
}
function listCacheGet(key) {
  var data = this.__data__, index = assocIndexOf(data, key);
  return index < 0 ? void 0 : data[index][1];
}
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}
function listCacheSet(key, value) {
  var data = this.__data__, index = assocIndexOf(data, key);
  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}
function ListCache(entries) {
  var index = -1, length = entries == null ? 0 : entries.length;
  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}
ListCache.prototype.clear = listCacheClear;
ListCache.prototype["delete"] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;
var Map = getNative(root, "Map");
function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    "hash": new Hash(),
    "map": new (Map || ListCache)(),
    "string": new Hash()
  };
}
function isKeyable(value) {
  var type = typeof value;
  return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value !== "__proto__" : value === null;
}
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key) ? data[typeof key == "string" ? "string" : "hash"] : data.map;
}
function mapCacheDelete(key) {
  var result = getMapData(this, key)["delete"](key);
  this.size -= result ? 1 : 0;
  return result;
}
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}
function mapCacheSet(key, value) {
  var data = getMapData(this, key), size = data.size;
  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}
function MapCache(entries) {
  var index = -1, length = entries == null ? 0 : entries.length;
  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype["delete"] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;
var FUNC_ERROR_TEXT = "Expected a function";
function memoize(func, resolver) {
  if (typeof func != "function" || resolver != null && typeof resolver != "function") {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var memoized = function() {
    var args = arguments, key = resolver ? resolver.apply(this, args) : args[0], cache = memoized.cache;
    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result) || cache;
    return result;
  };
  memoized.cache = new (memoize.Cache || MapCache)();
  return memoized;
}
memoize.Cache = MapCache;
var MAX_MEMOIZE_SIZE = 500;
function memoizeCapped(func) {
  var result = memoize(func, function(key) {
    if (cache.size === MAX_MEMOIZE_SIZE) {
      cache.clear();
    }
    return key;
  });
  var cache = result.cache;
  return result;
}
var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
var reEscapeChar = /\\(\\)?/g;
var stringToPath = memoizeCapped(function(string) {
  var result = [];
  if (string.charCodeAt(0) === 46) {
    result.push("");
  }
  string.replace(rePropName, function(match, number, quote, subString) {
    result.push(quote ? subString.replace(reEscapeChar, "$1") : number || match);
  });
  return result;
});
function toString(value) {
  return value == null ? "" : baseToString(value);
}
function castPath(value, object) {
  if (isArray(value)) {
    return value;
  }
  return isKey(value, object) ? [value] : stringToPath(toString(value));
}
var INFINITY = 1 / 0;
function toKey(value) {
  if (typeof value == "string" || isSymbol(value)) {
    return value;
  }
  var result = value + "";
  return result == "0" && 1 / value == -INFINITY ? "-0" : result;
}
function baseGet(object, path) {
  path = castPath(path, object);
  var index = 0, length = path.length;
  while (object != null && index < length) {
    object = object[toKey(path[index++])];
  }
  return index && index == length ? object : void 0;
}
function get(object, path, defaultValue) {
  var result = object == null ? void 0 : baseGet(object, path);
  return result === void 0 ? defaultValue : result;
}
function fromPairs(pairs) {
  var index = -1, length = pairs == null ? 0 : pairs.length, result = {};
  while (++index < length) {
    var pair = pairs[index];
    result[pair[0]] = pair[1];
  }
  return result;
}
const isUndefined = (val) => val === void 0;
const isBoolean = (val) => typeof val === "boolean";
const isNumber = (val) => typeof val === "number";
const isElement = (e) => {
  if (typeof Element === "undefined")
    return false;
  return e instanceof Element;
};
const isStringNumber = (val) => {
  if (!isString(val)) {
    return false;
  }
  return !Number.isNaN(Number(val));
};
const keysOf = (arr) => Object.keys(arr);
class ElementPlusError extends Error {
  constructor(m) {
    super(m);
    this.name = "ElementPlusError";
  }
}
function debugWarn(scope, message2) {
  if (process.env.NODE_ENV !== "production") {
    const error = isString(scope) ? new ElementPlusError(`[${scope}] ${message2}`) : scope;
    console.warn(error);
  }
}
const SCOPE = "utils/dom/style";
function addUnit(value, defaultUnit = "px") {
  if (!value)
    return "";
  if (isNumber(value) || isStringNumber(value)) {
    return `${value}${defaultUnit}`;
  } else if (isString(value)) {
    return value;
  }
  debugWarn(SCOPE, "binding value must be a string or number");
}
/*! Element Plus Icons Vue v2.3.1 */
var circle_close_filled_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  name: "CircleCloseFilled",
  __name: "circle-close-filled",
  setup(__props) {
    return (_ctx, _cache) => (openBlock(), createElementBlock("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 1024 1024"
    }, [
      createElementVNode("path", {
        fill: "currentColor",
        d: "M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896m0 393.664L407.936 353.6a38.4 38.4 0 1 0-54.336 54.336L457.664 512 353.6 616.064a38.4 38.4 0 1 0 54.336 54.336L512 566.336 616.064 670.4a38.4 38.4 0 1 0 54.336-54.336L566.336 512 670.4 407.936a38.4 38.4 0 1 0-54.336-54.336z"
      })
    ]));
  }
});
var circle_close_filled_default = circle_close_filled_vue_vue_type_script_setup_true_lang_default;
var close_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  name: "Close",
  __name: "close",
  setup(__props) {
    return (_ctx, _cache) => (openBlock(), createElementBlock("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 1024 1024"
    }, [
      createElementVNode("path", {
        fill: "currentColor",
        d: "M764.288 214.592 512 466.88 259.712 214.592a31.936 31.936 0 0 0-45.12 45.12L466.752 512 214.528 764.224a31.936 31.936 0 1 0 45.12 45.184L512 557.184l252.288 252.288a31.936 31.936 0 0 0 45.12-45.12L557.12 512.064l252.288-252.352a31.936 31.936 0 1 0-45.12-45.184z"
      })
    ]));
  }
});
var close_default = close_vue_vue_type_script_setup_true_lang_default;
var info_filled_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  name: "InfoFilled",
  __name: "info-filled",
  setup(__props) {
    return (_ctx, _cache) => (openBlock(), createElementBlock("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 1024 1024"
    }, [
      createElementVNode("path", {
        fill: "currentColor",
        d: "M512 64a448 448 0 1 1 0 896.064A448 448 0 0 1 512 64m67.2 275.072c33.28 0 60.288-23.104 60.288-57.344s-27.072-57.344-60.288-57.344c-33.28 0-60.16 23.104-60.16 57.344s26.88 57.344 60.16 57.344M590.912 699.2c0-6.848 2.368-24.64 1.024-34.752l-52.608 60.544c-10.88 11.456-24.512 19.392-30.912 17.28a12.992 12.992 0 0 1-8.256-14.72l87.68-276.992c7.168-35.136-12.544-67.2-54.336-71.296-44.096 0-108.992 44.736-148.48 101.504 0 6.784-1.28 23.68.064 33.792l52.544-60.608c10.88-11.328 23.552-19.328 29.952-17.152a12.8 12.8 0 0 1 7.808 16.128L388.48 728.576c-10.048 32.256 8.96 63.872 55.04 71.04 67.84 0 107.904-43.648 147.456-100.416z"
      })
    ]));
  }
});
var info_filled_default = info_filled_vue_vue_type_script_setup_true_lang_default;
var success_filled_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  name: "SuccessFilled",
  __name: "success-filled",
  setup(__props) {
    return (_ctx, _cache) => (openBlock(), createElementBlock("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 1024 1024"
    }, [
      createElementVNode("path", {
        fill: "currentColor",
        d: "M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896m-55.808 536.384-99.52-99.584a38.4 38.4 0 1 0-54.336 54.336l126.72 126.72a38.272 38.272 0 0 0 54.336 0l262.4-262.464a38.4 38.4 0 1 0-54.272-54.336z"
      })
    ]));
  }
});
var success_filled_default = success_filled_vue_vue_type_script_setup_true_lang_default;
var warning_filled_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  name: "WarningFilled",
  __name: "warning-filled",
  setup(__props) {
    return (_ctx, _cache) => (openBlock(), createElementBlock("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 1024 1024"
    }, [
      createElementVNode("path", {
        fill: "currentColor",
        d: "M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896m0 192a58.432 58.432 0 0 0-58.24 63.744l23.36 256.384a35.072 35.072 0 0 0 69.76 0l23.296-256.384A58.432 58.432 0 0 0 512 256m0 512a51.2 51.2 0 1 0 0-102.4 51.2 51.2 0 0 0 0 102.4"
      })
    ]));
  }
});
var warning_filled_default = warning_filled_vue_vue_type_script_setup_true_lang_default;
const epPropKey = "__epPropKey";
const definePropType = (val) => val;
const isEpProp = (val) => isObject$1(val) && !!val[epPropKey];
const buildProp = (prop, key) => {
  if (!isObject$1(prop) || isEpProp(prop))
    return prop;
  const { values, required, default: defaultValue, type, validator } = prop;
  const _validator = values || validator ? (val) => {
    let valid = false;
    let allowedValues = [];
    if (values) {
      allowedValues = Array.from(values);
      if (hasOwn(prop, "default")) {
        allowedValues.push(defaultValue);
      }
      valid || (valid = allowedValues.includes(val));
    }
    if (validator)
      valid || (valid = validator(val));
    if (!valid && allowedValues.length > 0) {
      const allowValuesText = [...new Set(allowedValues)].map((value) => JSON.stringify(value)).join(", ");
      warn(`Invalid prop: validation failed${key ? ` for prop "${key}"` : ""}. Expected one of [${allowValuesText}], got value ${JSON.stringify(val)}.`);
    }
    return valid;
  } : void 0;
  const epProp = {
    type,
    required: !!required,
    validator: _validator,
    [epPropKey]: true
  };
  if (hasOwn(prop, "default"))
    epProp.default = defaultValue;
  return epProp;
};
const buildProps = (props) => fromPairs(Object.entries(props).map(([key, option]) => [
  key,
  buildProp(option, key)
]));
const iconPropType = definePropType([
  String,
  Object,
  Function
]);
const TypeComponents = {
  Close: close_default,
  SuccessFilled: success_filled_default,
  InfoFilled: info_filled_default,
  WarningFilled: warning_filled_default,
  CircleCloseFilled: circle_close_filled_default
};
const TypeComponentsMap = {
  success: success_filled_default,
  warning: warning_filled_default,
  error: circle_close_filled_default,
  info: info_filled_default
};
const withInstall = (main, extra) => {
  main.install = (app) => {
    for (const comp of [main, ...Object.values({})]) {
      app.component(comp.name, comp);
    }
  };
  return main;
};
const withInstallFunction = (fn, name) => {
  fn.install = (app) => {
    fn._context = app._context;
    app.config.globalProperties[name] = fn;
  };
  return fn;
};
const EVENT_CODE = {
  tab: "Tab",
  enter: "Enter",
  space: "Space",
  left: "ArrowLeft",
  up: "ArrowUp",
  right: "ArrowRight",
  down: "ArrowDown",
  esc: "Escape",
  delete: "Delete",
  backspace: "Backspace",
  numpadEnter: "NumpadEnter",
  pageUp: "PageUp",
  pageDown: "PageDown",
  home: "Home",
  end: "End"
};
const componentSizes = ["", "default", "small", "large"];
const mutable = (val) => val;
var English = {
  name: "en",
  el: {
    breadcrumb: {
      label: "Breadcrumb"
    },
    colorpicker: {
      confirm: "OK",
      clear: "Clear",
      defaultLabel: "color picker",
      description: "current color is {color}. press enter to select a new color.",
      alphaLabel: "pick alpha value"
    },
    datepicker: {
      now: "Now",
      today: "Today",
      cancel: "Cancel",
      clear: "Clear",
      confirm: "OK",
      dateTablePrompt: "Use the arrow keys and enter to select the day of the month",
      monthTablePrompt: "Use the arrow keys and enter to select the month",
      yearTablePrompt: "Use the arrow keys and enter to select the year",
      selectedDate: "Selected date",
      selectDate: "Select date",
      selectTime: "Select time",
      startDate: "Start Date",
      startTime: "Start Time",
      endDate: "End Date",
      endTime: "End Time",
      prevYear: "Previous Year",
      nextYear: "Next Year",
      prevMonth: "Previous Month",
      nextMonth: "Next Month",
      year: "",
      month1: "January",
      month2: "February",
      month3: "March",
      month4: "April",
      month5: "May",
      month6: "June",
      month7: "July",
      month8: "August",
      month9: "September",
      month10: "October",
      month11: "November",
      month12: "December",
      week: "week",
      weeks: {
        sun: "Sun",
        mon: "Mon",
        tue: "Tue",
        wed: "Wed",
        thu: "Thu",
        fri: "Fri",
        sat: "Sat"
      },
      weeksFull: {
        sun: "Sunday",
        mon: "Monday",
        tue: "Tuesday",
        wed: "Wednesday",
        thu: "Thursday",
        fri: "Friday",
        sat: "Saturday"
      },
      months: {
        jan: "Jan",
        feb: "Feb",
        mar: "Mar",
        apr: "Apr",
        may: "May",
        jun: "Jun",
        jul: "Jul",
        aug: "Aug",
        sep: "Sep",
        oct: "Oct",
        nov: "Nov",
        dec: "Dec"
      }
    },
    inputNumber: {
      decrease: "decrease number",
      increase: "increase number"
    },
    select: {
      loading: "Loading",
      noMatch: "No matching data",
      noData: "No data",
      placeholder: "Select"
    },
    mention: {
      loading: "Loading"
    },
    dropdown: {
      toggleDropdown: "Toggle Dropdown"
    },
    cascader: {
      noMatch: "No matching data",
      loading: "Loading",
      placeholder: "Select",
      noData: "No data"
    },
    pagination: {
      goto: "Go to",
      pagesize: "/page",
      total: "Total {total}",
      pageClassifier: "",
      page: "Page",
      prev: "Go to previous page",
      next: "Go to next page",
      currentPage: "page {pager}",
      prevPages: "Previous {pager} pages",
      nextPages: "Next {pager} pages",
      deprecationWarning: "Deprecated usages detected, please refer to the el-pagination documentation for more details"
    },
    dialog: {
      close: "Close this dialog"
    },
    drawer: {
      close: "Close this dialog"
    },
    messagebox: {
      title: "Message",
      confirm: "OK",
      cancel: "Cancel",
      error: "Illegal input",
      close: "Close this dialog"
    },
    upload: {
      deleteTip: "press delete to remove",
      delete: "Delete",
      preview: "Preview",
      continue: "Continue"
    },
    slider: {
      defaultLabel: "slider between {min} and {max}",
      defaultRangeStartLabel: "pick start value",
      defaultRangeEndLabel: "pick end value"
    },
    table: {
      emptyText: "No Data",
      confirmFilter: "Confirm",
      resetFilter: "Reset",
      clearFilter: "All",
      sumText: "Sum"
    },
    tour: {
      next: "Next",
      previous: "Previous",
      finish: "Finish"
    },
    tree: {
      emptyText: "No Data"
    },
    transfer: {
      noMatch: "No matching data",
      noData: "No data",
      titles: ["List 1", "List 2"],
      filterPlaceholder: "Enter keyword",
      noCheckedFormat: "{total} items",
      hasCheckedFormat: "{checked}/{total} checked"
    },
    image: {
      error: "FAILED"
    },
    pageHeader: {
      title: "Back"
    },
    popconfirm: {
      confirmButtonText: "Yes",
      cancelButtonText: "No"
    },
    carousel: {
      leftArrow: "Carousel arrow left",
      rightArrow: "Carousel arrow right",
      indicator: "Carousel switch to index {index}"
    }
  }
};
const buildTranslator = (locale) => (path, option) => translate(path, option, unref(locale));
const translate = (path, option, locale) => get(locale, path, path).replace(/\{(\w+)\}/g, (_, key) => {
  var _a2;
  return `${(_a2 = option == null ? void 0 : option[key]) != null ? _a2 : `{${key}}`}`;
});
const buildLocaleContext = (locale) => {
  const lang = computed(() => unref(locale).name);
  const localeRef = isRef(locale) ? locale : ref(locale);
  return {
    lang,
    locale: localeRef,
    t: buildTranslator(locale)
  };
};
const localeContextKey = Symbol("localeContextKey");
const useLocale = (localeOverrides) => {
  const locale = localeOverrides || inject(localeContextKey, ref());
  return buildLocaleContext(computed(() => locale.value || English));
};
const defaultNamespace = "el";
const statePrefix = "is-";
const _bem = (namespace, block, blockSuffix, element, modifier) => {
  let cls = `${namespace}-${block}`;
  if (blockSuffix) {
    cls += `-${blockSuffix}`;
  }
  if (element) {
    cls += `__${element}`;
  }
  if (modifier) {
    cls += `--${modifier}`;
  }
  return cls;
};
const namespaceContextKey = Symbol("namespaceContextKey");
const useGetDerivedNamespace = (namespaceOverrides) => {
  const derivedNamespace = namespaceOverrides || (getCurrentInstance() ? inject(namespaceContextKey, ref(defaultNamespace)) : ref(defaultNamespace));
  const namespace = computed(() => {
    return unref(derivedNamespace) || defaultNamespace;
  });
  return namespace;
};
const useNamespace = (block, namespaceOverrides) => {
  const namespace = useGetDerivedNamespace(namespaceOverrides);
  const b = (blockSuffix = "") => _bem(namespace.value, block, blockSuffix, "", "");
  const e = (element) => element ? _bem(namespace.value, block, "", element, "") : "";
  const m = (modifier) => modifier ? _bem(namespace.value, block, "", "", modifier) : "";
  const be = (blockSuffix, element) => blockSuffix && element ? _bem(namespace.value, block, blockSuffix, element, "") : "";
  const em = (element, modifier) => element && modifier ? _bem(namespace.value, block, "", element, modifier) : "";
  const bm = (blockSuffix, modifier) => blockSuffix && modifier ? _bem(namespace.value, block, blockSuffix, "", modifier) : "";
  const bem = (blockSuffix, element, modifier) => blockSuffix && element && modifier ? _bem(namespace.value, block, blockSuffix, element, modifier) : "";
  const is = (name, ...args) => {
    const state = args.length >= 1 ? args[0] : true;
    return name && state ? `${statePrefix}${name}` : "";
  };
  const cssVar = (object) => {
    const styles = {};
    for (const key in object) {
      if (object[key]) {
        styles[`--${namespace.value}-${key}`] = object[key];
      }
    }
    return styles;
  };
  const cssVarBlock = (object) => {
    const styles = {};
    for (const key in object) {
      if (object[key]) {
        styles[`--${namespace.value}-${block}-${key}`] = object[key];
      }
    }
    return styles;
  };
  const cssVarName = (name) => `--${namespace.value}-${name}`;
  const cssVarBlockName = (name) => `--${namespace.value}-${block}-${name}`;
  return {
    namespace,
    b,
    e,
    m,
    be,
    em,
    bm,
    bem,
    is,
    cssVar,
    cssVarName,
    cssVarBlock,
    cssVarBlockName
  };
};
const initial = {
  current: 0
};
const zIndex = ref(0);
const defaultInitialZIndex = 2e3;
const ZINDEX_INJECTION_KEY = Symbol("elZIndexContextKey");
const zIndexContextKey = Symbol("zIndexContextKey");
const useZIndex = (zIndexOverrides) => {
  const increasingInjection = getCurrentInstance() ? inject(ZINDEX_INJECTION_KEY, initial) : initial;
  const zIndexInjection = zIndexOverrides || (getCurrentInstance() ? inject(zIndexContextKey, void 0) : void 0);
  const initialZIndex = computed(() => {
    const zIndexFromInjection = unref(zIndexInjection);
    return isNumber(zIndexFromInjection) ? zIndexFromInjection : defaultInitialZIndex;
  });
  const currentZIndex = computed(() => initialZIndex.value + zIndex.value);
  const nextZIndex = () => {
    increasingInjection.current++;
    zIndex.value = increasingInjection.current;
    return currentZIndex.value;
  };
  if (!isClient && !inject(ZINDEX_INJECTION_KEY)) {
    debugWarn("ZIndexInjection", `Looks like you are using server rendering, you must provide a z-index provider to ensure the hydration process to be succeed
usage: app.provide(ZINDEX_INJECTION_KEY, { current: 0 })`);
  }
  return {
    initialZIndex,
    currentZIndex,
    nextZIndex
  };
};
const useSizeProp = buildProp({
  type: String,
  values: componentSizes,
  required: false
});
const SIZE_INJECTION_KEY = Symbol("size");
const emptyValuesContextKey = Symbol("emptyValuesContextKey");
const useEmptyValuesProps = buildProps({
  emptyValues: Array,
  valueOnClear: {
    type: [String, Number, Boolean, Function],
    default: void 0,
    validator: (val) => isFunction$1(val) ? !val() : !val
  }
});
const configProviderContextKey = Symbol();
const globalConfig = ref();
function useGlobalConfig(key, defaultValue = void 0) {
  const config = getCurrentInstance() ? inject(configProviderContextKey, globalConfig) : globalConfig;
  {
    return config;
  }
}
function useGlobalComponentSettings(block, sizeFallback) {
  const config = useGlobalConfig();
  const ns = useNamespace(block, computed(() => {
    var _a2;
    return ((_a2 = config.value) == null ? void 0 : _a2.namespace) || defaultNamespace;
  }));
  const locale = useLocale(computed(() => {
    var _a2;
    return (_a2 = config.value) == null ? void 0 : _a2.locale;
  }));
  const zIndex2 = useZIndex(computed(() => {
    var _a2;
    return ((_a2 = config.value) == null ? void 0 : _a2.zIndex) || defaultInitialZIndex;
  }));
  const size = computed(() => {
    var _a2;
    return unref(sizeFallback) || ((_a2 = config.value) == null ? void 0 : _a2.size) || "";
  });
  provideGlobalConfig(computed(() => unref(config) || {}));
  return {
    ns,
    locale,
    zIndex: zIndex2,
    size
  };
}
const provideGlobalConfig = (config, app, global2 = false) => {
  var _a2;
  const inSetup = !!getCurrentInstance();
  const oldConfig = inSetup ? useGlobalConfig() : void 0;
  const provideFn = (_a2 = void 0) != null ? _a2 : inSetup ? provide : void 0;
  if (!provideFn) {
    debugWarn("provideGlobalConfig", "provideGlobalConfig() can only be used inside setup().");
    return;
  }
  const context = computed(() => {
    const cfg = unref(config);
    if (!(oldConfig == null ? void 0 : oldConfig.value))
      return cfg;
    return mergeConfig(oldConfig.value, cfg);
  });
  provideFn(configProviderContextKey, context);
  provideFn(localeContextKey, computed(() => context.value.locale));
  provideFn(namespaceContextKey, computed(() => context.value.namespace));
  provideFn(zIndexContextKey, computed(() => context.value.zIndex));
  provideFn(SIZE_INJECTION_KEY, {
    size: computed(() => context.value.size || "")
  });
  provideFn(emptyValuesContextKey, computed(() => ({
    emptyValues: context.value.emptyValues,
    valueOnClear: context.value.valueOnClear
  })));
  if (global2 || !globalConfig.value) {
    globalConfig.value = context.value;
  }
  return context;
};
const mergeConfig = (a, b) => {
  const keys = [.../* @__PURE__ */ new Set([...keysOf(a), ...keysOf(b)])];
  const obj = {};
  for (const key of keys) {
    obj[key] = b[key] !== void 0 ? b[key] : a[key];
  }
  return obj;
};
const configProviderProps = buildProps({
  a11y: {
    type: Boolean,
    default: true
  },
  locale: {
    type: definePropType(Object)
  },
  size: useSizeProp,
  button: {
    type: definePropType(Object)
  },
  experimentalFeatures: {
    type: definePropType(Object)
  },
  keyboardNavigation: {
    type: Boolean,
    default: true
  },
  message: {
    type: definePropType(Object)
  },
  zIndex: Number,
  namespace: {
    type: String,
    default: "el"
  },
  ...useEmptyValuesProps
});
const messageConfig = {};
defineComponent({
  name: "ElConfigProvider",
  props: configProviderProps,
  setup(props, { slots }) {
    watch(() => props.message, (val) => {
      Object.assign(messageConfig, val != null ? val : {});
    }, { immediate: true, deep: true });
    const config = provideGlobalConfig(props);
    return () => renderSlot(slots, "default", { config: config == null ? void 0 : config.value });
  }
});
var _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const iconProps = buildProps({
  size: {
    type: definePropType([Number, String])
  },
  color: {
    type: String
  }
});
const __default__$2 = defineComponent({
  name: "ElIcon",
  inheritAttrs: false
});
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  ...__default__$2,
  props: iconProps,
  setup(__props) {
    const props = __props;
    const ns = useNamespace("icon");
    const style = computed(() => {
      const { size, color } = props;
      if (!size && !color)
        return {};
      return {
        fontSize: isUndefined(size) ? void 0 : addUnit(size),
        "--color": color
      };
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("i", mergeProps({
        class: unref(ns).b(),
        style: unref(style)
      }, _ctx.$attrs), [
        renderSlot(_ctx.$slots, "default")
      ], 16);
    };
  }
});
var Icon = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__file", "icon.vue"]]);
const ElIcon = withInstall(Icon);
const badgeProps = buildProps({
  value: {
    type: [String, Number],
    default: ""
  },
  max: {
    type: Number,
    default: 99
  },
  isDot: Boolean,
  hidden: Boolean,
  type: {
    type: String,
    values: ["primary", "success", "warning", "info", "danger"],
    default: "danger"
  },
  showZero: {
    type: Boolean,
    default: true
  },
  color: String,
  badgeStyle: {
    type: definePropType([String, Object, Array])
  },
  offset: {
    type: definePropType(Array),
    default: [0, 0]
  },
  badgeClass: {
    type: String
  }
});
const __default__$1 = defineComponent({
  name: "ElBadge"
});
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  ...__default__$1,
  props: badgeProps,
  setup(__props, { expose }) {
    const props = __props;
    const ns = useNamespace("badge");
    const content = computed(() => {
      if (props.isDot)
        return "";
      if (isNumber(props.value) && isNumber(props.max)) {
        return props.max < props.value ? `${props.max}+` : `${props.value}`;
      }
      return `${props.value}`;
    });
    const style = computed(() => {
      var _a2, _b, _c, _d, _e;
      return [
        {
          backgroundColor: props.color,
          marginRight: addUnit(-((_b = (_a2 = props.offset) == null ? void 0 : _a2[0]) != null ? _b : 0)),
          marginTop: addUnit((_d = (_c = props.offset) == null ? void 0 : _c[1]) != null ? _d : 0)
        },
        (_e = props.badgeStyle) != null ? _e : {}
      ];
    });
    expose({
      content
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(unref(ns).b())
      }, [
        renderSlot(_ctx.$slots, "default"),
        createVNode(Transition, {
          name: `${unref(ns).namespace.value}-zoom-in-center`,
          persisted: ""
        }, {
          default: withCtx(() => [
            withDirectives(createElementVNode("sup", {
              class: normalizeClass([
                unref(ns).e("content"),
                unref(ns).em("content", _ctx.type),
                unref(ns).is("fixed", !!_ctx.$slots.default),
                unref(ns).is("dot", _ctx.isDot),
                unref(ns).is("hide-zero", !_ctx.showZero && props.value === 0),
                _ctx.badgeClass
              ]),
              style: normalizeStyle(unref(style)),
              textContent: toDisplayString(unref(content))
            }, null, 14, ["textContent"]), [
              [vShow, !_ctx.hidden && (unref(content) || _ctx.isDot)]
            ])
          ]),
          _: 1
        }, 8, ["name"])
      ], 2);
    };
  }
});
var Badge = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__file", "badge.vue"]]);
const ElBadge = withInstall(Badge);
const messageTypes = ["success", "info", "warning", "error"];
const messageDefaults = mutable({
  customClass: "",
  center: false,
  dangerouslyUseHTMLString: false,
  duration: 3e3,
  icon: void 0,
  id: "",
  message: "",
  onClose: void 0,
  showClose: false,
  type: "info",
  plain: false,
  offset: 16,
  zIndex: 0,
  grouping: false,
  repeatNum: 1,
  appendTo: isClient ? document.body : void 0
});
const messageProps = buildProps({
  customClass: {
    type: String,
    default: messageDefaults.customClass
  },
  center: {
    type: Boolean,
    default: messageDefaults.center
  },
  dangerouslyUseHTMLString: {
    type: Boolean,
    default: messageDefaults.dangerouslyUseHTMLString
  },
  duration: {
    type: Number,
    default: messageDefaults.duration
  },
  icon: {
    type: iconPropType,
    default: messageDefaults.icon
  },
  id: {
    type: String,
    default: messageDefaults.id
  },
  message: {
    type: definePropType([
      String,
      Object,
      Function
    ]),
    default: messageDefaults.message
  },
  onClose: {
    type: definePropType(Function),
    default: messageDefaults.onClose
  },
  showClose: {
    type: Boolean,
    default: messageDefaults.showClose
  },
  type: {
    type: String,
    values: messageTypes,
    default: messageDefaults.type
  },
  plain: {
    type: Boolean,
    default: messageDefaults.plain
  },
  offset: {
    type: Number,
    default: messageDefaults.offset
  },
  zIndex: {
    type: Number,
    default: messageDefaults.zIndex
  },
  grouping: {
    type: Boolean,
    default: messageDefaults.grouping
  },
  repeatNum: {
    type: Number,
    default: messageDefaults.repeatNum
  }
});
const messageEmits = {
  destroy: () => true
};
const instances = shallowReactive([]);
const getInstance = (id) => {
  const idx = instances.findIndex((instance) => instance.id === id);
  const current = instances[idx];
  let prev;
  if (idx > 0) {
    prev = instances[idx - 1];
  }
  return { current, prev };
};
const getLastOffset = (id) => {
  const { prev } = getInstance(id);
  if (!prev)
    return 0;
  return prev.vm.exposed.bottom.value;
};
const getOffsetOrSpace = (id, offset) => {
  const idx = instances.findIndex((instance) => instance.id === id);
  return idx > 0 ? 16 : offset;
};
const __default__ = defineComponent({
  name: "ElMessage"
});
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...__default__,
  props: messageProps,
  emits: messageEmits,
  setup(__props, { expose }) {
    const props = __props;
    const { Close } = TypeComponents;
    const { ns, zIndex: zIndex2 } = useGlobalComponentSettings("message");
    const { currentZIndex, nextZIndex } = zIndex2;
    const messageRef = ref();
    const visible = ref(false);
    const height = ref(0);
    let stopTimer = void 0;
    const badgeType = computed(() => props.type ? props.type === "error" ? "danger" : props.type : "info");
    const typeClass = computed(() => {
      const type = props.type;
      return { [ns.bm("icon", type)]: type && TypeComponentsMap[type] };
    });
    const iconComponent = computed(() => props.icon || TypeComponentsMap[props.type] || "");
    const lastOffset = computed(() => getLastOffset(props.id));
    const offset = computed(() => getOffsetOrSpace(props.id, props.offset) + lastOffset.value);
    const bottom = computed(() => height.value + offset.value);
    const customStyle = computed(() => ({
      top: `${offset.value}px`,
      zIndex: currentZIndex.value
    }));
    function startTimer() {
      if (props.duration === 0)
        return;
      ({ stop: stopTimer } = useTimeoutFn(() => {
        close();
      }, props.duration));
    }
    function clearTimer() {
      stopTimer == null ? void 0 : stopTimer();
    }
    function close() {
      visible.value = false;
    }
    function keydown({ code }) {
      if (code === EVENT_CODE.esc) {
        close();
      }
    }
    onMounted(() => {
      startTimer();
      nextZIndex();
      visible.value = true;
    });
    watch(() => props.repeatNum, () => {
      clearTimer();
      startTimer();
    });
    useEventListener(document, "keydown", keydown);
    useResizeObserver(messageRef, () => {
      height.value = messageRef.value.getBoundingClientRect().height;
    });
    expose({
      visible,
      bottom,
      close
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(Transition, {
        name: unref(ns).b("fade"),
        onBeforeLeave: _ctx.onClose,
        onAfterLeave: ($event) => _ctx.$emit("destroy"),
        persisted: ""
      }, {
        default: withCtx(() => [
          withDirectives(createElementVNode("div", {
            id: _ctx.id,
            ref_key: "messageRef",
            ref: messageRef,
            class: normalizeClass([
              unref(ns).b(),
              { [unref(ns).m(_ctx.type)]: _ctx.type },
              unref(ns).is("center", _ctx.center),
              unref(ns).is("closable", _ctx.showClose),
              unref(ns).is("plain", _ctx.plain),
              _ctx.customClass
            ]),
            style: normalizeStyle(unref(customStyle)),
            role: "alert",
            onMouseenter: clearTimer,
            onMouseleave: startTimer
          }, [
            _ctx.repeatNum > 1 ? (openBlock(), createBlock(unref(ElBadge), {
              key: 0,
              value: _ctx.repeatNum,
              type: unref(badgeType),
              class: normalizeClass(unref(ns).e("badge"))
            }, null, 8, ["value", "type", "class"])) : createCommentVNode("v-if", true),
            unref(iconComponent) ? (openBlock(), createBlock(unref(ElIcon), {
              key: 1,
              class: normalizeClass([unref(ns).e("icon"), unref(typeClass)])
            }, {
              default: withCtx(() => [
                (openBlock(), createBlock(resolveDynamicComponent(unref(iconComponent))))
              ]),
              _: 1
            }, 8, ["class"])) : createCommentVNode("v-if", true),
            renderSlot(_ctx.$slots, "default", {}, () => [
              !_ctx.dangerouslyUseHTMLString ? (openBlock(), createElementBlock("p", {
                key: 0,
                class: normalizeClass(unref(ns).e("content"))
              }, toDisplayString(_ctx.message), 3)) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [
                createCommentVNode(" Caution here, message could've been compromised, never use user's input as message "),
                createElementVNode("p", {
                  class: normalizeClass(unref(ns).e("content")),
                  innerHTML: _ctx.message
                }, null, 10, ["innerHTML"])
              ], 2112))
            ]),
            _ctx.showClose ? (openBlock(), createBlock(unref(ElIcon), {
              key: 2,
              class: normalizeClass(unref(ns).e("closeBtn")),
              onClick: withModifiers(close, ["stop"])
            }, {
              default: withCtx(() => [
                createVNode(unref(Close))
              ]),
              _: 1
            }, 8, ["class", "onClick"])) : createCommentVNode("v-if", true)
          ], 46, ["id"]), [
            [vShow, visible.value]
          ])
        ]),
        _: 3
      }, 8, ["name", "onBeforeLeave", "onAfterLeave"]);
    };
  }
});
var MessageConstructor = /* @__PURE__ */ _export_sfc(_sfc_main, [["__file", "message.vue"]]);
let seed = 1;
const normalizeOptions = (params) => {
  const options = !params || isString(params) || isVNode(params) || isFunction$1(params) ? { message: params } : params;
  const normalized = {
    ...messageDefaults,
    ...options
  };
  if (!normalized.appendTo) {
    normalized.appendTo = document.body;
  } else if (isString(normalized.appendTo)) {
    let appendTo = document.querySelector(normalized.appendTo);
    if (!isElement(appendTo)) {
      debugWarn("ElMessage", "the appendTo option is not an HTMLElement. Falling back to document.body.");
      appendTo = document.body;
    }
    normalized.appendTo = appendTo;
  }
  if (isBoolean(messageConfig.grouping) && !normalized.grouping) {
    normalized.grouping = messageConfig.grouping;
  }
  if (isNumber(messageConfig.duration) && normalized.duration === 3e3) {
    normalized.duration = messageConfig.duration;
  }
  if (isNumber(messageConfig.offset) && normalized.offset === 16) {
    normalized.offset = messageConfig.offset;
  }
  if (isBoolean(messageConfig.showClose) && !normalized.showClose) {
    normalized.showClose = messageConfig.showClose;
  }
  return normalized;
};
const closeMessage = (instance) => {
  const idx = instances.indexOf(instance);
  if (idx === -1)
    return;
  instances.splice(idx, 1);
  const { handler } = instance;
  handler.close();
};
const createMessage = ({ appendTo, ...options }, context) => {
  const id = `message_${seed++}`;
  const userOnClose = options.onClose;
  const container = document.createElement("div");
  const props = {
    ...options,
    id,
    onClose: () => {
      userOnClose == null ? void 0 : userOnClose();
      closeMessage(instance);
    },
    onDestroy: () => {
      render(null, container);
    }
  };
  const vnode = createVNode(MessageConstructor, props, isFunction$1(props.message) || isVNode(props.message) ? {
    default: isFunction$1(props.message) ? props.message : () => props.message
  } : null);
  vnode.appContext = context || message._context;
  render(vnode, container);
  appendTo.appendChild(container.firstElementChild);
  const vm = vnode.component;
  const handler = {
    close: () => {
      vm.exposed.visible.value = false;
    }
  };
  const instance = {
    id,
    vnode,
    vm,
    handler,
    props: vnode.component.props
  };
  return instance;
};
const message = (options = {}, context) => {
  if (!isClient)
    return { close: () => void 0 };
  const normalized = normalizeOptions(options);
  if (normalized.grouping && instances.length) {
    const instance2 = instances.find(({ vnode: vm }) => {
      var _a2;
      return ((_a2 = vm.props) == null ? void 0 : _a2.message) === normalized.message;
    });
    if (instance2) {
      instance2.props.repeatNum += 1;
      instance2.props.type = normalized.type;
      return instance2.handler;
    }
  }
  if (isNumber(messageConfig.max) && instances.length >= messageConfig.max) {
    return { close: () => void 0 };
  }
  const instance = createMessage(normalized, context);
  instances.push(instance);
  return instance.handler;
};
messageTypes.forEach((type) => {
  message[type] = (options = {}, appContext) => {
    const normalized = normalizeOptions(options);
    return message({ ...normalized, type }, appContext);
  };
});
function closeAll(type) {
  for (const instance of instances) {
    if (!type || type === instance.props.type) {
      instance.handler.close();
    }
  }
}
message.closeAll = closeAll;
message._context = null;
const ElMessage = withInstallFunction(message, "$message");
const FlyElForm = defineComponent({
  name: "FlyElForm",
  props: {
    // 模式 默认form表单模式 search为搜索条模式
    model: {
      type: String,
      default: "form"
    },
    // 是否启用单步错误提示 如果有多个未通过的表单项，只会依次提示第一个未通过的表单项
    singleStepErrorTip: {
      type: Boolean,
      default: false
    },
    // 行内换行模式
    inlineBlock: {
      type: Boolean,
      default: false
    },
    /**
     * 表单数据
     */
    form: {
      type: Object,
      require: true
    },
    /**
     * 表单状态
     */
    status: {
      type: String,
      default: "create"
    },
    /**
     * 表单配置
     */
    formProps: {
      type: Object,
      default: () => {
        return {};
      }
    },
    /**
     * 表单事件
     */
    formEvents: {
      type: Object,
      default: () => {
        return {};
      }
    },
    /**表单项配置 */
    formItemProps: {
      type: Object,
      default: () => {
        return {};
      }
    },
    /**表单row配置 */
    formRowProps: {
      type: Object,
      default: () => {
        return {
          gutter: 10
        };
      }
    },
    /**表单col配置 */
    formColProps: {
      type: Object,
      default: () => {
        return {
          xs: 24,
          sm: 12,
          md: 12,
          lg: 6
        };
      }
    },
    // 是否展示表单底部
    showFooter: {
      type: Boolean,
      default: true
    },
    footerRowProps: {
      type: Object,
      default: () => {
        return {};
      }
    },
    // 表单操作按钮
    action: {
      type: Array,
      default: () => {
        return ["submit", "reset"];
      }
    },
    // 表单操作按钮配置
    actionProps: {
      type: Object,
      default: () => {
        return {};
      }
    },
    // 严格模式只接受内置的表单项
    strict: {
      type: Boolean,
      default: false
    }
  },
  setup(props, context) {
    const isFirstInit = ref(true);
    const formContent = ref({});
    const requests = ref({});
    const rules = ref({});
    const sourceData = ref({});
    const formValues = ref({});
    const formInitValues = ref({});
    const formKeyAndName = reactive({});
    const FlyFormRef = ref(null);
    const needOverWriteForm = ref({});
    const needReturnSourceKeys = ref([]);
    const updateTimeout = ref(null);
    const isEqual = (a, b) => {
      if (a === b) return true;
      if (typeof a !== "object" || a === null || typeof b !== "object" || b === null)
        return false;
      const keysA = Object.keys(a);
      const keysB = Object.keys(b);
      if (keysA.length !== keysB.length) return false;
      for (const key of keysA) {
        if (!isEqual(a[key], b[key])) return false;
      }
      return true;
    };
    const overWrite = () => {
      if (needOverWriteForm.value) {
        Object.keys(needOverWriteForm.value).forEach((key) => {
          if (hasOwnPropertySafely(formValues.value, key)) {
            formValues.value[key] = needOverWriteForm.value[key];
          }
        });
        needOverWriteForm.value = {};
      }
    };
    const generatorRluesAndRequests = async (form) => {
      const res = collectFormContent(form);
      const newRules = res.rules;
      const oldRulesKeys = Object.keys(rules);
      oldRulesKeys.forEach((key) => {
        if (!hasOwnPropertySafely(newRules, key)) {
          delete rules[key];
        }
      });
      for (const key in newRules) {
        if (hasOwnPropertySafely(newRules, key)) {
          if (!hasOwnPropertySafely(rules, key) || !isEqual(rules[key], newRules[key])) {
            rules[key] = newRules[key];
          }
        }
      }
      const newRequests = res.requests;
      const oldRequestsKeys = Object.keys(requests.value);
      oldRequestsKeys.forEach((key) => {
        if (!hasOwnPropertySafely(newRequests, key)) {
          delete requests.value[key];
        }
      });
      for (const key in newRequests) {
        if (hasOwnPropertySafely(newRequests, key)) {
          if (requests.value[key] !== newRequests[key]) {
            requests.value[key] = newRequests[key];
          }
        }
      }
      const newFormKeyAndName = res.formKeyAndName || {};
      const oldFormKeyAndNameKeys = Object.keys(formKeyAndName);
      oldFormKeyAndNameKeys.forEach((key) => {
        if (!hasOwnPropertySafely(newFormKeyAndName, key)) {
          delete formKeyAndName[key];
        }
      });
      for (const key in newFormKeyAndName) {
        if (hasOwnPropertySafely(newFormKeyAndName, key)) {
          if (formKeyAndName[key] !== newFormKeyAndName[key]) {
            formKeyAndName[key] = newFormKeyAndName[key];
          }
        }
      }
      formContent.value = res.formContent;
      if (isFirstInit.value) {
        const requests2 = Object.keys(res.requests).map((key) => {
          return res.requests[key]();
        });
        formInitValues.value = Object.assign({}, res.formData);
        if (requests2 && requests2.length > 0) {
          await Promise.allSettled(requests2).catch((err) => {
            console.warn(err);
          });
        }
        formValues.value = Object.assign({}, res.formData);
        if (needOverWriteForm.value) {
          overWrite(needOverWriteForm.value);
          needOverWriteForm.value = {};
        }
        nextTick(() => {
          isFirstInit.value = false;
        });
      }
    };
    const collectFormContent = (data = []) => {
      const res = {
        formContent: [],
        formData: {},
        rules: {},
        requests: {},
        formKeyAndName: {}
      };
      const inputTips = ["el-input", "el-input-number"];
      data.forEach((item) => {
        if (!hasOwnPropertySafely(item, "type") && !hasOwnPropertySafely(item, "hidden")) {
          throw new Error(`form item type is required.`);
        }
        if (hasOwnPropertySafely(item, "key")) {
          if (hasOwnPropertySafely(res.formKeyAndName, item.key)) {
            throw new Error(
              `form item key "${item.key}" is duplicated in the current form definition. Please use another key.`
            );
          } else {
            res.formKeyAndName[item.key] = item.name;
          }
          if (item.type === "el-input-number") {
            res.formData[item.key] = hasOwnPropertySafely(item, "value") ? item.value : null;
          } else if (item.type === "el-checkbox-group") {
            res.formData[item.key] = hasOwnPropertySafely(item, "value") ? item.value : [];
          } else {
            if (hasOwnPropertySafely(item, "type") && item.type !== "el-row" && item.type !== "title") {
              res.formData[item.key] = hasOwnPropertySafely(item, "value") ? item.value : void 0;
            }
          }
        }
        if (hasOwnPropertySafely(item, "rules") && item.rules.length > 0) {
          res.rules[item.key] = item.rules;
        }
        if (item.required) {
          const requiredType = hasOwnPropertySafely(item, "requiredType") ? item.requiredType : requireTypes[item.type] || "string";
          const tips = {
            required: true,
            message: `${inputTips.includes(item.type) ? "请填写" : "请选择"}${item.name}`,
            trigger: "change",
            type: requiredType
          };
          if (hasOwnPropertySafely(res.rules, item.key) && res.rules[item.key].length > 0) {
            res.rules[item.key] = [tips, ...res.rules[item.key]];
          } else {
            res.rules[item.key] = [tips];
          }
        }
        if (hasOwnPropertySafely(item, "source") && hasOwnPropertySafely(item.source, "requestFunction")) {
          res.requests[item.key] = generatorRequestFunction(item);
        } else if (hasOwnPropertySafely(item, "source") && hasOwnPropertySafely(item.source, "data") && item.source) {
          sourceData.value[item.key] = item.source.data;
          if (item.source.returnSource) {
            needReturnSourceKeys.value.push(item.key);
          }
        } else {
          !hasOwnPropertySafely(sourceData.value, item.key) && (sourceData.value[item.key] = []);
        }
        if (!item.placeholder) {
          item.placeholder = (inputTips.includes(item.type) ? "请填写" : "请选择") + item.name;
        }
        const mItem = { ...item };
        if (hasOwnPropertySafely(mItem, "source")) {
          delete mItem.source;
        }
        if (item.type === "el-row" && hasOwnPropertySafely(item, "children") && item.children.length > 0) {
          const cRes = collectFormContent(item.children);
          res.rules = { ...res.rules, ...cRes.rules };
          res.formData = { ...res.formData, ...cRes.formData };
          res.requests = { ...res.requests, ...cRes.requests };
          res.formKeyAndName = { ...res.formKeyAndName, ...cRes.formKeyAndName };
          mItem.children = cRes.formContent;
        }
        res.formContent.push(mItem);
      });
      return res;
    };
    const generatorRequestFunction = (item) => {
      const source = item.source;
      return async function() {
        try {
          const {
            requestFunction,
            params,
            handle,
            effectKeys,
            effectKeysHandle
          } = source;
          let requestParams = params || {};
          if (effectKeys && effectKeys.length > 0) {
            const effectKeysFormValues = {};
            for (let i = 0; i < effectKeys.length; i++) {
              effectKeysFormValues[effectKeys[i]] = formValues.value[effectKeys[i]];
            }
            requestParams = { ...requestParams, ...effectKeysFormValues };
            if (effectKeysHandle && typeof effectKeysHandle === "function") {
              requestParams = effectKeysHandle({
                params: requestParams,
                formValues: formValues.value,
                sourceData: sourceData.value,
                effectKeys
              });
            }
          }
          const res = await requestFunction(requestParams);
          sourceData.value[item.key] = handle ? handle(
            res,
            requestParams,
            formValues.value || formInitValues.value
          ) : res;
          return res;
        } catch (err) {
          console.error(err);
          return { error: err };
        }
      };
    };
    generatorRluesAndRequests(props.form);
    watch(
      // @ts-ignore
      props.form,
      async (newVal, oldVal) => {
        await generatorRluesAndRequests(newVal);
      },
      {
        deep: true
      }
    );
    return {
      isFirstInit,
      formContent,
      requests,
      rules,
      sourceData,
      formInitValues,
      formKeyAndName,
      formValues,
      FlyFormRef,
      needOverWriteForm,
      overWrite,
      needReturnSourceKeys,
      updateTimeout
    };
  },
  methods: {
    async submit() {
      const formRef = this.$refs.FlyFormRef;
      await formRef.validate((valid, errors) => {
        let returnData = {
          valid,
          formValues: this.formValues
        };
        console.log(this.needReturnSourceKeys);
        if (this.needReturnSourceKeys && this.needReturnSourceKeys.length > 0) {
          let templateSourceData = {};
          this.needReturnSourceKeys.forEach((key) => {
            templateSourceData[key] = this.sourceData[key];
          });
          returnData.sourceData = templateSourceData;
        }
        this.$emit("submit", returnData);
        if (!valid && this.$props.model === "search") {
          const errorMsg = [];
          const errorNames = [];
          Object.keys(errors).forEach((key) => {
            const item = errors[key][0];
            errorMsg.push(item.message);
            errorNames.push(this.formKeyAndName[key]);
          });
          if (this.$props.singleStepErrorTip) {
            ElMessage.error(errorMsg[0]);
          } else {
            ElMessage.error(
              `请完善${errorNames.length > 0 ? errorNames.join("、") : "查询条件"}`
            );
          }
        }
      });
    },
    /**
     * 获取组件实例
     * @param key 生成component的key 同时会填入ref 通过this.$refs[key]调用
     */
    getFormRef(key) {
      try {
        const formRef = this.$refs.FlyFormRef;
        return formRef;
      } catch (error) {
        console.error(error);
      }
    },
    getComponentRefByKey(key) {
      if (key && typeof key === "string") {
        try {
          return this.$refs[key];
        } catch (error) {
          console.error(error);
        }
      } else {
        console.error("请传入正确的key");
        return false;
      }
    },
    reset() {
      const formRef = this.$refs.FlyFormRef;
      formRef.resetFields();
      this.$emit("reset");
    },
    // overWrite(data: any) {
    //   const $this = this
    //   Object.keys(data).forEach((key) => {
    //     if (hasOwnPropertySafely($this.formValues, key)) {
    //       $this.formValues[key] = data[key]
    //     }
    //   })
    // },
    setFormValues(data) {
      const formRef = this.$refs.FlyFormRef;
      if (!data) return console.error("setFormValues error: 请传入正确的数据");
      nextTick(async () => {
        try {
          if (formRef) {
            await formRef.resetFields();
            if (!this.isFirstInit) {
              Object.keys(data).forEach((key) => {
                if (hasOwnPropertySafely(this.formValues, key)) {
                  this.formValues[key] = data[key];
                }
              });
            } else {
              this.needOverWriteForm = data;
            }
          }
        } catch (err) {
          console.error("setFormValues error:", err);
        }
      });
    },
    /**
     * 更新数据源
     * @param keys
     */
    async updateSource(updateArray) {
      if (!updateArray) return console.error("请传入正确的更新数据");
      let keys = [];
      if (Array.isArray(updateArray)) {
        for (let i = 0; i < updateArray.length; i++) {
          let item = updateArray[i];
          if (hasOwnPropertySafely(item, "key")) {
            if (hasOwnPropertySafely(item, "value")) {
              this.sourceData[item.key] = item.value;
            } else {
              keys.push(item.key);
            }
          } else {
            console.error("请传入正确的更新数据,错误的数据:", item);
          }
        }
        if (keys.length > 0) {
          await this.updateRequestSource(keys);
        } else {
          this.$forceUpdate();
        }
      } else {
        console.error("请传入正确的更新数据");
      }
    },
    /**
     * 更新数据源
     * @param keys
     */
    async updateRequestSource(keys) {
      if (!keys) return;
      let updateRequests = [];
      if (Array.isArray(keys)) {
        for (let i = 0; i < keys.length; i++) {
          updateRequests.push(this.requests[keys[i]]());
        }
      } else {
        updateRequests = [this.requests[keys]()];
      }
      if (updateRequests.length === 0) {
        return console.warn("请传入正确的keys");
      }
      await Promise.allSettled(updateRequests).catch((err) => {
        console.warn(err);
      });
      this.$forceUpdate();
    },
    /**
     * 设置表单值
     */
    setKeyValue(key, value) {
      if (hasOwnPropertySafely(this.formValues, key)) {
        this.formValues[key] = value;
      } else {
        console.error("表单中不存在" + key + "属性");
      }
    },
    getFormValues() {
      return this.formValues;
    },
    clearValidate(data) {
      const formRef = this.$refs.FlyFormRef;
      if (data) {
        window.requestAnimationFrame(() => {
          formRef.clearValidate(data);
        });
      } else {
        this.$nextTick(() => {
          window.requestAnimationFrame(() => {
            formRef.clearValidate();
          });
        });
      }
    }
  },
  render(props) {
    const generatorFooterButton = () => {
      const btns = {
        reset: h(
          resolveComponent("el-button"),
          {
            type: "default",
            onClick: () => {
              this.reset();
            }
          },
          {
            default: () => "重置"
            // 改为函数形式插槽
          }
        ),
        submit: h(
          resolveComponent("el-button"),
          {
            type: "primary",
            onClick: () => {
              this.submit();
            }
          },
          {
            default: () => props.model === "search" ? "搜索" : props.status === "create" ? "保存" : "修改"
          }
        )
      };
      if (props.action) {
        return props.action.map((btn) => {
          if (hasOwnPropertySafely(props.actionProps, btn)) {
            return h(
              resolveComponent("el-button"),
              {
                type: "default",
                ...props.actionProps[btn].componentProps,
                onClick: () => {
                  if (["submit", "reset"].includes(btn)) {
                    this[btn]();
                  }
                },
                ...props.actionProps[btn].componentEvents
              },
              {
                default: () => props.actionProps[btn].text || ""
                // 确保插槽是函数形式
              }
            );
          } else {
            return btns[btn];
          }
        });
      }
    };
    const generatorFooter = () => {
      if (!props.showFooter) return;
      return h(
        // @ts-ignore
        resolveComponent("el-row"),
        {
          ...props.formRowProps,
          class: "fly-form-footer",
          justify: "end",
          ...props.footerRowProps
        },
        { default: () => generatorFooterButton() }
      );
    };
    const generatorRow = (item) => {
      const itemNodes2 = [];
      if (item.children && item.children.length > 0) {
        item.children.forEach((it) => {
          if (hasOwnPropertySafely(it, "visitable") && it.visitable && it.visitable(props.status, this.formValues) || !hasOwnPropertySafely(it, "visitable") && hasOwnPropertySafely(it, "type")) {
            const formit = generatorCol(it);
            itemNodes2.push(formit);
          }
        });
      }
      return h(
        // @ts-ignore
        resolveComponent("el-row"),
        {
          ...props.formRowProps,
          ...item.componentProps,
          class: `fly-form-row ${item.class ? item.class : ""}`,
          style: {
            ...item.style
          }
        },
        { default: () => itemNodes2 }
      );
    };
    const generatorCol = (item) => {
      const colProps = item.colProps ? item.colProps : {};
      if (hasOwnPropertySafely(item, "hidden") && item.hidden) {
        return null;
      }
      const layout = h(
        // @ts-ignore
        resolveComponent("el-col"),
        {
          ...props.formColProps,
          ...colProps,
          key: item.key
        },
        { default: () => generatorFormItem(item) }
      );
      return layout;
    };
    const generatorTitle = (item) => {
      const props2 = item.componentProps ? item.componentProps : {};
      return h(
        resolveComponent("el-row"),
        {
          ...props2
        },
        [
          h(
            "h3",
            {
              class: `fly-form-title ${item.class ? item.class : ""}`,
              style: {
                ...item.style
              }
            },
            {
              default: () => item.slot ? item.slot : item.name
            }
          )
        ]
      );
    };
    const generatorForm = (data) => {
      if (!data) return [];
      const res = [];
      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        if (["el-row", "Title"].includes(item.type)) {
          switch (item.type) {
            case "el-row":
              res.push(generatorRow(item));
              break;
            case "Title":
              res.push(generatorTitle(item));
              break;
            case "title":
              res.push(generatorTitle(item));
              break;
          }
        } else {
          if (hasOwnPropertySafely(item, "visitable") && item.visitable(props.status, this.formValues) || !hasOwnPropertySafely(item, "visitable")) {
            const formItem = props.inlineBlock || props.model == "search" ? generatorInlineBlock(item) : generatorBlock(item);
            res.push(formItem);
          }
        }
      }
      return res;
    };
    const generatorInlineBlock = (item) => {
      if (!hasOwnPropertySafely(item, "hidden")) {
        return generatorFormItem(item);
      }
    };
    const generatorBlock = (item) => {
      if (!hasOwnPropertySafely(item, "hidden")) {
        return h(
          // @ts-ignore
          resolveComponent("el-row"),
          {
            class: `fly-form-row`
          },
          { default: () => generatorFormItem(item) }
        );
      }
    };
    const generatorFormItem = (item) => {
      const slotRender = item.tips ? {
        label: () => generatorTipsLabel(item),
        default: () => generatorItem(item)
      } : { default: () => generatorItem(item) };
      return h(
        // @ts-ignore
        resolveComponent("el-form-item"),
        {
          key: item.key,
          prop: item.key,
          label: item.name,
          class: `fly-form-item ${item.class ? item.class : ""}`,
          ...item.formItemProps
        },
        slotRender
      );
    };
    const generatorItem = (item) => {
      switch (item.type) {
        case "el-select":
        case "el-select-v2":
          return generatorSelect(item);
        case "el-radio-group":
          return generatorRadioGroup(item);
        case "el-checkbox-group":
          return generatorCheckboxGroup(item);
        case "el-upload":
          return generatorUpload(item);
        default:
          return generatorComponents(item);
      }
    };
    const generatorComponents = (item) => {
      if (props.strict && hasOwnPropertySafely(requireTypes, item.type) || !props.strict) {
        if (item.slot) {
          return h(
            // @ts-ignore
            resolveComponent(item.type),
            {
              ...generatorDefaultProps(item),
              ...generatorSourceData(item),
              ...item.componentProps,
              attrs: { placeholder: item.placeholder },
              ...generatorDefaultEvents(item),
              ...item.componentEvents
            },
            {
              default: () => item.slot(h)
              // 确保 slot 是函数形式
            }
          );
        } else {
          return h(resolveComponent(item.type), {
            ...generatorDefaultProps(item),
            ...generatorSourceData(item),
            ...item.componentProps,
            attrs: { placeholder: item.placeholder },
            ...generatorDefaultEvents(item),
            ...item.componentEvents
          });
        }
      } else {
        return h(
          "span",
          {
            style: {
              color: "red"
            }
          },
          `Unaccepted component types '${item.type}'`
        );
      }
    };
    const generatorSourceData = (item) => {
      const res = {};
      const types = ["AutoComplete", "el-transfer"];
      if (types.includes(item.type) && hasOwnPropertySafely(this.sourceData, item.key)) {
        res["data"] = this.sourceData[item.key];
      } else if (item.type == "el-cascader" && hasOwnPropertySafely(this.sourceData, item.key)) {
        res["options"] = this.sourceData[item.key];
      } else {
        res["data"] = [];
      }
      return res;
    };
    const generatorRadioGroup = (item) => {
      return h(
        // @ts-ignore
        resolveComponent("el-radio-group"),
        {
          modelValue: this.formValues[item.key],
          "onUpdate:modelValue": (val) => {
            this.formValues[item.key] = val;
          },
          ...item.componentProps,
          ...item.componentEvents
        },
        { default: () => generatorRadio(item, this.sourceData[item.key]) }
      );
    };
    const generatorRadio = (propItem, data) => {
      const radios = data && data.length > 0 ? data : propItem.options || [];
      const res = [];
      const { optionProps } = propItem;
      for (let i = 0; i < radios.length; i++) {
        const item = radios[i];
        const option = h(
          // @ts-ignore
          resolveComponent("el-radio"),
          {
            value: propItem.showValue && item[propItem.showValue] || item.value,
            ...optionProps
          },
          { default: () => item[propItem.showName || "label"] }
        );
        res.push(option);
      }
      return res;
    };
    const generatorCheckboxGroup = (item) => {
      return h(
        // @ts-ignore
        resolveComponent("el-checkbox-group"),
        {
          modelValue: this.formValues[item.key],
          "onUpdate:modelValue": (val) => {
            this.formValues[item.key] = val;
          },
          ...item.componentProps,
          ...item.componentEvents
        },
        {
          default: () => generatorCheckbox(item, this.sourceData[item.key])
        }
      );
    };
    const generatorCheckbox = (propItem, data) => {
      const checkboxs = data && data.length > 0 ? data : propItem.options || [];
      const res = [];
      const { optionProps } = propItem;
      for (let i = 0; i < checkboxs.length; i++) {
        const item = checkboxs[i];
        const option = h(
          // @ts-ignore
          resolveComponent("el-checkbox"),
          {
            value: propItem.showValue && item[propItem.showValue] || item.value,
            ...optionProps,
            key: propItem.showValue && item[propItem.showValue] || item.value
          },
          {
            default: () => item[propItem.showName || "label"]
          }
        );
        res.push(option);
      }
      return res;
    };
    const generatorSelect = (item) => {
      var _a2;
      const formRef = this;
      const sourceData = item.options || this.sourceData[item.key] || [];
      let defaultEvent = {
        "onUpdate:modelValue": (val) => {
          this.formValues[item.key] = val;
        }
      };
      if (item.effectKeys && item.effectKeys.length > 0) {
        defaultEvent = {
          "onUpdate:modelValue": (val) => {
            this.formValues[item.key] = val;
            nextTick(() => {
              if (!this.updateTimeout) {
                this.updateTimeout = setTimeout(() => {
                  formRef.updateRequestSource(item.effectKeys);
                  this.updateTimeout = null;
                }, 100);
              }
            });
          }
        };
      }
      const selectProps = {
        modelValue: this.formValues[item.key],
        placeholder: item.placeholder,
        ...defaultEvent,
        ...item.componentProps,
        ...item.componentEvents
      };
      if ((_a2 = item.custom) == null ? void 0 : _a2.returnObject) {
        selectProps["value-key"] = item.showValue || "value";
      }
      if (item.type === "el-select-v2") {
        selectProps["options"] = Array.isArray(sourceData) ? sourceData : [];
        selectProps["key"] = `${item.key}-${Date.now()}`;
      }
      if (item.type === "el-select-v2" && item.optionSlot) ;
      let defaultProps = {
        default: () => null
      };
      if (item.type === "el-select-v2") {
        defaultProps.default = (optionItem) => item.optionSlot ? item.optionSlot(optionItem, h) : null;
      } else if (item.type === "el-select") {
        defaultProps.default = () => {
          var _a3;
          return ((_a3 = item.custom) == null ? void 0 : _a3.group) ? generatorOptionsGroup(item, sourceData) : generatorOptions(
            item,
            Array.isArray(sourceData) ? sourceData : []
          );
        };
      }
      return h(resolveComponent(item.type), selectProps, defaultProps);
    };
    const generatorOptionsGroup = (propItem, data = {}) => {
      const res = [];
      const ElOpGroupComponents = resolveComponent("el-option-group");
      for (const key in data) {
        const optionGroup = h(
          // @ts-ignore
          ElOpGroupComponents,
          {
            label: key
          },
          { default: () => generatorOptions(propItem, data[key]) }
        );
        res.push(optionGroup);
      }
      return res;
    };
    const generatorOptions = (propItem, data = []) => {
      var _a2;
      if (!Array.isArray(data) && !((_a2 = propItem.custom) == null ? void 0 : _a2.group)) {
        console.warn(
          `Select options data for key "${propItem.key}" is not an array:`,
          data
        );
        return [];
      }
      return data.map((item) => {
        var _a3;
        const value = ((_a3 = propItem.custom) == null ? void 0 : _a3.returnObject) ? item : item[propItem.showValue || "value"];
        item[propItem.showName || "label"];
        if (value === void 0) {
          console.warn(
            `Option value is undefined for key "${propItem.key}":`,
            item
          );
        }
        const optionProps = {
          value,
          key: item[propItem.showValue || "value"],
          label: item[propItem.showName || "label"],
          disabled: item.disabled,
          ...propItem.optionProps
        };
        const slots = propItem.optionSlot && typeof propItem.optionSlot === "function" ? { default: () => propItem.optionSlot(item, h) } : { default: () => item[propItem.showName || "label"] };
        return h(resolveComponent("el-option"), optionProps, slots);
      });
    };
    const generatorDefaultProps = (item) => {
      return {
        ref: item.key,
        modelValue: this.formValues[item.key],
        "onUpdate:modelValue": (val) => {
          this.formValues[item.key] = val;
        },
        placeholder: item.placeholder
      };
    };
    const generatorTipsLabel = (item) => {
      return h(
        "span",
        {
          class: "fly-form-item-tips"
        },
        [
          item.name,
          h(
            // @ts-ignore
            resolveComponent("el-popover"),
            {
              placement: "top-start",
              title: "提示",
              width: 200,
              trigger: "hover",
              ...item.tipLabelProps,
              content: item.tips
            },
            {
              reference: () => h(
                // @ts-ignore
                resolveComponent("el-icon"),
                {
                  class: "fly-form-item-tips-icon"
                },
                // @ts-ignore
                { default: () => h(resolveComponent("QuestionFilled")) }
              )
            }
          )
        ]
      );
    };
    const generatorDefaultEvents = (item) => {
      if (["el-date-picker"].includes(item.type)) {
        return {
          "on-change": (val) => {
            var _a2, _b;
            this.formValues[item.key] = val;
            if (item.effectKeys && item.effectKeys.length > 0) {
              this.updateRequestSource(item.effectKeys);
            }
            (_b = (_a2 = item.componentEvents) == null ? void 0 : _a2["on-change"]) == null ? void 0 : _b.call(_a2, val);
          }
        };
      } else {
        return {
          "onUpdate:modelValue": (val) => {
            var _a2, _b;
            this.formValues[item.key] = val;
            if (item.effectKeys && item.effectKeys.length > 0) {
              this.updateRequestSource(item.effectKeys);
            }
            (_b = (_a2 = item.componentEvents) == null ? void 0 : _a2["onUpdate:modelValue"]) == null ? void 0 : _b.call(_a2, val);
          }
        };
      }
    };
    const generatorUpload = (item) => {
      const slots = {};
      if (item.uploadSlots) {
        if (item.uploadSlots.default) {
          slots.default = () => item.uploadSlots.default(h);
        }
        if (item.uploadSlots.trigger) {
          slots.trigger = () => item.uploadSlots.trigger(h);
        }
        if (item.uploadSlots.tip) {
          slots.tip = () => item.uploadSlots.tip(h);
        }
        if (item.uploadSlots.file) {
          slots.file = (props2) => item.uploadSlots.file(props2, h);
        }
        if (item.uploadSlots.fileList) {
          slots.fileList = (props2) => item.uploadSlots.fileList(props2, h);
        }
      }
      if (!slots.default && !slots.trigger) {
        slots.default = () => h(
          resolveComponent("el-button"),
          { type: "primary" },
          { default: () => "点击上传" }
        );
      }
      const formatFileList = (list) => {
        if (!list) return [];
        if (!Array.isArray(list)) return [];
        return list.map((file) => {
          if (typeof file === "string") {
            return {
              name: file,
              url: file,
              uid: Date.now() + Math.random()
            };
          }
          return file;
        });
      };
      const currentFileList = ref(formatFileList(this.formValues[item.key]));
      return h(
        resolveComponent("el-upload"),
        {
          "file-list": currentFileList.value,
          "onUpdate:file-list": (val) => {
            currentFileList.value = val;
            this.formValues[item.key] = val;
          },
          ...item.componentProps,
          ...item.componentEvents,
          "on-success": (response, file, fileList) => {
            var _a2, _b;
            if (Array.isArray(fileList)) {
              currentFileList.value = fileList;
              this.formValues[item.key] = fileList;
            } else {
              if (!Array.isArray(currentFileList.value)) {
                currentFileList.value = [];
              }
              currentFileList.value.push(file);
              this.formValues[item.key] = currentFileList.value;
            }
            (_b = (_a2 = item.componentEvents) == null ? void 0 : _a2["on-success"]) == null ? void 0 : _b.call(_a2, response, file, fileList);
          }
        },
        slots
      );
    };
    const itemNodes = generatorForm(this.formContent);
    const $formProps = props.formProps || {};
    if (props.model == "search") {
      $formProps.inline = true;
    }
    const FormNode = h(
      // @ts-ignore
      resolveComponent("ElForm"),
      {
        ref: "FlyFormRef",
        model: this.formValues,
        rules: this.rules,
        ...$formProps,
        // 隐藏标签时默认标签位置为顶部
        labelPosition: $formProps.hideLabel ? "top" : $formProps.labelPosition,
        ...props.formEvents
      },
      {
        default: () => [
          ...itemNodes,
          props.model == "form" ? generatorFooter() : generatorFooterButton()
        ]
      }
    );
    return h(
      "div",
      {
        class: `fly-form ${props.formProps && props.formProps.hideLabel ? "fly-form-hide-label" : ""} ${props.formProps && props.formProps.class || ""} ${props.model == "search" ? "fly-search" : ""}`
      },
      FormNode
    );
  }
});
FlyElForm.install = (Vue) => {
  Vue.component(FlyElForm.name, FlyElForm);
};
export {
  FlyElForm as default
};
