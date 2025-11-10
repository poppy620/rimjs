"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var lib_1 = require("./lib");
var http_1 = require("http");
var https_1 = require("https");
var each_1 = __importDefault(require("../each"));
var assign_1 = require("../assign");
var qs_1 = __importDefault(require("../qs"));
var path = __importStar(require("path"));
var fs_1 = require("fs");
// 实现具体的请求
// ajaxGlobal.isFormData = function(param, req) {
//     return req.dataType == "form-data"
// }
lib_1.ajaxGlobal.paramMerge = function (req, param) {
    var isFormData = param instanceof lib_1.NodeFormData;
    req.isFormData = isFormData;
    if (isFormData) {
        req.method = "POST";
        // FormData 将参数都添加到 FormData中
        each_1.default(req.param, function (value, key) {
            var fd = param;
            fd.set(key, value);
        });
        req.param = param;
        return;
    }
    if (typeof param == "string") {
        if (req.dataType == "text") {
            req.param = param;
            return;
        }
        // 参数为字符串，自动格式化为 object，后面合并后在序列化
        param = req.dataType != "json" || req.method == "GET" ? qs_1.default.parse(param) : JSON.parse(param);
    }
    req.param = assign_1.assign({ $: req.param }, { $: param || {} }).$;
};
lib_1.ajaxGlobal.fetchExecute = function (course, ajax) {
    var req = course.req;
    req.isCross = false;
    httpRequest.call(ajax, course);
};
// fetch 发送数据
function httpRequest(course) {
    return __awaiter(this, void 0, void 0, function () {
        // 上传
        function next() {
            if (!upArr.length) {
                client.end("\r\n--" + boundary + "--");
                return;
            }
            var item = upArr.shift();
            if (item.readStream) {
                // 流上传
                var formStr = "\r\n--" + boundary + "\r\n\" + \"Content-Type: application/octet-stream\r\nContent-Disposition: form-data; name=\"" + item.name + "\"" + (item.fileName ? '; filename="' + item.fileName + '"' : "") + "\r\nContent-@R_883_301@: binary\r\n\r\n";
                client.write(Buffer.from(formStr, "utf-8"));
                item.readStream.pipe(client, { end: false });
                item.readStream.on("end", function () {
                    next();
                });
                item.readStream.on("error", httpError);
                return;
            }
            if (item.buffer) {
                client.write("\r\n--" + boundary + "\r\nContent-Disposition: form-data; name=\"" + item.name + "\"" + (item.fileName ? '; filename="' + item.fileName + '"' : "") + "\r\n\r\n");
                client.write(item.buffer);
                next();
                return;
            }
            next();
        }
        var req, res, isHttps, method, param, option, isGet, boundary, reqSend, httpError, src, client, formData, upArr;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    req = course.req, res = course.res;
                    isHttps = /^https:/.test(req.url);
                    method = req.method;
                    param = req.param;
                    option = {
                        method: method,
                        headers: req.header
                    };
                    isGet = method == "GET";
                    boundary = "----WebKitFormBoundary" + new Date().getTime().toString(36);
                    if (isGet) {
                        req.url = lib_1.fixedURL(req.url, lib_1.getParamString(param));
                    }
                    else {
                        if (req.header["Content-Type"] === undefined) {
                            // 默认 Content-Type
                            req.header["Content-Type"] = req.isFormData ? "multipart/form-data; boundary=" + boundary : lib_1.getDefaultContentType(req.dataType);
                            // req.header["Content-Type"] = getDefaultContentType(req.dataType)
                        }
                        if (req.header["X-Requested-With"] === undefined) {
                            // 跨域不增加 X-Requested-With
                            req.header["X-Requested-With"] = "XMLHttpRequest";
                        }
                    }
                    reqSend = isHttps ? https_1.request : http_1.request;
                    httpError = function (e) {
                        if (!req.outFlag) {
                            res.err = e.message;
                            // 统一处理 返回数据
                            lib_1.responseEnd.call(_this, course);
                        }
                    };
                    src = req.url;
                    if (!isGet) {
                        req.body = req.isFormData ? param : lib_1.getParamString(req.param, req.dataType);
                    }
                    if (req.header["Content-Length"] === undefined && method != "GET" && method != "POST" && req.body && typeof req.body == 'string') {
                        req.header["Content-Length"] = Buffer.byteLength(req.body);
                    }
                    this.emit("send", course);
                    if (!req.awaitSend) return [3 /*break*/, 2];
                    // 有等待函数， 则 异步处理
                    return [4 /*yield*/, req.awaitSend(course)];
                case 1:
                    // 有等待函数， 则 异步处理
                    _a.sent();
                    _a.label = 2;
                case 2:
                    client = reqSend(src, option, function (cRes) {
                        cRes.setEncoding("utf8");
                        var chunks = [];
                        cRes.on("data", function (chunk) {
                            chunks.push(chunk);
                        });
                        cRes.on("error", httpError);
                        cRes.on("end", function () {
                            if (!req.outFlag) {
                                // 状态吗
                                var s = cRes.statusCode;
                                res.status = s;
                                // 设置 headers 方便获取
                                res.headers = cRes.headers;
                                // 是否有错误
                                res.err = (s >= 200 && s < 300) || s === 304 ? null : "http error [" + s + "]";
                                try {
                                    res.text = Buffer.isBuffer(chunks[0]) ? Buffer.concat(chunks).toString() : chunks.join("");
                                }
                                catch (e) { }
                                // 统一处理 返回数据
                                lib_1.responseEnd.call(_this, course);
                            }
                        });
                    });
                    req.nodeReq = client;
                    client.on("error", httpError);
                    if (isGet) {
                        client.end();
                        return [2 /*return*/];
                    }
                    if (!req.isFormData) {
                        client.write(req.body, "utf-8");
                        client.end();
                        return [2 /*return*/];
                    }
                    formData = req.body;
                    upArr = [];
                    formData.forEach(function (item, key) {
                        if (Buffer.isBuffer(item) || item instanceof fs_1.ReadStream || typeof item == "string") {
                            item = { value: item, name: key };
                        }
                        var it = {
                            name: item.name || key
                        };
                        if (Buffer.isBuffer(item.value)) {
                            it.buffer = item.value;
                        }
                        else if (item.value instanceof fs_1.ReadStream) {
                            it.readStream = item.value;
                        }
                        else if (item.url) {
                            it.readStream = fs_1.createReadStream(item.url);
                            if (!item.fileName) {
                                item.fileName = path.basename(item.url);
                            }
                        }
                        else if (typeof item.value == "string") {
                            it.buffer = Buffer.from(item.value, "utf-8");
                        }
                        if (it.buffer || it.readStream) {
                            if (item.fileName) {
                                it.fileName = item.fileName;
                            }
                            upArr.push(it);
                        }
                    });
                    next();
                    return [2 /*return*/];
            }
        });
    });
}
//# sourceMappingURL=node-http.js.map