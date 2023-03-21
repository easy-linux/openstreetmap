class jo {
  /**
   * @param {string} type Type.
   */
  constructor(t) {
    this.propagationStopped, this.defaultPrevented, this.type = t, this.target = null;
  }
  /**
   * Prevent default. This means that no emulated `click`, `singleclick` or `doubleclick` events
   * will be fired.
   * @api
   */
  preventDefault() {
    this.defaultPrevented = !0;
  }
  /**
   * Stop event propagation.
   * @api
   */
  stopPropagation() {
    this.propagationStopped = !0;
  }
}
const Zt = jo, Xe = {
  /**
   * Triggered when a property is changed.
   * @event module:ol/Object.ObjectEvent#propertychange
   * @api
   */
  PROPERTYCHANGE: "propertychange"
};
class Ho {
  constructor() {
    this.disposed = !1;
  }
  /**
   * Clean up.
   */
  dispose() {
    this.disposed || (this.disposed = !0, this.disposeInternal());
  }
  /**
   * Extension point for disposable objects.
   * @protected
   */
  disposeInternal() {
  }
}
const Jn = Ho;
function We(s, t) {
  return s > t ? 1 : s < t ? -1 : 0;
}
function Qn(s, t, e) {
  const i = s.length;
  if (s[0] <= t)
    return 0;
  if (t <= s[i - 1])
    return i - 1;
  let n;
  if (e > 0) {
    for (n = 1; n < i; ++n)
      if (s[n] < t)
        return n - 1;
  } else if (e < 0) {
    for (n = 1; n < i; ++n)
      if (s[n] <= t)
        return n;
  } else
    for (n = 1; n < i; ++n) {
      if (s[n] == t)
        return n;
      if (s[n] < t)
        return typeof e == "function" ? e(t, s[n - 1], s[n]) > 0 ? n - 1 : n : s[n - 1] - t < t - s[n] ? n - 1 : n;
    }
  return i - 1;
}
function $o(s, t, e) {
  for (; t < e; ) {
    const i = s[t];
    s[t] = s[e], s[e] = i, ++t, --e;
  }
}
function br(s, t) {
  const e = Array.isArray(t) ? t : [t], i = e.length;
  for (let n = 0; n < i; n++)
    s[s.length] = e[n];
}
function re(s, t) {
  const e = s.length;
  if (e !== t.length)
    return !1;
  for (let i = 0; i < e; i++)
    if (s[i] !== t[i])
      return !1;
  return !0;
}
function qo(s, t, e) {
  const i = t || We;
  return s.every(function(n, r) {
    if (r === 0)
      return !0;
    const o = i(s[r - 1], n);
    return !(o > 0 || e && o === 0);
  });
}
function ni() {
  return !0;
}
function on() {
  return !1;
}
function ze() {
}
function Jo(s) {
  let t = !1, e, i, n;
  return function() {
    const r = Array.prototype.slice.call(arguments);
    return (!t || this !== n || !re(r, i)) && (t = !0, n = this, i = r, e = s.apply(this, arguments)), e;
  };
}
function mi(s) {
  for (const t in s)
    delete s[t];
}
function si(s) {
  let t;
  for (t in s)
    return !1;
  return !t;
}
class Qo extends Jn {
  /**
   * @param {*} [target] Default event target for dispatched events.
   */
  constructor(t) {
    super(), this.eventTarget_ = t, this.pendingRemovals_ = null, this.dispatching_ = null, this.listeners_ = null;
  }
  /**
   * @param {string} type Type.
   * @param {import("../events.js").Listener} listener Listener.
   */
  addEventListener(t, e) {
    if (!t || !e)
      return;
    const i = this.listeners_ || (this.listeners_ = {}), n = i[t] || (i[t] = []);
    n.includes(e) || n.push(e);
  }
  /**
   * Dispatches an event and calls all listeners listening for events
   * of this type. The event parameter can either be a string or an
   * Object with a `type` property.
   *
   * @param {import("./Event.js").default|string} event Event object.
   * @return {boolean|undefined} `false` if anyone called preventDefault on the
   *     event object or if any of the listeners returned false.
   * @api
   */
  dispatchEvent(t) {
    const e = typeof t == "string", i = e ? t : t.type, n = this.listeners_ && this.listeners_[i];
    if (!n)
      return;
    const r = e ? new Zt(t) : (
      /** @type {Event} */
      t
    );
    r.target || (r.target = this.eventTarget_ || this);
    const o = this.dispatching_ || (this.dispatching_ = {}), a = this.pendingRemovals_ || (this.pendingRemovals_ = {});
    i in o || (o[i] = 0, a[i] = 0), ++o[i];
    let l;
    for (let h = 0, c = n.length; h < c; ++h)
      if ("handleEvent" in n[h] ? l = /** @type {import("../events.js").ListenerObject} */
      n[h].handleEvent(r) : l = /** @type {import("../events.js").ListenerFunction} */
      n[h].call(this, r), l === !1 || r.propagationStopped) {
        l = !1;
        break;
      }
    if (--o[i] === 0) {
      let h = a[i];
      for (delete a[i]; h--; )
        this.removeEventListener(i, ze);
      delete o[i];
    }
    return l;
  }
  /**
   * Clean up.
   */
  disposeInternal() {
    this.listeners_ && mi(this.listeners_);
  }
  /**
   * Get the listeners for a specified event type. Listeners are returned in the
   * order that they will be called in.
   *
   * @param {string} type Type.
   * @return {Array<import("../events.js").Listener>|undefined} Listeners.
   */
  getListeners(t) {
    return this.listeners_ && this.listeners_[t] || void 0;
  }
  /**
   * @param {string} [type] Type. If not provided,
   *     `true` will be returned if this event target has any listeners.
   * @return {boolean} Has listeners.
   */
  hasListener(t) {
    return this.listeners_ ? t ? t in this.listeners_ : Object.keys(this.listeners_).length > 0 : !1;
  }
  /**
   * @param {string} type Type.
   * @param {import("../events.js").Listener} listener Listener.
   */
  removeEventListener(t, e) {
    const i = this.listeners_ && this.listeners_[t];
    if (i) {
      const n = i.indexOf(e);
      n !== -1 && (this.pendingRemovals_ && t in this.pendingRemovals_ ? (i[n] = ze, ++this.pendingRemovals_[t]) : (i.splice(n, 1), i.length === 0 && delete this.listeners_[t]));
    }
  }
}
const an = Qo, F = {
  /**
   * Generic change event. Triggered when the revision counter is increased.
   * @event module:ol/events/Event~BaseEvent#change
   * @api
   */
  CHANGE: "change",
  /**
   * Generic error event. Triggered when an error occurs.
   * @event module:ol/events/Event~BaseEvent#error
   * @api
   */
  ERROR: "error",
  BLUR: "blur",
  CLEAR: "clear",
  CONTEXTMENU: "contextmenu",
  CLICK: "click",
  DBLCLICK: "dblclick",
  DRAGENTER: "dragenter",
  DRAGOVER: "dragover",
  DROP: "drop",
  FOCUS: "focus",
  KEYDOWN: "keydown",
  KEYPRESS: "keypress",
  LOAD: "load",
  RESIZE: "resize",
  TOUCHMOVE: "touchmove",
  WHEEL: "wheel"
};
function G(s, t, e, i, n) {
  if (i && i !== s && (e = e.bind(i)), n) {
    const o = e;
    e = function() {
      s.removeEventListener(t, e), o.apply(this, arguments);
    };
  }
  const r = {
    target: s,
    type: t,
    listener: e
  };
  return s.addEventListener(t, e), r;
}
function Ki(s, t, e, i) {
  return G(s, t, e, i, !0);
}
function j(s) {
  s && s.target && (s.target.removeEventListener(s.type, s.listener), mi(s));
}
class ln extends an {
  constructor() {
    super(), this.on = /** @type {ObservableOnSignature<import("./events").EventsKey>} */
    this.onInternal, this.once = /** @type {ObservableOnSignature<import("./events").EventsKey>} */
    this.onceInternal, this.un = /** @type {ObservableOnSignature<void>} */
    this.unInternal, this.revision_ = 0;
  }
  /**
   * Increases the revision counter and dispatches a 'change' event.
   * @api
   */
  changed() {
    ++this.revision_, this.dispatchEvent(F.CHANGE);
  }
  /**
   * Get the version number for this object.  Each time the object is modified,
   * its version number will be incremented.
   * @return {number} Revision.
   * @api
   */
  getRevision() {
    return this.revision_;
  }
  /**
   * @param {string|Array<string>} type Type.
   * @param {function((Event|import("./events/Event").default)): ?} listener Listener.
   * @return {import("./events.js").EventsKey|Array<import("./events.js").EventsKey>} Event key.
   * @protected
   */
  onInternal(t, e) {
    if (Array.isArray(t)) {
      const i = t.length, n = new Array(i);
      for (let r = 0; r < i; ++r)
        n[r] = G(this, t[r], e);
      return n;
    }
    return G(
      this,
      /** @type {string} */
      t,
      e
    );
  }
  /**
   * @param {string|Array<string>} type Type.
   * @param {function((Event|import("./events/Event").default)): ?} listener Listener.
   * @return {import("./events.js").EventsKey|Array<import("./events.js").EventsKey>} Event key.
   * @protected
   */
  onceInternal(t, e) {
    let i;
    if (Array.isArray(t)) {
      const n = t.length;
      i = new Array(n);
      for (let r = 0; r < n; ++r)
        i[r] = Ki(this, t[r], e);
    } else
      i = Ki(
        this,
        /** @type {string} */
        t,
        e
      );
    return e.ol_key = i, i;
  }
  /**
   * Unlisten for a certain type of event.
   * @param {string|Array<string>} type Type.
   * @param {function((Event|import("./events/Event").default)): ?} listener Listener.
   * @protected
   */
  unInternal(t, e) {
    const i = (
      /** @type {Object} */
      e.ol_key
    );
    if (i)
      ta(i);
    else if (Array.isArray(t))
      for (let n = 0, r = t.length; n < r; ++n)
        this.removeEventListener(t[n], e);
    else
      this.removeEventListener(t, e);
  }
}
ln.prototype.on;
ln.prototype.once;
ln.prototype.un;
function ta(s) {
  if (Array.isArray(s))
    for (let t = 0, e = s.length; t < e; ++t)
      j(s[t]);
  else
    j(
      /** @type {import("./events.js").EventsKey} */
      s
    );
}
const Fr = ln;
function W() {
  throw new Error("Unimplemented abstract method.");
}
let ea = 0;
function z(s) {
  return s.ol_uid || (s.ol_uid = String(++ea));
}
class Xs extends Zt {
  /**
   * @param {string} type The event type.
   * @param {string} key The property name.
   * @param {*} oldValue The old value for `key`.
   */
  constructor(t, e, i) {
    super(t), this.key = e, this.oldValue = i;
  }
}
class ia extends Fr {
  /**
   * @param {Object<string, *>} [values] An object with key-value pairs.
   */
  constructor(t) {
    super(), this.on, this.once, this.un, z(this), this.values_ = null, t !== void 0 && this.setProperties(t);
  }
  /**
   * Gets a value.
   * @param {string} key Key name.
   * @return {*} Value.
   * @api
   */
  get(t) {
    let e;
    return this.values_ && this.values_.hasOwnProperty(t) && (e = this.values_[t]), e;
  }
  /**
   * Get a list of object property names.
   * @return {Array<string>} List of property names.
   * @api
   */
  getKeys() {
    return this.values_ && Object.keys(this.values_) || [];
  }
  /**
   * Get an object of all property names and values.
   * @return {Object<string, *>} Object.
   * @api
   */
  getProperties() {
    return this.values_ && Object.assign({}, this.values_) || {};
  }
  /**
   * @return {boolean} The object has properties.
   */
  hasProperties() {
    return !!this.values_;
  }
  /**
   * @param {string} key Key name.
   * @param {*} oldValue Old value.
   */
  notify(t, e) {
    let i;
    i = `change:${t}`, this.hasListener(i) && this.dispatchEvent(new Xs(i, t, e)), i = Xe.PROPERTYCHANGE, this.hasListener(i) && this.dispatchEvent(new Xs(i, t, e));
  }
  /**
   * @param {string} key Key name.
   * @param {import("./events.js").Listener} listener Listener.
   */
  addChangeListener(t, e) {
    this.addEventListener(`change:${t}`, e);
  }
  /**
   * @param {string} key Key name.
   * @param {import("./events.js").Listener} listener Listener.
   */
  removeChangeListener(t, e) {
    this.removeEventListener(`change:${t}`, e);
  }
  /**
   * Sets a value.
   * @param {string} key Key name.
   * @param {*} value Value.
   * @param {boolean} [silent] Update without triggering an event.
   * @api
   */
  set(t, e, i) {
    const n = this.values_ || (this.values_ = {});
    if (i)
      n[t] = e;
    else {
      const r = n[t];
      n[t] = e, r !== e && this.notify(t, r);
    }
  }
  /**
   * Sets a collection of key-value pairs.  Note that this changes any existing
   * properties and adds new ones (it does not remove any existing properties).
   * @param {Object<string, *>} values Values.
   * @param {boolean} [silent] Update without triggering an event.
   * @api
   */
  setProperties(t, e) {
    for (const i in t)
      this.set(i, t[i], e);
  }
  /**
   * Apply any properties from another object without triggering events.
   * @param {BaseObject} source The source object.
   * @protected
   */
  applyProperties(t) {
    t.values_ && Object.assign(this.values_ || (this.values_ = {}), t.values_);
  }
  /**
   * Unsets a property.
   * @param {string} key Key name.
   * @param {boolean} [silent] Unset without triggering an event.
   * @api
   */
  unset(t, e) {
    if (this.values_ && t in this.values_) {
      const i = this.values_[t];
      delete this.values_[t], si(this.values_) && (this.values_ = null), e || this.notify(t, i);
    }
  }
}
const St = ia, na = {
  1: "The view center is not defined",
  2: "The view resolution is not defined",
  3: "The view rotation is not defined",
  4: "`image` and `src` cannot be provided at the same time",
  5: "`imgSize` must be set when `image` is provided",
  7: "`format` must be set when `url` is set",
  8: "Unknown `serverType` configured",
  9: "`url` must be configured or set using `#setUrl()`",
  10: "The default `geometryFunction` can only handle `Point` geometries",
  11: "`options.featureTypes` must be an Array",
  12: "`options.geometryName` must also be provided when `options.bbox` is set",
  13: "Invalid corner",
  14: "Invalid color",
  15: "Tried to get a value for a key that does not exist in the cache",
  16: "Tried to set a value for a key that is used already",
  17: "`resolutions` must be sorted in descending order",
  18: "Either `origin` or `origins` must be configured, never both",
  19: "Number of `tileSizes` and `resolutions` must be equal",
  20: "Number of `origins` and `resolutions` must be equal",
  22: "Either `tileSize` or `tileSizes` must be configured, never both",
  24: "Invalid extent or geometry provided as `geometry`",
  25: "Cannot fit empty extent provided as `geometry`",
  26: "Features must have an id set",
  27: "Features must have an id set",
  28: '`renderMode` must be `"hybrid"` or `"vector"`',
  30: "The passed `feature` was already added to the source",
  31: "Tried to enqueue an `element` that was already added to the queue",
  32: "Transformation matrix cannot be inverted",
  33: "Invalid units",
  34: "Invalid geometry layout",
  36: "Unknown SRS type",
  37: "Unknown geometry type found",
  38: "`styleMapValue` has an unknown type",
  39: "Unknown geometry type",
  40: "Expected `feature` to have a geometry",
  41: "Expected an `ol/style/Style` or an array of `ol/style/Style.js`",
  42: "Question unknown, the answer is 42",
  43: "Expected `layers` to be an array or a `Collection`",
  47: "Expected `controls` to be an array or an `ol/Collection`",
  48: "Expected `interactions` to be an array or an `ol/Collection`",
  49: "Expected `overlays` to be an array or an `ol/Collection`",
  50: "`options.featureTypes` should be an Array",
  51: "Either `url` or `tileJSON` options must be provided",
  52: "Unknown `serverType` configured",
  53: "Unknown `tierSizeCalculation` configured",
  55: "The {-y} placeholder requires a tile grid with extent",
  56: "mapBrowserEvent must originate from a pointer event",
  57: "At least 2 conditions are required",
  59: "Invalid command found in the PBF",
  60: "Missing or invalid `size`",
  61: "Cannot determine IIIF Image API version from provided image information JSON",
  62: "A `WebGLArrayBuffer` must either be of type `ELEMENT_ARRAY_BUFFER` or `ARRAY_BUFFER`",
  64: "Layer opacity must be a number",
  66: "`forEachFeatureAtCoordinate` cannot be used on a WebGL layer if the hit detection logic has not been enabled. This is done by providing adequate shaders using the `hitVertexShader` and `hitFragmentShader` properties of `WebGLPointsLayerRenderer`",
  67: "A layer can only be added to the map once. Use either `layer.setMap()` or `map.addLayer()`, not both",
  68: "A VectorTile source can only be rendered if it has a projection compatible with the view projection",
  69: "`width` or `height` cannot be provided together with `scale`"
};
class sa extends Error {
  /**
   * @param {number} code Error code.
   */
  constructor(t) {
    const e = na[t];
    super(e), this.code = t, this.name = "AssertionError", this.message = e;
  }
}
const Dr = sa, ut = {
  /**
   * Triggered when an item is added to the collection.
   * @event module:ol/Collection.CollectionEvent#add
   * @api
   */
  ADD: "add",
  /**
   * Triggered when an item is removed from the collection.
   * @event module:ol/Collection.CollectionEvent#remove
   * @api
   */
  REMOVE: "remove"
}, Ws = {
  LENGTH: "length"
};
class Mi extends Zt {
  /**
   * @param {import("./CollectionEventType.js").default} type Type.
   * @param {T} element Element.
   * @param {number} index The index of the added or removed element.
   */
  constructor(t, e, i) {
    super(t), this.element = e, this.index = i;
  }
}
class ra extends St {
  /**
   * @param {Array<T>} [array] Array.
   * @param {Options} [options] Collection options.
   */
  constructor(t, e) {
    if (super(), this.on, this.once, this.un, e = e || {}, this.unique_ = !!e.unique, this.array_ = t || [], this.unique_)
      for (let i = 0, n = this.array_.length; i < n; ++i)
        this.assertUnique_(this.array_[i], i);
    this.updateLength_();
  }
  /**
   * Remove all elements from the collection.
   * @api
   */
  clear() {
    for (; this.getLength() > 0; )
      this.pop();
  }
  /**
   * Add elements to the collection.  This pushes each item in the provided array
   * to the end of the collection.
   * @param {!Array<T>} arr Array.
   * @return {Collection<T>} This collection.
   * @api
   */
  extend(t) {
    for (let e = 0, i = t.length; e < i; ++e)
      this.push(t[e]);
    return this;
  }
  /**
   * Iterate over each element, calling the provided callback.
   * @param {function(T, number, Array<T>): *} f The function to call
   *     for every element. This function takes 3 arguments (the element, the
   *     index and the array). The return value is ignored.
   * @api
   */
  forEach(t) {
    const e = this.array_;
    for (let i = 0, n = e.length; i < n; ++i)
      t(e[i], i, e);
  }
  /**
   * Get a reference to the underlying Array object. Warning: if the array
   * is mutated, no events will be dispatched by the collection, and the
   * collection's "length" property won't be in sync with the actual length
   * of the array.
   * @return {!Array<T>} Array.
   * @api
   */
  getArray() {
    return this.array_;
  }
  /**
   * Get the element at the provided index.
   * @param {number} index Index.
   * @return {T} Element.
   * @api
   */
  item(t) {
    return this.array_[t];
  }
  /**
   * Get the length of this collection.
   * @return {number} The length of the array.
   * @observable
   * @api
   */
  getLength() {
    return this.get(Ws.LENGTH);
  }
  /**
   * Insert an element at the provided index.
   * @param {number} index Index.
   * @param {T} elem Element.
   * @api
   */
  insertAt(t, e) {
    if (t < 0 || t > this.getLength())
      throw new Error("Index out of bounds: " + t);
    this.unique_ && this.assertUnique_(e), this.array_.splice(t, 0, e), this.updateLength_(), this.dispatchEvent(
      new Mi(ut.ADD, e, t)
    );
  }
  /**
   * Remove the last element of the collection and return it.
   * Return `undefined` if the collection is empty.
   * @return {T|undefined} Element.
   * @api
   */
  pop() {
    return this.removeAt(this.getLength() - 1);
  }
  /**
   * Insert the provided element at the end of the collection.
   * @param {T} elem Element.
   * @return {number} New length of the collection.
   * @api
   */
  push(t) {
    this.unique_ && this.assertUnique_(t);
    const e = this.getLength();
    return this.insertAt(e, t), this.getLength();
  }
  /**
   * Remove the first occurrence of an element from the collection.
   * @param {T} elem Element.
   * @return {T|undefined} The removed element or undefined if none found.
   * @api
   */
  remove(t) {
    const e = this.array_;
    for (let i = 0, n = e.length; i < n; ++i)
      if (e[i] === t)
        return this.removeAt(i);
  }
  /**
   * Remove the element at the provided index and return it.
   * Return `undefined` if the collection does not contain this index.
   * @param {number} index Index.
   * @return {T|undefined} Value.
   * @api
   */
  removeAt(t) {
    if (t < 0 || t >= this.getLength())
      return;
    const e = this.array_[t];
    return this.array_.splice(t, 1), this.updateLength_(), this.dispatchEvent(
      /** @type {CollectionEvent<T>} */
      new Mi(ut.REMOVE, e, t)
    ), e;
  }
  /**
   * Set the element at the provided index.
   * @param {number} index Index.
   * @param {T} elem Element.
   * @api
   */
  setAt(t, e) {
    const i = this.getLength();
    if (t >= i) {
      this.insertAt(t, e);
      return;
    }
    if (t < 0)
      throw new Error("Index out of bounds: " + t);
    this.unique_ && this.assertUnique_(e, t);
    const n = this.array_[t];
    this.array_[t] = e, this.dispatchEvent(
      /** @type {CollectionEvent<T>} */
      new Mi(ut.REMOVE, n, t)
    ), this.dispatchEvent(
      /** @type {CollectionEvent<T>} */
      new Mi(ut.ADD, e, t)
    );
  }
  /**
   * @private
   */
  updateLength_() {
    this.set(Ws.LENGTH, this.array_.length);
  }
  /**
   * @private
   * @param {T} elem Element.
   * @param {number} [except] Optional index to ignore.
   */
  assertUnique_(t, e) {
    for (let i = 0, n = this.array_.length; i < n; ++i)
      if (this.array_[i] === t && i !== e)
        throw new Dr(58);
  }
}
const At = ra, ne = typeof navigator != "undefined" && typeof navigator.userAgent != "undefined" ? navigator.userAgent.toLowerCase() : "", oa = ne.includes("firefox"), aa = ne.includes("safari") && !ne.includes("chrom");
aa && (ne.includes("version/15.4") || /cpu (os|iphone os) 15_4 like mac os x/.test(ne));
const la = ne.includes("webkit") && !ne.includes("edge"), ha = ne.includes("macintosh"), kr = typeof devicePixelRatio != "undefined" ? devicePixelRatio : 1, ts = typeof WorkerGlobalScope != "undefined" && typeof OffscreenCanvas != "undefined" && self instanceof WorkerGlobalScope, ca = typeof Image != "undefined" && Image.prototype.decode, Nr = function() {
  let s = !1;
  try {
    const t = Object.defineProperty({}, "passive", {
      get: function() {
        s = !0;
      }
    });
    window.addEventListener("_", null, t), window.removeEventListener("_", null, t);
  } catch (t) {
  }
  return s;
}();
function k(s, t) {
  if (!s)
    throw new Dr(t);
}
new Array(6);
function Pt() {
  return [1, 0, 0, 1, 0, 0];
}
function ua(s, t, e, i, n, r, o) {
  return s[0] = t, s[1] = e, s[2] = i, s[3] = n, s[4] = r, s[5] = o, s;
}
function da(s, t) {
  return s[0] = t[0], s[1] = t[1], s[2] = t[2], s[3] = t[3], s[4] = t[4], s[5] = t[5], s;
}
function et(s, t) {
  const e = t[0], i = t[1];
  return t[0] = s[0] * e + s[2] * i + s[4], t[1] = s[1] * e + s[3] * i + s[5], t;
}
function fa(s, t, e) {
  return ua(s, t, 0, 0, e, 0, 0);
}
function se(s, t, e, i, n, r, o, a) {
  const l = Math.sin(r), h = Math.cos(r);
  return s[0] = i * h, s[1] = n * l, s[2] = -i * l, s[3] = n * h, s[4] = o * i * h - a * i * l + t, s[5] = o * n * l + a * n * h + e, s;
}
function es(s, t) {
  const e = ga(t);
  k(e !== 0, 32);
  const i = t[0], n = t[1], r = t[2], o = t[3], a = t[4], l = t[5];
  return s[0] = o / e, s[1] = -n / e, s[2] = -r / e, s[3] = i / e, s[4] = (r * l - o * a) / e, s[5] = -(i * l - n * a) / e, s;
}
function ga(s) {
  return s[0] * s[3] - s[1] * s[2];
}
let zs;
function Gr(s) {
  const t = "matrix(" + s.join(", ") + ")";
  if (ts)
    return t;
  const e = zs || (zs = document.createElement("div"));
  return e.style.transform = t, e.style.transform;
}
const tt = {
  UNKNOWN: 0,
  INTERSECTING: 1,
  ABOVE: 2,
  RIGHT: 4,
  BELOW: 8,
  LEFT: 16
};
function Ys(s) {
  const t = Tt();
  for (let e = 0, i = s.length; e < i; ++e)
    ti(t, s[e]);
  return t;
}
function is(s, t, e) {
  return e ? (e[0] = s[0] - t, e[1] = s[1] - t, e[2] = s[2] + t, e[3] = s[3] + t, e) : [
    s[0] - t,
    s[1] - t,
    s[2] + t,
    s[3] + t
  ];
}
function Xr(s, t) {
  return t ? (t[0] = s[0], t[1] = s[1], t[2] = s[2], t[3] = s[3], t) : s.slice();
}
function Wr(s, t, e) {
  let i, n;
  return t < s[0] ? i = s[0] - t : s[2] < t ? i = t - s[2] : i = 0, e < s[1] ? n = s[1] - e : s[3] < e ? n = e - s[3] : n = 0, i * i + n * n;
}
function hn(s, t) {
  return zr(s, t[0], t[1]);
}
function ce(s, t) {
  return s[0] <= t[0] && t[2] <= s[2] && s[1] <= t[1] && t[3] <= s[3];
}
function zr(s, t, e) {
  return s[0] <= t && t <= s[2] && s[1] <= e && e <= s[3];
}
function Xn(s, t) {
  const e = s[0], i = s[1], n = s[2], r = s[3], o = t[0], a = t[1];
  let l = tt.UNKNOWN;
  return o < e ? l = l | tt.LEFT : o > n && (l = l | tt.RIGHT), a < i ? l = l | tt.BELOW : a > r && (l = l | tt.ABOVE), l === tt.UNKNOWN && (l = tt.INTERSECTING), l;
}
function Tt() {
  return [1 / 0, 1 / 0, -1 / 0, -1 / 0];
}
function Bt(s, t, e, i, n) {
  return n ? (n[0] = s, n[1] = t, n[2] = e, n[3] = i, n) : [s, t, e, i];
}
function cn(s) {
  return Bt(1 / 0, 1 / 0, -1 / 0, -1 / 0, s);
}
function _a(s, t) {
  const e = s[0], i = s[1];
  return Bt(e, i, e, i, t);
}
function ma(s, t, e, i, n) {
  const r = cn(n);
  return Yr(r, s, t, e, i);
}
function ri(s, t) {
  return s[0] == t[0] && s[2] == t[2] && s[1] == t[1] && s[3] == t[3];
}
function pa(s, t) {
  return t[0] < s[0] && (s[0] = t[0]), t[2] > s[2] && (s[2] = t[2]), t[1] < s[1] && (s[1] = t[1]), t[3] > s[3] && (s[3] = t[3]), s;
}
function ti(s, t) {
  t[0] < s[0] && (s[0] = t[0]), t[0] > s[2] && (s[2] = t[0]), t[1] < s[1] && (s[1] = t[1]), t[1] > s[3] && (s[3] = t[1]);
}
function Yr(s, t, e, i, n) {
  for (; e < i; e += n)
    ya(s, t[e], t[e + 1]);
  return s;
}
function ya(s, t, e) {
  s[0] = Math.min(s[0], t), s[1] = Math.min(s[1], e), s[2] = Math.max(s[2], t), s[3] = Math.max(s[3], e);
}
function Br(s, t) {
  let e;
  return e = t(un(s)), e || (e = t(dn(s)), e) || (e = t(fn(s)), e) || (e = t(pe(s)), e) ? e : !1;
}
function Wn(s) {
  let t = 0;
  return ns(s) || (t = V(s) * Ot(s)), t;
}
function un(s) {
  return [s[0], s[1]];
}
function dn(s) {
  return [s[2], s[1]];
}
function Ye(s) {
  return [(s[0] + s[2]) / 2, (s[1] + s[3]) / 2];
}
function xa(s, t) {
  let e;
  return t === "bottom-left" ? e = un(s) : t === "bottom-right" ? e = dn(s) : t === "top-left" ? e = pe(s) : t === "top-right" ? e = fn(s) : k(!1, 13), e;
}
function zn(s, t, e, i, n) {
  const [r, o, a, l, h, c, u, d] = Yn(
    s,
    t,
    e,
    i
  );
  return Bt(
    Math.min(r, a, h, u),
    Math.min(o, l, c, d),
    Math.max(r, a, h, u),
    Math.max(o, l, c, d),
    n
  );
}
function Yn(s, t, e, i) {
  const n = t * i[0] / 2, r = t * i[1] / 2, o = Math.cos(e), a = Math.sin(e), l = n * o, h = n * a, c = r * o, u = r * a, d = s[0], f = s[1];
  return [
    d - l + u,
    f - h - c,
    d - l - u,
    f - h + c,
    d + l - u,
    f + h + c,
    d + l + u,
    f + h - c,
    d - l + u,
    f - h - c
  ];
}
function Ot(s) {
  return s[3] - s[1];
}
function ei(s, t, e) {
  const i = e || Tt();
  return at(s, t) ? (s[0] > t[0] ? i[0] = s[0] : i[0] = t[0], s[1] > t[1] ? i[1] = s[1] : i[1] = t[1], s[2] < t[2] ? i[2] = s[2] : i[2] = t[2], s[3] < t[3] ? i[3] = s[3] : i[3] = t[3]) : cn(i), i;
}
function pe(s) {
  return [s[0], s[3]];
}
function fn(s) {
  return [s[2], s[3]];
}
function V(s) {
  return s[2] - s[0];
}
function at(s, t) {
  return s[0] <= t[2] && s[2] >= t[0] && s[1] <= t[3] && s[3] >= t[1];
}
function ns(s) {
  return s[2] < s[0] || s[3] < s[1];
}
function Ea(s, t) {
  return t ? (t[0] = s[0], t[1] = s[1], t[2] = s[2], t[3] = s[3], t) : s;
}
function Ca(s, t, e) {
  let i = !1;
  const n = Xn(s, t), r = Xn(s, e);
  if (n === tt.INTERSECTING || r === tt.INTERSECTING)
    i = !0;
  else {
    const o = s[0], a = s[1], l = s[2], h = s[3], c = t[0], u = t[1], d = e[0], f = e[1], g = (f - u) / (d - c);
    let _, m;
    r & tt.ABOVE && !(n & tt.ABOVE) && (_ = d - (f - h) / g, i = _ >= o && _ <= l), !i && r & tt.RIGHT && !(n & tt.RIGHT) && (m = f - (d - l) * g, i = m >= a && m <= h), !i && r & tt.BELOW && !(n & tt.BELOW) && (_ = d - (f - a) / g, i = _ >= o && _ <= l), !i && r & tt.LEFT && !(n & tt.LEFT) && (m = f - (d - o) * g, i = m >= a && m <= h);
  }
  return i;
}
function Zr(s, t) {
  const e = t.getExtent(), i = Ye(s);
  if (t.canWrapX() && (i[0] < e[0] || i[0] >= e[2])) {
    const n = V(e), o = Math.floor(
      (i[0] - e[0]) / n
    ) * n;
    s[0] -= o, s[2] -= o;
  }
  return s;
}
function Ra(s, t) {
  if (t.canWrapX()) {
    const e = t.getExtent();
    if (!isFinite(s[0]) || !isFinite(s[2]))
      return [[e[0], s[1], e[2], s[3]]];
    Zr(s, t);
    const i = V(e);
    if (V(s) > i)
      return [[e[0], s[1], e[2], s[3]]];
    if (s[0] < e[0])
      return [
        [s[0] + i, s[1], e[2], s[3]],
        [e[0], s[1], s[2], s[3]]
      ];
    if (s[2] > e[2])
      return [
        [s[0], s[1], e[2], s[3]],
        [e[0], s[1], s[2] - i, s[3]]
      ];
  }
  return [s];
}
function $(s, t, e) {
  return Math.min(Math.max(s, t), e);
}
function Ta(s, t, e, i, n, r) {
  const o = n - e, a = r - i;
  if (o !== 0 || a !== 0) {
    const l = ((s - e) * o + (t - i) * a) / (o * o + a * a);
    l > 1 ? (e = n, i = r) : l > 0 && (e += o * l, i += a * l);
  }
  return ke(s, t, e, i);
}
function ke(s, t, e, i) {
  const n = e - s, r = i - t;
  return n * n + r * r;
}
function Ia(s) {
  const t = s.length;
  for (let i = 0; i < t; i++) {
    let n = i, r = Math.abs(s[i][i]);
    for (let a = i + 1; a < t; a++) {
      const l = Math.abs(s[a][i]);
      l > r && (r = l, n = a);
    }
    if (r === 0)
      return null;
    const o = s[n];
    s[n] = s[i], s[i] = o;
    for (let a = i + 1; a < t; a++) {
      const l = -s[a][i] / s[i][i];
      for (let h = i; h < t + 1; h++)
        i == h ? s[a][h] = 0 : s[a][h] += l * s[i][h];
    }
  }
  const e = new Array(t);
  for (let i = t - 1; i >= 0; i--) {
    e[i] = s[i][t] / s[i][i];
    for (let n = i - 1; n >= 0; n--)
      s[n][t] -= s[n][i] * e[i];
  }
  return e;
}
function Zi(s) {
  return s * Math.PI / 180;
}
function _e(s, t) {
  const e = s % t;
  return e * t < 0 ? e + t : e;
}
function Rt(s, t, e) {
  return s + e * (t - s);
}
function ss(s, t) {
  const e = Math.pow(10, t);
  return Math.round(s * e) / e;
}
function Pi(s, t) {
  return Math.floor(ss(s, t));
}
function Oi(s, t) {
  return Math.ceil(ss(s, t));
}
const Sa = /^#([a-f0-9]{3}|[a-f0-9]{4}(?:[a-f0-9]{2}){0,2})$/i, va = /^([a-z]*)$|^hsla?\(.*\)$/i;
function Kr(s) {
  return typeof s == "string" ? s : Ur(s);
}
function wa(s) {
  const t = document.createElement("div");
  if (t.style.color = s, t.style.color !== "") {
    document.body.appendChild(t);
    const e = getComputedStyle(t).color;
    return document.body.removeChild(t), e;
  }
  return "";
}
const La = function() {
  const t = {};
  let e = 0;
  return (
    /**
     * @param {string} s String.
     * @return {Color} Color.
     */
    function(i) {
      let n;
      if (t.hasOwnProperty(i))
        n = t[i];
      else {
        if (e >= 1024) {
          let r = 0;
          for (const o in t)
            r++ & 3 || (delete t[o], --e);
        }
        n = Aa(i), t[i] = n, ++e;
      }
      return n;
    }
  );
}();
function Ui(s) {
  return Array.isArray(s) ? s : La(s);
}
function Aa(s) {
  let t, e, i, n, r;
  if (va.exec(s) && (s = wa(s)), Sa.exec(s)) {
    const o = s.length - 1;
    let a;
    o <= 4 ? a = 1 : a = 2;
    const l = o === 4 || o === 8;
    t = parseInt(s.substr(1 + 0 * a, a), 16), e = parseInt(s.substr(1 + 1 * a, a), 16), i = parseInt(s.substr(1 + 2 * a, a), 16), l ? n = parseInt(s.substr(1 + 3 * a, a), 16) : n = 255, a == 1 && (t = (t << 4) + t, e = (e << 4) + e, i = (i << 4) + i, l && (n = (n << 4) + n)), r = [t, e, i, n / 255];
  } else
    s.startsWith("rgba(") ? (r = s.slice(5, -1).split(",").map(Number), Bs(r)) : s.startsWith("rgb(") ? (r = s.slice(4, -1).split(",").map(Number), r.push(1), Bs(r)) : k(!1, 14);
  return r;
}
function Bs(s) {
  return s[0] = $(s[0] + 0.5 | 0, 0, 255), s[1] = $(s[1] + 0.5 | 0, 0, 255), s[2] = $(s[2] + 0.5 | 0, 0, 255), s[3] = $(s[3], 0, 1), s;
}
function Ur(s) {
  let t = s[0];
  t != (t | 0) && (t = t + 0.5 | 0);
  let e = s[1];
  e != (e | 0) && (e = e + 0.5 | 0);
  let i = s[2];
  i != (i | 0) && (i = i + 0.5 | 0);
  const n = s[3] === void 0 ? 1 : Math.round(s[3] * 100) / 100;
  return "rgba(" + t + "," + e + "," + i + "," + n + ")";
}
class Ma {
  constructor() {
    this.cache_ = {}, this.cacheSize_ = 0, this.maxCacheSize_ = 32;
  }
  /**
   * FIXME empty description for jsdoc
   */
  clear() {
    this.cache_ = {}, this.cacheSize_ = 0;
  }
  /**
   * @return {boolean} Can expire cache.
   */
  canExpireCache() {
    return this.cacheSize_ > this.maxCacheSize_;
  }
  /**
   * FIXME empty description for jsdoc
   */
  expire() {
    if (this.canExpireCache()) {
      let t = 0;
      for (const e in this.cache_) {
        const i = this.cache_[e];
        !(t++ & 3) && !i.hasListener() && (delete this.cache_[e], --this.cacheSize_);
      }
    }
  }
  /**
   * @param {string} src Src.
   * @param {?string} crossOrigin Cross origin.
   * @param {import("../color.js").Color} color Color.
   * @return {import("./IconImage.js").default} Icon image.
   */
  get(t, e, i) {
    const n = Zs(t, e, i);
    return n in this.cache_ ? this.cache_[n] : null;
  }
  /**
   * @param {string} src Src.
   * @param {?string} crossOrigin Cross origin.
   * @param {import("../color.js").Color} color Color.
   * @param {import("./IconImage.js").default} iconImage Icon image.
   */
  set(t, e, i, n) {
    const r = Zs(t, e, i);
    this.cache_[r] = n, ++this.cacheSize_;
  }
  /**
   * Set the cache size of the icon cache. Default is `32`. Change this value when
   * your map uses more than 32 different icon images and you are not caching icon
   * styles on the application level.
   * @param {number} maxCacheSize Cache max size.
   * @api
   */
  setSize(t) {
    this.maxCacheSize_ = t, this.expire();
  }
}
function Zs(s, t, e) {
  const i = e ? Kr(e) : "null";
  return t + ":" + s + ":" + i;
}
const Vi = new Ma(), Z = {
  OPACITY: "opacity",
  VISIBLE: "visible",
  EXTENT: "extent",
  Z_INDEX: "zIndex",
  MAX_RESOLUTION: "maxResolution",
  MIN_RESOLUTION: "minResolution",
  MAX_ZOOM: "maxZoom",
  MIN_ZOOM: "minZoom",
  SOURCE: "source",
  MAP: "map"
};
class Pa extends St {
  /**
   * @param {Options} options Layer options.
   */
  constructor(t) {
    super(), this.on, this.once, this.un, this.background_ = t.background;
    const e = Object.assign({}, t);
    typeof t.properties == "object" && (delete e.properties, Object.assign(e, t.properties)), e[Z.OPACITY] = t.opacity !== void 0 ? t.opacity : 1, k(typeof e[Z.OPACITY] == "number", 64), e[Z.VISIBLE] = t.visible !== void 0 ? t.visible : !0, e[Z.Z_INDEX] = t.zIndex, e[Z.MAX_RESOLUTION] = t.maxResolution !== void 0 ? t.maxResolution : 1 / 0, e[Z.MIN_RESOLUTION] = t.minResolution !== void 0 ? t.minResolution : 0, e[Z.MIN_ZOOM] = t.minZoom !== void 0 ? t.minZoom : -1 / 0, e[Z.MAX_ZOOM] = t.maxZoom !== void 0 ? t.maxZoom : 1 / 0, this.className_ = e.className !== void 0 ? e.className : "ol-layer", delete e.className, this.setProperties(e), this.state_ = null;
  }
  /**
   * Get the background for this layer.
   * @return {BackgroundColor|false} Layer background.
   */
  getBackground() {
    return this.background_;
  }
  /**
   * @return {string} CSS class name.
   */
  getClassName() {
    return this.className_;
  }
  /**
   * This method is not meant to be called by layers or layer renderers because the state
   * is incorrect if the layer is included in a layer group.
   *
   * @param {boolean} [managed] Layer is managed.
   * @return {import("./Layer.js").State} Layer state.
   */
  getLayerState(t) {
    const e = this.state_ || /** @type {?} */
    {
      layer: this,
      managed: t === void 0 ? !0 : t
    }, i = this.getZIndex();
    return e.opacity = $(Math.round(this.getOpacity() * 100) / 100, 0, 1), e.visible = this.getVisible(), e.extent = this.getExtent(), e.zIndex = i === void 0 && !e.managed ? 1 / 0 : i, e.maxResolution = this.getMaxResolution(), e.minResolution = Math.max(this.getMinResolution(), 0), e.minZoom = this.getMinZoom(), e.maxZoom = this.getMaxZoom(), this.state_ = e, e;
  }
  /**
   * @abstract
   * @param {Array<import("./Layer.js").default>} [array] Array of layers (to be
   *     modified in place).
   * @return {Array<import("./Layer.js").default>} Array of layers.
   */
  getLayersArray(t) {
    return W();
  }
  /**
   * @abstract
   * @param {Array<import("./Layer.js").State>} [states] Optional list of layer
   *     states (to be modified in place).
   * @return {Array<import("./Layer.js").State>} List of layer states.
   */
  getLayerStatesArray(t) {
    return W();
  }
  /**
   * Return the {@link module:ol/extent~Extent extent} of the layer or `undefined` if it
   * will be visible regardless of extent.
   * @return {import("../extent.js").Extent|undefined} The layer extent.
   * @observable
   * @api
   */
  getExtent() {
    return (
      /** @type {import("../extent.js").Extent|undefined} */
      this.get(Z.EXTENT)
    );
  }
  /**
   * Return the maximum resolution of the layer.
   * @return {number} The maximum resolution of the layer.
   * @observable
   * @api
   */
  getMaxResolution() {
    return (
      /** @type {number} */
      this.get(Z.MAX_RESOLUTION)
    );
  }
  /**
   * Return the minimum resolution of the layer.
   * @return {number} The minimum resolution of the layer.
   * @observable
   * @api
   */
  getMinResolution() {
    return (
      /** @type {number} */
      this.get(Z.MIN_RESOLUTION)
    );
  }
  /**
   * Return the minimum zoom level of the layer.
   * @return {number} The minimum zoom level of the layer.
   * @observable
   * @api
   */
  getMinZoom() {
    return (
      /** @type {number} */
      this.get(Z.MIN_ZOOM)
    );
  }
  /**
   * Return the maximum zoom level of the layer.
   * @return {number} The maximum zoom level of the layer.
   * @observable
   * @api
   */
  getMaxZoom() {
    return (
      /** @type {number} */
      this.get(Z.MAX_ZOOM)
    );
  }
  /**
   * Return the opacity of the layer (between 0 and 1).
   * @return {number} The opacity of the layer.
   * @observable
   * @api
   */
  getOpacity() {
    return (
      /** @type {number} */
      this.get(Z.OPACITY)
    );
  }
  /**
   * @abstract
   * @return {import("../source/Source.js").State} Source state.
   */
  getSourceState() {
    return W();
  }
  /**
   * Return the visibility of the layer (`true` or `false`).
   * @return {boolean} The visibility of the layer.
   * @observable
   * @api
   */
  getVisible() {
    return (
      /** @type {boolean} */
      this.get(Z.VISIBLE)
    );
  }
  /**
   * Return the Z-index of the layer, which is used to order layers before
   * rendering. The default Z-index is 0.
   * @return {number} The Z-index of the layer.
   * @observable
   * @api
   */
  getZIndex() {
    return (
      /** @type {number} */
      this.get(Z.Z_INDEX)
    );
  }
  /**
   * Sets the background color.
   * @param {BackgroundColor} [background] Background color.
   */
  setBackground(t) {
    this.background_ = t, this.changed();
  }
  /**
   * Set the extent at which the layer is visible.  If `undefined`, the layer
   * will be visible at all extents.
   * @param {import("../extent.js").Extent|undefined} extent The extent of the layer.
   * @observable
   * @api
   */
  setExtent(t) {
    this.set(Z.EXTENT, t);
  }
  /**
   * Set the maximum resolution at which the layer is visible.
   * @param {number} maxResolution The maximum resolution of the layer.
   * @observable
   * @api
   */
  setMaxResolution(t) {
    this.set(Z.MAX_RESOLUTION, t);
  }
  /**
   * Set the minimum resolution at which the layer is visible.
   * @param {number} minResolution The minimum resolution of the layer.
   * @observable
   * @api
   */
  setMinResolution(t) {
    this.set(Z.MIN_RESOLUTION, t);
  }
  /**
   * Set the maximum zoom (exclusive) at which the layer is visible.
   * Note that the zoom levels for layer visibility are based on the
   * view zoom level, which may be different from a tile source zoom level.
   * @param {number} maxZoom The maximum zoom of the layer.
   * @observable
   * @api
   */
  setMaxZoom(t) {
    this.set(Z.MAX_ZOOM, t);
  }
  /**
   * Set the minimum zoom (inclusive) at which the layer is visible.
   * Note that the zoom levels for layer visibility are based on the
   * view zoom level, which may be different from a tile source zoom level.
   * @param {number} minZoom The minimum zoom of the layer.
   * @observable
   * @api
   */
  setMinZoom(t) {
    this.set(Z.MIN_ZOOM, t);
  }
  /**
   * Set the opacity of the layer, allowed values range from 0 to 1.
   * @param {number} opacity The opacity of the layer.
   * @observable
   * @api
   */
  setOpacity(t) {
    k(typeof t == "number", 64), this.set(Z.OPACITY, t);
  }
  /**
   * Set the visibility of the layer (`true` or `false`).
   * @param {boolean} visible The visibility of the layer.
   * @observable
   * @api
   */
  setVisible(t) {
    this.set(Z.VISIBLE, t);
  }
  /**
   * Set Z-index of the layer, which is used to order layers before rendering.
   * The default Z-index is 0.
   * @param {number} zindex The z-index of the layer.
   * @observable
   * @api
   */
  setZIndex(t) {
    this.set(Z.Z_INDEX, t);
  }
  /**
   * Clean up.
   */
  disposeInternal() {
    this.state_ && (this.state_.layer = null, this.state_ = null), super.disposeInternal();
  }
}
const Vr = Pa, ie = {
  /**
   * Triggered before a layer is rendered.
   * @event module:ol/render/Event~RenderEvent#prerender
   * @api
   */
  PRERENDER: "prerender",
  /**
   * Triggered after a layer is rendered.
   * @event module:ol/render/Event~RenderEvent#postrender
   * @api
   */
  POSTRENDER: "postrender",
  /**
   * Triggered before layers are composed.  When dispatched by the map, the event object will not have
   * a `context` set.  When dispatched by a layer, the event object will have a `context` set.  Only
   * WebGL layers currently dispatch this event.
   * @event module:ol/render/Event~RenderEvent#precompose
   * @api
   */
  PRECOMPOSE: "precompose",
  /**
   * Triggered after layers are composed.  When dispatched by the map, the event object will not have
   * a `context` set.  When dispatched by a layer, the event object will have a `context` set.  Only
   * WebGL layers currently dispatch this event.
   * @event module:ol/render/Event~RenderEvent#postcompose
   * @api
   */
  POSTCOMPOSE: "postcompose",
  /**
   * Triggered when rendering is complete, i.e. all sources and tiles have
   * finished loading for the current viewport, and all tiles are faded in.
   * The event object will not have a `context` set.
   * @event module:ol/render/Event~RenderEvent#rendercomplete
   * @api
   */
  RENDERCOMPLETE: "rendercomplete"
}, rt = {
  ANIMATING: 0,
  INTERACTING: 1
}, Et = {
  CENTER: "center",
  RESOLUTION: "resolution",
  ROTATION: "rotation"
}, Oa = 42, rs = 256, oi = {
  // use the radius of the Normal sphere
  radians: 6370997 / (2 * Math.PI),
  degrees: 2 * Math.PI * 6370997 / 360,
  ft: 0.3048,
  m: 1,
  "us-ft": 1200 / 3937
};
class ba {
  /**
   * @param {Options} options Projection options.
   */
  constructor(t) {
    this.code_ = t.code, this.units_ = /** @type {import("./Units.js").Units} */
    t.units, this.extent_ = t.extent !== void 0 ? t.extent : null, this.worldExtent_ = t.worldExtent !== void 0 ? t.worldExtent : null, this.axisOrientation_ = t.axisOrientation !== void 0 ? t.axisOrientation : "enu", this.global_ = t.global !== void 0 ? t.global : !1, this.canWrapX_ = !!(this.global_ && this.extent_), this.getPointResolutionFunc_ = t.getPointResolution, this.defaultTileGrid_ = null, this.metersPerUnit_ = t.metersPerUnit;
  }
  /**
   * @return {boolean} The projection is suitable for wrapping the x-axis
   */
  canWrapX() {
    return this.canWrapX_;
  }
  /**
   * Get the code for this projection, e.g. 'EPSG:4326'.
   * @return {string} Code.
   * @api
   */
  getCode() {
    return this.code_;
  }
  /**
   * Get the validity extent for this projection.
   * @return {import("../extent.js").Extent} Extent.
   * @api
   */
  getExtent() {
    return this.extent_;
  }
  /**
   * Get the units of this projection.
   * @return {import("./Units.js").Units} Units.
   * @api
   */
  getUnits() {
    return this.units_;
  }
  /**
   * Get the amount of meters per unit of this projection.  If the projection is
   * not configured with `metersPerUnit` or a units identifier, the return is
   * `undefined`.
   * @return {number|undefined} Meters.
   * @api
   */
  getMetersPerUnit() {
    return this.metersPerUnit_ || oi[this.units_];
  }
  /**
   * Get the world extent for this projection.
   * @return {import("../extent.js").Extent} Extent.
   * @api
   */
  getWorldExtent() {
    return this.worldExtent_;
  }
  /**
   * Get the axis orientation of this projection.
   * Example values are:
   * enu - the default easting, northing, elevation.
   * neu - northing, easting, up - useful for "lat/long" geographic coordinates,
   *     or south orientated transverse mercator.
   * wnu - westing, northing, up - some planetary coordinate systems have
   *     "west positive" coordinate systems
   * @return {string} Axis orientation.
   * @api
   */
  getAxisOrientation() {
    return this.axisOrientation_;
  }
  /**
   * Is this projection a global projection which spans the whole world?
   * @return {boolean} Whether the projection is global.
   * @api
   */
  isGlobal() {
    return this.global_;
  }
  /**
   * Set if the projection is a global projection which spans the whole world
   * @param {boolean} global Whether the projection is global.
   * @api
   */
  setGlobal(t) {
    this.global_ = t, this.canWrapX_ = !!(t && this.extent_);
  }
  /**
   * @return {import("../tilegrid/TileGrid.js").default} The default tile grid.
   */
  getDefaultTileGrid() {
    return this.defaultTileGrid_;
  }
  /**
   * @param {import("../tilegrid/TileGrid.js").default} tileGrid The default tile grid.
   */
  setDefaultTileGrid(t) {
    this.defaultTileGrid_ = t;
  }
  /**
   * Set the validity extent for this projection.
   * @param {import("../extent.js").Extent} extent Extent.
   * @api
   */
  setExtent(t) {
    this.extent_ = t, this.canWrapX_ = !!(this.global_ && t);
  }
  /**
   * Set the world extent for this projection.
   * @param {import("../extent.js").Extent} worldExtent World extent
   *     [minlon, minlat, maxlon, maxlat].
   * @api
   */
  setWorldExtent(t) {
    this.worldExtent_ = t;
  }
  /**
   * Set the getPointResolution function (see {@link module:ol/proj.getPointResolution}
   * for this projection.
   * @param {function(number, import("../coordinate.js").Coordinate):number} func Function
   * @api
   */
  setGetPointResolution(t) {
    this.getPointResolutionFunc_ = t;
  }
  /**
   * Get the custom point resolution function for this projection (if set).
   * @return {function(number, import("../coordinate.js").Coordinate):number|undefined} The custom point
   * resolution function (if set).
   */
  getPointResolutionFunc() {
    return this.getPointResolutionFunc_;
  }
}
const jr = ba, pi = 6378137, Fe = Math.PI * pi, Fa = [-Fe, -Fe, Fe, Fe], Da = [-180, -85, 180, 85], bi = pi * Math.log(Math.tan(Math.PI / 2));
class Ie extends jr {
  /**
   * @param {string} code Code.
   */
  constructor(t) {
    super({
      code: t,
      units: "m",
      extent: Fa,
      global: !0,
      worldExtent: Da,
      getPointResolution: function(e, i) {
        return e / Math.cosh(i[1] / pi);
      }
    });
  }
}
const Ks = [
  new Ie("EPSG:3857"),
  new Ie("EPSG:102100"),
  new Ie("EPSG:102113"),
  new Ie("EPSG:900913"),
  new Ie("http://www.opengis.net/def/crs/EPSG/0/3857"),
  new Ie("http://www.opengis.net/gml/srs/epsg.xml#3857")
];
function ka(s, t, e) {
  const i = s.length;
  e = e > 1 ? e : 2, t === void 0 && (e > 2 ? t = s.slice() : t = new Array(i));
  for (let n = 0; n < i; n += e) {
    t[n] = Fe * s[n] / 180;
    let r = pi * Math.log(Math.tan(Math.PI * (+s[n + 1] + 90) / 360));
    r > bi ? r = bi : r < -bi && (r = -bi), t[n + 1] = r;
  }
  return t;
}
function Na(s, t, e) {
  const i = s.length;
  e = e > 1 ? e : 2, t === void 0 && (e > 2 ? t = s.slice() : t = new Array(i));
  for (let n = 0; n < i; n += e)
    t[n] = 180 * s[n] / Fe, t[n + 1] = 360 * Math.atan(Math.exp(s[n + 1] / pi)) / Math.PI - 90;
  return t;
}
const Ga = 6378137, Us = [-180, -90, 180, 90], Xa = Math.PI * Ga / 180;
class ae extends jr {
  /**
   * @param {string} code Code.
   * @param {string} [axisOrientation] Axis orientation.
   */
  constructor(t, e) {
    super({
      code: t,
      units: "degrees",
      extent: Us,
      axisOrientation: e,
      global: !0,
      metersPerUnit: Xa,
      worldExtent: Us
    });
  }
}
const Vs = [
  new ae("CRS:84"),
  new ae("EPSG:4326", "neu"),
  new ae("urn:ogc:def:crs:OGC:1.3:CRS84"),
  new ae("urn:ogc:def:crs:OGC:2:84"),
  new ae("http://www.opengis.net/def/crs/OGC/1.3/CRS84"),
  new ae("http://www.opengis.net/gml/srs/epsg.xml#4326", "neu"),
  new ae("http://www.opengis.net/def/crs/EPSG/0/4326", "neu")
];
let Bn = {};
function Wa(s) {
  return Bn[s] || Bn[s.replace(/urn:(x-)?ogc:def:crs:EPSG:(.*:)?(\w+)$/, "EPSG:$3")] || null;
}
function za(s, t) {
  Bn[s] = t;
}
let Ne = {};
function ji(s, t, e) {
  const i = s.getCode(), n = t.getCode();
  i in Ne || (Ne[i] = {}), Ne[i][n] = e;
}
function Ya(s, t) {
  let e;
  return s in Ne && t in Ne[s] && (e = Ne[s][t]), e;
}
function Ba(s, t) {
  return s[0] += +t[0], s[1] += +t[1], s;
}
function Hi(s, t) {
  let e = !0;
  for (let i = s.length - 1; i >= 0; --i)
    if (s[i] != t[i]) {
      e = !1;
      break;
    }
  return e;
}
function os(s, t) {
  const e = Math.cos(t), i = Math.sin(t), n = s[0] * e - s[1] * i, r = s[1] * e + s[0] * i;
  return s[0] = n, s[1] = r, s;
}
function Za(s, t) {
  return s[0] *= t, s[1] *= t, s;
}
function Hr(s, t) {
  if (t.canWrapX()) {
    const e = V(t.getExtent()), i = Ka(s, t, e);
    i && (s[0] -= i * e);
  }
  return s;
}
function Ka(s, t, e) {
  const i = t.getExtent();
  let n = 0;
  return t.canWrapX() && (s[0] < i[0] || s[0] > i[2]) && (e = e || V(i), n = Math.floor(
    (s[0] - i[0]) / e
  )), n;
}
const Ua = 63710088e-1;
function js(s, t, e) {
  e = e || Ua;
  const i = Zi(s[1]), n = Zi(t[1]), r = (n - i) / 2, o = Zi(t[0] - s[0]) / 2, a = Math.sin(r) * Math.sin(r) + Math.sin(o) * Math.sin(o) * Math.cos(i) * Math.cos(n);
  return 2 * e * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
const $r = {
  info: 1,
  warn: 2,
  error: 3,
  none: 4
};
let Va = $r.info;
function qr(...s) {
  Va > $r.warn || console.warn(...s);
}
let Zn = !0;
function Jr(s) {
  Zn = !(s === void 0 ? !0 : s);
}
function as(s, t) {
  if (t !== void 0) {
    for (let e = 0, i = s.length; e < i; ++e)
      t[e] = s[e];
    t = t;
  } else
    t = s.slice();
  return t;
}
function Qr(s, t) {
  if (t !== void 0 && s !== t) {
    for (let e = 0, i = s.length; e < i; ++e)
      t[e] = s[e];
    s = t;
  }
  return s;
}
function ja(s) {
  za(s.getCode(), s), ji(s, s, as);
}
function Ha(s) {
  s.forEach(ja);
}
function It(s) {
  return typeof s == "string" ? Wa(
    /** @type {string} */
    s
  ) : (
    /** @type {Projection} */
    s || null
  );
}
function Hs(s, t, e, i) {
  s = It(s);
  let n;
  const r = s.getPointResolutionFunc();
  if (r) {
    if (n = r(t, e), i && i !== s.getUnits()) {
      const o = s.getMetersPerUnit();
      o && (n = n * o / oi[i]);
    }
  } else {
    const o = s.getUnits();
    if (o == "degrees" && !i || i == "degrees")
      n = t;
    else {
      const a = hs(
        s,
        It("EPSG:4326")
      );
      if (a === Qr && o !== "degrees")
        n = t * s.getMetersPerUnit();
      else {
        let h = [
          e[0] - t / 2,
          e[1],
          e[0] + t / 2,
          e[1],
          e[0],
          e[1] - t / 2,
          e[0],
          e[1] + t / 2
        ];
        h = a(h, h, 2);
        const c = js(h.slice(0, 2), h.slice(2, 4)), u = js(h.slice(4, 6), h.slice(6, 8));
        n = (c + u) / 2;
      }
      const l = i ? oi[i] : s.getMetersPerUnit();
      l !== void 0 && (n /= l);
    }
  }
  return n;
}
function $s(s) {
  Ha(s), s.forEach(function(t) {
    s.forEach(function(e) {
      t !== e && ji(t, e, as);
    });
  });
}
function $a(s, t, e, i) {
  s.forEach(function(n) {
    t.forEach(function(r) {
      ji(n, r, e), ji(r, n, i);
    });
  });
}
function ls(s, t) {
  if (s) {
    if (typeof s == "string")
      return It(s);
  } else
    return It(t);
  return (
    /** @type {Projection} */
    s
  );
}
function Fi(s, t) {
  return Jr(), cs(
    s,
    "EPSG:4326",
    t !== void 0 ? t : "EPSG:3857"
  );
}
function qa(s, t) {
  const e = cs(
    s,
    t !== void 0 ? t : "EPSG:3857",
    "EPSG:4326"
  ), i = e[0];
  return (i < -180 || i > 180) && (e[0] = _e(i + 180, 360) - 180), e;
}
function Ae(s, t) {
  if (s === t)
    return !0;
  const e = s.getUnits() === t.getUnits();
  return (s.getCode() === t.getCode() || hs(s, t) === as) && e;
}
function hs(s, t) {
  const e = s.getCode(), i = t.getCode();
  let n = Ya(e, i);
  return n || (n = Qr), n;
}
function $i(s, t) {
  const e = It(s), i = It(t);
  return hs(e, i);
}
function cs(s, t, e) {
  return $i(t, e)(s, void 0, s.length);
}
function Kn(s, t) {
  return s;
}
function Xt(s, t) {
  return Zn && !Hi(s, [0, 0]) && s[0] >= -180 && s[0] <= 180 && s[1] >= -90 && s[1] <= 90 && (Zn = !1, qr(
    "Call useGeographic() from ol/proj once to work with [longitude, latitude] coordinates."
  )), s;
}
function to(s, t) {
  return s;
}
function ue(s, t) {
  return s;
}
function Ja() {
  $s(Ks), $s(Vs), $a(
    Vs,
    Ks,
    ka,
    Na
  );
}
Ja();
function qs(s, t, e) {
  return (
    /**
     * @param {import("./coordinate.js").Coordinate|undefined} center Center.
     * @param {number|undefined} resolution Resolution.
     * @param {import("./size.js").Size} size Viewport size; unused if `onlyCenter` was specified.
     * @param {boolean} [isMoving] True if an interaction or animation is in progress.
     * @param {Array<number>} [centerShift] Shift between map center and viewport center.
     * @return {import("./coordinate.js").Coordinate|undefined} Center.
     */
    function(i, n, r, o, a) {
      if (!i)
        return;
      if (!n && !t)
        return i;
      const l = t ? 0 : r[0] * n, h = t ? 0 : r[1] * n, c = a ? a[0] : 0, u = a ? a[1] : 0;
      let d = s[0] + l / 2 + c, f = s[2] - l / 2 + c, g = s[1] + h / 2 + u, _ = s[3] - h / 2 + u;
      d > f && (d = (f + d) / 2, f = d), g > _ && (g = (_ + g) / 2, _ = g);
      let m = $(i[0], d, f), p = $(i[1], g, _);
      if (o && e && n) {
        const y = 30 * n;
        m += -y * Math.log(1 + Math.max(0, d - i[0]) / y) + y * Math.log(1 + Math.max(0, i[0] - f) / y), p += -y * Math.log(1 + Math.max(0, g - i[1]) / y) + y * Math.log(1 + Math.max(0, i[1] - _) / y);
      }
      return [m, p];
    }
  );
}
function Qa(s) {
  return s;
}
function us(s, t, e, i) {
  const n = V(t) / e[0], r = Ot(t) / e[1];
  return i ? Math.min(s, Math.max(n, r)) : Math.min(s, Math.min(n, r));
}
function ds(s, t, e) {
  let i = Math.min(s, t);
  const n = 50;
  return i *= Math.log(1 + n * Math.max(0, s / t - 1)) / n + 1, e && (i = Math.max(i, e), i /= Math.log(1 + n * Math.max(0, e / s - 1)) / n + 1), $(i, e / 2, t * 2);
}
function tl(s, t, e, i) {
  return t = t !== void 0 ? t : !0, /**
   * @param {number|undefined} resolution Resolution.
   * @param {number} direction Direction.
   * @param {import("./size.js").Size} size Viewport size.
   * @param {boolean} [isMoving] True if an interaction or animation is in progress.
   * @return {number|undefined} Resolution.
   */
  function(n, r, o, a) {
    if (n !== void 0) {
      const l = s[0], h = s[s.length - 1], c = e ? us(
        l,
        e,
        o,
        i
      ) : l;
      if (a)
        return t ? ds(
          n,
          c,
          h
        ) : $(n, h, c);
      const u = Math.min(c, n), d = Math.floor(Qn(s, u, r));
      return s[d] > c && d < s.length - 1 ? s[d + 1] : s[d];
    }
  };
}
function el(s, t, e, i, n, r) {
  return i = i !== void 0 ? i : !0, e = e !== void 0 ? e : 0, /**
   * @param {number|undefined} resolution Resolution.
   * @param {number} direction Direction.
   * @param {import("./size.js").Size} size Viewport size.
   * @param {boolean} [isMoving] True if an interaction or animation is in progress.
   * @return {number|undefined} Resolution.
   */
  function(o, a, l, h) {
    if (o !== void 0) {
      const c = n ? us(
        t,
        n,
        l,
        r
      ) : t;
      if (h)
        return i ? ds(
          o,
          c,
          e
        ) : $(o, e, c);
      const u = 1e-9, d = Math.ceil(
        Math.log(t / c) / Math.log(s) - u
      ), f = -a * (0.5 - u) + 0.5, g = Math.min(c, o), _ = Math.floor(
        Math.log(t / g) / Math.log(s) + f
      ), m = Math.max(d, _), p = t / Math.pow(s, m);
      return $(p, e, c);
    }
  };
}
function Js(s, t, e, i, n) {
  return e = e !== void 0 ? e : !0, /**
   * @param {number|undefined} resolution Resolution.
   * @param {number} direction Direction.
   * @param {import("./size.js").Size} size Viewport size.
   * @param {boolean} [isMoving] True if an interaction or animation is in progress.
   * @return {number|undefined} Resolution.
   */
  function(r, o, a, l) {
    if (r !== void 0) {
      const h = i ? us(
        s,
        i,
        a,
        n
      ) : s;
      return !e || !l ? $(r, t, h) : ds(
        r,
        h,
        t
      );
    }
  };
}
function fs(s) {
  if (s !== void 0)
    return 0;
}
function Qs(s) {
  if (s !== void 0)
    return s;
}
function il(s) {
  const t = 2 * Math.PI / s;
  return (
    /**
     * @param {number|undefined} rotation Rotation.
     * @param {boolean} [isMoving] True if an interaction or animation is in progress.
     * @return {number|undefined} Rotation.
     */
    function(e, i) {
      if (i)
        return e;
      if (e !== void 0)
        return e = Math.floor(e / t + 0.5) * t, e;
    }
  );
}
function nl(s) {
  return s = s || Zi(5), /**
   * @param {number|undefined} rotation Rotation.
   * @param {boolean} [isMoving] True if an interaction or animation is in progress.
   * @return {number|undefined} Rotation.
   */
  function(t, e) {
    if (e)
      return t;
    if (t !== void 0)
      return Math.abs(t) <= s ? 0 : t;
  };
}
function eo(s) {
  return Math.pow(s, 3);
}
function Ze(s) {
  return 1 - eo(1 - s);
}
function sl(s) {
  return 3 * s * s - 2 * s * s * s;
}
function rl(s) {
  return s;
}
function me(s, t, e, i, n, r) {
  r = r || [];
  let o = 0;
  for (let a = t; a < e; a += i) {
    const l = s[a], h = s[a + 1];
    r[o++] = n[0] * l + n[2] * h + n[4], r[o++] = n[1] * l + n[3] * h + n[5];
  }
  return r && r.length != o && (r.length = o), r;
}
function io(s, t, e, i, n, r, o) {
  o = o || [];
  const a = Math.cos(n), l = Math.sin(n), h = r[0], c = r[1];
  let u = 0;
  for (let d = t; d < e; d += i) {
    const f = s[d] - h, g = s[d + 1] - c;
    o[u++] = h + f * a - g * l, o[u++] = c + f * l + g * a;
    for (let _ = d + 2; _ < d + i; ++_)
      o[u++] = s[_];
  }
  return o && o.length != u && (o.length = u), o;
}
function ol(s, t, e, i, n, r, o, a) {
  a = a || [];
  const l = o[0], h = o[1];
  let c = 0;
  for (let u = t; u < e; u += i) {
    const d = s[u] - l, f = s[u + 1] - h;
    a[c++] = l + n * d, a[c++] = h + r * f;
    for (let g = u + 2; g < u + i; ++g)
      a[c++] = s[g];
  }
  return a && a.length != c && (a.length = c), a;
}
function al(s, t, e, i, n, r, o) {
  o = o || [];
  let a = 0;
  for (let l = t; l < e; l += i) {
    o[a++] = s[l] + n, o[a++] = s[l + 1] + r;
    for (let h = l + 2; h < l + i; ++h)
      o[a++] = s[h];
  }
  return o && o.length != a && (o.length = a), o;
}
const tr = Pt();
class ll extends St {
  constructor() {
    super(), this.extent_ = Tt(), this.extentRevision_ = -1, this.simplifiedGeometryMaxMinSquaredTolerance = 0, this.simplifiedGeometryRevision = 0, this.simplifyTransformedInternal = Jo(function(t, e, i) {
      if (!i)
        return this.getSimplifiedGeometry(e);
      const n = this.clone();
      return n.applyTransform(i), n.getSimplifiedGeometry(e);
    });
  }
  /**
   * Get a transformed and simplified version of the geometry.
   * @abstract
   * @param {number} squaredTolerance Squared tolerance.
   * @param {import("../proj.js").TransformFunction} [transform] Optional transform function.
   * @return {Geometry} Simplified geometry.
   */
  simplifyTransformed(t, e) {
    return this.simplifyTransformedInternal(
      this.getRevision(),
      t,
      e
    );
  }
  /**
   * Make a complete copy of the geometry.
   * @abstract
   * @return {!Geometry} Clone.
   */
  clone() {
    return W();
  }
  /**
   * @abstract
   * @param {number} x X.
   * @param {number} y Y.
   * @param {import("../coordinate.js").Coordinate} closestPoint Closest point.
   * @param {number} minSquaredDistance Minimum squared distance.
   * @return {number} Minimum squared distance.
   */
  closestPointXY(t, e, i, n) {
    return W();
  }
  /**
   * @param {number} x X.
   * @param {number} y Y.
   * @return {boolean} Contains (x, y).
   */
  containsXY(t, e) {
    const i = this.getClosestPoint([t, e]);
    return i[0] === t && i[1] === e;
  }
  /**
   * Return the closest point of the geometry to the passed point as
   * {@link module:ol/coordinate~Coordinate coordinate}.
   * @param {import("../coordinate.js").Coordinate} point Point.
   * @param {import("../coordinate.js").Coordinate} [closestPoint] Closest point.
   * @return {import("../coordinate.js").Coordinate} Closest point.
   * @api
   */
  getClosestPoint(t, e) {
    return e = e || [NaN, NaN], this.closestPointXY(t[0], t[1], e, 1 / 0), e;
  }
  /**
   * Returns true if this geometry includes the specified coordinate. If the
   * coordinate is on the boundary of the geometry, returns false.
   * @param {import("../coordinate.js").Coordinate} coordinate Coordinate.
   * @return {boolean} Contains coordinate.
   * @api
   */
  intersectsCoordinate(t) {
    return this.containsXY(t[0], t[1]);
  }
  /**
   * @abstract
   * @param {import("../extent.js").Extent} extent Extent.
   * @protected
   * @return {import("../extent.js").Extent} extent Extent.
   */
  computeExtent(t) {
    return W();
  }
  /**
   * Get the extent of the geometry.
   * @param {import("../extent.js").Extent} [extent] Extent.
   * @return {import("../extent.js").Extent} extent Extent.
   * @api
   */
  getExtent(t) {
    if (this.extentRevision_ != this.getRevision()) {
      const e = this.computeExtent(this.extent_);
      (isNaN(e[0]) || isNaN(e[1])) && cn(e), this.extentRevision_ = this.getRevision();
    }
    return Ea(this.extent_, t);
  }
  /**
   * Rotate the geometry around a given coordinate. This modifies the geometry
   * coordinates in place.
   * @abstract
   * @param {number} angle Rotation angle in radians.
   * @param {import("../coordinate.js").Coordinate} anchor The rotation center.
   * @api
   */
  rotate(t, e) {
    W();
  }
  /**
   * Scale the geometry (with an optional origin).  This modifies the geometry
   * coordinates in place.
   * @abstract
   * @param {number} sx The scaling factor in the x-direction.
   * @param {number} [sy] The scaling factor in the y-direction (defaults to sx).
   * @param {import("../coordinate.js").Coordinate} [anchor] The scale origin (defaults to the center
   *     of the geometry extent).
   * @api
   */
  scale(t, e, i) {
    W();
  }
  /**
   * Create a simplified version of this geometry.  For linestrings, this uses
   * the [Douglas Peucker](https://en.wikipedia.org/wiki/Ramer-Douglas-Peucker_algorithm)
   * algorithm.  For polygons, a quantization-based
   * simplification is used to preserve topology.
   * @param {number} tolerance The tolerance distance for simplification.
   * @return {Geometry} A new, simplified version of the original geometry.
   * @api
   */
  simplify(t) {
    return this.getSimplifiedGeometry(t * t);
  }
  /**
   * Create a simplified version of this geometry using the Douglas Peucker
   * algorithm.
   * See https://en.wikipedia.org/wiki/Ramer-Douglas-Peucker_algorithm.
   * @abstract
   * @param {number} squaredTolerance Squared tolerance.
   * @return {Geometry} Simplified geometry.
   */
  getSimplifiedGeometry(t) {
    return W();
  }
  /**
   * Get the type of this geometry.
   * @abstract
   * @return {Type} Geometry type.
   */
  getType() {
    return W();
  }
  /**
   * Apply a transform function to the coordinates of the geometry.
   * The geometry is modified in place.
   * If you do not want the geometry modified in place, first `clone()` it and
   * then use this function on the clone.
   * @abstract
   * @param {import("../proj.js").TransformFunction} transformFn Transform function.
   * Called with a flat array of geometry coordinates.
   */
  applyTransform(t) {
    W();
  }
  /**
   * Test if the geometry and the passed extent intersect.
   * @abstract
   * @param {import("../extent.js").Extent} extent Extent.
   * @return {boolean} `true` if the geometry and the extent intersect.
   */
  intersectsExtent(t) {
    return W();
  }
  /**
   * Translate the geometry.  This modifies the geometry coordinates in place.  If
   * instead you want a new geometry, first `clone()` this geometry.
   * @abstract
   * @param {number} deltaX Delta X.
   * @param {number} deltaY Delta Y.
   * @api
   */
  translate(t, e) {
    W();
  }
  /**
   * Transform each coordinate of the geometry from one coordinate reference
   * system to another. The geometry is modified in place.
   * For example, a line will be transformed to a line and a circle to a circle.
   * If you do not want the geometry modified in place, first `clone()` it and
   * then use this function on the clone.
   *
   * @param {import("../proj.js").ProjectionLike} source The current projection.  Can be a
   *     string identifier or a {@link module:ol/proj/Projection~Projection} object.
   * @param {import("../proj.js").ProjectionLike} destination The desired projection.  Can be a
   *     string identifier or a {@link module:ol/proj/Projection~Projection} object.
   * @return {Geometry} This geometry.  Note that original geometry is
   *     modified in place.
   * @api
   */
  transform(t, e) {
    const i = It(t), n = i.getUnits() == "tile-pixels" ? function(r, o, a) {
      const l = i.getExtent(), h = i.getWorldExtent(), c = Ot(h) / Ot(l);
      return se(
        tr,
        h[0],
        h[3],
        c,
        -c,
        0,
        0,
        0
      ), me(
        r,
        0,
        r.length,
        a,
        tr,
        o
      ), $i(i, e)(
        r,
        o,
        a
      );
    } : $i(i, e);
    return this.applyTransform(n), this;
  }
}
const hl = ll;
class cl extends hl {
  constructor() {
    super(), this.layout = "XY", this.stride = 2, this.flatCoordinates = null;
  }
  /**
   * @param {import("../extent.js").Extent} extent Extent.
   * @protected
   * @return {import("../extent.js").Extent} extent Extent.
   */
  computeExtent(t) {
    return ma(
      this.flatCoordinates,
      0,
      this.flatCoordinates.length,
      this.stride,
      t
    );
  }
  /**
   * @abstract
   * @return {Array<*> | null} Coordinates.
   */
  getCoordinates() {
    return W();
  }
  /**
   * Return the first coordinate of the geometry.
   * @return {import("../coordinate.js").Coordinate} First coordinate.
   * @api
   */
  getFirstCoordinate() {
    return this.flatCoordinates.slice(0, this.stride);
  }
  /**
   * @return {Array<number>} Flat coordinates.
   */
  getFlatCoordinates() {
    return this.flatCoordinates;
  }
  /**
   * Return the last coordinate of the geometry.
   * @return {import("../coordinate.js").Coordinate} Last point.
   * @api
   */
  getLastCoordinate() {
    return this.flatCoordinates.slice(
      this.flatCoordinates.length - this.stride
    );
  }
  /**
   * Return the {@link import("./Geometry.js").GeometryLayout layout} of the geometry.
   * @return {import("./Geometry.js").GeometryLayout} Layout.
   * @api
   */
  getLayout() {
    return this.layout;
  }
  /**
   * Create a simplified version of this geometry using the Douglas Peucker algorithm.
   * @param {number} squaredTolerance Squared tolerance.
   * @return {SimpleGeometry} Simplified geometry.
   */
  getSimplifiedGeometry(t) {
    if (this.simplifiedGeometryRevision !== this.getRevision() && (this.simplifiedGeometryMaxMinSquaredTolerance = 0, this.simplifiedGeometryRevision = this.getRevision()), t < 0 || this.simplifiedGeometryMaxMinSquaredTolerance !== 0 && t <= this.simplifiedGeometryMaxMinSquaredTolerance)
      return this;
    const e = this.getSimplifiedGeometryInternal(t);
    return e.getFlatCoordinates().length < this.flatCoordinates.length ? e : (this.simplifiedGeometryMaxMinSquaredTolerance = t, this);
  }
  /**
   * @param {number} squaredTolerance Squared tolerance.
   * @return {SimpleGeometry} Simplified geometry.
   * @protected
   */
  getSimplifiedGeometryInternal(t) {
    return this;
  }
  /**
   * @return {number} Stride.
   */
  getStride() {
    return this.stride;
  }
  /**
   * @param {import("./Geometry.js").GeometryLayout} layout Layout.
   * @param {Array<number>} flatCoordinates Flat coordinates.
   */
  setFlatCoordinates(t, e) {
    this.stride = er(t), this.layout = t, this.flatCoordinates = e;
  }
  /**
   * @abstract
   * @param {!Array<*>} coordinates Coordinates.
   * @param {import("./Geometry.js").GeometryLayout} [layout] Layout.
   */
  setCoordinates(t, e) {
    W();
  }
  /**
   * @param {import("./Geometry.js").GeometryLayout|undefined} layout Layout.
   * @param {Array<*>} coordinates Coordinates.
   * @param {number} nesting Nesting.
   * @protected
   */
  setLayout(t, e, i) {
    let n;
    if (t)
      n = er(t);
    else {
      for (let r = 0; r < i; ++r) {
        if (e.length === 0) {
          this.layout = "XY", this.stride = 2;
          return;
        }
        e = /** @type {Array} */
        e[0];
      }
      n = e.length, t = ul(n);
    }
    this.layout = t, this.stride = n;
  }
  /**
   * Apply a transform function to the coordinates of the geometry.
   * The geometry is modified in place.
   * If you do not want the geometry modified in place, first `clone()` it and
   * then use this function on the clone.
   * @param {import("../proj.js").TransformFunction} transformFn Transform function.
   * Called with a flat array of geometry coordinates.
   * @api
   */
  applyTransform(t) {
    this.flatCoordinates && (t(this.flatCoordinates, this.flatCoordinates, this.stride), this.changed());
  }
  /**
   * Rotate the geometry around a given coordinate. This modifies the geometry
   * coordinates in place.
   * @param {number} angle Rotation angle in counter-clockwise radians.
   * @param {import("../coordinate.js").Coordinate} anchor The rotation center.
   * @api
   */
  rotate(t, e) {
    const i = this.getFlatCoordinates();
    if (i) {
      const n = this.getStride();
      io(
        i,
        0,
        i.length,
        n,
        t,
        e,
        i
      ), this.changed();
    }
  }
  /**
   * Scale the geometry (with an optional origin).  This modifies the geometry
   * coordinates in place.
   * @param {number} sx The scaling factor in the x-direction.
   * @param {number} [sy] The scaling factor in the y-direction (defaults to sx).
   * @param {import("../coordinate.js").Coordinate} [anchor] The scale origin (defaults to the center
   *     of the geometry extent).
   * @api
   */
  scale(t, e, i) {
    e === void 0 && (e = t), i || (i = Ye(this.getExtent()));
    const n = this.getFlatCoordinates();
    if (n) {
      const r = this.getStride();
      ol(
        n,
        0,
        n.length,
        r,
        t,
        e,
        i,
        n
      ), this.changed();
    }
  }
  /**
   * Translate the geometry.  This modifies the geometry coordinates in place.  If
   * instead you want a new geometry, first `clone()` this geometry.
   * @param {number} deltaX Delta X.
   * @param {number} deltaY Delta Y.
   * @api
   */
  translate(t, e) {
    const i = this.getFlatCoordinates();
    if (i) {
      const n = this.getStride();
      al(
        i,
        0,
        i.length,
        n,
        t,
        e,
        i
      ), this.changed();
    }
  }
}
function ul(s) {
  let t;
  return s == 2 ? t = "XY" : s == 3 ? t = "XYZ" : s == 4 && (t = "XYZM"), /** @type {import("./Geometry.js").GeometryLayout} */
  t;
}
function er(s) {
  let t;
  return s == "XY" ? t = 2 : s == "XYZ" || s == "XYM" ? t = 3 : s == "XYZM" && (t = 4), /** @type {number} */
  t;
}
function dl(s, t, e) {
  const i = s.getFlatCoordinates();
  if (!i)
    return null;
  const n = s.getStride();
  return me(
    i,
    0,
    i.length,
    n,
    t,
    e
  );
}
const gs = cl;
function ir(s, t, e, i, n, r, o) {
  const a = s[t], l = s[t + 1], h = s[e] - a, c = s[e + 1] - l;
  let u;
  if (h === 0 && c === 0)
    u = t;
  else {
    const d = ((n - a) * h + (r - l) * c) / (h * h + c * c);
    if (d > 1)
      u = e;
    else if (d > 0) {
      for (let f = 0; f < i; ++f)
        o[f] = Rt(
          s[t + f],
          s[e + f],
          d
        );
      o.length = i;
      return;
    } else
      u = t;
  }
  for (let d = 0; d < i; ++d)
    o[d] = s[u + d];
  o.length = i;
}
function no(s, t, e, i, n) {
  let r = s[t], o = s[t + 1];
  for (t += i; t < e; t += i) {
    const a = s[t], l = s[t + 1], h = ke(r, o, a, l);
    h > n && (n = h), r = a, o = l;
  }
  return n;
}
function fl(s, t, e, i, n) {
  for (let r = 0, o = e.length; r < o; ++r) {
    const a = e[r];
    n = no(s, t, a, i, n), t = a;
  }
  return n;
}
function so(s, t, e, i, n, r, o, a, l, h, c) {
  if (t == e)
    return h;
  let u, d;
  if (n === 0) {
    if (d = ke(
      o,
      a,
      s[t],
      s[t + 1]
    ), d < h) {
      for (u = 0; u < i; ++u)
        l[u] = s[t + u];
      return l.length = i, d;
    }
    return h;
  }
  c = c || [NaN, NaN];
  let f = t + i;
  for (; f < e; )
    if (ir(
      s,
      f - i,
      f,
      i,
      o,
      a,
      c
    ), d = ke(o, a, c[0], c[1]), d < h) {
      for (h = d, u = 0; u < i; ++u)
        l[u] = c[u];
      l.length = i, f += i;
    } else
      f += i * Math.max(
        (Math.sqrt(d) - Math.sqrt(h)) / n | 0,
        1
      );
  if (r && (ir(
    s,
    e - i,
    t,
    i,
    o,
    a,
    c
  ), d = ke(o, a, c[0], c[1]), d < h)) {
    for (h = d, u = 0; u < i; ++u)
      l[u] = c[u];
    l.length = i;
  }
  return h;
}
function gl(s, t, e, i, n, r, o, a, l, h, c) {
  c = c || [NaN, NaN];
  for (let u = 0, d = e.length; u < d; ++u) {
    const f = e[u];
    h = so(
      s,
      t,
      f,
      i,
      n,
      r,
      o,
      a,
      l,
      h,
      c
    ), t = f;
  }
  return h;
}
function _l(s, t, e, i) {
  for (let n = 0, r = e.length; n < r; ++n)
    s[t++] = e[n];
  return t;
}
function ro(s, t, e, i) {
  for (let n = 0, r = e.length; n < r; ++n) {
    const o = e[n];
    for (let a = 0; a < i; ++a)
      s[t++] = o[a];
  }
  return t;
}
function ml(s, t, e, i, n) {
  n = n || [];
  let r = 0;
  for (let o = 0, a = e.length; o < a; ++o) {
    const l = ro(
      s,
      t,
      e[o],
      i
    );
    n[r++] = l, t = l;
  }
  return n.length = r, n;
}
function pl(s, t, e, i, n, r, o) {
  const a = (e - t) / i;
  if (a < 3) {
    for (; t < e; t += i)
      r[o++] = s[t], r[o++] = s[t + 1];
    return o;
  }
  const l = new Array(a);
  l[0] = 1, l[a - 1] = 1;
  const h = [t, e - i];
  let c = 0;
  for (; h.length > 0; ) {
    const u = h.pop(), d = h.pop();
    let f = 0;
    const g = s[d], _ = s[d + 1], m = s[u], p = s[u + 1];
    for (let y = d + i; y < u; y += i) {
      const x = s[y], E = s[y + 1], C = Ta(x, E, g, _, m, p);
      C > f && (c = y, f = C);
    }
    f > n && (l[(c - t) / i] = 1, d + i < c && h.push(d, c), c + i < u && h.push(c, u));
  }
  for (let u = 0; u < a; ++u)
    l[u] && (r[o++] = s[t + u * i], r[o++] = s[t + u * i + 1]);
  return o;
}
function he(s, t) {
  return t * Math.round(s / t);
}
function yl(s, t, e, i, n, r, o) {
  if (t == e)
    return o;
  let a = he(s[t], n), l = he(s[t + 1], n);
  t += i, r[o++] = a, r[o++] = l;
  let h, c;
  do
    if (h = he(s[t], n), c = he(s[t + 1], n), t += i, t == e)
      return r[o++] = h, r[o++] = c, o;
  while (h == a && c == l);
  for (; t < e; ) {
    const u = he(s[t], n), d = he(s[t + 1], n);
    if (t += i, u == h && d == c)
      continue;
    const f = h - a, g = c - l, _ = u - a, m = d - l;
    if (f * m == g * _ && (f < 0 && _ < f || f == _ || f > 0 && _ > f) && (g < 0 && m < g || g == m || g > 0 && m > g)) {
      h = u, c = d;
      continue;
    }
    r[o++] = h, r[o++] = c, a = h, l = c, h = u, c = d;
  }
  return r[o++] = h, r[o++] = c, o;
}
function xl(s, t, e, i, n, r, o, a) {
  for (let l = 0, h = e.length; l < h; ++l) {
    const c = e[l];
    o = yl(
      s,
      t,
      c,
      i,
      n,
      r,
      o
    ), a.push(o), t = c;
  }
  return o;
}
function De(s, t, e, i, n) {
  n = n !== void 0 ? n : [];
  let r = 0;
  for (let o = t; o < e; o += i)
    n[r++] = s.slice(o, o + i);
  return n.length = r, n;
}
function qi(s, t, e, i, n) {
  n = n !== void 0 ? n : [];
  let r = 0;
  for (let o = 0, a = e.length; o < a; ++o) {
    const l = e[o];
    n[r++] = De(
      s,
      t,
      l,
      i,
      n[r]
    ), t = l;
  }
  return n.length = r, n;
}
function nr(s, t, e, i, n) {
  n = n !== void 0 ? n : [];
  let r = 0;
  for (let o = 0, a = e.length; o < a; ++o) {
    const l = e[o];
    n[r++] = l.length === 1 && l[0] === t ? [] : qi(
      s,
      t,
      l,
      i,
      n[r]
    ), t = l[l.length - 1];
  }
  return n.length = r, n;
}
function oo(s, t, e, i) {
  let n = 0, r = s[e - i], o = s[e - i + 1];
  for (; t < e; t += i) {
    const a = s[t], l = s[t + 1];
    n += o * a - r * l, r = a, o = l;
  }
  return n / 2;
}
function El(s, t, e, i) {
  let n = 0;
  for (let r = 0, o = e.length; r < o; ++r) {
    const a = e[r];
    n += oo(s, t, a, i), t = a;
  }
  return n;
}
class Ji extends gs {
  /**
   * @param {Array<import("../coordinate.js").Coordinate>|Array<number>} coordinates Coordinates.
   *     For internal use, flat coordinates in combination with `layout` are also accepted.
   * @param {import("./Geometry.js").GeometryLayout} [layout] Layout.
   */
  constructor(t, e) {
    super(), this.maxDelta_ = -1, this.maxDeltaRevision_ = -1, e !== void 0 && !Array.isArray(t[0]) ? this.setFlatCoordinates(
      e,
      /** @type {Array<number>} */
      t
    ) : this.setCoordinates(
      /** @type {Array<import("../coordinate.js").Coordinate>} */
      t,
      e
    );
  }
  /**
   * Make a complete copy of the geometry.
   * @return {!LinearRing} Clone.
   * @api
   */
  clone() {
    return new Ji(this.flatCoordinates.slice(), this.layout);
  }
  /**
   * @param {number} x X.
   * @param {number} y Y.
   * @param {import("../coordinate.js").Coordinate} closestPoint Closest point.
   * @param {number} minSquaredDistance Minimum squared distance.
   * @return {number} Minimum squared distance.
   */
  closestPointXY(t, e, i, n) {
    return n < Wr(this.getExtent(), t, e) ? n : (this.maxDeltaRevision_ != this.getRevision() && (this.maxDelta_ = Math.sqrt(
      no(
        this.flatCoordinates,
        0,
        this.flatCoordinates.length,
        this.stride,
        0
      )
    ), this.maxDeltaRevision_ = this.getRevision()), so(
      this.flatCoordinates,
      0,
      this.flatCoordinates.length,
      this.stride,
      this.maxDelta_,
      !0,
      t,
      e,
      i,
      n
    ));
  }
  /**
   * Return the area of the linear ring on projected plane.
   * @return {number} Area (on projected plane).
   * @api
   */
  getArea() {
    return oo(
      this.flatCoordinates,
      0,
      this.flatCoordinates.length,
      this.stride
    );
  }
  /**
   * Return the coordinates of the linear ring.
   * @return {Array<import("../coordinate.js").Coordinate>} Coordinates.
   * @api
   */
  getCoordinates() {
    return De(
      this.flatCoordinates,
      0,
      this.flatCoordinates.length,
      this.stride
    );
  }
  /**
   * @param {number} squaredTolerance Squared tolerance.
   * @return {LinearRing} Simplified LinearRing.
   * @protected
   */
  getSimplifiedGeometryInternal(t) {
    const e = [];
    return e.length = pl(
      this.flatCoordinates,
      0,
      this.flatCoordinates.length,
      this.stride,
      t,
      e,
      0
    ), new Ji(e, "XY");
  }
  /**
   * Get the type of this geometry.
   * @return {import("./Geometry.js").Type} Geometry type.
   * @api
   */
  getType() {
    return "LinearRing";
  }
  /**
   * Test if the geometry and the passed extent intersect.
   * @param {import("../extent.js").Extent} extent Extent.
   * @return {boolean} `true` if the geometry and the extent intersect.
   * @api
   */
  intersectsExtent(t) {
    return !1;
  }
  /**
   * Set the coordinates of the linear ring.
   * @param {!Array<import("../coordinate.js").Coordinate>} coordinates Coordinates.
   * @param {import("./Geometry.js").GeometryLayout} [layout] Layout.
   * @api
   */
  setCoordinates(t, e) {
    this.setLayout(e, t, 1), this.flatCoordinates || (this.flatCoordinates = []), this.flatCoordinates.length = ro(
      this.flatCoordinates,
      0,
      t,
      this.stride
    ), this.changed();
  }
}
const sr = Ji;
class _s extends gs {
  /**
   * @param {import("../coordinate.js").Coordinate} coordinates Coordinates.
   * @param {import("./Geometry.js").GeometryLayout} [layout] Layout.
   */
  constructor(t, e) {
    super(), this.setCoordinates(t, e);
  }
  /**
   * Make a complete copy of the geometry.
   * @return {!Point} Clone.
   * @api
   */
  clone() {
    const t = new _s(this.flatCoordinates.slice(), this.layout);
    return t.applyProperties(this), t;
  }
  /**
   * @param {number} x X.
   * @param {number} y Y.
   * @param {import("../coordinate.js").Coordinate} closestPoint Closest point.
   * @param {number} minSquaredDistance Minimum squared distance.
   * @return {number} Minimum squared distance.
   */
  closestPointXY(t, e, i, n) {
    const r = this.flatCoordinates, o = ke(
      t,
      e,
      r[0],
      r[1]
    );
    if (o < n) {
      const a = this.stride;
      for (let l = 0; l < a; ++l)
        i[l] = r[l];
      return i.length = a, o;
    }
    return n;
  }
  /**
   * Return the coordinate of the point.
   * @return {import("../coordinate.js").Coordinate} Coordinates.
   * @api
   */
  getCoordinates() {
    return this.flatCoordinates ? this.flatCoordinates.slice() : [];
  }
  /**
   * @param {import("../extent.js").Extent} extent Extent.
   * @protected
   * @return {import("../extent.js").Extent} extent Extent.
   */
  computeExtent(t) {
    return _a(this.flatCoordinates, t);
  }
  /**
   * Get the type of this geometry.
   * @return {import("./Geometry.js").Type} Geometry type.
   * @api
   */
  getType() {
    return "Point";
  }
  /**
   * Test if the geometry and the passed extent intersect.
   * @param {import("../extent.js").Extent} extent Extent.
   * @return {boolean} `true` if the geometry and the extent intersect.
   * @api
   */
  intersectsExtent(t) {
    return zr(t, this.flatCoordinates[0], this.flatCoordinates[1]);
  }
  /**
   * @param {!Array<*>} coordinates Coordinates.
   * @param {import("./Geometry.js").GeometryLayout} [layout] Layout.
   * @api
   */
  setCoordinates(t, e) {
    this.setLayout(e, t, 0), this.flatCoordinates || (this.flatCoordinates = []), this.flatCoordinates.length = _l(
      this.flatCoordinates,
      0,
      t,
      this.stride
    ), this.changed();
  }
}
const ao = _s;
function Cl(s, t, e, i, n) {
  return !Br(
    n,
    /**
     * @param {import("../../coordinate.js").Coordinate} coordinate Coordinate.
     * @return {boolean} Contains (x, y).
     */
    function(o) {
      return !de(
        s,
        t,
        e,
        i,
        o[0],
        o[1]
      );
    }
  );
}
function de(s, t, e, i, n, r) {
  let o = 0, a = s[e - i], l = s[e - i + 1];
  for (; t < e; t += i) {
    const h = s[t], c = s[t + 1];
    l <= r ? c > r && (h - a) * (r - l) - (n - a) * (c - l) > 0 && o++ : c <= r && (h - a) * (r - l) - (n - a) * (c - l) < 0 && o--, a = h, l = c;
  }
  return o !== 0;
}
function lo(s, t, e, i, n, r) {
  if (e.length === 0 || !de(s, t, e[0], i, n, r))
    return !1;
  for (let o = 1, a = e.length; o < a; ++o)
    if (de(s, e[o - 1], e[o], i, n, r))
      return !1;
  return !0;
}
function Rl(s, t, e, i, n, r, o) {
  let a, l, h, c, u, d, f;
  const g = n[r + 1], _ = [];
  for (let y = 0, x = e.length; y < x; ++y) {
    const E = e[y];
    for (c = s[E - i], d = s[E - i + 1], a = t; a < E; a += i)
      u = s[a], f = s[a + 1], (g <= d && f <= g || d <= g && g <= f) && (h = (g - d) / (f - d) * (u - c) + c, _.push(h)), c = u, d = f;
  }
  let m = NaN, p = -1 / 0;
  for (_.sort(We), c = _[0], a = 1, l = _.length; a < l; ++a) {
    u = _[a];
    const y = Math.abs(u - c);
    y > p && (h = (c + u) / 2, lo(s, t, e, i, h, g) && (m = h, p = y)), c = u;
  }
  return isNaN(m) && (m = n[r]), o ? (o.push(m, g, p), o) : [m, g, p];
}
function Tl(s, t, e, i, n) {
  let r;
  for (t += i; t < e; t += i)
    if (r = n(
      s.slice(t - i, t),
      s.slice(t, t + i)
    ), r)
      return r;
  return !1;
}
function ho(s, t, e, i, n) {
  const r = Yr(
    Tt(),
    s,
    t,
    e,
    i
  );
  return at(n, r) ? ce(n, r) || r[0] >= n[0] && r[2] <= n[2] || r[1] >= n[1] && r[3] <= n[3] ? !0 : Tl(
    s,
    t,
    e,
    i,
    /**
     * @param {import("../../coordinate.js").Coordinate} point1 Start point.
     * @param {import("../../coordinate.js").Coordinate} point2 End point.
     * @return {boolean} `true` if the segment and the extent intersect,
     *     `false` otherwise.
     */
    function(o, a) {
      return Ca(n, o, a);
    }
  ) : !1;
}
function co(s, t, e, i, n) {
  return !!(ho(s, t, e, i, n) || de(
    s,
    t,
    e,
    i,
    n[0],
    n[1]
  ) || de(
    s,
    t,
    e,
    i,
    n[0],
    n[3]
  ) || de(
    s,
    t,
    e,
    i,
    n[2],
    n[1]
  ) || de(
    s,
    t,
    e,
    i,
    n[2],
    n[3]
  ));
}
function Il(s, t, e, i, n) {
  if (!co(s, t, e[0], i, n))
    return !1;
  if (e.length === 1)
    return !0;
  for (let r = 1, o = e.length; r < o; ++r)
    if (Cl(
      s,
      e[r - 1],
      e[r],
      i,
      n
    ) && !ho(
      s,
      e[r - 1],
      e[r],
      i,
      n
    ))
      return !1;
  return !0;
}
function Sl(s, t, e, i) {
  for (; t < e - i; ) {
    for (let n = 0; n < i; ++n) {
      const r = s[t + n];
      s[t + n] = s[e - i + n], s[e - i + n] = r;
    }
    t += i, e -= i;
  }
}
function uo(s, t, e, i) {
  let n = 0, r = s[e - i], o = s[e - i + 1];
  for (; t < e; t += i) {
    const a = s[t], l = s[t + 1];
    n += (a - r) * (l + o), r = a, o = l;
  }
  return n === 0 ? void 0 : n > 0;
}
function vl(s, t, e, i, n) {
  n = n !== void 0 ? n : !1;
  for (let r = 0, o = e.length; r < o; ++r) {
    const a = e[r], l = uo(
      s,
      t,
      a,
      i
    );
    if (r === 0) {
      if (n && l || !n && !l)
        return !1;
    } else if (n && !l || !n && l)
      return !1;
    t = a;
  }
  return !0;
}
function rr(s, t, e, i, n) {
  n = n !== void 0 ? n : !1;
  for (let r = 0, o = e.length; r < o; ++r) {
    const a = e[r], l = uo(
      s,
      t,
      a,
      i
    );
    (r === 0 ? n && l || !n && !l : n && !l || !n && l) && Sl(s, t, a, i), t = a;
  }
  return t;
}
class ai extends gs {
  /**
   * @param {!Array<Array<import("../coordinate.js").Coordinate>>|!Array<number>} coordinates
   *     Array of linear rings that define the polygon. The first linear ring of the
   *     array defines the outer-boundary or surface of the polygon. Each subsequent
   *     linear ring defines a hole in the surface of the polygon. A linear ring is
   *     an array of vertices' coordinates where the first coordinate and the last are
   *     equivalent. (For internal use, flat coordinates in combination with
   *     `layout` and `ends` are also accepted.)
   * @param {import("./Geometry.js").GeometryLayout} [layout] Layout.
   * @param {Array<number>} [ends] Ends (for internal use with flat coordinates).
   */
  constructor(t, e, i) {
    super(), this.ends_ = [], this.flatInteriorPointRevision_ = -1, this.flatInteriorPoint_ = null, this.maxDelta_ = -1, this.maxDeltaRevision_ = -1, this.orientedRevision_ = -1, this.orientedFlatCoordinates_ = null, e !== void 0 && i ? (this.setFlatCoordinates(
      e,
      /** @type {Array<number>} */
      t
    ), this.ends_ = i) : this.setCoordinates(
      /** @type {Array<Array<import("../coordinate.js").Coordinate>>} */
      t,
      e
    );
  }
  /**
   * Append the passed linear ring to this polygon.
   * @param {LinearRing} linearRing Linear ring.
   * @api
   */
  appendLinearRing(t) {
    this.flatCoordinates ? br(this.flatCoordinates, t.getFlatCoordinates()) : this.flatCoordinates = t.getFlatCoordinates().slice(), this.ends_.push(this.flatCoordinates.length), this.changed();
  }
  /**
   * Make a complete copy of the geometry.
   * @return {!Polygon} Clone.
   * @api
   */
  clone() {
    const t = new ai(
      this.flatCoordinates.slice(),
      this.layout,
      this.ends_.slice()
    );
    return t.applyProperties(this), t;
  }
  /**
   * @param {number} x X.
   * @param {number} y Y.
   * @param {import("../coordinate.js").Coordinate} closestPoint Closest point.
   * @param {number} minSquaredDistance Minimum squared distance.
   * @return {number} Minimum squared distance.
   */
  closestPointXY(t, e, i, n) {
    return n < Wr(this.getExtent(), t, e) ? n : (this.maxDeltaRevision_ != this.getRevision() && (this.maxDelta_ = Math.sqrt(
      fl(
        this.flatCoordinates,
        0,
        this.ends_,
        this.stride,
        0
      )
    ), this.maxDeltaRevision_ = this.getRevision()), gl(
      this.flatCoordinates,
      0,
      this.ends_,
      this.stride,
      this.maxDelta_,
      !0,
      t,
      e,
      i,
      n
    ));
  }
  /**
   * @param {number} x X.
   * @param {number} y Y.
   * @return {boolean} Contains (x, y).
   */
  containsXY(t, e) {
    return lo(
      this.getOrientedFlatCoordinates(),
      0,
      this.ends_,
      this.stride,
      t,
      e
    );
  }
  /**
   * Return the area of the polygon on projected plane.
   * @return {number} Area (on projected plane).
   * @api
   */
  getArea() {
    return El(
      this.getOrientedFlatCoordinates(),
      0,
      this.ends_,
      this.stride
    );
  }
  /**
   * Get the coordinate array for this geometry.  This array has the structure
   * of a GeoJSON coordinate array for polygons.
   *
   * @param {boolean} [right] Orient coordinates according to the right-hand
   *     rule (counter-clockwise for exterior and clockwise for interior rings).
   *     If `false`, coordinates will be oriented according to the left-hand rule
   *     (clockwise for exterior and counter-clockwise for interior rings).
   *     By default, coordinate orientation will depend on how the geometry was
   *     constructed.
   * @return {Array<Array<import("../coordinate.js").Coordinate>>} Coordinates.
   * @api
   */
  getCoordinates(t) {
    let e;
    return t !== void 0 ? (e = this.getOrientedFlatCoordinates().slice(), rr(e, 0, this.ends_, this.stride, t)) : e = this.flatCoordinates, qi(e, 0, this.ends_, this.stride);
  }
  /**
   * @return {Array<number>} Ends.
   */
  getEnds() {
    return this.ends_;
  }
  /**
   * @return {Array<number>} Interior point.
   */
  getFlatInteriorPoint() {
    if (this.flatInteriorPointRevision_ != this.getRevision()) {
      const t = Ye(this.getExtent());
      this.flatInteriorPoint_ = Rl(
        this.getOrientedFlatCoordinates(),
        0,
        this.ends_,
        this.stride,
        t,
        0
      ), this.flatInteriorPointRevision_ = this.getRevision();
    }
    return this.flatInteriorPoint_;
  }
  /**
   * Return an interior point of the polygon.
   * @return {Point} Interior point as XYM coordinate, where M is the
   * length of the horizontal intersection that the point belongs to.
   * @api
   */
  getInteriorPoint() {
    return new ao(this.getFlatInteriorPoint(), "XYM");
  }
  /**
   * Return the number of rings of the polygon,  this includes the exterior
   * ring and any interior rings.
   *
   * @return {number} Number of rings.
   * @api
   */
  getLinearRingCount() {
    return this.ends_.length;
  }
  /**
   * Return the Nth linear ring of the polygon geometry. Return `null` if the
   * given index is out of range.
   * The exterior linear ring is available at index `0` and the interior rings
   * at index `1` and beyond.
   *
   * @param {number} index Index.
   * @return {LinearRing|null} Linear ring.
   * @api
   */
  getLinearRing(t) {
    return t < 0 || this.ends_.length <= t ? null : new sr(
      this.flatCoordinates.slice(
        t === 0 ? 0 : this.ends_[t - 1],
        this.ends_[t]
      ),
      this.layout
    );
  }
  /**
   * Return the linear rings of the polygon.
   * @return {Array<LinearRing>} Linear rings.
   * @api
   */
  getLinearRings() {
    const t = this.layout, e = this.flatCoordinates, i = this.ends_, n = [];
    let r = 0;
    for (let o = 0, a = i.length; o < a; ++o) {
      const l = i[o], h = new sr(
        e.slice(r, l),
        t
      );
      n.push(h), r = l;
    }
    return n;
  }
  /**
   * @return {Array<number>} Oriented flat coordinates.
   */
  getOrientedFlatCoordinates() {
    if (this.orientedRevision_ != this.getRevision()) {
      const t = this.flatCoordinates;
      vl(t, 0, this.ends_, this.stride) ? this.orientedFlatCoordinates_ = t : (this.orientedFlatCoordinates_ = t.slice(), this.orientedFlatCoordinates_.length = rr(
        this.orientedFlatCoordinates_,
        0,
        this.ends_,
        this.stride
      )), this.orientedRevision_ = this.getRevision();
    }
    return this.orientedFlatCoordinates_;
  }
  /**
   * @param {number} squaredTolerance Squared tolerance.
   * @return {Polygon} Simplified Polygon.
   * @protected
   */
  getSimplifiedGeometryInternal(t) {
    const e = [], i = [];
    return e.length = xl(
      this.flatCoordinates,
      0,
      this.ends_,
      this.stride,
      Math.sqrt(t),
      e,
      0,
      i
    ), new ai(e, "XY", i);
  }
  /**
   * Get the type of this geometry.
   * @return {import("./Geometry.js").Type} Geometry type.
   * @api
   */
  getType() {
    return "Polygon";
  }
  /**
   * Test if the geometry and the passed extent intersect.
   * @param {import("../extent.js").Extent} extent Extent.
   * @return {boolean} `true` if the geometry and the extent intersect.
   * @api
   */
  intersectsExtent(t) {
    return Il(
      this.getOrientedFlatCoordinates(),
      0,
      this.ends_,
      this.stride,
      t
    );
  }
  /**
   * Set the coordinates of the polygon.
   * @param {!Array<Array<import("../coordinate.js").Coordinate>>} coordinates Coordinates.
   * @param {import("./Geometry.js").GeometryLayout} [layout] Layout.
   * @api
   */
  setCoordinates(t, e) {
    this.setLayout(e, t, 2), this.flatCoordinates || (this.flatCoordinates = []);
    const i = ml(
      this.flatCoordinates,
      0,
      t,
      this.stride,
      this.ends_
    );
    this.flatCoordinates.length = i.length === 0 ? 0 : i[i.length - 1], this.changed();
  }
}
function or(s) {
  const t = s[0], e = s[1], i = s[2], n = s[3], r = [
    t,
    e,
    t,
    n,
    i,
    n,
    i,
    e,
    t,
    e
  ];
  return new ai(r, "XY", [r.length]);
}
const In = 0;
class wl extends St {
  /**
   * @param {ViewOptions} [options] View options.
   */
  constructor(t) {
    super(), this.on, this.once, this.un, t = Object.assign({}, t), this.hints_ = [0, 0], this.animations_ = [], this.updateAnimationKey_, this.projection_ = ls(t.projection, "EPSG:3857"), this.viewportSize_ = [100, 100], this.targetCenter_ = null, this.targetResolution_, this.targetRotation_, this.nextCenter_ = null, this.nextResolution_, this.nextRotation_, this.cancelAnchor_ = void 0, t.projection && Jr(), t.center && (t.center = Xt(t.center, this.projection_)), t.extent && (t.extent = ue(t.extent, this.projection_)), this.applyOptions_(t);
  }
  /**
   * Set up the view with the given options.
   * @param {ViewOptions} options View options.
   */
  applyOptions_(t) {
    const e = Object.assign({}, t);
    for (const a in Et)
      delete e[a];
    this.setProperties(e, !0);
    const i = Al(t);
    this.maxResolution_ = i.maxResolution, this.minResolution_ = i.minResolution, this.zoomFactor_ = i.zoomFactor, this.resolutions_ = t.resolutions, this.padding_ = t.padding, this.minZoom_ = i.minZoom;
    const n = Ll(t), r = i.constraint, o = Ml(t);
    this.constraints_ = {
      center: n,
      resolution: r,
      rotation: o
    }, this.setRotation(t.rotation !== void 0 ? t.rotation : 0), this.setCenterInternal(
      t.center !== void 0 ? t.center : null
    ), t.resolution !== void 0 ? this.setResolution(t.resolution) : t.zoom !== void 0 && this.setZoom(t.zoom);
  }
  /**
   * Padding (in css pixels).
   * If the map viewport is partially covered with other content (overlays) along
   * its edges, this setting allows to shift the center of the viewport away from that
   * content. The order of the values in the array is top, right, bottom, left.
   * The default is no padding, which is equivalent to `[0, 0, 0, 0]`.
   * @type {Array<number>|undefined}
   * @api
   */
  get padding() {
    return this.padding_;
  }
  set padding(t) {
    let e = this.padding_;
    this.padding_ = t;
    const i = this.getCenterInternal();
    if (i) {
      const n = t || [0, 0, 0, 0];
      e = e || [0, 0, 0, 0];
      const r = this.getResolution(), o = r / 2 * (n[3] - e[3] + e[1] - n[1]), a = r / 2 * (n[0] - e[0] + e[2] - n[2]);
      this.setCenterInternal([i[0] + o, i[1] - a]);
    }
  }
  /**
   * Get an updated version of the view options used to construct the view.  The
   * current resolution (or zoom), center, and rotation are applied to any stored
   * options.  The provided options can be used to apply new min/max zoom or
   * resolution limits.
   * @param {ViewOptions} newOptions New options to be applied.
   * @return {ViewOptions} New options updated with the current view state.
   */
  getUpdatedOptions_(t) {
    const e = this.getProperties();
    return e.resolution !== void 0 ? e.resolution = this.getResolution() : e.zoom = this.getZoom(), e.center = this.getCenterInternal(), e.rotation = this.getRotation(), Object.assign({}, e, t);
  }
  /**
   * Animate the view.  The view's center, zoom (or resolution), and rotation
   * can be animated for smooth transitions between view states.  For example,
   * to animate the view to a new zoom level:
   *
   *     view.animate({zoom: view.getZoom() + 1});
   *
   * By default, the animation lasts one second and uses in-and-out easing.  You
   * can customize this behavior by including `duration` (in milliseconds) and
   * `easing` options (see {@link module:ol/easing}).
   *
   * To chain together multiple animations, call the method with multiple
   * animation objects.  For example, to first zoom and then pan:
   *
   *     view.animate({zoom: 10}, {center: [0, 0]});
   *
   * If you provide a function as the last argument to the animate method, it
   * will get called at the end of an animation series.  The callback will be
   * called with `true` if the animation series completed on its own or `false`
   * if it was cancelled.
   *
   * Animations are cancelled by user interactions (e.g. dragging the map) or by
   * calling `view.setCenter()`, `view.setResolution()`, or `view.setRotation()`
   * (or another method that calls one of these).
   *
   * @param {...(AnimationOptions|function(boolean): void)} var_args Animation
   *     options.  Multiple animations can be run in series by passing multiple
   *     options objects.  To run multiple animations in parallel, call the method
   *     multiple times.  An optional callback can be provided as a final
   *     argument.  The callback will be called with a boolean indicating whether
   *     the animation completed without being cancelled.
   * @api
   */
  animate(t) {
    this.isDef() && !this.getAnimating() && this.resolveConstraints(0);
    const e = new Array(arguments.length);
    for (let i = 0; i < e.length; ++i) {
      let n = arguments[i];
      n.center && (n = Object.assign({}, n), n.center = Xt(
        n.center,
        this.getProjection()
      )), n.anchor && (n = Object.assign({}, n), n.anchor = Xt(
        n.anchor,
        this.getProjection()
      )), e[i] = n;
    }
    this.animateInternal.apply(this, e);
  }
  /**
   * @param {...(AnimationOptions|function(boolean): void)} var_args Animation options.
   */
  animateInternal(t) {
    let e = arguments.length, i;
    e > 1 && typeof arguments[e - 1] == "function" && (i = arguments[e - 1], --e);
    let n = 0;
    for (; n < e && !this.isDef(); ++n) {
      const c = arguments[n];
      c.center && this.setCenterInternal(c.center), c.zoom !== void 0 ? this.setZoom(c.zoom) : c.resolution && this.setResolution(c.resolution), c.rotation !== void 0 && this.setRotation(c.rotation);
    }
    if (n === e) {
      i && Di(i, !0);
      return;
    }
    let r = Date.now(), o = this.targetCenter_.slice(), a = this.targetResolution_, l = this.targetRotation_;
    const h = [];
    for (; n < e; ++n) {
      const c = (
        /** @type {AnimationOptions} */
        arguments[n]
      ), u = {
        start: r,
        complete: !1,
        anchor: c.anchor,
        duration: c.duration !== void 0 ? c.duration : 1e3,
        easing: c.easing || sl,
        callback: i
      };
      if (c.center && (u.sourceCenter = o, u.targetCenter = c.center.slice(), o = u.targetCenter), c.zoom !== void 0 ? (u.sourceResolution = a, u.targetResolution = this.getResolutionForZoom(c.zoom), a = u.targetResolution) : c.resolution && (u.sourceResolution = a, u.targetResolution = c.resolution, a = u.targetResolution), c.rotation !== void 0) {
        u.sourceRotation = l;
        const d = _e(c.rotation - l + Math.PI, 2 * Math.PI) - Math.PI;
        u.targetRotation = l + d, l = u.targetRotation;
      }
      Pl(u) ? u.complete = !0 : r += u.duration, h.push(u);
    }
    this.animations_.push(h), this.setHint(rt.ANIMATING, 1), this.updateAnimations_();
  }
  /**
   * Determine if the view is being animated.
   * @return {boolean} The view is being animated.
   * @api
   */
  getAnimating() {
    return this.hints_[rt.ANIMATING] > 0;
  }
  /**
   * Determine if the user is interacting with the view, such as panning or zooming.
   * @return {boolean} The view is being interacted with.
   * @api
   */
  getInteracting() {
    return this.hints_[rt.INTERACTING] > 0;
  }
  /**
   * Cancel any ongoing animations.
   * @api
   */
  cancelAnimations() {
    this.setHint(rt.ANIMATING, -this.hints_[rt.ANIMATING]);
    let t;
    for (let e = 0, i = this.animations_.length; e < i; ++e) {
      const n = this.animations_[e];
      if (n[0].callback && Di(n[0].callback, !1), !t)
        for (let r = 0, o = n.length; r < o; ++r) {
          const a = n[r];
          if (!a.complete) {
            t = a.anchor;
            break;
          }
        }
    }
    this.animations_.length = 0, this.cancelAnchor_ = t, this.nextCenter_ = null, this.nextResolution_ = NaN, this.nextRotation_ = NaN;
  }
  /**
   * Update all animations.
   */
  updateAnimations_() {
    if (this.updateAnimationKey_ !== void 0 && (cancelAnimationFrame(this.updateAnimationKey_), this.updateAnimationKey_ = void 0), !this.getAnimating())
      return;
    const t = Date.now();
    let e = !1;
    for (let i = this.animations_.length - 1; i >= 0; --i) {
      const n = this.animations_[i];
      let r = !0;
      for (let o = 0, a = n.length; o < a; ++o) {
        const l = n[o];
        if (l.complete)
          continue;
        const h = t - l.start;
        let c = l.duration > 0 ? h / l.duration : 1;
        c >= 1 ? (l.complete = !0, c = 1) : r = !1;
        const u = l.easing(c);
        if (l.sourceCenter) {
          const d = l.sourceCenter[0], f = l.sourceCenter[1], g = l.targetCenter[0], _ = l.targetCenter[1];
          this.nextCenter_ = l.targetCenter;
          const m = d + u * (g - d), p = f + u * (_ - f);
          this.targetCenter_ = [m, p];
        }
        if (l.sourceResolution && l.targetResolution) {
          const d = u === 1 ? l.targetResolution : l.sourceResolution + u * (l.targetResolution - l.sourceResolution);
          if (l.anchor) {
            const f = this.getViewportSize_(this.getRotation()), g = this.constraints_.resolution(
              d,
              0,
              f,
              !0
            );
            this.targetCenter_ = this.calculateCenterZoom(
              g,
              l.anchor
            );
          }
          this.nextResolution_ = l.targetResolution, this.targetResolution_ = d, this.applyTargetState_(!0);
        }
        if (l.sourceRotation !== void 0 && l.targetRotation !== void 0) {
          const d = u === 1 ? _e(l.targetRotation + Math.PI, 2 * Math.PI) - Math.PI : l.sourceRotation + u * (l.targetRotation - l.sourceRotation);
          if (l.anchor) {
            const f = this.constraints_.rotation(
              d,
              !0
            );
            this.targetCenter_ = this.calculateCenterRotate(
              f,
              l.anchor
            );
          }
          this.nextRotation_ = l.targetRotation, this.targetRotation_ = d;
        }
        if (this.applyTargetState_(!0), e = !0, !l.complete)
          break;
      }
      if (r) {
        this.animations_[i] = null, this.setHint(rt.ANIMATING, -1), this.nextCenter_ = null, this.nextResolution_ = NaN, this.nextRotation_ = NaN;
        const o = n[0].callback;
        o && Di(o, !0);
      }
    }
    this.animations_ = this.animations_.filter(Boolean), e && this.updateAnimationKey_ === void 0 && (this.updateAnimationKey_ = requestAnimationFrame(
      this.updateAnimations_.bind(this)
    ));
  }
  /**
   * @param {number} rotation Target rotation.
   * @param {import("./coordinate.js").Coordinate} anchor Rotation anchor.
   * @return {import("./coordinate.js").Coordinate|undefined} Center for rotation and anchor.
   */
  calculateCenterRotate(t, e) {
    let i;
    const n = this.getCenterInternal();
    return n !== void 0 && (i = [n[0] - e[0], n[1] - e[1]], os(i, t - this.getRotation()), Ba(i, e)), i;
  }
  /**
   * @param {number} resolution Target resolution.
   * @param {import("./coordinate.js").Coordinate} anchor Zoom anchor.
   * @return {import("./coordinate.js").Coordinate|undefined} Center for resolution and anchor.
   */
  calculateCenterZoom(t, e) {
    let i;
    const n = this.getCenterInternal(), r = this.getResolution();
    if (n !== void 0 && r !== void 0) {
      const o = e[0] - t * (e[0] - n[0]) / r, a = e[1] - t * (e[1] - n[1]) / r;
      i = [o, a];
    }
    return i;
  }
  /**
   * Returns the current viewport size.
   * @private
   * @param {number} [rotation] Take into account the rotation of the viewport when giving the size
   * @return {import("./size.js").Size} Viewport size or `[100, 100]` when no viewport is found.
   */
  getViewportSize_(t) {
    const e = this.viewportSize_;
    if (t) {
      const i = e[0], n = e[1];
      return [
        Math.abs(i * Math.cos(t)) + Math.abs(n * Math.sin(t)),
        Math.abs(i * Math.sin(t)) + Math.abs(n * Math.cos(t))
      ];
    }
    return e;
  }
  /**
   * Stores the viewport size on the view. The viewport size is not read every time from the DOM
   * to avoid performance hit and layout reflow.
   * This should be done on map size change.
   * Note: the constraints are not resolved during an animation to avoid stopping it
   * @param {import("./size.js").Size} [size] Viewport size; if undefined, [100, 100] is assumed
   */
  setViewportSize(t) {
    this.viewportSize_ = Array.isArray(t) ? t.slice() : [100, 100], this.getAnimating() || this.resolveConstraints(0);
  }
  /**
   * Get the view center.
   * @return {import("./coordinate.js").Coordinate|undefined} The center of the view.
   * @observable
   * @api
   */
  getCenter() {
    const t = this.getCenterInternal();
    return t && Kn(t, this.getProjection());
  }
  /**
   * Get the view center without transforming to user projection.
   * @return {import("./coordinate.js").Coordinate|undefined} The center of the view.
   */
  getCenterInternal() {
    return (
      /** @type {import("./coordinate.js").Coordinate|undefined} */
      this.get(Et.CENTER)
    );
  }
  /**
   * @return {Constraints} Constraints.
   */
  getConstraints() {
    return this.constraints_;
  }
  /**
   * @return {boolean} Resolution constraint is set
   */
  getConstrainResolution() {
    return this.get("constrainResolution");
  }
  /**
   * @param {Array<number>} [hints] Destination array.
   * @return {Array<number>} Hint.
   */
  getHints(t) {
    return t !== void 0 ? (t[0] = this.hints_[0], t[1] = this.hints_[1], t) : this.hints_.slice();
  }
  /**
   * Calculate the extent for the current view state and the passed size.
   * The size is the pixel dimensions of the box into which the calculated extent
   * should fit. In most cases you want to get the extent of the entire map,
   * that is `map.getSize()`.
   * @param {import("./size.js").Size} [size] Box pixel size. If not provided, the size
   * of the map that uses this view will be used.
   * @return {import("./extent.js").Extent} Extent.
   * @api
   */
  calculateExtent(t) {
    const e = this.calculateExtentInternal(t);
    return to(e, this.getProjection());
  }
  /**
   * @param {import("./size.js").Size} [size] Box pixel size. If not provided,
   * the map's last known viewport size will be used.
   * @return {import("./extent.js").Extent} Extent.
   */
  calculateExtentInternal(t) {
    t = t || this.getViewportSizeMinusPadding_();
    const e = (
      /** @type {!import("./coordinate.js").Coordinate} */
      this.getCenterInternal()
    );
    k(e, 1);
    const i = (
      /** @type {!number} */
      this.getResolution()
    );
    k(i !== void 0, 2);
    const n = (
      /** @type {!number} */
      this.getRotation()
    );
    return k(n !== void 0, 3), zn(e, i, n, t);
  }
  /**
   * Get the maximum resolution of the view.
   * @return {number} The maximum resolution of the view.
   * @api
   */
  getMaxResolution() {
    return this.maxResolution_;
  }
  /**
   * Get the minimum resolution of the view.
   * @return {number} The minimum resolution of the view.
   * @api
   */
  getMinResolution() {
    return this.minResolution_;
  }
  /**
   * Get the maximum zoom level for the view.
   * @return {number} The maximum zoom level.
   * @api
   */
  getMaxZoom() {
    return (
      /** @type {number} */
      this.getZoomForResolution(this.minResolution_)
    );
  }
  /**
   * Set a new maximum zoom level for the view.
   * @param {number} zoom The maximum zoom level.
   * @api
   */
  setMaxZoom(t) {
    this.applyOptions_(this.getUpdatedOptions_({ maxZoom: t }));
  }
  /**
   * Get the minimum zoom level for the view.
   * @return {number} The minimum zoom level.
   * @api
   */
  getMinZoom() {
    return (
      /** @type {number} */
      this.getZoomForResolution(this.maxResolution_)
    );
  }
  /**
   * Set a new minimum zoom level for the view.
   * @param {number} zoom The minimum zoom level.
   * @api
   */
  setMinZoom(t) {
    this.applyOptions_(this.getUpdatedOptions_({ minZoom: t }));
  }
  /**
   * Set whether the view should allow intermediary zoom levels.
   * @param {boolean} enabled Whether the resolution is constrained.
   * @api
   */
  setConstrainResolution(t) {
    this.applyOptions_(this.getUpdatedOptions_({ constrainResolution: t }));
  }
  /**
   * Get the view projection.
   * @return {import("./proj/Projection.js").default} The projection of the view.
   * @api
   */
  getProjection() {
    return this.projection_;
  }
  /**
   * Get the view resolution.
   * @return {number|undefined} The resolution of the view.
   * @observable
   * @api
   */
  getResolution() {
    return (
      /** @type {number|undefined} */
      this.get(Et.RESOLUTION)
    );
  }
  /**
   * Get the resolutions for the view. This returns the array of resolutions
   * passed to the constructor of the View, or undefined if none were given.
   * @return {Array<number>|undefined} The resolutions of the view.
   * @api
   */
  getResolutions() {
    return this.resolutions_;
  }
  /**
   * Get the resolution for a provided extent (in map units) and size (in pixels).
   * @param {import("./extent.js").Extent} extent Extent.
   * @param {import("./size.js").Size} [size] Box pixel size.
   * @return {number} The resolution at which the provided extent will render at
   *     the given size.
   * @api
   */
  getResolutionForExtent(t, e) {
    return this.getResolutionForExtentInternal(
      ue(t, this.getProjection()),
      e
    );
  }
  /**
   * Get the resolution for a provided extent (in map units) and size (in pixels).
   * @param {import("./extent.js").Extent} extent Extent.
   * @param {import("./size.js").Size} [size] Box pixel size.
   * @return {number} The resolution at which the provided extent will render at
   *     the given size.
   */
  getResolutionForExtentInternal(t, e) {
    e = e || this.getViewportSizeMinusPadding_();
    const i = V(t) / e[0], n = Ot(t) / e[1];
    return Math.max(i, n);
  }
  /**
   * Return a function that returns a value between 0 and 1 for a
   * resolution. Exponential scaling is assumed.
   * @param {number} [power] Power.
   * @return {function(number): number} Resolution for value function.
   */
  getResolutionForValueFunction(t) {
    t = t || 2;
    const e = this.getConstrainedResolution(this.maxResolution_), i = this.minResolution_, n = Math.log(e / i) / Math.log(t);
    return (
      /**
       * @param {number} value Value.
       * @return {number} Resolution.
       */
      function(r) {
        return e / Math.pow(t, r * n);
      }
    );
  }
  /**
   * Get the view rotation.
   * @return {number} The rotation of the view in radians.
   * @observable
   * @api
   */
  getRotation() {
    return (
      /** @type {number} */
      this.get(Et.ROTATION)
    );
  }
  /**
   * Return a function that returns a resolution for a value between
   * 0 and 1. Exponential scaling is assumed.
   * @param {number} [power] Power.
   * @return {function(number): number} Value for resolution function.
   */
  getValueForResolutionFunction(t) {
    const e = Math.log(t || 2), i = this.getConstrainedResolution(this.maxResolution_), n = this.minResolution_, r = Math.log(i / n) / e;
    return (
      /**
       * @param {number} resolution Resolution.
       * @return {number} Value.
       */
      function(o) {
        return Math.log(i / o) / e / r;
      }
    );
  }
  /**
   * Returns the size of the viewport minus padding.
   * @private
   * @param {number} [rotation] Take into account the rotation of the viewport when giving the size
   * @return {import("./size.js").Size} Viewport size reduced by the padding.
   */
  getViewportSizeMinusPadding_(t) {
    let e = this.getViewportSize_(t);
    const i = this.padding_;
    return i && (e = [
      e[0] - i[1] - i[3],
      e[1] - i[0] - i[2]
    ]), e;
  }
  /**
   * @return {State} View state.
   */
  getState() {
    const t = this.getProjection(), e = this.getResolution(), i = this.getRotation();
    let n = (
      /** @type {import("./coordinate.js").Coordinate} */
      this.getCenterInternal()
    );
    const r = this.padding_;
    if (r) {
      const o = this.getViewportSizeMinusPadding_();
      n = Sn(
        n,
        this.getViewportSize_(),
        [o[0] / 2 + r[3], o[1] / 2 + r[0]],
        e,
        i
      );
    }
    return {
      center: n.slice(0),
      projection: t !== void 0 ? t : null,
      resolution: e,
      nextCenter: this.nextCenter_,
      nextResolution: this.nextResolution_,
      nextRotation: this.nextRotation_,
      rotation: i,
      zoom: this.getZoom()
    };
  }
  /**
   * @return {ViewStateAndExtent} Like `FrameState`, but just `viewState` and `extent`.
   */
  getViewStateAndExtent() {
    return {
      viewState: this.getState(),
      extent: this.calculateExtent()
    };
  }
  /**
   * Get the current zoom level. This method may return non-integer zoom levels
   * if the view does not constrain the resolution, or if an interaction or
   * animation is underway.
   * @return {number|undefined} Zoom.
   * @api
   */
  getZoom() {
    let t;
    const e = this.getResolution();
    return e !== void 0 && (t = this.getZoomForResolution(e)), t;
  }
  /**
   * Get the zoom level for a resolution.
   * @param {number} resolution The resolution.
   * @return {number|undefined} The zoom level for the provided resolution.
   * @api
   */
  getZoomForResolution(t) {
    let e = this.minZoom_ || 0, i, n;
    if (this.resolutions_) {
      const r = Qn(this.resolutions_, t, 1);
      e = r, i = this.resolutions_[r], r == this.resolutions_.length - 1 ? n = 2 : n = i / this.resolutions_[r + 1];
    } else
      i = this.maxResolution_, n = this.zoomFactor_;
    return e + Math.log(i / t) / Math.log(n);
  }
  /**
   * Get the resolution for a zoom level.
   * @param {number} zoom Zoom level.
   * @return {number} The view resolution for the provided zoom level.
   * @api
   */
  getResolutionForZoom(t) {
    if (this.resolutions_) {
      if (this.resolutions_.length <= 1)
        return 0;
      const e = $(
        Math.floor(t),
        0,
        this.resolutions_.length - 2
      ), i = this.resolutions_[e] / this.resolutions_[e + 1];
      return this.resolutions_[e] / Math.pow(i, $(t - e, 0, 1));
    }
    return this.maxResolution_ / Math.pow(this.zoomFactor_, t - this.minZoom_);
  }
  /**
   * Fit the given geometry or extent based on the given map size and border.
   * The size is pixel dimensions of the box to fit the extent into.
   * In most cases you will want to use the map size, that is `map.getSize()`.
   * Takes care of the map angle.
   * @param {import("./geom/SimpleGeometry.js").default|import("./extent.js").Extent} geometryOrExtent The geometry or
   *     extent to fit the view to.
   * @param {FitOptions} [options] Options.
   * @api
   */
  fit(t, e) {
    let i;
    if (k(
      Array.isArray(t) || typeof /** @type {?} */
      t.getSimplifiedGeometry == "function",
      24
    ), Array.isArray(t)) {
      k(!ns(t), 25);
      const n = ue(t, this.getProjection());
      i = or(n);
    } else if (t.getType() === "Circle") {
      const n = ue(
        t.getExtent(),
        this.getProjection()
      );
      i = or(n), i.rotate(this.getRotation(), Ye(n));
    } else
      i = t;
    this.fitInternal(i, e);
  }
  /**
   * Calculate rotated extent
   * @param {import("./geom/SimpleGeometry.js").default} geometry The geometry.
   * @return {import("./extent").Extent} The rotated extent for the geometry.
   */
  rotatedExtentForGeometry(t) {
    const e = this.getRotation(), i = Math.cos(e), n = Math.sin(-e), r = t.getFlatCoordinates(), o = t.getStride();
    let a = 1 / 0, l = 1 / 0, h = -1 / 0, c = -1 / 0;
    for (let u = 0, d = r.length; u < d; u += o) {
      const f = r[u] * i - r[u + 1] * n, g = r[u] * n + r[u + 1] * i;
      a = Math.min(a, f), l = Math.min(l, g), h = Math.max(h, f), c = Math.max(c, g);
    }
    return [a, l, h, c];
  }
  /**
   * @param {import("./geom/SimpleGeometry.js").default} geometry The geometry.
   * @param {FitOptions} [options] Options.
   */
  fitInternal(t, e) {
    e = e || {};
    let i = e.size;
    i || (i = this.getViewportSizeMinusPadding_());
    const n = e.padding !== void 0 ? e.padding : [0, 0, 0, 0], r = e.nearest !== void 0 ? e.nearest : !1;
    let o;
    e.minResolution !== void 0 ? o = e.minResolution : e.maxZoom !== void 0 ? o = this.getResolutionForZoom(e.maxZoom) : o = 0;
    const a = this.rotatedExtentForGeometry(t);
    let l = this.getResolutionForExtentInternal(a, [
      i[0] - n[1] - n[3],
      i[1] - n[0] - n[2]
    ]);
    l = isNaN(l) ? o : Math.max(l, o), l = this.getConstrainedResolution(l, r ? 0 : 1);
    const h = this.getRotation(), c = Math.sin(h), u = Math.cos(h), d = Ye(a);
    d[0] += (n[1] - n[3]) / 2 * l, d[1] += (n[0] - n[2]) / 2 * l;
    const f = d[0] * u - d[1] * c, g = d[1] * u + d[0] * c, _ = this.getConstrainedCenter([f, g], l), m = e.callback ? e.callback : ze;
    e.duration !== void 0 ? this.animateInternal(
      {
        resolution: l,
        center: _,
        duration: e.duration,
        easing: e.easing
      },
      m
    ) : (this.targetResolution_ = l, this.targetCenter_ = _, this.applyTargetState_(!1, !0), Di(m, !0));
  }
  /**
   * Center on coordinate and view position.
   * @param {import("./coordinate.js").Coordinate} coordinate Coordinate.
   * @param {import("./size.js").Size} size Box pixel size.
   * @param {import("./pixel.js").Pixel} position Position on the view to center on.
   * @api
   */
  centerOn(t, e, i) {
    this.centerOnInternal(
      Xt(t, this.getProjection()),
      e,
      i
    );
  }
  /**
   * @param {import("./coordinate.js").Coordinate} coordinate Coordinate.
   * @param {import("./size.js").Size} size Box pixel size.
   * @param {import("./pixel.js").Pixel} position Position on the view to center on.
   */
  centerOnInternal(t, e, i) {
    this.setCenterInternal(
      Sn(
        t,
        e,
        i,
        this.getResolution(),
        this.getRotation()
      )
    );
  }
  /**
   * Calculates the shift between map and viewport center.
   * @param {import("./coordinate.js").Coordinate} center Center.
   * @param {number} resolution Resolution.
   * @param {number} rotation Rotation.
   * @param {import("./size.js").Size} size Size.
   * @return {Array<number>|undefined} Center shift.
   */
  calculateCenterShift(t, e, i, n) {
    let r;
    const o = this.padding_;
    if (o && t) {
      const a = this.getViewportSizeMinusPadding_(-i), l = Sn(
        t,
        n,
        [a[0] / 2 + o[3], a[1] / 2 + o[0]],
        e,
        i
      );
      r = [
        t[0] - l[0],
        t[1] - l[1]
      ];
    }
    return r;
  }
  /**
   * @return {boolean} Is defined.
   */
  isDef() {
    return !!this.getCenterInternal() && this.getResolution() !== void 0;
  }
  /**
   * Adds relative coordinates to the center of the view. Any extent constraint will apply.
   * @param {import("./coordinate.js").Coordinate} deltaCoordinates Relative value to add.
   * @api
   */
  adjustCenter(t) {
    const e = Kn(this.targetCenter_, this.getProjection());
    this.setCenter([
      e[0] + t[0],
      e[1] + t[1]
    ]);
  }
  /**
   * Adds relative coordinates to the center of the view. Any extent constraint will apply.
   * @param {import("./coordinate.js").Coordinate} deltaCoordinates Relative value to add.
   */
  adjustCenterInternal(t) {
    const e = this.targetCenter_;
    this.setCenterInternal([
      e[0] + t[0],
      e[1] + t[1]
    ]);
  }
  /**
   * Multiply the view resolution by a ratio, optionally using an anchor. Any resolution
   * constraint will apply.
   * @param {number} ratio The ratio to apply on the view resolution.
   * @param {import("./coordinate.js").Coordinate} [anchor] The origin of the transformation.
   * @api
   */
  adjustResolution(t, e) {
    e = e && Xt(e, this.getProjection()), this.adjustResolutionInternal(t, e);
  }
  /**
   * Multiply the view resolution by a ratio, optionally using an anchor. Any resolution
   * constraint will apply.
   * @param {number} ratio The ratio to apply on the view resolution.
   * @param {import("./coordinate.js").Coordinate} [anchor] The origin of the transformation.
   */
  adjustResolutionInternal(t, e) {
    const i = this.getAnimating() || this.getInteracting(), n = this.getViewportSize_(this.getRotation()), r = this.constraints_.resolution(
      this.targetResolution_ * t,
      0,
      n,
      i
    );
    e && (this.targetCenter_ = this.calculateCenterZoom(r, e)), this.targetResolution_ *= t, this.applyTargetState_();
  }
  /**
   * Adds a value to the view zoom level, optionally using an anchor. Any resolution
   * constraint will apply.
   * @param {number} delta Relative value to add to the zoom level.
   * @param {import("./coordinate.js").Coordinate} [anchor] The origin of the transformation.
   * @api
   */
  adjustZoom(t, e) {
    this.adjustResolution(Math.pow(this.zoomFactor_, -t), e);
  }
  /**
   * Adds a value to the view rotation, optionally using an anchor. Any rotation
   * constraint will apply.
   * @param {number} delta Relative value to add to the zoom rotation, in radians.
   * @param {import("./coordinate.js").Coordinate} [anchor] The rotation center.
   * @api
   */
  adjustRotation(t, e) {
    e && (e = Xt(e, this.getProjection())), this.adjustRotationInternal(t, e);
  }
  /**
   * @param {number} delta Relative value to add to the zoom rotation, in radians.
   * @param {import("./coordinate.js").Coordinate} [anchor] The rotation center.
   */
  adjustRotationInternal(t, e) {
    const i = this.getAnimating() || this.getInteracting(), n = this.constraints_.rotation(
      this.targetRotation_ + t,
      i
    );
    e && (this.targetCenter_ = this.calculateCenterRotate(n, e)), this.targetRotation_ += t, this.applyTargetState_();
  }
  /**
   * Set the center of the current view. Any extent constraint will apply.
   * @param {import("./coordinate.js").Coordinate|undefined} center The center of the view.
   * @observable
   * @api
   */
  setCenter(t) {
    this.setCenterInternal(
      t && Xt(t, this.getProjection())
    );
  }
  /**
   * Set the center using the view projection (not the user projection).
   * @param {import("./coordinate.js").Coordinate|undefined} center The center of the view.
   */
  setCenterInternal(t) {
    this.targetCenter_ = t, this.applyTargetState_();
  }
  /**
   * @param {import("./ViewHint.js").default} hint Hint.
   * @param {number} delta Delta.
   * @return {number} New value.
   */
  setHint(t, e) {
    return this.hints_[t] += e, this.changed(), this.hints_[t];
  }
  /**
   * Set the resolution for this view. Any resolution constraint will apply.
   * @param {number|undefined} resolution The resolution of the view.
   * @observable
   * @api
   */
  setResolution(t) {
    this.targetResolution_ = t, this.applyTargetState_();
  }
  /**
   * Set the rotation for this view. Any rotation constraint will apply.
   * @param {number} rotation The rotation of the view in radians.
   * @observable
   * @api
   */
  setRotation(t) {
    this.targetRotation_ = t, this.applyTargetState_();
  }
  /**
   * Zoom to a specific zoom level. Any resolution constrain will apply.
   * @param {number} zoom Zoom level.
   * @api
   */
  setZoom(t) {
    this.setResolution(this.getResolutionForZoom(t));
  }
  /**
   * Recompute rotation/resolution/center based on target values.
   * Note: we have to compute rotation first, then resolution and center considering that
   * parameters can influence one another in case a view extent constraint is present.
   * @param {boolean} [doNotCancelAnims] Do not cancel animations.
   * @param {boolean} [forceMoving] Apply constraints as if the view is moving.
   * @private
   */
  applyTargetState_(t, e) {
    const i = this.getAnimating() || this.getInteracting() || e, n = this.constraints_.rotation(
      this.targetRotation_,
      i
    ), r = this.getViewportSize_(n), o = this.constraints_.resolution(
      this.targetResolution_,
      0,
      r,
      i
    ), a = this.constraints_.center(
      this.targetCenter_,
      o,
      r,
      i,
      this.calculateCenterShift(
        this.targetCenter_,
        o,
        n,
        r
      )
    );
    this.get(Et.ROTATION) !== n && this.set(Et.ROTATION, n), this.get(Et.RESOLUTION) !== o && (this.set(Et.RESOLUTION, o), this.set("zoom", this.getZoom(), !0)), (!a || !this.get(Et.CENTER) || !Hi(this.get(Et.CENTER), a)) && this.set(Et.CENTER, a), this.getAnimating() && !t && this.cancelAnimations(), this.cancelAnchor_ = void 0;
  }
  /**
   * If any constraints need to be applied, an animation will be triggered.
   * This is typically done on interaction end.
   * Note: calling this with a duration of 0 will apply the constrained values straight away,
   * without animation.
   * @param {number} [duration] The animation duration in ms.
   * @param {number} [resolutionDirection] Which direction to zoom.
   * @param {import("./coordinate.js").Coordinate} [anchor] The origin of the transformation.
   */
  resolveConstraints(t, e, i) {
    t = t !== void 0 ? t : 200;
    const n = e || 0, r = this.constraints_.rotation(this.targetRotation_), o = this.getViewportSize_(r), a = this.constraints_.resolution(
      this.targetResolution_,
      n,
      o
    ), l = this.constraints_.center(
      this.targetCenter_,
      a,
      o,
      !1,
      this.calculateCenterShift(
        this.targetCenter_,
        a,
        r,
        o
      )
    );
    if (t === 0 && !this.cancelAnchor_) {
      this.targetResolution_ = a, this.targetRotation_ = r, this.targetCenter_ = l, this.applyTargetState_();
      return;
    }
    i = i || (t === 0 ? this.cancelAnchor_ : void 0), this.cancelAnchor_ = void 0, (this.getResolution() !== a || this.getRotation() !== r || !this.getCenterInternal() || !Hi(this.getCenterInternal(), l)) && (this.getAnimating() && this.cancelAnimations(), this.animateInternal({
      rotation: r,
      center: l,
      resolution: a,
      duration: t,
      easing: Ze,
      anchor: i
    }));
  }
  /**
   * Notify the View that an interaction has started.
   * The view state will be resolved to a stable one if needed
   * (depending on its constraints).
   * @api
   */
  beginInteraction() {
    this.resolveConstraints(0), this.setHint(rt.INTERACTING, 1);
  }
  /**
   * Notify the View that an interaction has ended. The view state will be resolved
   * to a stable one if needed (depending on its constraints).
   * @param {number} [duration] Animation duration in ms.
   * @param {number} [resolutionDirection] Which direction to zoom.
   * @param {import("./coordinate.js").Coordinate} [anchor] The origin of the transformation.
   * @api
   */
  endInteraction(t, e, i) {
    i = i && Xt(i, this.getProjection()), this.endInteractionInternal(t, e, i);
  }
  /**
   * Notify the View that an interaction has ended. The view state will be resolved
   * to a stable one if needed (depending on its constraints).
   * @param {number} [duration] Animation duration in ms.
   * @param {number} [resolutionDirection] Which direction to zoom.
   * @param {import("./coordinate.js").Coordinate} [anchor] The origin of the transformation.
   */
  endInteractionInternal(t, e, i) {
    this.getInteracting() && (this.setHint(rt.INTERACTING, -1), this.resolveConstraints(t, e, i));
  }
  /**
   * Get a valid position for the view center according to the current constraints.
   * @param {import("./coordinate.js").Coordinate|undefined} targetCenter Target center position.
   * @param {number} [targetResolution] Target resolution. If not supplied, the current one will be used.
   * This is useful to guess a valid center position at a different zoom level.
   * @return {import("./coordinate.js").Coordinate|undefined} Valid center position.
   */
  getConstrainedCenter(t, e) {
    const i = this.getViewportSize_(this.getRotation());
    return this.constraints_.center(
      t,
      e || this.getResolution(),
      i
    );
  }
  /**
   * Get a valid zoom level according to the current view constraints.
   * @param {number|undefined} targetZoom Target zoom.
   * @param {number} [direction=0] Indicate which resolution should be used
   * by a renderer if the view resolution does not match any resolution of the tile source.
   * If 0, the nearest resolution will be used. If 1, the nearest lower resolution
   * will be used. If -1, the nearest higher resolution will be used.
   * @return {number|undefined} Valid zoom level.
   */
  getConstrainedZoom(t, e) {
    const i = this.getResolutionForZoom(t);
    return this.getZoomForResolution(
      this.getConstrainedResolution(i, e)
    );
  }
  /**
   * Get a valid resolution according to the current view constraints.
   * @param {number|undefined} targetResolution Target resolution.
   * @param {number} [direction=0] Indicate which resolution should be used
   * by a renderer if the view resolution does not match any resolution of the tile source.
   * If 0, the nearest resolution will be used. If 1, the nearest lower resolution
   * will be used. If -1, the nearest higher resolution will be used.
   * @return {number|undefined} Valid resolution.
   */
  getConstrainedResolution(t, e) {
    e = e || 0;
    const i = this.getViewportSize_(this.getRotation());
    return this.constraints_.resolution(t, e, i);
  }
}
function Di(s, t) {
  setTimeout(function() {
    s(t);
  }, 0);
}
function Ll(s) {
  if (s.extent !== void 0) {
    const e = s.smoothExtentConstraint !== void 0 ? s.smoothExtentConstraint : !0;
    return qs(s.extent, s.constrainOnlyCenter, e);
  }
  const t = ls(s.projection, "EPSG:3857");
  if (s.multiWorld !== !0 && t.isGlobal()) {
    const e = t.getExtent().slice();
    return e[0] = -1 / 0, e[2] = 1 / 0, qs(e, !1, !1);
  }
  return Qa;
}
function Al(s) {
  let t, e, i, o = s.minZoom !== void 0 ? s.minZoom : In, a = s.maxZoom !== void 0 ? s.maxZoom : 28;
  const l = s.zoomFactor !== void 0 ? s.zoomFactor : 2, h = s.multiWorld !== void 0 ? s.multiWorld : !1, c = s.smoothResolutionConstraint !== void 0 ? s.smoothResolutionConstraint : !0, u = s.showFullExtent !== void 0 ? s.showFullExtent : !1, d = ls(s.projection, "EPSG:3857"), f = d.getExtent();
  let g = s.constrainOnlyCenter, _ = s.extent;
  if (!h && !_ && d.isGlobal() && (g = !1, _ = f), s.resolutions !== void 0) {
    const m = s.resolutions;
    e = m[o], i = m[a] !== void 0 ? m[a] : m[m.length - 1], s.constrainResolution ? t = tl(
      m,
      c,
      !g && _,
      u
    ) : t = Js(
      e,
      i,
      c,
      !g && _,
      u
    );
  } else {
    const p = (f ? Math.max(V(f), Ot(f)) : (
      // use an extent that can fit the whole world if need be
      360 * oi.degrees / d.getMetersPerUnit()
    )) / rs / Math.pow(2, In), y = p / Math.pow(2, 28 - In);
    e = s.maxResolution, e !== void 0 ? o = 0 : e = p / Math.pow(l, o), i = s.minResolution, i === void 0 && (s.maxZoom !== void 0 ? s.maxResolution !== void 0 ? i = e / Math.pow(l, a) : i = p / Math.pow(l, a) : i = y), a = o + Math.floor(
      Math.log(e / i) / Math.log(l)
    ), i = e / Math.pow(l, a - o), s.constrainResolution ? t = el(
      l,
      e,
      i,
      c,
      !g && _,
      u
    ) : t = Js(
      e,
      i,
      c,
      !g && _,
      u
    );
  }
  return {
    constraint: t,
    maxResolution: e,
    minResolution: i,
    minZoom: o,
    zoomFactor: l
  };
}
function Ml(s) {
  if (s.enableRotation !== void 0 ? s.enableRotation : !0) {
    const e = s.constrainRotation;
    return e === void 0 || e === !0 ? nl() : e === !1 ? Qs : typeof e == "number" ? il(e) : Qs;
  }
  return fs;
}
function Pl(s) {
  return !(s.sourceCenter && s.targetCenter && !Hi(s.sourceCenter, s.targetCenter) || s.sourceResolution !== s.targetResolution || s.sourceRotation !== s.targetRotation);
}
function Sn(s, t, e, i, n) {
  const r = Math.cos(-n);
  let o = Math.sin(-n), a = s[0] * r - s[1] * o, l = s[1] * r + s[0] * o;
  a += (t[0] / 2 - e[0]) * i, l += (e[1] - t[1] / 2) * i, o = -o;
  const h = a * r - l * o, c = l * r + a * o;
  return [h, c];
}
const wt = wl;
class Ol extends Vr {
  /**
   * @param {Options<SourceType>} options Layer options.
   */
  constructor(t) {
    const e = Object.assign({}, t);
    delete e.source, super(e), this.on, this.once, this.un, this.mapPrecomposeKey_ = null, this.mapRenderKey_ = null, this.sourceChangeKey_ = null, this.renderer_ = null, this.sourceReady_ = !1, this.rendered = !1, t.render && (this.render = t.render), t.map && this.setMap(t.map), this.addChangeListener(
      Z.SOURCE,
      this.handleSourcePropertyChange_
    );
    const i = t.source ? (
      /** @type {SourceType} */
      t.source
    ) : null;
    this.setSource(i);
  }
  /**
   * @param {Array<import("./Layer.js").default>} [array] Array of layers (to be modified in place).
   * @return {Array<import("./Layer.js").default>} Array of layers.
   */
  getLayersArray(t) {
    return t = t || [], t.push(this), t;
  }
  /**
   * @param {Array<import("./Layer.js").State>} [states] Optional list of layer states (to be modified in place).
   * @return {Array<import("./Layer.js").State>} List of layer states.
   */
  getLayerStatesArray(t) {
    return t = t || [], t.push(this.getLayerState()), t;
  }
  /**
   * Get the layer source.
   * @return {SourceType|null} The layer source (or `null` if not yet set).
   * @observable
   * @api
   */
  getSource() {
    return (
      /** @type {SourceType} */
      this.get(Z.SOURCE) || null
    );
  }
  /**
   * @return {SourceType|null} The source being rendered.
   */
  getRenderSource() {
    return this.getSource();
  }
  /**
   * @return {import("../source/Source.js").State} Source state.
   */
  getSourceState() {
    const t = this.getSource();
    return t ? t.getState() : "undefined";
  }
  /**
   * @private
   */
  handleSourceChange_() {
    this.changed(), !(this.sourceReady_ || this.getSource().getState() !== "ready") && (this.sourceReady_ = !0, this.dispatchEvent("sourceready"));
  }
  /**
   * @private
   */
  handleSourcePropertyChange_() {
    this.sourceChangeKey_ && (j(this.sourceChangeKey_), this.sourceChangeKey_ = null), this.sourceReady_ = !1;
    const t = this.getSource();
    t && (this.sourceChangeKey_ = G(
      t,
      F.CHANGE,
      this.handleSourceChange_,
      this
    ), t.getState() === "ready" && (this.sourceReady_ = !0, setTimeout(() => {
      this.dispatchEvent("sourceready");
    }, 0))), this.changed();
  }
  /**
   * @param {import("../pixel").Pixel} pixel Pixel.
   * @return {Promise<Array<import("../Feature").FeatureLike>>} Promise that resolves with
   * an array of features.
   */
  getFeatures(t) {
    return this.renderer_ ? this.renderer_.getFeatures(t) : Promise.resolve([]);
  }
  /**
   * @param {import("../pixel").Pixel} pixel Pixel.
   * @return {Uint8ClampedArray|Uint8Array|Float32Array|DataView|null} Pixel data.
   */
  getData(t) {
    return !this.renderer_ || !this.rendered ? null : this.renderer_.getData(t);
  }
  /**
   * The layer is visible in the given view, i.e. within its min/max resolution or zoom and
   * extent, and `getVisible()` is `true`.
   * @param {View|import("../View.js").ViewStateAndExtent} view View or {@link import("../Map.js").FrameState}.
   * @return {boolean} The layer is visible in the current view.
   * @api
   */
  isVisible(t) {
    let e;
    t instanceof wt ? e = {
      viewState: t.getState(),
      extent: t.calculateExtent()
    } : e = t;
    const i = this.getExtent();
    return this.getVisible() && ms(this.getLayerState(), e.viewState) && (!i || at(i, e.extent));
  }
  /**
   * Get the attributions of the source of this layer for the given view.
   * @param {View|import("../View.js").ViewStateAndExtent} view View or  {@link import("../Map.js").FrameState}.
   * @return {Array<string>} Attributions for this layer at the given view.
   * @api
   */
  getAttributions(t) {
    if (!this.isVisible(t))
      return [];
    let e;
    const i = this.getSource();
    if (i && (e = i.getAttributions()), !e)
      return [];
    const n = t instanceof wt ? t.getViewStateAndExtent() : t;
    let r = e(n);
    return Array.isArray(r) || (r = [r]), r;
  }
  /**
   * In charge to manage the rendering of the layer. One layer type is
   * bounded with one layer renderer.
   * @param {?import("../Map.js").FrameState} frameState Frame state.
   * @param {HTMLElement} target Target which the renderer may (but need not) use
   * for rendering its content.
   * @return {HTMLElement} The rendered element.
   */
  render(t, e) {
    const i = this.getRenderer();
    if (i.prepareFrame(t))
      return this.rendered = !0, i.renderFrame(t, e);
  }
  /**
   * Called when a layer is not visible during a map render.
   */
  unrender() {
    this.rendered = !1;
  }
  /**
   * For use inside the library only.
   * @param {import("../Map.js").default|null} map Map.
   */
  setMapInternal(t) {
    t || this.unrender(), this.set(Z.MAP, t);
  }
  /**
   * For use inside the library only.
   * @return {import("../Map.js").default|null} Map.
   */
  getMapInternal() {
    return this.get(Z.MAP);
  }
  /**
   * Sets the layer to be rendered on top of other layers on a map. The map will
   * not manage this layer in its layers collection. This
   * is useful for temporary layers. To remove an unmanaged layer from the map,
   * use `#setMap(null)`.
   *
   * To add the layer to a map and have it managed by the map, use
   * {@link module:ol/Map~Map#addLayer} instead.
   * @param {import("../Map.js").default|null} map Map.
   * @api
   */
  setMap(t) {
    this.mapPrecomposeKey_ && (j(this.mapPrecomposeKey_), this.mapPrecomposeKey_ = null), t || this.changed(), this.mapRenderKey_ && (j(this.mapRenderKey_), this.mapRenderKey_ = null), t && (this.mapPrecomposeKey_ = G(
      t,
      ie.PRECOMPOSE,
      function(e) {
        const n = /** @type {import("../render/Event.js").default} */ e.frameState.layerStatesArray, r = this.getLayerState(!1);
        k(
          !n.some(function(o) {
            return o.layer === r.layer;
          }),
          67
        ), n.push(r);
      },
      this
    ), this.mapRenderKey_ = G(this, F.CHANGE, t.render, t), this.changed());
  }
  /**
   * Set the layer source.
   * @param {SourceType|null} source The layer source.
   * @observable
   * @api
   */
  setSource(t) {
    this.set(Z.SOURCE, t);
  }
  /**
   * Get the renderer for this layer.
   * @return {RendererType|null} The layer renderer.
   */
  getRenderer() {
    return this.renderer_ || (this.renderer_ = this.createRenderer()), this.renderer_;
  }
  /**
   * @return {boolean} The layer has a renderer.
   */
  hasRenderer() {
    return !!this.renderer_;
  }
  /**
   * Create a renderer for this layer.
   * @return {RendererType} A layer renderer.
   * @protected
   */
  createRenderer() {
    return null;
  }
  /**
   * Clean up.
   */
  disposeInternal() {
    this.renderer_ && (this.renderer_.dispose(), delete this.renderer_), this.setSource(null), super.disposeInternal();
  }
}
function ms(s, t) {
  if (!s.visible)
    return !1;
  const e = t.resolution;
  if (e < s.minResolution || e >= s.maxResolution)
    return !1;
  const i = t.zoom;
  return i > s.minZoom && i <= s.maxZoom;
}
const gn = Ol;
class bl extends Jn {
  /**
   * @param {import("../Map.js").default} map Map.
   */
  constructor(t) {
    super(), this.map_ = t;
  }
  /**
   * @abstract
   * @param {import("../render/EventType.js").default} type Event type.
   * @param {import("../Map.js").FrameState} frameState Frame state.
   */
  dispatchRenderEvent(t, e) {
    W();
  }
  /**
   * @param {import("../Map.js").FrameState} frameState FrameState.
   * @protected
   */
  calculateMatrices2D(t) {
    const e = t.viewState, i = t.coordinateToPixelTransform, n = t.pixelToCoordinateTransform;
    se(
      i,
      t.size[0] / 2,
      t.size[1] / 2,
      1 / e.resolution,
      -1 / e.resolution,
      -e.rotation,
      -e.center[0],
      -e.center[1]
    ), es(n, i);
  }
  /**
   * @param {import("../coordinate.js").Coordinate} coordinate Coordinate.
   * @param {import("../Map.js").FrameState} frameState FrameState.
   * @param {number} hitTolerance Hit tolerance in pixels.
   * @param {boolean} checkWrapped Check for wrapped geometries.
   * @param {import("./vector.js").FeatureCallback<T>} callback Feature callback.
   * @param {S} thisArg Value to use as `this` when executing `callback`.
   * @param {function(this: U, import("../layer/Layer.js").default): boolean} layerFilter Layer filter
   *     function, only layers which are visible and for which this function
   *     returns `true` will be tested for features.  By default, all visible
   *     layers will be tested.
   * @param {U} thisArg2 Value to use as `this` when executing `layerFilter`.
   * @return {T|undefined} Callback result.
   * @template S,T,U
   */
  forEachFeatureAtCoordinate(t, e, i, n, r, o, a, l) {
    let h;
    const c = e.viewState;
    function u(E, C, T, v) {
      return r.call(o, C, E ? T : null, v);
    }
    const d = c.projection, f = Hr(t.slice(), d), g = [[0, 0]];
    if (d.canWrapX() && n) {
      const E = d.getExtent(), C = V(E);
      g.push([-C, 0], [C, 0]);
    }
    const _ = e.layerStatesArray, m = _.length, p = (
      /** @type {Array<HitMatch<T>>} */
      []
    ), y = [];
    for (let E = 0; E < g.length; E++)
      for (let C = m - 1; C >= 0; --C) {
        const T = _[C], v = T.layer;
        if (v.hasRenderer() && ms(T, c) && a.call(l, v)) {
          const S = v.getRenderer(), L = v.getSource();
          if (S && L) {
            const O = L.getWrapX() ? f : t, X = u.bind(
              null,
              T.managed
            );
            y[0] = O[0] + g[E][0], y[1] = O[1] + g[E][1], h = S.forEachFeatureAtCoordinate(
              y,
              e,
              i,
              X,
              p
            );
          }
          if (h)
            return h;
        }
      }
    if (p.length === 0)
      return;
    const x = 1 / p.length;
    return p.forEach((E, C) => E.distanceSq += C * x), p.sort((E, C) => E.distanceSq - C.distanceSq), p.some((E) => h = E.callback(E.feature, E.layer, E.geometry)), h;
  }
  /**
   * @param {import("../coordinate.js").Coordinate} coordinate Coordinate.
   * @param {import("../Map.js").FrameState} frameState FrameState.
   * @param {number} hitTolerance Hit tolerance in pixels.
   * @param {boolean} checkWrapped Check for wrapped geometries.
   * @param {function(this: U, import("../layer/Layer.js").default): boolean} layerFilter Layer filter
   *     function, only layers which are visible and for which this function
   *     returns `true` will be tested for features.  By default, all visible
   *     layers will be tested.
   * @param {U} thisArg Value to use as `this` when executing `layerFilter`.
   * @return {boolean} Is there a feature at the given coordinate?
   * @template U
   */
  hasFeatureAtCoordinate(t, e, i, n, r, o) {
    return this.forEachFeatureAtCoordinate(
      t,
      e,
      i,
      n,
      ni,
      this,
      r,
      o
    ) !== void 0;
  }
  /**
   * @return {import("../Map.js").default} Map.
   */
  getMap() {
    return this.map_;
  }
  /**
   * Render.
   * @abstract
   * @param {?import("../Map.js").FrameState} frameState Frame state.
   */
  renderFrame(t) {
    W();
  }
  /**
   * @param {import("../Map.js").FrameState} frameState Frame state.
   * @protected
   */
  scheduleExpireIconCache(t) {
    Vi.canExpireCache() && t.postRenderFunctions.push(Fl);
  }
}
function Fl(s, t) {
  Vi.expire();
}
const Dl = bl;
class kl extends Zt {
  /**
   * @param {import("./EventType.js").default} type Type.
   * @param {import("../transform.js").Transform} [inversePixelTransform] Transform for
   *     CSS pixels to rendered pixels.
   * @param {import("../Map.js").FrameState} [frameState] Frame state.
   * @param {?(CanvasRenderingContext2D|WebGLRenderingContext)} [context] Context.
   */
  constructor(t, e, i, n) {
    super(t), this.inversePixelTransform = e, this.frameState = i, this.context = n;
  }
}
const fo = kl, ki = "ol-hidden", Nl = "ol-selectable", _n = "ol-unselectable", ps = "ol-control", ar = "ol-collapsed", Gl = new RegExp(
  [
    "^\\s*(?=(?:(?:[-a-z]+\\s*){0,2}(italic|oblique))?)",
    "(?=(?:(?:[-a-z]+\\s*){0,2}(small-caps))?)",
    "(?=(?:(?:[-a-z]+\\s*){0,2}(bold(?:er)?|lighter|[1-9]00 ))?)",
    "(?:(?:normal|\\1|\\2|\\3)\\s*){0,3}((?:xx?-)?",
    "(?:small|large)|medium|smaller|larger|[\\.\\d]+(?:\\%|in|[cem]m|ex|p[ctx]))",
    "(?:\\s*\\/\\s*(normal|[\\.\\d]+(?:\\%|in|[cem]m|ex|p[ctx])?))",
    `?\\s*([-,\\"\\'\\sa-z]+?)\\s*$`
  ].join(""),
  "i"
), lr = [
  "style",
  "variant",
  "weight",
  "size",
  "lineHeight",
  "family"
], go = function(s) {
  const t = s.match(Gl);
  if (!t)
    return null;
  const e = (
    /** @type {FontParameters} */
    {
      lineHeight: "normal",
      size: "1.2em",
      style: "normal",
      weight: "normal",
      variant: "normal"
    }
  );
  for (let i = 0, n = lr.length; i < n; ++i) {
    const r = t[i + 1];
    r !== void 0 && (e[lr[i]] = r);
  }
  return e.families = e.family.split(/,\s?/), e;
};
function lt(s, t, e, i) {
  let n;
  return e && e.length ? n = e.shift() : ts ? n = new OffscreenCanvas(s || 300, t || 300) : n = document.createElement("canvas"), s && (n.width = s), t && (n.height = t), /** @type {CanvasRenderingContext2D} */
  n.getContext("2d", i);
}
function mn(s) {
  const t = s.canvas;
  t.width = 1, t.height = 1, s.clearRect(0, 0, 1, 1);
}
function Xl(s) {
  let t = s.offsetWidth;
  const e = getComputedStyle(s);
  return t += parseInt(e.marginLeft, 10) + parseInt(e.marginRight, 10), t;
}
function Wl(s) {
  let t = s.offsetHeight;
  const e = getComputedStyle(s);
  return t += parseInt(e.marginTop, 10) + parseInt(e.marginBottom, 10), t;
}
function hr(s, t) {
  const e = t.parentNode;
  e && e.replaceChild(s, t);
}
function Qi(s) {
  return s && s.parentNode ? s.parentNode.removeChild(s) : null;
}
function _o(s) {
  for (; s.lastChild; )
    s.removeChild(s.lastChild);
}
function zl(s, t) {
  const e = s.childNodes;
  for (let i = 0; ; ++i) {
    const n = e[i], r = t[i];
    if (!n && !r)
      break;
    if (n !== r) {
      if (!n) {
        s.appendChild(r);
        continue;
      }
      if (!r) {
        s.removeChild(n), --i;
        continue;
      }
      s.insertBefore(r, n);
    }
  }
}
const mo = "10px sans-serif", Yt = "#000", tn = "round", li = [], hi = 0, Be = "round", ci = 10, ui = "#000", di = "center", en = "middle", fe = [0, 0, 0, 0], fi = 1, Wt = new St();
let Me = null, Un;
const Vn = {}, Yl = function() {
  const t = "32px ", e = ["monospace", "serif"], i = e.length, n = "wmytzilWMYTZIL@#/&?$%10";
  let r, o;
  function a(h, c, u) {
    let d = !0;
    for (let f = 0; f < i; ++f) {
      const g = e[f];
      if (o = nn(
        h + " " + c + " " + t + g,
        n
      ), u != g) {
        const _ = nn(
          h + " " + c + " " + t + u + "," + g,
          n
        );
        d = d && _ != o;
      }
    }
    return !!d;
  }
  function l() {
    let h = !0;
    const c = Wt.getKeys();
    for (let u = 0, d = c.length; u < d; ++u) {
      const f = c[u];
      Wt.get(f) < 100 && (a.apply(this, f.split(`
`)) ? (mi(Vn), Me = null, Un = void 0, Wt.set(f, 100)) : (Wt.set(f, Wt.get(f) + 1, !0), h = !1));
    }
    h && (clearInterval(r), r = void 0);
  }
  return function(h) {
    const c = go(h);
    if (!c)
      return;
    const u = c.families;
    for (let d = 0, f = u.length; d < f; ++d) {
      const g = u[d], _ = c.style + `
` + c.weight + `
` + g;
      Wt.get(_) === void 0 && (Wt.set(_, 100, !0), a(c.style, c.weight, g) || (Wt.set(_, 0, !0), r === void 0 && (r = setInterval(l, 32))));
    }
  };
}(), Bl = function() {
  let s;
  return function(t) {
    let e = Vn[t];
    if (e == null) {
      if (ts) {
        const i = go(t), n = po(t, "Žg");
        e = (isNaN(Number(i.lineHeight)) ? 1.2 : Number(i.lineHeight)) * (n.actualBoundingBoxAscent + n.actualBoundingBoxDescent);
      } else
        s || (s = document.createElement("div"), s.innerHTML = "M", s.style.minHeight = "0", s.style.maxHeight = "none", s.style.height = "auto", s.style.padding = "0", s.style.border = "none", s.style.position = "absolute", s.style.display = "block", s.style.left = "-99999px"), s.style.font = t, document.body.appendChild(s), e = s.offsetHeight, document.body.removeChild(s);
      Vn[t] = e;
    }
    return e;
  };
}();
function po(s, t) {
  return Me || (Me = lt(1, 1)), s != Un && (Me.font = s, Un = Me.font), Me.measureText(t);
}
function nn(s, t) {
  return po(s, t).width;
}
function cr(s, t, e) {
  if (t in e)
    return e[t];
  const i = t.split(`
`).reduce((n, r) => Math.max(n, nn(s, r)), 0);
  return e[t] = i, i;
}
function Zl(s, t) {
  const e = [], i = [], n = [];
  let r = 0, o = 0, a = 0, l = 0;
  for (let h = 0, c = t.length; h <= c; h += 2) {
    const u = t[h];
    if (u === `
` || h === c) {
      r = Math.max(r, o), n.push(o), o = 0, a += l;
      continue;
    }
    const d = t[h + 1] || s.font, f = nn(d, u);
    e.push(f), o += f;
    const g = Bl(d);
    i.push(g), l = Math.max(l, g);
  }
  return { width: r, height: a, widths: e, heights: i, lineWidths: n };
}
function Kl(s, t, e, i, n, r, o, a, l, h, c) {
  s.save(), e !== 1 && (s.globalAlpha *= e), t && s.setTransform.apply(s, t), /** @type {*} */
  i.contextInstructions ? (s.translate(l, h), s.scale(c[0], c[1]), Ul(
    /** @type {Label} */
    i,
    s
  )) : c[0] < 0 || c[1] < 0 ? (s.translate(l, h), s.scale(c[0], c[1]), s.drawImage(
    /** @type {HTMLCanvasElement|HTMLImageElement|HTMLVideoElement} */
    i,
    n,
    r,
    o,
    a,
    0,
    0,
    o,
    a
  )) : s.drawImage(
    /** @type {HTMLCanvasElement|HTMLImageElement|HTMLVideoElement} */
    i,
    n,
    r,
    o,
    a,
    l,
    h,
    o * c[0],
    a * c[1]
  ), s.restore();
}
function Ul(s, t) {
  const e = s.contextInstructions;
  for (let i = 0, n = e.length; i < n; i += 2)
    Array.isArray(e[i + 1]) ? t[e[i]].apply(
      t,
      e[i + 1]
    ) : t[e[i]] = e[i + 1];
}
class Vl extends Dl {
  /**
   * @param {import("../Map.js").default} map Map.
   */
  constructor(t) {
    super(t), this.fontChangeListenerKey_ = G(
      Wt,
      Xe.PROPERTYCHANGE,
      t.redrawText.bind(t)
    ), this.element_ = document.createElement("div");
    const e = this.element_.style;
    e.position = "absolute", e.width = "100%", e.height = "100%", e.zIndex = "0", this.element_.className = _n + " ol-layers";
    const i = t.getViewport();
    i.insertBefore(this.element_, i.firstChild || null), this.children_ = [], this.renderedVisible_ = !0;
  }
  /**
   * @param {import("../render/EventType.js").default} type Event type.
   * @param {import("../Map.js").FrameState} frameState Frame state.
   */
  dispatchRenderEvent(t, e) {
    const i = this.getMap();
    if (i.hasListener(t)) {
      const n = new fo(t, void 0, e);
      i.dispatchEvent(n);
    }
  }
  disposeInternal() {
    j(this.fontChangeListenerKey_), this.element_.parentNode.removeChild(this.element_), super.disposeInternal();
  }
  /**
   * Render.
   * @param {?import("../Map.js").FrameState} frameState Frame state.
   */
  renderFrame(t) {
    if (!t) {
      this.renderedVisible_ && (this.element_.style.display = "none", this.renderedVisible_ = !1);
      return;
    }
    this.calculateMatrices2D(t), this.dispatchRenderEvent(ie.PRECOMPOSE, t);
    const e = t.layerStatesArray.sort(function(o, a) {
      return o.zIndex - a.zIndex;
    }), i = t.viewState;
    this.children_.length = 0;
    const n = [];
    let r = null;
    for (let o = 0, a = e.length; o < a; ++o) {
      const l = e[o];
      t.layerIndex = o;
      const h = l.layer, c = h.getSourceState();
      if (!ms(l, i) || c != "ready" && c != "undefined") {
        h.unrender();
        continue;
      }
      const u = h.render(t, r);
      u && (u !== r && (this.children_.push(u), r = u), "getDeclutter" in h && n.push(
        /** @type {import("../layer/BaseVector.js").default} */
        h
      ));
    }
    for (let o = n.length - 1; o >= 0; --o)
      n[o].renderDeclutter(t);
    zl(this.element_, this.children_), this.dispatchRenderEvent(ie.POSTCOMPOSE, t), this.renderedVisible_ || (this.element_.style.display = "", this.renderedVisible_ = !0), this.scheduleExpireIconCache(t);
  }
}
const jl = Vl;
class te extends Zt {
  /**
   * @param {EventType} type The event type.
   * @param {BaseLayer} layer The layer.
   */
  constructor(t, e) {
    super(t), this.layer = e;
  }
}
const vn = {
  LAYERS: "layers"
};
class ys extends Vr {
  /**
   * @param {Options} [options] Layer options.
   */
  constructor(t) {
    t = t || {};
    const e = (
      /** @type {Options} */
      Object.assign({}, t)
    );
    delete e.layers;
    let i = t.layers;
    super(e), this.on, this.once, this.un, this.layersListenerKeys_ = [], this.listenerKeys_ = {}, this.addChangeListener(vn.LAYERS, this.handleLayersChanged_), i ? Array.isArray(i) ? i = new At(i.slice(), { unique: !0 }) : k(typeof /** @type {?} */
    i.getArray == "function", 43) : i = new At(void 0, { unique: !0 }), this.setLayers(i);
  }
  /**
   * @private
   */
  handleLayerChange_() {
    this.changed();
  }
  /**
   * @private
   */
  handleLayersChanged_() {
    this.layersListenerKeys_.forEach(j), this.layersListenerKeys_.length = 0;
    const t = this.getLayers();
    this.layersListenerKeys_.push(
      G(t, ut.ADD, this.handleLayersAdd_, this),
      G(t, ut.REMOVE, this.handleLayersRemove_, this)
    );
    for (const i in this.listenerKeys_)
      this.listenerKeys_[i].forEach(j);
    mi(this.listenerKeys_);
    const e = t.getArray();
    for (let i = 0, n = e.length; i < n; i++) {
      const r = e[i];
      this.registerLayerListeners_(r), this.dispatchEvent(new te("addlayer", r));
    }
    this.changed();
  }
  /**
   * @param {BaseLayer} layer The layer.
   */
  registerLayerListeners_(t) {
    const e = [
      G(
        t,
        Xe.PROPERTYCHANGE,
        this.handleLayerChange_,
        this
      ),
      G(t, F.CHANGE, this.handleLayerChange_, this)
    ];
    t instanceof ys && e.push(
      G(t, "addlayer", this.handleLayerGroupAdd_, this),
      G(t, "removelayer", this.handleLayerGroupRemove_, this)
    ), this.listenerKeys_[z(t)] = e;
  }
  /**
   * @param {GroupEvent} event The layer group event.
   */
  handleLayerGroupAdd_(t) {
    this.dispatchEvent(new te("addlayer", t.layer));
  }
  /**
   * @param {GroupEvent} event The layer group event.
   */
  handleLayerGroupRemove_(t) {
    this.dispatchEvent(new te("removelayer", t.layer));
  }
  /**
   * @param {import("../Collection.js").CollectionEvent<import("./Base.js").default>} collectionEvent CollectionEvent.
   * @private
   */
  handleLayersAdd_(t) {
    const e = t.element;
    this.registerLayerListeners_(e), this.dispatchEvent(new te("addlayer", e)), this.changed();
  }
  /**
   * @param {import("../Collection.js").CollectionEvent<import("./Base.js").default>} collectionEvent CollectionEvent.
   * @private
   */
  handleLayersRemove_(t) {
    const e = t.element, i = z(e);
    this.listenerKeys_[i].forEach(j), delete this.listenerKeys_[i], this.dispatchEvent(new te("removelayer", e)), this.changed();
  }
  /**
   * Returns the {@link module:ol/Collection~Collection collection} of {@link module:ol/layer/Layer~Layer layers}
   * in this group.
   * @return {!Collection<import("./Base.js").default>} Collection of
   *   {@link module:ol/layer/Base~BaseLayer layers} that are part of this group.
   * @observable
   * @api
   */
  getLayers() {
    return (
      /** @type {!Collection<import("./Base.js").default>} */
      this.get(vn.LAYERS)
    );
  }
  /**
   * Set the {@link module:ol/Collection~Collection collection} of {@link module:ol/layer/Layer~Layer layers}
   * in this group.
   * @param {!Collection<import("./Base.js").default>} layers Collection of
   *   {@link module:ol/layer/Base~BaseLayer layers} that are part of this group.
   * @observable
   * @api
   */
  setLayers(t) {
    const e = this.getLayers();
    if (e) {
      const i = e.getArray();
      for (let n = 0, r = i.length; n < r; ++n)
        this.dispatchEvent(new te("removelayer", i[n]));
    }
    this.set(vn.LAYERS, t);
  }
  /**
   * @param {Array<import("./Layer.js").default>} [array] Array of layers (to be modified in place).
   * @return {Array<import("./Layer.js").default>} Array of layers.
   */
  getLayersArray(t) {
    return t = t !== void 0 ? t : [], this.getLayers().forEach(function(e) {
      e.getLayersArray(t);
    }), t;
  }
  /**
   * Get the layer states list and use this groups z-index as the default
   * for all layers in this and nested groups, if it is unset at this point.
   * If dest is not provided and this group's z-index is undefined
   * 0 is used a the default z-index.
   * @param {Array<import("./Layer.js").State>} [dest] Optional list
   * of layer states (to be modified in place).
   * @return {Array<import("./Layer.js").State>} List of layer states.
   */
  getLayerStatesArray(t) {
    const e = t !== void 0 ? t : [], i = e.length;
    this.getLayers().forEach(function(o) {
      o.getLayerStatesArray(e);
    });
    const n = this.getLayerState();
    let r = n.zIndex;
    !t && n.zIndex === void 0 && (r = 0);
    for (let o = i, a = e.length; o < a; o++) {
      const l = e[o];
      l.opacity *= n.opacity, l.visible = l.visible && n.visible, l.maxResolution = Math.min(
        l.maxResolution,
        n.maxResolution
      ), l.minResolution = Math.max(
        l.minResolution,
        n.minResolution
      ), l.minZoom = Math.max(l.minZoom, n.minZoom), l.maxZoom = Math.min(l.maxZoom, n.maxZoom), n.extent !== void 0 && (l.extent !== void 0 ? l.extent = ei(
        l.extent,
        n.extent
      ) : l.extent = n.extent), l.zIndex === void 0 && (l.zIndex = r);
    }
    return e;
  }
  /**
   * @return {import("../source/Source.js").State} Source state.
   */
  getSourceState() {
    return "ready";
  }
}
const pn = ys;
class Hl extends Zt {
  /**
   * @param {string} type Event type.
   * @param {import("./Map.js").default} map Map.
   * @param {?import("./Map.js").FrameState} [frameState] Frame state.
   */
  constructor(t, e, i) {
    super(t), this.map = e, this.frameState = i !== void 0 ? i : null;
  }
}
const Pe = Hl;
class $l extends Pe {
  /**
   * @param {string} type Event type.
   * @param {import("./Map.js").default} map Map.
   * @param {EVENT} originalEvent Original event.
   * @param {boolean} [dragging] Is the map currently being dragged?
   * @param {import("./Map.js").FrameState} [frameState] Frame state.
   * @param {Array<PointerEvent>} [activePointers] Active pointers.
   */
  constructor(t, e, i, n, r, o) {
    super(t, e, r), this.originalEvent = i, this.pixel_ = null, this.coordinate_ = null, this.dragging = n !== void 0 ? n : !1, this.activePointers = o;
  }
  /**
   * The map pixel relative to the viewport corresponding to the original event.
   * @type {import("./pixel.js").Pixel}
   * @api
   */
  get pixel() {
    return this.pixel_ || (this.pixel_ = this.map.getEventPixel(this.originalEvent)), this.pixel_;
  }
  set pixel(t) {
    this.pixel_ = t;
  }
  /**
   * The coordinate corresponding to the original browser event.  This will be in the user
   * projection if one is set.  Otherwise it will be in the view projection.
   * @type {import("./coordinate.js").Coordinate}
   * @api
   */
  get coordinate() {
    return this.coordinate_ || (this.coordinate_ = this.map.getCoordinateFromPixel(this.pixel)), this.coordinate_;
  }
  set coordinate(t) {
    this.coordinate_ = t;
  }
  /**
   * Prevents the default browser action.
   * See https://developer.mozilla.org/en-US/docs/Web/API/event.preventDefault.
   * @api
   */
  preventDefault() {
    super.preventDefault(), "preventDefault" in this.originalEvent && this.originalEvent.preventDefault();
  }
  /**
   * Prevents further propagation of the current event.
   * See https://developer.mozilla.org/en-US/docs/Web/API/event.stopPropagation.
   * @api
   */
  stopPropagation() {
    super.stopPropagation(), "stopPropagation" in this.originalEvent && this.originalEvent.stopPropagation();
  }
}
const Qt = $l, H = {
  /**
   * A true single click with no dragging and no double click. Note that this
   * event is delayed by 250 ms to ensure that it is not a double click.
   * @event module:ol/MapBrowserEvent~MapBrowserEvent#singleclick
   * @api
   */
  SINGLECLICK: "singleclick",
  /**
   * A click with no dragging. A double click will fire two of this.
   * @event module:ol/MapBrowserEvent~MapBrowserEvent#click
   * @api
   */
  CLICK: F.CLICK,
  /**
   * A true double click, with no dragging.
   * @event module:ol/MapBrowserEvent~MapBrowserEvent#dblclick
   * @api
   */
  DBLCLICK: F.DBLCLICK,
  /**
   * Triggered when a pointer is dragged.
   * @event module:ol/MapBrowserEvent~MapBrowserEvent#pointerdrag
   * @api
   */
  POINTERDRAG: "pointerdrag",
  /**
   * Triggered when a pointer is moved. Note that on touch devices this is
   * triggered when the map is panned, so is not the same as mousemove.
   * @event module:ol/MapBrowserEvent~MapBrowserEvent#pointermove
   * @api
   */
  POINTERMOVE: "pointermove",
  POINTERDOWN: "pointerdown",
  POINTERUP: "pointerup",
  POINTEROVER: "pointerover",
  POINTEROUT: "pointerout",
  POINTERENTER: "pointerenter",
  POINTERLEAVE: "pointerleave",
  POINTERCANCEL: "pointercancel"
}, jn = {
  POINTERMOVE: "pointermove",
  POINTERDOWN: "pointerdown",
  POINTERUP: "pointerup",
  POINTEROVER: "pointerover",
  POINTEROUT: "pointerout",
  POINTERENTER: "pointerenter",
  POINTERLEAVE: "pointerleave",
  POINTERCANCEL: "pointercancel"
};
class ql extends an {
  /**
   * @param {import("./Map.js").default} map The map with the viewport to listen to events on.
   * @param {number} [moveTolerance] The minimal distance the pointer must travel to trigger a move.
   */
  constructor(t, e) {
    super(t), this.map_ = t, this.clickTimeoutId_, this.emulateClicks_ = !1, this.dragging_ = !1, this.dragListenerKeys_ = [], this.moveTolerance_ = e === void 0 ? 1 : e, this.down_ = null;
    const i = this.map_.getViewport();
    this.activePointers_ = [], this.trackedTouches_ = {}, this.element_ = i, this.pointerdownListenerKey_ = G(
      i,
      jn.POINTERDOWN,
      this.handlePointerDown_,
      this
    ), this.originalPointerMoveEvent_, this.relayedListenerKey_ = G(
      i,
      jn.POINTERMOVE,
      this.relayMoveEvent_,
      this
    ), this.boundHandleTouchMove_ = this.handleTouchMove_.bind(this), this.element_.addEventListener(
      F.TOUCHMOVE,
      this.boundHandleTouchMove_,
      Nr ? { passive: !1 } : !1
    );
  }
  /**
   * @param {PointerEvent} pointerEvent Pointer
   * event.
   * @private
   */
  emulateClick_(t) {
    let e = new Qt(
      H.CLICK,
      this.map_,
      t
    );
    this.dispatchEvent(e), this.clickTimeoutId_ !== void 0 ? (clearTimeout(this.clickTimeoutId_), this.clickTimeoutId_ = void 0, e = new Qt(
      H.DBLCLICK,
      this.map_,
      t
    ), this.dispatchEvent(e)) : this.clickTimeoutId_ = setTimeout(() => {
      this.clickTimeoutId_ = void 0;
      const i = new Qt(
        H.SINGLECLICK,
        this.map_,
        t
      );
      this.dispatchEvent(i);
    }, 250);
  }
  /**
   * Keeps track on how many pointers are currently active.
   *
   * @param {PointerEvent} pointerEvent Pointer
   * event.
   * @private
   */
  updateActivePointers_(t) {
    const e = t, i = e.pointerId;
    if (e.type == H.POINTERUP || e.type == H.POINTERCANCEL) {
      delete this.trackedTouches_[i];
      for (const n in this.trackedTouches_)
        if (this.trackedTouches_[n].target !== e.target) {
          delete this.trackedTouches_[n];
          break;
        }
    } else
      (e.type == H.POINTERDOWN || e.type == H.POINTERMOVE) && (this.trackedTouches_[i] = e);
    this.activePointers_ = Object.values(this.trackedTouches_);
  }
  /**
   * @param {PointerEvent} pointerEvent Pointer
   * event.
   * @private
   */
  handlePointerUp_(t) {
    this.updateActivePointers_(t);
    const e = new Qt(
      H.POINTERUP,
      this.map_,
      t,
      void 0,
      void 0,
      this.activePointers_
    );
    this.dispatchEvent(e), this.emulateClicks_ && !e.defaultPrevented && !this.dragging_ && this.isMouseActionButton_(t) && this.emulateClick_(this.down_), this.activePointers_.length === 0 && (this.dragListenerKeys_.forEach(j), this.dragListenerKeys_.length = 0, this.dragging_ = !1, this.down_ = null);
  }
  /**
   * @param {PointerEvent} pointerEvent Pointer
   * event.
   * @return {boolean} If the left mouse button was pressed.
   * @private
   */
  isMouseActionButton_(t) {
    return t.button === 0;
  }
  /**
   * @param {PointerEvent} pointerEvent Pointer
   * event.
   * @private
   */
  handlePointerDown_(t) {
    this.emulateClicks_ = this.activePointers_.length === 0, this.updateActivePointers_(t);
    const e = new Qt(
      H.POINTERDOWN,
      this.map_,
      t,
      void 0,
      void 0,
      this.activePointers_
    );
    if (this.dispatchEvent(e), this.down_ = new PointerEvent(t.type, t), Object.defineProperty(this.down_, "target", {
      writable: !1,
      value: t.target
    }), this.dragListenerKeys_.length === 0) {
      const i = this.map_.getOwnerDocument();
      this.dragListenerKeys_.push(
        G(
          i,
          H.POINTERMOVE,
          this.handlePointerMove_,
          this
        ),
        G(i, H.POINTERUP, this.handlePointerUp_, this),
        /* Note that the listener for `pointercancel is set up on
         * `pointerEventHandler_` and not `documentPointerEventHandler_` like
         * the `pointerup` and `pointermove` listeners.
         *
         * The reason for this is the following: `TouchSource.vacuumTouches_()`
         * issues `pointercancel` events, when there was no `touchend` for a
         * `touchstart`. Now, let's say a first `touchstart` is registered on
         * `pointerEventHandler_`. The `documentPointerEventHandler_` is set up.
         * But `documentPointerEventHandler_` doesn't know about the first
         * `touchstart`. If there is no `touchend` for the `touchstart`, we can
         * only receive a `touchcancel` from `pointerEventHandler_`, because it is
         * only registered there.
         */
        G(
          this.element_,
          H.POINTERCANCEL,
          this.handlePointerUp_,
          this
        )
      ), this.element_.getRootNode && this.element_.getRootNode() !== i && this.dragListenerKeys_.push(
        G(
          this.element_.getRootNode(),
          H.POINTERUP,
          this.handlePointerUp_,
          this
        )
      );
    }
  }
  /**
   * @param {PointerEvent} pointerEvent Pointer
   * event.
   * @private
   */
  handlePointerMove_(t) {
    if (this.isMoving_(t)) {
      this.updateActivePointers_(t), this.dragging_ = !0;
      const e = new Qt(
        H.POINTERDRAG,
        this.map_,
        t,
        this.dragging_,
        void 0,
        this.activePointers_
      );
      this.dispatchEvent(e);
    }
  }
  /**
   * Wrap and relay a pointermove event.
   * @param {PointerEvent} pointerEvent Pointer
   * event.
   * @private
   */
  relayMoveEvent_(t) {
    this.originalPointerMoveEvent_ = t;
    const e = !!(this.down_ && this.isMoving_(t));
    this.dispatchEvent(
      new Qt(
        H.POINTERMOVE,
        this.map_,
        t,
        e
      )
    );
  }
  /**
   * Flexible handling of a `touch-action: none` css equivalent: because calling
   * `preventDefault()` on a `pointermove` event does not stop native page scrolling
   * and zooming, we also listen for `touchmove` and call `preventDefault()` on it
   * when an interaction (currently `DragPan` handles the event.
   * @param {TouchEvent} event Event.
   * @private
   */
  handleTouchMove_(t) {
    const e = this.originalPointerMoveEvent_;
    (!e || e.defaultPrevented) && (typeof t.cancelable != "boolean" || t.cancelable === !0) && t.preventDefault();
  }
  /**
   * @param {PointerEvent} pointerEvent Pointer
   * event.
   * @return {boolean} Is moving.
   * @private
   */
  isMoving_(t) {
    return this.dragging_ || Math.abs(t.clientX - this.down_.clientX) > this.moveTolerance_ || Math.abs(t.clientY - this.down_.clientY) > this.moveTolerance_;
  }
  /**
   * Clean up.
   */
  disposeInternal() {
    this.relayedListenerKey_ && (j(this.relayedListenerKey_), this.relayedListenerKey_ = null), this.element_.removeEventListener(
      F.TOUCHMOVE,
      this.boundHandleTouchMove_
    ), this.pointerdownListenerKey_ && (j(this.pointerdownListenerKey_), this.pointerdownListenerKey_ = null), this.dragListenerKeys_.forEach(j), this.dragListenerKeys_.length = 0, this.element_ = null, super.disposeInternal();
  }
}
const Jl = ql, zt = {
  /**
   * Triggered after a map frame is rendered.
   * @event module:ol/MapEvent~MapEvent#postrender
   * @api
   */
  POSTRENDER: "postrender",
  /**
   * Triggered when the map starts moving.
   * @event module:ol/MapEvent~MapEvent#movestart
   * @api
   */
  MOVESTART: "movestart",
  /**
   * Triggered after the map is moved.
   * @event module:ol/MapEvent~MapEvent#moveend
   * @api
   */
  MOVEEND: "moveend",
  /**
   * Triggered when loading of additional map data (tiles, images, features) starts.
   * @event module:ol/MapEvent~MapEvent#loadstart
   * @api
   */
  LOADSTART: "loadstart",
  /**
   * Triggered when loading of additional map data has completed.
   * @event module:ol/MapEvent~MapEvent#loadend
   * @api
   */
  LOADEND: "loadend"
}, st = {
  LAYERGROUP: "layergroup",
  SIZE: "size",
  TARGET: "target",
  VIEW: "view"
}, sn = 1 / 0;
class Ql {
  /**
   * @param {function(T): number} priorityFunction Priority function.
   * @param {function(T): string} keyFunction Key function.
   */
  constructor(t, e) {
    this.priorityFunction_ = t, this.keyFunction_ = e, this.elements_ = [], this.priorities_ = [], this.queuedElements_ = {};
  }
  /**
   * FIXME empty description for jsdoc
   */
  clear() {
    this.elements_.length = 0, this.priorities_.length = 0, mi(this.queuedElements_);
  }
  /**
   * Remove and return the highest-priority element. O(log N).
   * @return {T} Element.
   */
  dequeue() {
    const t = this.elements_, e = this.priorities_, i = t[0];
    t.length == 1 ? (t.length = 0, e.length = 0) : (t[0] = t.pop(), e[0] = e.pop(), this.siftUp_(0));
    const n = this.keyFunction_(i);
    return delete this.queuedElements_[n], i;
  }
  /**
   * Enqueue an element. O(log N).
   * @param {T} element Element.
   * @return {boolean} The element was added to the queue.
   */
  enqueue(t) {
    k(!(this.keyFunction_(t) in this.queuedElements_), 31);
    const e = this.priorityFunction_(t);
    return e != sn ? (this.elements_.push(t), this.priorities_.push(e), this.queuedElements_[this.keyFunction_(t)] = !0, this.siftDown_(0, this.elements_.length - 1), !0) : !1;
  }
  /**
   * @return {number} Count.
   */
  getCount() {
    return this.elements_.length;
  }
  /**
   * Gets the index of the left child of the node at the given index.
   * @param {number} index The index of the node to get the left child for.
   * @return {number} The index of the left child.
   * @private
   */
  getLeftChildIndex_(t) {
    return t * 2 + 1;
  }
  /**
   * Gets the index of the right child of the node at the given index.
   * @param {number} index The index of the node to get the right child for.
   * @return {number} The index of the right child.
   * @private
   */
  getRightChildIndex_(t) {
    return t * 2 + 2;
  }
  /**
   * Gets the index of the parent of the node at the given index.
   * @param {number} index The index of the node to get the parent for.
   * @return {number} The index of the parent.
   * @private
   */
  getParentIndex_(t) {
    return t - 1 >> 1;
  }
  /**
   * Make this a heap. O(N).
   * @private
   */
  heapify_() {
    let t;
    for (t = (this.elements_.length >> 1) - 1; t >= 0; t--)
      this.siftUp_(t);
  }
  /**
   * @return {boolean} Is empty.
   */
  isEmpty() {
    return this.elements_.length === 0;
  }
  /**
   * @param {string} key Key.
   * @return {boolean} Is key queued.
   */
  isKeyQueued(t) {
    return t in this.queuedElements_;
  }
  /**
   * @param {T} element Element.
   * @return {boolean} Is queued.
   */
  isQueued(t) {
    return this.isKeyQueued(this.keyFunction_(t));
  }
  /**
   * @param {number} index The index of the node to move down.
   * @private
   */
  siftUp_(t) {
    const e = this.elements_, i = this.priorities_, n = e.length, r = e[t], o = i[t], a = t;
    for (; t < n >> 1; ) {
      const l = this.getLeftChildIndex_(t), h = this.getRightChildIndex_(t), c = h < n && i[h] < i[l] ? h : l;
      e[t] = e[c], i[t] = i[c], t = c;
    }
    e[t] = r, i[t] = o, this.siftDown_(a, t);
  }
  /**
   * @param {number} startIndex The index of the root.
   * @param {number} index The index of the node to move up.
   * @private
   */
  siftDown_(t, e) {
    const i = this.elements_, n = this.priorities_, r = i[e], o = n[e];
    for (; e > t; ) {
      const a = this.getParentIndex_(e);
      if (n[a] > o)
        i[e] = i[a], n[e] = n[a], e = a;
      else
        break;
    }
    i[e] = r, n[e] = o;
  }
  /**
   * FIXME empty description for jsdoc
   */
  reprioritize() {
    const t = this.priorityFunction_, e = this.elements_, i = this.priorities_;
    let n = 0;
    const r = e.length;
    let o, a, l;
    for (a = 0; a < r; ++a)
      o = e[a], l = t(o), l == sn ? delete this.queuedElements_[this.keyFunction_(o)] : (i[n] = l, e[n++] = o);
    e.length = n, i.length = n, this.heapify_();
  }
}
const th = Ql, A = {
  IDLE: 0,
  LOADING: 1,
  LOADED: 2,
  /**
   * Indicates that tile loading failed
   * @type {number}
   */
  ERROR: 3,
  EMPTY: 4
};
class eh extends th {
  /**
   * @param {PriorityFunction} tilePriorityFunction Tile priority function.
   * @param {function(): ?} tileChangeCallback Function called on each tile change event.
   */
  constructor(t, e) {
    super(
      /**
       * @param {Array} element Element.
       * @return {number} Priority.
       */
      function(i) {
        return t.apply(null, i);
      },
      /**
       * @param {Array} element Element.
       * @return {string} Key.
       */
      function(i) {
        return (
          /** @type {import("./Tile.js").default} */
          i[0].getKey()
        );
      }
    ), this.boundHandleTileChange_ = this.handleTileChange.bind(this), this.tileChangeCallback_ = e, this.tilesLoading_ = 0, this.tilesLoadingKeys_ = {};
  }
  /**
   * @param {Array} element Element.
   * @return {boolean} The element was added to the queue.
   */
  enqueue(t) {
    const e = super.enqueue(t);
    return e && t[0].addEventListener(F.CHANGE, this.boundHandleTileChange_), e;
  }
  /**
   * @return {number} Number of tiles loading.
   */
  getTilesLoading() {
    return this.tilesLoading_;
  }
  /**
   * @param {import("./events/Event.js").default} event Event.
   * @protected
   */
  handleTileChange(t) {
    const e = (
      /** @type {import("./Tile.js").default} */
      t.target
    ), i = e.getState();
    if (i === A.LOADED || i === A.ERROR || i === A.EMPTY) {
      i !== A.ERROR && e.removeEventListener(F.CHANGE, this.boundHandleTileChange_);
      const n = e.getKey();
      n in this.tilesLoadingKeys_ && (delete this.tilesLoadingKeys_[n], --this.tilesLoading_), this.tileChangeCallback_();
    }
  }
  /**
   * @param {number} maxTotalLoading Maximum number tiles to load simultaneously.
   * @param {number} maxNewLoads Maximum number of new tiles to load.
   */
  loadMoreTiles(t, e) {
    let i = 0, n, r, o;
    for (; this.tilesLoading_ < t && i < e && this.getCount() > 0; )
      r = /** @type {import("./Tile.js").default} */
      this.dequeue()[0], o = r.getKey(), n = r.getState(), n === A.IDLE && !(o in this.tilesLoadingKeys_) && (this.tilesLoadingKeys_[o] = !0, ++this.tilesLoading_, ++i, r.load());
  }
}
const ih = eh;
function nh(s, t, e, i, n) {
  if (!s || !(e in s.wantedTiles) || !s.wantedTiles[e][t.getKey()])
    return sn;
  const r = s.viewState.center, o = i[0] - r[0], a = i[1] - r[1];
  return 65536 * Math.log(n) + Math.sqrt(o * o + a * a) / n;
}
class sh extends St {
  /**
   * @param {Options} options Control options.
   */
  constructor(t) {
    super();
    const e = t.element;
    e && !t.target && !e.style.pointerEvents && (e.style.pointerEvents = "auto"), this.element = e || null, this.target_ = null, this.map_ = null, this.listenerKeys = [], t.render && (this.render = t.render), t.target && this.setTarget(t.target);
  }
  /**
   * Clean up.
   */
  disposeInternal() {
    Qi(this.element), super.disposeInternal();
  }
  /**
   * Get the map associated with this control.
   * @return {import("../Map.js").default|null} Map.
   * @api
   */
  getMap() {
    return this.map_;
  }
  /**
   * Remove the control from its current map and attach it to the new map.
   * Pass `null` to just remove the control from the current map.
   * Subclasses may set up event handlers to get notified about changes to
   * the map here.
   * @param {import("../Map.js").default|null} map Map.
   * @api
   */
  setMap(t) {
    this.map_ && Qi(this.element);
    for (let e = 0, i = this.listenerKeys.length; e < i; ++e)
      j(this.listenerKeys[e]);
    this.listenerKeys.length = 0, this.map_ = t, t && ((this.target_ ? this.target_ : t.getOverlayContainerStopEvent()).appendChild(this.element), this.render !== ze && this.listenerKeys.push(
      G(t, zt.POSTRENDER, this.render, this)
    ), t.render());
  }
  /**
   * Renders the control.
   * @param {import("../MapEvent.js").default} mapEvent Map event.
   * @api
   */
  render(t) {
  }
  /**
   * This function is used to set a target element for the control. It has no
   * effect if it is called after the control has been added to the map (i.e.
   * after `setMap` is called on the control). If no `target` is set in the
   * options passed to the control constructor and if `setTarget` is not called
   * then the control is added to the map's overlay container.
   * @param {HTMLElement|string} target Target.
   * @api
   */
  setTarget(t) {
    this.target_ = typeof t == "string" ? document.getElementById(t) : t;
  }
}
const xs = sh;
class rh extends xs {
  /**
   * @param {Options} [options] Attribution options.
   */
  constructor(t) {
    t = t || {}, super({
      element: document.createElement("div"),
      render: t.render,
      target: t.target
    }), this.ulElement_ = document.createElement("ul"), this.collapsed_ = t.collapsed !== void 0 ? t.collapsed : !0, this.userCollapsed_ = this.collapsed_, this.overrideCollapsible_ = t.collapsible !== void 0, this.collapsible_ = t.collapsible !== void 0 ? t.collapsible : !0, this.collapsible_ || (this.collapsed_ = !1);
    const e = t.className !== void 0 ? t.className : "ol-attribution", i = t.tipLabel !== void 0 ? t.tipLabel : "Attributions", n = t.expandClassName !== void 0 ? t.expandClassName : e + "-expand", r = t.collapseLabel !== void 0 ? t.collapseLabel : "›", o = t.collapseClassName !== void 0 ? t.collapseClassName : e + "-collapse";
    typeof r == "string" ? (this.collapseLabel_ = document.createElement("span"), this.collapseLabel_.textContent = r, this.collapseLabel_.className = o) : this.collapseLabel_ = r;
    const a = t.label !== void 0 ? t.label : "i";
    typeof a == "string" ? (this.label_ = document.createElement("span"), this.label_.textContent = a, this.label_.className = n) : this.label_ = a;
    const l = this.collapsible_ && !this.collapsed_ ? this.collapseLabel_ : this.label_;
    this.toggleButton_ = document.createElement("button"), this.toggleButton_.setAttribute("type", "button"), this.toggleButton_.setAttribute("aria-expanded", String(!this.collapsed_)), this.toggleButton_.title = i, this.toggleButton_.appendChild(l), this.toggleButton_.addEventListener(
      F.CLICK,
      this.handleClick_.bind(this),
      !1
    );
    const h = e + " " + _n + " " + ps + (this.collapsed_ && this.collapsible_ ? " " + ar : "") + (this.collapsible_ ? "" : " ol-uncollapsible"), c = this.element;
    c.className = h, c.appendChild(this.toggleButton_), c.appendChild(this.ulElement_), this.renderedAttributions_ = [], this.renderedVisible_ = !0;
  }
  /**
   * Collect a list of visible attributions and set the collapsible state.
   * @param {import("../Map.js").FrameState} frameState Frame state.
   * @return {Array<string>} Attributions.
   * @private
   */
  collectSourceAttributions_(t) {
    const e = Array.from(
      new Set(
        this.getMap().getAllLayers().flatMap((n) => n.getAttributions(t))
      )
    ), i = !this.getMap().getAllLayers().some(
      (n) => n.getSource() && n.getSource().getAttributionsCollapsible() === !1
    );
    return this.overrideCollapsible_ || this.setCollapsible(i), e;
  }
  /**
   * @private
   * @param {?import("../Map.js").FrameState} frameState Frame state.
   */
  updateElement_(t) {
    if (!t) {
      this.renderedVisible_ && (this.element.style.display = "none", this.renderedVisible_ = !1);
      return;
    }
    const e = this.collectSourceAttributions_(t), i = e.length > 0;
    if (this.renderedVisible_ != i && (this.element.style.display = i ? "" : "none", this.renderedVisible_ = i), !re(e, this.renderedAttributions_)) {
      _o(this.ulElement_);
      for (let n = 0, r = e.length; n < r; ++n) {
        const o = document.createElement("li");
        o.innerHTML = e[n], this.ulElement_.appendChild(o);
      }
      this.renderedAttributions_ = e;
    }
  }
  /**
   * @param {MouseEvent} event The event to handle
   * @private
   */
  handleClick_(t) {
    t.preventDefault(), this.handleToggle_(), this.userCollapsed_ = this.collapsed_;
  }
  /**
   * @private
   */
  handleToggle_() {
    this.element.classList.toggle(ar), this.collapsed_ ? hr(this.collapseLabel_, this.label_) : hr(this.label_, this.collapseLabel_), this.collapsed_ = !this.collapsed_, this.toggleButton_.setAttribute("aria-expanded", String(!this.collapsed_));
  }
  /**
   * Return `true` if the attribution is collapsible, `false` otherwise.
   * @return {boolean} True if the widget is collapsible.
   * @api
   */
  getCollapsible() {
    return this.collapsible_;
  }
  /**
   * Set whether the attribution should be collapsible.
   * @param {boolean} collapsible True if the widget is collapsible.
   * @api
   */
  setCollapsible(t) {
    this.collapsible_ !== t && (this.collapsible_ = t, this.element.classList.toggle("ol-uncollapsible"), this.userCollapsed_ && this.handleToggle_());
  }
  /**
   * Collapse or expand the attribution according to the passed parameter. Will
   * not do anything if the attribution isn't collapsible or if the current
   * collapsed state is already the one requested.
   * @param {boolean} collapsed True if the widget is collapsed.
   * @api
   */
  setCollapsed(t) {
    this.userCollapsed_ = t, !(!this.collapsible_ || this.collapsed_ === t) && this.handleToggle_();
  }
  /**
   * Return `true` when the attribution is currently collapsed or `false`
   * otherwise.
   * @return {boolean} True if the widget is collapsed.
   * @api
   */
  getCollapsed() {
    return this.collapsed_;
  }
  /**
   * Update the attribution element.
   * @param {import("../MapEvent.js").default} mapEvent Map event.
   * @override
   */
  render(t) {
    this.updateElement_(t.frameState);
  }
}
const oh = rh;
class ah extends xs {
  /**
   * @param {Options} [options] Rotate options.
   */
  constructor(t) {
    t = t || {}, super({
      element: document.createElement("div"),
      render: t.render,
      target: t.target
    });
    const e = t.className !== void 0 ? t.className : "ol-rotate", i = t.label !== void 0 ? t.label : "⇧", n = t.compassClassName !== void 0 ? t.compassClassName : "ol-compass";
    this.label_ = null, typeof i == "string" ? (this.label_ = document.createElement("span"), this.label_.className = n, this.label_.textContent = i) : (this.label_ = i, this.label_.classList.add(n));
    const r = t.tipLabel ? t.tipLabel : "Reset rotation", o = document.createElement("button");
    o.className = e + "-reset", o.setAttribute("type", "button"), o.title = r, o.appendChild(this.label_), o.addEventListener(
      F.CLICK,
      this.handleClick_.bind(this),
      !1
    );
    const a = e + " " + _n + " " + ps, l = this.element;
    l.className = a, l.appendChild(o), this.callResetNorth_ = t.resetNorth ? t.resetNorth : void 0, this.duration_ = t.duration !== void 0 ? t.duration : 250, this.autoHide_ = t.autoHide !== void 0 ? t.autoHide : !0, this.rotation_ = void 0, this.autoHide_ && this.element.classList.add(ki);
  }
  /**
   * @param {MouseEvent} event The event to handle
   * @private
   */
  handleClick_(t) {
    t.preventDefault(), this.callResetNorth_ !== void 0 ? this.callResetNorth_() : this.resetNorth_();
  }
  /**
   * @private
   */
  resetNorth_() {
    const e = this.getMap().getView();
    if (!e)
      return;
    const i = e.getRotation();
    i !== void 0 && (this.duration_ > 0 && i % (2 * Math.PI) !== 0 ? e.animate({
      rotation: 0,
      duration: this.duration_,
      easing: Ze
    }) : e.setRotation(0));
  }
  /**
   * Update the rotate control element.
   * @param {import("../MapEvent.js").default} mapEvent Map event.
   * @override
   */
  render(t) {
    const e = t.frameState;
    if (!e)
      return;
    const i = e.viewState.rotation;
    if (i != this.rotation_) {
      const n = "rotate(" + i + "rad)";
      if (this.autoHide_) {
        const r = this.element.classList.contains(ki);
        !r && i === 0 ? this.element.classList.add(ki) : r && i !== 0 && this.element.classList.remove(ki);
      }
      this.label_.style.transform = n;
    }
    this.rotation_ = i;
  }
}
const lh = ah;
class hh extends xs {
  /**
   * @param {Options} [options] Zoom options.
   */
  constructor(t) {
    t = t || {}, super({
      element: document.createElement("div"),
      target: t.target
    });
    const e = t.className !== void 0 ? t.className : "ol-zoom", i = t.delta !== void 0 ? t.delta : 1, n = t.zoomInClassName !== void 0 ? t.zoomInClassName : e + "-in", r = t.zoomOutClassName !== void 0 ? t.zoomOutClassName : e + "-out", o = t.zoomInLabel !== void 0 ? t.zoomInLabel : "+", a = t.zoomOutLabel !== void 0 ? t.zoomOutLabel : "–", l = t.zoomInTipLabel !== void 0 ? t.zoomInTipLabel : "Zoom in", h = t.zoomOutTipLabel !== void 0 ? t.zoomOutTipLabel : "Zoom out", c = document.createElement("button");
    c.className = n, c.setAttribute("type", "button"), c.title = l, c.appendChild(
      typeof o == "string" ? document.createTextNode(o) : o
    ), c.addEventListener(
      F.CLICK,
      this.handleClick_.bind(this, i),
      !1
    );
    const u = document.createElement("button");
    u.className = r, u.setAttribute("type", "button"), u.title = h, u.appendChild(
      typeof a == "string" ? document.createTextNode(a) : a
    ), u.addEventListener(
      F.CLICK,
      this.handleClick_.bind(this, -i),
      !1
    );
    const d = e + " " + _n + " " + ps, f = this.element;
    f.className = d, f.appendChild(c), f.appendChild(u), this.duration_ = t.duration !== void 0 ? t.duration : 250;
  }
  /**
   * @param {number} delta Zoom delta.
   * @param {MouseEvent} event The event to handle
   * @private
   */
  handleClick_(t, e) {
    e.preventDefault(), this.zoomByDelta_(t);
  }
  /**
   * @param {number} delta Zoom delta.
   * @private
   */
  zoomByDelta_(t) {
    const i = this.getMap().getView();
    if (!i)
      return;
    const n = i.getZoom();
    if (n !== void 0) {
      const r = i.getConstrainedZoom(n + t);
      this.duration_ > 0 ? (i.getAnimating() && i.cancelAnimations(), i.animate({
        zoom: r,
        duration: this.duration_,
        easing: Ze
      })) : i.setZoom(r);
    }
  }
}
const ch = hh;
function uh(s) {
  s = s || {};
  const t = new At();
  return (s.zoom !== void 0 ? s.zoom : !0) && t.push(new ch(s.zoomOptions)), (s.rotate !== void 0 ? s.rotate : !0) && t.push(new lh(s.rotateOptions)), (s.attribution !== void 0 ? s.attribution : !0) && t.push(new oh(s.attributionOptions)), t;
}
const ur = {
  ACTIVE: "active"
};
class dh extends St {
  /**
   * @param {InteractionOptions} [options] Options.
   */
  constructor(t) {
    super(), this.on, this.once, this.un, t && t.handleEvent && (this.handleEvent = t.handleEvent), this.map_ = null, this.setActive(!0);
  }
  /**
   * Return whether the interaction is currently active.
   * @return {boolean} `true` if the interaction is active, `false` otherwise.
   * @observable
   * @api
   */
  getActive() {
    return (
      /** @type {boolean} */
      this.get(ur.ACTIVE)
    );
  }
  /**
   * Get the map associated with this interaction.
   * @return {import("../Map.js").default|null} Map.
   * @api
   */
  getMap() {
    return this.map_;
  }
  /**
   * Handles the {@link module:ol/MapBrowserEvent~MapBrowserEvent map browser event}.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Map browser event.
   * @return {boolean} `false` to stop event propagation.
   * @api
   */
  handleEvent(t) {
    return !0;
  }
  /**
   * Activate or deactivate the interaction.
   * @param {boolean} active Active.
   * @observable
   * @api
   */
  setActive(t) {
    this.set(ur.ACTIVE, t);
  }
  /**
   * Remove the interaction from its current map and attach it to the new map.
   * Subclasses may set up event handlers to get notified about changes to
   * the map here.
   * @param {import("../Map.js").default|null} map Map.
   */
  setMap(t) {
    this.map_ = t;
  }
}
function fh(s, t, e) {
  const i = s.getCenterInternal();
  if (i) {
    const n = [i[0] + t[0], i[1] + t[1]];
    s.animateInternal({
      duration: e !== void 0 ? e : 250,
      easing: rl,
      center: s.getConstrainedCenter(n)
    });
  }
}
function Es(s, t, e, i) {
  const n = s.getZoom();
  if (n === void 0)
    return;
  const r = s.getConstrainedZoom(n + t), o = s.getResolutionForZoom(r);
  s.getAnimating() && s.cancelAnimations(), s.animate({
    resolution: o,
    anchor: e,
    duration: i !== void 0 ? i : 250,
    easing: Ze
  });
}
const yi = dh;
class gh extends yi {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    super(), t = t || {}, this.delta_ = t.delta ? t.delta : 1, this.duration_ = t.duration !== void 0 ? t.duration : 250;
  }
  /**
   * Handles the {@link module:ol/MapBrowserEvent~MapBrowserEvent map browser event} (if it was a
   * doubleclick) and eventually zooms the map.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Map browser event.
   * @return {boolean} `false` to stop event propagation.
   */
  handleEvent(t) {
    let e = !1;
    if (t.type == H.DBLCLICK) {
      const i = (
        /** @type {MouseEvent} */
        t.originalEvent
      ), n = t.map, r = t.coordinate, o = i.shiftKey ? -this.delta_ : this.delta_, a = n.getView();
      Es(a, o, r, this.duration_), i.preventDefault(), e = !0;
    }
    return !e;
  }
}
const _h = gh;
class mh extends yi {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    t = t || {}, super(
      /** @type {import("./Interaction.js").InteractionOptions} */
      t
    ), t.handleDownEvent && (this.handleDownEvent = t.handleDownEvent), t.handleDragEvent && (this.handleDragEvent = t.handleDragEvent), t.handleMoveEvent && (this.handleMoveEvent = t.handleMoveEvent), t.handleUpEvent && (this.handleUpEvent = t.handleUpEvent), t.stopDown && (this.stopDown = t.stopDown), this.handlingDownUpSequence = !1, this.targetPointers = [];
  }
  /**
   * Returns the current number of pointers involved in the interaction,
   * e.g. `2` when two fingers are used.
   * @return {number} The number of pointers.
   * @api
   */
  getPointerCount() {
    return this.targetPointers.length;
  }
  /**
   * Handle pointer down events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @return {boolean} If the event was consumed.
   * @protected
   */
  handleDownEvent(t) {
    return !1;
  }
  /**
   * Handle pointer drag events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @protected
   */
  handleDragEvent(t) {
  }
  /**
   * Handles the {@link module:ol/MapBrowserEvent~MapBrowserEvent map browser event} and may call into
   * other functions, if event sequences like e.g. 'drag' or 'down-up' etc. are
   * detected.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Map browser event.
   * @return {boolean} `false` to stop event propagation.
   * @api
   */
  handleEvent(t) {
    if (!t.originalEvent)
      return !0;
    let e = !1;
    if (this.updateTrackedPointers_(t), this.handlingDownUpSequence) {
      if (t.type == H.POINTERDRAG)
        this.handleDragEvent(t), t.originalEvent.preventDefault();
      else if (t.type == H.POINTERUP) {
        const i = this.handleUpEvent(t);
        this.handlingDownUpSequence = i && this.targetPointers.length > 0;
      }
    } else if (t.type == H.POINTERDOWN) {
      const i = this.handleDownEvent(t);
      this.handlingDownUpSequence = i, e = this.stopDown(i);
    } else
      t.type == H.POINTERMOVE && this.handleMoveEvent(t);
    return !e;
  }
  /**
   * Handle pointer move events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @protected
   */
  handleMoveEvent(t) {
  }
  /**
   * Handle pointer up events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @return {boolean} If the event was consumed.
   * @protected
   */
  handleUpEvent(t) {
    return !1;
  }
  /**
   * This function is used to determine if "down" events should be propagated
   * to other interactions or should be stopped.
   * @param {boolean} handled Was the event handled by the interaction?
   * @return {boolean} Should the `down` event be stopped?
   */
  stopDown(t) {
    return t;
  }
  /**
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @private
   */
  updateTrackedPointers_(t) {
    t.activePointers && (this.targetPointers = t.activePointers);
  }
}
function Cs(s) {
  const t = s.length;
  let e = 0, i = 0;
  for (let n = 0; n < t; n++)
    e += s[n].clientX, i += s[n].clientY;
  return { clientX: e / t, clientY: i / t };
}
const xi = mh;
function Hn(s) {
  const t = arguments;
  return function(e) {
    let i = !0;
    for (let n = 0, r = t.length; n < r && (i = i && t[n](e), !!i); ++n)
      ;
    return i;
  };
}
const ph = function(s) {
  const t = (
    /** @type {KeyboardEvent|MouseEvent|TouchEvent} */
    s.originalEvent
  );
  return t.altKey && !(t.metaKey || t.ctrlKey) && t.shiftKey;
}, yh = function(s) {
  const t = s.map.getTargetElement(), e = s.map.getOwnerDocument().activeElement;
  return t.contains(e);
}, yo = function(s) {
  return s.map.getTargetElement().hasAttribute("tabindex") ? yh(s) : !0;
}, xh = ni, xo = function(s) {
  const t = (
    /** @type {MouseEvent} */
    s.originalEvent
  );
  return t.button == 0 && !(la && ha && t.ctrlKey);
}, Eo = function(s) {
  const t = (
    /** @type {KeyboardEvent|MouseEvent|TouchEvent} */
    s.originalEvent
  );
  return !t.altKey && !(t.metaKey || t.ctrlKey) && !t.shiftKey;
}, Eh = function(s) {
  const t = (
    /** @type {KeyboardEvent|MouseEvent|TouchEvent} */
    s.originalEvent
  );
  return !t.altKey && !(t.metaKey || t.ctrlKey) && t.shiftKey;
}, Co = function(s) {
  const t = (
    /** @type {KeyboardEvent|MouseEvent|TouchEvent} */
    s.originalEvent
  ), e = (
    /** @type {Element} */
    t.target.tagName
  );
  return e !== "INPUT" && e !== "SELECT" && e !== "TEXTAREA" && // `isContentEditable` is only available on `HTMLElement`, but it may also be a
  // different type like `SVGElement`.
  // @ts-ignore
  !t.target.isContentEditable;
}, wn = function(s) {
  const t = (
    /** @type {import("../MapBrowserEvent").default} */
    s.originalEvent
  );
  return k(t !== void 0, 56), t.pointerType == "mouse";
}, Ch = function(s) {
  const t = (
    /** @type {import("../MapBrowserEvent").default} */
    s.originalEvent
  );
  return k(t !== void 0, 56), t.isPrimary && t.button === 0;
};
class Rh extends xi {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    super({
      stopDown: on
    }), t = t || {}, this.kinetic_ = t.kinetic, this.lastCentroid = null, this.lastPointersCount_, this.panning_ = !1;
    const e = t.condition ? t.condition : Hn(Eo, Ch);
    this.condition_ = t.onFocusOnly ? Hn(yo, e) : e, this.noKinetic_ = !1;
  }
  /**
   * Handle pointer drag events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   */
  handleDragEvent(t) {
    const e = t.map;
    this.panning_ || (this.panning_ = !0, e.getView().beginInteraction());
    const i = this.targetPointers, n = e.getEventPixel(Cs(i));
    if (i.length == this.lastPointersCount_) {
      if (this.kinetic_ && this.kinetic_.update(n[0], n[1]), this.lastCentroid) {
        const r = [
          this.lastCentroid[0] - n[0],
          n[1] - this.lastCentroid[1]
        ], a = t.map.getView();
        Za(r, a.getResolution()), os(r, a.getRotation()), a.adjustCenterInternal(r);
      }
    } else
      this.kinetic_ && this.kinetic_.begin();
    this.lastCentroid = n, this.lastPointersCount_ = i.length, t.originalEvent.preventDefault();
  }
  /**
   * Handle pointer up events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @return {boolean} If the event was consumed.
   */
  handleUpEvent(t) {
    const e = t.map, i = e.getView();
    if (this.targetPointers.length === 0) {
      if (!this.noKinetic_ && this.kinetic_ && this.kinetic_.end()) {
        const n = this.kinetic_.getDistance(), r = this.kinetic_.getAngle(), o = i.getCenterInternal(), a = e.getPixelFromCoordinateInternal(o), l = e.getCoordinateFromPixelInternal([
          a[0] - n * Math.cos(r),
          a[1] - n * Math.sin(r)
        ]);
        i.animateInternal({
          center: i.getConstrainedCenter(l),
          duration: 500,
          easing: Ze
        });
      }
      return this.panning_ && (this.panning_ = !1, i.endInteraction()), !1;
    }
    return this.kinetic_ && this.kinetic_.begin(), this.lastCentroid = null, !0;
  }
  /**
   * Handle pointer down events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @return {boolean} If the event was consumed.
   */
  handleDownEvent(t) {
    if (this.targetPointers.length > 0 && this.condition_(t)) {
      const i = t.map.getView();
      return this.lastCentroid = null, i.getAnimating() && i.cancelAnimations(), this.kinetic_ && this.kinetic_.begin(), this.noKinetic_ = this.targetPointers.length > 1, !0;
    }
    return !1;
  }
}
const Th = Rh;
class Ih extends xi {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    t = t || {}, super({
      stopDown: on
    }), this.condition_ = t.condition ? t.condition : ph, this.lastAngle_ = void 0, this.duration_ = t.duration !== void 0 ? t.duration : 250;
  }
  /**
   * Handle pointer drag events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   */
  handleDragEvent(t) {
    if (!wn(t))
      return;
    const e = t.map, i = e.getView();
    if (i.getConstraints().rotation === fs)
      return;
    const n = e.getSize(), r = t.pixel, o = Math.atan2(n[1] / 2 - r[1], r[0] - n[0] / 2);
    if (this.lastAngle_ !== void 0) {
      const a = o - this.lastAngle_;
      i.adjustRotationInternal(-a);
    }
    this.lastAngle_ = o;
  }
  /**
   * Handle pointer up events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @return {boolean} If the event was consumed.
   */
  handleUpEvent(t) {
    return wn(t) ? (t.map.getView().endInteraction(this.duration_), !1) : !0;
  }
  /**
   * Handle pointer down events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @return {boolean} If the event was consumed.
   */
  handleDownEvent(t) {
    return wn(t) && xo(t) && this.condition_(t) ? (t.map.getView().beginInteraction(), this.lastAngle_ = void 0, !0) : !1;
  }
}
const Sh = Ih;
class vh extends Jn {
  /**
   * @param {string} className CSS class name.
   */
  constructor(t) {
    super(), this.geometry_ = null, this.element_ = document.createElement("div"), this.element_.style.position = "absolute", this.element_.style.pointerEvents = "auto", this.element_.className = "ol-box " + t, this.map_ = null, this.startPixel_ = null, this.endPixel_ = null;
  }
  /**
   * Clean up.
   */
  disposeInternal() {
    this.setMap(null);
  }
  /**
   * @private
   */
  render_() {
    const t = this.startPixel_, e = this.endPixel_, i = "px", n = this.element_.style;
    n.left = Math.min(t[0], e[0]) + i, n.top = Math.min(t[1], e[1]) + i, n.width = Math.abs(e[0] - t[0]) + i, n.height = Math.abs(e[1] - t[1]) + i;
  }
  /**
   * @param {import("../Map.js").default|null} map Map.
   */
  setMap(t) {
    if (this.map_) {
      this.map_.getOverlayContainer().removeChild(this.element_);
      const e = this.element_.style;
      e.left = "inherit", e.top = "inherit", e.width = "inherit", e.height = "inherit";
    }
    this.map_ = t, this.map_ && this.map_.getOverlayContainer().appendChild(this.element_);
  }
  /**
   * @param {import("../pixel.js").Pixel} startPixel Start pixel.
   * @param {import("../pixel.js").Pixel} endPixel End pixel.
   */
  setPixels(t, e) {
    this.startPixel_ = t, this.endPixel_ = e, this.createOrUpdateGeometry(), this.render_();
  }
  /**
   * Creates or updates the cached geometry.
   */
  createOrUpdateGeometry() {
    const t = this.startPixel_, e = this.endPixel_, n = [
      t,
      [t[0], e[1]],
      e,
      [e[0], t[1]]
    ].map(
      this.map_.getCoordinateFromPixelInternal,
      this.map_
    );
    n[4] = n[0].slice(), this.geometry_ ? this.geometry_.setCoordinates([n]) : this.geometry_ = new ai([n]);
  }
  /**
   * @return {import("../geom/Polygon.js").default} Geometry.
   */
  getGeometry() {
    return this.geometry_;
  }
}
const wh = vh, Ni = {
  /**
   * Triggered upon drag box start.
   * @event DragBoxEvent#boxstart
   * @api
   */
  BOXSTART: "boxstart",
  /**
   * Triggered on drag when box is active.
   * @event DragBoxEvent#boxdrag
   * @api
   */
  BOXDRAG: "boxdrag",
  /**
   * Triggered upon drag box end.
   * @event DragBoxEvent#boxend
   * @api
   */
  BOXEND: "boxend",
  /**
   * Triggered upon drag box canceled.
   * @event DragBoxEvent#boxcancel
   * @api
   */
  BOXCANCEL: "boxcancel"
};
class Ln extends Zt {
  /**
   * @param {string} type The event type.
   * @param {import("../coordinate.js").Coordinate} coordinate The event coordinate.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Originating event.
   */
  constructor(t, e, i) {
    super(t), this.coordinate = e, this.mapBrowserEvent = i;
  }
}
class Lh extends xi {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    super(), this.on, this.once, this.un, t = t || {}, this.box_ = new wh(t.className || "ol-dragbox"), this.minArea_ = t.minArea !== void 0 ? t.minArea : 64, t.onBoxEnd && (this.onBoxEnd = t.onBoxEnd), this.startPixel_ = null, this.condition_ = t.condition ? t.condition : xo, this.boxEndCondition_ = t.boxEndCondition ? t.boxEndCondition : this.defaultBoxEndCondition;
  }
  /**
   * The default condition for determining whether the boxend event
   * should fire.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent The originating MapBrowserEvent
   *     leading to the box end.
   * @param {import("../pixel.js").Pixel} startPixel The starting pixel of the box.
   * @param {import("../pixel.js").Pixel} endPixel The end pixel of the box.
   * @return {boolean} Whether or not the boxend condition should be fired.
   */
  defaultBoxEndCondition(t, e, i) {
    const n = i[0] - e[0], r = i[1] - e[1];
    return n * n + r * r >= this.minArea_;
  }
  /**
   * Returns geometry of last drawn box.
   * @return {import("../geom/Polygon.js").default} Geometry.
   * @api
   */
  getGeometry() {
    return this.box_.getGeometry();
  }
  /**
   * Handle pointer drag events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   */
  handleDragEvent(t) {
    this.box_.setPixels(this.startPixel_, t.pixel), this.dispatchEvent(
      new Ln(
        Ni.BOXDRAG,
        t.coordinate,
        t
      )
    );
  }
  /**
   * Handle pointer up events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @return {boolean} If the event was consumed.
   */
  handleUpEvent(t) {
    this.box_.setMap(null);
    const e = this.boxEndCondition_(
      t,
      this.startPixel_,
      t.pixel
    );
    return e && this.onBoxEnd(t), this.dispatchEvent(
      new Ln(
        e ? Ni.BOXEND : Ni.BOXCANCEL,
        t.coordinate,
        t
      )
    ), !1;
  }
  /**
   * Handle pointer down events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @return {boolean} If the event was consumed.
   */
  handleDownEvent(t) {
    return this.condition_(t) ? (this.startPixel_ = t.pixel, this.box_.setMap(t.map), this.box_.setPixels(this.startPixel_, this.startPixel_), this.dispatchEvent(
      new Ln(
        Ni.BOXSTART,
        t.coordinate,
        t
      )
    ), !0) : !1;
  }
  /**
   * Function to execute just before `onboxend` is fired
   * @param {import("../MapBrowserEvent.js").default} event Event.
   */
  onBoxEnd(t) {
  }
}
const Ah = Lh;
class Mh extends Ah {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    t = t || {};
    const e = t.condition ? t.condition : Eh;
    super({
      condition: e,
      className: t.className || "ol-dragzoom",
      minArea: t.minArea
    }), this.duration_ = t.duration !== void 0 ? t.duration : 200, this.out_ = t.out !== void 0 ? t.out : !1;
  }
  /**
   * Function to execute just before `onboxend` is fired
   * @param {import("../MapBrowserEvent.js").default} event Event.
   */
  onBoxEnd(t) {
    const i = (
      /** @type {!import("../View.js").default} */
      this.getMap().getView()
    );
    let n = this.getGeometry();
    if (this.out_) {
      const r = i.rotatedExtentForGeometry(n), o = i.getResolutionForExtentInternal(r), a = i.getResolution() / o;
      n = n.clone(), n.scale(a * a);
    }
    i.fitInternal(n, {
      duration: this.duration_,
      easing: Ze
    });
  }
}
const Ph = Mh, le = {
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40
};
class Oh extends yi {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    super(), t = t || {}, this.defaultCondition_ = function(e) {
      return Eo(e) && Co(e);
    }, this.condition_ = t.condition !== void 0 ? t.condition : this.defaultCondition_, this.duration_ = t.duration !== void 0 ? t.duration : 100, this.pixelDelta_ = t.pixelDelta !== void 0 ? t.pixelDelta : 128;
  }
  /**
   * Handles the {@link module:ol/MapBrowserEvent~MapBrowserEvent map browser event} if it was a
   * `KeyEvent`, and decides the direction to pan to (if an arrow key was
   * pressed).
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Map browser event.
   * @return {boolean} `false` to stop event propagation.
   */
  handleEvent(t) {
    let e = !1;
    if (t.type == F.KEYDOWN) {
      const i = (
        /** @type {KeyboardEvent} */
        t.originalEvent
      ), n = i.keyCode;
      if (this.condition_(t) && (n == le.DOWN || n == le.LEFT || n == le.RIGHT || n == le.UP)) {
        const o = t.map.getView(), a = o.getResolution() * this.pixelDelta_;
        let l = 0, h = 0;
        n == le.DOWN ? h = -a : n == le.LEFT ? l = -a : n == le.RIGHT ? l = a : h = a;
        const c = [l, h];
        os(c, o.getRotation()), fh(o, c, this.duration_), i.preventDefault(), e = !0;
      }
    }
    return !e;
  }
}
const bh = Oh;
class Fh extends yi {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    super(), t = t || {}, this.condition_ = t.condition ? t.condition : Co, this.delta_ = t.delta ? t.delta : 1, this.duration_ = t.duration !== void 0 ? t.duration : 100;
  }
  /**
   * Handles the {@link module:ol/MapBrowserEvent~MapBrowserEvent map browser event} if it was a
   * `KeyEvent`, and decides whether to zoom in or out (depending on whether the
   * key pressed was '+' or '-').
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Map browser event.
   * @return {boolean} `false` to stop event propagation.
   */
  handleEvent(t) {
    let e = !1;
    if (t.type == F.KEYDOWN || t.type == F.KEYPRESS) {
      const i = (
        /** @type {KeyboardEvent} */
        t.originalEvent
      ), n = i.key;
      if (this.condition_(t) && (n === "+" || n === "-")) {
        const r = t.map, o = n === "+" ? this.delta_ : -this.delta_, a = r.getView();
        Es(a, o, void 0, this.duration_), i.preventDefault(), e = !0;
      }
    }
    return !e;
  }
}
const Dh = Fh;
class kh {
  /**
   * @param {number} decay Rate of decay (must be negative).
   * @param {number} minVelocity Minimum velocity (pixels/millisecond).
   * @param {number} delay Delay to consider to calculate the kinetic
   *     initial values (milliseconds).
   */
  constructor(t, e, i) {
    this.decay_ = t, this.minVelocity_ = e, this.delay_ = i, this.points_ = [], this.angle_ = 0, this.initialVelocity_ = 0;
  }
  /**
   * FIXME empty description for jsdoc
   */
  begin() {
    this.points_.length = 0, this.angle_ = 0, this.initialVelocity_ = 0;
  }
  /**
   * @param {number} x X.
   * @param {number} y Y.
   */
  update(t, e) {
    this.points_.push(t, e, Date.now());
  }
  /**
   * @return {boolean} Whether we should do kinetic animation.
   */
  end() {
    if (this.points_.length < 6)
      return !1;
    const t = Date.now() - this.delay_, e = this.points_.length - 3;
    if (this.points_[e + 2] < t)
      return !1;
    let i = e - 3;
    for (; i > 0 && this.points_[i + 2] > t; )
      i -= 3;
    const n = this.points_[e + 2] - this.points_[i + 2];
    if (n < 1e3 / 60)
      return !1;
    const r = this.points_[e] - this.points_[i], o = this.points_[e + 1] - this.points_[i + 1];
    return this.angle_ = Math.atan2(o, r), this.initialVelocity_ = Math.sqrt(r * r + o * o) / n, this.initialVelocity_ > this.minVelocity_;
  }
  /**
   * @return {number} Total distance travelled (pixels).
   */
  getDistance() {
    return (this.minVelocity_ - this.initialVelocity_) / this.decay_;
  }
  /**
   * @return {number} Angle of the kinetic panning animation (radians).
   */
  getAngle() {
    return this.angle_;
  }
}
const Nh = kh;
class Gh extends yi {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    t = t || {}, super(
      /** @type {import("./Interaction.js").InteractionOptions} */
      t
    ), this.totalDelta_ = 0, this.lastDelta_ = 0, this.maxDelta_ = t.maxDelta !== void 0 ? t.maxDelta : 1, this.duration_ = t.duration !== void 0 ? t.duration : 250, this.timeout_ = t.timeout !== void 0 ? t.timeout : 80, this.useAnchor_ = t.useAnchor !== void 0 ? t.useAnchor : !0, this.constrainResolution_ = t.constrainResolution !== void 0 ? t.constrainResolution : !1;
    const e = t.condition ? t.condition : xh;
    this.condition_ = t.onFocusOnly ? Hn(yo, e) : e, this.lastAnchor_ = null, this.startTime_ = void 0, this.timeoutId_, this.mode_ = void 0, this.trackpadEventGap_ = 400, this.trackpadTimeoutId_, this.deltaPerZoom_ = 300;
  }
  /**
   * @private
   */
  endInteraction_() {
    this.trackpadTimeoutId_ = void 0;
    const t = this.getMap();
    if (!t)
      return;
    t.getView().endInteraction(
      void 0,
      this.lastDelta_ ? this.lastDelta_ > 0 ? 1 : -1 : 0,
      this.lastAnchor_
    );
  }
  /**
   * Handles the {@link module:ol/MapBrowserEvent~MapBrowserEvent map browser event} (if it was a mousewheel-event) and eventually
   * zooms the map.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Map browser event.
   * @return {boolean} `false` to stop event propagation.
   */
  handleEvent(t) {
    if (!this.condition_(t) || t.type !== F.WHEEL)
      return !0;
    const i = t.map, n = (
      /** @type {WheelEvent} */
      t.originalEvent
    );
    n.preventDefault(), this.useAnchor_ && (this.lastAnchor_ = t.coordinate);
    let r;
    if (t.type == F.WHEEL && (r = n.deltaY, oa && n.deltaMode === WheelEvent.DOM_DELTA_PIXEL && (r /= kr), n.deltaMode === WheelEvent.DOM_DELTA_LINE && (r *= 40)), r === 0)
      return !1;
    this.lastDelta_ = r;
    const o = Date.now();
    this.startTime_ === void 0 && (this.startTime_ = o), (!this.mode_ || o - this.startTime_ > this.trackpadEventGap_) && (this.mode_ = Math.abs(r) < 4 ? "trackpad" : "wheel");
    const a = i.getView();
    if (this.mode_ === "trackpad" && !(a.getConstrainResolution() || this.constrainResolution_))
      return this.trackpadTimeoutId_ ? clearTimeout(this.trackpadTimeoutId_) : (a.getAnimating() && a.cancelAnimations(), a.beginInteraction()), this.trackpadTimeoutId_ = setTimeout(
        this.endInteraction_.bind(this),
        this.timeout_
      ), a.adjustZoom(-r / this.deltaPerZoom_, this.lastAnchor_), this.startTime_ = o, !1;
    this.totalDelta_ += r;
    const l = Math.max(this.timeout_ - (o - this.startTime_), 0);
    return clearTimeout(this.timeoutId_), this.timeoutId_ = setTimeout(
      this.handleWheelZoom_.bind(this, i),
      l
    ), !1;
  }
  /**
   * @private
   * @param {import("../Map.js").default} map Map.
   */
  handleWheelZoom_(t) {
    const e = t.getView();
    e.getAnimating() && e.cancelAnimations();
    let i = -$(
      this.totalDelta_,
      -this.maxDelta_ * this.deltaPerZoom_,
      this.maxDelta_ * this.deltaPerZoom_
    ) / this.deltaPerZoom_;
    (e.getConstrainResolution() || this.constrainResolution_) && (i = i ? i > 0 ? 1 : -1 : 0), Es(e, i, this.lastAnchor_, this.duration_), this.mode_ = void 0, this.totalDelta_ = 0, this.lastAnchor_ = null, this.startTime_ = void 0, this.timeoutId_ = void 0;
  }
  /**
   * Enable or disable using the mouse's location as an anchor when zooming
   * @param {boolean} useAnchor true to zoom to the mouse's location, false
   * to zoom to the center of the map
   * @api
   */
  setMouseAnchor(t) {
    this.useAnchor_ = t, t || (this.lastAnchor_ = null);
  }
}
const Xh = Gh;
class Wh extends xi {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    t = t || {};
    const e = (
      /** @type {import("./Pointer.js").Options} */
      t
    );
    e.stopDown || (e.stopDown = on), super(e), this.anchor_ = null, this.lastAngle_ = void 0, this.rotating_ = !1, this.rotationDelta_ = 0, this.threshold_ = t.threshold !== void 0 ? t.threshold : 0.3, this.duration_ = t.duration !== void 0 ? t.duration : 250;
  }
  /**
   * Handle pointer drag events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   */
  handleDragEvent(t) {
    let e = 0;
    const i = this.targetPointers[0], n = this.targetPointers[1], r = Math.atan2(
      n.clientY - i.clientY,
      n.clientX - i.clientX
    );
    if (this.lastAngle_ !== void 0) {
      const l = r - this.lastAngle_;
      this.rotationDelta_ += l, !this.rotating_ && Math.abs(this.rotationDelta_) > this.threshold_ && (this.rotating_ = !0), e = l;
    }
    this.lastAngle_ = r;
    const o = t.map, a = o.getView();
    a.getConstraints().rotation !== fs && (this.anchor_ = o.getCoordinateFromPixelInternal(
      o.getEventPixel(Cs(this.targetPointers))
    ), this.rotating_ && (o.render(), a.adjustRotationInternal(e, this.anchor_)));
  }
  /**
   * Handle pointer up events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @return {boolean} If the event was consumed.
   */
  handleUpEvent(t) {
    return this.targetPointers.length < 2 ? (t.map.getView().endInteraction(this.duration_), !1) : !0;
  }
  /**
   * Handle pointer down events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @return {boolean} If the event was consumed.
   */
  handleDownEvent(t) {
    if (this.targetPointers.length >= 2) {
      const e = t.map;
      return this.anchor_ = null, this.lastAngle_ = void 0, this.rotating_ = !1, this.rotationDelta_ = 0, this.handlingDownUpSequence || e.getView().beginInteraction(), !0;
    }
    return !1;
  }
}
const zh = Wh;
class Yh extends xi {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    t = t || {};
    const e = (
      /** @type {import("./Pointer.js").Options} */
      t
    );
    e.stopDown || (e.stopDown = on), super(e), this.anchor_ = null, this.duration_ = t.duration !== void 0 ? t.duration : 400, this.lastDistance_ = void 0, this.lastScaleDelta_ = 1;
  }
  /**
   * Handle pointer drag events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   */
  handleDragEvent(t) {
    let e = 1;
    const i = this.targetPointers[0], n = this.targetPointers[1], r = i.clientX - n.clientX, o = i.clientY - n.clientY, a = Math.sqrt(r * r + o * o);
    this.lastDistance_ !== void 0 && (e = this.lastDistance_ / a), this.lastDistance_ = a;
    const l = t.map, h = l.getView();
    e != 1 && (this.lastScaleDelta_ = e), this.anchor_ = l.getCoordinateFromPixelInternal(
      l.getEventPixel(Cs(this.targetPointers))
    ), l.render(), h.adjustResolutionInternal(e, this.anchor_);
  }
  /**
   * Handle pointer up events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @return {boolean} If the event was consumed.
   */
  handleUpEvent(t) {
    if (this.targetPointers.length < 2) {
      const i = t.map.getView(), n = this.lastScaleDelta_ > 1 ? 1 : -1;
      return i.endInteraction(this.duration_, n), !1;
    }
    return !0;
  }
  /**
   * Handle pointer down events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @return {boolean} If the event was consumed.
   */
  handleDownEvent(t) {
    if (this.targetPointers.length >= 2) {
      const e = t.map;
      return this.anchor_ = null, this.lastDistance_ = void 0, this.lastScaleDelta_ = 1, this.handlingDownUpSequence || e.getView().beginInteraction(), !0;
    }
    return !1;
  }
}
const Bh = Yh;
function Zh(s) {
  s = s || {};
  const t = new At(), e = new Nh(-5e-3, 0.05, 100);
  return (s.altShiftDragRotate !== void 0 ? s.altShiftDragRotate : !0) && t.push(new Sh()), (s.doubleClickZoom !== void 0 ? s.doubleClickZoom : !0) && t.push(
    new _h({
      delta: s.zoomDelta,
      duration: s.zoomDuration
    })
  ), (s.dragPan !== void 0 ? s.dragPan : !0) && t.push(
    new Th({
      onFocusOnly: s.onFocusOnly,
      kinetic: e
    })
  ), (s.pinchRotate !== void 0 ? s.pinchRotate : !0) && t.push(new zh()), (s.pinchZoom !== void 0 ? s.pinchZoom : !0) && t.push(
    new Bh({
      duration: s.zoomDuration
    })
  ), (s.keyboard !== void 0 ? s.keyboard : !0) && (t.push(new bh()), t.push(
    new Dh({
      delta: s.zoomDelta,
      duration: s.zoomDuration
    })
  )), (s.mouseWheelZoom !== void 0 ? s.mouseWheelZoom : !0) && t.push(
    new Xh({
      onFocusOnly: s.onFocusOnly,
      duration: s.zoomDuration
    })
  ), (s.shiftDragZoom !== void 0 ? s.shiftDragZoom : !0) && t.push(
    new Ph({
      duration: s.zoomDuration
    })
  ), t;
}
function dr(s) {
  return s[0] > 0 && s[1] > 0;
}
function Kh(s, t, e) {
  return e === void 0 && (e = [0, 0]), e[0] = s[0] * t + 0.5 | 0, e[1] = s[1] * t + 0.5 | 0, e;
}
function _t(s, t) {
  return Array.isArray(s) ? s : (t === void 0 ? t = [s, s] : (t[0] = s, t[1] = s), t);
}
function Ro(s) {
  if (s instanceof gn) {
    s.setMapInternal(null);
    return;
  }
  s instanceof pn && s.getLayers().forEach(Ro);
}
function To(s, t) {
  if (s instanceof gn) {
    s.setMapInternal(t);
    return;
  }
  if (s instanceof pn) {
    const e = s.getLayers().getArray();
    for (let i = 0, n = e.length; i < n; ++i)
      To(e[i], t);
  }
}
class Uh extends St {
  /**
   * @param {MapOptions} [options] Map options.
   */
  constructor(t) {
    super(), t = t || {}, this.on, this.once, this.un;
    const e = Vh(t);
    this.renderComplete_, this.loaded_ = !0, this.boundHandleBrowserEvent_ = this.handleBrowserEvent.bind(this), this.maxTilesLoading_ = t.maxTilesLoading !== void 0 ? t.maxTilesLoading : 16, this.pixelRatio_ = t.pixelRatio !== void 0 ? t.pixelRatio : kr, this.postRenderTimeoutHandle_, this.animationDelayKey_, this.animationDelay_ = this.animationDelay_.bind(this), this.coordinateToPixelTransform_ = Pt(), this.pixelToCoordinateTransform_ = Pt(), this.frameIndex_ = 0, this.frameState_ = null, this.previousExtent_ = null, this.viewPropertyListenerKey_ = null, this.viewChangeListenerKey_ = null, this.layerGroupPropertyListenerKeys_ = null, this.viewport_ = document.createElement("div"), this.viewport_.className = "ol-viewport" + ("ontouchstart" in window ? " ol-touch" : ""), this.viewport_.style.position = "relative", this.viewport_.style.overflow = "hidden", this.viewport_.style.width = "100%", this.viewport_.style.height = "100%", this.overlayContainer_ = document.createElement("div"), this.overlayContainer_.style.position = "absolute", this.overlayContainer_.style.zIndex = "0", this.overlayContainer_.style.width = "100%", this.overlayContainer_.style.height = "100%", this.overlayContainer_.style.pointerEvents = "none", this.overlayContainer_.className = "ol-overlaycontainer", this.viewport_.appendChild(this.overlayContainer_), this.overlayContainerStopEvent_ = document.createElement("div"), this.overlayContainerStopEvent_.style.position = "absolute", this.overlayContainerStopEvent_.style.zIndex = "0", this.overlayContainerStopEvent_.style.width = "100%", this.overlayContainerStopEvent_.style.height = "100%", this.overlayContainerStopEvent_.style.pointerEvents = "none", this.overlayContainerStopEvent_.className = "ol-overlaycontainer-stopevent", this.viewport_.appendChild(this.overlayContainerStopEvent_), this.mapBrowserEventHandler_ = null, this.moveTolerance_ = t.moveTolerance, this.keyboardEventTarget_ = e.keyboardEventTarget, this.targetChangeHandlerKeys_ = null, this.targetElement_ = null, this.resizeObserver_ = new ResizeObserver(() => this.updateSize()), this.controls = e.controls || uh(), this.interactions = e.interactions || Zh({
      onFocusOnly: !0
    }), this.overlays_ = e.overlays, this.overlayIdIndex_ = {}, this.renderer_ = null, this.postRenderFunctions_ = [], this.tileQueue_ = new ih(
      this.getTilePriority.bind(this),
      this.handleTileChange_.bind(this)
    ), this.addChangeListener(
      st.LAYERGROUP,
      this.handleLayerGroupChanged_
    ), this.addChangeListener(st.VIEW, this.handleViewChanged_), this.addChangeListener(st.SIZE, this.handleSizeChanged_), this.addChangeListener(st.TARGET, this.handleTargetChanged_), this.setProperties(e.values);
    const i = this;
    t.view && !(t.view instanceof wt) && t.view.then(function(n) {
      i.setView(new wt(n));
    }), this.controls.addEventListener(
      ut.ADD,
      /**
       * @param {import("./Collection.js").CollectionEvent<import("./control/Control.js").default>} event CollectionEvent
       */
      (n) => {
        n.element.setMap(this);
      }
    ), this.controls.addEventListener(
      ut.REMOVE,
      /**
       * @param {import("./Collection.js").CollectionEvent<import("./control/Control.js").default>} event CollectionEvent.
       */
      (n) => {
        n.element.setMap(null);
      }
    ), this.interactions.addEventListener(
      ut.ADD,
      /**
       * @param {import("./Collection.js").CollectionEvent<import("./interaction/Interaction.js").default>} event CollectionEvent.
       */
      (n) => {
        n.element.setMap(this);
      }
    ), this.interactions.addEventListener(
      ut.REMOVE,
      /**
       * @param {import("./Collection.js").CollectionEvent<import("./interaction/Interaction.js").default>} event CollectionEvent.
       */
      (n) => {
        n.element.setMap(null);
      }
    ), this.overlays_.addEventListener(
      ut.ADD,
      /**
       * @param {import("./Collection.js").CollectionEvent<import("./Overlay.js").default>} event CollectionEvent.
       */
      (n) => {
        this.addOverlayInternal_(n.element);
      }
    ), this.overlays_.addEventListener(
      ut.REMOVE,
      /**
       * @param {import("./Collection.js").CollectionEvent<import("./Overlay.js").default>} event CollectionEvent.
       */
      (n) => {
        const r = n.element.getId();
        r !== void 0 && delete this.overlayIdIndex_[r.toString()], n.element.setMap(null);
      }
    ), this.controls.forEach(
      /**
       * @param {import("./control/Control.js").default} control Control.
       */
      (n) => {
        n.setMap(this);
      }
    ), this.interactions.forEach(
      /**
       * @param {import("./interaction/Interaction.js").default} interaction Interaction.
       */
      (n) => {
        n.setMap(this);
      }
    ), this.overlays_.forEach(this.addOverlayInternal_.bind(this));
  }
  /**
   * Add the given control to the map.
   * @param {import("./control/Control.js").default} control Control.
   * @api
   */
  addControl(t) {
    this.getControls().push(t);
  }
  /**
   * Add the given interaction to the map. If you want to add an interaction
   * at another point of the collection use `getInteractions()` and the methods
   * available on {@link module:ol/Collection~Collection}. This can be used to
   * stop the event propagation from the handleEvent function. The interactions
   * get to handle the events in the reverse order of this collection.
   * @param {import("./interaction/Interaction.js").default} interaction Interaction to add.
   * @api
   */
  addInteraction(t) {
    this.getInteractions().push(t);
  }
  /**
   * Adds the given layer to the top of this map. If you want to add a layer
   * elsewhere in the stack, use `getLayers()` and the methods available on
   * {@link module:ol/Collection~Collection}.
   * @param {import("./layer/Base.js").default} layer Layer.
   * @api
   */
  addLayer(t) {
    this.getLayerGroup().getLayers().push(t);
  }
  /**
   * @param {import("./layer/Group.js").GroupEvent} event The layer add event.
   * @private
   */
  handleLayerAdd_(t) {
    To(t.layer, this);
  }
  /**
   * Add the given overlay to the map.
   * @param {import("./Overlay.js").default} overlay Overlay.
   * @api
   */
  addOverlay(t) {
    this.getOverlays().push(t);
  }
  /**
   * This deals with map's overlay collection changes.
   * @param {import("./Overlay.js").default} overlay Overlay.
   * @private
   */
  addOverlayInternal_(t) {
    const e = t.getId();
    e !== void 0 && (this.overlayIdIndex_[e.toString()] = t), t.setMap(this);
  }
  /**
   *
   * Clean up.
   */
  disposeInternal() {
    this.controls.clear(), this.interactions.clear(), this.overlays_.clear(), this.resizeObserver_.disconnect(), this.setTarget(null), super.disposeInternal();
  }
  /**
   * Detect features that intersect a pixel on the viewport, and execute a
   * callback with each intersecting feature. Layers included in the detection can
   * be configured through the `layerFilter` option in `options`.
   * @param {import("./pixel.js").Pixel} pixel Pixel.
   * @param {function(import("./Feature.js").FeatureLike, import("./layer/Layer.js").default<import("./source/Source").default>, import("./geom/SimpleGeometry.js").default): T} callback Feature callback. The callback will be
   *     called with two arguments. The first argument is one
   *     {@link module:ol/Feature~Feature feature} or
   *     {@link module:ol/render/Feature~RenderFeature render feature} at the pixel, the second is
   *     the {@link module:ol/layer/Layer~Layer layer} of the feature and will be null for
   *     unmanaged layers. To stop detection, callback functions can return a
   *     truthy value.
   * @param {AtPixelOptions} [options] Optional options.
   * @return {T|undefined} Callback result, i.e. the return value of last
   * callback execution, or the first truthy callback return value.
   * @template T
   * @api
   */
  forEachFeatureAtPixel(t, e, i) {
    if (!this.frameState_ || !this.renderer_)
      return;
    const n = this.getCoordinateFromPixelInternal(t);
    i = i !== void 0 ? i : {};
    const r = i.hitTolerance !== void 0 ? i.hitTolerance : 0, o = i.layerFilter !== void 0 ? i.layerFilter : ni, a = i.checkWrapped !== !1;
    return this.renderer_.forEachFeatureAtCoordinate(
      n,
      this.frameState_,
      r,
      a,
      e,
      null,
      o,
      null
    );
  }
  /**
   * Get all features that intersect a pixel on the viewport.
   * @param {import("./pixel.js").Pixel} pixel Pixel.
   * @param {AtPixelOptions} [options] Optional options.
   * @return {Array<import("./Feature.js").FeatureLike>} The detected features or
   * an empty array if none were found.
   * @api
   */
  getFeaturesAtPixel(t, e) {
    const i = [];
    return this.forEachFeatureAtPixel(
      t,
      function(n) {
        i.push(n);
      },
      e
    ), i;
  }
  /**
   * Get all layers from all layer groups.
   * @return {Array<import("./layer/Layer.js").default>} Layers.
   * @api
   */
  getAllLayers() {
    const t = [];
    function e(i) {
      i.forEach(function(n) {
        n instanceof pn ? e(n.getLayers()) : t.push(n);
      });
    }
    return e(this.getLayers()), t;
  }
  /**
   * Detect if features intersect a pixel on the viewport. Layers included in the
   * detection can be configured through the `layerFilter` option.
   * @param {import("./pixel.js").Pixel} pixel Pixel.
   * @param {AtPixelOptions} [options] Optional options.
   * @return {boolean} Is there a feature at the given pixel?
   * @api
   */
  hasFeatureAtPixel(t, e) {
    if (!this.frameState_ || !this.renderer_)
      return !1;
    const i = this.getCoordinateFromPixelInternal(t);
    e = e !== void 0 ? e : {};
    const n = e.layerFilter !== void 0 ? e.layerFilter : ni, r = e.hitTolerance !== void 0 ? e.hitTolerance : 0, o = e.checkWrapped !== !1;
    return this.renderer_.hasFeatureAtCoordinate(
      i,
      this.frameState_,
      r,
      o,
      n,
      null
    );
  }
  /**
   * Returns the coordinate in user projection for a browser event.
   * @param {MouseEvent} event Event.
   * @return {import("./coordinate.js").Coordinate} Coordinate.
   * @api
   */
  getEventCoordinate(t) {
    return this.getCoordinateFromPixel(this.getEventPixel(t));
  }
  /**
   * Returns the coordinate in view projection for a browser event.
   * @param {MouseEvent} event Event.
   * @return {import("./coordinate.js").Coordinate} Coordinate.
   */
  getEventCoordinateInternal(t) {
    return this.getCoordinateFromPixelInternal(this.getEventPixel(t));
  }
  /**
   * Returns the map pixel position for a browser event relative to the viewport.
   * @param {UIEvent|{clientX: number, clientY: number}} event Event.
   * @return {import("./pixel.js").Pixel} Pixel.
   * @api
   */
  getEventPixel(t) {
    const i = this.viewport_.getBoundingClientRect(), n = this.getSize(), r = i.width / n[0], o = i.height / n[1], a = (
      //FIXME Are we really calling this with a TouchEvent anywhere?
      "changedTouches" in t ? (
        /** @type {TouchEvent} */
        t.changedTouches[0]
      ) : (
        /** @type {MouseEvent} */
        t
      )
    );
    return [
      (a.clientX - i.left) / r,
      (a.clientY - i.top) / o
    ];
  }
  /**
   * Get the target in which this map is rendered.
   * Note that this returns what is entered as an option or in setTarget:
   * if that was an element, it returns an element; if a string, it returns that.
   * @return {HTMLElement|string|undefined} The Element or id of the Element that the
   *     map is rendered in.
   * @observable
   * @api
   */
  getTarget() {
    return (
      /** @type {HTMLElement|string|undefined} */
      this.get(st.TARGET)
    );
  }
  /**
   * Get the DOM element into which this map is rendered. In contrast to
   * `getTarget` this method always return an `Element`, or `null` if the
   * map has no target.
   * @return {HTMLElement} The element that the map is rendered in.
   * @api
   */
  getTargetElement() {
    return this.targetElement_;
  }
  /**
   * Get the coordinate for a given pixel.  This returns a coordinate in the
   * user projection.
   * @param {import("./pixel.js").Pixel} pixel Pixel position in the map viewport.
   * @return {import("./coordinate.js").Coordinate} The coordinate for the pixel position.
   * @api
   */
  getCoordinateFromPixel(t) {
    return Kn(
      this.getCoordinateFromPixelInternal(t),
      this.getView().getProjection()
    );
  }
  /**
   * Get the coordinate for a given pixel.  This returns a coordinate in the
   * map view projection.
   * @param {import("./pixel.js").Pixel} pixel Pixel position in the map viewport.
   * @return {import("./coordinate.js").Coordinate} The coordinate for the pixel position.
   */
  getCoordinateFromPixelInternal(t) {
    const e = this.frameState_;
    return e ? et(e.pixelToCoordinateTransform, t.slice()) : null;
  }
  /**
   * Get the map controls. Modifying this collection changes the controls
   * associated with the map.
   * @return {Collection<import("./control/Control.js").default>} Controls.
   * @api
   */
  getControls() {
    return this.controls;
  }
  /**
   * Get the map overlays. Modifying this collection changes the overlays
   * associated with the map.
   * @return {Collection<import("./Overlay.js").default>} Overlays.
   * @api
   */
  getOverlays() {
    return this.overlays_;
  }
  /**
   * Get an overlay by its identifier (the value returned by overlay.getId()).
   * Note that the index treats string and numeric identifiers as the same. So
   * `map.getOverlayById(2)` will return an overlay with id `'2'` or `2`.
   * @param {string|number} id Overlay identifier.
   * @return {import("./Overlay.js").default} Overlay.
   * @api
   */
  getOverlayById(t) {
    const e = this.overlayIdIndex_[t.toString()];
    return e !== void 0 ? e : null;
  }
  /**
   * Get the map interactions. Modifying this collection changes the interactions
   * associated with the map.
   *
   * Interactions are used for e.g. pan, zoom and rotate.
   * @return {Collection<import("./interaction/Interaction.js").default>} Interactions.
   * @api
   */
  getInteractions() {
    return this.interactions;
  }
  /**
   * Get the layergroup associated with this map.
   * @return {LayerGroup} A layer group containing the layers in this map.
   * @observable
   * @api
   */
  getLayerGroup() {
    return (
      /** @type {LayerGroup} */
      this.get(st.LAYERGROUP)
    );
  }
  /**
   * Clear any existing layers and add layers to the map.
   * @param {Array<import("./layer/Base.js").default>|Collection<import("./layer/Base.js").default>} layers The layers to be added to the map.
   * @api
   */
  setLayers(t) {
    const e = this.getLayerGroup();
    if (t instanceof At) {
      e.setLayers(t);
      return;
    }
    const i = e.getLayers();
    i.clear(), i.extend(t);
  }
  /**
   * Get the collection of layers associated with this map.
   * @return {!Collection<import("./layer/Base.js").default>} Layers.
   * @api
   */
  getLayers() {
    return this.getLayerGroup().getLayers();
  }
  /**
   * @return {boolean} Layers have sources that are still loading.
   */
  getLoadingOrNotReady() {
    const t = this.getLayerGroup().getLayerStatesArray();
    for (let e = 0, i = t.length; e < i; ++e) {
      const n = t[e];
      if (!n.visible)
        continue;
      const r = n.layer.getRenderer();
      if (r && !r.ready)
        return !0;
      const o = n.layer.getSource();
      if (o && o.loading)
        return !0;
    }
    return !1;
  }
  /**
   * Get the pixel for a coordinate.  This takes a coordinate in the user
   * projection and returns the corresponding pixel.
   * @param {import("./coordinate.js").Coordinate} coordinate A map coordinate.
   * @return {import("./pixel.js").Pixel} A pixel position in the map viewport.
   * @api
   */
  getPixelFromCoordinate(t) {
    const e = Xt(
      t,
      this.getView().getProjection()
    );
    return this.getPixelFromCoordinateInternal(e);
  }
  /**
   * Get the pixel for a coordinate.  This takes a coordinate in the map view
   * projection and returns the corresponding pixel.
   * @param {import("./coordinate.js").Coordinate} coordinate A map coordinate.
   * @return {import("./pixel.js").Pixel} A pixel position in the map viewport.
   */
  getPixelFromCoordinateInternal(t) {
    const e = this.frameState_;
    return e ? et(
      e.coordinateToPixelTransform,
      t.slice(0, 2)
    ) : null;
  }
  /**
   * Get the map renderer.
   * @return {import("./renderer/Map.js").default|null} Renderer
   */
  getRenderer() {
    return this.renderer_;
  }
  /**
   * Get the size of this map.
   * @return {import("./size.js").Size|undefined} The size in pixels of the map in the DOM.
   * @observable
   * @api
   */
  getSize() {
    return (
      /** @type {import("./size.js").Size|undefined} */
      this.get(st.SIZE)
    );
  }
  /**
   * Get the view associated with this map. A view manages properties such as
   * center and resolution.
   * @return {View} The view that controls this map.
   * @observable
   * @api
   */
  getView() {
    return (
      /** @type {View} */
      this.get(st.VIEW)
    );
  }
  /**
   * Get the element that serves as the map viewport.
   * @return {HTMLElement} Viewport.
   * @api
   */
  getViewport() {
    return this.viewport_;
  }
  /**
   * Get the element that serves as the container for overlays.  Elements added to
   * this container will let mousedown and touchstart events through to the map,
   * so clicks and gestures on an overlay will trigger {@link module:ol/MapBrowserEvent~MapBrowserEvent}
   * events.
   * @return {!HTMLElement} The map's overlay container.
   */
  getOverlayContainer() {
    return this.overlayContainer_;
  }
  /**
   * Get the element that serves as a container for overlays that don't allow
   * event propagation. Elements added to this container won't let mousedown and
   * touchstart events through to the map, so clicks and gestures on an overlay
   * don't trigger any {@link module:ol/MapBrowserEvent~MapBrowserEvent}.
   * @return {!HTMLElement} The map's overlay container that stops events.
   */
  getOverlayContainerStopEvent() {
    return this.overlayContainerStopEvent_;
  }
  /**
   * @return {!Document} The document where the map is displayed.
   */
  getOwnerDocument() {
    const t = this.getTargetElement();
    return t ? t.ownerDocument : document;
  }
  /**
   * @param {import("./Tile.js").default} tile Tile.
   * @param {string} tileSourceKey Tile source key.
   * @param {import("./coordinate.js").Coordinate} tileCenter Tile center.
   * @param {number} tileResolution Tile resolution.
   * @return {number} Tile priority.
   */
  getTilePriority(t, e, i, n) {
    return nh(
      this.frameState_,
      t,
      e,
      i,
      n
    );
  }
  /**
   * @param {UIEvent} browserEvent Browser event.
   * @param {string} [type] Type.
   */
  handleBrowserEvent(t, e) {
    e = e || t.type;
    const i = new Qt(e, this, t);
    this.handleMapBrowserEvent(i);
  }
  /**
   * @param {MapBrowserEvent} mapBrowserEvent The event to handle.
   */
  handleMapBrowserEvent(t) {
    if (!this.frameState_)
      return;
    const e = (
      /** @type {PointerEvent} */
      t.originalEvent
    ), i = e.type;
    if (i === jn.POINTERDOWN || i === F.WHEEL || i === F.KEYDOWN) {
      const n = this.getOwnerDocument(), r = this.viewport_.getRootNode ? this.viewport_.getRootNode() : n, o = (
        /** @type {Node} */
        e.target
      );
      if (
        // Abort if the target is a child of the container for elements whose events are not meant
        // to be handled by map interactions.
        this.overlayContainerStopEvent_.contains(o) || // Abort if the event target is a child of the container that is no longer in the page.
        // It's possible for the target to no longer be in the page if it has been removed in an
        // event listener, this might happen in a Control that recreates it's content based on
        // user interaction either manually or via a render in something like https://reactjs.org/
        !(r === n ? n.documentElement : r).contains(o)
      )
        return;
    }
    if (t.frameState = this.frameState_, this.dispatchEvent(t) !== !1) {
      const n = this.getInteractions().getArray().slice();
      for (let r = n.length - 1; r >= 0; r--) {
        const o = n[r];
        if (o.getMap() !== this || !o.getActive() || !this.getTargetElement())
          continue;
        if (!o.handleEvent(t) || t.propagationStopped)
          break;
      }
    }
  }
  /**
   * @protected
   */
  handlePostRender() {
    const t = this.frameState_, e = this.tileQueue_;
    if (!e.isEmpty()) {
      let n = this.maxTilesLoading_, r = n;
      if (t) {
        const o = t.viewHints;
        if (o[rt.ANIMATING] || o[rt.INTERACTING]) {
          const a = Date.now() - t.time > 8;
          n = a ? 0 : 8, r = a ? 0 : 2;
        }
      }
      e.getTilesLoading() < n && (e.reprioritize(), e.loadMoreTiles(n, r));
    }
    t && this.renderer_ && !t.animate && (this.renderComplete_ === !0 ? (this.hasListener(ie.RENDERCOMPLETE) && this.renderer_.dispatchRenderEvent(
      ie.RENDERCOMPLETE,
      t
    ), this.loaded_ === !1 && (this.loaded_ = !0, this.dispatchEvent(
      new Pe(zt.LOADEND, this, t)
    ))) : this.loaded_ === !0 && (this.loaded_ = !1, this.dispatchEvent(
      new Pe(zt.LOADSTART, this, t)
    )));
    const i = this.postRenderFunctions_;
    for (let n = 0, r = i.length; n < r; ++n)
      i[n](this, t);
    i.length = 0;
  }
  /**
   * @private
   */
  handleSizeChanged_() {
    this.getView() && !this.getView().getAnimating() && this.getView().resolveConstraints(0), this.render();
  }
  /**
   * @private
   */
  handleTargetChanged_() {
    if (this.mapBrowserEventHandler_) {
      for (let i = 0, n = this.targetChangeHandlerKeys_.length; i < n; ++i)
        j(this.targetChangeHandlerKeys_[i]);
      this.targetChangeHandlerKeys_ = null, this.viewport_.removeEventListener(
        F.CONTEXTMENU,
        this.boundHandleBrowserEvent_
      ), this.viewport_.removeEventListener(
        F.WHEEL,
        this.boundHandleBrowserEvent_
      ), this.mapBrowserEventHandler_.dispose(), this.mapBrowserEventHandler_ = null, Qi(this.viewport_);
    }
    if (this.targetElement_) {
      this.resizeObserver_.unobserve(this.targetElement_);
      const i = this.targetElement_.getRootNode();
      i instanceof ShadowRoot && this.resizeObserver_.unobserve(i.host);
    }
    const t = this.getTarget(), e = typeof t == "string" ? document.getElementById(t) : t;
    if (this.targetElement_ = e, !e)
      this.renderer_ && (clearTimeout(this.postRenderTimeoutHandle_), this.postRenderTimeoutHandle_ = void 0, this.postRenderFunctions_.length = 0, this.renderer_.dispose(), this.renderer_ = null), this.animationDelayKey_ && (cancelAnimationFrame(this.animationDelayKey_), this.animationDelayKey_ = void 0);
    else {
      e.appendChild(this.viewport_), this.renderer_ || (this.renderer_ = new jl(this)), this.mapBrowserEventHandler_ = new Jl(
        this,
        this.moveTolerance_
      );
      for (const r in H)
        this.mapBrowserEventHandler_.addEventListener(
          H[r],
          this.handleMapBrowserEvent.bind(this)
        );
      this.viewport_.addEventListener(
        F.CONTEXTMENU,
        this.boundHandleBrowserEvent_,
        !1
      ), this.viewport_.addEventListener(
        F.WHEEL,
        this.boundHandleBrowserEvent_,
        Nr ? { passive: !1 } : !1
      );
      const i = this.keyboardEventTarget_ ? this.keyboardEventTarget_ : e;
      this.targetChangeHandlerKeys_ = [
        G(
          i,
          F.KEYDOWN,
          this.handleBrowserEvent,
          this
        ),
        G(
          i,
          F.KEYPRESS,
          this.handleBrowserEvent,
          this
        )
      ];
      const n = e.getRootNode();
      n instanceof ShadowRoot && this.resizeObserver_.observe(n.host), this.resizeObserver_.observe(e);
    }
    this.updateSize();
  }
  /**
   * @private
   */
  handleTileChange_() {
    this.render();
  }
  /**
   * @private
   */
  handleViewPropertyChanged_() {
    this.render();
  }
  /**
   * @private
   */
  handleViewChanged_() {
    this.viewPropertyListenerKey_ && (j(this.viewPropertyListenerKey_), this.viewPropertyListenerKey_ = null), this.viewChangeListenerKey_ && (j(this.viewChangeListenerKey_), this.viewChangeListenerKey_ = null);
    const t = this.getView();
    t && (this.updateViewportSize_(), this.viewPropertyListenerKey_ = G(
      t,
      Xe.PROPERTYCHANGE,
      this.handleViewPropertyChanged_,
      this
    ), this.viewChangeListenerKey_ = G(
      t,
      F.CHANGE,
      this.handleViewPropertyChanged_,
      this
    ), t.resolveConstraints(0)), this.render();
  }
  /**
   * @private
   */
  handleLayerGroupChanged_() {
    this.layerGroupPropertyListenerKeys_ && (this.layerGroupPropertyListenerKeys_.forEach(j), this.layerGroupPropertyListenerKeys_ = null);
    const t = this.getLayerGroup();
    t && (this.handleLayerAdd_(new te("addlayer", t)), this.layerGroupPropertyListenerKeys_ = [
      G(t, Xe.PROPERTYCHANGE, this.render, this),
      G(t, F.CHANGE, this.render, this),
      G(t, "addlayer", this.handleLayerAdd_, this),
      G(t, "removelayer", this.handleLayerRemove_, this)
    ]), this.render();
  }
  /**
   * @return {boolean} Is rendered.
   */
  isRendered() {
    return !!this.frameState_;
  }
  /**
   * @private
   */
  animationDelay_() {
    this.animationDelayKey_ = void 0, this.renderFrame_(Date.now());
  }
  /**
   * Requests an immediate render in a synchronous manner.
   * @api
   */
  renderSync() {
    this.animationDelayKey_ && cancelAnimationFrame(this.animationDelayKey_), this.animationDelay_();
  }
  /**
   * Redraws all text after new fonts have loaded
   */
  redrawText() {
    const t = this.getLayerGroup().getLayerStatesArray();
    for (let e = 0, i = t.length; e < i; ++e) {
      const n = t[e].layer;
      n.hasRenderer() && n.getRenderer().handleFontsChanged();
    }
  }
  /**
   * Request a map rendering (at the next animation frame).
   * @api
   */
  render() {
    this.renderer_ && this.animationDelayKey_ === void 0 && (this.animationDelayKey_ = requestAnimationFrame(this.animationDelay_));
  }
  /**
   * Remove the given control from the map.
   * @param {import("./control/Control.js").default} control Control.
   * @return {import("./control/Control.js").default|undefined} The removed control (or undefined
   *     if the control was not found).
   * @api
   */
  removeControl(t) {
    return this.getControls().remove(t);
  }
  /**
   * Remove the given interaction from the map.
   * @param {import("./interaction/Interaction.js").default} interaction Interaction to remove.
   * @return {import("./interaction/Interaction.js").default|undefined} The removed interaction (or
   *     undefined if the interaction was not found).
   * @api
   */
  removeInteraction(t) {
    return this.getInteractions().remove(t);
  }
  /**
   * Removes the given layer from the map.
   * @param {import("./layer/Base.js").default} layer Layer.
   * @return {import("./layer/Base.js").default|undefined} The removed layer (or undefined if the
   *     layer was not found).
   * @api
   */
  removeLayer(t) {
    return this.getLayerGroup().getLayers().remove(t);
  }
  /**
   * @param {import("./layer/Group.js").GroupEvent} event The layer remove event.
   * @private
   */
  handleLayerRemove_(t) {
    Ro(t.layer);
  }
  /**
   * Remove the given overlay from the map.
   * @param {import("./Overlay.js").default} overlay Overlay.
   * @return {import("./Overlay.js").default|undefined} The removed overlay (or undefined
   *     if the overlay was not found).
   * @api
   */
  removeOverlay(t) {
    return this.getOverlays().remove(t);
  }
  /**
   * @param {number} time Time.
   * @private
   */
  renderFrame_(t) {
    const e = this.getSize(), i = this.getView(), n = this.frameState_;
    let r = null;
    if (e !== void 0 && dr(e) && i && i.isDef()) {
      const o = i.getHints(
        this.frameState_ ? this.frameState_.viewHints : void 0
      ), a = i.getState();
      if (r = {
        animate: !1,
        coordinateToPixelTransform: this.coordinateToPixelTransform_,
        declutterTree: null,
        extent: zn(
          a.center,
          a.resolution,
          a.rotation,
          e
        ),
        index: this.frameIndex_++,
        layerIndex: 0,
        layerStatesArray: this.getLayerGroup().getLayerStatesArray(),
        pixelRatio: this.pixelRatio_,
        pixelToCoordinateTransform: this.pixelToCoordinateTransform_,
        postRenderFunctions: [],
        size: e,
        tileQueue: this.tileQueue_,
        time: t,
        usedTiles: {},
        viewState: a,
        viewHints: o,
        wantedTiles: {},
        mapId: z(this),
        renderTargets: {}
      }, a.nextCenter && a.nextResolution) {
        const l = isNaN(a.nextRotation) ? a.rotation : a.nextRotation;
        r.nextExtent = zn(
          a.nextCenter,
          a.nextResolution,
          l,
          e
        );
      }
    }
    this.frameState_ = r, this.renderer_.renderFrame(r), r && (r.animate && this.render(), Array.prototype.push.apply(
      this.postRenderFunctions_,
      r.postRenderFunctions
    ), n && (!this.previousExtent_ || !ns(this.previousExtent_) && !ri(r.extent, this.previousExtent_)) && (this.dispatchEvent(
      new Pe(zt.MOVESTART, this, n)
    ), this.previousExtent_ = cn(this.previousExtent_)), this.previousExtent_ && !r.viewHints[rt.ANIMATING] && !r.viewHints[rt.INTERACTING] && !ri(r.extent, this.previousExtent_) && (this.dispatchEvent(
      new Pe(zt.MOVEEND, this, r)
    ), Xr(r.extent, this.previousExtent_))), this.dispatchEvent(new Pe(zt.POSTRENDER, this, r)), this.renderComplete_ = this.hasListener(zt.LOADSTART) || this.hasListener(zt.LOADEND) || this.hasListener(ie.RENDERCOMPLETE) ? !this.tileQueue_.getTilesLoading() && !this.tileQueue_.getCount() && !this.getLoadingOrNotReady() : void 0, this.postRenderTimeoutHandle_ || (this.postRenderTimeoutHandle_ = setTimeout(() => {
      this.postRenderTimeoutHandle_ = void 0, this.handlePostRender();
    }, 0));
  }
  /**
   * Sets the layergroup of this map.
   * @param {LayerGroup} layerGroup A layer group containing the layers in this map.
   * @observable
   * @api
   */
  setLayerGroup(t) {
    const e = this.getLayerGroup();
    e && this.handleLayerRemove_(new te("removelayer", e)), this.set(st.LAYERGROUP, t);
  }
  /**
   * Set the size of this map.
   * @param {import("./size.js").Size|undefined} size The size in pixels of the map in the DOM.
   * @observable
   * @api
   */
  setSize(t) {
    this.set(st.SIZE, t);
  }
  /**
   * Set the target element to render this map into.
   * @param {HTMLElement|string} [target] The Element or id of the Element
   *     that the map is rendered in.
   * @observable
   * @api
   */
  setTarget(t) {
    this.set(st.TARGET, t);
  }
  /**
   * Set the view for this map.
   * @param {View|Promise<import("./View.js").ViewOptions>} view The view that controls this map.
   * It is also possible to pass a promise that resolves to options for constructing a view.  This
   * alternative allows view properties to be resolved by sources or other components that load
   * view-related metadata.
   * @observable
   * @api
   */
  setView(t) {
    if (!t || t instanceof wt) {
      this.set(st.VIEW, t);
      return;
    }
    this.set(st.VIEW, new wt());
    const e = this;
    t.then(function(i) {
      e.setView(new wt(i));
    });
  }
  /**
   * Force a recalculation of the map viewport size.  This should be called when
   * third-party code changes the size of the map viewport.
   * @api
   */
  updateSize() {
    const t = this.getTargetElement();
    let e;
    if (t) {
      const n = getComputedStyle(t), r = t.offsetWidth - parseFloat(n.borderLeftWidth) - parseFloat(n.paddingLeft) - parseFloat(n.paddingRight) - parseFloat(n.borderRightWidth), o = t.offsetHeight - parseFloat(n.borderTopWidth) - parseFloat(n.paddingTop) - parseFloat(n.paddingBottom) - parseFloat(n.borderBottomWidth);
      !isNaN(r) && !isNaN(o) && (e = [r, o], !dr(e) && (t.offsetWidth || t.offsetHeight || t.getClientRects().length) && qr(
        "No map visible because the map container's width or height are 0."
      ));
    }
    const i = this.getSize();
    e && (!i || !re(e, i)) && (this.setSize(e), this.updateViewportSize_());
  }
  /**
   * Recomputes the viewport size and save it on the view object (if any)
   * @private
   */
  updateViewportSize_() {
    const t = this.getView();
    if (t) {
      let e;
      const i = getComputedStyle(this.viewport_);
      i.width && i.height && (e = [
        parseInt(i.width, 10),
        parseInt(i.height, 10)
      ]), t.setViewportSize(e);
    }
  }
}
function Vh(s) {
  let t = null;
  s.keyboardEventTarget !== void 0 && (t = typeof s.keyboardEventTarget == "string" ? document.getElementById(s.keyboardEventTarget) : s.keyboardEventTarget);
  const e = {}, i = s.layers && typeof /** @type {?} */
  s.layers.getLayers == "function" ? (
    /** @type {LayerGroup} */
    s.layers
  ) : new pn({
    layers: (
      /** @type {Collection<import("./layer/Base.js").default>|Array<import("./layer/Base.js").default>} */
      s.layers
    )
  });
  e[st.LAYERGROUP] = i, e[st.TARGET] = s.target, e[st.VIEW] = s.view instanceof wt ? s.view : new wt();
  let n;
  s.controls !== void 0 && (Array.isArray(s.controls) ? n = new At(s.controls.slice()) : (k(
    typeof /** @type {?} */
    s.controls.getArray == "function",
    47
  ), n = s.controls));
  let r;
  s.interactions !== void 0 && (Array.isArray(s.interactions) ? r = new At(s.interactions.slice()) : (k(
    typeof /** @type {?} */
    s.interactions.getArray == "function",
    48
  ), r = s.interactions));
  let o;
  return s.overlays !== void 0 ? Array.isArray(s.overlays) ? o = new At(s.overlays.slice()) : (k(
    typeof /** @type {?} */
    s.overlays.getArray == "function",
    49
  ), o = s.overlays) : o = new At(), {
    controls: n,
    interactions: r,
    keyboardEventTarget: t,
    overlays: o,
    values: e
  };
}
const jh = Uh, Gi = {
  PRELOAD: "preload",
  USE_INTERIM_TILES_ON_ERROR: "useInterimTilesOnError"
};
class Hh extends gn {
  /**
   * @param {Options<TileSourceType>} [options] Tile layer options.
   */
  constructor(t) {
    t = t || {};
    const e = Object.assign({}, t);
    delete e.preload, delete e.useInterimTilesOnError, super(e), this.on, this.once, this.un, this.setPreload(t.preload !== void 0 ? t.preload : 0), this.setUseInterimTilesOnError(
      t.useInterimTilesOnError !== void 0 ? t.useInterimTilesOnError : !0
    );
  }
  /**
   * Return the level as number to which we will preload tiles up to.
   * @return {number} The level to preload tiles up to.
   * @observable
   * @api
   */
  getPreload() {
    return (
      /** @type {number} */
      this.get(Gi.PRELOAD)
    );
  }
  /**
   * Set the level as number to which we will preload tiles up to.
   * @param {number} preload The level to preload tiles up to.
   * @observable
   * @api
   */
  setPreload(t) {
    this.set(Gi.PRELOAD, t);
  }
  /**
   * Whether we use interim tiles on error.
   * @return {boolean} Use interim tiles on error.
   * @observable
   * @api
   */
  getUseInterimTilesOnError() {
    return (
      /** @type {boolean} */
      this.get(Gi.USE_INTERIM_TILES_ON_ERROR)
    );
  }
  /**
   * Set whether we use interim tiles on error.
   * @param {boolean} useInterimTilesOnError Use interim tiles on error.
   * @observable
   * @api
   */
  setUseInterimTilesOnError(t) {
    this.set(Gi.USE_INTERIM_TILES_ON_ERROR, t);
  }
  /**
   * Get data for a pixel location.  The return type depends on the source data.  For image tiles,
   * a four element RGBA array will be returned.  For data tiles, the array length will match the
   * number of bands in the dataset.  For requests outside the layer extent, `null` will be returned.
   * Data for a image tiles can only be retrieved if the source's `crossOrigin` property is set.
   *
   * ```js
   * // display layer data on every pointer move
   * map.on('pointermove', (event) => {
   *   console.log(layer.getData(event.pixel));
   * });
   * ```
   * @param {import("../pixel").Pixel} pixel Pixel.
   * @return {Uint8ClampedArray|Uint8Array|Float32Array|DataView|null} Pixel data.
   * @api
   */
  getData(t) {
    return super.getData(t);
  }
}
const $h = Hh, J = {
  IDLE: 0,
  LOADING: 1,
  LOADED: 2,
  ERROR: 3,
  EMPTY: 4
};
class qh extends Fr {
  /**
   * @param {LayerType} layer Layer.
   */
  constructor(t) {
    super(), this.ready = !0, this.boundHandleImageChange_ = this.handleImageChange_.bind(this), this.layer_ = t, this.declutterExecutorGroup = null;
  }
  /**
   * Asynchronous layer level hit detection.
   * @param {import("../pixel.js").Pixel} pixel Pixel.
   * @return {Promise<Array<import("../Feature").FeatureLike>>} Promise that resolves with
   * an array of features.
   */
  getFeatures(t) {
    return W();
  }
  /**
   * @param {import("../pixel.js").Pixel} pixel Pixel.
   * @return {Uint8ClampedArray|Uint8Array|Float32Array|DataView|null} Pixel data.
   */
  getData(t) {
    return null;
  }
  /**
   * Determine whether render should be called.
   * @abstract
   * @param {import("../Map.js").FrameState} frameState Frame state.
   * @return {boolean} Layer is ready to be rendered.
   */
  prepareFrame(t) {
    return W();
  }
  /**
   * Render the layer.
   * @abstract
   * @param {import("../Map.js").FrameState} frameState Frame state.
   * @param {HTMLElement} target Target that may be used to render content to.
   * @return {HTMLElement} The rendered element.
   */
  renderFrame(t, e) {
    return W();
  }
  /**
   * @param {Object<number, Object<string, import("../Tile.js").default>>} tiles Lookup of loaded tiles by zoom level.
   * @param {number} zoom Zoom level.
   * @param {import("../Tile.js").default} tile Tile.
   * @return {boolean|void} If `false`, the tile will not be considered loaded.
   */
  loadedTileCallback(t, e, i) {
    t[e] || (t[e] = {}), t[e][i.tileCoord.toString()] = i;
  }
  /**
   * Create a function that adds loaded tiles to the tile lookup.
   * @param {import("../source/Tile.js").default} source Tile source.
   * @param {import("../proj/Projection.js").default} projection Projection of the tiles.
   * @param {Object<number, Object<string, import("../Tile.js").default>>} tiles Lookup of loaded tiles by zoom level.
   * @return {function(number, import("../TileRange.js").default):boolean} A function that can be
   *     called with a zoom level and a tile range to add loaded tiles to the lookup.
   * @protected
   */
  createLoadedTileFinder(t, e, i) {
    return (
      /**
       * @param {number} zoom Zoom level.
       * @param {import("../TileRange.js").default} tileRange Tile range.
       * @return {boolean} The tile range is fully loaded.
       */
      (n, r) => {
        const o = this.loadedTileCallback.bind(this, i, n);
        return t.forEachLoadedTile(e, n, r, o);
      }
    );
  }
  /**
   * @abstract
   * @param {import("../coordinate.js").Coordinate} coordinate Coordinate.
   * @param {import("../Map.js").FrameState} frameState Frame state.
   * @param {number} hitTolerance Hit tolerance in pixels.
   * @param {import("./vector.js").FeatureCallback<T>} callback Feature callback.
   * @param {Array<import("./Map.js").HitMatch<T>>} matches The hit detected matches with tolerance.
   * @return {T|undefined} Callback result.
   * @template T
   */
  forEachFeatureAtCoordinate(t, e, i, n, r) {
  }
  /**
   * @return {LayerType} Layer.
   */
  getLayer() {
    return this.layer_;
  }
  /**
   * Perform action necessary to get the layer rendered after new fonts have loaded
   * @abstract
   */
  handleFontsChanged() {
  }
  /**
   * Handle changes in image state.
   * @param {import("../events/Event.js").default} event Image change event.
   * @private
   */
  handleImageChange_(t) {
    /** @type {import("../Image.js").default} */
    t.target.getState() === J.LOADED && this.renderIfReadyAndVisible();
  }
  /**
   * Load the image if not already loaded, and register the image change
   * listener if needed.
   * @param {import("../ImageBase.js").default} image Image.
   * @return {boolean} `true` if the image is already loaded, `false` otherwise.
   * @protected
   */
  loadImage(t) {
    let e = t.getState();
    return e != J.LOADED && e != J.ERROR && t.addEventListener(F.CHANGE, this.boundHandleImageChange_), e == J.IDLE && (t.load(), e = t.getState()), e == J.LOADED;
  }
  /**
   * @protected
   */
  renderIfReadyAndVisible() {
    const t = this.getLayer();
    t && t.getVisible() && t.getSourceState() === "ready" && t.changed();
  }
  /**
   * Clean up.
   */
  disposeInternal() {
    delete this.layer_, super.disposeInternal();
  }
}
const Jh = qh, fr = [];
let Oe = null;
function Qh() {
  Oe = lt(1, 1, void 0, {
    willReadFrequently: !0
  });
}
class tc extends Jh {
  /**
   * @param {LayerType} layer Layer.
   */
  constructor(t) {
    super(t), this.container = null, this.renderedResolution, this.tempTransform = Pt(), this.pixelTransform = Pt(), this.inversePixelTransform = Pt(), this.context = null, this.containerReused = !1, this.pixelContext_ = null, this.frameState = null;
  }
  /**
   * @param {HTMLCanvasElement|HTMLImageElement|HTMLVideoElement} image Image.
   * @param {number} col The column index.
   * @param {number} row The row index.
   * @return {Uint8ClampedArray|null} The image data.
   */
  getImageData(t, e, i) {
    Oe || Qh(), Oe.clearRect(0, 0, 1, 1);
    let n;
    try {
      Oe.drawImage(t, e, i, 1, 1, 0, 0, 1, 1), n = Oe.getImageData(0, 0, 1, 1).data;
    } catch (r) {
      return Oe = null, null;
    }
    return n;
  }
  /**
   * @param {import('../../Map.js').FrameState} frameState Frame state.
   * @return {string} Background color.
   */
  getBackground(t) {
    let i = this.getLayer().getBackground();
    return typeof i == "function" && (i = i(t.viewState.resolution)), i || void 0;
  }
  /**
   * Get a rendering container from an existing target, if compatible.
   * @param {HTMLElement} target Potential render target.
   * @param {string} transform CSS Transform.
   * @param {string} [backgroundColor] Background color.
   */
  useContainer(t, e, i) {
    const n = this.getLayer().getClassName();
    let r, o;
    if (t && t.className === n && (!i || t && t.style.backgroundColor && re(
      Ui(t.style.backgroundColor),
      Ui(i)
    ))) {
      const a = t.firstElementChild;
      a instanceof HTMLCanvasElement && (o = a.getContext("2d"));
    }
    if (o && o.canvas.style.transform === e ? (this.container = t, this.context = o, this.containerReused = !0) : this.containerReused && (this.container = null, this.context = null, this.containerReused = !1), !this.container) {
      r = document.createElement("div"), r.className = n;
      let a = r.style;
      a.position = "absolute", a.width = "100%", a.height = "100%", o = lt();
      const l = o.canvas;
      r.appendChild(l), a = l.style, a.position = "absolute", a.left = "0", a.transformOrigin = "top left", this.container = r, this.context = o;
    }
    !this.containerReused && i && !this.container.style.backgroundColor && (this.container.style.backgroundColor = i);
  }
  /**
   * @param {CanvasRenderingContext2D} context Context.
   * @param {import("../../Map.js").FrameState} frameState Frame state.
   * @param {import("../../extent.js").Extent} extent Clip extent.
   * @protected
   */
  clipUnrotated(t, e, i) {
    const n = pe(i), r = fn(i), o = dn(i), a = un(i);
    et(e.coordinateToPixelTransform, n), et(e.coordinateToPixelTransform, r), et(e.coordinateToPixelTransform, o), et(e.coordinateToPixelTransform, a);
    const l = this.inversePixelTransform;
    et(l, n), et(l, r), et(l, o), et(l, a), t.save(), t.beginPath(), t.moveTo(Math.round(n[0]), Math.round(n[1])), t.lineTo(Math.round(r[0]), Math.round(r[1])), t.lineTo(Math.round(o[0]), Math.round(o[1])), t.lineTo(Math.round(a[0]), Math.round(a[1])), t.clip();
  }
  /**
   * @param {import("../../render/EventType.js").default} type Event type.
   * @param {CanvasRenderingContext2D} context Context.
   * @param {import("../../Map.js").FrameState} frameState Frame state.
   * @private
   */
  dispatchRenderEvent_(t, e, i) {
    const n = this.getLayer();
    if (n.hasListener(t)) {
      const r = new fo(
        t,
        this.inversePixelTransform,
        i,
        e
      );
      n.dispatchEvent(r);
    }
  }
  /**
   * @param {CanvasRenderingContext2D} context Context.
   * @param {import("../../Map.js").FrameState} frameState Frame state.
   * @protected
   */
  preRender(t, e) {
    this.frameState = e, this.dispatchRenderEvent_(ie.PRERENDER, t, e);
  }
  /**
   * @param {CanvasRenderingContext2D} context Context.
   * @param {import("../../Map.js").FrameState} frameState Frame state.
   * @protected
   */
  postRender(t, e) {
    this.dispatchRenderEvent_(ie.POSTRENDER, t, e);
  }
  /**
   * Creates a transform for rendering to an element that will be rotated after rendering.
   * @param {import("../../coordinate.js").Coordinate} center Center.
   * @param {number} resolution Resolution.
   * @param {number} rotation Rotation.
   * @param {number} pixelRatio Pixel ratio.
   * @param {number} width Width of the rendered element (in pixels).
   * @param {number} height Height of the rendered element (in pixels).
   * @param {number} offsetX Offset on the x-axis in view coordinates.
   * @protected
   * @return {!import("../../transform.js").Transform} Transform.
   */
  getRenderTransform(t, e, i, n, r, o, a) {
    const l = r / 2, h = o / 2, c = n / e, u = -c, d = -t[0] + a, f = -t[1];
    return se(
      this.tempTransform,
      l,
      h,
      c,
      u,
      -i,
      d,
      f
    );
  }
  /**
   * Clean up.
   */
  disposeInternal() {
    delete this.frameState, super.disposeInternal();
  }
}
const Io = tc;
let ec = class extends an {
  /**
   * @param {import("./tilecoord.js").TileCoord} tileCoord Tile coordinate.
   * @param {import("./TileState.js").default} state State.
   * @param {Options} [options] Tile options.
   */
  constructor(t, e, i) {
    super(), i = i || {}, this.tileCoord = t, this.state = e, this.interimTile = null, this.key = "", this.transition_ = i.transition === void 0 ? 250 : i.transition, this.transitionStarts_ = {}, this.interpolate = !!i.interpolate;
  }
  /**
   * @protected
   */
  changed() {
    this.dispatchEvent(F.CHANGE);
  }
  /**
   * Called by the tile cache when the tile is removed from the cache due to expiry
   */
  release() {
    this.state === A.ERROR && this.setState(A.EMPTY);
  }
  /**
   * @return {string} Key.
   */
  getKey() {
    return this.key + "/" + this.tileCoord;
  }
  /**
   * Get the interim tile most suitable for rendering using the chain of interim
   * tiles. This corresponds to the  most recent tile that has been loaded, if no
   * such tile exists, the original tile is returned.
   * @return {!Tile} Best tile for rendering.
   */
  getInterimTile() {
    if (!this.interimTile)
      return this;
    let t = this.interimTile;
    do {
      if (t.getState() == A.LOADED)
        return this.transition_ = 0, t;
      t = t.interimTile;
    } while (t);
    return this;
  }
  /**
   * Goes through the chain of interim tiles and discards sections of the chain
   * that are no longer relevant.
   */
  refreshInterimChain() {
    if (!this.interimTile)
      return;
    let t = this.interimTile, e = this;
    do {
      if (t.getState() == A.LOADED) {
        t.interimTile = null;
        break;
      } else
        t.getState() == A.LOADING ? e = t : t.getState() == A.IDLE ? e.interimTile = t.interimTile : e = t;
      t = e.interimTile;
    } while (t);
  }
  /**
   * Get the tile coordinate for this tile.
   * @return {import("./tilecoord.js").TileCoord} The tile coordinate.
   * @api
   */
  getTileCoord() {
    return this.tileCoord;
  }
  /**
   * @return {import("./TileState.js").default} State.
   */
  getState() {
    return this.state;
  }
  /**
   * Sets the state of this tile. If you write your own {@link module:ol/Tile~LoadFunction tileLoadFunction} ,
   * it is important to set the state correctly to {@link module:ol/TileState~ERROR}
   * when the tile cannot be loaded. Otherwise the tile cannot be removed from
   * the tile queue and will block other requests.
   * @param {import("./TileState.js").default} state State.
   * @api
   */
  setState(t) {
    if (this.state !== A.ERROR && this.state > t)
      throw new Error("Tile load sequence violation");
    this.state = t, this.changed();
  }
  /**
   * Load the image or retry if loading previously failed.
   * Loading is taken care of by the tile queue, and calling this method is
   * only needed for preloading or for reloading in case of an error.
   * @abstract
   * @api
   */
  load() {
    W();
  }
  /**
   * Get the alpha value for rendering.
   * @param {string} id An id for the renderer.
   * @param {number} time The render frame time.
   * @return {number} A number between 0 and 1.
   */
  getAlpha(t, e) {
    if (!this.transition_)
      return 1;
    let i = this.transitionStarts_[t];
    if (!i)
      i = e, this.transitionStarts_[t] = i;
    else if (i === -1)
      return 1;
    const n = e - i + 1e3 / 60;
    return n >= this.transition_ ? 1 : eo(n / this.transition_);
  }
  /**
   * Determine if a tile is in an alpha transition.  A tile is considered in
   * transition if tile.getAlpha() has not yet been called or has been called
   * and returned 1.
   * @param {string} id An id for the renderer.
   * @return {boolean} The tile is in transition.
   */
  inTransition(t) {
    return this.transition_ ? this.transitionStarts_[t] !== -1 : !1;
  }
  /**
   * Mark a transition as complete.
   * @param {string} id An id for the renderer.
   */
  endTransition(t) {
    this.transition_ && (this.transitionStarts_[t] = -1);
  }
};
const So = ec;
function vo(s, t, e) {
  const i = (
    /** @type {HTMLImageElement} */
    s
  );
  let n = !0, r = !1, o = !1;
  const a = [
    Ki(i, F.LOAD, function() {
      o = !0, r || t();
    })
  ];
  return i.src && ca ? (r = !0, i.decode().then(function() {
    n && t();
  }).catch(function(l) {
    n && (o ? t() : e());
  })) : a.push(Ki(i, F.ERROR, e)), function() {
    n = !1, a.forEach(j);
  };
}
class ic extends So {
  /**
   * @param {import("./tilecoord.js").TileCoord} tileCoord Tile coordinate.
   * @param {import("./TileState.js").default} state State.
   * @param {string} src Image source URI.
   * @param {?string} crossOrigin Cross origin.
   * @param {import("./Tile.js").LoadFunction} tileLoadFunction Tile load function.
   * @param {import("./Tile.js").Options} [options] Tile options.
   */
  constructor(t, e, i, n, r, o) {
    super(t, e, o), this.crossOrigin_ = n, this.src_ = i, this.key = i, this.image_ = new Image(), n !== null && (this.image_.crossOrigin = n), this.unlisten_ = null, this.tileLoadFunction_ = r;
  }
  /**
   * Get the HTML image element for this tile (may be a Canvas, Image, or Video).
   * @return {HTMLCanvasElement|HTMLImageElement|HTMLVideoElement} Image.
   * @api
   */
  getImage() {
    return this.image_;
  }
  /**
   * Sets an HTML image element for this tile (may be a Canvas or preloaded Image).
   * @param {HTMLCanvasElement|HTMLImageElement} element Element.
   */
  setImage(t) {
    this.image_ = t, this.state = A.LOADED, this.unlistenImage_(), this.changed();
  }
  /**
   * Tracks loading or read errors.
   *
   * @private
   */
  handleImageError_() {
    this.state = A.ERROR, this.unlistenImage_(), this.image_ = nc(), this.changed();
  }
  /**
   * Tracks successful image load.
   *
   * @private
   */
  handleImageLoad_() {
    const t = (
      /** @type {HTMLImageElement} */
      this.image_
    );
    t.naturalWidth && t.naturalHeight ? this.state = A.LOADED : this.state = A.EMPTY, this.unlistenImage_(), this.changed();
  }
  /**
   * Load the image or retry if loading previously failed.
   * Loading is taken care of by the tile queue, and calling this method is
   * only needed for preloading or for reloading in case of an error.
   *
   * To retry loading tiles on failed requests, use a custom `tileLoadFunction`
   * that checks for error status codes and reloads only when the status code is
   * 408, 429, 500, 502, 503 and 504, and only when not too many retries have been
   * made already:
   *
   * ```js
   * const retryCodes = [408, 429, 500, 502, 503, 504];
   * const retries = {};
   * source.setTileLoadFunction((tile, src) => {
   *   const image = tile.getImage();
   *   fetch(src)
   *     .then((response) => {
   *       if (retryCodes.includes(response.status)) {
   *         retries[src] = (retries[src] || 0) + 1;
   *         if (retries[src] <= 3) {
   *           setTimeout(() => tile.load(), retries[src] * 1000);
   *         }
   *         return Promise.reject();
   *       }
   *       return response.blob();
   *     })
   *     .then((blob) => {
   *       const imageUrl = URL.createObjectURL(blob);
   *       image.src = imageUrl;
   *       setTimeout(() => URL.revokeObjectURL(imageUrl), 5000);
   *     })
   *     .catch(() => tile.setState(3)); // error
   * });
   * ```
   *
   * @api
   */
  load() {
    this.state == A.ERROR && (this.state = A.IDLE, this.image_ = new Image(), this.crossOrigin_ !== null && (this.image_.crossOrigin = this.crossOrigin_)), this.state == A.IDLE && (this.state = A.LOADING, this.changed(), this.tileLoadFunction_(this, this.src_), this.unlisten_ = vo(
      this.image_,
      this.handleImageLoad_.bind(this),
      this.handleImageError_.bind(this)
    ));
  }
  /**
   * Discards event handlers which listen for load completion or errors.
   *
   * @private
   */
  unlistenImage_() {
    this.unlisten_ && (this.unlisten_(), this.unlisten_ = null);
  }
}
function nc() {
  const s = lt(1, 1);
  return s.fillStyle = "rgba(0,0,0,0)", s.fillRect(0, 0, 1, 1), s.canvas;
}
const wo = ic, sc = 0.5, rc = 10, gr = 0.25;
class oc {
  /**
   * @param {import("../proj/Projection.js").default} sourceProj Source projection.
   * @param {import("../proj/Projection.js").default} targetProj Target projection.
   * @param {import("../extent.js").Extent} targetExtent Target extent to triangulate.
   * @param {import("../extent.js").Extent} maxSourceExtent Maximal source extent that can be used.
   * @param {number} errorThreshold Acceptable error (in source units).
   * @param {?number} destinationResolution The (optional) resolution of the destination.
   */
  constructor(t, e, i, n, r, o) {
    this.sourceProj_ = t, this.targetProj_ = e;
    let a = {};
    const l = $i(this.targetProj_, this.sourceProj_);
    this.transformInv_ = function(y) {
      const x = y[0] + "/" + y[1];
      return a[x] || (a[x] = l(y)), a[x];
    }, this.maxSourceExtent_ = n, this.errorThresholdSquared_ = r * r, this.triangles_ = [], this.wrapsXInSource_ = !1, this.canWrapXInSource_ = this.sourceProj_.canWrapX() && !!n && !!this.sourceProj_.getExtent() && V(n) == V(this.sourceProj_.getExtent()), this.sourceWorldWidth_ = this.sourceProj_.getExtent() ? V(this.sourceProj_.getExtent()) : null, this.targetWorldWidth_ = this.targetProj_.getExtent() ? V(this.targetProj_.getExtent()) : null;
    const h = pe(i), c = fn(i), u = dn(i), d = un(i), f = this.transformInv_(h), g = this.transformInv_(c), _ = this.transformInv_(u), m = this.transformInv_(d), p = rc + (o ? Math.max(
      0,
      Math.ceil(
        Math.log2(
          Wn(i) / (o * o * 256 * 256)
        )
      )
    ) : 0);
    if (this.addQuad_(
      h,
      c,
      u,
      d,
      f,
      g,
      _,
      m,
      p
    ), this.wrapsXInSource_) {
      let y = 1 / 0;
      this.triangles_.forEach(function(x, E, C) {
        y = Math.min(
          y,
          x.source[0][0],
          x.source[1][0],
          x.source[2][0]
        );
      }), this.triangles_.forEach((x) => {
        if (Math.max(
          x.source[0][0],
          x.source[1][0],
          x.source[2][0]
        ) - y > this.sourceWorldWidth_ / 2) {
          const E = [
            [x.source[0][0], x.source[0][1]],
            [x.source[1][0], x.source[1][1]],
            [x.source[2][0], x.source[2][1]]
          ];
          E[0][0] - y > this.sourceWorldWidth_ / 2 && (E[0][0] -= this.sourceWorldWidth_), E[1][0] - y > this.sourceWorldWidth_ / 2 && (E[1][0] -= this.sourceWorldWidth_), E[2][0] - y > this.sourceWorldWidth_ / 2 && (E[2][0] -= this.sourceWorldWidth_);
          const C = Math.min(
            E[0][0],
            E[1][0],
            E[2][0]
          );
          Math.max(
            E[0][0],
            E[1][0],
            E[2][0]
          ) - C < this.sourceWorldWidth_ / 2 && (x.source = E);
        }
      });
    }
    a = {};
  }
  /**
   * Adds triangle to the triangulation.
   * @param {import("../coordinate.js").Coordinate} a The target a coordinate.
   * @param {import("../coordinate.js").Coordinate} b The target b coordinate.
   * @param {import("../coordinate.js").Coordinate} c The target c coordinate.
   * @param {import("../coordinate.js").Coordinate} aSrc The source a coordinate.
   * @param {import("../coordinate.js").Coordinate} bSrc The source b coordinate.
   * @param {import("../coordinate.js").Coordinate} cSrc The source c coordinate.
   * @private
   */
  addTriangle_(t, e, i, n, r, o) {
    this.triangles_.push({
      source: [n, r, o],
      target: [t, e, i]
    });
  }
  /**
   * Adds quad (points in clock-wise order) to the triangulation
   * (and reprojects the vertices) if valid.
   * Performs quad subdivision if needed to increase precision.
   *
   * @param {import("../coordinate.js").Coordinate} a The target a coordinate.
   * @param {import("../coordinate.js").Coordinate} b The target b coordinate.
   * @param {import("../coordinate.js").Coordinate} c The target c coordinate.
   * @param {import("../coordinate.js").Coordinate} d The target d coordinate.
   * @param {import("../coordinate.js").Coordinate} aSrc The source a coordinate.
   * @param {import("../coordinate.js").Coordinate} bSrc The source b coordinate.
   * @param {import("../coordinate.js").Coordinate} cSrc The source c coordinate.
   * @param {import("../coordinate.js").Coordinate} dSrc The source d coordinate.
   * @param {number} maxSubdivision Maximal allowed subdivision of the quad.
   * @private
   */
  addQuad_(t, e, i, n, r, o, a, l, h) {
    const c = Ys([r, o, a, l]), u = this.sourceWorldWidth_ ? V(c) / this.sourceWorldWidth_ : null, d = (
      /** @type {number} */
      this.sourceWorldWidth_
    ), f = this.sourceProj_.canWrapX() && u > 0.5 && u < 1;
    let g = !1;
    if (h > 0) {
      if (this.targetProj_.isGlobal() && this.targetWorldWidth_) {
        const m = Ys([t, e, i, n]);
        g = V(m) / this.targetWorldWidth_ > gr || g;
      }
      !f && this.sourceProj_.isGlobal() && u && (g = u > gr || g);
    }
    if (!g && this.maxSourceExtent_ && isFinite(c[0]) && isFinite(c[1]) && isFinite(c[2]) && isFinite(c[3]) && !at(c, this.maxSourceExtent_))
      return;
    let _ = 0;
    if (!g && (!isFinite(r[0]) || !isFinite(r[1]) || !isFinite(o[0]) || !isFinite(o[1]) || !isFinite(a[0]) || !isFinite(a[1]) || !isFinite(l[0]) || !isFinite(l[1]))) {
      if (h > 0)
        g = !0;
      else if (_ = (!isFinite(r[0]) || !isFinite(r[1]) ? 8 : 0) + (!isFinite(o[0]) || !isFinite(o[1]) ? 4 : 0) + (!isFinite(a[0]) || !isFinite(a[1]) ? 2 : 0) + (!isFinite(l[0]) || !isFinite(l[1]) ? 1 : 0), _ != 1 && _ != 2 && _ != 4 && _ != 8)
        return;
    }
    if (h > 0) {
      if (!g) {
        const m = [(t[0] + i[0]) / 2, (t[1] + i[1]) / 2], p = this.transformInv_(m);
        let y;
        f ? y = (_e(r[0], d) + _e(a[0], d)) / 2 - _e(p[0], d) : y = (r[0] + a[0]) / 2 - p[0];
        const x = (r[1] + a[1]) / 2 - p[1];
        g = y * y + x * x > this.errorThresholdSquared_;
      }
      if (g) {
        if (Math.abs(t[0] - i[0]) <= Math.abs(t[1] - i[1])) {
          const m = [(e[0] + i[0]) / 2, (e[1] + i[1]) / 2], p = this.transformInv_(m), y = [(n[0] + t[0]) / 2, (n[1] + t[1]) / 2], x = this.transformInv_(y);
          this.addQuad_(
            t,
            e,
            m,
            y,
            r,
            o,
            p,
            x,
            h - 1
          ), this.addQuad_(
            y,
            m,
            i,
            n,
            x,
            p,
            a,
            l,
            h - 1
          );
        } else {
          const m = [(t[0] + e[0]) / 2, (t[1] + e[1]) / 2], p = this.transformInv_(m), y = [(i[0] + n[0]) / 2, (i[1] + n[1]) / 2], x = this.transformInv_(y);
          this.addQuad_(
            t,
            m,
            y,
            n,
            r,
            p,
            x,
            l,
            h - 1
          ), this.addQuad_(
            m,
            e,
            i,
            y,
            p,
            o,
            a,
            x,
            h - 1
          );
        }
        return;
      }
    }
    if (f) {
      if (!this.canWrapXInSource_)
        return;
      this.wrapsXInSource_ = !0;
    }
    _ & 11 || this.addTriangle_(t, i, n, r, a, l), _ & 14 || this.addTriangle_(t, i, e, r, a, o), _ && (_ & 13 || this.addTriangle_(e, n, t, o, l, r), _ & 7 || this.addTriangle_(e, n, i, o, l, a));
  }
  /**
   * Calculates extent of the `source` coordinates from all the triangles.
   *
   * @return {import("../extent.js").Extent} Calculated extent.
   */
  calculateSourceExtent() {
    const t = Tt();
    return this.triangles_.forEach(function(e, i, n) {
      const r = e.source;
      ti(t, r[0]), ti(t, r[1]), ti(t, r[2]);
    }), t;
  }
  /**
   * @return {Array<Triangle>} Array of the calculated triangles.
   */
  getTriangles() {
    return this.triangles_;
  }
}
const ac = oc;
let An;
const Ge = [];
function _r(s, t, e, i, n) {
  s.beginPath(), s.moveTo(0, 0), s.lineTo(t, e), s.lineTo(i, n), s.closePath(), s.save(), s.clip(), s.fillRect(0, 0, Math.max(t, i) + 1, Math.max(e, n)), s.restore();
}
function Mn(s, t) {
  return Math.abs(s[t * 4] - 210) > 2 || Math.abs(s[t * 4 + 3] - 0.75 * 255) > 2;
}
function lc() {
  if (An === void 0) {
    const s = lt(6, 6, Ge);
    s.globalCompositeOperation = "lighter", s.fillStyle = "rgba(210, 0, 0, 0.75)", _r(s, 4, 5, 4, 0), _r(s, 4, 5, 0, 5);
    const t = s.getImageData(0, 0, 3, 3).data;
    An = Mn(t, 0) || Mn(t, 4) || Mn(t, 8), mn(s), Ge.push(s.canvas);
  }
  return An;
}
function mr(s, t, e, i) {
  const n = cs(e, t, s);
  let r = Hs(
    t,
    i,
    e
  );
  const o = t.getMetersPerUnit();
  o !== void 0 && (r *= o);
  const a = s.getMetersPerUnit();
  a !== void 0 && (r /= a);
  const l = s.getExtent();
  if (!l || hn(l, n)) {
    const h = Hs(s, r, n) / r;
    isFinite(h) && h > 0 && (r /= h);
  }
  return r;
}
function hc(s, t, e, i) {
  const n = Ye(e);
  let r = mr(
    s,
    t,
    n,
    i
  );
  return (!isFinite(r) || r <= 0) && Br(e, function(o) {
    return r = mr(
      s,
      t,
      o,
      i
    ), isFinite(r) && r > 0;
  }), r;
}
function cc(s, t, e, i, n, r, o, a, l, h, c, u) {
  const d = lt(
    Math.round(e * s),
    Math.round(e * t),
    Ge
  );
  if (u || (d.imageSmoothingEnabled = !1), l.length === 0)
    return d.canvas;
  d.scale(e, e);
  function f(E) {
    return Math.round(E * e) / e;
  }
  d.globalCompositeOperation = "lighter";
  const g = Tt();
  l.forEach(function(E, C, T) {
    pa(g, E.extent);
  });
  const _ = V(g), m = Ot(g), p = lt(
    Math.round(e * _ / i),
    Math.round(e * m / i),
    Ge
  );
  u || (p.imageSmoothingEnabled = !1);
  const y = e / i;
  l.forEach(function(E, C, T) {
    const v = E.extent[0] - g[0], S = -(E.extent[3] - g[3]), L = V(E.extent), O = Ot(E.extent);
    E.image.width > 0 && E.image.height > 0 && p.drawImage(
      E.image,
      h,
      h,
      E.image.width - 2 * h,
      E.image.height - 2 * h,
      v * y,
      S * y,
      L * y,
      O * y
    );
  });
  const x = pe(o);
  return a.getTriangles().forEach(function(E, C, T) {
    const v = E.source, S = E.target;
    let L = v[0][0], O = v[0][1], X = v[1][0], N = v[1][1], D = v[2][0], q = v[2][1];
    const w = f((S[0][0] - x[0]) / r), P = f(
      -(S[0][1] - x[1]) / r
    ), I = f((S[1][0] - x[0]) / r), b = f(
      -(S[1][1] - x[1]) / r
    ), K = f((S[2][0] - x[0]) / r), B = f(
      -(S[2][1] - x[1]) / r
    ), Q = L, R = O;
    L = 0, O = 0, X -= Q, N -= R, D -= Q, q -= R;
    const dt = [
      [X, N, 0, 0, I - w],
      [D, q, 0, 0, K - w],
      [0, 0, X, N, b - P],
      [0, 0, D, q, B - P]
    ], Y = Ia(dt);
    if (Y) {
      if (d.save(), d.beginPath(), lc() || !u) {
        d.moveTo(I, b);
        const U = 4, Kt = w - I, vt = P - b;
        for (let it = 0; it < U; it++)
          d.lineTo(
            I + f((it + 1) * Kt / U),
            b + f(it * vt / (U - 1))
          ), it != U - 1 && d.lineTo(
            I + f((it + 1) * Kt / U),
            b + f((it + 1) * vt / (U - 1))
          );
        d.lineTo(K, B);
      } else
        d.moveTo(I, b), d.lineTo(w, P), d.lineTo(K, B);
      d.clip(), d.transform(
        Y[0],
        Y[2],
        Y[1],
        Y[3],
        w,
        P
      ), d.translate(
        g[0] - Q,
        g[3] - R
      ), d.scale(
        i / e,
        -i / e
      ), d.drawImage(p.canvas, 0, 0), d.restore();
    }
  }), mn(p), Ge.push(p.canvas), c && (d.save(), d.globalCompositeOperation = "source-over", d.strokeStyle = "black", d.lineWidth = 1, a.getTriangles().forEach(function(E, C, T) {
    const v = E.target, S = (v[0][0] - x[0]) / r, L = -(v[0][1] - x[1]) / r, O = (v[1][0] - x[0]) / r, X = -(v[1][1] - x[1]) / r, N = (v[2][0] - x[0]) / r, D = -(v[2][1] - x[1]) / r;
    d.beginPath(), d.moveTo(O, X), d.lineTo(S, L), d.lineTo(N, D), d.closePath(), d.stroke();
  }), d.restore()), d.canvas;
}
class uc extends So {
  /**
   * @param {import("../proj/Projection.js").default} sourceProj Source projection.
   * @param {import("../tilegrid/TileGrid.js").default} sourceTileGrid Source tile grid.
   * @param {import("../proj/Projection.js").default} targetProj Target projection.
   * @param {import("../tilegrid/TileGrid.js").default} targetTileGrid Target tile grid.
   * @param {import("../tilecoord.js").TileCoord} tileCoord Coordinate of the tile.
   * @param {import("../tilecoord.js").TileCoord} wrappedTileCoord Coordinate of the tile wrapped in X.
   * @param {number} pixelRatio Pixel ratio.
   * @param {number} gutter Gutter of the source tiles.
   * @param {FunctionType} getTileFunction
   *     Function returning source tiles (z, x, y, pixelRatio).
   * @param {number} [errorThreshold] Acceptable reprojection error (in px).
   * @param {boolean} [renderEdges] Render reprojection edges.
   * @param {boolean} [interpolate] Use linear interpolation when resampling.
   */
  constructor(t, e, i, n, r, o, a, l, h, c, u, d) {
    super(r, A.IDLE, { interpolate: !!d }), this.renderEdges_ = u !== void 0 ? u : !1, this.pixelRatio_ = a, this.gutter_ = l, this.canvas_ = null, this.sourceTileGrid_ = e, this.targetTileGrid_ = n, this.wrappedTileCoord_ = o || r, this.sourceTiles_ = [], this.sourcesListenerKeys_ = null, this.sourceZ_ = 0;
    const f = n.getTileCoordExtent(
      this.wrappedTileCoord_
    ), g = this.targetTileGrid_.getExtent();
    let _ = this.sourceTileGrid_.getExtent();
    const m = g ? ei(f, g) : f;
    if (Wn(m) === 0) {
      this.state = A.EMPTY;
      return;
    }
    const p = t.getExtent();
    p && (_ ? _ = ei(_, p) : _ = p);
    const y = n.getResolution(
      this.wrappedTileCoord_[0]
    ), x = hc(
      t,
      i,
      m,
      y
    );
    if (!isFinite(x) || x <= 0) {
      this.state = A.EMPTY;
      return;
    }
    const E = c !== void 0 ? c : sc;
    if (this.triangulation_ = new ac(
      t,
      i,
      m,
      _,
      x * E,
      y
    ), this.triangulation_.getTriangles().length === 0) {
      this.state = A.EMPTY;
      return;
    }
    this.sourceZ_ = e.getZForResolution(x);
    let C = this.triangulation_.calculateSourceExtent();
    if (_ && (t.canWrapX() ? (C[1] = $(
      C[1],
      _[1],
      _[3]
    ), C[3] = $(
      C[3],
      _[1],
      _[3]
    )) : C = ei(C, _)), !Wn(C))
      this.state = A.EMPTY;
    else {
      const T = e.getTileRangeForExtentAndZ(
        C,
        this.sourceZ_
      );
      for (let v = T.minX; v <= T.maxX; v++)
        for (let S = T.minY; S <= T.maxY; S++) {
          const L = h(this.sourceZ_, v, S, a);
          L && this.sourceTiles_.push(L);
        }
      this.sourceTiles_.length === 0 && (this.state = A.EMPTY);
    }
  }
  /**
   * Get the HTML Canvas element for this tile.
   * @return {HTMLCanvasElement} Canvas.
   */
  getImage() {
    return this.canvas_;
  }
  /**
   * @private
   */
  reproject_() {
    const t = [];
    if (this.sourceTiles_.forEach((e) => {
      e && e.getState() == A.LOADED && t.push({
        extent: this.sourceTileGrid_.getTileCoordExtent(e.tileCoord),
        image: e.getImage()
      });
    }), this.sourceTiles_.length = 0, t.length === 0)
      this.state = A.ERROR;
    else {
      const e = this.wrappedTileCoord_[0], i = this.targetTileGrid_.getTileSize(e), n = typeof i == "number" ? i : i[0], r = typeof i == "number" ? i : i[1], o = this.targetTileGrid_.getResolution(e), a = this.sourceTileGrid_.getResolution(
        this.sourceZ_
      ), l = this.targetTileGrid_.getTileCoordExtent(
        this.wrappedTileCoord_
      );
      this.canvas_ = cc(
        n,
        r,
        this.pixelRatio_,
        a,
        this.sourceTileGrid_.getExtent(),
        o,
        l,
        this.triangulation_,
        t,
        this.gutter_,
        this.renderEdges_,
        this.interpolate
      ), this.state = A.LOADED;
    }
    this.changed();
  }
  /**
   * Load not yet loaded URI.
   */
  load() {
    if (this.state == A.IDLE) {
      this.state = A.LOADING, this.changed();
      let t = 0;
      this.sourcesListenerKeys_ = [], this.sourceTiles_.forEach((e) => {
        const i = e.getState();
        if (i == A.IDLE || i == A.LOADING) {
          t++;
          const n = G(
            e,
            F.CHANGE,
            function(r) {
              const o = e.getState();
              (o == A.LOADED || o == A.ERROR || o == A.EMPTY) && (j(n), t--, t === 0 && (this.unlistenSources_(), this.reproject_()));
            },
            this
          );
          this.sourcesListenerKeys_.push(n);
        }
      }), t === 0 ? setTimeout(this.reproject_.bind(this), 0) : this.sourceTiles_.forEach(function(e, i, n) {
        e.getState() == A.IDLE && e.load();
      });
    }
  }
  /**
   * @private
   */
  unlistenSources_() {
    this.sourcesListenerKeys_.forEach(j), this.sourcesListenerKeys_ = null;
  }
  /**
   * Remove from the cache due to expiry
   */
  release() {
    this.canvas_ && (mn(this.canvas_.getContext("2d")), Ge.push(this.canvas_), this.canvas_ = null), super.release();
  }
}
const $n = uc;
class Lo {
  /**
   * @param {number} minX Minimum X.
   * @param {number} maxX Maximum X.
   * @param {number} minY Minimum Y.
   * @param {number} maxY Maximum Y.
   */
  constructor(t, e, i, n) {
    this.minX = t, this.maxX = e, this.minY = i, this.maxY = n;
  }
  /**
   * @param {import("./tilecoord.js").TileCoord} tileCoord Tile coordinate.
   * @return {boolean} Contains tile coordinate.
   */
  contains(t) {
    return this.containsXY(t[1], t[2]);
  }
  /**
   * @param {TileRange} tileRange Tile range.
   * @return {boolean} Contains.
   */
  containsTileRange(t) {
    return this.minX <= t.minX && t.maxX <= this.maxX && this.minY <= t.minY && t.maxY <= this.maxY;
  }
  /**
   * @param {number} x Tile coordinate x.
   * @param {number} y Tile coordinate y.
   * @return {boolean} Contains coordinate.
   */
  containsXY(t, e) {
    return this.minX <= t && t <= this.maxX && this.minY <= e && e <= this.maxY;
  }
  /**
   * @param {TileRange} tileRange Tile range.
   * @return {boolean} Equals.
   */
  equals(t) {
    return this.minX == t.minX && this.minY == t.minY && this.maxX == t.maxX && this.maxY == t.maxY;
  }
  /**
   * @param {TileRange} tileRange Tile range.
   */
  extend(t) {
    t.minX < this.minX && (this.minX = t.minX), t.maxX > this.maxX && (this.maxX = t.maxX), t.minY < this.minY && (this.minY = t.minY), t.maxY > this.maxY && (this.maxY = t.maxY);
  }
  /**
   * @return {number} Height.
   */
  getHeight() {
    return this.maxY - this.minY + 1;
  }
  /**
   * @return {import("./size.js").Size} Size.
   */
  getSize() {
    return [this.getWidth(), this.getHeight()];
  }
  /**
   * @return {number} Width.
   */
  getWidth() {
    return this.maxX - this.minX + 1;
  }
  /**
   * @param {TileRange} tileRange Tile range.
   * @return {boolean} Intersects.
   */
  intersects(t) {
    return this.minX <= t.maxX && this.maxX >= t.minX && this.minY <= t.maxY && this.maxY >= t.minY;
  }
}
function Se(s, t, e, i, n) {
  return n !== void 0 ? (n.minX = s, n.maxX = t, n.minY = e, n.maxY = i, n) : new Lo(s, t, e, i);
}
const Ao = Lo;
class dc extends Io {
  /**
   * @param {LayerType} tileLayer Tile layer.
   */
  constructor(t) {
    super(t), this.extentChanged = !0, this.renderedExtent_ = null, this.renderedPixelRatio, this.renderedProjection = null, this.renderedRevision, this.renderedTiles = [], this.newTiles_ = !1, this.tmpExtent = Tt(), this.tmpTileRange_ = new Ao(0, 0, 0, 0);
  }
  /**
   * @protected
   * @param {import("../../Tile.js").default} tile Tile.
   * @return {boolean} Tile is drawable.
   */
  isDrawableTile(t) {
    const e = this.getLayer(), i = t.getState(), n = e.getUseInterimTilesOnError();
    return i == A.LOADED || i == A.EMPTY || i == A.ERROR && !n;
  }
  /**
   * @param {number} z Tile coordinate z.
   * @param {number} x Tile coordinate x.
   * @param {number} y Tile coordinate y.
   * @param {import("../../Map.js").FrameState} frameState Frame state.
   * @return {!import("../../Tile.js").default} Tile.
   */
  getTile(t, e, i, n) {
    const r = n.pixelRatio, o = n.viewState.projection, a = this.getLayer();
    let h = a.getSource().getTile(t, e, i, r, o);
    return h.getState() == A.ERROR && a.getUseInterimTilesOnError() && a.getPreload() > 0 && (this.newTiles_ = !0), this.isDrawableTile(h) || (h = h.getInterimTile()), h;
  }
  /**
   * @param {import("../../pixel.js").Pixel} pixel Pixel.
   * @return {Uint8ClampedArray} Data at the pixel location.
   */
  getData(t) {
    const e = this.frameState;
    if (!e)
      return null;
    const i = this.getLayer(), n = et(
      e.pixelToCoordinateTransform,
      t.slice()
    ), r = i.getExtent();
    if (r && !hn(r, n))
      return null;
    const o = e.pixelRatio, a = e.viewState.projection, l = e.viewState, h = i.getRenderSource(), c = h.getTileGridForProjection(l.projection), u = h.getTilePixelRatio(e.pixelRatio);
    for (let d = c.getZForResolution(l.resolution); d >= c.getMinZoom(); --d) {
      const f = c.getTileCoordForCoordAndZ(n, d), g = h.getTile(
        d,
        f[1],
        f[2],
        o,
        a
      );
      if (!(g instanceof wo || g instanceof $n) || g instanceof $n && g.getState() === A.EMPTY)
        return null;
      if (g.getState() !== A.LOADED)
        continue;
      const _ = c.getOrigin(d), m = _t(c.getTileSize(d)), p = c.getResolution(d), y = Math.floor(
        u * ((n[0] - _[0]) / p - f[1] * m[0])
      ), x = Math.floor(
        u * ((_[1] - n[1]) / p - f[2] * m[1])
      ), E = Math.round(
        u * h.getGutterForProjection(l.projection)
      );
      return this.getImageData(g.getImage(), y + E, x + E);
    }
    return null;
  }
  /**
   * @param {Object<number, Object<string, import("../../Tile.js").default>>} tiles Lookup of loaded tiles by zoom level.
   * @param {number} zoom Zoom level.
   * @param {import("../../Tile.js").default} tile Tile.
   * @return {boolean|void} If `false`, the tile will not be considered loaded.
   */
  loadedTileCallback(t, e, i) {
    return this.isDrawableTile(i) ? super.loadedTileCallback(t, e, i) : !1;
  }
  /**
   * Determine whether render should be called.
   * @param {import("../../Map.js").FrameState} frameState Frame state.
   * @return {boolean} Layer is ready to be rendered.
   */
  prepareFrame(t) {
    return !!this.getLayer().getSource();
  }
  /**
   * Render the layer.
   * @param {import("../../Map.js").FrameState} frameState Frame state.
   * @param {HTMLElement} target Target that may be used to render content to.
   * @return {HTMLElement} The rendered element.
   */
  renderFrame(t, e) {
    const i = t.layerStatesArray[t.layerIndex], n = t.viewState, r = n.projection, o = n.resolution, a = n.center, l = n.rotation, h = t.pixelRatio, c = this.getLayer(), u = c.getSource(), d = u.getRevision(), f = u.getTileGridForProjection(r), g = f.getZForResolution(o, u.zDirection), _ = f.getResolution(g);
    let m = t.extent;
    const p = t.viewState.resolution, y = u.getTilePixelRatio(h), x = Math.round(V(m) / p * h), E = Math.round(Ot(m) / p * h), C = i.extent && ue(i.extent);
    C && (m = ei(
      m,
      ue(i.extent)
    ));
    const T = _ * x / 2 / y, v = _ * E / 2 / y, S = [
      a[0] - T,
      a[1] - v,
      a[0] + T,
      a[1] + v
    ], L = f.getTileRangeForExtentAndZ(m, g), O = {};
    O[g] = {};
    const X = this.createLoadedTileFinder(
      u,
      r,
      O
    ), N = this.tmpExtent, D = this.tmpTileRange_;
    this.newTiles_ = !1;
    const q = l ? Yn(
      n.center,
      p,
      l,
      t.size
    ) : void 0;
    for (let dt = L.minX; dt <= L.maxX; ++dt)
      for (let Y = L.minY; Y <= L.maxY; ++Y) {
        if (l && !f.tileCoordIntersectsViewport([g, dt, Y], q))
          continue;
        const U = this.getTile(g, dt, Y, t);
        if (this.isDrawableTile(U)) {
          const it = z(this);
          if (U.getState() == A.LOADED) {
            O[g][U.tileCoord.toString()] = U;
            let bt = U.inTransition(it);
            bt && i.opacity !== 1 && (U.endTransition(it), bt = !1), !this.newTiles_ && (bt || !this.renderedTiles.includes(U)) && (this.newTiles_ = !0);
          }
          if (U.getAlpha(it, t.time) === 1)
            continue;
        }
        const Kt = f.getTileCoordChildTileRange(
          U.tileCoord,
          D,
          N
        );
        let vt = !1;
        Kt && (vt = X(g + 1, Kt)), vt || f.forEachTileCoordParentTileRange(
          U.tileCoord,
          X,
          D,
          N
        );
      }
    const w = _ / o * h / y;
    se(
      this.pixelTransform,
      t.size[0] / 2,
      t.size[1] / 2,
      1 / h,
      1 / h,
      l,
      -x / 2,
      -E / 2
    );
    const P = Gr(this.pixelTransform);
    this.useContainer(e, P, this.getBackground(t));
    const I = this.context, b = I.canvas;
    es(this.inversePixelTransform, this.pixelTransform), se(
      this.tempTransform,
      x / 2,
      E / 2,
      w,
      w,
      0,
      -x / 2,
      -E / 2
    ), b.width != x || b.height != E ? (b.width = x, b.height = E) : this.containerReused || I.clearRect(0, 0, x, E), C && this.clipUnrotated(I, t, C), u.getInterpolate() || (I.imageSmoothingEnabled = !1), this.preRender(I, t), this.renderedTiles.length = 0;
    let K = Object.keys(O).map(Number);
    K.sort(We);
    let B, Q, R;
    i.opacity === 1 && (!this.containerReused || u.getOpaque(t.viewState.projection)) ? K = K.reverse() : (B = [], Q = []);
    for (let dt = K.length - 1; dt >= 0; --dt) {
      const Y = K[dt], U = u.getTilePixelSize(
        Y,
        h,
        r
      ), vt = f.getResolution(Y) / _, it = U[0] * vt * w, bt = U[1] * vt * w, ye = f.getTileCoordForCoordAndZ(
        pe(S),
        Y
      ), Ri = f.getTileCoordExtent(ye), xe = et(this.tempTransform, [
        y * (Ri[0] - S[0]) / _,
        y * (S[3] - Ri[3]) / _
      ]), Ti = y * u.getGutterForProjection(r), Ut = O[Y];
      for (const Ke in Ut) {
        const Vt = (
          /** @type {import("../../ImageTile.js").default} */
          Ut[Ke]
        ), Ii = Vt.tileCoord, Si = ye[1] - Ii[1], vi = Math.round(xe[0] - (Si - 1) * it), Ee = ye[2] - Ii[2], En = Math.round(xe[1] - (Ee - 1) * bt), ht = Math.round(xe[0] - Si * it), mt = Math.round(xe[1] - Ee * bt), xt = vi - ht, Ft = En - mt, Ce = g === Y, oe = Ce && Vt.getAlpha(z(this), t.time) !== 1;
        let jt = !1;
        if (!oe)
          if (B) {
            R = [ht, mt, ht + xt, mt, ht + xt, mt + Ft, ht, mt + Ft];
            for (let Re = 0, wi = B.length; Re < wi; ++Re)
              if (g !== Y && Y < Q[Re]) {
                const ot = B[Re];
                at(
                  [ht, mt, ht + xt, mt + Ft],
                  [ot[0], ot[3], ot[4], ot[7]]
                ) && (jt || (I.save(), jt = !0), I.beginPath(), I.moveTo(R[0], R[1]), I.lineTo(R[2], R[3]), I.lineTo(R[4], R[5]), I.lineTo(R[6], R[7]), I.moveTo(ot[6], ot[7]), I.lineTo(ot[4], ot[5]), I.lineTo(ot[2], ot[3]), I.lineTo(ot[0], ot[1]), I.clip());
              }
            B.push(R), Q.push(Y);
          } else
            I.clearRect(ht, mt, xt, Ft);
        this.drawTileImage(
          Vt,
          t,
          ht,
          mt,
          xt,
          Ft,
          Ti,
          Ce
        ), B && !oe ? (jt && I.restore(), this.renderedTiles.unshift(Vt)) : this.renderedTiles.push(Vt), this.updateUsedTiles(t.usedTiles, u, Vt);
      }
    }
    return this.renderedRevision = d, this.renderedResolution = _, this.extentChanged = !this.renderedExtent_ || !ri(this.renderedExtent_, S), this.renderedExtent_ = S, this.renderedPixelRatio = h, this.renderedProjection = r, this.manageTilePyramid(
      t,
      u,
      f,
      h,
      r,
      m,
      g,
      c.getPreload()
    ), this.scheduleExpireCache(t, u), this.postRender(I, t), i.extent && I.restore(), I.imageSmoothingEnabled = !0, P !== b.style.transform && (b.style.transform = P), this.container;
  }
  /**
   * @param {import("../../ImageTile.js").default} tile Tile.
   * @param {import("../../Map.js").FrameState} frameState Frame state.
   * @param {number} x Left of the tile.
   * @param {number} y Top of the tile.
   * @param {number} w Width of the tile.
   * @param {number} h Height of the tile.
   * @param {number} gutter Tile gutter.
   * @param {boolean} transition Apply an alpha transition.
   */
  drawTileImage(t, e, i, n, r, o, a, l) {
    const h = this.getTileImage(t);
    if (!h)
      return;
    const c = z(this), u = e.layerStatesArray[e.layerIndex], d = u.opacity * (l ? t.getAlpha(c, e.time) : 1), f = d !== this.context.globalAlpha;
    f && (this.context.save(), this.context.globalAlpha = d), this.context.drawImage(
      h,
      a,
      a,
      h.width - 2 * a,
      h.height - 2 * a,
      i,
      n,
      r,
      o
    ), f && this.context.restore(), d !== u.opacity ? e.animate = !0 : l && t.endTransition(c);
  }
  /**
   * @return {HTMLCanvasElement} Image
   */
  getImage() {
    const t = this.context;
    return t ? t.canvas : null;
  }
  /**
   * Get the image from a tile.
   * @param {import("../../ImageTile.js").default} tile Tile.
   * @return {HTMLCanvasElement|HTMLImageElement|HTMLVideoElement} Image.
   * @protected
   */
  getTileImage(t) {
    return t.getImage();
  }
  /**
   * @param {import("../../Map.js").FrameState} frameState Frame state.
   * @param {import("../../source/Tile.js").default} tileSource Tile source.
   * @protected
   */
  scheduleExpireCache(t, e) {
    if (e.canExpireCache()) {
      const i = function(n, r, o) {
        const a = z(n);
        a in o.usedTiles && n.expireCache(
          o.viewState.projection,
          o.usedTiles[a]
        );
      }.bind(null, e);
      t.postRenderFunctions.push(
        /** @type {import("../../Map.js").PostRenderFunction} */
        i
      );
    }
  }
  /**
   * @param {!Object<string, !Object<string, boolean>>} usedTiles Used tiles.
   * @param {import("../../source/Tile.js").default} tileSource Tile source.
   * @param {import('../../Tile.js').default} tile Tile.
   * @protected
   */
  updateUsedTiles(t, e, i) {
    const n = z(e);
    n in t || (t[n] = {}), t[n][i.getKey()] = !0;
  }
  /**
   * Manage tile pyramid.
   * This function performs a number of functions related to the tiles at the
   * current zoom and lower zoom levels:
   * - registers idle tiles in frameState.wantedTiles so that they are not
   *   discarded by the tile queue
   * - enqueues missing tiles
   * @param {import("../../Map.js").FrameState} frameState Frame state.
   * @param {import("../../source/Tile.js").default} tileSource Tile source.
   * @param {import("../../tilegrid/TileGrid.js").default} tileGrid Tile grid.
   * @param {number} pixelRatio Pixel ratio.
   * @param {import("../../proj/Projection.js").default} projection Projection.
   * @param {import("../../extent.js").Extent} extent Extent.
   * @param {number} currentZ Current Z.
   * @param {number} preload Load low resolution tiles up to `preload` levels.
   * @param {function(import("../../Tile.js").default):void} [tileCallback] Tile callback.
   * @protected
   */
  manageTilePyramid(t, e, i, n, r, o, a, l, h) {
    const c = z(e);
    c in t.wantedTiles || (t.wantedTiles[c] = {});
    const u = t.wantedTiles[c], d = t.tileQueue, f = i.getMinZoom(), g = t.viewState.rotation, _ = g ? Yn(
      t.viewState.center,
      t.viewState.resolution,
      g,
      t.size
    ) : void 0;
    let m = 0, p, y, x, E, C, T;
    for (T = f; T <= a; ++T)
      for (y = i.getTileRangeForExtentAndZ(o, T, y), x = i.getResolution(T), E = y.minX; E <= y.maxX; ++E)
        for (C = y.minY; C <= y.maxY; ++C)
          g && !i.tileCoordIntersectsViewport([T, E, C], _) || (a - T <= l ? (++m, p = e.getTile(T, E, C, n, r), p.getState() == A.IDLE && (u[p.getKey()] = !0, d.isKeyQueued(p.getKey()) || d.enqueue([
            p,
            c,
            i.getTileCoordCenter(p.tileCoord),
            x
          ])), h !== void 0 && h(p)) : e.useTile(T, E, C, r));
    e.updateCacheSize(m, r);
  }
}
const fc = dc;
class gc extends $h {
  /**
   * @param {import("./BaseTile.js").Options<TileSourceType>} [options] Tile layer options.
   */
  constructor(t) {
    super(t);
  }
  createRenderer() {
    return new fc(this);
  }
}
const _c = gc;
function mc(s, t, e, i, n) {
  Mo(s, t, e || 0, i || s.length - 1, n || pc);
}
function Mo(s, t, e, i, n) {
  for (; i > e; ) {
    if (i - e > 600) {
      var r = i - e + 1, o = t - e + 1, a = Math.log(r), l = 0.5 * Math.exp(2 * a / 3), h = 0.5 * Math.sqrt(a * l * (r - l) / r) * (o - r / 2 < 0 ? -1 : 1), c = Math.max(e, Math.floor(t - o * l / r + h)), u = Math.min(i, Math.floor(t + (r - o) * l / r + h));
      Mo(s, t, c, u, n);
    }
    var d = s[t], f = e, g = i;
    for (He(s, e, t), n(s[i], d) > 0 && He(s, e, i); f < g; ) {
      for (He(s, f, g), f++, g--; n(s[f], d) < 0; )
        f++;
      for (; n(s[g], d) > 0; )
        g--;
    }
    n(s[e], d) === 0 ? He(s, e, g) : (g++, He(s, g, i)), g <= t && (e = g + 1), t <= g && (i = g - 1);
  }
}
function He(s, t, e) {
  var i = s[t];
  s[t] = s[e], s[e] = i;
}
function pc(s, t) {
  return s < t ? -1 : s > t ? 1 : 0;
}
let Po = class {
  constructor(t = 9) {
    this._maxEntries = Math.max(4, t), this._minEntries = Math.max(2, Math.ceil(this._maxEntries * 0.4)), this.clear();
  }
  all() {
    return this._all(this.data, []);
  }
  search(t) {
    let e = this.data;
    const i = [];
    if (!Wi(t, e))
      return i;
    const n = this.toBBox, r = [];
    for (; e; ) {
      for (let o = 0; o < e.children.length; o++) {
        const a = e.children[o], l = e.leaf ? n(a) : a;
        Wi(t, l) && (e.leaf ? i.push(a) : On(t, l) ? this._all(a, i) : r.push(a));
      }
      e = r.pop();
    }
    return i;
  }
  collides(t) {
    let e = this.data;
    if (!Wi(t, e))
      return !1;
    const i = [];
    for (; e; ) {
      for (let n = 0; n < e.children.length; n++) {
        const r = e.children[n], o = e.leaf ? this.toBBox(r) : r;
        if (Wi(t, o)) {
          if (e.leaf || On(t, o))
            return !0;
          i.push(r);
        }
      }
      e = i.pop();
    }
    return !1;
  }
  load(t) {
    if (!(t && t.length))
      return this;
    if (t.length < this._minEntries) {
      for (let i = 0; i < t.length; i++)
        this.insert(t[i]);
      return this;
    }
    let e = this._build(t.slice(), 0, t.length - 1, 0);
    if (!this.data.children.length)
      this.data = e;
    else if (this.data.height === e.height)
      this._splitRoot(this.data, e);
    else {
      if (this.data.height < e.height) {
        const i = this.data;
        this.data = e, e = i;
      }
      this._insert(e, this.data.height - e.height - 1, !0);
    }
    return this;
  }
  insert(t) {
    return t && this._insert(t, this.data.height - 1), this;
  }
  clear() {
    return this.data = be([]), this;
  }
  remove(t, e) {
    if (!t)
      return this;
    let i = this.data;
    const n = this.toBBox(t), r = [], o = [];
    let a, l, h;
    for (; i || r.length; ) {
      if (i || (i = r.pop(), l = r[r.length - 1], a = o.pop(), h = !0), i.leaf) {
        const c = yc(t, i.children, e);
        if (c !== -1)
          return i.children.splice(c, 1), r.push(i), this._condense(r), this;
      }
      !h && !i.leaf && On(i, n) ? (r.push(i), o.push(a), a = 0, l = i, i = i.children[0]) : l ? (a++, i = l.children[a], h = !1) : i = null;
    }
    return this;
  }
  toBBox(t) {
    return t;
  }
  compareMinX(t, e) {
    return t.minX - e.minX;
  }
  compareMinY(t, e) {
    return t.minY - e.minY;
  }
  toJSON() {
    return this.data;
  }
  fromJSON(t) {
    return this.data = t, this;
  }
  _all(t, e) {
    const i = [];
    for (; t; )
      t.leaf ? e.push(...t.children) : i.push(...t.children), t = i.pop();
    return e;
  }
  _build(t, e, i, n) {
    const r = i - e + 1;
    let o = this._maxEntries, a;
    if (r <= o)
      return a = be(t.slice(e, i + 1)), ve(a, this.toBBox), a;
    n || (n = Math.ceil(Math.log(r) / Math.log(o)), o = Math.ceil(r / Math.pow(o, n - 1))), a = be([]), a.leaf = !1, a.height = n;
    const l = Math.ceil(r / o), h = l * Math.ceil(Math.sqrt(o));
    pr(t, e, i, h, this.compareMinX);
    for (let c = e; c <= i; c += h) {
      const u = Math.min(c + h - 1, i);
      pr(t, c, u, l, this.compareMinY);
      for (let d = c; d <= u; d += l) {
        const f = Math.min(d + l - 1, u);
        a.children.push(this._build(t, d, f, n - 1));
      }
    }
    return ve(a, this.toBBox), a;
  }
  _chooseSubtree(t, e, i, n) {
    for (; n.push(e), !(e.leaf || n.length - 1 === i); ) {
      let r = 1 / 0, o = 1 / 0, a;
      for (let l = 0; l < e.children.length; l++) {
        const h = e.children[l], c = Pn(h), u = Cc(t, h) - c;
        u < o ? (o = u, r = c < r ? c : r, a = h) : u === o && c < r && (r = c, a = h);
      }
      e = a || e.children[0];
    }
    return e;
  }
  _insert(t, e, i) {
    const n = i ? t : this.toBBox(t), r = [], o = this._chooseSubtree(n, this.data, e, r);
    for (o.children.push(t), Qe(o, n); e >= 0 && r[e].children.length > this._maxEntries; )
      this._split(r, e), e--;
    this._adjustParentBBoxes(n, r, e);
  }
  // split overflowed node into two
  _split(t, e) {
    const i = t[e], n = i.children.length, r = this._minEntries;
    this._chooseSplitAxis(i, r, n);
    const o = this._chooseSplitIndex(i, r, n), a = be(i.children.splice(o, i.children.length - o));
    a.height = i.height, a.leaf = i.leaf, ve(i, this.toBBox), ve(a, this.toBBox), e ? t[e - 1].children.push(a) : this._splitRoot(i, a);
  }
  _splitRoot(t, e) {
    this.data = be([t, e]), this.data.height = t.height + 1, this.data.leaf = !1, ve(this.data, this.toBBox);
  }
  _chooseSplitIndex(t, e, i) {
    let n, r = 1 / 0, o = 1 / 0;
    for (let a = e; a <= i - e; a++) {
      const l = Je(t, 0, a, this.toBBox), h = Je(t, a, i, this.toBBox), c = Rc(l, h), u = Pn(l) + Pn(h);
      c < r ? (r = c, n = a, o = u < o ? u : o) : c === r && u < o && (o = u, n = a);
    }
    return n || i - e;
  }
  // sorts node children by the best axis for split
  _chooseSplitAxis(t, e, i) {
    const n = t.leaf ? this.compareMinX : xc, r = t.leaf ? this.compareMinY : Ec, o = this._allDistMargin(t, e, i, n), a = this._allDistMargin(t, e, i, r);
    o < a && t.children.sort(n);
  }
  // total margin of all possible split distributions where each node is at least m full
  _allDistMargin(t, e, i, n) {
    t.children.sort(n);
    const r = this.toBBox, o = Je(t, 0, e, r), a = Je(t, i - e, i, r);
    let l = Xi(o) + Xi(a);
    for (let h = e; h < i - e; h++) {
      const c = t.children[h];
      Qe(o, t.leaf ? r(c) : c), l += Xi(o);
    }
    for (let h = i - e - 1; h >= e; h--) {
      const c = t.children[h];
      Qe(a, t.leaf ? r(c) : c), l += Xi(a);
    }
    return l;
  }
  _adjustParentBBoxes(t, e, i) {
    for (let n = i; n >= 0; n--)
      Qe(e[n], t);
  }
  _condense(t) {
    for (let e = t.length - 1, i; e >= 0; e--)
      t[e].children.length === 0 ? e > 0 ? (i = t[e - 1].children, i.splice(i.indexOf(t[e]), 1)) : this.clear() : ve(t[e], this.toBBox);
  }
};
function yc(s, t, e) {
  if (!e)
    return t.indexOf(s);
  for (let i = 0; i < t.length; i++)
    if (e(s, t[i]))
      return i;
  return -1;
}
function ve(s, t) {
  Je(s, 0, s.children.length, t, s);
}
function Je(s, t, e, i, n) {
  n || (n = be(null)), n.minX = 1 / 0, n.minY = 1 / 0, n.maxX = -1 / 0, n.maxY = -1 / 0;
  for (let r = t; r < e; r++) {
    const o = s.children[r];
    Qe(n, s.leaf ? i(o) : o);
  }
  return n;
}
function Qe(s, t) {
  return s.minX = Math.min(s.minX, t.minX), s.minY = Math.min(s.minY, t.minY), s.maxX = Math.max(s.maxX, t.maxX), s.maxY = Math.max(s.maxY, t.maxY), s;
}
function xc(s, t) {
  return s.minX - t.minX;
}
function Ec(s, t) {
  return s.minY - t.minY;
}
function Pn(s) {
  return (s.maxX - s.minX) * (s.maxY - s.minY);
}
function Xi(s) {
  return s.maxX - s.minX + (s.maxY - s.minY);
}
function Cc(s, t) {
  return (Math.max(t.maxX, s.maxX) - Math.min(t.minX, s.minX)) * (Math.max(t.maxY, s.maxY) - Math.min(t.minY, s.minY));
}
function Rc(s, t) {
  const e = Math.max(s.minX, t.minX), i = Math.max(s.minY, t.minY), n = Math.min(s.maxX, t.maxX), r = Math.min(s.maxY, t.maxY);
  return Math.max(0, n - e) * Math.max(0, r - i);
}
function On(s, t) {
  return s.minX <= t.minX && s.minY <= t.minY && t.maxX <= s.maxX && t.maxY <= s.maxY;
}
function Wi(s, t) {
  return t.minX <= s.maxX && t.minY <= s.maxY && t.maxX >= s.minX && t.maxY >= s.minY;
}
function be(s) {
  return {
    children: s,
    height: 1,
    leaf: !0,
    minX: 1 / 0,
    minY: 1 / 0,
    maxX: -1 / 0,
    maxY: -1 / 0
  };
}
function pr(s, t, e, i, n) {
  const r = [t, e];
  for (; r.length; ) {
    if (e = r.pop(), t = r.pop(), e - t <= i)
      continue;
    const o = t + Math.ceil((e - t) / i / 2) * i;
    mc(s, o, t, e, n), r.push(t, o, o, e);
  }
}
class Rs {
  /**
   * @param {Options} options Options.
   */
  constructor(t) {
    this.opacity_ = t.opacity, this.rotateWithView_ = t.rotateWithView, this.rotation_ = t.rotation, this.scale_ = t.scale, this.scaleArray_ = _t(t.scale), this.displacement_ = t.displacement, this.declutterMode_ = t.declutterMode;
  }
  /**
   * Clones the style.
   * @return {ImageStyle} The cloned style.
   * @api
   */
  clone() {
    const t = this.getScale();
    return new Rs({
      opacity: this.getOpacity(),
      scale: Array.isArray(t) ? t.slice() : t,
      rotation: this.getRotation(),
      rotateWithView: this.getRotateWithView(),
      displacement: this.getDisplacement().slice(),
      declutterMode: this.getDeclutterMode()
    });
  }
  /**
   * Get the symbolizer opacity.
   * @return {number} Opacity.
   * @api
   */
  getOpacity() {
    return this.opacity_;
  }
  /**
   * Determine whether the symbolizer rotates with the map.
   * @return {boolean} Rotate with map.
   * @api
   */
  getRotateWithView() {
    return this.rotateWithView_;
  }
  /**
   * Get the symoblizer rotation.
   * @return {number} Rotation.
   * @api
   */
  getRotation() {
    return this.rotation_;
  }
  /**
   * Get the symbolizer scale.
   * @return {number|import("../size.js").Size} Scale.
   * @api
   */
  getScale() {
    return this.scale_;
  }
  /**
   * Get the symbolizer scale array.
   * @return {import("../size.js").Size} Scale array.
   */
  getScaleArray() {
    return this.scaleArray_;
  }
  /**
   * Get the displacement of the shape
   * @return {Array<number>} Shape's center displacement
   * @api
   */
  getDisplacement() {
    return this.displacement_;
  }
  /**
   * Get the declutter mode of the shape
   * @return {"declutter"|"obstacle"|"none"|undefined} Shape's declutter mode
   * @api
   */
  getDeclutterMode() {
    return this.declutterMode_;
  }
  /**
   * Get the anchor point in pixels. The anchor determines the center point for the
   * symbolizer.
   * @abstract
   * @return {Array<number>} Anchor.
   */
  getAnchor() {
    return W();
  }
  /**
   * Get the image element for the symbolizer.
   * @abstract
   * @param {number} pixelRatio Pixel ratio.
   * @return {HTMLCanvasElement|HTMLVideoElement|HTMLImageElement} Image element.
   */
  getImage(t) {
    return W();
  }
  /**
   * @abstract
   * @return {HTMLCanvasElement|HTMLVideoElement|HTMLImageElement} Image element.
   */
  getHitDetectionImage() {
    return W();
  }
  /**
   * Get the image pixel ratio.
   * @param {number} pixelRatio Pixel ratio.
   * @return {number} Pixel ratio.
   */
  getPixelRatio(t) {
    return 1;
  }
  /**
   * @abstract
   * @return {import("../ImageState.js").default} Image state.
   */
  getImageState() {
    return W();
  }
  /**
   * @abstract
   * @return {import("../size.js").Size} Image size.
   */
  getImageSize() {
    return W();
  }
  /**
   * Get the origin of the symbolizer.
   * @abstract
   * @return {Array<number>} Origin.
   */
  getOrigin() {
    return W();
  }
  /**
   * Get the size of the symbolizer (in pixels).
   * @abstract
   * @return {import("../size.js").Size} Size.
   */
  getSize() {
    return W();
  }
  /**
   * Set the displacement.
   *
   * @param {Array<number>} displacement Displacement.
   * @api
   */
  setDisplacement(t) {
    this.displacement_ = t;
  }
  /**
   * Set the opacity.
   *
   * @param {number} opacity Opacity.
   * @api
   */
  setOpacity(t) {
    this.opacity_ = t;
  }
  /**
   * Set whether to rotate the style with the view.
   *
   * @param {boolean} rotateWithView Rotate with map.
   * @api
   */
  setRotateWithView(t) {
    this.rotateWithView_ = t;
  }
  /**
   * Set the rotation.
   *
   * @param {number} rotation Rotation.
   * @api
   */
  setRotation(t) {
    this.rotation_ = t;
  }
  /**
   * Set the scale.
   *
   * @param {number|import("../size.js").Size} scale Scale.
   * @api
   */
  setScale(t) {
    this.scale_ = t, this.scaleArray_ = _t(t);
  }
  /**
   * @abstract
   * @param {function(import("../events/Event.js").default): void} listener Listener function.
   */
  listenImageChange(t) {
    W();
  }
  /**
   * Load not yet loaded URI.
   * @abstract
   */
  load() {
    W();
  }
  /**
   * @abstract
   * @param {function(import("../events/Event.js").default): void} listener Listener function.
   */
  unlistenImageChange(t) {
    W();
  }
}
const Oo = Rs;
function Mt(s) {
  return Array.isArray(s) ? Ur(s) : s;
}
class Ts extends Oo {
  /**
   * @param {Options} options Options.
   */
  constructor(t) {
    const e = t.rotateWithView !== void 0 ? t.rotateWithView : !1;
    super({
      opacity: 1,
      rotateWithView: e,
      rotation: t.rotation !== void 0 ? t.rotation : 0,
      scale: t.scale !== void 0 ? t.scale : 1,
      displacement: t.displacement !== void 0 ? t.displacement : [0, 0],
      declutterMode: t.declutterMode
    }), this.canvas_ = void 0, this.hitDetectionCanvas_ = null, this.fill_ = t.fill !== void 0 ? t.fill : null, this.origin_ = [0, 0], this.points_ = t.points, this.radius_ = t.radius !== void 0 ? t.radius : t.radius1, this.radius2_ = t.radius2, this.angle_ = t.angle !== void 0 ? t.angle : 0, this.stroke_ = t.stroke !== void 0 ? t.stroke : null, this.size_ = null, this.renderOptions_ = null, this.render();
  }
  /**
   * Clones the style.
   * @return {RegularShape} The cloned style.
   * @api
   */
  clone() {
    const t = this.getScale(), e = new Ts({
      fill: this.getFill() ? this.getFill().clone() : void 0,
      points: this.getPoints(),
      radius: this.getRadius(),
      radius2: this.getRadius2(),
      angle: this.getAngle(),
      stroke: this.getStroke() ? this.getStroke().clone() : void 0,
      rotation: this.getRotation(),
      rotateWithView: this.getRotateWithView(),
      scale: Array.isArray(t) ? t.slice() : t,
      displacement: this.getDisplacement().slice(),
      declutterMode: this.getDeclutterMode()
    });
    return e.setOpacity(this.getOpacity()), e;
  }
  /**
   * Get the anchor point in pixels. The anchor determines the center point for the
   * symbolizer.
   * @return {Array<number>} Anchor.
   * @api
   */
  getAnchor() {
    const t = this.size_;
    if (!t)
      return null;
    const e = this.getDisplacement(), i = this.getScaleArray();
    return [
      t[0] / 2 - e[0] / i[0],
      t[1] / 2 + e[1] / i[1]
    ];
  }
  /**
   * Get the angle used in generating the shape.
   * @return {number} Shape's rotation in radians.
   * @api
   */
  getAngle() {
    return this.angle_;
  }
  /**
   * Get the fill style for the shape.
   * @return {import("./Fill.js").default} Fill style.
   * @api
   */
  getFill() {
    return this.fill_;
  }
  /**
   * Set the fill style.
   * @param {import("./Fill.js").default} fill Fill style.
   * @api
   */
  setFill(t) {
    this.fill_ = t, this.render();
  }
  /**
   * @return {HTMLCanvasElement} Image element.
   */
  getHitDetectionImage() {
    return this.hitDetectionCanvas_ || this.createHitDetectionCanvas_(this.renderOptions_), this.hitDetectionCanvas_;
  }
  /**
   * Get the image icon.
   * @param {number} pixelRatio Pixel ratio.
   * @return {HTMLCanvasElement} Image or Canvas element.
   * @api
   */
  getImage(t) {
    let e = this.canvas_[t];
    if (!e) {
      const i = this.renderOptions_, n = lt(
        i.size * t,
        i.size * t
      );
      this.draw_(i, n, t), e = n.canvas, this.canvas_[t] = e;
    }
    return e;
  }
  /**
   * Get the image pixel ratio.
   * @param {number} pixelRatio Pixel ratio.
   * @return {number} Pixel ratio.
   */
  getPixelRatio(t) {
    return t;
  }
  /**
   * @return {import("../size.js").Size} Image size.
   */
  getImageSize() {
    return this.size_;
  }
  /**
   * @return {import("../ImageState.js").default} Image state.
   */
  getImageState() {
    return J.LOADED;
  }
  /**
   * Get the origin of the symbolizer.
   * @return {Array<number>} Origin.
   * @api
   */
  getOrigin() {
    return this.origin_;
  }
  /**
   * Get the number of points for generating the shape.
   * @return {number} Number of points for stars and regular polygons.
   * @api
   */
  getPoints() {
    return this.points_;
  }
  /**
   * Get the (primary) radius for the shape.
   * @return {number} Radius.
   * @api
   */
  getRadius() {
    return this.radius_;
  }
  /**
   * Get the secondary radius for the shape.
   * @return {number|undefined} Radius2.
   * @api
   */
  getRadius2() {
    return this.radius2_;
  }
  /**
   * Get the size of the symbolizer (in pixels).
   * @return {import("../size.js").Size} Size.
   * @api
   */
  getSize() {
    return this.size_;
  }
  /**
   * Get the stroke style for the shape.
   * @return {import("./Stroke.js").default} Stroke style.
   * @api
   */
  getStroke() {
    return this.stroke_;
  }
  /**
   * Set the stroke style.
   * @param {import("./Stroke.js").default} stroke Stroke style.
   * @api
   */
  setStroke(t) {
    this.stroke_ = t, this.render();
  }
  /**
   * @param {function(import("../events/Event.js").default): void} listener Listener function.
   */
  listenImageChange(t) {
  }
  /**
   * Load not yet loaded URI.
   */
  load() {
  }
  /**
   * @param {function(import("../events/Event.js").default): void} listener Listener function.
   */
  unlistenImageChange(t) {
  }
  /**
   * Calculate additional canvas size needed for the miter.
   * @param {string} lineJoin Line join
   * @param {number} strokeWidth Stroke width
   * @param {number} miterLimit Miter limit
   * @return {number} Additional canvas size needed
   * @private
   */
  calculateLineJoinSize_(t, e, i) {
    if (e === 0 || this.points_ === 1 / 0 || t !== "bevel" && t !== "miter")
      return e;
    let n = this.radius_, r = this.radius2_ === void 0 ? n : this.radius2_;
    if (n < r) {
      const T = n;
      n = r, r = T;
    }
    const o = this.radius2_ === void 0 ? this.points_ : this.points_ * 2, a = 2 * Math.PI / o, l = r * Math.sin(a), h = Math.sqrt(r * r - l * l), c = n - h, u = Math.sqrt(l * l + c * c), d = u / l;
    if (t === "miter" && d <= i)
      return d * e;
    const f = e / 2 / d, g = e / 2 * (c / u), m = Math.sqrt((n + f) * (n + f) + g * g) - n;
    if (this.radius2_ === void 0 || t === "bevel")
      return m * 2;
    const p = n * Math.sin(a), y = Math.sqrt(n * n - p * p), x = r - y, C = Math.sqrt(p * p + x * x) / p;
    if (C <= i) {
      const T = C * e / 2 - r - n;
      return 2 * Math.max(m, T);
    }
    return m * 2;
  }
  /**
   * @return {RenderOptions}  The render options
   * @protected
   */
  createRenderOptions() {
    let t = Be, e = 0, i = null, n = 0, r, o = 0;
    this.stroke_ && (r = this.stroke_.getColor(), r === null && (r = ui), r = Mt(r), o = this.stroke_.getWidth(), o === void 0 && (o = fi), i = this.stroke_.getLineDash(), n = this.stroke_.getLineDashOffset(), t = this.stroke_.getLineJoin(), t === void 0 && (t = Be), e = this.stroke_.getMiterLimit(), e === void 0 && (e = ci));
    const a = this.calculateLineJoinSize_(t, o, e), l = Math.max(this.radius_, this.radius2_ || 0), h = Math.ceil(2 * l + a);
    return {
      strokeStyle: r,
      strokeWidth: o,
      size: h,
      lineDash: i,
      lineDashOffset: n,
      lineJoin: t,
      miterLimit: e
    };
  }
  /**
   * @protected
   */
  render() {
    this.renderOptions_ = this.createRenderOptions();
    const t = this.renderOptions_.size;
    this.canvas_ = {}, this.size_ = [t, t];
  }
  /**
   * @private
   * @param {RenderOptions} renderOptions Render options.
   * @param {CanvasRenderingContext2D} context The rendering context.
   * @param {number} pixelRatio The pixel ratio.
   */
  draw_(t, e, i) {
    if (e.scale(i, i), e.translate(t.size / 2, t.size / 2), this.createPath_(e), this.fill_) {
      let n = this.fill_.getColor();
      n === null && (n = Yt), e.fillStyle = Mt(n), e.fill();
    }
    this.stroke_ && (e.strokeStyle = t.strokeStyle, e.lineWidth = t.strokeWidth, t.lineDash && (e.setLineDash(t.lineDash), e.lineDashOffset = t.lineDashOffset), e.lineJoin = t.lineJoin, e.miterLimit = t.miterLimit, e.stroke());
  }
  /**
   * @private
   * @param {RenderOptions} renderOptions Render options.
   */
  createHitDetectionCanvas_(t) {
    if (this.fill_) {
      let e = this.fill_.getColor(), i = 0;
      if (typeof e == "string" && (e = Ui(e)), e === null ? i = 1 : Array.isArray(e) && (i = e.length === 4 ? e[3] : 1), i === 0) {
        const n = lt(
          t.size,
          t.size
        );
        this.hitDetectionCanvas_ = n.canvas, this.drawHitDetectionCanvas_(t, n);
      }
    }
    this.hitDetectionCanvas_ || (this.hitDetectionCanvas_ = this.getImage(1));
  }
  /**
   * @private
   * @param {CanvasRenderingContext2D} context The context to draw in.
   */
  createPath_(t) {
    let e = this.points_;
    const i = this.radius_;
    if (e === 1 / 0)
      t.arc(0, 0, i, 0, 2 * Math.PI);
    else {
      const n = this.radius2_ === void 0 ? i : this.radius2_;
      this.radius2_ !== void 0 && (e *= 2);
      const r = this.angle_ - Math.PI / 2, o = 2 * Math.PI / e;
      for (let a = 0; a < e; a++) {
        const l = r + a * o, h = a % 2 === 0 ? i : n;
        t.lineTo(h * Math.cos(l), h * Math.sin(l));
      }
      t.closePath();
    }
  }
  /**
   * @private
   * @param {RenderOptions} renderOptions Render options.
   * @param {CanvasRenderingContext2D} context The context.
   */
  drawHitDetectionCanvas_(t, e) {
    e.translate(t.size / 2, t.size / 2), this.createPath_(e), e.fillStyle = Yt, e.fill(), this.stroke_ && (e.strokeStyle = t.strokeStyle, e.lineWidth = t.strokeWidth, t.lineDash && (e.setLineDash(t.lineDash), e.lineDashOffset = t.lineDashOffset), e.lineJoin = t.lineJoin, e.miterLimit = t.miterLimit, e.stroke());
  }
}
const bo = Ts;
class Is extends bo {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    t = t || { radius: 5 }, super({
      points: 1 / 0,
      fill: t.fill,
      radius: t.radius,
      stroke: t.stroke,
      scale: t.scale !== void 0 ? t.scale : 1,
      rotation: t.rotation !== void 0 ? t.rotation : 0,
      rotateWithView: t.rotateWithView !== void 0 ? t.rotateWithView : !1,
      displacement: t.displacement !== void 0 ? t.displacement : [0, 0],
      declutterMode: t.declutterMode
    });
  }
  /**
   * Clones the style.
   * @return {CircleStyle} The cloned style.
   * @api
   */
  clone() {
    const t = this.getScale(), e = new Is({
      fill: this.getFill() ? this.getFill().clone() : void 0,
      stroke: this.getStroke() ? this.getStroke().clone() : void 0,
      radius: this.getRadius(),
      scale: Array.isArray(t) ? t.slice() : t,
      rotation: this.getRotation(),
      rotateWithView: this.getRotateWithView(),
      displacement: this.getDisplacement().slice(),
      declutterMode: this.getDeclutterMode()
    });
    return e.setOpacity(this.getOpacity()), e;
  }
  /**
   * Set the circle radius.
   *
   * @param {number} radius Circle radius.
   * @api
   */
  setRadius(t) {
    this.radius_ = t, this.render();
  }
}
const Fo = Is;
class Ss {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    t = t || {}, this.color_ = t.color !== void 0 ? t.color : null;
  }
  /**
   * Clones the style. The color is not cloned if it is an {@link module:ol/colorlike~ColorLike}.
   * @return {Fill} The cloned style.
   * @api
   */
  clone() {
    const t = this.getColor();
    return new Ss({
      color: Array.isArray(t) ? t.slice() : t || void 0
    });
  }
  /**
   * Get the fill color.
   * @return {import("../color.js").Color|import("../colorlike.js").ColorLike|null} Color.
   * @api
   */
  getColor() {
    return this.color_;
  }
  /**
   * Set the color.
   *
   * @param {import("../color.js").Color|import("../colorlike.js").ColorLike|null} color Color.
   * @api
   */
  setColor(t) {
    this.color_ = t;
  }
}
const vs = Ss;
class ws {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    t = t || {}, this.color_ = t.color !== void 0 ? t.color : null, this.lineCap_ = t.lineCap, this.lineDash_ = t.lineDash !== void 0 ? t.lineDash : null, this.lineDashOffset_ = t.lineDashOffset, this.lineJoin_ = t.lineJoin, this.miterLimit_ = t.miterLimit, this.width_ = t.width;
  }
  /**
   * Clones the style.
   * @return {Stroke} The cloned style.
   * @api
   */
  clone() {
    const t = this.getColor();
    return new ws({
      color: Array.isArray(t) ? t.slice() : t || void 0,
      lineCap: this.getLineCap(),
      lineDash: this.getLineDash() ? this.getLineDash().slice() : void 0,
      lineDashOffset: this.getLineDashOffset(),
      lineJoin: this.getLineJoin(),
      miterLimit: this.getMiterLimit(),
      width: this.getWidth()
    });
  }
  /**
   * Get the stroke color.
   * @return {import("../color.js").Color|import("../colorlike.js").ColorLike} Color.
   * @api
   */
  getColor() {
    return this.color_;
  }
  /**
   * Get the line cap type for the stroke.
   * @return {CanvasLineCap|undefined} Line cap.
   * @api
   */
  getLineCap() {
    return this.lineCap_;
  }
  /**
   * Get the line dash style for the stroke.
   * @return {Array<number>|null} Line dash.
   * @api
   */
  getLineDash() {
    return this.lineDash_;
  }
  /**
   * Get the line dash offset for the stroke.
   * @return {number|undefined} Line dash offset.
   * @api
   */
  getLineDashOffset() {
    return this.lineDashOffset_;
  }
  /**
   * Get the line join type for the stroke.
   * @return {CanvasLineJoin|undefined} Line join.
   * @api
   */
  getLineJoin() {
    return this.lineJoin_;
  }
  /**
   * Get the miter limit for the stroke.
   * @return {number|undefined} Miter limit.
   * @api
   */
  getMiterLimit() {
    return this.miterLimit_;
  }
  /**
   * Get the stroke width.
   * @return {number|undefined} Width.
   * @api
   */
  getWidth() {
    return this.width_;
  }
  /**
   * Set the color.
   *
   * @param {import("../color.js").Color|import("../colorlike.js").ColorLike} color Color.
   * @api
   */
  setColor(t) {
    this.color_ = t;
  }
  /**
   * Set the line cap.
   *
   * @param {CanvasLineCap|undefined} lineCap Line cap.
   * @api
   */
  setLineCap(t) {
    this.lineCap_ = t;
  }
  /**
   * Set the line dash.
   *
   * @param {Array<number>|null} lineDash Line dash.
   * @api
   */
  setLineDash(t) {
    this.lineDash_ = t;
  }
  /**
   * Set the line dash offset.
   *
   * @param {number|undefined} lineDashOffset Line dash offset.
   * @api
   */
  setLineDashOffset(t) {
    this.lineDashOffset_ = t;
  }
  /**
   * Set the line join.
   *
   * @param {CanvasLineJoin|undefined} lineJoin Line join.
   * @api
   */
  setLineJoin(t) {
    this.lineJoin_ = t;
  }
  /**
   * Set the miter limit.
   *
   * @param {number|undefined} miterLimit Miter limit.
   * @api
   */
  setMiterLimit(t) {
    this.miterLimit_ = t;
  }
  /**
   * Set the width.
   *
   * @param {number|undefined} width Width.
   * @api
   */
  setWidth(t) {
    this.width_ = t;
  }
}
const Do = ws;
class yn {
  /**
   * @param {Options} [options] Style options.
   */
  constructor(t) {
    t = t || {}, this.geometry_ = null, this.geometryFunction_ = yr, t.geometry !== void 0 && this.setGeometry(t.geometry), this.fill_ = t.fill !== void 0 ? t.fill : null, this.image_ = t.image !== void 0 ? t.image : null, this.renderer_ = t.renderer !== void 0 ? t.renderer : null, this.hitDetectionRenderer_ = t.hitDetectionRenderer !== void 0 ? t.hitDetectionRenderer : null, this.stroke_ = t.stroke !== void 0 ? t.stroke : null, this.text_ = t.text !== void 0 ? t.text : null, this.zIndex_ = t.zIndex;
  }
  /**
   * Clones the style.
   * @return {Style} The cloned style.
   * @api
   */
  clone() {
    let t = this.getGeometry();
    return t && typeof t == "object" && (t = /** @type {import("../geom/Geometry.js").default} */
    t.clone()), new yn({
      geometry: t,
      fill: this.getFill() ? this.getFill().clone() : void 0,
      image: this.getImage() ? this.getImage().clone() : void 0,
      renderer: this.getRenderer(),
      stroke: this.getStroke() ? this.getStroke().clone() : void 0,
      text: this.getText() ? this.getText().clone() : void 0,
      zIndex: this.getZIndex()
    });
  }
  /**
   * Get the custom renderer function that was configured with
   * {@link #setRenderer} or the `renderer` constructor option.
   * @return {RenderFunction|null} Custom renderer function.
   * @api
   */
  getRenderer() {
    return this.renderer_;
  }
  /**
   * Sets a custom renderer function for this style. When set, `fill`, `stroke`
   * and `image` options of the style will be ignored.
   * @param {RenderFunction|null} renderer Custom renderer function.
   * @api
   */
  setRenderer(t) {
    this.renderer_ = t;
  }
  /**
   * Sets a custom renderer function for this style used
   * in hit detection.
   * @param {RenderFunction|null} renderer Custom renderer function.
   * @api
   */
  setHitDetectionRenderer(t) {
    this.hitDetectionRenderer_ = t;
  }
  /**
   * Get the custom renderer function that was configured with
   * {@link #setHitDetectionRenderer} or the `hitDetectionRenderer` constructor option.
   * @return {RenderFunction|null} Custom renderer function.
   * @api
   */
  getHitDetectionRenderer() {
    return this.hitDetectionRenderer_;
  }
  /**
   * Get the geometry to be rendered.
   * @return {string|import("../geom/Geometry.js").default|GeometryFunction}
   * Feature property or geometry or function that returns the geometry that will
   * be rendered with this style.
   * @api
   */
  getGeometry() {
    return this.geometry_;
  }
  /**
   * Get the function used to generate a geometry for rendering.
   * @return {!GeometryFunction} Function that is called with a feature
   * and returns the geometry to render instead of the feature's geometry.
   * @api
   */
  getGeometryFunction() {
    return this.geometryFunction_;
  }
  /**
   * Get the fill style.
   * @return {import("./Fill.js").default} Fill style.
   * @api
   */
  getFill() {
    return this.fill_;
  }
  /**
   * Set the fill style.
   * @param {import("./Fill.js").default} fill Fill style.
   * @api
   */
  setFill(t) {
    this.fill_ = t;
  }
  /**
   * Get the image style.
   * @return {import("./Image.js").default} Image style.
   * @api
   */
  getImage() {
    return this.image_;
  }
  /**
   * Set the image style.
   * @param {import("./Image.js").default} image Image style.
   * @api
   */
  setImage(t) {
    this.image_ = t;
  }
  /**
   * Get the stroke style.
   * @return {import("./Stroke.js").default} Stroke style.
   * @api
   */
  getStroke() {
    return this.stroke_;
  }
  /**
   * Set the stroke style.
   * @param {import("./Stroke.js").default} stroke Stroke style.
   * @api
   */
  setStroke(t) {
    this.stroke_ = t;
  }
  /**
   * Get the text style.
   * @return {import("./Text.js").default} Text style.
   * @api
   */
  getText() {
    return this.text_;
  }
  /**
   * Set the text style.
   * @param {import("./Text.js").default} text Text style.
   * @api
   */
  setText(t) {
    this.text_ = t;
  }
  /**
   * Get the z-index for the style.
   * @return {number|undefined} ZIndex.
   * @api
   */
  getZIndex() {
    return this.zIndex_;
  }
  /**
   * Set a geometry that is rendered instead of the feature's geometry.
   *
   * @param {string|import("../geom/Geometry.js").default|GeometryFunction} geometry
   *     Feature property or geometry or function returning a geometry to render
   *     for this style.
   * @api
   */
  setGeometry(t) {
    typeof t == "function" ? this.geometryFunction_ = t : typeof t == "string" ? this.geometryFunction_ = function(e) {
      return (
        /** @type {import("../geom/Geometry.js").default} */
        e.get(t)
      );
    } : t ? t !== void 0 && (this.geometryFunction_ = function() {
      return (
        /** @type {import("../geom/Geometry.js").default} */
        t
      );
    }) : this.geometryFunction_ = yr, this.geometry_ = t;
  }
  /**
   * Set the z-index.
   *
   * @param {number|undefined} zIndex ZIndex.
   * @api
   */
  setZIndex(t) {
    this.zIndex_ = t;
  }
}
function Tc(s) {
  let t;
  if (typeof s == "function")
    t = s;
  else {
    let e;
    Array.isArray(s) ? e = s : (k(typeof /** @type {?} */
    s.getZIndex == "function", 41), e = [
      /** @type {Style} */
      s
    ]), t = function() {
      return e;
    };
  }
  return t;
}
let bn = null;
function Ic(s, t) {
  if (!bn) {
    const e = new vs({
      color: "rgba(255,255,255,0.4)"
    }), i = new Do({
      color: "#3399CC",
      width: 1.25
    });
    bn = [
      new yn({
        image: new Fo({
          fill: e,
          stroke: i,
          radius: 5
        }),
        fill: e,
        stroke: i
      })
    ];
  }
  return bn;
}
function yr(s) {
  return s.getGeometry();
}
const rn = yn;
let $e = null;
class Sc extends an {
  /**
   * @param {HTMLImageElement|HTMLCanvasElement} image Image.
   * @param {string|undefined} src Src.
   * @param {import("../size.js").Size} size Size.
   * @param {?string} crossOrigin Cross origin.
   * @param {import("../ImageState.js").default} imageState Image state.
   * @param {import("../color.js").Color} color Color.
   */
  constructor(t, e, i, n, r, o) {
    super(), this.hitDetectionImage_ = null, this.image_ = t, this.crossOrigin_ = n, this.canvas_ = {}, this.color_ = o, this.unlisten_ = null, this.imageState_ = r, this.size_ = i, this.src_ = e, this.tainted_;
  }
  /**
   * @private
   */
  initializeImage_() {
    this.image_ = new Image(), this.crossOrigin_ !== null && (this.image_.crossOrigin = this.crossOrigin_);
  }
  /**
   * @private
   * @return {boolean} The image canvas is tainted.
   */
  isTainted_() {
    if (this.tainted_ === void 0 && this.imageState_ === J.LOADED) {
      $e || ($e = lt(1, 1, void 0, {
        willReadFrequently: !0
      })), $e.drawImage(this.image_, 0, 0);
      try {
        $e.getImageData(0, 0, 1, 1), this.tainted_ = !1;
      } catch (t) {
        $e = null, this.tainted_ = !0;
      }
    }
    return this.tainted_ === !0;
  }
  /**
   * @private
   */
  dispatchChangeEvent_() {
    this.dispatchEvent(F.CHANGE);
  }
  /**
   * @private
   */
  handleImageError_() {
    this.imageState_ = J.ERROR, this.unlistenImage_(), this.dispatchChangeEvent_();
  }
  /**
   * @private
   */
  handleImageLoad_() {
    this.imageState_ = J.LOADED, this.size_ ? (this.image_.width = this.size_[0], this.image_.height = this.size_[1]) : this.size_ = [this.image_.width, this.image_.height], this.unlistenImage_(), this.dispatchChangeEvent_();
  }
  /**
   * @param {number} pixelRatio Pixel ratio.
   * @return {HTMLImageElement|HTMLCanvasElement} Image or Canvas element.
   */
  getImage(t) {
    return this.image_ || this.initializeImage_(), this.replaceColor_(t), this.canvas_[t] ? this.canvas_[t] : this.image_;
  }
  /**
   * @param {number} pixelRatio Pixel ratio.
   * @return {number} Image or Canvas element.
   */
  getPixelRatio(t) {
    return this.replaceColor_(t), this.canvas_[t] ? t : 1;
  }
  /**
   * @return {import("../ImageState.js").default} Image state.
   */
  getImageState() {
    return this.imageState_;
  }
  /**
   * @return {HTMLImageElement|HTMLCanvasElement} Image element.
   */
  getHitDetectionImage() {
    if (this.image_ || this.initializeImage_(), !this.hitDetectionImage_)
      if (this.isTainted_()) {
        const t = this.size_[0], e = this.size_[1], i = lt(t, e);
        i.fillRect(0, 0, t, e), this.hitDetectionImage_ = i.canvas;
      } else
        this.hitDetectionImage_ = this.image_;
    return this.hitDetectionImage_;
  }
  /**
   * Get the size of the icon (in pixels).
   * @return {import("../size.js").Size} Image size.
   */
  getSize() {
    return this.size_;
  }
  /**
   * @return {string|undefined} Image src.
   */
  getSrc() {
    return this.src_;
  }
  /**
   * Load not yet loaded URI.
   */
  load() {
    if (this.imageState_ === J.IDLE) {
      this.image_ || this.initializeImage_(), this.imageState_ = J.LOADING;
      try {
        this.image_.src = this.src_;
      } catch (t) {
        this.handleImageError_();
      }
      this.unlisten_ = vo(
        this.image_,
        this.handleImageLoad_.bind(this),
        this.handleImageError_.bind(this)
      );
    }
  }
  /**
   * @param {number} pixelRatio Pixel ratio.
   * @private
   */
  replaceColor_(t) {
    if (!this.color_ || this.canvas_[t] || this.imageState_ !== J.LOADED)
      return;
    const e = this.image_, i = document.createElement("canvas");
    i.width = Math.ceil(e.width * t), i.height = Math.ceil(e.height * t);
    const n = i.getContext("2d");
    n.scale(t, t), n.drawImage(e, 0, 0), n.globalCompositeOperation = "multiply", n.fillStyle = Kr(this.color_), n.fillRect(0, 0, i.width / t, i.height / t), n.globalCompositeOperation = "destination-in", n.drawImage(e, 0, 0), this.canvas_[t] = i;
  }
  /**
   * Discards event handlers which listen for load completion or errors.
   *
   * @private
   */
  unlistenImage_() {
    this.unlisten_ && (this.unlisten_(), this.unlisten_ = null);
  }
}
function vc(s, t, e, i, n, r) {
  let o = Vi.get(t, i, r);
  return o || (o = new Sc(s, t, e, i, n, r), Vi.set(t, i, r, o)), o;
}
class Ls extends Oo {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    t = t || {};
    const e = t.opacity !== void 0 ? t.opacity : 1, i = t.rotation !== void 0 ? t.rotation : 0, n = t.scale !== void 0 ? t.scale : 1, r = t.rotateWithView !== void 0 ? t.rotateWithView : !1;
    super({
      opacity: e,
      rotation: i,
      scale: n,
      displacement: t.displacement !== void 0 ? t.displacement : [0, 0],
      rotateWithView: r,
      declutterMode: t.declutterMode
    }), this.anchor_ = t.anchor !== void 0 ? t.anchor : [0.5, 0.5], this.normalizedAnchor_ = null, this.anchorOrigin_ = t.anchorOrigin !== void 0 ? t.anchorOrigin : "top-left", this.anchorXUnits_ = t.anchorXUnits !== void 0 ? t.anchorXUnits : "fraction", this.anchorYUnits_ = t.anchorYUnits !== void 0 ? t.anchorYUnits : "fraction", this.crossOrigin_ = t.crossOrigin !== void 0 ? t.crossOrigin : null;
    const o = t.img !== void 0 ? t.img : null;
    this.imgSize_ = t.imgSize;
    let a = t.src;
    k(!(a !== void 0 && o), 4), k(!o || o && this.imgSize_, 5), (a === void 0 || a.length === 0) && o && (a = /** @type {HTMLImageElement} */
    o.src || z(o)), k(a !== void 0 && a.length > 0, 6), k(
      !((t.width !== void 0 || t.height !== void 0) && t.scale !== void 0),
      69
    );
    const l = t.src !== void 0 ? J.IDLE : J.LOADED;
    if (this.color_ = t.color !== void 0 ? Ui(t.color) : null, this.iconImage_ = vc(
      o,
      /** @type {string} */
      a,
      this.imgSize_ !== void 0 ? this.imgSize_ : null,
      this.crossOrigin_,
      l,
      this.color_
    ), this.offset_ = t.offset !== void 0 ? t.offset : [0, 0], this.offsetOrigin_ = t.offsetOrigin !== void 0 ? t.offsetOrigin : "top-left", this.origin_ = null, this.size_ = t.size !== void 0 ? t.size : null, this.width_ = t.width, this.height_ = t.height, this.width_ !== void 0 || this.height_ !== void 0) {
      const h = this.getImage(1), c = () => {
        this.updateScaleFromWidthAndHeight(this.width_, this.height_);
      };
      h.width > 0 ? this.updateScaleFromWidthAndHeight(this.width_, this.height_) : h.addEventListener("load", c);
    }
  }
  /**
   * Clones the style. The underlying Image/HTMLCanvasElement is not cloned.
   * @return {Icon} The cloned style.
   * @api
   */
  clone() {
    let t = this.getScale();
    return t = Array.isArray(t) ? t.slice() : t, (this.width_ !== void 0 || this.height_ !== void 0) && (t = void 0), new Ls({
      anchor: this.anchor_.slice(),
      anchorOrigin: this.anchorOrigin_,
      anchorXUnits: this.anchorXUnits_,
      anchorYUnits: this.anchorYUnits_,
      color: this.color_ && this.color_.slice ? this.color_.slice() : this.color_ || void 0,
      crossOrigin: this.crossOrigin_,
      imgSize: this.imgSize_,
      offset: this.offset_.slice(),
      offsetOrigin: this.offsetOrigin_,
      opacity: this.getOpacity(),
      rotateWithView: this.getRotateWithView(),
      rotation: this.getRotation(),
      scale: t,
      size: this.size_ !== null ? this.size_.slice() : void 0,
      src: this.getSrc(),
      displacement: this.getDisplacement().slice(),
      declutterMode: this.getDeclutterMode(),
      width: this.width_,
      height: this.height_
    });
  }
  /**
   * Set the scale of the Icon by calculating it from given width and height and the
   * width and height of the image.
   *
   * @private
   * @param {number} width The width.
   * @param {number} height The height.
   */
  updateScaleFromWidthAndHeight(t, e) {
    const i = this.getImage(1);
    t !== void 0 && e !== void 0 ? super.setScale([t / i.width, e / i.height]) : t !== void 0 ? super.setScale([t / i.width, t / i.width]) : e !== void 0 ? super.setScale([e / i.height, e / i.height]) : super.setScale([1, 1]);
  }
  /**
   * Get the anchor point in pixels. The anchor determines the center point for the
   * symbolizer.
   * @return {Array<number>} Anchor.
   * @api
   */
  getAnchor() {
    let t = this.normalizedAnchor_;
    if (!t) {
      t = this.anchor_;
      const n = this.getSize();
      if (this.anchorXUnits_ == "fraction" || this.anchorYUnits_ == "fraction") {
        if (!n)
          return null;
        t = this.anchor_.slice(), this.anchorXUnits_ == "fraction" && (t[0] *= n[0]), this.anchorYUnits_ == "fraction" && (t[1] *= n[1]);
      }
      if (this.anchorOrigin_ != "top-left") {
        if (!n)
          return null;
        t === this.anchor_ && (t = this.anchor_.slice()), (this.anchorOrigin_ == "top-right" || this.anchorOrigin_ == "bottom-right") && (t[0] = -t[0] + n[0]), (this.anchorOrigin_ == "bottom-left" || this.anchorOrigin_ == "bottom-right") && (t[1] = -t[1] + n[1]);
      }
      this.normalizedAnchor_ = t;
    }
    const e = this.getDisplacement(), i = this.getScaleArray();
    return [
      t[0] - e[0] / i[0],
      t[1] + e[1] / i[1]
    ];
  }
  /**
   * Set the anchor point. The anchor determines the center point for the
   * symbolizer.
   *
   * @param {Array<number>} anchor Anchor.
   * @api
   */
  setAnchor(t) {
    this.anchor_ = t, this.normalizedAnchor_ = null;
  }
  /**
   * Get the icon color.
   * @return {import("../color.js").Color} Color.
   * @api
   */
  getColor() {
    return this.color_;
  }
  /**
   * Get the image icon.
   * @param {number} pixelRatio Pixel ratio.
   * @return {HTMLImageElement|HTMLCanvasElement} Image or Canvas element.
   * @api
   */
  getImage(t) {
    return this.iconImage_.getImage(t);
  }
  /**
   * Get the pixel ratio.
   * @param {number} pixelRatio Pixel ratio.
   * @return {number} The pixel ratio of the image.
   * @api
   */
  getPixelRatio(t) {
    return this.iconImage_.getPixelRatio(t);
  }
  /**
   * @return {import("../size.js").Size} Image size.
   */
  getImageSize() {
    return this.iconImage_.getSize();
  }
  /**
   * @return {import("../ImageState.js").default} Image state.
   */
  getImageState() {
    return this.iconImage_.getImageState();
  }
  /**
   * @return {HTMLImageElement|HTMLCanvasElement} Image element.
   */
  getHitDetectionImage() {
    return this.iconImage_.getHitDetectionImage();
  }
  /**
   * Get the origin of the symbolizer.
   * @return {Array<number>} Origin.
   * @api
   */
  getOrigin() {
    if (this.origin_)
      return this.origin_;
    let t = this.offset_;
    if (this.offsetOrigin_ != "top-left") {
      const e = this.getSize(), i = this.iconImage_.getSize();
      if (!e || !i)
        return null;
      t = t.slice(), (this.offsetOrigin_ == "top-right" || this.offsetOrigin_ == "bottom-right") && (t[0] = i[0] - e[0] - t[0]), (this.offsetOrigin_ == "bottom-left" || this.offsetOrigin_ == "bottom-right") && (t[1] = i[1] - e[1] - t[1]);
    }
    return this.origin_ = t, this.origin_;
  }
  /**
   * Get the image URL.
   * @return {string|undefined} Image src.
   * @api
   */
  getSrc() {
    return this.iconImage_.getSrc();
  }
  /**
   * Get the size of the icon (in pixels).
   * @return {import("../size.js").Size} Image size.
   * @api
   */
  getSize() {
    return this.size_ ? this.size_ : this.iconImage_.getSize();
  }
  /**
   * Get the width of the icon (in pixels).
   * @return {number} Icon width (in pixels).
   * @api
   */
  getWidth() {
    return this.width_;
  }
  /**
   * Get the height of the icon (in pixels).
   * @return {number} Icon height (in pixels).
   * @api
   */
  getHeight() {
    return this.height_;
  }
  /**
   * Set the width of the icon in pixels.
   *
   * @param {number} width The width to set.
   */
  setWidth(t) {
    this.width_ = t, this.updateScaleFromWidthAndHeight(t, this.height_);
  }
  /**
   * Set the height of the icon in pixels.
   *
   * @param {number} height The height to set.
   */
  setHeight(t) {
    this.height_ = t, this.updateScaleFromWidthAndHeight(this.width_, t);
  }
  /**
   * Set the scale and updates the width and height correspondingly.
   *
   * @param {number|import("../size.js").Size} scale Scale.
   * @override
   * @api
   */
  setScale(t) {
    super.setScale(t);
    const e = this.getImage(1);
    if (e) {
      const i = Array.isArray(t) ? t[0] : t;
      i !== void 0 && (this.width_ = i * e.width);
      const n = Array.isArray(t) ? t[1] : t;
      n !== void 0 && (this.height_ = n * e.height);
    }
  }
  /**
   * @param {function(import("../events/Event.js").default): void} listener Listener function.
   */
  listenImageChange(t) {
    this.iconImage_.addEventListener(F.CHANGE, t);
  }
  /**
   * Load not yet loaded URI.
   * When rendering a feature with an icon style, the vector renderer will
   * automatically call this method. However, you might want to call this
   * method yourself for preloading or other purposes.
   * @api
   */
  load() {
    this.iconImage_.load();
  }
  /**
   * @param {function(import("../events/Event.js").default): void} listener Listener function.
   */
  unlistenImageChange(t) {
    this.iconImage_.removeEventListener(F.CHANGE, t);
  }
}
const As = Ls, wc = "#333";
class Ms {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    t = t || {}, this.font_ = t.font, this.rotation_ = t.rotation, this.rotateWithView_ = t.rotateWithView, this.scale_ = t.scale, this.scaleArray_ = _t(t.scale !== void 0 ? t.scale : 1), this.text_ = t.text, this.textAlign_ = t.textAlign, this.justify_ = t.justify, this.repeat_ = t.repeat, this.textBaseline_ = t.textBaseline, this.fill_ = t.fill !== void 0 ? t.fill : new vs({ color: wc }), this.maxAngle_ = t.maxAngle !== void 0 ? t.maxAngle : Math.PI / 4, this.placement_ = t.placement !== void 0 ? t.placement : "point", this.overflow_ = !!t.overflow, this.stroke_ = t.stroke !== void 0 ? t.stroke : null, this.offsetX_ = t.offsetX !== void 0 ? t.offsetX : 0, this.offsetY_ = t.offsetY !== void 0 ? t.offsetY : 0, this.backgroundFill_ = t.backgroundFill ? t.backgroundFill : null, this.backgroundStroke_ = t.backgroundStroke ? t.backgroundStroke : null, this.padding_ = t.padding === void 0 ? null : t.padding;
  }
  /**
   * Clones the style.
   * @return {Text} The cloned style.
   * @api
   */
  clone() {
    const t = this.getScale();
    return new Ms({
      font: this.getFont(),
      placement: this.getPlacement(),
      repeat: this.getRepeat(),
      maxAngle: this.getMaxAngle(),
      overflow: this.getOverflow(),
      rotation: this.getRotation(),
      rotateWithView: this.getRotateWithView(),
      scale: Array.isArray(t) ? t.slice() : t,
      text: this.getText(),
      textAlign: this.getTextAlign(),
      justify: this.getJustify(),
      textBaseline: this.getTextBaseline(),
      fill: this.getFill() ? this.getFill().clone() : void 0,
      stroke: this.getStroke() ? this.getStroke().clone() : void 0,
      offsetX: this.getOffsetX(),
      offsetY: this.getOffsetY(),
      backgroundFill: this.getBackgroundFill() ? this.getBackgroundFill().clone() : void 0,
      backgroundStroke: this.getBackgroundStroke() ? this.getBackgroundStroke().clone() : void 0,
      padding: this.getPadding() || void 0
    });
  }
  /**
   * Get the `overflow` configuration.
   * @return {boolean} Let text overflow the length of the path they follow.
   * @api
   */
  getOverflow() {
    return this.overflow_;
  }
  /**
   * Get the font name.
   * @return {string|undefined} Font.
   * @api
   */
  getFont() {
    return this.font_;
  }
  /**
   * Get the maximum angle between adjacent characters.
   * @return {number} Angle in radians.
   * @api
   */
  getMaxAngle() {
    return this.maxAngle_;
  }
  /**
   * Get the label placement.
   * @return {TextPlacement} Text placement.
   * @api
   */
  getPlacement() {
    return this.placement_;
  }
  /**
   * Get the repeat interval of the text.
   * @return {number|undefined} Repeat interval in pixels.
   * @api
   */
  getRepeat() {
    return this.repeat_;
  }
  /**
   * Get the x-offset for the text.
   * @return {number} Horizontal text offset.
   * @api
   */
  getOffsetX() {
    return this.offsetX_;
  }
  /**
   * Get the y-offset for the text.
   * @return {number} Vertical text offset.
   * @api
   */
  getOffsetY() {
    return this.offsetY_;
  }
  /**
   * Get the fill style for the text.
   * @return {import("./Fill.js").default} Fill style.
   * @api
   */
  getFill() {
    return this.fill_;
  }
  /**
   * Determine whether the text rotates with the map.
   * @return {boolean|undefined} Rotate with map.
   * @api
   */
  getRotateWithView() {
    return this.rotateWithView_;
  }
  /**
   * Get the text rotation.
   * @return {number|undefined} Rotation.
   * @api
   */
  getRotation() {
    return this.rotation_;
  }
  /**
   * Get the text scale.
   * @return {number|import("../size.js").Size|undefined} Scale.
   * @api
   */
  getScale() {
    return this.scale_;
  }
  /**
   * Get the symbolizer scale array.
   * @return {import("../size.js").Size} Scale array.
   */
  getScaleArray() {
    return this.scaleArray_;
  }
  /**
   * Get the stroke style for the text.
   * @return {import("./Stroke.js").default} Stroke style.
   * @api
   */
  getStroke() {
    return this.stroke_;
  }
  /**
   * Get the text to be rendered.
   * @return {string|Array<string>|undefined} Text.
   * @api
   */
  getText() {
    return this.text_;
  }
  /**
   * Get the text alignment.
   * @return {CanvasTextAlign|undefined} Text align.
   * @api
   */
  getTextAlign() {
    return this.textAlign_;
  }
  /**
   * Get the justification.
   * @return {TextJustify|undefined} Justification.
   * @api
   */
  getJustify() {
    return this.justify_;
  }
  /**
   * Get the text baseline.
   * @return {CanvasTextBaseline|undefined} Text baseline.
   * @api
   */
  getTextBaseline() {
    return this.textBaseline_;
  }
  /**
   * Get the background fill style for the text.
   * @return {import("./Fill.js").default} Fill style.
   * @api
   */
  getBackgroundFill() {
    return this.backgroundFill_;
  }
  /**
   * Get the background stroke style for the text.
   * @return {import("./Stroke.js").default} Stroke style.
   * @api
   */
  getBackgroundStroke() {
    return this.backgroundStroke_;
  }
  /**
   * Get the padding for the text.
   * @return {Array<number>|null} Padding.
   * @api
   */
  getPadding() {
    return this.padding_;
  }
  /**
   * Set the `overflow` property.
   *
   * @param {boolean} overflow Let text overflow the path that it follows.
   * @api
   */
  setOverflow(t) {
    this.overflow_ = t;
  }
  /**
   * Set the font.
   *
   * @param {string|undefined} font Font.
   * @api
   */
  setFont(t) {
    this.font_ = t;
  }
  /**
   * Set the maximum angle between adjacent characters.
   *
   * @param {number} maxAngle Angle in radians.
   * @api
   */
  setMaxAngle(t) {
    this.maxAngle_ = t;
  }
  /**
   * Set the x offset.
   *
   * @param {number} offsetX Horizontal text offset.
   * @api
   */
  setOffsetX(t) {
    this.offsetX_ = t;
  }
  /**
   * Set the y offset.
   *
   * @param {number} offsetY Vertical text offset.
   * @api
   */
  setOffsetY(t) {
    this.offsetY_ = t;
  }
  /**
   * Set the text placement.
   *
   * @param {TextPlacement} placement Placement.
   * @api
   */
  setPlacement(t) {
    this.placement_ = t;
  }
  /**
   * Set the repeat interval of the text.
   * @param {number|undefined} [repeat] Repeat interval in pixels.
   * @api
   */
  setRepeat(t) {
    this.repeat_ = t;
  }
  /**
   * Set whether to rotate the text with the view.
   *
   * @param {boolean} rotateWithView Rotate with map.
   * @api
   */
  setRotateWithView(t) {
    this.rotateWithView_ = t;
  }
  /**
   * Set the fill.
   *
   * @param {import("./Fill.js").default} fill Fill style.
   * @api
   */
  setFill(t) {
    this.fill_ = t;
  }
  /**
   * Set the rotation.
   *
   * @param {number|undefined} rotation Rotation.
   * @api
   */
  setRotation(t) {
    this.rotation_ = t;
  }
  /**
   * Set the scale.
   *
   * @param {number|import("../size.js").Size|undefined} scale Scale.
   * @api
   */
  setScale(t) {
    this.scale_ = t, this.scaleArray_ = _t(t !== void 0 ? t : 1);
  }
  /**
   * Set the stroke.
   *
   * @param {import("./Stroke.js").default} stroke Stroke style.
   * @api
   */
  setStroke(t) {
    this.stroke_ = t;
  }
  /**
   * Set the text.
   *
   * @param {string|Array<string>|undefined} text Text.
   * @api
   */
  setText(t) {
    this.text_ = t;
  }
  /**
   * Set the text alignment.
   *
   * @param {CanvasTextAlign|undefined} textAlign Text align.
   * @api
   */
  setTextAlign(t) {
    this.textAlign_ = t;
  }
  /**
   * Set the justification.
   *
   * @param {TextJustify|undefined} justify Justification.
   * @api
   */
  setJustify(t) {
    this.justify_ = t;
  }
  /**
   * Set the text baseline.
   *
   * @param {CanvasTextBaseline|undefined} textBaseline Text baseline.
   * @api
   */
  setTextBaseline(t) {
    this.textBaseline_ = t;
  }
  /**
   * Set the background fill.
   *
   * @param {import("./Fill.js").default} fill Fill style.
   * @api
   */
  setBackgroundFill(t) {
    this.backgroundFill_ = t;
  }
  /**
   * Set the background stroke.
   *
   * @param {import("./Stroke.js").default} stroke Stroke style.
   * @api
   */
  setBackgroundStroke(t) {
    this.backgroundStroke_ = t;
  }
  /**
   * Set the padding (`[top, right, bottom, left]`).
   *
   * @param {Array<number>|null} padding Padding.
   * @api
   */
  setPadding(t) {
    this.padding_ = t;
  }
}
const Lc = Ms;
function xr(s) {
  return new rn({
    fill: gi(s, ""),
    stroke: _i(s, ""),
    text: Ac(s),
    image: Mc(s)
  });
}
function gi(s, t) {
  const e = s[t + "fill-color"];
  if (e)
    return new vs({ color: e });
}
function _i(s, t) {
  const e = s[t + "stroke-width"], i = s[t + "stroke-color"];
  if (!(!e && !i))
    return new Do({
      width: e,
      color: i,
      lineCap: s[t + "stroke-line-cap"],
      lineJoin: s[t + "stroke-line-join"],
      lineDash: s[t + "stroke-line-dash"],
      lineDashOffset: s[t + "stroke-line-dash-offset"],
      miterLimit: s[t + "stroke-miter-limit"]
    });
}
function Ac(s) {
  const t = s["text-value"];
  return t ? new Lc({
    text: t,
    font: s["text-font"],
    maxAngle: s["text-max-angle"],
    offsetX: s["text-offset-x"],
    offsetY: s["text-offset-y"],
    overflow: s["text-overflow"],
    placement: s["text-placement"],
    repeat: s["text-repeat"],
    scale: s["text-scale"],
    rotateWithView: s["text-rotate-with-view"],
    rotation: s["text-rotation"],
    textAlign: s["text-align"],
    justify: s["text-justify"],
    textBaseline: s["text-baseline"],
    padding: s["text-padding"],
    fill: gi(s, "text-"),
    backgroundFill: gi(s, "text-background-"),
    stroke: _i(s, "text-"),
    backgroundStroke: _i(s, "text-background-")
  }) : void 0;
}
function Mc(s) {
  const t = s["icon-src"], e = s["icon-img"];
  if (t || e)
    return new As({
      src: t,
      img: e,
      imgSize: s["icon-img-size"],
      anchor: s["icon-anchor"],
      anchorOrigin: s["icon-anchor-origin"],
      anchorXUnits: s["icon-anchor-x-units"],
      anchorYUnits: s["icon-anchor-y-units"],
      color: s["icon-color"],
      crossOrigin: s["icon-cross-origin"],
      offset: s["icon-offset"],
      displacement: s["icon-displacement"],
      opacity: s["icon-opacity"],
      scale: s["icon-scale"],
      rotation: s["icon-rotation"],
      rotateWithView: s["icon-rotate-with-view"],
      size: s["icon-size"],
      declutterMode: s["icon-declutter-mode"]
    });
  const i = s["shape-points"];
  if (i) {
    const r = "shape-";
    return new bo({
      points: i,
      fill: gi(s, r),
      stroke: _i(s, r),
      radius: s["shape-radius"],
      radius1: s["shape-radius1"],
      radius2: s["shape-radius2"],
      angle: s["shape-angle"],
      displacement: s["shape-displacement"],
      rotation: s["shape-rotation"],
      rotateWithView: s["shape-rotate-with-view"],
      scale: s["shape-scale"],
      declutterMode: s["shape-declutter-mode"]
    });
  }
  const n = s["circle-radius"];
  if (n) {
    const r = "circle-";
    return new Fo({
      radius: n,
      fill: gi(s, r),
      stroke: _i(s, r),
      displacement: s["circle-displacement"],
      scale: s["circle-scale"],
      rotation: s["circle-rotation"],
      rotateWithView: s["circle-rotate-with-view"],
      declutterMode: s["circle-declutter-mode"]
    });
  }
}
const Er = {
  RENDER_ORDER: "renderOrder"
};
class Pc extends gn {
  /**
   * @param {Options<VectorSourceType>} [options] Options.
   */
  constructor(t) {
    t = t || {};
    const e = Object.assign({}, t);
    delete e.style, delete e.renderBuffer, delete e.updateWhileAnimating, delete e.updateWhileInteracting, super(e), this.declutter_ = t.declutter !== void 0 ? t.declutter : !1, this.renderBuffer_ = t.renderBuffer !== void 0 ? t.renderBuffer : 100, this.style_ = null, this.styleFunction_ = void 0, this.setStyle(t.style), this.updateWhileAnimating_ = t.updateWhileAnimating !== void 0 ? t.updateWhileAnimating : !1, this.updateWhileInteracting_ = t.updateWhileInteracting !== void 0 ? t.updateWhileInteracting : !1;
  }
  /**
   * @return {boolean} Declutter.
   */
  getDeclutter() {
    return this.declutter_;
  }
  /**
   * Get the topmost feature that intersects the given pixel on the viewport. Returns a promise
   * that resolves with an array of features. The array will either contain the topmost feature
   * when a hit was detected, or it will be empty.
   *
   * The hit detection algorithm used for this method is optimized for performance, but is less
   * accurate than the one used in [map.getFeaturesAtPixel()]{@link import("../Map.js").default#getFeaturesAtPixel}.
   * Text is not considered, and icons are only represented by their bounding box instead of the exact
   * image.
   *
   * @param {import("../pixel.js").Pixel} pixel Pixel.
   * @return {Promise<Array<import("../Feature").FeatureLike>>} Promise that resolves with an array of features.
   * @api
   */
  getFeatures(t) {
    return super.getFeatures(t);
  }
  /**
   * @return {number|undefined} Render buffer.
   */
  getRenderBuffer() {
    return this.renderBuffer_;
  }
  /**
   * @return {function(import("../Feature.js").default, import("../Feature.js").default): number|null|undefined} Render
   *     order.
   */
  getRenderOrder() {
    return (
      /** @type {import("../render.js").OrderFunction|null|undefined} */
      this.get(Er.RENDER_ORDER)
    );
  }
  /**
   * Get the style for features.  This returns whatever was passed to the `style`
   * option at construction or to the `setStyle` method.
   * @return {import("../style/Style.js").StyleLike|null|undefined} Layer style.
   * @api
   */
  getStyle() {
    return this.style_;
  }
  /**
   * Get the style function.
   * @return {import("../style/Style.js").StyleFunction|undefined} Layer style function.
   * @api
   */
  getStyleFunction() {
    return this.styleFunction_;
  }
  /**
   * @return {boolean} Whether the rendered layer should be updated while
   *     animating.
   */
  getUpdateWhileAnimating() {
    return this.updateWhileAnimating_;
  }
  /**
   * @return {boolean} Whether the rendered layer should be updated while
   *     interacting.
   */
  getUpdateWhileInteracting() {
    return this.updateWhileInteracting_;
  }
  /**
   * Render declutter items for this layer
   * @param {import("../Map.js").FrameState} frameState Frame state.
   */
  renderDeclutter(t) {
    t.declutterTree || (t.declutterTree = new Po(9)), this.getRenderer().renderDeclutter(t);
  }
  /**
   * @param {import("../render.js").OrderFunction|null|undefined} renderOrder
   *     Render order.
   */
  setRenderOrder(t) {
    this.set(Er.RENDER_ORDER, t);
  }
  /**
   * Set the style for features.  This can be a single style object, an array
   * of styles, or a function that takes a feature and resolution and returns
   * an array of styles. If set to `null`, the layer has no style (a `null` style),
   * so only features that have their own styles will be rendered in the layer. Call
   * `setStyle()` without arguments to reset to the default style. See
   * [the ol/style/Style module]{@link module:ol/style/Style~Style} for information on the default style.
   *
   * If your layer has a static style, you can use "flat" style object literals instead of
   * using the `Style` and symbolizer constructors (`Fill`, `Stroke`, etc.).  See the documentation
   * for the [flat style types]{@link module:ol/style/flat~FlatStyle} to see what properties are supported.
   *
   * @param {import("../style/Style.js").StyleLike|import("../style/flat.js").FlatStyleLike|null} [style] Layer style.
   * @api
   */
  setStyle(t) {
    let e;
    if (t === void 0)
      e = Ic;
    else if (t === null)
      e = null;
    else if (typeof t == "function")
      e = t;
    else if (t instanceof rn)
      e = t;
    else if (Array.isArray(t)) {
      const i = t.length, n = new Array(i);
      for (let r = 0; r < i; ++r) {
        const o = t[r];
        o instanceof rn ? n[r] = o : n[r] = xr(o);
      }
      e = n;
    } else
      e = xr(t);
    this.style_ = e, this.styleFunction_ = t === null ? void 0 : Tc(this.style_), this.changed();
  }
}
const Oc = Pc, Ei = {
  BEGIN_GEOMETRY: 0,
  BEGIN_PATH: 1,
  CIRCLE: 2,
  CLOSE_PATH: 3,
  CUSTOM: 4,
  DRAW_CHARS: 5,
  DRAW_IMAGE: 6,
  END_GEOMETRY: 7,
  FILL: 8,
  MOVE_TO_LINE_TO: 9,
  SET_FILL_STYLE: 10,
  SET_STROKE_STYLE: 11,
  STROKE: 12
}, zi = [Ei.FILL], ee = [Ei.STROKE], ge = [Ei.BEGIN_PATH], Cr = [Ei.CLOSE_PATH], M = Ei;
class bc {
  /**
   * Render a geometry with a custom renderer.
   *
   * @param {import("../geom/SimpleGeometry.js").default} geometry Geometry.
   * @param {import("../Feature.js").FeatureLike} feature Feature.
   * @param {Function} renderer Renderer.
   * @param {Function} hitDetectionRenderer Renderer.
   */
  drawCustom(t, e, i, n) {
  }
  /**
   * Render a geometry.
   *
   * @param {import("../geom/Geometry.js").default} geometry The geometry to render.
   */
  drawGeometry(t) {
  }
  /**
   * Set the rendering style.
   *
   * @param {import("../style/Style.js").default} style The rendering style.
   */
  setStyle(t) {
  }
  /**
   * @param {import("../geom/Circle.js").default} circleGeometry Circle geometry.
   * @param {import("../Feature.js").default} feature Feature.
   */
  drawCircle(t, e) {
  }
  /**
   * @param {import("../Feature.js").default} feature Feature.
   * @param {import("../style/Style.js").default} style Style.
   */
  drawFeature(t, e) {
  }
  /**
   * @param {import("../geom/GeometryCollection.js").default} geometryCollectionGeometry Geometry collection.
   * @param {import("../Feature.js").default} feature Feature.
   */
  drawGeometryCollection(t, e) {
  }
  /**
   * @param {import("../geom/LineString.js").default|import("./Feature.js").default} lineStringGeometry Line string geometry.
   * @param {import("../Feature.js").FeatureLike} feature Feature.
   */
  drawLineString(t, e) {
  }
  /**
   * @param {import("../geom/MultiLineString.js").default|import("./Feature.js").default} multiLineStringGeometry MultiLineString geometry.
   * @param {import("../Feature.js").FeatureLike} feature Feature.
   */
  drawMultiLineString(t, e) {
  }
  /**
   * @param {import("../geom/MultiPoint.js").default|import("./Feature.js").default} multiPointGeometry MultiPoint geometry.
   * @param {import("../Feature.js").FeatureLike} feature Feature.
   */
  drawMultiPoint(t, e) {
  }
  /**
   * @param {import("../geom/MultiPolygon.js").default} multiPolygonGeometry MultiPolygon geometry.
   * @param {import("../Feature.js").FeatureLike} feature Feature.
   */
  drawMultiPolygon(t, e) {
  }
  /**
   * @param {import("../geom/Point.js").default|import("./Feature.js").default} pointGeometry Point geometry.
   * @param {import("../Feature.js").FeatureLike} feature Feature.
   */
  drawPoint(t, e) {
  }
  /**
   * @param {import("../geom/Polygon.js").default|import("./Feature.js").default} polygonGeometry Polygon geometry.
   * @param {import("../Feature.js").FeatureLike} feature Feature.
   */
  drawPolygon(t, e) {
  }
  /**
   * @param {import("../geom/SimpleGeometry.js").default|import("./Feature.js").default} geometry Geometry.
   * @param {import("../Feature.js").FeatureLike} feature Feature.
   */
  drawText(t, e) {
  }
  /**
   * @param {import("../style/Fill.js").default} fillStyle Fill style.
   * @param {import("../style/Stroke.js").default} strokeStyle Stroke style.
   */
  setFillStrokeStyle(t, e) {
  }
  /**
   * @param {import("../style/Image.js").default} imageStyle Image style.
   * @param {import("../render/canvas.js").DeclutterImageWithText} [declutterImageWithText] Shared data for combined decluttering with a text style.
   */
  setImageStyle(t, e) {
  }
  /**
   * @param {import("../style/Text.js").default} textStyle Text style.
   * @param {import("../render/canvas.js").DeclutterImageWithText} [declutterImageWithText] Shared data for combined decluttering with an image style.
   */
  setTextStyle(t, e) {
  }
}
const ko = bc;
class Fc extends ko {
  /**
   * @param {number} tolerance Tolerance.
   * @param {import("../../extent.js").Extent} maxExtent Maximum extent.
   * @param {number} resolution Resolution.
   * @param {number} pixelRatio Pixel ratio.
   */
  constructor(t, e, i, n) {
    super(), this.tolerance = t, this.maxExtent = e, this.pixelRatio = n, this.maxLineWidth = 0, this.resolution = i, this.beginGeometryInstruction1_ = null, this.beginGeometryInstruction2_ = null, this.bufferedMaxExtent_ = null, this.instructions = [], this.coordinates = [], this.tmpCoordinate_ = [], this.hitDetectionInstructions = [], this.state = /** @type {import("../canvas.js").FillStrokeState} */
    {};
  }
  /**
   * @protected
   * @param {Array<number>} dashArray Dash array.
   * @return {Array<number>} Dash array with pixel ratio applied
   */
  applyPixelRatio(t) {
    const e = this.pixelRatio;
    return e == 1 ? t : t.map(function(i) {
      return i * e;
    });
  }
  /**
   * @param {Array<number>} flatCoordinates Flat coordinates.
   * @param {number} stride Stride.
   * @protected
   * @return {number} My end
   */
  appendFlatPointCoordinates(t, e) {
    const i = this.getBufferedMaxExtent(), n = this.tmpCoordinate_, r = this.coordinates;
    let o = r.length;
    for (let a = 0, l = t.length; a < l; a += e)
      n[0] = t[a], n[1] = t[a + 1], hn(i, n) && (r[o++] = n[0], r[o++] = n[1]);
    return o;
  }
  /**
   * @param {Array<number>} flatCoordinates Flat coordinates.
   * @param {number} offset Offset.
   * @param {number} end End.
   * @param {number} stride Stride.
   * @param {boolean} closed Last input coordinate equals first.
   * @param {boolean} skipFirst Skip first coordinate.
   * @protected
   * @return {number} My end.
   */
  appendFlatLineCoordinates(t, e, i, n, r, o) {
    const a = this.coordinates;
    let l = a.length;
    const h = this.getBufferedMaxExtent();
    o && (e += n);
    let c = t[e], u = t[e + 1];
    const d = this.tmpCoordinate_;
    let f = !0, g, _, m;
    for (g = e + n; g < i; g += n)
      d[0] = t[g], d[1] = t[g + 1], m = Xn(h, d), m !== _ ? (f && (a[l++] = c, a[l++] = u, f = !1), a[l++] = d[0], a[l++] = d[1]) : m === tt.INTERSECTING ? (a[l++] = d[0], a[l++] = d[1], f = !1) : f = !0, c = d[0], u = d[1], _ = m;
    return (r && f || g === e + n) && (a[l++] = c, a[l++] = u), l;
  }
  /**
   * @param {Array<number>} flatCoordinates Flat coordinates.
   * @param {number} offset Offset.
   * @param {Array<number>} ends Ends.
   * @param {number} stride Stride.
   * @param {Array<number>} builderEnds Builder ends.
   * @return {number} Offset.
   */
  drawCustomCoordinates_(t, e, i, n, r) {
    for (let o = 0, a = i.length; o < a; ++o) {
      const l = i[o], h = this.appendFlatLineCoordinates(
        t,
        e,
        l,
        n,
        !1,
        !1
      );
      r.push(h), e = l;
    }
    return e;
  }
  /**
   * @param {import("../../geom/SimpleGeometry.js").default} geometry Geometry.
   * @param {import("../../Feature.js").FeatureLike} feature Feature.
   * @param {Function} renderer Renderer.
   * @param {Function} hitDetectionRenderer Renderer.
   */
  drawCustom(t, e, i, n) {
    this.beginGeometry(t, e);
    const r = t.getType(), o = t.getStride(), a = this.coordinates.length;
    let l, h, c, u, d;
    switch (r) {
      case "MultiPolygon":
        l = /** @type {import("../../geom/MultiPolygon.js").default} */
        t.getOrientedFlatCoordinates(), u = [];
        const f = (
          /** @type {import("../../geom/MultiPolygon.js").default} */
          t.getEndss()
        );
        d = 0;
        for (let g = 0, _ = f.length; g < _; ++g) {
          const m = [];
          d = this.drawCustomCoordinates_(
            l,
            d,
            f[g],
            o,
            m
          ), u.push(m);
        }
        this.instructions.push([
          M.CUSTOM,
          a,
          u,
          t,
          i,
          nr
        ]), this.hitDetectionInstructions.push([
          M.CUSTOM,
          a,
          u,
          t,
          n || i,
          nr
        ]);
        break;
      case "Polygon":
      case "MultiLineString":
        c = [], l = r == "Polygon" ? (
          /** @type {import("../../geom/Polygon.js").default} */
          t.getOrientedFlatCoordinates()
        ) : t.getFlatCoordinates(), d = this.drawCustomCoordinates_(
          l,
          0,
          /** @type {import("../../geom/Polygon.js").default|import("../../geom/MultiLineString.js").default} */
          t.getEnds(),
          o,
          c
        ), this.instructions.push([
          M.CUSTOM,
          a,
          c,
          t,
          i,
          qi
        ]), this.hitDetectionInstructions.push([
          M.CUSTOM,
          a,
          c,
          t,
          n || i,
          qi
        ]);
        break;
      case "LineString":
      case "Circle":
        l = t.getFlatCoordinates(), h = this.appendFlatLineCoordinates(
          l,
          0,
          l.length,
          o,
          !1,
          !1
        ), this.instructions.push([
          M.CUSTOM,
          a,
          h,
          t,
          i,
          De
        ]), this.hitDetectionInstructions.push([
          M.CUSTOM,
          a,
          h,
          t,
          n || i,
          De
        ]);
        break;
      case "MultiPoint":
        l = t.getFlatCoordinates(), h = this.appendFlatPointCoordinates(l, o), h > a && (this.instructions.push([
          M.CUSTOM,
          a,
          h,
          t,
          i,
          De
        ]), this.hitDetectionInstructions.push([
          M.CUSTOM,
          a,
          h,
          t,
          n || i,
          De
        ]));
        break;
      case "Point":
        l = t.getFlatCoordinates(), this.coordinates.push(l[0], l[1]), h = this.coordinates.length, this.instructions.push([
          M.CUSTOM,
          a,
          h,
          t,
          i
        ]), this.hitDetectionInstructions.push([
          M.CUSTOM,
          a,
          h,
          t,
          n || i
        ]);
        break;
    }
    this.endGeometry(e);
  }
  /**
   * @protected
   * @param {import("../../geom/Geometry").default|import("../Feature.js").default} geometry The geometry.
   * @param {import("../../Feature.js").FeatureLike} feature Feature.
   */
  beginGeometry(t, e) {
    this.beginGeometryInstruction1_ = [
      M.BEGIN_GEOMETRY,
      e,
      0,
      t
    ], this.instructions.push(this.beginGeometryInstruction1_), this.beginGeometryInstruction2_ = [
      M.BEGIN_GEOMETRY,
      e,
      0,
      t
    ], this.hitDetectionInstructions.push(this.beginGeometryInstruction2_);
  }
  /**
   * @return {import("../canvas.js").SerializableInstructions} the serializable instructions.
   */
  finish() {
    return {
      instructions: this.instructions,
      hitDetectionInstructions: this.hitDetectionInstructions,
      coordinates: this.coordinates
    };
  }
  /**
   * Reverse the hit detection instructions.
   */
  reverseHitDetectionInstructions() {
    const t = this.hitDetectionInstructions;
    t.reverse();
    let e;
    const i = t.length;
    let n, r, o = -1;
    for (e = 0; e < i; ++e)
      n = t[e], r = /** @type {import("./Instruction.js").default} */
      n[0], r == M.END_GEOMETRY ? o = e : r == M.BEGIN_GEOMETRY && (n[2] = e, $o(this.hitDetectionInstructions, o, e), o = -1);
  }
  /**
   * @param {import("../../style/Fill.js").default} fillStyle Fill style.
   * @param {import("../../style/Stroke.js").default} strokeStyle Stroke style.
   */
  setFillStrokeStyle(t, e) {
    const i = this.state;
    if (t) {
      const n = t.getColor();
      i.fillStyle = Mt(
        n || Yt
      );
    } else
      i.fillStyle = void 0;
    if (e) {
      const n = e.getColor();
      i.strokeStyle = Mt(
        n || ui
      );
      const r = e.getLineCap();
      i.lineCap = r !== void 0 ? r : tn;
      const o = e.getLineDash();
      i.lineDash = o ? o.slice() : li;
      const a = e.getLineDashOffset();
      i.lineDashOffset = a || hi;
      const l = e.getLineJoin();
      i.lineJoin = l !== void 0 ? l : Be;
      const h = e.getWidth();
      i.lineWidth = h !== void 0 ? h : fi;
      const c = e.getMiterLimit();
      i.miterLimit = c !== void 0 ? c : ci, i.lineWidth > this.maxLineWidth && (this.maxLineWidth = i.lineWidth, this.bufferedMaxExtent_ = null);
    } else
      i.strokeStyle = void 0, i.lineCap = void 0, i.lineDash = null, i.lineDashOffset = void 0, i.lineJoin = void 0, i.lineWidth = void 0, i.miterLimit = void 0;
  }
  /**
   * @param {import("../canvas.js").FillStrokeState} state State.
   * @return {Array<*>} Fill instruction.
   */
  createFill(t) {
    const e = t.fillStyle, i = [M.SET_FILL_STYLE, e];
    return typeof e != "string" && i.push(!0), i;
  }
  /**
   * @param {import("../canvas.js").FillStrokeState} state State.
   */
  applyStroke(t) {
    this.instructions.push(this.createStroke(t));
  }
  /**
   * @param {import("../canvas.js").FillStrokeState} state State.
   * @return {Array<*>} Stroke instruction.
   */
  createStroke(t) {
    return [
      M.SET_STROKE_STYLE,
      t.strokeStyle,
      t.lineWidth * this.pixelRatio,
      t.lineCap,
      t.lineJoin,
      t.miterLimit,
      this.applyPixelRatio(t.lineDash),
      t.lineDashOffset * this.pixelRatio
    ];
  }
  /**
   * @param {import("../canvas.js").FillStrokeState} state State.
   * @param {function(this:CanvasBuilder, import("../canvas.js").FillStrokeState):Array<*>} createFill Create fill.
   */
  updateFillStyle(t, e) {
    const i = t.fillStyle;
    (typeof i != "string" || t.currentFillStyle != i) && (i !== void 0 && this.instructions.push(e.call(this, t)), t.currentFillStyle = i);
  }
  /**
   * @param {import("../canvas.js").FillStrokeState} state State.
   * @param {function(this:CanvasBuilder, import("../canvas.js").FillStrokeState): void} applyStroke Apply stroke.
   */
  updateStrokeStyle(t, e) {
    const i = t.strokeStyle, n = t.lineCap, r = t.lineDash, o = t.lineDashOffset, a = t.lineJoin, l = t.lineWidth, h = t.miterLimit;
    (t.currentStrokeStyle != i || t.currentLineCap != n || r != t.currentLineDash && !re(t.currentLineDash, r) || t.currentLineDashOffset != o || t.currentLineJoin != a || t.currentLineWidth != l || t.currentMiterLimit != h) && (i !== void 0 && e.call(this, t), t.currentStrokeStyle = i, t.currentLineCap = n, t.currentLineDash = r, t.currentLineDashOffset = o, t.currentLineJoin = a, t.currentLineWidth = l, t.currentMiterLimit = h);
  }
  /**
   * @param {import("../../Feature.js").FeatureLike} feature Feature.
   */
  endGeometry(t) {
    this.beginGeometryInstruction1_[2] = this.instructions.length, this.beginGeometryInstruction1_ = null, this.beginGeometryInstruction2_[2] = this.hitDetectionInstructions.length, this.beginGeometryInstruction2_ = null;
    const e = [M.END_GEOMETRY, t];
    this.instructions.push(e), this.hitDetectionInstructions.push(e);
  }
  /**
   * Get the buffered rendering extent.  Rendering will be clipped to the extent
   * provided to the constructor.  To account for symbolizers that may intersect
   * this extent, we calculate a buffered extent (e.g. based on stroke width).
   * @return {import("../../extent.js").Extent} The buffered rendering extent.
   * @protected
   */
  getBufferedMaxExtent() {
    if (!this.bufferedMaxExtent_ && (this.bufferedMaxExtent_ = Xr(this.maxExtent), this.maxLineWidth > 0)) {
      const t = this.resolution * (this.maxLineWidth + 1) / 2;
      is(this.bufferedMaxExtent_, t, this.bufferedMaxExtent_);
    }
    return this.bufferedMaxExtent_;
  }
}
const Ci = Fc;
class Dc extends Ci {
  /**
   * @param {number} tolerance Tolerance.
   * @param {import("../../extent.js").Extent} maxExtent Maximum extent.
   * @param {number} resolution Resolution.
   * @param {number} pixelRatio Pixel ratio.
   */
  constructor(t, e, i, n) {
    super(t, e, i, n), this.hitDetectionImage_ = null, this.image_ = null, this.imagePixelRatio_ = void 0, this.anchorX_ = void 0, this.anchorY_ = void 0, this.height_ = void 0, this.opacity_ = void 0, this.originX_ = void 0, this.originY_ = void 0, this.rotateWithView_ = void 0, this.rotation_ = void 0, this.scale_ = void 0, this.width_ = void 0, this.declutterMode_ = void 0, this.declutterImageWithText_ = void 0;
  }
  /**
   * @param {import("../../geom/Point.js").default|import("../Feature.js").default} pointGeometry Point geometry.
   * @param {import("../../Feature.js").FeatureLike} feature Feature.
   */
  drawPoint(t, e) {
    if (!this.image_)
      return;
    this.beginGeometry(t, e);
    const i = t.getFlatCoordinates(), n = t.getStride(), r = this.coordinates.length, o = this.appendFlatPointCoordinates(i, n);
    this.instructions.push([
      M.DRAW_IMAGE,
      r,
      o,
      this.image_,
      // Remaining arguments to DRAW_IMAGE are in alphabetical order
      this.anchorX_ * this.imagePixelRatio_,
      this.anchorY_ * this.imagePixelRatio_,
      Math.ceil(this.height_ * this.imagePixelRatio_),
      this.opacity_,
      this.originX_ * this.imagePixelRatio_,
      this.originY_ * this.imagePixelRatio_,
      this.rotateWithView_,
      this.rotation_,
      [
        this.scale_[0] * this.pixelRatio / this.imagePixelRatio_,
        this.scale_[1] * this.pixelRatio / this.imagePixelRatio_
      ],
      Math.ceil(this.width_ * this.imagePixelRatio_),
      this.declutterMode_,
      this.declutterImageWithText_
    ]), this.hitDetectionInstructions.push([
      M.DRAW_IMAGE,
      r,
      o,
      this.hitDetectionImage_,
      // Remaining arguments to DRAW_IMAGE are in alphabetical order
      this.anchorX_,
      this.anchorY_,
      this.height_,
      this.opacity_,
      this.originX_,
      this.originY_,
      this.rotateWithView_,
      this.rotation_,
      this.scale_,
      this.width_,
      this.declutterMode_,
      this.declutterImageWithText_
    ]), this.endGeometry(e);
  }
  /**
   * @param {import("../../geom/MultiPoint.js").default|import("../Feature.js").default} multiPointGeometry MultiPoint geometry.
   * @param {import("../../Feature.js").FeatureLike} feature Feature.
   */
  drawMultiPoint(t, e) {
    if (!this.image_)
      return;
    this.beginGeometry(t, e);
    const i = t.getFlatCoordinates(), n = t.getStride(), r = this.coordinates.length, o = this.appendFlatPointCoordinates(i, n);
    this.instructions.push([
      M.DRAW_IMAGE,
      r,
      o,
      this.image_,
      // Remaining arguments to DRAW_IMAGE are in alphabetical order
      this.anchorX_ * this.imagePixelRatio_,
      this.anchorY_ * this.imagePixelRatio_,
      Math.ceil(this.height_ * this.imagePixelRatio_),
      this.opacity_,
      this.originX_ * this.imagePixelRatio_,
      this.originY_ * this.imagePixelRatio_,
      this.rotateWithView_,
      this.rotation_,
      [
        this.scale_[0] * this.pixelRatio / this.imagePixelRatio_,
        this.scale_[1] * this.pixelRatio / this.imagePixelRatio_
      ],
      Math.ceil(this.width_ * this.imagePixelRatio_),
      this.declutterMode_,
      this.declutterImageWithText_
    ]), this.hitDetectionInstructions.push([
      M.DRAW_IMAGE,
      r,
      o,
      this.hitDetectionImage_,
      // Remaining arguments to DRAW_IMAGE are in alphabetical order
      this.anchorX_,
      this.anchorY_,
      this.height_,
      this.opacity_,
      this.originX_,
      this.originY_,
      this.rotateWithView_,
      this.rotation_,
      this.scale_,
      this.width_,
      this.declutterMode_,
      this.declutterImageWithText_
    ]), this.endGeometry(e);
  }
  /**
   * @return {import("../canvas.js").SerializableInstructions} the serializable instructions.
   */
  finish() {
    return this.reverseHitDetectionInstructions(), this.anchorX_ = void 0, this.anchorY_ = void 0, this.hitDetectionImage_ = null, this.image_ = null, this.imagePixelRatio_ = void 0, this.height_ = void 0, this.scale_ = void 0, this.opacity_ = void 0, this.originX_ = void 0, this.originY_ = void 0, this.rotateWithView_ = void 0, this.rotation_ = void 0, this.width_ = void 0, super.finish();
  }
  /**
   * @param {import("../../style/Image.js").default} imageStyle Image style.
   * @param {Object} [sharedData] Shared data.
   */
  setImageStyle(t, e) {
    const i = t.getAnchor(), n = t.getSize(), r = t.getOrigin();
    this.imagePixelRatio_ = t.getPixelRatio(this.pixelRatio), this.anchorX_ = i[0], this.anchorY_ = i[1], this.hitDetectionImage_ = t.getHitDetectionImage(), this.image_ = t.getImage(this.pixelRatio), this.height_ = n[1], this.opacity_ = t.getOpacity(), this.originX_ = r[0], this.originY_ = r[1], this.rotateWithView_ = t.getRotateWithView(), this.rotation_ = t.getRotation(), this.scale_ = t.getScaleArray(), this.width_ = n[0], this.declutterMode_ = t.getDeclutterMode(), this.declutterImageWithText_ = e;
  }
}
const kc = Dc;
class Nc extends Ci {
  /**
   * @param {number} tolerance Tolerance.
   * @param {import("../../extent.js").Extent} maxExtent Maximum extent.
   * @param {number} resolution Resolution.
   * @param {number} pixelRatio Pixel ratio.
   */
  constructor(t, e, i, n) {
    super(t, e, i, n);
  }
  /**
   * @param {Array<number>} flatCoordinates Flat coordinates.
   * @param {number} offset Offset.
   * @param {number} end End.
   * @param {number} stride Stride.
   * @private
   * @return {number} end.
   */
  drawFlatCoordinates_(t, e, i, n) {
    const r = this.coordinates.length, o = this.appendFlatLineCoordinates(
      t,
      e,
      i,
      n,
      !1,
      !1
    ), a = [
      M.MOVE_TO_LINE_TO,
      r,
      o
    ];
    return this.instructions.push(a), this.hitDetectionInstructions.push(a), i;
  }
  /**
   * @param {import("../../geom/LineString.js").default|import("../Feature.js").default} lineStringGeometry Line string geometry.
   * @param {import("../../Feature.js").FeatureLike} feature Feature.
   */
  drawLineString(t, e) {
    const i = this.state, n = i.strokeStyle, r = i.lineWidth;
    if (n === void 0 || r === void 0)
      return;
    this.updateStrokeStyle(i, this.applyStroke), this.beginGeometry(t, e), this.hitDetectionInstructions.push(
      [
        M.SET_STROKE_STYLE,
        i.strokeStyle,
        i.lineWidth,
        i.lineCap,
        i.lineJoin,
        i.miterLimit,
        li,
        hi
      ],
      ge
    );
    const o = t.getFlatCoordinates(), a = t.getStride();
    this.drawFlatCoordinates_(
      o,
      0,
      o.length,
      a
    ), this.hitDetectionInstructions.push(ee), this.endGeometry(e);
  }
  /**
   * @param {import("../../geom/MultiLineString.js").default|import("../Feature.js").default} multiLineStringGeometry MultiLineString geometry.
   * @param {import("../../Feature.js").FeatureLike} feature Feature.
   */
  drawMultiLineString(t, e) {
    const i = this.state, n = i.strokeStyle, r = i.lineWidth;
    if (n === void 0 || r === void 0)
      return;
    this.updateStrokeStyle(i, this.applyStroke), this.beginGeometry(t, e), this.hitDetectionInstructions.push(
      [
        M.SET_STROKE_STYLE,
        i.strokeStyle,
        i.lineWidth,
        i.lineCap,
        i.lineJoin,
        i.miterLimit,
        i.lineDash,
        i.lineDashOffset
      ],
      ge
    );
    const o = t.getEnds(), a = t.getFlatCoordinates(), l = t.getStride();
    let h = 0;
    for (let c = 0, u = o.length; c < u; ++c)
      h = this.drawFlatCoordinates_(
        a,
        h,
        /** @type {number} */
        o[c],
        l
      );
    this.hitDetectionInstructions.push(ee), this.endGeometry(e);
  }
  /**
   * @return {import("../canvas.js").SerializableInstructions} the serializable instructions.
   */
  finish() {
    const t = this.state;
    return t.lastStroke != null && t.lastStroke != this.coordinates.length && this.instructions.push(ee), this.reverseHitDetectionInstructions(), this.state = null, super.finish();
  }
  /**
   * @param {import("../canvas.js").FillStrokeState} state State.
   */
  applyStroke(t) {
    t.lastStroke != null && t.lastStroke != this.coordinates.length && (this.instructions.push(ee), t.lastStroke = this.coordinates.length), t.lastStroke = 0, super.applyStroke(t), this.instructions.push(ge);
  }
}
const Gc = Nc;
class Xc extends Ci {
  /**
   * @param {number} tolerance Tolerance.
   * @param {import("../../extent.js").Extent} maxExtent Maximum extent.
   * @param {number} resolution Resolution.
   * @param {number} pixelRatio Pixel ratio.
   */
  constructor(t, e, i, n) {
    super(t, e, i, n);
  }
  /**
   * @param {Array<number>} flatCoordinates Flat coordinates.
   * @param {number} offset Offset.
   * @param {Array<number>} ends Ends.
   * @param {number} stride Stride.
   * @private
   * @return {number} End.
   */
  drawFlatCoordinatess_(t, e, i, n) {
    const r = this.state, o = r.fillStyle !== void 0, a = r.strokeStyle !== void 0, l = i.length;
    this.instructions.push(ge), this.hitDetectionInstructions.push(ge);
    for (let h = 0; h < l; ++h) {
      const c = i[h], u = this.coordinates.length, d = this.appendFlatLineCoordinates(
        t,
        e,
        c,
        n,
        !0,
        !a
      ), f = [
        M.MOVE_TO_LINE_TO,
        u,
        d
      ];
      this.instructions.push(f), this.hitDetectionInstructions.push(f), a && (this.instructions.push(Cr), this.hitDetectionInstructions.push(Cr)), e = c;
    }
    return o && (this.instructions.push(zi), this.hitDetectionInstructions.push(zi)), a && (this.instructions.push(ee), this.hitDetectionInstructions.push(ee)), e;
  }
  /**
   * @param {import("../../geom/Circle.js").default} circleGeometry Circle geometry.
   * @param {import("../../Feature.js").default} feature Feature.
   */
  drawCircle(t, e) {
    const i = this.state, n = i.fillStyle, r = i.strokeStyle;
    if (n === void 0 && r === void 0)
      return;
    this.setFillStrokeStyles_(), this.beginGeometry(t, e), i.fillStyle !== void 0 && this.hitDetectionInstructions.push([
      M.SET_FILL_STYLE,
      Yt
    ]), i.strokeStyle !== void 0 && this.hitDetectionInstructions.push([
      M.SET_STROKE_STYLE,
      i.strokeStyle,
      i.lineWidth,
      i.lineCap,
      i.lineJoin,
      i.miterLimit,
      i.lineDash,
      i.lineDashOffset
    ]);
    const o = t.getFlatCoordinates(), a = t.getStride(), l = this.coordinates.length;
    this.appendFlatLineCoordinates(
      o,
      0,
      o.length,
      a,
      !1,
      !1
    );
    const h = [M.CIRCLE, l];
    this.instructions.push(ge, h), this.hitDetectionInstructions.push(ge, h), i.fillStyle !== void 0 && (this.instructions.push(zi), this.hitDetectionInstructions.push(zi)), i.strokeStyle !== void 0 && (this.instructions.push(ee), this.hitDetectionInstructions.push(ee)), this.endGeometry(e);
  }
  /**
   * @param {import("../../geom/Polygon.js").default|import("../Feature.js").default} polygonGeometry Polygon geometry.
   * @param {import("../../Feature.js").FeatureLike} feature Feature.
   */
  drawPolygon(t, e) {
    const i = this.state, n = i.fillStyle, r = i.strokeStyle;
    if (n === void 0 && r === void 0)
      return;
    this.setFillStrokeStyles_(), this.beginGeometry(t, e), i.fillStyle !== void 0 && this.hitDetectionInstructions.push([
      M.SET_FILL_STYLE,
      Yt
    ]), i.strokeStyle !== void 0 && this.hitDetectionInstructions.push([
      M.SET_STROKE_STYLE,
      i.strokeStyle,
      i.lineWidth,
      i.lineCap,
      i.lineJoin,
      i.miterLimit,
      i.lineDash,
      i.lineDashOffset
    ]);
    const o = t.getEnds(), a = t.getOrientedFlatCoordinates(), l = t.getStride();
    this.drawFlatCoordinatess_(
      a,
      0,
      /** @type {Array<number>} */
      o,
      l
    ), this.endGeometry(e);
  }
  /**
   * @param {import("../../geom/MultiPolygon.js").default} multiPolygonGeometry MultiPolygon geometry.
   * @param {import("../../Feature.js").FeatureLike} feature Feature.
   */
  drawMultiPolygon(t, e) {
    const i = this.state, n = i.fillStyle, r = i.strokeStyle;
    if (n === void 0 && r === void 0)
      return;
    this.setFillStrokeStyles_(), this.beginGeometry(t, e), i.fillStyle !== void 0 && this.hitDetectionInstructions.push([
      M.SET_FILL_STYLE,
      Yt
    ]), i.strokeStyle !== void 0 && this.hitDetectionInstructions.push([
      M.SET_STROKE_STYLE,
      i.strokeStyle,
      i.lineWidth,
      i.lineCap,
      i.lineJoin,
      i.miterLimit,
      i.lineDash,
      i.lineDashOffset
    ]);
    const o = t.getEndss(), a = t.getOrientedFlatCoordinates(), l = t.getStride();
    let h = 0;
    for (let c = 0, u = o.length; c < u; ++c)
      h = this.drawFlatCoordinatess_(
        a,
        h,
        o[c],
        l
      );
    this.endGeometry(e);
  }
  /**
   * @return {import("../canvas.js").SerializableInstructions} the serializable instructions.
   */
  finish() {
    this.reverseHitDetectionInstructions(), this.state = null;
    const t = this.tolerance;
    if (t !== 0) {
      const e = this.coordinates;
      for (let i = 0, n = e.length; i < n; ++i)
        e[i] = he(e[i], t);
    }
    return super.finish();
  }
  /**
   * @private
   */
  setFillStrokeStyles_() {
    const t = this.state;
    t.fillStyle !== void 0 && this.updateFillStyle(t, this.createFill), t.strokeStyle !== void 0 && this.updateStrokeStyle(t, this.applyStroke);
  }
}
const Rr = Xc;
function Wc(s, t, e, i, n) {
  const r = [];
  let o = e, a = 0, l = t.slice(e, 2);
  for (; a < s && o + n < i; ) {
    const [h, c] = l.slice(-2), u = t[o + n], d = t[o + n + 1], f = Math.sqrt(
      (u - h) * (u - h) + (d - c) * (d - c)
    );
    if (a += f, a >= s) {
      const g = (s - a + f) / f, _ = Rt(h, u, g), m = Rt(c, d, g);
      l.push(_, m), r.push(l), l = [_, m], a == s && (o += n), a = 0;
    } else if (a < s)
      l.push(
        t[o + n],
        t[o + n + 1]
      ), o += n;
    else {
      const g = f - a, _ = Rt(h, u, g / f), m = Rt(c, d, g / f);
      l.push(_, m), r.push(l), l = [_, m], a = 0, o += n;
    }
  }
  return a > 0 && r.push(l), r;
}
function zc(s, t, e, i, n) {
  let r = e, o = e, a = 0, l = 0, h = e, c, u, d, f, g, _, m, p, y, x;
  for (u = e; u < i; u += n) {
    const E = t[u], C = t[u + 1];
    g !== void 0 && (y = E - g, x = C - _, f = Math.sqrt(y * y + x * x), m !== void 0 && (l += d, c = Math.acos((m * y + p * x) / (d * f)), c > s && (l > a && (a = l, r = h, o = u), l = 0, h = u - n)), d = f, m = y, p = x), g = E, _ = C;
  }
  return l += f, l > a ? [h, u] : [r, o];
}
const ii = {
  left: 0,
  end: 0,
  center: 0.5,
  right: 1,
  start: 1,
  top: 0,
  middle: 0.5,
  hanging: 0.2,
  alphabetic: 0.8,
  ideographic: 0.8,
  bottom: 1
};
class Yc extends Ci {
  /**
   * @param {number} tolerance Tolerance.
   * @param {import("../../extent.js").Extent} maxExtent Maximum extent.
   * @param {number} resolution Resolution.
   * @param {number} pixelRatio Pixel ratio.
   */
  constructor(t, e, i, n) {
    super(t, e, i, n), this.labels_ = null, this.text_ = "", this.textOffsetX_ = 0, this.textOffsetY_ = 0, this.textRotateWithView_ = void 0, this.textRotation_ = 0, this.textFillState_ = null, this.fillStates = {}, this.textStrokeState_ = null, this.strokeStates = {}, this.textState_ = /** @type {import("../canvas.js").TextState} */
    {}, this.textStates = {}, this.textKey_ = "", this.fillKey_ = "", this.strokeKey_ = "", this.declutterImageWithText_ = void 0;
  }
  /**
   * @return {import("../canvas.js").SerializableInstructions} the serializable instructions.
   */
  finish() {
    const t = super.finish();
    return t.textStates = this.textStates, t.fillStates = this.fillStates, t.strokeStates = this.strokeStates, t;
  }
  /**
   * @param {import("../../geom/SimpleGeometry.js").default|import("../Feature.js").default} geometry Geometry.
   * @param {import("../../Feature.js").FeatureLike} feature Feature.
   */
  drawText(t, e) {
    const i = this.textFillState_, n = this.textStrokeState_, r = this.textState_;
    if (this.text_ === "" || !r || !i && !n)
      return;
    const o = this.coordinates;
    let a = o.length;
    const l = t.getType();
    let h = null, c = t.getStride();
    if (r.placement === "line" && (l == "LineString" || l == "MultiLineString" || l == "Polygon" || l == "MultiPolygon")) {
      if (!at(this.getBufferedMaxExtent(), t.getExtent()))
        return;
      let u;
      if (h = t.getFlatCoordinates(), l == "LineString")
        u = [h.length];
      else if (l == "MultiLineString")
        u = /** @type {import("../../geom/MultiLineString.js").default} */
        t.getEnds();
      else if (l == "Polygon")
        u = /** @type {import("../../geom/Polygon.js").default} */
        t.getEnds().slice(0, 1);
      else if (l == "MultiPolygon") {
        const _ = (
          /** @type {import("../../geom/MultiPolygon.js").default} */
          t.getEndss()
        );
        u = [];
        for (let m = 0, p = _.length; m < p; ++m)
          u.push(_[m][0]);
      }
      this.beginGeometry(t, e);
      const d = r.repeat, f = d ? void 0 : r.textAlign;
      let g = 0;
      for (let _ = 0, m = u.length; _ < m; ++_) {
        let p;
        d ? p = Wc(
          d * this.resolution,
          h,
          g,
          u[_],
          c
        ) : p = [h.slice(g, u[_])];
        for (let y = 0, x = p.length; y < x; ++y) {
          const E = p[y];
          let C = 0, T = E.length;
          if (f == null) {
            const S = zc(
              r.maxAngle,
              E,
              0,
              E.length,
              2
            );
            C = S[0], T = S[1];
          }
          for (let S = C; S < T; S += c)
            o.push(E[S], E[S + 1]);
          const v = o.length;
          g = u[_], this.drawChars_(a, v), a = v;
        }
      }
      this.endGeometry(e);
    } else {
      let u = r.overflow ? null : [];
      switch (l) {
        case "Point":
        case "MultiPoint":
          h = /** @type {import("../../geom/MultiPoint.js").default} */
          t.getFlatCoordinates();
          break;
        case "LineString":
          h = /** @type {import("../../geom/LineString.js").default} */
          t.getFlatMidpoint();
          break;
        case "Circle":
          h = /** @type {import("../../geom/Circle.js").default} */
          t.getCenter();
          break;
        case "MultiLineString":
          h = /** @type {import("../../geom/MultiLineString.js").default} */
          t.getFlatMidpoints(), c = 2;
          break;
        case "Polygon":
          h = /** @type {import("../../geom/Polygon.js").default} */
          t.getFlatInteriorPoint(), r.overflow || u.push(h[2] / this.resolution), c = 3;
          break;
        case "MultiPolygon":
          const m = (
            /** @type {import("../../geom/MultiPolygon.js").default} */
            t.getFlatInteriorPoints()
          );
          h = [];
          for (let p = 0, y = m.length; p < y; p += 3)
            r.overflow || u.push(m[p + 2] / this.resolution), h.push(m[p], m[p + 1]);
          if (h.length === 0)
            return;
          c = 2;
          break;
      }
      const d = this.appendFlatPointCoordinates(h, c);
      if (d === a)
        return;
      if (u && (d - a) / 2 !== h.length / c) {
        let m = a / 2;
        u = u.filter((p, y) => {
          const x = o[(m + y) * 2] === h[y * c] && o[(m + y) * 2 + 1] === h[y * c + 1];
          return x || --m, x;
        });
      }
      this.saveTextStates_(), (r.backgroundFill || r.backgroundStroke) && (this.setFillStrokeStyle(
        r.backgroundFill,
        r.backgroundStroke
      ), r.backgroundFill && (this.updateFillStyle(this.state, this.createFill), this.hitDetectionInstructions.push(this.createFill(this.state))), r.backgroundStroke && (this.updateStrokeStyle(this.state, this.applyStroke), this.hitDetectionInstructions.push(this.createStroke(this.state)))), this.beginGeometry(t, e);
      let f = r.padding;
      if (f != fe && (r.scale[0] < 0 || r.scale[1] < 0)) {
        let m = r.padding[0], p = r.padding[1], y = r.padding[2], x = r.padding[3];
        r.scale[0] < 0 && (p = -p, x = -x), r.scale[1] < 0 && (m = -m, y = -y), f = [m, p, y, x];
      }
      const g = this.pixelRatio;
      this.instructions.push([
        M.DRAW_IMAGE,
        a,
        d,
        null,
        NaN,
        NaN,
        NaN,
        1,
        0,
        0,
        this.textRotateWithView_,
        this.textRotation_,
        [1, 1],
        NaN,
        void 0,
        this.declutterImageWithText_,
        f == fe ? fe : f.map(function(m) {
          return m * g;
        }),
        !!r.backgroundFill,
        !!r.backgroundStroke,
        this.text_,
        this.textKey_,
        this.strokeKey_,
        this.fillKey_,
        this.textOffsetX_,
        this.textOffsetY_,
        u
      ]);
      const _ = 1 / g;
      this.hitDetectionInstructions.push([
        M.DRAW_IMAGE,
        a,
        d,
        null,
        NaN,
        NaN,
        NaN,
        1,
        0,
        0,
        this.textRotateWithView_,
        this.textRotation_,
        [_, _],
        NaN,
        void 0,
        this.declutterImageWithText_,
        f,
        !!r.backgroundFill,
        !!r.backgroundStroke,
        this.text_,
        this.textKey_,
        this.strokeKey_,
        this.fillKey_,
        this.textOffsetX_,
        this.textOffsetY_,
        u
      ]), this.endGeometry(e);
    }
  }
  /**
   * @private
   */
  saveTextStates_() {
    const t = this.textStrokeState_, e = this.textState_, i = this.textFillState_, n = this.strokeKey_;
    t && (n in this.strokeStates || (this.strokeStates[n] = {
      strokeStyle: t.strokeStyle,
      lineCap: t.lineCap,
      lineDashOffset: t.lineDashOffset,
      lineWidth: t.lineWidth,
      lineJoin: t.lineJoin,
      miterLimit: t.miterLimit,
      lineDash: t.lineDash
    }));
    const r = this.textKey_;
    r in this.textStates || (this.textStates[r] = {
      font: e.font,
      textAlign: e.textAlign || di,
      justify: e.justify,
      textBaseline: e.textBaseline || en,
      scale: e.scale
    });
    const o = this.fillKey_;
    i && (o in this.fillStates || (this.fillStates[o] = {
      fillStyle: i.fillStyle
    }));
  }
  /**
   * @private
   * @param {number} begin Begin.
   * @param {number} end End.
   */
  drawChars_(t, e) {
    const i = this.textStrokeState_, n = this.textState_, r = this.strokeKey_, o = this.textKey_, a = this.fillKey_;
    this.saveTextStates_();
    const l = this.pixelRatio, h = ii[n.textBaseline], c = this.textOffsetY_ * l, u = this.text_, d = i ? i.lineWidth * Math.abs(n.scale[0]) / 2 : 0;
    this.instructions.push([
      M.DRAW_CHARS,
      t,
      e,
      h,
      n.overflow,
      a,
      n.maxAngle,
      l,
      c,
      r,
      d * l,
      u,
      o,
      1
    ]), this.hitDetectionInstructions.push([
      M.DRAW_CHARS,
      t,
      e,
      h,
      n.overflow,
      a,
      n.maxAngle,
      1,
      c,
      r,
      d,
      u,
      o,
      1 / l
    ]);
  }
  /**
   * @param {import("../../style/Text.js").default} textStyle Text style.
   * @param {Object} [sharedData] Shared data.
   */
  setTextStyle(t, e) {
    let i, n, r;
    if (!t)
      this.text_ = "";
    else {
      const o = t.getFill();
      o ? (n = this.textFillState_, n || (n = /** @type {import("../canvas.js").FillState} */
      {}, this.textFillState_ = n), n.fillStyle = Mt(
        o.getColor() || Yt
      )) : (n = null, this.textFillState_ = n);
      const a = t.getStroke();
      if (!a)
        r = null, this.textStrokeState_ = r;
      else {
        r = this.textStrokeState_, r || (r = /** @type {import("../canvas.js").StrokeState} */
        {}, this.textStrokeState_ = r);
        const g = a.getLineDash(), _ = a.getLineDashOffset(), m = a.getWidth(), p = a.getMiterLimit();
        r.lineCap = a.getLineCap() || tn, r.lineDash = g ? g.slice() : li, r.lineDashOffset = _ === void 0 ? hi : _, r.lineJoin = a.getLineJoin() || Be, r.lineWidth = m === void 0 ? fi : m, r.miterLimit = p === void 0 ? ci : p, r.strokeStyle = Mt(
          a.getColor() || ui
        );
      }
      i = this.textState_;
      const l = t.getFont() || mo;
      Yl(l);
      const h = t.getScaleArray();
      i.overflow = t.getOverflow(), i.font = l, i.maxAngle = t.getMaxAngle(), i.placement = t.getPlacement(), i.textAlign = t.getTextAlign(), i.repeat = t.getRepeat(), i.justify = t.getJustify(), i.textBaseline = t.getTextBaseline() || en, i.backgroundFill = t.getBackgroundFill(), i.backgroundStroke = t.getBackgroundStroke(), i.padding = t.getPadding() || fe, i.scale = h === void 0 ? [1, 1] : h;
      const c = t.getOffsetX(), u = t.getOffsetY(), d = t.getRotateWithView(), f = t.getRotation();
      this.text_ = t.getText() || "", this.textOffsetX_ = c === void 0 ? 0 : c, this.textOffsetY_ = u === void 0 ? 0 : u, this.textRotateWithView_ = d === void 0 ? !1 : d, this.textRotation_ = f === void 0 ? 0 : f, this.strokeKey_ = r ? (typeof r.strokeStyle == "string" ? r.strokeStyle : z(r.strokeStyle)) + r.lineCap + r.lineDashOffset + "|" + r.lineWidth + r.lineJoin + r.miterLimit + "[" + r.lineDash.join() + "]" : "", this.textKey_ = i.font + i.scale + (i.textAlign || "?") + (i.repeat || "?") + (i.justify || "?") + (i.textBaseline || "?"), this.fillKey_ = n ? typeof n.fillStyle == "string" ? n.fillStyle : "|" + z(n.fillStyle) : "";
    }
    this.declutterImageWithText_ = e;
  }
}
const Bc = {
  Circle: Rr,
  Default: Ci,
  Image: kc,
  LineString: Gc,
  Polygon: Rr,
  Text: Yc
};
class Zc {
  /**
   * @param {number} tolerance Tolerance.
   * @param {import("../../extent.js").Extent} maxExtent Max extent.
   * @param {number} resolution Resolution.
   * @param {number} pixelRatio Pixel ratio.
   */
  constructor(t, e, i, n) {
    this.tolerance_ = t, this.maxExtent_ = e, this.pixelRatio_ = n, this.resolution_ = i, this.buildersByZIndex_ = {};
  }
  /**
   * @return {!Object<string, !Object<import("../canvas.js").BuilderType, import("./Builder.js").SerializableInstructions>>} The serializable instructions
   */
  finish() {
    const t = {};
    for (const e in this.buildersByZIndex_) {
      t[e] = t[e] || {};
      const i = this.buildersByZIndex_[e];
      for (const n in i) {
        const r = i[n].finish();
        t[e][n] = r;
      }
    }
    return t;
  }
  /**
   * @param {number|undefined} zIndex Z index.
   * @param {import("../canvas.js").BuilderType} builderType Replay type.
   * @return {import("../VectorContext.js").default} Replay.
   */
  getBuilder(t, e) {
    const i = t !== void 0 ? t.toString() : "0";
    let n = this.buildersByZIndex_[i];
    n === void 0 && (n = {}, this.buildersByZIndex_[i] = n);
    let r = n[e];
    if (r === void 0) {
      const o = Bc[e];
      r = new o(
        this.tolerance_,
        this.maxExtent_,
        this.resolution_,
        this.pixelRatio_
      ), n[e] = r;
    }
    return r;
  }
}
const Tr = Zc;
function Kc(s, t, e, i, n, r, o, a, l, h, c, u) {
  let d = s[t], f = s[t + 1], g = 0, _ = 0, m = 0, p = 0;
  function y() {
    g = d, _ = f, t += i, d = s[t], f = s[t + 1], p += m, m = Math.sqrt((d - g) * (d - g) + (f - _) * (f - _));
  }
  do
    y();
  while (t < e - i && p + m < r);
  let x = m === 0 ? 0 : (r - p) / m;
  const E = Rt(g, d, x), C = Rt(_, f, x), T = t - i, v = p, S = r + a * l(h, n, c);
  for (; t < e - i && p + m < S; )
    y();
  x = m === 0 ? 0 : (S - p) / m;
  const L = Rt(g, d, x), O = Rt(_, f, x);
  let X;
  if (u) {
    const P = [E, C, L, O];
    io(P, 0, 4, 2, u, P, P), X = P[0] > P[2];
  } else
    X = E > L;
  const N = Math.PI, D = [], q = T + i === t;
  t = T, m = 0, p = v, d = s[t], f = s[t + 1];
  let w;
  if (q) {
    y(), w = Math.atan2(f - _, d - g), X && (w += w > 0 ? -N : N);
    const P = (L + E) / 2, I = (O + C) / 2;
    return D[0] = [P, I, (S - r) / 2, w, n], D;
  }
  n = n.replace(/\n/g, " ");
  for (let P = 0, I = n.length; P < I; ) {
    y();
    let b = Math.atan2(f - _, d - g);
    if (X && (b += b > 0 ? -N : N), w !== void 0) {
      let Y = b - w;
      if (Y += Y > N ? -2 * N : Y < -N ? 2 * N : 0, Math.abs(Y) > o)
        return null;
    }
    w = b;
    const K = P;
    let B = 0;
    for (; P < I; ++P) {
      const Y = X ? I - P - 1 : P, U = a * l(h, n[Y], c);
      if (t + i < e && p + m < r + B + U / 2)
        break;
      B += U;
    }
    if (P === K)
      continue;
    const Q = X ? n.substring(I - K, I - P) : n.substring(K, P);
    x = m === 0 ? 0 : (r + B / 2 - p) / m;
    const R = Rt(g, d, x), dt = Rt(_, f, x);
    D.push([R, dt, B / 2, b, Q]), r += B;
  }
  return D;
}
function Uc(s, t, e, i) {
  let n = s[t], r = s[t + 1], o = 0;
  for (let a = t + i; a < e; a += i) {
    const l = s[a], h = s[a + 1];
    o += Math.sqrt((l - n) * (l - n) + (h - r) * (h - r)), n = l, r = h;
  }
  return o;
}
const we = Tt(), Ht = [], Nt = [], Gt = [], $t = [];
function Ir(s) {
  return s[3].declutterBox;
}
const Vc = new RegExp(
  /* eslint-disable prettier/prettier */
  "[" + String.fromCharCode(1425) + "-" + String.fromCharCode(2303) + String.fromCharCode(64285) + "-" + String.fromCharCode(65023) + String.fromCharCode(65136) + "-" + String.fromCharCode(65276) + String.fromCharCode(67584) + "-" + String.fromCharCode(69631) + String.fromCharCode(124928) + "-" + String.fromCharCode(126975) + "]"
  /* eslint-enable prettier/prettier */
);
function Sr(s, t) {
  return (t === "start" || t === "end") && !Vc.test(s) && (t = t === "start" ? "left" : "right"), ii[t];
}
function jc(s, t, e) {
  return e > 0 && s.push(`
`, ""), s.push(t, ""), s;
}
class Hc {
  /**
   * @param {number} resolution Resolution.
   * @param {number} pixelRatio Pixel ratio.
   * @param {boolean} overlaps The replay can have overlapping geometries.
   * @param {import("../canvas.js").SerializableInstructions} instructions The serializable instructions
   */
  constructor(t, e, i, n) {
    this.overlaps = i, this.pixelRatio = e, this.resolution = t, this.alignFill_, this.instructions = n.instructions, this.coordinates = n.coordinates, this.coordinateCache_ = {}, this.renderedTransform_ = Pt(), this.hitDetectionInstructions = n.hitDetectionInstructions, this.pixelCoordinates_ = null, this.viewRotation_ = 0, this.fillStates = n.fillStates || {}, this.strokeStates = n.strokeStates || {}, this.textStates = n.textStates || {}, this.widths_ = {}, this.labels_ = {};
  }
  /**
   * @param {string|Array<string>} text Text.
   * @param {string} textKey Text style key.
   * @param {string} fillKey Fill style key.
   * @param {string} strokeKey Stroke style key.
   * @return {import("../canvas.js").Label} Label.
   */
  createLabel(t, e, i, n) {
    const r = t + e + i + n;
    if (this.labels_[r])
      return this.labels_[r];
    const o = n ? this.strokeStates[n] : null, a = i ? this.fillStates[i] : null, l = this.textStates[e], h = this.pixelRatio, c = [
      l.scale[0] * h,
      l.scale[1] * h
    ], u = Array.isArray(t), d = l.justify ? ii[l.justify] : Sr(
      Array.isArray(t) ? t[0] : t,
      l.textAlign || di
    ), f = n && o.lineWidth ? o.lineWidth : 0, g = u ? t : t.split(`
`).reduce(jc, []), { width: _, height: m, widths: p, heights: y, lineWidths: x } = Zl(
      l,
      g
    ), E = _ + f, C = [], T = (E + 2) * c[0], v = (m + f) * c[1], S = {
      width: T < 0 ? Math.floor(T) : Math.ceil(T),
      height: v < 0 ? Math.floor(v) : Math.ceil(v),
      contextInstructions: C
    };
    (c[0] != 1 || c[1] != 1) && C.push("scale", c), n && (C.push("strokeStyle", o.strokeStyle), C.push("lineWidth", f), C.push("lineCap", o.lineCap), C.push("lineJoin", o.lineJoin), C.push("miterLimit", o.miterLimit), C.push("setLineDash", [o.lineDash]), C.push("lineDashOffset", o.lineDashOffset)), i && C.push("fillStyle", a.fillStyle), C.push("textBaseline", "middle"), C.push("textAlign", "center");
    const L = 0.5 - d;
    let O = d * E + L * f;
    const X = [], N = [];
    let D = 0, q = 0, w = 0, P = 0, I;
    for (let b = 0, K = g.length; b < K; b += 2) {
      const B = g[b];
      if (B === `
`) {
        q += D, D = 0, O = d * E + L * f, ++P;
        continue;
      }
      const Q = g[b + 1] || l.font;
      Q !== I && (n && X.push("font", Q), i && N.push("font", Q), I = Q), D = Math.max(D, y[w]);
      const R = [
        B,
        O + L * p[w] + d * (p[w] - x[P]),
        0.5 * (f + D) + q
      ];
      O += p[w], n && X.push("strokeText", R), i && N.push("fillText", R), ++w;
    }
    return Array.prototype.push.apply(C, X), Array.prototype.push.apply(C, N), this.labels_[r] = S, S;
  }
  /**
   * @param {CanvasRenderingContext2D} context Context.
   * @param {import("../../coordinate.js").Coordinate} p1 1st point of the background box.
   * @param {import("../../coordinate.js").Coordinate} p2 2nd point of the background box.
   * @param {import("../../coordinate.js").Coordinate} p3 3rd point of the background box.
   * @param {import("../../coordinate.js").Coordinate} p4 4th point of the background box.
   * @param {Array<*>} fillInstruction Fill instruction.
   * @param {Array<*>} strokeInstruction Stroke instruction.
   */
  replayTextBackground_(t, e, i, n, r, o, a) {
    t.beginPath(), t.moveTo.apply(t, e), t.lineTo.apply(t, i), t.lineTo.apply(t, n), t.lineTo.apply(t, r), t.lineTo.apply(t, e), o && (this.alignFill_ = /** @type {boolean} */
    o[2], this.fill_(t)), a && (this.setStrokeStyle_(
      t,
      /** @type {Array<*>} */
      a
    ), t.stroke());
  }
  /**
   * @private
   * @param {number} sheetWidth Width of the sprite sheet.
   * @param {number} sheetHeight Height of the sprite sheet.
   * @param {number} centerX X.
   * @param {number} centerY Y.
   * @param {number} width Width.
   * @param {number} height Height.
   * @param {number} anchorX Anchor X.
   * @param {number} anchorY Anchor Y.
   * @param {number} originX Origin X.
   * @param {number} originY Origin Y.
   * @param {number} rotation Rotation.
   * @param {import("../../size.js").Size} scale Scale.
   * @param {boolean} snapToPixel Snap to pixel.
   * @param {Array<number>} padding Padding.
   * @param {boolean} fillStroke Background fill or stroke.
   * @param {import("../../Feature.js").FeatureLike} feature Feature.
   * @return {ImageOrLabelDimensions} Dimensions for positioning and decluttering the image or label.
   */
  calculateImageOrLabelDimensions_(t, e, i, n, r, o, a, l, h, c, u, d, f, g, _, m) {
    a *= d[0], l *= d[1];
    let p = i - a, y = n - l;
    const x = r + h > t ? t - h : r, E = o + c > e ? e - c : o, C = g[3] + x * d[0] + g[1], T = g[0] + E * d[1] + g[2], v = p - g[3], S = y - g[0];
    (_ || u !== 0) && (Ht[0] = v, $t[0] = v, Ht[1] = S, Nt[1] = S, Nt[0] = v + C, Gt[0] = Nt[0], Gt[1] = S + T, $t[1] = Gt[1]);
    let L;
    return u !== 0 ? (L = se(
      Pt(),
      i,
      n,
      1,
      1,
      u,
      -i,
      -n
    ), et(L, Ht), et(L, Nt), et(L, Gt), et(L, $t), Bt(
      Math.min(Ht[0], Nt[0], Gt[0], $t[0]),
      Math.min(Ht[1], Nt[1], Gt[1], $t[1]),
      Math.max(Ht[0], Nt[0], Gt[0], $t[0]),
      Math.max(Ht[1], Nt[1], Gt[1], $t[1]),
      we
    )) : Bt(
      Math.min(v, v + C),
      Math.min(S, S + T),
      Math.max(v, v + C),
      Math.max(S, S + T),
      we
    ), f && (p = Math.round(p), y = Math.round(y)), {
      drawImageX: p,
      drawImageY: y,
      drawImageW: x,
      drawImageH: E,
      originX: h,
      originY: c,
      declutterBox: {
        minX: we[0],
        minY: we[1],
        maxX: we[2],
        maxY: we[3],
        value: m
      },
      canvasTransform: L,
      scale: d
    };
  }
  /**
   * @private
   * @param {CanvasRenderingContext2D} context Context.
   * @param {number} contextScale Scale of the context.
   * @param {import("../canvas.js").Label|HTMLImageElement|HTMLCanvasElement|HTMLVideoElement} imageOrLabel Image.
   * @param {ImageOrLabelDimensions} dimensions Dimensions.
   * @param {number} opacity Opacity.
   * @param {Array<*>} fillInstruction Fill instruction.
   * @param {Array<*>} strokeInstruction Stroke instruction.
   * @return {boolean} The image or label was rendered.
   */
  replayImageOrLabel_(t, e, i, n, r, o, a) {
    const l = !!(o || a), h = n.declutterBox, c = t.canvas, u = a ? a[2] * n.scale[0] / 2 : 0;
    return h.minX - u <= c.width / e && h.maxX + u >= 0 && h.minY - u <= c.height / e && h.maxY + u >= 0 && (l && this.replayTextBackground_(
      t,
      Ht,
      Nt,
      Gt,
      $t,
      /** @type {Array<*>} */
      o,
      /** @type {Array<*>} */
      a
    ), Kl(
      t,
      n.canvasTransform,
      r,
      i,
      n.originX,
      n.originY,
      n.drawImageW,
      n.drawImageH,
      n.drawImageX,
      n.drawImageY,
      n.scale
    )), !0;
  }
  /**
   * @private
   * @param {CanvasRenderingContext2D} context Context.
   */
  fill_(t) {
    if (this.alignFill_) {
      const e = et(this.renderedTransform_, [0, 0]), i = 512 * this.pixelRatio;
      t.save(), t.translate(e[0] % i, e[1] % i), t.rotate(this.viewRotation_);
    }
    t.fill(), this.alignFill_ && t.restore();
  }
  /**
   * @private
   * @param {CanvasRenderingContext2D} context Context.
   * @param {Array<*>} instruction Instruction.
   */
  setStrokeStyle_(t, e) {
    t.strokeStyle = /** @type {import("../../colorlike.js").ColorLike} */
    e[1], t.lineWidth = /** @type {number} */
    e[2], t.lineCap = /** @type {CanvasLineCap} */
    e[3], t.lineJoin = /** @type {CanvasLineJoin} */
    e[4], t.miterLimit = /** @type {number} */
    e[5], t.lineDashOffset = /** @type {number} */
    e[7], t.setLineDash(
      /** @type {Array<number>} */
      e[6]
    );
  }
  /**
   * @private
   * @param {string|Array<string>} text The text to draw.
   * @param {string} textKey The key of the text state.
   * @param {string} strokeKey The key for the stroke state.
   * @param {string} fillKey The key for the fill state.
   * @return {{label: import("../canvas.js").Label, anchorX: number, anchorY: number}} The text image and its anchor.
   */
  drawLabelWithPointPlacement_(t, e, i, n) {
    const r = this.textStates[e], o = this.createLabel(t, e, n, i), a = this.strokeStates[i], l = this.pixelRatio, h = Sr(
      Array.isArray(t) ? t[0] : t,
      r.textAlign || di
    ), c = ii[r.textBaseline || en], u = a && a.lineWidth ? a.lineWidth : 0, d = o.width / l - 2 * r.scale[0], f = h * d + 2 * (0.5 - h) * u, g = c * o.height / l + 2 * (0.5 - c) * u;
    return {
      label: o,
      anchorX: f,
      anchorY: g
    };
  }
  /**
   * @private
   * @param {CanvasRenderingContext2D} context Context.
   * @param {number} contextScale Scale of the context.
   * @param {import("../../transform.js").Transform} transform Transform.
   * @param {Array<*>} instructions Instructions array.
   * @param {boolean} snapToPixel Snap point symbols and text to integer pixels.
   * @param {FeatureCallback<T>} [featureCallback] Feature callback.
   * @param {import("../../extent.js").Extent} [hitExtent] Only check
   *     features that intersect this extent.
   * @param {import("rbush").default} [declutterTree] Declutter tree.
   * @return {T|undefined} Callback result.
   * @template T
   */
  execute_(t, e, i, n, r, o, a, l) {
    let h;
    this.pixelCoordinates_ && re(i, this.renderedTransform_) ? h = this.pixelCoordinates_ : (this.pixelCoordinates_ || (this.pixelCoordinates_ = []), h = me(
      this.coordinates,
      0,
      this.coordinates.length,
      2,
      i,
      this.pixelCoordinates_
    ), da(this.renderedTransform_, i));
    let c = 0;
    const u = n.length;
    let d = 0, f, g, _, m, p, y, x, E, C, T, v, S, L = 0, O = 0, X = null, N = null;
    const D = this.coordinateCache_, q = this.viewRotation_, w = Math.round(Math.atan2(-i[1], i[0]) * 1e12) / 1e12, P = (
      /** @type {import("../../render.js").State} */
      {
        context: t,
        pixelRatio: this.pixelRatio,
        resolution: this.resolution,
        rotation: q
      }
    ), I = this.instructions != n || this.overlaps ? 0 : 200;
    let b, K, B, Q;
    for (; c < u; ) {
      const R = n[c];
      switch (
        /** @type {import("./Instruction.js").default} */
        R[0]
      ) {
        case M.BEGIN_GEOMETRY:
          b = /** @type {import("../../Feature.js").FeatureLike} */
          R[1], Q = R[3], b.getGeometry() ? a !== void 0 && !at(a, Q.getExtent()) ? c = /** @type {number} */
          R[2] + 1 : ++c : c = /** @type {number} */
          R[2];
          break;
        case M.BEGIN_PATH:
          L > I && (this.fill_(t), L = 0), O > I && (t.stroke(), O = 0), !L && !O && (t.beginPath(), m = NaN, p = NaN), ++c;
          break;
        case M.CIRCLE:
          d = /** @type {number} */
          R[1];
          const Y = h[d], U = h[d + 1], Kt = h[d + 2], vt = h[d + 3], it = Kt - Y, bt = vt - U, ye = Math.sqrt(it * it + bt * bt);
          t.moveTo(Y + ye, U), t.arc(Y, U, ye, 0, 2 * Math.PI, !0), ++c;
          break;
        case M.CLOSE_PATH:
          t.closePath(), ++c;
          break;
        case M.CUSTOM:
          d = /** @type {number} */
          R[1], f = R[2];
          const Ri = (
            /** @type {import("../../geom/SimpleGeometry.js").default} */
            R[3]
          ), xe = R[4], Ti = R.length == 6 ? R[5] : void 0;
          P.geometry = Ri, P.feature = b, c in D || (D[c] = []);
          const Ut = D[c];
          Ti ? Ti(h, d, f, 2, Ut) : (Ut[0] = h[d], Ut[1] = h[d + 1], Ut.length = 2), xe(Ut, P), ++c;
          break;
        case M.DRAW_IMAGE:
          d = /** @type {number} */
          R[1], f = /** @type {number} */
          R[2], E = /** @type {HTMLCanvasElement|HTMLVideoElement|HTMLImageElement} */
          R[3], g = /** @type {number} */
          R[4], _ = /** @type {number} */
          R[5];
          let Ke = (
            /** @type {number} */
            R[6]
          );
          const Vt = (
            /** @type {number} */
            R[7]
          ), Ii = (
            /** @type {number} */
            R[8]
          ), Si = (
            /** @type {number} */
            R[9]
          ), vi = (
            /** @type {boolean} */
            R[10]
          );
          let Ee = (
            /** @type {number} */
            R[11]
          );
          const En = (
            /** @type {import("../../size.js").Size} */
            R[12]
          );
          let ht = (
            /** @type {number} */
            R[13]
          );
          const mt = (
            /** @type {"declutter"|"obstacle"|"none"|undefined} */
            R[14]
          ), xt = (
            /** @type {import("../canvas.js").DeclutterImageWithText} */
            R[15]
          );
          if (!E && R.length >= 20) {
            C = /** @type {string} */
            R[19], T = /** @type {string} */
            R[20], v = /** @type {string} */
            R[21], S = /** @type {string} */
            R[22];
            const ft = this.drawLabelWithPointPlacement_(
              C,
              T,
              v,
              S
            );
            E = ft.label, R[3] = E;
            const Te = (
              /** @type {number} */
              R[23]
            );
            g = (ft.anchorX - Te) * this.pixelRatio, R[4] = g;
            const pt = (
              /** @type {number} */
              R[24]
            );
            _ = (ft.anchorY - pt) * this.pixelRatio, R[5] = _, Ke = E.height, R[6] = Ke, ht = E.width, R[13] = ht;
          }
          let Ft;
          R.length > 25 && (Ft = /** @type {number} */
          R[25]);
          let Ce, oe, jt;
          R.length > 17 ? (Ce = /** @type {Array<number>} */
          R[16], oe = /** @type {boolean} */
          R[17], jt = /** @type {boolean} */
          R[18]) : (Ce = fe, oe = !1, jt = !1), vi && w ? Ee += q : !vi && !w && (Ee -= q);
          let Re = 0;
          for (; d < f; d += 2) {
            if (Ft && Ft[Re++] < ht / this.pixelRatio)
              continue;
            const ft = this.calculateImageOrLabelDimensions_(
              E.width,
              E.height,
              h[d],
              h[d + 1],
              ht,
              Ke,
              g,
              _,
              Ii,
              Si,
              Ee,
              En,
              r,
              Ce,
              oe || jt,
              b
            ), Te = [
              t,
              e,
              E,
              ft,
              Vt,
              oe ? (
                /** @type {Array<*>} */
                X
              ) : null,
              jt ? (
                /** @type {Array<*>} */
                N
              ) : null
            ];
            if (l) {
              if (mt === "none")
                continue;
              if (mt === "obstacle") {
                l.insert(ft.declutterBox);
                continue;
              } else {
                let pt, Dt;
                if (xt) {
                  const gt = f - d;
                  if (!xt[gt]) {
                    xt[gt] = Te;
                    continue;
                  }
                  if (pt = xt[gt], delete xt[gt], Dt = Ir(pt), l.collides(Dt))
                    continue;
                }
                if (l.collides(ft.declutterBox))
                  continue;
                pt && (l.insert(Dt), this.replayImageOrLabel_.apply(this, pt)), l.insert(ft.declutterBox);
              }
            }
            this.replayImageOrLabel_.apply(this, Te);
          }
          ++c;
          break;
        case M.DRAW_CHARS:
          const wi = (
            /** @type {number} */
            R[1]
          ), ot = (
            /** @type {number} */
            R[2]
          ), Cn = (
            /** @type {number} */
            R[3]
          ), Ko = (
            /** @type {number} */
            R[4]
          );
          S = /** @type {string} */
          R[5];
          const Uo = (
            /** @type {number} */
            R[6]
          ), Fs = (
            /** @type {number} */
            R[7]
          ), Ds = (
            /** @type {number} */
            R[8]
          );
          v = /** @type {string} */
          R[9];
          const Rn = (
            /** @type {number} */
            R[10]
          );
          C = /** @type {string} */
          R[11], T = /** @type {string} */
          R[12];
          const ks = [
            /** @type {number} */
            R[13],
            /** @type {number} */
            R[13]
          ], Tn = this.textStates[T], Ue = Tn.font, Ve = [
            Tn.scale[0] * Fs,
            Tn.scale[1] * Fs
          ];
          let je;
          Ue in this.widths_ ? je = this.widths_[Ue] : (je = {}, this.widths_[Ue] = je);
          const Ns = Uc(h, wi, ot, 2), Gs = Math.abs(Ve[0]) * cr(Ue, C, je);
          if (Ko || Gs <= Ns) {
            const ft = this.textStates[T].textAlign, Te = (Ns - Gs) * ii[ft], pt = Kc(
              h,
              wi,
              ot,
              2,
              C,
              Te,
              Uo,
              Math.abs(Ve[0]),
              cr,
              Ue,
              je,
              w ? 0 : this.viewRotation_
            );
            t:
              if (pt) {
                const Dt = [];
                let gt, Li, Ai, ct, yt;
                if (v)
                  for (gt = 0, Li = pt.length; gt < Li; ++gt) {
                    yt = pt[gt], Ai = /** @type {string} */
                    yt[4], ct = this.createLabel(Ai, T, "", v), g = /** @type {number} */
                    yt[2] + (Ve[0] < 0 ? -Rn : Rn), _ = Cn * ct.height + (0.5 - Cn) * 2 * Rn * Ve[1] / Ve[0] - Ds;
                    const kt = this.calculateImageOrLabelDimensions_(
                      ct.width,
                      ct.height,
                      yt[0],
                      yt[1],
                      ct.width,
                      ct.height,
                      g,
                      _,
                      0,
                      0,
                      yt[3],
                      ks,
                      !1,
                      fe,
                      !1,
                      b
                    );
                    if (l && l.collides(kt.declutterBox))
                      break t;
                    Dt.push([
                      t,
                      e,
                      ct,
                      kt,
                      1,
                      null,
                      null
                    ]);
                  }
                if (S)
                  for (gt = 0, Li = pt.length; gt < Li; ++gt) {
                    yt = pt[gt], Ai = /** @type {string} */
                    yt[4], ct = this.createLabel(Ai, T, S, ""), g = /** @type {number} */
                    yt[2], _ = Cn * ct.height - Ds;
                    const kt = this.calculateImageOrLabelDimensions_(
                      ct.width,
                      ct.height,
                      yt[0],
                      yt[1],
                      ct.width,
                      ct.height,
                      g,
                      _,
                      0,
                      0,
                      yt[3],
                      ks,
                      !1,
                      fe,
                      !1,
                      b
                    );
                    if (l && l.collides(kt.declutterBox))
                      break t;
                    Dt.push([
                      t,
                      e,
                      ct,
                      kt,
                      1,
                      null,
                      null
                    ]);
                  }
                l && l.load(Dt.map(Ir));
                for (let kt = 0, Vo = Dt.length; kt < Vo; ++kt)
                  this.replayImageOrLabel_.apply(this, Dt[kt]);
              }
          }
          ++c;
          break;
        case M.END_GEOMETRY:
          if (o !== void 0) {
            b = /** @type {import("../../Feature.js").FeatureLike} */
            R[1];
            const ft = o(b, Q);
            if (ft)
              return ft;
          }
          ++c;
          break;
        case M.FILL:
          I ? L++ : this.fill_(t), ++c;
          break;
        case M.MOVE_TO_LINE_TO:
          for (d = /** @type {number} */
          R[1], f = /** @type {number} */
          R[2], K = h[d], B = h[d + 1], y = K + 0.5 | 0, x = B + 0.5 | 0, (y !== m || x !== p) && (t.moveTo(K, B), m = y, p = x), d += 2; d < f; d += 2)
            K = h[d], B = h[d + 1], y = K + 0.5 | 0, x = B + 0.5 | 0, (d == f - 2 || y !== m || x !== p) && (t.lineTo(K, B), m = y, p = x);
          ++c;
          break;
        case M.SET_FILL_STYLE:
          X = R, this.alignFill_ = R[2], L && (this.fill_(t), L = 0, O && (t.stroke(), O = 0)), t.fillStyle = /** @type {import("../../colorlike.js").ColorLike} */
          R[1], ++c;
          break;
        case M.SET_STROKE_STYLE:
          N = R, O && (t.stroke(), O = 0), this.setStrokeStyle_(
            t,
            /** @type {Array<*>} */
            R
          ), ++c;
          break;
        case M.STROKE:
          I ? O++ : t.stroke(), ++c;
          break;
        default:
          ++c;
          break;
      }
    }
    L && this.fill_(t), O && t.stroke();
  }
  /**
   * @param {CanvasRenderingContext2D} context Context.
   * @param {number} contextScale Scale of the context.
   * @param {import("../../transform.js").Transform} transform Transform.
   * @param {number} viewRotation View rotation.
   * @param {boolean} snapToPixel Snap point symbols and text to integer pixels.
   * @param {import("rbush").default} [declutterTree] Declutter tree.
   */
  execute(t, e, i, n, r, o) {
    this.viewRotation_ = n, this.execute_(
      t,
      e,
      i,
      this.instructions,
      r,
      void 0,
      void 0,
      o
    );
  }
  /**
   * @param {CanvasRenderingContext2D} context Context.
   * @param {import("../../transform.js").Transform} transform Transform.
   * @param {number} viewRotation View rotation.
   * @param {FeatureCallback<T>} [featureCallback] Feature callback.
   * @param {import("../../extent.js").Extent} [hitExtent] Only check
   *     features that intersect this extent.
   * @return {T|undefined} Callback result.
   * @template T
   */
  executeHitDetection(t, e, i, n, r) {
    return this.viewRotation_ = i, this.execute_(
      t,
      1,
      e,
      this.hitDetectionInstructions,
      !0,
      n,
      r
    );
  }
}
const $c = Hc, Fn = ["Polygon", "Circle", "LineString", "Image", "Text", "Default"];
class qc {
  /**
   * @param {import("../../extent.js").Extent} maxExtent Max extent for clipping. When a
   * `maxExtent` was set on the Builder for this executor group, the same `maxExtent`
   * should be set here, unless the target context does not exceed that extent (which
   * can be the case when rendering to tiles).
   * @param {number} resolution Resolution.
   * @param {number} pixelRatio Pixel ratio.
   * @param {boolean} overlaps The executor group can have overlapping geometries.
   * @param {!Object<string, !Object<import("../canvas.js").BuilderType, import("../canvas.js").SerializableInstructions>>} allInstructions
   * The serializable instructions.
   * @param {number} [renderBuffer] Optional rendering buffer.
   */
  constructor(t, e, i, n, r, o) {
    this.maxExtent_ = t, this.overlaps_ = n, this.pixelRatio_ = i, this.resolution_ = e, this.renderBuffer_ = o, this.executorsByZIndex_ = {}, this.hitDetectionContext_ = null, this.hitDetectionTransform_ = Pt(), this.createExecutors_(r);
  }
  /**
   * @param {CanvasRenderingContext2D} context Context.
   * @param {import("../../transform.js").Transform} transform Transform.
   */
  clip(t, e) {
    const i = this.getClipCoords(e);
    t.beginPath(), t.moveTo(i[0], i[1]), t.lineTo(i[2], i[3]), t.lineTo(i[4], i[5]), t.lineTo(i[6], i[7]), t.clip();
  }
  /**
   * Create executors and populate them using the provided instructions.
   * @private
   * @param {!Object<string, !Object<import("../canvas.js").BuilderType, import("../canvas.js").SerializableInstructions>>} allInstructions The serializable instructions
   */
  createExecutors_(t) {
    for (const e in t) {
      let i = this.executorsByZIndex_[e];
      i === void 0 && (i = {}, this.executorsByZIndex_[e] = i);
      const n = t[e];
      for (const r in n) {
        const o = n[r];
        i[r] = new $c(
          this.resolution_,
          this.pixelRatio_,
          this.overlaps_,
          o
        );
      }
    }
  }
  /**
   * @param {Array<import("../canvas.js").BuilderType>} executors Executors.
   * @return {boolean} Has executors of the provided types.
   */
  hasExecutors(t) {
    for (const e in this.executorsByZIndex_) {
      const i = this.executorsByZIndex_[e];
      for (let n = 0, r = t.length; n < r; ++n)
        if (t[n] in i)
          return !0;
    }
    return !1;
  }
  /**
   * @param {import("../../coordinate.js").Coordinate} coordinate Coordinate.
   * @param {number} resolution Resolution.
   * @param {number} rotation Rotation.
   * @param {number} hitTolerance Hit tolerance in pixels.
   * @param {function(import("../../Feature.js").FeatureLike, import("../../geom/SimpleGeometry.js").default, number): T} callback Feature callback.
   * @param {Array<import("../../Feature.js").FeatureLike>} declutteredFeatures Decluttered features.
   * @return {T|undefined} Callback result.
   * @template T
   */
  forEachFeatureAtCoordinate(t, e, i, n, r, o) {
    n = Math.round(n);
    const a = n * 2 + 1, l = se(
      this.hitDetectionTransform_,
      n + 0.5,
      n + 0.5,
      1 / e,
      -1 / e,
      -i,
      -t[0],
      -t[1]
    ), h = !this.hitDetectionContext_;
    h && (this.hitDetectionContext_ = lt(
      a,
      a,
      void 0,
      { willReadFrequently: !0 }
    ));
    const c = this.hitDetectionContext_;
    c.canvas.width !== a || c.canvas.height !== a ? (c.canvas.width = a, c.canvas.height = a) : h || c.clearRect(0, 0, a, a);
    let u;
    this.renderBuffer_ !== void 0 && (u = Tt(), ti(u, t), is(
      u,
      e * (this.renderBuffer_ + n),
      u
    ));
    const d = Jc(n);
    let f;
    function g(C, T) {
      const v = c.getImageData(
        0,
        0,
        a,
        a
      ).data;
      for (let S = 0, L = d.length; S < L; S++)
        if (v[d[S]] > 0) {
          if (!o || f !== "Image" && f !== "Text" || o.includes(C)) {
            const O = (d[S] - 3) / 4, X = n - O % a, N = n - (O / a | 0), D = r(C, T, X * X + N * N);
            if (D)
              return D;
          }
          c.clearRect(0, 0, a, a);
          break;
        }
    }
    const _ = Object.keys(this.executorsByZIndex_).map(Number);
    _.sort(We);
    let m, p, y, x, E;
    for (m = _.length - 1; m >= 0; --m) {
      const C = _[m].toString();
      for (y = this.executorsByZIndex_[C], p = Fn.length - 1; p >= 0; --p)
        if (f = Fn[p], x = y[f], x !== void 0 && (E = x.executeHitDetection(
          c,
          l,
          i,
          g,
          u
        ), E))
          return E;
    }
  }
  /**
   * @param {import("../../transform.js").Transform} transform Transform.
   * @return {Array<number>|null} Clip coordinates.
   */
  getClipCoords(t) {
    const e = this.maxExtent_;
    if (!e)
      return null;
    const i = e[0], n = e[1], r = e[2], o = e[3], a = [i, n, i, o, r, o, r, n];
    return me(a, 0, 8, 2, t, a), a;
  }
  /**
   * @return {boolean} Is empty.
   */
  isEmpty() {
    return si(this.executorsByZIndex_);
  }
  /**
   * @param {CanvasRenderingContext2D} context Context.
   * @param {number} contextScale Scale of the context.
   * @param {import("../../transform.js").Transform} transform Transform.
   * @param {number} viewRotation View rotation.
   * @param {boolean} snapToPixel Snap point symbols and test to integer pixel.
   * @param {Array<import("../canvas.js").BuilderType>} [builderTypes] Ordered replay types to replay.
   *     Default is {@link module:ol/render/replay~ORDER}
   * @param {import("rbush").default} [declutterTree] Declutter tree.
   */
  execute(t, e, i, n, r, o, a) {
    const l = Object.keys(this.executorsByZIndex_).map(Number);
    l.sort(We), this.maxExtent_ && (t.save(), this.clip(t, i)), o = o || Fn;
    let h, c, u, d, f, g;
    for (a && l.reverse(), h = 0, c = l.length; h < c; ++h) {
      const _ = l[h].toString();
      for (f = this.executorsByZIndex_[_], u = 0, d = o.length; u < d; ++u) {
        const m = o[u];
        g = f[m], g !== void 0 && g.execute(
          t,
          e,
          i,
          n,
          r,
          a
        );
      }
    }
    this.maxExtent_ && t.restore();
  }
}
const Dn = {};
function Jc(s) {
  if (Dn[s] !== void 0)
    return Dn[s];
  const t = s * 2 + 1, e = s * s, i = new Array(e + 1);
  for (let r = 0; r <= s; ++r)
    for (let o = 0; o <= s; ++o) {
      const a = r * r + o * o;
      if (a > e)
        break;
      let l = i[a];
      l || (l = [], i[a] = l), l.push(((s + r) * t + (s + o)) * 4 + 3), r > 0 && l.push(((s - r) * t + (s + o)) * 4 + 3), o > 0 && (l.push(((s + r) * t + (s - o)) * 4 + 3), r > 0 && l.push(((s - r) * t + (s - o)) * 4 + 3));
    }
  const n = [];
  for (let r = 0, o = i.length; r < o; ++r)
    i[r] && n.push(...i[r]);
  return Dn[s] = n, n;
}
const vr = qc;
class Qc extends ko {
  /**
   * @param {CanvasRenderingContext2D} context Context.
   * @param {number} pixelRatio Pixel ratio.
   * @param {import("../../extent.js").Extent} extent Extent.
   * @param {import("../../transform.js").Transform} transform Transform.
   * @param {number} viewRotation View rotation.
   * @param {number} [squaredTolerance] Optional squared tolerance for simplification.
   * @param {import("../../proj.js").TransformFunction} [userTransform] Transform from user to view projection.
   */
  constructor(t, e, i, n, r, o, a) {
    super(), this.context_ = t, this.pixelRatio_ = e, this.extent_ = i, this.transform_ = n, this.transformRotation_ = n ? ss(Math.atan2(n[1], n[0]), 10) : 0, this.viewRotation_ = r, this.squaredTolerance_ = o, this.userTransform_ = a, this.contextFillState_ = null, this.contextStrokeState_ = null, this.contextTextState_ = null, this.fillState_ = null, this.strokeState_ = null, this.image_ = null, this.imageAnchorX_ = 0, this.imageAnchorY_ = 0, this.imageHeight_ = 0, this.imageOpacity_ = 0, this.imageOriginX_ = 0, this.imageOriginY_ = 0, this.imageRotateWithView_ = !1, this.imageRotation_ = 0, this.imageScale_ = [0, 0], this.imageWidth_ = 0, this.text_ = "", this.textOffsetX_ = 0, this.textOffsetY_ = 0, this.textRotateWithView_ = !1, this.textRotation_ = 0, this.textScale_ = [0, 0], this.textFillState_ = null, this.textStrokeState_ = null, this.textState_ = null, this.pixelCoordinates_ = [], this.tmpLocalTransform_ = Pt();
  }
  /**
   * @param {Array<number>} flatCoordinates Flat coordinates.
   * @param {number} offset Offset.
   * @param {number} end End.
   * @param {number} stride Stride.
   * @private
   */
  drawImages_(t, e, i, n) {
    if (!this.image_)
      return;
    const r = me(
      t,
      e,
      i,
      n,
      this.transform_,
      this.pixelCoordinates_
    ), o = this.context_, a = this.tmpLocalTransform_, l = o.globalAlpha;
    this.imageOpacity_ != 1 && (o.globalAlpha = l * this.imageOpacity_);
    let h = this.imageRotation_;
    this.transformRotation_ === 0 && (h -= this.viewRotation_), this.imageRotateWithView_ && (h += this.viewRotation_);
    for (let c = 0, u = r.length; c < u; c += 2) {
      const d = r[c] - this.imageAnchorX_, f = r[c + 1] - this.imageAnchorY_;
      if (h !== 0 || this.imageScale_[0] != 1 || this.imageScale_[1] != 1) {
        const g = d + this.imageAnchorX_, _ = f + this.imageAnchorY_;
        se(
          a,
          g,
          _,
          1,
          1,
          h,
          -g,
          -_
        ), o.setTransform.apply(o, a), o.translate(g, _), o.scale(this.imageScale_[0], this.imageScale_[1]), o.drawImage(
          this.image_,
          this.imageOriginX_,
          this.imageOriginY_,
          this.imageWidth_,
          this.imageHeight_,
          -this.imageAnchorX_,
          -this.imageAnchorY_,
          this.imageWidth_,
          this.imageHeight_
        ), o.setTransform(1, 0, 0, 1, 0, 0);
      } else
        o.drawImage(
          this.image_,
          this.imageOriginX_,
          this.imageOriginY_,
          this.imageWidth_,
          this.imageHeight_,
          d,
          f,
          this.imageWidth_,
          this.imageHeight_
        );
    }
    this.imageOpacity_ != 1 && (o.globalAlpha = l);
  }
  /**
   * @param {Array<number>} flatCoordinates Flat coordinates.
   * @param {number} offset Offset.
   * @param {number} end End.
   * @param {number} stride Stride.
   * @private
   */
  drawText_(t, e, i, n) {
    if (!this.textState_ || this.text_ === "")
      return;
    this.textFillState_ && this.setContextFillState_(this.textFillState_), this.textStrokeState_ && this.setContextStrokeState_(this.textStrokeState_), this.setContextTextState_(this.textState_);
    const r = me(
      t,
      e,
      i,
      n,
      this.transform_,
      this.pixelCoordinates_
    ), o = this.context_;
    let a = this.textRotation_;
    for (this.transformRotation_ === 0 && (a -= this.viewRotation_), this.textRotateWithView_ && (a += this.viewRotation_); e < i; e += n) {
      const l = r[e] + this.textOffsetX_, h = r[e + 1] + this.textOffsetY_;
      a !== 0 || this.textScale_[0] != 1 || this.textScale_[1] != 1 ? (o.translate(l - this.textOffsetX_, h - this.textOffsetY_), o.rotate(a), o.translate(this.textOffsetX_, this.textOffsetY_), o.scale(this.textScale_[0], this.textScale_[1]), this.textStrokeState_ && o.strokeText(this.text_, 0, 0), this.textFillState_ && o.fillText(this.text_, 0, 0), o.setTransform(1, 0, 0, 1, 0, 0)) : (this.textStrokeState_ && o.strokeText(this.text_, l, h), this.textFillState_ && o.fillText(this.text_, l, h));
    }
  }
  /**
   * @param {Array<number>} flatCoordinates Flat coordinates.
   * @param {number} offset Offset.
   * @param {number} end End.
   * @param {number} stride Stride.
   * @param {boolean} close Close.
   * @private
   * @return {number} end End.
   */
  moveToLineTo_(t, e, i, n, r) {
    const o = this.context_, a = me(
      t,
      e,
      i,
      n,
      this.transform_,
      this.pixelCoordinates_
    );
    o.moveTo(a[0], a[1]);
    let l = a.length;
    r && (l -= 2);
    for (let h = 2; h < l; h += 2)
      o.lineTo(a[h], a[h + 1]);
    return r && o.closePath(), i;
  }
  /**
   * @param {Array<number>} flatCoordinates Flat coordinates.
   * @param {number} offset Offset.
   * @param {Array<number>} ends Ends.
   * @param {number} stride Stride.
   * @private
   * @return {number} End.
   */
  drawRings_(t, e, i, n) {
    for (let r = 0, o = i.length; r < o; ++r)
      e = this.moveToLineTo_(
        t,
        e,
        i[r],
        n,
        !0
      );
    return e;
  }
  /**
   * Render a circle geometry into the canvas.  Rendering is immediate and uses
   * the current fill and stroke styles.
   *
   * @param {import("../../geom/Circle.js").default} geometry Circle geometry.
   * @api
   */
  drawCircle(t) {
    if (at(this.extent_, t.getExtent())) {
      if (this.fillState_ || this.strokeState_) {
        this.fillState_ && this.setContextFillState_(this.fillState_), this.strokeState_ && this.setContextStrokeState_(this.strokeState_);
        const e = dl(
          t,
          this.transform_,
          this.pixelCoordinates_
        ), i = e[2] - e[0], n = e[3] - e[1], r = Math.sqrt(i * i + n * n), o = this.context_;
        o.beginPath(), o.arc(
          e[0],
          e[1],
          r,
          0,
          2 * Math.PI
        ), this.fillState_ && o.fill(), this.strokeState_ && o.stroke();
      }
      this.text_ !== "" && this.drawText_(t.getCenter(), 0, 2, 2);
    }
  }
  /**
   * Set the rendering style.  Note that since this is an immediate rendering API,
   * any `zIndex` on the provided style will be ignored.
   *
   * @param {import("../../style/Style.js").default} style The rendering style.
   * @api
   */
  setStyle(t) {
    this.setFillStrokeStyle(t.getFill(), t.getStroke()), this.setImageStyle(t.getImage()), this.setTextStyle(t.getText());
  }
  /**
   * @param {import("../../transform.js").Transform} transform Transform.
   */
  setTransform(t) {
    this.transform_ = t;
  }
  /**
   * Render a geometry into the canvas.  Call
   * {@link module:ol/render/canvas/Immediate~CanvasImmediateRenderer#setStyle renderer.setStyle()} first to set the rendering style.
   *
   * @param {import("../../geom/Geometry.js").default|import("../Feature.js").default} geometry The geometry to render.
   * @api
   */
  drawGeometry(t) {
    switch (t.getType()) {
      case "Point":
        this.drawPoint(
          /** @type {import("../../geom/Point.js").default} */
          t
        );
        break;
      case "LineString":
        this.drawLineString(
          /** @type {import("../../geom/LineString.js").default} */
          t
        );
        break;
      case "Polygon":
        this.drawPolygon(
          /** @type {import("../../geom/Polygon.js").default} */
          t
        );
        break;
      case "MultiPoint":
        this.drawMultiPoint(
          /** @type {import("../../geom/MultiPoint.js").default} */
          t
        );
        break;
      case "MultiLineString":
        this.drawMultiLineString(
          /** @type {import("../../geom/MultiLineString.js").default} */
          t
        );
        break;
      case "MultiPolygon":
        this.drawMultiPolygon(
          /** @type {import("../../geom/MultiPolygon.js").default} */
          t
        );
        break;
      case "GeometryCollection":
        this.drawGeometryCollection(
          /** @type {import("../../geom/GeometryCollection.js").default} */
          t
        );
        break;
      case "Circle":
        this.drawCircle(
          /** @type {import("../../geom/Circle.js").default} */
          t
        );
        break;
    }
  }
  /**
   * Render a feature into the canvas.  Note that any `zIndex` on the provided
   * style will be ignored - features are rendered immediately in the order that
   * this method is called.  If you need `zIndex` support, you should be using an
   * {@link module:ol/layer/Vector~VectorLayer} instead.
   *
   * @param {import("../../Feature.js").default} feature Feature.
   * @param {import("../../style/Style.js").default} style Style.
   * @api
   */
  drawFeature(t, e) {
    const i = e.getGeometryFunction()(t);
    !i || !at(this.extent_, i.getExtent()) || (this.setStyle(e), this.drawGeometry(i));
  }
  /**
   * Render a GeometryCollection to the canvas.  Rendering is immediate and
   * uses the current styles appropriate for each geometry in the collection.
   *
   * @param {import("../../geom/GeometryCollection.js").default} geometry Geometry collection.
   */
  drawGeometryCollection(t) {
    const e = t.getGeometriesArray();
    for (let i = 0, n = e.length; i < n; ++i)
      this.drawGeometry(e[i]);
  }
  /**
   * Render a Point geometry into the canvas.  Rendering is immediate and uses
   * the current style.
   *
   * @param {import("../../geom/Point.js").default|import("../Feature.js").default} geometry Point geometry.
   */
  drawPoint(t) {
    this.squaredTolerance_ && (t = /** @type {import("../../geom/Point.js").default} */
    t.simplifyTransformed(
      this.squaredTolerance_,
      this.userTransform_
    ));
    const e = t.getFlatCoordinates(), i = t.getStride();
    this.image_ && this.drawImages_(e, 0, e.length, i), this.text_ !== "" && this.drawText_(e, 0, e.length, i);
  }
  /**
   * Render a MultiPoint geometry  into the canvas.  Rendering is immediate and
   * uses the current style.
   *
   * @param {import("../../geom/MultiPoint.js").default|import("../Feature.js").default} geometry MultiPoint geometry.
   */
  drawMultiPoint(t) {
    this.squaredTolerance_ && (t = /** @type {import("../../geom/MultiPoint.js").default} */
    t.simplifyTransformed(
      this.squaredTolerance_,
      this.userTransform_
    ));
    const e = t.getFlatCoordinates(), i = t.getStride();
    this.image_ && this.drawImages_(e, 0, e.length, i), this.text_ !== "" && this.drawText_(e, 0, e.length, i);
  }
  /**
   * Render a LineString into the canvas.  Rendering is immediate and uses
   * the current style.
   *
   * @param {import("../../geom/LineString.js").default|import("../Feature.js").default} geometry LineString geometry.
   */
  drawLineString(t) {
    if (this.squaredTolerance_ && (t = /** @type {import("../../geom/LineString.js").default} */
    t.simplifyTransformed(
      this.squaredTolerance_,
      this.userTransform_
    )), !!at(this.extent_, t.getExtent())) {
      if (this.strokeState_) {
        this.setContextStrokeState_(this.strokeState_);
        const e = this.context_, i = t.getFlatCoordinates();
        e.beginPath(), this.moveToLineTo_(
          i,
          0,
          i.length,
          t.getStride(),
          !1
        ), e.stroke();
      }
      if (this.text_ !== "") {
        const e = t.getFlatMidpoint();
        this.drawText_(e, 0, 2, 2);
      }
    }
  }
  /**
   * Render a MultiLineString geometry into the canvas.  Rendering is immediate
   * and uses the current style.
   *
   * @param {import("../../geom/MultiLineString.js").default|import("../Feature.js").default} geometry MultiLineString geometry.
   */
  drawMultiLineString(t) {
    this.squaredTolerance_ && (t = /** @type {import("../../geom/MultiLineString.js").default} */
    t.simplifyTransformed(
      this.squaredTolerance_,
      this.userTransform_
    ));
    const e = t.getExtent();
    if (at(this.extent_, e)) {
      if (this.strokeState_) {
        this.setContextStrokeState_(this.strokeState_);
        const i = this.context_, n = t.getFlatCoordinates();
        let r = 0;
        const o = (
          /** @type {Array<number>} */
          t.getEnds()
        ), a = t.getStride();
        i.beginPath();
        for (let l = 0, h = o.length; l < h; ++l)
          r = this.moveToLineTo_(
            n,
            r,
            o[l],
            a,
            !1
          );
        i.stroke();
      }
      if (this.text_ !== "") {
        const i = t.getFlatMidpoints();
        this.drawText_(i, 0, i.length, 2);
      }
    }
  }
  /**
   * Render a Polygon geometry into the canvas.  Rendering is immediate and uses
   * the current style.
   *
   * @param {import("../../geom/Polygon.js").default|import("../Feature.js").default} geometry Polygon geometry.
   */
  drawPolygon(t) {
    if (this.squaredTolerance_ && (t = /** @type {import("../../geom/Polygon.js").default} */
    t.simplifyTransformed(
      this.squaredTolerance_,
      this.userTransform_
    )), !!at(this.extent_, t.getExtent())) {
      if (this.strokeState_ || this.fillState_) {
        this.fillState_ && this.setContextFillState_(this.fillState_), this.strokeState_ && this.setContextStrokeState_(this.strokeState_);
        const e = this.context_;
        e.beginPath(), this.drawRings_(
          t.getOrientedFlatCoordinates(),
          0,
          /** @type {Array<number>} */
          t.getEnds(),
          t.getStride()
        ), this.fillState_ && e.fill(), this.strokeState_ && e.stroke();
      }
      if (this.text_ !== "") {
        const e = t.getFlatInteriorPoint();
        this.drawText_(e, 0, 2, 2);
      }
    }
  }
  /**
   * Render MultiPolygon geometry into the canvas.  Rendering is immediate and
   * uses the current style.
   * @param {import("../../geom/MultiPolygon.js").default} geometry MultiPolygon geometry.
   */
  drawMultiPolygon(t) {
    if (this.squaredTolerance_ && (t = /** @type {import("../../geom/MultiPolygon.js").default} */
    t.simplifyTransformed(
      this.squaredTolerance_,
      this.userTransform_
    )), !!at(this.extent_, t.getExtent())) {
      if (this.strokeState_ || this.fillState_) {
        this.fillState_ && this.setContextFillState_(this.fillState_), this.strokeState_ && this.setContextStrokeState_(this.strokeState_);
        const e = this.context_, i = t.getOrientedFlatCoordinates();
        let n = 0;
        const r = t.getEndss(), o = t.getStride();
        e.beginPath();
        for (let a = 0, l = r.length; a < l; ++a) {
          const h = r[a];
          n = this.drawRings_(i, n, h, o);
        }
        this.fillState_ && e.fill(), this.strokeState_ && e.stroke();
      }
      if (this.text_ !== "") {
        const e = t.getFlatInteriorPoints();
        this.drawText_(e, 0, e.length, 2);
      }
    }
  }
  /**
   * @param {import("../canvas.js").FillState} fillState Fill state.
   * @private
   */
  setContextFillState_(t) {
    const e = this.context_, i = this.contextFillState_;
    i ? i.fillStyle != t.fillStyle && (i.fillStyle = t.fillStyle, e.fillStyle = t.fillStyle) : (e.fillStyle = t.fillStyle, this.contextFillState_ = {
      fillStyle: t.fillStyle
    });
  }
  /**
   * @param {import("../canvas.js").StrokeState} strokeState Stroke state.
   * @private
   */
  setContextStrokeState_(t) {
    const e = this.context_, i = this.contextStrokeState_;
    i ? (i.lineCap != t.lineCap && (i.lineCap = t.lineCap, e.lineCap = t.lineCap), re(i.lineDash, t.lineDash) || e.setLineDash(
      i.lineDash = t.lineDash
    ), i.lineDashOffset != t.lineDashOffset && (i.lineDashOffset = t.lineDashOffset, e.lineDashOffset = t.lineDashOffset), i.lineJoin != t.lineJoin && (i.lineJoin = t.lineJoin, e.lineJoin = t.lineJoin), i.lineWidth != t.lineWidth && (i.lineWidth = t.lineWidth, e.lineWidth = t.lineWidth), i.miterLimit != t.miterLimit && (i.miterLimit = t.miterLimit, e.miterLimit = t.miterLimit), i.strokeStyle != t.strokeStyle && (i.strokeStyle = t.strokeStyle, e.strokeStyle = t.strokeStyle)) : (e.lineCap = t.lineCap, e.setLineDash(t.lineDash), e.lineDashOffset = t.lineDashOffset, e.lineJoin = t.lineJoin, e.lineWidth = t.lineWidth, e.miterLimit = t.miterLimit, e.strokeStyle = t.strokeStyle, this.contextStrokeState_ = {
      lineCap: t.lineCap,
      lineDash: t.lineDash,
      lineDashOffset: t.lineDashOffset,
      lineJoin: t.lineJoin,
      lineWidth: t.lineWidth,
      miterLimit: t.miterLimit,
      strokeStyle: t.strokeStyle
    });
  }
  /**
   * @param {import("../canvas.js").TextState} textState Text state.
   * @private
   */
  setContextTextState_(t) {
    const e = this.context_, i = this.contextTextState_, n = t.textAlign ? t.textAlign : di;
    i ? (i.font != t.font && (i.font = t.font, e.font = t.font), i.textAlign != n && (i.textAlign = n, e.textAlign = n), i.textBaseline != t.textBaseline && (i.textBaseline = t.textBaseline, e.textBaseline = t.textBaseline)) : (e.font = t.font, e.textAlign = n, e.textBaseline = t.textBaseline, this.contextTextState_ = {
      font: t.font,
      textAlign: n,
      textBaseline: t.textBaseline
    });
  }
  /**
   * Set the fill and stroke style for subsequent draw operations.  To clear
   * either fill or stroke styles, pass null for the appropriate parameter.
   *
   * @param {import("../../style/Fill.js").default} fillStyle Fill style.
   * @param {import("../../style/Stroke.js").default} strokeStyle Stroke style.
   */
  setFillStrokeStyle(t, e) {
    if (!t)
      this.fillState_ = null;
    else {
      const i = t.getColor();
      this.fillState_ = {
        fillStyle: Mt(
          i || Yt
        )
      };
    }
    if (!e)
      this.strokeState_ = null;
    else {
      const i = e.getColor(), n = e.getLineCap(), r = e.getLineDash(), o = e.getLineDashOffset(), a = e.getLineJoin(), l = e.getWidth(), h = e.getMiterLimit(), c = r || li;
      this.strokeState_ = {
        lineCap: n !== void 0 ? n : tn,
        lineDash: this.pixelRatio_ === 1 ? c : c.map((u) => u * this.pixelRatio_),
        lineDashOffset: (o || hi) * this.pixelRatio_,
        lineJoin: a !== void 0 ? a : Be,
        lineWidth: (l !== void 0 ? l : fi) * this.pixelRatio_,
        miterLimit: h !== void 0 ? h : ci,
        strokeStyle: Mt(
          i || ui
        )
      };
    }
  }
  /**
   * Set the image style for subsequent draw operations.  Pass null to remove
   * the image style.
   *
   * @param {import("../../style/Image.js").default} imageStyle Image style.
   */
  setImageStyle(t) {
    let e;
    if (!t || !(e = t.getSize())) {
      this.image_ = null;
      return;
    }
    const i = t.getPixelRatio(this.pixelRatio_), n = t.getAnchor(), r = t.getOrigin();
    this.image_ = t.getImage(this.pixelRatio_), this.imageAnchorX_ = n[0] * i, this.imageAnchorY_ = n[1] * i, this.imageHeight_ = e[1] * i, this.imageOpacity_ = t.getOpacity(), this.imageOriginX_ = r[0], this.imageOriginY_ = r[1], this.imageRotateWithView_ = t.getRotateWithView(), this.imageRotation_ = t.getRotation();
    const o = t.getScaleArray();
    this.imageScale_ = [
      o[0] * this.pixelRatio_ / i,
      o[1] * this.pixelRatio_ / i
    ], this.imageWidth_ = e[0] * i;
  }
  /**
   * Set the text style for subsequent draw operations.  Pass null to
   * remove the text style.
   *
   * @param {import("../../style/Text.js").default} textStyle Text style.
   */
  setTextStyle(t) {
    if (!t)
      this.text_ = "";
    else {
      const e = t.getFill();
      if (!e)
        this.textFillState_ = null;
      else {
        const f = e.getColor();
        this.textFillState_ = {
          fillStyle: Mt(
            f || Yt
          )
        };
      }
      const i = t.getStroke();
      if (!i)
        this.textStrokeState_ = null;
      else {
        const f = i.getColor(), g = i.getLineCap(), _ = i.getLineDash(), m = i.getLineDashOffset(), p = i.getLineJoin(), y = i.getWidth(), x = i.getMiterLimit();
        this.textStrokeState_ = {
          lineCap: g !== void 0 ? g : tn,
          lineDash: _ || li,
          lineDashOffset: m || hi,
          lineJoin: p !== void 0 ? p : Be,
          lineWidth: y !== void 0 ? y : fi,
          miterLimit: x !== void 0 ? x : ci,
          strokeStyle: Mt(
            f || ui
          )
        };
      }
      const n = t.getFont(), r = t.getOffsetX(), o = t.getOffsetY(), a = t.getRotateWithView(), l = t.getRotation(), h = t.getScaleArray(), c = t.getText(), u = t.getTextAlign(), d = t.getTextBaseline();
      this.textState_ = {
        font: n !== void 0 ? n : mo,
        textAlign: u !== void 0 ? u : di,
        textBaseline: d !== void 0 ? d : en
      }, this.text_ = c !== void 0 ? Array.isArray(c) ? c.reduce((f, g, _) => f += _ % 2 ? " " : g, "") : c : "", this.textOffsetX_ = r !== void 0 ? this.pixelRatio_ * r : 0, this.textOffsetY_ = o !== void 0 ? this.pixelRatio_ * o : 0, this.textRotateWithView_ = a !== void 0 ? a : !1, this.textRotation_ = l !== void 0 ? l : 0, this.textScale_ = [
        this.pixelRatio_ * h[0],
        this.pixelRatio_ * h[1]
      ];
    }
  }
}
const tu = Qc, Lt = 0.5;
function eu(s, t, e, i, n, r, o) {
  const a = s[0] * Lt, l = s[1] * Lt, h = lt(a, l);
  h.imageSmoothingEnabled = !1;
  const c = h.canvas, u = new tu(
    h,
    Lt,
    n,
    null,
    o
  ), d = e.length, f = Math.floor((256 * 256 * 256 - 1) / d), g = {};
  for (let m = 1; m <= d; ++m) {
    const p = e[m - 1], y = p.getStyleFunction() || i;
    if (!i)
      continue;
    let x = y(p, r);
    if (!x)
      continue;
    Array.isArray(x) || (x = [x]);
    const C = (m * f).toString(16).padStart(7, "#00000");
    for (let T = 0, v = x.length; T < v; ++T) {
      const S = x[T], L = S.getGeometryFunction()(p);
      if (!L || !at(n, L.getExtent()))
        continue;
      const O = S.clone(), X = O.getFill();
      X && X.setColor(C);
      const N = O.getStroke();
      N && (N.setColor(C), N.setLineDash(null)), O.setText(void 0);
      const D = S.getImage();
      if (D && D.getOpacity() !== 0) {
        const I = D.getImageSize();
        if (!I)
          continue;
        const b = lt(
          I[0],
          I[1],
          void 0,
          { alpha: !1 }
        ), K = b.canvas;
        b.fillStyle = C, b.fillRect(0, 0, K.width, K.height), O.setImage(
          new As({
            img: K,
            imgSize: I,
            anchor: D.getAnchor(),
            anchorXUnits: "pixels",
            anchorYUnits: "pixels",
            offset: D.getOrigin(),
            opacity: 1,
            size: D.getSize(),
            scale: D.getScale(),
            rotation: D.getRotation(),
            rotateWithView: D.getRotateWithView()
          })
        );
      }
      const q = O.getZIndex() || 0;
      let w = g[q];
      w || (w = {}, g[q] = w, w.Polygon = [], w.Circle = [], w.LineString = [], w.Point = []);
      const P = L.getType();
      if (P === "GeometryCollection") {
        const I = (
          /** @type {import("../../geom/GeometryCollection.js").default} */
          L.getGeometriesArrayRecursive()
        );
        for (let b = 0, K = I.length; b < K; ++b) {
          const B = I[b];
          w[B.getType().replace("Multi", "")].push(
            B,
            O
          );
        }
      } else
        w[P.replace("Multi", "")].push(L, O);
    }
  }
  const _ = Object.keys(g).map(Number).sort(We);
  for (let m = 0, p = _.length; m < p; ++m) {
    const y = g[_[m]];
    for (const x in y) {
      const E = y[x];
      for (let C = 0, T = E.length; C < T; C += 2) {
        u.setStyle(E[C + 1]);
        for (let v = 0, S = t.length; v < S; ++v)
          u.setTransform(t[v]), u.drawGeometry(E[C]);
      }
    }
  }
  return h.getImageData(0, 0, c.width, c.height);
}
function iu(s, t, e) {
  const i = [];
  if (e) {
    const n = Math.floor(Math.round(s[0]) * Lt), r = Math.floor(Math.round(s[1]) * Lt), o = ($(n, 0, e.width - 1) + $(r, 0, e.height - 1) * e.width) * 4, a = e.data[o], l = e.data[o + 1], c = e.data[o + 2] + 256 * (l + 256 * a), u = Math.floor((256 * 256 * 256 - 1) / t.length);
    c && c % u === 0 && i.push(t[c / u - 1]);
  }
  return i;
}
const nu = 0.5, No = {
  Point: du,
  LineString: hu,
  Polygon: gu,
  MultiPoint: fu,
  MultiLineString: cu,
  MultiPolygon: uu,
  GeometryCollection: lu,
  Circle: ou
};
function su(s, t) {
  return parseInt(z(s), 10) - parseInt(z(t), 10);
}
function ru(s, t) {
  const e = qn(s, t);
  return e * e;
}
function qn(s, t) {
  return nu * s / t;
}
function ou(s, t, e, i, n) {
  const r = e.getFill(), o = e.getStroke();
  if (r || o) {
    const l = s.getBuilder(e.getZIndex(), "Circle");
    l.setFillStrokeStyle(r, o), l.drawCircle(t, i);
  }
  const a = e.getText();
  if (a && a.getText()) {
    const l = (n || s).getBuilder(
      e.getZIndex(),
      "Text"
    );
    l.setTextStyle(a), l.drawText(t, i);
  }
}
function wr(s, t, e, i, n, r, o) {
  let a = !1;
  const l = e.getImage();
  if (l) {
    const h = l.getImageState();
    h == J.LOADED || h == J.ERROR ? l.unlistenImageChange(n) : (h == J.IDLE && l.load(), l.listenImageChange(n), a = !0);
  }
  return au(
    s,
    t,
    e,
    i,
    r,
    o
  ), a;
}
function au(s, t, e, i, n, r) {
  const o = e.getGeometryFunction()(t);
  if (!o)
    return;
  const a = o.simplifyTransformed(
    i,
    n
  );
  if (e.getRenderer())
    Go(s, a, e, t);
  else {
    const h = No[a.getType()];
    h(
      s,
      a,
      e,
      t,
      r
    );
  }
}
function Go(s, t, e, i) {
  if (t.getType() == "GeometryCollection") {
    const r = (
      /** @type {import("../geom/GeometryCollection.js").default} */
      t.getGeometries()
    );
    for (let o = 0, a = r.length; o < a; ++o)
      Go(s, r[o], e, i);
    return;
  }
  s.getBuilder(e.getZIndex(), "Default").drawCustom(
    /** @type {import("../geom/SimpleGeometry.js").default} */
    t,
    i,
    e.getRenderer(),
    e.getHitDetectionRenderer()
  );
}
function lu(s, t, e, i, n) {
  const r = t.getGeometriesArray();
  let o, a;
  for (o = 0, a = r.length; o < a; ++o) {
    const l = No[r[o].getType()];
    l(
      s,
      r[o],
      e,
      i,
      n
    );
  }
}
function hu(s, t, e, i, n) {
  const r = e.getStroke();
  if (r) {
    const a = s.getBuilder(
      e.getZIndex(),
      "LineString"
    );
    a.setFillStrokeStyle(null, r), a.drawLineString(t, i);
  }
  const o = e.getText();
  if (o && o.getText()) {
    const a = (n || s).getBuilder(
      e.getZIndex(),
      "Text"
    );
    a.setTextStyle(o), a.drawText(t, i);
  }
}
function cu(s, t, e, i, n) {
  const r = e.getStroke();
  if (r) {
    const a = s.getBuilder(
      e.getZIndex(),
      "LineString"
    );
    a.setFillStrokeStyle(null, r), a.drawMultiLineString(t, i);
  }
  const o = e.getText();
  if (o && o.getText()) {
    const a = (n || s).getBuilder(
      e.getZIndex(),
      "Text"
    );
    a.setTextStyle(o), a.drawText(t, i);
  }
}
function uu(s, t, e, i, n) {
  const r = e.getFill(), o = e.getStroke();
  if (o || r) {
    const l = s.getBuilder(e.getZIndex(), "Polygon");
    l.setFillStrokeStyle(r, o), l.drawMultiPolygon(t, i);
  }
  const a = e.getText();
  if (a && a.getText()) {
    const l = (n || s).getBuilder(
      e.getZIndex(),
      "Text"
    );
    l.setTextStyle(a), l.drawText(t, i);
  }
}
function du(s, t, e, i, n) {
  const r = e.getImage(), o = e.getText();
  let a;
  if (r) {
    if (r.getImageState() != J.LOADED)
      return;
    let l = s;
    if (n) {
      const c = r.getDeclutterMode();
      if (c !== "none")
        if (l = n, c === "obstacle") {
          const u = s.getBuilder(
            e.getZIndex(),
            "Image"
          );
          u.setImageStyle(r, a), u.drawPoint(t, i);
        } else
          o && o.getText() && (a = {});
    }
    const h = l.getBuilder(
      e.getZIndex(),
      "Image"
    );
    h.setImageStyle(r, a), h.drawPoint(t, i);
  }
  if (o && o.getText()) {
    let l = s;
    n && (l = n);
    const h = l.getBuilder(e.getZIndex(), "Text");
    h.setTextStyle(o, a), h.drawText(t, i);
  }
}
function fu(s, t, e, i, n) {
  const r = e.getImage(), o = e.getText();
  let a;
  if (r) {
    if (r.getImageState() != J.LOADED)
      return;
    let l = s;
    if (n) {
      const c = r.getDeclutterMode();
      if (c !== "none")
        if (l = n, c === "obstacle") {
          const u = s.getBuilder(
            e.getZIndex(),
            "Image"
          );
          u.setImageStyle(r, a), u.drawMultiPoint(t, i);
        } else
          o && o.getText() && (a = {});
    }
    const h = l.getBuilder(
      e.getZIndex(),
      "Image"
    );
    h.setImageStyle(r, a), h.drawMultiPoint(t, i);
  }
  if (o && o.getText()) {
    let l = s;
    n && (l = n);
    const h = l.getBuilder(e.getZIndex(), "Text");
    h.setTextStyle(o, a), h.drawText(t, i);
  }
}
function gu(s, t, e, i, n) {
  const r = e.getFill(), o = e.getStroke();
  if (r || o) {
    const l = s.getBuilder(e.getZIndex(), "Polygon");
    l.setFillStrokeStyle(r, o), l.drawPolygon(t, i);
  }
  const a = e.getText();
  if (a && a.getText()) {
    const l = (n || s).getBuilder(
      e.getZIndex(),
      "Text"
    );
    l.setTextStyle(a), l.drawText(t, i);
  }
}
class _u extends Io {
  /**
   * @param {import("../../layer/BaseVector.js").default} vectorLayer Vector layer.
   */
  constructor(t) {
    super(t), this.boundHandleStyleImageChange_ = this.handleStyleImageChange_.bind(this), this.animatingOrInteracting_, this.hitDetectionImageData_ = null, this.renderedFeatures_ = null, this.renderedRevision_ = -1, this.renderedResolution_ = NaN, this.renderedExtent_ = Tt(), this.wrappedRenderedExtent_ = Tt(), this.renderedRotation_, this.renderedCenter_ = null, this.renderedProjection_ = null, this.renderedRenderOrder_ = null, this.replayGroup_ = null, this.replayGroupChanged = !0, this.declutterExecutorGroup = null, this.clipping = !0, this.compositionContext_ = null, this.opacity_ = 1;
  }
  /**
   * @param {ExecutorGroup} executorGroup Executor group.
   * @param {import("../../Map.js").FrameState} frameState Frame state.
   * @param {import("rbush").default} [declutterTree] Declutter tree.
   */
  renderWorlds(t, e, i) {
    const n = e.extent, r = e.viewState, o = r.center, a = r.resolution, l = r.projection, h = r.rotation, c = l.getExtent(), u = this.getLayer().getSource(), d = e.pixelRatio, f = e.viewHints, g = !(f[rt.ANIMATING] || f[rt.INTERACTING]), _ = this.compositionContext_, m = Math.round(e.size[0] * d), p = Math.round(e.size[1] * d), y = u.getWrapX() && l.canWrapX(), x = y ? V(c) : null, E = y ? Math.ceil((n[2] - c[2]) / x) + 1 : 1;
    let C = y ? Math.floor((n[0] - c[0]) / x) : 0;
    do {
      const T = this.getRenderTransform(
        o,
        a,
        h,
        d,
        m,
        p,
        C * x
      );
      t.execute(
        _,
        1,
        T,
        h,
        g,
        void 0,
        i
      );
    } while (++C < E);
  }
  setupCompositionContext_() {
    if (this.opacity_ !== 1) {
      const t = lt(
        this.context.canvas.width,
        this.context.canvas.height,
        fr
      );
      this.compositionContext_ = t;
    } else
      this.compositionContext_ = this.context;
  }
  releaseCompositionContext_() {
    if (this.opacity_ !== 1) {
      const t = this.context.globalAlpha;
      this.context.globalAlpha = this.opacity_, this.context.drawImage(this.compositionContext_.canvas, 0, 0), this.context.globalAlpha = t, mn(this.compositionContext_), fr.push(this.compositionContext_.canvas), this.compositionContext_ = null;
    }
  }
  /**
   * Render declutter items for this layer
   * @param {import("../../Map.js").FrameState} frameState Frame state.
   */
  renderDeclutter(t) {
    this.declutterExecutorGroup && (this.setupCompositionContext_(), this.renderWorlds(
      this.declutterExecutorGroup,
      t,
      t.declutterTree
    ), this.releaseCompositionContext_());
  }
  /**
   * Render the layer.
   * @param {import("../../Map.js").FrameState} frameState Frame state.
   * @param {HTMLElement} target Target that may be used to render content to.
   * @return {HTMLElement} The rendered element.
   */
  renderFrame(t, e) {
    const i = t.pixelRatio, n = t.layerStatesArray[t.layerIndex];
    fa(this.pixelTransform, 1 / i, 1 / i), es(this.inversePixelTransform, this.pixelTransform);
    const r = Gr(this.pixelTransform);
    this.useContainer(e, r, this.getBackground(t));
    const o = this.context, a = o.canvas, l = this.replayGroup_, h = this.declutterExecutorGroup;
    if ((!l || l.isEmpty()) && (!h || h.isEmpty()))
      return null;
    const c = Math.round(t.size[0] * i), u = Math.round(t.size[1] * i);
    a.width != c || a.height != u ? (a.width = c, a.height = u, a.style.transform !== r && (a.style.transform = r)) : this.containerReused || o.clearRect(0, 0, c, u), this.preRender(o, t);
    const d = t.viewState;
    d.projection, this.opacity_ = n.opacity, this.setupCompositionContext_();
    let f = !1, g = !0;
    if (n.extent && this.clipping) {
      const _ = ue(n.extent);
      g = at(_, t.extent), f = g && !ce(_, t.extent), f && this.clipUnrotated(this.compositionContext_, t, _);
    }
    return g && this.renderWorlds(l, t), f && this.compositionContext_.restore(), this.releaseCompositionContext_(), this.postRender(o, t), this.renderedRotation_ !== d.rotation && (this.renderedRotation_ = d.rotation, this.hitDetectionImageData_ = null), this.container;
  }
  /**
   * Asynchronous layer level hit detection.
   * @param {import("../../pixel.js").Pixel} pixel Pixel.
   * @return {Promise<Array<import("../../Feature").default>>} Promise
   * that resolves with an array of features.
   */
  getFeatures(t) {
    return new Promise((e) => {
      if (!this.hitDetectionImageData_ && !this.animatingOrInteracting_) {
        const i = [this.context.canvas.width, this.context.canvas.height];
        et(this.pixelTransform, i);
        const n = this.renderedCenter_, r = this.renderedResolution_, o = this.renderedRotation_, a = this.renderedProjection_, l = this.wrappedRenderedExtent_, h = this.getLayer(), c = [], u = i[0] * Lt, d = i[1] * Lt;
        c.push(
          this.getRenderTransform(
            n,
            r,
            o,
            Lt,
            u,
            d,
            0
          ).slice()
        );
        const f = h.getSource(), g = a.getExtent();
        if (f.getWrapX() && a.canWrapX() && !ce(g, l)) {
          let _ = l[0];
          const m = V(g);
          let p = 0, y;
          for (; _ < g[0]; )
            --p, y = m * p, c.push(
              this.getRenderTransform(
                n,
                r,
                o,
                Lt,
                u,
                d,
                y
              ).slice()
            ), _ += m;
          for (p = 0, _ = l[2]; _ > g[2]; )
            ++p, y = m * p, c.push(
              this.getRenderTransform(
                n,
                r,
                o,
                Lt,
                u,
                d,
                y
              ).slice()
            ), _ -= m;
        }
        this.hitDetectionImageData_ = eu(
          i,
          c,
          this.renderedFeatures_,
          h.getStyleFunction(),
          l,
          r,
          o
        );
      }
      e(
        iu(t, this.renderedFeatures_, this.hitDetectionImageData_)
      );
    });
  }
  /**
   * @param {import("../../coordinate.js").Coordinate} coordinate Coordinate.
   * @param {import("../../Map.js").FrameState} frameState Frame state.
   * @param {number} hitTolerance Hit tolerance in pixels.
   * @param {import("../vector.js").FeatureCallback<T>} callback Feature callback.
   * @param {Array<import("../Map.js").HitMatch<T>>} matches The hit detected matches with tolerance.
   * @return {T|undefined} Callback result.
   * @template T
   */
  forEachFeatureAtCoordinate(t, e, i, n, r) {
    if (!this.replayGroup_)
      return;
    const o = e.viewState.resolution, a = e.viewState.rotation, l = this.getLayer(), h = {}, c = function(f, g, _) {
      const m = z(f), p = h[m];
      if (p) {
        if (p !== !0 && _ < p.distanceSq) {
          if (_ === 0)
            return h[m] = !0, r.splice(r.lastIndexOf(p), 1), n(f, l, g);
          p.geometry = g, p.distanceSq = _;
        }
      } else {
        if (_ === 0)
          return h[m] = !0, n(f, l, g);
        r.push(
          h[m] = {
            feature: f,
            layer: l,
            geometry: g,
            distanceSq: _,
            callback: n
          }
        );
      }
    };
    let u;
    const d = [this.replayGroup_];
    return this.declutterExecutorGroup && d.push(this.declutterExecutorGroup), d.some((f) => u = f.forEachFeatureAtCoordinate(
      t,
      o,
      a,
      i,
      c,
      f === this.declutterExecutorGroup && e.declutterTree ? e.declutterTree.all().map((g) => g.value) : null
    )), u;
  }
  /**
   * Perform action necessary to get the layer rendered after new fonts have loaded
   */
  handleFontsChanged() {
    const t = this.getLayer();
    t.getVisible() && this.replayGroup_ && t.changed();
  }
  /**
   * Handle changes in image style state.
   * @param {import("../../events/Event.js").default} event Image style change event.
   * @private
   */
  handleStyleImageChange_(t) {
    this.renderIfReadyAndVisible();
  }
  /**
   * Determine whether render should be called.
   * @param {import("../../Map.js").FrameState} frameState Frame state.
   * @return {boolean} Layer is ready to be rendered.
   */
  prepareFrame(t) {
    const e = this.getLayer(), i = e.getSource();
    if (!i)
      return !1;
    const n = t.viewHints[rt.ANIMATING], r = t.viewHints[rt.INTERACTING], o = e.getUpdateWhileAnimating(), a = e.getUpdateWhileInteracting();
    if (this.ready && !o && n || !a && r)
      return this.animatingOrInteracting_ = !0, !0;
    this.animatingOrInteracting_ = !1;
    const l = t.extent, h = t.viewState, c = h.projection, u = h.resolution, d = t.pixelRatio, f = e.getRevision(), g = e.getRenderBuffer();
    let _ = e.getRenderOrder();
    _ === void 0 && (_ = su);
    const m = h.center.slice(), p = is(
      l,
      g * u
    ), y = p.slice(), x = [p.slice()], E = c.getExtent();
    if (i.getWrapX() && c.canWrapX() && !ce(E, t.extent)) {
      const w = V(E), P = Math.max(V(p) / 2, w);
      p[0] = E[0] - P, p[2] = E[2] + P, Hr(m, c);
      const I = Zr(x[0], c);
      I[0] < E[0] && I[2] < E[2] ? x.push([
        I[0] + w,
        I[1],
        I[2] + w,
        I[3]
      ]) : I[0] > E[0] && I[2] > E[2] && x.push([
        I[0] - w,
        I[1],
        I[2] - w,
        I[3]
      ]);
    }
    if (this.ready && this.renderedResolution_ == u && this.renderedRevision_ == f && this.renderedRenderOrder_ == _ && ce(this.wrappedRenderedExtent_, p))
      return re(this.renderedExtent_, y) || (this.hitDetectionImageData_ = null, this.renderedExtent_ = y), this.renderedCenter_ = m, this.replayGroupChanged = !1, !0;
    this.replayGroup_ = null;
    const C = new Tr(
      qn(u, d),
      p,
      u,
      d
    );
    let T;
    this.getLayer().getDeclutter() && (T = new Tr(
      qn(u, d),
      p,
      u,
      d
    ));
    let v;
    for (let w = 0, P = x.length; w < P; ++w)
      i.loadFeatures(x[w], u, c);
    const S = ru(u, d);
    let L = !0;
    const O = (
      /**
       * @param {import("../../Feature.js").default} feature Feature.
       */
      (w) => {
        let P;
        const I = w.getStyleFunction() || e.getStyleFunction();
        if (I && (P = I(w, u)), P) {
          const b = this.renderFeature(
            w,
            S,
            P,
            C,
            v,
            T
          );
          L = L && !b;
        }
      }
    ), X = to(p), N = i.getFeaturesInExtent(X);
    _ && N.sort(_);
    for (let w = 0, P = N.length; w < P; ++w)
      O(N[w]);
    this.renderedFeatures_ = N, this.ready = L;
    const D = C.finish(), q = new vr(
      p,
      u,
      d,
      i.getOverlaps(),
      D,
      e.getRenderBuffer()
    );
    return T && (this.declutterExecutorGroup = new vr(
      p,
      u,
      d,
      i.getOverlaps(),
      T.finish(),
      e.getRenderBuffer()
    )), this.renderedResolution_ = u, this.renderedRevision_ = f, this.renderedRenderOrder_ = _, this.renderedExtent_ = y, this.wrappedRenderedExtent_ = p, this.renderedCenter_ = m, this.renderedProjection_ = c, this.replayGroup_ = q, this.hitDetectionImageData_ = null, this.replayGroupChanged = !0, !0;
  }
  /**
   * @param {import("../../Feature.js").default} feature Feature.
   * @param {number} squaredTolerance Squared render tolerance.
   * @param {import("../../style/Style.js").default|Array<import("../../style/Style.js").default>} styles The style or array of styles.
   * @param {import("../../render/canvas/BuilderGroup.js").default} builderGroup Builder group.
   * @param {import("../../proj.js").TransformFunction} [transform] Transform from user to view projection.
   * @param {import("../../render/canvas/BuilderGroup.js").default} [declutterBuilderGroup] Builder for decluttering.
   * @return {boolean} `true` if an image is loading.
   */
  renderFeature(t, e, i, n, r, o) {
    if (!i)
      return !1;
    let a = !1;
    if (Array.isArray(i))
      for (let l = 0, h = i.length; l < h; ++l)
        a = wr(
          n,
          t,
          i[l],
          e,
          this.boundHandleStyleImageChange_,
          r,
          o
        ) || a;
    else
      a = wr(
        n,
        t,
        i,
        e,
        this.boundHandleStyleImageChange_,
        r,
        o
      );
    return a;
  }
}
const mu = _u;
class pu extends Oc {
  /**
   * @param {import("./BaseVector.js").Options<VectorSourceType>} [options] Options.
   */
  constructor(t) {
    super(t);
  }
  createRenderer() {
    return new mu(this);
  }
}
const yu = pu;
class xu {
  /**
   * @param {number} [maxEntries] Max entries.
   */
  constructor(t) {
    this.rbush_ = new Po(t), this.items_ = {};
  }
  /**
   * Insert a value into the RBush.
   * @param {import("../extent.js").Extent} extent Extent.
   * @param {T} value Value.
   */
  insert(t, e) {
    const i = {
      minX: t[0],
      minY: t[1],
      maxX: t[2],
      maxY: t[3],
      value: e
    };
    this.rbush_.insert(i), this.items_[z(e)] = i;
  }
  /**
   * Bulk-insert values into the RBush.
   * @param {Array<import("../extent.js").Extent>} extents Extents.
   * @param {Array<T>} values Values.
   */
  load(t, e) {
    const i = new Array(e.length);
    for (let n = 0, r = e.length; n < r; n++) {
      const o = t[n], a = e[n], l = {
        minX: o[0],
        minY: o[1],
        maxX: o[2],
        maxY: o[3],
        value: a
      };
      i[n] = l, this.items_[z(a)] = l;
    }
    this.rbush_.load(i);
  }
  /**
   * Remove a value from the RBush.
   * @param {T} value Value.
   * @return {boolean} Removed.
   */
  remove(t) {
    const e = z(t), i = this.items_[e];
    return delete this.items_[e], this.rbush_.remove(i) !== null;
  }
  /**
   * Update the extent of a value in the RBush.
   * @param {import("../extent.js").Extent} extent Extent.
   * @param {T} value Value.
   */
  update(t, e) {
    const i = this.items_[z(e)], n = [i.minX, i.minY, i.maxX, i.maxY];
    ri(n, t) || (this.remove(e), this.insert(t, e));
  }
  /**
   * Return all values in the RBush.
   * @return {Array<T>} All.
   */
  getAll() {
    return this.rbush_.all().map(function(e) {
      return e.value;
    });
  }
  /**
   * Return all values in the given extent.
   * @param {import("../extent.js").Extent} extent Extent.
   * @return {Array<T>} All in extent.
   */
  getInExtent(t) {
    const e = {
      minX: t[0],
      minY: t[1],
      maxX: t[2],
      maxY: t[3]
    };
    return this.rbush_.search(e).map(function(n) {
      return n.value;
    });
  }
  /**
   * Calls a callback function with each value in the tree.
   * If the callback returns a truthy value, this value is returned without
   * checking the rest of the tree.
   * @param {function(T): *} callback Callback.
   * @return {*} Callback return value.
   */
  forEach(t) {
    return this.forEach_(this.getAll(), t);
  }
  /**
   * Calls a callback function with each value in the provided extent.
   * @param {import("../extent.js").Extent} extent Extent.
   * @param {function(T): *} callback Callback.
   * @return {*} Callback return value.
   */
  forEachInExtent(t, e) {
    return this.forEach_(this.getInExtent(t), e);
  }
  /**
   * @param {Array<T>} values Values.
   * @param {function(T): *} callback Callback.
   * @private
   * @return {*} Callback return value.
   */
  forEach_(t, e) {
    let i;
    for (let n = 0, r = t.length; n < r; n++)
      if (i = e(t[n]), i)
        return i;
    return i;
  }
  /**
   * @return {boolean} Is empty.
   */
  isEmpty() {
    return si(this.items_);
  }
  /**
   * Remove all values from the RBush.
   */
  clear() {
    this.rbush_.clear(), this.items_ = {};
  }
  /**
   * @param {import("../extent.js").Extent} [extent] Extent.
   * @return {import("../extent.js").Extent} Extent.
   */
  getExtent(t) {
    const e = this.rbush_.toJSON();
    return Bt(e.minX, e.minY, e.maxX, e.maxY, t);
  }
  /**
   * @param {RBush} rbush R-Tree.
   */
  concat(t) {
    this.rbush_.load(t.rbush_.all());
    for (const e in t.items_)
      this.items_[e] = t.items_[e];
  }
}
const Lr = xu;
class Eu extends St {
  /**
   * @param {Options} options Source options.
   */
  constructor(t) {
    super(), this.projection = It(t.projection), this.attributions_ = Ar(t.attributions), this.attributionsCollapsible_ = t.attributionsCollapsible !== void 0 ? t.attributionsCollapsible : !0, this.loading = !1, this.state_ = t.state !== void 0 ? t.state : "ready", this.wrapX_ = t.wrapX !== void 0 ? t.wrapX : !1, this.interpolate_ = !!t.interpolate, this.viewResolver = null, this.viewRejector = null;
    const e = this;
    this.viewPromise_ = new Promise(function(i, n) {
      e.viewResolver = i, e.viewRejector = n;
    });
  }
  /**
   * Get the attribution function for the source.
   * @return {?Attribution} Attribution function.
   * @api
   */
  getAttributions() {
    return this.attributions_;
  }
  /**
   * @return {boolean} Attributions are collapsible.
   * @api
   */
  getAttributionsCollapsible() {
    return this.attributionsCollapsible_;
  }
  /**
   * Get the projection of the source.
   * @return {import("../proj/Projection.js").default|null} Projection.
   * @api
   */
  getProjection() {
    return this.projection;
  }
  /**
   * @param {import("../proj/Projection").default} [projection] Projection.
   * @return {Array<number>|null} Resolutions.
   */
  getResolutions(t) {
    return null;
  }
  /**
   * @return {Promise<import("../View.js").ViewOptions>} A promise for view-related properties.
   */
  getView() {
    return this.viewPromise_;
  }
  /**
   * Get the state of the source, see {@link import("./Source.js").State} for possible states.
   * @return {import("./Source.js").State} State.
   * @api
   */
  getState() {
    return this.state_;
  }
  /**
   * @return {boolean|undefined} Wrap X.
   */
  getWrapX() {
    return this.wrapX_;
  }
  /**
   * @return {boolean} Use linear interpolation when resampling.
   */
  getInterpolate() {
    return this.interpolate_;
  }
  /**
   * Refreshes the source. The source will be cleared, and data from the server will be reloaded.
   * @api
   */
  refresh() {
    this.changed();
  }
  /**
   * Set the attributions of the source.
   * @param {AttributionLike|undefined} attributions Attributions.
   *     Can be passed as `string`, `Array<string>`, {@link module:ol/source/Source~Attribution},
   *     or `undefined`.
   * @api
   */
  setAttributions(t) {
    this.attributions_ = Ar(t), this.changed();
  }
  /**
   * Set the state of the source.
   * @param {import("./Source.js").State} state State.
   */
  setState(t) {
    this.state_ = t, this.changed();
  }
}
function Ar(s) {
  return s ? Array.isArray(s) ? function(t) {
    return s;
  } : typeof s == "function" ? s : function(t) {
    return [s];
  } : null;
}
const Xo = Eu, Ct = {
  /**
   * Triggered when a feature is added to the source.
   * @event module:ol/source/Vector.VectorSourceEvent#addfeature
   * @api
   */
  ADDFEATURE: "addfeature",
  /**
   * Triggered when a feature is updated.
   * @event module:ol/source/Vector.VectorSourceEvent#changefeature
   * @api
   */
  CHANGEFEATURE: "changefeature",
  /**
   * Triggered when the clear method is called on the source.
   * @event module:ol/source/Vector.VectorSourceEvent#clear
   * @api
   */
  CLEAR: "clear",
  /**
   * Triggered when a feature is removed from the source.
   * See {@link module:ol/source/Vector~VectorSource#clear source.clear()} for exceptions.
   * @event module:ol/source/Vector.VectorSourceEvent#removefeature
   * @api
   */
  REMOVEFEATURE: "removefeature",
  /**
   * Triggered when features starts loading.
   * @event module:ol/source/Vector.VectorSourceEvent#featuresloadstart
   * @api
   */
  FEATURESLOADSTART: "featuresloadstart",
  /**
   * Triggered when features finishes loading.
   * @event module:ol/source/Vector.VectorSourceEvent#featuresloadend
   * @api
   */
  FEATURESLOADEND: "featuresloadend",
  /**
   * Triggered if feature loading results in an error.
   * @event module:ol/source/Vector.VectorSourceEvent#featuresloaderror
   * @api
   */
  FEATURESLOADERROR: "featuresloaderror"
};
function Cu(s, t) {
  return [[-1 / 0, -1 / 0, 1 / 0, 1 / 0]];
}
let Ru = !1;
function Tu(s, t, e, i, n, r, o) {
  const a = new XMLHttpRequest();
  a.open(
    "GET",
    typeof s == "function" ? s(e, i, n) : s,
    !0
  ), t.getType() == "arraybuffer" && (a.responseType = "arraybuffer"), a.withCredentials = Ru, a.onload = function(l) {
    if (!a.status || a.status >= 200 && a.status < 300) {
      const h = t.getType();
      let c;
      h == "json" || h == "text" ? c = a.responseText : h == "xml" ? (c = a.responseXML, c || (c = new DOMParser().parseFromString(
        a.responseText,
        "application/xml"
      ))) : h == "arraybuffer" && (c = /** @type {ArrayBuffer} */
      a.response), c ? r(
        /** @type {Array<import("./Feature.js").default>} */
        t.readFeatures(c, {
          extent: e,
          featureProjection: n
        }),
        t.readProjection(c)
      ) : o();
    } else
      o();
  }, a.onerror = o, a.send();
}
function Mr(s, t) {
  return function(e, i, n, r, o) {
    const a = (
      /** @type {import("./source/Vector").default} */
      this
    );
    Tu(
      s,
      t,
      e,
      i,
      n,
      /**
       * @param {Array<import("./Feature.js").default>} features The loaded features.
       * @param {import("./proj/Projection.js").default} dataProjection Data
       * projection.
       */
      function(l, h) {
        a.addFeatures(l), r !== void 0 && r(l);
      },
      /* FIXME handle error */
      o || ze
    );
  };
}
class qt extends Zt {
  /**
   * @param {string} type Type.
   * @param {import("../Feature.js").default<Geometry>} [feature] Feature.
   * @param {Array<import("../Feature.js").default<Geometry>>} [features] Features.
   */
  constructor(t, e, i) {
    super(t), this.feature = e, this.features = i;
  }
}
class Iu extends Xo {
  /**
   * @param {Options<Geometry>} [options] Vector source options.
   */
  constructor(t) {
    t = t || {}, super({
      attributions: t.attributions,
      interpolate: !0,
      projection: void 0,
      state: "ready",
      wrapX: t.wrapX !== void 0 ? t.wrapX : !0
    }), this.on, this.once, this.un, this.loader_ = ze, this.format_ = t.format, this.overlaps_ = t.overlaps === void 0 ? !0 : t.overlaps, this.url_ = t.url, t.loader !== void 0 ? this.loader_ = t.loader : this.url_ !== void 0 && (k(this.format_, 7), this.loader_ = Mr(
      this.url_,
      /** @type {import("../format/Feature.js").default} */
      this.format_
    )), this.strategy_ = t.strategy !== void 0 ? t.strategy : Cu;
    const e = t.useSpatialIndex !== void 0 ? t.useSpatialIndex : !0;
    this.featuresRtree_ = e ? new Lr() : null, this.loadedExtentsRtree_ = new Lr(), this.loadingExtentsCount_ = 0, this.nullGeometryFeatures_ = {}, this.idIndex_ = {}, this.uidIndex_ = {}, this.featureChangeKeys_ = {}, this.featuresCollection_ = null;
    let i, n;
    Array.isArray(t.features) ? n = t.features : t.features && (i = t.features, n = i.getArray()), !e && i === void 0 && (i = new At(n)), n !== void 0 && this.addFeaturesInternal(n), i !== void 0 && this.bindFeaturesCollection_(i);
  }
  /**
   * Add a single feature to the source.  If you want to add a batch of features
   * at once, call {@link module:ol/source/Vector~VectorSource#addFeatures #addFeatures()}
   * instead. A feature will not be added to the source if feature with
   * the same id is already there. The reason for this behavior is to avoid
   * feature duplication when using bbox or tile loading strategies.
   * Note: this also applies if an {@link module:ol/Collection~Collection} is used for features,
   * meaning that if a feature with a duplicate id is added in the collection, it will
   * be removed from it right away.
   * @param {import("../Feature.js").default<Geometry>} feature Feature to add.
   * @api
   */
  addFeature(t) {
    this.addFeatureInternal(t), this.changed();
  }
  /**
   * Add a feature without firing a `change` event.
   * @param {import("../Feature.js").default<Geometry>} feature Feature.
   * @protected
   */
  addFeatureInternal(t) {
    const e = z(t);
    if (!this.addToIndex_(e, t)) {
      this.featuresCollection_ && this.featuresCollection_.remove(t);
      return;
    }
    this.setupChangeEvents_(e, t);
    const i = t.getGeometry();
    if (i) {
      const n = i.getExtent();
      this.featuresRtree_ && this.featuresRtree_.insert(n, t);
    } else
      this.nullGeometryFeatures_[e] = t;
    this.dispatchEvent(
      new qt(Ct.ADDFEATURE, t)
    );
  }
  /**
   * @param {string} featureKey Unique identifier for the feature.
   * @param {import("../Feature.js").default<Geometry>} feature The feature.
   * @private
   */
  setupChangeEvents_(t, e) {
    this.featureChangeKeys_[t] = [
      G(e, F.CHANGE, this.handleFeatureChange_, this),
      G(
        e,
        Xe.PROPERTYCHANGE,
        this.handleFeatureChange_,
        this
      )
    ];
  }
  /**
   * @param {string} featureKey Unique identifier for the feature.
   * @param {import("../Feature.js").default<Geometry>} feature The feature.
   * @return {boolean} The feature is "valid", in the sense that it is also a
   *     candidate for insertion into the Rtree.
   * @private
   */
  addToIndex_(t, e) {
    let i = !0;
    const n = e.getId();
    return n !== void 0 && (n.toString() in this.idIndex_ ? i = !1 : this.idIndex_[n.toString()] = e), i && (k(!(t in this.uidIndex_), 30), this.uidIndex_[t] = e), i;
  }
  /**
   * Add a batch of features to the source.
   * @param {Array<import("../Feature.js").default<Geometry>>} features Features to add.
   * @api
   */
  addFeatures(t) {
    this.addFeaturesInternal(t), this.changed();
  }
  /**
   * Add features without firing a `change` event.
   * @param {Array<import("../Feature.js").default<Geometry>>} features Features.
   * @protected
   */
  addFeaturesInternal(t) {
    const e = [], i = [], n = [];
    for (let r = 0, o = t.length; r < o; r++) {
      const a = t[r], l = z(a);
      this.addToIndex_(l, a) && i.push(a);
    }
    for (let r = 0, o = i.length; r < o; r++) {
      const a = i[r], l = z(a);
      this.setupChangeEvents_(l, a);
      const h = a.getGeometry();
      if (h) {
        const c = h.getExtent();
        e.push(c), n.push(a);
      } else
        this.nullGeometryFeatures_[l] = a;
    }
    if (this.featuresRtree_ && this.featuresRtree_.load(e, n), this.hasListener(Ct.ADDFEATURE))
      for (let r = 0, o = i.length; r < o; r++)
        this.dispatchEvent(
          new qt(Ct.ADDFEATURE, i[r])
        );
  }
  /**
   * @param {!Collection<import("../Feature.js").default<Geometry>>} collection Collection.
   * @private
   */
  bindFeaturesCollection_(t) {
    let e = !1;
    this.addEventListener(
      Ct.ADDFEATURE,
      /**
       * @param {VectorSourceEvent<Geometry>} evt The vector source event
       */
      function(i) {
        e || (e = !0, t.push(i.feature), e = !1);
      }
    ), this.addEventListener(
      Ct.REMOVEFEATURE,
      /**
       * @param {VectorSourceEvent<Geometry>} evt The vector source event
       */
      function(i) {
        e || (e = !0, t.remove(i.feature), e = !1);
      }
    ), t.addEventListener(
      ut.ADD,
      /**
       * @param {import("../Collection.js").CollectionEvent<import("../Feature.js").default<Geometry>>} evt The collection event
       */
      (i) => {
        e || (e = !0, this.addFeature(i.element), e = !1);
      }
    ), t.addEventListener(
      ut.REMOVE,
      /**
       * @param {import("../Collection.js").CollectionEvent<import("../Feature.js").default<Geometry>>} evt The collection event
       */
      (i) => {
        e || (e = !0, this.removeFeature(i.element), e = !1);
      }
    ), this.featuresCollection_ = t;
  }
  /**
   * Remove all features from the source.
   * @param {boolean} [fast] Skip dispatching of {@link module:ol/source/Vector.VectorSourceEvent#event:removefeature} events.
   * @api
   */
  clear(t) {
    if (t) {
      for (const i in this.featureChangeKeys_)
        this.featureChangeKeys_[i].forEach(j);
      this.featuresCollection_ || (this.featureChangeKeys_ = {}, this.idIndex_ = {}, this.uidIndex_ = {});
    } else if (this.featuresRtree_) {
      const i = (n) => {
        this.removeFeatureInternal(n);
      };
      this.featuresRtree_.forEach(i);
      for (const n in this.nullGeometryFeatures_)
        this.removeFeatureInternal(this.nullGeometryFeatures_[n]);
    }
    this.featuresCollection_ && this.featuresCollection_.clear(), this.featuresRtree_ && this.featuresRtree_.clear(), this.nullGeometryFeatures_ = {};
    const e = new qt(Ct.CLEAR);
    this.dispatchEvent(e), this.changed();
  }
  /**
   * Iterate through all features on the source, calling the provided callback
   * with each one.  If the callback returns any "truthy" value, iteration will
   * stop and the function will return the same value.
   * Note: this function only iterate through the feature that have a defined geometry.
   *
   * @param {function(import("../Feature.js").default<Geometry>): T} callback Called with each feature
   *     on the source.  Return a truthy value to stop iteration.
   * @return {T|undefined} The return value from the last call to the callback.
   * @template T
   * @api
   */
  forEachFeature(t) {
    if (this.featuresRtree_)
      return this.featuresRtree_.forEach(t);
    this.featuresCollection_ && this.featuresCollection_.forEach(t);
  }
  /**
   * Iterate through all features whose geometries contain the provided
   * coordinate, calling the callback with each feature.  If the callback returns
   * a "truthy" value, iteration will stop and the function will return the same
   * value.
   *
   * @param {import("../coordinate.js").Coordinate} coordinate Coordinate.
   * @param {function(import("../Feature.js").default<Geometry>): T} callback Called with each feature
   *     whose goemetry contains the provided coordinate.
   * @return {T|undefined} The return value from the last call to the callback.
   * @template T
   */
  forEachFeatureAtCoordinateDirect(t, e) {
    const i = [t[0], t[1], t[0], t[1]];
    return this.forEachFeatureInExtent(i, function(n) {
      if (n.getGeometry().intersectsCoordinate(t))
        return e(n);
    });
  }
  /**
   * Iterate through all features whose bounding box intersects the provided
   * extent (note that the feature's geometry may not intersect the extent),
   * calling the callback with each feature.  If the callback returns a "truthy"
   * value, iteration will stop and the function will return the same value.
   *
   * If you are interested in features whose geometry intersects an extent, call
   * the {@link module:ol/source/Vector~VectorSource#forEachFeatureIntersectingExtent #forEachFeatureIntersectingExtent()} method instead.
   *
   * When `useSpatialIndex` is set to false, this method will loop through all
   * features, equivalent to {@link module:ol/source/Vector~VectorSource#forEachFeature #forEachFeature()}.
   *
   * @param {import("../extent.js").Extent} extent Extent.
   * @param {function(import("../Feature.js").default<Geometry>): T} callback Called with each feature
   *     whose bounding box intersects the provided extent.
   * @return {T|undefined} The return value from the last call to the callback.
   * @template T
   * @api
   */
  forEachFeatureInExtent(t, e) {
    if (this.featuresRtree_)
      return this.featuresRtree_.forEachInExtent(t, e);
    this.featuresCollection_ && this.featuresCollection_.forEach(e);
  }
  /**
   * Iterate through all features whose geometry intersects the provided extent,
   * calling the callback with each feature.  If the callback returns a "truthy"
   * value, iteration will stop and the function will return the same value.
   *
   * If you only want to test for bounding box intersection, call the
   * {@link module:ol/source/Vector~VectorSource#forEachFeatureInExtent #forEachFeatureInExtent()} method instead.
   *
   * @param {import("../extent.js").Extent} extent Extent.
   * @param {function(import("../Feature.js").default<Geometry>): T} callback Called with each feature
   *     whose geometry intersects the provided extent.
   * @return {T|undefined} The return value from the last call to the callback.
   * @template T
   * @api
   */
  forEachFeatureIntersectingExtent(t, e) {
    return this.forEachFeatureInExtent(
      t,
      /**
       * @param {import("../Feature.js").default<Geometry>} feature Feature.
       * @return {T|undefined} The return value from the last call to the callback.
       */
      function(i) {
        if (i.getGeometry().intersectsExtent(t)) {
          const r = e(i);
          if (r)
            return r;
        }
      }
    );
  }
  /**
   * Get the features collection associated with this source. Will be `null`
   * unless the source was configured with `useSpatialIndex` set to `false`, or
   * with an {@link module:ol/Collection~Collection} as `features`.
   * @return {Collection<import("../Feature.js").default<Geometry>>|null} The collection of features.
   * @api
   */
  getFeaturesCollection() {
    return this.featuresCollection_;
  }
  /**
   * Get a snapshot of the features currently on the source in random order. The returned array
   * is a copy, the features are references to the features in the source.
   * @return {Array<import("../Feature.js").default<Geometry>>} Features.
   * @api
   */
  getFeatures() {
    let t;
    return this.featuresCollection_ ? t = this.featuresCollection_.getArray().slice(0) : this.featuresRtree_ && (t = this.featuresRtree_.getAll(), si(this.nullGeometryFeatures_) || br(t, Object.values(this.nullGeometryFeatures_))), /** @type {Array<import("../Feature.js").default<Geometry>>} */
    t;
  }
  /**
   * Get all features whose geometry intersects the provided coordinate.
   * @param {import("../coordinate.js").Coordinate} coordinate Coordinate.
   * @return {Array<import("../Feature.js").default<Geometry>>} Features.
   * @api
   */
  getFeaturesAtCoordinate(t) {
    const e = [];
    return this.forEachFeatureAtCoordinateDirect(t, function(i) {
      e.push(i);
    }), e;
  }
  /**
   * Get all features whose bounding box intersects the provided extent.  Note that this returns an array of
   * all features intersecting the given extent in random order (so it may include
   * features whose geometries do not intersect the extent).
   *
   * When `useSpatialIndex` is set to false, this method will return all
   * features.
   *
   * @param {import("../extent.js").Extent} extent Extent.
   * @param {import("../proj/Projection.js").default} [projection] Include features
   * where `extent` exceeds the x-axis bounds of `projection` and wraps around the world.
   * @return {Array<import("../Feature.js").default<Geometry>>} Features.
   * @api
   */
  getFeaturesInExtent(t, e) {
    if (this.featuresRtree_) {
      if (!(e && e.canWrapX() && this.getWrapX()))
        return this.featuresRtree_.getInExtent(t);
      const n = Ra(t, e);
      return [].concat(
        ...n.map((r) => this.featuresRtree_.getInExtent(r))
      );
    } else if (this.featuresCollection_)
      return this.featuresCollection_.getArray().slice(0);
    return [];
  }
  /**
   * Get the closest feature to the provided coordinate.
   *
   * This method is not available when the source is configured with
   * `useSpatialIndex` set to `false`.
   * @param {import("../coordinate.js").Coordinate} coordinate Coordinate.
   * @param {function(import("../Feature.js").default<Geometry>):boolean} [filter] Feature filter function.
   *     The filter function will receive one argument, the {@link module:ol/Feature~Feature feature}
   *     and it should return a boolean value. By default, no filtering is made.
   * @return {import("../Feature.js").default<Geometry>} Closest feature.
   * @api
   */
  getClosestFeatureToCoordinate(t, e) {
    const i = t[0], n = t[1];
    let r = null;
    const o = [NaN, NaN];
    let a = 1 / 0;
    const l = [-1 / 0, -1 / 0, 1 / 0, 1 / 0];
    return e = e || ni, this.featuresRtree_.forEachInExtent(
      l,
      /**
       * @param {import("../Feature.js").default<Geometry>} feature Feature.
       */
      function(h) {
        if (e(h)) {
          const c = h.getGeometry(), u = a;
          if (a = c.closestPointXY(
            i,
            n,
            o,
            a
          ), a < u) {
            r = h;
            const d = Math.sqrt(a);
            l[0] = i - d, l[1] = n - d, l[2] = i + d, l[3] = n + d;
          }
        }
      }
    ), r;
  }
  /**
   * Get the extent of the features currently in the source.
   *
   * This method is not available when the source is configured with
   * `useSpatialIndex` set to `false`.
   * @param {import("../extent.js").Extent} [extent] Destination extent. If provided, no new extent
   *     will be created. Instead, that extent's coordinates will be overwritten.
   * @return {import("../extent.js").Extent} Extent.
   * @api
   */
  getExtent(t) {
    return this.featuresRtree_.getExtent(t);
  }
  /**
   * Get a feature by its identifier (the value returned by feature.getId()).
   * Note that the index treats string and numeric identifiers as the same.  So
   * `source.getFeatureById(2)` will return a feature with id `'2'` or `2`.
   *
   * @param {string|number} id Feature identifier.
   * @return {import("../Feature.js").default<Geometry>|null} The feature (or `null` if not found).
   * @api
   */
  getFeatureById(t) {
    const e = this.idIndex_[t.toString()];
    return e !== void 0 ? e : null;
  }
  /**
   * Get a feature by its internal unique identifier (using `getUid`).
   *
   * @param {string} uid Feature identifier.
   * @return {import("../Feature.js").default<Geometry>|null} The feature (or `null` if not found).
   */
  getFeatureByUid(t) {
    const e = this.uidIndex_[t];
    return e !== void 0 ? e : null;
  }
  /**
   * Get the format associated with this source.
   *
   * @return {import("../format/Feature.js").default|undefined} The feature format.
   * @api
   */
  getFormat() {
    return this.format_;
  }
  /**
   * @return {boolean} The source can have overlapping geometries.
   */
  getOverlaps() {
    return this.overlaps_;
  }
  /**
   * Get the url associated with this source.
   *
   * @return {string|import("../featureloader.js").FeatureUrlFunction|undefined} The url.
   * @api
   */
  getUrl() {
    return this.url_;
  }
  /**
   * @param {Event} event Event.
   * @private
   */
  handleFeatureChange_(t) {
    const e = (
      /** @type {import("../Feature.js").default<Geometry>} */
      t.target
    ), i = z(e), n = e.getGeometry();
    if (!n)
      i in this.nullGeometryFeatures_ || (this.featuresRtree_ && this.featuresRtree_.remove(e), this.nullGeometryFeatures_[i] = e);
    else {
      const o = n.getExtent();
      i in this.nullGeometryFeatures_ ? (delete this.nullGeometryFeatures_[i], this.featuresRtree_ && this.featuresRtree_.insert(o, e)) : this.featuresRtree_ && this.featuresRtree_.update(o, e);
    }
    const r = e.getId();
    if (r !== void 0) {
      const o = r.toString();
      this.idIndex_[o] !== e && (this.removeFromIdIndex_(e), this.idIndex_[o] = e);
    } else
      this.removeFromIdIndex_(e), this.uidIndex_[i] = e;
    this.changed(), this.dispatchEvent(
      new qt(Ct.CHANGEFEATURE, e)
    );
  }
  /**
   * Returns true if the feature is contained within the source.
   * @param {import("../Feature.js").default<Geometry>} feature Feature.
   * @return {boolean} Has feature.
   * @api
   */
  hasFeature(t) {
    const e = t.getId();
    return e !== void 0 ? e in this.idIndex_ : z(t) in this.uidIndex_;
  }
  /**
   * @return {boolean} Is empty.
   */
  isEmpty() {
    return this.featuresRtree_ ? this.featuresRtree_.isEmpty() && si(this.nullGeometryFeatures_) : this.featuresCollection_ ? this.featuresCollection_.getLength() === 0 : !0;
  }
  /**
   * @param {import("../extent.js").Extent} extent Extent.
   * @param {number} resolution Resolution.
   * @param {import("../proj/Projection.js").default} projection Projection.
   */
  loadFeatures(t, e, i) {
    const n = this.loadedExtentsRtree_, r = this.strategy_(t, e, i);
    for (let o = 0, a = r.length; o < a; ++o) {
      const l = r[o];
      n.forEachInExtent(
        l,
        /**
         * @param {{extent: import("../extent.js").Extent}} object Object.
         * @return {boolean} Contains.
         */
        function(c) {
          return ce(c.extent, l);
        }
      ) || (++this.loadingExtentsCount_, this.dispatchEvent(
        new qt(Ct.FEATURESLOADSTART)
      ), this.loader_.call(
        this,
        l,
        e,
        i,
        (c) => {
          --this.loadingExtentsCount_, this.dispatchEvent(
            new qt(
              Ct.FEATURESLOADEND,
              void 0,
              c
            )
          );
        },
        () => {
          --this.loadingExtentsCount_, this.dispatchEvent(
            new qt(Ct.FEATURESLOADERROR)
          );
        }
      ), n.insert(l, { extent: l.slice() }));
    }
    this.loading = this.loader_.length < 4 ? !1 : this.loadingExtentsCount_ > 0;
  }
  refresh() {
    this.clear(!0), this.loadedExtentsRtree_.clear(), super.refresh();
  }
  /**
   * Remove an extent from the list of loaded extents.
   * @param {import("../extent.js").Extent} extent Extent.
   * @api
   */
  removeLoadedExtent(t) {
    const e = this.loadedExtentsRtree_;
    let i;
    e.forEachInExtent(t, function(n) {
      if (ri(n.extent, t))
        return i = n, !0;
    }), i && e.remove(i);
  }
  /**
   * Remove a single feature from the source.  If you want to remove all features
   * at once, use the {@link module:ol/source/Vector~VectorSource#clear #clear()} method
   * instead.
   * @param {import("../Feature.js").default<Geometry>} feature Feature to remove.
   * @api
   */
  removeFeature(t) {
    if (!t)
      return;
    const e = z(t);
    e in this.nullGeometryFeatures_ ? delete this.nullGeometryFeatures_[e] : this.featuresRtree_ && this.featuresRtree_.remove(t), this.removeFeatureInternal(t) && this.changed();
  }
  /**
   * Remove feature without firing a `change` event.
   * @param {import("../Feature.js").default<Geometry>} feature Feature.
   * @return {import("../Feature.js").default<Geometry>|undefined} The removed feature
   *     (or undefined if the feature was not found).
   * @protected
   */
  removeFeatureInternal(t) {
    const e = z(t), i = this.featureChangeKeys_[e];
    if (!i)
      return;
    i.forEach(j), delete this.featureChangeKeys_[e];
    const n = t.getId();
    return n !== void 0 && delete this.idIndex_[n.toString()], delete this.uidIndex_[e], this.dispatchEvent(
      new qt(Ct.REMOVEFEATURE, t)
    ), t;
  }
  /**
   * Remove a feature from the id index.  Called internally when the feature id
   * may have changed.
   * @param {import("../Feature.js").default<Geometry>} feature The feature.
   * @return {boolean} Removed the feature from the index.
   * @private
   */
  removeFromIdIndex_(t) {
    let e = !1;
    for (const i in this.idIndex_)
      if (this.idIndex_[i] === t) {
        delete this.idIndex_[i], e = !0;
        break;
      }
    return e;
  }
  /**
   * Set the new loader of the source. The next render cycle will use the
   * new loader.
   * @param {import("../featureloader.js").FeatureLoader} loader The loader to set.
   * @api
   */
  setLoader(t) {
    this.loader_ = t;
  }
  /**
   * Points the source to a new url. The next render cycle will use the new url.
   * @param {string|import("../featureloader.js").FeatureUrlFunction} url Url.
   * @api
   */
  setUrl(t) {
    k(this.format_, 7), this.url_ = t, this.setLoader(Mr(t, this.format_));
  }
}
const Su = Iu;
class Ps extends St {
  /**
   * @param {Geometry|ObjectWithGeometry<Geometry>} [geometryOrProperties]
   *     You may pass a Geometry object directly, or an object literal containing
   *     properties. If you pass an object literal, you may include a Geometry
   *     associated with a `geometry` key.
   */
  constructor(t) {
    if (super(), this.on, this.once, this.un, this.id_ = void 0, this.geometryName_ = "geometry", this.style_ = null, this.styleFunction_ = void 0, this.geometryChangeKey_ = null, this.addChangeListener(this.geometryName_, this.handleGeometryChanged_), t)
      if (typeof /** @type {?} */
      t.getSimplifiedGeometry == "function") {
        const e = (
          /** @type {Geometry} */
          t
        );
        this.setGeometry(e);
      } else {
        const e = t;
        this.setProperties(e);
      }
  }
  /**
   * Clone this feature. If the original feature has a geometry it
   * is also cloned. The feature id is not set in the clone.
   * @return {Feature<Geometry>} The clone.
   * @api
   */
  clone() {
    const t = (
      /** @type {Feature<Geometry>} */
      new Ps(this.hasProperties() ? this.getProperties() : null)
    );
    t.setGeometryName(this.getGeometryName());
    const e = this.getGeometry();
    e && t.setGeometry(
      /** @type {Geometry} */
      e.clone()
    );
    const i = this.getStyle();
    return i && t.setStyle(i), t;
  }
  /**
   * Get the feature's default geometry.  A feature may have any number of named
   * geometries.  The "default" geometry (the one that is rendered by default) is
   * set when calling {@link module:ol/Feature~Feature#setGeometry}.
   * @return {Geometry|undefined} The default geometry for the feature.
   * @api
   * @observable
   */
  getGeometry() {
    return (
      /** @type {Geometry|undefined} */
      this.get(this.geometryName_)
    );
  }
  /**
   * Get the feature identifier.  This is a stable identifier for the feature and
   * is either set when reading data from a remote source or set explicitly by
   * calling {@link module:ol/Feature~Feature#setId}.
   * @return {number|string|undefined} Id.
   * @api
   */
  getId() {
    return this.id_;
  }
  /**
   * Get the name of the feature's default geometry.  By default, the default
   * geometry is named `geometry`.
   * @return {string} Get the property name associated with the default geometry
   *     for this feature.
   * @api
   */
  getGeometryName() {
    return this.geometryName_;
  }
  /**
   * Get the feature's style. Will return what was provided to the
   * {@link module:ol/Feature~Feature#setStyle} method.
   * @return {import("./style/Style.js").StyleLike|undefined} The feature style.
   * @api
   */
  getStyle() {
    return this.style_;
  }
  /**
   * Get the feature's style function.
   * @return {import("./style/Style.js").StyleFunction|undefined} Return a function
   * representing the current style of this feature.
   * @api
   */
  getStyleFunction() {
    return this.styleFunction_;
  }
  /**
   * @private
   */
  handleGeometryChange_() {
    this.changed();
  }
  /**
   * @private
   */
  handleGeometryChanged_() {
    this.geometryChangeKey_ && (j(this.geometryChangeKey_), this.geometryChangeKey_ = null);
    const t = this.getGeometry();
    t && (this.geometryChangeKey_ = G(
      t,
      F.CHANGE,
      this.handleGeometryChange_,
      this
    )), this.changed();
  }
  /**
   * Set the default geometry for the feature.  This will update the property
   * with the name returned by {@link module:ol/Feature~Feature#getGeometryName}.
   * @param {Geometry|undefined} geometry The new geometry.
   * @api
   * @observable
   */
  setGeometry(t) {
    this.set(this.geometryName_, t);
  }
  /**
   * Set the style for the feature to override the layer style.  This can be a
   * single style object, an array of styles, or a function that takes a
   * resolution and returns an array of styles. To unset the feature style, call
   * `setStyle()` without arguments or a falsey value.
   * @param {import("./style/Style.js").StyleLike} [style] Style for this feature.
   * @api
   * @fires module:ol/events/Event~BaseEvent#event:change
   */
  setStyle(t) {
    this.style_ = t, this.styleFunction_ = t ? vu(t) : void 0, this.changed();
  }
  /**
   * Set the feature id.  The feature id is considered stable and may be used when
   * requesting features or comparing identifiers returned from a remote source.
   * The feature id can be used with the
   * {@link module:ol/source/Vector~VectorSource#getFeatureById} method.
   * @param {number|string|undefined} id The feature id.
   * @api
   * @fires module:ol/events/Event~BaseEvent#event:change
   */
  setId(t) {
    this.id_ = t, this.changed();
  }
  /**
   * Set the property name to be used when getting the feature's default geometry.
   * When calling {@link module:ol/Feature~Feature#getGeometry}, the value of the property with
   * this name will be returned.
   * @param {string} name The property name of the default geometry.
   * @api
   */
  setGeometryName(t) {
    this.removeChangeListener(this.geometryName_, this.handleGeometryChanged_), this.geometryName_ = t, this.addChangeListener(this.geometryName_, this.handleGeometryChanged_), this.handleGeometryChanged_();
  }
}
function vu(s) {
  if (typeof s == "function")
    return s;
  let t;
  return Array.isArray(s) ? t = s : (k(typeof /** @type {?} */
  s.getZIndex == "function", 41), t = [
    /** @type {import("./style/Style.js").default} */
    s
  ]), function() {
    return t;
  };
}
const wu = Ps;
class Lu {
  /**
   * @param {number} [highWaterMark] High water mark.
   */
  constructor(t) {
    this.highWaterMark = t !== void 0 ? t : 2048, this.count_ = 0, this.entries_ = {}, this.oldest_ = null, this.newest_ = null;
  }
  /**
   * @return {boolean} Can expire cache.
   */
  canExpireCache() {
    return this.highWaterMark > 0 && this.getCount() > this.highWaterMark;
  }
  /**
   * Expire the cache.
   * @param {!Object<string, boolean>} [keep] Keys to keep. To be implemented by subclasses.
   */
  expireCache(t) {
    for (; this.canExpireCache(); )
      this.pop();
  }
  /**
   * FIXME empty description for jsdoc
   */
  clear() {
    this.count_ = 0, this.entries_ = {}, this.oldest_ = null, this.newest_ = null;
  }
  /**
   * @param {string} key Key.
   * @return {boolean} Contains key.
   */
  containsKey(t) {
    return this.entries_.hasOwnProperty(t);
  }
  /**
   * @param {function(T, string, LRUCache<T>): ?} f The function
   *     to call for every entry from the oldest to the newer. This function takes
   *     3 arguments (the entry value, the entry key and the LRUCache object).
   *     The return value is ignored.
   */
  forEach(t) {
    let e = this.oldest_;
    for (; e; )
      t(e.value_, e.key_, this), e = e.newer;
  }
  /**
   * @param {string} key Key.
   * @param {*} [options] Options (reserved for subclasses).
   * @return {T} Value.
   */
  get(t, e) {
    const i = this.entries_[t];
    return k(i !== void 0, 15), i === this.newest_ || (i === this.oldest_ ? (this.oldest_ = /** @type {Entry} */
    this.oldest_.newer, this.oldest_.older = null) : (i.newer.older = i.older, i.older.newer = i.newer), i.newer = null, i.older = this.newest_, this.newest_.newer = i, this.newest_ = i), i.value_;
  }
  /**
   * Remove an entry from the cache.
   * @param {string} key The entry key.
   * @return {T} The removed entry.
   */
  remove(t) {
    const e = this.entries_[t];
    return k(e !== void 0, 15), e === this.newest_ ? (this.newest_ = /** @type {Entry} */
    e.older, this.newest_ && (this.newest_.newer = null)) : e === this.oldest_ ? (this.oldest_ = /** @type {Entry} */
    e.newer, this.oldest_ && (this.oldest_.older = null)) : (e.newer.older = e.older, e.older.newer = e.newer), delete this.entries_[t], --this.count_, e.value_;
  }
  /**
   * @return {number} Count.
   */
  getCount() {
    return this.count_;
  }
  /**
   * @return {Array<string>} Keys.
   */
  getKeys() {
    const t = new Array(this.count_);
    let e = 0, i;
    for (i = this.newest_; i; i = i.older)
      t[e++] = i.key_;
    return t;
  }
  /**
   * @return {Array<T>} Values.
   */
  getValues() {
    const t = new Array(this.count_);
    let e = 0, i;
    for (i = this.newest_; i; i = i.older)
      t[e++] = i.value_;
    return t;
  }
  /**
   * @return {T} Last value.
   */
  peekLast() {
    return this.oldest_.value_;
  }
  /**
   * @return {string} Last key.
   */
  peekLastKey() {
    return this.oldest_.key_;
  }
  /**
   * Get the key of the newest item in the cache.  Throws if the cache is empty.
   * @return {string} The newest key.
   */
  peekFirstKey() {
    return this.newest_.key_;
  }
  /**
   * Return an entry without updating least recently used time.
   * @param {string} key Key.
   * @return {T} Value.
   */
  peek(t) {
    if (this.containsKey(t))
      return this.entries_[t].value_;
  }
  /**
   * @return {T} value Value.
   */
  pop() {
    const t = this.oldest_;
    return delete this.entries_[t.key_], t.newer && (t.newer.older = null), this.oldest_ = /** @type {Entry} */
    t.newer, this.oldest_ || (this.newest_ = null), --this.count_, t.value_;
  }
  /**
   * @param {string} key Key.
   * @param {T} value Value.
   */
  replace(t, e) {
    this.get(t), this.entries_[t].value_ = e;
  }
  /**
   * @param {string} key Key.
   * @param {T} value Value.
   */
  set(t, e) {
    k(!(t in this.entries_), 16);
    const i = {
      key_: t,
      newer: null,
      older: this.newest_,
      value_: e
    };
    this.newest_ ? this.newest_.newer = i : this.oldest_ = i, this.newest_ = i, this.entries_[t] = i, ++this.count_;
  }
  /**
   * Set a maximum number of entries for the cache.
   * @param {number} size Cache size.
   * @api
   */
  setSize(t) {
    this.highWaterMark = t;
  }
}
const Au = Lu;
function Pr(s, t, e, i) {
  return i !== void 0 ? (i[0] = s, i[1] = t, i[2] = e, i) : [s, t, e];
}
function xn(s, t, e) {
  return s + "/" + t + "/" + e;
}
function Wo(s) {
  return xn(s[0], s[1], s[2]);
}
function Mu(s) {
  return s.split("/").map(Number);
}
function Pu(s) {
  return (s[1] << s[0]) + s[2];
}
function Ou(s, t) {
  const e = s[0], i = s[1], n = s[2];
  if (t.getMinZoom() > e || e > t.getMaxZoom())
    return !1;
  const r = t.getFullTileRange(e);
  return r ? r.containsXY(i, n) : !0;
}
class bu extends Au {
  clear() {
    for (; this.getCount() > 0; )
      this.pop().release();
    super.clear();
  }
  /**
   * @param {!Object<string, boolean>} usedTiles Used tiles.
   */
  expireCache(t) {
    for (; this.canExpireCache() && !(this.peekLast().getKey() in t); )
      this.pop().release();
  }
  /**
   * Prune all tiles from the cache that don't have the same z as the newest tile.
   */
  pruneExceptNewestZ() {
    if (this.getCount() === 0)
      return;
    const t = this.peekFirstKey(), i = Mu(t)[0];
    this.forEach((n) => {
      n.tileCoord[0] !== i && (this.remove(Wo(n.tileCoord)), n.release());
    });
  }
}
const zo = bu, kn = {
  /**
   * Triggered when a tile starts loading.
   * @event module:ol/source/Tile.TileSourceEvent#tileloadstart
   * @api
   */
  TILELOADSTART: "tileloadstart",
  /**
   * Triggered when a tile finishes loading, either when its data is loaded,
   * or when loading was aborted because the tile is no longer needed.
   * @event module:ol/source/Tile.TileSourceEvent#tileloadend
   * @api
   */
  TILELOADEND: "tileloadend",
  /**
   * Triggered if tile loading results in an error. Note that this is not the
   * right place to re-fetch tiles. See {@link module:ol/ImageTile~ImageTile#load}
   * for details.
   * @event module:ol/source/Tile.TileSourceEvent#tileloaderror
   * @api
   */
  TILELOADERROR: "tileloaderror"
}, Le = [0, 0, 0], Jt = 5;
class Fu {
  /**
   * @param {Options} options Tile grid options.
   */
  constructor(t) {
    this.minZoom = t.minZoom !== void 0 ? t.minZoom : 0, this.resolutions_ = t.resolutions, k(
      qo(
        this.resolutions_,
        function(n, r) {
          return r - n;
        },
        !0
      ),
      17
    );
    let e;
    if (!t.origins) {
      for (let n = 0, r = this.resolutions_.length - 1; n < r; ++n)
        if (!e)
          e = this.resolutions_[n] / this.resolutions_[n + 1];
        else if (this.resolutions_[n] / this.resolutions_[n + 1] !== e) {
          e = void 0;
          break;
        }
    }
    this.zoomFactor_ = e, this.maxZoom = this.resolutions_.length - 1, this.origin_ = t.origin !== void 0 ? t.origin : null, this.origins_ = null, t.origins !== void 0 && (this.origins_ = t.origins, k(this.origins_.length == this.resolutions_.length, 20));
    const i = t.extent;
    i !== void 0 && !this.origin_ && !this.origins_ && (this.origin_ = pe(i)), k(
      !this.origin_ && this.origins_ || this.origin_ && !this.origins_,
      18
    ), this.tileSizes_ = null, t.tileSizes !== void 0 && (this.tileSizes_ = t.tileSizes, k(this.tileSizes_.length == this.resolutions_.length, 19)), this.tileSize_ = t.tileSize !== void 0 ? t.tileSize : this.tileSizes_ ? null : rs, k(
      !this.tileSize_ && this.tileSizes_ || this.tileSize_ && !this.tileSizes_,
      22
    ), this.extent_ = i !== void 0 ? i : null, this.fullTileRanges_ = null, this.tmpSize_ = [0, 0], this.tmpExtent_ = [0, 0, 0, 0], t.sizes !== void 0 ? this.fullTileRanges_ = t.sizes.map(function(n, r) {
      const o = new Ao(
        Math.min(0, n[0]),
        Math.max(n[0] - 1, -1),
        Math.min(0, n[1]),
        Math.max(n[1] - 1, -1)
      );
      if (i) {
        const a = this.getTileRangeForExtentAndZ(i, r);
        o.minX = Math.max(a.minX, o.minX), o.maxX = Math.min(a.maxX, o.maxX), o.minY = Math.max(a.minY, o.minY), o.maxY = Math.min(a.maxY, o.maxY);
      }
      return o;
    }, this) : i && this.calculateTileRanges_(i);
  }
  /**
   * Call a function with each tile coordinate for a given extent and zoom level.
   *
   * @param {import("../extent.js").Extent} extent Extent.
   * @param {number} zoom Integer zoom level.
   * @param {function(import("../tilecoord.js").TileCoord): void} callback Function called with each tile coordinate.
   * @api
   */
  forEachTileCoord(t, e, i) {
    const n = this.getTileRangeForExtentAndZ(t, e);
    for (let r = n.minX, o = n.maxX; r <= o; ++r)
      for (let a = n.minY, l = n.maxY; a <= l; ++a)
        i([e, r, a]);
  }
  /**
   * @param {import("../tilecoord.js").TileCoord} tileCoord Tile coordinate.
   * @param {function(number, import("../TileRange.js").default): boolean} callback Callback.
   * @param {import("../TileRange.js").default} [tempTileRange] Temporary import("../TileRange.js").default object.
   * @param {import("../extent.js").Extent} [tempExtent] Temporary import("../extent.js").Extent object.
   * @return {boolean} Callback succeeded.
   */
  forEachTileCoordParentTileRange(t, e, i, n) {
    let r, o, a, l = null, h = t[0] - 1;
    for (this.zoomFactor_ === 2 ? (o = t[1], a = t[2]) : l = this.getTileCoordExtent(t, n); h >= this.minZoom; ) {
      if (this.zoomFactor_ === 2 ? (o = Math.floor(o / 2), a = Math.floor(a / 2), r = Se(o, o, a, a, i)) : r = this.getTileRangeForExtentAndZ(
        l,
        h,
        i
      ), e(h, r))
        return !0;
      --h;
    }
    return !1;
  }
  /**
   * Get the extent for this tile grid, if it was configured.
   * @return {import("../extent.js").Extent} Extent.
   * @api
   */
  getExtent() {
    return this.extent_;
  }
  /**
   * Get the maximum zoom level for the grid.
   * @return {number} Max zoom.
   * @api
   */
  getMaxZoom() {
    return this.maxZoom;
  }
  /**
   * Get the minimum zoom level for the grid.
   * @return {number} Min zoom.
   * @api
   */
  getMinZoom() {
    return this.minZoom;
  }
  /**
   * Get the origin for the grid at the given zoom level.
   * @param {number} z Integer zoom level.
   * @return {import("../coordinate.js").Coordinate} Origin.
   * @api
   */
  getOrigin(t) {
    return this.origin_ ? this.origin_ : this.origins_[t];
  }
  /**
   * Get the resolution for the given zoom level.
   * @param {number} z Integer zoom level.
   * @return {number} Resolution.
   * @api
   */
  getResolution(t) {
    return this.resolutions_[t];
  }
  /**
   * Get the list of resolutions for the tile grid.
   * @return {Array<number>} Resolutions.
   * @api
   */
  getResolutions() {
    return this.resolutions_;
  }
  /**
   * @param {import("../tilecoord.js").TileCoord} tileCoord Tile coordinate.
   * @param {import("../TileRange.js").default} [tempTileRange] Temporary import("../TileRange.js").default object.
   * @param {import("../extent.js").Extent} [tempExtent] Temporary import("../extent.js").Extent object.
   * @return {import("../TileRange.js").default|null} Tile range.
   */
  getTileCoordChildTileRange(t, e, i) {
    if (t[0] < this.maxZoom) {
      if (this.zoomFactor_ === 2) {
        const r = t[1] * 2, o = t[2] * 2;
        return Se(
          r,
          r + 1,
          o,
          o + 1,
          e
        );
      }
      const n = this.getTileCoordExtent(
        t,
        i || this.tmpExtent_
      );
      return this.getTileRangeForExtentAndZ(
        n,
        t[0] + 1,
        e
      );
    }
    return null;
  }
  /**
   * @param {import("../tilecoord.js").TileCoord} tileCoord Tile coordinate.
   * @param {number} z Integer zoom level.
   * @param {import("../TileRange.js").default} [tempTileRange] Temporary import("../TileRange.js").default object.
   * @return {import("../TileRange.js").default|null} Tile range.
   */
  getTileRangeForTileCoordAndZ(t, e, i) {
    if (e > this.maxZoom || e < this.minZoom)
      return null;
    const n = t[0], r = t[1], o = t[2];
    if (e === n)
      return Se(
        r,
        o,
        r,
        o,
        i
      );
    if (this.zoomFactor_) {
      const l = Math.pow(this.zoomFactor_, e - n), h = Math.floor(r * l), c = Math.floor(o * l);
      if (e < n)
        return Se(h, h, c, c, i);
      const u = Math.floor(l * (r + 1)) - 1, d = Math.floor(l * (o + 1)) - 1;
      return Se(h, u, c, d, i);
    }
    const a = this.getTileCoordExtent(t, this.tmpExtent_);
    return this.getTileRangeForExtentAndZ(a, e, i);
  }
  /**
   * Get the extent for a tile range.
   * @param {number} z Integer zoom level.
   * @param {import("../TileRange.js").default} tileRange Tile range.
   * @param {import("../extent.js").Extent} [tempExtent] Temporary import("../extent.js").Extent object.
   * @return {import("../extent.js").Extent} Extent.
   */
  getTileRangeExtent(t, e, i) {
    const n = this.getOrigin(t), r = this.getResolution(t), o = _t(this.getTileSize(t), this.tmpSize_), a = n[0] + e.minX * o[0] * r, l = n[0] + (e.maxX + 1) * o[0] * r, h = n[1] + e.minY * o[1] * r, c = n[1] + (e.maxY + 1) * o[1] * r;
    return Bt(a, h, l, c, i);
  }
  /**
   * Get a tile range for the given extent and integer zoom level.
   * @param {import("../extent.js").Extent} extent Extent.
   * @param {number} z Integer zoom level.
   * @param {import("../TileRange.js").default} [tempTileRange] Temporary tile range object.
   * @return {import("../TileRange.js").default} Tile range.
   */
  getTileRangeForExtentAndZ(t, e, i) {
    this.getTileCoordForXYAndZ_(t[0], t[3], e, !1, Le);
    const n = Le[1], r = Le[2];
    this.getTileCoordForXYAndZ_(t[2], t[1], e, !0, Le);
    const o = Le[1], a = Le[2];
    return Se(n, o, r, a, i);
  }
  /**
   * @param {import("../tilecoord.js").TileCoord} tileCoord Tile coordinate.
   * @return {import("../coordinate.js").Coordinate} Tile center.
   */
  getTileCoordCenter(t) {
    const e = this.getOrigin(t[0]), i = this.getResolution(t[0]), n = _t(this.getTileSize(t[0]), this.tmpSize_);
    return [
      e[0] + (t[1] + 0.5) * n[0] * i,
      e[1] - (t[2] + 0.5) * n[1] * i
    ];
  }
  /**
   * Get the extent of a tile coordinate.
   *
   * @param {import("../tilecoord.js").TileCoord} tileCoord Tile coordinate.
   * @param {import("../extent.js").Extent} [tempExtent] Temporary extent object.
   * @return {import("../extent.js").Extent} Extent.
   * @api
   */
  getTileCoordExtent(t, e) {
    const i = this.getOrigin(t[0]), n = this.getResolution(t[0]), r = _t(this.getTileSize(t[0]), this.tmpSize_), o = i[0] + t[1] * r[0] * n, a = i[1] - (t[2] + 1) * r[1] * n, l = o + r[0] * n, h = a + r[1] * n;
    return Bt(o, a, l, h, e);
  }
  /**
   * Get the tile coordinate for the given map coordinate and resolution.  This
   * method considers that coordinates that intersect tile boundaries should be
   * assigned the higher tile coordinate.
   *
   * @param {import("../coordinate.js").Coordinate} coordinate Coordinate.
   * @param {number} resolution Resolution.
   * @param {import("../tilecoord.js").TileCoord} [opt_tileCoord] Destination import("../tilecoord.js").TileCoord object.
   * @return {import("../tilecoord.js").TileCoord} Tile coordinate.
   * @api
   */
  getTileCoordForCoordAndResolution(t, e, i) {
    return this.getTileCoordForXYAndResolution_(
      t[0],
      t[1],
      e,
      !1,
      i
    );
  }
  /**
   * Note that this method should not be called for resolutions that correspond
   * to an integer zoom level.  Instead call the `getTileCoordForXYAndZ_` method.
   * @param {number} x X.
   * @param {number} y Y.
   * @param {number} resolution Resolution (for a non-integer zoom level).
   * @param {boolean} reverseIntersectionPolicy Instead of letting edge
   *     intersections go to the higher tile coordinate, let edge intersections
   *     go to the lower tile coordinate.
   * @param {import("../tilecoord.js").TileCoord} [opt_tileCoord] Temporary import("../tilecoord.js").TileCoord object.
   * @return {import("../tilecoord.js").TileCoord} Tile coordinate.
   * @private
   */
  getTileCoordForXYAndResolution_(t, e, i, n, r) {
    const o = this.getZForResolution(i), a = i / this.getResolution(o), l = this.getOrigin(o), h = _t(this.getTileSize(o), this.tmpSize_);
    let c = a * (t - l[0]) / i / h[0], u = a * (l[1] - e) / i / h[1];
    return n ? (c = Oi(c, Jt) - 1, u = Oi(u, Jt) - 1) : (c = Pi(c, Jt), u = Pi(u, Jt)), Pr(o, c, u, r);
  }
  /**
   * Although there is repetition between this method and `getTileCoordForXYAndResolution_`,
   * they should have separate implementations.  This method is for integer zoom
   * levels.  The other method should only be called for resolutions corresponding
   * to non-integer zoom levels.
   * @param {number} x Map x coordinate.
   * @param {number} y Map y coordinate.
   * @param {number} z Integer zoom level.
   * @param {boolean} reverseIntersectionPolicy Instead of letting edge
   *     intersections go to the higher tile coordinate, let edge intersections
   *     go to the lower tile coordinate.
   * @param {import("../tilecoord.js").TileCoord} [opt_tileCoord] Temporary import("../tilecoord.js").TileCoord object.
   * @return {import("../tilecoord.js").TileCoord} Tile coordinate.
   * @private
   */
  getTileCoordForXYAndZ_(t, e, i, n, r) {
    const o = this.getOrigin(i), a = this.getResolution(i), l = _t(this.getTileSize(i), this.tmpSize_);
    let h = (t - o[0]) / a / l[0], c = (o[1] - e) / a / l[1];
    return n ? (h = Oi(h, Jt) - 1, c = Oi(c, Jt) - 1) : (h = Pi(h, Jt), c = Pi(c, Jt)), Pr(i, h, c, r);
  }
  /**
   * Get a tile coordinate given a map coordinate and zoom level.
   * @param {import("../coordinate.js").Coordinate} coordinate Coordinate.
   * @param {number} z Zoom level.
   * @param {import("../tilecoord.js").TileCoord} [opt_tileCoord] Destination import("../tilecoord.js").TileCoord object.
   * @return {import("../tilecoord.js").TileCoord} Tile coordinate.
   * @api
   */
  getTileCoordForCoordAndZ(t, e, i) {
    return this.getTileCoordForXYAndZ_(
      t[0],
      t[1],
      e,
      !1,
      i
    );
  }
  /**
   * @param {import("../tilecoord.js").TileCoord} tileCoord Tile coordinate.
   * @return {number} Tile resolution.
   */
  getTileCoordResolution(t) {
    return this.resolutions_[t[0]];
  }
  /**
   * Get the tile size for a zoom level. The type of the return value matches the
   * `tileSize` or `tileSizes` that the tile grid was configured with. To always
   * get an {@link import("../size.js").Size}, run the result through {@link module:ol/size.toSize}.
   * @param {number} z Z.
   * @return {number|import("../size.js").Size} Tile size.
   * @api
   */
  getTileSize(t) {
    return this.tileSize_ ? this.tileSize_ : this.tileSizes_[t];
  }
  /**
   * @param {number} z Zoom level.
   * @return {import("../TileRange.js").default} Extent tile range for the specified zoom level.
   */
  getFullTileRange(t) {
    return this.fullTileRanges_ ? this.fullTileRanges_[t] : this.extent_ ? this.getTileRangeForExtentAndZ(this.extent_, t) : null;
  }
  /**
   * @param {number} resolution Resolution.
   * @param {number|import("../array.js").NearestDirectionFunction} [opt_direction]
   *     If 0, the nearest resolution will be used.
   *     If 1, the nearest higher resolution (lower Z) will be used. If -1, the
   *     nearest lower resolution (higher Z) will be used. Default is 0.
   *     Use a {@link module:ol/array~NearestDirectionFunction} for more precise control.
   *
   * For example to change tile Z at the midpoint of zoom levels
   * ```js
   * function(value, high, low) {
   *   return value - low * Math.sqrt(high / low);
   * }
   * ```
   * @return {number} Z.
   * @api
   */
  getZForResolution(t, e) {
    const i = Qn(
      this.resolutions_,
      t,
      e || 0
    );
    return $(i, this.minZoom, this.maxZoom);
  }
  /**
   * The tile with the provided tile coordinate intersects the given viewport.
   * @param {import('../tilecoord.js').TileCoord} tileCoord Tile coordinate.
   * @param {Array<number>} viewport Viewport as returned from {@link module:ol/extent.getRotatedViewport}.
   * @return {boolean} The tile with the provided tile coordinate intersects the given viewport.
   */
  tileCoordIntersectsViewport(t, e) {
    return co(
      e,
      0,
      e.length,
      2,
      this.getTileCoordExtent(t)
    );
  }
  /**
   * @param {!import("../extent.js").Extent} extent Extent for this tile grid.
   * @private
   */
  calculateTileRanges_(t) {
    const e = this.resolutions_.length, i = new Array(e);
    for (let n = this.minZoom; n < e; ++n)
      i[n] = this.getTileRangeForExtentAndZ(t, n);
    this.fullTileRanges_ = i;
  }
}
const Yo = Fu;
function Bo(s) {
  let t = s.getDefaultTileGrid();
  return t || (t = Gu(s), s.setDefaultTileGrid(t)), t;
}
function Du(s, t, e) {
  const i = t[0], n = s.getTileCoordCenter(t), r = Os(e);
  if (!hn(r, n)) {
    const o = V(r), a = Math.ceil(
      (r[0] - n[0]) / o
    );
    return n[0] += o * a, s.getTileCoordForCoordAndZ(n, i);
  }
  return t;
}
function ku(s, t, e, i) {
  i = i !== void 0 ? i : "top-left";
  const n = Zo(s, t, e);
  return new Yo({
    extent: s,
    origin: xa(s, i),
    resolutions: n,
    tileSize: e
  });
}
function Nu(s) {
  const t = s || {}, e = t.extent || It("EPSG:3857").getExtent(), i = {
    extent: e,
    minZoom: t.minZoom,
    tileSize: t.tileSize,
    resolutions: Zo(
      e,
      t.maxZoom,
      t.tileSize,
      t.maxResolution
    )
  };
  return new Yo(i);
}
function Zo(s, t, e, i) {
  t = t !== void 0 ? t : Oa, e = _t(e !== void 0 ? e : rs);
  const n = Ot(s), r = V(s);
  i = i > 0 ? i : Math.max(r / e[0], n / e[1]);
  const o = t + 1, a = new Array(o);
  for (let l = 0; l < o; ++l)
    a[l] = i / Math.pow(2, l);
  return a;
}
function Gu(s, t, e, i) {
  const n = Os(s);
  return ku(n, t, e, i);
}
function Os(s) {
  s = It(s);
  let t = s.getExtent();
  if (!t) {
    const e = 180 * oi.degrees / s.getMetersPerUnit();
    t = Bt(-e, -e, e, e);
  }
  return t;
}
class Xu extends Xo {
  /**
   * @param {Options} options SourceTile source options.
   */
  constructor(t) {
    super({
      attributions: t.attributions,
      attributionsCollapsible: t.attributionsCollapsible,
      projection: t.projection,
      state: t.state,
      wrapX: t.wrapX,
      interpolate: t.interpolate
    }), this.on, this.once, this.un, this.opaque_ = t.opaque !== void 0 ? t.opaque : !1, this.tilePixelRatio_ = t.tilePixelRatio !== void 0 ? t.tilePixelRatio : 1, this.tileGrid = t.tileGrid !== void 0 ? t.tileGrid : null;
    const e = [256, 256];
    this.tileGrid && _t(this.tileGrid.getTileSize(this.tileGrid.getMinZoom()), e), this.tileCache = new zo(t.cacheSize || 0), this.tmpSize = [0, 0], this.key_ = t.key || "", this.tileOptions = {
      transition: t.transition,
      interpolate: t.interpolate
    }, this.zDirection = t.zDirection ? t.zDirection : 0;
  }
  /**
   * @return {boolean} Can expire cache.
   */
  canExpireCache() {
    return this.tileCache.canExpireCache();
  }
  /**
   * @param {import("../proj/Projection.js").default} projection Projection.
   * @param {!Object<string, boolean>} usedTiles Used tiles.
   */
  expireCache(t, e) {
    const i = this.getTileCacheForProjection(t);
    i && i.expireCache(e);
  }
  /**
   * @param {import("../proj/Projection.js").default} projection Projection.
   * @param {number} z Zoom level.
   * @param {import("../TileRange.js").default} tileRange Tile range.
   * @param {function(import("../Tile.js").default):(boolean|void)} callback Called with each
   *     loaded tile.  If the callback returns `false`, the tile will not be
   *     considered loaded.
   * @return {boolean} The tile range is fully covered with loaded tiles.
   */
  forEachLoadedTile(t, e, i, n) {
    const r = this.getTileCacheForProjection(t);
    if (!r)
      return !1;
    let o = !0, a, l, h;
    for (let c = i.minX; c <= i.maxX; ++c)
      for (let u = i.minY; u <= i.maxY; ++u)
        l = xn(e, c, u), h = !1, r.containsKey(l) && (a = /** @type {!import("../Tile.js").default} */
        r.get(l), h = a.getState() === A.LOADED, h && (h = n(a) !== !1)), h || (o = !1);
    return o;
  }
  /**
   * @param {import("../proj/Projection.js").default} projection Projection.
   * @return {number} Gutter.
   */
  getGutterForProjection(t) {
    return 0;
  }
  /**
   * Return the key to be used for all tiles in the source.
   * @return {string} The key for all tiles.
   */
  getKey() {
    return this.key_;
  }
  /**
   * Set the value to be used as the key for all tiles in the source.
   * @param {string} key The key for tiles.
   * @protected
   */
  setKey(t) {
    this.key_ !== t && (this.key_ = t, this.changed());
  }
  /**
   * @param {import("../proj/Projection.js").default} projection Projection.
   * @return {boolean} Opaque.
   */
  getOpaque(t) {
    return this.opaque_;
  }
  /**
   * @param {import("../proj/Projection").default} [projection] Projection.
   * @return {Array<number>|null} Resolutions.
   */
  getResolutions(t) {
    const e = t ? this.getTileGridForProjection(t) : this.tileGrid;
    return e ? e.getResolutions() : null;
  }
  /**
   * @abstract
   * @param {number} z Tile coordinate z.
   * @param {number} x Tile coordinate x.
   * @param {number} y Tile coordinate y.
   * @param {number} pixelRatio Pixel ratio.
   * @param {import("../proj/Projection.js").default} projection Projection.
   * @return {!import("../Tile.js").default} Tile.
   */
  getTile(t, e, i, n, r) {
    return W();
  }
  /**
   * Return the tile grid of the tile source.
   * @return {import("../tilegrid/TileGrid.js").default|null} Tile grid.
   * @api
   */
  getTileGrid() {
    return this.tileGrid;
  }
  /**
   * @param {import("../proj/Projection.js").default} projection Projection.
   * @return {!import("../tilegrid/TileGrid.js").default} Tile grid.
   */
  getTileGridForProjection(t) {
    return this.tileGrid ? this.tileGrid : Bo(t);
  }
  /**
   * @param {import("../proj/Projection.js").default} projection Projection.
   * @return {import("../TileCache.js").default} Tile cache.
   * @protected
   */
  getTileCacheForProjection(t) {
    const e = this.getProjection();
    return k(
      e === null || Ae(e, t),
      68
      // A VectorTile source can only be rendered if it has a projection compatible with the view projection.
    ), this.tileCache;
  }
  /**
   * Get the tile pixel ratio for this source. Subclasses may override this
   * method, which is meant to return a supported pixel ratio that matches the
   * provided `pixelRatio` as close as possible.
   * @param {number} pixelRatio Pixel ratio.
   * @return {number} Tile pixel ratio.
   */
  getTilePixelRatio(t) {
    return this.tilePixelRatio_;
  }
  /**
   * @param {number} z Z.
   * @param {number} pixelRatio Pixel ratio.
   * @param {import("../proj/Projection.js").default} projection Projection.
   * @return {import("../size.js").Size} Tile size.
   */
  getTilePixelSize(t, e, i) {
    const n = this.getTileGridForProjection(i), r = this.getTilePixelRatio(e), o = _t(n.getTileSize(t), this.tmpSize);
    return r == 1 ? o : Kh(o, r, this.tmpSize);
  }
  /**
   * Returns a tile coordinate wrapped around the x-axis. When the tile coordinate
   * is outside the resolution and extent range of the tile grid, `null` will be
   * returned.
   * @param {import("../tilecoord.js").TileCoord} tileCoord Tile coordinate.
   * @param {import("../proj/Projection.js").default} [projection] Projection.
   * @return {import("../tilecoord.js").TileCoord} Tile coordinate to be passed to the tileUrlFunction or
   *     null if no tile URL should be created for the passed `tileCoord`.
   */
  getTileCoordForTileUrlFunction(t, e) {
    e = e !== void 0 ? e : this.getProjection();
    const i = this.getTileGridForProjection(e);
    return this.getWrapX() && e.isGlobal() && (t = Du(i, t, e)), Ou(t, i) ? t : null;
  }
  /**
   * Remove all cached tiles from the source. The next render cycle will fetch new tiles.
   * @api
   */
  clear() {
    this.tileCache.clear();
  }
  refresh() {
    this.clear(), super.refresh();
  }
  /**
   * Increases the cache size if needed
   * @param {number} tileCount Minimum number of tiles needed.
   * @param {import("../proj/Projection.js").default} projection Projection.
   */
  updateCacheSize(t, e) {
    const i = this.getTileCacheForProjection(e);
    t > i.highWaterMark && (i.highWaterMark = t);
  }
  /**
   * Marks a tile coord as being used, without triggering a load.
   * @abstract
   * @param {number} z Tile coordinate z.
   * @param {number} x Tile coordinate x.
   * @param {number} y Tile coordinate y.
   * @param {import("../proj/Projection.js").default} projection Projection.
   */
  useTile(t, e, i, n) {
  }
}
class Wu extends Zt {
  /**
   * @param {string} type Type.
   * @param {import("../Tile.js").default} tile The tile.
   */
  constructor(t, e) {
    super(t), this.tile = e;
  }
}
const zu = Xu;
function Yu(s, t) {
  const e = /\{z\}/g, i = /\{x\}/g, n = /\{y\}/g, r = /\{-y\}/g;
  return (
    /**
     * @param {import("./tilecoord.js").TileCoord} tileCoord Tile Coordinate.
     * @param {number} pixelRatio Pixel ratio.
     * @param {import("./proj/Projection.js").default} projection Projection.
     * @return {string|undefined} Tile URL.
     */
    function(o, a, l) {
      if (o)
        return s.replace(e, o[0].toString()).replace(i, o[1].toString()).replace(n, o[2].toString()).replace(r, function() {
          const h = o[0], c = t.getFullTileRange(h);
          return k(c, 55), (c.getHeight() - o[2] - 1).toString();
        });
    }
  );
}
function Bu(s, t) {
  const e = s.length, i = new Array(e);
  for (let n = 0; n < e; ++n)
    i[n] = Yu(s[n], t);
  return Zu(i);
}
function Zu(s) {
  return s.length === 1 ? s[0] : (
    /**
     * @param {import("./tilecoord.js").TileCoord} tileCoord Tile Coordinate.
     * @param {number} pixelRatio Pixel ratio.
     * @param {import("./proj/Projection.js").default} projection Projection.
     * @return {string|undefined} Tile URL.
     */
    function(t, e, i) {
      if (!t)
        return;
      const n = Pu(t), r = _e(n, s.length);
      return s[r](t, e, i);
    }
  );
}
function Ku(s) {
  const t = [];
  let e = /\{([a-z])-([a-z])\}/.exec(s);
  if (e) {
    const i = e[1].charCodeAt(0), n = e[2].charCodeAt(0);
    let r;
    for (r = i; r <= n; ++r)
      t.push(s.replace(e[0], String.fromCharCode(r)));
    return t;
  }
  if (e = /\{(\d+)-(\d+)\}/.exec(s), e) {
    const i = parseInt(e[2], 10);
    for (let n = parseInt(e[1], 10); n <= i; n++)
      t.push(s.replace(e[0], n.toString()));
    return t;
  }
  return t.push(s), t;
}
class bs extends zu {
  /**
   * @param {Options} options Image tile options.
   */
  constructor(t) {
    super({
      attributions: t.attributions,
      cacheSize: t.cacheSize,
      opaque: t.opaque,
      projection: t.projection,
      state: t.state,
      tileGrid: t.tileGrid,
      tilePixelRatio: t.tilePixelRatio,
      wrapX: t.wrapX,
      transition: t.transition,
      interpolate: t.interpolate,
      key: t.key,
      attributionsCollapsible: t.attributionsCollapsible,
      zDirection: t.zDirection
    }), this.generateTileUrlFunction_ = this.tileUrlFunction === bs.prototype.tileUrlFunction, this.tileLoadFunction = t.tileLoadFunction, t.tileUrlFunction && (this.tileUrlFunction = t.tileUrlFunction), this.urls = null, t.urls ? this.setUrls(t.urls) : t.url && this.setUrl(t.url), this.tileLoadingKeys_ = {};
  }
  /**
   * Return the tile load function of the source.
   * @return {import("../Tile.js").LoadFunction} TileLoadFunction
   * @api
   */
  getTileLoadFunction() {
    return this.tileLoadFunction;
  }
  /**
   * Return the tile URL function of the source.
   * @return {import("../Tile.js").UrlFunction} TileUrlFunction
   * @api
   */
  getTileUrlFunction() {
    return Object.getPrototypeOf(this).tileUrlFunction === this.tileUrlFunction ? this.tileUrlFunction.bind(this) : this.tileUrlFunction;
  }
  /**
   * Return the URLs used for this source.
   * When a tileUrlFunction is used instead of url or urls,
   * null will be returned.
   * @return {!Array<string>|null} URLs.
   * @api
   */
  getUrls() {
    return this.urls;
  }
  /**
   * Handle tile change events.
   * @param {import("../events/Event.js").default} event Event.
   * @protected
   */
  handleTileChange(t) {
    const e = (
      /** @type {import("../Tile.js").default} */
      t.target
    ), i = z(e), n = e.getState();
    let r;
    n == A.LOADING ? (this.tileLoadingKeys_[i] = !0, r = kn.TILELOADSTART) : i in this.tileLoadingKeys_ && (delete this.tileLoadingKeys_[i], r = n == A.ERROR ? kn.TILELOADERROR : n == A.LOADED ? kn.TILELOADEND : void 0), r != null && this.dispatchEvent(new Wu(r, e));
  }
  /**
   * Set the tile load function of the source.
   * @param {import("../Tile.js").LoadFunction} tileLoadFunction Tile load function.
   * @api
   */
  setTileLoadFunction(t) {
    this.tileCache.clear(), this.tileLoadFunction = t, this.changed();
  }
  /**
   * Set the tile URL function of the source.
   * @param {import("../Tile.js").UrlFunction} tileUrlFunction Tile URL function.
   * @param {string} [key] Optional new tile key for the source.
   * @api
   */
  setTileUrlFunction(t, e) {
    this.tileUrlFunction = t, this.tileCache.pruneExceptNewestZ(), typeof e != "undefined" ? this.setKey(e) : this.changed();
  }
  /**
   * Set the URL to use for requests.
   * @param {string} url URL.
   * @api
   */
  setUrl(t) {
    const e = Ku(t);
    this.urls = e, this.setUrls(e);
  }
  /**
   * Set the URLs to use for requests.
   * @param {Array<string>} urls URLs.
   * @api
   */
  setUrls(t) {
    this.urls = t;
    const e = t.join(`
`);
    this.generateTileUrlFunction_ ? this.setTileUrlFunction(Bu(t, this.tileGrid), e) : this.setKey(e);
  }
  /**
   * @param {import("../tilecoord.js").TileCoord} tileCoord Tile coordinate.
   * @param {number} pixelRatio Pixel ratio.
   * @param {import("../proj/Projection.js").default} projection Projection.
   * @return {string|undefined} Tile URL.
   */
  tileUrlFunction(t, e, i) {
  }
  /**
   * Marks a tile coord as being used, without triggering a load.
   * @param {number} z Tile coordinate z.
   * @param {number} x Tile coordinate x.
   * @param {number} y Tile coordinate y.
   */
  useTile(t, e, i) {
    const n = xn(t, e, i);
    this.tileCache.containsKey(n) && this.tileCache.get(n);
  }
}
const Uu = bs;
class Vu extends Uu {
  /**
   * @param {!Options} options Image tile options.
   */
  constructor(t) {
    super({
      attributions: t.attributions,
      cacheSize: t.cacheSize,
      opaque: t.opaque,
      projection: t.projection,
      state: t.state,
      tileGrid: t.tileGrid,
      tileLoadFunction: t.tileLoadFunction ? t.tileLoadFunction : ju,
      tilePixelRatio: t.tilePixelRatio,
      tileUrlFunction: t.tileUrlFunction,
      url: t.url,
      urls: t.urls,
      wrapX: t.wrapX,
      transition: t.transition,
      interpolate: t.interpolate !== void 0 ? t.interpolate : !0,
      key: t.key,
      attributionsCollapsible: t.attributionsCollapsible,
      zDirection: t.zDirection
    }), this.crossOrigin = t.crossOrigin !== void 0 ? t.crossOrigin : null, this.tileClass = t.tileClass !== void 0 ? t.tileClass : wo, this.tileCacheForProjection = {}, this.tileGridForProjection = {}, this.reprojectionErrorThreshold_ = t.reprojectionErrorThreshold, this.renderReprojectionEdges_ = !1;
  }
  /**
   * @return {boolean} Can expire cache.
   */
  canExpireCache() {
    if (this.tileCache.canExpireCache())
      return !0;
    for (const t in this.tileCacheForProjection)
      if (this.tileCacheForProjection[t].canExpireCache())
        return !0;
    return !1;
  }
  /**
   * @param {import("../proj/Projection.js").default} projection Projection.
   * @param {!Object<string, boolean>} usedTiles Used tiles.
   */
  expireCache(t, e) {
    const i = this.getTileCacheForProjection(t);
    this.tileCache.expireCache(
      this.tileCache == i ? e : {}
    );
    for (const n in this.tileCacheForProjection) {
      const r = this.tileCacheForProjection[n];
      r.expireCache(r == i ? e : {});
    }
  }
  /**
   * @param {import("../proj/Projection.js").default} projection Projection.
   * @return {number} Gutter.
   */
  getGutterForProjection(t) {
    return this.getProjection() && t && !Ae(this.getProjection(), t) ? 0 : this.getGutter();
  }
  /**
   * @return {number} Gutter.
   */
  getGutter() {
    return 0;
  }
  /**
   * Return the key to be used for all tiles in the source.
   * @return {string} The key for all tiles.
   */
  getKey() {
    let t = super.getKey();
    return this.getInterpolate() || (t += ":disable-interpolation"), t;
  }
  /**
   * @param {import("../proj/Projection.js").default} projection Projection.
   * @return {boolean} Opaque.
   */
  getOpaque(t) {
    return this.getProjection() && t && !Ae(this.getProjection(), t) ? !1 : super.getOpaque(t);
  }
  /**
   * @param {import("../proj/Projection.js").default} projection Projection.
   * @return {!import("../tilegrid/TileGrid.js").default} Tile grid.
   */
  getTileGridForProjection(t) {
    const e = this.getProjection();
    if (this.tileGrid && (!e || Ae(e, t)))
      return this.tileGrid;
    const i = z(t);
    return i in this.tileGridForProjection || (this.tileGridForProjection[i] = Bo(t)), this.tileGridForProjection[i];
  }
  /**
   * @param {import("../proj/Projection.js").default} projection Projection.
   * @return {import("../TileCache.js").default} Tile cache.
   */
  getTileCacheForProjection(t) {
    const e = this.getProjection();
    if (!e || Ae(e, t))
      return this.tileCache;
    const i = z(t);
    return i in this.tileCacheForProjection || (this.tileCacheForProjection[i] = new zo(
      this.tileCache.highWaterMark
    )), this.tileCacheForProjection[i];
  }
  /**
   * @param {number} z Tile coordinate z.
   * @param {number} x Tile coordinate x.
   * @param {number} y Tile coordinate y.
   * @param {number} pixelRatio Pixel ratio.
   * @param {import("../proj/Projection.js").default} projection Projection.
   * @param {string} key The key set on the tile.
   * @return {!ImageTile} Tile.
   * @private
   */
  createTile_(t, e, i, n, r, o) {
    const a = [t, e, i], l = this.getTileCoordForTileUrlFunction(
      a,
      r
    ), h = l ? this.tileUrlFunction(l, n, r) : void 0, c = new this.tileClass(
      a,
      h !== void 0 ? A.IDLE : A.EMPTY,
      h !== void 0 ? h : "",
      this.crossOrigin,
      this.tileLoadFunction,
      this.tileOptions
    );
    return c.key = o, c.addEventListener(F.CHANGE, this.handleTileChange.bind(this)), c;
  }
  /**
   * @param {number} z Tile coordinate z.
   * @param {number} x Tile coordinate x.
   * @param {number} y Tile coordinate y.
   * @param {number} pixelRatio Pixel ratio.
   * @param {import("../proj/Projection.js").default} projection Projection.
   * @return {!(ImageTile|ReprojTile)} Tile.
   */
  getTile(t, e, i, n, r) {
    const o = this.getProjection();
    if (!o || !r || Ae(o, r))
      return this.getTileInternal(
        t,
        e,
        i,
        n,
        o || r
      );
    const a = this.getTileCacheForProjection(r), l = [t, e, i];
    let h;
    const c = Wo(l);
    a.containsKey(c) && (h = a.get(c));
    const u = this.getKey();
    if (h && h.key == u)
      return h;
    const d = this.getTileGridForProjection(o), f = this.getTileGridForProjection(r), g = this.getTileCoordForTileUrlFunction(
      l,
      r
    ), _ = new $n(
      o,
      d,
      r,
      f,
      l,
      g,
      this.getTilePixelRatio(n),
      this.getGutter(),
      (m, p, y, x) => this.getTileInternal(m, p, y, x, o),
      this.reprojectionErrorThreshold_,
      this.renderReprojectionEdges_,
      this.getInterpolate()
    );
    return _.key = u, h ? (_.interimTile = h, _.refreshInterimChain(), a.replace(c, _)) : a.set(c, _), _;
  }
  /**
   * @param {number} z Tile coordinate z.
   * @param {number} x Tile coordinate x.
   * @param {number} y Tile coordinate y.
   * @param {number} pixelRatio Pixel ratio.
   * @param {!import("../proj/Projection.js").default} projection Projection.
   * @return {!ImageTile} Tile.
   * @protected
   */
  getTileInternal(t, e, i, n, r) {
    let o = null;
    const a = xn(t, e, i), l = this.getKey();
    if (!this.tileCache.containsKey(a))
      o = this.createTile_(t, e, i, n, r, l), this.tileCache.set(a, o);
    else if (o = this.tileCache.get(a), o.key != l) {
      const h = o;
      o = this.createTile_(t, e, i, n, r, l), h.getState() == A.IDLE ? o.interimTile = h.interimTile : o.interimTile = h, o.refreshInterimChain(), this.tileCache.replace(a, o);
    }
    return o;
  }
  /**
   * Sets whether to render reprojection edges or not (usually for debugging).
   * @param {boolean} render Render the edges.
   * @api
   */
  setRenderReprojectionEdges(t) {
    if (this.renderReprojectionEdges_ != t) {
      this.renderReprojectionEdges_ = t;
      for (const e in this.tileCacheForProjection)
        this.tileCacheForProjection[e].clear();
      this.changed();
    }
  }
  /**
   * Sets the tile grid to use when reprojecting the tiles to the given
   * projection instead of the default tile grid for the projection.
   *
   * This can be useful when the default tile grid cannot be created
   * (e.g. projection has no extent defined) or
   * for optimization reasons (custom tile size, resolutions, ...).
   *
   * @param {import("../proj.js").ProjectionLike} projection Projection.
   * @param {import("../tilegrid/TileGrid.js").default} tilegrid Tile grid to use for the projection.
   * @api
   */
  setTileGridForProjection(t, e) {
    const i = It(t);
    if (i) {
      const n = z(i);
      n in this.tileGridForProjection || (this.tileGridForProjection[n] = e);
    }
  }
  clear() {
    super.clear();
    for (const t in this.tileCacheForProjection)
      this.tileCacheForProjection[t].clear();
  }
}
function ju(s, t) {
  s.getImage().src = t;
}
const Hu = Vu;
class $u extends Hu {
  /**
   * @param {Options} [options] XYZ options.
   */
  constructor(t) {
    t = t || {};
    const e = t.projection !== void 0 ? t.projection : "EPSG:3857", i = t.tileGrid !== void 0 ? t.tileGrid : Nu({
      extent: Os(e),
      maxResolution: t.maxResolution,
      maxZoom: t.maxZoom,
      minZoom: t.minZoom,
      tileSize: t.tileSize
    });
    super({
      attributions: t.attributions,
      cacheSize: t.cacheSize,
      crossOrigin: t.crossOrigin,
      interpolate: t.interpolate,
      opaque: t.opaque,
      projection: e,
      reprojectionErrorThreshold: t.reprojectionErrorThreshold,
      tileGrid: i,
      tileLoadFunction: t.tileLoadFunction,
      tilePixelRatio: t.tilePixelRatio,
      tileUrlFunction: t.tileUrlFunction,
      url: t.url,
      urls: t.urls,
      wrapX: t.wrapX !== void 0 ? t.wrapX : !0,
      transition: t.transition,
      attributionsCollapsible: t.attributionsCollapsible,
      zDirection: t.zDirection
    }), this.gutter_ = t.gutter !== void 0 ? t.gutter : 0;
  }
  /**
   * @return {number} Gutter.
   */
  getGutter() {
    return this.gutter_;
  }
}
const qu = $u, Ju = '&#169; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors.';
class Qu extends qu {
  /**
   * @param {Options} [options] Open Street Map options.
   */
  constructor(t) {
    t = t || {};
    let e;
    t.attributions !== void 0 ? e = t.attributions : e = [Ju];
    const i = t.crossOrigin !== void 0 ? t.crossOrigin : "anonymous", n = t.url !== void 0 ? t.url : "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
    super({
      attributions: e,
      attributionsCollapsible: !1,
      cacheSize: t.cacheSize,
      crossOrigin: i,
      interpolate: t.interpolate,
      maxZoom: t.maxZoom !== void 0 ? t.maxZoom : 19,
      opaque: t.opaque !== void 0 ? t.opaque : !0,
      reprojectionErrorThreshold: t.reprojectionErrorThreshold,
      tileLoadFunction: t.tileLoadFunction,
      transition: t.transition,
      url: n,
      wrapX: t.wrapX,
      zDirection: t.zDirection
    });
  }
}
const td = Qu, nt = {
  ELEMENT: "element",
  MAP: "map",
  OFFSET: "offset",
  POSITION: "position",
  POSITIONING: "positioning"
};
class ed extends St {
  /**
   * @param {Options} options Overlay options.
   */
  constructor(t) {
    super(), this.on, this.once, this.un, this.options = t, this.id = t.id, this.insertFirst = t.insertFirst !== void 0 ? t.insertFirst : !0, this.stopEvent = t.stopEvent !== void 0 ? t.stopEvent : !0, this.element = document.createElement("div"), this.element.className = t.className !== void 0 ? t.className : "ol-overlay-container " + Nl, this.element.style.position = "absolute", this.element.style.pointerEvents = "auto", this.autoPan = t.autoPan === !0 ? {} : t.autoPan || void 0, this.rendered = {
      transform_: "",
      visible: !0
    }, this.mapPostrenderListenerKey = null, this.addChangeListener(nt.ELEMENT, this.handleElementChanged), this.addChangeListener(nt.MAP, this.handleMapChanged), this.addChangeListener(nt.OFFSET, this.handleOffsetChanged), this.addChangeListener(nt.POSITION, this.handlePositionChanged), this.addChangeListener(nt.POSITIONING, this.handlePositioningChanged), t.element !== void 0 && this.setElement(t.element), this.setOffset(t.offset !== void 0 ? t.offset : [0, 0]), this.setPositioning(t.positioning || "top-left"), t.position !== void 0 && this.setPosition(t.position);
  }
  /**
   * Get the DOM element of this overlay.
   * @return {HTMLElement|undefined} The Element containing the overlay.
   * @observable
   * @api
   */
  getElement() {
    return (
      /** @type {HTMLElement|undefined} */
      this.get(nt.ELEMENT)
    );
  }
  /**
   * Get the overlay identifier which is set on constructor.
   * @return {number|string|undefined} Id.
   * @api
   */
  getId() {
    return this.id;
  }
  /**
   * Get the map associated with this overlay.
   * @return {import("./Map.js").default|null} The map that the
   * overlay is part of.
   * @observable
   * @api
   */
  getMap() {
    return (
      /** @type {import("./Map.js").default|null} */
      this.get(nt.MAP) || null
    );
  }
  /**
   * Get the offset of this overlay.
   * @return {Array<number>} The offset.
   * @observable
   * @api
   */
  getOffset() {
    return (
      /** @type {Array<number>} */
      this.get(nt.OFFSET)
    );
  }
  /**
   * Get the current position of this overlay.
   * @return {import("./coordinate.js").Coordinate|undefined} The spatial point that the overlay is
   *     anchored at.
   * @observable
   * @api
   */
  getPosition() {
    return (
      /** @type {import("./coordinate.js").Coordinate|undefined} */
      this.get(nt.POSITION)
    );
  }
  /**
   * Get the current positioning of this overlay.
   * @return {Positioning} How the overlay is positioned
   *     relative to its point on the map.
   * @observable
   * @api
   */
  getPositioning() {
    return (
      /** @type {Positioning} */
      this.get(nt.POSITIONING)
    );
  }
  /**
   * @protected
   */
  handleElementChanged() {
    _o(this.element);
    const t = this.getElement();
    t && this.element.appendChild(t);
  }
  /**
   * @protected
   */
  handleMapChanged() {
    this.mapPostrenderListenerKey && (Qi(this.element), j(this.mapPostrenderListenerKey), this.mapPostrenderListenerKey = null);
    const t = this.getMap();
    if (t) {
      this.mapPostrenderListenerKey = G(
        t,
        zt.POSTRENDER,
        this.render,
        this
      ), this.updatePixelPosition();
      const e = this.stopEvent ? t.getOverlayContainerStopEvent() : t.getOverlayContainer();
      this.insertFirst ? e.insertBefore(this.element, e.childNodes[0] || null) : e.appendChild(this.element), this.performAutoPan();
    }
  }
  /**
   * @protected
   */
  render() {
    this.updatePixelPosition();
  }
  /**
   * @protected
   */
  handleOffsetChanged() {
    this.updatePixelPosition();
  }
  /**
   * @protected
   */
  handlePositionChanged() {
    this.updatePixelPosition(), this.performAutoPan();
  }
  /**
   * @protected
   */
  handlePositioningChanged() {
    this.updatePixelPosition();
  }
  /**
   * Set the DOM element to be associated with this overlay.
   * @param {HTMLElement|undefined} element The Element containing the overlay.
   * @observable
   * @api
   */
  setElement(t) {
    this.set(nt.ELEMENT, t);
  }
  /**
   * Set the map to be associated with this overlay.
   * @param {import("./Map.js").default|null} map The map that the
   * overlay is part of. Pass `null` to just remove the overlay from the current map.
   * @observable
   * @api
   */
  setMap(t) {
    this.set(nt.MAP, t);
  }
  /**
   * Set the offset for this overlay.
   * @param {Array<number>} offset Offset.
   * @observable
   * @api
   */
  setOffset(t) {
    this.set(nt.OFFSET, t);
  }
  /**
   * Set the position for this overlay. If the position is `undefined` the
   * overlay is hidden.
   * @param {import("./coordinate.js").Coordinate|undefined} position The spatial point that the overlay
   *     is anchored at.
   * @observable
   * @api
   */
  setPosition(t) {
    this.set(nt.POSITION, t);
  }
  /**
   * Pan the map so that the overlay is entirely visible in the current viewport
   * (if necessary) using the configured autoPan parameters
   * @protected
   */
  performAutoPan() {
    this.autoPan && this.panIntoView(this.autoPan);
  }
  /**
   * Pan the map so that the overlay is entirely visible in the current viewport
   * (if necessary).
   * @param {PanIntoViewOptions} [panIntoViewOptions] Options for the pan action
   * @api
   */
  panIntoView(t) {
    const e = this.getMap();
    if (!e || !e.getTargetElement() || !this.get(nt.POSITION))
      return;
    const i = this.getRect(e.getTargetElement(), e.getSize()), n = this.getElement(), r = this.getRect(n, [
      Xl(n),
      Wl(n)
    ]);
    t = t || {};
    const o = t.margin === void 0 ? 20 : t.margin;
    if (!ce(i, r)) {
      const a = r[0] - i[0], l = i[2] - r[2], h = r[1] - i[1], c = i[3] - r[3], u = [0, 0];
      if (a < 0 ? u[0] = a - o : l < 0 && (u[0] = Math.abs(l) + o), h < 0 ? u[1] = h - o : c < 0 && (u[1] = Math.abs(c) + o), u[0] !== 0 || u[1] !== 0) {
        const d = (
          /** @type {import("./coordinate.js").Coordinate} */
          e.getView().getCenterInternal()
        ), f = e.getPixelFromCoordinateInternal(d);
        if (!f)
          return;
        const g = [f[0] + u[0], f[1] + u[1]], _ = t.animation || {};
        e.getView().animateInternal({
          center: e.getCoordinateFromPixelInternal(g),
          duration: _.duration,
          easing: _.easing
        });
      }
    }
  }
  /**
   * Get the extent of an element relative to the document
   * @param {HTMLElement} element The element.
   * @param {import("./size.js").Size} size The size of the element.
   * @return {import("./extent.js").Extent} The extent.
   * @protected
   */
  getRect(t, e) {
    const i = t.getBoundingClientRect(), n = i.left + window.pageXOffset, r = i.top + window.pageYOffset;
    return [n, r, n + e[0], r + e[1]];
  }
  /**
   * Set the positioning for this overlay.
   * @param {Positioning} positioning how the overlay is
   *     positioned relative to its point on the map.
   * @observable
   * @api
   */
  setPositioning(t) {
    this.set(nt.POSITIONING, t);
  }
  /**
   * Modify the visibility of the element.
   * @param {boolean} visible Element visibility.
   * @protected
   */
  setVisible(t) {
    this.rendered.visible !== t && (this.element.style.display = t ? "" : "none", this.rendered.visible = t);
  }
  /**
   * Update pixel position.
   * @protected
   */
  updatePixelPosition() {
    const t = this.getMap(), e = this.getPosition();
    if (!t || !t.isRendered() || !e) {
      this.setVisible(!1);
      return;
    }
    const i = t.getPixelFromCoordinate(e), n = t.getSize();
    this.updateRenderedPosition(i, n);
  }
  /**
   * @param {import("./pixel.js").Pixel} pixel The pixel location.
   * @param {import("./size.js").Size|undefined} mapSize The map size.
   * @protected
   */
  updateRenderedPosition(t, e) {
    const i = this.element.style, n = this.getOffset(), r = this.getPositioning();
    this.setVisible(!0);
    const o = Math.round(t[0] + n[0]) + "px", a = Math.round(t[1] + n[1]) + "px";
    let l = "0%", h = "0%";
    r == "bottom-right" || r == "center-right" || r == "top-right" ? l = "-100%" : (r == "bottom-center" || r == "center-center" || r == "top-center") && (l = "-50%"), r == "bottom-left" || r == "bottom-center" || r == "bottom-right" ? h = "-100%" : (r == "center-left" || r == "center-center" || r == "center-right") && (h = "-50%");
    const c = `translate(${l}, ${h}) translate(${o}, ${a})`;
    this.rendered.transform_ != c && (this.rendered.transform_ = c, i.transform = c);
  }
  /**
   * returns the options this Overlay has been created with
   * @return {Options} overlay options
   */
  getOptions() {
    return this.options;
  }
}
const id = ed, Or = "id", qe = "lon", Nn = "lat", Yi = "zoom", Bi = "marker", Gn = "log-position";
class nd extends HTMLElement {
  constructor() {
    super();
    const t = this.attachShadow({ mode: "open" }), e = document.createElement("div");
    e.setAttribute("class", "address-holder"), e.innerHTML = `
        <input type="text" class="address-input" />
        <button type="button" class="search-button">OK</button>
        `;
    const i = document.createElement("div");
    i.setAttribute("class", "popup"), i.innerHTML = `
          <slot name="popup-content"></slot>
        `;
    const n = document.createElement("div");
    n.setAttribute("class", "map-holder");
    const r = document.createElement("style");
    r.textContent = `
           :root{
            width: 100%;
            height: 100%;
           }

           .map-holder{
            width: 100%;
            height: 100%;
           }

           .address-holder{
            margin: 10px 0;
           }
        `, t.appendChild(r), t.appendChild(e), t.appendChild(i), t.appendChild(n), this.lon = 0, this.lat = 0, this.zoom = 14, this.marker = "images/icon.png", this.logPosition = !1;
  }
  reverseGeocode(t) {
    fetch(`https://nominatim.openstreetmap.org/reverse?lat=${t[1]}&lon=${t[0]}&format=json`).then((e) => e.json()).then((e) => {
      const i = new CustomEvent("address", {
        detail: {
          address: e
        }
      });
      this.dispatchEvent(i);
    }).catch((e) => console.log(e));
  }
  getGeocode(t) {
    t.trim() && fetch(`https://nominatim.openstreetmap.org/search?q=${t.split(" ").join("+")}&format=json`).then((e) => e.json()).then((e) => {
      const i = new CustomEvent("coordinates", {
        detail: {
          coordinates: e
        }
      });
      this.dispatchEvent(i);
    }).catch((e) => console.log(e));
  }
  connectedCallback() {
    try {
      const t = this.shadowRoot;
      this.hasAttribute(Or) ? this.id = this.getAttribute(Or) : this.id = "easy-it-map", this.hasAttribute(qe) && (this.lon = parseFloat(this.getAttribute(qe))), this.hasAttribute(qe) && (this.lat = parseFloat(this.getAttribute(Nn))), this.hasAttribute(Yi) && (this.zoom = parseInt(this.getAttribute(Yi))), this.hasAttribute(Bi) && (this.marker = this.getAttribute(Bi)), this.hasAttribute(Gn) && (this.logPosition = !0);
      const e = t.querySelector(".map-holder"), i = t.querySelector(".popup"), n = document.querySelector(`#${this.id} [slot=popup-content] .popup-closer`);
      if (e && this.lon && this.lat) {
        this.overlay = new id({
          element: i,
          autoPan: !0,
          autoPanAnimation: {
            duration: 250
          }
        }), n && n.addEventListener("click", (h) => (this.overlay.setPosition(void 0), n.getBoundingClientRect(), !1)), this.view = new wt({
          center: Fi([this.lon, this.lat]),
          zoom: this.zoom
        }), this.map = new jh({
          target: e,
          layers: [
            new _c({
              source: new td()
            })
          ],
          controls: [],
          view: this.view
        }), this.Marker = new wu({
          type: "icon",
          geometry: new ao(Fi([this.lon, this.lat]))
        });
        const r = new rn({
          image: new As({
            anchor: [0.5, 1],
            src: this.marker
          })
        }), o = new yu({
          source: new Su({
            features: [this.Marker]
          }),
          style: (h) => r
        });
        this.map.addOverlay(this.overlay), this.map.on("singleclick", (h) => {
          const c = h.coordinate;
          let u = !1;
          this.map.forEachFeatureAtPixel(h.pixel, (f, g) => {
            u || f && (this.overlay.setPosition(c), u = !0);
          }), u || this.overlay.setPosition(void 0);
          const d = qa(c);
          this.logPosition && console.log(`coordinate lon/lat ${d}`), this.reverseGeocode(d);
        }), this.map.addLayer(o), this.map.render();
        const a = t.querySelector(".address-input");
        t.querySelector(".search-button").addEventListener("click", (h) => {
          const c = a.value;
          c && this.getGeocode(c);
        });
      }
    } catch (t) {
    }
  }
  static get observedAttributes() {
    return [qe, Nn, Yi, Bi, Gn];
  }
  attributeChangedCallback(t, e, i) {
    t === qe && (this.lon = parseFloat(i)), t === Nn && (this.lat = parseFloat(i)), t === Yi && (this.zoom = parseInt(i)), t === Bi && (this.marker = i), t === Gn && (i === "true" ? this.logPosition = !0 : this.logPosition = !1), this.updatePosition();
  }
  updatePosition() {
    this.map && (this.view.setCenter(Fi([this.lon, this.lat])), this.view.setZoom(this.zoom), this.Marker && this.Marker.getGeometry().setCoordinates(Fi([this.lon, this.lat])));
  }
}
customElements.define("easy-it-map", nd);
