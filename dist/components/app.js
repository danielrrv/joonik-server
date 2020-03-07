"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _polaris = require("@shopify/polaris");

var _en = _interopRequireDefault(require("@shopify/polaris/locales/en.json"));

var _login = _interopRequireDefault(require("./login"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var App = function App() {
  // const { Component, pageProps } = props;
  return _react["default"].createElement(_polaris.AppProvider, {
    i18n: _en["default"]
  }, _react["default"].createElement(_login["default"], null));
};

var _default = App;
exports["default"] = _default;