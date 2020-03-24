(window.webpackJsonp=window.webpackJsonp||[]).push([[15],{386:function(e,a,t){"use strict";t.r(a);var l=t(0),n=t.n(l),r=t(369),c=t(368),p=t(9),i=t.n(p),b=t(69),o=t.n(b),s=t(79),d={_frontmatter:{}},h="wrapper";function m(e){var a=e.components,t=o()(e,["components"]);return Object(s.b)(h,i()({},d,t,{components:a,mdxType:"MDXLayout"}),Object(s.b)("h1",{id:"parcel-types"},"Parcel types"),Object(s.b)("p",null,"Each parcel has one or more parcel types that are determined by the kind of data it contains.\nAny parcel can be more than one type at once."),Object(s.b)("p",null,"You can check a parcel's type by using their ",Object(s.b)("a",i()({parentName:"p"},{href:"/api/Parcel#Type-methods"}),"type methods"),"."),Object(s.b)("p",null,"Parcel's can contain any type of value you like, but only a subset of these values will give you the ability to edit child values. A parcel with the ability to edit child values will be of type ",Object(s.b)("a",i()({parentName:"p"},{href:"#ParentParcel"}),"ParentParcel"),"."),Object(s.b)("h3",{id:"parentparcel"},"ParentParcel"),Object(s.b)("p",null,"A parcel is a ",Object(s.b)("inlineCode",{parentName:"p"},"ParentParcel")," if its value contains editable child values. Child values are considered editable if they are compatible with the ",Object(s.b)("a",i()({parentName:"p"},{href:"https://92green.github.io/unmutable/",target:"_blank",rel:["nofollow","noopener","noreferrer"]}),"unmutable",Object(s.b)("span",{parentName:"a"},""))," data collection library. These value types are currently supported:"),Object(s.b)("ul",null,Object(s.b)("li",{parentName:"ul"},"Objects"),Object(s.b)("li",{parentName:"ul"},"Arrays"),Object(s.b)("li",{parentName:"ul"},"Immutable.js Maps"),Object(s.b)("li",{parentName:"ul"},"Immutable.js Lists"),Object(s.b)("li",{parentName:"ul"},"Immutable.js Records")),Object(s.b)("p",null,"Unmutable guarantees that data is edited immutably, which is very important for dataparcels."),Object(s.b)("p",null,"Class instances are not recognised as ",Object(s.b)("inlineCode",{parentName:"p"},"ParentParcel"),"s because there are no guarantees that they are immutable and Unmutable doesn't know how to interact with them."),Object(s.b)("p",null,"If you want the ability to edit the child values on a data type not listed, please make a request in the ",Object(s.b)("a",i()({parentName:"p"},{href:"http://github.com/92green/unmutable/issues",target:"_blank",rel:["nofollow","noopener","noreferrer"]}),"unmutable issue tracker",Object(s.b)("span",{parentName:"a"},"")),"."),Object(s.b)("p",null,"When a parcel is a parent parcel, it allows the use of ",Object(s.b)("a",i()({parentName:"p"},{href:"/api/Parcel#Branch-methods"}),"branch methods")," and ",Object(s.b)("a",i()({parentName:"p"},{href:"#Parent-methods"}),"parent methods"),"."),Object(s.b)("h3",{id:"childparcel"},"ChildParcel"),Object(s.b)("p",null,"A parcel is a ",Object(s.b)("inlineCode",{parentName:"p"},"ChildParcel")," if it contains a child value from a parent parcel. Child parcels are created using branching methods."),Object(s.b)("p",null,"When a parcel is a child parcel, it allows the use of ",Object(s.b)("a",i()({parentName:"p"},{href:"#Child-methods"}),"child methods"),"."),Object(s.b)("h3",{id:"indexedparcel"},"IndexedParcel"),Object(s.b)("p",null,"A parcel is an ",Object(s.b)("inlineCode",{parentName:"p"},"IndexedParcel")," if it contains an indexed data type, such as an array or an Immutable.js List. IndexedParcels are also always parent parcels."),Object(s.b)("p",null,"When a parcel is an indexed parcel, it allows the use of ",Object(s.b)("a",i()({parentName:"p"},{href:"/api/Parcel#indexed-and-element-change-methods"}),"indexed methods"),"."),Object(s.b)("h3",{id:"elementparcel"},"ElementParcel"),Object(s.b)("p",null,"A parcel is an ",Object(s.b)("inlineCode",{parentName:"p"},"ElementParcel")," if it contains the child value of an indexed parcel."),Object(s.b)("p",null,"When a parcel is an element parcel, it allows the use of ",Object(s.b)("a",i()({parentName:"p"},{href:"/api/Parcel#indexed-and-element-change-methods"}),"element methods"),"."),Object(s.b)("h3",{id:"toplevelparcel"},"TopLevelParcel"),Object(s.b)("p",null,"A parcel is a ",Object(s.b)("inlineCode",{parentName:"p"},"TopLevelParcel")," if it is not a child parcel. Examples: the parcel provided by a ParcelHoc, or a parcel created with ",Object(s.b)("inlineCode",{parentName:"p"},"new Parcel"),"."))}m.isMDXComponent=!0;var u=t(370);a.default=function(){return n.a.createElement(r.a,null,n.a.createElement(c.b,{pageTop:!0,pageBottom:!0,mdxHeading:!0,nav:u.b,pageNav:["# Parcel Types","ParentParcel","ChildParcel","IndexedParcel","ElementParcel","TopLevelParcel"]},n.a.createElement(m,null)))}}}]);
//# sourceMappingURL=component---src-pages-concepts-parcel-types-js-5f5cce632555498cf8ef.js.map