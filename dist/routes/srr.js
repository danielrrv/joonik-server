"use strict";

var _express = _interopRequireDefault(require("express"));

var _app = _interopRequireDefault(require("../components/app"));

var _react = _interopRequireDefault(require("react"));

var _server = require("react-dom/server");

var _handlebars = _interopRequireDefault(require("handlebars"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var router = _express["default"].Router();

router.get("/", /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
    var theHtml, hbsTemplate, reactComp, htmlToSend;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            theHtml = "\n    <html>\n    <head>\n    <title>JoonikShop</title>\n    <link\n  rel=\"stylesheet\"\n  href=\"https://unpkg.com/@shopify/polaris@4.14.0/styles.min.css\"/>\n    </head>\n    <body>\n    <div id=\"reactele\">{{{reactele}}}</div>\n    <script src=\"/app.js\" charset=\"utf-8\"></script>\n    <script src=\"/vendor.js\" charset=\"utf-8\"></script>\n    </body>\n    </html>\n    ";
            hbsTemplate = _handlebars["default"].compile(theHtml);
            reactComp = (0, _server.renderToString)(_react["default"].createElement(_app["default"], null));
            htmlToSend = hbsTemplate({
              reactele: reactComp
            });
            res.send(htmlToSend);

          case 5:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());
module.exports = router;