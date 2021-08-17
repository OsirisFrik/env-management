"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const http_1 = __importDefault(require("http"));
const portfinder_1 = __importDefault(require("portfinder"));
const open_1 = __importDefault(require("open"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const debug_1 = __importDefault(require("debug"));
const cli_color_1 = __importDefault(require("cli-color"));
const qs_1 = __importDefault(require("qs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const store_1 = __importDefault(require("../store"));
const app_1 = __importDefault(require("firebase/app"));
require("firebase/auth");
const debug = debug_1.default('app:auth');
const TOKEN_SECRET = process.env.TOKEN_SECRET || 'DEFAULT_SECRET';
function createServer() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let page;
            const port = yield portfinder_1.default.getPortPromise();
            const server = http_1.default.createServer((req, res) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b, _c;
                debug(req.url);
                try {
                    if ((_a = req.url) === null || _a === void 0 ? void 0 : _a.startsWith('/auth?token_id')) {
                        res.write('login success. Now you can close this page');
                        res.end();
                        const query = qs_1.default.parse(((_b = req.url) === null || _b === void 0 ? void 0 : _b.split('?').pop()) || '');
                        debug(query);
                        server.close();
                        return resolve(query.token_id);
                    }
                    if ((_c = req.url) === null || _c === void 0 ? void 0 : _c.endsWith('.js')) {
                        const index = fs_1.default.readFileSync(path_1.default.join(__dirname, `../../templates${req.url}`));
                        res.writeHead(200);
                        res.end(index);
                        return;
                    }
                    if (req.url === '/') {
                        const index = fs_1.default.readFileSync(path_1.default.join(__dirname, '../../templates/index.html'));
                        res.writeHead(200);
                        res.end(index);
                        return;
                    }
                }
                catch (err) {
                    debug(err);
                    throw err;
                }
            }));
            server.listen(port);
            server.on('error', (err) => {
                server.close();
                reject(err);
            });
            console.info();
            console.info('Visit this URL on any device to log in:');
            console.info(cli_color_1.default.bold.underline(`http://locallhost:${port}/`));
            yield open_1.default(`http://localhost:${port}`, { wait: true });
        }));
    });
}
function validateTokenId(tokenId) {
    return __awaiter(this, void 0, void 0, function* () {
        const tokenData = yield firebase_admin_1.default.auth().verifyIdToken(tokenId);
        store_1.default.set('tokenId', tokenId);
        store_1.default.set('uid', tokenData.uid);
        const customTokenData = {
            uid: tokenData.uid,
            exp: tokenData.exp,
            authTime: tokenData.auth_time
        };
        const customToken = jsonwebtoken_1.default.sign(customTokenData, TOKEN_SECRET, {
            expiresIn: tokenData.exp
        });
        return customToken;
    });
}
function validateCustomtoken(token) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const tokenData = jsonwebtoken_1.default.verify(token, TOKEN_SECRET);
            return true;
        }
        catch (err) {
            throw err;
        }
    });
}
function authUser() {
    return __awaiter(this, void 0, void 0, function* () {
        const token = yield createServer();
        return yield validateTokenId(token);
    });
}
function loginUser() {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        let token = store_1.default.get('token');
        let validToken = false;
        if (token) {
            validToken = yield validateCustomtoken(token);
        }
        if (!validToken) {
            const tokenId = store_1.default.get('tokenId');
            if (!tokenId) {
                token = yield authUser();
            }
            else {
                token = yield validateTokenId(tokenId);
            }
        }
        const user = yield app_1.default.auth().signInWithCustomToken(token);
        console.log(`Hi ${cli_color_1.default.bold.cyan((_a = user.user) === null || _a === void 0 ? void 0 : _a.displayName)}`);
    });
}
exports.loginUser = loginUser;
