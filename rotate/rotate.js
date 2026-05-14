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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
var _this = this;
function newImg(src) {
    return __awaiter(this, void 0, void 0, function () {
        var img;
        return __generator(this, function (_a) {
            img = new Image();
            img.src = src;
            return [2 /*return*/, new Promise(function (resolve) {
                    img.onload = function () {
                        resolve(img);
                    };
                })];
        });
    });
}
var width = 1960;
var height = 1024;
window.addEventListener('DOMContentLoaded', function () { return __awaiter(_this, void 0, void 0, function () {
    function update(v, t) {
        var _a, _b;
        ctx.clearRect(0, 0, canvas.width, (_b = (_a = canvas.value) === null || _a === void 0 ? void 0 : _a.height) !== null && _b !== void 0 ? _b : 0);
        ctx.fillRect(0, 0, frameWidth, frameHeight);
        // // freq 0.3 1.0 3.0
        // const x = props.level + perlin2(0.23, t * noiseFreq * 0.001) * noiseAmp;
        // const frame = clamp(Math.floor(x * frameCount), 0, frameCount - 1);
        // ctx.drawImage(img, 0, frameHeight * frame, frameWidth, frameHeight, 0, 0, frameWidth * outputScale, frameHeight * outputScale);
    }
    var src, canv, ctx, img;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                src = "./public/sigil1.png";
                canv = document.getElementById('canvas');
                console.log(canv);
                ctx = (_a = canvas.value) === null || _a === void 0 ? void 0 : _a.getContext('2d');
                return [4 /*yield*/, newImg(src)];
            case 1:
                img = _b.sent();
                console.log(img);
                return [2 /*return*/];
        }
    });
}); });
