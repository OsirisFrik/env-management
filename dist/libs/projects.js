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
exports.loadProjects = void 0;
const debug_1 = __importDefault(require("debug"));
const firebase_1 = __importDefault(require("firebase"));
require("firebase/firestore");
const debug = debug_1.default('app:projects');
function loadProjects(app) {
    return __awaiter(this, void 0, void 0, function* () {
        debug(firebase_1.default.auth(app).currentUser.uid);
        const db = firebase_1.default.firestore(app);
        const projects = yield db.collection('projects')
            .where('users', 'in', [firebase_1.default.auth(app).currentUser.uid])
            .get();
        debug(projects.docs.length);
        return;
    });
}
exports.loadProjects = loadProjects;
