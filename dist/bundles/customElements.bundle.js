/*! For license information please see customElements.bundle.js.LICENSE.txt */
(()=>{"use strict";const t=globalThis,e=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),r=new WeakMap;class o{constructor(t,e,r){if(this._$cssResult$=!0,r!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const s=this.t;if(e&&void 0===t){const e=void 0!==s&&1===s.length;e&&(t=r.get(s)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&r.set(s,t))}return t}toString(){return this.cssText}}const i=(t,...e)=>{const r=1===t.length?t[0]:e.reduce(((e,s,r)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[r+1]),t[0]);return new o(r,t,s)},n=e?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return(t=>new o("string"==typeof t?t:t+"",void 0,s))(e)})(t):t,{is:a,defineProperty:l,getOwnPropertyDescriptor:c,getOwnPropertyNames:h,getOwnPropertySymbols:d,getPrototypeOf:p}=Object,u=globalThis,_=u.trustedTypes,g=_?_.emptyScript:"",f=u.reactiveElementPolyfillSupport,m=(t,e)=>t,y={toAttribute(t,e){switch(e){case Boolean:t=t?g:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let s=t;switch(e){case Boolean:s=null!==t;break;case Number:s=null===t?null:Number(t);break;case Object:case Array:try{s=JSON.parse(t)}catch(t){s=null}}return s}},b=(t,e)=>!a(t,e),$={attribute:!0,type:String,converter:y,reflect:!1,hasChanged:b};Symbol.metadata??=Symbol("metadata"),u.litPropertyMetadata??=new WeakMap;class v extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=$){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),r=this.getPropertyDescriptor(t,s,e);void 0!==r&&l(this.prototype,t,r)}}static getPropertyDescriptor(t,e,s){const{get:r,set:o}=c(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get(){return r?.call(this)},set(e){const i=r?.call(this);o.call(this,e),this.requestUpdate(t,i,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??$}static _$Ei(){if(this.hasOwnProperty(m("elementProperties")))return;const t=p(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(m("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(m("properties"))){const t=this.properties,e=[...h(t),...d(t)];for(const s of e)this.createProperty(s,t[s])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,s]of e)this.elementProperties.set(t,s)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const s=this._$Eu(t,e);void 0!==s&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const t of s)e.unshift(n(t))}else void 0!==t&&e.push(n(t));return e}static _$Eu(t,e){const s=e.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach((t=>t(this)))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const s=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((s,r)=>{if(e)s.adoptedStyleSheets=r.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet));else for(const e of r){const r=document.createElement("style"),o=t.litNonce;void 0!==o&&r.setAttribute("nonce",o),r.textContent=e.cssText,s.appendChild(r)}})(s,this.constructor.elementStyles),s}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach((t=>t.hostConnected?.()))}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach((t=>t.hostDisconnected?.()))}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$EC(t,e){const s=this.constructor.elementProperties.get(t),r=this.constructor._$Eu(t,s);if(void 0!==r&&!0===s.reflect){const o=(void 0!==s.converter?.toAttribute?s.converter:y).toAttribute(e,s.type);this._$Em=t,null==o?this.removeAttribute(r):this.setAttribute(r,o),this._$Em=null}}_$AK(t,e){const s=this.constructor,r=s._$Eh.get(t);if(void 0!==r&&this._$Em!==r){const t=s.getPropertyOptions(r),o="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:y;this._$Em=r,this[r]=o.fromAttribute(e,t.type),this._$Em=null}}requestUpdate(t,e,s){if(void 0!==t){if(s??=this.constructor.getPropertyOptions(t),!(s.hasChanged??b)(this[t],e))return;this.P(t,e,s)}!1===this.isUpdatePending&&(this._$ES=this._$ET())}P(t,e,s){this._$AL.has(t)||this._$AL.set(t,e),!0===s.reflect&&this._$Em!==t&&(this._$Ej??=new Set).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,s]of t)!0!==s.wrapped||this._$AL.has(e)||void 0===this[e]||this.P(e,this[e],s)}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach((t=>t.hostUpdate?.())),this.update(e)):this._$EU()}catch(e){throw t=!1,this._$EU(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach((t=>t.hostUpdated?.())),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&=this._$Ej.forEach((t=>this._$EC(t,this[t]))),this._$EU()}updated(t){}firstUpdated(t){}}v.elementStyles=[],v.shadowRootOptions={mode:"open"},v[m("elementProperties")]=new Map,v[m("finalized")]=new Map,f?.({ReactiveElement:v}),(u.reactiveElementVersions??=[]).push("2.0.4");const A=globalThis,x=A.trustedTypes,E=x?x.createPolicy("lit-html",{createHTML:t=>t}):void 0,S="$lit$",w=`lit$${Math.random().toFixed(9).slice(2)}$`,C="?"+w,P=`<${C}>`,T=document,k=()=>T.createComment(""),O=t=>null===t||"object"!=typeof t&&"function"!=typeof t,U=Array.isArray,R="[ \t\n\f\r]",H=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,q=/-->/g,j=/>/g,M=RegExp(`>|${R}(?:([^\\s"'>=/]+)(${R}*=${R}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),N=/'/g,I=/"/g,D=/^(?:script|style|textarea|title)$/i,z=t=>(e,...s)=>({_$litType$:t,strings:e,values:s}),B=z(1),L=(z(2),Symbol.for("lit-noChange")),F=Symbol.for("lit-nothing"),W=new WeakMap,V=T.createTreeWalker(T,129);function J(t,e){if(!Array.isArray(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==E?E.createHTML(e):e}const K=(t,e)=>{const s=t.length-1,r=[];let o,i=2===e?"<svg>":"",n=H;for(let e=0;e<s;e++){const s=t[e];let a,l,c=-1,h=0;for(;h<s.length&&(n.lastIndex=h,l=n.exec(s),null!==l);)h=n.lastIndex,n===H?"!--"===l[1]?n=q:void 0!==l[1]?n=j:void 0!==l[2]?(D.test(l[2])&&(o=RegExp("</"+l[2],"g")),n=M):void 0!==l[3]&&(n=M):n===M?">"===l[0]?(n=o??H,c=-1):void 0===l[1]?c=-2:(c=n.lastIndex-l[2].length,a=l[1],n=void 0===l[3]?M:'"'===l[3]?I:N):n===I||n===N?n=M:n===q||n===j?n=H:(n=M,o=void 0);const d=n===M&&t[e+1].startsWith("/>")?" ":"";i+=n===H?s+P:c>=0?(r.push(a),s.slice(0,c)+S+s.slice(c)+w+d):s+w+(-2===c?e:d)}return[J(t,i+(t[s]||"<?>")+(2===e?"</svg>":"")),r]};class Z{constructor({strings:t,_$litType$:e},s){let r;this.parts=[];let o=0,i=0;const n=t.length-1,a=this.parts,[l,c]=K(t,e);if(this.el=Z.createElement(l,s),V.currentNode=this.el.content,2===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(r=V.nextNode())&&a.length<n;){if(1===r.nodeType){if(r.hasAttributes())for(const t of r.getAttributeNames())if(t.endsWith(S)){const e=c[i++],s=r.getAttribute(t).split(w),n=/([.?@])?(.*)/.exec(e);a.push({type:1,index:o,name:n[2],strings:s,ctor:"."===n[1]?tt:"?"===n[1]?et:"@"===n[1]?st:Y}),r.removeAttribute(t)}else t.startsWith(w)&&(a.push({type:6,index:o}),r.removeAttribute(t));if(D.test(r.tagName)){const t=r.textContent.split(w),e=t.length-1;if(e>0){r.textContent=x?x.emptyScript:"";for(let s=0;s<e;s++)r.append(t[s],k()),V.nextNode(),a.push({type:2,index:++o});r.append(t[e],k())}}}else if(8===r.nodeType)if(r.data===C)a.push({type:2,index:o});else{let t=-1;for(;-1!==(t=r.data.indexOf(w,t+1));)a.push({type:7,index:o}),t+=w.length-1}o++}}static createElement(t,e){const s=T.createElement("template");return s.innerHTML=t,s}}function G(t,e,s=t,r){if(e===L)return e;let o=void 0!==r?s._$Co?.[r]:s._$Cl;const i=O(e)?void 0:e._$litDirective$;return o?.constructor!==i&&(o?._$AO?.(!1),void 0===i?o=void 0:(o=new i(t),o._$AT(t,s,r)),void 0!==r?(s._$Co??=[])[r]=o:s._$Cl=o),void 0!==o&&(e=G(t,o._$AS(t,e.values),o,r)),e}class Q{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,r=(t?.creationScope??T).importNode(e,!0);V.currentNode=r;let o=V.nextNode(),i=0,n=0,a=s[0];for(;void 0!==a;){if(i===a.index){let e;2===a.type?e=new X(o,o.nextSibling,this,t):1===a.type?e=new a.ctor(o,a.name,a.strings,this,t):6===a.type&&(e=new rt(o,this,t)),this._$AV.push(e),a=s[++n]}i!==a?.index&&(o=V.nextNode(),i++)}return V.currentNode=T,r}p(t){let e=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class X{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,r){this.type=2,this._$AH=F,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=G(this,t,e),O(t)?t===F||null==t||""===t?(this._$AH!==F&&this._$AR(),this._$AH=F):t!==this._$AH&&t!==L&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>U(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}S(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.S(t))}_(t){this._$AH!==F&&O(this._$AH)?this._$AA.nextSibling.data=t:this.T(T.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:s}=t,r="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=Z.createElement(J(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===r)this._$AH.p(e);else{const t=new Q(r,this),s=t.u(this.options);t.p(e),this.T(s),this._$AH=t}}_$AC(t){let e=W.get(t.strings);return void 0===e&&W.set(t.strings,e=new Z(t)),e}k(t){U(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,r=0;for(const o of t)r===e.length?e.push(s=new X(this.S(k()),this.S(k()),this,this.options)):s=e[r],s._$AI(o),r++;r<e.length&&(this._$AR(s&&s._$AB.nextSibling,r),e.length=r)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t&&t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class Y{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,r,o){this.type=1,this._$AH=F,this._$AN=void 0,this.element=t,this.name=e,this._$AM=r,this.options=o,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=F}_$AI(t,e=this,s,r){const o=this.strings;let i=!1;if(void 0===o)t=G(this,t,e,0),i=!O(t)||t!==this._$AH&&t!==L,i&&(this._$AH=t);else{const r=t;let n,a;for(t=o[0],n=0;n<o.length-1;n++)a=G(this,r[s+n],e,n),a===L&&(a=this._$AH[n]),i||=!O(a)||a!==this._$AH[n],a===F?t=F:t!==F&&(t+=(a??"")+o[n+1]),this._$AH[n]=a}i&&!r&&this.j(t)}j(t){t===F?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class tt extends Y{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===F?void 0:t}}class et extends Y{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==F)}}class st extends Y{constructor(t,e,s,r,o){super(t,e,s,r,o),this.type=5}_$AI(t,e=this){if((t=G(this,t,e,0)??F)===L)return;const s=this._$AH,r=t===F&&s!==F||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,o=t!==F&&(s===F||r);r&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class rt{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){G(this,t)}}const ot=A.litHtmlPolyfillSupport;ot?.(Z,X),(A.litHtmlVersions??=[]).push("3.1.4");class it extends v{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,s)=>{const r=s?.renderBefore??e;let o=r._$litPart$;if(void 0===o){const t=s?.renderBefore??null;r._$litPart$=o=new X(e.insertBefore(k(),t),t,void 0,s??{})}return o._$AI(t),o})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return L}}it._$litElement$=!0,it.finalized=!0,globalThis.litElementHydrateSupport?.({LitElement:it});const nt=globalThis.litElementPolyfillSupport;nt?.({LitElement:it}),(globalThis.litElementVersions??=[]).push("4.0.6");const at=t=>(e,s)=>{void 0!==s?s.addInitializer((()=>{customElements.define(t,e)})):customElements.define(t,e)},lt={attribute:!0,type:String,converter:y,reflect:!1,hasChanged:b},ct=(t=lt,e,s)=>{const{kind:r,metadata:o}=s;let i=globalThis.litPropertyMetadata.get(o);if(void 0===i&&globalThis.litPropertyMetadata.set(o,i=new Map),i.set(s.name,t),"accessor"===r){const{name:r}=s;return{set(s){const o=e.get.call(this);e.set.call(this,s),this.requestUpdate(r,o,t)},init(e){return void 0!==e&&this.P(r,void 0,t),e}}}if("setter"===r){const{name:r}=s;return function(s){const o=this[r];e.call(this,s),this.requestUpdate(r,o,t)}}throw Error("Unsupported decorator location: "+r)};function ht(t){return(e,s)=>"object"==typeof s?ct(t,e,s):((t,e,s)=>{const r=e.hasOwnProperty(s);return e.constructor.createProperty(s,r?{...t,wrapped:!0}:t),r?Object.getOwnPropertyDescriptor(e,s):void 0})(t,e,s)}const dt=(t,e,s)=>(s.configurable=!0,s.enumerable=!0,Reflect.decorate&&"object"!=typeof e&&Object.defineProperty(t,e,s),s);function pt(t,e){return(s,r,o)=>{const i=e=>e.renderRoot?.querySelector(t)??null;if(e){const{get:t,set:e}="object"==typeof r?s:o??(()=>{const t=Symbol();return{get(){return this[t]},set(e){this[t]=e}}})();return dt(s,r,{get(){let s=t.call(this);return void 0===s&&(s=i(this),(null!==s||this.hasUpdated)&&e.call(this,s)),s}})}return dt(s,r,{get(){return i(this)}})}}function ut(t){return(e,s)=>{const{slot:r,selector:o}=t??{},i="slot"+(r?`[name=${r}]`:":not([name])");return dt(e,s,{get(){const e=this.renderRoot?.querySelector(i),s=e?.assignedElements(t)??[];return void 0===o?s:s.filter((t=>t.matches(o)))}})}}const _t=i`
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
`;function gt(t){const e=t.currentTarget,s=document.createElement("span"),r=Math.max(e.clientWidth,e.clientHeight),o=r/2;s.style.width=s.style.height=`${r}px`,s.style.left=t.clientX-(e.offsetLeft+o)+"px",s.style.top=t.clientY-(e.offsetTop+o)+"px",s.classList.add("ripple");const i=e.getElementsByClassName("ripple")[0];i&&i.remove(),e.appendChild(s)}var ft=function(t,e,s,r){var o,i=arguments.length,n=i<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,s):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,s,r);else for(var a=t.length-1;a>=0;a--)(o=t[a])&&(n=(i<3?o(n):i>3?o(e,s,n):o(e,s))||n);return i>3&&n&&Object.defineProperty(e,s,n),n};let mt=class extends it{static styles=i`
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

    ${_t}
  `;#t="button";get type(){return this.#t}set type(t){this.#t=t}#e="";get form(){return this.#e}set form(t){this.#e=t}#s;get internals(){return this.#s}set internals(t){this.#s=t}#r;get _buttonElement(){return this.#r}set _buttonElement(t){this.#r=t}handleClick(t){gt(t),"submit"===this.type&&this.internals.form.requestSubmit()}static get formAssociated(){return!0}constructor(){super(),this.internals=this.attachInternals()}render(){return B`
      <button class="button" type="${this.type}" @click=${this.handleClick} form=${this.form}>
        <slot></slot>
      </button>
    `}};ft([ht({type:String})],mt.prototype,"type",null),ft([ht({type:String})],mt.prototype,"form",null),ft([ht({type:ElementInternals})],mt.prototype,"internals",null),ft([pt("button")],mt.prototype,"_buttonElement",null),mt=ft([at("action-button")],mt);var yt=function(t,e,s,r){var o,i=arguments.length,n=i<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,s):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,s,r);else for(var a=t.length-1;a>=0;a--)(o=t[a])&&(n=(i<3?o(n):i>3?o(e,s,n):o(e,s))||n);return i>3&&n&&Object.defineProperty(e,s,n),n};let bt=class extends it{static styles=i`
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
  `;#o="";get placeholder(){return this.#o}set placeholder(t){this.#o=t}#i="300px";get width(){return this.#i}set width(t){this.#i=t}#n="";get suffixText(){return this.#n}set suffixText(t){this.#n=t}#a=!1;get disabled(){return this.#a}set disabled(t){this.#a=t}#l=!1;get required(){return this.#l}set required(t){this.#l=t}#t="text";get type(){return this.#t}set type(t){this.#t=t}#c="";get value(){return this.#c}set value(t){this.#c=t}#h="";get name(){return this.#h}set name(t){this.#h=t}#d;get _input(){return this.#d}set _input(t){this.#d=t}constructor(){super()}_handleChange(t){this.value=t.target.value}render(){return B`
      <div class="container">
        <!-- There is a space character as a placeholder, which is slightly hacky, but works with the css :placeholder-shown -->
        <input type=${this.type} placeholder=" "
          ?disabled="${this.disabled}"
          ?required="${this.required}"
          name=${this.name}
          @change=${this._handleChange}/>
        <label>${this.placeholder}</label>
      </div>
    `}};yt([ht({type:String})],bt.prototype,"placeholder",null),yt([ht({type:String})],bt.prototype,"width",null),yt([ht({type:String,attribute:"suffix-text"})],bt.prototype,"suffixText",null),yt([ht({type:Boolean,reflect:!0})],bt.prototype,"disabled",null),yt([ht({type:Boolean,reflect:!0})],bt.prototype,"required",null),yt([ht({type:String})],bt.prototype,"type",null),yt([ht({type:String})],bt.prototype,"value",null),yt([ht({type:String})],bt.prototype,"name",null),yt([pt("input")],bt.prototype,"_input",null),bt=yt([at("outlined-text-field")],bt);var $t=function(t,e,s,r){var o,i=arguments.length,n=i<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,s):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,s,r);else for(var a=t.length-1;a>=0;a--)(o=t[a])&&(n=(i<3?o(n):i>3?o(e,s,n):o(e,s))||n);return i>3&&n&&Object.defineProperty(e,s,n),n};let vt=class extends it{static styles=i`
    div {
      display: flex;
      flex-direction: column;
      margin: 10px;
      margin-bottom: 30px;
      backrgound-color: inherit;
    }
  `;#t="";get type(){return this.#t}set type(t){this.#t=t}#h="";get name(){return this.#h}set name(t){this.#h=t}#p="";get id(){return this.#p}set id(t){this.#p=t}#l=!1;get required(){return this.#l}set required(t){this.#l=t}#u="";get label(){return this.#u}set label(t){this.#u=t}#_="";get domain(){return this.#_}set domain(t){this.#_=t}#a=!1;get disabled(){return this.#a}set disabled(t){this.#a=t}#s;get internals(){return this.#s}set internals(t){this.#s=t}#d;get _input(){return this.#d}set _input(t){this.#d=t}constructor(){super(),this.internals=this.attachInternals()}get value(){return this._input.value}render(){return B`
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
    `}};$t([ht({type:String})],vt.prototype,"type",null),$t([ht({type:String})],vt.prototype,"name",null),$t([ht({type:String})],vt.prototype,"id",null),$t([ht({type:Boolean})],vt.prototype,"required",null),$t([ht({type:String})],vt.prototype,"label",null),$t([ht({type:String})],vt.prototype,"domain",null),$t([ht({type:Boolean})],vt.prototype,"disabled",null),$t([ht({type:ElementInternals})],vt.prototype,"internals",null),$t([pt("outlined-text-field")],vt.prototype,"_input",null),vt=$t([at("form-question")],vt);let At=class extends it{static styles=i`
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
  `;#g="";get header(){return this.#g}set header(t){this.#g=t}#h="";get name(){return this.#h}set name(t){this.#h=t}#p="";get id(){return this.#p}set id(t){this.#p=t}#f;get _formElement(){return this.#f}set _formElement(t){this.#f=t}#m;get _questions(){return this.#m}set _questions(t){this.#m=t}disableForm(){this._questions.forEach((t=>{t.setAttribute("disabled","true")}))}enableForm(){this._questions.forEach((t=>{t.removeAttribute("disabled")}))}handleForm(t){t.preventDefault(),console.log("Attempting to submit form.");const e=new FormData;e.append("formId",this._formElement.id);const s=this._questions;console.log(s),console.log(`Got ${s.length} questions, printing values.`);for(let t=0;t<s.length;t++){const r=s[t];console.log(`Found user input control: ${r}`),console.log(`Assumed value: ${r.value}`),console.log(`Question ID: ${r.name}`),e.append(r.name,r.value)}console.log(`Built FormData object: ${JSON.stringify(Object.fromEntries(e))}`),this.disableForm(),google.script.run.withSuccessHandler((()=>{console.log("SUCCESS")})).withFailureHandler((()=>{console.log("FAILED")})).processForm(JSON.stringify(Object.fromEntries(e))),this.enableForm()}render(){return B`
      <div>
        <!-- Create a box that contains our form. -->
        <h1>${this.header}</h1>
        <hr>
        <form id="formIdHere" name="${this.name}" @submit="${this.handleForm}">
          <slot></slot>
          <action-button type="submit" form="formIdHere">Submit</action-button>
        </form>
      </div>
    `}};$t([ht({type:String})],At.prototype,"header",null),$t([ht({type:String})],At.prototype,"name",null),$t([ht({type:String})],At.prototype,"id",null),$t([pt("form")],At.prototype,"_formElement",null),$t([ut({selector:"form-question",flatten:!0})],At.prototype,"_questions",null),At=$t([at("form-section")],At);class xt{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,s){this._$Ct=t,this._$AM=e,this._$Ci=s}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}}const Et=(St=class extends xt{constructor(t){if(super(t),1!==t.type||"class"!==t.name||t.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(t){return" "+Object.keys(t).filter((e=>t[e])).join(" ")+" "}update(t,[e]){if(void 0===this.st){this.st=new Set,void 0!==t.strings&&(this.nt=new Set(t.strings.join(" ").split(/\s/).filter((t=>""!==t))));for(const t in e)e[t]&&!this.nt?.has(t)&&this.st.add(t);return this.render(e)}const s=t.element.classList;for(const t of this.st)t in e||(s.remove(t),this.st.delete(t));for(const t in e){const r=!!e[t];r===this.st.has(t)||this.nt?.has(t)||(r?(s.add(t),this.st.add(t)):(s.remove(t),this.st.delete(t)))}return L}},(...t)=>({_$litDirective$:St,values:t}));var St,wt=function(t,e,s,r){var o,i=arguments.length,n=i<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,s):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,s,r);else for(var a=t.length-1;a>=0;a--)(o=t[a])&&(n=(i<3?o(n):i>3?o(e,s,n):o(e,s))||n);return i>3&&n&&Object.defineProperty(e,s,n),n};let Ct=class extends it{static styles=i`
    slot {
      display: flex;
      flex-direction: row;
    }
  `;#y;get slotElement(){return this.#y}set slotElement(t){this.#y=t}#b;get _tabs(){return this.#b}set _tabs(t){this.#b=t}get activeTab(){return this._tabs.find((t=>t.active))??null}set activeTab(t){t&&this.activateTab(t)}get activeTabIndex(){return this._tabs.findIndex((t=>t.active))}set activeTabIndex(t){const e=()=>{const e=this._tabs[t];e&&this.activateTab(e)};this.slotElement?e():this.updateComplete.then(e)}get focusedTab(){return this._tabs.find((t=>t.matches(":focus-within")))}render(){return B`
      <div>
        <slot @click=${this.handleClick}></slot>
      </div>
    `}async handleClick(t){console.log("Found click event!");const e=t.target;await 0,t.defaultPrevented||e.active||this.activateTab(e)}activateTab(t){const{_tabs:e}=this;if(e.includes(t)&&!t.disabled){for(const s of e)s.active=s===t;this.dispatchEvent(new Event("change",{bubbles:!0,cancelable:!0}))}}};wt([pt("slot")],Ct.prototype,"slotElement",null),wt([ut({selector:"c-tab",flatten:!0})],Ct.prototype,"_tabs",null),wt([ht({type:Number,attribute:"active-tab-index"})],Ct.prototype,"activeTabIndex",null),Ct=wt([at("tab-bar")],Ct);let Pt=class extends it{static styles=i`
    .button {
      width: 100px;
      position: relative;
      overflow: hidden;
      transition: background-color 400ms ease;
      user-select: none;
      text-align: center;
      padding: 5px;
      &:hover {
        background-color: lightgray;
      }
      &.disabled {
        background-color: gray;
        pointer-events: none;
      }
      &.active {
        background-color: lightgray;
        border-bottom: solid thick var(--theme-primary-color);
      }
    }

    ${_t}
  `;#$="";get panelId(){return this.#$}set panelId(t){this.#$=t}#a=!1;get disabled(){return this.#a}set disabled(t){this.#a=t}#v=!1;get active(){return this.#v}set active(t){this.#v=t}_internals=this.attachInternals;render(){return B`
      <!-- This is essentially a customized button. -->
      <div
        class="${Et({button:!0,disabled:this.disabled,active:this.active})}"
        role="tab"
        @click=${this._handleClick}>
        <!-- Define where text and/or icons will appear. -->
        <slot name="icon"></slot>
        <slot>
          <!-- This is where our label content will go. -->
          <!-- Material Design has @slotchange here, but I don't know what that's for. -->
        </slot>
      </div>
    `}_handleClick(t){t.stopPropagation(),this.click(),gt(t)}};wt([ht({type:String,attribute:"panel-id"})],Pt.prototype,"panelId",null),wt([ht({type:Boolean,reflect:!0})],Pt.prototype,"disabled",null),wt([ht({type:Boolean,reflect:!0})],Pt.prototype,"active",null),Pt=wt([at("c-tab")],Pt)})();