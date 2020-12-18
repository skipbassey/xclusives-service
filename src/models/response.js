"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateResponse = exports.PutRespone = exports.GetResponse = exports.Response = void 0;
var Response = /** @class */ (function () {
    function Response(statusCode, body, headers, error) {
        if (error === void 0) { error = undefined; }
        this.statusCode = statusCode;
        this.body = body;
        this.headers = headers;
        this.error = error;
    }
    return Response;
}());
exports.Response = Response;
var GetResponse = /** @class */ (function (_super) {
    __extends(GetResponse, _super);
    function GetResponse() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return GetResponse;
}(Response));
exports.GetResponse = GetResponse;
var PutRespone = /** @class */ (function (_super) {
    __extends(PutRespone, _super);
    function PutRespone() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return PutRespone;
}(Response));
exports.PutRespone = PutRespone;
var CreateResponse = /** @class */ (function (_super) {
    __extends(CreateResponse, _super);
    function CreateResponse() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return CreateResponse;
}(Response));
exports.CreateResponse = CreateResponse;
