/*! For license information please see bundle.js.LICENSE.txt */
(()=>{"use strict";const t=globalThis,e=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),i=new WeakMap;class r{constructor(t,e,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const s=this.t;if(e&&void 0===t){const e=void 0!==s&&1===s.length;e&&(t=i.get(s)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&i.set(s,t))}return t}toString(){return this.cssText}}const a=(t,...e)=>{const i=1===t.length?t[0]:e.reduce(((e,s,i)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[i+1]),t[0]);return new r(i,t,s)},n=e?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return(t=>new r("string"==typeof t?t:t+"",void 0,s))(e)})(t):t,{is:o,defineProperty:c,getOwnPropertyDescriptor:l,getOwnPropertyNames:h,getOwnPropertySymbols:d,getPrototypeOf:u}=Object,p=globalThis,m=p.trustedTypes,g=m?m.emptyScript:"",_=p.reactiveElementPolyfillSupport,f=(t,e)=>t,b={toAttribute(t,e){switch(e){case Boolean:t=t?g:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let s=t;switch(e){case Boolean:s=null!==t;break;case Number:s=null===t?null:Number(t);break;case Object:case Array:try{s=JSON.parse(t)}catch(t){s=null}}return s}},y=(t,e)=>!o(t,e),v={attribute:!0,type:String,converter:b,reflect:!1,hasChanged:y};Symbol.metadata??=Symbol("metadata"),p.litPropertyMetadata??=new WeakMap;class $ extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=v){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);void 0!==i&&c(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:r}=l(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get(){return i?.call(this)},set(e){const a=i?.call(this);r.call(this,e),this.requestUpdate(t,a,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??v}static _$Ei(){if(this.hasOwnProperty(f("elementProperties")))return;const t=u(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(f("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(f("properties"))){const t=this.properties,e=[...h(t),...d(t)];for(const s of e)this.createProperty(s,t[s])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,s]of e)this.elementProperties.set(t,s)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const s=this._$Eu(t,e);void 0!==s&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const t of s)e.unshift(n(t))}else void 0!==t&&e.push(n(t));return e}static _$Eu(t,e){const s=e.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach((t=>t(this)))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const s=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((s,i)=>{if(e)s.adoptedStyleSheets=i.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet));else for(const e of i){const i=document.createElement("style"),r=t.litNonce;void 0!==r&&i.setAttribute("nonce",r),i.textContent=e.cssText,s.appendChild(i)}})(s,this.constructor.elementStyles),s}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach((t=>t.hostConnected?.()))}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach((t=>t.hostDisconnected?.()))}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$EC(t,e){const s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(void 0!==i&&!0===s.reflect){const r=(void 0!==s.converter?.toAttribute?s.converter:b).toAttribute(e,s.type);this._$Em=t,null==r?this.removeAttribute(i):this.setAttribute(i,r),this._$Em=null}}_$AK(t,e){const s=this.constructor,i=s._$Eh.get(t);if(void 0!==i&&this._$Em!==i){const t=s.getPropertyOptions(i),r="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:b;this._$Em=i,this[i]=r.fromAttribute(e,t.type),this._$Em=null}}requestUpdate(t,e,s){if(void 0!==t){if(s??=this.constructor.getPropertyOptions(t),!(s.hasChanged??y)(this[t],e))return;this.P(t,e,s)}!1===this.isUpdatePending&&(this._$ES=this._$ET())}P(t,e,s){this._$AL.has(t)||this._$AL.set(t,e),!0===s.reflect&&this._$Em!==t&&(this._$Ej??=new Set).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,s]of t)!0!==s.wrapped||this._$AL.has(e)||void 0===this[e]||this.P(e,this[e],s)}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach((t=>t.hostUpdate?.())),this.update(e)):this._$EU()}catch(e){throw t=!1,this._$EU(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach((t=>t.hostUpdated?.())),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&=this._$Ej.forEach((t=>this._$EC(t,this[t]))),this._$EU()}updated(t){}firstUpdated(t){}}$.elementStyles=[],$.shadowRootOptions={mode:"open"},$[f("elementProperties")]=new Map,$[f("finalized")]=new Map,_?.({ReactiveElement:$}),(p.reactiveElementVersions??=[]).push("2.0.4");const A=globalThis,S=A.trustedTypes,w=S?S.createPolicy("lit-html",{createHTML:t=>t}):void 0,E="$lit$",x=`lit$${Math.random().toFixed(9).slice(2)}$`,k="?"+x,P=`<${k}>`,C=document,O=()=>C.createComment(""),T=t=>null===t||"object"!=typeof t&&"function"!=typeof t,j=Array.isArray,U="[ \t\n\f\r]",q=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,H=/-->/g,I=/>/g,M=RegExp(`>|${U}(?:([^\\s"'>=/]+)(${U}*=${U}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),N=/'/g,R=/"/g,z=/^(?:script|style|textarea|title)$/i,D=t=>(e,...s)=>({_$litType$:t,strings:e,values:s}),B=D(1),L=(D(2),Symbol.for("lit-noChange")),F=Symbol.for("lit-nothing"),W=new WeakMap,V=C.createTreeWalker(C,129);function J(t,e){if(!Array.isArray(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==w?w.createHTML(e):e}const K=(t,e)=>{const s=t.length-1,i=[];let r,a=2===e?"<svg>":"",n=q;for(let e=0;e<s;e++){const s=t[e];let o,c,l=-1,h=0;for(;h<s.length&&(n.lastIndex=h,c=n.exec(s),null!==c);)h=n.lastIndex,n===q?"!--"===c[1]?n=H:void 0!==c[1]?n=I:void 0!==c[2]?(z.test(c[2])&&(r=RegExp("</"+c[2],"g")),n=M):void 0!==c[3]&&(n=M):n===M?">"===c[0]?(n=r??q,l=-1):void 0===c[1]?l=-2:(l=n.lastIndex-c[2].length,o=c[1],n=void 0===c[3]?M:'"'===c[3]?R:N):n===R||n===N?n=M:n===H||n===I?n=q:(n=M,r=void 0);const d=n===M&&t[e+1].startsWith("/>")?" ":"";a+=n===q?s+P:l>=0?(i.push(o),s.slice(0,l)+E+s.slice(l)+x+d):s+x+(-2===l?e:d)}return[J(t,a+(t[s]||"<?>")+(2===e?"</svg>":"")),i]};class Z{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let r=0,a=0;const n=t.length-1,o=this.parts,[c,l]=K(t,e);if(this.el=Z.createElement(c,s),V.currentNode=this.el.content,2===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(i=V.nextNode())&&o.length<n;){if(1===i.nodeType){if(i.hasAttributes())for(const t of i.getAttributeNames())if(t.endsWith(E)){const e=l[a++],s=i.getAttribute(t).split(x),n=/([.?@])?(.*)/.exec(e);o.push({type:1,index:r,name:n[2],strings:s,ctor:"."===n[1]?tt:"?"===n[1]?et:"@"===n[1]?st:Y}),i.removeAttribute(t)}else t.startsWith(x)&&(o.push({type:6,index:r}),i.removeAttribute(t));if(z.test(i.tagName)){const t=i.textContent.split(x),e=t.length-1;if(e>0){i.textContent=S?S.emptyScript:"";for(let s=0;s<e;s++)i.append(t[s],O()),V.nextNode(),o.push({type:2,index:++r});i.append(t[e],O())}}}else if(8===i.nodeType)if(i.data===k)o.push({type:2,index:r});else{let t=-1;for(;-1!==(t=i.data.indexOf(x,t+1));)o.push({type:7,index:r}),t+=x.length-1}r++}}static createElement(t,e){const s=C.createElement("template");return s.innerHTML=t,s}}function G(t,e,s=t,i){if(e===L)return e;let r=void 0!==i?s._$Co?.[i]:s._$Cl;const a=T(e)?void 0:e._$litDirective$;return r?.constructor!==a&&(r?._$AO?.(!1),void 0===a?r=void 0:(r=new a(t),r._$AT(t,s,i)),void 0!==i?(s._$Co??=[])[i]=r:s._$Cl=r),void 0!==r&&(e=G(t,r._$AS(t,e.values),r,i)),e}class Q{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=(t?.creationScope??C).importNode(e,!0);V.currentNode=i;let r=V.nextNode(),a=0,n=0,o=s[0];for(;void 0!==o;){if(a===o.index){let e;2===o.type?e=new X(r,r.nextSibling,this,t):1===o.type?e=new o.ctor(r,o.name,o.strings,this,t):6===o.type&&(e=new it(r,this,t)),this._$AV.push(e),o=s[++n]}a!==o?.index&&(r=V.nextNode(),a++)}return V.currentNode=C,i}p(t){let e=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class X{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=F,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=G(this,t,e),T(t)?t===F||null==t||""===t?(this._$AH!==F&&this._$AR(),this._$AH=F):t!==this._$AH&&t!==L&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>j(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}S(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.S(t))}_(t){this._$AH!==F&&T(this._$AH)?this._$AA.nextSibling.data=t:this.T(C.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:s}=t,i="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=Z.createElement(J(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(e);else{const t=new Q(i,this),s=t.u(this.options);t.p(e),this.T(s),this._$AH=t}}_$AC(t){let e=W.get(t.strings);return void 0===e&&W.set(t.strings,e=new Z(t)),e}k(t){j(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const r of t)i===e.length?e.push(s=new X(this.S(O()),this.S(O()),this,this.options)):s=e[i],s._$AI(r),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t&&t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class Y{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,r){this.type=1,this._$AH=F,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=r,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=F}_$AI(t,e=this,s,i){const r=this.strings;let a=!1;if(void 0===r)t=G(this,t,e,0),a=!T(t)||t!==this._$AH&&t!==L,a&&(this._$AH=t);else{const i=t;let n,o;for(t=r[0],n=0;n<r.length-1;n++)o=G(this,i[s+n],e,n),o===L&&(o=this._$AH[n]),a||=!T(o)||o!==this._$AH[n],o===F?t=F:t!==F&&(t+=(o??"")+r[n+1]),this._$AH[n]=o}a&&!i&&this.j(t)}j(t){t===F?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class tt extends Y{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===F?void 0:t}}class et extends Y{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==F)}}class st extends Y{constructor(t,e,s,i,r){super(t,e,s,i,r),this.type=5}_$AI(t,e=this){if((t=G(this,t,e,0)??F)===L)return;const s=this._$AH,i=t===F&&s!==F||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,r=t!==F&&(s===F||i);i&&this.element.removeEventListener(this.name,this,s),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class it{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){G(this,t)}}const rt=A.litHtmlPolyfillSupport;rt?.(Z,X),(A.litHtmlVersions??=[]).push("3.1.4");class at extends ${constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,s)=>{const i=s?.renderBefore??e;let r=i._$litPart$;if(void 0===r){const t=s?.renderBefore??null;i._$litPart$=r=new X(e.insertBefore(O(),t),t,void 0,s??{})}return r._$AI(t),r})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return L}}at._$litElement$=!0,at.finalized=!0,globalThis.litElementHydrateSupport?.({LitElement:at});const nt=globalThis.litElementPolyfillSupport;nt?.({LitElement:at}),(globalThis.litElementVersions??=[]).push("4.0.6");const ot=t=>(e,s)=>{void 0!==s?s.addInitializer((()=>{customElements.define(t,e)})):customElements.define(t,e)},ct={attribute:!0,type:String,converter:b,reflect:!1,hasChanged:y},lt=(t=ct,e,s)=>{const{kind:i,metadata:r}=s;let a=globalThis.litPropertyMetadata.get(r);if(void 0===a&&globalThis.litPropertyMetadata.set(r,a=new Map),a.set(s.name,t),"accessor"===i){const{name:i}=s;return{set(s){const r=e.get.call(this);e.set.call(this,s),this.requestUpdate(i,r,t)},init(e){return void 0!==e&&this.P(i,void 0,t),e}}}if("setter"===i){const{name:i}=s;return function(s){const r=this[i];e.call(this,s),this.requestUpdate(i,r,t)}}throw Error("Unsupported decorator location: "+i)};function ht(t){return(e,s)=>"object"==typeof s?lt(t,e,s):((t,e,s)=>{const i=e.hasOwnProperty(s);return e.constructor.createProperty(s,i?{...t,wrapped:!0}:t),i?Object.getOwnPropertyDescriptor(e,s):void 0})(t,e,s)}const dt=(t,e,s)=>(s.configurable=!0,s.enumerable=!0,Reflect.decorate&&"object"!=typeof e&&Object.defineProperty(t,e,s),s);function ut(t,e){return(s,i,r)=>{const a=e=>e.renderRoot?.querySelector(t)??null;if(e){const{get:t,set:e}="object"==typeof i?s:r??(()=>{const t=Symbol();return{get(){return this[t]},set(e){this[t]=e}}})();return dt(s,i,{get(){let s=t.call(this);return void 0===s&&(s=a(this),(null!==s||this.hasUpdated)&&e.call(this,s)),s}})}return dt(s,i,{get(){return a(this)}})}}function pt(t){return(e,s)=>{const{slot:i,selector:r}=t??{},a="slot"+(i?`[name=${i}]`:":not([name])");return dt(e,s,{get(){const e=this.renderRoot?.querySelector(a),s=e?.assignedElements(t)??[];return void 0===r?s:s.filter((t=>t.matches(r)))}})}}const mt=a`
  span.ripple {
    position: absolute;
    border-radius: 50%;
    transform: scale(0);
    animation: ripple 600ms linear;
    background-color: rgba(255, 255, 255, 0.7);
  }

  @keyframes ripple {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
`;function gt(t){const e=t.currentTarget,s=document.createElement("span"),i=Math.max(e.clientWidth,e.clientHeight),r=i/2;s.style.width=s.style.height=`${i}px`,s.style.left=t.clientX-(e.offsetLeft+r)+"px",s.style.top=t.clientY-(e.offsetTop+r)+"px",s.classList.add("ripple");const a=e.getElementsByClassName("ripple")[0];a&&a.remove(),e.appendChild(s)}var _t=function(t,e,s,i,r,a){function n(t){if(void 0!==t&&"function"!=typeof t)throw new TypeError("Function expected");return t}for(var o,c=i.kind,l="getter"===c?"get":"setter"===c?"set":"value",h=!e&&t?i.static?t:t.prototype:null,d=e||(h?Object.getOwnPropertyDescriptor(h,i.name):{}),u=!1,p=s.length-1;p>=0;p--){var m={};for(var g in i)m[g]="access"===g?{}:i[g];for(var g in i.access)m.access[g]=i.access[g];m.addInitializer=function(t){if(u)throw new TypeError("Cannot add initializers after decoration has completed");a.push(n(t||null))};var _=(0,s[p])("accessor"===c?{get:d.get,set:d.set}:d[l],m);if("accessor"===c){if(void 0===_)continue;if(null===_||"object"!=typeof _)throw new TypeError("Object expected");(o=n(_.get))&&(d.get=o),(o=n(_.set))&&(d.set=o),(o=n(_.init))&&r.unshift(o)}else(o=n(_))&&("field"===c?r.unshift(o):d[l]=o)}h&&Object.defineProperty(h,i.name,d),u=!0},ft=function(t,e,s){for(var i=arguments.length>2,r=0;r<e.length;r++)s=i?e[r].call(t,s):e[r].call(t);return i?s:void 0};(()=>{let t,e,s,i,r,n,o=[ot("action-button")],c=[],l=at,h=[],d=[],u=[],p=[],m=[],g=[],_=[],f=[];(class extends l{static{e=this}static{const a="function"==typeof Symbol&&Symbol.metadata?Object.create(l[Symbol.metadata]??null):void 0;s=[ht({type:String})],i=[ht({type:String})],r=[ht({type:ElementInternals})],n=[ut("button")],_t(this,null,s,{kind:"accessor",name:"type",static:!1,private:!1,access:{has:t=>"type"in t,get:t=>t.type,set:(t,e)=>{t.type=e}},metadata:a},h,d),_t(this,null,i,{kind:"accessor",name:"form",static:!1,private:!1,access:{has:t=>"form"in t,get:t=>t.form,set:(t,e)=>{t.form=e}},metadata:a},u,p),_t(this,null,r,{kind:"accessor",name:"internals",static:!1,private:!1,access:{has:t=>"internals"in t,get:t=>t.internals,set:(t,e)=>{t.internals=e}},metadata:a},m,g),_t(this,null,n,{kind:"accessor",name:"_buttonElement",static:!1,private:!1,access:{has:t=>"_buttonElement"in t,get:t=>t._buttonElement,set:(t,e)=>{t._buttonElement=e}},metadata:a},_,f),_t(null,t={value:e},o,{kind:"class",name:e.name,metadata:a},null,c),e=t.value,a&&Object.defineProperty(e,Symbol.metadata,{enumerable:!0,configurable:!0,writable:!0,value:a})}static styles=a`
    .button {
      position: relative;
      outline: 0px;
      border: 0px;
      border-radius: 6px;
      padding: 10px 25px;
      background-color: var(--theme-primary-color);
      font-size: 15pt;
      overflow: hidden;
      color: #fff;
      box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.3);
      transition: background 400ms;
      cursor: pointer;
    }

    ${mt}
  `;#t=ft(this,h,"button");get type(){return this.#t}set type(t){this.#t=t}#e=(ft(this,d),ft(this,u,""));get form(){return this.#e}set form(t){this.#e=t}#s=(ft(this,p),ft(this,m,void 0));get internals(){return this.#s}set internals(t){this.#s=t}#i=(ft(this,g),ft(this,_,void 0));get _buttonElement(){return this.#i}set _buttonElement(t){this.#i=t}handleClick(t){gt(t),"submit"===this.type&&this.internals.form.requestSubmit()}static get formAssociated(){return!0}constructor(){super(),ft(this,f),this.internals=this.attachInternals()}render(){return B`
      <button class="button" type="${this.type}" @click=${this.handleClick} form=${this.form}>
        <slot></slot>
      </button>
    `}static{ft(e,c)}})})();var bt=function(t,e,s,i,r,a){function n(t){if(void 0!==t&&"function"!=typeof t)throw new TypeError("Function expected");return t}for(var o,c=i.kind,l="getter"===c?"get":"setter"===c?"set":"value",h=!e&&t?i.static?t:t.prototype:null,d=e||(h?Object.getOwnPropertyDescriptor(h,i.name):{}),u=!1,p=s.length-1;p>=0;p--){var m={};for(var g in i)m[g]="access"===g?{}:i[g];for(var g in i.access)m.access[g]=i.access[g];m.addInitializer=function(t){if(u)throw new TypeError("Cannot add initializers after decoration has completed");a.push(n(t||null))};var _=(0,s[p])("accessor"===c?{get:d.get,set:d.set}:d[l],m);if("accessor"===c){if(void 0===_)continue;if(null===_||"object"!=typeof _)throw new TypeError("Object expected");(o=n(_.get))&&(d.get=o),(o=n(_.set))&&(d.set=o),(o=n(_.init))&&r.unshift(o)}else(o=n(_))&&("field"===c?r.unshift(o):d[l]=o)}h&&Object.defineProperty(h,i.name,d),u=!0},yt=function(t,e,s){for(var i=arguments.length>2,r=0;r<e.length;r++)s=i?e[r].call(t,s):e[r].call(t);return i?s:void 0};(()=>{let t,e,s,i,r,n,o,c,l,h,d,u=[ot("outlined-text-field")],p=[],m=at,g=[],_=[],f=[],b=[],y=[],v=[],$=[],A=[],S=[],w=[],E=[],x=[],k=[],P=[],C=[],O=[],T=[],j=[];(class extends m{static{e=this}static{const a="function"==typeof Symbol&&Symbol.metadata?Object.create(m[Symbol.metadata]??null):void 0;s=[ht({type:String})],i=[ht({type:String})],r=[ht({type:String,attribute:"suffix-text"})],n=[ht({type:Boolean,reflect:!0})],o=[ht({type:Boolean,reflect:!0})],c=[ht({type:String})],l=[ht({type:String})],h=[ht({type:String})],d=[ut("input")],bt(this,null,s,{kind:"accessor",name:"placeholder",static:!1,private:!1,access:{has:t=>"placeholder"in t,get:t=>t.placeholder,set:(t,e)=>{t.placeholder=e}},metadata:a},g,_),bt(this,null,i,{kind:"accessor",name:"width",static:!1,private:!1,access:{has:t=>"width"in t,get:t=>t.width,set:(t,e)=>{t.width=e}},metadata:a},f,b),bt(this,null,r,{kind:"accessor",name:"suffixText",static:!1,private:!1,access:{has:t=>"suffixText"in t,get:t=>t.suffixText,set:(t,e)=>{t.suffixText=e}},metadata:a},y,v),bt(this,null,n,{kind:"accessor",name:"disabled",static:!1,private:!1,access:{has:t=>"disabled"in t,get:t=>t.disabled,set:(t,e)=>{t.disabled=e}},metadata:a},$,A),bt(this,null,o,{kind:"accessor",name:"required",static:!1,private:!1,access:{has:t=>"required"in t,get:t=>t.required,set:(t,e)=>{t.required=e}},metadata:a},S,w),bt(this,null,c,{kind:"accessor",name:"type",static:!1,private:!1,access:{has:t=>"type"in t,get:t=>t.type,set:(t,e)=>{t.type=e}},metadata:a},E,x),bt(this,null,l,{kind:"accessor",name:"value",static:!1,private:!1,access:{has:t=>"value"in t,get:t=>t.value,set:(t,e)=>{t.value=e}},metadata:a},k,P),bt(this,null,h,{kind:"accessor",name:"name",static:!1,private:!1,access:{has:t=>"name"in t,get:t=>t.name,set:(t,e)=>{t.name=e}},metadata:a},C,O),bt(this,null,d,{kind:"accessor",name:"_input",static:!1,private:!1,access:{has:t=>"_input"in t,get:t=>t._input,set:(t,e)=>{t._input=e}},metadata:a},T,j),bt(null,t={value:e},u,{kind:"class",name:e.name,metadata:a},null,p),e=t.value,a&&Object.defineProperty(e,Symbol.metadata,{enumerable:!0,configurable:!0,writable:!0,value:a})}static styles=a`
    .container {
      display: flex;
      border: 2px solid;
      border-radius: 8px;
      border-color: var(--theme-primary-color);
      background-color: transparent;
      margin-top: 6px;
      height: 48px;
      position: relative;
      transition: border-color 400ms ease,
        background-color 400ms ease;
      &:has(input:disabled) {
        border-color: black;
        background-color: lightgray;
      }
    }

    input {
      font-size: 11pt;
      flex-grow: 1;
      border: none;
      padding: 2px 15px;
      color: #696158;
      padding-right: 15px;
      padding-left: 15px;
      border-radius: 8px;
      &:focus {
        outline: none;
      }
    }

    label {
      font-size: 14pt;
      font-weight: normal;
      position: absolute;
      pointer-events: none;
      left: 15px;
      top: 13px;
      transition: all 0.1s ease;
      background-color: transparent;
      padding-right: 0.3em;
      padding-left: 0.3em;
      display: flex;
      justify-content: center;
    }

    input:focus ~ label, input:not(:placeholder-shown) ~ label {
      top: -7px;
      font-size: 11pt;
      font-color: gray;
      background-color: white;
    }

    input:required {
      box-shadow: none;
    }
  `;#r=yt(this,g,"");get placeholder(){return this.#r}set placeholder(t){this.#r=t}#a=(yt(this,_),yt(this,f,"300px"));get width(){return this.#a}set width(t){this.#a=t}#n=(yt(this,b),yt(this,y,""));get suffixText(){return this.#n}set suffixText(t){this.#n=t}#o=(yt(this,v),yt(this,$,!1));get disabled(){return this.#o}set disabled(t){this.#o=t}#c=(yt(this,A),yt(this,S,!1));get required(){return this.#c}set required(t){this.#c=t}#t=(yt(this,w),yt(this,E,"text"));get type(){return this.#t}set type(t){this.#t=t}#l=(yt(this,x),yt(this,k,""));get value(){return this.#l}set value(t){this.#l=t}#h=(yt(this,P),yt(this,C,""));get name(){return this.#h}set name(t){this.#h=t}#d=(yt(this,O),yt(this,T,void 0));get _input(){return this.#d}set _input(t){this.#d=t}constructor(){super(),yt(this,j)}_handleChange(t){this.value=t.target.value}render(){return B`
      <div class="container">
        <!-- There is a space character as a placeholder, which is slightly hacky, but works with the css :placeholder-shown -->
        <input type=${this.type} placeholder=" "
          ?disabled="${this.disabled}"
          ?required="${this.required}"
          name=${this.name}
          @change=${this._handleChange}/>
        <label>${this.placeholder}</label>
      </div>
    `}static{yt(e,p)}})})();var vt=function(t,e,s,i,r,a){function n(t){if(void 0!==t&&"function"!=typeof t)throw new TypeError("Function expected");return t}for(var o,c=i.kind,l="getter"===c?"get":"setter"===c?"set":"value",h=!e&&t?i.static?t:t.prototype:null,d=e||(h?Object.getOwnPropertyDescriptor(h,i.name):{}),u=!1,p=s.length-1;p>=0;p--){var m={};for(var g in i)m[g]="access"===g?{}:i[g];for(var g in i.access)m.access[g]=i.access[g];m.addInitializer=function(t){if(u)throw new TypeError("Cannot add initializers after decoration has completed");a.push(n(t||null))};var _=(0,s[p])("accessor"===c?{get:d.get,set:d.set}:d[l],m);if("accessor"===c){if(void 0===_)continue;if(null===_||"object"!=typeof _)throw new TypeError("Object expected");(o=n(_.get))&&(d.get=o),(o=n(_.set))&&(d.set=o),(o=n(_.init))&&r.unshift(o)}else(o=n(_))&&("field"===c?r.unshift(o):d[l]=o)}h&&Object.defineProperty(h,i.name,d),u=!0},$t=function(t,e,s){for(var i=arguments.length>2,r=0;r<e.length;r++)s=i?e[r].call(t,s):e[r].call(t);return i?s:void 0};(()=>{let t,e,s,i,r,n,o,c,l,h,d,u=[ot("form-question")],p=[],m=at,g=[],_=[],f=[],b=[],y=[],v=[],$=[],A=[],S=[],w=[],E=[],x=[],k=[],P=[],C=[],O=[],T=[],j=[];(class extends m{static{e=this}static{const a="function"==typeof Symbol&&Symbol.metadata?Object.create(m[Symbol.metadata]??null):void 0;s=[ht({type:String})],i=[ht({type:String})],r=[ht({type:String})],n=[ht({type:Boolean})],o=[ht({type:String})],c=[ht({type:String})],l=[ht({type:Boolean})],h=[ht({type:ElementInternals})],d=[ut("outlined-text-field")],vt(this,null,s,{kind:"accessor",name:"type",static:!1,private:!1,access:{has:t=>"type"in t,get:t=>t.type,set:(t,e)=>{t.type=e}},metadata:a},g,_),vt(this,null,i,{kind:"accessor",name:"name",static:!1,private:!1,access:{has:t=>"name"in t,get:t=>t.name,set:(t,e)=>{t.name=e}},metadata:a},f,b),vt(this,null,r,{kind:"accessor",name:"id",static:!1,private:!1,access:{has:t=>"id"in t,get:t=>t.id,set:(t,e)=>{t.id=e}},metadata:a},y,v),vt(this,null,n,{kind:"accessor",name:"required",static:!1,private:!1,access:{has:t=>"required"in t,get:t=>t.required,set:(t,e)=>{t.required=e}},metadata:a},$,A),vt(this,null,o,{kind:"accessor",name:"label",static:!1,private:!1,access:{has:t=>"label"in t,get:t=>t.label,set:(t,e)=>{t.label=e}},metadata:a},S,w),vt(this,null,c,{kind:"accessor",name:"domain",static:!1,private:!1,access:{has:t=>"domain"in t,get:t=>t.domain,set:(t,e)=>{t.domain=e}},metadata:a},E,x),vt(this,null,l,{kind:"accessor",name:"disabled",static:!1,private:!1,access:{has:t=>"disabled"in t,get:t=>t.disabled,set:(t,e)=>{t.disabled=e}},metadata:a},k,P),vt(this,null,h,{kind:"accessor",name:"internals",static:!1,private:!1,access:{has:t=>"internals"in t,get:t=>t.internals,set:(t,e)=>{t.internals=e}},metadata:a},C,O),vt(this,null,d,{kind:"accessor",name:"_input",static:!1,private:!1,access:{has:t=>"_input"in t,get:t=>t._input,set:(t,e)=>{t._input=e}},metadata:a},T,j),vt(null,t={value:e},u,{kind:"class",name:e.name,metadata:a},null,p),e=t.value,a&&Object.defineProperty(e,Symbol.metadata,{enumerable:!0,configurable:!0,writable:!0,value:a})}static styles=a`
    div {
      display: flex;
      flex-direction: column;
      margin: 10px;
      margin-bottom: 30px;
      backrgound-color: inherit;
    }
  `;#t=$t(this,g,"");get type(){return this.#t}set type(t){this.#t=t}#h=($t(this,_),$t(this,f,""));get name(){return this.#h}set name(t){this.#h=t}#u=($t(this,b),$t(this,y,""));get id(){return this.#u}set id(t){this.#u=t}#c=($t(this,v),$t(this,$,!1));get required(){return this.#c}set required(t){this.#c=t}#p=($t(this,A),$t(this,S,""));get label(){return this.#p}set label(t){this.#p=t}#m=($t(this,w),$t(this,E,""));get domain(){return this.#m}set domain(t){this.#m=t}#o=($t(this,x),$t(this,k,!1));get disabled(){return this.#o}set disabled(t){this.#o=t}#s=($t(this,P),$t(this,C,void 0));get internals(){return this.#s}set internals(t){this.#s=t}#d=($t(this,O),$t(this,T,void 0));get _input(){return this.#d}set _input(t){this.#d=t}constructor(){super(),$t(this,j),this.internals=this.attachInternals()}get value(){return this._input.value}render(){return B`
      <div>
        <label for=${this.name}><h3><slot></slot></h3></label>
        <outlined-text-field
          placeholder=${this.label}
          ?disabled=${this.disabled}
          ?required=${this.required}
          name=${this.name}
          suffix-text=${this.domain}
          type=${this.type}
          id=${this.id}
        ></outlined-text-field>
      </div>
    `}static{$t(e,p)}})})(),(()=>{let t,e,s,i,r,n,o,c=[ot("form-section")],l=[],h=at,d=[],u=[],p=[],m=[],g=[],_=[],f=[],b=[],y=[],v=[];(class extends h{static{e=this}static{const a="function"==typeof Symbol&&Symbol.metadata?Object.create(h[Symbol.metadata]??null):void 0;s=[ht({type:String})],i=[ht({type:String})],r=[ht({type:String})],n=[ut("form")],o=[pt({selector:"form-question",flatten:!0})],vt(this,null,s,{kind:"accessor",name:"header",static:!1,private:!1,access:{has:t=>"header"in t,get:t=>t.header,set:(t,e)=>{t.header=e}},metadata:a},d,u),vt(this,null,i,{kind:"accessor",name:"name",static:!1,private:!1,access:{has:t=>"name"in t,get:t=>t.name,set:(t,e)=>{t.name=e}},metadata:a},p,m),vt(this,null,r,{kind:"accessor",name:"id",static:!1,private:!1,access:{has:t=>"id"in t,get:t=>t.id,set:(t,e)=>{t.id=e}},metadata:a},g,_),vt(this,null,n,{kind:"accessor",name:"_formElement",static:!1,private:!1,access:{has:t=>"_formElement"in t,get:t=>t._formElement,set:(t,e)=>{t._formElement=e}},metadata:a},f,b),vt(this,null,o,{kind:"accessor",name:"_questions",static:!1,private:!1,access:{has:t=>"_questions"in t,get:t=>t._questions,set:(t,e)=>{t._questions=e}},metadata:a},y,v),vt(null,t={value:e},c,{kind:"class",name:e.name,metadata:a},null,l),e=t.value,a&&Object.defineProperty(e,Symbol.metadata,{enumerable:!0,configurable:!0,writable:!0,value:a})}static styles=a`
    div {
      border-radius: 7px;
      background-color: inherit;
      box-shadow: 0 0 6px rgb(173, 170, 179);
      padding: 20px;
      margin-left: auto;
      margin-right: auto;
      width: 800px;
    }

    h1 {
      margin: 10px;
      margin-top: 15px;
    }

    action-button {
      margin: 10px;
    }
  `;#g=$t(this,d,"");get header(){return this.#g}set header(t){this.#g=t}#h=($t(this,u),$t(this,p,""));get name(){return this.#h}set name(t){this.#h=t}#u=($t(this,m),$t(this,g,""));get id(){return this.#u}set id(t){this.#u=t}#_=($t(this,_),$t(this,f,void 0));get _formElement(){return this.#_}set _formElement(t){this.#_=t}#f=($t(this,b),$t(this,y,void 0));get _questions(){return this.#f}set _questions(t){this.#f=t}disableForm(){this._questions.forEach((t=>{t.setAttribute("disabled","true")}))}enableForm(){this._questions.forEach((t=>{t.removeAttribute("disabled")}))}handleForm(t){t.preventDefault(),console.log("Attempting to submit form.");const e=new FormData;e.append("formId",this._formElement.id);const s=this._questions;console.log(s),console.log(`Got ${s.length} questions, printing values.`);for(let t=0;t<s.length;t++){const i=s[t];console.log(`Found user input control: ${i}`),console.log(`Assumed value: ${i.value}`),console.log(`Question ID: ${i.name}`),e.append(i.name,i.value)}console.log(`Built FormData object: ${JSON.stringify(Object.fromEntries(e))}`),this.disableForm(),google.script.run.withSuccessHandler((()=>{console.log("SUCCESS")})).withFailureHandler((()=>{console.log("FAILED")})).processForm(JSON.stringify(Object.fromEntries(e))),this.enableForm()}render(){return B`
      <div>
        <!-- Create a box that contains our form. -->
        <h1>${this.header}</h1>
        <hr>
        <form id="formIdHere" name="${this.name}" @submit="${this.handleForm}">
          <slot></slot>
          <action-button type="submit" form="formIdHere">Submit</action-button>
        </form>
      </div>
    `}constructor(){super(...arguments),$t(this,v)}static{$t(e,l)}})})();class At{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,s){this._$Ct=t,this._$AM=e,this._$Ci=s}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}}const St=(wt=class extends At{constructor(t){if(super(t),1!==t.type||"class"!==t.name||t.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(t){return" "+Object.keys(t).filter((e=>t[e])).join(" ")+" "}update(t,[e]){if(void 0===this.st){this.st=new Set,void 0!==t.strings&&(this.nt=new Set(t.strings.join(" ").split(/\s/).filter((t=>""!==t))));for(const t in e)e[t]&&!this.nt?.has(t)&&this.st.add(t);return this.render(e)}const s=t.element.classList;for(const t of this.st)t in e||(s.remove(t),this.st.delete(t));for(const t in e){const i=!!e[t];i===this.st.has(t)||this.nt?.has(t)||(i?(s.add(t),this.st.add(t)):(s.remove(t),this.st.delete(t)))}return L}},(...t)=>({_$litDirective$:wt,values:t}));var wt,Et=function(t,e,s,i,r,a){function n(t){if(void 0!==t&&"function"!=typeof t)throw new TypeError("Function expected");return t}for(var o,c=i.kind,l="getter"===c?"get":"setter"===c?"set":"value",h=!e&&t?i.static?t:t.prototype:null,d=e||(h?Object.getOwnPropertyDescriptor(h,i.name):{}),u=!1,p=s.length-1;p>=0;p--){var m={};for(var g in i)m[g]="access"===g?{}:i[g];for(var g in i.access)m.access[g]=i.access[g];m.addInitializer=function(t){if(u)throw new TypeError("Cannot add initializers after decoration has completed");a.push(n(t||null))};var _=(0,s[p])("accessor"===c?{get:d.get,set:d.set}:d[l],m);if("accessor"===c){if(void 0===_)continue;if(null===_||"object"!=typeof _)throw new TypeError("Object expected");(o=n(_.get))&&(d.get=o),(o=n(_.set))&&(d.set=o),(o=n(_.init))&&r.unshift(o)}else(o=n(_))&&("field"===c?r.unshift(o):d[l]=o)}h&&Object.defineProperty(h,i.name,d),u=!0},xt=function(t,e,s){for(var i=arguments.length>2,r=0;r<e.length;r++)s=i?e[r].call(t,s):e[r].call(t);return i?s:void 0};(()=>{let t,e,s,i,r=[ot("tab-bar")],n=[],o=at,c=[],l=[],h=[],d=[];(class extends o{static{e=this}static{const a="function"==typeof Symbol&&Symbol.metadata?Object.create(o[Symbol.metadata]??null):void 0;s=[ht({type:String})],i=[pt({selector:"tab"})],Et(this,null,s,{kind:"accessor",name:"test",static:!1,private:!1,access:{has:t=>"test"in t,get:t=>t.test,set:(t,e)=>{t.test=e}},metadata:a},c,l),Et(this,null,i,{kind:"accessor",name:"tabs",static:!1,private:!1,access:{has:t=>"tabs"in t,get:t=>t.tabs,set:(t,e)=>{t.tabs=e}},metadata:a},h,d),Et(null,t={value:e},r,{kind:"class",name:e.name,metadata:a},null,n),e=t.value,a&&Object.defineProperty(e,Symbol.metadata,{enumerable:!0,configurable:!0,writable:!0,value:a})}static styles=a`
    slot[name=tab]::slotted("tab"):disabled {
      
    }

    slot[name=panel]::slotted(*) .active {
      
    }
  `;#b=xt(this,c,"");get test(){return this.#b}set test(t){this.#b=t}#y=(xt(this,l),xt(this,h,void 0));get tabs(){return this.#y}set tabs(t){this.#y=t}render(){return B`
      <div>
        <!-- We must be able to query and get events from the elements within the -->
        <!-- shadow DOM. This will allow us to show the correct TabPanel elements. -->
        <slot name="tab"></slot>
        <slot name="panel"></slot>
      </div>
    `}constructor(){super(...arguments),xt(this,d)}static{xt(e,n)}})})(),(()=>{let t,e,s,i,r=[ot("custom-tab")],n=[],o=at,c=[],l=[],h=[],d=[];(class extends o{static{e=this}static{const a="function"==typeof Symbol&&Symbol.metadata?Object.create(o[Symbol.metadata]??null):void 0;s=[ht({type:String,attribute:"panel-id"})],i=[ht({type:Boolean,reflect:!0})],Et(this,null,s,{kind:"accessor",name:"panelId",static:!1,private:!1,access:{has:t=>"panelId"in t,get:t=>t.panelId,set:(t,e)=>{t.panelId=e}},metadata:a},c,l),Et(this,null,i,{kind:"accessor",name:"disabled",static:!1,private:!1,access:{has:t=>"disabled"in t,get:t=>t.disabled,set:(t,e)=>{t.disabled=e}},metadata:a},h,d),Et(null,t={value:e},r,{kind:"class",name:e.name,metadata:a},null,n),e=t.value,a&&Object.defineProperty(e,Symbol.metadata,{enumerable:!0,configurable:!0,writable:!0,value:a})}static styles=a`
    .button {
      width: 100px;
      position: relative;
      overflow: hidden;
      transition: background-color 400ms ease;
      user-select: none;
      &:hover {
        background-color: lightgray;
      }
      &.disabled {
        background-color: gray;
        pointer-events: none;
      }
    }

    ${mt}
  `;#v=xt(this,c,"");get panelId(){return this.#v}set panelId(t){this.#v=t}#o=(xt(this,l),xt(this,h,!1));get disabled(){return this.#o}set disabled(t){this.#o=t}_internals=(xt(this,d),this.attachInternals);render(){return B`
      <!-- This is essentially a customized button. -->
      <div
        class="${St({button:!0,disabled:this.disabled})}"
        role="tab"
        @click=${this._handleClick}>
        <!-- Define where text and/or icons will appear. -->
        <slot name="icon"></slot>
        <slot>
          <!-- This is where our label content will go. -->
          <!-- Material Design has @slotchange here, but I don't know what that's for. -->
        </slot>
      </div>
    `}_handleClick(t){t.stopPropagation(),this.click(),gt(t)}static{xt(e,n)}})})()})();