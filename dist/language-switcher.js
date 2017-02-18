(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 22);
/******/ })
/************************************************************************/
/******/ ({

/***/ 17:
/***/ (function(module, exports) {

eval("module.exports = \"<div class=\\\"language-switcher\\\">\\n  <div class=\\\"language-switcher-wrapper\\\">\\n    <button\\n      class=\\\"button language\\\"\\n      v-for=\\\"language in languages\\\"\\n      @click=\\\"$setLanguage(language.code)\\\">\\n        <span class=\\\"label\\\">{{ getLabel(language) }}</span>\\n    </button>\\n  </div>\\n</div>\\n\";//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50L2xhbmd1YWdlLXN3aXRjaGVyL2luZGV4Lmh0bWw/MWNmNyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxzUUFBc1Esc0JBQXNCIiwiZmlsZSI6IjE3LmpzIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBcIjxkaXYgY2xhc3M9XFxcImxhbmd1YWdlLXN3aXRjaGVyXFxcIj5cXG4gIDxkaXYgY2xhc3M9XFxcImxhbmd1YWdlLXN3aXRjaGVyLXdyYXBwZXJcXFwiPlxcbiAgICA8YnV0dG9uXFxuICAgICAgY2xhc3M9XFxcImJ1dHRvbiBsYW5ndWFnZVxcXCJcXG4gICAgICB2LWZvcj1cXFwibGFuZ3VhZ2UgaW4gbGFuZ3VhZ2VzXFxcIlxcbiAgICAgIEBjbGljaz1cXFwiJHNldExhbmd1YWdlKGxhbmd1YWdlLmNvZGUpXFxcIj5cXG4gICAgICAgIDxzcGFuIGNsYXNzPVxcXCJsYWJlbFxcXCI+e3sgZ2V0TGFiZWwobGFuZ3VhZ2UpIH19PC9zcGFuPlxcbiAgICA8L2J1dHRvbj5cXG4gIDwvZGl2PlxcbjwvZGl2PlxcblwiO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2NvbXBvbmVudC9sYW5ndWFnZS1zd2l0Y2hlci9pbmRleC5odG1sXG4vLyBtb2R1bGUgaWQgPSAxN1xuLy8gbW9kdWxlIGNodW5rcyA9IDIiXSwic291cmNlUm9vdCI6IiJ9");

/***/ }),

/***/ 22:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(5);


/***/ }),

/***/ 5:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _index = __webpack_require__(17);\n\nvar _index2 = _interopRequireDefault(_index);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nexports.default = {\n  template: _index2.default,\n\n  props: {\n    label: {\n      type: String,\n      default: 'code'\n    }\n  },\n\n  computed: {\n    languages: function languages() {\n      return this.$store.getters.availableLanguages;\n    }\n  },\n\n  methods: {\n    getLabel: function getLabel(language) {\n      var label = language[this.label];\n\n      if (!label) {\n        return language.code;\n      }\n\n      return label;\n    }\n  }\n};//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50L2xhbmd1YWdlLXN3aXRjaGVyL2luZGV4LmpzPzYzMGEiXSwibmFtZXMiOlsidGVtcGxhdGUiLCJwcm9wcyIsImxhYmVsIiwidHlwZSIsIlN0cmluZyIsImRlZmF1bHQiLCJjb21wdXRlZCIsImxhbmd1YWdlcyIsIiRzdG9yZSIsImdldHRlcnMiLCJhdmFpbGFibGVMYW5ndWFnZXMiLCJtZXRob2RzIiwiZ2V0TGFiZWwiLCJsYW5ndWFnZSIsImNvZGUiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7Ozs7a0JBRWU7QUFDYkEsMkJBRGE7O0FBR2JDLFNBQU87QUFDTEMsV0FBTztBQUNMQyxZQUFNQyxNQUREO0FBRUxDLGVBQVM7QUFGSjtBQURGLEdBSE07O0FBVWJDLFlBQVU7QUFDUkMsYUFEUSx1QkFDSztBQUNYLGFBQU8sS0FBS0MsTUFBTCxDQUFZQyxPQUFaLENBQW9CQyxrQkFBM0I7QUFDRDtBQUhPLEdBVkc7O0FBZ0JiQyxXQUFTO0FBQ1BDLFlBRE8sb0JBQ0dDLFFBREgsRUFDYTtBQUNsQixVQUFNWCxRQUFRVyxTQUFTLEtBQUtYLEtBQWQsQ0FBZDs7QUFFQSxVQUFJLENBQUNBLEtBQUwsRUFBWTtBQUNWLGVBQU9XLFNBQVNDLElBQWhCO0FBQ0Q7O0FBRUQsYUFBT1osS0FBUDtBQUNEO0FBVE07QUFoQkksQyIsImZpbGUiOiI1LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHRlbXBsYXRlIGZyb20gJy4vaW5kZXguaHRtbCdcblxuZXhwb3J0IGRlZmF1bHQge1xuICB0ZW1wbGF0ZSxcblxuICBwcm9wczoge1xuICAgIGxhYmVsOiB7XG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICBkZWZhdWx0OiAnY29kZSdcbiAgICB9XG4gIH0sXG5cbiAgY29tcHV0ZWQ6IHtcbiAgICBsYW5ndWFnZXMgKCkge1xuICAgICAgcmV0dXJuIHRoaXMuJHN0b3JlLmdldHRlcnMuYXZhaWxhYmxlTGFuZ3VhZ2VzXG4gICAgfVxuICB9LFxuXG4gIG1ldGhvZHM6IHtcbiAgICBnZXRMYWJlbCAobGFuZ3VhZ2UpIHtcbiAgICAgIGNvbnN0IGxhYmVsID0gbGFuZ3VhZ2VbdGhpcy5sYWJlbF1cblxuICAgICAgaWYgKCFsYWJlbCkge1xuICAgICAgICByZXR1cm4gbGFuZ3VhZ2UuY29kZVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gbGFiZWxcbiAgICB9XG4gIH1cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9jb21wb25lbnQvbGFuZ3VhZ2Utc3dpdGNoZXIvaW5kZXguanMiXSwic291cmNlUm9vdCI6IiJ9");

/***/ })

/******/ });
});