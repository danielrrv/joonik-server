"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var App = /*#__PURE__*/function (_React$Component) {
  _inherits(App, _React$Component);

  function App() {
    var _this;

    _classCallCheck(this, App);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(App).call(this));

    _defineProperty(_assertThisInitialized(_this), "handleButtonClick", function (e) {
      var nameLen = _this.state.name.length;

      if (nameLen > 0) {
        _this.setState({
          msg: "You name has ".concat(nameLen, " characters including space")
        });
      }
    });

    _defineProperty(_assertThisInitialized(_this), "handleTextChange", function (e) {
      _this.setState({
        name: e.target.value
      });
    });

    _defineProperty(_assertThisInitialized(_this), "handleReset", function () {
      _this.setState({
        name: "",
        msg: ""
      });
    });

    _this.handleButtonClick = _this.handleButtonClick.bind(_assertThisInitialized(_this));
    _this.handleTextChange = _this.handleTextChange.bind(_assertThisInitialized(_this));
    _this.handleReset = _this.handleReset.bind(_assertThisInitialized(_this));
    _this.state = {
      name: "",
      msg: ""
    };
    return _this;
  } //Handlers


  _createClass(App, [{
    key: "render",
    //End Handlers
    value: function render() {
      var msg;

      if (this.state.msg !== "") {
        msg = _react["default"].createElement("p", null, this.state.msg);
      } else {
        msg = "";
      }

      return (//do something here where there is a button that will replace the text
        _react["default"].createElement("div", null, _react["default"].createElement("label", null, "Your name "), _react["default"].createElement("input", {
          type: "text",
          id: "txtName",
          name: "txtName",
          value: this.state.name,
          onChange: this.handleTextChange
        }), _react["default"].createElement("button", {
          id: "btnSubmit",
          onClick: this.handleButtonClick
        }, "Calculate Name Length"), _react["default"].createElement("button", {
          id: "btnReset",
          onClick: this.handleReset
        }, "Reset All"), _react["default"].createElement("hr", null), msg)
      );
    }
  }]);

  return App;
}(_react["default"].Component);

var _default = App;
exports["default"] = _default;