(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[6],{amZ7:function(e,t,a){"use strict";a.r(t),a.d(t,"default",function(){return J});a("+L6B");var r=a("KmJ5"),s=a.n(r),n=(a("/zsF"),a("WPY0")),o=a.n(n),i=a("2Taf"),m=a.n(i),c=a("vZ4D"),l=a.n(c),d=a("l4Ni"),p=a.n(d),u=a("ujKo"),h=a.n(u),g=a("MhPg"),v=a.n(g),E=(a("5NDa"),a("QesF")),y=a.n(E),f=(a("tU7J"),a("jlIh")),w=a.n(f),N=a("cDcd"),b=a.n(N),M=a("wkCi"),F=a.n(M),S=a("Y2fQ"),k=a("Nhdc"),j=a("2iEm"),C=a("3a4m"),O=a.n(C),x=a("c+yx"),K=a("6NnC"),W=w.a.Title,A=w.a.Text,B=y.a.TextArea,J=function(e){function t(){var e;return m()(this,t),e=p()(this,h()(t).apply(this,arguments)),e.state={step:0,method:"",phrase:"",privateKey:""},e.handleStep=function(t){var a=e.state,r=a.step,s=a.phrase,n=a.privateKey,o=a.method;if(t)e.setState({step:r+1,method:t});else if(Object(x["h"])("restore",o),"mnemonic"===o){var i=s.replace(/(^\s*)|(\s*$)/g,""),m=Object(K["e"])(i);m?(Object(x["g"])("mnemonic",i),e.setState({step:r+1})):e.setState({error:"mnemonic"})}else if("private"===o){var c=Object(K["f"])(n);""!==c?(e.setState({step:r+1}),Object(x["g"])("privateKey",c)):e.setState({error:"private"})}},e.goBack=function(){var t=e.state.step;e.setState({step:t-1})},e.finish=function(){O.a.push("/")},e}return v()(t,e),l()(t,[{key:"render",value:function(){var e=this,t=this.state,a=t.method,r=t.phrase,n=t.step,i=t.privateKey,m=t.error;return b.a.createElement("div",{className:F.a.container},b.a.createElement(W,{level:2,style:{marginBottom:0}},Object(S["formatMessage"])({id:"user-restore.title"})),b.a.createElement(A,{type:"secondary",className:F.a.description},b.a.createElement(S["FormattedMessage"],{id:a?"user-restore.method.".concat(a,".description"):"user-restore.title.description"})),b.a.createElement(o.a,{dashed:!0,className:F.a.divider}),1===n?"mnemonic"===a?b.a.createElement("div",{className:F.a.phrase},b.a.createElement("div",null,b.a.createElement(S["FormattedMessage"],{id:"user-restore.method.mnemonic.input.info"})),b.a.createElement(A,{type:"secondary",style:{fontSize:12}},b.a.createElement(S["FormattedMessage"],{id:"user-restore.method.mnemonic.input.description"})),b.a.createElement("div",{className:F.a.inputWrapper},b.a.createElement(B,{className:F.a.textArea,value:r,onChange:function(t){e.setState({phrase:t.target.value})},placeholder:Object(S["formatMessage"])({id:"user-restore.method.mnemonic.input.placeholder"})}),"mnemonic"===m?b.a.createElement(A,{type:"danger",className:F.a.error},b.a.createElement(S["FormattedMessage"],{id:"user-restore.method.mnemonic.error"})):null),b.a.createElement(s.a,{disabled:!r,type:"primary",className:F.a.button,onClick:function(){return e.handleStep()}},b.a.createElement(S["FormattedMessage"],{id:"user-restore.method.continue"}))):b.a.createElement("div",{className:F.a.private},b.a.createElement("div",null,b.a.createElement(S["FormattedMessage"],{id:"user-restore.method.private.input.info"})),b.a.createElement("div",{className:F.a.inputWrapper},b.a.createElement(y.a,{value:i,className:F.a.input,onChange:function(t){e.setState({privateKey:t.target.value})},placeholder:Object(S["formatMessage"])({id:"user-restore.method.private.input.placeholder"})}),"private"===m?b.a.createElement(A,{type:"danger",className:F.a.error},b.a.createElement(S["FormattedMessage"],{id:"user-restore.method.private.input.error"})):null),b.a.createElement(s.a,{disabled:!i,type:"primary",className:F.a.button,onClick:function(){return e.handleStep()}},b.a.createElement(S["FormattedMessage"],{id:"user-restore.method.continue"}))):2===n?b.a.createElement(b.a.Fragment,null,b.a.createElement(k["b"],{next:this.finish,type:"restore"})):null,0===n?b.a.createElement(b.a.Fragment,null,b.a.createElement("div",{className:F.a.method,onClick:function(){return e.handleStep("private")}},b.a.createElement(k["c"],{className:F.a.icon,type:"mrw-password"}),b.a.createElement("div",{className:F.a.card},b.a.createElement(W,{level:4},b.a.createElement(S["FormattedMessage"],{id:"user-restore.method.private"})),b.a.createElement(A,{type:"secondary"},b.a.createElement(S["FormattedMessage"],{id:"user-restore.method.private.description"})))),b.a.createElement("div",{className:F.a.method,onClick:function(){return e.handleStep("mnemonic")}},b.a.createElement(k["c"],{className:F.a.icon,type:"mrw-brain"}),b.a.createElement("div",{className:F.a.card},b.a.createElement(W,{level:4},b.a.createElement(S["FormattedMessage"],{id:"user-restore.method.mnemonic"})),b.a.createElement(A,{type:"secondary"},b.a.createElement(S["FormattedMessage"],{id:"user-restore.method.mnemonic.description"}))))):b.a.createElement(s.a,{type:"link",onClick:function(){return e.goBack()}},b.a.createElement(S["FormattedMessage"],{id:"user-restore.method.return"})),b.a.createElement(o.a,{dashed:!0,className:F.a.divider}),b.a.createElement(S["FormattedMessage"],{id:"user-restore.other",values:{sign:b.a.createElement(j["a"],{to:"/user/login"},Object(S["formatMessage"])({id:"user-restore.other.sign"})),create:b.a.createElement(j["a"],{to:"/user/signup"},Object(S["formatMessage"])({id:"user-restore.other.create"}))}}))}}]),t}(N["Component"]);J.defaultProps={}},wkCi:function(e,t,a){e.exports={container:"mrw-pages-user-restore-style-container",description:"mrw-pages-user-restore-style-description",divider:"mrw-pages-user-restore-style-divider",method:"mrw-pages-user-restore-style-method",icon:"mrw-pages-user-restore-style-icon",card:"mrw-pages-user-restore-style-card",phrase:"mrw-pages-user-restore-style-phrase",textArea:"mrw-pages-user-restore-style-textArea",inputWrapper:"mrw-pages-user-restore-style-inputWrapper",private:"mrw-pages-user-restore-style-private",input:"mrw-pages-user-restore-style-input",button:"mrw-pages-user-restore-style-button",password:"mrw-pages-user-restore-style-password"}}}]);