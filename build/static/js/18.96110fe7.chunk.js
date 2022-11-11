(this.webpackJsonptfg=this.webpackJsonptfg||[]).push([[18],{989:function(e,n,t){"use strict";t.r(n),t.d(n,"OpenloginAdapter",(function(){return k})),t.d(n,"getOpenloginDefaultOptions",(function(){return C}));var i=t(0),r=t(8),a=t(5),o=t(6),s=t(11),c=t(38),h=t(33),l=t(12),u=t(13),p=t(107),g=t(9),d=t(14),f=t.n(d),O=t(774),b=t(71),v=t.n(b),C=function(e,n){return{adapterSettings:{network:p.b.MAINNET,clientId:"",uxMode:p.d.POPUP},chainConfig:e?Object(g.p)(e,n):null,loginSettings:{}}};function N(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);n&&(i=i.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,i)}return t}function j(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?N(Object(t),!0).forEach((function(n){f()(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):N(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}var k=function(e){Object(l.a)(d,e);var n=Object(u.a)(d);function d(e){var t,i,r,o;Object(a.a)(this,d),t=n.call(this),f()(Object(s.a)(t),"name",g.j.OPENLOGIN),f()(Object(s.a)(t),"adapterNamespace",g.c.MULTICHAIN),f()(Object(s.a)(t),"type",g.a.IN_APP),f()(Object(s.a)(t),"openloginInstance",null),f()(Object(s.a)(t),"status",g.d.NOT_READY),f()(Object(s.a)(t),"currentChainNamespace",g.g.EIP155),f()(Object(s.a)(t),"openloginOptions",void 0),f()(Object(s.a)(t),"loginSettings",{}),f()(Object(s.a)(t),"privKeyProvider",null),g.s.debug("const openlogin adapter",e);var c=C(null===(i=e.chainConfig)||void 0===i?void 0:i.chainNamespace,null===(r=e.chainConfig)||void 0===r?void 0:r.chainId);if(t.openloginOptions=j(j({clientId:"",network:p.b.MAINNET},c.adapterSettings),e.adapterSettings||{}),t.loginSettings=j(j({},c.loginSettings),e.loginSettings),t.sessionTime=t.loginSettings.sessionTime||86400,null!==(o=e.chainConfig)&&void 0!==o&&o.chainNamespace){var h;t.currentChainNamespace=null===(h=e.chainConfig)||void 0===h?void 0:h.chainNamespace;var l=c.chainConfig?c.chainConfig:{};if(t.chainConfig=j(j({},l),null===e||void 0===e?void 0:e.chainConfig),g.s.debug("const openlogin chainConfig",t.chainConfig),!t.chainConfig.rpcTarget&&e.chainConfig.chainNamespace!==g.g.OTHER)throw g.k.invalidParams("rpcTarget is required in chainConfig")}return t}return Object(o.a)(d,[{key:"chainConfigProxy",get:function(){return this.chainConfig?j({},this.chainConfig):null}},{key:"provider",get:function(){var e;return(null===(e=this.privKeyProvider)||void 0===e?void 0:e.provider)||null},set:function(e){throw new Error("Not implemented")}},{key:"init",value:function(){var e=Object(r.a)(Object(i.a)().mark((function e(n){var t,r,a;return Object(i.a)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(Object(c.a)(Object(h.a)(d.prototype),"checkInitializationRequirements",this).call(this),null!==(t=this.openloginOptions)&&void 0!==t&&t.clientId){e.next=3;break}throw g.k.invalidParams("clientId is required before openlogin's initialization");case 3:if(this.chainConfig){e.next=5;break}throw g.k.invalidParams("chainConfig is required before initialization");case 5:return r=!1,this.openloginOptions.uxMode===p.d.REDIRECT&&(a=Object(p.f)(),Object.keys(a).length>0&&a._pid&&(r=!0)),this.openloginOptions=j(j({},this.openloginOptions),{},{replaceUrlOnRedirect:r}),this.openloginInstance=new p.e(this.openloginOptions),g.s.debug("initializing openlogin adapter init"),e.next=12,this.openloginInstance.init();case 12:if(this.status=g.d.READY,this.emit(g.b.READY,g.j.OPENLOGIN),e.prev=14,g.s.debug("initializing openlogin adapter"),!this.openloginInstance.privKey||!n.autoConnect&&!r){e.next=19;break}return e.next=19,this.connect();case 19:e.next=25;break;case 21:e.prev=21,e.t0=e.catch(14),g.s.error("Failed to connect with cached openlogin provider",e.t0),this.emit("ERRORED",e.t0);case 25:case"end":return e.stop()}}),e,this,[[14,21]])})));return function(n){return e.apply(this,arguments)}}()},{key:"connect",value:function(){var e=Object(r.a)(Object(i.a)().mark((function e(n){return Object(i.a)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return Object(c.a)(Object(h.a)(d.prototype),"checkConnectionRequirements",this).call(this),this.status=g.d.CONNECTING,this.emit(g.b.CONNECTING,j(j({},n),{},{adapter:g.j.OPENLOGIN})),e.prev=3,e.next=6,this.connectWithProvider(n);case 6:return e.abrupt("return",this.provider);case 9:if(e.prev=9,e.t0=e.catch(3),g.s.error("Failed to connect with openlogin provider",e.t0),this.status=g.d.READY,this.emit(g.b.ERRORED,e.t0),null===e.t0||void 0===e.t0||!e.t0.message.includes("user closed popup")){e.next=16;break}throw g.l.popupClosed();case 16:throw g.l.connectionError("Failed to login with openlogin");case 17:case"end":return e.stop()}}),e,this,[[3,9]])})));return function(n){return e.apply(this,arguments)}}()},{key:"disconnect",value:function(){var e=Object(r.a)(Object(i.a)().mark((function e(){var n,t=arguments;return Object(i.a)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(n=t.length>0&&void 0!==t[0]?t[0]:{cleanup:!1},this.status===g.d.CONNECTED){e.next=3;break}throw g.l.notConnectedError("Not connected with wallet");case 3:if(this.openloginInstance){e.next=5;break}throw g.k.notReady("openloginInstance is not ready");case 5:return e.next=7,this.openloginInstance.logout();case 7:n.cleanup?(this.status=g.d.NOT_READY,this.openloginInstance=null,this.privKeyProvider=null):this.status=g.d.READY,this.emit(g.b.DISCONNECTED);case 9:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"authenticateUser",value:function(){var e=Object(r.a)(Object(i.a)().mark((function e(){var n;return Object(i.a)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(this.status===g.d.CONNECTED){e.next=2;break}throw g.l.notConnectedError("Not connected with wallet, Please login/connect first");case 2:return e.next=4,this.getUserInfo();case 4:return n=e.sent,e.abrupt("return",{idToken:n.idToken});case 6:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"getUserInfo",value:function(){var e=Object(r.a)(Object(i.a)().mark((function e(){var n;return Object(i.a)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(this.status===g.d.CONNECTED){e.next=2;break}throw g.l.notConnectedError("Not connected with wallet");case 2:if(this.openloginInstance){e.next=4;break}throw g.k.notReady("openloginInstance is not ready");case 4:return e.next=6,this.openloginInstance.getUserInfo();case 6:return n=e.sent,e.abrupt("return",n);case 8:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"setAdapterSettings",value:function(e){if(this.status!==g.d.READY){var n=C();this.openloginOptions=j(j(j({},n.adapterSettings),this.openloginOptions||{}),e),e.sessionTime&&(this.loginSettings=j(j({},this.loginSettings),{},{sessionTime:e.sessionTime}))}}},{key:"setChainConfig",value:function(e){Object(c.a)(Object(h.a)(d.prototype),"setChainConfig",this).call(this,e),this.currentChainNamespace=e.chainNamespace}},{key:"connectWithProvider",value:function(){var e=Object(r.a)(Object(i.a)().mark((function e(n){var r,a,o,s,c,h,l,u;return Object(i.a)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(this.chainConfig){e.next=2;break}throw g.k.invalidParams("chainConfig is required before initialization");case 2:if(this.openloginInstance){e.next=4;break}throw g.k.notReady("openloginInstance is not ready");case 4:if(this.currentChainNamespace!==g.g.SOLANA){e.next=12;break}return e.next=7,Promise.all([t.e(2),t.e(3),t.e(17)]).then(t.bind(null,773));case 7:r=e.sent,a=r.SolanaPrivateKeyProvider,this.privKeyProvider=new a({config:{chainConfig:this.chainConfig}}),e.next=25;break;case 12:if(this.currentChainNamespace!==g.g.EIP155){e.next=20;break}return e.next=15,Promise.all([t.e(4),t.e(15)]).then(t.bind(null,808));case 15:o=e.sent,s=o.EthereumPrivateKeyProvider,this.privKeyProvider=new s({config:{chainConfig:this.chainConfig}}),e.next=25;break;case 20:if(this.currentChainNamespace!==g.g.OTHER){e.next=24;break}this.privKeyProvider=new O.b,e.next=25;break;case 24:throw new Error("Invalid chainNamespace: ".concat(this.currentChainNamespace," found while connecting to wallet"));case 25:if(this.openloginInstance.privKey||!n){e.next=29;break}return this.loginSettings.curve||(this.loginSettings.curve=this.currentChainNamespace===g.g.SOLANA?p.c.ED25519:p.c.SECP256K1),e.next=29,this.openloginInstance.login(v()(this.loginSettings,{loginProvider:n.loginProvider},{extraLoginOptions:j(j({},n.extraLoginOptions||{}),{},{login_hint:n.login_hint||(null===(c=n.extraLoginOptions)||void 0===c?void 0:c.login_hint)})}));case 29:if(!(h=this.openloginInstance.privKey)){e.next=41;break}if(this.currentChainNamespace!==g.g.SOLANA){e.next=37;break}return e.next=34,Promise.all([t.e(2),t.e(12)]).then(t.bind(null,980));case 34:l=e.sent,u=l.getED25519Key,h=u(h).sk.toString("hex");case 37:return e.next=39,this.privKeyProvider.setupProvider(h);case 39:this.status=g.d.CONNECTED,this.emit(g.b.CONNECTED,{adapter:g.j.OPENLOGIN,reconnected:!n});case 41:case"end":return e.stop()}}),e,this)})));return function(n){return e.apply(this,arguments)}}()}]),d}(g.e)}}]);
//# sourceMappingURL=18.96110fe7.chunk.js.map