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
const app_1 = __importDefault(require("firebase/app"));
require("firebase/auth");
if (!process.env.ENV_MANAGEMENT_FIREBASE_CONFIG)
    throw new Error('Missing FIREBASE_CONFIG');
console.log(process.env.ENV_MANAGEMENT_FIREBASE_CONFIG);
const config = JSON.parse(process.env.ENV_MANAGEMENT_FIREBASE_CONFIG);
app_1.default.initializeApp(config);
const provider = new app_1.default.auth.GoogleAuthProvider();
const auth = app_1.default.auth();
auth.onAuthStateChanged((user) => __awaiter(void 0, void 0, void 0, function* () {
    if (user) {
        const tokenId = yield user.getIdToken();
        window.location.replace(`/auth?token_id=${tokenId}`);
    }
    else {
        console.log('User is signed out.');
        login();
    }
}));
function login() {
    auth.signInWithRedirect(provider).catch(error => console.error(error));
}
