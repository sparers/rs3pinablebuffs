(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory((function webpackLoadOptionalExternalModule() { try { return require("sharp"); } catch(e) {} }()), (function webpackLoadOptionalExternalModule() { try { return require("canvas"); } catch(e) {} }()), (function webpackLoadOptionalExternalModule() { try { return require("electron/common"); } catch(e) {} }()));
	else if(typeof define === 'function' && define.amd)
		define(["sharp", "canvas", "electron/common"], factory);
	else if(typeof exports === 'object')
		exports["TestApp"] = factory((function webpackLoadOptionalExternalModule() { try { return require("sharp"); } catch(e) {} }()), (function webpackLoadOptionalExternalModule() { try { return require("canvas"); } catch(e) {} }()), (function webpackLoadOptionalExternalModule() { try { return require("electron/common"); } catch(e) {} }()));
	else
		root["TestApp"] = factory(root["sharp"], root["canvas"], root["electron/common"]);
})(self, (__WEBPACK_EXTERNAL_MODULE_sharp__, __WEBPACK_EXTERNAL_MODULE_canvas__, __WEBPACK_EXTERNAL_MODULE_electron_common__) => {
return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "../node_modules/alpinejs/dist/module.esm.js"
/*!***************************************************!*\
  !*** ../node_modules/alpinejs/dist/module.esm.js ***!
  \***************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Alpine: () => (/* binding */ src_default),
/* harmony export */   "default": () => (/* binding */ module_default)
/* harmony export */ });
// packages/alpinejs/src/scheduler.js
var flushPending = false;
var flushing = false;
var queue = [];
var lastFlushedIndex = -1;
function scheduler(callback) {
  queueJob(callback);
}
function queueJob(job) {
  if (!queue.includes(job))
    queue.push(job);
  queueFlush();
}
function dequeueJob(job) {
  let index = queue.indexOf(job);
  if (index !== -1 && index > lastFlushedIndex)
    queue.splice(index, 1);
}
function queueFlush() {
  if (!flushing && !flushPending) {
    flushPending = true;
    queueMicrotask(flushJobs);
  }
}
function flushJobs() {
  flushPending = false;
  flushing = true;
  for (let i = 0; i < queue.length; i++) {
    queue[i]();
    lastFlushedIndex = i;
  }
  queue.length = 0;
  lastFlushedIndex = -1;
  flushing = false;
}

// packages/alpinejs/src/reactivity.js
var reactive;
var effect;
var release;
var raw;
var shouldSchedule = true;
function disableEffectScheduling(callback) {
  shouldSchedule = false;
  callback();
  shouldSchedule = true;
}
function setReactivityEngine(engine) {
  reactive = engine.reactive;
  release = engine.release;
  effect = (callback) => engine.effect(callback, { scheduler: (task) => {
    if (shouldSchedule) {
      scheduler(task);
    } else {
      task();
    }
  } });
  raw = engine.raw;
}
function overrideEffect(override) {
  effect = override;
}
function elementBoundEffect(el) {
  let cleanup2 = () => {
  };
  let wrappedEffect = (callback) => {
    let effectReference = effect(callback);
    if (!el._x_effects) {
      el._x_effects = /* @__PURE__ */ new Set();
      el._x_runEffects = () => {
        el._x_effects.forEach((i) => i());
      };
    }
    el._x_effects.add(effectReference);
    cleanup2 = () => {
      if (effectReference === void 0)
        return;
      el._x_effects.delete(effectReference);
      release(effectReference);
    };
    return effectReference;
  };
  return [wrappedEffect, () => {
    cleanup2();
  }];
}
function watch(getter, callback) {
  let firstTime = true;
  let oldValue;
  let effectReference = effect(() => {
    let value = getter();
    JSON.stringify(value);
    if (!firstTime) {
      queueMicrotask(() => {
        callback(value, oldValue);
        oldValue = value;
      });
    } else {
      oldValue = value;
    }
    firstTime = false;
  });
  return () => release(effectReference);
}

// packages/alpinejs/src/mutation.js
var onAttributeAddeds = [];
var onElRemoveds = [];
var onElAddeds = [];
function onElAdded(callback) {
  onElAddeds.push(callback);
}
function onElRemoved(el, callback) {
  if (typeof callback === "function") {
    if (!el._x_cleanups)
      el._x_cleanups = [];
    el._x_cleanups.push(callback);
  } else {
    callback = el;
    onElRemoveds.push(callback);
  }
}
function onAttributesAdded(callback) {
  onAttributeAddeds.push(callback);
}
function onAttributeRemoved(el, name, callback) {
  if (!el._x_attributeCleanups)
    el._x_attributeCleanups = {};
  if (!el._x_attributeCleanups[name])
    el._x_attributeCleanups[name] = [];
  el._x_attributeCleanups[name].push(callback);
}
function cleanupAttributes(el, names) {
  if (!el._x_attributeCleanups)
    return;
  Object.entries(el._x_attributeCleanups).forEach(([name, value]) => {
    if (names === void 0 || names.includes(name)) {
      value.forEach((i) => i());
      delete el._x_attributeCleanups[name];
    }
  });
}
function cleanupElement(el) {
  el._x_effects?.forEach(dequeueJob);
  while (el._x_cleanups?.length)
    el._x_cleanups.pop()();
}
var observer = new MutationObserver(onMutate);
var currentlyObserving = false;
function startObservingMutations() {
  observer.observe(document, { subtree: true, childList: true, attributes: true, attributeOldValue: true });
  currentlyObserving = true;
}
function stopObservingMutations() {
  flushObserver();
  observer.disconnect();
  currentlyObserving = false;
}
var queuedMutations = [];
function flushObserver() {
  let records = observer.takeRecords();
  queuedMutations.push(() => records.length > 0 && onMutate(records));
  let queueLengthWhenTriggered = queuedMutations.length;
  queueMicrotask(() => {
    if (queuedMutations.length === queueLengthWhenTriggered) {
      while (queuedMutations.length > 0)
        queuedMutations.shift()();
    }
  });
}
function mutateDom(callback) {
  if (!currentlyObserving)
    return callback();
  stopObservingMutations();
  let result = callback();
  startObservingMutations();
  return result;
}
var isCollecting = false;
var deferredMutations = [];
function deferMutations() {
  isCollecting = true;
}
function flushAndStopDeferringMutations() {
  isCollecting = false;
  onMutate(deferredMutations);
  deferredMutations = [];
}
function onMutate(mutations) {
  if (isCollecting) {
    deferredMutations = deferredMutations.concat(mutations);
    return;
  }
  let addedNodes = [];
  let removedNodes = /* @__PURE__ */ new Set();
  let addedAttributes = /* @__PURE__ */ new Map();
  let removedAttributes = /* @__PURE__ */ new Map();
  for (let i = 0; i < mutations.length; i++) {
    if (mutations[i].target._x_ignoreMutationObserver)
      continue;
    if (mutations[i].type === "childList") {
      mutations[i].removedNodes.forEach((node) => {
        if (node.nodeType !== 1)
          return;
        if (!node._x_marker)
          return;
        removedNodes.add(node);
      });
      mutations[i].addedNodes.forEach((node) => {
        if (node.nodeType !== 1)
          return;
        if (removedNodes.has(node)) {
          removedNodes.delete(node);
          return;
        }
        if (node._x_marker)
          return;
        addedNodes.push(node);
      });
    }
    if (mutations[i].type === "attributes") {
      let el = mutations[i].target;
      let name = mutations[i].attributeName;
      let oldValue = mutations[i].oldValue;
      let add2 = () => {
        if (!addedAttributes.has(el))
          addedAttributes.set(el, []);
        addedAttributes.get(el).push({ name, value: el.getAttribute(name) });
      };
      let remove = () => {
        if (!removedAttributes.has(el))
          removedAttributes.set(el, []);
        removedAttributes.get(el).push(name);
      };
      if (el.hasAttribute(name) && oldValue === null) {
        add2();
      } else if (el.hasAttribute(name)) {
        remove();
        add2();
      } else {
        remove();
      }
    }
  }
  removedAttributes.forEach((attrs, el) => {
    cleanupAttributes(el, attrs);
  });
  addedAttributes.forEach((attrs, el) => {
    onAttributeAddeds.forEach((i) => i(el, attrs));
  });
  for (let node of removedNodes) {
    if (addedNodes.some((i) => i.contains(node)))
      continue;
    onElRemoveds.forEach((i) => i(node));
  }
  for (let node of addedNodes) {
    if (!node.isConnected)
      continue;
    onElAddeds.forEach((i) => i(node));
  }
  addedNodes = null;
  removedNodes = null;
  addedAttributes = null;
  removedAttributes = null;
}

// packages/alpinejs/src/scope.js
function scope(node) {
  return mergeProxies(closestDataStack(node));
}
function addScopeToNode(node, data2, referenceNode) {
  node._x_dataStack = [data2, ...closestDataStack(referenceNode || node)];
  return () => {
    node._x_dataStack = node._x_dataStack.filter((i) => i !== data2);
  };
}
function closestDataStack(node) {
  if (node._x_dataStack)
    return node._x_dataStack;
  if (typeof ShadowRoot === "function" && node instanceof ShadowRoot) {
    return closestDataStack(node.host);
  }
  if (!node.parentNode) {
    return [];
  }
  return closestDataStack(node.parentNode);
}
function mergeProxies(objects) {
  return new Proxy({ objects }, mergeProxyTrap);
}
var mergeProxyTrap = {
  ownKeys({ objects }) {
    return Array.from(
      new Set(objects.flatMap((i) => Object.keys(i)))
    );
  },
  has({ objects }, name) {
    if (name == Symbol.unscopables)
      return false;
    return objects.some(
      (obj) => Object.prototype.hasOwnProperty.call(obj, name) || Reflect.has(obj, name)
    );
  },
  get({ objects }, name, thisProxy) {
    if (name == "toJSON")
      return collapseProxies;
    return Reflect.get(
      objects.find(
        (obj) => Reflect.has(obj, name)
      ) || {},
      name,
      thisProxy
    );
  },
  set({ objects }, name, value, thisProxy) {
    const target = objects.find(
      (obj) => Object.prototype.hasOwnProperty.call(obj, name)
    ) || objects[objects.length - 1];
    const descriptor = Object.getOwnPropertyDescriptor(target, name);
    if (descriptor?.set && descriptor?.get)
      return descriptor.set.call(thisProxy, value) || true;
    return Reflect.set(target, name, value);
  }
};
function collapseProxies() {
  let keys = Reflect.ownKeys(this);
  return keys.reduce((acc, key) => {
    acc[key] = Reflect.get(this, key);
    return acc;
  }, {});
}

// packages/alpinejs/src/interceptor.js
function initInterceptors(data2) {
  let isObject2 = (val) => typeof val === "object" && !Array.isArray(val) && val !== null;
  let recurse = (obj, basePath = "") => {
    Object.entries(Object.getOwnPropertyDescriptors(obj)).forEach(([key, { value, enumerable }]) => {
      if (enumerable === false || value === void 0)
        return;
      if (typeof value === "object" && value !== null && value.__v_skip)
        return;
      let path = basePath === "" ? key : `${basePath}.${key}`;
      if (typeof value === "object" && value !== null && value._x_interceptor) {
        obj[key] = value.initialize(data2, path, key);
      } else {
        if (isObject2(value) && value !== obj && !(value instanceof Element)) {
          recurse(value, path);
        }
      }
    });
  };
  return recurse(data2);
}
function interceptor(callback, mutateObj = () => {
}) {
  let obj = {
    initialValue: void 0,
    _x_interceptor: true,
    initialize(data2, path, key) {
      return callback(this.initialValue, () => get(data2, path), (value) => set(data2, path, value), path, key);
    }
  };
  mutateObj(obj);
  return (initialValue) => {
    if (typeof initialValue === "object" && initialValue !== null && initialValue._x_interceptor) {
      let initialize = obj.initialize.bind(obj);
      obj.initialize = (data2, path, key) => {
        let innerValue = initialValue.initialize(data2, path, key);
        obj.initialValue = innerValue;
        return initialize(data2, path, key);
      };
    } else {
      obj.initialValue = initialValue;
    }
    return obj;
  };
}
function get(obj, path) {
  return path.split(".").reduce((carry, segment) => carry[segment], obj);
}
function set(obj, path, value) {
  if (typeof path === "string")
    path = path.split(".");
  if (path.length === 1)
    obj[path[0]] = value;
  else if (path.length === 0)
    throw error;
  else {
    if (obj[path[0]])
      return set(obj[path[0]], path.slice(1), value);
    else {
      obj[path[0]] = {};
      return set(obj[path[0]], path.slice(1), value);
    }
  }
}

// packages/alpinejs/src/magics.js
var magics = {};
function magic(name, callback) {
  magics[name] = callback;
}
function injectMagics(obj, el) {
  let memoizedUtilities = getUtilities(el);
  Object.entries(magics).forEach(([name, callback]) => {
    Object.defineProperty(obj, `$${name}`, {
      get() {
        return callback(el, memoizedUtilities);
      },
      enumerable: false
    });
  });
  return obj;
}
function getUtilities(el) {
  let [utilities, cleanup2] = getElementBoundUtilities(el);
  let utils = { interceptor, ...utilities };
  onElRemoved(el, cleanup2);
  return utils;
}

// packages/alpinejs/src/utils/error.js
function tryCatch(el, expression, callback, ...args) {
  try {
    return callback(...args);
  } catch (e) {
    handleError(e, el, expression);
  }
}
function handleError(...args) {
  return errorHandler(...args);
}
var errorHandler = normalErrorHandler;
function setErrorHandler(handler4) {
  errorHandler = handler4;
}
function normalErrorHandler(error2, el, expression = void 0) {
  error2 = Object.assign(
    error2 ?? { message: "No error message given." },
    { el, expression }
  );
  console.warn(`Alpine Expression Error: ${error2.message}

${expression ? 'Expression: "' + expression + '"\n\n' : ""}`, el);
  setTimeout(() => {
    throw error2;
  }, 0);
}

// packages/alpinejs/src/evaluator.js
var shouldAutoEvaluateFunctions = true;
function dontAutoEvaluateFunctions(callback) {
  let cache = shouldAutoEvaluateFunctions;
  shouldAutoEvaluateFunctions = false;
  let result = callback();
  shouldAutoEvaluateFunctions = cache;
  return result;
}
function evaluate(el, expression, extras = {}) {
  let result;
  evaluateLater(el, expression)((value) => result = value, extras);
  return result;
}
function evaluateLater(...args) {
  return theEvaluatorFunction(...args);
}
var theEvaluatorFunction = normalEvaluator;
function setEvaluator(newEvaluator) {
  theEvaluatorFunction = newEvaluator;
}
var theRawEvaluatorFunction;
function setRawEvaluator(newEvaluator) {
  theRawEvaluatorFunction = newEvaluator;
}
function normalEvaluator(el, expression) {
  let overriddenMagics = {};
  injectMagics(overriddenMagics, el);
  let dataStack = [overriddenMagics, ...closestDataStack(el)];
  let evaluator = typeof expression === "function" ? generateEvaluatorFromFunction(dataStack, expression) : generateEvaluatorFromString(dataStack, expression, el);
  return tryCatch.bind(null, el, expression, evaluator);
}
function generateEvaluatorFromFunction(dataStack, func) {
  return (receiver = () => {
  }, { scope: scope2 = {}, params = [], context } = {}) => {
    if (!shouldAutoEvaluateFunctions) {
      runIfTypeOfFunction(receiver, func, mergeProxies([scope2, ...dataStack]), params);
      return;
    }
    let result = func.apply(mergeProxies([scope2, ...dataStack]), params);
    runIfTypeOfFunction(receiver, result);
  };
}
var evaluatorMemo = {};
function generateFunctionFromString(expression, el) {
  if (evaluatorMemo[expression]) {
    return evaluatorMemo[expression];
  }
  let AsyncFunction = Object.getPrototypeOf(async function() {
  }).constructor;
  let rightSideSafeExpression = /^[\n\s]*if.*\(.*\)/.test(expression.trim()) || /^(let|const)\s/.test(expression.trim()) ? `(async()=>{ ${expression} })()` : expression;
  const safeAsyncFunction = () => {
    try {
      let func2 = new AsyncFunction(
        ["__self", "scope"],
        `with (scope) { __self.result = ${rightSideSafeExpression} }; __self.finished = true; return __self.result;`
      );
      Object.defineProperty(func2, "name", {
        value: `[Alpine] ${expression}`
      });
      return func2;
    } catch (error2) {
      handleError(error2, el, expression);
      return Promise.resolve();
    }
  };
  let func = safeAsyncFunction();
  evaluatorMemo[expression] = func;
  return func;
}
function generateEvaluatorFromString(dataStack, expression, el) {
  let func = generateFunctionFromString(expression, el);
  return (receiver = () => {
  }, { scope: scope2 = {}, params = [], context } = {}) => {
    func.result = void 0;
    func.finished = false;
    let completeScope = mergeProxies([scope2, ...dataStack]);
    if (typeof func === "function") {
      let promise = func.call(context, func, completeScope).catch((error2) => handleError(error2, el, expression));
      if (func.finished) {
        runIfTypeOfFunction(receiver, func.result, completeScope, params, el);
        func.result = void 0;
      } else {
        promise.then((result) => {
          runIfTypeOfFunction(receiver, result, completeScope, params, el);
        }).catch((error2) => handleError(error2, el, expression)).finally(() => func.result = void 0);
      }
    }
  };
}
function runIfTypeOfFunction(receiver, value, scope2, params, el) {
  if (shouldAutoEvaluateFunctions && typeof value === "function") {
    let result = value.apply(scope2, params);
    if (result instanceof Promise) {
      result.then((i) => runIfTypeOfFunction(receiver, i, scope2, params)).catch((error2) => handleError(error2, el, value));
    } else {
      receiver(result);
    }
  } else if (typeof value === "object" && value instanceof Promise) {
    value.then((i) => receiver(i));
  } else {
    receiver(value);
  }
}
function evaluateRaw(...args) {
  return theRawEvaluatorFunction(...args);
}
function normalRawEvaluator(el, expression, extras = {}) {
  let overriddenMagics = {};
  injectMagics(overriddenMagics, el);
  let dataStack = [overriddenMagics, ...closestDataStack(el)];
  let scope2 = mergeProxies([extras.scope ?? {}, ...dataStack]);
  let params = extras.params ?? [];
  if (expression.includes("await")) {
    let AsyncFunction = Object.getPrototypeOf(async function() {
    }).constructor;
    let rightSideSafeExpression = /^[\n\s]*if.*\(.*\)/.test(expression.trim()) || /^(let|const)\s/.test(expression.trim()) ? `(async()=>{ ${expression} })()` : expression;
    let func = new AsyncFunction(
      ["scope"],
      `with (scope) { let __result = ${rightSideSafeExpression}; return __result }`
    );
    let result = func.call(extras.context, scope2);
    return result;
  } else {
    let rightSideSafeExpression = /^[\n\s]*if.*\(.*\)/.test(expression.trim()) || /^(let|const)\s/.test(expression.trim()) ? `(()=>{ ${expression} })()` : expression;
    let func = new Function(
      ["scope"],
      `with (scope) { let __result = ${rightSideSafeExpression}; return __result }`
    );
    let result = func.call(extras.context, scope2);
    if (typeof result === "function" && shouldAutoEvaluateFunctions) {
      return result.apply(scope2, params);
    }
    return result;
  }
}

// packages/alpinejs/src/directives.js
var prefixAsString = "x-";
function prefix(subject = "") {
  return prefixAsString + subject;
}
function setPrefix(newPrefix) {
  prefixAsString = newPrefix;
}
var directiveHandlers = {};
function directive(name, callback) {
  directiveHandlers[name] = callback;
  return {
    before(directive2) {
      if (!directiveHandlers[directive2]) {
        console.warn(String.raw`Cannot find directive \`${directive2}\`. \`${name}\` will use the default order of execution`);
        return;
      }
      const pos = directiveOrder.indexOf(directive2);
      directiveOrder.splice(pos >= 0 ? pos : directiveOrder.indexOf("DEFAULT"), 0, name);
    }
  };
}
function directiveExists(name) {
  return Object.keys(directiveHandlers).includes(name);
}
function directives(el, attributes, originalAttributeOverride) {
  attributes = Array.from(attributes);
  if (el._x_virtualDirectives) {
    let vAttributes = Object.entries(el._x_virtualDirectives).map(([name, value]) => ({ name, value }));
    let staticAttributes = attributesOnly(vAttributes);
    vAttributes = vAttributes.map((attribute) => {
      if (staticAttributes.find((attr) => attr.name === attribute.name)) {
        return {
          name: `x-bind:${attribute.name}`,
          value: `"${attribute.value}"`
        };
      }
      return attribute;
    });
    attributes = attributes.concat(vAttributes);
  }
  let transformedAttributeMap = {};
  let directives2 = attributes.map(toTransformedAttributes((newName, oldName) => transformedAttributeMap[newName] = oldName)).filter(outNonAlpineAttributes).map(toParsedDirectives(transformedAttributeMap, originalAttributeOverride)).sort(byPriority);
  return directives2.map((directive2) => {
    return getDirectiveHandler(el, directive2);
  });
}
function attributesOnly(attributes) {
  return Array.from(attributes).map(toTransformedAttributes()).filter((attr) => !outNonAlpineAttributes(attr));
}
var isDeferringHandlers = false;
var directiveHandlerStacks = /* @__PURE__ */ new Map();
var currentHandlerStackKey = Symbol();
function deferHandlingDirectives(callback) {
  isDeferringHandlers = true;
  let key = Symbol();
  currentHandlerStackKey = key;
  directiveHandlerStacks.set(key, []);
  let flushHandlers = () => {
    while (directiveHandlerStacks.get(key).length)
      directiveHandlerStacks.get(key).shift()();
    directiveHandlerStacks.delete(key);
  };
  let stopDeferring = () => {
    isDeferringHandlers = false;
    flushHandlers();
  };
  callback(flushHandlers);
  stopDeferring();
}
function getElementBoundUtilities(el) {
  let cleanups = [];
  let cleanup2 = (callback) => cleanups.push(callback);
  let [effect3, cleanupEffect] = elementBoundEffect(el);
  cleanups.push(cleanupEffect);
  let utilities = {
    Alpine: alpine_default,
    effect: effect3,
    cleanup: cleanup2,
    evaluateLater: evaluateLater.bind(evaluateLater, el),
    evaluate: evaluate.bind(evaluate, el)
  };
  let doCleanup = () => cleanups.forEach((i) => i());
  return [utilities, doCleanup];
}
function getDirectiveHandler(el, directive2) {
  let noop = () => {
  };
  let handler4 = directiveHandlers[directive2.type] || noop;
  let [utilities, cleanup2] = getElementBoundUtilities(el);
  onAttributeRemoved(el, directive2.original, cleanup2);
  let fullHandler = () => {
    if (el._x_ignore || el._x_ignoreSelf)
      return;
    handler4.inline && handler4.inline(el, directive2, utilities);
    handler4 = handler4.bind(handler4, el, directive2, utilities);
    isDeferringHandlers ? directiveHandlerStacks.get(currentHandlerStackKey).push(handler4) : handler4();
  };
  fullHandler.runCleanups = cleanup2;
  return fullHandler;
}
var startingWith = (subject, replacement) => ({ name, value }) => {
  if (name.startsWith(subject))
    name = name.replace(subject, replacement);
  return { name, value };
};
var into = (i) => i;
function toTransformedAttributes(callback = () => {
}) {
  return ({ name, value }) => {
    let { name: newName, value: newValue } = attributeTransformers.reduce((carry, transform) => {
      return transform(carry);
    }, { name, value });
    if (newName !== name)
      callback(newName, name);
    return { name: newName, value: newValue };
  };
}
var attributeTransformers = [];
function mapAttributes(callback) {
  attributeTransformers.push(callback);
}
function outNonAlpineAttributes({ name }) {
  return alpineAttributeRegex().test(name);
}
var alpineAttributeRegex = () => new RegExp(`^${prefixAsString}([^:^.]+)\\b`);
function toParsedDirectives(transformedAttributeMap, originalAttributeOverride) {
  return ({ name, value }) => {
    let typeMatch = name.match(alpineAttributeRegex());
    let valueMatch = name.match(/:([a-zA-Z0-9\-_:]+)/);
    let modifiers = name.match(/\.[^.\]]+(?=[^\]]*$)/g) || [];
    let original = originalAttributeOverride || transformedAttributeMap[name] || name;
    return {
      type: typeMatch ? typeMatch[1] : null,
      value: valueMatch ? valueMatch[1] : null,
      modifiers: modifiers.map((i) => i.replace(".", "")),
      expression: value,
      original
    };
  };
}
var DEFAULT = "DEFAULT";
var directiveOrder = [
  "ignore",
  "ref",
  "data",
  "id",
  "anchor",
  "bind",
  "init",
  "for",
  "model",
  "modelable",
  "transition",
  "show",
  "if",
  DEFAULT,
  "teleport"
];
function byPriority(a, b) {
  let typeA = directiveOrder.indexOf(a.type) === -1 ? DEFAULT : a.type;
  let typeB = directiveOrder.indexOf(b.type) === -1 ? DEFAULT : b.type;
  return directiveOrder.indexOf(typeA) - directiveOrder.indexOf(typeB);
}

// packages/alpinejs/src/utils/dispatch.js
function dispatch(el, name, detail = {}) {
  el.dispatchEvent(
    new CustomEvent(name, {
      detail,
      bubbles: true,
      // Allows events to pass the shadow DOM barrier.
      composed: true,
      cancelable: true
    })
  );
}

// packages/alpinejs/src/utils/walk.js
function walk(el, callback) {
  if (typeof ShadowRoot === "function" && el instanceof ShadowRoot) {
    Array.from(el.children).forEach((el2) => walk(el2, callback));
    return;
  }
  let skip = false;
  callback(el, () => skip = true);
  if (skip)
    return;
  let node = el.firstElementChild;
  while (node) {
    walk(node, callback, false);
    node = node.nextElementSibling;
  }
}

// packages/alpinejs/src/utils/warn.js
function warn(message, ...args) {
  console.warn(`Alpine Warning: ${message}`, ...args);
}

// packages/alpinejs/src/lifecycle.js
var started = false;
function start() {
  if (started)
    warn("Alpine has already been initialized on this page. Calling Alpine.start() more than once can cause problems.");
  started = true;
  if (!document.body)
    warn("Unable to initialize. Trying to load Alpine before `<body>` is available. Did you forget to add `defer` in Alpine's `<script>` tag?");
  dispatch(document, "alpine:init");
  dispatch(document, "alpine:initializing");
  startObservingMutations();
  onElAdded((el) => initTree(el, walk));
  onElRemoved((el) => destroyTree(el));
  onAttributesAdded((el, attrs) => {
    directives(el, attrs).forEach((handle) => handle());
  });
  let outNestedComponents = (el) => !closestRoot(el.parentElement, true);
  Array.from(document.querySelectorAll(allSelectors().join(","))).filter(outNestedComponents).forEach((el) => {
    initTree(el);
  });
  dispatch(document, "alpine:initialized");
  setTimeout(() => {
    warnAboutMissingPlugins();
  });
}
var rootSelectorCallbacks = [];
var initSelectorCallbacks = [];
function rootSelectors() {
  return rootSelectorCallbacks.map((fn) => fn());
}
function allSelectors() {
  return rootSelectorCallbacks.concat(initSelectorCallbacks).map((fn) => fn());
}
function addRootSelector(selectorCallback) {
  rootSelectorCallbacks.push(selectorCallback);
}
function addInitSelector(selectorCallback) {
  initSelectorCallbacks.push(selectorCallback);
}
function closestRoot(el, includeInitSelectors = false) {
  return findClosest(el, (element) => {
    const selectors = includeInitSelectors ? allSelectors() : rootSelectors();
    if (selectors.some((selector) => element.matches(selector)))
      return true;
  });
}
function findClosest(el, callback) {
  if (!el)
    return;
  if (callback(el))
    return el;
  if (el._x_teleportBack)
    el = el._x_teleportBack;
  if (el.parentNode instanceof ShadowRoot) {
    return findClosest(el.parentNode.host, callback);
  }
  if (!el.parentElement)
    return;
  return findClosest(el.parentElement, callback);
}
function isRoot(el) {
  return rootSelectors().some((selector) => el.matches(selector));
}
var initInterceptors2 = [];
function interceptInit(callback) {
  initInterceptors2.push(callback);
}
var markerDispenser = 1;
function initTree(el, walker = walk, intercept = () => {
}) {
  if (findClosest(el, (i) => i._x_ignore))
    return;
  deferHandlingDirectives(() => {
    walker(el, (el2, skip) => {
      if (el2._x_marker)
        return;
      intercept(el2, skip);
      initInterceptors2.forEach((i) => i(el2, skip));
      directives(el2, el2.attributes).forEach((handle) => handle());
      if (!el2._x_ignore)
        el2._x_marker = markerDispenser++;
      el2._x_ignore && skip();
    });
  });
}
function destroyTree(root, walker = walk) {
  walker(root, (el) => {
    cleanupElement(el);
    cleanupAttributes(el);
    delete el._x_marker;
  });
}
function warnAboutMissingPlugins() {
  let pluginDirectives = [
    ["ui", "dialog", ["[x-dialog], [x-popover]"]],
    ["anchor", "anchor", ["[x-anchor]"]],
    ["sort", "sort", ["[x-sort]"]]
  ];
  pluginDirectives.forEach(([plugin2, directive2, selectors]) => {
    if (directiveExists(directive2))
      return;
    selectors.some((selector) => {
      if (document.querySelector(selector)) {
        warn(`found "${selector}", but missing ${plugin2} plugin`);
        return true;
      }
    });
  });
}

// packages/alpinejs/src/nextTick.js
var tickStack = [];
var isHolding = false;
function nextTick(callback = () => {
}) {
  queueMicrotask(() => {
    isHolding || setTimeout(() => {
      releaseNextTicks();
    });
  });
  return new Promise((res) => {
    tickStack.push(() => {
      callback();
      res();
    });
  });
}
function releaseNextTicks() {
  isHolding = false;
  while (tickStack.length)
    tickStack.shift()();
}
function holdNextTicks() {
  isHolding = true;
}

// packages/alpinejs/src/utils/classes.js
function setClasses(el, value) {
  if (Array.isArray(value)) {
    return setClassesFromString(el, value.join(" "));
  } else if (typeof value === "object" && value !== null) {
    return setClassesFromObject(el, value);
  } else if (typeof value === "function") {
    return setClasses(el, value());
  }
  return setClassesFromString(el, value);
}
function setClassesFromString(el, classString) {
  let split = (classString2) => classString2.split(" ").filter(Boolean);
  let missingClasses = (classString2) => classString2.split(" ").filter((i) => !el.classList.contains(i)).filter(Boolean);
  let addClassesAndReturnUndo = (classes) => {
    el.classList.add(...classes);
    return () => {
      el.classList.remove(...classes);
    };
  };
  classString = classString === true ? classString = "" : classString || "";
  return addClassesAndReturnUndo(missingClasses(classString));
}
function setClassesFromObject(el, classObject) {
  let split = (classString) => classString.split(" ").filter(Boolean);
  let forAdd = Object.entries(classObject).flatMap(([classString, bool]) => bool ? split(classString) : false).filter(Boolean);
  let forRemove = Object.entries(classObject).flatMap(([classString, bool]) => !bool ? split(classString) : false).filter(Boolean);
  let added = [];
  let removed = [];
  forRemove.forEach((i) => {
    if (el.classList.contains(i)) {
      el.classList.remove(i);
      removed.push(i);
    }
  });
  forAdd.forEach((i) => {
    if (!el.classList.contains(i)) {
      el.classList.add(i);
      added.push(i);
    }
  });
  return () => {
    removed.forEach((i) => el.classList.add(i));
    added.forEach((i) => el.classList.remove(i));
  };
}

// packages/alpinejs/src/utils/styles.js
function setStyles(el, value) {
  if (typeof value === "object" && value !== null) {
    return setStylesFromObject(el, value);
  }
  return setStylesFromString(el, value);
}
function setStylesFromObject(el, value) {
  let previousStyles = {};
  Object.entries(value).forEach(([key, value2]) => {
    previousStyles[key] = el.style[key];
    if (!key.startsWith("--")) {
      key = kebabCase(key);
    }
    el.style.setProperty(key, value2);
  });
  setTimeout(() => {
    if (el.style.length === 0) {
      el.removeAttribute("style");
    }
  });
  return () => {
    setStyles(el, previousStyles);
  };
}
function setStylesFromString(el, value) {
  let cache = el.getAttribute("style", value);
  el.setAttribute("style", value);
  return () => {
    el.setAttribute("style", cache || "");
  };
}
function kebabCase(subject) {
  return subject.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}

// packages/alpinejs/src/utils/once.js
function once(callback, fallback = () => {
}) {
  let called = false;
  return function() {
    if (!called) {
      called = true;
      callback.apply(this, arguments);
    } else {
      fallback.apply(this, arguments);
    }
  };
}

// packages/alpinejs/src/directives/x-transition.js
directive("transition", (el, { value, modifiers, expression }, { evaluate: evaluate2 }) => {
  if (typeof expression === "function")
    expression = evaluate2(expression);
  if (expression === false)
    return;
  if (!expression || typeof expression === "boolean") {
    registerTransitionsFromHelper(el, modifiers, value);
  } else {
    registerTransitionsFromClassString(el, expression, value);
  }
});
function registerTransitionsFromClassString(el, classString, stage) {
  registerTransitionObject(el, setClasses, "");
  let directiveStorageMap = {
    "enter": (classes) => {
      el._x_transition.enter.during = classes;
    },
    "enter-start": (classes) => {
      el._x_transition.enter.start = classes;
    },
    "enter-end": (classes) => {
      el._x_transition.enter.end = classes;
    },
    "leave": (classes) => {
      el._x_transition.leave.during = classes;
    },
    "leave-start": (classes) => {
      el._x_transition.leave.start = classes;
    },
    "leave-end": (classes) => {
      el._x_transition.leave.end = classes;
    }
  };
  directiveStorageMap[stage](classString);
}
function registerTransitionsFromHelper(el, modifiers, stage) {
  registerTransitionObject(el, setStyles);
  let doesntSpecify = !modifiers.includes("in") && !modifiers.includes("out") && !stage;
  let transitioningIn = doesntSpecify || modifiers.includes("in") || ["enter"].includes(stage);
  let transitioningOut = doesntSpecify || modifiers.includes("out") || ["leave"].includes(stage);
  if (modifiers.includes("in") && !doesntSpecify) {
    modifiers = modifiers.filter((i, index) => index < modifiers.indexOf("out"));
  }
  if (modifiers.includes("out") && !doesntSpecify) {
    modifiers = modifiers.filter((i, index) => index > modifiers.indexOf("out"));
  }
  let wantsAll = !modifiers.includes("opacity") && !modifiers.includes("scale");
  let wantsOpacity = wantsAll || modifiers.includes("opacity");
  let wantsScale = wantsAll || modifiers.includes("scale");
  let opacityValue = wantsOpacity ? 0 : 1;
  let scaleValue = wantsScale ? modifierValue(modifiers, "scale", 95) / 100 : 1;
  let delay = modifierValue(modifiers, "delay", 0) / 1e3;
  let origin = modifierValue(modifiers, "origin", "center");
  let property = "opacity, transform";
  let durationIn = modifierValue(modifiers, "duration", 150) / 1e3;
  let durationOut = modifierValue(modifiers, "duration", 75) / 1e3;
  let easing = `cubic-bezier(0.4, 0.0, 0.2, 1)`;
  if (transitioningIn) {
    el._x_transition.enter.during = {
      transformOrigin: origin,
      transitionDelay: `${delay}s`,
      transitionProperty: property,
      transitionDuration: `${durationIn}s`,
      transitionTimingFunction: easing
    };
    el._x_transition.enter.start = {
      opacity: opacityValue,
      transform: `scale(${scaleValue})`
    };
    el._x_transition.enter.end = {
      opacity: 1,
      transform: `scale(1)`
    };
  }
  if (transitioningOut) {
    el._x_transition.leave.during = {
      transformOrigin: origin,
      transitionDelay: `${delay}s`,
      transitionProperty: property,
      transitionDuration: `${durationOut}s`,
      transitionTimingFunction: easing
    };
    el._x_transition.leave.start = {
      opacity: 1,
      transform: `scale(1)`
    };
    el._x_transition.leave.end = {
      opacity: opacityValue,
      transform: `scale(${scaleValue})`
    };
  }
}
function registerTransitionObject(el, setFunction, defaultValue = {}) {
  if (!el._x_transition)
    el._x_transition = {
      enter: { during: defaultValue, start: defaultValue, end: defaultValue },
      leave: { during: defaultValue, start: defaultValue, end: defaultValue },
      in(before = () => {
      }, after = () => {
      }) {
        transition(el, setFunction, {
          during: this.enter.during,
          start: this.enter.start,
          end: this.enter.end
        }, before, after);
      },
      out(before = () => {
      }, after = () => {
      }) {
        transition(el, setFunction, {
          during: this.leave.during,
          start: this.leave.start,
          end: this.leave.end
        }, before, after);
      }
    };
}
window.Element.prototype._x_toggleAndCascadeWithTransitions = function(el, value, show, hide) {
  const nextTick2 = document.visibilityState === "visible" ? requestAnimationFrame : setTimeout;
  let clickAwayCompatibleShow = () => nextTick2(show);
  if (value) {
    if (el._x_transition && (el._x_transition.enter || el._x_transition.leave)) {
      el._x_transition.enter && (Object.entries(el._x_transition.enter.during).length || Object.entries(el._x_transition.enter.start).length || Object.entries(el._x_transition.enter.end).length) ? el._x_transition.in(show) : clickAwayCompatibleShow();
    } else {
      el._x_transition ? el._x_transition.in(show) : clickAwayCompatibleShow();
    }
    return;
  }
  el._x_hidePromise = el._x_transition ? new Promise((resolve, reject) => {
    el._x_transition.out(() => {
    }, () => resolve(hide));
    el._x_transitioning && el._x_transitioning.beforeCancel(() => reject({ isFromCancelledTransition: true }));
  }) : Promise.resolve(hide);
  queueMicrotask(() => {
    let closest = closestHide(el);
    if (closest) {
      if (!closest._x_hideChildren)
        closest._x_hideChildren = [];
      closest._x_hideChildren.push(el);
    } else {
      nextTick2(() => {
        let hideAfterChildren = (el2) => {
          let carry = Promise.all([
            el2._x_hidePromise,
            ...(el2._x_hideChildren || []).map(hideAfterChildren)
          ]).then(([i]) => i?.());
          delete el2._x_hidePromise;
          delete el2._x_hideChildren;
          return carry;
        };
        hideAfterChildren(el).catch((e) => {
          if (!e.isFromCancelledTransition)
            throw e;
        });
      });
    }
  });
};
function closestHide(el) {
  let parent = el.parentNode;
  if (!parent)
    return;
  return parent._x_hidePromise ? parent : closestHide(parent);
}
function transition(el, setFunction, { during, start: start2, end } = {}, before = () => {
}, after = () => {
}) {
  if (el._x_transitioning)
    el._x_transitioning.cancel();
  if (Object.keys(during).length === 0 && Object.keys(start2).length === 0 && Object.keys(end).length === 0) {
    before();
    after();
    return;
  }
  let undoStart, undoDuring, undoEnd;
  performTransition(el, {
    start() {
      undoStart = setFunction(el, start2);
    },
    during() {
      undoDuring = setFunction(el, during);
    },
    before,
    end() {
      undoStart();
      undoEnd = setFunction(el, end);
    },
    after,
    cleanup() {
      undoDuring();
      undoEnd();
    }
  });
}
function performTransition(el, stages) {
  let interrupted, reachedBefore, reachedEnd;
  let finish = once(() => {
    mutateDom(() => {
      interrupted = true;
      if (!reachedBefore)
        stages.before();
      if (!reachedEnd) {
        stages.end();
        releaseNextTicks();
      }
      stages.after();
      if (el.isConnected)
        stages.cleanup();
      delete el._x_transitioning;
    });
  });
  el._x_transitioning = {
    beforeCancels: [],
    beforeCancel(callback) {
      this.beforeCancels.push(callback);
    },
    cancel: once(function() {
      while (this.beforeCancels.length) {
        this.beforeCancels.shift()();
      }
      ;
      finish();
    }),
    finish
  };
  mutateDom(() => {
    stages.start();
    stages.during();
  });
  holdNextTicks();
  requestAnimationFrame(() => {
    if (interrupted)
      return;
    let duration = Number(getComputedStyle(el).transitionDuration.replace(/,.*/, "").replace("s", "")) * 1e3;
    let delay = Number(getComputedStyle(el).transitionDelay.replace(/,.*/, "").replace("s", "")) * 1e3;
    if (duration === 0)
      duration = Number(getComputedStyle(el).animationDuration.replace("s", "")) * 1e3;
    mutateDom(() => {
      stages.before();
    });
    reachedBefore = true;
    requestAnimationFrame(() => {
      if (interrupted)
        return;
      mutateDom(() => {
        stages.end();
      });
      releaseNextTicks();
      setTimeout(el._x_transitioning.finish, duration + delay);
      reachedEnd = true;
    });
  });
}
function modifierValue(modifiers, key, fallback) {
  if (modifiers.indexOf(key) === -1)
    return fallback;
  const rawValue = modifiers[modifiers.indexOf(key) + 1];
  if (!rawValue)
    return fallback;
  if (key === "scale") {
    if (isNaN(rawValue))
      return fallback;
  }
  if (key === "duration" || key === "delay") {
    let match = rawValue.match(/([0-9]+)ms/);
    if (match)
      return match[1];
  }
  if (key === "origin") {
    if (["top", "right", "left", "center", "bottom"].includes(modifiers[modifiers.indexOf(key) + 2])) {
      return [rawValue, modifiers[modifiers.indexOf(key) + 2]].join(" ");
    }
  }
  return rawValue;
}

// packages/alpinejs/src/clone.js
var isCloning = false;
function skipDuringClone(callback, fallback = () => {
}) {
  return (...args) => isCloning ? fallback(...args) : callback(...args);
}
function onlyDuringClone(callback) {
  return (...args) => isCloning && callback(...args);
}
var interceptors = [];
function interceptClone(callback) {
  interceptors.push(callback);
}
function cloneNode(from, to) {
  interceptors.forEach((i) => i(from, to));
  isCloning = true;
  dontRegisterReactiveSideEffects(() => {
    initTree(to, (el, callback) => {
      callback(el, () => {
      });
    });
  });
  isCloning = false;
}
var isCloningLegacy = false;
function clone(oldEl, newEl) {
  if (!newEl._x_dataStack)
    newEl._x_dataStack = oldEl._x_dataStack;
  isCloning = true;
  isCloningLegacy = true;
  dontRegisterReactiveSideEffects(() => {
    cloneTree(newEl);
  });
  isCloning = false;
  isCloningLegacy = false;
}
function cloneTree(el) {
  let hasRunThroughFirstEl = false;
  let shallowWalker = (el2, callback) => {
    walk(el2, (el3, skip) => {
      if (hasRunThroughFirstEl && isRoot(el3))
        return skip();
      hasRunThroughFirstEl = true;
      callback(el3, skip);
    });
  };
  initTree(el, shallowWalker);
}
function dontRegisterReactiveSideEffects(callback) {
  let cache = effect;
  overrideEffect((callback2, el) => {
    let storedEffect = cache(callback2);
    release(storedEffect);
    return () => {
    };
  });
  callback();
  overrideEffect(cache);
}

// packages/alpinejs/src/utils/bind.js
function bind(el, name, value, modifiers = []) {
  if (!el._x_bindings)
    el._x_bindings = reactive({});
  el._x_bindings[name] = value;
  name = modifiers.includes("camel") ? camelCase(name) : name;
  switch (name) {
    case "value":
      bindInputValue(el, value);
      break;
    case "style":
      bindStyles(el, value);
      break;
    case "class":
      bindClasses(el, value);
      break;
    case "selected":
    case "checked":
      bindAttributeAndProperty(el, name, value);
      break;
    default:
      bindAttribute(el, name, value);
      break;
  }
}
function bindInputValue(el, value) {
  if (isRadio(el)) {
    if (el.attributes.value === void 0) {
      el.value = value;
    }
    if (window.fromModel) {
      if (typeof value === "boolean") {
        el.checked = safeParseBoolean(el.value) === value;
      } else {
        el.checked = checkedAttrLooseCompare(el.value, value);
      }
    }
  } else if (isCheckbox(el)) {
    if (Number.isInteger(value)) {
      el.value = value;
    } else if (!Array.isArray(value) && typeof value !== "boolean" && ![null, void 0].includes(value)) {
      el.value = String(value);
    } else {
      if (Array.isArray(value)) {
        el.checked = value.some((val) => checkedAttrLooseCompare(val, el.value));
      } else {
        el.checked = !!value;
      }
    }
  } else if (el.tagName === "SELECT") {
    updateSelect(el, value);
  } else {
    if (el.value === value)
      return;
    el.value = value === void 0 ? "" : value;
  }
}
function bindClasses(el, value) {
  if (el._x_undoAddedClasses)
    el._x_undoAddedClasses();
  el._x_undoAddedClasses = setClasses(el, value);
}
function bindStyles(el, value) {
  if (el._x_undoAddedStyles)
    el._x_undoAddedStyles();
  el._x_undoAddedStyles = setStyles(el, value);
}
function bindAttributeAndProperty(el, name, value) {
  bindAttribute(el, name, value);
  setPropertyIfChanged(el, name, value);
}
function bindAttribute(el, name, value) {
  if ([null, void 0, false].includes(value) && attributeShouldntBePreservedIfFalsy(name)) {
    el.removeAttribute(name);
  } else {
    if (isBooleanAttr(name))
      value = name;
    setIfChanged(el, name, value);
  }
}
function setIfChanged(el, attrName, value) {
  if (el.getAttribute(attrName) != value) {
    el.setAttribute(attrName, value);
  }
}
function setPropertyIfChanged(el, propName, value) {
  if (el[propName] !== value) {
    el[propName] = value;
  }
}
function updateSelect(el, value) {
  const arrayWrappedValue = [].concat(value).map((value2) => {
    return value2 + "";
  });
  Array.from(el.options).forEach((option) => {
    option.selected = arrayWrappedValue.includes(option.value);
  });
}
function camelCase(subject) {
  return subject.toLowerCase().replace(/-(\w)/g, (match, char) => char.toUpperCase());
}
function checkedAttrLooseCompare(valueA, valueB) {
  return valueA == valueB;
}
function safeParseBoolean(rawValue) {
  if ([1, "1", "true", "on", "yes", true].includes(rawValue)) {
    return true;
  }
  if ([0, "0", "false", "off", "no", false].includes(rawValue)) {
    return false;
  }
  return rawValue ? Boolean(rawValue) : null;
}
var booleanAttributes = /* @__PURE__ */ new Set([
  "allowfullscreen",
  "async",
  "autofocus",
  "autoplay",
  "checked",
  "controls",
  "default",
  "defer",
  "disabled",
  "formnovalidate",
  "inert",
  "ismap",
  "itemscope",
  "loop",
  "multiple",
  "muted",
  "nomodule",
  "novalidate",
  "open",
  "playsinline",
  "readonly",
  "required",
  "reversed",
  "selected",
  "shadowrootclonable",
  "shadowrootdelegatesfocus",
  "shadowrootserializable"
]);
function isBooleanAttr(attrName) {
  return booleanAttributes.has(attrName);
}
function attributeShouldntBePreservedIfFalsy(name) {
  return !["aria-pressed", "aria-checked", "aria-expanded", "aria-selected"].includes(name);
}
function getBinding(el, name, fallback) {
  if (el._x_bindings && el._x_bindings[name] !== void 0)
    return el._x_bindings[name];
  return getAttributeBinding(el, name, fallback);
}
function extractProp(el, name, fallback, extract = true) {
  if (el._x_bindings && el._x_bindings[name] !== void 0)
    return el._x_bindings[name];
  if (el._x_inlineBindings && el._x_inlineBindings[name] !== void 0) {
    let binding = el._x_inlineBindings[name];
    binding.extract = extract;
    return dontAutoEvaluateFunctions(() => {
      return evaluate(el, binding.expression);
    });
  }
  return getAttributeBinding(el, name, fallback);
}
function getAttributeBinding(el, name, fallback) {
  let attr = el.getAttribute(name);
  if (attr === null)
    return typeof fallback === "function" ? fallback() : fallback;
  if (attr === "")
    return true;
  if (isBooleanAttr(name)) {
    return !![name, "true"].includes(attr);
  }
  return attr;
}
function isCheckbox(el) {
  return el.type === "checkbox" || el.localName === "ui-checkbox" || el.localName === "ui-switch";
}
function isRadio(el) {
  return el.type === "radio" || el.localName === "ui-radio";
}

// packages/alpinejs/src/utils/debounce.js
function debounce(func, wait) {
  let timeout;
  return function() {
    const context = this, args = arguments;
    const later = function() {
      timeout = null;
      func.apply(context, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// packages/alpinejs/src/utils/throttle.js
function throttle(func, limit) {
  let inThrottle;
  return function() {
    let context = this, args = arguments;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// packages/alpinejs/src/entangle.js
function entangle({ get: outerGet, set: outerSet }, { get: innerGet, set: innerSet }) {
  let firstRun = true;
  let outerHash;
  let innerHash;
  let reference = effect(() => {
    let outer = outerGet();
    let inner = innerGet();
    if (firstRun) {
      innerSet(cloneIfObject(outer));
      firstRun = false;
    } else {
      let outerHashLatest = JSON.stringify(outer);
      let innerHashLatest = JSON.stringify(inner);
      if (outerHashLatest !== outerHash) {
        innerSet(cloneIfObject(outer));
      } else if (outerHashLatest !== innerHashLatest) {
        outerSet(cloneIfObject(inner));
      } else {
      }
    }
    outerHash = JSON.stringify(outerGet());
    innerHash = JSON.stringify(innerGet());
  });
  return () => {
    release(reference);
  };
}
function cloneIfObject(value) {
  return typeof value === "object" ? JSON.parse(JSON.stringify(value)) : value;
}

// packages/alpinejs/src/plugin.js
function plugin(callback) {
  let callbacks = Array.isArray(callback) ? callback : [callback];
  callbacks.forEach((i) => i(alpine_default));
}

// packages/alpinejs/src/store.js
var stores = {};
var isReactive = false;
function store(name, value) {
  if (!isReactive) {
    stores = reactive(stores);
    isReactive = true;
  }
  if (value === void 0) {
    return stores[name];
  }
  stores[name] = value;
  initInterceptors(stores[name]);
  if (typeof value === "object" && value !== null && value.hasOwnProperty("init") && typeof value.init === "function") {
    stores[name].init();
  }
}
function getStores() {
  return stores;
}

// packages/alpinejs/src/binds.js
var binds = {};
function bind2(name, bindings) {
  let getBindings = typeof bindings !== "function" ? () => bindings : bindings;
  if (name instanceof Element) {
    return applyBindingsObject(name, getBindings());
  } else {
    binds[name] = getBindings;
  }
  return () => {
  };
}
function injectBindingProviders(obj) {
  Object.entries(binds).forEach(([name, callback]) => {
    Object.defineProperty(obj, name, {
      get() {
        return (...args) => {
          return callback(...args);
        };
      }
    });
  });
  return obj;
}
function applyBindingsObject(el, obj, original) {
  let cleanupRunners = [];
  while (cleanupRunners.length)
    cleanupRunners.pop()();
  let attributes = Object.entries(obj).map(([name, value]) => ({ name, value }));
  let staticAttributes = attributesOnly(attributes);
  attributes = attributes.map((attribute) => {
    if (staticAttributes.find((attr) => attr.name === attribute.name)) {
      return {
        name: `x-bind:${attribute.name}`,
        value: `"${attribute.value}"`
      };
    }
    return attribute;
  });
  directives(el, attributes, original).map((handle) => {
    cleanupRunners.push(handle.runCleanups);
    handle();
  });
  return () => {
    while (cleanupRunners.length)
      cleanupRunners.pop()();
  };
}

// packages/alpinejs/src/datas.js
var datas = {};
function data(name, callback) {
  datas[name] = callback;
}
function injectDataProviders(obj, context) {
  Object.entries(datas).forEach(([name, callback]) => {
    Object.defineProperty(obj, name, {
      get() {
        return (...args) => {
          return callback.bind(context)(...args);
        };
      },
      enumerable: false
    });
  });
  return obj;
}

// packages/alpinejs/src/alpine.js
var Alpine = {
  get reactive() {
    return reactive;
  },
  get release() {
    return release;
  },
  get effect() {
    return effect;
  },
  get raw() {
    return raw;
  },
  version: "3.15.3",
  flushAndStopDeferringMutations,
  dontAutoEvaluateFunctions,
  disableEffectScheduling,
  startObservingMutations,
  stopObservingMutations,
  setReactivityEngine,
  onAttributeRemoved,
  onAttributesAdded,
  closestDataStack,
  skipDuringClone,
  onlyDuringClone,
  addRootSelector,
  addInitSelector,
  setErrorHandler,
  interceptClone,
  addScopeToNode,
  deferMutations,
  mapAttributes,
  evaluateLater,
  interceptInit,
  initInterceptors,
  injectMagics,
  setEvaluator,
  setRawEvaluator,
  mergeProxies,
  extractProp,
  findClosest,
  onElRemoved,
  closestRoot,
  destroyTree,
  interceptor,
  // INTERNAL: not public API and is subject to change without major release.
  transition,
  // INTERNAL
  setStyles,
  // INTERNAL
  mutateDom,
  directive,
  entangle,
  throttle,
  debounce,
  evaluate,
  evaluateRaw,
  initTree,
  nextTick,
  prefixed: prefix,
  prefix: setPrefix,
  plugin,
  magic,
  store,
  start,
  clone,
  // INTERNAL
  cloneNode,
  // INTERNAL
  bound: getBinding,
  $data: scope,
  watch,
  walk,
  data,
  bind: bind2
};
var alpine_default = Alpine;

// node_modules/@vue/shared/dist/shared.esm-bundler.js
function makeMap(str, expectsLowerCase) {
  const map = /* @__PURE__ */ Object.create(null);
  const list = str.split(",");
  for (let i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase ? (val) => !!map[val.toLowerCase()] : (val) => !!map[val];
}
var specialBooleanAttrs = `itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly`;
var isBooleanAttr2 = /* @__PURE__ */ makeMap(specialBooleanAttrs + `,async,autofocus,autoplay,controls,default,defer,disabled,hidden,loop,open,required,reversed,scoped,seamless,checked,muted,multiple,selected`);
var EMPTY_OBJ =  true ? Object.freeze({}) : 0;
var EMPTY_ARR =  true ? Object.freeze([]) : 0;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var hasOwn = (val, key) => hasOwnProperty.call(val, key);
var isArray = Array.isArray;
var isMap = (val) => toTypeString(val) === "[object Map]";
var isString = (val) => typeof val === "string";
var isSymbol = (val) => typeof val === "symbol";
var isObject = (val) => val !== null && typeof val === "object";
var objectToString = Object.prototype.toString;
var toTypeString = (value) => objectToString.call(value);
var toRawType = (value) => {
  return toTypeString(value).slice(8, -1);
};
var isIntegerKey = (key) => isString(key) && key !== "NaN" && key[0] !== "-" && "" + parseInt(key, 10) === key;
var cacheStringFunction = (fn) => {
  const cache = /* @__PURE__ */ Object.create(null);
  return (str) => {
    const hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
};
var camelizeRE = /-(\w)/g;
var camelize = cacheStringFunction((str) => {
  return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : "");
});
var hyphenateRE = /\B([A-Z])/g;
var hyphenate = cacheStringFunction((str) => str.replace(hyphenateRE, "-$1").toLowerCase());
var capitalize = cacheStringFunction((str) => str.charAt(0).toUpperCase() + str.slice(1));
var toHandlerKey = cacheStringFunction((str) => str ? `on${capitalize(str)}` : ``);
var hasChanged = (value, oldValue) => value !== oldValue && (value === value || oldValue === oldValue);

// node_modules/@vue/reactivity/dist/reactivity.esm-bundler.js
var targetMap = /* @__PURE__ */ new WeakMap();
var effectStack = [];
var activeEffect;
var ITERATE_KEY = Symbol( true ? "iterate" : 0);
var MAP_KEY_ITERATE_KEY = Symbol( true ? "Map key iterate" : 0);
function isEffect(fn) {
  return fn && fn._isEffect === true;
}
function effect2(fn, options = EMPTY_OBJ) {
  if (isEffect(fn)) {
    fn = fn.raw;
  }
  const effect3 = createReactiveEffect(fn, options);
  if (!options.lazy) {
    effect3();
  }
  return effect3;
}
function stop(effect3) {
  if (effect3.active) {
    cleanup(effect3);
    if (effect3.options.onStop) {
      effect3.options.onStop();
    }
    effect3.active = false;
  }
}
var uid = 0;
function createReactiveEffect(fn, options) {
  const effect3 = function reactiveEffect() {
    if (!effect3.active) {
      return fn();
    }
    if (!effectStack.includes(effect3)) {
      cleanup(effect3);
      try {
        enableTracking();
        effectStack.push(effect3);
        activeEffect = effect3;
        return fn();
      } finally {
        effectStack.pop();
        resetTracking();
        activeEffect = effectStack[effectStack.length - 1];
      }
    }
  };
  effect3.id = uid++;
  effect3.allowRecurse = !!options.allowRecurse;
  effect3._isEffect = true;
  effect3.active = true;
  effect3.raw = fn;
  effect3.deps = [];
  effect3.options = options;
  return effect3;
}
function cleanup(effect3) {
  const { deps } = effect3;
  if (deps.length) {
    for (let i = 0; i < deps.length; i++) {
      deps[i].delete(effect3);
    }
    deps.length = 0;
  }
}
var shouldTrack = true;
var trackStack = [];
function pauseTracking() {
  trackStack.push(shouldTrack);
  shouldTrack = false;
}
function enableTracking() {
  trackStack.push(shouldTrack);
  shouldTrack = true;
}
function resetTracking() {
  const last = trackStack.pop();
  shouldTrack = last === void 0 ? true : last;
}
function track(target, type, key) {
  if (!shouldTrack || activeEffect === void 0) {
    return;
  }
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    targetMap.set(target, depsMap = /* @__PURE__ */ new Map());
  }
  let dep = depsMap.get(key);
  if (!dep) {
    depsMap.set(key, dep = /* @__PURE__ */ new Set());
  }
  if (!dep.has(activeEffect)) {
    dep.add(activeEffect);
    activeEffect.deps.push(dep);
    if (activeEffect.options.onTrack) {
      activeEffect.options.onTrack({
        effect: activeEffect,
        target,
        type,
        key
      });
    }
  }
}
function trigger(target, type, key, newValue, oldValue, oldTarget) {
  const depsMap = targetMap.get(target);
  if (!depsMap) {
    return;
  }
  const effects = /* @__PURE__ */ new Set();
  const add2 = (effectsToAdd) => {
    if (effectsToAdd) {
      effectsToAdd.forEach((effect3) => {
        if (effect3 !== activeEffect || effect3.allowRecurse) {
          effects.add(effect3);
        }
      });
    }
  };
  if (type === "clear") {
    depsMap.forEach(add2);
  } else if (key === "length" && isArray(target)) {
    depsMap.forEach((dep, key2) => {
      if (key2 === "length" || key2 >= newValue) {
        add2(dep);
      }
    });
  } else {
    if (key !== void 0) {
      add2(depsMap.get(key));
    }
    switch (type) {
      case "add":
        if (!isArray(target)) {
          add2(depsMap.get(ITERATE_KEY));
          if (isMap(target)) {
            add2(depsMap.get(MAP_KEY_ITERATE_KEY));
          }
        } else if (isIntegerKey(key)) {
          add2(depsMap.get("length"));
        }
        break;
      case "delete":
        if (!isArray(target)) {
          add2(depsMap.get(ITERATE_KEY));
          if (isMap(target)) {
            add2(depsMap.get(MAP_KEY_ITERATE_KEY));
          }
        }
        break;
      case "set":
        if (isMap(target)) {
          add2(depsMap.get(ITERATE_KEY));
        }
        break;
    }
  }
  const run = (effect3) => {
    if (effect3.options.onTrigger) {
      effect3.options.onTrigger({
        effect: effect3,
        target,
        key,
        type,
        newValue,
        oldValue,
        oldTarget
      });
    }
    if (effect3.options.scheduler) {
      effect3.options.scheduler(effect3);
    } else {
      effect3();
    }
  };
  effects.forEach(run);
}
var isNonTrackableKeys = /* @__PURE__ */ makeMap(`__proto__,__v_isRef,__isVue`);
var builtInSymbols = new Set(Object.getOwnPropertyNames(Symbol).map((key) => Symbol[key]).filter(isSymbol));
var get2 = /* @__PURE__ */ createGetter();
var readonlyGet = /* @__PURE__ */ createGetter(true);
var arrayInstrumentations = /* @__PURE__ */ createArrayInstrumentations();
function createArrayInstrumentations() {
  const instrumentations = {};
  ["includes", "indexOf", "lastIndexOf"].forEach((key) => {
    instrumentations[key] = function(...args) {
      const arr = toRaw(this);
      for (let i = 0, l = this.length; i < l; i++) {
        track(arr, "get", i + "");
      }
      const res = arr[key](...args);
      if (res === -1 || res === false) {
        return arr[key](...args.map(toRaw));
      } else {
        return res;
      }
    };
  });
  ["push", "pop", "shift", "unshift", "splice"].forEach((key) => {
    instrumentations[key] = function(...args) {
      pauseTracking();
      const res = toRaw(this)[key].apply(this, args);
      resetTracking();
      return res;
    };
  });
  return instrumentations;
}
function createGetter(isReadonly = false, shallow = false) {
  return function get3(target, key, receiver) {
    if (key === "__v_isReactive") {
      return !isReadonly;
    } else if (key === "__v_isReadonly") {
      return isReadonly;
    } else if (key === "__v_raw" && receiver === (isReadonly ? shallow ? shallowReadonlyMap : readonlyMap : shallow ? shallowReactiveMap : reactiveMap).get(target)) {
      return target;
    }
    const targetIsArray = isArray(target);
    if (!isReadonly && targetIsArray && hasOwn(arrayInstrumentations, key)) {
      return Reflect.get(arrayInstrumentations, key, receiver);
    }
    const res = Reflect.get(target, key, receiver);
    if (isSymbol(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) {
      return res;
    }
    if (!isReadonly) {
      track(target, "get", key);
    }
    if (shallow) {
      return res;
    }
    if (isRef(res)) {
      const shouldUnwrap = !targetIsArray || !isIntegerKey(key);
      return shouldUnwrap ? res.value : res;
    }
    if (isObject(res)) {
      return isReadonly ? readonly(res) : reactive2(res);
    }
    return res;
  };
}
var set2 = /* @__PURE__ */ createSetter();
function createSetter(shallow = false) {
  return function set3(target, key, value, receiver) {
    let oldValue = target[key];
    if (!shallow) {
      value = toRaw(value);
      oldValue = toRaw(oldValue);
      if (!isArray(target) && isRef(oldValue) && !isRef(value)) {
        oldValue.value = value;
        return true;
      }
    }
    const hadKey = isArray(target) && isIntegerKey(key) ? Number(key) < target.length : hasOwn(target, key);
    const result = Reflect.set(target, key, value, receiver);
    if (target === toRaw(receiver)) {
      if (!hadKey) {
        trigger(target, "add", key, value);
      } else if (hasChanged(value, oldValue)) {
        trigger(target, "set", key, value, oldValue);
      }
    }
    return result;
  };
}
function deleteProperty(target, key) {
  const hadKey = hasOwn(target, key);
  const oldValue = target[key];
  const result = Reflect.deleteProperty(target, key);
  if (result && hadKey) {
    trigger(target, "delete", key, void 0, oldValue);
  }
  return result;
}
function has(target, key) {
  const result = Reflect.has(target, key);
  if (!isSymbol(key) || !builtInSymbols.has(key)) {
    track(target, "has", key);
  }
  return result;
}
function ownKeys(target) {
  track(target, "iterate", isArray(target) ? "length" : ITERATE_KEY);
  return Reflect.ownKeys(target);
}
var mutableHandlers = {
  get: get2,
  set: set2,
  deleteProperty,
  has,
  ownKeys
};
var readonlyHandlers = {
  get: readonlyGet,
  set(target, key) {
    if (true) {
      console.warn(`Set operation on key "${String(key)}" failed: target is readonly.`, target);
    }
    return true;
  },
  deleteProperty(target, key) {
    if (true) {
      console.warn(`Delete operation on key "${String(key)}" failed: target is readonly.`, target);
    }
    return true;
  }
};
var toReactive = (value) => isObject(value) ? reactive2(value) : value;
var toReadonly = (value) => isObject(value) ? readonly(value) : value;
var toShallow = (value) => value;
var getProto = (v) => Reflect.getPrototypeOf(v);
function get$1(target, key, isReadonly = false, isShallow = false) {
  target = target[
    "__v_raw"
    /* RAW */
  ];
  const rawTarget = toRaw(target);
  const rawKey = toRaw(key);
  if (key !== rawKey) {
    !isReadonly && track(rawTarget, "get", key);
  }
  !isReadonly && track(rawTarget, "get", rawKey);
  const { has: has2 } = getProto(rawTarget);
  const wrap = isShallow ? toShallow : isReadonly ? toReadonly : toReactive;
  if (has2.call(rawTarget, key)) {
    return wrap(target.get(key));
  } else if (has2.call(rawTarget, rawKey)) {
    return wrap(target.get(rawKey));
  } else if (target !== rawTarget) {
    target.get(key);
  }
}
function has$1(key, isReadonly = false) {
  const target = this[
    "__v_raw"
    /* RAW */
  ];
  const rawTarget = toRaw(target);
  const rawKey = toRaw(key);
  if (key !== rawKey) {
    !isReadonly && track(rawTarget, "has", key);
  }
  !isReadonly && track(rawTarget, "has", rawKey);
  return key === rawKey ? target.has(key) : target.has(key) || target.has(rawKey);
}
function size(target, isReadonly = false) {
  target = target[
    "__v_raw"
    /* RAW */
  ];
  !isReadonly && track(toRaw(target), "iterate", ITERATE_KEY);
  return Reflect.get(target, "size", target);
}
function add(value) {
  value = toRaw(value);
  const target = toRaw(this);
  const proto = getProto(target);
  const hadKey = proto.has.call(target, value);
  if (!hadKey) {
    target.add(value);
    trigger(target, "add", value, value);
  }
  return this;
}
function set$1(key, value) {
  value = toRaw(value);
  const target = toRaw(this);
  const { has: has2, get: get3 } = getProto(target);
  let hadKey = has2.call(target, key);
  if (!hadKey) {
    key = toRaw(key);
    hadKey = has2.call(target, key);
  } else if (true) {
    checkIdentityKeys(target, has2, key);
  }
  const oldValue = get3.call(target, key);
  target.set(key, value);
  if (!hadKey) {
    trigger(target, "add", key, value);
  } else if (hasChanged(value, oldValue)) {
    trigger(target, "set", key, value, oldValue);
  }
  return this;
}
function deleteEntry(key) {
  const target = toRaw(this);
  const { has: has2, get: get3 } = getProto(target);
  let hadKey = has2.call(target, key);
  if (!hadKey) {
    key = toRaw(key);
    hadKey = has2.call(target, key);
  } else if (true) {
    checkIdentityKeys(target, has2, key);
  }
  const oldValue = get3 ? get3.call(target, key) : void 0;
  const result = target.delete(key);
  if (hadKey) {
    trigger(target, "delete", key, void 0, oldValue);
  }
  return result;
}
function clear() {
  const target = toRaw(this);
  const hadItems = target.size !== 0;
  const oldTarget =  true ? isMap(target) ? new Map(target) : new Set(target) : 0;
  const result = target.clear();
  if (hadItems) {
    trigger(target, "clear", void 0, void 0, oldTarget);
  }
  return result;
}
function createForEach(isReadonly, isShallow) {
  return function forEach(callback, thisArg) {
    const observed = this;
    const target = observed[
      "__v_raw"
      /* RAW */
    ];
    const rawTarget = toRaw(target);
    const wrap = isShallow ? toShallow : isReadonly ? toReadonly : toReactive;
    !isReadonly && track(rawTarget, "iterate", ITERATE_KEY);
    return target.forEach((value, key) => {
      return callback.call(thisArg, wrap(value), wrap(key), observed);
    });
  };
}
function createIterableMethod(method, isReadonly, isShallow) {
  return function(...args) {
    const target = this[
      "__v_raw"
      /* RAW */
    ];
    const rawTarget = toRaw(target);
    const targetIsMap = isMap(rawTarget);
    const isPair = method === "entries" || method === Symbol.iterator && targetIsMap;
    const isKeyOnly = method === "keys" && targetIsMap;
    const innerIterator = target[method](...args);
    const wrap = isShallow ? toShallow : isReadonly ? toReadonly : toReactive;
    !isReadonly && track(rawTarget, "iterate", isKeyOnly ? MAP_KEY_ITERATE_KEY : ITERATE_KEY);
    return {
      // iterator protocol
      next() {
        const { value, done } = innerIterator.next();
        return done ? { value, done } : {
          value: isPair ? [wrap(value[0]), wrap(value[1])] : wrap(value),
          done
        };
      },
      // iterable protocol
      [Symbol.iterator]() {
        return this;
      }
    };
  };
}
function createReadonlyMethod(type) {
  return function(...args) {
    if (true) {
      const key = args[0] ? `on key "${args[0]}" ` : ``;
      console.warn(`${capitalize(type)} operation ${key}failed: target is readonly.`, toRaw(this));
    }
    return type === "delete" ? false : this;
  };
}
function createInstrumentations() {
  const mutableInstrumentations2 = {
    get(key) {
      return get$1(this, key);
    },
    get size() {
      return size(this);
    },
    has: has$1,
    add,
    set: set$1,
    delete: deleteEntry,
    clear,
    forEach: createForEach(false, false)
  };
  const shallowInstrumentations2 = {
    get(key) {
      return get$1(this, key, false, true);
    },
    get size() {
      return size(this);
    },
    has: has$1,
    add,
    set: set$1,
    delete: deleteEntry,
    clear,
    forEach: createForEach(false, true)
  };
  const readonlyInstrumentations2 = {
    get(key) {
      return get$1(this, key, true);
    },
    get size() {
      return size(this, true);
    },
    has(key) {
      return has$1.call(this, key, true);
    },
    add: createReadonlyMethod(
      "add"
      /* ADD */
    ),
    set: createReadonlyMethod(
      "set"
      /* SET */
    ),
    delete: createReadonlyMethod(
      "delete"
      /* DELETE */
    ),
    clear: createReadonlyMethod(
      "clear"
      /* CLEAR */
    ),
    forEach: createForEach(true, false)
  };
  const shallowReadonlyInstrumentations2 = {
    get(key) {
      return get$1(this, key, true, true);
    },
    get size() {
      return size(this, true);
    },
    has(key) {
      return has$1.call(this, key, true);
    },
    add: createReadonlyMethod(
      "add"
      /* ADD */
    ),
    set: createReadonlyMethod(
      "set"
      /* SET */
    ),
    delete: createReadonlyMethod(
      "delete"
      /* DELETE */
    ),
    clear: createReadonlyMethod(
      "clear"
      /* CLEAR */
    ),
    forEach: createForEach(true, true)
  };
  const iteratorMethods = ["keys", "values", "entries", Symbol.iterator];
  iteratorMethods.forEach((method) => {
    mutableInstrumentations2[method] = createIterableMethod(method, false, false);
    readonlyInstrumentations2[method] = createIterableMethod(method, true, false);
    shallowInstrumentations2[method] = createIterableMethod(method, false, true);
    shallowReadonlyInstrumentations2[method] = createIterableMethod(method, true, true);
  });
  return [
    mutableInstrumentations2,
    readonlyInstrumentations2,
    shallowInstrumentations2,
    shallowReadonlyInstrumentations2
  ];
}
var [mutableInstrumentations, readonlyInstrumentations, shallowInstrumentations, shallowReadonlyInstrumentations] = /* @__PURE__ */ createInstrumentations();
function createInstrumentationGetter(isReadonly, shallow) {
  const instrumentations = shallow ? isReadonly ? shallowReadonlyInstrumentations : shallowInstrumentations : isReadonly ? readonlyInstrumentations : mutableInstrumentations;
  return (target, key, receiver) => {
    if (key === "__v_isReactive") {
      return !isReadonly;
    } else if (key === "__v_isReadonly") {
      return isReadonly;
    } else if (key === "__v_raw") {
      return target;
    }
    return Reflect.get(hasOwn(instrumentations, key) && key in target ? instrumentations : target, key, receiver);
  };
}
var mutableCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(false, false)
};
var readonlyCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(true, false)
};
function checkIdentityKeys(target, has2, key) {
  const rawKey = toRaw(key);
  if (rawKey !== key && has2.call(target, rawKey)) {
    const type = toRawType(target);
    console.warn(`Reactive ${type} contains both the raw and reactive versions of the same object${type === `Map` ? ` as keys` : ``}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`);
  }
}
var reactiveMap = /* @__PURE__ */ new WeakMap();
var shallowReactiveMap = /* @__PURE__ */ new WeakMap();
var readonlyMap = /* @__PURE__ */ new WeakMap();
var shallowReadonlyMap = /* @__PURE__ */ new WeakMap();
function targetTypeMap(rawType) {
  switch (rawType) {
    case "Object":
    case "Array":
      return 1;
    case "Map":
    case "Set":
    case "WeakMap":
    case "WeakSet":
      return 2;
    default:
      return 0;
  }
}
function getTargetType(value) {
  return value[
    "__v_skip"
    /* SKIP */
  ] || !Object.isExtensible(value) ? 0 : targetTypeMap(toRawType(value));
}
function reactive2(target) {
  if (target && target[
    "__v_isReadonly"
    /* IS_READONLY */
  ]) {
    return target;
  }
  return createReactiveObject(target, false, mutableHandlers, mutableCollectionHandlers, reactiveMap);
}
function readonly(target) {
  return createReactiveObject(target, true, readonlyHandlers, readonlyCollectionHandlers, readonlyMap);
}
function createReactiveObject(target, isReadonly, baseHandlers, collectionHandlers, proxyMap) {
  if (!isObject(target)) {
    if (true) {
      console.warn(`value cannot be made reactive: ${String(target)}`);
    }
    return target;
  }
  if (target[
    "__v_raw"
    /* RAW */
  ] && !(isReadonly && target[
    "__v_isReactive"
    /* IS_REACTIVE */
  ])) {
    return target;
  }
  const existingProxy = proxyMap.get(target);
  if (existingProxy) {
    return existingProxy;
  }
  const targetType = getTargetType(target);
  if (targetType === 0) {
    return target;
  }
  const proxy = new Proxy(target, targetType === 2 ? collectionHandlers : baseHandlers);
  proxyMap.set(target, proxy);
  return proxy;
}
function toRaw(observed) {
  return observed && toRaw(observed[
    "__v_raw"
    /* RAW */
  ]) || observed;
}
function isRef(r) {
  return Boolean(r && r.__v_isRef === true);
}

// packages/alpinejs/src/magics/$nextTick.js
magic("nextTick", () => nextTick);

// packages/alpinejs/src/magics/$dispatch.js
magic("dispatch", (el) => dispatch.bind(dispatch, el));

// packages/alpinejs/src/magics/$watch.js
magic("watch", (el, { evaluateLater: evaluateLater2, cleanup: cleanup2 }) => (key, callback) => {
  let evaluate2 = evaluateLater2(key);
  let getter = () => {
    let value;
    evaluate2((i) => value = i);
    return value;
  };
  let unwatch = watch(getter, callback);
  cleanup2(unwatch);
});

// packages/alpinejs/src/magics/$store.js
magic("store", getStores);

// packages/alpinejs/src/magics/$data.js
magic("data", (el) => scope(el));

// packages/alpinejs/src/magics/$root.js
magic("root", (el) => closestRoot(el));

// packages/alpinejs/src/magics/$refs.js
magic("refs", (el) => {
  if (el._x_refs_proxy)
    return el._x_refs_proxy;
  el._x_refs_proxy = mergeProxies(getArrayOfRefObject(el));
  return el._x_refs_proxy;
});
function getArrayOfRefObject(el) {
  let refObjects = [];
  findClosest(el, (i) => {
    if (i._x_refs)
      refObjects.push(i._x_refs);
  });
  return refObjects;
}

// packages/alpinejs/src/ids.js
var globalIdMemo = {};
function findAndIncrementId(name) {
  if (!globalIdMemo[name])
    globalIdMemo[name] = 0;
  return ++globalIdMemo[name];
}
function closestIdRoot(el, name) {
  return findClosest(el, (element) => {
    if (element._x_ids && element._x_ids[name])
      return true;
  });
}
function setIdRoot(el, name) {
  if (!el._x_ids)
    el._x_ids = {};
  if (!el._x_ids[name])
    el._x_ids[name] = findAndIncrementId(name);
}

// packages/alpinejs/src/magics/$id.js
magic("id", (el, { cleanup: cleanup2 }) => (name, key = null) => {
  let cacheKey = `${name}${key ? `-${key}` : ""}`;
  return cacheIdByNameOnElement(el, cacheKey, cleanup2, () => {
    let root = closestIdRoot(el, name);
    let id = root ? root._x_ids[name] : findAndIncrementId(name);
    return key ? `${name}-${id}-${key}` : `${name}-${id}`;
  });
});
interceptClone((from, to) => {
  if (from._x_id) {
    to._x_id = from._x_id;
  }
});
function cacheIdByNameOnElement(el, cacheKey, cleanup2, callback) {
  if (!el._x_id)
    el._x_id = {};
  if (el._x_id[cacheKey])
    return el._x_id[cacheKey];
  let output = callback();
  el._x_id[cacheKey] = output;
  cleanup2(() => {
    delete el._x_id[cacheKey];
  });
  return output;
}

// packages/alpinejs/src/magics/$el.js
magic("el", (el) => el);

// packages/alpinejs/src/magics/index.js
warnMissingPluginMagic("Focus", "focus", "focus");
warnMissingPluginMagic("Persist", "persist", "persist");
function warnMissingPluginMagic(name, magicName, slug) {
  magic(magicName, (el) => warn(`You can't use [$${magicName}] without first installing the "${name}" plugin here: https://alpinejs.dev/plugins/${slug}`, el));
}

// packages/alpinejs/src/directives/x-modelable.js
directive("modelable", (el, { expression }, { effect: effect3, evaluateLater: evaluateLater2, cleanup: cleanup2 }) => {
  let func = evaluateLater2(expression);
  let innerGet = () => {
    let result;
    func((i) => result = i);
    return result;
  };
  let evaluateInnerSet = evaluateLater2(`${expression} = __placeholder`);
  let innerSet = (val) => evaluateInnerSet(() => {
  }, { scope: { "__placeholder": val } });
  let initialValue = innerGet();
  innerSet(initialValue);
  queueMicrotask(() => {
    if (!el._x_model)
      return;
    el._x_removeModelListeners["default"]();
    let outerGet = el._x_model.get;
    let outerSet = el._x_model.set;
    let releaseEntanglement = entangle(
      {
        get() {
          return outerGet();
        },
        set(value) {
          outerSet(value);
        }
      },
      {
        get() {
          return innerGet();
        },
        set(value) {
          innerSet(value);
        }
      }
    );
    cleanup2(releaseEntanglement);
  });
});

// packages/alpinejs/src/directives/x-teleport.js
directive("teleport", (el, { modifiers, expression }, { cleanup: cleanup2 }) => {
  if (el.tagName.toLowerCase() !== "template")
    warn("x-teleport can only be used on a <template> tag", el);
  let target = getTarget(expression);
  let clone2 = el.content.cloneNode(true).firstElementChild;
  el._x_teleport = clone2;
  clone2._x_teleportBack = el;
  el.setAttribute("data-teleport-template", true);
  clone2.setAttribute("data-teleport-target", true);
  if (el._x_forwardEvents) {
    el._x_forwardEvents.forEach((eventName) => {
      clone2.addEventListener(eventName, (e) => {
        e.stopPropagation();
        el.dispatchEvent(new e.constructor(e.type, e));
      });
    });
  }
  addScopeToNode(clone2, {}, el);
  let placeInDom = (clone3, target2, modifiers2) => {
    if (modifiers2.includes("prepend")) {
      target2.parentNode.insertBefore(clone3, target2);
    } else if (modifiers2.includes("append")) {
      target2.parentNode.insertBefore(clone3, target2.nextSibling);
    } else {
      target2.appendChild(clone3);
    }
  };
  mutateDom(() => {
    placeInDom(clone2, target, modifiers);
    skipDuringClone(() => {
      initTree(clone2);
    })();
  });
  el._x_teleportPutBack = () => {
    let target2 = getTarget(expression);
    mutateDom(() => {
      placeInDom(el._x_teleport, target2, modifiers);
    });
  };
  cleanup2(
    () => mutateDom(() => {
      clone2.remove();
      destroyTree(clone2);
    })
  );
});
var teleportContainerDuringClone = document.createElement("div");
function getTarget(expression) {
  let target = skipDuringClone(() => {
    return document.querySelector(expression);
  }, () => {
    return teleportContainerDuringClone;
  })();
  if (!target)
    warn(`Cannot find x-teleport element for selector: "${expression}"`);
  return target;
}

// packages/alpinejs/src/directives/x-ignore.js
var handler = () => {
};
handler.inline = (el, { modifiers }, { cleanup: cleanup2 }) => {
  modifiers.includes("self") ? el._x_ignoreSelf = true : el._x_ignore = true;
  cleanup2(() => {
    modifiers.includes("self") ? delete el._x_ignoreSelf : delete el._x_ignore;
  });
};
directive("ignore", handler);

// packages/alpinejs/src/directives/x-effect.js
directive("effect", skipDuringClone((el, { expression }, { effect: effect3 }) => {
  effect3(evaluateLater(el, expression));
}));

// packages/alpinejs/src/utils/on.js
function on(el, event, modifiers, callback) {
  let listenerTarget = el;
  let handler4 = (e) => callback(e);
  let options = {};
  let wrapHandler = (callback2, wrapper) => (e) => wrapper(callback2, e);
  if (modifiers.includes("dot"))
    event = dotSyntax(event);
  if (modifiers.includes("camel"))
    event = camelCase2(event);
  if (modifiers.includes("passive"))
    options.passive = true;
  if (modifiers.includes("capture"))
    options.capture = true;
  if (modifiers.includes("window"))
    listenerTarget = window;
  if (modifiers.includes("document"))
    listenerTarget = document;
  if (modifiers.includes("debounce")) {
    let nextModifier = modifiers[modifiers.indexOf("debounce") + 1] || "invalid-wait";
    let wait = isNumeric(nextModifier.split("ms")[0]) ? Number(nextModifier.split("ms")[0]) : 250;
    handler4 = debounce(handler4, wait);
  }
  if (modifiers.includes("throttle")) {
    let nextModifier = modifiers[modifiers.indexOf("throttle") + 1] || "invalid-wait";
    let wait = isNumeric(nextModifier.split("ms")[0]) ? Number(nextModifier.split("ms")[0]) : 250;
    handler4 = throttle(handler4, wait);
  }
  if (modifiers.includes("prevent"))
    handler4 = wrapHandler(handler4, (next, e) => {
      e.preventDefault();
      next(e);
    });
  if (modifiers.includes("stop"))
    handler4 = wrapHandler(handler4, (next, e) => {
      e.stopPropagation();
      next(e);
    });
  if (modifiers.includes("once")) {
    handler4 = wrapHandler(handler4, (next, e) => {
      next(e);
      listenerTarget.removeEventListener(event, handler4, options);
    });
  }
  if (modifiers.includes("away") || modifiers.includes("outside")) {
    listenerTarget = document;
    handler4 = wrapHandler(handler4, (next, e) => {
      if (el.contains(e.target))
        return;
      if (e.target.isConnected === false)
        return;
      if (el.offsetWidth < 1 && el.offsetHeight < 1)
        return;
      if (el._x_isShown === false)
        return;
      next(e);
    });
  }
  if (modifiers.includes("self"))
    handler4 = wrapHandler(handler4, (next, e) => {
      e.target === el && next(e);
    });
  if (isKeyEvent(event) || isClickEvent(event)) {
    handler4 = wrapHandler(handler4, (next, e) => {
      if (isListeningForASpecificKeyThatHasntBeenPressed(e, modifiers)) {
        return;
      }
      next(e);
    });
  }
  listenerTarget.addEventListener(event, handler4, options);
  return () => {
    listenerTarget.removeEventListener(event, handler4, options);
  };
}
function dotSyntax(subject) {
  return subject.replace(/-/g, ".");
}
function camelCase2(subject) {
  return subject.toLowerCase().replace(/-(\w)/g, (match, char) => char.toUpperCase());
}
function isNumeric(subject) {
  return !Array.isArray(subject) && !isNaN(subject);
}
function kebabCase2(subject) {
  if ([" ", "_"].includes(
    subject
  ))
    return subject;
  return subject.replace(/([a-z])([A-Z])/g, "$1-$2").replace(/[_\s]/, "-").toLowerCase();
}
function isKeyEvent(event) {
  return ["keydown", "keyup"].includes(event);
}
function isClickEvent(event) {
  return ["contextmenu", "click", "mouse"].some((i) => event.includes(i));
}
function isListeningForASpecificKeyThatHasntBeenPressed(e, modifiers) {
  let keyModifiers = modifiers.filter((i) => {
    return !["window", "document", "prevent", "stop", "once", "capture", "self", "away", "outside", "passive", "preserve-scroll"].includes(i);
  });
  if (keyModifiers.includes("debounce")) {
    let debounceIndex = keyModifiers.indexOf("debounce");
    keyModifiers.splice(debounceIndex, isNumeric((keyModifiers[debounceIndex + 1] || "invalid-wait").split("ms")[0]) ? 2 : 1);
  }
  if (keyModifiers.includes("throttle")) {
    let debounceIndex = keyModifiers.indexOf("throttle");
    keyModifiers.splice(debounceIndex, isNumeric((keyModifiers[debounceIndex + 1] || "invalid-wait").split("ms")[0]) ? 2 : 1);
  }
  if (keyModifiers.length === 0)
    return false;
  if (keyModifiers.length === 1 && keyToModifiers(e.key).includes(keyModifiers[0]))
    return false;
  const systemKeyModifiers = ["ctrl", "shift", "alt", "meta", "cmd", "super"];
  const selectedSystemKeyModifiers = systemKeyModifiers.filter((modifier) => keyModifiers.includes(modifier));
  keyModifiers = keyModifiers.filter((i) => !selectedSystemKeyModifiers.includes(i));
  if (selectedSystemKeyModifiers.length > 0) {
    const activelyPressedKeyModifiers = selectedSystemKeyModifiers.filter((modifier) => {
      if (modifier === "cmd" || modifier === "super")
        modifier = "meta";
      return e[`${modifier}Key`];
    });
    if (activelyPressedKeyModifiers.length === selectedSystemKeyModifiers.length) {
      if (isClickEvent(e.type))
        return false;
      if (keyToModifiers(e.key).includes(keyModifiers[0]))
        return false;
    }
  }
  return true;
}
function keyToModifiers(key) {
  if (!key)
    return [];
  key = kebabCase2(key);
  let modifierToKeyMap = {
    "ctrl": "control",
    "slash": "/",
    "space": " ",
    "spacebar": " ",
    "cmd": "meta",
    "esc": "escape",
    "up": "arrow-up",
    "down": "arrow-down",
    "left": "arrow-left",
    "right": "arrow-right",
    "period": ".",
    "comma": ",",
    "equal": "=",
    "minus": "-",
    "underscore": "_"
  };
  modifierToKeyMap[key] = key;
  return Object.keys(modifierToKeyMap).map((modifier) => {
    if (modifierToKeyMap[modifier] === key)
      return modifier;
  }).filter((modifier) => modifier);
}

// packages/alpinejs/src/directives/x-model.js
directive("model", (el, { modifiers, expression }, { effect: effect3, cleanup: cleanup2 }) => {
  let scopeTarget = el;
  if (modifiers.includes("parent")) {
    scopeTarget = el.parentNode;
  }
  let evaluateGet = evaluateLater(scopeTarget, expression);
  let evaluateSet;
  if (typeof expression === "string") {
    evaluateSet = evaluateLater(scopeTarget, `${expression} = __placeholder`);
  } else if (typeof expression === "function" && typeof expression() === "string") {
    evaluateSet = evaluateLater(scopeTarget, `${expression()} = __placeholder`);
  } else {
    evaluateSet = () => {
    };
  }
  let getValue = () => {
    let result;
    evaluateGet((value) => result = value);
    return isGetterSetter(result) ? result.get() : result;
  };
  let setValue = (value) => {
    let result;
    evaluateGet((value2) => result = value2);
    if (isGetterSetter(result)) {
      result.set(value);
    } else {
      evaluateSet(() => {
      }, {
        scope: { "__placeholder": value }
      });
    }
  };
  if (typeof expression === "string" && el.type === "radio") {
    mutateDom(() => {
      if (!el.hasAttribute("name"))
        el.setAttribute("name", expression);
    });
  }
  let event = el.tagName.toLowerCase() === "select" || ["checkbox", "radio"].includes(el.type) || modifiers.includes("lazy") ? "change" : "input";
  let removeListener = isCloning ? () => {
  } : on(el, event, modifiers, (e) => {
    setValue(getInputValue(el, modifiers, e, getValue()));
  });
  if (modifiers.includes("fill")) {
    if ([void 0, null, ""].includes(getValue()) || isCheckbox(el) && Array.isArray(getValue()) || el.tagName.toLowerCase() === "select" && el.multiple) {
      setValue(
        getInputValue(el, modifiers, { target: el }, getValue())
      );
    }
  }
  if (!el._x_removeModelListeners)
    el._x_removeModelListeners = {};
  el._x_removeModelListeners["default"] = removeListener;
  cleanup2(() => el._x_removeModelListeners["default"]());
  if (el.form) {
    let removeResetListener = on(el.form, "reset", [], (e) => {
      nextTick(() => el._x_model && el._x_model.set(getInputValue(el, modifiers, { target: el }, getValue())));
    });
    cleanup2(() => removeResetListener());
  }
  el._x_model = {
    get() {
      return getValue();
    },
    set(value) {
      setValue(value);
    }
  };
  el._x_forceModelUpdate = (value) => {
    if (value === void 0 && typeof expression === "string" && expression.match(/\./))
      value = "";
    window.fromModel = true;
    mutateDom(() => bind(el, "value", value));
    delete window.fromModel;
  };
  effect3(() => {
    let value = getValue();
    if (modifiers.includes("unintrusive") && document.activeElement.isSameNode(el))
      return;
    el._x_forceModelUpdate(value);
  });
});
function getInputValue(el, modifiers, event, currentValue) {
  return mutateDom(() => {
    if (event instanceof CustomEvent && event.detail !== void 0)
      return event.detail !== null && event.detail !== void 0 ? event.detail : event.target.value;
    else if (isCheckbox(el)) {
      if (Array.isArray(currentValue)) {
        let newValue = null;
        if (modifiers.includes("number")) {
          newValue = safeParseNumber(event.target.value);
        } else if (modifiers.includes("boolean")) {
          newValue = safeParseBoolean(event.target.value);
        } else {
          newValue = event.target.value;
        }
        return event.target.checked ? currentValue.includes(newValue) ? currentValue : currentValue.concat([newValue]) : currentValue.filter((el2) => !checkedAttrLooseCompare2(el2, newValue));
      } else {
        return event.target.checked;
      }
    } else if (el.tagName.toLowerCase() === "select" && el.multiple) {
      if (modifiers.includes("number")) {
        return Array.from(event.target.selectedOptions).map((option) => {
          let rawValue = option.value || option.text;
          return safeParseNumber(rawValue);
        });
      } else if (modifiers.includes("boolean")) {
        return Array.from(event.target.selectedOptions).map((option) => {
          let rawValue = option.value || option.text;
          return safeParseBoolean(rawValue);
        });
      }
      return Array.from(event.target.selectedOptions).map((option) => {
        return option.value || option.text;
      });
    } else {
      let newValue;
      if (isRadio(el)) {
        if (event.target.checked) {
          newValue = event.target.value;
        } else {
          newValue = currentValue;
        }
      } else {
        newValue = event.target.value;
      }
      if (modifiers.includes("number")) {
        return safeParseNumber(newValue);
      } else if (modifiers.includes("boolean")) {
        return safeParseBoolean(newValue);
      } else if (modifiers.includes("trim")) {
        return newValue.trim();
      } else {
        return newValue;
      }
    }
  });
}
function safeParseNumber(rawValue) {
  let number = rawValue ? parseFloat(rawValue) : null;
  return isNumeric2(number) ? number : rawValue;
}
function checkedAttrLooseCompare2(valueA, valueB) {
  return valueA == valueB;
}
function isNumeric2(subject) {
  return !Array.isArray(subject) && !isNaN(subject);
}
function isGetterSetter(value) {
  return value !== null && typeof value === "object" && typeof value.get === "function" && typeof value.set === "function";
}

// packages/alpinejs/src/directives/x-cloak.js
directive("cloak", (el) => queueMicrotask(() => mutateDom(() => el.removeAttribute(prefix("cloak")))));

// packages/alpinejs/src/directives/x-init.js
addInitSelector(() => `[${prefix("init")}]`);
directive("init", skipDuringClone((el, { expression }, { evaluate: evaluate2 }) => {
  if (typeof expression === "string") {
    return !!expression.trim() && evaluate2(expression, {}, false);
  }
  return evaluate2(expression, {}, false);
}));

// packages/alpinejs/src/directives/x-text.js
directive("text", (el, { expression }, { effect: effect3, evaluateLater: evaluateLater2 }) => {
  let evaluate2 = evaluateLater2(expression);
  effect3(() => {
    evaluate2((value) => {
      mutateDom(() => {
        el.textContent = value;
      });
    });
  });
});

// packages/alpinejs/src/directives/x-html.js
directive("html", (el, { expression }, { effect: effect3, evaluateLater: evaluateLater2 }) => {
  let evaluate2 = evaluateLater2(expression);
  effect3(() => {
    evaluate2((value) => {
      mutateDom(() => {
        el.innerHTML = value;
        el._x_ignoreSelf = true;
        initTree(el);
        delete el._x_ignoreSelf;
      });
    });
  });
});

// packages/alpinejs/src/directives/x-bind.js
mapAttributes(startingWith(":", into(prefix("bind:"))));
var handler2 = (el, { value, modifiers, expression, original }, { effect: effect3, cleanup: cleanup2 }) => {
  if (!value) {
    let bindingProviders = {};
    injectBindingProviders(bindingProviders);
    let getBindings = evaluateLater(el, expression);
    getBindings((bindings) => {
      applyBindingsObject(el, bindings, original);
    }, { scope: bindingProviders });
    return;
  }
  if (value === "key")
    return storeKeyForXFor(el, expression);
  if (el._x_inlineBindings && el._x_inlineBindings[value] && el._x_inlineBindings[value].extract) {
    return;
  }
  let evaluate2 = evaluateLater(el, expression);
  effect3(() => evaluate2((result) => {
    if (result === void 0 && typeof expression === "string" && expression.match(/\./)) {
      result = "";
    }
    mutateDom(() => bind(el, value, result, modifiers));
  }));
  cleanup2(() => {
    el._x_undoAddedClasses && el._x_undoAddedClasses();
    el._x_undoAddedStyles && el._x_undoAddedStyles();
  });
};
handler2.inline = (el, { value, modifiers, expression }) => {
  if (!value)
    return;
  if (!el._x_inlineBindings)
    el._x_inlineBindings = {};
  el._x_inlineBindings[value] = { expression, extract: false };
};
directive("bind", handler2);
function storeKeyForXFor(el, expression) {
  el._x_keyExpression = expression;
}

// packages/alpinejs/src/directives/x-data.js
addRootSelector(() => `[${prefix("data")}]`);
directive("data", (el, { expression }, { cleanup: cleanup2 }) => {
  if (shouldSkipRegisteringDataDuringClone(el))
    return;
  expression = expression === "" ? "{}" : expression;
  let magicContext = {};
  injectMagics(magicContext, el);
  let dataProviderContext = {};
  injectDataProviders(dataProviderContext, magicContext);
  let data2 = evaluate(el, expression, { scope: dataProviderContext });
  if (data2 === void 0 || data2 === true)
    data2 = {};
  injectMagics(data2, el);
  let reactiveData = reactive(data2);
  initInterceptors(reactiveData);
  let undo = addScopeToNode(el, reactiveData);
  reactiveData["init"] && evaluate(el, reactiveData["init"]);
  cleanup2(() => {
    reactiveData["destroy"] && evaluate(el, reactiveData["destroy"]);
    undo();
  });
});
interceptClone((from, to) => {
  if (from._x_dataStack) {
    to._x_dataStack = from._x_dataStack;
    to.setAttribute("data-has-alpine-state", true);
  }
});
function shouldSkipRegisteringDataDuringClone(el) {
  if (!isCloning)
    return false;
  if (isCloningLegacy)
    return true;
  return el.hasAttribute("data-has-alpine-state");
}

// packages/alpinejs/src/directives/x-show.js
directive("show", (el, { modifiers, expression }, { effect: effect3 }) => {
  let evaluate2 = evaluateLater(el, expression);
  if (!el._x_doHide)
    el._x_doHide = () => {
      mutateDom(() => {
        el.style.setProperty("display", "none", modifiers.includes("important") ? "important" : void 0);
      });
    };
  if (!el._x_doShow)
    el._x_doShow = () => {
      mutateDom(() => {
        if (el.style.length === 1 && el.style.display === "none") {
          el.removeAttribute("style");
        } else {
          el.style.removeProperty("display");
        }
      });
    };
  let hide = () => {
    el._x_doHide();
    el._x_isShown = false;
  };
  let show = () => {
    el._x_doShow();
    el._x_isShown = true;
  };
  let clickAwayCompatibleShow = () => setTimeout(show);
  let toggle = once(
    (value) => value ? show() : hide(),
    (value) => {
      if (typeof el._x_toggleAndCascadeWithTransitions === "function") {
        el._x_toggleAndCascadeWithTransitions(el, value, show, hide);
      } else {
        value ? clickAwayCompatibleShow() : hide();
      }
    }
  );
  let oldValue;
  let firstTime = true;
  effect3(() => evaluate2((value) => {
    if (!firstTime && value === oldValue)
      return;
    if (modifiers.includes("immediate"))
      value ? clickAwayCompatibleShow() : hide();
    toggle(value);
    oldValue = value;
    firstTime = false;
  }));
});

// packages/alpinejs/src/directives/x-for.js
directive("for", (el, { expression }, { effect: effect3, cleanup: cleanup2 }) => {
  let iteratorNames = parseForExpression(expression);
  let evaluateItems = evaluateLater(el, iteratorNames.items);
  let evaluateKey = evaluateLater(
    el,
    // the x-bind:key expression is stored for our use instead of evaluated.
    el._x_keyExpression || "index"
  );
  el._x_prevKeys = [];
  el._x_lookup = {};
  effect3(() => loop(el, iteratorNames, evaluateItems, evaluateKey));
  cleanup2(() => {
    Object.values(el._x_lookup).forEach((el2) => mutateDom(
      () => {
        destroyTree(el2);
        el2.remove();
      }
    ));
    delete el._x_prevKeys;
    delete el._x_lookup;
  });
});
function loop(el, iteratorNames, evaluateItems, evaluateKey) {
  let isObject2 = (i) => typeof i === "object" && !Array.isArray(i);
  let templateEl = el;
  evaluateItems((items) => {
    if (isNumeric3(items) && items >= 0) {
      items = Array.from(Array(items).keys(), (i) => i + 1);
    }
    if (items === void 0)
      items = [];
    let lookup = el._x_lookup;
    let prevKeys = el._x_prevKeys;
    let scopes = [];
    let keys = [];
    if (isObject2(items)) {
      items = Object.entries(items).map(([key, value]) => {
        let scope2 = getIterationScopeVariables(iteratorNames, value, key, items);
        evaluateKey((value2) => {
          if (keys.includes(value2))
            warn("Duplicate key on x-for", el);
          keys.push(value2);
        }, { scope: { index: key, ...scope2 } });
        scopes.push(scope2);
      });
    } else {
      for (let i = 0; i < items.length; i++) {
        let scope2 = getIterationScopeVariables(iteratorNames, items[i], i, items);
        evaluateKey((value) => {
          if (keys.includes(value))
            warn("Duplicate key on x-for", el);
          keys.push(value);
        }, { scope: { index: i, ...scope2 } });
        scopes.push(scope2);
      }
    }
    let adds = [];
    let moves = [];
    let removes = [];
    let sames = [];
    for (let i = 0; i < prevKeys.length; i++) {
      let key = prevKeys[i];
      if (keys.indexOf(key) === -1)
        removes.push(key);
    }
    prevKeys = prevKeys.filter((key) => !removes.includes(key));
    let lastKey = "template";
    for (let i = 0; i < keys.length; i++) {
      let key = keys[i];
      let prevIndex = prevKeys.indexOf(key);
      if (prevIndex === -1) {
        prevKeys.splice(i, 0, key);
        adds.push([lastKey, i]);
      } else if (prevIndex !== i) {
        let keyInSpot = prevKeys.splice(i, 1)[0];
        let keyForSpot = prevKeys.splice(prevIndex - 1, 1)[0];
        prevKeys.splice(i, 0, keyForSpot);
        prevKeys.splice(prevIndex, 0, keyInSpot);
        moves.push([keyInSpot, keyForSpot]);
      } else {
        sames.push(key);
      }
      lastKey = key;
    }
    for (let i = 0; i < removes.length; i++) {
      let key = removes[i];
      if (!(key in lookup))
        continue;
      mutateDom(() => {
        destroyTree(lookup[key]);
        lookup[key].remove();
      });
      delete lookup[key];
    }
    for (let i = 0; i < moves.length; i++) {
      let [keyInSpot, keyForSpot] = moves[i];
      let elInSpot = lookup[keyInSpot];
      let elForSpot = lookup[keyForSpot];
      let marker = document.createElement("div");
      mutateDom(() => {
        if (!elForSpot)
          warn(`x-for ":key" is undefined or invalid`, templateEl, keyForSpot, lookup);
        elForSpot.after(marker);
        elInSpot.after(elForSpot);
        elForSpot._x_currentIfEl && elForSpot.after(elForSpot._x_currentIfEl);
        marker.before(elInSpot);
        elInSpot._x_currentIfEl && elInSpot.after(elInSpot._x_currentIfEl);
        marker.remove();
      });
      elForSpot._x_refreshXForScope(scopes[keys.indexOf(keyForSpot)]);
    }
    for (let i = 0; i < adds.length; i++) {
      let [lastKey2, index] = adds[i];
      let lastEl = lastKey2 === "template" ? templateEl : lookup[lastKey2];
      if (lastEl._x_currentIfEl)
        lastEl = lastEl._x_currentIfEl;
      let scope2 = scopes[index];
      let key = keys[index];
      let clone2 = document.importNode(templateEl.content, true).firstElementChild;
      let reactiveScope = reactive(scope2);
      addScopeToNode(clone2, reactiveScope, templateEl);
      clone2._x_refreshXForScope = (newScope) => {
        Object.entries(newScope).forEach(([key2, value]) => {
          reactiveScope[key2] = value;
        });
      };
      mutateDom(() => {
        lastEl.after(clone2);
        skipDuringClone(() => initTree(clone2))();
      });
      if (typeof key === "object") {
        warn("x-for key cannot be an object, it must be a string or an integer", templateEl);
      }
      lookup[key] = clone2;
    }
    for (let i = 0; i < sames.length; i++) {
      lookup[sames[i]]._x_refreshXForScope(scopes[keys.indexOf(sames[i])]);
    }
    templateEl._x_prevKeys = keys;
  });
}
function parseForExpression(expression) {
  let forIteratorRE = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/;
  let stripParensRE = /^\s*\(|\)\s*$/g;
  let forAliasRE = /([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/;
  let inMatch = expression.match(forAliasRE);
  if (!inMatch)
    return;
  let res = {};
  res.items = inMatch[2].trim();
  let item = inMatch[1].replace(stripParensRE, "").trim();
  let iteratorMatch = item.match(forIteratorRE);
  if (iteratorMatch) {
    res.item = item.replace(forIteratorRE, "").trim();
    res.index = iteratorMatch[1].trim();
    if (iteratorMatch[2]) {
      res.collection = iteratorMatch[2].trim();
    }
  } else {
    res.item = item;
  }
  return res;
}
function getIterationScopeVariables(iteratorNames, item, index, items) {
  let scopeVariables = {};
  if (/^\[.*\]$/.test(iteratorNames.item) && Array.isArray(item)) {
    let names = iteratorNames.item.replace("[", "").replace("]", "").split(",").map((i) => i.trim());
    names.forEach((name, i) => {
      scopeVariables[name] = item[i];
    });
  } else if (/^\{.*\}$/.test(iteratorNames.item) && !Array.isArray(item) && typeof item === "object") {
    let names = iteratorNames.item.replace("{", "").replace("}", "").split(",").map((i) => i.trim());
    names.forEach((name) => {
      scopeVariables[name] = item[name];
    });
  } else {
    scopeVariables[iteratorNames.item] = item;
  }
  if (iteratorNames.index)
    scopeVariables[iteratorNames.index] = index;
  if (iteratorNames.collection)
    scopeVariables[iteratorNames.collection] = items;
  return scopeVariables;
}
function isNumeric3(subject) {
  return !Array.isArray(subject) && !isNaN(subject);
}

// packages/alpinejs/src/directives/x-ref.js
function handler3() {
}
handler3.inline = (el, { expression }, { cleanup: cleanup2 }) => {
  let root = closestRoot(el);
  if (!root._x_refs)
    root._x_refs = {};
  root._x_refs[expression] = el;
  cleanup2(() => delete root._x_refs[expression]);
};
directive("ref", handler3);

// packages/alpinejs/src/directives/x-if.js
directive("if", (el, { expression }, { effect: effect3, cleanup: cleanup2 }) => {
  if (el.tagName.toLowerCase() !== "template")
    warn("x-if can only be used on a <template> tag", el);
  let evaluate2 = evaluateLater(el, expression);
  let show = () => {
    if (el._x_currentIfEl)
      return el._x_currentIfEl;
    let clone2 = el.content.cloneNode(true).firstElementChild;
    addScopeToNode(clone2, {}, el);
    mutateDom(() => {
      el.after(clone2);
      skipDuringClone(() => initTree(clone2))();
    });
    el._x_currentIfEl = clone2;
    el._x_undoIf = () => {
      mutateDom(() => {
        destroyTree(clone2);
        clone2.remove();
      });
      delete el._x_currentIfEl;
    };
    return clone2;
  };
  let hide = () => {
    if (!el._x_undoIf)
      return;
    el._x_undoIf();
    delete el._x_undoIf;
  };
  effect3(() => evaluate2((value) => {
    value ? show() : hide();
  }));
  cleanup2(() => el._x_undoIf && el._x_undoIf());
});

// packages/alpinejs/src/directives/x-id.js
directive("id", (el, { expression }, { evaluate: evaluate2 }) => {
  let names = evaluate2(expression);
  names.forEach((name) => setIdRoot(el, name));
});
interceptClone((from, to) => {
  if (from._x_ids) {
    to._x_ids = from._x_ids;
  }
});

// packages/alpinejs/src/directives/x-on.js
mapAttributes(startingWith("@", into(prefix("on:"))));
directive("on", skipDuringClone((el, { value, modifiers, expression }, { cleanup: cleanup2 }) => {
  let evaluate2 = expression ? evaluateLater(el, expression) : () => {
  };
  if (el.tagName.toLowerCase() === "template") {
    if (!el._x_forwardEvents)
      el._x_forwardEvents = [];
    if (!el._x_forwardEvents.includes(value))
      el._x_forwardEvents.push(value);
  }
  let removeListener = on(el, value, modifiers, (e) => {
    evaluate2(() => {
    }, { scope: { "$event": e }, params: [e] });
  });
  cleanup2(() => removeListener());
}));

// packages/alpinejs/src/directives/index.js
warnMissingPluginDirective("Collapse", "collapse", "collapse");
warnMissingPluginDirective("Intersect", "intersect", "intersect");
warnMissingPluginDirective("Focus", "trap", "focus");
warnMissingPluginDirective("Mask", "mask", "mask");
function warnMissingPluginDirective(name, directiveName, slug) {
  directive(directiveName, (el) => warn(`You can't use [x-${directiveName}] without first installing the "${name}" plugin here: https://alpinejs.dev/plugins/${slug}`, el));
}

// packages/alpinejs/src/index.js
alpine_default.setEvaluator(normalEvaluator);
alpine_default.setRawEvaluator(normalRawEvaluator);
alpine_default.setReactivityEngine({ reactive: reactive2, effect: effect2, release: stop, raw: toRaw });
var src_default = alpine_default;

// packages/alpinejs/builds/module.js
var module_default = src_default;



/***/ },

/***/ "../node_modules/alt1/dist/base/index.js"
/*!***********************************************!*\
  !*** ../node_modules/alt1/dist/base/index.js ***!
  \***********************************************/
(module, __unused_webpack_exports, __webpack_require__) {

(function webpackUniversalModuleDefinition(root, factory) {
	if(true)
		module.exports = factory((function webpackLoadOptionalExternalModule() { try { return __webpack_require__(/*! sharp */ "sharp"); } catch(e) {} }()), (function webpackLoadOptionalExternalModule() { try { return __webpack_require__(/*! canvas */ "canvas"); } catch(e) {} }()), (function webpackLoadOptionalExternalModule() { try { return __webpack_require__(/*! electron/common */ "electron/common"); } catch(e) {} }()));
	else // removed by dead control flow
{}
})(globalThis, (__WEBPACK_EXTERNAL_MODULE_sharp__, __WEBPACK_EXTERNAL_MODULE_canvas__, __WEBPACK_EXTERNAL_MODULE_electron_common__) => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/base/alt1api.ts":
/*!*****************************!*\
  !*** ./src/base/alt1api.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ "./src/base/declarations.ts":
/*!**********************************!*\
  !*** ./src/base/declarations.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ "./src/base/imagedata-extensions.ts":
/*!******************************************!*\
  !*** ./src/base/imagedata-extensions.ts ***!
  \******************************************/
/***/ (function(__unused_webpack_module, exports, __nested_webpack_require_2062__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ImageData = void 0;
const a1lib = __importStar(__nested_webpack_require_2062__(/*! ./index */ "./src/base/index.ts"));
const nodeimports = __importStar(__nested_webpack_require_2062__(/*! ./nodepolyfill */ "./src/base/nodepolyfill.ts"));
(function () {
    var globalvar = (typeof self != "undefined" ? self : (typeof __nested_webpack_require_2062__.g != "undefined" ? __nested_webpack_require_2062__.g : null));
    var filltype = typeof globalvar.ImageData == "undefined";
    var fillconstr = filltype;
    if (!filltype) {
        var oldconstr = globalvar.ImageData;
        try {
            let data = new Uint8ClampedArray(4);
            data[0] = 1;
            let a = new globalvar.ImageData(data, 1, 1);
            fillconstr = a.data[0] != 1;
        }
        catch (e) {
            fillconstr = true;
        }
    }
    if (fillconstr) {
        var constr = function ImageDataShim() {
            var i = 0;
            var data = (arguments[i] instanceof Uint8ClampedArray ? arguments[i++] : null);
            var width = arguments[i++];
            var height = arguments[i++];
            if (filltype) {
                if (!data) {
                    data = new Uint8ClampedArray(width * height * 4);
                }
                this.width = width;
                this.height = height;
                this.data = data;
            }
            else if (fillconstr) {
                //WARNING This branch of code does not use the same pixel data backing store
                //(problem with wasm, however all wasm browser have a native constructor (unless asm.js is used))
                var canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                var ctx = canvas.getContext("2d");
                var imageData = ctx.createImageData(width, height);
                if (data) {
                    imageData.data.set(data);
                }
                return imageData;
            }
            // else {
            // 	//oh no...
            // 	//we need this monstrocity in order to call the native constructor with variable number of args
            // 	//when es5 transpile is enable (that strips the spread operator)
            // 	return new (Function.prototype.bind.apply(oldconstr, [null,...arguments]));
            // }
        };
        if (!filltype) {
            constr.prototype = globalvar.ImageData.prototype;
        }
        globalvar.ImageData = constr;
        exports.ImageData = constr;
    }
    else {
        exports.ImageData = globalvar.ImageData;
    }
})();
//Recast into a drawable imagedata class on all platforms, into a normal browser ImageData on browsers or a node-canvas imagedata on nodejs
exports.ImageData.prototype.toDrawableData = function () {
    if (typeof document == "undefined") {
        return nodeimports.imageDataToDrawable(this);
    }
    else {
        return this;
    }
};
exports.ImageData.prototype.putImageData = function (buf, cx, cy) {
    for (var dx = 0; dx < buf.width; dx++) {
        for (var dy = 0; dy < buf.height; dy++) {
            var i1 = (dx + cx) * 4 + (dy + cy) * 4 * this.width;
            var i2 = dx * 4 + dy * 4 * buf.width;
            this.data[i1] = buf.data[i2];
            this.data[i1 + 1] = buf.data[i2 + 1];
            this.data[i1 + 2] = buf.data[i2 + 2];
            this.data[i1 + 3] = buf.data[i2 + 3];
        }
    }
};
exports.ImageData.prototype.pixelOffset = function (x, y) {
    return x * 4 + y * this.width * 4;
};
//creates a hash of a portion of the buffer used to check for changes
exports.ImageData.prototype.getPixelHash = function (rect) {
    if (!rect) {
        rect = new a1lib.Rect(0, 0, this.width, this.height);
    }
    var hash = 0;
    for (var x = rect.x; x < rect.x + rect.width; x++) {
        for (var y = rect.y; y < rect.y + rect.height; y++) {
            var i = x * 4 + y * 4 * this.width;
            hash = (((hash << 5) - hash) + this.data[i]) | 0;
            hash = (((hash << 5) - hash) + this.data[i + 1]) | 0;
            hash = (((hash << 5) - hash) + this.data[i + 2]) | 0;
            hash = (((hash << 5) - hash) + this.data[i + 3]) | 0;
        }
    }
    return hash;
};
exports.ImageData.prototype.clone = function (rect) {
    let res = new exports.ImageData(rect.width, rect.height);
    this.copyTo(res, rect.x, rect.y, rect.width, rect.height, 0, 0);
    return res;
};
exports.ImageData.prototype.show = function (x = 5, y = 5, zoom = 1) {
    if (typeof document == "undefined") {
        console.error("need a document to show an imagedata object");
        return;
    }
    var imgs = document.getElementsByClassName("debugimage");
    while (imgs.length > exports.ImageData.prototype.show.maxImages) {
        imgs[0].remove();
    }
    var el = this.toImage();
    el.classList.add("debugimage");
    el.style.position = "absolute";
    el.style.zIndex = "1000";
    el.style.left = x / zoom + "px";
    el.style.top = y / zoom + "px";
    el.style.background = "purple";
    el.style.cursor = "pointer";
    el.style.imageRendering = "pixelated";
    el.style.outline = "1px solid #0f0";
    el.style.width = (this.width == 1 ? 100 : this.width) * zoom + "px";
    el.style.height = (this.height == 1 ? 100 : this.height) * zoom + "px";
    el.onclick = function () { el.remove(); };
    document.body.appendChild(el);
    return el;
};
exports.ImageData.prototype.show.maxImages = 10;
exports.ImageData.prototype.toImage = function (rect) {
    if (!rect) {
        rect = new a1lib.Rect(0, 0, this.width, this.height);
    }
    if (typeof document != "undefined") {
        var el = document.createElement("canvas");
        el.width = rect.width;
        el.height = rect.height;
    }
    else {
        el = nodeimports.createCanvas(rect.width, rect.height);
    }
    var ctx = el.getContext("2d");
    ctx.putImageData(this.toDrawableData(), -rect.x, -rect.y);
    return el;
};
exports.ImageData.prototype.getPixel = function (x, y) {
    var i = x * 4 + y * 4 * this.width;
    return [this.data[i], this.data[i + 1], this.data[i + 2], this.data[i + 3]];
};
exports.ImageData.prototype.getPixelValueSum = function (x, y) {
    var i = x * 4 + y * 4 * this.width;
    return this.data[i] + this.data[i + 1] + this.data[i + 2];
};
exports.ImageData.prototype.getPixelInt = function (x, y) {
    var i = x * 4 + y * 4 * this.width;
    return (this.data[i + 3] << 24) + (this.data[i + 0] << 16) + (this.data[i + 1] << 8) + (this.data[i + 2] << 0);
};
exports.ImageData.prototype.getColorDifference = function (x, y, r, g, b, a = 255) {
    var i = x * 4 + y * 4 * this.width;
    return Math.abs(this.data[i] - r) + Math.abs(this.data[i + 1] - g) + Math.abs(this.data[i + 2] - b) * a / 255;
};
exports.ImageData.prototype.setPixel = function (x, y, ...color) {
    var r, g, b, a;
    var [r, g, b, a] = (Array.isArray(color[0]) ? color[0] : color);
    var i = x * 4 + y * 4 * this.width;
    this.data[i] = r;
    this.data[i + 1] = g;
    this.data[i + 2] = b;
    this.data[i + 3] = a == undefined ? 255 : a;
};
exports.ImageData.prototype.setPixelInt = function (x, y, color) {
    var i = x * 4 + y * 4 * this.width;
    this.data[i] = (color >> 24) & 0xff;
    this.data[i + 1] = (color >> 16) & 0xff;
    this.data[i + 2] = (color >> 8) & 0xff;
    this.data[i + 3] = (color >> 0) & 0xff;
};
exports.ImageData.prototype.toFileBytes = function (format, quality) {
    if (typeof HTMLCanvasElement != "undefined") {
        return new Promise(d => this.toImage().toBlob(b => {
            var r = new FileReader();
            r.readAsArrayBuffer(b);
            r.onload = () => d(new Uint8Array(r.result));
        }, format, quality));
    }
    else {
        return nodeimports.imageDataToFileBytes(this, format, quality);
    }
};
exports.ImageData.prototype.toPngBase64 = function () {
    if (typeof HTMLCanvasElement != "undefined") {
        var str = this.toImage().toDataURL("image/png");
        return str.slice(str.indexOf(",") + 1);
    }
    else {
        throw new Error("synchronous image conversion not supported in nodejs, try using ImageData.prototype.toFileBytes");
    }
};
exports.ImageData.prototype.pixelCompare = function (buf, x = 0, y = 0, max) {
    return a1lib.ImageDetect.simpleCompare(this, buf, x, y, max);
};
exports.ImageData.prototype.copyTo = function (target, sourcex, sourcey, width, height, targetx, targety) {
    //convince v8 that these are 31bit uints
    const targetwidth = target.width | 0;
    const thiswidth = this.width | 0;
    const copywidth = width | 0;
    const fastwidth = Math.floor(width / 4) * 4;
    const thisdata = new Int32Array(this.data.buffer, this.data.byteOffset, this.data.byteLength / 4);
    const targetdata = new Int32Array(target.data.buffer, target.data.byteOffset, target.data.byteLength / 4);
    for (let cy = 0; cy < height; cy++) {
        let cx = 0;
        let it = (cx + targetx) + (cy + targety) * targetwidth;
        let is = (cx + sourcex) + (cy + sourcey) * thiswidth;
        //copy 4 pixels per iter (xmm)
        for (; cx < fastwidth; cx += 4) {
            targetdata[it] = thisdata[is];
            targetdata[it + 1] = thisdata[is + 1];
            targetdata[it + 2] = thisdata[is + 2];
            targetdata[it + 3] = thisdata[is + 3];
            it += 4;
            is += 4;
        }
        //copy remainder per pixel
        for (; cx < copywidth; cx++) {
            targetdata[it] = thisdata[is];
            it += 1;
            is += 1;
        }
    }
};


/***/ }),

/***/ "./src/base/imagedetect.ts":
/*!*********************************!*\
  !*** ./src/base/imagedetect.ts ***!
  \*********************************/
/***/ (function(__unused_webpack_module, exports, __nested_webpack_require_12931__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ImageDataSet = exports.webpackImages = exports.asyncMap = exports.coldif = exports.simpleCompareRMSE = exports.simpleCompare = exports.findSubbuffer = exports.findSubimage = exports.clearPngColorspace = exports.isPngBuffer = exports.imageDataFromFileBuffer = exports.imageDataFromBase64 = exports.imageDataFromUrl = void 0;
const imgref_1 = __nested_webpack_require_12931__(/*! ./imgref */ "./src/base/imgref.ts");
const wapper = __importStar(__nested_webpack_require_12931__(/*! ./wrapper */ "./src/base/wrapper.ts"));
const nodeimports = __importStar(__nested_webpack_require_12931__(/*! ./nodepolyfill */ "./src/base/nodepolyfill.ts"));
const _1 = __nested_webpack_require_12931__(/*! . */ "./src/base/index.ts");
/**
* Downloads an image and returns the ImageData.
* Cleans sRGB headers from downloaded png images. Assumes that data url's are already cleaned from sRGB and other headers
* @param url http(s) or data url to the image
*/
async function imageDataFromUrl(url) {
    var hdr = "data:image/png;base64,";
    var isdataurl = url.startsWith(hdr);
    if (typeof Image != "undefined") {
        if (isdataurl) {
            return loadImageDataFromUrl(url);
        }
        else {
            let res = await fetch(url);
            if (!res.ok) {
                throw new Error("failed to load image: " + url);
            }
            let file = new Uint8Array(await res.arrayBuffer());
            return imageDataFromFileBuffer(file);
        }
    }
    else {
        if (isdataurl) {
            return imageDataFromBase64(url.slice(hdr.length));
        }
        throw new Error("loading remote images in nodejs has been disabled, load the raw bytes and use imageDataFromNodeBuffer instead");
    }
}
exports.imageDataFromUrl = imageDataFromUrl;
function loadImageDataFromUrl(url) {
    if (typeof Image == "undefined") {
        throw new Error("Browser environment expected");
    }
    return new Promise((done, fail) => {
        var img = new Image();
        img.crossOrigin = "crossorigin";
        img.onload = function () { done(new imgref_1.ImgRefCtx(img).toData()); };
        img.onerror = fail;
        img.src = url;
    });
}
/**
* Loads an ImageData object from a base64 encoded png image
* Make sure the png image does not have a sRGB chunk or the resulting pixels will differ for different users!!!
* @param data a base64 encoded png image
*/
async function imageDataFromBase64(data) {
    if (typeof Image != "undefined") {
        return imageDataFromUrl("data:image/png;base64," + data);
    }
    else {
        return nodeimports.imageDataFromBase64(data);
    }
}
exports.imageDataFromBase64 = imageDataFromBase64;
/**
 * Loads an ImageData object directly from a png encoded file buffer
 * This method ensures that png color space headers are taken care off
 * @param data The bytes of a png file
 */
async function imageDataFromFileBuffer(data) {
    if (isPngBuffer(data)) {
        clearPngColorspace(data);
    }
    if (typeof Image != "undefined") {
        let blob = new Blob([data], { type: "image/png" });
        let url = URL.createObjectURL(blob);
        let r = await loadImageDataFromUrl(url);
        URL.revokeObjectURL(url);
        return r;
    }
    else {
        return nodeimports.imageDataFromBuffer(data);
    }
}
exports.imageDataFromFileBuffer = imageDataFromFileBuffer;
/**
* Checks if a given byte array is a png file (by checking for ?PNG as first 4 bytes)
* @param bytes Raw bytes of the png file
*/
function isPngBuffer(bytes) {
    return bytes[0] == 137 && bytes[1] == 80 && bytes[2] == 78 && bytes[3] == 71;
}
exports.isPngBuffer = isPngBuffer;
/**
* Resets the colorspace data in the png file.
* This makes sure the browser renders the exact colors in the file instead of filtering it in order to obtain the best real life representation of
* what it looked like on the authors screen. (this feature is often broken and not supported)
* For example a round trip printscreen -> open in browser results in different colors than the original
* @param data Raw bytes of the png file
*/
function clearPngColorspace(data) {
    if (!isPngBuffer(data)) {
        throw new Error("non-png image received");
    }
    var i = 8;
    while (i < data.length) {
        var length = data[i++] * 0x1000000 + data[i++] * 0x10000 + data[i++] * 0x100 + data[i++];
        var ancillary = !!((data[i] >> 5) & 1);
        var chunkname = String.fromCharCode(data[i], data[i + 1], data[i + 2], data[i + 3]);
        var chunkid = chunkname.toLowerCase();
        if (chunkid != "trns" && ancillary) {
            data[i + 0] = "n".charCodeAt(0);
            data[i + 1] = "o".charCodeAt(0);
            data[i + 2] = "P".charCodeAt(0);
            data[i + 3] = "E".charCodeAt(0);
            //calculate new chunk checksum
            //http://www.libpng.org/pub/png/spec/1.2/PNG-CRCAppendix.html
            var end = i + 4 + length;
            var crc = 0xffffffff;
            //should be fast enough like this
            var bitcrc = function (bit) {
                for (var k = 0; k < 8; k++) {
                    if (bit & 1) {
                        bit = 0xedb88320 ^ (bit >>> 1);
                    }
                    else {
                        bit = bit >>> 1;
                    }
                }
                return bit;
            };
            for (var a = i; a < end; a++) {
                if (a >= i + 4) {
                    data[a] = 0;
                }
                var bit = data[a];
                crc = bitcrc((crc ^ bit) & 0xff) ^ (crc >>> 8);
            }
            crc = crc ^ 0xffffffff;
            //new chunk checksum
            data[i + 4 + length + 0] = (crc >> 24) & 0xff;
            data[i + 4 + length + 1] = (crc >> 16) & 0xff;
            data[i + 4 + length + 2] = (crc >> 8) & 0xff;
            data[i + 4 + length + 3] = (crc >> 0) & 0xff;
        }
        if (chunkname == "IEND") {
            break;
        }
        i += 4; //type
        i += length; //data
        i += 4; //crc
    }
}
exports.clearPngColorspace = clearPngColorspace;
/**
* finds the given needle ImageBuffer in the given haystack ImgRef this function uses the best optimized available
* code depending on the type of the haystack. It will use fast c# searching if the haystack is an ImgRefBind, js searching
* is used otherwise.
* the checklist argument is no longer used and should ignored or null/undefined
* The optional sx,sy,sw,sh arguments indicate a bounding rectangle in which to search the needle. The rectangle should be bigger than the needle
* @returns An array of points where the needle is found. The array is empty if none are found
*/
function findSubimage(haystackImgref, needleBuffer, sx = 0, sy = 0, sw = haystackImgref.width, sh = haystackImgref.height) {
    if (!haystackImgref) {
        throw new TypeError();
    }
    if (!needleBuffer) {
        throw new TypeError();
    }
    var max = 30;
    //check if we can do this in alt1
    if (haystackImgref instanceof imgref_1.ImgRefBind && wapper.hasAlt1 && alt1.bindFindSubImg) {
        var needlestr = wapper.encodeImageString(needleBuffer);
        var r = alt1.bindFindSubImg(haystackImgref.handle, needlestr, needleBuffer.width, sx, sy, sw, sh);
        if (!r) {
            throw new wapper.Alt1Error();
        }
        return JSON.parse(r);
    }
    return findSubbuffer(haystackImgref.read(), needleBuffer, sx, sy, sw, sh);
}
exports.findSubimage = findSubimage;
/**
* Uses js to find the given needle ImageBuffer in the given haystack ImageBuffer. It is better to use the alt1.bind- functions in
* combination with a1nxt.findsubimg.
* the optional sx,sy,sw,sh arguments indicate a bounding rectangle in which to search.
* @returns An array of points where the needle is found. The array is empty if none are found
*/
function findSubbuffer(haystack, needle, sx = 0, sy = 0, sw = haystack.width, sh = haystack.height) {
    var r = [];
    var maxdif = 30;
    var maxresults = 50;
    var needlestride = needle.width * 4;
    var heystackstride = haystack.width * 4;
    //built list of non trans pixel to check
    var checkList = [];
    for (var y = 0; y < needle.height; y++) {
        for (var x = 0; x < needle.width; x++) {
            var i = x * 4 + y * needlestride;
            if (needle.data[i + 3] == 255) {
                checkList.push({ x: x, y: y });
            }
            if (checkList.length == 10) {
                break;
            }
        }
        if (checkList.length == 10) {
            break;
        }
    }
    var cw = (sx + sw) - needle.width;
    var ch = (sy + sh) - needle.height;
    var checklength = checkList.length;
    for (var y = sy; y <= ch; y++) {
        outer: for (var x = sx; x <= cw; x++) {
            for (var a = 0; a < checklength; a++) {
                var i1 = (x + checkList[a].x) * 4 + (y + checkList[a].y) * heystackstride;
                var i2 = checkList[a].x * 4 + checkList[a].y * needlestride;
                var d = 0;
                d = d + Math.abs(haystack.data[i1 + 0] - needle.data[i2 + 0]) | 0;
                d = d + Math.abs(haystack.data[i1 + 1] - needle.data[i2 + 1]) | 0;
                d = d + Math.abs(haystack.data[i1 + 2] - needle.data[i2 + 2]) | 0;
                d *= 255 / needle.data[i2 + 3];
                if (d > maxdif) {
                    continue outer;
                }
            }
            if (simpleCompare(haystack, needle, x, y, maxdif) != Infinity) {
                r.push({ x, y });
                if (r.length > maxresults) {
                    return r;
                }
            }
        }
    }
    return r;
}
exports.findSubbuffer = findSubbuffer;
/**
* Compares two images and returns the average color difference per pixel between them
* @param max The max color difference at any point in the image before short circuiting the function and returning Infinity. set to -1 to always continue.
* @returns The average color difference per pixel or Infinity if the difference is more than max at any point in the image
*/
function simpleCompare(bigbuf, checkbuf, x, y, max = 30) {
    if (x < 0 || y < 0) {
        throw new RangeError();
    }
    if (x + checkbuf.width > bigbuf.width || y + checkbuf.height > bigbuf.height) {
        throw new RangeError();
    }
    if (max == -1) {
        max = 255 * 4;
    }
    var dif = 0;
    for (var step = 8; step >= 1; step /= 2) {
        for (var cx = 0; cx < checkbuf.width; cx += step) {
            for (var cy = 0; cy < checkbuf.height; cy += step) {
                var i1 = (x + cx) * 4 + (y + cy) * bigbuf.width * 4;
                var i2 = cx * 4 + cy * checkbuf.width * 4;
                var d = 0;
                d = d + Math.abs(bigbuf.data[i1 + 0] - checkbuf.data[i2 + 0]) | 0;
                d = d + Math.abs(bigbuf.data[i1 + 1] - checkbuf.data[i2 + 1]) | 0;
                d = d + Math.abs(bigbuf.data[i1 + 2] - checkbuf.data[i2 + 2]) | 0;
                d *= checkbuf.data[i2 + 3] / 255;
                if (step == 1) {
                    dif += d;
                }
                if (d > max) {
                    return Infinity;
                }
            }
        }
    }
    return dif / checkbuf.width / checkbuf.height;
}
exports.simpleCompare = simpleCompare;
/**
* Calculates the root mean square error between the two buffers at the given coordinate, this method can be used in situations with significant blur or
* transparency, it does not bail early on non-matching images like simpleCompare does so it can be expected to be much slower when called often.
* @returns The root mean square error beteen the images, high single pixel errors are penalized more than consisten low errors. return of 0 means perfect match.
*/
function simpleCompareRMSE(bigbuf, checkbuf, x, y) {
    if (x < 0 || y < 0) {
        throw new RangeError();
    }
    if (x + checkbuf.width > bigbuf.width || y + checkbuf.height > bigbuf.height) {
        throw new RangeError();
    }
    var dif = 0;
    var numpix = 0;
    for (var cx = 0; cx < checkbuf.width; cx++) {
        for (var cy = 0; cy < checkbuf.height; cy++) {
            var i1 = (x + cx) * 4 + (y + cy) * bigbuf.width * 4;
            var i2 = cx * 4 + cy * checkbuf.width * 4;
            var d = 0;
            d = d + Math.abs(bigbuf.data[i1 + 0] - checkbuf.data[i2 + 0]) | 0;
            d = d + Math.abs(bigbuf.data[i1 + 1] - checkbuf.data[i2 + 1]) | 0;
            d = d + Math.abs(bigbuf.data[i1 + 2] - checkbuf.data[i2 + 2]) | 0;
            var weight = checkbuf.data[i2 + 3] / 255;
            numpix += weight;
            dif += d * d * weight;
        }
    }
    return Math.sqrt(dif / numpix);
}
exports.simpleCompareRMSE = simpleCompareRMSE;
/**
* Returns the difference between two colors (scaled to the alpha of the second color)
*/
function coldif(r1, g1, b1, r2, g2, b2, a2) {
    return (Math.abs(r1 - r2) + Math.abs(g1 - g2) + Math.abs(b1 - b2)) * a2 / 255; //only applies alpha for 2nd buffer!
}
exports.coldif = coldif;
/**
 * Turns map of promises into a map that contains the resolved values after loading.
 * @param input
 */
function asyncMap(input) {
    var raw = {};
    var promises = [];
    for (var a in input) {
        if (input.hasOwnProperty(a)) {
            raw[a] = null;
            promises.push(input[a].then(function (a, i) { raw[a] = i; r[a] = i; }.bind(null, a)));
        }
    }
    var r = {};
    var promise = Promise.all(promises).then(() => { r.loaded = true; return r; });
    Object.defineProperty(r, "loaded", { enumerable: false, value: false, writable: true });
    Object.defineProperty(r, "promise", { enumerable: false, value: promise });
    Object.defineProperty(r, "raw", { enumerable: false, value: raw });
    return Object.assign(r, raw);
}
exports.asyncMap = asyncMap;
/**
* Same as asyncMap, but casts the properties to ImageData in typescript
*/
function webpackImages(input) {
    return asyncMap(input);
}
exports.webpackImages = webpackImages;
class ImageDataSet {
    constructor() {
        this.buffers = [];
    }
    matchBest(img, x, y, max) {
        let best = null;
        let bestscore = max;
        for (let a = 0; a < this.buffers.length; a++) {
            let score = img.pixelCompare(this.buffers[a], x, y, bestscore);
            if (isFinite(score) && (bestscore == undefined || score < bestscore)) {
                bestscore = score;
                best = a;
            }
        }
        if (best == null) {
            return null;
        }
        return { index: best, score: bestscore };
    }
    static fromFilmStrip(baseimg, width) {
        if ((baseimg.width % width) != 0) {
            throw new Error("slice size does not fit in base img");
        }
        let r = new ImageDataSet();
        for (let x = 0; x < baseimg.width; x += width) {
            r.buffers.push(baseimg.clone(new _1.Rect(x, 0, width, baseimg.height)));
        }
        return r;
    }
    static fromFilmStripUneven(baseimg, widths) {
        let r = new ImageDataSet();
        let x = 0;
        for (let w of widths) {
            r.buffers.push(baseimg.clone(new _1.Rect(x, 0, w, baseimg.height)));
            x += w;
            if (x > baseimg.width) {
                throw new Error("sampling filmstrip outside bounds");
            }
        }
        if (x != baseimg.width) {
            throw new Error("unconsumed pixels left in film strip imagedata");
        }
        return r;
    }
    static fromAtlas(baseimg, slices) {
        let r = new ImageDataSet();
        for (let slice of slices) {
            r.buffers.push(baseimg.clone(slice));
        }
        return r;
    }
}
exports.ImageDataSet = ImageDataSet;


/***/ }),

/***/ "./src/base/imgref.ts":
/*!****************************!*\
  !*** ./src/base/imgref.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ImgRefData = exports.ImgRefBind = exports.ImgRefCtx = exports.ImgRef = void 0;
const index_1 = __webpack_require__(/*! ./index */ "./src/base/index.ts");
/**
 * Represents an image that might be in different types of memory
 * This is mostly used to represent images still in Alt1 memory that have
 * not been transfered to js yet. Various a1lib api's use this type and
 * choose the most efficient approach based on the memory type
 */
class ImgRef {
    constructor(x, y, w, h) {
        this.t = "none";
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
    }
    read(x = 0, y = 0, w = this.width, h = this.height) {
        throw new Error("This imgref (" + this.t + ") does not support toData");
    }
    findSubimage(needle, sx = 0, sy = 0, w = this.width, h = this.height) {
        return index_1.ImageDetect.findSubimage(this, needle, sx, sy, w, h);
    }
    toData(x = this.x, y = this.y, w = this.width, h = this.height) {
        return this.read(x - this.x, y - this.y, w, h);
    }
    ;
    containsArea(rect) {
        return this.x <= rect.x && this.y <= rect.y && this.x + this.width >= rect.x + rect.width && this.y + this.height >= rect.y + rect.height;
    }
}
exports.ImgRef = ImgRef;
/**
 * Represents an image in js render memory (canvas/image tag)
 */
class ImgRefCtx extends ImgRef {
    constructor(img, x = 0, y = 0) {
        if (img instanceof CanvasRenderingContext2D) {
            super(x, y, img.canvas.width, img.canvas.height);
            this.ctx = img;
        }
        else {
            super(x, y, img.width, img.height);
            if (img instanceof HTMLCanvasElement) {
                this.ctx = img.getContext("2d", { willReadFrequently: true });
            }
            else {
                var cnv = document.createElement("canvas");
                cnv.width = img.width;
                cnv.height = img.height;
                this.ctx = cnv.getContext("2d", { willReadFrequently: true });
                this.ctx.drawImage(img, 0, 0);
            }
        }
        this.t = "ctx";
    }
    read(x = 0, y = 0, w = this.width, h = this.height) {
        return this.ctx.getImageData(x, y, w, h);
    }
}
exports.ImgRefCtx = ImgRefCtx;
/**
 * Represents in image in Alt1 memory, This type of image can be searched for subimages
 * very efficiently and transfering the full image to js can be avoided this way
 */
class ImgRefBind extends ImgRef {
    constructor(handle, x = 0, y = 0, w = 0, h = 0) {
        super(x, y, w, h);
        this.handle = handle;
        this.t = "bind";
    }
    read(x = 0, y = 0, w = this.width, h = this.height) {
        return (0, index_1.transferImageData)(this.handle, x, y, w, h);
    }
}
exports.ImgRefBind = ImgRefBind;
/**
 * Represents an image in js memory
 */
class ImgRefData extends ImgRef {
    constructor(buf, x = 0, y = 0) {
        super(x, y, buf.width, buf.height);
        this.buf = buf;
        this.t = "data";
    }
    read(x = 0, y = 0, w = this.width, h = this.height) {
        if (x == 0 && y == 0 && w == this.width && h == this.height) {
            return this.buf;
        }
        var r = new ImageData(w, h);
        for (var b = y; b < y + h; b++) {
            for (var a = x; a < x + w; a++) {
                var i1 = (a - x) * 4 + (b - y) * w * 4;
                var i2 = a * 4 + b * 4 * this.buf.width;
                r.data[i1] = this.buf.data[i2];
                r.data[i1 + 1] = this.buf.data[i2 + 1];
                r.data[i1 + 2] = this.buf.data[i2 + 2];
                r.data[i1 + 3] = this.buf.data[i2 + 3];
            }
        }
        return r;
    }
}
exports.ImgRefData = ImgRefData;


/***/ }),

/***/ "./src/base/index.ts":
/*!***************************!*\
  !*** ./src/base/index.ts ***!
  \***************************/
/***/ (function(__unused_webpack_module, exports, __nested_webpack_require_33868__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.imageDataFromUrl = exports.ImageDataSet = exports.findSubbuffer = exports.simpleCompare = exports.findSubimage = exports.webpackImages = exports.NodePolyfill = exports.ImageData = exports.Rect = exports.PasteInput = exports.ImageDetect = void 0;
__nested_webpack_require_33868__(/*! ./declarations */ "./src/base/declarations.ts");
exports.ImageDetect = __importStar(__nested_webpack_require_33868__(/*! ./imagedetect */ "./src/base/imagedetect.ts"));
exports.PasteInput = __importStar(__nested_webpack_require_33868__(/*! ./pasteinput */ "./src/base/pasteinput.ts"));
var rect_1 = __nested_webpack_require_33868__(/*! ./rect */ "./src/base/rect.ts");
Object.defineProperty(exports, "Rect", ({ enumerable: true, get: function () { return __importDefault(rect_1).default; } }));
var imagedata_extensions_1 = __nested_webpack_require_33868__(/*! ./imagedata-extensions */ "./src/base/imagedata-extensions.ts");
Object.defineProperty(exports, "ImageData", ({ enumerable: true, get: function () { return imagedata_extensions_1.ImageData; } }));
exports.NodePolyfill = __importStar(__nested_webpack_require_33868__(/*! ./nodepolyfill */ "./src/base/nodepolyfill.ts"));
__exportStar(__nested_webpack_require_33868__(/*! ./imgref */ "./src/base/imgref.ts"), exports);
__exportStar(__nested_webpack_require_33868__(/*! ./wrapper */ "./src/base/wrapper.ts"), exports);
var imagedetect_1 = __nested_webpack_require_33868__(/*! ./imagedetect */ "./src/base/imagedetect.ts");
Object.defineProperty(exports, "webpackImages", ({ enumerable: true, get: function () { return imagedetect_1.webpackImages; } }));
Object.defineProperty(exports, "findSubimage", ({ enumerable: true, get: function () { return imagedetect_1.findSubimage; } }));
Object.defineProperty(exports, "simpleCompare", ({ enumerable: true, get: function () { return imagedetect_1.simpleCompare; } }));
Object.defineProperty(exports, "findSubbuffer", ({ enumerable: true, get: function () { return imagedetect_1.findSubbuffer; } }));
Object.defineProperty(exports, "ImageDataSet", ({ enumerable: true, get: function () { return imagedetect_1.ImageDataSet; } }));
Object.defineProperty(exports, "imageDataFromUrl", ({ enumerable: true, get: function () { return imagedetect_1.imageDataFromUrl; } }));


/***/ }),

/***/ "./src/base/nodepolyfill.ts":
/*!**********************************!*\
  !*** ./src/base/nodepolyfill.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


//nodejs and electron polyfills for web api's
//commented out type info as that breaks webpack with optional dependencies
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.imageDataFromBuffer = exports.imageDataFromBase64 = exports.imageDataToFileBytes = exports.createCanvas = exports.imageDataToDrawable = exports.requireElectronCommon = exports.requireNodeCanvas = exports.requireSharp = exports.polyfillRequire = void 0;
const index_1 = __webpack_require__(/*! ./index */ "./src/base/index.ts");
const imagedetect_1 = __webpack_require__(/*! ./imagedetect */ "./src/base/imagedetect.ts");
var requirefunction = null;
/**
 * Call this function to let the libs require extra dependencies on nodejs in order
 * to polyfill some browser api's (mostly image compression/decompression)
 * `NodePolifill.polyfillRequire(require);` should solve most cases
 */
function polyfillRequire(requirefn) {
    requirefunction = requirefn;
}
exports.polyfillRequire = polyfillRequire;
function requireSharp() {
    try {
        if (requirefunction) {
            return requirefunction("sharp");
        }
        else {
            return __webpack_require__(/* webpackIgnore: true */ /*! sharp */ "sharp"); // as typeof import("sharp");
        }
    }
    catch (e) { }
    return null;
}
exports.requireSharp = requireSharp;
function requireNodeCanvas() {
    //attempt to require sharp first, after loading canvas the module sharp fails to load
    requireSharp();
    try {
        if (requirefunction) {
            return requirefunction("canvas");
        }
        else {
            return __webpack_require__(/* webpackIgnore: true */ /*! canvas */ "canvas"); // as typeof import("sharp");
        }
    }
    catch (e) { }
    return null;
}
exports.requireNodeCanvas = requireNodeCanvas;
function requireElectronCommon() {
    try {
        if (requirefunction) {
            return requirefunction("electron/common");
        }
        else {
            return __webpack_require__(/* webpackIgnore: true */ /*! electron/common */ "electron/common");
        }
    }
    catch (e) { }
    return null;
}
exports.requireElectronCommon = requireElectronCommon;
function imageDataToDrawable(buf) {
    let nodecnv = requireNodeCanvas();
    if (!nodecnv) {
        throw new Error("couldn't find built-in canvas or the module 'canvas'");
    }
    return new nodecnv.ImageData(buf.data, buf.width, buf.height);
}
exports.imageDataToDrawable = imageDataToDrawable;
function createCanvas(w, h) {
    let nodecnv = requireNodeCanvas();
    if (!nodecnv) {
        throw new Error("couldn't find built-in canvas or the module 'canvas'");
    }
    return nodecnv.createCanvas(w, h);
}
exports.createCanvas = createCanvas;
function flipBGRAtoRGBA(data) {
    for (let i = 0; i < data.length; i += 4) {
        let tmp = data[i + 2];
        data[i + 2] = data[i + 0];
        data[i + 0] = tmp;
    }
}
async function imageDataToFileBytes(buf, format, quality) {
    //use the electron API if we're in electron
    var electronCommon;
    var sharp;
    if (electronCommon = requireElectronCommon()) {
        let nativeImage = electronCommon.nativeImage;
        //need to copy the buffer in order to flip it without destroying the original
        let bufcpy = Buffer.from(buf.data.slice(buf.data.byteOffset, buf.data.byteLength));
        flipBGRAtoRGBA(bufcpy);
        let nativeimg = nativeImage.createFromBitmap(bufcpy, { width: buf.width, height: buf.height });
        return nativeimg.toPNG();
    }
    else if (sharp = requireSharp()) {
        let img = sharp(Buffer.from(buf.data.buffer), { raw: { width: buf.width, height: buf.height, channels: 4 } });
        if (format == "image/png") {
            img.png();
        }
        else if (format == "image/webp") {
            var opts = { quality: 80 };
            if (typeof quality == "number") {
                opts.quality = quality * 100;
            }
            img.webp(opts);
        }
        else {
            throw new Error("unknown image format: " + format);
        }
        return await img.toBuffer({ resolveWithObject: false }).buffer;
    }
    throw new Error("coulnd't find build-in image compression methods or the module 'electron/common' or 'sharp'");
}
exports.imageDataToFileBytes = imageDataToFileBytes;
function imageDataFromBase64(base64) {
    return imageDataFromBuffer(Buffer.from(base64, "base64"));
}
exports.imageDataFromBase64 = imageDataFromBase64;
async function imageDataFromBuffer(buffer) {
    (0, imagedetect_1.clearPngColorspace)(buffer);
    //use the electron API if we're in electron
    var electronCommon;
    var nodecnv;
    if (electronCommon = requireElectronCommon()) {
        let nativeImage = electronCommon.nativeImage;
        let img = nativeImage.createFromBuffer(buffer);
        let pixels = img.toBitmap();
        let size = img.getSize();
        let pixbuf = new Uint8ClampedArray(pixels.buffer, pixels.byteOffset, pixels.byteLength);
        flipBGRAtoRGBA(pixbuf);
        return new index_1.ImageData(pixbuf, size.width, size.height);
    }
    else if (nodecnv = requireNodeCanvas()) {
        return new Promise((done, err) => {
            let img = new nodecnv.Image();
            img.onerror = err;
            img.onload = () => {
                var cnv = nodecnv.createCanvas(img.naturalWidth, img.naturalHeight);
                var ctx = cnv.getContext("2d");
                ctx.drawImage(img, 0, 0);
                var data = ctx.getImageData(0, 0, img.naturalWidth, img.naturalHeight);
                //use our own class
                done(new index_1.ImageData(data.data, data.width, data.height));
            };
            img.src = Buffer.from(buffer.buffer, buffer.byteOffset, buffer.byteLength);
        });
    }
    throw new Error("couldn't find built-in canvas, module 'electron/common' or the module 'canvas'");
}
exports.imageDataFromBuffer = imageDataFromBuffer;


/***/ }),

/***/ "./src/base/pasteinput.ts":
/*!********************************!*\
  !*** ./src/base/pasteinput.ts ***!
  \********************************/
/***/ (function(__unused_webpack_module, exports, __nested_webpack_require_43872__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.fileDialog = exports.start = exports.startDragNDrop = exports.triggerPaste = exports.unlisten = exports.listen = exports.lastref = void 0;
const index_1 = __nested_webpack_require_43872__(/*! ./index */ "./src/base/index.ts");
const ImageDetect = __importStar(__nested_webpack_require_43872__(/*! ./imagedetect */ "./src/base/imagedetect.ts"));
var listeners = [];
var started = false;
var dndStarted = false;
var pasting = false;
exports.lastref = null;
function listen(func, errorfunc, dragndrop) {
    listeners.push({ cb: func, error: errorfunc });
    if (!started) {
        start();
    }
    if (dragndrop && !dndStarted) {
        startDragNDrop();
    }
}
exports.listen = listen;
function unlisten(func) {
    let i = listeners.findIndex(c => c.cb == func);
    if (i != -1) {
        listeners.splice(i, 1);
    }
}
exports.unlisten = unlisten;
/**
 * currently used in multiple document situations (iframe), might be removed in the future
 */
function triggerPaste(img) {
    exports.lastref = img;
    for (var a in listeners) {
        listeners[a].cb(exports.lastref);
    }
}
exports.triggerPaste = triggerPaste;
function pasted(img) {
    pasting = false;
    triggerPaste(new index_1.ImgRefCtx(img));
}
function error(error, mes) {
    var _a, _b;
    pasting = false;
    for (var a in listeners) {
        (_b = (_a = listeners[a]).error) === null || _b === void 0 ? void 0 : _b.call(_a, mes, error);
    }
}
function startDragNDrop() {
    var getitem = function (items) {
        var foundimage = "";
        for (var a = 0; a < items.length; a++) {
            var item = items[a];
            var m = item.type.match(/^image\/(\w+)$/);
            if (m) {
                if (m[1] == "png") {
                    return item;
                }
                else {
                    foundimage = m[1];
                }
            }
        }
        if (foundimage) {
            error("notpng", "The image you uploaded is not a .png image. Other image type have compression noise and can't be used for image detection.");
        }
        return null;
    };
    window.addEventListener("dragover", function (e) {
        e.preventDefault();
    });
    window.addEventListener("drop", function (e) {
        if (!e.dataTransfer) {
            return;
        }
        var item = getitem(e.dataTransfer.items);
        e.preventDefault();
        if (!item) {
            return;
        }
        fromFile(item.getAsFile());
    });
}
exports.startDragNDrop = startDragNDrop;
function start() {
    if (started) {
        return;
    }
    started = true;
    //determine if we have a clipboard api
    //try{a=new Event("clipboard"); a="clipboardData" in a;}
    //catch(e){a=false;}
    var ischrome = !!navigator.userAgent.match(/Chrome/) && !navigator.userAgent.match(/Edge/);
    //old method breaks after chrome 41, revert to good old user agent sniffing
    //nvm, internet explorer (edge) decided that it wants to be chrome, however fails at delivering
    //turns out this one is interesting, edge is a hybrid between the paste api's
    var apipasted = function (e) {
        if (!e.clipboardData) {
            return;
        }
        for (var a = 0; a < e.clipboardData.items.length; a++) { //loop all data types
            if (e.clipboardData.items[a].type.indexOf("image") != -1) {
                var file = e.clipboardData.items[a].getAsFile();
                if (file) {
                    var img = new Image();
                    img.src = (window.URL || window.webkitURL).createObjectURL(file);
                    if (img.width > 0) {
                        pasted(img);
                    }
                    else {
                        img.onload = function () { pasted(img); };
                    }
                }
            }
        }
    };
    if (ischrome) {
        document.addEventListener("paste", apipasted);
    }
    else {
        var catcher = document.createElement("div");
        catcher.setAttribute("contenteditable", "");
        catcher.className = "forcehidden"; //retarded ie safety/bug, cant apply styles using js//TODO i don't even know what's going on
        catcher.onpaste = function (e) {
            if (e.clipboardData && e.clipboardData.items) {
                apipasted(e);
                return;
            }
            setTimeout(function () {
                var b = catcher.children[0];
                if (!b || b.tagName != "IMG") {
                    return;
                }
                var img = new Image();
                img.src = b.src;
                var a = img.src.match(/^data:([\w\/]+);/);
                if (img.width > 0) {
                    pasted(img);
                }
                else {
                    img.onload = function () { pasted(img); };
                }
                catcher.innerHTML = "";
            }, 1);
        };
        document.body.appendChild(catcher);
    }
    //detect if ctrl-v is pressed and focus catcher if needed
    document.addEventListener("keydown", function (e) {
        if (e.target.tagName == "INPUT") {
            return;
        }
        if (e.keyCode != "V".charCodeAt(0) || !e.ctrlKey) {
            return;
        }
        pasting = true;
        setTimeout(function () {
            if (pasting) {
                error("noimg", "You pressed Ctrl+V, but no image was pasted by your browser, make sure your clipboard contains an image, and not a link to an image.");
            }
        }, 1000);
        if (catcher) {
            catcher.focus();
        }
    });
}
exports.start = start;
function fileDialog() {
    var fileinput = document.createElement("input");
    fileinput.type = "file";
    fileinput.accept = "image/png";
    fileinput.onchange = function () { if (fileinput.files && fileinput.files[0]) {
        fromFile(fileinput.files[0]);
    } };
    fileinput.click();
    return fileinput;
}
exports.fileDialog = fileDialog;
function fromFile(file) {
    if (!file) {
        return;
    }
    var reader = new FileReader();
    reader.onload = function () {
        var bytearray = new Uint8Array(reader.result);
        if (ImageDetect.isPngBuffer(bytearray)) {
            ImageDetect.clearPngColorspace(bytearray);
        }
        var blob = new Blob([bytearray], { type: "image/png" });
        var img = new Image();
        var bloburl = URL.createObjectURL(blob);
        img.onerror = () => {
            URL.revokeObjectURL(bloburl);
            error("invalidfile", "The file you uploaded could not be opened as an image.");
        };
        img.src = bloburl;
        if (img.width > 0) {
            pasted(img);
            URL.revokeObjectURL(bloburl);
        }
        else {
            img.onload = function () {
                pasted(img);
                URL.revokeObjectURL(bloburl);
            };
        }
    };
    reader.readAsArrayBuffer(file);
}


/***/ }),

/***/ "./src/base/rect.ts":
/*!**************************!*\
  !*** ./src/base/rect.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, exports) => {


//util class for rectangle maths
//TODO shit this sucks can we remove it again?
//more of a shorthand to get {x,y,width,height} than a class
//kinda starting to like it again
//TODO remove rant
Object.defineProperty(exports, "__esModule", ({ value: true }));
;
/**
 * Simple rectangle class with some util functions
 */
class Rect {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
    }
    static fromArgs(...args) {
        if (typeof args[0] == "object") {
            return new Rect(args[0].x, args[0].y, args[0].width, args[0].height);
        }
        else if (typeof args[0] == "number" && args.length >= 4) {
            return new Rect(args[0], args[1], args[2], args[3]);
        }
        else {
            throw new Error("invalid rect args");
        }
    }
    /**
     * Resizes this Rect to include the full size of a given second rectangle
     */
    union(r2) {
        var x = Math.min(this.x, r2.x);
        var y = Math.min(this.y, r2.y);
        this.width = Math.max(this.x + this.width, r2.x + r2.width) - x;
        this.height = Math.max(this.y + this.height, r2.y + r2.height) - y;
        this.x = x;
        this.y = y;
        return this;
    }
    /**
     * Resizes this Rect to include a given point
     */
    includePoint(x, y) {
        this.union(new Rect(x, y, 0, 0));
    }
    /**
     * Grows the rectangle with the given dimensions
     */
    inflate(w, h) {
        this.x -= w;
        this.y -= h;
        this.width += 2 * w;
        this.height += 2 * h;
    }
    /**
     * Resizes this Rect to the area that overlaps a given Rect
     * width and height will be set to 0 if the intersection does not exist
     */
    intersect(r2) {
        if (this.x < r2.x) {
            this.width -= r2.x - this.x;
            this.x = r2.x;
        }
        if (this.y < r2.y) {
            this.height -= r2.y - this.y;
            this.y = r2.y;
        }
        this.width = Math.min(this.x + this.width, r2.x + r2.width) - this.x;
        this.height = Math.min(this.y + this.height, r2.y + r2.height) - this.y;
        if (this.width <= 0 || this.height <= 0) {
            this.width = 0;
            this.height = 0;
        }
    }
    /**
     * Returns wether this Rect has at least one pixel overlap with a given Rect
     */
    overlaps(r2) {
        return this.x < r2.x + r2.width && this.x + this.width > r2.x && this.y < r2.y + r2.height && this.y + this.height > r2.y;
    }
    /**
     * Returns wether a given Rect fits completely inside this Rect
     * @param r2
     */
    contains(r2) {
        return this.x <= r2.x && this.x + this.width >= r2.x + r2.width && this.y <= r2.y && this.y + this.height >= r2.y + r2.height;
    }
    /**
     * Returns wether a given point lies inside this Rect
     */
    containsPoint(x, y) {
        return this.x <= x && this.x + this.width > x && this.y <= y && this.y + this.height > y;
    }
}
exports["default"] = Rect;


/***/ }),

/***/ "./src/base/wrapper.ts":
/*!*****************************!*\
  !*** ./src/base/wrapper.ts ***!
  \*****************************/
/***/ (function(__unused_webpack_module, exports, __nested_webpack_require_55275__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.captureStream = exports.captureMultiAsync = exports.captureAsync = exports.ImageStreamReader = exports.once = exports.removeListener = exports.on = exports.addResizeElement = exports.getMousePosition = exports.hasAlt1Version = exports.resetEnvironment = exports.identifyApp = exports.unmixColor = exports.mixColor = exports.encodeImageString = exports.decodeImageString = exports.transferImageData = exports.captureHoldFullRs = exports.captureHoldScreen = exports.captureHold = exports.capture = exports.getdisplaybounds = exports.requireAlt1 = exports.openbrowser = exports.skinName = exports.hasAlt1 = exports.newestversion = exports.Alt1Error = exports.NoAlt1Error = void 0;
const rect_1 = __importDefault(__nested_webpack_require_55275__(/*! ./rect */ "./src/base/rect.ts"));
const imgref_1 = __nested_webpack_require_55275__(/*! ./imgref */ "./src/base/imgref.ts");
const imagedata_extensions_1 = __nested_webpack_require_55275__(/*! ./imagedata-extensions */ "./src/base/imagedata-extensions.ts");
__nested_webpack_require_55275__(/*! ./alt1api */ "./src/base/alt1api.ts");
/**
 * Thrown when a method is called that can not be used outside of Alt1
 */
class NoAlt1Error extends Error {
    constructor() {
        super();
        this.message = "This method can not be ran outside of Alt1";
    }
}
exports.NoAlt1Error = NoAlt1Error;
;
/**
 * Thrown when the Alt1 API returns an invalid result
 * Errors of a different type are throw when internal Alt1 errors occur
 */
class Alt1Error extends Error {
}
exports.Alt1Error = Alt1Error;
/**
 * The latest Alt1 version
 */
exports.newestversion = "1.5.5";
/**
 * Whether the Alt1 API is available
 */
exports.hasAlt1 = (typeof alt1 != "undefined");
/**
 * The name of the Alt1 interface skin. (Always "default" if running in a browser)
 */
exports.skinName = exports.hasAlt1 ? alt1.skinName : "default";
/**
 * Max number of bytes that can be sent by alt1 in one function
 * Not completely sure why this number is different than window.alt1.maxtranfer
 */
var maxtransfer = 4000000;
/**
 * Open a link in the default browser
 * @deprecated use window.open instead
 */
function openbrowser(url) {
    if (exports.hasAlt1) {
        alt1.openBrowser(url);
    }
    else {
        window.open(url, '_blank');
    }
}
exports.openbrowser = openbrowser;
/**
 * Throw if Alt1 API is not available
 */
function requireAlt1() {
    if (!exports.hasAlt1) {
        throw new NoAlt1Error();
    }
}
exports.requireAlt1 = requireAlt1;
/**
 * Returns an object with a rectangle that spans all screens
 */
function getdisplaybounds() {
    if (!exports.hasAlt1) {
        return false;
    }
    return new rect_1.default(alt1.screenX, alt1.screenY, alt1.screenWidth, alt1.screenHeight);
}
exports.getdisplaybounds = getdisplaybounds;
/**
 * gets an imagebuffer with pixel data about the requested region
 */
function capture(...args) {
    //TODO change null return on error into throw instead (x3)
    if (!exports.hasAlt1) {
        throw new NoAlt1Error();
    }
    var rect = rect_1.default.fromArgs(...args);
    if (alt1.capture) {
        return new imagedata_extensions_1.ImageData(alt1.capture(rect.x, rect.y, rect.width, rect.height), rect.width, rect.height);
    }
    var buf = new imagedata_extensions_1.ImageData(rect.width, rect.height);
    if (rect.width * rect.height * 4 <= maxtransfer) {
        var data = alt1.getRegion(rect.x, rect.y, rect.width, rect.height);
        if (!data) {
            return null;
        }
        decodeImageString(data, buf, 0, 0, rect.width, rect.height);
    }
    else {
        //split up the request to to exceed the single transfer limit (for now)
        var x1 = rect.x;
        var ref = alt1.bindRegion(rect.x, rect.y, rect.width, rect.height);
        if (ref <= 0) {
            return null;
        }
        while (x1 < rect.x + rect.width) {
            var x2 = Math.min(rect.x + rect.width, Math.floor(x1 + (maxtransfer / 4 / rect.height)));
            var data = alt1.bindGetRegion(ref, x1, rect.y, x2 - x1, rect.height);
            if (!data) {
                return null;
            }
            decodeImageString(data, buf, x1 - rect.x, 0, x2 - x1, rect.height);
            x1 = x2;
        }
    }
    return buf;
}
exports.capture = capture;
/**
 * Makes alt1 bind an area of the rs client in memory without sending it to the js client
 * returns an imgref object which can be used to get pixel data using the imgreftobuf function
 * currently only one bind can exist per app and the ref in (v) will always be 1
 */
function captureHold(x, y, w, h) {
    x = Math.round(x);
    y = Math.round(y);
    w = Math.round(w);
    h = Math.round(h);
    requireAlt1();
    var r = alt1.bindRegion(x, y, w, h);
    if (r <= 0) {
        throw new Alt1Error("capturehold failed");
    }
    return new imgref_1.ImgRefBind(r, x, y, w, h);
}
exports.captureHold = captureHold;
/**
 * Same as captureHoldRegion, but captures the screen instead of the rs client. it also uses screen coordinates instead and can capture outside of the rs client
 */
function captureHoldScreen(x, y, w, h) {
    x = Math.round(x);
    y = Math.round(y);
    w = Math.round(w);
    h = Math.round(h);
    requireAlt1();
    var r = alt1.bindScreenRegion(x, y, w, h);
    if (r <= 0) {
        return false;
    }
    return new imgref_1.ImgRefBind(r, x, y, w, h);
}
exports.captureHoldScreen = captureHoldScreen;
/**
 * bind the full rs window
 */
function captureHoldFullRs() {
    return captureHold(0, 0, alt1.rsWidth, alt1.rsHeight);
}
exports.captureHoldFullRs = captureHoldFullRs;
/**
 * returns a subregion from a bound image
 * used internally in imgreftobuf if imgref is a bound image
 * @deprecated This should be handled internall by the imgrefbind.toData method
 */
function transferImageData(handle, x, y, w, h) {
    x = Math.round(x);
    y = Math.round(y);
    w = Math.round(w);
    h = Math.round(h);
    requireAlt1();
    if (alt1.bindGetRegionBuffer) {
        return new imagedata_extensions_1.ImageData(alt1.bindGetRegionBuffer(handle, x, y, w, h), w, h);
    }
    var r = new imagedata_extensions_1.ImageData(w, h);
    var x1 = x;
    while (true) { //split up the request to to exceed the single transfer limit (for now)
        var x2 = Math.min(x + w, Math.floor(x1 + (maxtransfer / 4 / h)));
        var a = alt1.bindGetRegion(handle, x1, y, x2 - x1, h);
        if (!a) {
            throw new Alt1Error();
        }
        decodeImageString(a, r, x1 - x, 0, x2 - x1, h);
        x1 = x2;
        if (x1 == x + w) {
            break;
        }
        ;
    }
    return r;
}
exports.transferImageData = transferImageData;
/**
 * decodes a returned string from alt1 to an imagebuffer. You generally never have to do this yourself
 */
function decodeImageString(imagestring, target, x, y, w, h) {
    var bin = atob(imagestring);
    var bytes = target.data;
    w |= 0;
    h |= 0;
    var offset = 4 * x + 4 * y * target.width;
    var target_width = target.width | 0;
    for (var a = 0; a < w; a++) {
        for (var b = 0; b < h; b++) {
            var i1 = (offset + (a * 4 | 0) + (b * target_width * 4 | 0)) | 0;
            var i2 = ((a * 4 | 0) + (b * 4 * w | 0)) | 0;
            bytes[i1 + 0 | 0] = bin.charCodeAt(i2 + 2 | 0); //fix weird red/blue swap in c#
            bytes[i1 + 1 | 0] = bin.charCodeAt(i2 + 1 | 0);
            bytes[i1 + 2 | 0] = bin.charCodeAt(i2 + 0 | 0);
            bytes[i1 + 3 | 0] = bin.charCodeAt(i2 + 3 | 0);
        }
    }
    return target;
}
exports.decodeImageString = decodeImageString;
/**
 * encodes an imagebuffer to a string
 */
function encodeImageString(buf, sx = 0, sy = 0, sw = buf.width, sh = buf.height) {
    var raw = "";
    for (var y = sy; y < sy + sh; y++) {
        for (var x = sx; x < sx + sw; x++) {
            var i = 4 * x + 4 * buf.width * y | 0;
            raw += String.fromCharCode(buf.data[i + 2 | 0]);
            raw += String.fromCharCode(buf.data[i + 1 | 0]);
            raw += String.fromCharCode(buf.data[i + 0 | 0]);
            raw += String.fromCharCode(buf.data[i + 3 | 0]);
        }
    }
    return btoa(raw);
}
exports.encodeImageString = encodeImageString;
/**
 * mixes the given color into a single int. This format is used by alt1
 */
function mixColor(r, g, b, a = 255) {
    return (b << 0) + (g << 8) + (r << 16) + (a << 24);
}
exports.mixColor = mixColor;
function unmixColor(col) {
    var r = (col >> 16) & 0xff;
    var g = (col >> 8) & 0xff;
    var b = (col >> 0) & 0xff;
    return [r, g, b];
}
exports.unmixColor = unmixColor;
function identifyApp(url) {
    if (exports.hasAlt1) {
        alt1.identifyAppUrl(url);
    }
}
exports.identifyApp = identifyApp;
function resetEnvironment() {
    exports.hasAlt1 = (typeof alt1 != "undefined");
    exports.skinName = exports.hasAlt1 ? alt1.skinName : "default";
}
exports.resetEnvironment = resetEnvironment;
function convertAlt1Version(str) {
    var a = str.match(/^(\d+)\.(\d+)\.(\d+)$/);
    if (!a) {
        throw new RangeError("Invalid version string");
    }
    return (+a[1]) * 1000 * 1000 + (+a[2]) * 1000 + (+a[3]) * 1;
}
var cachedVersionInt = -1;
/**
 * checks if alt1 is running and at least the given version. versionstr should be a string with the version eg: 1.3.2
 * @param versionstr
 */
function hasAlt1Version(versionstr) {
    if (!exports.hasAlt1) {
        return false;
    }
    if (cachedVersionInt == -1) {
        cachedVersionInt = alt1.versionint;
    }
    return cachedVersionInt >= convertAlt1Version(versionstr);
}
exports.hasAlt1Version = hasAlt1Version;
/**
 * Gets the current cursor position in the game, returns null if the rs window is not active (alt1.rsActive)
 */
function getMousePosition() {
    var pos = alt1.mousePosition;
    if (pos == -1) {
        return null;
    }
    return { x: pos >>> 16, y: pos & 0xFFFF };
}
exports.getMousePosition = getMousePosition;
/**
 * Registers a given HTML element as a frame border, when this element is dragged by the user the Alt1 frame will resize accordingly
 * Use the direction arguements to make a given direction stick to the mouse. eg. Only set left to true to make the element behave as the left border
 * Or set all to true to move the whole window. Not all combinations are permitted
 */
function addResizeElement(el, left, top, right, bot) {
    if (!exports.hasAlt1 || !alt1.userResize) {
        return;
    }
    el.addEventListener("mousedown", function (e) {
        alt1.userResize(left, top, right, bot);
        e.preventDefault();
    });
}
exports.addResizeElement = addResizeElement;
/**
 * Add an event listener
 */
function on(type, listener) {
    if (!exports.hasAlt1) {
        return;
    }
    if (!alt1.events) {
        alt1.events = {};
    }
    if (!alt1.events[type]) {
        alt1.events[type] = [];
    }
    alt1.events[type].push(listener);
}
exports.on = on;
/**
 * Removes an event listener
 */
function removeListener(type, listener) {
    var elist = exports.hasAlt1 && alt1.events && alt1.events[type];
    if (!elist) {
        return;
    }
    var i = elist.indexOf(listener);
    if (i == -1) {
        return;
    }
    elist.splice(i, 1);
}
exports.removeListener = removeListener;
/**
 * Listens for the event to fire once and then stops listening
 * @param event
 * @param cb
 */
function once(type, listener) {
    var fn = (e) => {
        removeListener(type, fn);
        listener(e);
    };
    on(type, fn);
}
exports.once = once;
;
/**
 * Used to read a set of images from a binary stream returned by the Alt1 API
 */
class ImageStreamReader {
    constructor(reader, ...args) {
        this.framebuffer = null;
        this.pos = 0;
        this.reading = false;
        this.closed = false;
        //paused state
        this.pausedindex = -1;
        this.pausedbuffer = null;
        this.streamreader = reader;
        if (args[0] instanceof imagedata_extensions_1.ImageData) {
            this.setFrameBuffer(args[0]);
        }
        else if (typeof args[0] == "number") {
            this.setFrameBuffer(new imagedata_extensions_1.ImageData(args[0], args[1]));
        }
    }
    /**
     *
     */
    setFrameBuffer(buffer) {
        if (this.reading) {
            throw new Error("can't change framebuffer while reading");
        }
        this.framebuffer = buffer;
    }
    /**
     * Closes the underlying stream and ends reading
     */
    close() {
        this.streamreader.cancel();
    }
    /**
     * Reads a single image from the stream
     */
    async nextImage() {
        if (this.reading) {
            throw new Error("already reading from this stream");
        }
        if (!this.framebuffer) {
            throw new Error("framebuffer not set");
        }
        this.reading = true;
        var synctime = -Date.now();
        var starttime = Date.now();
        var r = false;
        while (!r) {
            if (this.pausedindex != -1 && this.pausedbuffer) {
                r = this.readChunk(this.pausedindex, this.framebuffer.data, this.pausedbuffer);
            }
            else {
                synctime += Date.now();
                var res = await this.streamreader.read();
                synctime -= Date.now();
                if (res.done) {
                    throw new Error("Stream closed while reading");
                }
                var data = res.value;
                r = this.readChunk(0, this.framebuffer.data, data);
            }
        }
        synctime += Date.now();
        //console.log("Decoded async image, " + this.framebuffer.width + "x" + this.framebuffer.height + " time: " + (Date.now() - starttime) + "ms (" + synctime + "ms main thread)");
        this.reading = false;
        return this.framebuffer;
    }
    readChunk(i, framedata, buffer) {
        //very hot code, explicit int32 casting with |0 speeds it up by ~ x2
        i = i | 0;
        var framesize = framedata.length | 0;
        var pos = this.pos;
        var datalen = buffer.length | 0;
        //var data32 = new Float64Array(buffer.buffer);
        //var framedata32 = new Float64Array(framedata.buffer);
        //fix possible buffer misalignment
        //align to 16 for extra loop unrolling
        while (i < datalen) {
            //slow loop, fix alignment and other issues
            while (i < datalen && pos < framesize && (pos % 16 != 0 || !((i + 16 | 0) <= datalen && (pos + 16 | 0) <= framesize))) {
                var rel = pos;
                if (pos % 4 == 0) {
                    rel = rel + 2 | 0;
                }
                if (pos % 4 == 2) {
                    rel = rel - 2 | 0;
                }
                framedata[rel | 0] = buffer[i | 0];
                i = i + 1 | 0;
                pos = pos + 1 | 0;
            }
            //fast unrolled loop for large chunks i wish js had some sort of memcpy
            if (pos % 16 == 0) {
                while ((i + 16 | 0) <= datalen && (pos + 16 | 0) <= framesize) {
                    framedata[pos + 0 | 0] = buffer[i + 2 | 0];
                    framedata[pos + 1 | 0] = buffer[i + 1 | 0];
                    framedata[pos + 2 | 0] = buffer[i + 0 | 0];
                    framedata[pos + 3 | 0] = buffer[i + 3 | 0];
                    framedata[pos + 4 | 0] = buffer[i + 6 | 0];
                    framedata[pos + 5 | 0] = buffer[i + 5 | 0];
                    framedata[pos + 6 | 0] = buffer[i + 4 | 0];
                    framedata[pos + 7 | 0] = buffer[i + 7 | 0];
                    framedata[pos + 8 | 0] = buffer[i + 10 | 0];
                    framedata[pos + 9 | 0] = buffer[i + 9 | 0];
                    framedata[pos + 10 | 0] = buffer[i + 8 | 0];
                    framedata[pos + 11 | 0] = buffer[i + 11 | 0];
                    framedata[pos + 12 | 0] = buffer[i + 14 | 0];
                    framedata[pos + 13 | 0] = buffer[i + 13 | 0];
                    framedata[pos + 14 | 0] = buffer[i + 12 | 0];
                    framedata[pos + 15 | 0] = buffer[i + 15 | 0];
                    //could speed it up another x2 but wouldn't be able to swap r/b swap and possible alignment issues
                    //framedata32[pos / 8 + 0 | 0] = data32[i / 8 + 0 | 0];
                    //framedata32[pos / 8 + 1 | 0] = data32[i / 8 + 1 | 0];
                    //framedata32[pos / 4 + 2 | 0] = data32[i / 4 + 2 | 0];
                    //framedata32[pos / 4 + 3 | 0] = data32[i / 4 + 3 | 0];
                    pos = pos + 16 | 0;
                    i = i + 16 | 0;
                }
            }
            if (pos >= framesize) {
                this.pausedbuffer = null;
                this.pausedindex = -1;
                this.pos = 0;
                if (i != buffer.length - 1) {
                    this.pausedbuffer = buffer;
                    this.pausedindex = i;
                }
                return true;
            }
        }
        this.pos = pos;
        this.pausedbuffer = null;
        this.pausedindex = -1;
        return false;
    }
}
exports.ImageStreamReader = ImageStreamReader;
/**
 * Asynchronously captures a section of the game screen
 */
async function captureAsync(...args) {
    requireAlt1();
    var rect = rect_1.default.fromArgs(...args);
    if (alt1.captureAsync) {
        let img = await alt1.captureAsync(rect.x, rect.y, rect.width, rect.height);
        return new imagedata_extensions_1.ImageData(img, rect.width, rect.height);
    }
    if (!hasAlt1Version("1.4.6")) {
        return capture(rect.x, rect.y, rect.width, rect.height);
    }
    var url = "https://alt1api/pixel/getregion/" + encodeURIComponent(JSON.stringify(Object.assign(Object.assign({}, rect), { format: "raw", quality: 1 })));
    var res = await fetch(url);
    var imgreader = new ImageStreamReader(res.body.getReader(), rect.width, rect.height);
    return imgreader.nextImage();
}
exports.captureAsync = captureAsync;
/**
 * Asynchronously captures multple area's. This method captures the images in the same render frame if possible
 * @param areas
 */
async function captureMultiAsync(areas) {
    requireAlt1();
    var r = {};
    if (alt1.captureMultiAsync) {
        let bufs = await alt1.captureMultiAsync(areas);
        for (let a in areas) {
            if (!bufs[a]) {
                r[a] = null;
            }
            r[a] = new imagedata_extensions_1.ImageData(bufs[a], areas[a].width, areas[a].height);
        }
        return r;
    }
    var capts = [];
    var captids = [];
    for (var id in areas) {
        if (areas[id]) {
            capts.push(areas[id]);
            captids.push(id);
        }
        else {
            r[id] = null;
        }
    }
    if (capts.length == 0) {
        return r;
    }
    if (!hasAlt1Version("1.5.1")) {
        var proms = [];
        for (var a = 0; a < capts.length; a++) {
            proms.push(captureAsync(capts[a]));
        }
        var results = await Promise.all(proms);
        for (var a = 0; a < capts.length; a++) {
            r[captids[a]] = results[a];
        }
    }
    else {
        var res = await fetch("https://alt1api/pixel/getregionmulti/" + encodeURIComponent(JSON.stringify({ areas: capts, format: "raw", quality: 1 })));
        var imgreader = new ImageStreamReader(res.body.getReader());
        for (var a = 0; a < capts.length; a++) {
            var capt = capts[a];
            imgreader.setFrameBuffer(new imagedata_extensions_1.ImageData(capt.width, capt.height));
            r[captids[a]] = await imgreader.nextImage();
        }
    }
    return r;
}
exports.captureMultiAsync = captureMultiAsync;
/**
 * Starts capturing a realtime stream of the game. Make sure you keep reading the stream and close it when you're done or Alt1 WILL crash
 * @param framecb Called whenever a new frame is decoded
 * @param errorcb Called whenever an error occurs, the error is rethrown if not defined
 * @param fps Maximum fps of the stream
 */
function captureStream(x, y, width, height, fps, framecb, errorcb) {
    requireAlt1();
    if (!hasAlt1Version("1.4.6")) {
        throw new Alt1Error("This function is not supported in this version of Alt1");
    }
    var url = "https://alt1api/pixel/streamregion/" + encodeURIComponent(JSON.stringify({ x, y, width, height, fps, format: "raw" }));
    var res = fetch(url).then(async (res) => {
        var reader = new ImageStreamReader(res.body.getReader(), width, height);
        try {
            while (!reader.closed && !state.closed) {
                var img = await reader.nextImage();
                if (!state.closed) {
                    framecb(img);
                    state.framenr++;
                }
            }
        }
        catch (e) {
            if (!state.closed) {
                reader.close();
                if (errorcb) {
                    errorcb(e);
                }
                else {
                    throw e;
                }
            }
        }
        if (!reader.closed && state.closed) {
            reader.close();
        }
    });
    var state = {
        x, y, width, height,
        framenr: 0,
        close: () => { state.closed = true; },
        closed: false,
    };
    return state;
}
exports.captureStream = captureStream;


/***/ }),

/***/ "canvas":
/*!*************************!*\
  !*** external "canvas" ***!
  \*************************/
/***/ ((module) => {

if(typeof __WEBPACK_EXTERNAL_MODULE_canvas__ === 'undefined') { var e = new Error("Cannot find module 'canvas'"); e.code = 'MODULE_NOT_FOUND'; throw e; }

module.exports = __WEBPACK_EXTERNAL_MODULE_canvas__;

/***/ }),

/***/ "electron/common":
/*!**********************************!*\
  !*** external "electron/common" ***!
  \**********************************/
/***/ ((module) => {

if(typeof __WEBPACK_EXTERNAL_MODULE_electron_common__ === 'undefined') { var e = new Error("Cannot find module 'electron/common'"); e.code = 'MODULE_NOT_FOUND'; throw e; }

module.exports = __WEBPACK_EXTERNAL_MODULE_electron_common__;

/***/ }),

/***/ "sharp":
/*!************************!*\
  !*** external "sharp" ***!
  \************************/
/***/ ((module) => {

if(typeof __WEBPACK_EXTERNAL_MODULE_sharp__ === 'undefined') { var e = new Error("Cannot find module 'sharp'"); e.code = 'MODULE_NOT_FOUND'; throw e; }

module.exports = __WEBPACK_EXTERNAL_MODULE_sharp__;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nested_webpack_require_78005__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __nested_webpack_require_78005__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__nested_webpack_require_78005__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __nested_webpack_exports__ = __nested_webpack_require_78005__("./src/base/index.ts");
/******/ 	
/******/ 	return __nested_webpack_exports__;
/******/ })()
;
});

/***/ },

/***/ "../node_modules/alt1/dist/buffs/index.js"
/*!************************************************!*\
  !*** ../node_modules/alt1/dist/buffs/index.js ***!
  \************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

(function webpackUniversalModuleDefinition(root, factory) {
	if(true)
		module.exports = factory(__webpack_require__(/*! alt1/base */ "../node_modules/alt1/dist/base/index.js"), __webpack_require__(/*! alt1/ocr */ "../node_modules/alt1/dist/ocr/index.js"));
	else // removed by dead control flow
{}
})(globalThis, (__WEBPACK_EXTERNAL_MODULE_alt1_base__, __WEBPACK_EXTERNAL_MODULE_alt1_ocr__) => {
return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/buffs/imgs/buffborder.data.png":
/*!********************************************!*\
  !*** ./src/buffs/imgs/buffborder.data.png ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports=(__webpack_require__(/*! alt1/base */ "alt1/base").ImageDetect.imageDataFromBase64)("iVBORw0KGgoAAAANSUhEUgAAABsAAAAbCAYAAACN1PRVAAAAAW5vUEUAYtdMlAAAAARub1BFAAAAAEEgjiIAAAAJbm9QRQAAAAAAAAAAAKGKctUAAABCSURBVEhL7daxDQAgDANBwxasxmCsS4jECE8K5JdcX+s219iqKrGTXi+dfs2SjCEZQzKGZAzJGJIxJGNI/2KFj1gK6ntTCO2Nfp8AAAAASUVORK5CYII=")

/***/ }),

/***/ "./src/buffs/imgs/debuffborder.data.png":
/*!**********************************************!*\
  !*** ./src/buffs/imgs/debuffborder.data.png ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports=(__webpack_require__(/*! alt1/base */ "alt1/base").ImageDetect.imageDataFromBase64)("iVBORw0KGgoAAAANSUhEUgAAABsAAAAbCAYAAACN1PRVAAAAAW5vUEUAYtdMlAAAAARub1BFAAAAAEEgjiIAAAAJbm9QRQAAAAAAAAAAAKGKctUAAABFSURBVEhL7daxDQAgDANBm5XYfwOYyUgoI5gUyFc51bfhAoQmNzYl1v3MJjVqt0jMIjGLxCwSs0jMIjGLxCz+jTV+xMAB3/oJlYh5IBUAAAAASUVORK5CYII=")

/***/ }),

/***/ "./src/buffs/index.ts":
/*!****************************!*\
  !*** ./src/buffs/index.ts ***!
  \****************************/
/***/ (function(__unused_webpack_module, exports, __nested_webpack_require_2063__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BuffInfo = exports.Buff = void 0;
const a1lib = __importStar(__nested_webpack_require_2063__(/*! alt1/base */ "alt1/base"));
const OCR = __importStar(__nested_webpack_require_2063__(/*! alt1/ocr */ "alt1/ocr"));
const base_1 = __nested_webpack_require_2063__(/*! alt1/base */ "alt1/base");
var imgs = (0, base_1.webpackImages)({
    buff: __nested_webpack_require_2063__(/*! ./imgs/buffborder.data.png */ "./src/buffs/imgs/buffborder.data.png"),
    debuff: __nested_webpack_require_2063__(/*! ./imgs/debuffborder.data.png */ "./src/buffs/imgs/debuffborder.data.png"),
});
var font = __nested_webpack_require_2063__(/*! ../fonts/pixel_8px_digits.fontmeta.json */ "./src/fonts/pixel_8px_digits.fontmeta.json");
function negmod(a, b) {
    return ((a % b) + b) % b;
}
class Buff {
    constructor(buffer, x, y, isdebuff) {
        this.buffer = buffer;
        this.bufferx = x;
        this.buffery = y;
        this.isdebuff = isdebuff;
    }
    readArg(type) {
        return BuffReader.readArg(this.buffer, this.bufferx + 2, this.buffery + 23, type);
    }
    readTime() {
        return BuffReader.readTime(this.buffer, this.bufferx + 2, this.buffery + 23);
    }
    compareBuffer(img) {
        return BuffReader.compareBuffer(this.buffer, this.bufferx + 1, this.buffery + 1, img);
    }
    countMatch(img, aggressive) {
        return BuffReader.countMatch(this.buffer, this.bufferx + 1, this.buffery + 1, img, aggressive);
    }
}
exports.Buff = Buff;
class BuffReader {
    constructor() {
        this.pos = null;
        this.debuffs = false;
    }
    find(img) {
        if (!img) {
            img = a1lib.captureHoldFullRs();
        }
        if (!img) {
            return null;
        }
        var poslist = img.findSubimage(this.debuffs ? imgs.debuff : imgs.buff);
        if (poslist.length == 0) {
            return null;
        }
        var grids = [];
        for (var a in poslist) {
            var ongrid = false;
            for (var b in grids) {
                if (negmod(grids[b].x - poslist[a].x, BuffReader.gridsize) == 0 && negmod(grids[b].x - poslist[a].x, BuffReader.gridsize) == 0) {
                    grids[b].x = Math.min(grids[b].x, poslist[a].x);
                    grids[b].y = Math.min(grids[b].y, poslist[a].y);
                    grids[b].n++;
                    ongrid = true;
                    break;
                }
            }
            if (!ongrid) {
                grids.push({ x: poslist[a].x, y: poslist[a].y, n: 1 });
            }
        }
        var max = 0;
        var above2 = 0;
        var best = null;
        for (var a in grids) {
            console.log("buff grid [" + grids[a].x + "," + grids[a].y + "], n:" + grids[a].n);
            if (grids[a].n > max) {
                max = grids[a].n;
                best = grids[a];
            }
            if (grids[a].n >= 2) {
                above2++;
            }
        }
        if (above2 > 1) {
            console.log("Warning, more than one possible buff bar location");
        }
        if (!best) {
            return null;
        }
        this.pos = { x: best.x, y: best.y, maxhor: 5, maxver: 1 };
        return true;
    }
    getCaptRect() {
        if (!this.pos) {
            return null;
        }
        return new a1lib.Rect(this.pos.x, this.pos.y, (this.pos.maxhor + 1) * BuffReader.gridsize, (this.pos.maxver + 1) * BuffReader.gridsize);
    }
    read(buffer) {
        if (!this.pos) {
            throw new Error("no pos");
        }
        var r = [];
        var rect = this.getCaptRect();
        if (!rect) {
            return null;
        }
        if (!buffer) {
            buffer = a1lib.capture(rect.x, rect.y, rect.width, rect.height);
        }
        var maxhor = 0;
        var maxver = 0;
        for (var ix = 0; ix <= this.pos.maxhor; ix++) {
            for (var iy = 0; iy <= this.pos.maxver; iy++) {
                var x = ix * BuffReader.gridsize;
                var y = iy * BuffReader.gridsize;
                //Have to require exact match here as we get transparency bs otherwise
                var match = buffer.pixelCompare((this.debuffs ? imgs.debuff : imgs.buff), x, y) == 0;
                if (!match) {
                    break;
                }
                r.push(new Buff(buffer, x, y, this.debuffs));
                maxhor = Math.max(maxhor, ix);
                maxver = Math.max(maxver, iy);
            }
        }
        this.pos.maxhor = Math.max(5, maxhor + 2);
        this.pos.maxver = Math.max(1, maxver + 1);
        return r;
    }
    static compareBuffer(buffer, ox, oy, buffimg) {
        var r = BuffReader.countMatch(buffer, ox, oy, buffimg, true);
        if (r.failed > 0) {
            return false;
        }
        if (r.tested < 50) {
            return false;
        }
        return true;
    }
    static countMatch(buffer, ox, oy, buffimg, agressive) {
        var r = { tested: 0, failed: 0, skipped: 0, passed: 0 };
        var data1 = buffer.data;
        var data2 = buffimg.data;
        //var debug = new ImageData(buffimg.width, buffimg.height);
        for (var y = 0; y < buffimg.height; y++) {
            for (var x = 0; x < buffimg.width; x++) {
                var i1 = buffer.pixelOffset(ox + x, oy + y);
                var i2 = buffimg.pixelOffset(x, y);
                //debug.data[i2] = 255; debug.data[i2 + 1] = debug.data[i2 + 2] = 0; debug.data[i2 + 3] = 255;
                if (data2[i2 + 3] != 255) {
                    r.skipped++;
                    continue;
                } //transparent buff pixel
                if (data1[i1] == 255 && data1[i1 + 1] == 255 && data1[i1 + 2] == 255) {
                    r.skipped++;
                    continue;
                } //white pixel - part of buff time text
                if (data1[i1] == 0 && data1[i1 + 1] == 0 && data1[i1 + 2] == 0) {
                    r.skipped++;
                    continue;
                } //black pixel - part of buff time text
                var d = a1lib.ImageDetect.coldif(data1[i1], data1[i1 + 1], data1[i1 + 2], data2[i2], data2[i2 + 1], data2[i2 + 2], 255);
                r.tested++;
                //debug.data[i2] = debug.data[i2 + 1] = debug.data[i2 + 2] = d * 10;
                if (d > 35) {
                    //qw(pixelschecked); debug.show();
                    r.failed++;
                    if (agressive) {
                        return r;
                    }
                }
                else {
                    r.passed++;
                }
            }
        }
        //debug.show(); qw(pixelschecked);
        return r;
    }
    static isolateBuffer(buffer, ox, oy, buffimg) {
        var count = BuffReader.countMatch(buffer, ox, oy, buffimg);
        if (count.passed < 50) {
            return;
        }
        var removed = 0;
        var data1 = buffer.data;
        var data2 = buffimg.data;
        //var debug = new ImageData(buffimg.width, buffimg.height);
        for (var y = 0; y < buffimg.height; y++) {
            for (var x = 0; x < buffimg.width; x++) {
                var i1 = buffer.pixelOffset(ox + x, oy + y);
                var i2 = buffimg.pixelOffset(x, y);
                //debug.data[i2] = 255; debug.data[i2 + 1] = debug.data[i2 + 2] = 0; debug.data[i2 + 3] = 255;
                if (data2[i2 + 3] != 255) {
                    continue;
                } //transparent buff pixel
                //==== new buffer has text on it ====
                if (data1[i1] == 255 && data1[i1 + 1] == 255 && data1[i1 + 2] == 255 || data1[i1] == 0 && data1[i1 + 1] == 0 && data1[i1 + 2] == 0) {
                    continue;
                }
                //==== old buf has text on it, use the new one ====
                if (data2[i2] == 255 && data2[i2 + 1] == 255 && data2[i2 + 2] == 255 || data2[i2] == 0 && data2[i2 + 1] == 0 && data2[i2 + 2] == 0) {
                    data2[i2 + 0] = data1[i1 + 0];
                    data2[i2 + 1] = data1[i1 + 1];
                    data2[i2 + 2] = data1[i1 + 2];
                    data2[i2 + 3] = data1[i1 + 3];
                    removed++;
                }
                var d = a1lib.ImageDetect.coldif(data1[i1], data1[i1 + 1], data1[i1 + 2], data2[i2], data2[i2 + 1], data2[i2 + 2], 255);
                //debug.data[i2] = debug.data[i2 + 1] = debug.data[i2 + 2] = d * 10;
                if (d > 5) {
                    //qw(pixelschecked); debug.show();
                    data2[i2 + 0] = data2[i2 + 1] = data2[i2 + 2] = data2[i2 + 3] = 0;
                    removed++;
                }
            }
        }
        //debug.show(); qw(pixelschecked);
        if (removed > 0) {
            console.log(removed + " pixels remove from buff template image");
        }
    }
    static readArg(buffer, ox, oy, type) {
        var lines = [];
        for (var dy = -10; dy < 10; dy += 10) { //the timer can be spread to a second line at certain times (229m)
            var result = OCR.readLine(buffer, font, [255, 255, 255], ox, oy + dy, true);
            if (result.text) {
                lines.push(result.text);
            }
        }
        var r = { time: 0, arg: "" };
        if (type == "timearg" && lines.length > 1) {
            r.arg = lines.pop();
        }
        var str = lines.join("");
        if (type == "arg") {
            r.arg = str;
        }
        else {
            var m;
            if (m = str.match(/^(\d+)hr($|\s?\()/i)) {
                r.time = +m[1] * 60 * 60;
            }
            else if (m = str.match(/^(\d+)m($|\s?\()/i)) {
                r.time = +m[1] * 60;
            }
            else if (m = str.match(/^(\d+)($|\s?\()/)) {
                r.time = +m[1];
            }
        }
        return r;
    }
    static readTime(buffer, ox, oy) {
        return this.readArg(buffer, ox, oy, "time").time;
    }
    static matchBuff(state, buffimg) {
        for (var a in state) {
            if (state[a].compareBuffer(buffimg)) {
                return state[a];
            }
        }
        return null;
    }
    static matchBuffMulti(state, buffinfo) {
        if (buffinfo.final) { //cheap way if we known exactly what we're searching for
            return BuffReader.matchBuff(state, buffinfo.imgdata);
        }
        else { //expensive way if we are not sure the template is final
            var bestindex = -1;
            var bestscore = 0;
            if (buffinfo.imgdata) {
                for (var a = 0; a < state.length; a++) {
                    var count = BuffReader.countMatch(state[a].buffer, state[a].bufferx + 1, state[a].buffery + 1, buffinfo.imgdata, false);
                    if (count.passed > bestscore) {
                        bestscore = count.passed;
                        bestindex = a;
                    }
                }
            }
            if (bestscore < 50) {
                return null;
            }
            //update the isolated buff
            if (buffinfo.canimprove) {
                BuffReader.isolateBuffer(state[bestindex].buffer, state[bestindex].bufferx + 1, state[bestindex].buffery + 1, buffinfo.imgdata);
            }
            return state[bestindex];
        }
    }
}
BuffReader.buffsize = 27;
BuffReader.gridsize = 30;
exports["default"] = BuffReader;
class BuffInfo {
    constructor(imgdata, debuff, id, canimprove) {
        this.imgdata = imgdata;
        this.isdebuff = debuff;
        this.buffid = id;
        this.final = !!id && !canimprove;
        this.canimprove = canimprove;
    }
}
exports.BuffInfo = BuffInfo;


/***/ }),

/***/ "alt1/base":
/*!**************************************************************************************************!*\
  !*** external {"root":"A1lib","commonjs2":"alt1/base","commonjs":"alt1/base","amd":"alt1/base"} ***!
  \**************************************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE_alt1_base__;

/***/ }),

/***/ "alt1/ocr":
/*!*********************************************************************************************!*\
  !*** external {"root":"OCR","commonjs2":"alt1/ocr","commonjs":"alt1/ocr","amd":"alt1/ocr"} ***!
  \*********************************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE_alt1_ocr__;

/***/ }),

/***/ "./src/fonts/pixel_8px_digits.fontmeta.json":
/*!**************************************************!*\
  !*** ./src/fonts/pixel_8px_digits.fontmeta.json ***!
  \**************************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"chars":[{"width":7,"bonus":120,"chr":"0","pixels":[0,2,255,255,0,3,255,255,0,4,255,255,0,5,255,255,1,1,255,255,1,3,255,0,1,4,255,0,1,5,255,0,1,6,255,255,2,0,255,255,2,2,255,0,2,7,255,255,3,1,255,255,3,6,255,255,3,8,255,0,4,2,255,255,4,3,255,255,4,4,255,255,4,5,255,255,4,7,255,0,5,3,255,0,5,4,255,0,5,5,255,0,5,6,255,0],"secondary":false},{"width":4,"bonus":95,"chr":"1","pixels":[0,1,255,255,0,7,255,255,1,0,255,255,1,1,255,255,1,2,255,255,1,3,255,255,1,4,255,255,1,5,255,255,1,6,255,255,1,7,255,255,1,8,255,0,2,1,255,0,2,2,255,0,2,3,255,0,2,4,255,0,2,5,255,0,2,6,255,0,2,7,255,255,2,8,255,0],"secondary":false},{"width":7,"bonus":140,"chr":"2","pixels":[0,1,255,255,0,6,255,255,0,7,255,255,1,0,255,255,1,2,255,0,1,5,255,255,1,7,255,255,1,8,255,0,2,0,255,255,2,1,255,0,2,4,255,255,2,6,255,0,2,7,255,255,2,8,255,0,3,0,255,255,3,1,255,0,3,3,255,255,3,5,255,0,3,7,255,255,3,8,255,0,4,1,255,255,4,2,255,255,4,4,255,0,4,7,255,255,4,8,255,0,5,2,255,0,5,3,255,0,5,8,255,0],"secondary":false},{"width":6,"bonus":115,"chr":"3","pixels":[0,1,255,255,0,6,255,255,1,0,255,255,1,2,255,0,1,3,255,255,1,7,255,255,2,0,255,255,2,1,255,0,2,3,255,255,2,4,255,0,2,7,255,255,2,8,255,0,3,1,255,255,3,2,255,255,3,4,255,255,3,5,255,255,3,6,255,255,3,8,255,0,4,2,255,0,4,3,255,0,4,5,255,0,4,6,255,0,4,7,255,0],"secondary":false},{"width":5,"bonus":110,"chr":"4","pixels":[0,0,255,255,0,1,255,255,0,2,255,255,0,3,255,255,0,4,255,255,0,5,255,255,1,1,255,0,1,2,255,0,1,3,255,0,1,4,255,0,1,5,255,255,1,6,255,0,2,3,255,255,2,4,255,255,2,5,255,255,2,6,255,255,2,7,255,255,3,4,255,0,3,5,255,255,3,6,255,0,3,7,255,0,3,8,255,0],"secondary":false},{"width":6,"bonus":135,"chr":"5","pixels":[0,0,255,255,0,1,255,255,0,2,255,255,0,3,255,255,0,6,255,255,1,0,255,255,1,1,255,0,1,2,255,0,1,3,255,255,1,4,255,0,1,7,255,255,2,0,255,255,2,1,255,0,2,3,255,255,2,4,255,0,2,7,255,255,2,8,255,0,3,0,255,255,3,1,255,0,3,4,255,255,3,5,255,255,3,6,255,255,3,8,255,0,4,1,255,0,4,5,255,0,4,6,255,0,4,7,255,0],"secondary":false},{"width":7,"bonus":160,"chr":"6","pixels":[0,2,255,255,0,3,255,255,0,4,255,255,0,5,255,255,0,6,255,255,1,1,255,255,1,3,255,0,1,4,255,255,1,5,255,0,1,6,255,0,1,7,255,255,2,0,255,255,2,2,255,0,2,3,255,255,2,5,255,0,2,7,255,255,2,8,255,0,3,0,255,255,3,1,255,0,3,3,255,255,3,4,255,0,3,7,255,255,3,8,255,0,4,1,255,255,4,4,255,255,4,5,255,255,4,6,255,255,4,8,255,0,5,2,255,0,5,5,255,0,5,6,255,0,5,7,255,0],"secondary":false},{"width":6,"bonus":105,"chr":"7","pixels":[0,0,255,255,0,6,255,255,0,7,255,255,1,0,255,255,1,1,255,0,1,4,255,255,1,5,255,255,1,7,255,0,1,8,255,0,2,0,255,255,2,1,255,0,2,2,255,255,2,3,255,255,2,5,255,0,2,6,255,0,3,0,255,255,3,1,255,255,3,3,255,0,3,4,255,0,4,1,255,0,4,2,255,0],"secondary":false},{"width":7,"bonus":170,"chr":"8","pixels":[0,1,255,255,0,2,255,255,0,4,255,255,0,5,255,255,0,6,255,255,1,0,255,255,1,2,255,0,1,3,255,255,1,5,255,0,1,6,255,0,1,7,255,255,2,0,255,255,2,1,255,0,2,3,255,255,2,4,255,0,2,7,255,255,2,8,255,0,3,0,255,255,3,1,255,0,3,3,255,255,3,4,255,0,3,7,255,255,3,8,255,0,4,1,255,255,4,2,255,255,4,4,255,255,4,5,255,255,4,6,255,255,4,8,255,0,5,2,255,0,5,3,255,0,5,5,255,0,5,6,255,0,5,7,255,0],"secondary":false},{"width":7,"bonus":130,"chr":"9","pixels":[0,1,255,255,0,2,255,255,1,0,255,255,1,2,255,0,1,3,255,255,2,0,255,255,2,1,255,0,2,4,255,255,3,0,255,255,3,1,255,0,3,4,255,255,3,5,255,0,4,1,255,255,4,2,255,255,4,3,255,255,4,4,255,255,4,5,255,255,4,6,255,255,4,7,255,255,5,2,255,0,5,3,255,0,5,4,255,0,5,5,255,0,5,6,255,0,5,7,255,0,5,8,255,0],"secondary":false},{"width":7,"bonus":130,"chr":"m","pixels":[0,4,255,255,0,5,255,255,0,6,255,255,0,7,255,255,1,3,255,255,1,5,255,0,1,6,255,0,1,7,255,0,1,8,255,0,2,4,255,255,2,5,255,255,2,6,255,255,2,7,255,255,3,3,255,255,3,5,255,0,3,6,255,0,3,7,255,0,3,8,255,0,4,4,255,255,4,5,255,255,4,6,255,255,4,7,255,255,5,5,255,0,5,6,255,0,5,7,255,0,5,8,255,0],"secondary":false},{"width":3,"bonus":80,"chr":"(","pixels":[0,1,255,255,0,2,255,255,0,3,255,255,0,4,255,255,0,5,255,255,0,6,255,255,0,7,255,255,1,0,255,255,1,2,255,0,1,3,255,0,1,4,255,0,1,5,255,0,1,6,255,0,1,7,255,0,1,8,255,255,2,1,255,0],"secondary":false},{"width":2,"bonus":70,"chr":")","pixels":[0,1,255,255,0,2,255,255,0,3,255,255,0,4,255,255,0,5,255,255,0,6,255,255,0,7,255,255,1,2,255,0,1,3,255,0,1,4,255,0,1,5,255,0,1,6,255,0,1,7,255,0,1,8,255,0],"secondary":false},{"width":6,"bonus":135,"chr":"h","pixels":[0,0,255,255,0,1,255,255,0,2,255,255,0,3,255,255,0,4,255,255,0,5,255,255,0,6,255,255,0,7,255,255,1,1,255,0,1,2,255,0,1,3,255,255,1,4,255,0,1,5,255,0,1,6,255,0,1,7,255,0,1,8,255,0,2,3,255,255,2,4,255,0,2,5,255,0,3,4,255,255,3,5,255,255,3,6,255,255,3,7,255,255,4,5,255,0,4,6,255,0,4,7,255,0,4,8,255,0],"secondary":false},{"width":5,"bonus":65,"chr":"r","pixels":[0,3,255,255,0,4,255,255,0,5,255,255,0,6,255,255,0,7,255,255,1,4,255,255,1,5,255,0,1,6,255,0,1,7,255,0,1,8,255,0,2,3,255,255,2,5,255,0,3,4,255,0],"secondary":false}],"width":7,"spacewidth":3,"shadow":true,"height":9,"basey":7}');

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nested_webpack_require_21006__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __nested_webpack_require_21006__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __nested_webpack_exports__ = __nested_webpack_require_21006__("./src/buffs/index.ts");
/******/ 	
/******/ 	return __nested_webpack_exports__;
/******/ })()
;
});

/***/ },

/***/ "../node_modules/alt1/dist/ocr/index.js"
/*!**********************************************!*\
  !*** ../node_modules/alt1/dist/ocr/index.js ***!
  \**********************************************/
(module, __unused_webpack_exports, __webpack_require__) {

(function webpackUniversalModuleDefinition(root, factory) {
	if(true)
		module.exports = factory(__webpack_require__(/*! alt1/base */ "../node_modules/alt1/dist/base/index.js"));
	else // removed by dead control flow
{}
})(globalThis, (__WEBPACK_EXTERNAL_MODULE_alt1_base__) => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/ocr/index.ts":
/*!**************************!*\
  !*** ./src/ocr/index.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.generateFont = exports.loadFontImage = exports.readChar = exports.readSmallCapsBackwards = exports.readLine = exports.getChatColor = exports.getChatColorMono = exports.findReadLine = exports.findChar = exports.decompose3col = exports.decomposeblack = exports.decompose2col = exports.canblend = exports.unblendTrans = exports.unblendKnownBg = exports.unblendBlackBackground = exports.debugFont = exports.debugout = exports.debug = void 0;
const base_1 = __webpack_require__(/*! alt1/base */ "alt1/base");
exports.debug = {
    printcharscores: false,
    trackread: false
};
exports.debugout = {};
/**
 * draws the font definition to a buffer and displays it in the dom for debugging purposes
 * @param font
 */
function debugFont(font) {
    var spacing = font.width + 2;
    var buf = new base_1.ImageData(spacing * font.chars.length, font.height + 1);
    for (var a = 0; a < buf.data.length; a += 4) {
        buf.data[a] = buf.data[a + 1] = buf.data[a + 2] = 0;
        buf.data[a + 3] = 255;
    }
    for (var a = 0; a < font.chars.length; a++) {
        var bx = a * spacing;
        var chr = font.chars[a];
        for (var b = 0; b < chr.pixels.length; b += (font.shadow ? 4 : 3)) {
            buf.setPixel(bx + chr.pixels[b], chr.pixels[b + 1], [chr.pixels[b + 2], chr.pixels[b + 2], chr.pixels[b + 2], 255]);
            if (font.shadow) {
                buf.setPixel(bx + chr.pixels[b], chr.pixels[b + 1], [chr.pixels[b + 3], 0, 0, 255]);
            }
        }
    }
    buf.show();
}
exports.debugFont = debugFont;
function unblendBlackBackground(img, r, g, b) {
    var rimg = new base_1.ImageData(img.width, img.height);
    for (var i = 0; i < img.data.length; i += 4) {
        var col = decomposeblack(img.data[i], img.data[i + 1], img.data[i + 2], r, g, b);
        rimg.data[i + 0] = col[0] * 255;
        rimg.data[i + 1] = rimg.data[i + 0];
        rimg.data[i + 2] = rimg.data[i + 0];
        rimg.data[i + 3] = 255;
    }
    return rimg;
}
exports.unblendBlackBackground = unblendBlackBackground;
/**
 * unblends a imagebuffer into match strength with given color
 * the bgimg argument should contain a second image with pixel occluded by the font visible.
 * @param img
 * @param shadow detect black as second color
 * @param bgimg optional second image to
 */
function unblendKnownBg(img, bgimg, shadow, r, g, b) {
    if (bgimg && (img.width != bgimg.width || img.height != bgimg.height)) {
        throw "bgimg size doesn't match";
    }
    var rimg = new base_1.ImageData(img.width, img.height);
    var totalerror = 0;
    for (var i = 0; i < img.data.length; i += 4) {
        var col = decompose2col(img.data[i], img.data[i + 1], img.data[i + 2], r, g, b, bgimg.data[i + 0], bgimg.data[i + 1], bgimg.data[i + 2]);
        if (shadow) {
            if (col[2] > 0.01) {
                console.log("high error component: " + (col[2] * 100).toFixed(1) + "%");
            }
            totalerror += col[2];
            var m = 1 - col[1] - Math.abs(col[2]); //main color+black=100%-bg-error
            rimg.data[i + 0] = m * 255;
            rimg.data[i + 1] = col[0] / m * 255;
            rimg.data[i + 2] = rimg.data[i + 0];
        }
        else {
            rimg.data[i + 0] = col[0] * 255;
            rimg.data[i + 1] = rimg.data[i + 0];
            rimg.data[i + 2] = rimg.data[i + 0];
        }
        rimg.data[i + 3] = 255;
    }
    return rimg;
}
exports.unblendKnownBg = unblendKnownBg;
/**
 * Unblends a font image that is already conpletely isolated to the raw image used ingame. This is the easiest mode for pixel fonts where alpha is 0 or 255, or for extracted font files.
 * @param img
 * @param r
 * @param g
 * @param b
 * @param shadow whether the font has a black shadow
 */
function unblendTrans(img, shadow, r, g, b) {
    var rimg = new base_1.ImageData(img.width, img.height);
    var pxlum = r + g + b;
    for (var i = 0; i < img.data.length; i += 4) {
        if (shadow) {
            var lum = img.data[i + 0] + img.data[i + 1] + img.data[i + 2];
            rimg.data[i + 0] = img.data[i + 3];
            rimg.data[i + 1] = lum / pxlum * 255;
            rimg.data[i + 2] = rimg.data[i + 0];
        }
        else {
            rimg.data[i + 0] = img.data[i + 3];
            rimg.data[i + 1] = rimg.data[i + 0];
            rimg.data[i + 2] = rimg.data[i + 0];
        }
        rimg.data[i + 3] = 255;
    }
    return rimg;
}
exports.unblendTrans = unblendTrans;
/**
 * Determised wether color [rgb]m can be a result of a blend with color [rgb]1 that is p (0-1) of the mix
 * It returns the number that the second color has to lie outside of the possible color ranges
 * @param rm resulting color
 * @param r1 first color of the mix (the other color is unknown)
 * @param p the portion of the [rgb]1 in the mix (0-1)
 */
function canblend(rm, gm, bm, r1, g1, b1, p) {
    var m = Math.min(50, p / (1 - p));
    var r = rm + (rm - r1) * m;
    var g = gm + (gm - g1) * m;
    var b = bm + (bm - b1) * m;
    return Math.max(0, -r, -g, -b, r - 255, g - 255, b - 255);
}
exports.canblend = canblend;
/**
 * decomposes a color in 2 given component colors and returns the amount of each color present
 * also return a third (noise) component which is the the amount leftover orthagonal from the 2 given colors
 */
function decompose2col(rp, gp, bp, r1, g1, b1, r2, g2, b2) {
    //get the normal of the error (cross-product of both colors)
    var r3 = g1 * b2 - g2 * b1;
    var g3 = b1 * r2 - b2 * r1;
    var b3 = r1 * g2 - r2 * g1;
    //normalize to length 255
    var norm = 255 / Math.sqrt(r3 * r3 + g3 * g3 + b3 * b3);
    r3 *= norm;
    g3 *= norm;
    b3 *= norm;
    return decompose3col(rp, gp, bp, r1, g1, b1, r2, g2, b2, r3, g3, b3);
}
exports.decompose2col = decompose2col;
/**
 * decomposes a pixel in a given color component and black and returns what proportion of the second color it contains
 * this is not as formal as decompose 2/3 and only give a "good enough" number
 */
function decomposeblack(rp, gp, bp, r1, g1, b1) {
    var dr = Math.abs(rp - r1);
    var dg = Math.abs(gp - g1);
    var db = Math.abs(bp - b1);
    var maxdif = Math.max(dr, dg, db);
    return [1 - maxdif / 255];
}
exports.decomposeblack = decomposeblack;
/**
 * decomposes a color in 3 given component colors and returns the amount of each color present
 */
function decompose3col(rp, gp, bp, r1, g1, b1, r2, g2, b2, r3, g3, b3) {
    //P=x*C1+y*C2+z*C3
    //assemble as matrix 
    //M*w=p
    //get inverse of M
    //dirty written out version of cramer's rule
    var A = g2 * b3 - b2 * g3;
    var B = g3 * b1 - b3 * g1;
    var C = g1 * b2 - b1 * g2;
    var D = b2 * r3 - r2 * b3;
    var E = b3 * r1 - r3 * b1;
    var F = b1 * r2 - r1 * b2;
    var G = r2 * g3 - g2 * r3;
    var H = r3 * g1 - g3 * r1;
    var I = r1 * g2 - g1 * r2;
    var det = r1 * A + g1 * D + b1 * G;
    //M^-1*p=w
    var x = (A * rp + D * gp + G * bp) / det;
    var y = (B * rp + E * gp + H * bp) / det;
    var z = (C * rp + F * gp + I * bp) / det;
    return [x, y, z];
}
exports.decompose3col = decompose3col;
/**
 * brute force to the exact position of the text
 */
function findChar(buffer, font, col, x, y, w, h) {
    if (x < 0) {
        return null;
    }
    if (y - font.basey < 0) {
        return null;
    }
    if (x + w + font.width > buffer.width) {
        return null;
    }
    if (y + h - font.basey + font.height > buffer.height) {
        return null;
    }
    var best = 1000; //TODO finetune score constants
    var bestchar = null;
    for (var cx = x; cx < x + w; cx++) {
        for (var cy = y; cy < y + h; cy++) {
            var chr = readChar(buffer, font, col, cx, cy, false, false);
            if (chr != null && chr.sizescore < best) {
                best = chr.sizescore;
                bestchar = chr;
            }
        }
    }
    return bestchar;
}
exports.findChar = findChar;
/**
 * reads text with unknown exact coord or color. The given coord should be inside the text
 * color selection not implemented yet
 */
function findReadLine(buffer, font, cols, x, y, w = -1, h = -1) {
    if (w == -1) {
        w = font.width + font.spacewidth;
        x -= Math.ceil(w / 2);
    }
    if (h == -1) {
        h = 7;
        y -= 1;
    }
    var chr = null;
    if (cols.length > 1) {
        //TODO use getChatColor() instead for non-mono?
        var sorted = getChatColorMono(buffer, new base_1.Rect(x, y - font.basey, w, h), cols);
        //loop until we have a match (max 2 cols)
        for (var a = 0; a < 2 && a < sorted.length && chr == null; a++) {
            chr = findChar(buffer, font, sorted[a].col, x, y, w, h);
        }
    }
    else {
        chr = findChar(buffer, font, cols[0], x, y, w, h);
    }
    if (chr == null) {
        return { debugArea: { x, y, w, h }, text: "", fragments: [] };
    }
    return readLine(buffer, font, cols, chr.x, chr.y, true, true);
}
exports.findReadLine = findReadLine;
function getChatColorMono(buf, rect, colors) {
    var colormap = colors.map(c => ({ col: c, score: 0 }));
    if (rect.x < 0 || rect.y < 0 || rect.x + rect.width > buf.width || rect.y + rect.height > buf.height) {
        return colormap;
    }
    var data = buf.data;
    var maxd = 50;
    for (var colobj of colormap) {
        var score = 0;
        var col = colobj.col;
        for (var y = rect.y; y < rect.y + rect.height; y++) {
            for (var x = rect.x; x < rect.x + rect.width; x++) {
                var i = x * 4 + y * 4 * buf.width;
                var d = Math.abs(data[i] - col[0]) + Math.abs(data[i + 1] - col[1]) + Math.abs(data[i + 2] - col[2]);
                if (d < maxd) {
                    score += maxd - d;
                }
            }
        }
        colobj.score = score;
    }
    return colormap.sort((a, b) => b.score - a.score);
}
exports.getChatColorMono = getChatColorMono;
function unblend(r, g, b, R, G, B) {
    var m = Math.sqrt(r * r + g * g + b * b);
    var n = Math.sqrt(R * R + G * G + B * B);
    var x = (r * R + g * G + b * B) / n;
    var y = Math.sqrt(Math.max(0, m * m - x * x));
    var r1 = Math.max(0, (63.75 - y) * 4);
    var r2 = x / n * 255;
    if (r2 > 255) //brighter than refcol
     {
        r1 = Math.max(0, r1 - r2 + 255);
        r2 = 255;
    }
    return [r1, r2];
}
function getChatColor(buf, rect, colors) {
    var bestscore = -1.0;
    var best = null;
    var b2 = 0.0;
    var data = buf.data;
    for (let col of colors) {
        var score = 0.0;
        for (var y = rect.y; y < rect.y + rect.height; y++) {
            for (var x = rect.x; x < rect.x + rect.width; x++) {
                if (x < 0 || x + 1 >= buf.width) {
                    continue;
                }
                if (y < 0 || y + 1 >= buf.width) {
                    continue;
                }
                let i1 = buf.pixelOffset(x, y);
                let i2 = buf.pixelOffset(x + 1, y + 1);
                var pixel1 = unblend(data[i1 + 0], data[i1 + 1], data[i1 + 2], col[0], col[1], col[2]);
                var pixel2 = unblend(data[i2 + 0], data[i2 + 1], data[i2 + 2], col[0], col[1], col[2]);
                //TODO this is from c# can simplify a bit
                var s = (pixel1[0] / 255 * pixel1[1] / 255) * (pixel2[0] / 255 * (255.0 - pixel2[1]) / 255);
                score += s;
            }
        }
        if (score > bestscore) {
            b2 = bestscore;
            bestscore = score;
            best = col;
        }
        else if (score > b2) {
            b2 = score;
        }
    }
    //Console.WriteLine("color: " + bestcol + " - " + (bestscore - b2));
    //bestscore /= rect.width * rect.height;
    return best;
}
exports.getChatColor = getChatColor;
/**
 * reads a line of text with exactly known position and color. y should be the y coord of the text base line, x should be the first pixel of a new character
 */
function readLine(buffer, font, colors, x, y, forward, backward = false) {
    if (typeof colors[0] != "number" && colors.length == 1) {
        colors = colors[0];
    }
    var multicol = typeof colors[0] != "number";
    var allcolors = multicol ? colors : [colors];
    var detectcolor = function (sx, sy, backward) {
        var w = Math.floor(font.width * 1.5);
        if (backward) {
            sx -= w;
        }
        sy -= font.basey;
        return getChatColor(buffer, { x: sx, y: sy, width: w, height: font.height }, allcolors);
    };
    var fragments = [];
    var x1 = x;
    var x2 = x;
    var maxspaces = (typeof font.maxspaces == "number" ? font.maxspaces : 1);
    let fragtext = "";
    let fraghadprimary = false;
    var lastcol = null;
    let addfrag = (forward) => {
        if (!fragtext) {
            return;
        }
        let frag = {
            text: fragtext,
            color: lastcol,
            index: 0,
            xstart: x + (forward ? fragstartdx : fragenddx),
            xend: x + (forward ? fragenddx : fragstartdx)
        };
        if (forward) {
            fragments.push(frag);
        }
        else {
            fragments.unshift(frag);
        }
        fragtext = "";
        fragstartdx = dx;
        fraghadprimary = false;
    };
    for (var dirforward of [true, false]) {
        //init vars
        if (dirforward && !forward) {
            continue;
        }
        if (!dirforward && !backward) {
            continue;
        }
        var dx = 0;
        var fragstartdx = dx;
        var fragenddx = dx;
        var triedspaces = 0;
        var triedrecol = false;
        var col = multicol ? null : colors;
        while (true) {
            col = col || detectcolor(x + dx, y, !dirforward);
            var chr = (col ? readChar(buffer, font, col, x + dx, y, !dirforward, true) : null);
            if (col == null || chr == null) {
                if (triedspaces < maxspaces) {
                    dx += (dirforward ? 1 : -1) * font.spacewidth;
                    triedspaces++;
                    continue;
                }
                if (multicol && !triedrecol && fraghadprimary) {
                    dx -= (dirforward ? 1 : -1) * triedspaces * font.spacewidth;
                    triedspaces = 0;
                    col = null;
                    triedrecol = true;
                    continue;
                }
                if (dirforward) {
                    x2 = x + dx - font.spacewidth;
                }
                else {
                    x1 = x + dx + font.spacewidth;
                }
                break;
            }
            else {
                if (lastcol && (col[0] != lastcol[0] || col[1] != lastcol[1] || col[2] != lastcol[2])) {
                    addfrag(dirforward);
                }
                var spaces = "";
                for (var a = 0; a < triedspaces; a++) {
                    spaces += " ";
                }
                if (dirforward) {
                    fragtext += spaces + chr.chr;
                }
                else {
                    fragtext = chr.chr + spaces + fragtext;
                }
                if (!chr.basechar.secondary) {
                    fraghadprimary = true;
                }
                triedspaces = 0;
                triedrecol = false;
                dx += (dirforward ? 1 : -1) * chr.basechar.width;
                fragenddx = dx;
                lastcol = col;
            }
        }
        if (lastcol && fraghadprimary) {
            addfrag(dirforward);
        }
    }
    fragments.forEach((f, i) => f.index = i);
    return {
        debugArea: { x: x1, y: y - 9, w: x2 - x1, h: 10 },
        text: fragments.map(f => f.text).join(""),
        fragments
    };
}
exports.readLine = readLine;
/**
 * Reads a line of text that uses a smallcaps font, these fonts can have duplicate chars that only have a different amount of
 * empty space after the char before the next char starts.
 * The coordinates should be near the end of the string, or a rectangle with high 1 containing all points where the string can end.
 */
function readSmallCapsBackwards(buffer, font, cols, x, y, w = -1, h = -1) {
    if (w == -1) {
        w = font.width + font.spacewidth;
        x -= Math.ceil(w / 2);
    }
    if (h == -1) {
        h = 7;
        y -= 1;
    }
    var matchedchar = null;
    var sorted = (cols.length == 1 ? [{ col: cols[0], score: 1 }] : getChatColorMono(buffer, new base_1.Rect(x, y - font.basey, w, h), cols));
    //loop until we have a match (max 2 cols)
    for (var a = 0; a < 2 && a < sorted.length && matchedchar == null; a++) {
        for (var cx = x + w - 1; cx >= x; cx--) {
            var best = 1000; //TODO finetune score constants
            var bestchar = null;
            for (var cy = y; cy < y + h; cy++) {
                var chr = readChar(buffer, font, sorted[a].col, cx, cy, true, false);
                if (chr != null && chr.sizescore < best) {
                    best = chr.sizescore;
                    bestchar = chr;
                }
            }
            if (bestchar) {
                matchedchar = bestchar;
                break;
            }
        }
    }
    if (matchedchar == null) {
        return { text: "", debugArea: { x, y, w, h } };
    }
    return readLine(buffer, font, cols, matchedchar.x, matchedchar.y, false, true);
}
exports.readSmallCapsBackwards = readSmallCapsBackwards;
/**
 * Reads a single character at the exact given location
 * @param x exact x location of the start of the character domain (includes part of the spacing between characters)
 * @param y exact y location of the baseline pixel of the character
 * @param backwards read in backwards direction, the x location should be the first pixel after the character domain in that case
 */
function readChar(buffer, font, col, x, y, backwards, allowSecondary) {
    y -= font.basey;
    var shiftx = 0;
    var shifty = font.basey;
    var shadow = font.shadow;
    var debugobj = null;
    var debugimg = null;
    if (exports.debug.trackread) {
        var name = x + ";" + y + " " + JSON.stringify(col);
        if (!exports.debugout[name]) {
            exports.debugout[name] = [];
        }
        debugobj = exports.debugout[name];
    }
    //===== make sure the full domain is inside the bitmap/buffer ======
    if (y < 0 || y + font.height >= buffer.height) {
        return null;
    }
    if (!backwards) {
        if (x < 0 || x + font.width > buffer.width) {
            return null;
        }
    }
    else {
        if (x - font.width < 0 || x > buffer.width) {
            return null;
        }
    }
    //====== start reading the char ======
    var scores = [];
    charloop: for (var chr = 0; chr < font.chars.length; chr++) {
        var chrobj = font.chars[chr];
        if (chrobj.secondary && !allowSecondary) {
            continue;
        }
        const scoreobj = { score: 0, sizescore: 0, chr: chrobj };
        var chrx = (backwards ? x - chrobj.width : x);
        if (exports.debug.trackread) {
            debugimg = new base_1.ImageData(font.width, font.height);
        }
        for (var a = 0; a < chrobj.pixels.length;) {
            var i = (chrx + chrobj.pixels[a]) * 4 + (y + chrobj.pixels[a + 1]) * buffer.width * 4;
            var penalty = 0;
            if (!shadow) {
                penalty = canblend(buffer.data[i], buffer.data[i + 1], buffer.data[i + 2], col[0], col[1], col[2], chrobj.pixels[a + 2] / 255);
                a += 3;
            }
            else {
                var lum = chrobj.pixels[a + 3] / 255;
                penalty = canblend(buffer.data[i], buffer.data[i + 1], buffer.data[i + 2], col[0] * lum, col[1] * lum, col[2] * lum, chrobj.pixels[a + 2] / 255);
                a += 4;
            }
            scoreobj.score += penalty;
            // Short circuit the loop as soon as the penalty threshold (400) is reached
            if (!debugobj && scoreobj.score > 400) {
                continue charloop;
            }
            //TODO add compiler flag to this to remove it for performance
            if (debugimg) {
                debugimg.setPixel(chrobj.pixels[a], chrobj.pixels[a + 1], [penalty, penalty, penalty, 255]);
            }
        }
        scoreobj.sizescore = scoreobj.score - chrobj.bonus;
        if (debugobj) {
            debugobj.push({ chr: chrobj.chr, score: scoreobj.sizescore, rawscore: scoreobj.score, img: debugimg });
        }
        scores.push(scoreobj);
    }
    if (exports.debug.printcharscores) {
        scores.sort((a, b) => a.sizescore - b.sizescore);
        scores.slice(0, 5).forEach(q => console.log(q.chr.chr, q.score.toFixed(3), q.sizescore.toFixed(3)));
    }
    let winchr = null;
    for (const chrscore of scores) {
        if (!winchr || (chrscore && chrscore.sizescore < winchr.sizescore))
            winchr = chrscore;
    }
    if (!winchr || winchr.score > 400) {
        return null;
    }
    return { chr: winchr.chr.chr, basechar: winchr.chr, x: x + shiftx, y: y + shifty, score: winchr.score, sizescore: winchr.sizescore };
}
exports.readChar = readChar;
function loadFontImage(img, meta) {
    var bg = null;
    var pxheight = img.height - 1;
    if (meta.unblendmode == "removebg") {
        pxheight /= 2;
    }
    var inimg = img.clone({ x: 0, y: 0, width: img.width, height: pxheight });
    var outimg;
    if (meta.unblendmode == "removebg") {
        bg = img.clone({ x: 0, y: pxheight + 1, width: img.width, height: pxheight });
        outimg = unblendKnownBg(inimg, bg, meta.shadow, meta.color[0], meta.color[1], meta.color[2]);
    }
    else if (meta.unblendmode == "raw") {
        outimg = unblendTrans(inimg, meta.shadow, meta.color[0], meta.color[1], meta.color[2]);
    }
    else if (meta.unblendmode == "blackbg") {
        outimg = unblendBlackBackground(inimg, meta.color[0], meta.color[1], meta.color[2]);
    }
    else {
        throw new Error("no unblend mode");
    }
    var unblended = new base_1.ImageData(img.width, pxheight + 1);
    outimg.copyTo(unblended, 0, 0, outimg.width, outimg.height, 0, 0);
    img.copyTo(unblended, 0, pxheight, img.width, 1, 0, pxheight);
    return generateFont(unblended, meta.chars, meta.seconds, meta.bonus || {}, meta.basey, meta.spacewidth, meta.treshold, meta.shadow);
}
exports.loadFontImage = loadFontImage;
/**
 * Generates a font json description to use in reader functions
 * @param unblended A source image with all characters lined up. The image should be unblended into components using the unblend functions
 * The lowest pixel line of this image is used to mark the location and size of the charecters if the red component is 255 it means there is a character on that pixel column
 * @param chars A string containing all the characters of the image in the same order
 * @param seconds A string with characters that are considered unlikely and should only be detected if no other character is possible.
 * For example the period (.) character matches positive inside many other characters and should be marked as secondary
 * @param bonusses An object that contains bonus scores for certain difficult characters to make the more likely to be red.
 * @param basey The y position of the baseline pixel of the font
 * @param spacewidth the number of pixels a space takes
 * @param treshold minimal color match proportion (0-1) before a pixel is used for the font
 * @param shadow whether this font also uses the black shadow some fonts have. The "unblended" image should be unblended correspondingly
 * @returns a javascript object describing the font which is used as input for the different read functions
 */
function generateFont(unblended, chars, seconds, bonusses, basey, spacewidth, treshold, shadow) {
    //settings vars
    treshold *= 255;
    //initial vars
    var miny = unblended.height - 1;
    var maxy = 0;
    var font = { chars: [], width: 0, spacewidth: spacewidth, shadow: shadow, height: 0, basey: 0 };
    var ds = false;
    var chardata = [];
    //index all chars
    for (var dx = 0; dx < unblended.width; dx++) {
        var i = 4 * dx + 4 * unblended.width * (unblended.height - 1);
        if (unblended.data[i] == 255 && unblended.data[i + 3] == 255) {
            if (ds === false) {
                ds = dx;
            }
        }
        else {
            if (ds !== false) {
                //char found, start detection
                var de = dx;
                var char = chars[chardata.length];
                var chr = {
                    ds: ds,
                    de: de,
                    width: de - ds,
                    chr: char,
                    bonus: (bonusses && bonusses[char]) || 0,
                    secondary: seconds.indexOf(chars[chardata.length]) != -1,
                    pixels: []
                };
                chardata.push(chr);
                font.width = Math.max(font.width, chr.width);
                for (x = 0; x < de - ds; x++) {
                    for (y = 0; y < unblended.height - 1; y++) {
                        var i = (x + ds) * 4 + y * unblended.width * 4;
                        if (unblended.data[i] >= treshold) {
                            miny = Math.min(miny, y);
                            maxy = Math.max(maxy, y);
                        }
                    }
                }
                ds = false;
            }
        }
    }
    font.height = maxy + 1 - miny;
    font.basey = basey - miny;
    //detect all pixels
    for (var a in chardata) {
        var chr = chardata[a];
        for (var x = 0; x < chr.width; x++) {
            for (var y = 0; y < maxy + 1 - miny; y++) {
                var i = (x + chr.ds) * 4 + (y + miny) * unblended.width * 4;
                if (unblended.data[i] >= treshold) {
                    chr.pixels.push(x, y);
                    chr.pixels.push(unblended.data[i]);
                    if (shadow) {
                        chr.pixels.push(unblended.data[i + 1]);
                    }
                    chr.bonus += 5;
                }
            }
        }
        //prevent js from doing the thing with unnecessary output precision
        chr.bonus = +chr.bonus.toFixed(3);
        font.chars.push({ width: chr.width, bonus: chr.bonus, chr: chr.chr, pixels: chr.pixels, secondary: chr.secondary });
    }
    return font;
}
exports.generateFont = generateFont;


/***/ }),

/***/ "alt1/base":
/*!**************************************************************************************************!*\
  !*** external {"root":"A1lib","commonjs2":"alt1/base","commonjs":"alt1/base","amd":"alt1/base"} ***!
  \**************************************************************************************************/
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE_alt1_base__;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nested_webpack_require_27782__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __nested_webpack_require_27782__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __nested_webpack_exports__ = __nested_webpack_require_27782__("./src/ocr/index.ts");
/******/ 	
/******/ 	return __nested_webpack_exports__;
/******/ })()
;
});

/***/ },

/***/ "../node_modules/alt1/dist/targetmob/index.js"
/*!****************************************************!*\
  !*** ../node_modules/alt1/dist/targetmob/index.js ***!
  \****************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

(function webpackUniversalModuleDefinition(root, factory) {
	if(true)
		module.exports = factory(__webpack_require__(/*! alt1/base */ "../node_modules/alt1/dist/base/index.js"), __webpack_require__(/*! alt1/ocr */ "../node_modules/alt1/dist/ocr/index.js"));
	else // removed by dead control flow
{}
})(globalThis, (__WEBPACK_EXTERNAL_MODULE_alt1_base__, __WEBPACK_EXTERNAL_MODULE_alt1_ocr__) => {
return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/targetmob/imgs/detectimg.data.png":
/*!***********************************************!*\
  !*** ./src/targetmob/imgs/detectimg.data.png ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports=(__webpack_require__(/*! alt1/base */ "alt1/base").ImageDetect.imageDataFromBase64)("iVBORw0KGgoAAAANSUhEUgAAABoAAAARCAYAAADDjbwNAAAAAW5vUEUAYtdMlAAAAARub1BFAAAAAEEgjiIAAAAJbm9QRQAAAAAAAAAAAKGKctUAAAAYbm9QRQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFYtZUsAAACJSURBVDhPtc09CoNAGIThZSEuG3KHLVKJCIJgfpAYxG5vkDL3v8NIAjZmCJ/CFE/zFjMOwG5VP8HHE0J9xzGVf9EBq3Pbf48Oj4xweSJ0A4rr+OPT6YDVcmRBB6xSc4MVHVCgUYFGBRoVaFSgUYFGBRoVaFSgUYFGBZdfb2yxHrByvoiw2n8ENwOqvL/qtsOgigAAAABJRU5ErkJggg==")

/***/ }),

/***/ "./src/targetmob/imgs/detectimgLegacy.data.png":
/*!*****************************************************!*\
  !*** ./src/targetmob/imgs/detectimgLegacy.data.png ***!
  \*****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports=(__webpack_require__(/*! alt1/base */ "alt1/base").ImageDetect.imageDataFromBase64)("iVBORw0KGgoAAAANSUhEUgAAABoAAAARBAMAAAAxo6E+AAAAAW5vUEUAYtdMlAAAAAlub1BFAAAAAAAAAAAAoYpy1QAAACRQTFRFAAAAbWRDHxwbTDgiPjUoUEUrVkwzSUIxXVk5YVxCdG9fIyAfxdcx+QAAAAx0Uk5TAP//////////////CcRQJgAAADVJREFUeJxjZIAARiVBASAJ46k4MrxngvMUwSSUx1HHfF8BzoOqGEy8VWAqDMrbDSL/u0F4AMZZBlfPT3X0AAAAAElFTkSuQmCC")

/***/ }),

/***/ "./src/targetmob/index.ts":
/*!********************************!*\
  !*** ./src/targetmob/index.ts ***!
  \********************************/
/***/ (function(__unused_webpack_module, exports, __nested_webpack_require_2323__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const a1lib = __importStar(__nested_webpack_require_2323__(/*! alt1/base */ "alt1/base"));
const OCR = __importStar(__nested_webpack_require_2323__(/*! alt1/ocr */ "alt1/ocr"));
const base_1 = __nested_webpack_require_2323__(/*! alt1/base */ "alt1/base");
var chatfont = __nested_webpack_require_2323__(/*! ../fonts/aa_8px.fontmeta.json */ "./src/fonts/aa_8px.fontmeta.json");
var imgs = (0, base_1.webpackImages)({
    detectimg: __nested_webpack_require_2323__(/*! ./imgs/detectimg.data.png */ "./src/targetmob/imgs/detectimg.data.png"),
    detectleg: __nested_webpack_require_2323__(/*! ./imgs/detectimgLegacy.data.png */ "./src/targetmob/imgs/detectimgLegacy.data.png")
});
class TargetMobReader {
    constructor() {
        this.state = null;
        this.lastpos = null;
        this.legacy = false;
    }
    read(img) {
        if (!img) {
            img = a1lib.captureHoldFullRs();
        }
        if (!this.lastpos) {
            var leg = img.findSubimage(imgs.detectleg);
            if (leg.length != 0) {
                this.legacy = true;
            }
        }
        var pos = this.legacy ? img.findSubimage(imgs.detectleg) : img.findSubimage(imgs.detectimg);
        if (pos.length != 0) {
            var data = img.toData(pos[0].x - 151, pos[0].y - 16, 220, 44);
            var mobname = OCR.findReadLine(data, chatfont, [[255, 255, 255]], 62, 18, 20, 1);
            var mobhp = OCR.findReadLine(data, chatfont, [[255, 203, 5]], 92, 39, 20, 1);
            this.lastpos = pos[0];
            this.state = {
                name: mobname.text,
                hp: +mobhp.text.replace(/,/g, "")
            };
        }
        else {
            this.state = null;
        }
        return this.state;
    }
}
exports["default"] = TargetMobReader;


/***/ }),

/***/ "alt1/base":
/*!**************************************************************************************************!*\
  !*** external {"root":"A1lib","commonjs2":"alt1/base","commonjs":"alt1/base","amd":"alt1/base"} ***!
  \**************************************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE_alt1_base__;

/***/ }),

/***/ "alt1/ocr":
/*!*********************************************************************************************!*\
  !*** external {"root":"OCR","commonjs2":"alt1/ocr","commonjs":"alt1/ocr","amd":"alt1/ocr"} ***!
  \*********************************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE_alt1_ocr__;

/***/ }),

/***/ "./src/fonts/aa_8px.fontmeta.json":
/*!****************************************!*\
  !*** ./src/fonts/aa_8px.fontmeta.json ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"chars":[{"width":7,"bonus":140,"chr":"a","pixels":[0,7,187,255,1,3,221,255,1,6,169,255,1,7,164,132,1,8,255,255,2,3,255,255,2,4,221,0,2,5,196,243,2,7,170,0,2,8,255,255,2,9,255,0,3,3,255,255,3,4,255,0,3,5,255,255,3,6,187,0,3,8,221,255,3,9,255,0,4,4,254,239,4,5,255,255,4,6,254,204,4,7,255,255,4,8,240,253,4,9,221,0,5,5,240,36,5,6,255,34,5,7,211,41,5,8,255,34,5,9,238,0],"secondary":false},{"width":7,"bonus":175,"chr":"b","pixels":[0,1,203,255,0,2,221,255,0,3,221,255,0,4,221,255,0,5,221,255,0,6,221,255,0,7,221,255,0,8,203,255,1,2,211,41,1,3,248,209,1,4,243,178,1,5,230,75,1,6,230,75,1,7,243,178,1,8,246,194,1,9,204,0,2,3,255,255,2,4,204,0,2,5,170,0,2,8,255,255,2,9,187,0,3,3,255,255,3,4,255,0,3,8,255,255,3,9,255,0,4,3,169,255,4,4,254,171,4,7,169,255,4,9,255,0,5,4,204,128,5,5,232,205,5,6,205,233,5,8,170,0,6,6,187,0,6,7,187,0],"secondary":false},{"width":7,"bonus":95,"chr":"c","pixels":[0,5,169,255,0,6,187,255,1,4,187,255,1,6,193,90,1,7,237,201,1,8,164,185,2,3,255,255,2,5,187,0,2,8,255,255,3,3,255,255,3,4,255,0,3,8,255,255,3,9,255,0,4,3,221,255,4,4,255,34,4,8,221,255,4,9,255,0,5,4,226,39,5,9,221,0],"secondary":false},{"width":7,"bonus":180,"chr":"d","pixels":[0,5,187,255,0,6,187,255,1,4,169,255,1,6,205,85,1,7,232,187,1,8,203,213,2,3,255,255,2,5,170,0,2,8,255,255,2,9,170,0,3,3,255,255,3,4,255,0,3,8,255,255,3,9,255,0,4,3,203,255,4,4,254,171,4,7,169,255,4,8,187,255,4,9,255,0,5,1,203,255,5,2,225,251,5,3,225,251,5,4,248,227,5,5,244,231,5,6,230,245,5,7,230,245,5,8,237,219,5,9,187,0,6,2,204,0,6,3,221,0,6,4,221,0,6,5,221,0,6,6,221,0,6,7,221,0,6,8,221,0,6,9,204,0],"secondary":false},{"width":7,"bonus":135,"chr":"e","pixels":[0,5,187,255,0,6,169,255,1,4,187,255,1,5,255,255,1,6,209,104,1,7,237,219,2,3,255,255,2,5,255,255,2,6,255,0,2,8,255,255,3,3,255,255,3,4,255,0,3,5,255,255,3,6,255,0,3,8,255,255,3,9,255,0,4,3,187,255,4,4,255,119,4,5,255,255,4,6,255,0,4,8,221,255,4,9,255,0,5,4,224,155,5,5,227,229,5,6,255,0,5,9,221,0,6,6,204,0],"secondary":false},{"width":4,"bonus":90,"chr":"f","pixels":[0,3,203,255,1,2,221,255,1,3,255,255,1,4,248,227,1,5,225,251,1,6,225,251,1,7,225,251,1,8,210,247,2,1,255,255,2,3,255,255,2,4,255,0,2,5,221,0,2,6,221,0,2,7,221,0,2,8,221,0,2,9,204,0,3,2,255,0,3,4,255,0],"secondary":false},{"width":7,"bonus":200,"chr":"g","pixels":[0,5,187,255,0,6,187,255,1,3,169,255,1,4,153,255,1,5,155,112,1,6,205,85,1,7,232,187,1,8,184,189,1,11,153,255,2,3,255,255,2,4,170,0,2,5,153,0,2,8,255,255,2,11,245,247,3,3,255,255,3,4,255,0,3,8,255,255,3,9,255,0,3,11,221,255,4,3,221,255,4,4,255,136,4,7,153,255,4,8,221,255,4,9,255,85,4,10,203,255,5,3,203,255,5,4,250,226,5,5,239,236,5,6,230,245,5,7,230,245,5,8,241,234,5,9,243,178,5,11,204,0,6,4,204,0,6,5,221,0,6,6,221,0,6,7,221,0,6,8,221,0,6,9,221,0,6,10,170,0],"secondary":false},{"width":7,"bonus":165,"chr":"h","pixels":[0,1,203,255,0,2,221,255,0,3,221,255,0,4,221,255,0,5,221,255,0,6,221,255,0,7,221,255,0,8,203,255,1,2,211,41,1,3,243,178,1,4,248,209,1,5,230,75,1,6,226,39,1,7,226,39,1,8,226,39,1,9,204,0,2,3,255,255,2,4,170,0,2,5,204,0,3,3,255,255,3,4,255,0,4,3,169,255,4,4,255,221,4,5,221,255,4,6,221,255,4,7,221,255,4,8,203,255,5,4,175,25,5,5,226,39,5,6,226,39,5,7,226,39,5,8,226,39,5,9,204,0],"secondary":false},{"width":3,"bonus":70,"chr":"i","pixels":[0,1,237,255,0,3,203,255,0,4,221,255,0,5,221,255,0,6,221,255,0,7,221,255,0,8,203,255,1,2,238,0,1,4,211,41,1,5,226,39,1,6,226,39,1,7,226,39,1,8,226,39,1,9,204,0],"secondary":false},{"width":4,"bonus":90,"chr":"j","pixels":[0,11,153,255,1,11,169,255,2,1,203,255,2,3,203,255,2,4,225,251,2,5,225,251,2,6,225,251,2,7,225,251,2,8,225,251,2,9,225,251,3,2,204,0,3,4,204,0,3,5,221,0,3,6,221,0,3,7,221,0,3,8,221,0,3,9,221,0,3,10,221,0],"secondary":false},{"width":6,"bonus":130,"chr":"k","pixels":[0,1,203,255,0,2,221,255,0,3,221,255,0,4,221,255,0,5,221,255,0,6,221,255,0,7,221,255,0,8,203,255,1,2,211,41,1,3,226,39,1,4,226,39,1,5,255,255,1,6,226,39,1,7,226,39,1,8,226,39,1,9,204,0,2,4,166,235,2,5,255,255,2,6,255,221,3,3,203,255,3,5,153,0,3,6,255,51,3,7,250,226,3,8,160,217,4,4,204,0,4,8,239,145],"secondary":false},{"width":3,"bonus":75,"chr":"l","pixels":[0,1,203,255,0,2,221,255,0,3,221,255,0,4,221,255,0,5,221,255,0,6,221,255,0,7,221,255,1,2,211,41,1,3,226,39,1,4,226,39,1,5,226,39,1,6,226,39,1,7,226,39,1,8,255,255,2,9,255,0],"secondary":false},{"width":10,"bonus":210,"chr":"m","pixels":[0,3,203,255,0,4,221,255,0,5,221,255,0,6,221,255,0,7,221,255,0,8,203,255,1,4,248,227,1,5,230,75,1,6,226,39,1,7,226,39,1,8,226,39,1,9,204,0,2,3,237,255,2,5,221,0,3,3,255,255,3,4,238,0,4,3,153,255,4,4,255,255,4,5,221,255,4,6,221,255,4,7,221,255,4,8,203,255,5,4,228,209,5,5,255,68,5,6,226,39,5,7,226,39,5,8,226,39,5,9,204,0,6,3,255,255,6,5,187,0,7,3,237,255,7,4,255,85,8,4,249,174,8,5,232,243,8,6,225,251,8,7,225,251,8,8,210,247,9,5,170,0,9,6,221,0,9,7,221,0,9,8,221,0,9,9,204,0],"secondary":false},{"width":7,"bonus":140,"chr":"n","pixels":[0,3,203,255,0,4,221,255,0,5,221,255,0,6,221,255,0,7,221,255,0,8,203,255,1,4,248,227,1,5,232,93,1,6,226,39,1,7,226,39,1,8,226,39,1,9,204,0,2,3,237,255,2,5,221,0,3,3,255,255,3,4,238,0,4,3,237,255,4,4,255,85,5,4,249,174,5,5,232,243,5,6,225,251,5,7,225,251,5,8,210,247,6,5,170,0,6,6,221,0,6,7,221,0,6,8,221,0,6,9,204,0],"secondary":false},{"width":8,"bonus":120,"chr":"o","pixels":[0,5,187,255,0,6,169,255,1,4,203,255,1,6,209,104,1,7,244,231,2,3,237,255,2,5,204,0,2,8,252,241,3,3,255,255,3,4,238,0,3,8,255,255,3,9,238,0,4,3,237,255,4,4,255,0,4,8,255,255,4,9,255,0,5,4,251,207,5,7,221,255,5,9,255,0,6,5,237,183,6,6,192,225,6,8,221,0,7,6,170,0,7,7,170,0],"secondary":false},{"width":6,"bonus":170,"chr":"p","pixels":[0,3,237,255,0,4,255,255,0,5,187,255,0,6,203,255,0,7,255,255,0,8,221,255,0,9,221,255,0,10,221,255,1,3,255,255,1,4,240,36,1,5,255,0,1,6,187,0,1,7,211,41,1,8,254,239,1,9,221,0,1,10,221,0,1,11,221,0,2,3,255,255,2,4,255,0,2,8,255,255,2,9,238,0,3,3,237,255,3,4,255,34,3,8,237,255,3,9,255,0,4,4,253,240,4,5,255,255,4,6,255,255,4,7,237,255,4,9,238,0,5,5,239,18,5,6,255,17,5,7,255,0,5,8,238,0],"secondary":false},{"width":7,"bonus":165,"chr":"q","pixels":[0,5,187,255,0,6,187,255,1,3,169,255,1,4,153,255,1,5,155,112,1,6,205,85,1,7,228,171,1,8,209,207,2,3,255,255,2,4,170,0,2,5,153,0,2,8,255,255,2,9,170,0,3,3,237,255,3,4,255,17,3,8,237,255,3,9,255,0,4,3,255,255,4,4,255,255,4,5,191,250,4,6,187,255,4,7,255,255,4,8,239,254,4,9,253,223,4,10,221,255,5,4,255,34,5,5,255,34,5,6,196,45,5,7,196,45,5,8,255,34,5,9,240,36,5,10,226,39,5,11,221,0],"secondary":false},{"width":4,"bonus":85,"chr":"r","pixels":[0,3,203,255,0,4,221,255,0,5,221,255,0,6,221,255,0,7,221,255,0,8,203,255,1,3,187,255,1,4,244,213,1,5,232,93,1,6,226,39,1,7,226,39,1,8,226,39,1,9,204,0,2,3,255,255,2,4,187,0,2,5,204,0,3,4,255,0],"secondary":false},{"width":6,"bonus":100,"chr":"s","pixels":[0,4,187,255,1,3,255,255,1,5,250,243,1,8,255,255,2,3,255,255,2,4,255,0,2,5,155,196,2,6,246,123,2,8,255,255,2,9,255,0,3,3,255,255,3,4,255,0,3,6,245,247,3,7,164,132,3,8,255,255,3,9,255,0,4,4,255,17,4,7,250,191,4,9,255,0,5,8,187,0],"secondary":false},{"width":5,"bonus":80,"chr":"t","pixels":[1,2,221,255,1,3,255,255,1,4,235,240,1,5,221,255,1,6,221,255,1,7,169,255,2,3,255,255,2,4,255,34,2,5,226,39,2,6,226,39,2,7,232,93,2,8,249,243,3,4,255,0,3,8,187,209,3,9,238,0,4,9,153,0],"secondary":false},{"width":6,"bonus":135,"chr":"u","pixels":[0,3,203,255,0,4,221,255,0,5,221,255,0,6,221,255,0,7,169,255,1,4,211,41,1,5,226,39,1,6,226,39,1,7,232,93,1,8,249,243,2,8,255,255,2,9,238,0,3,8,203,255,3,9,255,0,4,3,203,255,4,4,221,255,4,5,221,255,4,6,203,255,4,7,255,255,4,8,228,247,4,9,204,0,5,4,211,41,5,5,226,39,5,6,226,39,5,7,211,41,5,8,255,34,5,9,221,0],"secondary":false},{"width":6,"bonus":95,"chr":"v","pixels":[0,3,237,255,1,4,247,141,1,5,245,247,1,6,203,255,2,6,241,54,2,7,255,255,2,8,255,255,3,5,153,255,3,6,255,255,3,7,173,226,3,8,255,51,3,9,255,0,4,3,237,255,4,4,203,255,4,6,153,0,4,7,255,0,4,8,153,0,5,4,238,0,5,5,204,0],"secondary":false},{"width":10,"bonus":170,"chr":"w","pixels":[1,3,153,255,1,4,243,249,1,5,187,255,2,4,153,0,2,5,243,71,2,6,228,171,2,7,243,249,2,8,187,255,3,6,217,239,3,7,248,244,3,8,248,157,3,9,187,0,4,3,169,255,4,4,255,255,4,7,204,0,4,8,238,0,4,9,153,0,5,4,244,231,5,5,255,221,5,6,191,159,6,5,223,19,6,6,237,128,6,7,255,255,6,8,223,253,7,6,239,254,7,7,227,229,7,8,255,119,7,9,221,0,8,3,237,255,8,4,203,255,8,7,238,0,8,8,204,0,9,4,238,0,9,5,204,0],"secondary":false},{"width":6,"bonus":95,"chr":"x","pixels":[0,8,169,255,1,3,169,255,1,4,224,232,1,7,221,255,1,9,170,0,2,4,193,90,2,5,255,255,2,6,240,253,2,8,221,0,3,4,255,255,3,5,155,196,3,6,255,187,3,7,250,191,4,3,221,255,4,5,255,0,4,7,209,104,4,8,255,255,5,4,221,0,5,9,255,0],"secondary":false},{"width":6,"bonus":110,"chr":"y","pixels":[0,3,255,255,0,4,153,255,0,11,221,255,1,4,255,85,1,5,234,222,1,6,228,247,1,11,196,243,2,6,207,21,2,7,246,194,2,8,255,255,2,9,237,255,3,6,237,255,3,7,191,250,3,8,205,85,3,9,255,0,3,10,238,0,4,3,203,255,4,4,221,255,4,7,238,0,4,8,187,0,5,4,204,0,5,5,221,0],"secondary":false},{"width":6,"bonus":130,"chr":"z","pixels":[0,3,153,255,0,8,203,255,1,3,255,255,1,4,153,0,1,7,221,255,1,8,255,255,1,9,204,0,2,3,255,255,2,4,255,0,2,6,255,255,2,8,255,255,2,9,255,0,3,3,255,255,3,4,254,171,3,5,169,255,3,7,255,0,3,8,255,255,3,9,255,0,4,3,255,255,4,4,255,119,4,5,170,0,4,6,170,0,4,8,255,255,4,9,255,0,5,4,255,0,5,9,255,0],"secondary":false},{"width":8,"bonus":155,"chr":"A","pixels":[0,8,153,255,1,6,221,255,1,7,237,255,1,9,153,0,2,3,169,255,2,4,255,255,2,5,187,255,2,6,255,255,2,7,221,0,2,8,238,0,3,1,255,255,3,2,255,255,3,4,170,0,3,5,255,0,3,6,255,255,3,7,255,0,4,2,255,255,4,3,254,239,4,4,184,189,4,6,255,255,4,7,255,0,5,3,255,34,5,4,247,141,5,5,255,255,5,6,255,255,5,7,255,102,6,6,255,85,6,7,255,187,6,8,255,255,7,8,187,0,7,9,255,0],"secondary":false},{"width":7,"bonus":225,"chr":"B","pixels":[0,1,203,255,0,2,221,255,0,3,221,255,0,4,221,255,0,5,221,255,0,6,221,255,0,7,221,255,0,8,203,255,1,1,255,255,1,2,211,41,1,3,226,39,1,4,255,255,1,5,226,39,1,6,226,39,1,7,226,39,1,8,255,255,1,9,204,0,2,1,255,255,2,2,255,0,2,4,255,255,2,5,255,0,2,8,255,255,2,9,255,0,3,1,255,255,3,2,255,0,3,4,255,255,3,5,255,0,3,8,255,255,3,9,255,0,4,1,221,255,4,2,255,85,4,4,255,255,4,5,254,171,4,8,203,255,4,9,255,0,5,2,243,178,5,3,198,219,5,5,255,102,5,6,232,205,5,7,180,217,5,9,204,0,6,3,170,0,6,4,170,0,6,7,187,0,6,8,153,0],"secondary":false},{"width":9,"bonus":155,"chr":"C","pixels":[0,4,187,255,0,5,187,255,1,2,221,255,1,3,153,255,1,4,155,112,1,5,205,85,1,6,228,171,1,7,224,232,2,1,169,255,2,3,221,0,2,4,153,0,2,7,194,135,2,8,237,183,3,1,255,255,3,2,170,0,3,8,255,255,3,9,170,0,4,1,255,255,4,2,255,0,4,8,255,255,4,9,255,0,5,1,255,255,5,2,255,0,5,8,255,255,5,9,255,0,6,1,169,255,6,2,255,102,6,8,169,255,6,9,255,0,7,2,181,48,7,9,170,0],"secondary":false},{"width":8,"bonus":200,"chr":"D","pixels":[0,1,203,255,0,2,221,255,0,3,221,255,0,4,221,255,0,5,221,255,0,6,221,255,0,7,221,255,0,8,203,255,1,1,255,255,1,2,211,41,1,3,226,39,1,4,226,39,1,5,226,39,1,6,226,39,1,7,226,39,1,8,255,255,1,9,204,0,2,1,255,255,2,2,255,0,2,8,255,255,2,9,255,0,3,1,255,255,3,2,255,0,3,8,255,255,3,9,255,0,4,1,203,255,4,2,255,68,4,8,203,255,4,9,255,0,5,2,248,227,5,3,168,207,5,7,221,255,5,9,204,0,6,3,237,128,6,4,223,214,6,5,205,233,6,6,155,196,6,8,221,0,7,5,187,0,7,6,187,0],"secondary":false},{"width":6,"bonus":180,"chr":"E","pixels":[0,1,203,255,0,2,221,255,0,3,221,255,0,4,221,255,0,5,221,255,0,6,221,255,0,7,221,255,0,8,203,255,1,1,255,255,1,2,211,41,1,3,226,39,1,4,226,39,1,5,255,255,1,6,226,39,1,7,226,39,1,8,255,255,1,9,204,0,2,1,255,255,2,2,255,0,2,5,255,255,2,6,255,0,2,8,255,255,2,9,255,0,3,1,255,255,3,2,255,0,3,5,255,255,3,6,255,0,3,8,255,255,3,9,255,0,4,1,153,255,4,2,255,0,4,6,255,0,4,8,221,255,4,9,255,0,5,2,153,0,5,9,221,0],"secondary":false},{"width":6,"bonus":135,"chr":"F","pixels":[0,1,203,255,0,2,221,255,0,3,221,255,0,4,221,255,0,5,221,255,0,6,221,255,0,7,221,255,0,8,203,255,1,1,255,255,1,2,211,41,1,3,226,39,1,4,226,39,1,5,255,255,1,6,226,39,1,7,226,39,1,8,226,39,1,9,204,0,2,1,255,255,2,2,255,0,2,5,255,255,2,6,255,0,3,1,255,255,3,2,255,0,3,5,255,255,3,6,255,0,4,2,255,0,4,6,255,0],"secondary":false},{"width":9,"bonus":200,"chr":"G","pixels":[0,4,169,255,0,5,187,255,1,2,203,255,1,3,153,255,1,5,193,90,1,6,224,155,1,7,237,238,2,1,169,255,2,3,204,0,2,4,153,0,2,7,175,124,2,8,246,194,3,1,255,255,3,2,170,0,3,8,255,255,3,9,187,0,4,1,255,255,4,2,255,0,4,8,255,255,4,9,255,0,5,1,255,255,5,2,255,0,5,8,237,255,5,9,255,0,6,1,169,255,6,2,255,85,6,5,255,255,6,7,153,255,6,8,169,255,6,9,238,0,7,2,175,25,7,5,153,255,7,6,255,221,7,7,225,251,7,8,234,222,7,9,170,0,8,6,153,0,8,7,221,0,8,8,221,0,8,9,204,0],"secondary":false},{"width":8,"bonus":200,"chr":"H","pixels":[0,1,203,255,0,2,221,255,0,3,221,255,0,4,221,255,0,5,221,255,0,6,221,255,0,7,221,255,0,8,203,255,1,2,211,41,1,3,226,39,1,4,226,39,1,5,255,255,1,6,226,39,1,7,226,39,1,8,226,39,1,9,204,0,2,5,255,255,2,6,255,0,3,5,255,255,3,6,255,0,4,5,255,255,4,6,255,0,5,5,255,255,5,6,255,34,6,1,203,255,6,2,225,251,6,3,225,251,6,4,225,251,6,5,225,251,6,6,255,221,6,7,225,251,6,8,210,247,7,2,204,0,7,3,221,0,7,4,221,0,7,5,221,0,7,6,221,0,7,7,221,0,7,8,221,0,7,9,204,0],"secondary":false},{"width":4,"bonus":110,"chr":"I","pixels":[0,1,191,255,0,8,191,255,1,1,255,255,1,2,255,255,1,3,255,255,1,4,255,255,1,5,255,255,1,6,255,255,1,7,255,255,1,8,255,255,1,9,191,0,2,1,191,255,2,2,255,0,2,3,255,0,2,4,255,0,2,5,255,0,2,6,255,0,2,7,255,0,2,8,255,191,2,9,255,0,3,2,192,0,3,9,191,0],"secondary":false},{"width":6,"bonus":130,"chr":"J","pixels":[0,6,153,255,0,7,153,255,1,7,194,135,1,8,234,222,2,1,221,255,2,8,255,255,2,9,204,0,3,1,255,255,3,2,226,39,3,8,203,255,3,9,255,0,4,1,203,255,4,2,255,221,4,3,225,251,4,4,225,251,4,5,225,251,4,6,225,251,4,7,166,235,4,9,204,0,5,2,204,0,5,3,221,0,5,4,221,0,5,5,221,0,5,6,221,0,5,7,221,0,5,8,153,0],"secondary":false},{"width":7,"bonus":155,"chr":"K","pixels":[0,1,203,255,0,2,221,255,0,3,221,255,0,4,221,255,0,5,221,255,0,6,221,255,0,7,221,255,0,8,203,255,1,2,211,41,1,3,226,39,1,4,255,255,1,5,226,39,1,6,226,39,1,7,226,39,1,8,226,39,1,9,204,0,2,4,255,255,2,5,255,102,3,3,221,255,3,5,254,171,3,6,224,232,4,1,203,255,4,2,153,255,4,4,221,0,4,6,193,90,4,7,251,242,4,8,173,226,5,2,204,0,5,3,153,0,5,8,247,141,5,9,153,0],"secondary":false},{"width":6,"bonus":115,"chr":"L","pixels":[0,1,203,255,0,2,221,255,0,3,221,255,0,4,221,255,0,5,221,255,0,6,221,255,0,7,221,255,0,8,203,255,1,2,211,41,1,3,226,39,1,4,226,39,1,5,226,39,1,6,226,39,1,7,226,39,1,8,255,255,1,9,204,0,2,8,255,255,2,9,255,0,3,8,255,255,3,9,255,0,4,8,255,255,4,9,255,0,5,9,255,0],"secondary":false},{"width":9,"bonus":240,"chr":"M","pixels":[0,1,245,255,0,2,255,255,0,3,255,255,0,4,255,255,0,5,255,255,0,6,255,255,0,7,255,255,0,8,255,255,1,2,251,173,1,3,255,225,1,4,255,85,1,5,255,0,1,6,255,0,1,7,255,0,1,8,255,0,1,9,255,0,2,3,191,83,2,4,249,212,2,5,212,229,3,5,226,119,3,6,249,237,3,7,165,227,4,6,241,245,4,7,245,155,4,8,155,32,5,4,207,255,5,5,191,254,5,7,232,0,6,2,169,255,6,3,223,255,6,5,207,0,6,6,190,0,7,1,245,255,7,2,255,255,7,3,255,255,7,4,255,255,7,5,255,255,7,6,255,255,7,7,255,255,7,8,255,255,8,2,245,0,8,3,255,0,8,4,255,0,8,5,255,0,8,6,255,0,8,7,255,0,8,8,255,0,8,9,255,0],"secondary":false},{"width":8,"bonus":200,"chr":"N","pixels":[0,1,203,255,0,2,221,255,0,3,221,255,0,4,221,255,0,5,221,255,0,6,221,255,0,7,221,255,0,8,203,255,1,2,255,255,1,3,235,111,1,4,226,39,1,5,226,39,1,6,226,39,1,7,226,39,1,8,226,39,1,9,204,0,2,3,255,221,2,4,163,160,3,4,246,194,3,5,214,223,4,5,214,122,4,6,246,229,5,6,163,160,5,7,255,255,6,1,203,255,6,2,225,251,6,3,225,251,6,4,225,251,6,5,225,251,6,6,225,251,6,7,235,240,6,8,254,204,7,2,204,0,7,3,221,0,7,4,221,0,7,5,221,0,7,6,221,0,7,7,221,0,7,8,221,0,7,9,204,0],"secondary":false},{"width":10,"bonus":200,"chr":"O","pixels":[0,4,187,255,0,5,169,255,1,2,203,255,1,3,153,255,1,5,205,85,1,6,226,192,1,7,224,232,2,1,153,255,2,3,204,0,2,4,153,0,2,7,209,145,2,8,234,167,3,1,255,255,3,2,153,0,3,8,255,255,3,9,153,0,4,1,255,255,4,2,255,0,4,8,255,255,4,9,255,0,5,1,255,255,5,2,255,0,5,8,255,255,5,9,255,0,6,1,153,255,6,2,255,102,6,8,153,255,6,9,255,0,7,2,234,222,7,3,194,201,7,6,169,255,7,7,203,255,7,9,153,0,8,3,225,116,8,4,228,209,8,5,192,225,8,7,170,0,8,8,204,0,9,5,187,0,9,6,170,0],"secondary":false},{"width":7,"bonus":165,"chr":"P","pixels":[0,1,203,255,0,2,221,255,0,3,221,255,0,4,221,255,0,5,221,255,0,6,221,255,0,7,221,255,0,8,203,255,1,1,255,255,1,2,211,41,1,3,226,39,1,4,226,39,1,5,255,255,1,6,226,39,1,7,226,39,1,8,226,39,1,9,204,0,2,1,255,255,2,2,255,0,2,5,255,255,2,6,255,0,3,1,255,255,3,2,255,0,3,5,255,255,3,6,255,0,4,1,187,255,4,2,255,136,4,5,187,255,4,6,255,0,5,2,224,155,5,3,239,236,5,6,187,0,6,4,221,0],"secondary":false},{"width":9,"bonus":185,"chr":"Q","pixels":[0,4,187,255,0,5,187,255,1,2,221,255,1,4,155,112,1,5,205,85,1,6,228,171,1,7,235,240,2,1,187,255,2,3,221,0,2,7,187,116,2,8,243,178,3,1,255,255,3,2,187,0,3,8,255,255,3,9,170,0,4,1,255,255,4,2,255,0,4,8,255,255,4,9,255,0,5,1,237,255,5,2,255,0,5,8,237,255,5,9,255,0,6,2,251,207,6,7,255,255,6,9,238,0,7,3,255,255,7,4,203,255,7,5,221,255,7,6,255,255,7,7,155,196,7,8,254,204,8,4,255,17,8,5,207,21,8,6,221,0,8,7,255,0,8,9,204,0],"secondary":false},{"width":7,"bonus":180,"chr":"R","pixels":[0,1,203,255,0,2,221,255,0,3,221,255,0,4,221,255,0,5,221,255,0,6,221,255,0,7,221,255,0,8,203,255,1,1,255,255,1,2,211,41,1,3,226,39,1,4,226,39,1,5,255,255,1,6,226,39,1,7,226,39,1,8,226,39,1,9,204,0,2,1,255,255,2,2,255,0,2,5,255,255,2,6,255,0,3,1,255,255,3,2,255,0,3,5,255,255,3,6,255,187,4,2,254,239,4,3,203,255,4,4,255,255,4,6,255,68,4,7,250,243,4,8,181,239,5,3,239,18,5,4,204,0,5,5,255,0,5,8,245,107,5,9,170,0],"secondary":false},{"width":6,"bonus":130,"chr":"S","pixels":[0,2,153,255,0,3,169,255,1,1,203,255,1,3,187,116,1,4,244,231,1,8,243,249,2,1,255,255,2,2,204,0,2,4,198,219,2,5,232,93,2,8,255,255,2,9,238,0,3,1,255,255,3,2,255,0,3,5,255,255,3,8,255,255,3,9,255,0,4,1,169,255,4,2,255,68,4,5,160,217,4,6,255,221,4,7,237,255,4,9,255,0,5,2,170,0,5,7,223,19,5,8,238,0],"secondary":false},{"width":8,"bonus":125,"chr":"T","pixels":[0,1,255,255,1,1,255,255,1,2,255,0,2,1,255,255,2,2,255,34,3,1,255,255,3,2,255,221,3,3,225,251,3,4,225,251,3,5,225,251,3,6,225,251,3,7,225,251,3,8,210,247,4,1,255,255,4,2,255,0,4,3,221,0,4,4,221,0,4,5,221,0,4,6,221,0,4,7,221,0,4,8,221,0,4,9,204,0,5,1,255,255,5,2,255,0,6,2,255,0],"secondary":false},{"width":8,"bonus":165,"chr":"U","pixels":[0,1,203,255,0,2,221,255,0,3,221,255,0,4,221,255,0,5,221,255,0,6,187,255,1,2,211,41,1,3,226,39,1,4,226,39,1,5,226,39,1,6,230,75,1,7,232,187,1,8,184,189,2,8,255,255,3,8,255,255,3,9,255,0,4,8,221,255,4,9,255,0,5,1,203,255,5,2,221,255,5,3,221,255,5,4,221,255,5,5,221,255,5,6,255,255,5,7,237,255,5,9,221,0,6,2,211,41,6,3,226,39,6,4,226,39,6,5,226,39,6,6,223,19,6,7,255,0,6,8,238,0],"secondary":false},{"width":7,"bonus":125,"chr":"V","pixels":[0,1,255,255,0,2,187,255,1,2,255,68,1,3,228,171,1,4,255,255,1,5,153,255,2,4,153,0,2,5,255,85,2,6,228,209,2,7,242,251,3,6,164,185,3,7,255,255,3,8,251,207,4,4,203,255,4,5,237,255,4,8,255,0,4,9,204,0,5,1,169,255,5,2,255,255,5,3,153,255,5,5,204,0,5,6,238,0,6,2,170,0,6,3,255,0,6,4,153,0],"secondary":false},{"width":10,"bonus":245,"chr":"W","pixels":[0,1,255,255,0,2,221,255,1,2,255,17,1,3,237,128,1,4,223,214,1,5,255,255,1,6,203,255,2,5,191,23,2,6,255,136,2,7,255,255,2,8,255,255,3,3,153,255,3,4,237,255,3,5,221,255,3,7,168,103,3,8,255,0,3,9,255,0,4,1,255,255,4,2,255,255,4,3,187,209,4,4,153,0,4,5,238,0,4,6,221,0,5,2,255,102,5,3,254,171,5,4,248,244,5,5,203,255,6,4,170,0,6,5,241,54,6,6,231,150,6,7,255,255,6,8,255,255,7,4,153,255,7,5,237,255,7,6,241,252,7,7,207,188,7,8,255,85,7,9,255,0,8,1,237,255,8,2,237,255,8,3,153,255,8,4,153,171,8,5,153,0,8,6,238,0,8,7,238,0,8,8,153,0,9,2,238,0,9,3,238,0,9,4,153,0],"secondary":false},{"width":7,"bonus":130,"chr":"X","pixels":[0,8,169,255,1,1,187,255,1,2,220,236,1,7,237,255,1,9,170,0,2,2,205,85,2,3,248,227,2,4,166,235,2,5,255,255,2,6,153,255,2,8,238,0,3,3,155,196,3,4,255,255,3,5,248,244,3,6,255,51,3,7,153,0,4,2,237,255,4,5,255,51,4,6,251,207,4,7,186,233,5,1,203,255,5,3,238,0,5,7,225,116,5,8,255,255,6,2,204,0,6,9,255,0],"secondary":false},{"width":7,"bonus":90,"chr":"Y","pixels":[0,1,169,255,1,2,249,243,2,3,248,157,2,4,255,255,3,4,241,234,3,5,254,204,3,6,232,243,3,7,225,251,3,8,210,247,4,3,255,255,4,5,221,0,4,6,204,0,4,7,221,0,4,8,221,0,4,9,204,0,5,1,237,255,5,4,255,0,6,2,238,0],"secondary":false},{"width":7,"bonus":140,"chr":"Z","pixels":[0,8,187,255,1,1,255,255,1,7,221,255,1,8,255,255,1,9,187,0,2,1,255,255,2,2,255,0,2,5,203,255,2,8,255,255,2,9,255,0,3,1,255,255,3,2,255,0,3,4,203,255,3,6,204,0,3,8,255,255,3,9,255,0,4,1,255,255,4,2,255,221,4,5,204,0,4,8,255,255,4,9,255,0,5,1,187,255,5,2,255,34,5,3,221,0,5,8,153,255,5,9,255,0,6,2,187,0,6,9,153,0],"secondary":false},{"width":7,"bonus":170,"chr":"0","pixels":[0,2,153,255,0,3,221,255,0,4,255,255,0,5,255,255,0,6,237,255,0,7,169,255,1,1,187,255,1,3,153,0,1,4,221,0,1,5,255,0,1,6,255,0,1,7,243,71,1,8,237,219,2,1,187,255,2,2,187,0,2,8,205,233,2,9,211,41,3,1,221,255,3,2,205,85,3,8,203,255,3,9,187,0,4,2,243,178,4,3,255,255,4,4,187,255,4,5,187,255,4,6,237,255,4,7,169,255,4,9,204,0,5,3,170,0,5,4,255,0,5,5,187,0,5,6,187,0,5,7,238,0,5,8,170,0],"secondary":false},{"width":7,"bonus":100,"chr":"1","pixels":[1,8,187,255,2,1,203,255,2,2,224,232,2,3,219,218,2,4,187,255,2,5,187,255,2,6,187,255,2,7,187,255,2,8,237,255,2,9,187,0,3,2,218,80,3,3,218,80,3,4,205,85,3,5,205,85,3,6,205,85,3,7,205,85,3,8,241,215,3,9,238,0,4,8,168,207,4,9,204,0],"secondary":false},{"width":7,"bonus":105,"chr":"2","pixels":[1,8,255,255,2,1,187,255,2,6,153,255,2,8,223,214,2,9,255,0,3,1,203,255,3,2,187,0,3,5,153,255,3,7,153,0,3,8,219,218,3,9,187,0,4,1,187,255,4,2,234,167,4,4,203,255,4,6,153,0,4,8,187,255,4,9,187,0,5,2,214,122,5,3,200,152,5,5,204,0,5,9,187,0],"secondary":false},{"width":7,"bonus":105,"chr":"3","pixels":[0,8,203,255,1,1,187,255,1,8,191,250,1,9,204,0,2,1,187,255,2,2,196,45,2,4,187,255,2,5,174,150,2,8,203,255,2,9,187,0,3,2,246,229,3,3,210,247,3,5,241,215,3,6,173,175,3,7,169,255,3,9,204,0,4,3,227,57,4,4,204,0,4,6,228,133,4,7,174,150,4,8,170,0],"secondary":false},{"width":7,"bonus":150,"chr":"4","pixels":[0,6,237,255,1,4,187,255,1,6,219,218,1,7,238,0,2,3,169,255,2,5,187,0,2,6,219,218,2,7,187,0,3,1,187,255,3,2,153,255,3,3,155,112,3,4,193,90,3,6,203,255,3,7,205,85,4,1,187,255,4,2,237,201,4,3,228,209,4,4,205,233,4,5,205,233,4,6,242,251,4,7,241,198,4,8,205,233,5,2,187,0,5,3,187,0,5,4,187,0,5,5,187,0,5,6,224,155,5,7,238,0,5,8,187,0,5,9,187,0],"secondary":false},{"width":7,"bonus":130,"chr":"5","pixels":[1,1,237,255,1,2,187,255,1,3,187,255,1,4,187,255,1,8,207,251,2,1,187,255,2,2,238,0,2,3,187,0,2,4,237,201,2,5,187,0,2,8,187,255,2,9,204,0,3,1,187,255,3,2,187,0,3,4,203,255,3,5,191,23,3,8,203,255,3,9,187,0,4,2,187,0,4,5,251,242,4,6,191,250,4,7,221,255,4,9,204,0,5,6,243,71,5,7,191,23,5,8,221,0],"secondary":false},{"width":7,"bonus":150,"chr":"6","pixels":[0,3,169,255,0,4,255,255,0,5,255,255,0,6,237,255,0,7,153,255,1,2,187,255,1,4,209,145,1,5,255,68,1,6,255,0,1,7,246,123,1,8,228,209,2,1,203,255,2,3,187,0,2,4,200,238,2,8,219,218,2,9,187,0,3,1,187,255,3,2,204,0,3,4,203,255,3,5,205,85,3,8,187,255,3,9,187,0,4,2,187,0,4,5,248,227,4,6,255,255,4,7,187,255,4,9,187,0,5,6,221,0,5,7,255,0,5,8,187,0],"secondary":false},{"width":7,"bonus":105,"chr":"7","pixels":[0,1,187,255,1,1,187,255,1,2,187,0,1,8,203,255,2,1,187,255,2,2,187,0,2,6,237,255,2,7,153,255,2,9,204,0,3,1,187,255,3,2,205,85,3,3,153,255,3,4,221,255,3,7,238,0,3,8,153,0,4,1,255,255,4,2,237,201,4,4,153,0,4,5,221,0,5,2,255,0,5,3,187,0],"secondary":false},{"width":7,"bonus":165,"chr":"8","pixels":[1,2,237,255,1,3,221,255,1,6,203,255,1,7,228,247,2,1,203,255,2,3,241,54,2,4,248,209,2,5,186,233,2,7,207,21,2,8,250,226,3,1,187,255,3,2,204,0,3,4,186,233,3,5,221,98,3,6,170,0,3,8,191,250,3,9,221,0,4,1,221,255,4,2,209,104,4,4,169,255,4,5,237,219,4,8,187,255,4,9,187,0,5,2,243,178,5,3,187,209,5,5,204,128,5,6,251,242,5,7,240,253,5,9,187,0,6,3,170,0,6,4,153,0,6,7,238,0,6,8,238,0],"secondary":false},{"width":7,"bonus":160,"chr":"9","pixels":[1,2,221,255,1,3,191,250,1,4,242,251,1,8,153,255,2,1,203,255,2,3,221,0,2,4,191,23,2,5,253,223,2,8,191,250,2,9,153,0,3,1,187,255,3,2,204,0,3,5,191,250,3,6,221,0,3,8,203,255,3,9,187,0,4,1,187,255,4,2,218,139,4,6,200,65,4,7,169,255,4,9,204,0,5,2,228,171,5,3,245,247,5,4,255,255,5,5,255,255,5,6,223,214,5,8,170,0,6,3,153,0,6,4,238,0,6,5,255,0,6,6,255,0,6,7,187,0],"secondary":false},{"width":8,"bonus":130,"chr":"%","pixels":[0,3,255,255,0,8,255,255,1,2,255,255,1,4,255,255,1,7,255,255,1,9,255,0,2,3,255,255,2,5,255,41,2,6,255,255,2,8,255,0,3,4,255,41,3,5,255,255,3,7,255,0,4,4,255,255,4,6,255,92,4,7,255,255,5,3,255,255,5,5,255,0,5,6,255,255,5,8,255,255,6,2,255,255,6,4,255,0,6,7,255,255,6,9,255,0,7,3,255,0,7,8,255,0],"secondary":false},{"width":4,"bonus":80,"chr":"/","pixels":[0,7,153,255,0,8,237,255,0,9,221,255,1,4,187,255,1,5,237,255,1,6,169,255,1,8,153,0,1,9,238,0,1,10,221,0,2,1,221,255,2,2,221,255,2,5,187,0,2,6,238,0,2,7,170,0,3,2,221,0,3,3,221,0],"secondary":false},{"width":7,"bonus":110,"chr":"+","pixels":[0,5,221,255,1,5,255,255,1,6,221,0,2,5,255,255,2,6,255,34,3,2,153,255,3,3,223,253,3,4,225,251,3,5,255,255,3,6,255,221,3,7,225,251,3,8,210,247,4,3,153,0,4,4,221,0,4,5,255,255,4,6,255,0,4,7,221,0,4,8,221,0,4,9,204,0,5,5,255,255,5,6,255,0,6,6,255,0],"secondary":false},{"width":5,"bonus":75,"chr":"?","pixels":[0,1,169,255,1,1,255,255,1,2,170,0,1,6,221,255,1,8,255,255,2,1,255,255,2,2,255,0,2,5,169,255,2,7,221,0,2,9,255,0,3,2,255,255,3,3,221,255,3,6,170,0,4,3,255,17,4,4,221,0],"secondary":false},{"width":2,"bonus":70,"chr":"!","pixels":[0,1,169,255,0,2,187,255,0,3,187,255,0,4,187,255,0,5,187,255,0,6,169,255,0,8,255,255,1,2,181,48,1,3,196,45,1,4,196,45,1,5,196,45,1,6,196,45,1,7,170,0,1,9,255,0],"secondary":false},{"width":8,"bonus":230,"chr":"@","pixels":[0,4,255,255,0,5,255,255,0,6,221,255,0,7,255,255,0,8,187,255,1,3,221,255,1,5,255,0,1,6,255,34,1,7,221,0,1,8,255,68,1,9,250,243,2,2,221,255,2,4,232,93,2,5,255,255,2,6,237,255,2,7,255,255,2,10,248,157,3,2,255,255,3,3,221,0,3,4,255,255,3,6,255,0,3,7,241,54,3,8,254,204,3,10,214,223,3,11,153,0,4,2,237,255,4,3,255,0,4,4,255,255,4,5,255,0,4,8,255,255,4,9,204,0,4,11,187,0,5,3,253,240,5,4,255,255,5,5,255,221,5,6,221,255,5,7,221,255,5,8,237,255,5,9,255,0,6,4,240,36,6,5,255,34,6,6,226,39,6,7,226,39,6,8,250,226,6,9,238,0,7,9,221,0],"secondary":false},{"width":8,"bonus":200,"chr":"#","pixels":[0,6,255,255,1,3,255,255,1,6,255,255,1,7,254,171,1,8,237,255,2,1,169,255,2,2,237,255,2,3,255,255,2,4,255,221,2,5,175,247,2,6,255,255,2,7,255,85,2,8,170,0,2,9,238,0,3,2,170,0,3,3,255,255,3,4,255,0,3,5,221,0,3,6,255,255,3,7,255,0,4,3,255,255,4,4,255,153,4,5,203,255,4,6,255,255,4,7,254,239,4,8,187,255,5,1,255,255,5,2,187,255,5,3,255,255,5,4,255,85,5,5,159,27,5,6,255,255,5,7,255,0,5,8,238,0,5,9,187,0,6,2,255,0,6,3,255,255,6,4,255,0,6,7,255,0,7,4,255,0],"secondary":false},{"width":6,"bonus":130,"chr":"$","pixels":[0,2,153,255,0,3,169,255,1,1,203,255,1,3,187,116,1,4,244,231,1,8,243,249,2,0,203,255,2,1,237,255,2,2,204,0,2,4,176,197,2,5,237,128,2,8,240,253,2,9,251,207,3,1,251,242,3,2,239,18,3,5,247,245,3,6,164,132,3,8,255,255,3,9,240,36,3,10,204,0,4,2,240,36,4,6,249,174,4,7,198,219,4,9,255,0,5,7,170,0,5,8,170,0],"secondary":false},{"width":6,"bonus":75,"chr":"^","pixels":[0,4,153,255,0,5,237,255,1,2,203,255,1,3,221,255,1,5,153,0,1,6,238,0,2,1,221,255,2,2,230,245,2,3,218,80,2,4,221,0,3,2,227,57,3,3,246,194,3,4,230,245,4,4,187,0,4,5,239,145],"secondary":false},{"width":6,"bonus":35,"chr":"~","pixels":[1,5,255,255,2,5,221,255,2,6,255,51,3,6,250,226,4,5,203,255,4,7,221,0,5,6,204,0],"secondary":false},{"width":7,"bonus":175,"chr":"&","pixels":[0,6,187,255,1,2,237,255,1,3,255,255,1,4,191,250,1,5,187,255,1,7,224,155,1,8,223,214,2,1,255,255,2,3,238,0,2,4,255,255,2,5,191,23,2,6,187,0,2,8,255,255,2,9,187,0,3,1,255,255,3,2,255,0,3,4,255,255,3,5,255,0,3,8,255,255,3,9,255,0,4,2,255,0,4,4,255,255,4,5,255,34,4,8,187,255,4,9,255,0,5,3,203,255,5,4,255,255,5,5,255,221,5,6,196,243,5,7,155,196,5,9,187,0,6,4,234,167,6,5,255,0,6,6,221,0,6,7,187,0],"secondary":false},{"width":6,"bonus":70,"chr":"*","pixels":[0,2,169,255,1,2,169,255,1,3,237,219,1,4,255,255,2,1,203,255,2,2,240,253,2,3,255,255,2,4,228,133,2,5,255,0,3,2,237,183,3,3,245,107,3,4,255,153,4,3,170,0,4,5,153,0],"secondary":false},{"width":4,"bonus":100,"chr":"(","pixels":[0,3,173,255,0,4,239,255,0,5,253,255,0,6,229,255,0,7,171,255,1,1,193,255,1,2,203,255,1,4,188,64,1,5,241,25,1,6,252,46,1,7,240,112,1,8,238,218,1,9,210,232,2,0,209,255,2,2,194,2,2,3,204,0,2,9,223,111,2,10,245,224,3,1,210,0,3,11,216,0],"secondary":false},{"width":4,"bonus":75,"chr":")","pixels":[1,0,211,255,1,10,215,255,2,1,244,203,2,2,222,234,2,8,203,255,2,9,191,255,2,11,216,0,3,2,213,94,3,3,238,186,3,4,246,248,3,5,253,255,3,6,231,253,3,7,186,234,3,9,203,1,3,10,191,0],"secondary":false},{"width":7,"bonus":60,"chr":"_","pixels":[0,9,153,255,1,9,255,255,1,10,153,0,2,9,255,255,2,10,255,0,3,9,255,255,3,10,255,0,4,9,255,255,4,10,255,0,5,9,255,255,5,10,255,0,6,10,255,0],"secondary":false},{"width":4,"bonus":30,"chr":"-","pixels":[0,5,255,255,1,5,255,255,1,6,255,0,2,5,255,255,2,6,255,0,3,6,255,0],"secondary":true},{"width":8,"bonus":100,"chr":"=","pixels":[0,4,255,255,0,6,255,255,1,4,255,255,1,5,255,0,1,6,255,255,1,7,255,0,2,4,255,255,2,5,255,0,2,6,255,255,2,7,255,0,3,4,255,255,3,5,255,0,3,6,255,255,3,7,255,0,4,4,255,255,4,5,255,0,4,6,255,255,4,7,255,0,5,5,255,0,5,7,255,0],"secondary":false},{"width":3,"bonus":105,"chr":"[","pixels":[0,0,203,255,0,1,221,255,0,2,221,255,0,3,221,255,0,4,221,255,0,5,221,255,0,6,221,255,0,7,221,255,0,8,203,255,1,0,237,255,1,1,211,41,1,2,226,39,1,3,226,39,1,4,226,39,1,5,226,39,1,6,226,39,1,7,226,39,1,8,252,241,1,9,204,0,2,1,238,0,2,9,238,0],"secondary":false},{"width":3,"bonus":105,"chr":"]","pixels":[0,0,237,255,0,8,237,255,1,0,203,255,1,1,253,223,1,2,225,251,1,3,225,251,1,4,225,251,1,5,225,251,1,6,225,251,1,7,225,251,1,8,210,247,1,9,238,0,2,1,204,0,2,2,221,0,2,3,221,0,2,4,221,0,2,5,221,0,2,6,221,0,2,7,221,0,2,8,221,0,2,9,204,0],"secondary":false},{"width":5,"bonus":90,"chr":"{","pixels":[0,5,153,255,1,2,169,255,1,3,221,255,1,4,221,255,1,5,203,255,1,6,255,255,1,7,221,255,1,8,169,255,2,1,237,255,2,3,181,48,2,4,223,19,2,5,221,0,2,6,207,21,2,7,255,34,2,8,232,93,2,9,249,243,3,2,238,0,3,10,238,0],"secondary":false},{"width":5,"bonus":90,"chr":"}","pixels":[1,1,237,255,1,9,237,255,2,2,249,174,2,3,232,243,2,4,225,251,2,5,207,251,2,6,255,255,2,7,223,253,2,8,181,239,2,10,238,0,3,3,170,0,3,4,221,0,3,5,241,162,3,6,204,0,3,7,255,0,3,8,221,0,3,9,170,0,4,6,153,0],"secondary":false},{"width":3,"bonus":20,"chr":":","pixels":[1,3,255,255,1,7,255,255,2,4,255,0,2,8,255,0],"secondary":true},{"width":3,"bonus":40,"chr":";","pixels":[0,9,201,255,1,3,255,255,1,7,241,255,1,8,255,255,1,10,201,0,2,4,255,0,2,8,241,0,2,9,255,0],"secondary":true},{"width":3,"bonus":30,"chr":"\\"","pixels":[0,1,255,255,0,2,255,255,1,2,255,0,1,3,255,0,2,1,255,255,2,2,255,255],"secondary":true},{"width":2,"bonus":20,"chr":"\'","pixels":[0,1,255,255,0,2,177,255,1,2,255,30,1,3,177,0],"secondary":true},{"width":7,"bonus":70,"chr":"<","pixels":[0,5,203,255,1,5,255,255,1,6,228,133,2,4,237,255,2,6,254,239,3,4,169,255,3,5,238,0,3,6,175,247,3,7,243,89,4,3,221,255,4,5,170,0,4,7,244,231,5,4,221,0,5,8,221,0],"secondary":false},{"width":7,"bonus":80,"chr":">","pixels":[0,3,203,255,0,7,203,255,1,4,228,133,1,7,187,255,1,8,204,0,2,4,247,245,2,6,255,255,2,8,187,0,3,4,175,247,3,5,248,157,3,6,203,255,3,7,255,0,4,5,255,255,4,6,173,75,4,7,204,0,5,6,255,0],"secondary":false},{"width":5,"bonus":70,"chr":"\\\\","pixels":[1,1,153,255,1,2,255,255,1,3,203,255,2,2,153,0,2,3,255,51,2,4,231,150,2,5,255,255,2,6,203,255,3,6,255,34,3,7,231,150,3,8,255,255,3,9,207,251,4,9,255,0,4,10,204,0],"secondary":false},{"width":2,"bonus":10,"chr":".","pixels":[0,8,255,255,1,9,255,0],"secondary":true},{"width":3,"bonus":30,"chr":",","pixels":[0,9,205,255,1,7,205,255,1,8,255,255,1,10,205,0,2,8,205,0,2,9,255,0],"secondary":true},{"width":3,"bonus":100,"chr":"|","pixels":[0,1,221,255,0,2,221,255,0,3,221,255,0,4,221,255,0,5,221,255,0,6,221,255,0,7,221,255,0,8,221,255,0,9,221,255,0,10,203,255,1,2,226,39,1,3,226,39,1,4,226,39,1,5,226,39,1,6,226,39,1,7,226,39,1,8,226,39,1,9,226,39,1,10,226,39,1,11,204,0],"secondary":false}],"width":10,"spacewidth":3,"shadow":true,"height":12,"basey":8}');

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nested_webpack_require_38584__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __nested_webpack_require_38584__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __nested_webpack_exports__ = __nested_webpack_require_38584__("./src/targetmob/index.ts");
/******/ 	
/******/ 	return __nested_webpack_exports__;
/******/ })()
;
});

/***/ },

/***/ "../node_modules/html-to-image/es/apply-style.js"
/*!*******************************************************!*\
  !*** ../node_modules/html-to-image/es/apply-style.js ***!
  \*******************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   applyStyle: () => (/* binding */ applyStyle)
/* harmony export */ });
function applyStyle(node, options) {
    const { style } = node;
    if (options.backgroundColor) {
        style.backgroundColor = options.backgroundColor;
    }
    if (options.width) {
        style.width = `${options.width}px`;
    }
    if (options.height) {
        style.height = `${options.height}px`;
    }
    const manual = options.style;
    if (manual != null) {
        Object.keys(manual).forEach((key) => {
            style[key] = manual[key];
        });
    }
    return node;
}
//# sourceMappingURL=apply-style.js.map

/***/ },

/***/ "../node_modules/html-to-image/es/clone-node.js"
/*!******************************************************!*\
  !*** ../node_modules/html-to-image/es/clone-node.js ***!
  \******************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   cloneNode: () => (/* binding */ cloneNode)
/* harmony export */ });
/* harmony import */ var _clone_pseudos__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./clone-pseudos */ "../node_modules/html-to-image/es/clone-pseudos.js");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./util */ "../node_modules/html-to-image/es/util.js");
/* harmony import */ var _mimes__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./mimes */ "../node_modules/html-to-image/es/mimes.js");
/* harmony import */ var _dataurl__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./dataurl */ "../node_modules/html-to-image/es/dataurl.js");




async function cloneCanvasElement(canvas) {
    const dataURL = canvas.toDataURL();
    if (dataURL === 'data:,') {
        return canvas.cloneNode(false);
    }
    return (0,_util__WEBPACK_IMPORTED_MODULE_1__.createImage)(dataURL);
}
async function cloneVideoElement(video, options) {
    if (video.currentSrc) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = video.clientWidth;
        canvas.height = video.clientHeight;
        ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataURL = canvas.toDataURL();
        return (0,_util__WEBPACK_IMPORTED_MODULE_1__.createImage)(dataURL);
    }
    const poster = video.poster;
    const contentType = (0,_mimes__WEBPACK_IMPORTED_MODULE_2__.getMimeType)(poster);
    const dataURL = await (0,_dataurl__WEBPACK_IMPORTED_MODULE_3__.resourceToDataURL)(poster, contentType, options);
    return (0,_util__WEBPACK_IMPORTED_MODULE_1__.createImage)(dataURL);
}
async function cloneIFrameElement(iframe, options) {
    var _a;
    try {
        if ((_a = iframe === null || iframe === void 0 ? void 0 : iframe.contentDocument) === null || _a === void 0 ? void 0 : _a.body) {
            return (await cloneNode(iframe.contentDocument.body, options, true));
        }
    }
    catch (_b) {
        // Failed to clone iframe
    }
    return iframe.cloneNode(false);
}
async function cloneSingleNode(node, options) {
    if ((0,_util__WEBPACK_IMPORTED_MODULE_1__.isInstanceOfElement)(node, HTMLCanvasElement)) {
        return cloneCanvasElement(node);
    }
    if ((0,_util__WEBPACK_IMPORTED_MODULE_1__.isInstanceOfElement)(node, HTMLVideoElement)) {
        return cloneVideoElement(node, options);
    }
    if ((0,_util__WEBPACK_IMPORTED_MODULE_1__.isInstanceOfElement)(node, HTMLIFrameElement)) {
        return cloneIFrameElement(node, options);
    }
    return node.cloneNode(isSVGElement(node));
}
const isSlotElement = (node) => node.tagName != null && node.tagName.toUpperCase() === 'SLOT';
const isSVGElement = (node) => node.tagName != null && node.tagName.toUpperCase() === 'SVG';
async function cloneChildren(nativeNode, clonedNode, options) {
    var _a, _b;
    if (isSVGElement(clonedNode)) {
        return clonedNode;
    }
    let children = [];
    if (isSlotElement(nativeNode) && nativeNode.assignedNodes) {
        children = (0,_util__WEBPACK_IMPORTED_MODULE_1__.toArray)(nativeNode.assignedNodes());
    }
    else if ((0,_util__WEBPACK_IMPORTED_MODULE_1__.isInstanceOfElement)(nativeNode, HTMLIFrameElement) &&
        ((_a = nativeNode.contentDocument) === null || _a === void 0 ? void 0 : _a.body)) {
        children = (0,_util__WEBPACK_IMPORTED_MODULE_1__.toArray)(nativeNode.contentDocument.body.childNodes);
    }
    else {
        children = (0,_util__WEBPACK_IMPORTED_MODULE_1__.toArray)(((_b = nativeNode.shadowRoot) !== null && _b !== void 0 ? _b : nativeNode).childNodes);
    }
    if (children.length === 0 ||
        (0,_util__WEBPACK_IMPORTED_MODULE_1__.isInstanceOfElement)(nativeNode, HTMLVideoElement)) {
        return clonedNode;
    }
    await children.reduce((deferred, child) => deferred
        .then(() => cloneNode(child, options))
        .then((clonedChild) => {
        if (clonedChild) {
            clonedNode.appendChild(clonedChild);
        }
    }), Promise.resolve());
    return clonedNode;
}
function cloneCSSStyle(nativeNode, clonedNode, options) {
    const targetStyle = clonedNode.style;
    if (!targetStyle) {
        return;
    }
    const sourceStyle = window.getComputedStyle(nativeNode);
    if (sourceStyle.cssText) {
        targetStyle.cssText = sourceStyle.cssText;
        targetStyle.transformOrigin = sourceStyle.transformOrigin;
    }
    else {
        (0,_util__WEBPACK_IMPORTED_MODULE_1__.getStyleProperties)(options).forEach((name) => {
            let value = sourceStyle.getPropertyValue(name);
            if (name === 'font-size' && value.endsWith('px')) {
                const reducedFont = Math.floor(parseFloat(value.substring(0, value.length - 2))) - 0.1;
                value = `${reducedFont}px`;
            }
            if ((0,_util__WEBPACK_IMPORTED_MODULE_1__.isInstanceOfElement)(nativeNode, HTMLIFrameElement) &&
                name === 'display' &&
                value === 'inline') {
                value = 'block';
            }
            if (name === 'd' && clonedNode.getAttribute('d')) {
                value = `path(${clonedNode.getAttribute('d')})`;
            }
            targetStyle.setProperty(name, value, sourceStyle.getPropertyPriority(name));
        });
    }
}
function cloneInputValue(nativeNode, clonedNode) {
    if ((0,_util__WEBPACK_IMPORTED_MODULE_1__.isInstanceOfElement)(nativeNode, HTMLTextAreaElement)) {
        clonedNode.innerHTML = nativeNode.value;
    }
    if ((0,_util__WEBPACK_IMPORTED_MODULE_1__.isInstanceOfElement)(nativeNode, HTMLInputElement)) {
        clonedNode.setAttribute('value', nativeNode.value);
    }
}
function cloneSelectValue(nativeNode, clonedNode) {
    if ((0,_util__WEBPACK_IMPORTED_MODULE_1__.isInstanceOfElement)(nativeNode, HTMLSelectElement)) {
        const clonedSelect = clonedNode;
        const selectedOption = Array.from(clonedSelect.children).find((child) => nativeNode.value === child.getAttribute('value'));
        if (selectedOption) {
            selectedOption.setAttribute('selected', '');
        }
    }
}
function decorate(nativeNode, clonedNode, options) {
    if ((0,_util__WEBPACK_IMPORTED_MODULE_1__.isInstanceOfElement)(clonedNode, Element)) {
        cloneCSSStyle(nativeNode, clonedNode, options);
        (0,_clone_pseudos__WEBPACK_IMPORTED_MODULE_0__.clonePseudoElements)(nativeNode, clonedNode, options);
        cloneInputValue(nativeNode, clonedNode);
        cloneSelectValue(nativeNode, clonedNode);
    }
    return clonedNode;
}
async function ensureSVGSymbols(clone, options) {
    const uses = clone.querySelectorAll ? clone.querySelectorAll('use') : [];
    if (uses.length === 0) {
        return clone;
    }
    const processedDefs = {};
    for (let i = 0; i < uses.length; i++) {
        const use = uses[i];
        const id = use.getAttribute('xlink:href');
        if (id) {
            const exist = clone.querySelector(id);
            const definition = document.querySelector(id);
            if (!exist && definition && !processedDefs[id]) {
                // eslint-disable-next-line no-await-in-loop
                processedDefs[id] = (await cloneNode(definition, options, true));
            }
        }
    }
    const nodes = Object.values(processedDefs);
    if (nodes.length) {
        const ns = 'http://www.w3.org/1999/xhtml';
        const svg = document.createElementNS(ns, 'svg');
        svg.setAttribute('xmlns', ns);
        svg.style.position = 'absolute';
        svg.style.width = '0';
        svg.style.height = '0';
        svg.style.overflow = 'hidden';
        svg.style.display = 'none';
        const defs = document.createElementNS(ns, 'defs');
        svg.appendChild(defs);
        for (let i = 0; i < nodes.length; i++) {
            defs.appendChild(nodes[i]);
        }
        clone.appendChild(svg);
    }
    return clone;
}
async function cloneNode(node, options, isRoot) {
    if (!isRoot && options.filter && !options.filter(node)) {
        return null;
    }
    return Promise.resolve(node)
        .then((clonedNode) => cloneSingleNode(clonedNode, options))
        .then((clonedNode) => cloneChildren(node, clonedNode, options))
        .then((clonedNode) => decorate(node, clonedNode, options))
        .then((clonedNode) => ensureSVGSymbols(clonedNode, options));
}
//# sourceMappingURL=clone-node.js.map

/***/ },

/***/ "../node_modules/html-to-image/es/clone-pseudos.js"
/*!*********************************************************!*\
  !*** ../node_modules/html-to-image/es/clone-pseudos.js ***!
  \*********************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   clonePseudoElements: () => (/* binding */ clonePseudoElements)
/* harmony export */ });
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util */ "../node_modules/html-to-image/es/util.js");

function formatCSSText(style) {
    const content = style.getPropertyValue('content');
    return `${style.cssText} content: '${content.replace(/'|"/g, '')}';`;
}
function formatCSSProperties(style, options) {
    return (0,_util__WEBPACK_IMPORTED_MODULE_0__.getStyleProperties)(options)
        .map((name) => {
        const value = style.getPropertyValue(name);
        const priority = style.getPropertyPriority(name);
        return `${name}: ${value}${priority ? ' !important' : ''};`;
    })
        .join(' ');
}
function getPseudoElementStyle(className, pseudo, style, options) {
    const selector = `.${className}:${pseudo}`;
    const cssText = style.cssText
        ? formatCSSText(style)
        : formatCSSProperties(style, options);
    return document.createTextNode(`${selector}{${cssText}}`);
}
function clonePseudoElement(nativeNode, clonedNode, pseudo, options) {
    const style = window.getComputedStyle(nativeNode, pseudo);
    const content = style.getPropertyValue('content');
    if (content === '' || content === 'none') {
        return;
    }
    const className = (0,_util__WEBPACK_IMPORTED_MODULE_0__.uuid)();
    try {
        clonedNode.className = `${clonedNode.className} ${className}`;
    }
    catch (err) {
        return;
    }
    const styleElement = document.createElement('style');
    styleElement.appendChild(getPseudoElementStyle(className, pseudo, style, options));
    clonedNode.appendChild(styleElement);
}
function clonePseudoElements(nativeNode, clonedNode, options) {
    clonePseudoElement(nativeNode, clonedNode, ':before', options);
    clonePseudoElement(nativeNode, clonedNode, ':after', options);
}
//# sourceMappingURL=clone-pseudos.js.map

/***/ },

/***/ "../node_modules/html-to-image/es/dataurl.js"
/*!***************************************************!*\
  !*** ../node_modules/html-to-image/es/dataurl.js ***!
  \***************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   fetchAsDataURL: () => (/* binding */ fetchAsDataURL),
/* harmony export */   isDataUrl: () => (/* binding */ isDataUrl),
/* harmony export */   makeDataUrl: () => (/* binding */ makeDataUrl),
/* harmony export */   resourceToDataURL: () => (/* binding */ resourceToDataURL)
/* harmony export */ });
function getContentFromDataUrl(dataURL) {
    return dataURL.split(/,/)[1];
}
function isDataUrl(url) {
    return url.search(/^(data:)/) !== -1;
}
function makeDataUrl(content, mimeType) {
    return `data:${mimeType};base64,${content}`;
}
async function fetchAsDataURL(url, init, process) {
    const res = await fetch(url, init);
    if (res.status === 404) {
        throw new Error(`Resource "${res.url}" not found`);
    }
    const blob = await res.blob();
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = reject;
        reader.onloadend = () => {
            try {
                resolve(process({ res, result: reader.result }));
            }
            catch (error) {
                reject(error);
            }
        };
        reader.readAsDataURL(blob);
    });
}
const cache = {};
function getCacheKey(url, contentType, includeQueryParams) {
    let key = url.replace(/\?.*/, '');
    if (includeQueryParams) {
        key = url;
    }
    // font resource
    if (/ttf|otf|eot|woff2?/i.test(key)) {
        key = key.replace(/.*\//, '');
    }
    return contentType ? `[${contentType}]${key}` : key;
}
async function resourceToDataURL(resourceUrl, contentType, options) {
    const cacheKey = getCacheKey(resourceUrl, contentType, options.includeQueryParams);
    if (cache[cacheKey] != null) {
        return cache[cacheKey];
    }
    // ref: https://developer.mozilla.org/en/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest#Bypassing_the_cache
    if (options.cacheBust) {
        // eslint-disable-next-line no-param-reassign
        resourceUrl += (/\?/.test(resourceUrl) ? '&' : '?') + new Date().getTime();
    }
    let dataURL;
    try {
        const content = await fetchAsDataURL(resourceUrl, options.fetchRequestInit, ({ res, result }) => {
            if (!contentType) {
                // eslint-disable-next-line no-param-reassign
                contentType = res.headers.get('Content-Type') || '';
            }
            return getContentFromDataUrl(result);
        });
        dataURL = makeDataUrl(content, contentType);
    }
    catch (error) {
        dataURL = options.imagePlaceholder || '';
        let msg = `Failed to fetch resource: ${resourceUrl}`;
        if (error) {
            msg = typeof error === 'string' ? error : error.message;
        }
        if (msg) {
            console.warn(msg);
        }
    }
    cache[cacheKey] = dataURL;
    return dataURL;
}
//# sourceMappingURL=dataurl.js.map

/***/ },

/***/ "../node_modules/html-to-image/es/embed-images.js"
/*!********************************************************!*\
  !*** ../node_modules/html-to-image/es/embed-images.js ***!
  \********************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   embedImages: () => (/* binding */ embedImages)
/* harmony export */ });
/* harmony import */ var _embed_resources__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./embed-resources */ "../node_modules/html-to-image/es/embed-resources.js");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./util */ "../node_modules/html-to-image/es/util.js");
/* harmony import */ var _dataurl__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./dataurl */ "../node_modules/html-to-image/es/dataurl.js");
/* harmony import */ var _mimes__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./mimes */ "../node_modules/html-to-image/es/mimes.js");




async function embedProp(propName, node, options) {
    var _a;
    const propValue = (_a = node.style) === null || _a === void 0 ? void 0 : _a.getPropertyValue(propName);
    if (propValue) {
        const cssString = await (0,_embed_resources__WEBPACK_IMPORTED_MODULE_0__.embedResources)(propValue, null, options);
        node.style.setProperty(propName, cssString, node.style.getPropertyPriority(propName));
        return true;
    }
    return false;
}
async function embedBackground(clonedNode, options) {
    ;
    (await embedProp('background', clonedNode, options)) ||
        (await embedProp('background-image', clonedNode, options));
    (await embedProp('mask', clonedNode, options)) ||
        (await embedProp('-webkit-mask', clonedNode, options)) ||
        (await embedProp('mask-image', clonedNode, options)) ||
        (await embedProp('-webkit-mask-image', clonedNode, options));
}
async function embedImageNode(clonedNode, options) {
    const isImageElement = (0,_util__WEBPACK_IMPORTED_MODULE_1__.isInstanceOfElement)(clonedNode, HTMLImageElement);
    if (!(isImageElement && !(0,_dataurl__WEBPACK_IMPORTED_MODULE_2__.isDataUrl)(clonedNode.src)) &&
        !((0,_util__WEBPACK_IMPORTED_MODULE_1__.isInstanceOfElement)(clonedNode, SVGImageElement) &&
            !(0,_dataurl__WEBPACK_IMPORTED_MODULE_2__.isDataUrl)(clonedNode.href.baseVal))) {
        return;
    }
    const url = isImageElement ? clonedNode.src : clonedNode.href.baseVal;
    const dataURL = await (0,_dataurl__WEBPACK_IMPORTED_MODULE_2__.resourceToDataURL)(url, (0,_mimes__WEBPACK_IMPORTED_MODULE_3__.getMimeType)(url), options);
    await new Promise((resolve, reject) => {
        clonedNode.onload = resolve;
        clonedNode.onerror = options.onImageErrorHandler
            ? (...attributes) => {
                try {
                    resolve(options.onImageErrorHandler(...attributes));
                }
                catch (error) {
                    reject(error);
                }
            }
            : reject;
        const image = clonedNode;
        if (image.decode) {
            image.decode = resolve;
        }
        if (image.loading === 'lazy') {
            image.loading = 'eager';
        }
        if (isImageElement) {
            clonedNode.srcset = '';
            clonedNode.src = dataURL;
        }
        else {
            clonedNode.href.baseVal = dataURL;
        }
    });
}
async function embedChildren(clonedNode, options) {
    const children = (0,_util__WEBPACK_IMPORTED_MODULE_1__.toArray)(clonedNode.childNodes);
    const deferreds = children.map((child) => embedImages(child, options));
    await Promise.all(deferreds).then(() => clonedNode);
}
async function embedImages(clonedNode, options) {
    if ((0,_util__WEBPACK_IMPORTED_MODULE_1__.isInstanceOfElement)(clonedNode, Element)) {
        await embedBackground(clonedNode, options);
        await embedImageNode(clonedNode, options);
        await embedChildren(clonedNode, options);
    }
}
//# sourceMappingURL=embed-images.js.map

/***/ },

/***/ "../node_modules/html-to-image/es/embed-resources.js"
/*!***********************************************************!*\
  !*** ../node_modules/html-to-image/es/embed-resources.js ***!
  \***********************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   embed: () => (/* binding */ embed),
/* harmony export */   embedResources: () => (/* binding */ embedResources),
/* harmony export */   parseURLs: () => (/* binding */ parseURLs),
/* harmony export */   shouldEmbed: () => (/* binding */ shouldEmbed)
/* harmony export */ });
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util */ "../node_modules/html-to-image/es/util.js");
/* harmony import */ var _mimes__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./mimes */ "../node_modules/html-to-image/es/mimes.js");
/* harmony import */ var _dataurl__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./dataurl */ "../node_modules/html-to-image/es/dataurl.js");



const URL_REGEX = /url\((['"]?)([^'"]+?)\1\)/g;
const URL_WITH_FORMAT_REGEX = /url\([^)]+\)\s*format\((["']?)([^"']+)\1\)/g;
const FONT_SRC_REGEX = /src:\s*(?:url\([^)]+\)\s*format\([^)]+\)[,;]\s*)+/g;
function toRegex(url) {
    // eslint-disable-next-line no-useless-escape
    const escaped = url.replace(/([.*+?^${}()|\[\]\/\\])/g, '\\$1');
    return new RegExp(`(url\\(['"]?)(${escaped})(['"]?\\))`, 'g');
}
function parseURLs(cssText) {
    const urls = [];
    cssText.replace(URL_REGEX, (raw, quotation, url) => {
        urls.push(url);
        return raw;
    });
    return urls.filter((url) => !(0,_dataurl__WEBPACK_IMPORTED_MODULE_2__.isDataUrl)(url));
}
async function embed(cssText, resourceURL, baseURL, options, getContentFromUrl) {
    try {
        const resolvedURL = baseURL ? (0,_util__WEBPACK_IMPORTED_MODULE_0__.resolveUrl)(resourceURL, baseURL) : resourceURL;
        const contentType = (0,_mimes__WEBPACK_IMPORTED_MODULE_1__.getMimeType)(resourceURL);
        let dataURL;
        if (getContentFromUrl) {
            const content = await getContentFromUrl(resolvedURL);
            dataURL = (0,_dataurl__WEBPACK_IMPORTED_MODULE_2__.makeDataUrl)(content, contentType);
        }
        else {
            dataURL = await (0,_dataurl__WEBPACK_IMPORTED_MODULE_2__.resourceToDataURL)(resolvedURL, contentType, options);
        }
        return cssText.replace(toRegex(resourceURL), `$1${dataURL}$3`);
    }
    catch (error) {
        // pass
    }
    return cssText;
}
function filterPreferredFontFormat(str, { preferredFontFormat }) {
    return !preferredFontFormat
        ? str
        : str.replace(FONT_SRC_REGEX, (match) => {
            // eslint-disable-next-line no-constant-condition
            while (true) {
                const [src, , format] = URL_WITH_FORMAT_REGEX.exec(match) || [];
                if (!format) {
                    return '';
                }
                if (format === preferredFontFormat) {
                    return `src: ${src};`;
                }
            }
        });
}
function shouldEmbed(url) {
    return url.search(URL_REGEX) !== -1;
}
async function embedResources(cssText, baseUrl, options) {
    if (!shouldEmbed(cssText)) {
        return cssText;
    }
    const filteredCSSText = filterPreferredFontFormat(cssText, options);
    const urls = parseURLs(filteredCSSText);
    return urls.reduce((deferred, url) => deferred.then((css) => embed(css, url, baseUrl, options)), Promise.resolve(filteredCSSText));
}
//# sourceMappingURL=embed-resources.js.map

/***/ },

/***/ "../node_modules/html-to-image/es/embed-webfonts.js"
/*!**********************************************************!*\
  !*** ../node_modules/html-to-image/es/embed-webfonts.js ***!
  \**********************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   embedWebFonts: () => (/* binding */ embedWebFonts),
/* harmony export */   getWebFontCSS: () => (/* binding */ getWebFontCSS)
/* harmony export */ });
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util */ "../node_modules/html-to-image/es/util.js");
/* harmony import */ var _dataurl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./dataurl */ "../node_modules/html-to-image/es/dataurl.js");
/* harmony import */ var _embed_resources__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./embed-resources */ "../node_modules/html-to-image/es/embed-resources.js");



const cssFetchCache = {};
async function fetchCSS(url) {
    let cache = cssFetchCache[url];
    if (cache != null) {
        return cache;
    }
    const res = await fetch(url);
    const cssText = await res.text();
    cache = { url, cssText };
    cssFetchCache[url] = cache;
    return cache;
}
async function embedFonts(data, options) {
    let cssText = data.cssText;
    const regexUrl = /url\(["']?([^"')]+)["']?\)/g;
    const fontLocs = cssText.match(/url\([^)]+\)/g) || [];
    const loadFonts = fontLocs.map(async (loc) => {
        let url = loc.replace(regexUrl, '$1');
        if (!url.startsWith('https://')) {
            url = new URL(url, data.url).href;
        }
        return (0,_dataurl__WEBPACK_IMPORTED_MODULE_1__.fetchAsDataURL)(url, options.fetchRequestInit, ({ result }) => {
            cssText = cssText.replace(loc, `url(${result})`);
            return [loc, result];
        });
    });
    return Promise.all(loadFonts).then(() => cssText);
}
function parseCSS(source) {
    if (source == null) {
        return [];
    }
    const result = [];
    const commentsRegex = /(\/\*[\s\S]*?\*\/)/gi;
    // strip out comments
    let cssText = source.replace(commentsRegex, '');
    // eslint-disable-next-line prefer-regex-literals
    const keyframesRegex = new RegExp('((@.*?keyframes [\\s\\S]*?){([\\s\\S]*?}\\s*?)})', 'gi');
    // eslint-disable-next-line no-constant-condition
    while (true) {
        const matches = keyframesRegex.exec(cssText);
        if (matches === null) {
            break;
        }
        result.push(matches[0]);
    }
    cssText = cssText.replace(keyframesRegex, '');
    const importRegex = /@import[\s\S]*?url\([^)]*\)[\s\S]*?;/gi;
    // to match css & media queries together
    const combinedCSSRegex = '((\\s*?(?:\\/\\*[\\s\\S]*?\\*\\/)?\\s*?@media[\\s\\S]' +
        '*?){([\\s\\S]*?)}\\s*?})|(([\\s\\S]*?){([\\s\\S]*?)})';
    // unified regex
    const unifiedRegex = new RegExp(combinedCSSRegex, 'gi');
    // eslint-disable-next-line no-constant-condition
    while (true) {
        let matches = importRegex.exec(cssText);
        if (matches === null) {
            matches = unifiedRegex.exec(cssText);
            if (matches === null) {
                break;
            }
            else {
                importRegex.lastIndex = unifiedRegex.lastIndex;
            }
        }
        else {
            unifiedRegex.lastIndex = importRegex.lastIndex;
        }
        result.push(matches[0]);
    }
    return result;
}
async function getCSSRules(styleSheets, options) {
    const ret = [];
    const deferreds = [];
    // First loop inlines imports
    styleSheets.forEach((sheet) => {
        if ('cssRules' in sheet) {
            try {
                (0,_util__WEBPACK_IMPORTED_MODULE_0__.toArray)(sheet.cssRules || []).forEach((item, index) => {
                    if (item.type === CSSRule.IMPORT_RULE) {
                        let importIndex = index + 1;
                        const url = item.href;
                        const deferred = fetchCSS(url)
                            .then((metadata) => embedFonts(metadata, options))
                            .then((cssText) => parseCSS(cssText).forEach((rule) => {
                            try {
                                sheet.insertRule(rule, rule.startsWith('@import')
                                    ? (importIndex += 1)
                                    : sheet.cssRules.length);
                            }
                            catch (error) {
                                console.error('Error inserting rule from remote css', {
                                    rule,
                                    error,
                                });
                            }
                        }))
                            .catch((e) => {
                            console.error('Error loading remote css', e.toString());
                        });
                        deferreds.push(deferred);
                    }
                });
            }
            catch (e) {
                const inline = styleSheets.find((a) => a.href == null) || document.styleSheets[0];
                if (sheet.href != null) {
                    deferreds.push(fetchCSS(sheet.href)
                        .then((metadata) => embedFonts(metadata, options))
                        .then((cssText) => parseCSS(cssText).forEach((rule) => {
                        inline.insertRule(rule, inline.cssRules.length);
                    }))
                        .catch((err) => {
                        console.error('Error loading remote stylesheet', err);
                    }));
                }
                console.error('Error inlining remote css file', e);
            }
        }
    });
    return Promise.all(deferreds).then(() => {
        // Second loop parses rules
        styleSheets.forEach((sheet) => {
            if ('cssRules' in sheet) {
                try {
                    (0,_util__WEBPACK_IMPORTED_MODULE_0__.toArray)(sheet.cssRules || []).forEach((item) => {
                        ret.push(item);
                    });
                }
                catch (e) {
                    console.error(`Error while reading CSS rules from ${sheet.href}`, e);
                }
            }
        });
        return ret;
    });
}
function getWebFontRules(cssRules) {
    return cssRules
        .filter((rule) => rule.type === CSSRule.FONT_FACE_RULE)
        .filter((rule) => (0,_embed_resources__WEBPACK_IMPORTED_MODULE_2__.shouldEmbed)(rule.style.getPropertyValue('src')));
}
async function parseWebFontRules(node, options) {
    if (node.ownerDocument == null) {
        throw new Error('Provided element is not within a Document');
    }
    const styleSheets = (0,_util__WEBPACK_IMPORTED_MODULE_0__.toArray)(node.ownerDocument.styleSheets);
    const cssRules = await getCSSRules(styleSheets, options);
    return getWebFontRules(cssRules);
}
function normalizeFontFamily(font) {
    return font.trim().replace(/["']/g, '');
}
function getUsedFonts(node) {
    const fonts = new Set();
    function traverse(node) {
        const fontFamily = node.style.fontFamily || getComputedStyle(node).fontFamily;
        fontFamily.split(',').forEach((font) => {
            fonts.add(normalizeFontFamily(font));
        });
        Array.from(node.children).forEach((child) => {
            if (child instanceof HTMLElement) {
                traverse(child);
            }
        });
    }
    traverse(node);
    return fonts;
}
async function getWebFontCSS(node, options) {
    const rules = await parseWebFontRules(node, options);
    const usedFonts = getUsedFonts(node);
    const cssTexts = await Promise.all(rules
        .filter((rule) => usedFonts.has(normalizeFontFamily(rule.style.fontFamily)))
        .map((rule) => {
        const baseUrl = rule.parentStyleSheet
            ? rule.parentStyleSheet.href
            : null;
        return (0,_embed_resources__WEBPACK_IMPORTED_MODULE_2__.embedResources)(rule.cssText, baseUrl, options);
    }));
    return cssTexts.join('\n');
}
async function embedWebFonts(clonedNode, options) {
    const cssText = options.fontEmbedCSS != null
        ? options.fontEmbedCSS
        : options.skipFonts
            ? null
            : await getWebFontCSS(clonedNode, options);
    if (cssText) {
        const styleNode = document.createElement('style');
        const sytleContent = document.createTextNode(cssText);
        styleNode.appendChild(sytleContent);
        if (clonedNode.firstChild) {
            clonedNode.insertBefore(styleNode, clonedNode.firstChild);
        }
        else {
            clonedNode.appendChild(styleNode);
        }
    }
}
//# sourceMappingURL=embed-webfonts.js.map

/***/ },

/***/ "../node_modules/html-to-image/es/index.js"
/*!*************************************************!*\
  !*** ../node_modules/html-to-image/es/index.js ***!
  \*************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getFontEmbedCSS: () => (/* binding */ getFontEmbedCSS),
/* harmony export */   toBlob: () => (/* binding */ toBlob),
/* harmony export */   toCanvas: () => (/* binding */ toCanvas),
/* harmony export */   toJpeg: () => (/* binding */ toJpeg),
/* harmony export */   toPixelData: () => (/* binding */ toPixelData),
/* harmony export */   toPng: () => (/* binding */ toPng),
/* harmony export */   toSvg: () => (/* binding */ toSvg)
/* harmony export */ });
/* harmony import */ var _clone_node__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./clone-node */ "../node_modules/html-to-image/es/clone-node.js");
/* harmony import */ var _embed_images__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./embed-images */ "../node_modules/html-to-image/es/embed-images.js");
/* harmony import */ var _apply_style__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./apply-style */ "../node_modules/html-to-image/es/apply-style.js");
/* harmony import */ var _embed_webfonts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./embed-webfonts */ "../node_modules/html-to-image/es/embed-webfonts.js");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./util */ "../node_modules/html-to-image/es/util.js");





async function toSvg(node, options = {}) {
    const { width, height } = (0,_util__WEBPACK_IMPORTED_MODULE_4__.getImageSize)(node, options);
    const clonedNode = (await (0,_clone_node__WEBPACK_IMPORTED_MODULE_0__.cloneNode)(node, options, true));
    await (0,_embed_webfonts__WEBPACK_IMPORTED_MODULE_3__.embedWebFonts)(clonedNode, options);
    await (0,_embed_images__WEBPACK_IMPORTED_MODULE_1__.embedImages)(clonedNode, options);
    (0,_apply_style__WEBPACK_IMPORTED_MODULE_2__.applyStyle)(clonedNode, options);
    const datauri = await (0,_util__WEBPACK_IMPORTED_MODULE_4__.nodeToDataURL)(clonedNode, width, height);
    return datauri;
}
async function toCanvas(node, options = {}) {
    const { width, height } = (0,_util__WEBPACK_IMPORTED_MODULE_4__.getImageSize)(node, options);
    const svg = await toSvg(node, options);
    const img = await (0,_util__WEBPACK_IMPORTED_MODULE_4__.createImage)(svg);
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const ratio = options.pixelRatio || (0,_util__WEBPACK_IMPORTED_MODULE_4__.getPixelRatio)();
    const canvasWidth = options.canvasWidth || width;
    const canvasHeight = options.canvasHeight || height;
    canvas.width = canvasWidth * ratio;
    canvas.height = canvasHeight * ratio;
    if (!options.skipAutoScale) {
        (0,_util__WEBPACK_IMPORTED_MODULE_4__.checkCanvasDimensions)(canvas);
    }
    canvas.style.width = `${canvasWidth}`;
    canvas.style.height = `${canvasHeight}`;
    if (options.backgroundColor) {
        context.fillStyle = options.backgroundColor;
        context.fillRect(0, 0, canvas.width, canvas.height);
    }
    context.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas;
}
async function toPixelData(node, options = {}) {
    const { width, height } = (0,_util__WEBPACK_IMPORTED_MODULE_4__.getImageSize)(node, options);
    const canvas = await toCanvas(node, options);
    const ctx = canvas.getContext('2d');
    return ctx.getImageData(0, 0, width, height).data;
}
async function toPng(node, options = {}) {
    const canvas = await toCanvas(node, options);
    return canvas.toDataURL();
}
async function toJpeg(node, options = {}) {
    const canvas = await toCanvas(node, options);
    return canvas.toDataURL('image/jpeg', options.quality || 1);
}
async function toBlob(node, options = {}) {
    const canvas = await toCanvas(node, options);
    const blob = await (0,_util__WEBPACK_IMPORTED_MODULE_4__.canvasToBlob)(canvas);
    return blob;
}
async function getFontEmbedCSS(node, options = {}) {
    return (0,_embed_webfonts__WEBPACK_IMPORTED_MODULE_3__.getWebFontCSS)(node, options);
}
//# sourceMappingURL=index.js.map

/***/ },

/***/ "../node_modules/html-to-image/es/mimes.js"
/*!*************************************************!*\
  !*** ../node_modules/html-to-image/es/mimes.js ***!
  \*************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getMimeType: () => (/* binding */ getMimeType)
/* harmony export */ });
const WOFF = 'application/font-woff';
const JPEG = 'image/jpeg';
const mimes = {
    woff: WOFF,
    woff2: WOFF,
    ttf: 'application/font-truetype',
    eot: 'application/vnd.ms-fontobject',
    png: 'image/png',
    jpg: JPEG,
    jpeg: JPEG,
    gif: 'image/gif',
    tiff: 'image/tiff',
    svg: 'image/svg+xml',
    webp: 'image/webp',
};
function getExtension(url) {
    const match = /\.([^./]*?)$/g.exec(url);
    return match ? match[1] : '';
}
function getMimeType(url) {
    const extension = getExtension(url).toLowerCase();
    return mimes[extension] || '';
}
//# sourceMappingURL=mimes.js.map

/***/ },

/***/ "../node_modules/html-to-image/es/util.js"
/*!************************************************!*\
  !*** ../node_modules/html-to-image/es/util.js ***!
  \************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   canvasToBlob: () => (/* binding */ canvasToBlob),
/* harmony export */   checkCanvasDimensions: () => (/* binding */ checkCanvasDimensions),
/* harmony export */   createImage: () => (/* binding */ createImage),
/* harmony export */   delay: () => (/* binding */ delay),
/* harmony export */   getImageSize: () => (/* binding */ getImageSize),
/* harmony export */   getPixelRatio: () => (/* binding */ getPixelRatio),
/* harmony export */   getStyleProperties: () => (/* binding */ getStyleProperties),
/* harmony export */   isInstanceOfElement: () => (/* binding */ isInstanceOfElement),
/* harmony export */   nodeToDataURL: () => (/* binding */ nodeToDataURL),
/* harmony export */   resolveUrl: () => (/* binding */ resolveUrl),
/* harmony export */   svgToDataURL: () => (/* binding */ svgToDataURL),
/* harmony export */   toArray: () => (/* binding */ toArray),
/* harmony export */   uuid: () => (/* binding */ uuid)
/* harmony export */ });
function resolveUrl(url, baseUrl) {
    // url is absolute already
    if (url.match(/^[a-z]+:\/\//i)) {
        return url;
    }
    // url is absolute already, without protocol
    if (url.match(/^\/\//)) {
        return window.location.protocol + url;
    }
    // dataURI, mailto:, tel:, etc.
    if (url.match(/^[a-z]+:/i)) {
        return url;
    }
    const doc = document.implementation.createHTMLDocument();
    const base = doc.createElement('base');
    const a = doc.createElement('a');
    doc.head.appendChild(base);
    doc.body.appendChild(a);
    if (baseUrl) {
        base.href = baseUrl;
    }
    a.href = url;
    return a.href;
}
const uuid = (() => {
    // generate uuid for className of pseudo elements.
    // We should not use GUIDs, otherwise pseudo elements sometimes cannot be captured.
    let counter = 0;
    // ref: http://stackoverflow.com/a/6248722/2519373
    const random = () => 
    // eslint-disable-next-line no-bitwise
    `0000${((Math.random() * 36 ** 4) << 0).toString(36)}`.slice(-4);
    return () => {
        counter += 1;
        return `u${random()}${counter}`;
    };
})();
function delay(ms) {
    return (args) => new Promise((resolve) => {
        setTimeout(() => resolve(args), ms);
    });
}
function toArray(arrayLike) {
    const arr = [];
    for (let i = 0, l = arrayLike.length; i < l; i++) {
        arr.push(arrayLike[i]);
    }
    return arr;
}
let styleProps = null;
function getStyleProperties(options = {}) {
    if (styleProps) {
        return styleProps;
    }
    if (options.includeStyleProperties) {
        styleProps = options.includeStyleProperties;
        return styleProps;
    }
    styleProps = toArray(window.getComputedStyle(document.documentElement));
    return styleProps;
}
function px(node, styleProperty) {
    const win = node.ownerDocument.defaultView || window;
    const val = win.getComputedStyle(node).getPropertyValue(styleProperty);
    return val ? parseFloat(val.replace('px', '')) : 0;
}
function getNodeWidth(node) {
    const leftBorder = px(node, 'border-left-width');
    const rightBorder = px(node, 'border-right-width');
    return node.clientWidth + leftBorder + rightBorder;
}
function getNodeHeight(node) {
    const topBorder = px(node, 'border-top-width');
    const bottomBorder = px(node, 'border-bottom-width');
    return node.clientHeight + topBorder + bottomBorder;
}
function getImageSize(targetNode, options = {}) {
    const width = options.width || getNodeWidth(targetNode);
    const height = options.height || getNodeHeight(targetNode);
    return { width, height };
}
function getPixelRatio() {
    let ratio;
    let FINAL_PROCESS;
    try {
        FINAL_PROCESS = process;
    }
    catch (e) {
        // pass
    }
    const val = FINAL_PROCESS && FINAL_PROCESS.env
        ? FINAL_PROCESS.env.devicePixelRatio
        : null;
    if (val) {
        ratio = parseInt(val, 10);
        if (Number.isNaN(ratio)) {
            ratio = 1;
        }
    }
    return ratio || window.devicePixelRatio || 1;
}
// @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas#maximum_canvas_size
const canvasDimensionLimit = 16384;
function checkCanvasDimensions(canvas) {
    if (canvas.width > canvasDimensionLimit ||
        canvas.height > canvasDimensionLimit) {
        if (canvas.width > canvasDimensionLimit &&
            canvas.height > canvasDimensionLimit) {
            if (canvas.width > canvas.height) {
                canvas.height *= canvasDimensionLimit / canvas.width;
                canvas.width = canvasDimensionLimit;
            }
            else {
                canvas.width *= canvasDimensionLimit / canvas.height;
                canvas.height = canvasDimensionLimit;
            }
        }
        else if (canvas.width > canvasDimensionLimit) {
            canvas.height *= canvasDimensionLimit / canvas.width;
            canvas.width = canvasDimensionLimit;
        }
        else {
            canvas.width *= canvasDimensionLimit / canvas.height;
            canvas.height = canvasDimensionLimit;
        }
    }
}
function canvasToBlob(canvas, options = {}) {
    if (canvas.toBlob) {
        return new Promise((resolve) => {
            canvas.toBlob(resolve, options.type ? options.type : 'image/png', options.quality ? options.quality : 1);
        });
    }
    return new Promise((resolve) => {
        const binaryString = window.atob(canvas
            .toDataURL(options.type ? options.type : undefined, options.quality ? options.quality : undefined)
            .split(',')[1]);
        const len = binaryString.length;
        const binaryArray = new Uint8Array(len);
        for (let i = 0; i < len; i += 1) {
            binaryArray[i] = binaryString.charCodeAt(i);
        }
        resolve(new Blob([binaryArray], {
            type: options.type ? options.type : 'image/png',
        }));
    });
}
function createImage(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            img.decode().then(() => {
                requestAnimationFrame(() => resolve(img));
            });
        };
        img.onerror = reject;
        img.crossOrigin = 'anonymous';
        img.decoding = 'async';
        img.src = url;
    });
}
async function svgToDataURL(svg) {
    return Promise.resolve()
        .then(() => new XMLSerializer().serializeToString(svg))
        .then(encodeURIComponent)
        .then((html) => `data:image/svg+xml;charset=utf-8,${html}`);
}
async function nodeToDataURL(node, width, height) {
    const xmlns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(xmlns, 'svg');
    const foreignObject = document.createElementNS(xmlns, 'foreignObject');
    svg.setAttribute('width', `${width}`);
    svg.setAttribute('height', `${height}`);
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    foreignObject.setAttribute('width', '100%');
    foreignObject.setAttribute('height', '100%');
    foreignObject.setAttribute('x', '0');
    foreignObject.setAttribute('y', '0');
    foreignObject.setAttribute('externalResourcesRequired', 'true');
    svg.appendChild(foreignObject);
    foreignObject.appendChild(node);
    return svgToDataURL(svg);
}
const isInstanceOfElement = (node, instance) => {
    if (node instanceof instance)
        return true;
    const nodePrototype = Object.getPrototypeOf(node);
    if (nodePrototype === null)
        return false;
    return (nodePrototype.constructor.name === instance.name ||
        isInstanceOfElement(nodePrototype, instance));
};
//# sourceMappingURL=util.js.map

/***/ },

/***/ "./BuffImageRegistry.ts"
/*!******************************!*\
  !*** ./BuffImageRegistry.ts ***!
  \******************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BuffImageRegistry: () => (/* binding */ BuffImageRegistry)
/* harmony export */ });
/* harmony import */ var alt1__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! alt1 */ "../node_modules/alt1/dist/base/index.js");
/* harmony import */ var alt1__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(alt1__WEBPACK_IMPORTED_MODULE_0__);
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};

var BuffImageRegistry = /** @class */ (function () {
    function BuffImageRegistry() {
    }
    BuffImageRegistry.initialize = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e, _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        if (this.initialized)
                            return [2 /*return*/];
                        _a = this;
                        return [4 /*yield*/, alt1__WEBPACK_IMPORTED_MODULE_0__.webpackImages({
                                animateDead: __webpack_require__(/*! ./imgs/buffs/Animate_Dead-noborder.data.png */ "./imgs/buffs/Animate_Dead-noborder.data.png"),
                                darkness: __webpack_require__(/*! ./imgs/buffs/Darkness-noborder.data.png */ "./imgs/buffs/Darkness-noborder.data.png"),
                                elderOverload: __webpack_require__(/*! ./imgs/buffs/Elder_Overload-noborder.data.png */ "./imgs/buffs/Elder_Overload-noborder.data.png"),
                                supremeOverloadActive: __webpack_require__(/*! ./imgs/buffs/Supreme_Overload_Potion_Active-noborder.data.png */ "./imgs/buffs/Supreme_Overload_Potion_Active-noborder.data.png"),
                                fsoaWeaponSpec: __webpack_require__(/*! ./imgs/buffs/fsoaSpecBuff-noborder.data.png */ "./imgs/buffs/fsoaSpecBuff-noborder.data.png"),
                                gladiatorsRage: __webpack_require__(/*! ./imgs/buffs/Gladiators_Rage-noborder.data.png */ "./imgs/buffs/Gladiators_Rage-noborder.data.png"),
                                necrosis: __webpack_require__(/*! ./imgs/buffs/Necrosis-noborder.data.png */ "./imgs/buffs/Necrosis-noborder.data.png"),
                                residualSoul: __webpack_require__(/*! ./imgs/buffs/Residual_Soul-noborder.data.png */ "./imgs/buffs/Residual_Soul-noborder.data.png"),
                                overloaded: __webpack_require__(/*! ./imgs/buffs/Overloaded-noborder.data.png */ "./imgs/buffs/Overloaded-noborder.data.png"),
                                supreme_overloaded: __webpack_require__(/*! ./imgs/buffs/supreme_overload.data.png */ "./imgs/buffs/supreme_overload.data.png"),
                                balanceByForce: __webpack_require__(/*! ./imgs/buffs/balance_by_force-beta.data.png */ "./imgs/buffs/balance_by_force-beta.data.png"),
                                perfectEquilibriumNoBorder: __webpack_require__(/*! ./imgs/buffs/Perfect_Equilibrium-noborder.data.png */ "./imgs/buffs/Perfect_Equilibrium-noborder.data.png"),
                                poisonous: __webpack_require__(/*! ./imgs/buffs/Poisonous-top-noborder.data.png */ "./imgs/buffs/Poisonous-top-noborder.data.png"),
                                prayerRenewActive: __webpack_require__(/*! ./imgs/buffs/Prayer_Renew_Active-noborder.data.png */ "./imgs/buffs/Prayer_Renew_Active-noborder.data.png"),
                                timeRift: __webpack_require__(/*! ./imgs/buffs/Time_rift-noborder.data.png */ "./imgs/buffs/Time_rift-noborder.data.png"),
                                aura: __webpack_require__(/*! ./imgs/buffs/Aura-noborder.data.png */ "./imgs/buffs/Aura-noborder.data.png"),
                                bonfireBoost: __webpack_require__(/*! ./imgs/buffs/Bonfire_Boost-noborder.data.png */ "./imgs/buffs/Bonfire_Boost-noborder.data.png"),
                                grimoire: __webpack_require__(/*! ./imgs/buffs/Erethdor's_grimoire-noborder.data.png */ "./imgs/buffs/Erethdor's_grimoire-noborder.data.png"),
                                Anticipation: __webpack_require__(/*! ./imgs/buffs/Anticipation.data.png */ "./imgs/buffs/Anticipation.data.png"),
                                Barricade: __webpack_require__(/*! ./imgs/buffs/Barricade.data.png */ "./imgs/buffs/Barricade.data.png"),
                                Devotion: __webpack_require__(/*! ./imgs/buffs/Devotion.data.png */ "./imgs/buffs/Devotion.data.png"),
                                Divert: __webpack_require__(/*! ./imgs/buffs/Divert.data.png */ "./imgs/buffs/Divert.data.png"),
                                Freedom: __webpack_require__(/*! ./imgs/buffs/Freedom.data.png */ "./imgs/buffs/Freedom.data.png"),
                                Immortality: __webpack_require__(/*! ./imgs/buffs/Immortality.data.png */ "./imgs/buffs/Immortality.data.png"),
                                Reflect: __webpack_require__(/*! ./imgs/buffs/Reflect.data.png */ "./imgs/buffs/Reflect.data.png"),
                                Resonance: __webpack_require__(/*! ./imgs/buffs/Resonance.data.png */ "./imgs/buffs/Resonance.data.png"),
                                SplitSoul: __webpack_require__(/*! ./imgs/buffs/Split_Soul.data.png */ "./imgs/buffs/Split_Soul.data.png"),
                                Antifire: __webpack_require__(/*! ./imgs/buffs/antifire_top.data.png */ "./imgs/buffs/antifire_top.data.png"),
                                DeathSpark: __webpack_require__(/*! ./imgs/buffs/Death_Spark.data.png */ "./imgs/buffs/Death_Spark.data.png"),
                                ThreadsOfFate: __webpack_require__(/*! ./imgs/buffs/Threads_of_Fate.data.png */ "./imgs/buffs/Threads_of_Fate.data.png"),
                                ConjureSkeleton: __webpack_require__(/*! ./imgs/buffs/skeleton_warrior-top.data.png */ "./imgs/buffs/skeleton_warrior-top.data.png"),
                                ConjureZombie: __webpack_require__(/*! ./imgs/buffs/putrid_zombie-top.data.png */ "./imgs/buffs/putrid_zombie-top.data.png"),
                                ConjureGhost: __webpack_require__(/*! ./imgs/buffs/vengeful_ghost-top.data.png */ "./imgs/buffs/vengeful_ghost-top.data.png"),
                                SplitSoulECB: __webpack_require__(/*! ./imgs/buffs/split_soul_ecb.data.png */ "./imgs/buffs/split_soul_ecb.data.png"),
                                AggressionPotion: __webpack_require__(/*! ./imgs/buffs/aggression_potion.data.png */ "./imgs/buffs/aggression_potion.data.png"),
                                PowderOfProtection: __webpack_require__(/*! ./imgs/buffs/powder_of_protection.data.png */ "./imgs/buffs/powder_of_protection.data.png"),
                                PowderOfPenance: __webpack_require__(/*! ./imgs/buffs/powder_of_penance.data.png */ "./imgs/buffs/powder_of_penance.data.png"),
                                InvokeLordOfBones: __webpack_require__(/*! ./imgs/buffs/Invoke_Lord_of_Bones.data.png */ "./imgs/buffs/Invoke_Lord_of_Bones.data.png"),
                                adrenCrit: __webpack_require__(/*! ./imgs/buffs/Adren_Crit_Buff.data.png */ "./imgs/buffs/Adren_Crit_Buff.data.png"),
                                glacialEmbrace: __webpack_require__(/*! ./imgs/buffs/Glacial_Embrace-noborder.data.png */ "./imgs/buffs/Glacial_Embrace-noborder.data.png"),
                                bloodTithe: __webpack_require__(/*! ./imgs/buffs/Blood_Tithe-noborder.data.png */ "./imgs/buffs/Blood_Tithe-noborder.data.png"),
                                familiar: __webpack_require__(/*! ./imgs/buffs/familiar-top.data.png */ "./imgs/buffs/familiar-top.data.png"),
                                icyChill: __webpack_require__(/*! ./imgs/buffs/icy_chill.data.png */ "./imgs/buffs/icy_chill.data.png")
                            }).promise];
                    case 1:
                        _a.Buffs = _g.sent();
                        _b = this;
                        return [4 /*yield*/, alt1__WEBPACK_IMPORTED_MODULE_0__.webpackImages({
                                lantadyme: __webpack_require__(/*! ./imgs/buffs/Lantadyme.data.png */ "./imgs/buffs/Lantadyme.data.png"),
                                dwarfWeed: __webpack_require__(/*! ./imgs/buffs/Dwarf_Weed.data.png */ "./imgs/buffs/Dwarf_Weed.data.png"),
                                fellstalk: __webpack_require__(/*! ./imgs/buffs/Fellstalk.data.png */ "./imgs/buffs/Fellstalk.data.png"),
                                kwuarm: __webpack_require__(/*! ./imgs/buffs/Kwuarm.data.png */ "./imgs/buffs/Kwuarm.data.png"),
                            }).promise];
                    case 2:
                        _b.Incense = _g.sent();
                        _c = this;
                        return [4 /*yield*/, alt1__WEBPACK_IMPORTED_MODULE_0__.webpackImages({
                                elvenRitualShard: __webpack_require__(/*! ./imgs/buffs/Ancient_Elven_Ritual_Shard-noborder.data.png */ "./imgs/buffs/Ancient_Elven_Ritual_Shard-noborder.data.png"),
                                adrenalinePotion: __webpack_require__(/*! ./imgs/buffs/Adrenaline_Potion-noborder.data.png */ "./imgs/buffs/Adrenaline_Potion-noborder.data.png"),
                                deathGraspDebuff: __webpack_require__(/*! ./imgs/buffs/Death_Guard_Special-top-noborder.data.png */ "./imgs/buffs/Death_Guard_Special-top-noborder.data.png"),
                                deathEssenceDebuff: __webpack_require__(/*! ./imgs/buffs/Omni_Guard_Special-top-noborder.data.png */ "./imgs/buffs/Omni_Guard_Special-top-noborder.data.png"),
                                enhancedExcaliburDebuff: __webpack_require__(/*! ./imgs/buffs/EE_scuffed-top-noborder.data.png */ "./imgs/buffs/EE_scuffed-top-noborder.data.png"),
                                crystalRainMinimal: __webpack_require__(/*! ./imgs/buffs/Crystal_Rain-minimal-noborder.data.png */ "./imgs/buffs/Crystal_Rain-minimal-noborder.data.png"),
                                stunnedDebuff: __webpack_require__(/*! ./imgs/buffs/Stunned.data.png */ "./imgs/buffs/Stunned.data.png"),
                                signOfLifeDebuff: __webpack_require__(/*! ./imgs/buffs/Sign_of_Life-top.data.png */ "./imgs/buffs/Sign_of_Life-top.data.png"),
                                powerburstPrevention: __webpack_require__(/*! ./imgs/buffs/Powerburst_prevention.data.png */ "./imgs/buffs/Powerburst_prevention.data.png"),
                                FeastingSpores: __webpack_require__(/*! ./imgs/buffs/deathspore_arrows.data.png */ "./imgs/buffs/deathspore_arrows.data.png"),
                                cannon: __webpack_require__(/*! ./imgs/buffs/cannon_active-top.data.png */ "./imgs/buffs/cannon_active-top.data.png"),
                            }).promise];
                    case 3:
                        _c.Debuffs = _g.sent();
                        _d = this;
                        return [4 /*yield*/, alt1__WEBPACK_IMPORTED_MODULE_0__.webpackImages({
                                berserk: __webpack_require__(/*! ./imgs/buffs/Berserk-noborder.data.png */ "./imgs/buffs/Berserk-noborder.data.png"),
                                deathsSwiftness: __webpack_require__(/*! ./imgs/buffs/Deaths_Swiftness-top.data.png */ "./imgs/buffs/Deaths_Swiftness-top.data.png"),
                                greaterDeathsSwiftness: __webpack_require__(/*! ./imgs/buffs/Greater_Death's_Swiftness-noborder.data.png */ "./imgs/buffs/Greater_Death's_Swiftness-noborder.data.png"),
                                greaterSunshine: __webpack_require__(/*! ./imgs/buffs/Greater_Sunshine-noborder.data.png */ "./imgs/buffs/Greater_Sunshine-noborder.data.png"),
                                livingDeath: __webpack_require__(/*! ./imgs/buffs/Living_Death-noborder.data.png */ "./imgs/buffs/Living_Death-noborder.data.png"),
                                sunshine: __webpack_require__(/*! ./imgs/buffs/Sunshine-noborder.data.png */ "./imgs/buffs/Sunshine-noborder.data.png"),
                            }).promise];
                    case 4:
                        _d.Ultimates = _g.sent();
                        _e = this;
                        return [4 /*yield*/, alt1__WEBPACK_IMPORTED_MODULE_0__.webpackImages({
                                limitless: __webpack_require__(/*! ./imgs/buffs/Limitless-noborder.data.png */ "./imgs/buffs/Limitless-noborder.data.png"),
                                demonSlayer: __webpack_require__(/*! ./imgs/buffs/Demon_Slayer-noborder.data.png */ "./imgs/buffs/Demon_Slayer-noborder.data.png"),
                                dragonSlayer: __webpack_require__(/*! ./imgs/buffs/Dragon_Slayer-noborder.data.png */ "./imgs/buffs/Dragon_Slayer-noborder.data.png"),
                                undeadSlayer: __webpack_require__(/*! ./imgs/buffs/Undead_Slayer-noborder.data.png */ "./imgs/buffs/Undead_Slayer-noborder.data.png"),
                                ingenuityOfTheHumans: __webpack_require__(/*! ./imgs/buffs/Ingenuity_of_the_Humans-noborder.data.png */ "./imgs/buffs/Ingenuity_of_the_Humans-noborder.data.png"),
                            }).promise];
                    case 5:
                        _e.Sigils = _g.sent();
                        _f = this;
                        return [4 /*yield*/, alt1__WEBPACK_IMPORTED_MODULE_0__.webpackImages({
                                deathMark: __webpack_require__(/*! ./imgs/buffs/Death_Mark.data.png */ "./imgs/buffs/Death_Mark.data.png"),
                                vulnerability: __webpack_require__(/*! ./imgs/buffs/Vulnerability_bordered.data.png */ "./imgs/buffs/Vulnerability_bordered.data.png"),
                                bloat: __webpack_require__(/*! ./imgs/buffs/Bloated.data.png */ "./imgs/buffs/Bloated.data.png"),
                                smokeCloud: __webpack_require__(/*! ./imgs/buffs/smoke_cloud.data.png */ "./imgs/buffs/smoke_cloud.data.png"),
                            }).promise];
                    case 6:
                        _f.Target = _g.sent();
                        this._buffData = [
                            // --- BUFFS ---
                            {
                                name: "Overload", image: this.Buffs.overloaded, threshold: 300, path: './imgs/icons/overload.png',
                                abilityCooldown: 0,
                                hasAbilityCooldown: false,
                                isTarget: false,
                                isStack: false
                            },
                            {
                                name: "Elder Overload", image: this.Buffs.elderOverload, threshold: 60, path: './imgs/icons/elder_overload.png',
                                abilityCooldown: 0,
                                hasAbilityCooldown: false,
                                isTarget: false,
                                isStack: false
                            },
                            {
                                name: "Supreme Overload", image: this.Buffs.supremeOverloadActive, threshold: 30, path: './imgs/icons/supreme_overload.png',
                                abilityCooldown: 0,
                                hasAbilityCooldown: false,
                                isTarget: false,
                                isStack: false
                            },
                            {
                                name: "Weapon Poison", image: this.Buffs.poisonous, threshold: 300, path: './imgs/icons/weapon_poison.png',
                                abilityCooldown: 0,
                                hasAbilityCooldown: false,
                                isTarget: false,
                                isStack: false
                            },
                            {
                                name: "Darkness", image: this.Buffs.darkness, threshold: 400, path: './imgs/icons/darkness.png',
                                abilityCooldown: 0,
                                hasAbilityCooldown: false,
                                isTarget: false,
                                isStack: false
                            },
                            {
                                name: "Animate Dead", image: this.Buffs.animateDead, threshold: 60, path: './imgs/icons/animate_dead.png',
                                abilityCooldown: 0,
                                hasAbilityCooldown: false,
                                isTarget: false,
                                isStack: false
                            },
                            {
                                name: "FSOA Spec", image: this.Buffs.fsoaWeaponSpec, threshold: 80, path: './imgs/icons/fsoa_spec.png',
                                abilityCooldown: 60,
                                hasAbilityCooldown: true,
                                isTarget: false,
                                isStack: false
                            },
                            {
                                name: "Time Rift", image: this.Buffs.timeRift, threshold: 450, path: './imgs/icons/time_rift.png',
                                abilityCooldown: 0,
                                hasAbilityCooldown: false,
                                isTarget: false,
                                isStack: false
                            },
                            {
                                name: "Gladiators Rage", image: this.Buffs.gladiatorsRage, threshold: 50, path: './imgs/icons/gladiators_rage.png',
                                abilityCooldown: 0,
                                hasAbilityCooldown: false,
                                isTarget: false,
                                isStack: false
                            },
                            {
                                name: "Necrosis", image: this.Buffs.necrosis, threshold: 150, path: './imgs/icons/necrosis.png',
                                abilityCooldown: 0,
                                hasAbilityCooldown: false,
                                isTarget: false,
                                isStack: true
                            },
                            {
                                name: "Residual Soul", image: this.Buffs.residualSoul, threshold: 400, path: './imgs/icons/residual_soul.png',
                                abilityCooldown: 0,
                                hasAbilityCooldown: false,
                                isTarget: false,
                                isStack: true
                            },
                            {
                                name: "Aura", image: this.Buffs.aura, threshold: 400, path: './imgs/icons/equilibrium_aura.png',
                                abilityCooldown: 0,
                                hasAbilityCooldown: false,
                                isTarget: false,
                                isStack: false
                            },
                            {
                                name: "Bonfire Boost", image: this.Buffs.bonfireBoost, threshold: 400, path: './imgs/icons/bonfire.png',
                                abilityCooldown: 0,
                                hasAbilityCooldown: false,
                                isTarget: false,
                                isStack: false
                            },
                            {
                                name: "Grimoire", image: this.Buffs.grimoire, threshold: 100, path: "./imgs/icons/grimoire.png",
                                abilityCooldown: 0,
                                hasAbilityCooldown: false,
                                isTarget: false,
                                isStack: false
                            },
                            {
                                name: "Lantadyme Incense", image: this.Incense.lantadyme, threshold: 119, path: './imgs/icons/lantadyme_incense_sticks.png',
                                abilityCooldown: 0,
                                hasAbilityCooldown: false,
                                isTarget: false,
                                isStack: false
                            },
                            {
                                name: "Dwarf Weed Incense", image: this.Incense.dwarfWeed, threshold: 150, path: './imgs/icons/dwarf_weed_incense_sticks.png',
                                abilityCooldown: 0,
                                hasAbilityCooldown: false,
                                isTarget: false,
                                isStack: false
                            },
                            {
                                name: "Fellstalk Incense", image: this.Incense.fellstalk, threshold: 150, path: './imgs/icons/fellstalk_weed_incense_sticks.png',
                                abilityCooldown: 0,
                                hasAbilityCooldown: false,
                                isTarget: false,
                                isStack: false
                            },
                            {
                                name: "Kwuarm Incense", image: this.Incense.kwuarm, threshold: 150, path: './imgs/icons/kwuarm_weed_incense_sticks.png',
                                abilityCooldown: 0,
                                hasAbilityCooldown: false,
                                isTarget: false,
                                isStack: false
                            },
                            {
                                name: "Antifire", image: this.Buffs.Antifire, threshold: 225, path: './imgs/icons/antifire.png',
                                abilityCooldown: 0,
                                hasAbilityCooldown: false,
                                isTarget: false,
                                isStack: false
                            },
                            {
                                name: "Aggression Potion", image: this.Buffs.AggressionPotion, threshold: 120, path: './imgs/icons/aggression_potion.png',
                                abilityCooldown: 0,
                                hasAbilityCooldown: false,
                                isTarget: false,
                                isStack: false
                            },
                            {
                                name: "Powder of Protection", image: this.Buffs.PowderOfProtection, threshold: 130, path: './imgs/icons/powder_of_protection.png',
                                abilityCooldown: 0,
                                hasAbilityCooldown: false,
                                isTarget: false,
                                isStack: false
                            },
                            {
                                name: "Powder of Penance", image: this.Buffs.PowderOfPenance, threshold: 130, path: './imgs/icons/powder_of_penance.png',
                                abilityCooldown: 0,
                                hasAbilityCooldown: false,
                                isTarget: false,
                                isStack: false
                            },
                            {
                                name: "Prayer Renewal", image: this.Buffs.prayerRenewActive, threshold: 225, path: './imgs/icons/prayer_renewal.data.png',
                                abilityCooldown: 0,
                                hasAbilityCooldown: false,
                                isTarget: false,
                                isStack: false
                            },
                            {
                                name: "Death Spark", image: this.Buffs.DeathSpark, threshold: 300, path: './imgs/icons/death_spark.png',
                                abilityCooldown: 0,
                                hasAbilityCooldown: false,
                                isTarget: false,
                                isStack: false
                            },
                            {
                                name: "Balance By Force", image: this.Buffs.balanceByForce, threshold: 30, path: './imgs/icons/balance_by_force.png',
                                abilityCooldown: 0,
                                hasAbilityCooldown: false,
                                isTarget: false,
                                isStack: false
                            },
                            {
                                name: "BOLG Stacks", image: this.Buffs.perfectEquilibriumNoBorder, threshold: 300, path: './imgs/icons/perfect_equilibrium.png',
                                abilityCooldown: 0,
                                hasAbilityCooldown: false,
                                isTarget: false,
                                isStack: true
                            },
                            {
                                name: "Anticipation", image: this.Buffs.Anticipation, threshold: 300, path: './imgs/icons/anticipation.png',
                                abilityCooldown: 24.6,
                                hasAbilityCooldown: true,
                                isTarget: false,
                                isStack: false
                            },
                            {
                                name: "Barricade", image: this.Buffs.Barricade, threshold: 300, path: './imgs/icons/barricade.png',
                                abilityCooldown: 60,
                                hasAbilityCooldown: true,
                                isTarget: false,
                                isStack: false
                            },
                            {
                                name: "Devotion", image: this.Buffs.Devotion, threshold: 300, path: './imgs/icons/devotion.png',
                                abilityCooldown: 60,
                                hasAbilityCooldown: true,
                                isTarget: false,
                                isStack: false
                            },
                            {
                                name: "Divert", image: this.Buffs.Divert, threshold: 300, path: './imgs/icons/divert.png',
                                abilityCooldown: 30,
                                hasAbilityCooldown: true,
                                isTarget: false,
                                isStack: false
                            },
                            {
                                name: "Freedom", image: this.Buffs.Freedom, threshold: 300, path: './imgs/icons/freedom.png',
                                abilityCooldown: 30,
                                hasAbilityCooldown: true,
                                isTarget: false,
                                isStack: false
                            },
                            {
                                name: "Immortality", image: this.Buffs.Immortality, threshold: 300, path: './imgs/icons/immortality.png',
                                abilityCooldown: 120,
                                hasAbilityCooldown: true,
                                isTarget: false,
                                isStack: false
                            },
                            {
                                name: "Reflect", image: this.Buffs.Reflect, threshold: 300, path: './imgs/icons/reflect.png',
                                abilityCooldown: 30,
                                hasAbilityCooldown: true,
                                isTarget: false,
                                isStack: false
                            },
                            {
                                name: "Resonance", image: this.Buffs.Resonance, threshold: 300, path: './imgs/icons/resonance.png',
                                abilityCooldown: 30,
                                hasAbilityCooldown: true,
                                isTarget: false,
                                isStack: false
                            },
                            {
                                name: "Split Soul", image: this.Buffs.SplitSoul, threshold: 350, path: './imgs/icons/split_soul.png',
                                abilityCooldown: 60,
                                hasAbilityCooldown: true,
                                isTarget: false,
                                isStack: false
                            },
                            {
                                name: "Threads of Fate", image: this.Buffs.ThreadsOfFate, threshold: 300, path: './imgs/icons/threads_of_fate.png',
                                abilityCooldown: 45,
                                hasAbilityCooldown: true,
                                isTarget: false,
                                isStack: false
                            },
                            {
                                name: "Conjure Skeleton", image: this.Buffs.ConjureSkeleton, threshold: 300, path: './imgs/icons/skeleton_warrior.png',
                                abilityCooldown: 0,
                                hasAbilityCooldown: false,
                                isTarget: false,
                                isStack: false
                            },
                            {
                                name: "Conjure Zombie", image: this.Buffs.ConjureZombie, threshold: 300, path: './imgs/icons/putrid_zombie.png',
                                abilityCooldown: 0,
                                hasAbilityCooldown: false,
                                isTarget: false,
                                isStack: false
                            },
                            {
                                name: "Conjure Ghost", image: this.Buffs.ConjureGhost, threshold: 300, path: './imgs/icons/vengeful_ghost.png',
                                abilityCooldown: 0,
                                hasAbilityCooldown: false,
                                isTarget: false,
                                isStack: false
                            },
                            {
                                name: "Split Soul ECB", image: this.Buffs.SplitSoulECB, threshold: 60, path: './imgs/icons/split_soul_ecb.png',
                                abilityCooldown: 0,
                                hasAbilityCooldown: false,
                                isTarget: false,
                                isStack: false
                            },
                            {
                                name: "Invoke Lord of Bones", image: this.Buffs.InvokeLordOfBones, threshold: 180, path: './imgs/icons/lord_of_bones.png',
                                abilityCooldown: 0,
                                hasAbilityCooldown: false,
                                isTarget: false,
                                isStack: false
                            },
                            {
                                name: "Adren Crit", image: this.Buffs.adrenCrit, threshold: 300, path: './imgs/icons/adren_crit_buff.png',
                                abilityCooldown: 0,
                                hasAbilityCooldown: false,
                                isTarget: false,
                                isStack: false
                            },
                            // {
                            //   name: "Glacial Embrace", image: this.Buffs.glacialEmbrace, threshold: 60, path: './imgs/icons/glacial_embrace.png',
                            //   abilityCooldown: 0,
                            //   hasAbilityCooldown: false,
                            //   isTarget: false,
                            //   isStack: true
                            // },
                            {
                                name: "Blood Tithe", image: this.Buffs.bloodTithe, threshold: 60, path: './imgs/icons/blood_tithe.png',
                                abilityCooldown: 0,
                                hasAbilityCooldown: false,
                                isTarget: false,
                                isStack: false
                            },
                            // --- DEBUFFS ---
                            {
                                name: "Ancient Elven Ritual Shard", image: this.Debuffs.elvenRitualShard, threshold: 90, path: './imgs/buffs/Ancient_Elven_Ritual_Shard-noborder.data.png',
                                abilityCooldown: 0,
                                hasAbilityCooldown: false,
                                isTarget: false,
                                isStack: false
                            },
                            {
                                name: "Adrenaline Potion Debuff", image: this.Debuffs.adrenalinePotion, threshold: 300, path: './imgs/buffs/Adrenaline_Potion-noborder.data.png',
                                abilityCooldown: 0,
                                hasAbilityCooldown: false,
                                isTarget: false,
                                isStack: false
                            },
                            {
                                name: "Death Guard Debuff", image: this.Debuffs.deathGraspDebuff, threshold: 90, path: './imgs/icons/death_guard.png',
                                abilityCooldown: 0,
                                hasAbilityCooldown: false,
                                isTarget: false,
                                isStack: false
                            },
                            {
                                name: "Omni Guard Debuff", image: this.Debuffs.deathEssenceDebuff, threshold: 60, path: './imgs/icons/omni_guard.png',
                                abilityCooldown: 0,
                                hasAbilityCooldown: false,
                                isTarget: false,
                                isStack: false
                            },
                            {
                                name: "Enhanced Excalibur Debuff", image: this.Debuffs.enhancedExcaliburDebuff, threshold: 15, path: './imgs/icons/excalibur.png',
                                abilityCooldown: 0,
                                hasAbilityCooldown: false,
                                isTarget: false,
                                isStack: false
                            },
                            {
                                name: "Crystal Rain Debuff", image: this.Debuffs.crystalRainMinimal, threshold: 60, path: './imgs/buffs/Crystal_Rain-minimal-noborder.data.png',
                                abilityCooldown: 0,
                                hasAbilityCooldown: false,
                                isTarget: false,
                                isStack: false
                            },
                            {
                                name: "Stunned Debuff", image: this.Debuffs.stunnedDebuff, threshold: 60, path: './imgs/buffs/Stunned.data.png',
                                abilityCooldown: 0,
                                hasAbilityCooldown: false,
                                isTarget: false,
                                isStack: false
                            },
                            {
                                name: "Sign of Life Debuff", image: this.Debuffs.signOfLifeDebuff, threshold: 20, path: './imgs/icons/sign_of_life.png',
                                abilityCooldown: 0,
                                hasAbilityCooldown: false,
                                isTarget: false,
                                isStack: false
                            },
                            {
                                name: "Powerburst Prevention", image: this.Debuffs.powerburstPrevention, threshold: 20, path: './imgs/buffs/Powerburst_prevention.data.png',
                                abilityCooldown: 0,
                                hasAbilityCooldown: false,
                                isTarget: false,
                                isStack: false
                            },
                            // {
                            //   name: "Deathspore Arrows", image: this.Debuffs.FeastingSpores, threshold: 18, path: './imgs/buffs/deathspore_arrows.data.png',
                            //   abilityCooldown: 0,
                            //   hasAbilityCooldown: false,
                            //   isTarget: false,
                            //   isStack: false
                            // },
                            // {
                            //   name: "Icy chill",
                            //   image: this.Buffs.icyChill,
                            //   threshold: 400,
                            //   path: './imgs/icons/icy_chill.png',
                            //   hasAbilityCooldown: false,
                            //   abilityCooldown: 0,
                            //   isStack: true,
                            //   isTarget: false,
                            //   debug: true,
                            //   useAggressiveSearh: false
                            // },
                            {
                                name: "Cannon Decay", image: this.Debuffs.cannon, threshold: 120, path: './imgs/icons/cannon.png',
                                abilityCooldown: 0,
                                hasAbilityCooldown: false,
                                isTarget: false,
                                isStack: false
                            },
                            {
                                name: "Familiar", image: this.Buffs.familiar, threshold: 160, path: './imgs/icons/familiar.png',
                                abilityCooldown: 0,
                                hasAbilityCooldown: false,
                                isTarget: false,
                                isStack: false
                            },
                            // --- ULTIMATES ---
                            {
                                name: "Berserk", image: this.Ultimates.berserk, threshold: 200, path: './imgs/buffs/Berserk-noborder.data.png',
                                abilityCooldown: 60,
                                hasAbilityCooldown: true,
                                isTarget: false,
                                isStack: false
                            },
                            {
                                name: "Deaths Swiftness", image: this.Ultimates.deathsSwiftness, threshold: 270, path: './imgs/icons/deaths_swiftness.png',
                                abilityCooldown: 60,
                                hasAbilityCooldown: true,
                                isTarget: false,
                                isStack: false
                            },
                            {
                                name: "Greater Deaths Swiftness", image: this.Ultimates.greaterDeathsSwiftness, threshold: 450, path: "./imgs/buffs/Greater_Death's_Swiftness-noborder.data.png",
                                abilityCooldown: 0,
                                hasAbilityCooldown: false,
                                isTarget: false,
                                isStack: false
                            },
                            {
                                name: "Sunshine", image: this.Ultimates.sunshine, threshold: 500, path: './imgs/buffs/Sunshine-noborder.data.png',
                                abilityCooldown: 60,
                                hasAbilityCooldown: true,
                                isTarget: false,
                                isStack: false
                            },
                            {
                                name: "Greater Sunshine", image: this.Ultimates.greaterSunshine, threshold: 100, path: './imgs/buffs/Greater_Sunshine-noborder.data.png',
                                abilityCooldown: 0,
                                hasAbilityCooldown: false,
                                isTarget: false,
                                isStack: false
                            },
                            {
                                name: "Living Death", image: this.Ultimates.livingDeath, threshold: 400, path: './imgs/buffs/Living_Death-noborder.data.png',
                                abilityCooldown: 90,
                                hasAbilityCooldown: true,
                                isTarget: false,
                                isStack: false
                            },
                            // --- SIGILS ---
                            {
                                name: "Limitless", image: this.Sigils.limitless, threshold: 250, path: './imgs/buffs/Limitless-noborder.data.png',
                                abilityCooldown: 90,
                                hasAbilityCooldown: true,
                                isTarget: false,
                                isStack: false
                            },
                            {
                                name: "Demon Slayer", image: this.Sigils.demonSlayer, threshold: 400, path: './imgs/buffs/Demon_Slayer-noborder.data.png',
                                abilityCooldown: 60,
                                hasAbilityCooldown: true,
                                isTarget: false,
                                isStack: false
                            },
                            {
                                name: "Dragon Slayer", image: this.Sigils.dragonSlayer, threshold: 400, path: './imgs/buffs/Dragon_Slayer-noborder.data.png',
                                debug: false,
                                abilityCooldown: 60,
                                hasAbilityCooldown: true,
                                isTarget: false,
                                isStack: false
                            },
                            {
                                name: "Undead Slayer", image: this.Sigils.undeadSlayer, threshold: 400, path: './imgs/buffs/Undead_Slayer-noborder.data.png',
                                debug: false,
                                abilityCooldown: 60,
                                hasAbilityCooldown: true,
                                isTarget: false,
                                isStack: false
                            },
                            {
                                name: "Ingenuity of the Humans", image: this.Sigils.ingenuityOfTheHumans, threshold: 400, path: './imgs/buffs/Ingenuity_of_the_Humans-noborder.data.png',
                                debug: false,
                                abilityCooldown: 90,
                                hasAbilityCooldown: true,
                                isTarget: false,
                                isStack: false
                            },
                            {
                                name: "Death Mark", image: this.Target.deathMark, threshold: 0, path: './imgs/icons/death_mark.png',
                                debug: false,
                                abilityCooldown: 0,
                                hasAbilityCooldown: false,
                                isTarget: true,
                                isStack: false
                            },
                            {
                                name: "Vulnerability", image: this.Target.vulnerability, threshold: 0, path: './imgs/icons/vulnerability.png',
                                debug: false,
                                abilityCooldown: 0,
                                hasAbilityCooldown: false,
                                isTarget: true,
                                isStack: false
                            },
                            {
                                name: "Bloat", image: this.Target.bloat, threshold: 0, path: './imgs/icons/bloat.png',
                                debug: false,
                                abilityCooldown: 0,
                                hasAbilityCooldown: false,
                                isTarget: true,
                                isStack: false
                            },
                            {
                                name: "Smoke Cloud", image: this.Target.smokeCloud, threshold: 0, path: './imgs/icons/smoke_cloud.png',
                                debug: false,
                                abilityCooldown: 0,
                                hasAbilityCooldown: false,
                                isTarget: true,
                                isStack: false
                            }
                        ];
                        this.initialized = true;
                        return [2 /*return*/];
                }
            });
        });
    };
    Object.defineProperty(BuffImageRegistry, "buffData", {
        get: function () {
            if (!this.initialized) {
                throw new Error('BuffImageRegistry must be initialized before accessing buffData. Call BuffImageRegistry.initialize() first.');
            }
            return this._buffData;
        },
        enumerable: false,
        configurable: true
    });
    BuffImageRegistry.Buffs = null;
    BuffImageRegistry.Incense = null;
    BuffImageRegistry.Debuffs = null;
    BuffImageRegistry.Ultimates = null;
    BuffImageRegistry.Sigils = null;
    BuffImageRegistry.Target = null;
    BuffImageRegistry.initialized = false;
    BuffImageRegistry._buffData = [];
    return BuffImageRegistry;
}());



/***/ },

/***/ "./BuffManager.ts"
/*!************************!*\
  !*** ./BuffManager.ts ***!
  \************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BuffManager: () => (/* binding */ BuffManager)
/* harmony export */ });
/* harmony import */ var alt1__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! alt1 */ "../node_modules/alt1/dist/base/index.js");
/* harmony import */ var alt1__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(alt1__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var alt1_buffs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! alt1/buffs */ "../node_modules/alt1/dist/buffs/index.js");
/* harmony import */ var alt1_buffs__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(alt1_buffs__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var alt1_targetmob__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! alt1/targetmob */ "../node_modules/alt1/dist/targetmob/index.js");
/* harmony import */ var alt1_targetmob__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(alt1_targetmob__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var html_to_image__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! html-to-image */ "../node_modules/html-to-image/es/index.js");
/* harmony import */ var _BuffImageRegistry__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./BuffImageRegistry */ "./BuffImageRegistry.ts");
var __assign = (undefined && undefined.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (undefined && undefined.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};





var BuffManager = /** @class */ (function () {
    function BuffManager(storage) {
        var _this = this;
        this.targetMob = new (alt1_targetmob__WEBPACK_IMPORTED_MODULE_2___default())();
        this.matchedBuffsCache = new Map();
        this.TRACKED_BUFFS_KEY = 'trackedBuffs';
        this.getActiveBuffs = function () { return __awaiter(_this, void 0, void 0, function () {
            var activeEntries, registeredBuffs, currentActiveBuffs;
            return __generator(this, function (_a) {
                this.ensureReaderPosition(this.buffs);
                this.ensureReaderPosition(this.debuffs);
                if (!this.buffs.pos && !this.debuffs.pos) {
                    return [2 /*return*/, []];
                }
                this.updateCooldowns();
                activeEntries = this.readActiveEntries();
                if (activeEntries.length === 0) {
                    this.expireAllCachedBuffs();
                    this.saveCachedBuffs();
                    return [2 /*return*/, this.getSortedCachedBuffs()];
                }
                registeredBuffs = this.getRegisteredBuffs();
                currentActiveBuffs = new Set();
                this.applyBuffMatches(activeEntries, registeredBuffs, currentActiveBuffs);
                this.expireMissingBuffs(currentActiveBuffs);
                this.saveCachedBuffs();
                return [2 /*return*/, this.getSortedCachedBuffs()];
            });
        }); };
        this.setOverlayPosition = function (overlayPositionKey, onPositionSaved) {
            alt1__WEBPACK_IMPORTED_MODULE_0__.once('alt1pressed', function () {
                try {
                    var mousePos = alt1__WEBPACK_IMPORTED_MODULE_0__.getMousePosition();
                    _this.storage.save(overlayPositionKey, {
                        x: Math.floor(mousePos.x),
                        y: Math.floor(mousePos.y),
                    });
                    // Call the callback if provided
                    if (onPositionSaved) {
                        onPositionSaved();
                    }
                }
                catch (error) {
                    console.error(error);
                }
            });
        };
        this.captureOverlay = function (group, element, scale) { return __awaiter(_this, void 0, void 0, function () {
            var style, dataUrl, overlayPosition, base64ImageString, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        style = getComputedStyle(element);
                        return [4 /*yield*/, html_to_image__WEBPACK_IMPORTED_MODULE_3__.toCanvas(element, {
                                width: parseInt(style.width) || 1,
                                height: parseInt(style.height) || 1,
                                quality: 1,
                                pixelRatio: scale,
                                imagePlaceholder: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><rect width="32" height="32" fill="%23ddd"/><text x="16" y="16" text-anchor="middle" dy=".3em" font-size="10" fill="%23999">?</text></svg>',
                                style: {
                                    transform: 'none',
                                    left: '0',
                                    top: '0',
                                    position: 'static'
                                }
                            })];
                    case 1:
                        dataUrl = _a.sent();
                        overlayPosition = this.storage.get(group);
                        if (!overlayPosition)
                            return [2 /*return*/];
                        base64ImageString = dataUrl.getContext('2d').getImageData(0, 0, dataUrl.width, dataUrl.height);
                        alt1.overLaySetGroup(group);
                        alt1.overLayFreezeGroup(group);
                        alt1.overLayClearGroup(group);
                        alt1.overLayImage(overlayPosition.x, overlayPosition.y, alt1__WEBPACK_IMPORTED_MODULE_0__.encodeImageString(base64ImageString), base64ImageString.width, 150);
                        alt1.overLayRefreshGroup(group);
                        return [3 /*break*/, 3];
                    case 2:
                        e_1 = _a.sent();
                        console.error(e_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        this.toggleBuffPin = function (buffName) {
            var buff = _this.matchedBuffsCache.get(buffName);
            if (buff) {
                buff.isPinned = !buff.isPinned;
                _this.saveCachedBuffs();
            }
        };
        this.toggleBuffAudioQueue = function (buffName) {
            var buff = _this.matchedBuffsCache.get(buffName);
            if (buff) {
                buff.isAudioQueued = !buff.isAudioQueued;
                _this.saveCachedBuffs();
            }
        };
        this.saveBuffOrder = function (buffs) {
            buffs.forEach(function (buff, index) {
                var cachedBuff = _this.matchedBuffsCache.get(buff.name);
                if (cachedBuff) {
                    cachedBuff.order = index;
                }
            });
            _this.saveCachedBuffs();
        };
        this.updateCooldowns = function () {
            var now = Date.now();
            _this.matchedBuffsCache.forEach(function (buff) {
                var elapsed = (now - buff.lastUpdate) / 1000;
                if (elapsed > 0) {
                    // Update buff duration
                    if (buff.buffDuration > 0) {
                        buff.buffDuration = Math.max(0, buff.buffDuration - elapsed);
                        if (buff.buffDurationMax > 0) {
                            buff.buffProgress = Math.max(0, (buff.buffDuration / buff.buffDurationMax) * 100);
                        }
                        else {
                            buff.buffProgress = 0;
                        }
                    }
                    // Update ability cooldown
                    if (buff.abilityCooldown > 0) {
                        buff.abilityCooldown = Math.max(0, buff.abilityCooldown - elapsed);
                        if (buff.abilityCooldownMax > 0) {
                            buff.abilityCooldownProgress = Math.max(0, (buff.abilityCooldown / buff.abilityCooldownMax) * 100);
                        }
                        else {
                            buff.abilityCooldownProgress = 0;
                        }
                    }
                    buff.lastUpdate = now;
                }
            });
        };
        this.saveCachedBuffs = function () {
            var buffsArray = Array.from(_this.matchedBuffsCache.values()).map(function (buff) { return ({
                name: buff.name,
                isPinned: buff.isPinned,
                isAudioQueued: buff.isAudioQueued,
                order: buff.order,
                imagePath: buff.imagePath,
                abilityCooldown: buff.abilityCooldown,
                abilityCooldownProgress: buff.abilityCooldownProgress,
                abilityCooldownMax: buff.abilityCooldownMax,
                hasAbilityCooldown: buff.hasAbilityCooldown,
                isStack: buff.isStack,
                text: buff.text
            }); });
            _this.storage.save(_this.TRACKED_BUFFS_KEY, buffsArray);
        };
        this.loadCachedBuffs = function () {
            var buffsArray = _this.storage.get(_this.TRACKED_BUFFS_KEY);
            if (buffsArray && Array.isArray(buffsArray)) {
                _this.matchedBuffsCache.clear();
                buffsArray.forEach(function (buff) {
                    var _a;
                    _this.matchedBuffsCache.set(buff.name, {
                        name: buff.name,
                        imagePath: buff.imagePath || '',
                        buffDuration: 0,
                        lastUpdate: Date.now(),
                        buffProgress: 0,
                        buffDurationMax: 0,
                        isPinned: buff.isPinned,
                        isAudioQueued: buff.isAudioQueued,
                        abilityCooldown: buff.abilityCooldown || 0,
                        abilityCooldownProgress: buff.abilityCooldownProgress || 0,
                        abilityCooldownMax: buff.abilityCooldownMax || 0,
                        order: (_a = buff.order) !== null && _a !== void 0 ? _a : 999,
                        hasAbilityCooldown: buff.hasAbilityCooldown,
                        isStack: buff.isStack,
                        text: buff.text || ''
                    });
                });
            }
        };
        this.findBuffsAndDebuffs = function (buffReader) {
            var buffsFound = buffReader.find();
            if (buffsFound) {
                setTimeout(function () {
                    alt1.overLaySetGroup('buffsArea');
                    alt1.overLayRect(alt1__WEBPACK_IMPORTED_MODULE_0__.mixColor(120, 255, 120), _this.buffs.getCaptRect().x, _this.buffs.getCaptRect().y, _this.buffs.getCaptRect().width, _this.buffs.getCaptRect().height, 3000, 1);
                }, 1000);
                setTimeout(function () {
                    alt1.overLayClearGroup('buffsArea');
                }, 4000);
                return true;
            }
            return false;
        };
        this.buffs = new (alt1_buffs__WEBPACK_IMPORTED_MODULE_1___default())();
        this.debuffs = new (alt1_buffs__WEBPACK_IMPORTED_MODULE_1___default())();
        this.debuffs.debuffs = true;
        this.storage = storage;
        this.loadCachedBuffs();
    }
    BuffManager.prototype.getTargetDebuffs = function (trackedTargetDebuffs) {
        var hasTarget = this.targetMob.read();
        if (!hasTarget) {
            return [];
        }
        var targetPos = this.targetMob.lastpos;
        if (!targetPos) {
            return [];
        }
        var targetLocation = {
            x: targetPos.x - 120,
            y: targetPos.y + 25,
            w: 150,
            h: 60,
        };
        var capturedArea = alt1__WEBPACK_IMPORTED_MODULE_0__.captureHold(targetLocation.x, targetLocation.y, targetLocation.w, targetLocation.h);
        // alt1.overLaySetGroup('targetArea');
        // alt1.overLayRect(
        //   a1lib.mixColor(120, 255, 120),
        //   capturedArea.x,
        //   capturedArea.y,
        //   capturedArea.width,
        //   capturedArea.height,
        //   3000,
        //   1
        // );
        // alt1.overLayClearGroup('targetArea');
        var targetDebuffsData = _BuffImageRegistry__WEBPACK_IMPORTED_MODULE_4__.BuffImageRegistry.buffData.filter(function (buff) {
            return buff.isTarget &&
                trackedTargetDebuffs[buff.name.charAt(0).toLowerCase() + buff.name.slice(1).replace(/\s+/g, '')];
        });
        return targetDebuffsData.map(function (debuff) {
            var isPresent = debuff.image ? capturedArea.findSubimage(debuff.image).length > 0 : false;
            return __assign(__assign({}, debuff), { 
                // Use abilityCooldown as a flag: 1 if active, 0 if not
                abilityCooldown: isPresent ? 1 : 0 });
        });
    };
    BuffManager.prototype.ensureReaderPosition = function (reader) {
        if (!reader.pos) {
            this.findBuffsAndDebuffs(reader);
        }
    };
    BuffManager.prototype.readActiveEntries = function () {
        var _a, _b;
        var activeBuffs = this.buffs.pos ? (_a = this.buffs.read()) !== null && _a !== void 0 ? _a : [] : [];
        var activeDebuffs = this.debuffs.pos ? (_b = this.debuffs.read()) !== null && _b !== void 0 ? _b : [] : [];
        return __spreadArray(__spreadArray([], activeBuffs, true), activeDebuffs, true);
    };
    BuffManager.prototype.getRegisteredBuffs = function () {
        return _BuffImageRegistry__WEBPACK_IMPORTED_MODULE_4__.BuffImageRegistry.buffData.filter(function (buff) { return !buff.isTarget; });
    };
    BuffManager.prototype.applyBuffMatches = function (activeEntries, registeredBuffs, currentActiveBuffs) {
        for (var _i = 0, activeEntries_1 = activeEntries; _i < activeEntries_1.length; _i++) {
            var activeEntry = activeEntries_1[_i];
            for (var _a = 0, registeredBuffs_1 = registeredBuffs; _a < registeredBuffs_1.length; _a++) {
                var buffData = registeredBuffs_1[_a];
                if (!buffData.image) {
                    continue;
                }
                var matchResult = activeEntry.countMatch(buffData.image, buffData.useAggressiveSearh || false);
                if (matchResult.passed >= buffData.threshold) {
                    this.registerMatchedBuff(activeEntry, buffData, currentActiveBuffs, matchResult.passed);
                    break;
                }
            }
        }
    };
    BuffManager.prototype.registerMatchedBuff = function (activeBuff, buffData, currentActiveBuffs, matchScore) {
        var _a, _b, _c;
        var detectedDuration = activeBuff.readTime();
        var buffText = activeBuff.readArg('arg').arg || '';
        if (buffData.debug) {
            console.debug("match: ".concat(buffData.name, ":").concat(buffData.threshold, " -> passed: ").concat(matchScore));
            console.debug("debug: ".concat(buffData.name, " -> arg: ").concat(buffText));
        }
        currentActiveBuffs.add(buffData.name);
        var existingBuff = this.matchedBuffsCache.get(buffData.name);
        var durationState = this.calculateDurationState(buffText, detectedDuration, existingBuff);
        var cooldownState = this.calculateCooldownState(existingBuff, buffData, durationState.buffProgress);
        this.matchedBuffsCache.set(buffData.name, {
            name: buffData.name,
            imagePath: buffData.path,
            buffDuration: durationState.buffDuration,
            lastUpdate: Date.now(),
            buffProgress: durationState.buffProgress,
            buffDurationMax: durationState.buffDurationMax,
            isPinned: (_a = existingBuff === null || existingBuff === void 0 ? void 0 : existingBuff.isPinned) !== null && _a !== void 0 ? _a : false,
            isAudioQueued: (_b = existingBuff === null || existingBuff === void 0 ? void 0 : existingBuff.isAudioQueued) !== null && _b !== void 0 ? _b : false,
            order: (_c = existingBuff === null || existingBuff === void 0 ? void 0 : existingBuff.order) !== null && _c !== void 0 ? _c : 999,
            abilityCooldown: cooldownState.abilityCooldown,
            abilityCooldownProgress: cooldownState.abilityCooldownProgress,
            abilityCooldownMax: cooldownState.abilityCooldownMax,
            hasAbilityCooldown: buffData.hasAbilityCooldown,
            isStack: buffData.isStack,
            text: durationState.text
        });
    };
    BuffManager.prototype.calculateDurationState = function (buffText, detectedDuration, existingBuff) {
        var _a;
        if (buffText.length <= 59) {
            var buffDurationMax = (_a = existingBuff === null || existingBuff === void 0 ? void 0 : existingBuff.buffDurationMax) !== null && _a !== void 0 ? _a : detectedDuration;
            var buffProgress = buffDurationMax > 0 ? (detectedDuration / buffDurationMax) * 100 : 0;
            return {
                buffDuration: detectedDuration,
                buffDurationMax: buffDurationMax,
                buffProgress: buffProgress,
                text: buffText
            };
        }
        if (!existingBuff || detectedDuration > existingBuff.buffDuration) {
            return {
                buffDuration: detectedDuration,
                buffDurationMax: detectedDuration,
                buffProgress: 100,
                text: buffText
            };
        }
        return {
            buffDuration: existingBuff.buffDuration,
            buffDurationMax: existingBuff.buffDurationMax,
            buffProgress: existingBuff.buffProgress,
            text: existingBuff.text
        };
    };
    BuffManager.prototype.calculateCooldownState = function (existingBuff, buffData, newBuffProgress) {
        if (!existingBuff) {
            return {
                abilityCooldown: buffData.abilityCooldown,
                abilityCooldownMax: buffData.abilityCooldown,
                abilityCooldownProgress: 100
            };
        }
        if (newBuffProgress === 100 && existingBuff.buffProgress < 100 && buffData.hasAbilityCooldown) {
            return {
                abilityCooldown: buffData.abilityCooldown,
                abilityCooldownMax: buffData.abilityCooldown,
                abilityCooldownProgress: 100
            };
        }
        if (existingBuff.buffDuration === 0 && buffData.hasAbilityCooldown) {
            if (existingBuff.abilityCooldown === 0 || existingBuff.abilityCooldownMax === 0) {
                return {
                    abilityCooldown: buffData.abilityCooldown,
                    abilityCooldownMax: buffData.abilityCooldown,
                    abilityCooldownProgress: 100
                };
            }
            return {
                abilityCooldown: existingBuff.abilityCooldown,
                abilityCooldownMax: existingBuff.abilityCooldownMax,
                abilityCooldownProgress: existingBuff.abilityCooldownProgress
            };
        }
        return {
            abilityCooldown: existingBuff.abilityCooldown,
            abilityCooldownMax: existingBuff.abilityCooldownMax,
            abilityCooldownProgress: existingBuff.abilityCooldownProgress
        };
    };
    BuffManager.prototype.expireMissingBuffs = function (currentActiveBuffs) {
        this.matchedBuffsCache.forEach(function (buff, buffName) {
            if (!currentActiveBuffs.has(buffName) && buff.buffDuration > 0) {
                buff.buffDuration = 0;
                buff.buffProgress = 0;
            }
        });
    };
    BuffManager.prototype.expireAllCachedBuffs = function () {
        this.matchedBuffsCache.forEach(function (buff) {
            if (buff.buffDuration > 0) {
                buff.buffDuration = 0;
                buff.buffProgress = 0;
            }
        });
    };
    BuffManager.prototype.getSortedCachedBuffs = function () {
        var buffsArray = Array.from(this.matchedBuffsCache.values());
        buffsArray.sort(function (a, b) {
            if (a.isPinned !== b.isPinned) {
                return a.isPinned ? -1 : 1;
            }
            return a.order - b.order;
        });
        return buffsArray;
    };
    return BuffManager;
}());



/***/ },

/***/ "./LocalStorageHelper.ts"
/*!*******************************!*\
  !*** ./LocalStorageHelper.ts ***!
  \*******************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LocalStorageHelper: () => (/* binding */ LocalStorageHelper)
/* harmony export */ });
var LocalStorageHelper = /** @class */ (function () {
    function LocalStorageHelper() {
        var _this = this;
        this.prefix = 'rs3PinnableBuffs_';
        this.save = function (key, value) {
            try {
                var serializedValue = typeof value === 'object'
                    ? JSON.stringify(value)
                    : String(value);
                window.localStorage.setItem(_this.prefix + key, serializedValue);
                return true;
            }
            catch (error) {
                console.error('Failed to save to localStorage:', error);
                return false;
            }
        };
        this.get = function (key) {
            try {
                var value = window.localStorage.getItem(_this.prefix + key);
                if (value === null)
                    return null;
                // Try to parse as JSON, fall back to raw string
                try {
                    return JSON.parse(value);
                }
                catch (_a) {
                    return value;
                }
            }
            catch (error) {
                console.error('Failed to read from localStorage:', error);
                return null;
            }
        };
        this.remove = function (key) {
            window.localStorage.removeItem(_this.prefix + key);
        };
        this.clear = function () {
            var keys = Object.keys(window.localStorage);
            keys.forEach(function (key) {
                if (key.startsWith(_this.prefix)) {
                    window.localStorage.removeItem(key);
                }
            });
        };
    }
    return LocalStorageHelper;
}());



/***/ },

/***/ "./appconfig.json"
/*!************************!*\
  !*** ./appconfig.json ***!
  \************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "appconfig.json";

/***/ },

/***/ "./audio/clock-ticking.mp3"
/*!*********************************!*\
  !*** ./audio/clock-ticking.mp3 ***!
  \*********************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "clock-ticking.mp3";

/***/ },

/***/ "./audio/long-pop-alert.wav"
/*!**********************************!*\
  !*** ./audio/long-pop-alert.wav ***!
  \**********************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "long-pop-alert.wav";

/***/ },

/***/ "./icon.png"
/*!******************!*\
  !*** ./icon.png ***!
  \******************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "icon.png";

/***/ },

/***/ "./imgs/buffs/Adren_Crit_Buff.data.png"
/*!*********************************************!*\
  !*** ./imgs/buffs/Adren_Crit_Buff.data.png ***!
  \*********************************************/
(module, __unused_webpack_exports, __webpack_require__) {

module.exports=(__webpack_require__(/*! alt1/base */ "../node_modules/alt1/dist/base/index.js").ImageDetect).imageDataFromBase64("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")

/***/ },

/***/ "./imgs/buffs/Adrenaline_Potion-noborder.data.png"
/*!********************************************************!*\
  !*** ./imgs/buffs/Adrenaline_Potion-noborder.data.png ***!
  \********************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

module.exports=(__webpack_require__(/*! alt1/base */ "../node_modules/alt1/dist/base/index.js").ImageDetect).imageDataFromBase64("iVBORw0KGgoAAAANSUhEUgAAABsAAAAbCAMAAAC6CgRnAAAAllBMVEUAAAFkQgeTXRGbZBVqh55CVWJQMgNRLQ9THR1ee41hZG0NCAJqRAc7SlVtIyN0SQl7TQqJVg6MWQ4tExI4PECxIiLPNTWDUgxCUlsxNzpKSUxKYG0MCwt0l64tLS89Q0dUVFRddYFBExxfIx+dh0RfX2HFLy9CJgjkLy9ePAVmWS6FdzpRcH8zIg2RhEQ7OTx6QRr1PDxULym1AAABTElEQVR4XmXSB3KEMAwFUNmm9872XtNz/8vlSzbJzkYzYOAhoTGiaxAEd4TKXCjFt3h6JQg/Lx8DL7ASiKWqxpE4xgoBBcIgANAr4oVwBSwzGNKE6oZOJ7amqaElypIQpNF0+mDTEzqDaNohFtstaS3IBqpBhs7nM3BOBmhN/VqSAJMNGYOyKKrEmIyh9dqLc5CRqrCstGn/LWNDnnkwwclqMfI8mC95T4ZWPA/WrTQjmplqar0qisSL94ui+NJSs3J5TMNQJG87LMAnOw7fw7GTM8z2oqQmxQmj0Jz4c2KynWhyGV1ut9sl6nKY7IvdT4rRYhfBok9/llNTW8uA5CHv0MP6w9aHyV47s9TL0eU5uf+nBJfvoLZr+bwRUnc3L1Xa9n3r72e8pG5epjkr07ZNiYiXUogtcHMbhiW/H4bZNJ9/c63sZCuEm+sfqIYvyWcegNYAAAAASUVORK5CYII=")

/***/ },

/***/ "./imgs/buffs/Ancient_Elven_Ritual_Shard-noborder.data.png"
/*!*****************************************************************!*\
  !*** ./imgs/buffs/Ancient_Elven_Ritual_Shard-noborder.data.png ***!
  \*****************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

module.exports=(__webpack_require__(/*! alt1/base */ "../node_modules/alt1/dist/base/index.js").ImageDetect).imageDataFromBase64("iVBORw0KGgoAAAANSUhEUgAAABsAAAAbCAYAAACN1PRVAAADQklEQVR4nO3VSU8TYRzH8Wc6UwNFxRgORA0SRVJCiGihqMCwlALSUoGWPSxBkLVUoAilBcqmFQSLuMS6YyRuiWLiqzAePXgwHkw86MH4Cn7OPGRGqg1MMXryn3x7/cz/mWdSQv7PPx317pJDCWkX/j7EaQ7YylpgsZxBRrr5pTbJuJySUrRyJPXk0187pjevbsnQkgzWyOfBau2GzdajqI4OHwhRvQsLimZJJNkWM5OamgW9vgA11XbU1Z6Vq6/rC6qx4RxaWrxwOPxhYmxUKWGjHWtQHvisIrS39GHAMSU32Dcj5/Us4pLvIXp65uFy3QkD4zTG43oeFErPhSGvBMWFp3C6sVNAJoMQsfERP675H2N8NEAxsuvYaxVD6hVIEfE5J3IppDvKIz/3JAryTTAazLCV1aLPPh4EuQZnsbSwghtXnlGIYtzOL4qW0qdlU0hM3EiEpESwvqpJhqYnAsJGTyh0P7BKIafzuoDt+rwpxBL1vuRkPYX47KIgSKraWk+P0jcdoIjUg8Cr8DBh3kVEaOTNQmGlphoM9LrpO5Kgm1efY/nWFjCOUyMhIYViWZnGIMhsqkZvtxcz3iXMnQ/g+uLaEd658YLeRLv9MoaHbynHhBAbG7d2QXQ5MmQqtqK/dwJjrgXh9l3GhMePed9tGRt0LtHvq6KiC4ThuhVjLMshKUlHwcwTBRRzOX0UWZ/X7Yd/7i49Qgnj+TIwKpKsGBNLTDwsYNkwmxvhHrr0GyQ1NXYF455r9H253feQw1vAMSRpY4ZR7Rd+P0qYWG6OBe1tY8JWcyGhydFF4UHmUWHt/9TWNg1bRTsYQpo3XUlFiHc9FB93EPVV7eg644GjewrDzll41m04NHBRaJZCmVmVH9LSCkAIM6Lk+GQsMlIDvS4bVksDam2taKjpgr3TS8H+3hmMDi/Qo6uqHnovQuXlnSDcjmWGIa2KoPWY+ISG/MqgigrrUHqq/42YiDQ1jXwTITHCRr1Vs2SvYkjCdLp88Hx5yAyGGkjAT2j7Vy3Zw4UFyRN1cF7cLFQiWFLSjMqqge+GPCv9C2FYkrA1SB7mUcg08UtabToyMopBGDL7h8jGwxJ1DGGYIdr/CTE/ACbXa9EFNYy+AAAAAElFTkSuQmCC")

/***/ },

/***/ "./imgs/buffs/Animate_Dead-noborder.data.png"
/*!***************************************************!*\
  !*** ./imgs/buffs/Animate_Dead-noborder.data.png ***!
  \***************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

module.exports=(__webpack_require__(/*! alt1/base */ "../node_modules/alt1/dist/base/index.js").ImageDetect).imageDataFromBase64("iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAFE0lEQVR4Xq2VeUxUVxTGv/u2GUActMIwLMLAKKOyKBC0qQZM0dZot9hnSKVt2mq1Ck3sqo3N60SNNWqipUnTpom2Jk0D1tBqtDUxw4SaVoora1pRNpeMLIMww8C8d28fVDbjqKn+kpfcv87vO+/enIPxlJbKPFMUDg+EEbm0lFcURcCj4HQqwpAUAIGOosuHipbqxTERrnBNkVWWZR7BGCmycKEtctfWpe//fPC1dDyA/HzZtMWxb4nj86/37Np/6OKKF95uBhA6Wu9e3EnMbX5ncXnt6U9YfdW2PytPfOT48cCaBQCGE8qr16cUbdq27tNtJT9t3/3tjT0lP7Bvvj/GPt5awlLsS712+yJLEMmolQNAAcTv3PJiw4aNS8IoBTzdt9HUMljjPGfyGYyGzPDJU0VB4BFQA2CaRgOqRsvLjpPuzm6OCdr8v+tO/QUMBS7TMI6RS6a5ubkCgLYKZ9OX5YeroWragCRKyJjzRFqqfcp88GGiGvCrPp9XGxwYZIIochfO1ggd7g4YjCGEURIJHVnGKHdL4HK5KAASFZ2823nqyq0zp/8xiAaR+v0++mRqlxZpUpk/AAFgvCRJ5Hr7TVw6Xwf9zAACDlw0dNxuNwkq0aGlsswdKi/vDJVMO50nm9DYcI1JRgMn8gE+L9NLQgwMGiVgVMUflVUIBAIgHAHAwFggGaMEl2BVWdlwN6cvWw94vZM9vx2t59vbuhjHS4gI92NReh9ESULVmTpca78Go1EEY2z44yBYHkoCKMOxPJ4WS00rF9Z3OxTHjlxCT48PlPFIjBlEWvx1uNtqIYgS+rwU/gGNUMbAi8TMGEheXh69r0SW6wl0YiJMSb39qnjuqk+73SWQX45cgBpQoTERIWoNigsoNr0egpfyRcxK4gnPaQgMDFoJAcN/kCCSsUtTGU0xiBzaOvpY43WGW20qfj1RhxttzfD1ujHZZMTMRBEr8gwoLgzhPnhDomvkSfatRTmbHA4HdSq5fBDJGIRglsYojKKAxjYP2j0CrjSGY1+JB64zBjS1qOj1DXUGCCKPmCiB5GSEsLlzzHs3r89+frHDpSpKrnBPictVoUGHESRrTAXREQUONS29qLzYgSutIqovTsfRk9EoO2rAqd8HtKbmfurrV6mmMc0SPUnNybR8t+XN7FSHLpJl8NARJs4wwp61FRtuoctGqTrckyCI6O/3oLW9HpJ+DjGaEBEWT7t6zLjhNvPnazsx1dSLhDgfnxDHISUpPCIzy+z8wrIo590dlVcVBRzBKAoHOGhOeqFV47QGv9pjGJLqMtLZ2QwwBhCRcQjXRCFWkIQYXWo8HD1NPaBR96S+PneCaOiJt0SxiOy0cKvX5208WaVuqK4+q2KEkVGdPffV/OzMV9js2cu0tPTnWGxcBpsWaWPR5nlqfOwzbIZ1HZtpfe9yivVDGffFHDb6u+5+WYyQZAKA43nq9XZyA/5+JomR1ChN5zkyRSXMuN9P+3e0tn7VDSjc0LMfP0ryAHxWUaERQrxlZZjInQGJzPSCkqysAjbT/nTAHJWqp1/KbNa39A6KnDPiinIwSvAlFXSvKHfWblZ6wfF581ZqcXFPDSbGv8xsiWtv2hI2rh8XRwi6mB7GmqsXyJq7qsFuX8kS4wv0DtYdtMUWx40lG9v//1uyIGN5bMacQmadvro2KWHtsgnpH5WRhLNnLM+xJRVst2BF6Nh/ZwSPGRLkYh8jY8Ufa/p/AQ1WJkdnbm1SAAAAAElFTkSuQmCC")

/***/ },

/***/ "./imgs/buffs/Anticipation.data.png"
/*!******************************************!*\
  !*** ./imgs/buffs/Anticipation.data.png ***!
  \******************************************/
(module, __unused_webpack_exports, __webpack_require__) {

module.exports=(__webpack_require__(/*! alt1/base */ "../node_modules/alt1/dist/base/index.js").ImageDetect).imageDataFromBase64("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")

/***/ },

/***/ "./imgs/buffs/Aura-noborder.data.png"
/*!*******************************************!*\
  !*** ./imgs/buffs/Aura-noborder.data.png ***!
  \*******************************************/
(module, __unused_webpack_exports, __webpack_require__) {

module.exports=(__webpack_require__(/*! alt1/base */ "../node_modules/alt1/dist/base/index.js").ImageDetect).imageDataFromBase64("iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAMAAADzN3VRAAAAPFBMVEUAAAFrUh+qizeQcjRjLRLDmjmDDiiJVBAUFx9oCAYyKz1PNQ8zPjYjJS9vPRmzJSA4QERPFyovLjAYIy7OChkYAAAA7klEQVR4Xm3S2W6FMAxFUZ9jOyN0/P9/rZ2k0233QxAsmUgEmdPs6SuRdTGbU2Y+l10VVYmWyQJ3aCQKKMikJUI4grAWgi4pCbQe1LLQ5+5S43FCsc5712jWO2QLrBg5ruwmS6G7hFQBEfCyGkF0IEUAbSPhUAOgS1TRroRD7+1b9KdcISp17fMg+boj7r/krTVfIup/ZtzPPu1R9MwAbfwrAMhvGiSA/Q2I1550ZYO9U/YMUax3v3fs6y5ngkoxbydaMfiWKjQ69MQCSA7YIgIKEdF92nWfdlIESBUkB6TMoLAa+rns/+r8b4+ZzQ99MROBbEHrQgAAAABJRU5ErkJggg==")

/***/ },

/***/ "./imgs/buffs/Barricade.data.png"
/*!***************************************!*\
  !*** ./imgs/buffs/Barricade.data.png ***!
  \***************************************/
(module, __unused_webpack_exports, __webpack_require__) {

module.exports=(__webpack_require__(/*! alt1/base */ "../node_modules/alt1/dist/base/index.js").ImageDetect).imageDataFromBase64("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")

/***/ },

/***/ "./imgs/buffs/Berserk-noborder.data.png"
/*!**********************************************!*\
  !*** ./imgs/buffs/Berserk-noborder.data.png ***!
  \**********************************************/
(module, __unused_webpack_exports, __webpack_require__) {

module.exports=(__webpack_require__(/*! alt1/base */ "../node_modules/alt1/dist/base/index.js").ImageDetect).imageDataFromBase64("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")

/***/ },

/***/ "./imgs/buffs/Bloated.data.png"
/*!*************************************!*\
  !*** ./imgs/buffs/Bloated.data.png ***!
  \*************************************/
(module, __unused_webpack_exports, __webpack_require__) {

module.exports=(__webpack_require__(/*! alt1/base */ "../node_modules/alt1/dist/base/index.js").ImageDetect).imageDataFromBase64("iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAIAAADZrBkAAAAAAW5vUEUAYtdMlAAAAAlub1BFAAAAAAAAAAAAoYpy1QAAA69JREFUeJwVkUlsG2Ucxb/5lvGMPTOOYzu2szhKk7hriGgiIgStkBoQSlqJIHHocuAAAg4gQIUKoXKgoQeoVAl6KZGQEKIlAhUVkFhiQBCJEFoIxGlaJUrqLHUdb7E99sx4lu9j8s7/p/f+v4fH33hNPpBdWyK3JvssKR9/6iuEOchBwAG2I+AwMzj5yZw6L4l8otcM9ZTUrB8nv1RGMgf8rSueUK3j2DWECUIQchyAADBAKaMUOUc+Hp5+iw/ltlBqZprdz2zjWkNf/iewL3O0ZeyEB3shhghDiDjXuGNjzLGoFV/giFHX2B9LBnWExME85olXs017O+AhXsIj5Ia5JTG342NuFHMwdBBlJpHM+H5FGz3/U/zhTdzf2RGv7wENHvNo8LDSu9d7717jv5s6hO5jsCmAB4e8m+vGHfHVyF+nn3zmZ9Wwr7z0GF617kAsB0enfAoGkH37RTHWQ1pa0fKCIXi45h4y/sL606ebkWLV18O3zozJTApRCYdqfe1Cp7knRTH6bDxvaA6g3Njbwdya2T0kXvmgYFTp5LniE8+FQK49yHTEqEY1fJAfNA2HYQth5NguAJcepTs8WP6uqavUsRhEQFII4IjCoYy1XqRZDFxxABl+qVNFPEQNFx/XFrbTYd7gWKADlzftpjbiImXugrAclKHoIdj2bgNNEL9/sf/SRfN5f3Kisn/U1xNChQHy6dncsxeC33xYfeBxKRpzspCt6rmSWladAp7KzPGcNJwaDgsTh/rM/ovgUOAYRxftnrT/QmgwIXe9z9zla1WPw1kAQIfZgEFs2HrUF4Oi8edibbivJWFHZjO/PBSR3z1bOnxKbitZl8/XTpwJVF65LEAB8Q2LalpDxw92KlltjYrtzsvfTV0a8XnQzV9r16q54qp2/T1r70dScd3avOtIqr9mN2TCG2SVj2zjem8ynh5J5/VeoVZMG927RVGGw0eVud91TGC5YYW7SMduJw9MQqxC1XA8sLlLxZXbvUI5ussX5ZAlz55UO74WRBiNejGhHpHXHCfxiKi+OZGlG8uNhYGmoUqpOztj4a0NmOf+bVci7jU/e9xz8nphk4ZJEJM04aGqOd2z7xRXIkFfYYlVUiB5pHV0pdaCdUf3e2UlpGfafiCpscyP+bWrx4Ov2+c+L2RL5i45dOMqa+BtTTebBPG+5+/bxHrUdwo3x+hQwreFp2/M5zu1jXpZtypeTt83IERoWxSDSNI3E4jFkvMpxavYQVrt+m0R1P8HgULKvA0RLa0AAAAASUVORK5CYII=")

/***/ },

/***/ "./imgs/buffs/Blood_Tithe-noborder.data.png"
/*!**************************************************!*\
  !*** ./imgs/buffs/Blood_Tithe-noborder.data.png ***!
  \**************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

module.exports=(__webpack_require__(/*! alt1/base */ "../node_modules/alt1/dist/base/index.js").ImageDetect).imageDataFromBase64("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")

/***/ },

/***/ "./imgs/buffs/Bonfire_Boost-noborder.data.png"
/*!****************************************************!*\
  !*** ./imgs/buffs/Bonfire_Boost-noborder.data.png ***!
  \****************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

module.exports=(__webpack_require__(/*! alt1/base */ "../node_modules/alt1/dist/base/index.js").ImageDetect).imageDataFromBase64("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")

/***/ },

/***/ "./imgs/buffs/Crystal_Rain-minimal-noborder.data.png"
/*!***********************************************************!*\
  !*** ./imgs/buffs/Crystal_Rain-minimal-noborder.data.png ***!
  \***********************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

module.exports=(__webpack_require__(/*! alt1/base */ "../node_modules/alt1/dist/base/index.js").ImageDetect).imageDataFromBase64("iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAMAAADzN3VRAAAA/FBMVEUAAABhb4AdMUEiLT9VaX9LYXo+T2gbLTonSmFGXXkeKTg4PUsODxIRFRozS2s8QlgECg4cNUcGCg04UVw7VnFNcJI+Qk9aVkcsRlVPZHksN0YTFxsQEAoKCQofJDE6RE9NWnM2fYFPgY10cn40V3kyO0xofGw3e4K9vc4dHA45SF0UExQ7WV22tMMNDQc3OksrXWBUf6lUZIQcRV0hKS0+jZVQsr0eR2AvTWY8g45YlJ5XYFspSGJHWnFPc5I5TFx4iJsRExFAV3NRco9OX3lNW2oTJC92fYApM0JjaGpveIEzPEpfhKVATVRDXG1PaYA/W3gQFx8UGiYtNT8Ek0krAAAAAXRSTlMAQObYZgAAAJxJREFUeF6tyTUSwzAABdHvMDMzMzMzM9z/Lhk5TSxLhWeyxTYPyhJYoCJTa6Sg1ekNRhMRs8X6Cza7w+lye7yAD1R+IBAMhSOQFSWLxSlIIJlKg1Emi1y+UGRICShXqjWG1MkaTTm02uSdbk8m/QFIw9GYlsl0JtJ8QctytYbYZiuFHfYHfDuC6gReZyjscr1x5P54gtMLvN74Vx8VUg2fj0CU2AAAAABJRU5ErkJggg==")

/***/ },

/***/ "./imgs/buffs/Darkness-noborder.data.png"
/*!***********************************************!*\
  !*** ./imgs/buffs/Darkness-noborder.data.png ***!
  \***********************************************/
(module, __unused_webpack_exports, __webpack_require__) {

module.exports=(__webpack_require__(/*! alt1/base */ "../node_modules/alt1/dist/base/index.js").ImageDetect).imageDataFromBase64("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")

/***/ },

/***/ "./imgs/buffs/Death_Guard_Special-top-noborder.data.png"
/*!**************************************************************!*\
  !*** ./imgs/buffs/Death_Guard_Special-top-noborder.data.png ***!
  \**************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

module.exports=(__webpack_require__(/*! alt1/base */ "../node_modules/alt1/dist/base/index.js").ImageDetect).imageDataFromBase64("iVBORw0KGgoAAAANSUhEUgAAABkAAAAOCAYAAADaOrdAAAABeklEQVR4nNXUXU/aABjFcW+3LDHZvUu2GCuTIgK0Ut7RUloGEyw6QQXpXiQO45iBaMRIMG5qprvYPu/fUq+8Wyy78PkAzy/n4pyJiadwki/Pf3seEjVkG4j4C/jD78YLeb0pFjxLhMWcg8gjxKuOGZmOEnAQDcln2Mg9NFbEJyQJvFUfIEuKxk45Mx5IeC2RlHMonhqRmQa6skk8XKRrLWJqOi8nX7iD1HQUcSZBdcVkf6ND0ziiHDinvb3L2Z5MWTV4/mzSHSLOxoiGcvQPLH6e7HLdb7OjDqkErlnXVQppwR2gp2TmPWlOvze5OP7Cr7M9/v7o8HtwwKp4Sz5RwEi8cplCiLO4kKXfsbg8aTnAzaDNn4tDatIVZm6FTMxFEs+biJ0iQ7VU5sP7CsNui/PeZ473W3xtfKT3SaFW8j8e0PQ8PsEu39wyQVGjsValmF2jbm6xrFRsuEgsOPV4YMOqY63HnE6MJkSaN5wJiQZLxEMm3+rJf35+B8FEvcKmI2clAAAAAElFTkSuQmCC")

/***/ },

/***/ "./imgs/buffs/Death_Mark.data.png"
/*!****************************************!*\
  !*** ./imgs/buffs/Death_Mark.data.png ***!
  \****************************************/
(module, __unused_webpack_exports, __webpack_require__) {

module.exports=(__webpack_require__(/*! alt1/base */ "../node_modules/alt1/dist/base/index.js").ImageDetect).imageDataFromBase64("iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAACJVBMVEXMAAAYEzIcFDsdFDsfFUEjF0koGVUjHEZKeIcdFz8nHlQiGEYiGEcjFUgdFTsYEy0WEigaFDIkF00kGEs0R2ZJeoZJd4gaEDgYDjU1R2kmGFIeFT0cFDkaFDYaFDQgFkQoGVZHdoNKeIg2IMobET0ZDzckGE4iFkkeFUEgFUVHdoRHdIozGNAgFFIbEjsbETscETsmGVMfFj8mF081RmlIdYczGdAwF8keFD4eFT80RmUiF0gkGExHd4Y2IMkzGNEgF0EdFjsgGDsdFT4eFkIlGE4kHUtJfI4tGLEeFzkZFCeRhnC5sp0qJDElHU9KhZNJdJ0zGNIgGTsZFS0bFDdAmrJlXVPMxrRNkp5AVrcxGM4dGDIYFDFNSU1W1+NQtsnMyLZPnapBXrorGKgbFzgfGT28tZ5waV8xK0LQy7lwaWBRq7hTocEfGTQdF0PMxbHSyrXGv6XCuqPX0sAlIlFbw9EgGToeF0woIj94b1qimH22rJfRyrcpIj8nI1YjGExg2OMoJ3IdFjgYFDIoIjyxp5CQhWqMgWYmGFElF05FfJ1o0+sbFjYbFjSro4peVUoZFTFFfJ4fFT9qu+hnneIZFTRPR1NBOUYnGVQeFkAoGVdvkuNxe98gGkIZFDEjGEYjFksZEzIfFUMiF0pKRZN0Zd92V91rR85LLpNNRpkpGVkZFTMZEjMcFTojF0wnGVMnGlF7Tt18St4qHFcfF0EZFDMUEiR0Rw+vAAAAyklEQVQY022QsQrCMBCGr6G1l4SqdRXcCk7ufQBHwcEnEGd3fRafQp+iUOjcyUFdVXCTQrwkDVbJNx0f/13uAuAhgMABitniGcLw1XdSqbCViXOgrYqoCkFeJt8kEWsppsaYJJgoSf59yII6GTxGHXlPY5MU3SRXytf+J1njpOgke54kXfSmqXr5n5mRXomBIGreUguRnkjyI2JeIZYlYpUjxgVdt5rb5huM7T9tGgYLzq+IyLOMIyaDg1xSu9zvZsKSbOW5EGvw8gEL/GObfhoqMQAAAABJRU5ErkJggg==")

/***/ },

/***/ "./imgs/buffs/Death_Spark.data.png"
/*!*****************************************!*\
  !*** ./imgs/buffs/Death_Spark.data.png ***!
  \*****************************************/
(module, __unused_webpack_exports, __webpack_require__) {

module.exports=(__webpack_require__(/*! alt1/base */ "../node_modules/alt1/dist/base/index.js").ImageDetect).imageDataFromBase64("iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAIAAABLixI0AAAEIUlEQVR4XkWQv6smWRGG3/etOt1f3zv3zjjIzMiuiihoIOisiLAmmgkbKJgKmvpvaL7JJgqqYKBgYGpgIIiBiKIgGCgYqIg64M7Ozsz90X3q9Z6+H1r9UF1ddD+nqvmxj3wFCr0MwIBl0iIBg4AQIAkBJAkQMPYgBNFVRgfKcEJiCPfIHrwgOgjLIGGLEEFSgI4uAvbeDIBWt2UYQFJEDB1n4px8krBpsv4/2i4SIYEmRrJIjQphFlzDZVICU2xCyB9QleKfQkccdaRJhhwkCQKARMiQUOUyDTgeLq9hFiYig1NyTp/F9SsxPZ2hRuawsAVCCnGK22OZ/F+hIEOMZFnPiJfhV4BGzzeEl3zxuuJ5W/5IXBe6URJSFaQIwBwFBXgEynTCHEV3/KOtH4Qbaw5M8mlsD/X0o7r/08WX5U5vAUcUaUEgGJQNs2wDiId3PgkqTIL5PONZu34fcCewhG/yebv4TK4fnue/zmJGpJCpDEQq5BYanX1xJQh5NxnswGWd/f7w4tPq9+VZdaBP2B/o+Wtx982p3qkktTEUKkgCBNk24KRBgtgxaGHDye8m/nl++8vdi/qiZWEuWr9Z8ZcJ30q9g1iVghAAC6ZJWjp6SGigAIMZBJe/H/pBeYiYqRm5KD7l9gMn5hZz6NA4TXFosUzRUnMaJo42t+DULh/PF58gztHPzEO0A7MxknFA+8USP5lzZrvKwHHNBGAbThMkQV1+qF09PvBuq3PiLPqp6kTTSWTj/IfT9vMTXSrebXmp1iOpUIZEkoCBciW9q8z5b6XTevk6MH65amEs0WblviaRupYciRaMlBIRCJAEAdsWAewPXD3/aXvPj/r976Ea2XKa1RZNS8Rnr+a3nrWHjVOyJTOjzdmmzDZHa8pUS2U8OnssSkgoxAxI1p1fT2e/nVqf9HHcuKaTmJpO3tjwm3t5GelsyHQkB6EQx5UAbICWzb5ngO6qmn5m/mrhg0N846qdKMPLm0/4y7v49nk9FdYIZ5oEYHRXmiYMF1xysSq2LoxaVdzMF6Wvn+G9U/8i4kvPD5979/D5i8uvvj/+FdHJUhZBE0gAPmIc6ehF90CptqjGKl2A35le/PjRemc6+/6T0+/++/prr8Z/1K4jA71sI+0iyyiPKHAkqGizrI60w45e6o4r5Nt++saj5STvfuFyelD9rXteYQJkGj5OxFHaAMHbRiHowVZpp6lyduQKvsT1Dw+VyiqYqLKdxG0QkAfg7jnuXr4VU8WtpzPhsFnuLK3oAGDDHZbhPWCXWXCVC+6+Ab1YhbKryoRR5XVzL9Rgq1rdV9da1d0FF1BG2d3eCjvs5YEx1PunffPWa4Oret/6ttbobLVtHqy9q2C7jM3edl3BvWoYh6hsjP442Gtx27zWkPZhGcZhuR7F+l8aEoV3LhY59AAAAABJRU5ErkJggg==")

/***/ },

/***/ "./imgs/buffs/Deaths_Swiftness-top.data.png"
/*!**************************************************!*\
  !*** ./imgs/buffs/Deaths_Swiftness-top.data.png ***!
  \**************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

module.exports=(__webpack_require__(/*! alt1/base */ "../node_modules/alt1/dist/base/index.js").ImageDetect).imageDataFromBase64("iVBORw0KGgoAAAANSUhEUgAAABkAAAALCAIAAAAFlbGkAAACZUlEQVR4Xh3MwYodRRgF4PP/VdVVt7vvvT2ZmQgOKoqIYlDBjcss3CQLXfkSgu/kM4grIStBRhxEhCCaoBtHjRoTvTP3dndV/ccmh8NZnMUnp7fORFVX164xTeRacQTpvbt35KVtz95Etf3lg1L3pjPuzNxVPKH952zvbBIWU7eD2VIPVYoX52RV2bsFwk3R+51qhAUW1nGysQAqLtjnKrczb1bnDVoBT5+FRBEAHrJAAtegK3wGuT/b+NsJQkQl99P0z2U1Awlq7Fs7L3nY4fXqYKBJHTnRCEB0qQSRxmMrOFH3Sxe/vRGaLauGONQ81zKTRhImaslLp4+a+qXKxulQ0VMiNQC6xEMaakdsgvuhc/f7GLf1kFUbDQ1ACggSALDQTlpFo9nlb4hTwxpIkGDqqAvkOpMBOrf6MKVmaxPqXJyPEBXvfFpDFQKIEAJpgusVgU+Fp8YtsBLEZ5yuTDcFRw4PvaKR6lEFBhLVinFW1HVKzgU471etqLnQC7045Q48BjaCJIh0w9udHDtsvV54b5FFCDXCaKKmZfrkte3dFzd9Fx/sqpmRZmWu0wFCY5V3KmaTDBZ6DOCpyqWLsbc9yzRqJERZ5jLVj28dv/xqF2K4W0sO8Yufn3J5c87jqEnwU8B7mSeGyaTAY604d/6v5Js418N49SRi0JS86J1Xtm+9O6SuDcGblY/eb567iJ999/iPx7+X8ZqjNkNXPk1ym/qSIVN5L+mjlVos13k+7PN8vf/78sMXnr9xdeX3h34T201Ky67Cj9//e/HVrx+8cax5LHWueS5XU9CVOx/q1xFH8j8b2ka8n/pE0wAAAABJRU5ErkJggg==")

/***/ },

/***/ "./imgs/buffs/Demon_Slayer-noborder.data.png"
/*!***************************************************!*\
  !*** ./imgs/buffs/Demon_Slayer-noborder.data.png ***!
  \***************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

module.exports=(__webpack_require__(/*! alt1/base */ "../node_modules/alt1/dist/base/index.js").ImageDetect).imageDataFromBase64("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")

/***/ },

/***/ "./imgs/buffs/Devotion.data.png"
/*!**************************************!*\
  !*** ./imgs/buffs/Devotion.data.png ***!
  \**************************************/
(module, __unused_webpack_exports, __webpack_require__) {

module.exports=(__webpack_require__(/*! alt1/base */ "../node_modules/alt1/dist/base/index.js").ImageDetect).imageDataFromBase64("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")

/***/ },

/***/ "./imgs/buffs/Divert.data.png"
/*!************************************!*\
  !*** ./imgs/buffs/Divert.data.png ***!
  \************************************/
(module, __unused_webpack_exports, __webpack_require__) {

module.exports=(__webpack_require__(/*! alt1/base */ "../node_modules/alt1/dist/base/index.js").ImageDetect).imageDataFromBase64("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")

/***/ },

/***/ "./imgs/buffs/Dragon_Slayer-noborder.data.png"
/*!****************************************************!*\
  !*** ./imgs/buffs/Dragon_Slayer-noborder.data.png ***!
  \****************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

module.exports=(__webpack_require__(/*! alt1/base */ "../node_modules/alt1/dist/base/index.js").ImageDetect).imageDataFromBase64("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")

/***/ },

/***/ "./imgs/buffs/Dwarf_Weed.data.png"
/*!****************************************!*\
  !*** ./imgs/buffs/Dwarf_Weed.data.png ***!
  \****************************************/
(module, __unused_webpack_exports, __webpack_require__) {

module.exports=(__webpack_require__(/*! alt1/base */ "../node_modules/alt1/dist/base/index.js").ImageDetect).imageDataFromBase64("iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAACkUlEQVR4nM1WTW/TQBD17nobJ3G2aRzbSZ0P6tA0JR+t2iQogqqVEEKIIwKpHLhw4EAv/P/DwzvOulbVJm7gwFzm7Yff25kdj21Z/6tNrqcwWNYlNu19ltXatYysFtcgyxLeKw9c8t1FxldTHMcjGKxJM1yVaJ21oLoqmWO7iwSnAYQURKBOEjKbofO6AzVIsGAIz0NYjkXrebzRkDMijhT5aBmh2nIpEk0mXIHWeQtW1YLYswl7Lz3CWwUMNHqu796fssQQzkKoIwUtru9i323Qunfs0TM0n+KNInhsXOlX4NTLOLw8hKgKBOMAcl/Ca/i0riMU0obqKHCbZ/PboslELm7msCSjyCq9CvmD0QFYQhZMAhzECeYpTtPL1vONzUK5e4HTcwhHi4h8MAvWa2n6GGMUWThrZaRm/kmRvJb2OhUGP/TNURNcCPinfpba5bsVpL23vcpUoDIiUbKfFGGCo5FUlT6IwWvB7ZY//WLWfVJE79Ok3E7fpTzeaN1hhyrl9tOCiH7drtD2qZ0gaFBJI+wH5PXl2tQF0vzb5YI97O1lTA/dJeSrsz6uLmIi/3h1AsEFfnxekm+OfLp4vfceFzAAaPuKTq/t/WpE/vf3N/DrFdx9W6FRs8AYp4qy1i9gNI/AWYEmCQCa3MpVscaL8YTwzSLGzy9LSNvGi04IKSW9HzplsmiaDKkmmw7bmYiJik7tlolM79Fp8oMm2qN28Q6cbyOq6iA/zkp2nZJeM22cw8EATsnZTeTh2OCvH6Y46rrg62oqlUrP+44UEUlXGK7nMULPff6HqohIL6pg0B3u/hV8SJqrsGyN8ySKy9O/+2kwpGZo9Mx4dd7HzXz8T/5MHiNJO+x0gk7Y30nkD2+qAZWdA29LAAAAAElFTkSuQmCC")

/***/ },

/***/ "./imgs/buffs/EE_scuffed-top-noborder.data.png"
/*!*****************************************************!*\
  !*** ./imgs/buffs/EE_scuffed-top-noborder.data.png ***!
  \*****************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

module.exports=(__webpack_require__(/*! alt1/base */ "../node_modules/alt1/dist/base/index.js").ImageDetect).imageDataFromBase64("iVBORw0KGgoAAAANSUhEUgAAABkAAAANCAYAAABcrsXuAAAAgUlEQVR4nGNgGIogMjnpv7uf73+aWRCRmvrfNzSEhhakp/8PT4j7r6hrQBtLIpOT/4fFx/4XEBGhnS9CYqP/G1jb0M6C8IT4/yZ2djSMh8T4/3pGRrS1wMzGmpYWJIBTkrYBjVJSRFIi2AJHL08aJVWoBQ7ubjTyATSzOXq4k2wBAASyOcs71TtLAAAAAElFTkSuQmCC")

/***/ },

/***/ "./imgs/buffs/Elder_Overload-noborder.data.png"
/*!*****************************************************!*\
  !*** ./imgs/buffs/Elder_Overload-noborder.data.png ***!
  \*****************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

module.exports=(__webpack_require__(/*! alt1/base */ "../node_modules/alt1/dist/base/index.js").ImageDetect).imageDataFromBase64("iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAACW0lEQVR4nLXUXU/aUBgHcDKZiG5wgNoWocIUwjullNeKoDhQRkEEURkbKkSXbHFbFi+WbNkn2C73NfYV/ztQLr1ApE/y5JyepM+v5zwnNRhmjH+/C3j96QbR7AFmfefRoeaT+PsrBSnj1w/xyTWUL09hCUk6It3PcLeuYQnqhPjECnzf/sB9MoS7/UEfxC9W4Wzdgi2pcNbeUuhm8ZA3R4u/GcC4ZAIbzMJ1fI01s22xkHf4He7GFUwvHfCUunDW3y0e2ZaP4Fb7EE5v4Ol/gdm1tfjjCog1eEc/sH37E9ZQUp/GBzJNCL2vk9tljaQXj4RjhxDOPoKrnOO51UGbfqXDzRrcY6M1BKMcYdnOwtO7A3fYWxzkK7ThfX8PoTOCXdrF8uYWPBd3cKkD2BKFp0NCfQC+NQJfvwRf7cIm5mB8FcTG2R345ghsvgLLU/vD0UKcegmu2gdX7sAYy4JrDLW1gw7YUhNEKmIpEJ8fchQbWD+4AHt4TqEuzGEZvHoFZ70/6Qm3dwJHrgoSz2GFFR4PkXQZRC6BJIqwyWUwuw0w5TaY0jGdq2B26mCyFdjFIlZ9Igzr7ByIvA+SokmLkCRNUaEjRSNZkLiiPUczIKEUlja2YeBc8x0ZSe9PdkJSJa2wVASJ5emaomWUgiGZIl4YGH5OJLlHAZrjUdqZIooGidMMJjXEwc2HsOL+FKHFJUWbR3JTRJkcFQlMkaeE1Z/QdjAumt7Tvn7cl2ge1oCEVX8cz+xzNP2hMLFumJybIOHUpA8kKGN5KwyDxa7PH9m4ZsE4V14wMwP/AQrLFqu9Xs6/AAAAAElFTkSuQmCC")

/***/ },

/***/ "./imgs/buffs/Erethdor's_grimoire-noborder.data.png"
/*!**********************************************************!*\
  !*** ./imgs/buffs/Erethdor's_grimoire-noborder.data.png ***!
  \**********************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

module.exports=(__webpack_require__(/*! alt1/base */ "../node_modules/alt1/dist/base/index.js").ImageDetect).imageDataFromBase64("iVBORw0KGgoAAAANSUhEUgAAABsAAAAbCAYAAACN1PRVAAAEt0lEQVQYGc3Ay3MbhR3A8d/KWnslrZ7WW1q9dlfv1ftpy6uV49ijmKRxXQ+koaGkNGXCTIamM3AAppdyKiemPXV6gPbE/8CFnvp/8D9w/HLj0BnTkNQz/cj/LX1f5uG4bHZDYspN0vdlPrn1BvPTM5y5/EXbk6TcBJ8qhYNz+fvZw4ccX10xmY3oV+WfchMCAWl37RyVUow7Dx8wsjIcdfL0yvIP+V+zUwkcI8K4lqRVSLC0s/SrCTyniOcUCarSk1eiH+uhsOQCAWnP6hkqcR8fvz3mT+8u+PTJgtfXTVbdHKt2nrVTJKTJOJWWgejHuvwU0ZBcbFfy/uFQ/taq9JhYGTb9PN6gyp1Fnd/dG/LJW0suvDabfolbwwqTbo17D64oN+WpvDAtuLWMKvfuzbA6bWpmlbpt4naKTDsGH/zK5aNfe3z89obttMH5sslhx2BysGLheSw8j0xensl/oypSiZXkX+NWkol3m+nmNvXBEKs34u6qw8W6Q3cy5RfbA967XPD89RX3D9v0aklMq8Xx2Rnz1YqWM0ORwDvyY3Z2pG03ioQDfga2weHZa2StJqN6gZM3HxFyztGMA5zpkjfPpzy9nHO56eNU92kYCWpWk8F0yu1Ggmd3LVJJacp1FAk1/P4E9WyEXinB0MrQr+Xojaf4zRnl336I+e5HhM0xxz2bi0Wbn296eP0arlMmn47RnEyYOBX6D95AFGMo11ElGzXi8kW3GOOwled4Umczc2g9/j3J195Df/45uZ+9g+PeYjuuc9IzOZnYzJtZBrUkqXScSCzGsp4hmpyjSqws16ka8unCSjO30lyuu1x4A+57Xe5/8BT90YfkZ3coTU+xNls2gxotI82qW2JopqhlooRDQTSfj1qygKKIJ9epmvLJgbdme7LkqFHibNHmZNpkYhZ48taayydX/OHxHZrtNkt3wWZQo1WKM6imaBVjjGtJRNSvZEe/EiW1letkc/Kb6YHH0l3THQ0ZWUVO5m1OZ022szqNTIJqIkLHyPL8l0dYuQSuU2Vip+iUYtSzMYKBJqoiMfkxPp+0FEW+6/T7LD0P72jOolFk2ChwOmtyNra5Wjs8vT/HSujkgxpHfZPDTp6ZncLKRdlTo8gL0R09ostfg8EgzVaTZi6CU07i1NKs+xUenPYZ1YusnSrrQYXHdye4TomxmcbOh4logijGUF6E4pOctiff5PN59HCYTC5NYV/HKcbpVVKcz20mVp5GIc2oVsDtVxmYGZpGnHJKQ1Pl34pPcvKiFJ+MgiGTnGmTshqEkmnSEQ3HiDOuJnG7FYajPrZlsp3ZOJV9qmmNgCrfKj4ZyU+mGMPW6V32qzaxYoWkrhDY3aGRjWA3bMauS6PTwWnbWNkgwV0FUYyhvAx7/YzR1SMqC5cddQ91R4hogiJCybaZuGsa7TZz16VYLiOKNpSXsRuUJ+FMlcHlQ5LmEkXiDUXijXAgTSYsqJqG2esz9zzmqxXFUhlRjKG8LEX8f64drFEU+aP8YPdKFO2r8P4+WihEvd1mul6TyMrXqmTL8ir2ovK+iO7Kf1B88plfVYnFYqSNESK6KzdFlWVUEfnS7/cjorty01RZRkXZycor+B5I6cwgTH4UQQAAAABJRU5ErkJggg==")

/***/ },

/***/ "./imgs/buffs/Fellstalk.data.png"
/*!***************************************!*\
  !*** ./imgs/buffs/Fellstalk.data.png ***!
  \***************************************/
(module, __unused_webpack_exports, __webpack_require__) {

module.exports=(__webpack_require__(/*! alt1/base */ "../node_modules/alt1/dist/base/index.js").ImageDetect).imageDataFromBase64("iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAACaUlEQVR4nM1W227aQBCdNTY2BCcEsE0TA5h7aFq1KkAgjVrlvZfHVmqlpFL7/39w6tllsYUCGNKHzsuc3bXP2bms10T/q81nATQ+PSPsevYgq3oJWdgg2I5Ap0cwTXG8yHzqYRj1oTGTalwoCvSGBL/Ows8QaXQIudUuG80Y5wTGrwga90cEx1HRdfvS7xdDynjs+eqlq2tCpabSw8QnJySjYG9aKqKwqfBeAQ21XrmiRPoxiRUT8G4vQgKLcy3OShW5zgL8Ds+v8E4RPDUO6oSSKzAcE4pFQtQluC6hdl6V67ajiu8FnMZkfl80a5H3N5HMP9vFpYqw3VGkUU9FZhgKq/Qm8zuFUnVBEBgSc13YogGt1gS6MRZCRcZYc+j5rSJpLfZcbI03fStSXcaR6dR+vO3DMvP7u6zsJUT5/HYRw1CF5ppwyhiz8F4BtvTuvbdvtorwc+3UWVI4g0gUubKo469fJNHo8QHFwJfYqdWkD8NT6bm4tp2ceIUz2IvZVL40+vUAf/IO9flEkl/e30PkTIy+f0POyMm0qFMuUjiDAcBJEMjdszXvPkg//vMbhUo1Fn4EuS6EMGSb0uoAjl4SjHgukwCTU6qLGQ+vZxLXl0sMfv6AYVrwGw1YliWLLVPmHBAFOyYrX43WIjoqxpYra0H15UKmyffOEXUK2b/A6c+IVXKRHq/xKiWFMJR+0O3CcZzjRDbHGrc/f4LTaoEMY9VN9mH3SBYRtSIQLBYoeN7hF1UWETsMEYXD42/BTdJUhyVrfD7mt8/7adCkeqj19NifTtC9ufsnfyZPkahuej1H6LePEvkLv977YZBhwmMAAAAASUVORK5CYII=")

/***/ },

/***/ "./imgs/buffs/Freedom.data.png"
/*!*************************************!*\
  !*** ./imgs/buffs/Freedom.data.png ***!
  \*************************************/
(module, __unused_webpack_exports, __webpack_require__) {

module.exports=(__webpack_require__(/*! alt1/base */ "../node_modules/alt1/dist/base/index.js").ImageDetect).imageDataFromBase64("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")

/***/ },

/***/ "./imgs/buffs/Glacial_Embrace-noborder.data.png"
/*!******************************************************!*\
  !*** ./imgs/buffs/Glacial_Embrace-noborder.data.png ***!
  \******************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

module.exports=(__webpack_require__(/*! alt1/base */ "../node_modules/alt1/dist/base/index.js").ImageDetect).imageDataFromBase64("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")

/***/ },

/***/ "./imgs/buffs/Gladiators_Rage-noborder.data.png"
/*!******************************************************!*\
  !*** ./imgs/buffs/Gladiators_Rage-noborder.data.png ***!
  \******************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

module.exports=(__webpack_require__(/*! alt1/base */ "../node_modules/alt1/dist/base/index.js").ImageDetect).imageDataFromBase64("iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAC5klEQVR4nL2Va08TURCGT7ttt5Tt9gbttrulpdwKFmO0RG6ltBQKVRQIsQogRAkxYmICRozxFiUmJJgYjcZI4ld/5uuc7bYgfGAL1Ukmpz3dznNm5p2zjJmwj8UVfH2UxpavCbv5dZj5T9225RWxJnmQZXH0M+XfQIpCRAeMk/N1jPxtzNNYWIa1UfCYDsmTF8gXRYZXiSD2U+mLw/ipj0O4TxqgnJEV9/tuH76E5fMBMxScQ8ZPlCurQypg/v3N/AjebQ5gL3m1PtCClsMIAcYoWPbYqSvO9zXar/w+LwaxFxIxzTrxZKAOBU5JlzHIolhxqnjpDWFaaKutHHDkMR284dJwgyCDtGcaMkIAHmBHVvBb82LOHtXX14HAXxCe5VpTBAtCO2YJkmQt5iBZeweGKQCveRVSskWxKSn4Fgrgc7AC4n3JCyoeByz4FJQxwdrNAU4qikMOSTnVTLhzUFUIo/RsgSXw3hfEM8VvFhLTG1tVFIfctDdjSwrrgIPWFr03OQOSZiHMsA7cZt3oaUudDSnKV4zpPpqLJVFD0RrDr4gP2wTknyeMwczoWfBedKGfBc8GbAfsmBK0WvDjzkt4T9RqEi4YWfDDlCiLNIucDXjQl8TP1RRmbKohyWgtm9MzEtcz4VlMUi/qUtSG34IfqrsWiEs4a1FPQarXCT8AzyJnVlHchgUJGx4HMlYNJZeCWYeCF1TCIYKN6tnFapCSTcGiI4I5SyeGxIR5yJ2+6xi0ejDg8GFZkUn7VuwQZMyQ6ag+eBXQerMbH1qdeC6rSJpR1EmTmIA4cyNv96Ms+zETCFb6YFXxUJZIYa0oWRJYc0ZQcDVf7KrvDfWg2+rCsMOrl3G3y4eD2QS+R9z6HXWLZOtmYmNeXpeYhDILYcjOsK84UbbFdUX1mlWUGVtlGpZYGOteO8pON7oFRmJQGwd4eu0uMox6wyIIuLyY7+hHyMoQdjX4Hc9t2ZtCT/QcKvpf9gfUuZEnxiKLeAAAAABJRU5ErkJggg==")

/***/ },

/***/ "./imgs/buffs/Greater_Death's_Swiftness-noborder.data.png"
/*!****************************************************************!*\
  !*** ./imgs/buffs/Greater_Death's_Swiftness-noborder.data.png ***!
  \****************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

module.exports=(__webpack_require__(/*! alt1/base */ "../node_modules/alt1/dist/base/index.js").ImageDetect).imageDataFromBase64("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")

/***/ },

/***/ "./imgs/buffs/Greater_Sunshine-noborder.data.png"
/*!*******************************************************!*\
  !*** ./imgs/buffs/Greater_Sunshine-noborder.data.png ***!
  \*******************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

module.exports=(__webpack_require__(/*! alt1/base */ "../node_modules/alt1/dist/base/index.js").ImageDetect).imageDataFromBase64("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")

/***/ },

/***/ "./imgs/buffs/Immortality.data.png"
/*!*****************************************!*\
  !*** ./imgs/buffs/Immortality.data.png ***!
  \*****************************************/
(module, __unused_webpack_exports, __webpack_require__) {

module.exports=(__webpack_require__(/*! alt1/base */ "../node_modules/alt1/dist/base/index.js").ImageDetect).imageDataFromBase64("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")

/***/ },

/***/ "./imgs/buffs/Ingenuity_of_the_Humans-noborder.data.png"
/*!**************************************************************!*\
  !*** ./imgs/buffs/Ingenuity_of_the_Humans-noborder.data.png ***!
  \**************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

module.exports=(__webpack_require__(/*! alt1/base */ "../node_modules/alt1/dist/base/index.js").ImageDetect).imageDataFromBase64("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")

/***/ },

/***/ "./imgs/buffs/Invoke_Lord_of_Bones.data.png"
/*!**************************************************!*\
  !*** ./imgs/buffs/Invoke_Lord_of_Bones.data.png ***!
  \**************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

module.exports=(__webpack_require__(/*! alt1/base */ "../node_modules/alt1/dist/base/index.js").ImageDetect).imageDataFromBase64("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")

/***/ },

/***/ "./imgs/buffs/Kwuarm.data.png"
/*!************************************!*\
  !*** ./imgs/buffs/Kwuarm.data.png ***!
  \************************************/
(module, __unused_webpack_exports, __webpack_require__) {

module.exports=(__webpack_require__(/*! alt1/base */ "../node_modules/alt1/dist/base/index.js").ImageDetect).imageDataFromBase64("iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAACtklEQVR4nM1WS1PaUBTOWwgJCe8gFBDUohCVEgABFNHiwlGLnU473XSmu27Kpv//a+4JiYxjJdIuejbnO/cm57vndROO+1/l/mMLPs5aCl569lVS2TMCZ7ZjQIsr6J1lsbUlbk5y93CMxt4BfMyc+thIKBjNitg7NMHz/OYk7YEFWfFO2eq7WBYxm1dw1DXddR7j2TZiMY72x7MCIhFuPRlWhNm1ukn66r6Mcs1Lz/i6ADMluQRFGAaHrYiHW/0M4bUEPvT5ihXdO+V1EVFVweCygEbLBCN33FoYWpL2nVGWoqB1F68jwXP2fjOFdE7FxU0JhimhN8kjkVWQS2doP5FSKIq6bULTxWB9XTQByYd5H4oiUWR1WyPdGqYhKwL6k203TS6WPew3AcONd+mXiVbqgv1GhvDVXZn04DK/3OOpPqrKU2TDq0LglGFBWN9xAQkrto+f6s44B0kW4ZxZ4LTHVMtSiOEsVY3AUTQm/5FEjws46mSg5RRIkkjYGVnhZkbTH09/2ij9kYRF6YwtKMuJX8UvyvSmTp2y+DYhRz/np8gn44TfWDQ36J9XSTfbacR0merD3vVwCJk6u9Qhi4dTDO0KxnYVWVPDTe8tREHE4vMAelxGe5CjuWEE7aGPQwgAbLunZqdncu3USf/6NETGVLFw15M6B1EUqU3ZK2wAL29LEHgh3JXCnHMrXcxw58AmPD2p4sdtF7IkodupQbeiLplA88BqGDoKpqatGo528gHJYj4IsBGLkjNGyNLU6u7g7H01/A28eo3E1QhWbR/zy5SUU9QI3Nfv50hl4puRPLV9/GViY8fUICy7KZHUXvcdCUPi7fCYHFdhJV5JEJaklFexW9zf/Cv41OlKhwV77NI7Pz78u58G36lv+ny+PWpWcHHS/Cd/Js85obXeYRPFbHkjkt8mKRLdDsBAWgAAAABJRU5ErkJggg==")

/***/ },

/***/ "./imgs/buffs/Lantadyme.data.png"
/*!***************************************!*\
  !*** ./imgs/buffs/Lantadyme.data.png ***!
  \***************************************/
(module, __unused_webpack_exports, __webpack_require__) {

module.exports=(__webpack_require__(/*! alt1/base */ "../node_modules/alt1/dist/base/index.js").ImageDetect).imageDataFromBase64("iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAACyUlEQVR4nM1VSW/aUBD2CmYVIWxOANsEA7EJi1kCISE9VURKVVVNE6nqpYde0kP///p13jN2UBTARD10LvPNM5pvdgThfxV3focA5/J57PrtQVKu10JnpnsOLZVC2+tDjcXeT+LOV0hkuggwcxrgVDYLdz7BScOiNxG29/A+omb/AoqqwscOx96HJSzXgazG0L2cQNM0/t25mkJY452CDWG2bhmQFAfD2xuUqlWeSXc2RSqXgXtJmmw1FqeMprB6Xajx+G6SwDGDAV9B1/3ykGM1ocGZjGF0bOimgfagD1E6Qrl+hwZhQUuABdXwnO1EaxK8ZetU92z+GL3FFZLZNDV7iGzuiCKv8O8aw5SR3jKgpFWoWmUvkWAPHoKSoTW8p/qr3K61LK7tnt+rzsiDQVhaY/3MgCCK6Ezo/by9m2ijLygbvuPh8pprVjL/mwhndgkxmeSZOdNx6NSZjamU0t4hCElYswP8WjepF7Kiwh70wtK2Rl9IR9ib4ulp6CieSGwlkTMZWI6/lLKscGz3e3wi95JsRj+9qG0lYb9jWShqbN3LF7xTbIqGzfvjyuOOnh8nqBTSHBeP+MajZplcG502NOoJ6w8PjuMIshiSA1Ei51PM+jVce1UU82msFjZkaubPzyPSMpo0VWwIGMELjiAAoBeyPHomy3GL6z8/Zijkkvj9NEU+I0CkIDqjIc+GLebgZkF4/zRxAuZc2JhihitFl+PbsYlfX0dQFQX1kxJUVYUky37J1oczEglTzFm3WQpJnp8mIc6m/AN4OzJ5mYqlEuyuG/36bp6RTCqOTTvAkuiXpF7IcH1mmtDiES7vWySv7QA/fHRhVVOQKIvVzT3ih/5ZRSH5/ukbL9PSM1E+TkNSzv89Se0kATXW5G8HE7zldGPCXnoiiRjuuq4HEIVmwBfYc1rOXjvCXYrCte3ttOJCkuvvIvkL+7UbYq97BOUAAAAASUVORK5CYII=")

/***/ },

/***/ "./imgs/buffs/Limitless-noborder.data.png"
/*!************************************************!*\
  !*** ./imgs/buffs/Limitless-noborder.data.png ***!
  \************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

module.exports=(__webpack_require__(/*! alt1/base */ "../node_modules/alt1/dist/base/index.js").ImageDetect).imageDataFromBase64("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")

/***/ },

/***/ "./imgs/buffs/Living_Death-noborder.data.png"
/*!***************************************************!*\
  !*** ./imgs/buffs/Living_Death-noborder.data.png ***!
  \***************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

module.exports=(__webpack_require__(/*! alt1/base */ "../node_modules/alt1/dist/base/index.js").ImageDetect).imageDataFromBase64("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")

/***/ },

/***/ "./imgs/buffs/Necrosis-noborder.data.png"
/*!***********************************************!*\
  !*** ./imgs/buffs/Necrosis-noborder.data.png ***!
  \***********************************************/
(module, __unused_webpack_exports, __webpack_require__) {

module.exports=(__webpack_require__(/*! alt1/base */ "../node_modules/alt1/dist/base/index.js").ImageDetect).imageDataFromBase64("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")

/***/ },

/***/ "./imgs/buffs/Omni_Guard_Special-top-noborder.data.png"
/*!*************************************************************!*\
  !*** ./imgs/buffs/Omni_Guard_Special-top-noborder.data.png ***!
  \*************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

module.exports=(__webpack_require__(/*! alt1/base */ "../node_modules/alt1/dist/base/index.js").ImageDetect).imageDataFromBase64("iVBORw0KGgoAAAANSUhEUgAAABkAAAANCAYAAABcrsXuAAABR0lEQVR4nO3RYS8CAQDG8TYzH4FXNrzTtJnBhjW0akHBjivXqU7V1UU5blIUOwKmkTbvbGZsvuPfzQfw5uqd5wM8v+15HI7/WDnX13AvC3QMkKQQF0frGNmlziBzPg+5mIemGeW6LHBb2eShKtI4324f6A3MUdkPYhobXJUE6icCd6dbPNYiuMan2gNNjg7x0czwUktzFJUoKRI35U3uz0Qqhmwf8QdX8Mw6+X7VKMm7RCeyxKZVKmnJmm0LQ120jwTmXVQPQny1slwURVILGjuTeyjuLKYeRk8H7CNiaIr3pzSfLdU6OoLq1eju6mGsf4bLooSesYn43CMUU37eHpMWINGoymi+ffoGnb/FeaNgD0jEVsnJXh5KMZ4vo9wfxzmLqxQCOr0DTvsTJZcF8usSh2GFejFOqy7TKCvUEjnMjGohw38iP0GZrckFV9O2AAAAAElFTkSuQmCC")

/***/ },

/***/ "./imgs/buffs/Overloaded-noborder.data.png"
/*!*************************************************!*\
  !*** ./imgs/buffs/Overloaded-noborder.data.png ***!
  \*************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

module.exports=(__webpack_require__(/*! alt1/base */ "../node_modules/alt1/dist/base/index.js").ImageDetect).imageDataFromBase64("iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAMAAADzN3VRAAAAOVBMVEUAAAFflCc/dx1OhSE/R00mVxdGV1thcG6sjUA3ZhhkZFwPDgwvLjAxPjZmRBJoXzqNiVySczpNQjhzqRfzAAAAkElEQVR4Xp3SSQoDMQwFUcl2TxmH+x82X4WNQgYaUiujtxFGNm1ReY3JZGNeq0X1MkzCWHBXV9MLQwC3db1J3GUI4MoEiEMpNqvWHp0kQMhBze0c4kMcWZaQE+JaESE7RgKkSur/AiCUAiTtSkLSrgBJY7fyVQoyIAnZRO/CX38KVEKgT0AGJXTBLCvA9vvenqW9DHInR4uYAAAAAElFTkSuQmCC")

/***/ },

/***/ "./imgs/buffs/Perfect_Equilibrium-noborder.data.png"
/*!**********************************************************!*\
  !*** ./imgs/buffs/Perfect_Equilibrium-noborder.data.png ***!
  \**********************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

module.exports=(__webpack_require__(/*! alt1/base */ "../node_modules/alt1/dist/base/index.js").ImageDetect).imageDataFromBase64("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")

/***/ },

/***/ "./imgs/buffs/Poisonous-top-noborder.data.png"
/*!****************************************************!*\
  !*** ./imgs/buffs/Poisonous-top-noborder.data.png ***!
  \****************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

module.exports=(__webpack_require__(/*! alt1/base */ "../node_modules/alt1/dist/base/index.js").ImageDetect).imageDataFromBase64("iVBORw0KGgoAAAANSUhEUgAAABkAAAAOCAIAAABVWCAXAAADRUlEQVR4nG2S2U8TURTG59W4Y1Ox0Om0zLTTWTtLZ1hEkWiUuoEhloRSKlBkNdSqUaMPatweJKICmohEI0KNBIgImIhBRSXBBSRVUoyEGk1AeeA/8JQJRIPJyZ0759zzy/edexFGVFhJ5SSV3GWgshOZXJRzmxzOFC14OXk+VG2zmI+VFqrQCwTgIBoIUsSO+NI56eCcBDhBSdVAnOS08RTOEbDCXsPFqvMHFokaDtFAkE3aqi+eEYt/CaAOfqEziSMCgdzhnusjfQ1j/bcunyuGDOQ1nBaL8oGDxEurE9Q16MY4bLPOF+V9UYdmls1Febdp7NmdiTdtk+/apz52RN8/mhi8jcdwiqD8B4fo+ZWeCOeJsEsDzI4Ptk6+7/jx6fF0uHfm85Ofo+1fXzfaedYhq6KSKqppi7gYS0cvzxulF4L5ewPqIm9D0ZGumXDP70jv7ETvdLhjavguzhKcKC+VhsSRywCn51eA2dwhOwSWoYPZwVWA2fFXLdEPnaBoNtIz+6V7uPva+ECDhbEwDtHhTBb+lYbMDzJGBbPZA7acARJmh1O4Z29aV+OJUN3RcH/z9w/t34ZaXjy4ONJXV+3NhCrDC7ykCgu92orA24FZwpWDut1PrRAJ6lqCtCqqVaSSWAJNF8mx3lsZMiXYTCm8dVsmS9isNMfz8EQkRXs0QAAOworyxq1pVRU1a8EsA2ZXxkurLKSlufZQMmsT7Oaawj1bZPp4yT6FwdMlqv/hGahSDMcKEjhNyVSrKw8DgREkhOTZoqKynTZ9jmyEodpZzkZRZiu2PUtuvRrsrD/RfL5Kpi1ttYGXoYvP286Wl7rMBGal7HaWhfMFTuNuUu/3V9p4GqEdAs7hqlm/HV+X70y00GaP1+v2uBOxDYlEfN4Otfvmqa76k/33zh054IKMETPs97g9BT446XMaoUvCNwABODGPdo6DwaSgOm+et7Ls2JW6JhOJQs+NsyWuzeKlQH6oNlh7rHBXhnD/WsBoMZhI4+kzl8r8Qa+7UDavx1krEIATmz18SIZJ4vCK0qM1weutLYOYHUVNhoqSrKYLVa50x7ZUxrVJCF0NBquyUcyAUej9lpfVh66U+4PQRbIMEIDzB0uFQSw0RvwnAAAAAElFTkSuQmCC")

/***/ },

/***/ "./imgs/buffs/Powerburst_prevention.data.png"
/*!***************************************************!*\
  !*** ./imgs/buffs/Powerburst_prevention.data.png ***!
  \***************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

module.exports=(__webpack_require__(/*! alt1/base */ "../node_modules/alt1/dist/base/index.js").ImageDetect).imageDataFromBase64("iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAMAAADzN3VRAAAB3VBMVEUAAAA8RVQzSEcHDQ43T1I8T1A2RlIUHyElPEEQHB4dNToLFBYSKTEGDA4QKDAIDxkIEiQCBCoCBCoAAAAHGyENF/M+U1QXMDcCBCoQJzANI0AWJSkWKy8ECS8RLDcYLzYXLTUXMToXLjQXMDk+U1VAVlcRLjcUPUkQPUsHHCM9UVQ8UVI2SkwpQEQwSUw3UFQ2UFQ2UVU4VFc6Vlo+WVw9V1o6VFg3UlY1UFQ1T1MxSUpvRS1GTk0oQ0crSU8tS1AuTFEwT1MwUVYyUlYuT1MtTFEqS08tS08XKjMXNT4rUFUxTk8RKjIWMDpGYmYqSk1AVFY+UVIpGRAzRkkXNT1RaWs7TlAxTFAnQUQ/SkoyQEAkP0MkP0QkQEQmQkcoQ0koREklQkcjP0UiPkMiPUIiOT5RXlRWamoSLjQTLDQYLjUZMTgZMzsYMjg4UVQVKjFZb3FbcXMWLDIUKjIXKjQ6UVQ7UlQ7UlIQKC5VbW8XKzMXLjYXMDgULDUSKzMNICcIEiQ5T1EzRlBUNSM9UVMFBywsUlYoTVBAVFdxRy46JBcsSkwtTlEvUFMtTU9TMyM+UVMQKjI/U1Q/VFURKjE/VFZDVllEV1kWRVJIZmoHGyE+VFcUP01IZmtCYmX4RXzkAAAAFnRSTlMA6/34/f765ffj+fH98f7x/vz+z/wBxySheQAAAPdJREFUeF5jIAZYd3bhkOlvDsIuwWgTGYVVIi29oLAyFJsMk9/MufO8sWry92prZ8Yq093T24dVgiWvtKy8EUOiibVFTKVDNUBMLJANRSI4bMKkyVOnTVedraKlrYMso6unb2BoZGxiamZuYWnFjiTDYWtn7+Do5Ozi6uYeHsGJrIkrOiY2Lj4hMSk5JZUb1Qk8GZlZ2Tm58vL5vOiu4ysqLlHw8Kngx/SPQlV1TW1dPRafNogrhiiKC2CRaVVS9lRWEsQiIyGj5qsmI4RNRlpyoqS0BBYZWTnJKZJyslhkpNQ1ZmioS2GREZ6lOUdTBFVCVBRrhAEAJ9wz/WubCOYAAAAASUVORK5CYII=")

/***/ },

/***/ "./imgs/buffs/Prayer_Renew_Active-noborder.data.png"
/*!**********************************************************!*\
  !*** ./imgs/buffs/Prayer_Renew_Active-noborder.data.png ***!
  \**********************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

module.exports=(__webpack_require__(/*! alt1/base */ "../node_modules/alt1/dist/base/index.js").ImageDetect).imageDataFromBase64("iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAMAAADzN3VRAAABZVBMVEUAAAAAAACSw+RCVWtcdpBejKubwdycxeOkzurE5Pnd8v7i9P79/v9BXnlhfZR6tNuKutxdeZRdg6IzQ1NggZ02S2NqhJxuqc1zpMVBSFx8steDstSGqsWKrsojLUKRtdApNkaTs82TvNqWyemayupLbIVOXG1SbYSn0O212vS43PS94fhacovV7v1bboNbfpvp9v/r+P8sPlVwj6xkeI9lmb9oe409U2hrncNrpclsj6hslLRum7hAQ0omMkJwp88oNEl0k693mLR5m7kbIzN7lax7pMFCW3V9qciApcOBn7mBr9GDrc5DVWeEt9uFutxETmOGv+KJvOBFZH5JU2iLsc6Nw+WOtdAfIy4tOEpPaH0tQlNSdpWYvNmavNVTfpRTfphVcISgyeVZhqkxNUmo0u6p1vIyRFgfKTg1TF6+4PXA4PU1T1fJ5/rN6PoYHirZ7/03WWk8SmA9UWdhf5jz+/9il7cKt0LjAAAAAXRSTlMAQObYZgAAARZJREFUeF5t0GVvxDAMBuA5ZTpmZuYbMzMzMzP//klrc0u68xdbfvTKkjvIArBUAfCCApdgK7UjcKG6sn3WXhR5xU4KAOiNRTY7AAkVTJZPGvZ3bjDRMOPjL97xigQtkcqj8bt/BFlfSq4/rQ1mzVSJCoUvVc4dzftNp6DnO/ksFwOnMYBf8CwZBMBMrOcCY6MGOKP9ty1qDCQO9zA4+NmNyF8qhKGzOiIGu0r+FmUMaDiukCSeh7VHTAa4OW+yXFPurd70EPVXT5wXpZqqlvN8fCpDCtNctF0rqiqh4Bx7SQrETvrEh1epaOXeXoB+4QG7ZS2g5bB7ErBgWtV6hQWO2cRAUCR9PP2BEzQNhyy7GEzU7dThB1pnInoOZsa8AAAAAElFTkSuQmCC")

/***/ },

/***/ "./imgs/buffs/Reflect.data.png"
/*!*************************************!*\
  !*** ./imgs/buffs/Reflect.data.png ***!
  \*************************************/
(module, __unused_webpack_exports, __webpack_require__) {

module.exports=(__webpack_require__(/*! alt1/base */ "../node_modules/alt1/dist/base/index.js").ImageDetect).imageDataFromBase64("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")

/***/ },

/***/ "./imgs/buffs/Residual_Soul-noborder.data.png"
/*!****************************************************!*\
  !*** ./imgs/buffs/Residual_Soul-noborder.data.png ***!
  \****************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

module.exports=(__webpack_require__(/*! alt1/base */ "../node_modules/alt1/dist/base/index.js").ImageDetect).imageDataFromBase64("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")

/***/ },

/***/ "./imgs/buffs/Resonance.data.png"
/*!***************************************!*\
  !*** ./imgs/buffs/Resonance.data.png ***!
  \***************************************/
(module, __unused_webpack_exports, __webpack_require__) {

module.exports=(__webpack_require__(/*! alt1/base */ "../node_modules/alt1/dist/base/index.js").ImageDetect).imageDataFromBase64("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")

/***/ },

/***/ "./imgs/buffs/Sign_of_Life-top.data.png"
/*!**********************************************!*\
  !*** ./imgs/buffs/Sign_of_Life-top.data.png ***!
  \**********************************************/
(module, __unused_webpack_exports, __webpack_require__) {

module.exports=(__webpack_require__(/*! alt1/base */ "../node_modules/alt1/dist/base/index.js").ImageDetect).imageDataFromBase64("iVBORw0KGgoAAAANSUhEUgAAABkAAAAMCAMAAACgLOZ5AAABAlBMVEUAAAAyen08kJMubnE0foEwdnkfU1UOGSAvdHc7jZAiVVcQMjMjJzc3TWAqZWg6jI8pZGc0T18ucXQHHx8lKTlES2gnX2IvcXQucHIgUFItcHMBEhIpY2Y5iYwze30dSUsXGyUdIi4yaXErbG8FGxsoYWQ2gYQzfH4eTE4fKTQybnMjWlwDFxcqWF8TOTogJTQVJCswdXggVFYIFhk0fYA4iIsjWVsMHh82TWAsVl4OGiApW18xdnkhVFYRKyxFUWwxeHsyeXwYQkMGExYvWWM9kpYhVlgZPD9DO1k5WGkzfYAPMDEWJCw4foNBm59Eo6cdU1UUFyAsbG42g4YlWVxCR2E2DEXLAAAAAXRSTlMAQObYZgAAAI5JREFUeF5jQABLdgbsQFBcTx+rhAUzJwc3DxYJXj5+AUYhYREMCVExJglJKUZGaQwZGVk5eQVFJUZlFTQJVTV1DU0grcWorYMiocvCwmUAZhkyGhkje8TE1MwcymZlZLOCS1jbMNnawTj2Do5OzlC2C7Orm7sHXJ0nq5e3D4Tp6+cfEMiAAEFMwSGhQBoApboOl7qZZCEAAAAASUVORK5CYII=")

/***/ },

/***/ "./imgs/buffs/Split_Soul.data.png"
/*!****************************************!*\
  !*** ./imgs/buffs/Split_Soul.data.png ***!
  \****************************************/
(module, __unused_webpack_exports, __webpack_require__) {

module.exports=(__webpack_require__(/*! alt1/base */ "../node_modules/alt1/dist/base/index.js").ImageDetect).imageDataFromBase64("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")

/***/ },

/***/ "./imgs/buffs/Stunned.data.png"
/*!*************************************!*\
  !*** ./imgs/buffs/Stunned.data.png ***!
  \*************************************/
(module, __unused_webpack_exports, __webpack_require__) {

module.exports=(__webpack_require__(/*! alt1/base */ "../node_modules/alt1/dist/base/index.js").ImageDetect).imageDataFromBase64("iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAMAAADzN3VRAAACDVBMVEWVahXkzRGVahUAAAA7LhE7LhE7LhEPDgwPDgwAAAE7LhE7LhEnGBE7LhE7LhFrUh9vPRkPDgw7LhEnGBEPDgw7LhFpkxJrUh9PNQ8PDgw7LhEPDgwPDgwPDgwPDgwnGBEPDgwPDgwAAAEPDgwnGBEoJA8PDgwPDgw7LhEnGBEoJA8nGBGVahVkQwcoJA9PNQ9PNQ9PNQ8oJA87LhE7LhEnGBFMQjdPNQ87LhFPNQ8nGBE7LhEPDgwoJA9PNQ9PNQ87LhFkQwcPDgwPDgw7LhE7LhFkQwc7LhEoJA8PDgwAAAFkQwcPDgwoJA8oJA87LhFkQwdPNQ8PDgwPDgwPDgyukBE7LhE7LhGQcjRoXjfRpAtPNQ87LhFPNQ9MQjfnyFuOiFgPDgwoJA9oXjcPDgwoJA8oJA9MQjeukBE7LhE7LhE7LhGukBFvPRknGBEoJA87LhFPNQ9vPRk7LhEPDgwnGBEoJA9MQjc7LhEPDgxvPRlrUh87LhEPDgwPDgwPDgxkQwcPDgxPNQ8oJA9kQwc7LhEAAAEPDgwnGBEoJA8oJA87LhFPNQ9MQjcnGBE7LhGVahWukBHRpAtrUh/73ww7LhHkzRFoXjeqizf+uQ3j7oXnyFuQcjRPNQ/2z05jSjVvPRngsBTwwzbAs1pkQwfDmjlpkxJMQjexk1eOiFh2TAnmtGL+xiEnGBFncTrhcVE1AAAAkHRSTlOyZi0ABFSXLRy4SBwxD62W8HaWqxcCfezAMqTjYwsRxnQNLQlYSI+AW4Qu55ABYflar/n5ogz6iQEPAgak5gYEbclrBhIDLRDTAhxISDgNga0CTwRtdBqp3IaSCFOST+OeGsI2WBHRywsKEdzaFRvt9+fn5xvyH+f7Zc/VNXwHoG7vxx7fS5EMlhkg9Ei4BiXxkzzYAAAB3UlEQVR4Xl3PZXNUQRCG0QtNQgjqEhI8qAS3De4Ed3d3d3ene/SqrCdBfiMzWait4vl66q2ecQKnW1Zhd+hR4wZ+/FMpRlQLJidWSpDsCb2lbvdjl5MQ2GtLnZGQCCnqA337abPh/QeQoIIcaGQQ57/k4CEAQ8P2fEzDhjORpREjjUDDqMbGJoDRYyLZEQumhIdyLFgZNx5sEybWTwrzqBhlWTS5S6pN0Tol4ojpVCvTps+Y+VdmzZs9h/O5LS3zF1hZyGnR4iVgW5qB1mhZ0/IVYHOCvOhcuWr1GqjUuhZg3foNVvxAsBJt3GRgc3Nb21aAbdtxhyGnXZMSpZ27dgPskYi4t2afdIv768A5cFCSoEOFwwBHOJKXxaPlMHaPgXP8RMH+OsrAyVMJT9HzyC36+dP2jhICozNw9hwyRszzcnHs++cvOB2BIsUKFy9dZlnPVIE4d8VJ3CLnyK9eS1GHdhG4ofsjJ4RzXfMbN2/dvnOXJ4l2zSLkJjJy7/6DhwCQkY8eY9ZAkKSpISYcePIUTM+ewwsLsa9fNrxKUyv/es1ZGOZ9P3jz9p1EVZX3H7jWyW/zKkWdJSWq8lGm5XISBjlRqSqfPn9prv/qmgX7T759N1zLPeSoBCGyP4fI66GnasnxAAAAAElFTkSuQmCC")

/***/ },

/***/ "./imgs/buffs/Sunshine-noborder.data.png"
/*!***********************************************!*\
  !*** ./imgs/buffs/Sunshine-noborder.data.png ***!
  \***********************************************/
(module, __unused_webpack_exports, __webpack_require__) {

module.exports=(__webpack_require__(/*! alt1/base */ "../node_modules/alt1/dist/base/index.js").ImageDetect).imageDataFromBase64("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")

/***/ },

/***/ "./imgs/buffs/Supreme_Overload_Potion_Active-noborder.data.png"
/*!*********************************************************************!*\
  !*** ./imgs/buffs/Supreme_Overload_Potion_Active-noborder.data.png ***!
  \*********************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

module.exports=(__webpack_require__(/*! alt1/base */ "../node_modules/alt1/dist/base/index.js").ImageDetect).imageDataFromBase64("iVBORw0KGgoAAAANSUhEUgAAABsAAAAbCAYAAACN1PRVAAADPUlEQVR4nM3W60uTYRgG8Hu6vUoltbZMly6dp7Zmzpl5qiDKKhWsqLIyyXUusylWaicMjVTTQZlCZVqaVboyEwxqReGxoeXM08bUIPoT6tvVM6WAPsX0hW64AB6AH89zvdy8RP/j+PuTv0xFceIwCuMde/iA0u4ac5FdUQQibg2vmEZLyvaaNBw4q4NAQJd5xZbsoy3xBSUITMviFxN7kyDkAm0NvXgDAelnHNgl3rA5fhQcU9sCdb4BqtybkOtIR+4n5/ODeVNw6OVbkCWkwic5HaqccnBSyuIFW/WQ9oZkXoPbQi9wYspT6kvASegbL1jcAyOUWSVwk3hBkV6DoBOFEInpOy8YJydNsP4qNGX10FY1QxKzEST0XM0L5so6095qQ0R1O/z26/n99L22U5K68B78dLkIOHIewgWUwwskjadEzfVHUBy+BE7sCXXBbfjrKVvkQYtmHQs4eh+qi1WQp5yC0EMMjcGIoIwiSBLoyqwhLgspQHGoEjlGMzLq2lhXmRAqQhBW2oSQrFL47jyMuT50d1aw+OJatA5MovWTHY2vu1FZb4T+XD5URfWIaLZCWfwUS7YdhLsvZbN15jIjrH3wK1o/M6zfjuddA7j9+AV2Vz9BlGkc4c++QF3biWUM9Ek7C5cFtNtpiD1Pcu/IBEyDLBY7Wj4Oo6yuGYmdg4jttCHSNAZtiwWhdb1Q5FVDpI4EkSDVKUyWQuXm0QmYh+1TMX22orS2GZt7LIjtt2FVB8NeDSOscQCBVxrgER7LMOGQc9gOqjCPTcI8Mo11WUZRcacBCT2fEDNgQ1Qvu907KzRNQwgqeQbJyrXOY6xw4R9sdJxhIzD8xiwM+8iwDzbW3TTGaVc7jznmRUcfg+xT6R4cg6GmEVv+wjRNXxBY2AjR8pUgAffSaUydQnlNb7unbud4xrI79Vjf1YcY1l9Ujw3aN6NY0dAPub4Mrh5iOA05RjiPpBt2UcHxQgOOF1ciKTMfce97Ed1nRWSHFeFtI1BVmSDdtAfkSsUzwhwjoqVKtgPXcVIZ3BZ5wzdFh6UH9ZAdOA3vnccwd1kEW2FURe7Rs/iL4K6RO8K50mKBkH6w/HRk+vzfoV/mMrbDWE4DKQAAAABJRU5ErkJggg==")

/***/ },

/***/ "./imgs/buffs/Threads_of_Fate.data.png"
/*!*********************************************!*\
  !*** ./imgs/buffs/Threads_of_Fate.data.png ***!
  \*********************************************/
(module, __unused_webpack_exports, __webpack_require__) {

module.exports=(__webpack_require__(/*! alt1/base */ "../node_modules/alt1/dist/base/index.js").ImageDetect).imageDataFromBase64("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")

/***/ },

/***/ "./imgs/buffs/Time_rift-noborder.data.png"
/*!************************************************!*\
  !*** ./imgs/buffs/Time_rift-noborder.data.png ***!
  \************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

module.exports=(__webpack_require__(/*! alt1/base */ "../node_modules/alt1/dist/base/index.js").ImageDetect).imageDataFromBase64("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")

/***/ },

/***/ "./imgs/buffs/Undead_Slayer-noborder.data.png"
/*!****************************************************!*\
  !*** ./imgs/buffs/Undead_Slayer-noborder.data.png ***!
  \****************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

module.exports=(__webpack_require__(/*! alt1/base */ "../node_modules/alt1/dist/base/index.js").ImageDetect).imageDataFromBase64("iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAIAAABLixI0AAAGhklEQVR4XiWVW2wU1x3Gz20uuzPe9WVZe71rbGzjKxjbOAYIFApKCqR1Sppe0qhUUVqqNkFBTftQVZWqgKK8JG2jhIeqUqWmVR6CaNQEKAWo3dYQwA4YbHzDt1286/vae5mdmTPnnM7ao/+MvqeffueT/nNgE0IIAAwAgohAQAAkAEiCISAgBBhjBDFS/EgtcoPQynBRk4Y9XrV4bvZK9HE3xJIjGAfAHbIOghhCFyRBJLsgRBw9oimFfl8jgZskKBG5CEsFWHCAIPdwITFK+dbGo5YxvphIEIwdzoTLCUEXhCQIlfxgTXDmC81FdoZKOssbdigHdaVdEx2Ctuey+3O8PkfijM0JB1Gk6FX1ZdFHt/O+7uN6bYBkCFV3ENIQkAXFzBDpXHa3OXM6sbam4CRBK4gsEquNF3zHivRh7UN5dWa19vnOxra2h31fypICmOOy4IaUCrEXIQ/EhcyapDkLOmYjchLJ+ldr5BwmJiQWoIpYaiCTL9PCP5llp8nC/dzBl16ZGnxkMUEgyve9zkKePAjpCLleMlIDgTJaZ2mDuGhG1rMqUgQNcOSFoWGp8U3Z+Fgd+SATq53ILhXLsiJxByOICIAyWC8LQR0CJIAT+WrX5lc7IwcyZdnI6GalWR8/Pig0QLKYCmr7OSgklZfosPKvZbgyP2js++5JyPNCiGyUhbAGYU7S7Naf1O14DVeJv7/+5yV1KDJUM/yLvu5ffT70Zl95YHOREsBpjHLEDDml/Q3Rk/OpvQvf+9Eb7ceOWba1UXz+qwEQ00qUQENpqe+vb/1O2pT9+qnjBdES30CJBaypjlHiI8GiUm2n164w9Qn/oVN7Sx54xl58EJuM/fDXvwluKs2f0VWTkIsD4fRcOjfvo36fEcpovmhrLFeY3tbd8bXz3/r2b3+sz/t6Xrh08fcf3fzjpeSOZcGh31RXasWob7a+piW0YyduIJIHEY9wZEVPVe9XirdU+ytLJ+sQreg7NNz6qFJb8G8db8gdXVZi+ljL4N3GXl3Wd909kGlamP75QtXd/cvvP/nDXz4cutVLEESQ2cBftlT3bFnl3j3BFsRgw3Bk2yCuHy70UQU1osu//Nusf+LI6EtPXThYPlMVGaimwfTjM9EtY/tSp8av9X9a6STqVEQAozDSmqt/tjrY3FHaojHPkm7e2/e4aE6q/yJiynY8PA/7fKFgM60X4f9Gwp9FRIZc//4nhuFsf6f6ZuzTw3LC4/EsUIug2oO46un2is7toW1kDVxtu3/thftdtxtaexpuPz1VGlOCo8XHol1P6hbCI+UkDLoP/Mc3LZePVgw19vE1o15aSwu0kt9uQKzkNA3vrvXVMMCFAAFbfeUfLdtv7Dx34n9S+UrzuT2rnow3rWzpjwgknmxZWC3zPnxm2gMnLNV2dMq5YgMugHBfXGetUdVXVtha6i/OEat8tsTK+s++cVWvjp9857lrRyYKEEr5TSHbOCtphrqrpw4Yxd1t157/7Lna2K547KqViuUXTHDEAWRzXyYWY8BCGCJK+Hs/uxDaPHv67a4r7fGZ9seVU+GeE0OaIifaVuefiqe8ZtOAfubsmfbLz4zcOmsl7jjYwzhjQCCKCFybjc/1Wsn8QhEqH+/d+vK5wyMSPH/ixjd6tk4FDCuwVpz0RWvWjPKcBjySx2tMxx/++wfW5EWBZSoYBcIRLksIDtBi7Mri4qzHLjB1Y9+NDjYfePf16x02qrxb29cR9SMGKF50T6o6CAFdLRhZeZBdiQqpwODM5pwKlwWQIzhFspEcv3PvbbQMIUFQgHuNE4ngrd33qzKm0t/6ECxxjvBYZHZRSyLs2gumh+fVYptZphDu5FkbXhZnEHmHYxemx28WskDamz30RdOLvXuUwTBC/KcffeXIuS4D2d/8vKnlcjvVGOBAAtjiPMu5yYUNhL3OIq6XDQAGCEBwZ+5i1eph6EMOY8fPH7Ul6mCnZjJChWNiq3OgkWLGVOYhiq56LcENlwWgyde9AEdMADeZjAMoDcx83D99vYAXW8imxJYEwhLKEeqtJGvB6ThYtVSeMoyxhamFVJJi2eDMtVvvi7scwoHI4wDLV2Wm/zn0biDyfihQlHVY1rZSmWQ8kdjkV2LGyNCNTxRVWs4sO+kngqawbWQFsAWngDsCMCBg8/r9iDb+PAACQmo6XwtqFcvzD9LZVTM7BzMxyhwZCmAuOcLVdxNwgyUQhW7Iq+SFAPg/pK5WR11XQmYAAAAASUVORK5CYII=")

/***/ },

/***/ "./imgs/buffs/Vulnerability_bordered.data.png"
/*!****************************************************!*\
  !*** ./imgs/buffs/Vulnerability_bordered.data.png ***!
  \****************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

module.exports=(__webpack_require__(/*! alt1/base */ "../node_modules/alt1/dist/base/index.js").ImageDetect).imageDataFromBase64("iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAAATlBMVEUAAADy7/z7/f1XU4Lf4Oby7/zAxtOQlMbu7vDe3/aoqdnMAADP2/g4LFjP1+eRi7h6bagtMD92Y5euvNpeZodpToCBh7FiaZYxIkC6vsGNeFRnAAAAAnRSTlMAnxYjQ+0AAAB7SURBVHheldDpCgJBDAPgMe3ce3ke7/+iuoZixUUwv4aPEJiGvpHQw1d+Ypbxth/l+MbJ1wYizRIHNqvHapsJQNEpArjb5uKbB2JrHnNjMz/hdBaRF9pmrIm1pNE2LyugAKtfibvZb87BNl0a8eOf6q9UFdDC91/33MgDsRcFgY9uxHoAAAAASUVORK5CYII=")

/***/ },

/***/ "./imgs/buffs/aggression_potion.data.png"
/*!***********************************************!*\
  !*** ./imgs/buffs/aggression_potion.data.png ***!
  \***********************************************/
(module, __unused_webpack_exports, __webpack_require__) {

module.exports=(__webpack_require__(/*! alt1/base */ "../node_modules/alt1/dist/base/index.js").ImageDetect).imageDataFromBase64("iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAMAAADzN3VRAAAAAW5vUEUAYtdMlAAAAAlub1BFAAAAAAAAAAAAoYpy1QAAAX1QTFRFAAAAhnk4fnA0cmYvp5ZGopFDk4Q9dmkwpZRFno1Bj4A7cmYwEQ8ImYk/i305amNDTk5TfH2Hf4CKgYKMdXeBaGlxWVlgfn+Ifn+JfX6HcHF7YGFqQkNJgICLgoONgIGKcnN8XV5mDg4QhIWPdHV/XF1lgIKLgYOMf4GKcXN8XF1kfX+IfoCJfH6Hb3F5X2BoSEpPe3mDe3qFdnV/bGt0ZGRtVFNbinSHiHSGgG1/emp6c2VzZFpmejBhgUNshlZ3dzdidDVgbjRcZS9UcABIcgZLdRJSawBFaQBDZgBBXwA9SwAvaQBEcwBKdABLcwBLcQBJbgBGYwBATwA0XgA9agBEawBGbABGZgBCYwBBXQA9SwAxQAAqawBEaABDZwBDZABBYQA/WgA7TQAyRgAuGAAQcABJbwBHbQBHbQBGZwBCYAA+UwA1SwAwQgAqdQBMcgBKbABFWQA5UAAzdgBNXQA8VAA0SgAwaABCVgA3RwAuWgA6QgArQwArMQAg+n43KQAAAH90Uk5TAP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wChbKkAAADhSURBVHicY2CAAUYmZgbsgIWVjR27DAcnFzcPVhlWXj5+AWwSgkLCIqJi2GTEJSSlpGWwycjKySsoKmGTEVKWU1HFKqOmrqGphVVGW0dXT98Am4yhkbGJqRk2GXMLSytrGywStnb2Do5OzlhkXFzd3D08vbwxJHx8/fwDAt2DgtElQjxDw8JDIyKjomPQpWLj4iMSEkOSklNSUSXSXNIzMkOzgrJzcvNQZfLz/RgKGArjEoqKU1BlSkoYShj8GQqzSsvK0ewpgVAVXpVVaDIFEMqzugbDQxBQW4ddHIcwBgAAUpwoHVLIGhQAAAAASUVORK5CYII=")

/***/ },

/***/ "./imgs/buffs/antifire_top.data.png"
/*!******************************************!*\
  !*** ./imgs/buffs/antifire_top.data.png ***!
  \******************************************/
(module, __unused_webpack_exports, __webpack_require__) {

module.exports=(__webpack_require__(/*! alt1/base */ "../node_modules/alt1/dist/base/index.js").ImageDetect).imageDataFromBase64("iVBORw0KGgoAAAANSUhEUgAAABkAAAANCAYAAABcrsXuAAADSElEQVQ4T3WSXWhbZRjHz40ycHRa1y7NliZLcpqc74/3nKSr1ZXa5iQz3ehWZ6yFdabJqmXA8MbBcDdWEFBFvBO8FLxzDsS7bQi4IQjeyRTVNl3ztVIju/77vO+aLFAEfnnej+f9//KQSLqbgcGyMImD0adwMEaI+jRs/wQcP4tpT8aMn0DOS2AuE8cs1RmCn7t+RvRxLI43LuB5PJfnS10Bv3g2eQDVfxiqHYZD8gEKS2LWT+JH6zyaZhkN6yJ2Tpto2BfEnp/nScR7Jnxrn6wrkroCfnlYewblloNy08HztG4YFNzHw6KDh2fTaAfj++5KTKcvJcPJTDyR7YmkEBtAiB0ieB3A8oaN5U27t+9SpKlunYrgzisRfDEzihyT8Yk9hdb0FJovFlA338RPZgk5b79IirwwiKX7JmH00d3zaiIyOYjf5+OoLxwXLE7YcFgGL7ka5ij0XpBC62QO23oZWzRVjo31REISf3kYpV+0/0EXNT4zjAfnYqgT24RnOyhkLaye1OAzhu+CY2hM0jTOEolWcM8oIWCp3jRSqhhGPwt3FUIV63TfeX0hisYek7aBq0Ea8+M6ik4SD7QK6tl5qiuCLdpXHQ8nPPZYwj8CV8GWWoF+LoL52ymBvjCKu3MJmKYNSzfQLI2i/UYE7aUI7tP6gzNjCMw4auoKURHBeSeFis1QozWH5wqJ440j76ioKRXYizHMfT8msBePo/ZqFO9Py2C6gp1qGLtrI9i9TFO9FcY3Z8LiTZeiJcNzGQJbwSZJ+VneUZD1PEg5W8MP6uvYSFfBLiTg9eEYBrZ5+DtH0Lk2hH/Xh9Bafw43lkawQSEbSlVQ0BP4+WwUU76LSdfGx8asOOe5PF8qWBr+JgEnb6niX1N7LYrN5WNQVR1aOo3Oh0N49PlhtD8axLerI71+zvpsBK6uoV0+it/Ox2DT+wLl9DIfS3T8laoKCqYGl5paJLgeyFAUDelUCo++HEb7s0HcqISo71KPm2shMEWGpavYvRJCk945zCeJttdDmZQvFUwdf4xdwp8EXzNq2nl7BO+dToJZCn799Ah2v6bfYPWo6Oly890YOl8N0BQyDJJ0rg9hZy0Ml/k4Zeiih+cWTB3/AevtgvCsrUp3AAAAAElFTkSuQmCC")

/***/ },

/***/ "./imgs/buffs/balance_by_force-beta.data.png"
/*!***************************************************!*\
  !*** ./imgs/buffs/balance_by_force-beta.data.png ***!
  \***************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

module.exports=(__webpack_require__(/*! alt1/base */ "../node_modules/alt1/dist/base/index.js").ImageDetect).imageDataFromBase64("iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAMAAADzN3VRAAAAAW5vUEUAYtdMlAAAAAlub1BFAAAAAAAAAAAAoYpy1QAAALFQTFRFAAAAAAsMCiokG1U5F1E/HlM7FVA+G1M+EWRCFE07DSEWGXRUFUA2CRIQEW9JEDcoCA4METorEzAnFicdEi4lFTErFlRGCycbCBEPDz82EjsvDxUREFAwAwwIHE03G086EV9BFDwyETEqCA8OEB4aEygiFzAoABMNEUsuFD4uFkAvF0MxFDYnBREMBQ8LDzsnE2lGEG9KEVI1GlpEEDkuE0MxF0g1EEMyEDwvG003AB8ew29rlgAAADt0Uk5TAP////////////////////////////////////////////////////////////////////////////+SQC1NAAAAdklEQVR4nGNgoDJgZMIjyYxLgoUVlwwbOy4ZDk4uHDLcPLw4ZPj4BXAZJyiES0ZYRFQMu4y4hKSUNFYZGVyGMcjilIEAOXkFHDKKSso4ZFRU1bCKq2toamnrYNejq6dvYGhkjF3SxNTM3MLcEp87cQErcjQBAQCReQbnR1+wMwAAAABJRU5ErkJggg==")

/***/ },

/***/ "./imgs/buffs/cannon_active-top.data.png"
/*!***********************************************!*\
  !*** ./imgs/buffs/cannon_active-top.data.png ***!
  \***********************************************/
(module, __unused_webpack_exports, __webpack_require__) {

module.exports=(__webpack_require__(/*! alt1/base */ "../node_modules/alt1/dist/base/index.js").ImageDetect).imageDataFromBase64("iVBORw0KGgoAAAANSUhEUgAAABsAAAAMCAYAAACTB8Z2AAAAAW5vUEUAYtdMlAAAAARub1BFAAAAAEEgjiIAAAAgbm9QRQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAxDpOEwAAAAZub1BFAAAAAAAA7Gu72AAAAAlub1BFAAAAAAAAAAAAoYpy1QAAAAdub1BFAAAAAAAAAFrm3tAAAAEnSURBVDjLvZJBT8JAEIXfzNuC1wopNogk8Jv8k/wgIyExQbgZvRhbObTjgW3dAsVq1E022d3Zed/smwX+cUjXi/Pp1Ogc8t0Om+1W/gSWXqV20YvgSJCEkijLEgBwv1rJr8Em47GRBFVBEhSBkHXczPCa5cjy9/nL89PDj2BpkpiLIlQgRwIiUFWI7FO0Avr5luVYbx7lW7B0NDI6B+fFVRV0bg/wMK0SPRhmMAAlgLvlshXows1lHM8QCqkeVSZhhUFcAGhRnLWxoRYBi6PDAwu0KsT3LixARJAMhotOMJBQkU97GrTgPIiLF1EPGw0Ht51gQs4oUr/iq3+th3dOWN/+sia4KWS2n9X6RDGVxTfXEzsLS+J4EfaibRQt67oTAPr93sncD4IBPFzeFxBYAAAAAElFTkSuQmCC")

/***/ },

/***/ "./imgs/buffs/deathspore_arrows.data.png"
/*!***********************************************!*\
  !*** ./imgs/buffs/deathspore_arrows.data.png ***!
  \***********************************************/
(module, __unused_webpack_exports, __webpack_require__) {

module.exports=(__webpack_require__(/*! alt1/base */ "../node_modules/alt1/dist/base/index.js").ImageDetect).imageDataFromBase64("iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAMAAADzN3VRAAAAAW5vUEUAYtdMlAAAAAlub1BFAAAAAAAAAAAAoYpy1QAAAEtQTFRFAAAAU1laMTQ2bHR1TVJUOjQohY6QTFFTU1haW2FiHiEiAwIDVWVOJCEaRFA+Pkk4ZnZbHSIaXGpQWltEWmlQS1hESU06UWBJVlM9mDpC4gAAABl0Uk5TAP///////////////////////////////zBTSd0AAABPSURBVHicY2CgEWDEIc5EsknMLDilWLELs5FsBwM7BycXN4LLgyTFi6qSD7ch/NiFBRgYBIWwSwkT5TgUIIJdWBSIxbBLieM2TIJ0+2kFAFDIAS1Y11HCAAAAAElFTkSuQmCC")

/***/ },

/***/ "./imgs/buffs/familiar-top.data.png"
/*!******************************************!*\
  !*** ./imgs/buffs/familiar-top.data.png ***!
  \******************************************/
(module, __unused_webpack_exports, __webpack_require__) {

module.exports=(__webpack_require__(/*! alt1/base */ "../node_modules/alt1/dist/base/index.js").ImageDetect).imageDataFromBase64("iVBORw0KGgoAAAANSUhEUgAAABsAAAAQCAYAAADnEwSWAAAAAW5vUEUAYtdMlAAAAARub1BFAAAAAEEgjiIAAAAgbm9QRQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAxDpOEwAAAAZub1BFAAAAAAAA7Gu72AAAAAlub1BFAAAAAAAAAAAAoYpy1QAAAAdub1BFAAAAAAAAAFrm3tAAAARcSURBVDjLvZRPbBRVHMc/82bedGdaaGFp0ZZKC1IQWqpBghD+JFBqMEYQ5SBIMBrBm+gBY4yJxoPiAVETg4kJiUCMoiYcjFgwlUIIaKEupaUpYFu6bWVb2qK225k388bDLl3Ru3OcX+Z9ft8/b4ytn9wb8T89FsDXe9IYQhBpTWSYCCGwpIUOA17/8FMunDrO918exRAmANOmFLF513Mc3LcfTwUASEuitUYIgQoUpjAJdTg5e+pdCwFgCIEKdXaQAaXTaSbGxijQmi179rHj1TdQykMpj7nLlxNzHGwZQ1oWlgEqUHcdHuoQacm7lAkgoygMMUyJYVpEYZAdG7QnU1w9/QNr167k0Se3EpMWBeWFtPxyloKYi1IKbZiYWdWWtFCBQloS35v4r42GKbFNmZUPWZEYBvT0Xic1OsiZpgY2bd/OeL5iVl4Z7YOdSBuEAaZhYNmSQAUEYYS0ZBZoEkT/gt2xTZqCUOe2M02TnsYfKX9kGZ2Ji5woKaWmehMA9duqmFcxk8T5Zj5+723SaYW0bJQ/gSlMhDAJsrYK08zZ6Hk+juOgQo0p7uwRQaQZS49PblZs2YyoK9zobSF5rZNzbcPMXrKUJ3a+gtAhYRgQkxaB8jGFwHGcTJ5K5ZRpHeJ5PgATvgIUeVJSNb8G13UZ7+2ifsNmJmYIllevZO+h3fQmmimvfRief5PV69cxu7ycC6cbaT17mvT4OFEYotFoBHl5dg7mOE6mRdImPeFhonDjxbiuS2EwnWU7tpAaGcWOoPmvXl7bu58jHxwA/yYAg8nfcQumsmrDRja/uItA+XS1d3L10kXOnTzO6J8jQH4GFqiAUGs8z8e2JZGKmF5yHxCx453dDPWnSI3AH8YQseYUbfExljy2ZdLeniJFQZ8LQKq1g5JpRcyrrWbppm00N35HvlMARBkYgG0JQh2hlUdp1WIMw6B+2046rvVxpqlh8uD8klLus4sBSA+0MRj4lPmzWFBTnolhzhqq3RgApWqIsoq5dFxpB6wMTAUKLUwIfSpKK5k1ZwZ5A5Lk5VO0Jzrwh8cAKFtfT31dXa7L81cDUFRZO/lqhispzM9c5kOfn6Cz/TJaG7nMTENgmQZzqhZxz6LMh7fdcW4nOogVTwF7ZqbudXUUVdYy2pUAYPX8Ci75hRlIvmRoTFGqhmAUDhz5loPvv4XGQIUBIDMwO89m3eNPc391JW39XQS3MlV1yysBGO7rYeWqNcRjJre6ErS1drDxmWdBDSH6WxkcV2gJyd9ucPT8z1xoaqC/vw9LCKTjgvqHMh0GNBz7ipZTccaMkMUrVrHwoYUkvT78vgGmFxRTGM/Ut+WnJux4Cce+OMyimgX4NwfQUwvp7kpy8LOPSHZex7JtyF5qGYVEocpl5nke0o5xczjF1HicBx5cgcMo3CqjO6ZwY1BZNo+Txxvp7u+mIpvPN4fP0flrgqKiPF546WV8H4S0CcIIx3FIp9OkJ/zJ/+bfo+3cbS+N49wAAAAASUVORK5CYII=")

/***/ },

/***/ "./imgs/buffs/fsoaSpecBuff-noborder.data.png"
/*!***************************************************!*\
  !*** ./imgs/buffs/fsoaSpecBuff-noborder.data.png ***!
  \***************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

module.exports=(__webpack_require__(/*! alt1/base */ "../node_modules/alt1/dist/base/index.js").ImageDetect).imageDataFromBase64("iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAACIklEQVR4nMWUXW/SYBiGyzAGVRgbSlgKK0BZS+k3A7oW2PgsGwOQCBiXzRiNzARxfmbxFP01Ro899L8Yf4GHHtwCRpMlnjDaeCXv4XNfvd8nbwliCTxDHcmvY3CfHiL05SmcDQHL5F2gb7ZwNRtG5SSJ0yGH8UiA8USFw3vdOokh6UjLNAb9GB4/YsBIt+EzAiA2iLkkUauikruzvJBXt6Ad8aBe50FcWwGRvgLCICAneGTPNBDrNxaX8BHpwlAlJ+LegMZqjwXR9oKouHByGse7cxX1SQneSQvfPv6kFxbdNQ/+ivJ5Cey0iTM73UPXB1fTgwdDBm/fyKi9L8P9oQ0mxC/ehg4H0SsN5oOyQONwn4N6TMGl+7E/TOLFmTiXmJMinF3l8juJUiQUnoGW4tHvZKbBCsolEvX7HF6epzB6pWJzZMDhu7nc4tNiAvVdDc1aBs+fKRiPZITjQZAhNzaCbhB+z3KCFM+iWkiDi1MoG9toVXMoaKJ174ONUYhRJIKBdagiA01JopCVQZGkdRJ+KwJN5VHcUSBxcejyjnXhf5h99baUQIIOWx8+w8zr4GnOnvDfAgO+tVV7BN8//1BEJgo2FrWvQbtYQ1FP2SeY0SzvISNI9krqu3mw1CV+cv9i2D2eB3WKTRwd9NAo5dA1TQT8PmtbGGkSncMo1rwuOBwr82OpYIZgbOKWGbfv/ht7GlICjVIhYp9ESFp89/+DX5nr3Kxd0jHZAAAAAElFTkSuQmCC")

/***/ },

/***/ "./imgs/buffs/icy_chill.data.png"
/*!***************************************!*\
  !*** ./imgs/buffs/icy_chill.data.png ***!
  \***************************************/
(module, __unused_webpack_exports, __webpack_require__) {

module.exports=(__webpack_require__(/*! alt1/base */ "../node_modules/alt1/dist/base/index.js").ImageDetect).imageDataFromBase64("iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAAAW5vUEUAYtdMlAAABW9JREFUSEullgtolWUYx3/v953brmdn6ubcbOp2hJlg6tx0WymFGa1QKSnDaUgQtU3RJBWT0hyGWZaLiGRKCWlhgRfwEoWatqYppi4n3nPOzemZczvbOpfvje9yLrMr9MLheznf9z3/9/9/nuf/fGLE2CIp0JdEv0oJxsZais3Fg+ULEHY7Ha23keEwUgshtTBaoIee9kt03WpCdSYzesYCpJDcaW4mHAhAOEi4z4/IGztB6lFFJLAFInU0oZCZX0ZGwSTutvvQQgFksJeutia6b51HagHjVMLuIqfoGT7ZuJCVWxq4dbqRUO9d7v12mq6bjYi8ccXSBBAIJEZwkxjCZmdEcQU9/m66287RfavJYIHU9CfNd4TA4cnhkSVrWTbNS+3ha5zcU0/zkTpCPR1GPJE/vliCYgDoMhlQUjNwVHsiWjiApoXNE1uhDU31kxksnAyf+jLvvTmbJFWhV0oqKpbTeeEI4UCvfh4dZJLFRAewWBi5ie3jUmSRjNwT2FMyKFm8jlen5fN5/RXmTBzG0podNB/8jMC920hNQ3gLS4w3YoF0FkYJxLIfv4//2+Ygc0w5q9Yv0NNHzQcHeK16KkFNY8XcKvzN5wzGBoiZEp2+Zmjcf0mr5HTYeHYCNTGN/CdfZ86LD7G17luuNewlJXcslcsr2LxhGzca9uEtnYHwTiiVwtI4Xq74MjZjx8CMQwgFZ3oO5UvWkjYokS/X1NDXeRN7ood5NWuMw/504BQhfxdi5IRSU644AvFimXsdwAKy9sJmw+HJpnBmFWcP7UYqNpZtrmF91fvkFZcwalwuJw79SvvFCxaIUVWxFZFMGLFNicxr5CcQqp3BBWUkeLJovXKWjOKneWtxOd8cu07jkSYyc7Lwt3dw40zDn0GiAP3SHukfC0S/KCqJ6UMIBUMk5Y5n9UfLSFUVeqRk1YpttJ/8GlUBf0erCWL1oim1pVs8M52FKVkciP6cULAnDyRryjyWLH6KbQcv8PwUL+ve2UHL4a0EOtuNnhMj9eoyXjCP/t9ALO9RVFyZXhZtqcVpU9m0cS9zK58gENaonV+F/0aT2bD/B0Q4E3F7S5n99iL21u2l5fh+UoYX8tzSOez+eCe91y/iGTzUBDEa5t+YRKSKVJpQsCUPoHThuwzI8bB/3VpDngF5xUxfVkEoqHFi9wlC9zr+poTvy4uRCcvPQENIgVRtOD3ZFMyo5s7lq6QOzmb6K5PZt/04ioDc0dlc+fkiwQ7fP4MYObq/jC1PU+wu8h+rJilrKJ2trbhH5fHsjAL2/3CVttOXGTgsm0B3D23nGq2Ot8wr0vkRN45WsRU41pS6RSu40oaghTXSCh6nomY+bptCjybZXnuYvpvXsTlc9HW29QcxKiGaHNP2jUaM5iPim5bVKwq2hDQySl9g1tJZ1B+9RElpHvu3N9Jx+hShbh9Sl9c7IeLCpoFEzdKiEbOY2DCTMmzeVe0kZOYz89NaHA6VfR/u4dHKckIhjV2VS5H+ThLcDyDyC/V5Yp74r3qkH4jlX2YRCNSEVFK9ZTz8RjVnvvqelqO7SBlRSFH1HBo21NF+Yhfhvl4TJDpP9FI24aySlqCZ0kSGWLTKhIrDPZAxiz7EnZ3CL7WbuHP+O9TkdIpXbiToD3JszUsEu3w6yEQLRInmOWYp1hdMxCTjp6VewulDyZ2+AN+perR7ndh0S3MmIZOSGVRcRtPW1fT6riPydBBjfuuhIwwijMxZH1kxNvpst+MZNRmHO4v24zt18Qz9ncmDSBgwDM+YIn73ddDy4xfm10p8yZo+Fscq2oSxLxnjC0S14UofQrCvm6D/LoTDBoAjaTA2l5vkjHxsKQMJ+Fr4A1hgdXXvKnuSAAAAAElFTkSuQmCC")

/***/ },

/***/ "./imgs/buffs/powder_of_penance.data.png"
/*!***********************************************!*\
  !*** ./imgs/buffs/powder_of_penance.data.png ***!
  \***********************************************/
(module, __unused_webpack_exports, __webpack_require__) {

module.exports=(__webpack_require__(/*! alt1/base */ "../node_modules/alt1/dist/base/index.js").ImageDetect).imageDataFromBase64("iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAMAAADzN3VRAAAAAW5vUEUAYtdMlAAAAAlub1BFAAAAAAAAAAAAoYpy1QAAAW5QTFRFAAAAZlIrUkIrYU4ua1YrblcscFkuZlIqYU0pSDotUUErZVApcFktc1wvdl4weF8xblguaVMqYU4pV0UmSjsiQDQnRzkqZVEqb1ktemEye2Iyd18xYU4oWUckTj4jSDouSjswOi4kQjUnZ1IqdV0wfGMyfWQyaFMqW0olUUAoUEAySzwvQzUnYE0palQqcFoud14xe2MyfWQ0f2U0fmU0emIydF0wb1gtaFMrYk4oUUApQzQqV0UxXEowZlIpbFYsclsudV4weGAxfWMzc1wwbVcsU0IpUEAuQDIpWEY4WEc5YE02Tj0pcVsua1UsXEkrWEYxSjsvPTAmVEQ2WUc6XEo8XUs8Wkg5YE06YU06X0w6XUo5W0k4V0U1UkI1Tj4ySDktEg4MWkc6XEk8XUk8W0g7V0Y3VUU2V0Y4WUc5VUQ2VEM1UUE0RjktRzouTj4xTj8xU0I1STsvOC0jJR0XHRgTHhgTHRcTHRcSHBYSjqcgawAAAHp0Uk5TAP////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9bcsYGAAAAyElEQVR4nGNgGBqAEasoEzMLKxs7B4Y4Jxc3Dy8fv4CgkLAIioSomLgEn6SUlDSPoIysnDxcXEFRSZlVRVVNTU2ST0JdRkNTCyajraOrp29gaGRsYmpmbiFuaWUN12Rja2fv4Ohk6Ozk4qos7ubuAZfx9PL29mHjdTRw9PXzD9AODILLBIeEhoVHRERGRkXHxMbFJyQiOS4pOQVEpYakpWtpo3ooIzMERGVl5+Si+zUvv4ChkEG7qLgEIxhKyxgYyisqMcQHJQAAm8whn6isv2EAAAAASUVORK5CYII=")

/***/ },

/***/ "./imgs/buffs/powder_of_protection.data.png"
/*!**************************************************!*\
  !*** ./imgs/buffs/powder_of_protection.data.png ***!
  \**************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

module.exports=(__webpack_require__(/*! alt1/base */ "../node_modules/alt1/dist/base/index.js").ImageDetect).imageDataFromBase64("iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAMAAADzN3VRAAAAAW5vUEUAYtdMlAAAAAlub1BFAAAAAAAAAAAAoYpy1QAAAWJQTFRFAAAAMUguOz0sPkgxM0wwNE4xNk8zMUkvL0UsSDotPj4sNU8yNlI0OFQ1OVU2NE8yMUovLj8pLTclQDQnPzgqMUkuNE8xOlQ1O1Y3PFc3OFQ2NVAyLkUrKkAnLjomSDouSjswOi4kPDQnN1Q1PFg4PFk6Olc3N1M1K0EqOTwqUEAySzwvOzMoMUUsMkswNU8zOVQ2O1g5PFk5PFo6O1c4MUouMEctL0YtOD0rQzQqSkIzQUYxMEgvM00xNlEzOFM2OlU2O1g4N1E1NE0yOT0rQz0uQDIpWEY4V0c5UEo4T0o4OzoqN1E0M00wOUMuR0MySjsvPTAmVEQ2WUc6XEo8XUs8Wkg5WUs7WUw7WEo7Vkg5VEg4U0Q2UkI1Tj4ySDktEg4MWkc6XEk8XUk8W0g7V0Y3VUU2V0Y4WUc5VUQ2VEM1UUE0RjktRzouTj8xU0I1STsvOC0jJR0XHRcTHBcSGxYS6KpYLQAAAHZ0Uk5TAP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+7SgR4AAADESURBVHicY2AYGoARqygTMwsrGzsHhjgnFyM3Dy8fvwCHoBCKhLCIqJi4hKSklLSAjKycPFxcQVGJkVVZRVVVVU2dX1RGQ1MLJqOto6unb2BoZGxsos5vamZuYQnXZGVtY2tn72Di6ODkzGjm4uoGl3H38PTyZvORklK28/Xz1w4IhMsEBYeEhoVHRERERkXHxMbFJyA5LjEpGUSlBKemaWmjeig9IxhEZWZl56D7NZchjyGfgaGgsAhrEBWXlGIVH3QAAHgpHz/AKJarAAAAAElFTkSuQmCC")

/***/ },

/***/ "./imgs/buffs/putrid_zombie-top.data.png"
/*!***********************************************!*\
  !*** ./imgs/buffs/putrid_zombie-top.data.png ***!
  \***********************************************/
(module, __unused_webpack_exports, __webpack_require__) {

module.exports=(__webpack_require__(/*! alt1/base */ "../node_modules/alt1/dist/base/index.js").ImageDetect).imageDataFromBase64("iVBORw0KGgoAAAANSUhEUgAAABkAAAANCAIAAADTzFK5AAAAAW5vUEUAYtdMlAAAAAlub1BFAAAAAAAAAAAAoYpy1QAAAulJREFUeJw1U81rVUcUP+fMzHv3XRNNoFThCSl+oPhJ6aKF0kVcCEp1UylFrF256MqNqy4E40JQ/DNcaRNESEDaRSnNIgQEFUys+IW1pYbYF1/ey71v5pz+5ol3cS93Zs7v/D7O+EPbzzELSxAKxESmahEfYSfkmRvYJVIroztcFie2Ppq/w8/rvWdOPbp9k2uamJxMc+8GD7uUzIsIGcociomZ2NjETIU9DxeZPRZld1l/FZdmf+barEw4x5F2Hj/my1b8LHB06cWGJxSIsKHGoThTIyVORKCDncAU2Jm0i1e/z368a9/4nj1LN27Gbh/9/plfHNh6f9Dd/8Op6pcOmgs6c35QmQkaJ1NAgyHeYUjQeIV2HT3+9Nbs5k92UNLl6Rlphd7rN9SgA6e/q9e6blPDf9Dis2vZoACF5pJZZkXkHRaN9KUGHd18cOLJwl0GV29klJoclKlnNF3Hf5N30sCq4zBk4d1718gp7IdgHloJ3Qk+yH9/vXRvUmwZWiIPGVg0xWFaEX6r4IWkUCwue5wtAxyAoEvEaPgLKAnkRgNv2I5vTj6+PaOxQvboZRq7b18VW8ZpNWMV0KZQREPvcpzAhWeEo5Lhsc9pQLQKXfZs7i5FnGbVhI5WDUJzRBrOTPx7p+CAEUvTudJz4Tiy9CzVubXL4aDG9KECNq33Mz5gXdKNCoqK8TGrqsSSE8yMmuy3edof3L6GttRHz3+qPVD3N0uVp84jjAd0aPdZ+lJ6IyvLd27pan+okXzVHHQ3AIP5Ii45HGzKidbCpSvut4JCsHITjPr8/DmZi+6ecT9bZx21e8RL7NoffXrmx4Xr13ighNhfJ+sjI/AKAi72dWPx8lXMl0VkU3O/p+XIHxcufjH1k7OGLDnqWE4bw4EJeJbsPuT61F2jpqeWeI8ZwfiMeTlSLE5dHd5Fi1UN53xZqHft779dG606259ubR8Iv3ruWL5hMBxj0FFRiqq0Xknb2aizdfsfhQlMvDg+e7cAAAAASUVORK5CYII=")

/***/ },

/***/ "./imgs/buffs/skeleton_warrior-top.data.png"
/*!**************************************************!*\
  !*** ./imgs/buffs/skeleton_warrior-top.data.png ***!
  \**************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

module.exports=(__webpack_require__(/*! alt1/base */ "../node_modules/alt1/dist/base/index.js").ImageDetect).imageDataFromBase64("iVBORw0KGgoAAAANSUhEUgAAABkAAAANCAIAAADTzFK5AAAAAW5vUEUAYtdMlAAAAAlub1BFAAAAAAAAAAAAoYpy1QAAA1xJREFUeJxFk39oW1UUx8/98X7kpdmabE1WbVPWdVpdNzVqUafunyFChf2zUf1DZQOZhiHdP1a3gGxqB/NHddB/nBMEqZrN2RQn+0Nw3UTmDyiCOCpmNbVbkza0TZuXvJf37j3epMOdy7tcHud87vfccw7f3n6AICOEEqpT4EAAUEj0iTKgMtKcP/Q0fvEhTE+B+oHIXh9evPQ5cG5EtzbXYsZCleVu6DPzKo4T4LQexlQkJQ0WUHX2Q+bCS7vF+McwlIH/DdG5Px548B3N98pvHKSPvJz7anBLd1JEI9r8imKpxZUuJaquDhhqtLD/sdq3I3Dqu9sQw+i49HPUk7/tvA9On6N2jTS3QCxi3tGTXcl0bdhHlmoqXuFoY1fyeLG/177yKZwZv01xnXsv/sLtWul4ZuLFXnNbT9PMKlg8+tzgXGpfJDniDPat7uVUtnJGdYKoKO7mWDERFOkUNPJsGOk5/wMUbTeZxrmSgaJlY3Dh+PCmU5e1VddtCcpImBhW7MTFQqov8PwnnCoWIcU9CfubY5Bjt0CaET+d0Rcrlf2f6WWhEwaUg4Sm7KK4PK2XvEC+QgVuuru/cKSvdWDU6Njxz9WTvPzkPU7Mqpx7GyhDxPW9T9x5+BhbrtaSZ4kndEQgjCqWSpZC+PeCNWdb+SrzfD+oB9s6oLOLSLbx2bduDD3DF91J/H4y/OiubcmjpmnMfvmrM5jhwLhpoiZRFVUS5sq6WgX1pD5bVQVSMs0lt4yEhcI339vT9tqFDXtTPDF0solR+DE7e3RcSsXg0rdL7k2DhtZp7dL1VJ+otqFVn6FEVWgECmoD7vjWvLPlrlf+nv7LL2StrTt56al3y9SQoaCIhq5PfmBXclJ4t55eldc0H9/8PkVAS6cVl9QhjXZWGSMGiq4IW7yrq5A+0vbqWXUpQU6d+PrrV96sucuoQCjrzkDiiYc7e7ZPjB7a9cAZXhWUCrJGAiJQ6Kq3VzzIVzofSuXbLzjxdZwRJgOaszpT95JrFFgbl4Nfj6nhmrn2p9fdql0r8KrfQBGpfNSnhs4HXPaWNAh299m6z4FqMhRYmkqj56J6EeUmRP/A4fRHw0OJHQOjo9mrP/2be2H3gTEyNsV8URdc5zSSFEqb7oV0/48J58TIf8iTdyIW+EFBAAAAAElFTkSuQmCC")

/***/ },

/***/ "./imgs/buffs/smoke_cloud.data.png"
/*!*****************************************!*\
  !*** ./imgs/buffs/smoke_cloud.data.png ***!
  \*****************************************/
(module, __unused_webpack_exports, __webpack_require__) {

module.exports=(__webpack_require__(/*! alt1/base */ "../node_modules/alt1/dist/base/index.js").ImageDetect).imageDataFromBase64("iVBORw0KGgoAAAANSUhEUgAAAAwAAAANCAYAAACdKY9CAAAAAW5vUEUAYtdMlAAAAARub1BFAAAAAEEgjiIAAAAJbm9QRQAAAAAAAAAAAKGKctUAAAAZbm9QRQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAzWlrwAAAAuG5vUEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwlYAHAAAAYhJREFUKFOFkF1LVFEUhp+9z3GOnjl6RmUYJtNQh5wxEmL8FsELf0Q3XfVH9K7fEPgrQlKoKIkUydBSifELP5q5kGOONkM4s/fuos7BCO29WgueZ72w4D959nzOTExNm3C3AUqlokEIVr5ss3NSxHEasKTEAMuvXnMeBNEBCXD8rYSUgqEHWbpSSZTSaK05LBTYXPsUwZEwPJgXQfAd27YY6u/Da2zksnzB6tslVL3+rwBwdFKkWqniuS5jD3PsbW1zdnqK0RqjdSRY4ZC+2znTcacDv6WZs+CcICiTTKWwLQsNHB8ezP4l1I2ZyWQyNDXFebn4Bjfukk6nud+XJZvLsTD/YhZAhMJAftD4vs/YyCRL797jxl26e3u419WJ3+rjeR5PnzwWAiA/Om5qtStAUilXsGMOTsyhtT1JItGGlOC6Dr2Znt8Nj4ZHjVKK6o+fqJrCthvYKWxE7dfz50uG+pVGK0NzS+JGmFDQGrQW7O9uis/rH26EAeT41LSJ2XG+bn28FQzzCxKPiIqW6JCJAAAAAElFTkSuQmCC")

/***/ },

/***/ "./imgs/buffs/split_soul_ecb.data.png"
/*!********************************************!*\
  !*** ./imgs/buffs/split_soul_ecb.data.png ***!
  \********************************************/
(module, __unused_webpack_exports, __webpack_require__) {

module.exports=(__webpack_require__(/*! alt1/base */ "../node_modules/alt1/dist/base/index.js").ImageDetect).imageDataFromBase64("iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAMAAADzN3VRAAAAAW5vUEUAYtdMlAAAAAlub1BFAAAAAAAAAAAAoYpy1QAAAbBQTFRFAAAA4bUtwpwn7b4wzaUol3kgAAAQAAAIAAABAAALAAACAAAKxZ4nZYaDIxwU5LcuBwcHC1ZZOC0Xc10X0qgqBCctAjQ/ACEnxKA1u5Yo4rYurpEpvJs1Slo9DZGvACw1ZoxZp5MxhJJcr5NCrowkc2MgxqM5q5JFEabHBEdVDbe/naJJOM24iIdT27AsupUmt5UsSoJgFrbbCGJ2Db7FrZk6Mbi8jpZDNywM5Lgvt5Qotp8ynKlYRY+fIc/UtpY1d397LsK8brl/FtDXqpQv78E22K4uwJonkYZwtZIo160s1astLNLGu5o2i4V/eHJvcl0bX3FvDbK4X7WFnpF8jYaCo4xKzaUqjoeCe3Rw4bg806oq6bsvN9XCpoUhP1BPkZCMXFhVWFImq5Rblo+KinlNyKEolY2Ih4B8sJVM06kqtLdOaL6HqJAsC3p+hpNygnt4WVAbSkdFSERCs5AjuZ9bcGtn47ctqqxJvqQ0QYplOJF1jn0oSkZE160usJpkhX562a8slpI4mootNSsLGBcXSUVE160q160roZR7lIhtalUWooIhuJQkWkkTf3l151/JKgAAAJB0Uk5TAP//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////Fh588QAAANpJREFUeJxjYKA6YGTCJcPMwopLio2dA5cMJxcuGTZunMaxIXF4eFGk+PgRHAFBZCkhYREGBlExcSBTAs1ASSlpGVk5eQVFJWV0u1RU1dQ1NLW0dXTRZfT0DQyNjE1MzczRZSwsraxtbO3sHRzhQk7OLgwMrm7uHp7MXt4+vn7+AXCpwKDgkNCw8IjIqOiY2Lj4hES4TBIDQ3JKalp6RmZWdk5uXn4BXKYQiIuKS0pDy8orKquqa2rRXFBSV9/Q6JXW1NzS2oYm1d7R2dXd09uH7mgw6McqSgUAAPsLKdnnTA79AAAAAElFTkSuQmCC")

/***/ },

/***/ "./imgs/buffs/supreme_overload.data.png"
/*!**********************************************!*\
  !*** ./imgs/buffs/supreme_overload.data.png ***!
  \**********************************************/
(module, __unused_webpack_exports, __webpack_require__) {

module.exports=(__webpack_require__(/*! alt1/base */ "../node_modules/alt1/dist/base/index.js").ImageDetect).imageDataFromBase64("iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAMAAADzN3VRAAAAAW5vUEUAYtdMlAAAAAlub1BFAAAAAAAAAAAAoYpy1QAAAXRQTFRFAAAAbJeK1rhVSU42YYp6FzpEKnOMFTpGOqS0KnWMKHeSKXONH1ptJWiBKXeRJWuGKHKLMY2eJ3CJJm2GJW6FKHmQLYWcDicxMZKzMJWzFT1IK4KfJ3WOFD9OKX2XImR/BxYbJXOMLYmqJ3aOHVRpCBofK4KdImmCb63IR4qfGkhXCCgzKn+eJnCIosjarMjYl7LAgZCYVGduLZO5LZvFJHWQtNLis8/fsszbrcPPlZ6lSpGrNLjeLqbPKpa9Jn+fFEBQwtbguNDfuNHdrMTQfoyTP8/gNcHbM7naMKzSHmyIOmd1zNjfzNfeytbessXQdJSkPtPfN8rbNcDaMbPVKpvFH3WUBhohN2V0zNnfvcbMP9bcOM/bNsfcMbraLKXQIXucDR8meouVONDcN8ncMr3bLafRInyeAx4kNL/bLaXPIneXAB4jNcbcMbnYK5/IGV53M8LbLrDVJYuwDjJACyAoJ4GLH3eLG2d/DzpLBRAUBBAUkqXT3gAAAHx0Uk5TAP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9uim3EAAADRSURBVHicY2BAAEYGXICJGZcMCysuGTZ2HBIcnFw4ZLh5ePmwy/AzMAhglRAUYmAQxq5HRFRMHLuMhKQUDhdIy8hil5CTV1DEKqGkrKKqpo5NRkNTS1tHF4uEnr6BoZGxiSmGhJm5haWVtY2tnb0Dmoyjk7OLq5u7h6edF6qEt4+vn39AYFBwSGhYOIpMRKQvQxRDdExsXHxCIqqmSAYfhiSG5JTUtPQMVBkfCJWSmZWdg81PDLl5+QVYJRgKi4pLMEVLGcoYyisqsWupqkbiAAC3kh+rvrqfOQAAAABJRU5ErkJggg==")

/***/ },

/***/ "./imgs/buffs/vengeful_ghost-top.data.png"
/*!************************************************!*\
  !*** ./imgs/buffs/vengeful_ghost-top.data.png ***!
  \************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

module.exports=(__webpack_require__(/*! alt1/base */ "../node_modules/alt1/dist/base/index.js").ImageDetect).imageDataFromBase64("iVBORw0KGgoAAAANSUhEUgAAABkAAAANCAIAAADTzFK5AAAAAW5vUEUAYtdMlAAAAAlub1BFAAAAAAAAAAAAoYpy1QAAAypJREFUeJwlU91rFFcUv+ecO/fO7Gay25jSkCr4RWIbwUawFdKUisU+FEGQiiD9A4ogCLF9LIW8tA8+tQ/tYwuBUgyG9qVNzVNQC1W0sR+RTGyNiRpdEzeb3Z3Z+9Fz03kY7tx7zm9+H+fK4Z4xEAiC+C3ACwACSUIjKgAQwlvfsbbjfM4LIcIOhDofFkBCCOfaxhe8kHy8hcWNhEgSS7GsKFEuBqsPz++Awvd/tmgePGqZJ846RuBiBkIARWVN3asXBuLxK+idF06ikBAIEGMRKI3p4uQbGHMLovUFwsLXg9s/T9VM2znrmRCjeRdhnFLfX7Mje0anN1iJYIIgESPhA1tkwoBcPXQ6u32xP+qSDoEpgveL4wNDo0sd23bCemEZTFL8x/Tr6eQ9xo4wkagK25TAvDDY8L9SxkWHolb4JPD1TeNiorVGbNNcbuR2UwQ5ofilr5Yevl/dSRUN6fLE4cqpydDAvw9YEBIgVC6JmOHWnmhNzbTn5ljuv598+OJ43djcCSeCCFXOWvTCTqdx/vJhqD3r8xUZuLA3ILcES3b01kfdURQME8YWd34PVjtXe6vUT0luJGGkMNVRpVbFuFyZ/+UIzf7tXu0ljGWQFh4kCCFyNORZNDsoGj9Oh+iDVN+ZuELwMpFWWM5uH4OCOE9qehl5+/bA5vez2c+H2PtgmQSlqJTInvor2oogL6rbrvfeWVuY5/nh8/LJI9HEkqYu5UpkMV/4J9m9AyIwzfbmpesHvzTZcc0obE9Jy25N6Y2xGjTWkvu22LvfJZ5ndtuFc81rN+OhfRzwrQ9WD3zbw86zkNfOrFw/O8cFoJODX9i2Xe8bmZKMUpa9v42t6U4hnqMzKiejVjKn9+I2gYTp6CGbyk62XGDr7sn1wUu9/R/fzbXRMRVPiuFvSvViJbd1JwoZy+rVwe9KzaN5HiFHJMB56TfWbdMA51flT9icumpbDZsXzxORjfrdM/7PT63ycf7Y5PZZ7hrW5zx3zJKGs3fvmMvw5gnH3eEOMLmKmv/VHBhxT6H+0w8ijjwz9ODajVq1+fTYUgoDft3supZ07GoY9a2L9R+ee2lPH77d2gAAAABJRU5ErkJggg==")

/***/ },

/***/ "./index.html"
/*!********************!*\
  !*** ./index.html ***!
  \********************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "index.html";

/***/ },

/***/ "canvas"
/*!*************************!*\
  !*** external "canvas" ***!
  \*************************/
(module) {

"use strict";
if(typeof __WEBPACK_EXTERNAL_MODULE_canvas__ === 'undefined') { var e = new Error("Cannot find module 'canvas'"); e.code = 'MODULE_NOT_FOUND'; throw e; }

module.exports = __WEBPACK_EXTERNAL_MODULE_canvas__;

/***/ },

/***/ "electron/common"
/*!**********************************!*\
  !*** external "electron/common" ***!
  \**********************************/
(module) {

"use strict";
if(typeof __WEBPACK_EXTERNAL_MODULE_electron_common__ === 'undefined') { var e = new Error("Cannot find module 'electron/common'"); e.code = 'MODULE_NOT_FOUND'; throw e; }

module.exports = __WEBPACK_EXTERNAL_MODULE_electron_common__;

/***/ },

/***/ "sharp"
/*!************************!*\
  !*** external "sharp" ***!
  \************************/
(module) {

"use strict";
if(typeof __WEBPACK_EXTERNAL_MODULE_sharp__ === 'undefined') { var e = new Error("Cannot find module 'sharp'"); e.code = 'MODULE_NOT_FOUND'; throw e; }

module.exports = __WEBPACK_EXTERNAL_MODULE_sharp__;

/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Check if module exists (development only)
/******/ 		if (__webpack_modules__[moduleId] === undefined) {
/******/ 			var e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript && document.currentScript.tagName.toUpperCase() === 'SCRIPT')
/******/ 				scriptUrl = document.currentScript.src;
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) {
/******/ 					var i = scripts.length - 1;
/******/ 					while (i > -1 && (!scriptUrl || !/^http(s?):/.test(scriptUrl))) scriptUrl = scripts[i--].src;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/^blob:/, "").replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be in strict mode.
(() => {
"use strict";
/*!******************!*\
  !*** ./index.ts ***!
  \******************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var alpinejs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! alpinejs */ "../node_modules/alpinejs/dist/module.esm.js");
/* harmony import */ var alt1__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! alt1 */ "../node_modules/alt1/dist/base/index.js");
/* harmony import */ var alt1__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(alt1__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _appconfig_json__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./appconfig.json */ "./appconfig.json");
/* harmony import */ var _audio_clock_ticking_mp3__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./audio/clock-ticking.mp3 */ "./audio/clock-ticking.mp3");
/* harmony import */ var _audio_long_pop_alert_wav__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./audio/long-pop-alert.wav */ "./audio/long-pop-alert.wav");
/* harmony import */ var _BuffImageRegistry__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./BuffImageRegistry */ "./BuffImageRegistry.ts");
/* harmony import */ var _BuffManager__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./BuffManager */ "./BuffManager.ts");
/* harmony import */ var _icon_png__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./icon.png */ "./icon.png");
/* harmony import */ var _index_html__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./index.html */ "./index.html");
/* harmony import */ var _LocalStorageHelper__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./LocalStorageHelper */ "./LocalStorageHelper.ts");
var __assign = (undefined && undefined.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _a;










var storage = new _LocalStorageHelper__WEBPACK_IMPORTED_MODULE_9__.LocalStorageHelper();
var buffManager = new _BuffManager__WEBPACK_IMPORTED_MODULE_6__.BuffManager(storage);
var BUFFS_OVERLAY_GROUP = 'buffsOverlayGroup';
var CENTER_OVERLAY_GROUP = 'centerOverlayGroup';
var OVERLAY_GROUP_LABELS = (_a = {},
    _a[BUFFS_OVERLAY_GROUP] = 'Buff/Debuffs',
    _a[CENTER_OVERLAY_GROUP] = 'Alerts',
    _a);
var REFRESH_INTERVAL_MS = 150;
var POSITION_TRACK_INTERVAL_MS = 100;
var SCALE_RANGE = { min: 1, max: 3 };
var ALERT_THRESHOLD_RANGE = { min: 1, max: 60 };
var createDefaultTrackedTargetDebuffs = function () { return ({
    vulnerability: false,
    deathMark: false,
    bloat: false,
    smokeCloud: false
}); };
var createDefaultOverlaySettings = function () { return ({
    scale: SCALE_RANGE.min,
    buffDurationAlertThreshold: 10,
    abilityCooldownAlertThreshold: 5,
    trackedTargetDebuffs: createDefaultTrackedTargetDebuffs(),
    targetDebuffAudioAlert: true
}); };
var clamp = function (value, min, max) {
    return Math.max(min, Math.min(max, value));
};
var mergeTrackedTargetDebuffs = function (source) { return (__assign(__assign({}, createDefaultTrackedTargetDebuffs()), (source !== null && source !== void 0 ? source : {}))); };
var playAudioCue = function (audio) {
    audio.currentTime = 0;
    audio.play().catch(function (err) { return console.log('Audio play failed:', err); });
};
var stopAudioAfter = function (audio, delaySeconds) {
    window.setTimeout(function () { return audio.pause(); }, delaySeconds * 1000);
};
var cloneEntries = function (entries) { return entries.map(function (entry) { return (__assign({}, entry)); }); };
var waitForNextFrame = function () {
    return new Promise(function (resolve) { return requestAnimationFrame(function () { return requestAnimationFrame(function () { return resolve(); }); }); });
};
// Initialize Alt1 app
if (window.alt1) {
    alt1__WEBPACK_IMPORTED_MODULE_1__.identifyApp("./appconfig.json");
    var settings = document.getElementById("settings");
    settings.className = "";
}
else {
    var output = document.getElementById("output");
    output.className = "";
    var addAppUrl = "alt1://addapp/".concat(new URL("./appconfig.json", document.location.href).href);
    output.insertAdjacentHTML("beforeend", "\n    Alt1 not detected, click <a href='".concat(addAppUrl, "'>here</a> to add this app to Alt1\n  "));
}
alpinejs__WEBPACK_IMPORTED_MODULE_0__["default"].data('buffsData', function () { return ({
    buffs: [],
    targetDebuffs: [],
    stacks: [],
    draggedIndex: null,
    isDragging: false,
    resetInprogress: false,
    alertedBuffs: new Set(),
    alertedDebuffs: new Set(),
    abilityCooldownAlertedBuffs: new Set(),
    clockTickingAudio: new Audio(_audio_clock_ticking_mp3__WEBPACK_IMPORTED_MODULE_3__),
    popAlertAudio: new Audio(_audio_long_pop_alert_wav__WEBPACK_IMPORTED_MODULE_4__),
    activeTab: 'buffs',
    timestamp: null,
    lastUpdate: Date.now(),
    isOverlayPositionSet: {
        buffs: false,
        alerts: false
    },
    overlaySettings: createDefaultOverlaySettings(),
    overlaySettingsForm: createDefaultOverlaySettings(),
    formatTime: function (seconds) {
        var mins = Math.floor(seconds / 60);
        var secs = seconds % 60;
        return "".concat(mins.toString().padStart(2, '0'), ":").concat(Math.floor(secs).toString().padStart(2, '0'));
    },
    togglePin: function (buffName) {
        // Update local state immediately for instant UI feedback
        var buff = this.buffs.find(function (b) { return b.name === buffName; });
        if (buff) {
            buff.isPinned = !buff.isPinned;
        }
        // Then update the manager's cache
        buffManager.toggleBuffPin(buffName);
    },
    toggleAudioQueue: function (buffName) {
        // Update local state immediately for instant UI feedback
        var buff = this.buffs.find(function (b) { return b.name === buffName; });
        if (buff) {
            buff.isAudioQueued = !buff.isAudioQueued;
        }
        // Then update the manager's cache
        buffManager.toggleBuffAudioQueue(buffName);
    },
    setOverlayPosition: function (group) {
        return __awaiter(this, void 0, void 0, function () {
            var intervalId;
            var _this = this;
            return __generator(this, function (_a) {
                intervalId = this.startPositionTracking(group);
                buffManager.setOverlayPosition(group, function () {
                    // Stop tracking and clear placeholder when position is saved
                    _this.stopPositionTracking(group, intervalId);
                    _this.checkOverlayPositions();
                });
                return [2 /*return*/];
            });
        });
    },
    startPositionTracking: function (group) {
        var _a;
        var placeholderGroup = "".concat(group, "-placeholder");
        var label = (_a = OVERLAY_GROUP_LABELS[group]) !== null && _a !== void 0 ? _a : group;
        return window.setInterval(function () {
            var mousePos = alt1__WEBPACK_IMPORTED_MODULE_1__.getMousePosition();
            alt1.overLayClearGroup(placeholderGroup);
            alt1.overLaySetGroup(placeholderGroup);
            alt1.overLayTextEx("Press Alt+1 to set the ".concat(label, " group position."), alt1__WEBPACK_IMPORTED_MODULE_1__.mixColor(255, 255, 255), 18, mousePos.x, mousePos.y, 9999, '', true, true);
        }, POSITION_TRACK_INTERVAL_MS);
    },
    stopPositionTracking: function (group, intervalId) {
        // Stop the interval
        window.clearInterval(intervalId);
        // Clear the placeholder overlay
        var placeholderGroup = "".concat(group, "-placeholder");
        alt1.overLayClearGroup(placeholderGroup);
    },
    saveOverlaySettings: function () {
        var scale = clamp(this.overlaySettingsForm.scale, SCALE_RANGE.min, SCALE_RANGE.max);
        var buffDuration = clamp(this.overlaySettingsForm.buffDurationAlertThreshold, ALERT_THRESHOLD_RANGE.min, ALERT_THRESHOLD_RANGE.max);
        var abilityCooldown = clamp(this.overlaySettingsForm.abilityCooldownAlertThreshold, ALERT_THRESHOLD_RANGE.min, ALERT_THRESHOLD_RANGE.max);
        this.overlaySettings = __assign(__assign({}, this.overlaySettings), { scale: scale, buffDurationAlertThreshold: buffDuration, abilityCooldownAlertThreshold: abilityCooldown, trackedTargetDebuffs: __assign({}, this.overlaySettingsForm.trackedTargetDebuffs), targetDebuffAudioAlert: this.overlaySettingsForm.targetDebuffAudioAlert });
        this.overlaySettingsForm = __assign(__assign({}, this.overlaySettings), { trackedTargetDebuffs: __assign({}, this.overlaySettings.trackedTargetDebuffs) });
        storage.save('overlaySettings', this.overlaySettings);
    },
    loadOverlaySettings: function () {
        var _this = this;
        var _a, _b, _c, _d;
        var saved = storage.get('overlaySettings');
        var defaults = createDefaultOverlaySettings();
        var savedTracked = mergeTrackedTargetDebuffs(saved === null || saved === void 0 ? void 0 : saved.trackedTargetDebuffs);
        var overlaySettings = saved
            ? {
                scale: (_a = saved.scale) !== null && _a !== void 0 ? _a : defaults.scale,
                buffDurationAlertThreshold: (_b = saved.buffDurationAlertThreshold) !== null && _b !== void 0 ? _b : defaults.buffDurationAlertThreshold,
                abilityCooldownAlertThreshold: (_c = saved.abilityCooldownAlertThreshold) !== null && _c !== void 0 ? _c : defaults.abilityCooldownAlertThreshold,
                trackedTargetDebuffs: savedTracked,
                targetDebuffAudioAlert: (_d = saved.targetDebuffAudioAlert) !== null && _d !== void 0 ? _d : defaults.targetDebuffAudioAlert
            }
            : defaults;
        this.overlaySettings = __assign(__assign({}, overlaySettings), { scale: clamp(overlaySettings.scale, SCALE_RANGE.min, SCALE_RANGE.max), buffDurationAlertThreshold: clamp(overlaySettings.buffDurationAlertThreshold, ALERT_THRESHOLD_RANGE.min, ALERT_THRESHOLD_RANGE.max), abilityCooldownAlertThreshold: clamp(overlaySettings.abilityCooldownAlertThreshold, ALERT_THRESHOLD_RANGE.min, ALERT_THRESHOLD_RANGE.max) });
        this.overlaySettingsForm = __assign(__assign({}, this.overlaySettings), { trackedTargetDebuffs: __assign({}, this.overlaySettings.trackedTargetDebuffs) });
        var hasChanges = !saved ||
            saved.scale !== this.overlaySettings.scale ||
            saved.buffDurationAlertThreshold !== this.overlaySettings.buffDurationAlertThreshold ||
            saved.abilityCooldownAlertThreshold !== this.overlaySettings.abilityCooldownAlertThreshold ||
            saved.targetDebuffAudioAlert !== this.overlaySettings.targetDebuffAudioAlert ||
            Object.keys(savedTracked).some(function (key) { return savedTracked[key] !== _this.overlaySettings.trackedTargetDebuffs[key]; });
        if (hasChanges) {
            storage.save('overlaySettings', this.overlaySettings);
        }
    },
    resetSettings: function () {
        this.resetInprogress = true;
        storage.clear();
        location.reload();
        this.resetInprogress = false;
    },
    checkOverlayPositions: function () {
        this.isOverlayPositionSet.buffs = !!storage.get(BUFFS_OVERLAY_GROUP);
        this.isOverlayPositionSet.alerts = !!storage.get(CENTER_OVERLAY_GROUP);
    },
    onDragStart: function (event, index) {
        this.draggedIndex = index;
        this.isDragging = true;
        if (event.dataTransfer) {
            event.dataTransfer.effectAllowed = 'move';
            event.dataTransfer.setData('text/html', event.target.innerHTML);
        }
        event.target.classList.add('dragging');
    },
    onDragEnd: function (event) {
        event.target.classList.remove('dragging');
        this.draggedIndex = null;
        this.isDragging = false;
    },
    onDragOver: function (event) {
        event.preventDefault();
        if (event.dataTransfer) {
            event.dataTransfer.dropEffect = 'move';
        }
    },
    onDrop: function (event, dropIndex) {
        event.preventDefault();
        if (this.draggedIndex !== null && this.draggedIndex !== dropIndex) {
            var draggedBuff = this.buffs[this.draggedIndex];
            this.buffs.splice(this.draggedIndex, 1);
            this.buffs.splice(dropIndex, 0, draggedBuff);
            // Update order property for all buffs
            this.buffs.forEach(function (buff, idx) {
                buff.order = idx;
            });
            buffManager.saveBuffOrder(this.buffs);
        }
    },
    hasAlertedBuffs: function () {
        var _this = this;
        return (this.buffs.some(function (buff) { return _this.isAlerted(buff.name); }) ||
            this.targetDebuffs.length > 0 ||
            this.stacks.some(function (stack) { return stack.cooldown > 0; }));
    },
    isLowBuffDuration: function (buff) {
        if (buff.hasAbilityCooldown) {
            return buff.buffDuration <= 3 && buff.buffDuration > 0;
        }
        return buff.buffDuration <= this.overlaySettings.buffDurationAlertThreshold && buff.buffDuration > 0;
    },
    isLowAbilityCooldown: function (buff) {
        return (buff.abilityCooldown > 0 &&
            buff.abilityCooldown <= this.overlaySettings.abilityCooldownAlertThreshold);
    },
    checkAndPlayAlerts: function () {
        var _this = this;
        this.buffs.forEach(function (buff) {
            var isLowBuffDuration = _this.isLowBuffDuration(buff);
            if (isLowBuffDuration && buff.isPinned && !_this.alertedBuffs.has(buff.name) && !buff.hasAbilityCooldown && !buff.isStack) {
                // Play alert sound
                if (buff.isAudioQueued) {
                    playAudioCue(_this.clockTickingAudio);
                    stopAudioAfter(_this.clockTickingAudio, buff.buffDuration);
                }
                // Mark this buff as alerted
                _this.alertedBuffs.add(buff.name);
            }
            else if (!isLowBuffDuration && _this.alertedBuffs.has(buff.name)) {
                // Remove from alerted set when buff is no longer flashing
                _this.alertedBuffs.delete(buff.name);
            }
            var isLowAbilityCooldown = _this.isLowAbilityCooldown(buff);
            if (isLowAbilityCooldown && buff.isPinned && !_this.abilityCooldownAlertedBuffs.has(buff.name)) {
                // Play long alert sound
                if (buff.isAudioQueued) {
                    playAudioCue(_this.popAlertAudio);
                }
                // Mark this buff as alerted
                _this.abilityCooldownAlertedBuffs.add(buff.name);
            }
            else if (!isLowAbilityCooldown && _this.abilityCooldownAlertedBuffs.has(buff.name)) {
                _this.abilityCooldownAlertedBuffs.delete(buff.name);
            }
        });
        this.targetDebuffs.forEach(function (debuff) {
            if (!_this.alertedDebuffs.has(debuff.name) && debuff.abilityCooldown === 0 && _this.overlaySettings.targetDebuffAudioAlert) {
                playAudioCue(_this.popAlertAudio);
                // Mark this debuff as alerted
                _this.alertedDebuffs.add(debuff.name);
            }
            else if (_this.alertedDebuffs.has(debuff.name) && debuff.abilityCooldown === 1) {
                // Remove from alerted set when debuff is no longer flashing
                _this.alertedDebuffs.delete(debuff.name);
            }
        });
    },
    isAlerted: function (buffName) {
        var buff = this.buffs.find(function (b) { return b.name === buffName; });
        if (!buff)
            return false;
        return this.abilityCooldownAlertedBuffs.has(buffName) && buff.abilityCooldown > 0;
    },
    hasCoolDowns: function () {
        return this.abilityCooldownAlertedBuffs.size > 0;
    },
    hasStacks: function () {
        return this.stacks.some(function (stack) { return stack.buffDuration > 0; });
    },
    init: function () {
        return __awaiter(this, void 0, void 0, function () {
            var updateLoop;
            var _this = this;
            return __generator(this, function (_a) {
                this.loadOverlaySettings();
                this.checkOverlayPositions();
                updateLoop = function () { return __awaiter(_this, void 0, void 0, function () {
                    var activeBuffs, targetDebuffs, scale;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!(!this.isDragging && !this.resetInprogress)) return [3 /*break*/, 7];
                                return [4 /*yield*/, buffManager.getActiveBuffs()];
                            case 1:
                                activeBuffs = _a.sent();
                                this.buffs = cloneEntries(activeBuffs.filter(function (buff) { return !buff.isStack; }));
                                this.stacks = cloneEntries(activeBuffs.filter(function (buff) { return buff.isStack; }));
                                return [4 /*yield*/, buffManager.getTargetDebuffs(this.overlaySettings.trackedTargetDebuffs)];
                            case 2:
                                targetDebuffs = _a.sent();
                                this.targetDebuffs = cloneEntries(targetDebuffs);
                                if (activeBuffs.length > 0 || targetDebuffs.length > 0) {
                                    this.checkAndPlayAlerts();
                                }
                                return [4 /*yield*/, waitForNextFrame()];
                            case 3:
                                _a.sent();
                                scale = this.overlaySettings.scale;
                                if (!this.buffs.some(function (buff) { return buff.isPinned; })) return [3 /*break*/, 5];
                                return [4 /*yield*/, captureElementAsOverlay('buffs-output', BUFFS_OVERLAY_GROUP, scale)];
                            case 4:
                                _a.sent();
                                _a.label = 5;
                            case 5: return [4 /*yield*/, captureElementAsOverlay('alerted-buffs', CENTER_OVERLAY_GROUP, scale)];
                            case 6:
                                _a.sent();
                                _a.label = 7;
                            case 7:
                                window.setTimeout(updateLoop, REFRESH_INTERVAL_MS);
                                return [2 /*return*/];
                        }
                    });
                }); };
                updateLoop();
                return [2 /*return*/];
            });
        });
    }
}); });
function captureElementAsOverlay(elementId, overlayGroup, scale) {
    return __awaiter(this, void 0, void 0, function () {
        var container, innerHtml, readyToCapture;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    container = document.getElementById(elementId);
                    if (!container)
                        return [2 /*return*/];
                    innerHtml = stripAlpine(container.outerHTML);
                    readyToCapture = document.createElement('div');
                    readyToCapture.innerHTML = innerHtml;
                    readyToCapture.style.position = 'absolute';
                    readyToCapture.style.top = '0';
                    readyToCapture.style.left = '-9999px';
                    readyToCapture.querySelectorAll('.exclude-me').forEach(function (el) { return el.remove(); });
                    document.body.appendChild(readyToCapture);
                    return [4 /*yield*/, Promise.all(Array.from(readyToCapture.querySelectorAll('img')).map(function (img) {
                            if (img.complete)
                                return Promise.resolve();
                            return new Promise(function (resolve) {
                                img.onload = resolve;
                                img.onerror = resolve;
                            });
                        }))];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, buffManager.captureOverlay(overlayGroup, readyToCapture, scale)];
                case 2:
                    _a.sent();
                    readyToCapture.remove();
                    return [2 /*return*/];
            }
        });
    });
}
function stripAlpine(html) {
    return html
        .replace(/<template[^>]*>[\s\S]*?<\/template>/gi, '')
        .replace(/\s+(x-[a-z:-]+|:[a-z-]+|@[a-z.-]+)(="[^"]*")?/gi, '');
}
function start() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, _BuffImageRegistry__WEBPACK_IMPORTED_MODULE_5__.BuffImageRegistry.initialize()];
                case 1:
                    _a.sent();
                    alpinejs__WEBPACK_IMPORTED_MODULE_0__["default"].start();
                    return [2 /*return*/];
            }
        });
    });
}
start();

})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=main.js.map