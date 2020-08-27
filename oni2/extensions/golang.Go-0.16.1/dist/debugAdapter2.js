module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 604);
/******/ })
/************************************************************************/
/******/ ({

/***/ 12:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 * Modification copyright 2020 The Go Authors. All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------*/

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getToolFromToolPath = exports.fixDriveCasingInWindows = exports.getCurrentGoWorkspaceFromGOPATH = exports.getInferredGopath = exports.parseEnvFile = exports.stripBOM = exports.resolveHomeDir = exports.clearCacheForTools = exports.pathExists = exports.fileExists = exports.correctBinname = exports.setCurrentGoRoot = exports.getCurrentGoRoot = exports.getBinPathWithPreferredGopathGoroot = exports.getBinPathFromEnvVar = exports.envPath = void 0;
/**
 * This file is loaded by both the extension and debug adapter, so it cannot import 'vscode'
 */
const fs = __webpack_require__(8);
const os = __webpack_require__(26);
const path = __webpack_require__(2);
const util_1 = __webpack_require__(3);
let binPathCache = {};
exports.envPath = process.env['PATH'] || (process.platform === 'win32' ? process.env['Path'] : null);
function getBinPathFromEnvVar(toolName, envVarValue, appendBinToPath) {
    toolName = correctBinname(toolName);
    if (envVarValue) {
        const paths = envVarValue.split(path.delimiter);
        for (const p of paths) {
            const binpath = path.join(p, appendBinToPath ? 'bin' : '', toolName);
            if (executableFileExists(binpath)) {
                return binpath;
            }
        }
    }
    return null;
}
exports.getBinPathFromEnvVar = getBinPathFromEnvVar;
function getBinPathWithPreferredGopathGoroot(toolName, preferredGopaths, preferredGoroot, alternateTool, useCache = true) {
    if (alternateTool && path.isAbsolute(alternateTool) && executableFileExists(alternateTool)) {
        binPathCache[toolName] = alternateTool;
        return alternateTool;
    }
    // FIXIT: this cache needs to be invalidated when go.goroot or go.alternateTool is changed.
    if (useCache && binPathCache[toolName]) {
        return binPathCache[toolName];
    }
    const binname = alternateTool && !path.isAbsolute(alternateTool) ? alternateTool : toolName;
    const pathFromGoBin = getBinPathFromEnvVar(binname, process.env['GOBIN'], false);
    if (pathFromGoBin) {
        binPathCache[toolName] = pathFromGoBin;
        return pathFromGoBin;
    }
    for (const preferred of preferredGopaths) {
        if (typeof preferred === 'string') {
            // Search in the preferred GOPATH workspace's bin folder
            const pathFrompreferredGoPath = getBinPathFromEnvVar(binname, preferred, true);
            if (pathFrompreferredGoPath) {
                binPathCache[toolName] = pathFrompreferredGoPath;
                return pathFrompreferredGoPath;
            }
        }
    }
    // Check GOROOT (go, gofmt, godoc would be found here)
    const pathFromGoRoot = getBinPathFromEnvVar(binname, preferredGoroot || getCurrentGoRoot(), true);
    if (pathFromGoRoot) {
        binPathCache[toolName] = pathFromGoRoot;
        return pathFromGoRoot;
    }
    // Finally search PATH parts
    const pathFromPath = getBinPathFromEnvVar(binname, exports.envPath, false);
    if (pathFromPath) {
        binPathCache[toolName] = pathFromPath;
        return pathFromPath;
    }
    // Check default path for go
    if (toolName === 'go') {
        const defaultPathForGo = process.platform === 'win32' ? 'C:\\Go\\bin\\go.exe' : '/usr/local/go/bin/go';
        if (executableFileExists(defaultPathForGo)) {
            binPathCache[toolName] = defaultPathForGo;
            return defaultPathForGo;
        }
        return;
    }
    // Else return the binary name directly (this will likely always fail downstream)
    return toolName;
}
exports.getBinPathWithPreferredGopathGoroot = getBinPathWithPreferredGopathGoroot;
/**
 * Returns the goroot path if it exists, otherwise returns an empty string
 */
let currentGoRoot = '';
function getCurrentGoRoot() {
    return currentGoRoot || process.env['GOROOT'] || '';
}
exports.getCurrentGoRoot = getCurrentGoRoot;
function setCurrentGoRoot(goroot) {
    currentGoRoot = goroot;
}
exports.setCurrentGoRoot = setCurrentGoRoot;
function correctBinname(toolName) {
    if (process.platform === 'win32') {
        return toolName + '.exe';
    }
    return toolName;
}
exports.correctBinname = correctBinname;
function executableFileExists(filePath) {
    let exists = true;
    try {
        exists = fs.statSync(filePath).isFile();
        if (exists) {
            fs.accessSync(filePath, fs.constants.F_OK | fs.constants.X_OK);
        }
    }
    catch (e) {
        exists = false;
    }
    return exists;
}
function fileExists(filePath) {
    try {
        return fs.statSync(filePath).isFile();
    }
    catch (e) {
        return false;
    }
}
exports.fileExists = fileExists;
function pathExists(p) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const stat = util_1.promisify(fs.stat);
            return (yield stat(p)).isDirectory();
        }
        catch (e) {
            return false;
        }
    });
}
exports.pathExists = pathExists;
function clearCacheForTools() {
    binPathCache = {};
}
exports.clearCacheForTools = clearCacheForTools;
/**
 * Exapnds ~ to homedir in non-Windows platform
 */
function resolveHomeDir(inputPath) {
    if (!inputPath || !inputPath.trim()) {
        return inputPath;
    }
    return inputPath.startsWith('~') ? path.join(os.homedir(), inputPath.substr(1)) : inputPath;
}
exports.resolveHomeDir = resolveHomeDir;
function stripBOM(s) {
    if (s && s[0] === '\uFEFF') {
        s = s.substr(1);
    }
    return s;
}
exports.stripBOM = stripBOM;
function parseEnvFile(envFilePath) {
    const env = {};
    if (!envFilePath) {
        return env;
    }
    try {
        const buffer = stripBOM(fs.readFileSync(envFilePath, 'utf8'));
        buffer.split('\n').forEach((line) => {
            const r = line.match(/^\s*([\w\.\-]+)\s*=\s*(.*)?\s*$/);
            if (r !== null) {
                let value = r[2] || '';
                if (value.length > 0 && value.charAt(0) === '"' && value.charAt(value.length - 1) === '"') {
                    value = value.replace(/\\n/gm, '\n');
                }
                env[r[1]] = value.replace(/(^['"]|['"]$)/g, '');
            }
        });
        return env;
    }
    catch (e) {
        throw new Error(`Cannot load environment variables from file ${envFilePath}`);
    }
}
exports.parseEnvFile = parseEnvFile;
// Walks up given folder path to return the closest ancestor that has `src` as a child
function getInferredGopath(folderPath) {
    if (!folderPath) {
        return;
    }
    const dirs = folderPath.toLowerCase().split(path.sep);
    // find src directory closest to given folder path
    const srcIdx = dirs.lastIndexOf('src');
    if (srcIdx > 0) {
        return folderPath.substr(0, dirs.slice(0, srcIdx).join(path.sep).length);
    }
}
exports.getInferredGopath = getInferredGopath;
/**
 * Returns the workspace in the given Gopath to which given directory path belongs to
 * @param gopath string Current Gopath. Can be ; or : separated (as per os) to support multiple paths
 * @param currentFileDirPath string
 */
function getCurrentGoWorkspaceFromGOPATH(gopath, currentFileDirPath) {
    if (!gopath) {
        return;
    }
    const workspaces = gopath.split(path.delimiter);
    let currentWorkspace = '';
    currentFileDirPath = fixDriveCasingInWindows(currentFileDirPath);
    // Find current workspace by checking if current file is
    // under any of the workspaces in $GOPATH
    for (const workspace of workspaces) {
        const possibleCurrentWorkspace = path.join(workspace, 'src');
        if (currentFileDirPath.startsWith(possibleCurrentWorkspace) ||
            (process.platform === 'win32' &&
                currentFileDirPath.toLowerCase().startsWith(possibleCurrentWorkspace.toLowerCase()))) {
            // In case of nested workspaces, (example: both /Users/me and /Users/me/src/a/b/c are in $GOPATH)
            // both parent & child workspace in the nested workspaces pair can make it inside the above if block
            // Therefore, the below check will take longer (more specific to current file) of the two
            if (possibleCurrentWorkspace.length > currentWorkspace.length) {
                currentWorkspace = currentFileDirPath.substr(0, possibleCurrentWorkspace.length);
            }
        }
    }
    return currentWorkspace;
}
exports.getCurrentGoWorkspaceFromGOPATH = getCurrentGoWorkspaceFromGOPATH;
// Workaround for issue in https://github.com/Microsoft/vscode/issues/9448#issuecomment-244804026
function fixDriveCasingInWindows(pathToFix) {
    return process.platform === 'win32' && pathToFix
        ? pathToFix.substr(0, 1).toUpperCase() + pathToFix.substr(1)
        : pathToFix;
}
exports.fixDriveCasingInWindows = fixDriveCasingInWindows;
/**
 * Returns the tool name from the given path to the tool
 * @param toolPath
 */
function getToolFromToolPath(toolPath) {
    if (!toolPath) {
        return;
    }
    let tool = path.basename(toolPath);
    if (process.platform === 'win32' && tool.endsWith('.exe')) {
        tool = tool.substr(0, tool.length - 4);
    }
    return tool;
}
exports.getToolFromToolPath = getToolFromToolPath;


/***/ }),

/***/ 121:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
const ee = __webpack_require__(31);
const messages_1 = __webpack_require__(44);
class Disposable0 {
    dispose() {
    }
}
class Emitter {
    get event() {
        if (!this._event) {
            this._event = (listener, thisArg) => {
                this._listener = listener;
                this._this = thisArg;
                let result;
                result = {
                    dispose: () => {
                        this._listener = undefined;
                        this._this = undefined;
                    }
                };
                return result;
            };
        }
        return this._event;
    }
    fire(event) {
        if (this._listener) {
            try {
                this._listener.call(this._this, event);
            }
            catch (e) {
            }
        }
    }
    hasListener() {
        return !!this._listener;
    }
    dispose() {
        this._listener = undefined;
        this._this = undefined;
    }
}
class ProtocolServer extends ee.EventEmitter {
    constructor() {
        super();
        this._sendMessage = new Emitter();
        this._pendingRequests = new Map();
        this.onDidSendMessage = this._sendMessage.event;
    }
    // ---- implements vscode.Debugadapter interface ---------------------------
    dispose() {
    }
    handleMessage(msg) {
        if (msg.type === 'request') {
            this.dispatchRequest(msg);
        }
        else if (msg.type === 'response') {
            const response = msg;
            const clb = this._pendingRequests.get(response.request_seq);
            if (clb) {
                this._pendingRequests.delete(response.request_seq);
                clb(response);
            }
        }
    }
    _isRunningInline() {
        return this._sendMessage && this._sendMessage.hasListener();
    }
    //--------------------------------------------------------------------------
    start(inStream, outStream) {
        this._sequence = 1;
        this._writableStream = outStream;
        this._rawData = new Buffer(0);
        inStream.on('data', (data) => this._handleData(data));
        inStream.on('close', () => {
            this._emitEvent(new messages_1.Event('close'));
        });
        inStream.on('error', (error) => {
            this._emitEvent(new messages_1.Event('error', 'inStream error: ' + (error && error.message)));
        });
        outStream.on('error', (error) => {
            this._emitEvent(new messages_1.Event('error', 'outStream error: ' + (error && error.message)));
        });
        inStream.resume();
    }
    stop() {
        if (this._writableStream) {
            this._writableStream.end();
        }
    }
    sendEvent(event) {
        this._send('event', event);
    }
    sendResponse(response) {
        if (response.seq > 0) {
            console.error(`attempt to send more than one response for command ${response.command}`);
        }
        else {
            this._send('response', response);
        }
    }
    sendRequest(command, args, timeout, cb) {
        const request = {
            command: command
        };
        if (args && Object.keys(args).length > 0) {
            request.arguments = args;
        }
        this._send('request', request);
        if (cb) {
            this._pendingRequests.set(request.seq, cb);
            const timer = setTimeout(() => {
                clearTimeout(timer);
                const clb = this._pendingRequests.get(request.seq);
                if (clb) {
                    this._pendingRequests.delete(request.seq);
                    clb(new messages_1.Response(request, 'timeout'));
                }
            }, timeout);
        }
    }
    // ---- protected ----------------------------------------------------------
    dispatchRequest(request) {
    }
    // ---- private ------------------------------------------------------------
    _emitEvent(event) {
        this.emit(event.event, event);
    }
    _send(typ, message) {
        message.type = typ;
        message.seq = this._sequence++;
        if (this._writableStream) {
            const json = JSON.stringify(message);
            this._writableStream.write(`Content-Length: ${Buffer.byteLength(json, 'utf8')}\r\n\r\n${json}`, 'utf8');
        }
        this._sendMessage.fire(message);
    }
    _handleData(data) {
        this._rawData = Buffer.concat([this._rawData, data]);
        while (true) {
            if (this._contentLength >= 0) {
                if (this._rawData.length >= this._contentLength) {
                    const message = this._rawData.toString('utf8', 0, this._contentLength);
                    this._rawData = this._rawData.slice(this._contentLength);
                    this._contentLength = -1;
                    if (message.length > 0) {
                        try {
                            let msg = JSON.parse(message);
                            this.handleMessage(msg);
                        }
                        catch (e) {
                            this._emitEvent(new messages_1.Event('error', 'Error handling data: ' + (e && e.message)));
                        }
                    }
                    continue; // there may be more complete messages to process
                }
            }
            else {
                const idx = this._rawData.indexOf(ProtocolServer.TWO_CRLF);
                if (idx !== -1) {
                    const header = this._rawData.toString('utf8', 0, idx);
                    const lines = header.split('\r\n');
                    for (let i = 0; i < lines.length; i++) {
                        const pair = lines[i].split(/: +/);
                        if (pair[0] == 'Content-Length') {
                            this._contentLength = +pair[1];
                        }
                    }
                    this._rawData = this._rawData.slice(idx + ProtocolServer.TWO_CRLF.length);
                    continue;
                }
            }
            break;
        }
    }
}
ProtocolServer.TWO_CRLF = '\r\n\r\n';
exports.ProtocolServer = ProtocolServer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvdG9jb2wuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvcHJvdG9jb2wudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Z0dBR2dHOztBQUVoRyw2QkFBNkI7QUFFN0IseUNBQTZDO0FBUzdDLE1BQU0sV0FBVztJQUNoQixPQUFPO0lBQ1AsQ0FBQztDQUNEO0FBTUQsTUFBTSxPQUFPO0lBTVosSUFBSSxLQUFLO1FBQ1IsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDakIsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLFFBQXVCLEVBQUUsT0FBYSxFQUFFLEVBQUU7Z0JBRXhELElBQUksQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDO2dCQUMxQixJQUFJLENBQUMsS0FBSyxHQUFHLE9BQU8sQ0FBQztnQkFFckIsSUFBSSxNQUFtQixDQUFDO2dCQUN4QixNQUFNLEdBQUc7b0JBQ1IsT0FBTyxFQUFFLEdBQUcsRUFBRTt3QkFDYixJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQzt3QkFDM0IsSUFBSSxDQUFDLEtBQUssR0FBRyxTQUFTLENBQUM7b0JBQ3hCLENBQUM7aUJBQ0QsQ0FBQztnQkFDRixPQUFPLE1BQU0sQ0FBQztZQUNmLENBQUMsQ0FBQztTQUNGO1FBQ0QsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQ3BCLENBQUM7SUFFRCxJQUFJLENBQUMsS0FBUTtRQUNaLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUNuQixJQUFJO2dCQUNILElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7YUFDdkM7WUFBQyxPQUFPLENBQUMsRUFBRTthQUNYO1NBQ0Q7SUFDRixDQUFDO0lBRUQsV0FBVztRQUNWLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUM7SUFDekIsQ0FBQztJQUVELE9BQU87UUFDTixJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztRQUMzQixJQUFJLENBQUMsS0FBSyxHQUFHLFNBQVMsQ0FBQztJQUN4QixDQUFDO0NBQ0Q7QUFZRCxNQUFhLGNBQWUsU0FBUSxFQUFFLENBQUMsWUFBWTtJQVlsRDtRQUNDLEtBQUssRUFBRSxDQUFDO1FBVEQsaUJBQVksR0FBRyxJQUFJLE9BQU8sRUFBd0IsQ0FBQztRQU1uRCxxQkFBZ0IsR0FBRyxJQUFJLEdBQUcsRUFBc0QsQ0FBQztRQVdsRixxQkFBZ0IsR0FBaUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUM7SUFQaEYsQ0FBQztJQUVELDRFQUE0RTtJQUVyRSxPQUFPO0lBQ2QsQ0FBQztJQUlNLGFBQWEsQ0FBQyxHQUFrQztRQUN0RCxJQUFJLEdBQUcsQ0FBQyxJQUFJLEtBQUssU0FBUyxFQUFFO1lBQzNCLElBQUksQ0FBQyxlQUFlLENBQXdCLEdBQUcsQ0FBQyxDQUFDO1NBQ2pEO2FBQU0sSUFBSSxHQUFHLENBQUMsSUFBSSxLQUFLLFVBQVUsRUFBRTtZQUNuQyxNQUFNLFFBQVEsR0FBMkIsR0FBRyxDQUFDO1lBQzdDLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQzVELElBQUksR0FBRyxFQUFFO2dCQUNSLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDO2dCQUNuRCxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7YUFDZDtTQUNEO0lBQ0YsQ0FBQztJQUVTLGdCQUFnQjtRQUN6QixPQUFPLElBQUksQ0FBQyxZQUFZLElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUM3RCxDQUFDO0lBRUQsNEVBQTRFO0lBRXJFLEtBQUssQ0FBQyxRQUErQixFQUFFLFNBQWdDO1FBQzdFLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDO1FBQ25CLElBQUksQ0FBQyxlQUFlLEdBQUcsU0FBUyxDQUFDO1FBQ2pDLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFOUIsUUFBUSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxJQUFZLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUU5RCxRQUFRLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUU7WUFDekIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLGdCQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztRQUNyQyxDQUFDLENBQUMsQ0FBQztRQUNILFFBQVEsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUMsS0FBSyxFQUFFLEVBQUU7WUFDOUIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLGdCQUFLLENBQUMsT0FBTyxFQUFFLGtCQUFrQixHQUFHLENBQUMsS0FBSyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDcEYsQ0FBQyxDQUFDLENBQUM7UUFFSCxTQUFTLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDLEtBQUssRUFBRSxFQUFFO1lBQy9CLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxnQkFBSyxDQUFDLE9BQU8sRUFBRSxtQkFBbUIsR0FBRyxDQUFDLEtBQUssSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3JGLENBQUMsQ0FBQyxDQUFDO1FBRUgsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQ25CLENBQUM7SUFFTSxJQUFJO1FBQ1YsSUFBSSxJQUFJLENBQUMsZUFBZSxFQUFFO1lBQ3pCLElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxFQUFFLENBQUM7U0FDM0I7SUFDRixDQUFDO0lBRU0sU0FBUyxDQUFDLEtBQTBCO1FBQzFDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQzVCLENBQUM7SUFFTSxZQUFZLENBQUMsUUFBZ0M7UUFDbkQsSUFBSSxRQUFRLENBQUMsR0FBRyxHQUFHLENBQUMsRUFBRTtZQUNyQixPQUFPLENBQUMsS0FBSyxDQUFDLHNEQUFzRCxRQUFRLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztTQUN4RjthQUFNO1lBQ04sSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLEVBQUUsUUFBUSxDQUFDLENBQUM7U0FDakM7SUFDRixDQUFDO0lBRU0sV0FBVyxDQUFDLE9BQWUsRUFBRSxJQUFTLEVBQUUsT0FBZSxFQUFFLEVBQThDO1FBRTdHLE1BQU0sT0FBTyxHQUFRO1lBQ3BCLE9BQU8sRUFBRSxPQUFPO1NBQ2hCLENBQUM7UUFDRixJQUFJLElBQUksSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDekMsT0FBTyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7U0FDekI7UUFFRCxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUUvQixJQUFJLEVBQUUsRUFBRTtZQUNQLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUUzQyxNQUFNLEtBQUssR0FBRyxVQUFVLENBQUMsR0FBRyxFQUFFO2dCQUM3QixZQUFZLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ3BCLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNuRCxJQUFJLEdBQUcsRUFBRTtvQkFDUixJQUFJLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDMUMsR0FBRyxDQUFDLElBQUksbUJBQVEsQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQztpQkFDdEM7WUFDRixDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUM7U0FDWjtJQUNGLENBQUM7SUFFRCw0RUFBNEU7SUFFbEUsZUFBZSxDQUFDLE9BQThCO0lBQ3hELENBQUM7SUFFRCw0RUFBNEU7SUFFcEUsVUFBVSxDQUFDLEtBQTBCO1FBQzVDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztJQUMvQixDQUFDO0lBRU8sS0FBSyxDQUFDLEdBQXFDLEVBQUUsT0FBc0M7UUFFMUYsT0FBTyxDQUFDLElBQUksR0FBRyxHQUFHLENBQUM7UUFDbkIsT0FBTyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7UUFFL0IsSUFBSSxJQUFJLENBQUMsZUFBZSxFQUFFO1lBQ3pCLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDckMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsbUJBQW1CLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxXQUFXLElBQUksRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1NBQ3hHO1FBQ0QsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDakMsQ0FBQztJQUVPLFdBQVcsQ0FBQyxJQUFZO1FBRS9CLElBQUksQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUVyRCxPQUFPLElBQUksRUFBRTtZQUNaLElBQUksSUFBSSxDQUFDLGNBQWMsSUFBSSxDQUFDLEVBQUU7Z0JBQzdCLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLGNBQWMsRUFBRTtvQkFDaEQsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7b0JBQ3ZFLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO29CQUN6RCxJQUFJLENBQUMsY0FBYyxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUN6QixJQUFJLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO3dCQUN2QixJQUFJOzRCQUNILElBQUksR0FBRyxHQUFrQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDOzRCQUM3RCxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDO3lCQUN4Qjt3QkFDRCxPQUFPLENBQUMsRUFBRTs0QkFDVCxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksZ0JBQUssQ0FBQyxPQUFPLEVBQUUsdUJBQXVCLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQzt5QkFDaEY7cUJBQ0Q7b0JBQ0QsU0FBUyxDQUFDLGlEQUFpRDtpQkFDM0Q7YUFDRDtpQkFBTTtnQkFDTixNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQzNELElBQUksR0FBRyxLQUFLLENBQUMsQ0FBQyxFQUFFO29CQUNmLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7b0JBQ3RELE1BQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7b0JBQ25DLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO3dCQUN0QyxNQUFNLElBQUksR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO3dCQUNuQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxnQkFBZ0IsRUFBRTs0QkFDaEMsSUFBSSxDQUFDLGNBQWMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQzt5QkFDL0I7cUJBQ0Q7b0JBQ0QsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsY0FBYyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztvQkFDMUUsU0FBUztpQkFDVDthQUNEO1lBQ0QsTUFBTTtTQUNOO0lBQ0YsQ0FBQzs7QUFyS2MsdUJBQVEsR0FBRyxVQUFVLENBQUM7QUFGdEMsd0NBd0tDIiwic291cmNlc0NvbnRlbnQiOlsiLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqICBDb3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqICBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuIFNlZSBMaWNlbnNlLnR4dCBpbiB0aGUgcHJvamVjdCByb290IGZvciBsaWNlbnNlIGluZm9ybWF0aW9uLlxuICotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbmltcG9ydCAqIGFzIGVlIGZyb20gJ2V2ZW50cyc7XG5pbXBvcnQgeyBEZWJ1Z1Byb3RvY29sIH0gZnJvbSAndnNjb2RlLWRlYnVncHJvdG9jb2wnO1xuaW1wb3J0IHsgUmVzcG9uc2UsIEV2ZW50IH0gZnJvbSAnLi9tZXNzYWdlcyc7XG5cbmludGVyZmFjZSBEZWJ1Z1Byb3RvY29sTWVzc2FnZSB7XG59XG5cbmludGVyZmFjZSBJRGlzcG9zYWJsZSB7XG5cdGRpc3Bvc2UoKTogdm9pZDtcbn1cblxuY2xhc3MgRGlzcG9zYWJsZTAgaW1wbGVtZW50cyBJRGlzcG9zYWJsZSB7XG5cdGRpc3Bvc2UoKTogYW55IHtcblx0fVxufVxuXG5pbnRlcmZhY2UgRXZlbnQwPFQ+IHtcblx0KGxpc3RlbmVyOiAoZTogVCkgPT4gYW55LCB0aGlzQXJnPzogYW55KTogRGlzcG9zYWJsZTA7XG59XG5cbmNsYXNzIEVtaXR0ZXI8VD4ge1xuXG5cdHByaXZhdGUgX2V2ZW50PzogRXZlbnQwPFQ+O1xuXHRwcml2YXRlIF9saXN0ZW5lcj86IChlOiBUKSA9PiB2b2lkO1xuXHRwcml2YXRlIF90aGlzPzogYW55O1xuXG5cdGdldCBldmVudCgpOiBFdmVudDA8VD4ge1xuXHRcdGlmICghdGhpcy5fZXZlbnQpIHtcblx0XHRcdHRoaXMuX2V2ZW50ID0gKGxpc3RlbmVyOiAoZTogVCkgPT4gYW55LCB0aGlzQXJnPzogYW55KSA9PiB7XG5cblx0XHRcdFx0dGhpcy5fbGlzdGVuZXIgPSBsaXN0ZW5lcjtcblx0XHRcdFx0dGhpcy5fdGhpcyA9IHRoaXNBcmc7XG5cblx0XHRcdFx0bGV0IHJlc3VsdDogSURpc3Bvc2FibGU7XG5cdFx0XHRcdHJlc3VsdCA9IHtcblx0XHRcdFx0XHRkaXNwb3NlOiAoKSA9PiB7XG5cdFx0XHRcdFx0XHR0aGlzLl9saXN0ZW5lciA9IHVuZGVmaW5lZDtcblx0XHRcdFx0XHRcdHRoaXMuX3RoaXMgPSB1bmRlZmluZWQ7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9O1xuXHRcdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdFx0fTtcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXMuX2V2ZW50O1xuXHR9XG5cblx0ZmlyZShldmVudDogVCk6IHZvaWQge1xuXHRcdGlmICh0aGlzLl9saXN0ZW5lcikge1xuXHRcdFx0dHJ5IHtcblx0XHRcdFx0dGhpcy5fbGlzdGVuZXIuY2FsbCh0aGlzLl90aGlzLCBldmVudCk7XG5cdFx0XHR9IGNhdGNoIChlKSB7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0aGFzTGlzdGVuZXIoKSA6IGJvb2xlYW4ge1xuXHRcdHJldHVybiAhIXRoaXMuX2xpc3RlbmVyO1xuXHR9XG5cblx0ZGlzcG9zZSgpIHtcblx0XHR0aGlzLl9saXN0ZW5lciA9IHVuZGVmaW5lZDtcblx0XHR0aGlzLl90aGlzID0gdW5kZWZpbmVkO1xuXHR9XG59XG5cbi8qKlxuICogQSBzdHJ1Y3R1cmFsbHkgZXF1aXZhbGVudCBjb3B5IG9mIHZzY29kZS5EZWJ1Z0FkYXB0ZXJcbiAqL1xuaW50ZXJmYWNlIFZTQ29kZURlYnVnQWRhcHRlciBleHRlbmRzIERpc3Bvc2FibGUwIHtcblxuXHRyZWFkb25seSBvbkRpZFNlbmRNZXNzYWdlOiBFdmVudDA8RGVidWdQcm90b2NvbE1lc3NhZ2U+O1xuXG5cdGhhbmRsZU1lc3NhZ2UobWVzc2FnZTogRGVidWdQcm90b2NvbC5Qcm90b2NvbE1lc3NhZ2UpOiB2b2lkO1xufVxuXG5leHBvcnQgY2xhc3MgUHJvdG9jb2xTZXJ2ZXIgZXh0ZW5kcyBlZS5FdmVudEVtaXR0ZXIgaW1wbGVtZW50cyBWU0NvZGVEZWJ1Z0FkYXB0ZXIge1xuXG5cdHByaXZhdGUgc3RhdGljIFRXT19DUkxGID0gJ1xcclxcblxcclxcbic7XG5cblx0cHJpdmF0ZSBfc2VuZE1lc3NhZ2UgPSBuZXcgRW1pdHRlcjxEZWJ1Z1Byb3RvY29sTWVzc2FnZT4oKTtcblxuXHRwcml2YXRlIF9yYXdEYXRhOiBCdWZmZXI7XG5cdHByaXZhdGUgX2NvbnRlbnRMZW5ndGg6IG51bWJlcjtcblx0cHJpdmF0ZSBfc2VxdWVuY2U6IG51bWJlcjtcblx0cHJpdmF0ZSBfd3JpdGFibGVTdHJlYW06IE5vZGVKUy5Xcml0YWJsZVN0cmVhbTtcblx0cHJpdmF0ZSBfcGVuZGluZ1JlcXVlc3RzID0gbmV3IE1hcDxudW1iZXIsIChyZXNwb25zZTogRGVidWdQcm90b2NvbC5SZXNwb25zZSkgPT4gdm9pZD4oKTtcblxuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHRzdXBlcigpO1xuXHR9XG5cblx0Ly8gLS0tLSBpbXBsZW1lbnRzIHZzY29kZS5EZWJ1Z2FkYXB0ZXIgaW50ZXJmYWNlIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5cdHB1YmxpYyBkaXNwb3NlKCk6IGFueSB7XG5cdH1cblxuXHRwdWJsaWMgb25EaWRTZW5kTWVzc2FnZTogRXZlbnQwPERlYnVnUHJvdG9jb2xNZXNzYWdlPiA9IHRoaXMuX3NlbmRNZXNzYWdlLmV2ZW50O1xuXG5cdHB1YmxpYyBoYW5kbGVNZXNzYWdlKG1zZzogRGVidWdQcm90b2NvbC5Qcm90b2NvbE1lc3NhZ2UpOiB2b2lkIHtcblx0XHRpZiAobXNnLnR5cGUgPT09ICdyZXF1ZXN0Jykge1xuXHRcdFx0dGhpcy5kaXNwYXRjaFJlcXVlc3QoPERlYnVnUHJvdG9jb2wuUmVxdWVzdD5tc2cpO1xuXHRcdH0gZWxzZSBpZiAobXNnLnR5cGUgPT09ICdyZXNwb25zZScpIHtcblx0XHRcdGNvbnN0IHJlc3BvbnNlID0gPERlYnVnUHJvdG9jb2wuUmVzcG9uc2U+bXNnO1xuXHRcdFx0Y29uc3QgY2xiID0gdGhpcy5fcGVuZGluZ1JlcXVlc3RzLmdldChyZXNwb25zZS5yZXF1ZXN0X3NlcSk7XG5cdFx0XHRpZiAoY2xiKSB7XG5cdFx0XHRcdHRoaXMuX3BlbmRpbmdSZXF1ZXN0cy5kZWxldGUocmVzcG9uc2UucmVxdWVzdF9zZXEpO1xuXHRcdFx0XHRjbGIocmVzcG9uc2UpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHByb3RlY3RlZCBfaXNSdW5uaW5nSW5saW5lKCkge1xuXHRcdHJldHVybiB0aGlzLl9zZW5kTWVzc2FnZSAmJiB0aGlzLl9zZW5kTWVzc2FnZS5oYXNMaXN0ZW5lcigpO1xuXHR9XG5cblx0Ly8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5cdHB1YmxpYyBzdGFydChpblN0cmVhbTogTm9kZUpTLlJlYWRhYmxlU3RyZWFtLCBvdXRTdHJlYW06IE5vZGVKUy5Xcml0YWJsZVN0cmVhbSk6IHZvaWQge1xuXHRcdHRoaXMuX3NlcXVlbmNlID0gMTtcblx0XHR0aGlzLl93cml0YWJsZVN0cmVhbSA9IG91dFN0cmVhbTtcblx0XHR0aGlzLl9yYXdEYXRhID0gbmV3IEJ1ZmZlcigwKTtcblxuXHRcdGluU3RyZWFtLm9uKCdkYXRhJywgKGRhdGE6IEJ1ZmZlcikgPT4gdGhpcy5faGFuZGxlRGF0YShkYXRhKSk7XG5cblx0XHRpblN0cmVhbS5vbignY2xvc2UnLCAoKSA9PiB7XG5cdFx0XHR0aGlzLl9lbWl0RXZlbnQobmV3IEV2ZW50KCdjbG9zZScpKTtcblx0XHR9KTtcblx0XHRpblN0cmVhbS5vbignZXJyb3InLCAoZXJyb3IpID0+IHtcblx0XHRcdHRoaXMuX2VtaXRFdmVudChuZXcgRXZlbnQoJ2Vycm9yJywgJ2luU3RyZWFtIGVycm9yOiAnICsgKGVycm9yICYmIGVycm9yLm1lc3NhZ2UpKSk7XG5cdFx0fSk7XG5cblx0XHRvdXRTdHJlYW0ub24oJ2Vycm9yJywgKGVycm9yKSA9PiB7XG5cdFx0XHR0aGlzLl9lbWl0RXZlbnQobmV3IEV2ZW50KCdlcnJvcicsICdvdXRTdHJlYW0gZXJyb3I6ICcgKyAoZXJyb3IgJiYgZXJyb3IubWVzc2FnZSkpKTtcblx0XHR9KTtcblxuXHRcdGluU3RyZWFtLnJlc3VtZSgpO1xuXHR9XG5cblx0cHVibGljIHN0b3AoKTogdm9pZCB7XG5cdFx0aWYgKHRoaXMuX3dyaXRhYmxlU3RyZWFtKSB7XG5cdFx0XHR0aGlzLl93cml0YWJsZVN0cmVhbS5lbmQoKTtcblx0XHR9XG5cdH1cblxuXHRwdWJsaWMgc2VuZEV2ZW50KGV2ZW50OiBEZWJ1Z1Byb3RvY29sLkV2ZW50KTogdm9pZCB7XG5cdFx0dGhpcy5fc2VuZCgnZXZlbnQnLCBldmVudCk7XG5cdH1cblxuXHRwdWJsaWMgc2VuZFJlc3BvbnNlKHJlc3BvbnNlOiBEZWJ1Z1Byb3RvY29sLlJlc3BvbnNlKTogdm9pZCB7XG5cdFx0aWYgKHJlc3BvbnNlLnNlcSA+IDApIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoYGF0dGVtcHQgdG8gc2VuZCBtb3JlIHRoYW4gb25lIHJlc3BvbnNlIGZvciBjb21tYW5kICR7cmVzcG9uc2UuY29tbWFuZH1gKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5fc2VuZCgncmVzcG9uc2UnLCByZXNwb25zZSk7XG5cdFx0fVxuXHR9XG5cblx0cHVibGljIHNlbmRSZXF1ZXN0KGNvbW1hbmQ6IHN0cmluZywgYXJnczogYW55LCB0aW1lb3V0OiBudW1iZXIsIGNiOiAocmVzcG9uc2U6IERlYnVnUHJvdG9jb2wuUmVzcG9uc2UpID0+IHZvaWQpIDogdm9pZCB7XG5cblx0XHRjb25zdCByZXF1ZXN0OiBhbnkgPSB7XG5cdFx0XHRjb21tYW5kOiBjb21tYW5kXG5cdFx0fTtcblx0XHRpZiAoYXJncyAmJiBPYmplY3Qua2V5cyhhcmdzKS5sZW5ndGggPiAwKSB7XG5cdFx0XHRyZXF1ZXN0LmFyZ3VtZW50cyA9IGFyZ3M7XG5cdFx0fVxuXG5cdFx0dGhpcy5fc2VuZCgncmVxdWVzdCcsIHJlcXVlc3QpO1xuXG5cdFx0aWYgKGNiKSB7XG5cdFx0XHR0aGlzLl9wZW5kaW5nUmVxdWVzdHMuc2V0KHJlcXVlc3Quc2VxLCBjYik7XG5cblx0XHRcdGNvbnN0IHRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB7XG5cdFx0XHRcdGNsZWFyVGltZW91dCh0aW1lcik7XG5cdFx0XHRcdGNvbnN0IGNsYiA9IHRoaXMuX3BlbmRpbmdSZXF1ZXN0cy5nZXQocmVxdWVzdC5zZXEpO1xuXHRcdFx0XHRpZiAoY2xiKSB7XG5cdFx0XHRcdFx0dGhpcy5fcGVuZGluZ1JlcXVlc3RzLmRlbGV0ZShyZXF1ZXN0LnNlcSk7XG5cdFx0XHRcdFx0Y2xiKG5ldyBSZXNwb25zZShyZXF1ZXN0LCAndGltZW91dCcpKTtcblx0XHRcdFx0fVxuXHRcdFx0fSwgdGltZW91dCk7XG5cdFx0fVxuXHR9XG5cblx0Ly8gLS0tLSBwcm90ZWN0ZWQgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5cdHByb3RlY3RlZCBkaXNwYXRjaFJlcXVlc3QocmVxdWVzdDogRGVidWdQcm90b2NvbC5SZXF1ZXN0KTogdm9pZCB7XG5cdH1cblxuXHQvLyAtLS0tIHByaXZhdGUgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cblx0cHJpdmF0ZSBfZW1pdEV2ZW50KGV2ZW50OiBEZWJ1Z1Byb3RvY29sLkV2ZW50KSB7XG5cdFx0dGhpcy5lbWl0KGV2ZW50LmV2ZW50LCBldmVudCk7XG5cdH1cblxuXHRwcml2YXRlIF9zZW5kKHR5cDogJ3JlcXVlc3QnIHwgJ3Jlc3BvbnNlJyB8ICdldmVudCcsIG1lc3NhZ2U6IERlYnVnUHJvdG9jb2wuUHJvdG9jb2xNZXNzYWdlKTogdm9pZCB7XG5cblx0XHRtZXNzYWdlLnR5cGUgPSB0eXA7XG5cdFx0bWVzc2FnZS5zZXEgPSB0aGlzLl9zZXF1ZW5jZSsrO1xuXG5cdFx0aWYgKHRoaXMuX3dyaXRhYmxlU3RyZWFtKSB7XG5cdFx0XHRjb25zdCBqc29uID0gSlNPTi5zdHJpbmdpZnkobWVzc2FnZSk7XG5cdFx0XHR0aGlzLl93cml0YWJsZVN0cmVhbS53cml0ZShgQ29udGVudC1MZW5ndGg6ICR7QnVmZmVyLmJ5dGVMZW5ndGgoanNvbiwgJ3V0ZjgnKX1cXHJcXG5cXHJcXG4ke2pzb259YCwgJ3V0ZjgnKTtcblx0XHR9XG5cdFx0dGhpcy5fc2VuZE1lc3NhZ2UuZmlyZShtZXNzYWdlKTtcblx0fVxuXG5cdHByaXZhdGUgX2hhbmRsZURhdGEoZGF0YTogQnVmZmVyKTogdm9pZCB7XG5cblx0XHR0aGlzLl9yYXdEYXRhID0gQnVmZmVyLmNvbmNhdChbdGhpcy5fcmF3RGF0YSwgZGF0YV0pO1xuXG5cdFx0d2hpbGUgKHRydWUpIHtcblx0XHRcdGlmICh0aGlzLl9jb250ZW50TGVuZ3RoID49IDApIHtcblx0XHRcdFx0aWYgKHRoaXMuX3Jhd0RhdGEubGVuZ3RoID49IHRoaXMuX2NvbnRlbnRMZW5ndGgpIHtcblx0XHRcdFx0XHRjb25zdCBtZXNzYWdlID0gdGhpcy5fcmF3RGF0YS50b1N0cmluZygndXRmOCcsIDAsIHRoaXMuX2NvbnRlbnRMZW5ndGgpO1xuXHRcdFx0XHRcdHRoaXMuX3Jhd0RhdGEgPSB0aGlzLl9yYXdEYXRhLnNsaWNlKHRoaXMuX2NvbnRlbnRMZW5ndGgpO1xuXHRcdFx0XHRcdHRoaXMuX2NvbnRlbnRMZW5ndGggPSAtMTtcblx0XHRcdFx0XHRpZiAobWVzc2FnZS5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdFx0XHRsZXQgbXNnOiBEZWJ1Z1Byb3RvY29sLlByb3RvY29sTWVzc2FnZSA9IEpTT04ucGFyc2UobWVzc2FnZSk7XG5cdFx0XHRcdFx0XHRcdHRoaXMuaGFuZGxlTWVzc2FnZShtc2cpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0Y2F0Y2ggKGUpIHtcblx0XHRcdFx0XHRcdFx0dGhpcy5fZW1pdEV2ZW50KG5ldyBFdmVudCgnZXJyb3InLCAnRXJyb3IgaGFuZGxpbmcgZGF0YTogJyArIChlICYmIGUubWVzc2FnZSkpKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Y29udGludWU7XHQvLyB0aGVyZSBtYXkgYmUgbW9yZSBjb21wbGV0ZSBtZXNzYWdlcyB0byBwcm9jZXNzXG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNvbnN0IGlkeCA9IHRoaXMuX3Jhd0RhdGEuaW5kZXhPZihQcm90b2NvbFNlcnZlci5UV09fQ1JMRik7XG5cdFx0XHRcdGlmIChpZHggIT09IC0xKSB7XG5cdFx0XHRcdFx0Y29uc3QgaGVhZGVyID0gdGhpcy5fcmF3RGF0YS50b1N0cmluZygndXRmOCcsIDAsIGlkeCk7XG5cdFx0XHRcdFx0Y29uc3QgbGluZXMgPSBoZWFkZXIuc3BsaXQoJ1xcclxcbicpO1xuXHRcdFx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgbGluZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRcdGNvbnN0IHBhaXIgPSBsaW5lc1tpXS5zcGxpdCgvOiArLyk7XG5cdFx0XHRcdFx0XHRpZiAocGFpclswXSA9PSAnQ29udGVudC1MZW5ndGgnKSB7XG5cdFx0XHRcdFx0XHRcdHRoaXMuX2NvbnRlbnRMZW5ndGggPSArcGFpclsxXTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0dGhpcy5fcmF3RGF0YSA9IHRoaXMuX3Jhd0RhdGEuc2xpY2UoaWR4ICsgUHJvdG9jb2xTZXJ2ZXIuVFdPX0NSTEYubGVuZ3RoKTtcblx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0YnJlYWs7XG5cdFx0fVxuXHR9XG59XG4iXX0=

/***/ }),

/***/ 122:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
const Logger = __webpack_require__(66);
const logger = Logger.logger;
const debugSession_1 = __webpack_require__(43);
class LoggingDebugSession extends debugSession_1.DebugSession {
    constructor(obsolete_logFilePath, obsolete_debuggerLinesAndColumnsStartAt1, obsolete_isServer) {
        super(obsolete_debuggerLinesAndColumnsStartAt1, obsolete_isServer);
        this.obsolete_logFilePath = obsolete_logFilePath;
        this.on('error', (event) => {
            logger.error(event.body);
        });
    }
    start(inStream, outStream) {
        super.start(inStream, outStream);
        logger.init(e => this.sendEvent(e), this.obsolete_logFilePath, this._isServer);
    }
    /**
     * Overload sendEvent to log
     */
    sendEvent(event) {
        if (!(event instanceof Logger.LogOutputEvent)) {
            // Don't create an infinite loop...
            let objectToLog = event;
            if (event instanceof debugSession_1.OutputEvent && event.body && event.body.data && event.body.data.doNotLogOutput) {
                delete event.body.data.doNotLogOutput;
                objectToLog = Object.assign({}, event);
                objectToLog.body = Object.assign({}, event.body, { output: '<output not logged>' });
            }
            logger.verbose(`To client: ${JSON.stringify(objectToLog)}`);
        }
        super.sendEvent(event);
    }
    /**
     * Overload sendRequest to log
     */
    sendRequest(command, args, timeout, cb) {
        logger.verbose(`To client: ${JSON.stringify(command)}(${JSON.stringify(args)}), timeout: ${timeout}`);
        super.sendRequest(command, args, timeout, cb);
    }
    /**
     * Overload sendResponse to log
     */
    sendResponse(response) {
        logger.verbose(`To client: ${JSON.stringify(response)}`);
        super.sendResponse(response);
    }
    dispatchRequest(request) {
        logger.verbose(`From client: ${request.command}(${JSON.stringify(request.arguments)})`);
        super.dispatchRequest(request);
    }
}
exports.LoggingDebugSession = LoggingDebugSession;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nZ2luZ0RlYnVnU2Vzc2lvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9sb2dnaW5nRGVidWdTZXNzaW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7O2dHQUdnRzs7QUFJaEcsbUNBQW1DO0FBQ25DLE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUM7QUFDN0IsaURBQXlEO0FBRXpELE1BQWEsbUJBQW9CLFNBQVEsMkJBQVk7SUFDcEQsWUFBMkIsb0JBQTZCLEVBQUUsd0NBQWtELEVBQUUsaUJBQTJCO1FBQ3hJLEtBQUssQ0FBQyx3Q0FBd0MsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO1FBRHpDLHlCQUFvQixHQUFwQixvQkFBb0IsQ0FBUztRQUd2RCxJQUFJLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDLEtBQTBCLEVBQUUsRUFBRTtZQUMvQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMxQixDQUFDLENBQUMsQ0FBQztJQUNKLENBQUM7SUFFTSxLQUFLLENBQUMsUUFBK0IsRUFBRSxTQUFnQztRQUM3RSxLQUFLLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxTQUFTLENBQUMsQ0FBQztRQUNqQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsb0JBQW9CLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ2hGLENBQUM7SUFFRDs7T0FFRztJQUNJLFNBQVMsQ0FBQyxLQUEwQjtRQUMxQyxJQUFJLENBQUMsQ0FBQyxLQUFLLFlBQVksTUFBTSxDQUFDLGNBQWMsQ0FBQyxFQUFFO1lBQzlDLG1DQUFtQztZQUVuQyxJQUFJLFdBQVcsR0FBRyxLQUFLLENBQUM7WUFDeEIsSUFBSSxLQUFLLFlBQVksMEJBQVcsSUFBSSxLQUFLLENBQUMsSUFBSSxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRTtnQkFDcEcsT0FBTyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUM7Z0JBQ3RDLFdBQVcscUJBQVEsS0FBSyxDQUFFLENBQUM7Z0JBQzNCLFdBQVcsQ0FBQyxJQUFJLHFCQUFRLEtBQUssQ0FBQyxJQUFJLElBQUUsTUFBTSxFQUFFLHFCQUFxQixHQUFFLENBQUE7YUFDbkU7WUFFRCxNQUFNLENBQUMsT0FBTyxDQUFDLGNBQWMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUM7U0FDNUQ7UUFFRCxLQUFLLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3hCLENBQUM7SUFFRDs7T0FFRztJQUNJLFdBQVcsQ0FBQyxPQUFlLEVBQUUsSUFBUyxFQUFFLE9BQWUsRUFBRSxFQUE4QztRQUM3RyxNQUFNLENBQUMsT0FBTyxDQUFDLGNBQWMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxlQUFlLE9BQU8sRUFBRSxDQUFDLENBQUM7UUFDdEcsS0FBSyxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxFQUFFLENBQUMsQ0FBQztJQUMvQyxDQUFDO0lBRUQ7O09BRUc7SUFDSSxZQUFZLENBQUMsUUFBZ0M7UUFDbkQsTUFBTSxDQUFDLE9BQU8sQ0FBQyxjQUFjLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3pELEtBQUssQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDOUIsQ0FBQztJQUVTLGVBQWUsQ0FBQyxPQUE4QjtRQUN2RCxNQUFNLENBQUMsT0FBTyxDQUFDLGdCQUFnQixPQUFPLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBRSxHQUFHLENBQUMsQ0FBQztRQUN6RixLQUFLLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ2hDLENBQUM7Q0FDRDtBQXRERCxrREFzREMiLCJzb3VyY2VzQ29udGVudCI6WyIvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICogIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS4gU2VlIExpY2Vuc2UudHh0IGluIHRoZSBwcm9qZWN0IHJvb3QgZm9yIGxpY2Vuc2UgaW5mb3JtYXRpb24uXG4gKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuaW1wb3J0IHtEZWJ1Z1Byb3RvY29sfSBmcm9tICd2c2NvZGUtZGVidWdwcm90b2NvbCc7XG5cbmltcG9ydCAqIGFzIExvZ2dlciBmcm9tICcuL2xvZ2dlcic7XG5jb25zdCBsb2dnZXIgPSBMb2dnZXIubG9nZ2VyO1xuaW1wb3J0IHtEZWJ1Z1Nlc3Npb24sIE91dHB1dEV2ZW50fSBmcm9tICcuL2RlYnVnU2Vzc2lvbic7XG5cbmV4cG9ydCBjbGFzcyBMb2dnaW5nRGVidWdTZXNzaW9uIGV4dGVuZHMgRGVidWdTZXNzaW9uIHtcblx0cHVibGljIGNvbnN0cnVjdG9yKHByaXZhdGUgb2Jzb2xldGVfbG9nRmlsZVBhdGg/OiBzdHJpbmcsIG9ic29sZXRlX2RlYnVnZ2VyTGluZXNBbmRDb2x1bW5zU3RhcnRBdDE/OiBib29sZWFuLCBvYnNvbGV0ZV9pc1NlcnZlcj86IGJvb2xlYW4pIHtcblx0XHRzdXBlcihvYnNvbGV0ZV9kZWJ1Z2dlckxpbmVzQW5kQ29sdW1uc1N0YXJ0QXQxLCBvYnNvbGV0ZV9pc1NlcnZlcik7XG5cblx0XHR0aGlzLm9uKCdlcnJvcicsIChldmVudDogRGVidWdQcm90b2NvbC5FdmVudCkgPT4ge1xuXHRcdFx0bG9nZ2VyLmVycm9yKGV2ZW50LmJvZHkpO1xuXHRcdH0pO1xuXHR9XG5cblx0cHVibGljIHN0YXJ0KGluU3RyZWFtOiBOb2RlSlMuUmVhZGFibGVTdHJlYW0sIG91dFN0cmVhbTogTm9kZUpTLldyaXRhYmxlU3RyZWFtKTogdm9pZCB7XG5cdFx0c3VwZXIuc3RhcnQoaW5TdHJlYW0sIG91dFN0cmVhbSk7XG5cdFx0bG9nZ2VyLmluaXQoZSA9PiB0aGlzLnNlbmRFdmVudChlKSwgdGhpcy5vYnNvbGV0ZV9sb2dGaWxlUGF0aCwgdGhpcy5faXNTZXJ2ZXIpO1xuXHR9XG5cblx0LyoqXG5cdCAqIE92ZXJsb2FkIHNlbmRFdmVudCB0byBsb2dcblx0ICovXG5cdHB1YmxpYyBzZW5kRXZlbnQoZXZlbnQ6IERlYnVnUHJvdG9jb2wuRXZlbnQpOiB2b2lkIHtcblx0XHRpZiAoIShldmVudCBpbnN0YW5jZW9mIExvZ2dlci5Mb2dPdXRwdXRFdmVudCkpIHtcblx0XHRcdC8vIERvbid0IGNyZWF0ZSBhbiBpbmZpbml0ZSBsb29wLi4uXG5cblx0XHRcdGxldCBvYmplY3RUb0xvZyA9IGV2ZW50O1xuXHRcdFx0aWYgKGV2ZW50IGluc3RhbmNlb2YgT3V0cHV0RXZlbnQgJiYgZXZlbnQuYm9keSAmJiBldmVudC5ib2R5LmRhdGEgJiYgZXZlbnQuYm9keS5kYXRhLmRvTm90TG9nT3V0cHV0KSB7XG5cdFx0XHRcdGRlbGV0ZSBldmVudC5ib2R5LmRhdGEuZG9Ob3RMb2dPdXRwdXQ7XG5cdFx0XHRcdG9iamVjdFRvTG9nID0geyAuLi5ldmVudCB9O1xuXHRcdFx0XHRvYmplY3RUb0xvZy5ib2R5ID0geyAuLi5ldmVudC5ib2R5LCBvdXRwdXQ6ICc8b3V0cHV0IG5vdCBsb2dnZWQ+JyB9XG5cdFx0XHR9XG5cblx0XHRcdGxvZ2dlci52ZXJib3NlKGBUbyBjbGllbnQ6ICR7SlNPTi5zdHJpbmdpZnkob2JqZWN0VG9Mb2cpfWApO1xuXHRcdH1cblxuXHRcdHN1cGVyLnNlbmRFdmVudChldmVudCk7XG5cdH1cblxuXHQvKipcblx0ICogT3ZlcmxvYWQgc2VuZFJlcXVlc3QgdG8gbG9nXG5cdCAqL1xuXHRwdWJsaWMgc2VuZFJlcXVlc3QoY29tbWFuZDogc3RyaW5nLCBhcmdzOiBhbnksIHRpbWVvdXQ6IG51bWJlciwgY2I6IChyZXNwb25zZTogRGVidWdQcm90b2NvbC5SZXNwb25zZSkgPT4gdm9pZCk6IHZvaWQge1xuXHRcdGxvZ2dlci52ZXJib3NlKGBUbyBjbGllbnQ6ICR7SlNPTi5zdHJpbmdpZnkoY29tbWFuZCl9KCR7SlNPTi5zdHJpbmdpZnkoYXJncyl9KSwgdGltZW91dDogJHt0aW1lb3V0fWApO1xuXHRcdHN1cGVyLnNlbmRSZXF1ZXN0KGNvbW1hbmQsIGFyZ3MsIHRpbWVvdXQsIGNiKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBPdmVybG9hZCBzZW5kUmVzcG9uc2UgdG8gbG9nXG5cdCAqL1xuXHRwdWJsaWMgc2VuZFJlc3BvbnNlKHJlc3BvbnNlOiBEZWJ1Z1Byb3RvY29sLlJlc3BvbnNlKTogdm9pZCB7XG5cdFx0bG9nZ2VyLnZlcmJvc2UoYFRvIGNsaWVudDogJHtKU09OLnN0cmluZ2lmeShyZXNwb25zZSl9YCk7XG5cdFx0c3VwZXIuc2VuZFJlc3BvbnNlKHJlc3BvbnNlKTtcblx0fVxuXG5cdHByb3RlY3RlZCBkaXNwYXRjaFJlcXVlc3QocmVxdWVzdDogRGVidWdQcm90b2NvbC5SZXF1ZXN0KTogdm9pZCB7XG5cdFx0bG9nZ2VyLnZlcmJvc2UoYEZyb20gY2xpZW50OiAke3JlcXVlc3QuY29tbWFuZH0oJHtKU09OLnN0cmluZ2lmeShyZXF1ZXN0LmFyZ3VtZW50cykgfSlgKTtcblx0XHRzdXBlci5kaXNwYXRjaFJlcXVlc3QocmVxdWVzdCk7XG5cdH1cbn1cbiJdfQ==

/***/ }),

/***/ 123:
/***/ (function(module, exports, __webpack_require__) {

var path = __webpack_require__(2);
var fs = __webpack_require__(8);
var _0777 = parseInt('0777', 8);

module.exports = mkdirP.mkdirp = mkdirP.mkdirP = mkdirP;

function mkdirP (p, opts, f, made) {
    if (typeof opts === 'function') {
        f = opts;
        opts = {};
    }
    else if (!opts || typeof opts !== 'object') {
        opts = { mode: opts };
    }
    
    var mode = opts.mode;
    var xfs = opts.fs || fs;
    
    if (mode === undefined) {
        mode = _0777
    }
    if (!made) made = null;
    
    var cb = f || function () {};
    p = path.resolve(p);
    
    xfs.mkdir(p, mode, function (er) {
        if (!er) {
            made = made || p;
            return cb(null, made);
        }
        switch (er.code) {
            case 'ENOENT':
                if (path.dirname(p) === p) return cb(er);
                mkdirP(path.dirname(p), opts, function (er, made) {
                    if (er) cb(er, made);
                    else mkdirP(p, opts, cb, made);
                });
                break;

            // In the case of any other error, just see if there's a dir
            // there already.  If so, then hooray!  If not, then something
            // is borked.
            default:
                xfs.stat(p, function (er2, stat) {
                    // if the stat fails, then that's super weird.
                    // let the original error be the failure reason.
                    if (er2 || !stat.isDirectory()) cb(er, made)
                    else cb(null, made);
                });
                break;
        }
    });
}

mkdirP.sync = function sync (p, opts, made) {
    if (!opts || typeof opts !== 'object') {
        opts = { mode: opts };
    }
    
    var mode = opts.mode;
    var xfs = opts.fs || fs;
    
    if (mode === undefined) {
        mode = _0777
    }
    if (!made) made = null;

    p = path.resolve(p);

    try {
        xfs.mkdirSync(p, mode);
        made = made || p;
    }
    catch (err0) {
        switch (err0.code) {
            case 'ENOENT' :
                made = sync(path.dirname(p), opts, made);
                sync(p, opts, made);
                break;

            // In the case of any other error, just see if there's a dir
            // there already.  If so, then hooray!  If not, then something
            // is borked.
            default:
                var stat;
                try {
                    stat = xfs.statSync(p);
                }
                catch (err1) {
                    throw err0;
                }
                if (!stat.isDirectory()) throw err0;
                break;
        }
    }

    return made;
};


/***/ }),

/***/ 124:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
class Handles {
    constructor(startHandle) {
        this.START_HANDLE = 1000;
        this._handleMap = new Map();
        this._nextHandle = typeof startHandle === 'number' ? startHandle : this.START_HANDLE;
    }
    reset() {
        this._nextHandle = this.START_HANDLE;
        this._handleMap = new Map();
    }
    create(value) {
        var handle = this._nextHandle++;
        this._handleMap.set(handle, value);
        return handle;
    }
    get(handle, dflt) {
        return this._handleMap.get(handle) || dflt;
    }
}
exports.Handles = Handles;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGFuZGxlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9oYW5kbGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7O2dHQUdnRzs7QUFFaEcsTUFBYSxPQUFPO0lBT25CLFlBQW1CLFdBQW9CO1FBTC9CLGlCQUFZLEdBQUcsSUFBSSxDQUFDO1FBR3BCLGVBQVUsR0FBRyxJQUFJLEdBQUcsRUFBYSxDQUFDO1FBR3pDLElBQUksQ0FBQyxXQUFXLEdBQUcsT0FBTyxXQUFXLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUM7SUFDdEYsQ0FBQztJQUVNLEtBQUs7UUFDWCxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUM7UUFDckMsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLEdBQUcsRUFBYSxDQUFDO0lBQ3hDLENBQUM7SUFFTSxNQUFNLENBQUMsS0FBUTtRQUNyQixJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDaEMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ25DLE9BQU8sTUFBTSxDQUFDO0lBQ2YsQ0FBQztJQUVNLEdBQUcsQ0FBQyxNQUFjLEVBQUUsSUFBUTtRQUNsQyxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLElBQUksQ0FBQztJQUM1QyxDQUFDO0NBQ0Q7QUF6QkQsMEJBeUJDIiwic291cmNlc0NvbnRlbnQiOlsiLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqICBDb3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqICBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuIFNlZSBMaWNlbnNlLnR4dCBpbiB0aGUgcHJvamVjdCByb290IGZvciBsaWNlbnNlIGluZm9ybWF0aW9uLlxuICotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbmV4cG9ydCBjbGFzcyBIYW5kbGVzPFQ+IHtcblxuXHRwcml2YXRlIFNUQVJUX0hBTkRMRSA9IDEwMDA7XG5cblx0cHJpdmF0ZSBfbmV4dEhhbmRsZSA6IG51bWJlcjtcblx0cHJpdmF0ZSBfaGFuZGxlTWFwID0gbmV3IE1hcDxudW1iZXIsIFQ+KCk7XG5cblx0cHVibGljIGNvbnN0cnVjdG9yKHN0YXJ0SGFuZGxlPzogbnVtYmVyKSB7XG5cdFx0dGhpcy5fbmV4dEhhbmRsZSA9IHR5cGVvZiBzdGFydEhhbmRsZSA9PT0gJ251bWJlcicgPyBzdGFydEhhbmRsZSA6IHRoaXMuU1RBUlRfSEFORExFO1xuXHR9XG5cblx0cHVibGljIHJlc2V0KCk6IHZvaWQge1xuXHRcdHRoaXMuX25leHRIYW5kbGUgPSB0aGlzLlNUQVJUX0hBTkRMRTtcblx0XHR0aGlzLl9oYW5kbGVNYXAgPSBuZXcgTWFwPG51bWJlciwgVD4oKTtcblx0fVxuXG5cdHB1YmxpYyBjcmVhdGUodmFsdWU6IFQpOiBudW1iZXIge1xuXHRcdHZhciBoYW5kbGUgPSB0aGlzLl9uZXh0SGFuZGxlKys7XG5cdFx0dGhpcy5faGFuZGxlTWFwLnNldChoYW5kbGUsIHZhbHVlKTtcblx0XHRyZXR1cm4gaGFuZGxlO1xuXHR9XG5cblx0cHVibGljIGdldChoYW5kbGU6IG51bWJlciwgZGZsdD86IFQpOiBUIHtcblx0XHRyZXR1cm4gdGhpcy5faGFuZGxlTWFwLmdldChoYW5kbGUpIHx8IGRmbHQ7XG5cdH1cbn1cbiJdfQ==

/***/ }),

/***/ 19:
/***/ (function(module, exports) {

module.exports = require("url");

/***/ }),

/***/ 2:
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),

/***/ 21:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*---------------------------------------------------------
 * Copyright 2020 The Go Authors. All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.killProcess = exports.killProcessTree = void 0;
const kill = __webpack_require__(65);
// Kill a process and its children, returning a promise.
function killProcessTree(p, logger) {
    if (!logger) {
        logger = console.log;
    }
    if (!p || !p.pid || p.exitCode !== null) {
        return Promise.resolve();
    }
    return new Promise((resolve) => {
        kill(p.pid, (err) => {
            if (err) {
                logger(`Error killing process ${p.pid}: ${err}`);
            }
            resolve();
        });
    });
}
exports.killProcessTree = killProcessTree;
// Kill a process.
//
// READ THIS BEFORE USING THE FUNCTION:
//
// TODO: This function is kept for historical reasons and should be removed once
// its user (go-outline) is replaced. Outlining uses this function and not
// killProcessTree because of performance issues that were observed in the past.
// See https://go-review.googlesource.com/c/vscode-go/+/242518/ for more
// details and background.
function killProcess(p) {
    if (p && p.pid && p.exitCode === null) {
        try {
            p.kill();
        }
        catch (e) {
            console.log(`Error killing process ${p.pid}: ${e}`);
        }
    }
}
exports.killProcess = killProcess;


/***/ }),

/***/ 22:
/***/ (function(module, exports) {

module.exports = require("net");

/***/ }),

/***/ 26:
/***/ (function(module, exports) {

module.exports = require("os");

/***/ }),

/***/ 3:
/***/ (function(module, exports) {

module.exports = require("util");

/***/ }),

/***/ 31:
/***/ (function(module, exports) {

module.exports = require("events");

/***/ }),

/***/ 43:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
const protocol_1 = __webpack_require__(121);
const messages_1 = __webpack_require__(44);
const Net = __webpack_require__(22);
const url_1 = __webpack_require__(19);
class Source {
    constructor(name, path, id = 0, origin, data) {
        this.name = name;
        this.path = path;
        this.sourceReference = id;
        if (origin) {
            this.origin = origin;
        }
        if (data) {
            this.adapterData = data;
        }
    }
}
exports.Source = Source;
class Scope {
    constructor(name, reference, expensive = false) {
        this.name = name;
        this.variablesReference = reference;
        this.expensive = expensive;
    }
}
exports.Scope = Scope;
class StackFrame {
    constructor(i, nm, src, ln = 0, col = 0) {
        this.id = i;
        this.source = src;
        this.line = ln;
        this.column = col;
        this.name = nm;
    }
}
exports.StackFrame = StackFrame;
class Thread {
    constructor(id, name) {
        this.id = id;
        if (name) {
            this.name = name;
        }
        else {
            this.name = 'Thread #' + id;
        }
    }
}
exports.Thread = Thread;
class Variable {
    constructor(name, value, ref = 0, indexedVariables, namedVariables) {
        this.name = name;
        this.value = value;
        this.variablesReference = ref;
        if (typeof namedVariables === 'number') {
            this.namedVariables = namedVariables;
        }
        if (typeof indexedVariables === 'number') {
            this.indexedVariables = indexedVariables;
        }
    }
}
exports.Variable = Variable;
class Breakpoint {
    constructor(verified, line, column, source) {
        this.verified = verified;
        const e = this;
        if (typeof line === 'number') {
            e.line = line;
        }
        if (typeof column === 'number') {
            e.column = column;
        }
        if (source) {
            e.source = source;
        }
    }
}
exports.Breakpoint = Breakpoint;
class Module {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
}
exports.Module = Module;
class CompletionItem {
    constructor(label, start, length = 0) {
        this.label = label;
        this.start = start;
        this.length = length;
    }
}
exports.CompletionItem = CompletionItem;
class StoppedEvent extends messages_1.Event {
    constructor(reason, threadId, exceptionText) {
        super('stopped');
        this.body = {
            reason: reason
        };
        if (typeof threadId === 'number') {
            this.body.threadId = threadId;
        }
        if (typeof exceptionText === 'string') {
            this.body.text = exceptionText;
        }
    }
}
exports.StoppedEvent = StoppedEvent;
class ContinuedEvent extends messages_1.Event {
    constructor(threadId, allThreadsContinued) {
        super('continued');
        this.body = {
            threadId: threadId
        };
        if (typeof allThreadsContinued === 'boolean') {
            this.body.allThreadsContinued = allThreadsContinued;
        }
    }
}
exports.ContinuedEvent = ContinuedEvent;
class InitializedEvent extends messages_1.Event {
    constructor() {
        super('initialized');
    }
}
exports.InitializedEvent = InitializedEvent;
class TerminatedEvent extends messages_1.Event {
    constructor(restart) {
        super('terminated');
        if (typeof restart === 'boolean' || restart) {
            const e = this;
            e.body = {
                restart: restart
            };
        }
    }
}
exports.TerminatedEvent = TerminatedEvent;
class OutputEvent extends messages_1.Event {
    constructor(output, category = 'console', data) {
        super('output');
        this.body = {
            category: category,
            output: output
        };
        if (data !== undefined) {
            this.body.data = data;
        }
    }
}
exports.OutputEvent = OutputEvent;
class ThreadEvent extends messages_1.Event {
    constructor(reason, threadId) {
        super('thread');
        this.body = {
            reason: reason,
            threadId: threadId
        };
    }
}
exports.ThreadEvent = ThreadEvent;
class BreakpointEvent extends messages_1.Event {
    constructor(reason, breakpoint) {
        super('breakpoint');
        this.body = {
            reason: reason,
            breakpoint: breakpoint
        };
    }
}
exports.BreakpointEvent = BreakpointEvent;
class ModuleEvent extends messages_1.Event {
    constructor(reason, module) {
        super('module');
        this.body = {
            reason: reason,
            module: module
        };
    }
}
exports.ModuleEvent = ModuleEvent;
class LoadedSourceEvent extends messages_1.Event {
    constructor(reason, source) {
        super('loadedSource');
        this.body = {
            reason: reason,
            source: source
        };
    }
}
exports.LoadedSourceEvent = LoadedSourceEvent;
class CapabilitiesEvent extends messages_1.Event {
    constructor(capabilities) {
        super('capabilities');
        this.body = {
            capabilities: capabilities
        };
    }
}
exports.CapabilitiesEvent = CapabilitiesEvent;
class ProgressStartEvent extends messages_1.Event {
    constructor(progressId, title, message) {
        super('progressStart');
        this.body = {
            progressId: progressId,
            title: title
        };
        if (typeof message === 'string') {
            this.body.message = message;
        }
    }
}
exports.ProgressStartEvent = ProgressStartEvent;
class ProgressUpdateEvent extends messages_1.Event {
    constructor(progressId, message) {
        super('progressUpdate');
        this.body = {
            progressId: progressId
        };
        if (typeof message === 'string') {
            this.body.message = message;
        }
    }
}
exports.ProgressUpdateEvent = ProgressUpdateEvent;
class ProgressEndEvent extends messages_1.Event {
    constructor(progressId, message) {
        super('progressEnd');
        this.body = {
            progressId: progressId
        };
        if (typeof message === 'string') {
            this.body.message = message;
        }
    }
}
exports.ProgressEndEvent = ProgressEndEvent;
var ErrorDestination;
(function (ErrorDestination) {
    ErrorDestination[ErrorDestination["User"] = 1] = "User";
    ErrorDestination[ErrorDestination["Telemetry"] = 2] = "Telemetry";
})(ErrorDestination = exports.ErrorDestination || (exports.ErrorDestination = {}));
;
class DebugSession extends protocol_1.ProtocolServer {
    constructor(obsolete_debuggerLinesAndColumnsStartAt1, obsolete_isServer) {
        super();
        const linesAndColumnsStartAt1 = typeof obsolete_debuggerLinesAndColumnsStartAt1 === 'boolean' ? obsolete_debuggerLinesAndColumnsStartAt1 : false;
        this._debuggerLinesStartAt1 = linesAndColumnsStartAt1;
        this._debuggerColumnsStartAt1 = linesAndColumnsStartAt1;
        this._debuggerPathsAreURIs = false;
        this._clientLinesStartAt1 = true;
        this._clientColumnsStartAt1 = true;
        this._clientPathsAreURIs = false;
        this._isServer = typeof obsolete_isServer === 'boolean' ? obsolete_isServer : false;
        this.on('close', () => {
            this.shutdown();
        });
        this.on('error', (error) => {
            this.shutdown();
        });
    }
    setDebuggerPathFormat(format) {
        this._debuggerPathsAreURIs = format !== 'path';
    }
    setDebuggerLinesStartAt1(enable) {
        this._debuggerLinesStartAt1 = enable;
    }
    setDebuggerColumnsStartAt1(enable) {
        this._debuggerColumnsStartAt1 = enable;
    }
    setRunAsServer(enable) {
        this._isServer = enable;
    }
    /**
     * A virtual constructor...
     */
    static run(debugSession) {
        // parse arguments
        let port = 0;
        const args = process.argv.slice(2);
        args.forEach(function (val, index, array) {
            const portMatch = /^--server=(\d{4,5})$/.exec(val);
            if (portMatch) {
                port = parseInt(portMatch[1], 10);
            }
        });
        if (port > 0) {
            // start as a server
            console.error(`waiting for debug protocol on port ${port}`);
            Net.createServer((socket) => {
                console.error('>> accepted connection from client');
                socket.on('end', () => {
                    console.error('>> client connection closed\n');
                });
                const session = new debugSession(false, true);
                session.setRunAsServer(true);
                session.start(socket, socket);
            }).listen(port);
        }
        else {
            // start a session
            //console.error('waiting for debug protocol on stdin/stdout');
            const session = new debugSession(false);
            process.on('SIGTERM', () => {
                session.shutdown();
            });
            session.start(process.stdin, process.stdout);
        }
    }
    shutdown() {
        if (this._isServer || this._isRunningInline()) {
            // shutdown ignored in server mode
        }
        else {
            // wait a bit before shutting down
            setTimeout(() => {
                process.exit(0);
            }, 100);
        }
    }
    sendErrorResponse(response, codeOrMessage, format, variables, dest = ErrorDestination.User) {
        let msg;
        if (typeof codeOrMessage === 'number') {
            msg = {
                id: codeOrMessage,
                format: format
            };
            if (variables) {
                msg.variables = variables;
            }
            if (dest & ErrorDestination.User) {
                msg.showUser = true;
            }
            if (dest & ErrorDestination.Telemetry) {
                msg.sendTelemetry = true;
            }
        }
        else {
            msg = codeOrMessage;
        }
        response.success = false;
        response.message = DebugSession.formatPII(msg.format, true, msg.variables);
        if (!response.body) {
            response.body = {};
        }
        response.body.error = msg;
        this.sendResponse(response);
    }
    runInTerminalRequest(args, timeout, cb) {
        this.sendRequest('runInTerminal', args, timeout, cb);
    }
    dispatchRequest(request) {
        const response = new messages_1.Response(request);
        try {
            if (request.command === 'initialize') {
                var args = request.arguments;
                if (typeof args.linesStartAt1 === 'boolean') {
                    this._clientLinesStartAt1 = args.linesStartAt1;
                }
                if (typeof args.columnsStartAt1 === 'boolean') {
                    this._clientColumnsStartAt1 = args.columnsStartAt1;
                }
                if (args.pathFormat !== 'path') {
                    this.sendErrorResponse(response, 2018, 'debug adapter only supports native paths', null, ErrorDestination.Telemetry);
                }
                else {
                    const initializeResponse = response;
                    initializeResponse.body = {};
                    this.initializeRequest(initializeResponse, args);
                }
            }
            else if (request.command === 'launch') {
                this.launchRequest(response, request.arguments, request);
            }
            else if (request.command === 'attach') {
                this.attachRequest(response, request.arguments, request);
            }
            else if (request.command === 'disconnect') {
                this.disconnectRequest(response, request.arguments, request);
            }
            else if (request.command === 'terminate') {
                this.terminateRequest(response, request.arguments, request);
            }
            else if (request.command === 'restart') {
                this.restartRequest(response, request.arguments, request);
            }
            else if (request.command === 'setBreakpoints') {
                this.setBreakPointsRequest(response, request.arguments, request);
            }
            else if (request.command === 'setFunctionBreakpoints') {
                this.setFunctionBreakPointsRequest(response, request.arguments, request);
            }
            else if (request.command === 'setExceptionBreakpoints') {
                this.setExceptionBreakPointsRequest(response, request.arguments, request);
            }
            else if (request.command === 'configurationDone') {
                this.configurationDoneRequest(response, request.arguments, request);
            }
            else if (request.command === 'continue') {
                this.continueRequest(response, request.arguments, request);
            }
            else if (request.command === 'next') {
                this.nextRequest(response, request.arguments, request);
            }
            else if (request.command === 'stepIn') {
                this.stepInRequest(response, request.arguments, request);
            }
            else if (request.command === 'stepOut') {
                this.stepOutRequest(response, request.arguments, request);
            }
            else if (request.command === 'stepBack') {
                this.stepBackRequest(response, request.arguments, request);
            }
            else if (request.command === 'reverseContinue') {
                this.reverseContinueRequest(response, request.arguments, request);
            }
            else if (request.command === 'restartFrame') {
                this.restartFrameRequest(response, request.arguments, request);
            }
            else if (request.command === 'goto') {
                this.gotoRequest(response, request.arguments, request);
            }
            else if (request.command === 'pause') {
                this.pauseRequest(response, request.arguments, request);
            }
            else if (request.command === 'stackTrace') {
                this.stackTraceRequest(response, request.arguments, request);
            }
            else if (request.command === 'scopes') {
                this.scopesRequest(response, request.arguments, request);
            }
            else if (request.command === 'variables') {
                this.variablesRequest(response, request.arguments, request);
            }
            else if (request.command === 'setVariable') {
                this.setVariableRequest(response, request.arguments, request);
            }
            else if (request.command === 'setExpression') {
                this.setExpressionRequest(response, request.arguments, request);
            }
            else if (request.command === 'source') {
                this.sourceRequest(response, request.arguments, request);
            }
            else if (request.command === 'threads') {
                this.threadsRequest(response, request);
            }
            else if (request.command === 'terminateThreads') {
                this.terminateThreadsRequest(response, request.arguments, request);
            }
            else if (request.command === 'evaluate') {
                this.evaluateRequest(response, request.arguments, request);
            }
            else if (request.command === 'stepInTargets') {
                this.stepInTargetsRequest(response, request.arguments, request);
            }
            else if (request.command === 'gotoTargets') {
                this.gotoTargetsRequest(response, request.arguments, request);
            }
            else if (request.command === 'completions') {
                this.completionsRequest(response, request.arguments, request);
            }
            else if (request.command === 'exceptionInfo') {
                this.exceptionInfoRequest(response, request.arguments, request);
            }
            else if (request.command === 'loadedSources') {
                this.loadedSourcesRequest(response, request.arguments, request);
            }
            else if (request.command === 'dataBreakpointInfo') {
                this.dataBreakpointInfoRequest(response, request.arguments, request);
            }
            else if (request.command === 'setDataBreakpoints') {
                this.setDataBreakpointsRequest(response, request.arguments, request);
            }
            else if (request.command === 'readMemory') {
                this.readMemoryRequest(response, request.arguments, request);
            }
            else if (request.command === 'disassemble') {
                this.disassembleRequest(response, request.arguments, request);
            }
            else if (request.command === 'cancel') {
                this.cancelRequest(response, request.arguments, request);
            }
            else if (request.command === 'breakpointLocations') {
                this.breakpointLocationsRequest(response, request.arguments, request);
            }
            else if (request.command === 'setInstructionBreakpoints') {
                this.setInstructionBreakpointsRequest(response, request.arguments, request);
            }
            else {
                this.customRequest(request.command, response, request.arguments, request);
            }
        }
        catch (e) {
            this.sendErrorResponse(response, 1104, '{_stack}', { _exception: e.message, _stack: e.stack }, ErrorDestination.Telemetry);
        }
    }
    initializeRequest(response, args) {
        // This default debug adapter does not support conditional breakpoints.
        response.body.supportsConditionalBreakpoints = false;
        // This default debug adapter does not support hit conditional breakpoints.
        response.body.supportsHitConditionalBreakpoints = false;
        // This default debug adapter does not support function breakpoints.
        response.body.supportsFunctionBreakpoints = false;
        // This default debug adapter implements the 'configurationDone' request.
        response.body.supportsConfigurationDoneRequest = true;
        // This default debug adapter does not support hovers based on the 'evaluate' request.
        response.body.supportsEvaluateForHovers = false;
        // This default debug adapter does not support the 'stepBack' request.
        response.body.supportsStepBack = false;
        // This default debug adapter does not support the 'setVariable' request.
        response.body.supportsSetVariable = false;
        // This default debug adapter does not support the 'restartFrame' request.
        response.body.supportsRestartFrame = false;
        // This default debug adapter does not support the 'stepInTargets' request.
        response.body.supportsStepInTargetsRequest = false;
        // This default debug adapter does not support the 'gotoTargets' request.
        response.body.supportsGotoTargetsRequest = false;
        // This default debug adapter does not support the 'completions' request.
        response.body.supportsCompletionsRequest = false;
        // This default debug adapter does not support the 'restart' request.
        response.body.supportsRestartRequest = false;
        // This default debug adapter does not support the 'exceptionOptions' attribute on the 'setExceptionBreakpoints' request.
        response.body.supportsExceptionOptions = false;
        // This default debug adapter does not support the 'format' attribute on the 'variables', 'evaluate', and 'stackTrace' request.
        response.body.supportsValueFormattingOptions = false;
        // This debug adapter does not support the 'exceptionInfo' request.
        response.body.supportsExceptionInfoRequest = false;
        // This debug adapter does not support the 'TerminateDebuggee' attribute on the 'disconnect' request.
        response.body.supportTerminateDebuggee = false;
        // This debug adapter does not support delayed loading of stack frames.
        response.body.supportsDelayedStackTraceLoading = false;
        // This debug adapter does not support the 'loadedSources' request.
        response.body.supportsLoadedSourcesRequest = false;
        // This debug adapter does not support the 'logMessage' attribute of the SourceBreakpoint.
        response.body.supportsLogPoints = false;
        // This debug adapter does not support the 'terminateThreads' request.
        response.body.supportsTerminateThreadsRequest = false;
        // This debug adapter does not support the 'setExpression' request.
        response.body.supportsSetExpression = false;
        // This debug adapter does not support the 'terminate' request.
        response.body.supportsTerminateRequest = false;
        // This debug adapter does not support data breakpoints.
        response.body.supportsDataBreakpoints = false;
        /** This debug adapter does not support the 'readMemory' request. */
        response.body.supportsReadMemoryRequest = false;
        /** The debug adapter does not support the 'disassemble' request. */
        response.body.supportsDisassembleRequest = false;
        /** The debug adapter does not support the 'cancel' request. */
        response.body.supportsCancelRequest = false;
        /** The debug adapter does not support the 'breakpointLocations' request. */
        response.body.supportsBreakpointLocationsRequest = false;
        /** The debug adapter does not support the 'clipboard' context value in the 'evaluate' request. */
        response.body.supportsClipboardContext = false;
        /** The debug adapter does not support stepping granularities for the stepping requests. */
        response.body.supportsSteppingGranularity = false;
        /** The debug adapter does not support the 'setInstructionBreakpoints' request. */
        response.body.supportsInstructionBreakpoints = false;
        this.sendResponse(response);
    }
    disconnectRequest(response, args, request) {
        this.sendResponse(response);
        this.shutdown();
    }
    launchRequest(response, args, request) {
        this.sendResponse(response);
    }
    attachRequest(response, args, request) {
        this.sendResponse(response);
    }
    terminateRequest(response, args, request) {
        this.sendResponse(response);
    }
    restartRequest(response, args, request) {
        this.sendResponse(response);
    }
    setBreakPointsRequest(response, args, request) {
        this.sendResponse(response);
    }
    setFunctionBreakPointsRequest(response, args, request) {
        this.sendResponse(response);
    }
    setExceptionBreakPointsRequest(response, args, request) {
        this.sendResponse(response);
    }
    configurationDoneRequest(response, args, request) {
        this.sendResponse(response);
    }
    continueRequest(response, args, request) {
        this.sendResponse(response);
    }
    nextRequest(response, args, request) {
        this.sendResponse(response);
    }
    stepInRequest(response, args, request) {
        this.sendResponse(response);
    }
    stepOutRequest(response, args, request) {
        this.sendResponse(response);
    }
    stepBackRequest(response, args, request) {
        this.sendResponse(response);
    }
    reverseContinueRequest(response, args, request) {
        this.sendResponse(response);
    }
    restartFrameRequest(response, args, request) {
        this.sendResponse(response);
    }
    gotoRequest(response, args, request) {
        this.sendResponse(response);
    }
    pauseRequest(response, args, request) {
        this.sendResponse(response);
    }
    sourceRequest(response, args, request) {
        this.sendResponse(response);
    }
    threadsRequest(response, request) {
        this.sendResponse(response);
    }
    terminateThreadsRequest(response, args, request) {
        this.sendResponse(response);
    }
    stackTraceRequest(response, args, request) {
        this.sendResponse(response);
    }
    scopesRequest(response, args, request) {
        this.sendResponse(response);
    }
    variablesRequest(response, args, request) {
        this.sendResponse(response);
    }
    setVariableRequest(response, args, request) {
        this.sendResponse(response);
    }
    setExpressionRequest(response, args, request) {
        this.sendResponse(response);
    }
    evaluateRequest(response, args, request) {
        this.sendResponse(response);
    }
    stepInTargetsRequest(response, args, request) {
        this.sendResponse(response);
    }
    gotoTargetsRequest(response, args, request) {
        this.sendResponse(response);
    }
    completionsRequest(response, args, request) {
        this.sendResponse(response);
    }
    exceptionInfoRequest(response, args, request) {
        this.sendResponse(response);
    }
    loadedSourcesRequest(response, args, request) {
        this.sendResponse(response);
    }
    dataBreakpointInfoRequest(response, args, request) {
        this.sendResponse(response);
    }
    setDataBreakpointsRequest(response, args, request) {
        this.sendResponse(response);
    }
    readMemoryRequest(response, args, request) {
        this.sendResponse(response);
    }
    disassembleRequest(response, args, request) {
        this.sendResponse(response);
    }
    cancelRequest(response, args, request) {
        this.sendResponse(response);
    }
    breakpointLocationsRequest(response, args, request) {
        this.sendResponse(response);
    }
    setInstructionBreakpointsRequest(response, args, request) {
        this.sendResponse(response);
    }
    /**
     * Override this hook to implement custom requests.
     */
    customRequest(command, response, args, request) {
        this.sendErrorResponse(response, 1014, 'unrecognized request', null, ErrorDestination.Telemetry);
    }
    //---- protected -------------------------------------------------------------------------------------------------
    convertClientLineToDebugger(line) {
        if (this._debuggerLinesStartAt1) {
            return this._clientLinesStartAt1 ? line : line + 1;
        }
        return this._clientLinesStartAt1 ? line - 1 : line;
    }
    convertDebuggerLineToClient(line) {
        if (this._debuggerLinesStartAt1) {
            return this._clientLinesStartAt1 ? line : line - 1;
        }
        return this._clientLinesStartAt1 ? line + 1 : line;
    }
    convertClientColumnToDebugger(column) {
        if (this._debuggerColumnsStartAt1) {
            return this._clientColumnsStartAt1 ? column : column + 1;
        }
        return this._clientColumnsStartAt1 ? column - 1 : column;
    }
    convertDebuggerColumnToClient(column) {
        if (this._debuggerColumnsStartAt1) {
            return this._clientColumnsStartAt1 ? column : column - 1;
        }
        return this._clientColumnsStartAt1 ? column + 1 : column;
    }
    convertClientPathToDebugger(clientPath) {
        if (this._clientPathsAreURIs !== this._debuggerPathsAreURIs) {
            if (this._clientPathsAreURIs) {
                return DebugSession.uri2path(clientPath);
            }
            else {
                return DebugSession.path2uri(clientPath);
            }
        }
        return clientPath;
    }
    convertDebuggerPathToClient(debuggerPath) {
        if (this._debuggerPathsAreURIs !== this._clientPathsAreURIs) {
            if (this._debuggerPathsAreURIs) {
                return DebugSession.uri2path(debuggerPath);
            }
            else {
                return DebugSession.path2uri(debuggerPath);
            }
        }
        return debuggerPath;
    }
    //---- private -------------------------------------------------------------------------------
    static path2uri(path) {
        if (process.platform === 'win32') {
            if (/^[A-Z]:/.test(path)) {
                path = path[0].toLowerCase() + path.substr(1);
            }
            path = path.replace(/\\/g, '/');
        }
        path = encodeURI(path);
        let uri = new url_1.URL(`file:`); // ignore 'path' for now
        uri.pathname = path; // now use 'path' to get the correct percent encoding (see https://url.spec.whatwg.org)
        return uri.toString();
    }
    static uri2path(sourceUri) {
        let uri = new url_1.URL(sourceUri);
        let s = decodeURIComponent(uri.pathname);
        if (process.platform === 'win32') {
            if (/^\/[a-zA-Z]:/.test(s)) {
                s = s[1].toLowerCase() + s.substr(2);
            }
            s = s.replace(/\//g, '\\');
        }
        return s;
    }
    /*
    * If argument starts with '_' it is OK to send its value to telemetry.
    */
    static formatPII(format, excludePII, args) {
        return format.replace(DebugSession._formatPIIRegexp, function (match, paramName) {
            if (excludePII && paramName.length > 0 && paramName[0] !== '_') {
                return match;
            }
            return args[paramName] && args.hasOwnProperty(paramName) ?
                args[paramName] :
                match;
        });
    }
}
DebugSession._formatPIIRegexp = /{([^}]+)}/g;
exports.DebugSession = DebugSession;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVidWdTZXNzaW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2RlYnVnU2Vzc2lvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7OztnR0FHZ0c7O0FBR2hHLHlDQUEwQztBQUMxQyx5Q0FBMkM7QUFDM0MsMkJBQTJCO0FBQzNCLDZCQUF3QjtBQUd4QixNQUFhLE1BQU07SUFLbEIsWUFBbUIsSUFBWSxFQUFFLElBQWEsRUFBRSxLQUFhLENBQUMsRUFBRSxNQUFlLEVBQUUsSUFBVTtRQUMxRixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUNqQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUNqQixJQUFJLENBQUMsZUFBZSxHQUFHLEVBQUUsQ0FBQztRQUMxQixJQUFJLE1BQU0sRUFBRTtZQUNMLElBQUssQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1NBQzVCO1FBQ0QsSUFBSSxJQUFJLEVBQUU7WUFDSCxJQUFLLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztTQUMvQjtJQUNGLENBQUM7Q0FDRDtBQWhCRCx3QkFnQkM7QUFFRCxNQUFhLEtBQUs7SUFLakIsWUFBbUIsSUFBWSxFQUFFLFNBQWlCLEVBQUUsWUFBcUIsS0FBSztRQUM3RSxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUNqQixJQUFJLENBQUMsa0JBQWtCLEdBQUcsU0FBUyxDQUFDO1FBQ3BDLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO0lBQzVCLENBQUM7Q0FDRDtBQVZELHNCQVVDO0FBRUQsTUFBYSxVQUFVO0lBT3RCLFlBQW1CLENBQVMsRUFBRSxFQUFVLEVBQUUsR0FBWSxFQUFFLEtBQWEsQ0FBQyxFQUFFLE1BQWMsQ0FBQztRQUN0RixJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUNaLElBQUksQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDO1FBQ2xCLElBQUksQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDO1FBQ2YsSUFBSSxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUM7UUFDbEIsSUFBSSxDQUFDLElBQUksR0FBRyxFQUFFLENBQUM7SUFDaEIsQ0FBQztDQUNEO0FBZEQsZ0NBY0M7QUFFRCxNQUFhLE1BQU07SUFJbEIsWUFBbUIsRUFBVSxFQUFFLElBQVk7UUFDMUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7UUFDYixJQUFJLElBQUksRUFBRTtZQUNULElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1NBQ2pCO2FBQU07WUFDTixJQUFJLENBQUMsSUFBSSxHQUFHLFVBQVUsR0FBRyxFQUFFLENBQUM7U0FDNUI7SUFDRixDQUFDO0NBQ0Q7QUFaRCx3QkFZQztBQUVELE1BQWEsUUFBUTtJQUtwQixZQUFtQixJQUFZLEVBQUUsS0FBYSxFQUFFLE1BQWMsQ0FBQyxFQUFFLGdCQUF5QixFQUFFLGNBQXVCO1FBQ2xILElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxHQUFHLENBQUM7UUFDOUIsSUFBSSxPQUFPLGNBQWMsS0FBSyxRQUFRLEVBQUU7WUFDZCxJQUFLLENBQUMsY0FBYyxHQUFHLGNBQWMsQ0FBQztTQUMvRDtRQUNELElBQUksT0FBTyxnQkFBZ0IsS0FBSyxRQUFRLEVBQUU7WUFDaEIsSUFBSyxDQUFDLGdCQUFnQixHQUFHLGdCQUFnQixDQUFDO1NBQ25FO0lBQ0YsQ0FBQztDQUNEO0FBaEJELDRCQWdCQztBQUVELE1BQWEsVUFBVTtJQUd0QixZQUFtQixRQUFpQixFQUFFLElBQWEsRUFBRSxNQUFlLEVBQUUsTUFBZTtRQUNwRixJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztRQUN6QixNQUFNLENBQUMsR0FBNkIsSUFBSSxDQUFDO1FBQ3pDLElBQUksT0FBTyxJQUFJLEtBQUssUUFBUSxFQUFFO1lBQzdCLENBQUMsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1NBQ2Q7UUFDRCxJQUFJLE9BQU8sTUFBTSxLQUFLLFFBQVEsRUFBRTtZQUMvQixDQUFDLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztTQUNsQjtRQUNELElBQUksTUFBTSxFQUFFO1lBQ1gsQ0FBQyxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7U0FDbEI7SUFDRixDQUFDO0NBQ0Q7QUFoQkQsZ0NBZ0JDO0FBRUQsTUFBYSxNQUFNO0lBSWxCLFlBQW1CLEVBQW1CLEVBQUUsSUFBWTtRQUNuRCxJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQztRQUNiLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0lBQ2xCLENBQUM7Q0FDRDtBQVJELHdCQVFDO0FBRUQsTUFBYSxjQUFjO0lBSzFCLFlBQW1CLEtBQWEsRUFBRSxLQUFhLEVBQUUsU0FBaUIsQ0FBQztRQUNsRSxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztJQUN0QixDQUFDO0NBQ0Q7QUFWRCx3Q0FVQztBQUVELE1BQWEsWUFBYSxTQUFRLGdCQUFLO0lBS3RDLFlBQW1CLE1BQWMsRUFBRSxRQUFpQixFQUFFLGFBQXNCO1FBQzNFLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNqQixJQUFJLENBQUMsSUFBSSxHQUFHO1lBQ1gsTUFBTSxFQUFFLE1BQU07U0FDZCxDQUFDO1FBQ0YsSUFBSSxPQUFPLFFBQVEsS0FBSyxRQUFRLEVBQUU7WUFDaEMsSUFBbUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztTQUM5RDtRQUNELElBQUksT0FBTyxhQUFhLEtBQUssUUFBUSxFQUFFO1lBQ3JDLElBQW1DLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxhQUFhLENBQUM7U0FDL0Q7SUFDRixDQUFDO0NBQ0Q7QUFqQkQsb0NBaUJDO0FBRUQsTUFBYSxjQUFlLFNBQVEsZ0JBQUs7SUFLeEMsWUFBbUIsUUFBZ0IsRUFBRSxtQkFBNkI7UUFDakUsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ25CLElBQUksQ0FBQyxJQUFJLEdBQUc7WUFDWCxRQUFRLEVBQUUsUUFBUTtTQUNsQixDQUFDO1FBRUYsSUFBSSxPQUFPLG1CQUFtQixLQUFLLFNBQVMsRUFBRTtZQUNkLElBQUssQ0FBQyxJQUFJLENBQUMsbUJBQW1CLEdBQUcsbUJBQW1CLENBQUM7U0FDcEY7SUFDRixDQUFDO0NBQ0Q7QUFmRCx3Q0FlQztBQUVELE1BQWEsZ0JBQWlCLFNBQVEsZ0JBQUs7SUFDMUM7UUFDQyxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDdEIsQ0FBQztDQUNEO0FBSkQsNENBSUM7QUFFRCxNQUFhLGVBQWdCLFNBQVEsZ0JBQUs7SUFDekMsWUFBbUIsT0FBYTtRQUMvQixLQUFLLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDcEIsSUFBSSxPQUFPLE9BQU8sS0FBSyxTQUFTLElBQUksT0FBTyxFQUFFO1lBQzVDLE1BQU0sQ0FBQyxHQUFrQyxJQUFJLENBQUM7WUFDOUMsQ0FBQyxDQUFDLElBQUksR0FBRztnQkFDUixPQUFPLEVBQUUsT0FBTzthQUNoQixDQUFDO1NBQ0Y7SUFDRixDQUFDO0NBQ0Q7QUFWRCwwQ0FVQztBQUVELE1BQWEsV0FBWSxTQUFRLGdCQUFLO0lBT3JDLFlBQW1CLE1BQWMsRUFBRSxXQUFtQixTQUFTLEVBQUUsSUFBVTtRQUMxRSxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDaEIsSUFBSSxDQUFDLElBQUksR0FBRztZQUNYLFFBQVEsRUFBRSxRQUFRO1lBQ2xCLE1BQU0sRUFBRSxNQUFNO1NBQ2QsQ0FBQztRQUNGLElBQUksSUFBSSxLQUFLLFNBQVMsRUFBRTtZQUN2QixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7U0FDdEI7SUFDRixDQUFDO0NBQ0Q7QUFqQkQsa0NBaUJDO0FBRUQsTUFBYSxXQUFZLFNBQVEsZ0JBQUs7SUFNckMsWUFBbUIsTUFBYyxFQUFFLFFBQWdCO1FBQ2xELEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNoQixJQUFJLENBQUMsSUFBSSxHQUFHO1lBQ1gsTUFBTSxFQUFFLE1BQU07WUFDZCxRQUFRLEVBQUUsUUFBUTtTQUNsQixDQUFDO0lBQ0gsQ0FBQztDQUNEO0FBYkQsa0NBYUM7QUFFRCxNQUFhLGVBQWdCLFNBQVEsZ0JBQUs7SUFNekMsWUFBbUIsTUFBYyxFQUFFLFVBQXNCO1FBQ3hELEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUNwQixJQUFJLENBQUMsSUFBSSxHQUFHO1lBQ1gsTUFBTSxFQUFFLE1BQU07WUFDZCxVQUFVLEVBQUUsVUFBVTtTQUN0QixDQUFDO0lBQ0gsQ0FBQztDQUNEO0FBYkQsMENBYUM7QUFFRCxNQUFhLFdBQVksU0FBUSxnQkFBSztJQU1yQyxZQUFtQixNQUFxQyxFQUFFLE1BQWM7UUFDdkUsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ2hCLElBQUksQ0FBQyxJQUFJLEdBQUc7WUFDWCxNQUFNLEVBQUUsTUFBTTtZQUNkLE1BQU0sRUFBRSxNQUFNO1NBQ2QsQ0FBQztJQUNILENBQUM7Q0FDRDtBQWJELGtDQWFDO0FBRUQsTUFBYSxpQkFBa0IsU0FBUSxnQkFBSztJQU0zQyxZQUFtQixNQUFxQyxFQUFFLE1BQWM7UUFDdkUsS0FBSyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQ3RCLElBQUksQ0FBQyxJQUFJLEdBQUc7WUFDWCxNQUFNLEVBQUUsTUFBTTtZQUNkLE1BQU0sRUFBRSxNQUFNO1NBQ2QsQ0FBQztJQUNILENBQUM7Q0FDRDtBQWJELDhDQWFDO0FBRUQsTUFBYSxpQkFBa0IsU0FBUSxnQkFBSztJQUszQyxZQUFtQixZQUF3QztRQUMxRCxLQUFLLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDdEIsSUFBSSxDQUFDLElBQUksR0FBRztZQUNYLFlBQVksRUFBRSxZQUFZO1NBQzFCLENBQUM7SUFDSCxDQUFDO0NBQ0Q7QUFYRCw4Q0FXQztBQUVELE1BQWEsa0JBQW1CLFNBQVEsZ0JBQUs7SUFNNUMsWUFBbUIsVUFBa0IsRUFBRSxLQUFhLEVBQUUsT0FBZ0I7UUFDckUsS0FBSyxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxJQUFJLEdBQUc7WUFDWCxVQUFVLEVBQUUsVUFBVTtZQUN0QixLQUFLLEVBQUUsS0FBSztTQUNaLENBQUM7UUFDRixJQUFJLE9BQU8sT0FBTyxLQUFLLFFBQVEsRUFBRTtZQUMvQixJQUF5QyxDQUFDLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1NBQ2xFO0lBQ0YsQ0FBQztDQUNEO0FBaEJELGdEQWdCQztBQUVELE1BQWEsbUJBQW9CLFNBQVEsZ0JBQUs7SUFLN0MsWUFBbUIsVUFBa0IsRUFBRSxPQUFnQjtRQUN0RCxLQUFLLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUN4QixJQUFJLENBQUMsSUFBSSxHQUFHO1lBQ1gsVUFBVSxFQUFFLFVBQVU7U0FDdEIsQ0FBQztRQUNGLElBQUksT0FBTyxPQUFPLEtBQUssUUFBUSxFQUFFO1lBQy9CLElBQTBDLENBQUMsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7U0FDbkU7SUFDRixDQUFDO0NBQ0Q7QUFkRCxrREFjQztBQUVELE1BQWEsZ0JBQWlCLFNBQVEsZ0JBQUs7SUFLMUMsWUFBbUIsVUFBa0IsRUFBRSxPQUFnQjtRQUN0RCxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDckIsSUFBSSxDQUFDLElBQUksR0FBRztZQUNYLFVBQVUsRUFBRSxVQUFVO1NBQ3RCLENBQUM7UUFDRixJQUFJLE9BQU8sT0FBTyxLQUFLLFFBQVEsRUFBRTtZQUMvQixJQUF1QyxDQUFDLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1NBQ2hFO0lBQ0YsQ0FBQztDQUNEO0FBZEQsNENBY0M7QUFFRCxJQUFZLGdCQUdYO0FBSEQsV0FBWSxnQkFBZ0I7SUFDM0IsdURBQVEsQ0FBQTtJQUNSLGlFQUFhLENBQUE7QUFDZCxDQUFDLEVBSFcsZ0JBQWdCLEdBQWhCLHdCQUFnQixLQUFoQix3QkFBZ0IsUUFHM0I7QUFBQSxDQUFDO0FBRUYsTUFBYSxZQUFhLFNBQVEseUJBQWM7SUFZL0MsWUFBbUIsd0NBQWtELEVBQUUsaUJBQTJCO1FBQ2pHLEtBQUssRUFBRSxDQUFDO1FBRVIsTUFBTSx1QkFBdUIsR0FBRyxPQUFPLHdDQUF3QyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsd0NBQXdDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztRQUNqSixJQUFJLENBQUMsc0JBQXNCLEdBQUcsdUJBQXVCLENBQUM7UUFDdEQsSUFBSSxDQUFDLHdCQUF3QixHQUFHLHVCQUF1QixDQUFDO1FBQ3hELElBQUksQ0FBQyxxQkFBcUIsR0FBRyxLQUFLLENBQUM7UUFFbkMsSUFBSSxDQUFDLG9CQUFvQixHQUFHLElBQUksQ0FBQztRQUNqQyxJQUFJLENBQUMsc0JBQXNCLEdBQUcsSUFBSSxDQUFDO1FBQ25DLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxLQUFLLENBQUM7UUFFakMsSUFBSSxDQUFDLFNBQVMsR0FBRyxPQUFPLGlCQUFpQixLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztRQUVwRixJQUFJLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUU7WUFDckIsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ2pCLENBQUMsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxLQUFLLEVBQUUsRUFBRTtZQUMxQixJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDakIsQ0FBQyxDQUFDLENBQUM7SUFDSixDQUFDO0lBRU0scUJBQXFCLENBQUMsTUFBYztRQUMxQyxJQUFJLENBQUMscUJBQXFCLEdBQUcsTUFBTSxLQUFLLE1BQU0sQ0FBQztJQUNoRCxDQUFDO0lBRU0sd0JBQXdCLENBQUMsTUFBZTtRQUM5QyxJQUFJLENBQUMsc0JBQXNCLEdBQUcsTUFBTSxDQUFDO0lBQ3RDLENBQUM7SUFFTSwwQkFBMEIsQ0FBQyxNQUFlO1FBQ2hELElBQUksQ0FBQyx3QkFBd0IsR0FBRyxNQUFNLENBQUM7SUFDeEMsQ0FBQztJQUVNLGNBQWMsQ0FBQyxNQUFlO1FBQ3BDLElBQUksQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDO0lBQ3pCLENBQUM7SUFFRDs7T0FFRztJQUNJLE1BQU0sQ0FBQyxHQUFHLENBQUMsWUFBaUM7UUFFbEQsa0JBQWtCO1FBQ2xCLElBQUksSUFBSSxHQUFHLENBQUMsQ0FBQztRQUNiLE1BQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ25DLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxHQUFHLEVBQUUsS0FBSyxFQUFFLEtBQUs7WUFDdkMsTUFBTSxTQUFTLEdBQUcsc0JBQXNCLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ25ELElBQUksU0FBUyxFQUFFO2dCQUNkLElBQUksR0FBRyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO2FBQ2xDO1FBQ0YsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLElBQUksR0FBRyxDQUFDLEVBQUU7WUFDYixvQkFBb0I7WUFDcEIsT0FBTyxDQUFDLEtBQUssQ0FBQyxzQ0FBc0MsSUFBSSxFQUFFLENBQUMsQ0FBQztZQUM1RCxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUU7Z0JBQzNCLE9BQU8sQ0FBQyxLQUFLLENBQUMsb0NBQW9DLENBQUMsQ0FBQztnQkFDcEQsTUFBTSxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsR0FBRyxFQUFFO29CQUNyQixPQUFPLENBQUMsS0FBSyxDQUFDLCtCQUErQixDQUFDLENBQUM7Z0JBQ2hELENBQUMsQ0FBQyxDQUFDO2dCQUNILE1BQU0sT0FBTyxHQUFHLElBQUksWUFBWSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDOUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDN0IsT0FBTyxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDL0IsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ2hCO2FBQU07WUFFTixrQkFBa0I7WUFDbEIsOERBQThEO1lBQzlELE1BQU0sT0FBTyxHQUFHLElBQUksWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3hDLE9BQU8sQ0FBQyxFQUFFLENBQUMsU0FBUyxFQUFFLEdBQUcsRUFBRTtnQkFDMUIsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ3BCLENBQUMsQ0FBQyxDQUFDO1lBQ0gsT0FBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUM3QztJQUNGLENBQUM7SUFFTSxRQUFRO1FBQ2QsSUFBSSxJQUFJLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxFQUFFO1lBQzlDLGtDQUFrQztTQUNsQzthQUFNO1lBQ04sa0NBQWtDO1lBQ2xDLFVBQVUsQ0FBQyxHQUFHLEVBQUU7Z0JBQ2YsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNqQixDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7U0FDUjtJQUNGLENBQUM7SUFFUyxpQkFBaUIsQ0FBQyxRQUFnQyxFQUFFLGFBQTZDLEVBQUUsTUFBZSxFQUFFLFNBQWUsRUFBRSxPQUF5QixnQkFBZ0IsQ0FBQyxJQUFJO1FBRTVMLElBQUksR0FBMkIsQ0FBQztRQUNoQyxJQUFJLE9BQU8sYUFBYSxLQUFLLFFBQVEsRUFBRTtZQUN0QyxHQUFHLEdBQTJCO2dCQUM3QixFQUFFLEVBQVcsYUFBYTtnQkFDMUIsTUFBTSxFQUFFLE1BQU07YUFDZCxDQUFDO1lBQ0YsSUFBSSxTQUFTLEVBQUU7Z0JBQ2QsR0FBRyxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7YUFDMUI7WUFDRCxJQUFJLElBQUksR0FBRyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUU7Z0JBQ2pDLEdBQUcsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO2FBQ3BCO1lBQ0QsSUFBSSxJQUFJLEdBQUcsZ0JBQWdCLENBQUMsU0FBUyxFQUFFO2dCQUN0QyxHQUFHLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQzthQUN6QjtTQUNEO2FBQU07WUFDTixHQUFHLEdBQUcsYUFBYSxDQUFDO1NBQ3BCO1FBRUQsUUFBUSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7UUFDekIsUUFBUSxDQUFDLE9BQU8sR0FBRyxZQUFZLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUMzRSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRTtZQUNuQixRQUFRLENBQUMsSUFBSSxHQUFHLEVBQUcsQ0FBQztTQUNwQjtRQUNELFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQztRQUUxQixJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQzdCLENBQUM7SUFFTSxvQkFBb0IsQ0FBQyxJQUFpRCxFQUFFLE9BQWUsRUFBRSxFQUEyRDtRQUMxSixJQUFJLENBQUMsV0FBVyxDQUFDLGVBQWUsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ3RELENBQUM7SUFFUyxlQUFlLENBQUMsT0FBOEI7UUFFdkQsTUFBTSxRQUFRLEdBQUcsSUFBSSxtQkFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRXZDLElBQUk7WUFDSCxJQUFJLE9BQU8sQ0FBQyxPQUFPLEtBQUssWUFBWSxFQUFFO2dCQUNyQyxJQUFJLElBQUksR0FBOEMsT0FBTyxDQUFDLFNBQVMsQ0FBQztnQkFFeEUsSUFBSSxPQUFPLElBQUksQ0FBQyxhQUFhLEtBQUssU0FBUyxFQUFFO29CQUM1QyxJQUFJLENBQUMsb0JBQW9CLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQztpQkFDL0M7Z0JBQ0QsSUFBSSxPQUFPLElBQUksQ0FBQyxlQUFlLEtBQUssU0FBUyxFQUFFO29CQUM5QyxJQUFJLENBQUMsc0JBQXNCLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQztpQkFDbkQ7Z0JBRUQsSUFBSSxJQUFJLENBQUMsVUFBVSxLQUFLLE1BQU0sRUFBRTtvQkFDL0IsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUUsMENBQTBDLEVBQUUsSUFBSSxFQUFFLGdCQUFnQixDQUFDLFNBQVMsQ0FBQyxDQUFDO2lCQUNySDtxQkFBTTtvQkFDTixNQUFNLGtCQUFrQixHQUFzQyxRQUFRLENBQUM7b0JBQ3ZFLGtCQUFrQixDQUFDLElBQUksR0FBRyxFQUFFLENBQUM7b0JBQzdCLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxrQkFBa0IsRUFBRSxJQUFJLENBQUMsQ0FBQztpQkFDakQ7YUFFRDtpQkFBTSxJQUFJLE9BQU8sQ0FBQyxPQUFPLEtBQUssUUFBUSxFQUFFO2dCQUN4QyxJQUFJLENBQUMsYUFBYSxDQUFnQyxRQUFRLEVBQUUsT0FBTyxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQzthQUV4RjtpQkFBTSxJQUFJLE9BQU8sQ0FBQyxPQUFPLEtBQUssUUFBUSxFQUFFO2dCQUN4QyxJQUFJLENBQUMsYUFBYSxDQUFnQyxRQUFRLEVBQUUsT0FBTyxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQzthQUV4RjtpQkFBTSxJQUFJLE9BQU8sQ0FBQyxPQUFPLEtBQUssWUFBWSxFQUFFO2dCQUM1QyxJQUFJLENBQUMsaUJBQWlCLENBQW9DLFFBQVEsRUFBRSxPQUFPLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDO2FBRWhHO2lCQUFNLElBQUksT0FBTyxDQUFDLE9BQU8sS0FBSyxXQUFXLEVBQUU7Z0JBQzNDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBbUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUM7YUFFOUY7aUJBQU0sSUFBSSxPQUFPLENBQUMsT0FBTyxLQUFLLFNBQVMsRUFBRTtnQkFDekMsSUFBSSxDQUFDLGNBQWMsQ0FBaUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUM7YUFFMUY7aUJBQU0sSUFBSSxPQUFPLENBQUMsT0FBTyxLQUFLLGdCQUFnQixFQUFFO2dCQUNoRCxJQUFJLENBQUMscUJBQXFCLENBQXdDLFFBQVEsRUFBRSxPQUFPLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDO2FBRXhHO2lCQUFNLElBQUksT0FBTyxDQUFDLE9BQU8sS0FBSyx3QkFBd0IsRUFBRTtnQkFDeEQsSUFBSSxDQUFDLDZCQUE2QixDQUFnRCxRQUFRLEVBQUUsT0FBTyxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQzthQUV4SDtpQkFBTSxJQUFJLE9BQU8sQ0FBQyxPQUFPLEtBQUsseUJBQXlCLEVBQUU7Z0JBQ3pELElBQUksQ0FBQyw4QkFBOEIsQ0FBaUQsUUFBUSxFQUFFLE9BQU8sQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUM7YUFFMUg7aUJBQU0sSUFBSSxPQUFPLENBQUMsT0FBTyxLQUFLLG1CQUFtQixFQUFFO2dCQUNuRCxJQUFJLENBQUMsd0JBQXdCLENBQTJDLFFBQVEsRUFBRSxPQUFPLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDO2FBRTlHO2lCQUFNLElBQUksT0FBTyxDQUFDLE9BQU8sS0FBSyxVQUFVLEVBQUU7Z0JBQzFDLElBQUksQ0FBQyxlQUFlLENBQWtDLFFBQVEsRUFBRSxPQUFPLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDO2FBRTVGO2lCQUFNLElBQUksT0FBTyxDQUFDLE9BQU8sS0FBSyxNQUFNLEVBQUU7Z0JBQ3RDLElBQUksQ0FBQyxXQUFXLENBQThCLFFBQVEsRUFBRSxPQUFPLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDO2FBRXBGO2lCQUFNLElBQUksT0FBTyxDQUFDLE9BQU8sS0FBSyxRQUFRLEVBQUU7Z0JBQ3hDLElBQUksQ0FBQyxhQUFhLENBQWdDLFFBQVEsRUFBRSxPQUFPLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDO2FBRXhGO2lCQUFNLElBQUksT0FBTyxDQUFDLE9BQU8sS0FBSyxTQUFTLEVBQUU7Z0JBQ3pDLElBQUksQ0FBQyxjQUFjLENBQWlDLFFBQVEsRUFBRSxPQUFPLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDO2FBRTFGO2lCQUFNLElBQUksT0FBTyxDQUFDLE9BQU8sS0FBSyxVQUFVLEVBQUU7Z0JBQzFDLElBQUksQ0FBQyxlQUFlLENBQWtDLFFBQVEsRUFBRSxPQUFPLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDO2FBRTVGO2lCQUFNLElBQUksT0FBTyxDQUFDLE9BQU8sS0FBSyxpQkFBaUIsRUFBRTtnQkFDakQsSUFBSSxDQUFDLHNCQUFzQixDQUF5QyxRQUFRLEVBQUUsT0FBTyxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQzthQUUxRztpQkFBTSxJQUFJLE9BQU8sQ0FBQyxPQUFPLEtBQUssY0FBYyxFQUFFO2dCQUM5QyxJQUFJLENBQUMsbUJBQW1CLENBQXNDLFFBQVEsRUFBRSxPQUFPLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDO2FBRXBHO2lCQUFNLElBQUksT0FBTyxDQUFDLE9BQU8sS0FBSyxNQUFNLEVBQUU7Z0JBQ3RDLElBQUksQ0FBQyxXQUFXLENBQThCLFFBQVEsRUFBRSxPQUFPLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDO2FBRXBGO2lCQUFNLElBQUksT0FBTyxDQUFDLE9BQU8sS0FBSyxPQUFPLEVBQUU7Z0JBQ3ZDLElBQUksQ0FBQyxZQUFZLENBQStCLFFBQVEsRUFBRSxPQUFPLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDO2FBRXRGO2lCQUFNLElBQUksT0FBTyxDQUFDLE9BQU8sS0FBSyxZQUFZLEVBQUU7Z0JBQzVDLElBQUksQ0FBQyxpQkFBaUIsQ0FBb0MsUUFBUSxFQUFFLE9BQU8sQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUM7YUFFaEc7aUJBQU0sSUFBSSxPQUFPLENBQUMsT0FBTyxLQUFLLFFBQVEsRUFBRTtnQkFDeEMsSUFBSSxDQUFDLGFBQWEsQ0FBZ0MsUUFBUSxFQUFFLE9BQU8sQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUM7YUFFeEY7aUJBQU0sSUFBSSxPQUFPLENBQUMsT0FBTyxLQUFLLFdBQVcsRUFBRTtnQkFDM0MsSUFBSSxDQUFDLGdCQUFnQixDQUFtQyxRQUFRLEVBQUUsT0FBTyxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQzthQUU5RjtpQkFBTSxJQUFJLE9BQU8sQ0FBQyxPQUFPLEtBQUssYUFBYSxFQUFFO2dCQUM3QyxJQUFJLENBQUMsa0JBQWtCLENBQXFDLFFBQVEsRUFBRSxPQUFPLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDO2FBRWxHO2lCQUFNLElBQUksT0FBTyxDQUFDLE9BQU8sS0FBSyxlQUFlLEVBQUU7Z0JBQy9DLElBQUksQ0FBQyxvQkFBb0IsQ0FBdUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUM7YUFFdEc7aUJBQU0sSUFBSSxPQUFPLENBQUMsT0FBTyxLQUFLLFFBQVEsRUFBRTtnQkFDeEMsSUFBSSxDQUFDLGFBQWEsQ0FBZ0MsUUFBUSxFQUFFLE9BQU8sQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUM7YUFFeEY7aUJBQU0sSUFBSSxPQUFPLENBQUMsT0FBTyxLQUFLLFNBQVMsRUFBRTtnQkFDekMsSUFBSSxDQUFDLGNBQWMsQ0FBaUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDO2FBRXZFO2lCQUFNLElBQUksT0FBTyxDQUFDLE9BQU8sS0FBSyxrQkFBa0IsRUFBRTtnQkFDbEQsSUFBSSxDQUFDLHVCQUF1QixDQUEwQyxRQUFRLEVBQUUsT0FBTyxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQzthQUU1RztpQkFBTSxJQUFJLE9BQU8sQ0FBQyxPQUFPLEtBQUssVUFBVSxFQUFFO2dCQUMxQyxJQUFJLENBQUMsZUFBZSxDQUFrQyxRQUFRLEVBQUUsT0FBTyxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQzthQUU1RjtpQkFBTSxJQUFJLE9BQU8sQ0FBQyxPQUFPLEtBQUssZUFBZSxFQUFFO2dCQUMvQyxJQUFJLENBQUMsb0JBQW9CLENBQXVDLFFBQVEsRUFBRSxPQUFPLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDO2FBRXRHO2lCQUFNLElBQUksT0FBTyxDQUFDLE9BQU8sS0FBSyxhQUFhLEVBQUU7Z0JBQzdDLElBQUksQ0FBQyxrQkFBa0IsQ0FBcUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUM7YUFFbEc7aUJBQU0sSUFBSSxPQUFPLENBQUMsT0FBTyxLQUFLLGFBQWEsRUFBRTtnQkFDN0MsSUFBSSxDQUFDLGtCQUFrQixDQUFxQyxRQUFRLEVBQUUsT0FBTyxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQzthQUVsRztpQkFBTSxJQUFJLE9BQU8sQ0FBQyxPQUFPLEtBQUssZUFBZSxFQUFFO2dCQUMvQyxJQUFJLENBQUMsb0JBQW9CLENBQXVDLFFBQVEsRUFBRSxPQUFPLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDO2FBRXRHO2lCQUFNLElBQUksT0FBTyxDQUFDLE9BQU8sS0FBSyxlQUFlLEVBQUU7Z0JBQy9DLElBQUksQ0FBQyxvQkFBb0IsQ0FBdUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUM7YUFFdEc7aUJBQU0sSUFBSSxPQUFPLENBQUMsT0FBTyxLQUFLLG9CQUFvQixFQUFFO2dCQUNwRCxJQUFJLENBQUMseUJBQXlCLENBQTRDLFFBQVEsRUFBRSxPQUFPLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDO2FBRWhIO2lCQUFNLElBQUksT0FBTyxDQUFDLE9BQU8sS0FBSyxvQkFBb0IsRUFBRTtnQkFDcEQsSUFBSSxDQUFDLHlCQUF5QixDQUE0QyxRQUFRLEVBQUUsT0FBTyxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQzthQUVoSDtpQkFBTSxJQUFJLE9BQU8sQ0FBQyxPQUFPLEtBQUssWUFBWSxFQUFFO2dCQUM1QyxJQUFJLENBQUMsaUJBQWlCLENBQW9DLFFBQVEsRUFBRSxPQUFPLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDO2FBRWhHO2lCQUFNLElBQUksT0FBTyxDQUFDLE9BQU8sS0FBSyxhQUFhLEVBQUU7Z0JBQzdDLElBQUksQ0FBQyxrQkFBa0IsQ0FBcUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUM7YUFFbEc7aUJBQU0sSUFBSSxPQUFPLENBQUMsT0FBTyxLQUFLLFFBQVEsRUFBRTtnQkFDeEMsSUFBSSxDQUFDLGFBQWEsQ0FBZ0MsUUFBUSxFQUFFLE9BQU8sQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUM7YUFFeEY7aUJBQU0sSUFBSSxPQUFPLENBQUMsT0FBTyxLQUFLLHFCQUFxQixFQUFFO2dCQUNyRCxJQUFJLENBQUMsMEJBQTBCLENBQTZDLFFBQVEsRUFBRSxPQUFPLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDO2FBRWxIO2lCQUFNLElBQUksT0FBTyxDQUFDLE9BQU8sS0FBSywyQkFBMkIsRUFBRTtnQkFDM0QsSUFBSSxDQUFDLGdDQUFnQyxDQUFtRCxRQUFRLEVBQUUsT0FBTyxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQzthQUU5SDtpQkFBTTtnQkFDTixJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQTJCLFFBQVEsRUFBRSxPQUFPLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDO2FBQ25HO1NBQ0Q7UUFBQyxPQUFPLENBQUMsRUFBRTtZQUNYLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUUsZ0JBQWdCLENBQUMsU0FBUyxDQUFDLENBQUM7U0FDM0g7SUFDRixDQUFDO0lBRVMsaUJBQWlCLENBQUMsUUFBMEMsRUFBRSxJQUE4QztRQUVySCx1RUFBdUU7UUFDdkUsUUFBUSxDQUFDLElBQUksQ0FBQyw4QkFBOEIsR0FBRyxLQUFLLENBQUM7UUFFckQsMkVBQTJFO1FBQzNFLFFBQVEsQ0FBQyxJQUFJLENBQUMsaUNBQWlDLEdBQUcsS0FBSyxDQUFDO1FBRXhELG9FQUFvRTtRQUNwRSxRQUFRLENBQUMsSUFBSSxDQUFDLDJCQUEyQixHQUFHLEtBQUssQ0FBQztRQUVsRCx5RUFBeUU7UUFDekUsUUFBUSxDQUFDLElBQUksQ0FBQyxnQ0FBZ0MsR0FBRyxJQUFJLENBQUM7UUFFdEQsc0ZBQXNGO1FBQ3RGLFFBQVEsQ0FBQyxJQUFJLENBQUMseUJBQXlCLEdBQUcsS0FBSyxDQUFDO1FBRWhELHNFQUFzRTtRQUN0RSxRQUFRLENBQUMsSUFBSSxDQUFDLGdCQUFnQixHQUFHLEtBQUssQ0FBQztRQUV2Qyx5RUFBeUU7UUFDekUsUUFBUSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxLQUFLLENBQUM7UUFFMUMsMEVBQTBFO1FBQzFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsb0JBQW9CLEdBQUcsS0FBSyxDQUFDO1FBRTNDLDJFQUEyRTtRQUMzRSxRQUFRLENBQUMsSUFBSSxDQUFDLDRCQUE0QixHQUFHLEtBQUssQ0FBQztRQUVuRCx5RUFBeUU7UUFDekUsUUFBUSxDQUFDLElBQUksQ0FBQywwQkFBMEIsR0FBRyxLQUFLLENBQUM7UUFFakQseUVBQXlFO1FBQ3pFLFFBQVEsQ0FBQyxJQUFJLENBQUMsMEJBQTBCLEdBQUcsS0FBSyxDQUFDO1FBRWpELHFFQUFxRTtRQUNyRSxRQUFRLENBQUMsSUFBSSxDQUFDLHNCQUFzQixHQUFHLEtBQUssQ0FBQztRQUU3Qyx5SEFBeUg7UUFDekgsUUFBUSxDQUFDLElBQUksQ0FBQyx3QkFBd0IsR0FBRyxLQUFLLENBQUM7UUFFL0MsK0hBQStIO1FBQy9ILFFBQVEsQ0FBQyxJQUFJLENBQUMsOEJBQThCLEdBQUcsS0FBSyxDQUFDO1FBRXJELG1FQUFtRTtRQUNuRSxRQUFRLENBQUMsSUFBSSxDQUFDLDRCQUE0QixHQUFHLEtBQUssQ0FBQztRQUVuRCxxR0FBcUc7UUFDckcsUUFBUSxDQUFDLElBQUksQ0FBQyx3QkFBd0IsR0FBRyxLQUFLLENBQUM7UUFFL0MsdUVBQXVFO1FBQ3ZFLFFBQVEsQ0FBQyxJQUFJLENBQUMsZ0NBQWdDLEdBQUcsS0FBSyxDQUFDO1FBRXZELG1FQUFtRTtRQUNuRSxRQUFRLENBQUMsSUFBSSxDQUFDLDRCQUE0QixHQUFHLEtBQUssQ0FBQztRQUVuRCwwRkFBMEY7UUFDMUYsUUFBUSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxLQUFLLENBQUM7UUFFeEMsc0VBQXNFO1FBQ3RFLFFBQVEsQ0FBQyxJQUFJLENBQUMsK0JBQStCLEdBQUcsS0FBSyxDQUFDO1FBRXRELG1FQUFtRTtRQUNuRSxRQUFRLENBQUMsSUFBSSxDQUFDLHFCQUFxQixHQUFHLEtBQUssQ0FBQztRQUU1QywrREFBK0Q7UUFDL0QsUUFBUSxDQUFDLElBQUksQ0FBQyx3QkFBd0IsR0FBRyxLQUFLLENBQUM7UUFFL0Msd0RBQXdEO1FBQ3hELFFBQVEsQ0FBQyxJQUFJLENBQUMsdUJBQXVCLEdBQUcsS0FBSyxDQUFDO1FBRTlDLG9FQUFvRTtRQUNwRSxRQUFRLENBQUMsSUFBSSxDQUFDLHlCQUF5QixHQUFHLEtBQUssQ0FBQztRQUVoRCxvRUFBb0U7UUFDcEUsUUFBUSxDQUFDLElBQUksQ0FBQywwQkFBMEIsR0FBRyxLQUFLLENBQUM7UUFFakQsK0RBQStEO1FBQy9ELFFBQVEsQ0FBQyxJQUFJLENBQUMscUJBQXFCLEdBQUcsS0FBSyxDQUFDO1FBRTVDLDRFQUE0RTtRQUM1RSxRQUFRLENBQUMsSUFBSSxDQUFDLGtDQUFrQyxHQUFHLEtBQUssQ0FBQztRQUV6RCxrR0FBa0c7UUFDbEcsUUFBUSxDQUFDLElBQUksQ0FBQyx3QkFBd0IsR0FBRyxLQUFLLENBQUM7UUFFL0MsMkZBQTJGO1FBQzNGLFFBQVEsQ0FBQyxJQUFJLENBQUMsMkJBQTJCLEdBQUcsS0FBSyxDQUFDO1FBRWxELGtGQUFrRjtRQUNsRixRQUFRLENBQUMsSUFBSSxDQUFDLDhCQUE4QixHQUFHLEtBQUssQ0FBQztRQUVyRCxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQzdCLENBQUM7SUFFUyxpQkFBaUIsQ0FBQyxRQUEwQyxFQUFFLElBQXVDLEVBQUUsT0FBK0I7UUFDL0ksSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUM1QixJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDakIsQ0FBQztJQUVTLGFBQWEsQ0FBQyxRQUFzQyxFQUFFLElBQTBDLEVBQUUsT0FBK0I7UUFDMUksSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUM3QixDQUFDO0lBRVMsYUFBYSxDQUFDLFFBQXNDLEVBQUUsSUFBMEMsRUFBRSxPQUErQjtRQUMxSSxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQzdCLENBQUM7SUFFUyxnQkFBZ0IsQ0FBQyxRQUF5QyxFQUFFLElBQXNDLEVBQUUsT0FBK0I7UUFDNUksSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUM3QixDQUFDO0lBRVMsY0FBYyxDQUFDLFFBQXVDLEVBQUUsSUFBb0MsRUFBRSxPQUErQjtRQUN0SSxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQzdCLENBQUM7SUFFUyxxQkFBcUIsQ0FBQyxRQUE4QyxFQUFFLElBQTJDLEVBQUUsT0FBK0I7UUFDM0osSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUM3QixDQUFDO0lBRVMsNkJBQTZCLENBQUMsUUFBc0QsRUFBRSxJQUFtRCxFQUFFLE9BQStCO1FBQ25MLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDN0IsQ0FBQztJQUVTLDhCQUE4QixDQUFDLFFBQXVELEVBQUUsSUFBb0QsRUFBRSxPQUErQjtRQUN0TCxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQzdCLENBQUM7SUFFUyx3QkFBd0IsQ0FBQyxRQUFpRCxFQUFFLElBQThDLEVBQUUsT0FBK0I7UUFDcEssSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUM3QixDQUFDO0lBRVMsZUFBZSxDQUFDLFFBQXdDLEVBQUUsSUFBcUMsRUFBRSxPQUErQjtRQUN6SSxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQzdCLENBQUM7SUFFUyxXQUFXLENBQUMsUUFBb0MsRUFBRSxJQUFpQyxFQUFFLE9BQStCO1FBQzdILElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDN0IsQ0FBQztJQUVTLGFBQWEsQ0FBQyxRQUFzQyxFQUFFLElBQW1DLEVBQUUsT0FBK0I7UUFDbkksSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUM3QixDQUFDO0lBRVMsY0FBYyxDQUFDLFFBQXVDLEVBQUUsSUFBb0MsRUFBRSxPQUErQjtRQUN0SSxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQzdCLENBQUM7SUFFUyxlQUFlLENBQUMsUUFBd0MsRUFBRSxJQUFxQyxFQUFFLE9BQStCO1FBQ3pJLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDN0IsQ0FBQztJQUVTLHNCQUFzQixDQUFDLFFBQStDLEVBQUUsSUFBNEMsRUFBRSxPQUErQjtRQUM5SixJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQzdCLENBQUM7SUFFUyxtQkFBbUIsQ0FBQyxRQUE0QyxFQUFFLElBQXlDLEVBQUUsT0FBK0I7UUFDckosSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUM3QixDQUFDO0lBRVMsV0FBVyxDQUFDLFFBQW9DLEVBQUUsSUFBaUMsRUFBRSxPQUErQjtRQUM3SCxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQzdCLENBQUM7SUFFUyxZQUFZLENBQUMsUUFBcUMsRUFBRSxJQUFrQyxFQUFFLE9BQStCO1FBQ2hJLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDN0IsQ0FBQztJQUVTLGFBQWEsQ0FBQyxRQUFzQyxFQUFFLElBQW1DLEVBQUUsT0FBK0I7UUFDbkksSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUM3QixDQUFDO0lBRVMsY0FBYyxDQUFDLFFBQXVDLEVBQUUsT0FBK0I7UUFDaEcsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUM3QixDQUFDO0lBRVMsdUJBQXVCLENBQUMsUUFBZ0QsRUFBRSxJQUE2QyxFQUFFLE9BQStCO1FBQ2pLLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDN0IsQ0FBQztJQUVTLGlCQUFpQixDQUFDLFFBQTBDLEVBQUUsSUFBdUMsRUFBRSxPQUErQjtRQUMvSSxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQzdCLENBQUM7SUFFUyxhQUFhLENBQUMsUUFBc0MsRUFBRSxJQUFtQyxFQUFFLE9BQStCO1FBQ25JLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDN0IsQ0FBQztJQUVTLGdCQUFnQixDQUFDLFFBQXlDLEVBQUUsSUFBc0MsRUFBRSxPQUErQjtRQUM1SSxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQzdCLENBQUM7SUFFUyxrQkFBa0IsQ0FBQyxRQUEyQyxFQUFFLElBQXdDLEVBQUUsT0FBK0I7UUFDbEosSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUM3QixDQUFDO0lBRVMsb0JBQW9CLENBQUMsUUFBNkMsRUFBRSxJQUEwQyxFQUFFLE9BQStCO1FBQ3hKLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDN0IsQ0FBQztJQUVTLGVBQWUsQ0FBQyxRQUF3QyxFQUFFLElBQXFDLEVBQUUsT0FBK0I7UUFDekksSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUM3QixDQUFDO0lBRVMsb0JBQW9CLENBQUMsUUFBNkMsRUFBRSxJQUEwQyxFQUFFLE9BQStCO1FBQ3hKLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDN0IsQ0FBQztJQUVTLGtCQUFrQixDQUFDLFFBQTJDLEVBQUUsSUFBd0MsRUFBRSxPQUErQjtRQUNsSixJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQzdCLENBQUM7SUFFUyxrQkFBa0IsQ0FBQyxRQUEyQyxFQUFFLElBQXdDLEVBQUUsT0FBK0I7UUFDbEosSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUM3QixDQUFDO0lBRVMsb0JBQW9CLENBQUMsUUFBNkMsRUFBRSxJQUEwQyxFQUFFLE9BQStCO1FBQ3hKLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDN0IsQ0FBQztJQUVTLG9CQUFvQixDQUFDLFFBQTZDLEVBQUUsSUFBMEMsRUFBRSxPQUErQjtRQUN4SixJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQzdCLENBQUM7SUFFUyx5QkFBeUIsQ0FBQyxRQUFrRCxFQUFFLElBQStDLEVBQUUsT0FBK0I7UUFDdkssSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUM3QixDQUFDO0lBRVMseUJBQXlCLENBQUMsUUFBa0QsRUFBRSxJQUErQyxFQUFFLE9BQStCO1FBQ3ZLLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDN0IsQ0FBQztJQUVTLGlCQUFpQixDQUFDLFFBQTBDLEVBQUUsSUFBdUMsRUFBRSxPQUErQjtRQUMvSSxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQzdCLENBQUM7SUFFUyxrQkFBa0IsQ0FBQyxRQUEyQyxFQUFFLElBQXdDLEVBQUUsT0FBK0I7UUFDbEosSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUM3QixDQUFDO0lBRVMsYUFBYSxDQUFDLFFBQXNDLEVBQUUsSUFBbUMsRUFBRSxPQUErQjtRQUNuSSxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQzdCLENBQUM7SUFFUywwQkFBMEIsQ0FBQyxRQUFtRCxFQUFFLElBQWdELEVBQUUsT0FBK0I7UUFDMUssSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUM3QixDQUFDO0lBRVMsZ0NBQWdDLENBQUMsUUFBeUQsRUFBRSxJQUFzRCxFQUFFLE9BQStCO1FBQzVMLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDN0IsQ0FBQztJQUVEOztPQUVHO0lBQ08sYUFBYSxDQUFDLE9BQWUsRUFBRSxRQUFnQyxFQUFFLElBQVMsRUFBRSxPQUErQjtRQUNwSCxJQUFJLENBQUMsaUJBQWlCLENBQUMsUUFBUSxFQUFFLElBQUksRUFBRSxzQkFBc0IsRUFBRSxJQUFJLEVBQUUsZ0JBQWdCLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDbEcsQ0FBQztJQUVELGtIQUFrSDtJQUV4RywyQkFBMkIsQ0FBQyxJQUFZO1FBQ2pELElBQUksSUFBSSxDQUFDLHNCQUFzQixFQUFFO1lBQ2hDLE9BQU8sSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUM7U0FDbkQ7UUFDRCxPQUFPLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0lBQ3BELENBQUM7SUFFUywyQkFBMkIsQ0FBQyxJQUFZO1FBQ2pELElBQUksSUFBSSxDQUFDLHNCQUFzQixFQUFFO1lBQ2hDLE9BQU8sSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUM7U0FDbkQ7UUFDRCxPQUFPLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0lBQ3BELENBQUM7SUFFUyw2QkFBNkIsQ0FBQyxNQUFjO1FBQ3JELElBQUksSUFBSSxDQUFDLHdCQUF3QixFQUFFO1lBQ2xDLE9BQU8sSUFBSSxDQUFDLHNCQUFzQixDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7U0FDekQ7UUFDRCxPQUFPLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDO0lBQzFELENBQUM7SUFFUyw2QkFBNkIsQ0FBQyxNQUFjO1FBQ3JELElBQUksSUFBSSxDQUFDLHdCQUF3QixFQUFFO1lBQ2xDLE9BQU8sSUFBSSxDQUFDLHNCQUFzQixDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7U0FDekQ7UUFDRCxPQUFPLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDO0lBQzFELENBQUM7SUFFUywyQkFBMkIsQ0FBQyxVQUFrQjtRQUN2RCxJQUFJLElBQUksQ0FBQyxtQkFBbUIsS0FBSyxJQUFJLENBQUMscUJBQXFCLEVBQUU7WUFDNUQsSUFBSSxJQUFJLENBQUMsbUJBQW1CLEVBQUU7Z0JBQzdCLE9BQU8sWUFBWSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQzthQUN6QztpQkFBTTtnQkFDTixPQUFPLFlBQVksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUM7YUFDekM7U0FDRDtRQUNELE9BQU8sVUFBVSxDQUFDO0lBQ25CLENBQUM7SUFFUywyQkFBMkIsQ0FBQyxZQUFvQjtRQUN6RCxJQUFJLElBQUksQ0FBQyxxQkFBcUIsS0FBSyxJQUFJLENBQUMsbUJBQW1CLEVBQUU7WUFDNUQsSUFBSSxJQUFJLENBQUMscUJBQXFCLEVBQUU7Z0JBQy9CLE9BQU8sWUFBWSxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsQ0FBQzthQUMzQztpQkFBTTtnQkFDTixPQUFPLFlBQVksQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLENBQUM7YUFDM0M7U0FDRDtRQUNELE9BQU8sWUFBWSxDQUFDO0lBQ3JCLENBQUM7SUFFRCw4RkFBOEY7SUFFdEYsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFZO1FBRW5DLElBQUksT0FBTyxDQUFDLFFBQVEsS0FBSyxPQUFPLEVBQUU7WUFDakMsSUFBSSxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUN6QixJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDOUM7WUFDRCxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7U0FDaEM7UUFDRCxJQUFJLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRXZCLElBQUksR0FBRyxHQUFHLElBQUksU0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsd0JBQXdCO1FBQ3BELEdBQUcsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLENBQUMsdUZBQXVGO1FBQzVHLE9BQU8sR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ3ZCLENBQUM7SUFFTyxNQUFNLENBQUMsUUFBUSxDQUFDLFNBQWlCO1FBRXhDLElBQUksR0FBRyxHQUFHLElBQUksU0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzdCLElBQUksQ0FBQyxHQUFHLGtCQUFrQixDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN6QyxJQUFJLE9BQU8sQ0FBQyxRQUFRLEtBQUssT0FBTyxFQUFFO1lBQ2pDLElBQUksY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRTtnQkFDM0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ3JDO1lBQ0QsQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO1NBQzNCO1FBQ0QsT0FBTyxDQUFDLENBQUM7SUFDVixDQUFDO0lBSUQ7O01BRUU7SUFDTSxNQUFNLENBQUMsU0FBUyxDQUFDLE1BQWEsRUFBRSxVQUFtQixFQUFFLElBQTZCO1FBQ3pGLE9BQU8sTUFBTSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsZ0JBQWdCLEVBQUUsVUFBUyxLQUFLLEVBQUUsU0FBUztZQUM3RSxJQUFJLFVBQVUsSUFBSSxTQUFTLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxTQUFTLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxFQUFFO2dCQUMvRCxPQUFPLEtBQUssQ0FBQzthQUNiO1lBQ0QsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksSUFBSSxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO2dCQUN6RCxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztnQkFDakIsS0FBSyxDQUFDO1FBQ1IsQ0FBQyxDQUFDLENBQUE7SUFDSCxDQUFDOztBQWRjLDZCQUFnQixHQUFHLFlBQVksQ0FBQztBQWhuQmhELG9DQStuQkMiLCJzb3VyY2VzQ29udGVudCI6WyIvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICogIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS4gU2VlIExpY2Vuc2UudHh0IGluIHRoZSBwcm9qZWN0IHJvb3QgZm9yIGxpY2Vuc2UgaW5mb3JtYXRpb24uXG4gKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuaW1wb3J0IHtEZWJ1Z1Byb3RvY29sfSBmcm9tICd2c2NvZGUtZGVidWdwcm90b2NvbCc7XG5pbXBvcnQge1Byb3RvY29sU2VydmVyfSBmcm9tICcuL3Byb3RvY29sJztcbmltcG9ydCB7UmVzcG9uc2UsIEV2ZW50fSBmcm9tICcuL21lc3NhZ2VzJztcbmltcG9ydCAqIGFzIE5ldCBmcm9tICduZXQnO1xuaW1wb3J0IHtVUkx9IGZyb20gJ3VybCc7XG5cblxuZXhwb3J0IGNsYXNzIFNvdXJjZSBpbXBsZW1lbnRzIERlYnVnUHJvdG9jb2wuU291cmNlIHtcblx0bmFtZTogc3RyaW5nO1xuXHRwYXRoOiBzdHJpbmc7XG5cdHNvdXJjZVJlZmVyZW5jZTogbnVtYmVyO1xuXG5cdHB1YmxpYyBjb25zdHJ1Y3RvcihuYW1lOiBzdHJpbmcsIHBhdGg/OiBzdHJpbmcsIGlkOiBudW1iZXIgPSAwLCBvcmlnaW4/OiBzdHJpbmcsIGRhdGE/OiBhbnkpIHtcblx0XHR0aGlzLm5hbWUgPSBuYW1lO1xuXHRcdHRoaXMucGF0aCA9IHBhdGg7XG5cdFx0dGhpcy5zb3VyY2VSZWZlcmVuY2UgPSBpZDtcblx0XHRpZiAob3JpZ2luKSB7XG5cdFx0XHQoPGFueT50aGlzKS5vcmlnaW4gPSBvcmlnaW47XG5cdFx0fVxuXHRcdGlmIChkYXRhKSB7XG5cdFx0XHQoPGFueT50aGlzKS5hZGFwdGVyRGF0YSA9IGRhdGE7XG5cdFx0fVxuXHR9XG59XG5cbmV4cG9ydCBjbGFzcyBTY29wZSBpbXBsZW1lbnRzIERlYnVnUHJvdG9jb2wuU2NvcGUge1xuXHRuYW1lOiBzdHJpbmc7XG5cdHZhcmlhYmxlc1JlZmVyZW5jZTogbnVtYmVyO1xuXHRleHBlbnNpdmU6IGJvb2xlYW47XG5cblx0cHVibGljIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZywgcmVmZXJlbmNlOiBudW1iZXIsIGV4cGVuc2l2ZTogYm9vbGVhbiA9IGZhbHNlKSB7XG5cdFx0dGhpcy5uYW1lID0gbmFtZTtcblx0XHR0aGlzLnZhcmlhYmxlc1JlZmVyZW5jZSA9IHJlZmVyZW5jZTtcblx0XHR0aGlzLmV4cGVuc2l2ZSA9IGV4cGVuc2l2ZTtcblx0fVxufVxuXG5leHBvcnQgY2xhc3MgU3RhY2tGcmFtZSBpbXBsZW1lbnRzIERlYnVnUHJvdG9jb2wuU3RhY2tGcmFtZSB7XG5cdGlkOiBudW1iZXI7XG5cdHNvdXJjZTogU291cmNlO1xuXHRsaW5lOiBudW1iZXI7XG5cdGNvbHVtbjogbnVtYmVyO1xuXHRuYW1lOiBzdHJpbmc7XG5cblx0cHVibGljIGNvbnN0cnVjdG9yKGk6IG51bWJlciwgbm06IHN0cmluZywgc3JjPzogU291cmNlLCBsbjogbnVtYmVyID0gMCwgY29sOiBudW1iZXIgPSAwKSB7XG5cdFx0dGhpcy5pZCA9IGk7XG5cdFx0dGhpcy5zb3VyY2UgPSBzcmM7XG5cdFx0dGhpcy5saW5lID0gbG47XG5cdFx0dGhpcy5jb2x1bW4gPSBjb2w7XG5cdFx0dGhpcy5uYW1lID0gbm07XG5cdH1cbn1cblxuZXhwb3J0IGNsYXNzIFRocmVhZCBpbXBsZW1lbnRzIERlYnVnUHJvdG9jb2wuVGhyZWFkIHtcblx0aWQ6IG51bWJlcjtcblx0bmFtZTogc3RyaW5nO1xuXG5cdHB1YmxpYyBjb25zdHJ1Y3RvcihpZDogbnVtYmVyLCBuYW1lOiBzdHJpbmcpIHtcblx0XHR0aGlzLmlkID0gaWQ7XG5cdFx0aWYgKG5hbWUpIHtcblx0XHRcdHRoaXMubmFtZSA9IG5hbWU7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMubmFtZSA9ICdUaHJlYWQgIycgKyBpZDtcblx0XHR9XG5cdH1cbn1cblxuZXhwb3J0IGNsYXNzIFZhcmlhYmxlIGltcGxlbWVudHMgRGVidWdQcm90b2NvbC5WYXJpYWJsZSB7XG5cdG5hbWU6IHN0cmluZztcblx0dmFsdWU6IHN0cmluZztcblx0dmFyaWFibGVzUmVmZXJlbmNlOiBudW1iZXI7XG5cblx0cHVibGljIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZywgdmFsdWU6IHN0cmluZywgcmVmOiBudW1iZXIgPSAwLCBpbmRleGVkVmFyaWFibGVzPzogbnVtYmVyLCBuYW1lZFZhcmlhYmxlcz86IG51bWJlcikge1xuXHRcdHRoaXMubmFtZSA9IG5hbWU7XG5cdFx0dGhpcy52YWx1ZSA9IHZhbHVlO1xuXHRcdHRoaXMudmFyaWFibGVzUmVmZXJlbmNlID0gcmVmO1xuXHRcdGlmICh0eXBlb2YgbmFtZWRWYXJpYWJsZXMgPT09ICdudW1iZXInKSB7XG5cdFx0XHQoPERlYnVnUHJvdG9jb2wuVmFyaWFibGU+dGhpcykubmFtZWRWYXJpYWJsZXMgPSBuYW1lZFZhcmlhYmxlcztcblx0XHR9XG5cdFx0aWYgKHR5cGVvZiBpbmRleGVkVmFyaWFibGVzID09PSAnbnVtYmVyJykge1xuXHRcdFx0KDxEZWJ1Z1Byb3RvY29sLlZhcmlhYmxlPnRoaXMpLmluZGV4ZWRWYXJpYWJsZXMgPSBpbmRleGVkVmFyaWFibGVzO1xuXHRcdH1cblx0fVxufVxuXG5leHBvcnQgY2xhc3MgQnJlYWtwb2ludCBpbXBsZW1lbnRzIERlYnVnUHJvdG9jb2wuQnJlYWtwb2ludCB7XG5cdHZlcmlmaWVkOiBib29sZWFuO1xuXG5cdHB1YmxpYyBjb25zdHJ1Y3Rvcih2ZXJpZmllZDogYm9vbGVhbiwgbGluZT86IG51bWJlciwgY29sdW1uPzogbnVtYmVyLCBzb3VyY2U/OiBTb3VyY2UpIHtcblx0XHR0aGlzLnZlcmlmaWVkID0gdmVyaWZpZWQ7XG5cdFx0Y29uc3QgZTogRGVidWdQcm90b2NvbC5CcmVha3BvaW50ID0gdGhpcztcblx0XHRpZiAodHlwZW9mIGxpbmUgPT09ICdudW1iZXInKSB7XG5cdFx0XHRlLmxpbmUgPSBsaW5lO1xuXHRcdH1cblx0XHRpZiAodHlwZW9mIGNvbHVtbiA9PT0gJ251bWJlcicpIHtcblx0XHRcdGUuY29sdW1uID0gY29sdW1uO1xuXHRcdH1cblx0XHRpZiAoc291cmNlKSB7XG5cdFx0XHRlLnNvdXJjZSA9IHNvdXJjZTtcblx0XHR9XG5cdH1cbn1cblxuZXhwb3J0IGNsYXNzIE1vZHVsZSBpbXBsZW1lbnRzIERlYnVnUHJvdG9jb2wuTW9kdWxlIHtcblx0aWQ6IG51bWJlciB8IHN0cmluZztcblx0bmFtZTogc3RyaW5nO1xuXG5cdHB1YmxpYyBjb25zdHJ1Y3RvcihpZDogbnVtYmVyIHwgc3RyaW5nLCBuYW1lOiBzdHJpbmcpIHtcblx0XHR0aGlzLmlkID0gaWQ7XG5cdFx0dGhpcy5uYW1lID0gbmFtZTtcblx0fVxufVxuXG5leHBvcnQgY2xhc3MgQ29tcGxldGlvbkl0ZW0gaW1wbGVtZW50cyBEZWJ1Z1Byb3RvY29sLkNvbXBsZXRpb25JdGVtIHtcblx0bGFiZWw6IHN0cmluZztcblx0c3RhcnQ6IG51bWJlcjtcblx0bGVuZ3RoOiBudW1iZXI7XG5cblx0cHVibGljIGNvbnN0cnVjdG9yKGxhYmVsOiBzdHJpbmcsIHN0YXJ0OiBudW1iZXIsIGxlbmd0aDogbnVtYmVyID0gMCkge1xuXHRcdHRoaXMubGFiZWwgPSBsYWJlbDtcblx0XHR0aGlzLnN0YXJ0ID0gc3RhcnQ7XG5cdFx0dGhpcy5sZW5ndGggPSBsZW5ndGg7XG5cdH1cbn1cblxuZXhwb3J0IGNsYXNzIFN0b3BwZWRFdmVudCBleHRlbmRzIEV2ZW50IGltcGxlbWVudHMgRGVidWdQcm90b2NvbC5TdG9wcGVkRXZlbnQge1xuXHRib2R5OiB7XG5cdFx0cmVhc29uOiBzdHJpbmc7XG5cdH07XG5cblx0cHVibGljIGNvbnN0cnVjdG9yKHJlYXNvbjogc3RyaW5nLCB0aHJlYWRJZD86IG51bWJlciwgZXhjZXB0aW9uVGV4dD86IHN0cmluZykge1xuXHRcdHN1cGVyKCdzdG9wcGVkJyk7XG5cdFx0dGhpcy5ib2R5ID0ge1xuXHRcdFx0cmVhc29uOiByZWFzb25cblx0XHR9O1xuXHRcdGlmICh0eXBlb2YgdGhyZWFkSWQgPT09ICdudW1iZXInKSB7XG5cdFx0XHQodGhpcyBhcyBEZWJ1Z1Byb3RvY29sLlN0b3BwZWRFdmVudCkuYm9keS50aHJlYWRJZCA9IHRocmVhZElkO1xuXHRcdH1cblx0XHRpZiAodHlwZW9mIGV4Y2VwdGlvblRleHQgPT09ICdzdHJpbmcnKSB7XG5cdFx0XHQodGhpcyBhcyBEZWJ1Z1Byb3RvY29sLlN0b3BwZWRFdmVudCkuYm9keS50ZXh0ID0gZXhjZXB0aW9uVGV4dDtcblx0XHR9XG5cdH1cbn1cblxuZXhwb3J0IGNsYXNzIENvbnRpbnVlZEV2ZW50IGV4dGVuZHMgRXZlbnQgaW1wbGVtZW50cyBEZWJ1Z1Byb3RvY29sLkNvbnRpbnVlZEV2ZW50IHtcblx0Ym9keToge1xuXHRcdHRocmVhZElkOiBudW1iZXI7XG5cdH07XG5cblx0cHVibGljIGNvbnN0cnVjdG9yKHRocmVhZElkOiBudW1iZXIsIGFsbFRocmVhZHNDb250aW51ZWQ/OiBib29sZWFuKSB7XG5cdFx0c3VwZXIoJ2NvbnRpbnVlZCcpO1xuXHRcdHRoaXMuYm9keSA9IHtcblx0XHRcdHRocmVhZElkOiB0aHJlYWRJZFxuXHRcdH07XG5cblx0XHRpZiAodHlwZW9mIGFsbFRocmVhZHNDb250aW51ZWQgPT09ICdib29sZWFuJykge1xuXHRcdFx0KDxEZWJ1Z1Byb3RvY29sLkNvbnRpbnVlZEV2ZW50PnRoaXMpLmJvZHkuYWxsVGhyZWFkc0NvbnRpbnVlZCA9IGFsbFRocmVhZHNDb250aW51ZWQ7XG5cdFx0fVxuXHR9XG59XG5cbmV4cG9ydCBjbGFzcyBJbml0aWFsaXplZEV2ZW50IGV4dGVuZHMgRXZlbnQgaW1wbGVtZW50cyBEZWJ1Z1Byb3RvY29sLkluaXRpYWxpemVkRXZlbnQge1xuXHRwdWJsaWMgY29uc3RydWN0b3IoKSB7XG5cdFx0c3VwZXIoJ2luaXRpYWxpemVkJyk7XG5cdH1cbn1cblxuZXhwb3J0IGNsYXNzIFRlcm1pbmF0ZWRFdmVudCBleHRlbmRzIEV2ZW50IGltcGxlbWVudHMgRGVidWdQcm90b2NvbC5UZXJtaW5hdGVkRXZlbnQge1xuXHRwdWJsaWMgY29uc3RydWN0b3IocmVzdGFydD86IGFueSkge1xuXHRcdHN1cGVyKCd0ZXJtaW5hdGVkJyk7XG5cdFx0aWYgKHR5cGVvZiByZXN0YXJ0ID09PSAnYm9vbGVhbicgfHwgcmVzdGFydCkge1xuXHRcdFx0Y29uc3QgZTogRGVidWdQcm90b2NvbC5UZXJtaW5hdGVkRXZlbnQgPSB0aGlzO1xuXHRcdFx0ZS5ib2R5ID0ge1xuXHRcdFx0XHRyZXN0YXJ0OiByZXN0YXJ0XG5cdFx0XHR9O1xuXHRcdH1cblx0fVxufVxuXG5leHBvcnQgY2xhc3MgT3V0cHV0RXZlbnQgZXh0ZW5kcyBFdmVudCBpbXBsZW1lbnRzIERlYnVnUHJvdG9jb2wuT3V0cHV0RXZlbnQge1xuXHRib2R5OiB7XG5cdFx0Y2F0ZWdvcnk6IHN0cmluZyxcblx0XHRvdXRwdXQ6IHN0cmluZyxcblx0XHRkYXRhPzogYW55XG5cdH07XG5cblx0cHVibGljIGNvbnN0cnVjdG9yKG91dHB1dDogc3RyaW5nLCBjYXRlZ29yeTogc3RyaW5nID0gJ2NvbnNvbGUnLCBkYXRhPzogYW55KSB7XG5cdFx0c3VwZXIoJ291dHB1dCcpO1xuXHRcdHRoaXMuYm9keSA9IHtcblx0XHRcdGNhdGVnb3J5OiBjYXRlZ29yeSxcblx0XHRcdG91dHB1dDogb3V0cHV0XG5cdFx0fTtcblx0XHRpZiAoZGF0YSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHR0aGlzLmJvZHkuZGF0YSA9IGRhdGE7XG5cdFx0fVxuXHR9XG59XG5cbmV4cG9ydCBjbGFzcyBUaHJlYWRFdmVudCBleHRlbmRzIEV2ZW50IGltcGxlbWVudHMgRGVidWdQcm90b2NvbC5UaHJlYWRFdmVudCB7XG5cdGJvZHk6IHtcblx0XHRyZWFzb246IHN0cmluZyxcblx0XHR0aHJlYWRJZDogbnVtYmVyXG5cdH07XG5cblx0cHVibGljIGNvbnN0cnVjdG9yKHJlYXNvbjogc3RyaW5nLCB0aHJlYWRJZDogbnVtYmVyKSB7XG5cdFx0c3VwZXIoJ3RocmVhZCcpO1xuXHRcdHRoaXMuYm9keSA9IHtcblx0XHRcdHJlYXNvbjogcmVhc29uLFxuXHRcdFx0dGhyZWFkSWQ6IHRocmVhZElkXG5cdFx0fTtcblx0fVxufVxuXG5leHBvcnQgY2xhc3MgQnJlYWtwb2ludEV2ZW50IGV4dGVuZHMgRXZlbnQgaW1wbGVtZW50cyBEZWJ1Z1Byb3RvY29sLkJyZWFrcG9pbnRFdmVudCB7XG5cdGJvZHk6IHtcblx0XHRyZWFzb246IHN0cmluZyxcblx0XHRicmVha3BvaW50OiBCcmVha3BvaW50XG5cdH07XG5cblx0cHVibGljIGNvbnN0cnVjdG9yKHJlYXNvbjogc3RyaW5nLCBicmVha3BvaW50OiBCcmVha3BvaW50KSB7XG5cdFx0c3VwZXIoJ2JyZWFrcG9pbnQnKTtcblx0XHR0aGlzLmJvZHkgPSB7XG5cdFx0XHRyZWFzb246IHJlYXNvbixcblx0XHRcdGJyZWFrcG9pbnQ6IGJyZWFrcG9pbnRcblx0XHR9O1xuXHR9XG59XG5cbmV4cG9ydCBjbGFzcyBNb2R1bGVFdmVudCBleHRlbmRzIEV2ZW50IGltcGxlbWVudHMgRGVidWdQcm90b2NvbC5Nb2R1bGVFdmVudCB7XG5cdGJvZHk6IHtcblx0XHRyZWFzb246ICduZXcnIHwgJ2NoYW5nZWQnIHwgJ3JlbW92ZWQnLFxuXHRcdG1vZHVsZTogTW9kdWxlXG5cdH07XG5cblx0cHVibGljIGNvbnN0cnVjdG9yKHJlYXNvbjogJ25ldycgfCAnY2hhbmdlZCcgfCAncmVtb3ZlZCcsIG1vZHVsZTogTW9kdWxlKSB7XG5cdFx0c3VwZXIoJ21vZHVsZScpO1xuXHRcdHRoaXMuYm9keSA9IHtcblx0XHRcdHJlYXNvbjogcmVhc29uLFxuXHRcdFx0bW9kdWxlOiBtb2R1bGVcblx0XHR9O1xuXHR9XG59XG5cbmV4cG9ydCBjbGFzcyBMb2FkZWRTb3VyY2VFdmVudCBleHRlbmRzIEV2ZW50IGltcGxlbWVudHMgRGVidWdQcm90b2NvbC5Mb2FkZWRTb3VyY2VFdmVudCB7XG5cdGJvZHk6IHtcblx0XHRyZWFzb246ICduZXcnIHwgJ2NoYW5nZWQnIHwgJ3JlbW92ZWQnLFxuXHRcdHNvdXJjZTogU291cmNlXG5cdH07XG5cblx0cHVibGljIGNvbnN0cnVjdG9yKHJlYXNvbjogJ25ldycgfCAnY2hhbmdlZCcgfCAncmVtb3ZlZCcsIHNvdXJjZTogU291cmNlKSB7XG5cdFx0c3VwZXIoJ2xvYWRlZFNvdXJjZScpO1xuXHRcdHRoaXMuYm9keSA9IHtcblx0XHRcdHJlYXNvbjogcmVhc29uLFxuXHRcdFx0c291cmNlOiBzb3VyY2Vcblx0XHR9O1xuXHR9XG59XG5cbmV4cG9ydCBjbGFzcyBDYXBhYmlsaXRpZXNFdmVudCBleHRlbmRzIEV2ZW50IGltcGxlbWVudHMgRGVidWdQcm90b2NvbC5DYXBhYmlsaXRpZXNFdmVudCB7XG5cdGJvZHk6IHtcblx0XHRjYXBhYmlsaXRpZXM6IERlYnVnUHJvdG9jb2wuQ2FwYWJpbGl0aWVzXG5cdH07XG5cblx0cHVibGljIGNvbnN0cnVjdG9yKGNhcGFiaWxpdGllczogRGVidWdQcm90b2NvbC5DYXBhYmlsaXRpZXMpIHtcblx0XHRzdXBlcignY2FwYWJpbGl0aWVzJyk7XG5cdFx0dGhpcy5ib2R5ID0ge1xuXHRcdFx0Y2FwYWJpbGl0aWVzOiBjYXBhYmlsaXRpZXNcblx0XHR9O1xuXHR9XG59XG5cbmV4cG9ydCBjbGFzcyBQcm9ncmVzc1N0YXJ0RXZlbnQgZXh0ZW5kcyBFdmVudCBpbXBsZW1lbnRzIERlYnVnUHJvdG9jb2wuUHJvZ3Jlc3NTdGFydEV2ZW50IHtcblx0Ym9keToge1xuXHRcdHByb2dyZXNzSWQ6IHN0cmluZyxcblx0XHR0aXRsZTogc3RyaW5nXG5cdH07XG5cblx0cHVibGljIGNvbnN0cnVjdG9yKHByb2dyZXNzSWQ6IHN0cmluZywgdGl0bGU6IHN0cmluZywgbWVzc2FnZT86IHN0cmluZykge1xuXHRcdHN1cGVyKCdwcm9ncmVzc1N0YXJ0Jyk7XG5cdFx0dGhpcy5ib2R5ID0ge1xuXHRcdFx0cHJvZ3Jlc3NJZDogcHJvZ3Jlc3NJZCxcblx0XHRcdHRpdGxlOiB0aXRsZVxuXHRcdH07XG5cdFx0aWYgKHR5cGVvZiBtZXNzYWdlID09PSAnc3RyaW5nJykge1xuXHRcdFx0KHRoaXMgYXMgRGVidWdQcm90b2NvbC5Qcm9ncmVzc1N0YXJ0RXZlbnQpLmJvZHkubWVzc2FnZSA9IG1lc3NhZ2U7XG5cdFx0fVxuXHR9XG59XG5cbmV4cG9ydCBjbGFzcyBQcm9ncmVzc1VwZGF0ZUV2ZW50IGV4dGVuZHMgRXZlbnQgaW1wbGVtZW50cyBEZWJ1Z1Byb3RvY29sLlByb2dyZXNzVXBkYXRlRXZlbnQge1xuXHRib2R5OiB7XG5cdFx0cHJvZ3Jlc3NJZDogc3RyaW5nXG5cdH07XG5cblx0cHVibGljIGNvbnN0cnVjdG9yKHByb2dyZXNzSWQ6IHN0cmluZywgbWVzc2FnZT86IHN0cmluZykge1xuXHRcdHN1cGVyKCdwcm9ncmVzc1VwZGF0ZScpO1xuXHRcdHRoaXMuYm9keSA9IHtcblx0XHRcdHByb2dyZXNzSWQ6IHByb2dyZXNzSWRcblx0XHR9O1xuXHRcdGlmICh0eXBlb2YgbWVzc2FnZSA9PT0gJ3N0cmluZycpIHtcblx0XHRcdCh0aGlzIGFzIERlYnVnUHJvdG9jb2wuUHJvZ3Jlc3NVcGRhdGVFdmVudCkuYm9keS5tZXNzYWdlID0gbWVzc2FnZTtcblx0XHR9XG5cdH1cbn1cblxuZXhwb3J0IGNsYXNzIFByb2dyZXNzRW5kRXZlbnQgZXh0ZW5kcyBFdmVudCBpbXBsZW1lbnRzIERlYnVnUHJvdG9jb2wuUHJvZ3Jlc3NFbmRFdmVudCB7XG5cdGJvZHk6IHtcblx0XHRwcm9ncmVzc0lkOiBzdHJpbmdcblx0fTtcblxuXHRwdWJsaWMgY29uc3RydWN0b3IocHJvZ3Jlc3NJZDogc3RyaW5nLCBtZXNzYWdlPzogc3RyaW5nKSB7XG5cdFx0c3VwZXIoJ3Byb2dyZXNzRW5kJyk7XG5cdFx0dGhpcy5ib2R5ID0ge1xuXHRcdFx0cHJvZ3Jlc3NJZDogcHJvZ3Jlc3NJZFxuXHRcdH07XG5cdFx0aWYgKHR5cGVvZiBtZXNzYWdlID09PSAnc3RyaW5nJykge1xuXHRcdFx0KHRoaXMgYXMgRGVidWdQcm90b2NvbC5Qcm9ncmVzc0VuZEV2ZW50KS5ib2R5Lm1lc3NhZ2UgPSBtZXNzYWdlO1xuXHRcdH1cblx0fVxufVxuXG5leHBvcnQgZW51bSBFcnJvckRlc3RpbmF0aW9uIHtcblx0VXNlciA9IDEsXG5cdFRlbGVtZXRyeSA9IDJcbn07XG5cbmV4cG9ydCBjbGFzcyBEZWJ1Z1Nlc3Npb24gZXh0ZW5kcyBQcm90b2NvbFNlcnZlciB7XG5cblx0cHJpdmF0ZSBfZGVidWdnZXJMaW5lc1N0YXJ0QXQxOiBib29sZWFuO1xuXHRwcml2YXRlIF9kZWJ1Z2dlckNvbHVtbnNTdGFydEF0MTogYm9vbGVhbjtcblx0cHJpdmF0ZSBfZGVidWdnZXJQYXRoc0FyZVVSSXM6IGJvb2xlYW47XG5cblx0cHJpdmF0ZSBfY2xpZW50TGluZXNTdGFydEF0MTogYm9vbGVhbjtcblx0cHJpdmF0ZSBfY2xpZW50Q29sdW1uc1N0YXJ0QXQxOiBib29sZWFuO1xuXHRwcml2YXRlIF9jbGllbnRQYXRoc0FyZVVSSXM6IGJvb2xlYW47XG5cblx0cHJvdGVjdGVkIF9pc1NlcnZlcjogYm9vbGVhbjtcblxuXHRwdWJsaWMgY29uc3RydWN0b3Iob2Jzb2xldGVfZGVidWdnZXJMaW5lc0FuZENvbHVtbnNTdGFydEF0MT86IGJvb2xlYW4sIG9ic29sZXRlX2lzU2VydmVyPzogYm9vbGVhbikge1xuXHRcdHN1cGVyKCk7XG5cblx0XHRjb25zdCBsaW5lc0FuZENvbHVtbnNTdGFydEF0MSA9IHR5cGVvZiBvYnNvbGV0ZV9kZWJ1Z2dlckxpbmVzQW5kQ29sdW1uc1N0YXJ0QXQxID09PSAnYm9vbGVhbicgPyBvYnNvbGV0ZV9kZWJ1Z2dlckxpbmVzQW5kQ29sdW1uc1N0YXJ0QXQxIDogZmFsc2U7XG5cdFx0dGhpcy5fZGVidWdnZXJMaW5lc1N0YXJ0QXQxID0gbGluZXNBbmRDb2x1bW5zU3RhcnRBdDE7XG5cdFx0dGhpcy5fZGVidWdnZXJDb2x1bW5zU3RhcnRBdDEgPSBsaW5lc0FuZENvbHVtbnNTdGFydEF0MTtcblx0XHR0aGlzLl9kZWJ1Z2dlclBhdGhzQXJlVVJJcyA9IGZhbHNlO1xuXG5cdFx0dGhpcy5fY2xpZW50TGluZXNTdGFydEF0MSA9IHRydWU7XG5cdFx0dGhpcy5fY2xpZW50Q29sdW1uc1N0YXJ0QXQxID0gdHJ1ZTtcblx0XHR0aGlzLl9jbGllbnRQYXRoc0FyZVVSSXMgPSBmYWxzZTtcblxuXHRcdHRoaXMuX2lzU2VydmVyID0gdHlwZW9mIG9ic29sZXRlX2lzU2VydmVyID09PSAnYm9vbGVhbicgPyBvYnNvbGV0ZV9pc1NlcnZlciA6IGZhbHNlO1xuXG5cdFx0dGhpcy5vbignY2xvc2UnLCAoKSA9PiB7XG5cdFx0XHR0aGlzLnNodXRkb3duKCk7XG5cdFx0fSk7XG5cdFx0dGhpcy5vbignZXJyb3InLCAoZXJyb3IpID0+IHtcblx0XHRcdHRoaXMuc2h1dGRvd24oKTtcblx0XHR9KTtcblx0fVxuXG5cdHB1YmxpYyBzZXREZWJ1Z2dlclBhdGhGb3JtYXQoZm9ybWF0OiBzdHJpbmcpIHtcblx0XHR0aGlzLl9kZWJ1Z2dlclBhdGhzQXJlVVJJcyA9IGZvcm1hdCAhPT0gJ3BhdGgnO1xuXHR9XG5cblx0cHVibGljIHNldERlYnVnZ2VyTGluZXNTdGFydEF0MShlbmFibGU6IGJvb2xlYW4pIHtcblx0XHR0aGlzLl9kZWJ1Z2dlckxpbmVzU3RhcnRBdDEgPSBlbmFibGU7XG5cdH1cblxuXHRwdWJsaWMgc2V0RGVidWdnZXJDb2x1bW5zU3RhcnRBdDEoZW5hYmxlOiBib29sZWFuKSB7XG5cdFx0dGhpcy5fZGVidWdnZXJDb2x1bW5zU3RhcnRBdDEgPSBlbmFibGU7XG5cdH1cblxuXHRwdWJsaWMgc2V0UnVuQXNTZXJ2ZXIoZW5hYmxlOiBib29sZWFuKSB7XG5cdFx0dGhpcy5faXNTZXJ2ZXIgPSBlbmFibGU7XG5cdH1cblxuXHQvKipcblx0ICogQSB2aXJ0dWFsIGNvbnN0cnVjdG9yLi4uXG5cdCAqL1xuXHRwdWJsaWMgc3RhdGljIHJ1bihkZWJ1Z1Nlc3Npb246IHR5cGVvZiBEZWJ1Z1Nlc3Npb24pIHtcblxuXHRcdC8vIHBhcnNlIGFyZ3VtZW50c1xuXHRcdGxldCBwb3J0ID0gMDtcblx0XHRjb25zdCBhcmdzID0gcHJvY2Vzcy5hcmd2LnNsaWNlKDIpO1xuXHRcdGFyZ3MuZm9yRWFjaChmdW5jdGlvbiAodmFsLCBpbmRleCwgYXJyYXkpIHtcblx0XHRcdGNvbnN0IHBvcnRNYXRjaCA9IC9eLS1zZXJ2ZXI9KFxcZHs0LDV9KSQvLmV4ZWModmFsKTtcblx0XHRcdGlmIChwb3J0TWF0Y2gpIHtcblx0XHRcdFx0cG9ydCA9IHBhcnNlSW50KHBvcnRNYXRjaFsxXSwgMTApO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0aWYgKHBvcnQgPiAwKSB7XG5cdFx0XHQvLyBzdGFydCBhcyBhIHNlcnZlclxuXHRcdFx0Y29uc29sZS5lcnJvcihgd2FpdGluZyBmb3IgZGVidWcgcHJvdG9jb2wgb24gcG9ydCAke3BvcnR9YCk7XG5cdFx0XHROZXQuY3JlYXRlU2VydmVyKChzb2NrZXQpID0+IHtcblx0XHRcdFx0Y29uc29sZS5lcnJvcignPj4gYWNjZXB0ZWQgY29ubmVjdGlvbiBmcm9tIGNsaWVudCcpO1xuXHRcdFx0XHRzb2NrZXQub24oJ2VuZCcsICgpID0+IHtcblx0XHRcdFx0XHRjb25zb2xlLmVycm9yKCc+PiBjbGllbnQgY29ubmVjdGlvbiBjbG9zZWRcXG4nKTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdGNvbnN0IHNlc3Npb24gPSBuZXcgZGVidWdTZXNzaW9uKGZhbHNlLCB0cnVlKTtcblx0XHRcdFx0c2Vzc2lvbi5zZXRSdW5Bc1NlcnZlcih0cnVlKTtcblx0XHRcdFx0c2Vzc2lvbi5zdGFydChzb2NrZXQsIHNvY2tldCk7XG5cdFx0XHR9KS5saXN0ZW4ocG9ydCk7XG5cdFx0fSBlbHNlIHtcblxuXHRcdFx0Ly8gc3RhcnQgYSBzZXNzaW9uXG5cdFx0XHQvL2NvbnNvbGUuZXJyb3IoJ3dhaXRpbmcgZm9yIGRlYnVnIHByb3RvY29sIG9uIHN0ZGluL3N0ZG91dCcpO1xuXHRcdFx0Y29uc3Qgc2Vzc2lvbiA9IG5ldyBkZWJ1Z1Nlc3Npb24oZmFsc2UpO1xuXHRcdFx0cHJvY2Vzcy5vbignU0lHVEVSTScsICgpID0+IHtcblx0XHRcdFx0c2Vzc2lvbi5zaHV0ZG93bigpO1xuXHRcdFx0fSk7XG5cdFx0XHRzZXNzaW9uLnN0YXJ0KHByb2Nlc3Muc3RkaW4sIHByb2Nlc3Muc3Rkb3V0KTtcblx0XHR9XG5cdH1cblxuXHRwdWJsaWMgc2h1dGRvd24oKTogdm9pZCB7XG5cdFx0aWYgKHRoaXMuX2lzU2VydmVyIHx8IHRoaXMuX2lzUnVubmluZ0lubGluZSgpKSB7XG5cdFx0XHQvLyBzaHV0ZG93biBpZ25vcmVkIGluIHNlcnZlciBtb2RlXG5cdFx0fSBlbHNlIHtcblx0XHRcdC8vIHdhaXQgYSBiaXQgYmVmb3JlIHNodXR0aW5nIGRvd25cblx0XHRcdHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0XHRwcm9jZXNzLmV4aXQoMCk7XG5cdFx0XHR9LCAxMDApO1xuXHRcdH1cblx0fVxuXG5cdHByb3RlY3RlZCBzZW5kRXJyb3JSZXNwb25zZShyZXNwb25zZTogRGVidWdQcm90b2NvbC5SZXNwb25zZSwgY29kZU9yTWVzc2FnZTogbnVtYmVyIHwgRGVidWdQcm90b2NvbC5NZXNzYWdlLCBmb3JtYXQ/OiBzdHJpbmcsIHZhcmlhYmxlcz86IGFueSwgZGVzdDogRXJyb3JEZXN0aW5hdGlvbiA9IEVycm9yRGVzdGluYXRpb24uVXNlcik6IHZvaWQge1xuXG5cdFx0bGV0IG1zZyA6IERlYnVnUHJvdG9jb2wuTWVzc2FnZTtcblx0XHRpZiAodHlwZW9mIGNvZGVPck1lc3NhZ2UgPT09ICdudW1iZXInKSB7XG5cdFx0XHRtc2cgPSA8RGVidWdQcm90b2NvbC5NZXNzYWdlPiB7XG5cdFx0XHRcdGlkOiA8bnVtYmVyPiBjb2RlT3JNZXNzYWdlLFxuXHRcdFx0XHRmb3JtYXQ6IGZvcm1hdFxuXHRcdFx0fTtcblx0XHRcdGlmICh2YXJpYWJsZXMpIHtcblx0XHRcdFx0bXNnLnZhcmlhYmxlcyA9IHZhcmlhYmxlcztcblx0XHRcdH1cblx0XHRcdGlmIChkZXN0ICYgRXJyb3JEZXN0aW5hdGlvbi5Vc2VyKSB7XG5cdFx0XHRcdG1zZy5zaG93VXNlciA9IHRydWU7XG5cdFx0XHR9XG5cdFx0XHRpZiAoZGVzdCAmIEVycm9yRGVzdGluYXRpb24uVGVsZW1ldHJ5KSB7XG5cdFx0XHRcdG1zZy5zZW5kVGVsZW1ldHJ5ID0gdHJ1ZTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0bXNnID0gY29kZU9yTWVzc2FnZTtcblx0XHR9XG5cblx0XHRyZXNwb25zZS5zdWNjZXNzID0gZmFsc2U7XG5cdFx0cmVzcG9uc2UubWVzc2FnZSA9IERlYnVnU2Vzc2lvbi5mb3JtYXRQSUkobXNnLmZvcm1hdCwgdHJ1ZSwgbXNnLnZhcmlhYmxlcyk7XG5cdFx0aWYgKCFyZXNwb25zZS5ib2R5KSB7XG5cdFx0XHRyZXNwb25zZS5ib2R5ID0geyB9O1xuXHRcdH1cblx0XHRyZXNwb25zZS5ib2R5LmVycm9yID0gbXNnO1xuXG5cdFx0dGhpcy5zZW5kUmVzcG9uc2UocmVzcG9uc2UpO1xuXHR9XG5cblx0cHVibGljIHJ1bkluVGVybWluYWxSZXF1ZXN0KGFyZ3M6IERlYnVnUHJvdG9jb2wuUnVuSW5UZXJtaW5hbFJlcXVlc3RBcmd1bWVudHMsIHRpbWVvdXQ6IG51bWJlciwgY2I6IChyZXNwb25zZTogRGVidWdQcm90b2NvbC5SdW5JblRlcm1pbmFsUmVzcG9uc2UpID0+IHZvaWQpIHtcblx0XHR0aGlzLnNlbmRSZXF1ZXN0KCdydW5JblRlcm1pbmFsJywgYXJncywgdGltZW91dCwgY2IpO1xuXHR9XG5cblx0cHJvdGVjdGVkIGRpc3BhdGNoUmVxdWVzdChyZXF1ZXN0OiBEZWJ1Z1Byb3RvY29sLlJlcXVlc3QpOiB2b2lkIHtcblxuXHRcdGNvbnN0IHJlc3BvbnNlID0gbmV3IFJlc3BvbnNlKHJlcXVlc3QpO1xuXG5cdFx0dHJ5IHtcblx0XHRcdGlmIChyZXF1ZXN0LmNvbW1hbmQgPT09ICdpbml0aWFsaXplJykge1xuXHRcdFx0XHR2YXIgYXJncyA9IDxEZWJ1Z1Byb3RvY29sLkluaXRpYWxpemVSZXF1ZXN0QXJndW1lbnRzPiByZXF1ZXN0LmFyZ3VtZW50cztcblxuXHRcdFx0XHRpZiAodHlwZW9mIGFyZ3MubGluZXNTdGFydEF0MSA9PT0gJ2Jvb2xlYW4nKSB7XG5cdFx0XHRcdFx0dGhpcy5fY2xpZW50TGluZXNTdGFydEF0MSA9IGFyZ3MubGluZXNTdGFydEF0MTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAodHlwZW9mIGFyZ3MuY29sdW1uc1N0YXJ0QXQxID09PSAnYm9vbGVhbicpIHtcblx0XHRcdFx0XHR0aGlzLl9jbGllbnRDb2x1bW5zU3RhcnRBdDEgPSBhcmdzLmNvbHVtbnNTdGFydEF0MTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChhcmdzLnBhdGhGb3JtYXQgIT09ICdwYXRoJykge1xuXHRcdFx0XHRcdHRoaXMuc2VuZEVycm9yUmVzcG9uc2UocmVzcG9uc2UsIDIwMTgsICdkZWJ1ZyBhZGFwdGVyIG9ubHkgc3VwcG9ydHMgbmF0aXZlIHBhdGhzJywgbnVsbCwgRXJyb3JEZXN0aW5hdGlvbi5UZWxlbWV0cnkpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGNvbnN0IGluaXRpYWxpemVSZXNwb25zZSA9IDxEZWJ1Z1Byb3RvY29sLkluaXRpYWxpemVSZXNwb25zZT4gcmVzcG9uc2U7XG5cdFx0XHRcdFx0aW5pdGlhbGl6ZVJlc3BvbnNlLmJvZHkgPSB7fTtcblx0XHRcdFx0XHR0aGlzLmluaXRpYWxpemVSZXF1ZXN0KGluaXRpYWxpemVSZXNwb25zZSwgYXJncyk7XG5cdFx0XHRcdH1cblxuXHRcdFx0fSBlbHNlIGlmIChyZXF1ZXN0LmNvbW1hbmQgPT09ICdsYXVuY2gnKSB7XG5cdFx0XHRcdHRoaXMubGF1bmNoUmVxdWVzdCg8RGVidWdQcm90b2NvbC5MYXVuY2hSZXNwb25zZT4gcmVzcG9uc2UsIHJlcXVlc3QuYXJndW1lbnRzLCByZXF1ZXN0KTtcblxuXHRcdFx0fSBlbHNlIGlmIChyZXF1ZXN0LmNvbW1hbmQgPT09ICdhdHRhY2gnKSB7XG5cdFx0XHRcdHRoaXMuYXR0YWNoUmVxdWVzdCg8RGVidWdQcm90b2NvbC5BdHRhY2hSZXNwb25zZT4gcmVzcG9uc2UsIHJlcXVlc3QuYXJndW1lbnRzLCByZXF1ZXN0KTtcblxuXHRcdFx0fSBlbHNlIGlmIChyZXF1ZXN0LmNvbW1hbmQgPT09ICdkaXNjb25uZWN0Jykge1xuXHRcdFx0XHR0aGlzLmRpc2Nvbm5lY3RSZXF1ZXN0KDxEZWJ1Z1Byb3RvY29sLkRpc2Nvbm5lY3RSZXNwb25zZT4gcmVzcG9uc2UsIHJlcXVlc3QuYXJndW1lbnRzLCByZXF1ZXN0KTtcblxuXHRcdFx0fSBlbHNlIGlmIChyZXF1ZXN0LmNvbW1hbmQgPT09ICd0ZXJtaW5hdGUnKSB7XG5cdFx0XHRcdHRoaXMudGVybWluYXRlUmVxdWVzdCg8RGVidWdQcm90b2NvbC5UZXJtaW5hdGVSZXNwb25zZT4gcmVzcG9uc2UsIHJlcXVlc3QuYXJndW1lbnRzLCByZXF1ZXN0KTtcblxuXHRcdFx0fSBlbHNlIGlmIChyZXF1ZXN0LmNvbW1hbmQgPT09ICdyZXN0YXJ0Jykge1xuXHRcdFx0XHR0aGlzLnJlc3RhcnRSZXF1ZXN0KDxEZWJ1Z1Byb3RvY29sLlJlc3RhcnRSZXNwb25zZT4gcmVzcG9uc2UsIHJlcXVlc3QuYXJndW1lbnRzLCByZXF1ZXN0KTtcblxuXHRcdFx0fSBlbHNlIGlmIChyZXF1ZXN0LmNvbW1hbmQgPT09ICdzZXRCcmVha3BvaW50cycpIHtcblx0XHRcdFx0dGhpcy5zZXRCcmVha1BvaW50c1JlcXVlc3QoPERlYnVnUHJvdG9jb2wuU2V0QnJlYWtwb2ludHNSZXNwb25zZT4gcmVzcG9uc2UsIHJlcXVlc3QuYXJndW1lbnRzLCByZXF1ZXN0KTtcblxuXHRcdFx0fSBlbHNlIGlmIChyZXF1ZXN0LmNvbW1hbmQgPT09ICdzZXRGdW5jdGlvbkJyZWFrcG9pbnRzJykge1xuXHRcdFx0XHR0aGlzLnNldEZ1bmN0aW9uQnJlYWtQb2ludHNSZXF1ZXN0KDxEZWJ1Z1Byb3RvY29sLlNldEZ1bmN0aW9uQnJlYWtwb2ludHNSZXNwb25zZT4gcmVzcG9uc2UsIHJlcXVlc3QuYXJndW1lbnRzLCByZXF1ZXN0KTtcblxuXHRcdFx0fSBlbHNlIGlmIChyZXF1ZXN0LmNvbW1hbmQgPT09ICdzZXRFeGNlcHRpb25CcmVha3BvaW50cycpIHtcblx0XHRcdFx0dGhpcy5zZXRFeGNlcHRpb25CcmVha1BvaW50c1JlcXVlc3QoPERlYnVnUHJvdG9jb2wuU2V0RXhjZXB0aW9uQnJlYWtwb2ludHNSZXNwb25zZT4gcmVzcG9uc2UsIHJlcXVlc3QuYXJndW1lbnRzLCByZXF1ZXN0KTtcblxuXHRcdFx0fSBlbHNlIGlmIChyZXF1ZXN0LmNvbW1hbmQgPT09ICdjb25maWd1cmF0aW9uRG9uZScpIHtcblx0XHRcdFx0dGhpcy5jb25maWd1cmF0aW9uRG9uZVJlcXVlc3QoPERlYnVnUHJvdG9jb2wuQ29uZmlndXJhdGlvbkRvbmVSZXNwb25zZT4gcmVzcG9uc2UsIHJlcXVlc3QuYXJndW1lbnRzLCByZXF1ZXN0KTtcblxuXHRcdFx0fSBlbHNlIGlmIChyZXF1ZXN0LmNvbW1hbmQgPT09ICdjb250aW51ZScpIHtcblx0XHRcdFx0dGhpcy5jb250aW51ZVJlcXVlc3QoPERlYnVnUHJvdG9jb2wuQ29udGludWVSZXNwb25zZT4gcmVzcG9uc2UsIHJlcXVlc3QuYXJndW1lbnRzLCByZXF1ZXN0KTtcblxuXHRcdFx0fSBlbHNlIGlmIChyZXF1ZXN0LmNvbW1hbmQgPT09ICduZXh0Jykge1xuXHRcdFx0XHR0aGlzLm5leHRSZXF1ZXN0KDxEZWJ1Z1Byb3RvY29sLk5leHRSZXNwb25zZT4gcmVzcG9uc2UsIHJlcXVlc3QuYXJndW1lbnRzLCByZXF1ZXN0KTtcblxuXHRcdFx0fSBlbHNlIGlmIChyZXF1ZXN0LmNvbW1hbmQgPT09ICdzdGVwSW4nKSB7XG5cdFx0XHRcdHRoaXMuc3RlcEluUmVxdWVzdCg8RGVidWdQcm90b2NvbC5TdGVwSW5SZXNwb25zZT4gcmVzcG9uc2UsIHJlcXVlc3QuYXJndW1lbnRzLCByZXF1ZXN0KTtcblxuXHRcdFx0fSBlbHNlIGlmIChyZXF1ZXN0LmNvbW1hbmQgPT09ICdzdGVwT3V0Jykge1xuXHRcdFx0XHR0aGlzLnN0ZXBPdXRSZXF1ZXN0KDxEZWJ1Z1Byb3RvY29sLlN0ZXBPdXRSZXNwb25zZT4gcmVzcG9uc2UsIHJlcXVlc3QuYXJndW1lbnRzLCByZXF1ZXN0KTtcblxuXHRcdFx0fSBlbHNlIGlmIChyZXF1ZXN0LmNvbW1hbmQgPT09ICdzdGVwQmFjaycpIHtcblx0XHRcdFx0dGhpcy5zdGVwQmFja1JlcXVlc3QoPERlYnVnUHJvdG9jb2wuU3RlcEJhY2tSZXNwb25zZT4gcmVzcG9uc2UsIHJlcXVlc3QuYXJndW1lbnRzLCByZXF1ZXN0KTtcblxuXHRcdFx0fSBlbHNlIGlmIChyZXF1ZXN0LmNvbW1hbmQgPT09ICdyZXZlcnNlQ29udGludWUnKSB7XG5cdFx0XHRcdHRoaXMucmV2ZXJzZUNvbnRpbnVlUmVxdWVzdCg8RGVidWdQcm90b2NvbC5SZXZlcnNlQ29udGludWVSZXNwb25zZT4gcmVzcG9uc2UsIHJlcXVlc3QuYXJndW1lbnRzLCByZXF1ZXN0KTtcblxuXHRcdFx0fSBlbHNlIGlmIChyZXF1ZXN0LmNvbW1hbmQgPT09ICdyZXN0YXJ0RnJhbWUnKSB7XG5cdFx0XHRcdHRoaXMucmVzdGFydEZyYW1lUmVxdWVzdCg8RGVidWdQcm90b2NvbC5SZXN0YXJ0RnJhbWVSZXNwb25zZT4gcmVzcG9uc2UsIHJlcXVlc3QuYXJndW1lbnRzLCByZXF1ZXN0KTtcblxuXHRcdFx0fSBlbHNlIGlmIChyZXF1ZXN0LmNvbW1hbmQgPT09ICdnb3RvJykge1xuXHRcdFx0XHR0aGlzLmdvdG9SZXF1ZXN0KDxEZWJ1Z1Byb3RvY29sLkdvdG9SZXNwb25zZT4gcmVzcG9uc2UsIHJlcXVlc3QuYXJndW1lbnRzLCByZXF1ZXN0KTtcblxuXHRcdFx0fSBlbHNlIGlmIChyZXF1ZXN0LmNvbW1hbmQgPT09ICdwYXVzZScpIHtcblx0XHRcdFx0dGhpcy5wYXVzZVJlcXVlc3QoPERlYnVnUHJvdG9jb2wuUGF1c2VSZXNwb25zZT4gcmVzcG9uc2UsIHJlcXVlc3QuYXJndW1lbnRzLCByZXF1ZXN0KTtcblxuXHRcdFx0fSBlbHNlIGlmIChyZXF1ZXN0LmNvbW1hbmQgPT09ICdzdGFja1RyYWNlJykge1xuXHRcdFx0XHR0aGlzLnN0YWNrVHJhY2VSZXF1ZXN0KDxEZWJ1Z1Byb3RvY29sLlN0YWNrVHJhY2VSZXNwb25zZT4gcmVzcG9uc2UsIHJlcXVlc3QuYXJndW1lbnRzLCByZXF1ZXN0KTtcblxuXHRcdFx0fSBlbHNlIGlmIChyZXF1ZXN0LmNvbW1hbmQgPT09ICdzY29wZXMnKSB7XG5cdFx0XHRcdHRoaXMuc2NvcGVzUmVxdWVzdCg8RGVidWdQcm90b2NvbC5TY29wZXNSZXNwb25zZT4gcmVzcG9uc2UsIHJlcXVlc3QuYXJndW1lbnRzLCByZXF1ZXN0KTtcblxuXHRcdFx0fSBlbHNlIGlmIChyZXF1ZXN0LmNvbW1hbmQgPT09ICd2YXJpYWJsZXMnKSB7XG5cdFx0XHRcdHRoaXMudmFyaWFibGVzUmVxdWVzdCg8RGVidWdQcm90b2NvbC5WYXJpYWJsZXNSZXNwb25zZT4gcmVzcG9uc2UsIHJlcXVlc3QuYXJndW1lbnRzLCByZXF1ZXN0KTtcblxuXHRcdFx0fSBlbHNlIGlmIChyZXF1ZXN0LmNvbW1hbmQgPT09ICdzZXRWYXJpYWJsZScpIHtcblx0XHRcdFx0dGhpcy5zZXRWYXJpYWJsZVJlcXVlc3QoPERlYnVnUHJvdG9jb2wuU2V0VmFyaWFibGVSZXNwb25zZT4gcmVzcG9uc2UsIHJlcXVlc3QuYXJndW1lbnRzLCByZXF1ZXN0KTtcblxuXHRcdFx0fSBlbHNlIGlmIChyZXF1ZXN0LmNvbW1hbmQgPT09ICdzZXRFeHByZXNzaW9uJykge1xuXHRcdFx0XHR0aGlzLnNldEV4cHJlc3Npb25SZXF1ZXN0KDxEZWJ1Z1Byb3RvY29sLlNldEV4cHJlc3Npb25SZXNwb25zZT4gcmVzcG9uc2UsIHJlcXVlc3QuYXJndW1lbnRzLCByZXF1ZXN0KTtcblxuXHRcdFx0fSBlbHNlIGlmIChyZXF1ZXN0LmNvbW1hbmQgPT09ICdzb3VyY2UnKSB7XG5cdFx0XHRcdHRoaXMuc291cmNlUmVxdWVzdCg8RGVidWdQcm90b2NvbC5Tb3VyY2VSZXNwb25zZT4gcmVzcG9uc2UsIHJlcXVlc3QuYXJndW1lbnRzLCByZXF1ZXN0KTtcblxuXHRcdFx0fSBlbHNlIGlmIChyZXF1ZXN0LmNvbW1hbmQgPT09ICd0aHJlYWRzJykge1xuXHRcdFx0XHR0aGlzLnRocmVhZHNSZXF1ZXN0KDxEZWJ1Z1Byb3RvY29sLlRocmVhZHNSZXNwb25zZT4gcmVzcG9uc2UsIHJlcXVlc3QpO1xuXG5cdFx0XHR9IGVsc2UgaWYgKHJlcXVlc3QuY29tbWFuZCA9PT0gJ3Rlcm1pbmF0ZVRocmVhZHMnKSB7XG5cdFx0XHRcdHRoaXMudGVybWluYXRlVGhyZWFkc1JlcXVlc3QoPERlYnVnUHJvdG9jb2wuVGVybWluYXRlVGhyZWFkc1Jlc3BvbnNlPiByZXNwb25zZSwgcmVxdWVzdC5hcmd1bWVudHMsIHJlcXVlc3QpO1xuXG5cdFx0XHR9IGVsc2UgaWYgKHJlcXVlc3QuY29tbWFuZCA9PT0gJ2V2YWx1YXRlJykge1xuXHRcdFx0XHR0aGlzLmV2YWx1YXRlUmVxdWVzdCg8RGVidWdQcm90b2NvbC5FdmFsdWF0ZVJlc3BvbnNlPiByZXNwb25zZSwgcmVxdWVzdC5hcmd1bWVudHMsIHJlcXVlc3QpO1xuXG5cdFx0XHR9IGVsc2UgaWYgKHJlcXVlc3QuY29tbWFuZCA9PT0gJ3N0ZXBJblRhcmdldHMnKSB7XG5cdFx0XHRcdHRoaXMuc3RlcEluVGFyZ2V0c1JlcXVlc3QoPERlYnVnUHJvdG9jb2wuU3RlcEluVGFyZ2V0c1Jlc3BvbnNlPiByZXNwb25zZSwgcmVxdWVzdC5hcmd1bWVudHMsIHJlcXVlc3QpO1xuXG5cdFx0XHR9IGVsc2UgaWYgKHJlcXVlc3QuY29tbWFuZCA9PT0gJ2dvdG9UYXJnZXRzJykge1xuXHRcdFx0XHR0aGlzLmdvdG9UYXJnZXRzUmVxdWVzdCg8RGVidWdQcm90b2NvbC5Hb3RvVGFyZ2V0c1Jlc3BvbnNlPiByZXNwb25zZSwgcmVxdWVzdC5hcmd1bWVudHMsIHJlcXVlc3QpO1xuXG5cdFx0XHR9IGVsc2UgaWYgKHJlcXVlc3QuY29tbWFuZCA9PT0gJ2NvbXBsZXRpb25zJykge1xuXHRcdFx0XHR0aGlzLmNvbXBsZXRpb25zUmVxdWVzdCg8RGVidWdQcm90b2NvbC5Db21wbGV0aW9uc1Jlc3BvbnNlPiByZXNwb25zZSwgcmVxdWVzdC5hcmd1bWVudHMsIHJlcXVlc3QpO1xuXG5cdFx0XHR9IGVsc2UgaWYgKHJlcXVlc3QuY29tbWFuZCA9PT0gJ2V4Y2VwdGlvbkluZm8nKSB7XG5cdFx0XHRcdHRoaXMuZXhjZXB0aW9uSW5mb1JlcXVlc3QoPERlYnVnUHJvdG9jb2wuRXhjZXB0aW9uSW5mb1Jlc3BvbnNlPiByZXNwb25zZSwgcmVxdWVzdC5hcmd1bWVudHMsIHJlcXVlc3QpO1xuXG5cdFx0XHR9IGVsc2UgaWYgKHJlcXVlc3QuY29tbWFuZCA9PT0gJ2xvYWRlZFNvdXJjZXMnKSB7XG5cdFx0XHRcdHRoaXMubG9hZGVkU291cmNlc1JlcXVlc3QoPERlYnVnUHJvdG9jb2wuTG9hZGVkU291cmNlc1Jlc3BvbnNlPiByZXNwb25zZSwgcmVxdWVzdC5hcmd1bWVudHMsIHJlcXVlc3QpO1xuXG5cdFx0XHR9IGVsc2UgaWYgKHJlcXVlc3QuY29tbWFuZCA9PT0gJ2RhdGFCcmVha3BvaW50SW5mbycpIHtcblx0XHRcdFx0dGhpcy5kYXRhQnJlYWtwb2ludEluZm9SZXF1ZXN0KDxEZWJ1Z1Byb3RvY29sLkRhdGFCcmVha3BvaW50SW5mb1Jlc3BvbnNlPiByZXNwb25zZSwgcmVxdWVzdC5hcmd1bWVudHMsIHJlcXVlc3QpO1xuXG5cdFx0XHR9IGVsc2UgaWYgKHJlcXVlc3QuY29tbWFuZCA9PT0gJ3NldERhdGFCcmVha3BvaW50cycpIHtcblx0XHRcdFx0dGhpcy5zZXREYXRhQnJlYWtwb2ludHNSZXF1ZXN0KDxEZWJ1Z1Byb3RvY29sLlNldERhdGFCcmVha3BvaW50c1Jlc3BvbnNlPiByZXNwb25zZSwgcmVxdWVzdC5hcmd1bWVudHMsIHJlcXVlc3QpO1xuXG5cdFx0XHR9IGVsc2UgaWYgKHJlcXVlc3QuY29tbWFuZCA9PT0gJ3JlYWRNZW1vcnknKSB7XG5cdFx0XHRcdHRoaXMucmVhZE1lbW9yeVJlcXVlc3QoPERlYnVnUHJvdG9jb2wuUmVhZE1lbW9yeVJlc3BvbnNlPiByZXNwb25zZSwgcmVxdWVzdC5hcmd1bWVudHMsIHJlcXVlc3QpO1xuXG5cdFx0XHR9IGVsc2UgaWYgKHJlcXVlc3QuY29tbWFuZCA9PT0gJ2Rpc2Fzc2VtYmxlJykge1xuXHRcdFx0XHR0aGlzLmRpc2Fzc2VtYmxlUmVxdWVzdCg8RGVidWdQcm90b2NvbC5EaXNhc3NlbWJsZVJlc3BvbnNlPiByZXNwb25zZSwgcmVxdWVzdC5hcmd1bWVudHMsIHJlcXVlc3QpO1xuXG5cdFx0XHR9IGVsc2UgaWYgKHJlcXVlc3QuY29tbWFuZCA9PT0gJ2NhbmNlbCcpIHtcblx0XHRcdFx0dGhpcy5jYW5jZWxSZXF1ZXN0KDxEZWJ1Z1Byb3RvY29sLkNhbmNlbFJlc3BvbnNlPiByZXNwb25zZSwgcmVxdWVzdC5hcmd1bWVudHMsIHJlcXVlc3QpO1xuXG5cdFx0XHR9IGVsc2UgaWYgKHJlcXVlc3QuY29tbWFuZCA9PT0gJ2JyZWFrcG9pbnRMb2NhdGlvbnMnKSB7XG5cdFx0XHRcdHRoaXMuYnJlYWtwb2ludExvY2F0aW9uc1JlcXVlc3QoPERlYnVnUHJvdG9jb2wuQnJlYWtwb2ludExvY2F0aW9uc1Jlc3BvbnNlPiByZXNwb25zZSwgcmVxdWVzdC5hcmd1bWVudHMsIHJlcXVlc3QpO1xuXG5cdFx0XHR9IGVsc2UgaWYgKHJlcXVlc3QuY29tbWFuZCA9PT0gJ3NldEluc3RydWN0aW9uQnJlYWtwb2ludHMnKSB7XG5cdFx0XHRcdHRoaXMuc2V0SW5zdHJ1Y3Rpb25CcmVha3BvaW50c1JlcXVlc3QoPERlYnVnUHJvdG9jb2wuU2V0SW5zdHJ1Y3Rpb25CcmVha3BvaW50c1Jlc3BvbnNlPiByZXNwb25zZSwgcmVxdWVzdC5hcmd1bWVudHMsIHJlcXVlc3QpO1xuXG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0aGlzLmN1c3RvbVJlcXVlc3QocmVxdWVzdC5jb21tYW5kLCA8RGVidWdQcm90b2NvbC5SZXNwb25zZT4gcmVzcG9uc2UsIHJlcXVlc3QuYXJndW1lbnRzLCByZXF1ZXN0KTtcblx0XHRcdH1cblx0XHR9IGNhdGNoIChlKSB7XG5cdFx0XHR0aGlzLnNlbmRFcnJvclJlc3BvbnNlKHJlc3BvbnNlLCAxMTA0LCAne19zdGFja30nLCB7IF9leGNlcHRpb246IGUubWVzc2FnZSwgX3N0YWNrOiBlLnN0YWNrIH0sIEVycm9yRGVzdGluYXRpb24uVGVsZW1ldHJ5KTtcblx0XHR9XG5cdH1cblxuXHRwcm90ZWN0ZWQgaW5pdGlhbGl6ZVJlcXVlc3QocmVzcG9uc2U6IERlYnVnUHJvdG9jb2wuSW5pdGlhbGl6ZVJlc3BvbnNlLCBhcmdzOiBEZWJ1Z1Byb3RvY29sLkluaXRpYWxpemVSZXF1ZXN0QXJndW1lbnRzKTogdm9pZCB7XG5cblx0XHQvLyBUaGlzIGRlZmF1bHQgZGVidWcgYWRhcHRlciBkb2VzIG5vdCBzdXBwb3J0IGNvbmRpdGlvbmFsIGJyZWFrcG9pbnRzLlxuXHRcdHJlc3BvbnNlLmJvZHkuc3VwcG9ydHNDb25kaXRpb25hbEJyZWFrcG9pbnRzID0gZmFsc2U7XG5cblx0XHQvLyBUaGlzIGRlZmF1bHQgZGVidWcgYWRhcHRlciBkb2VzIG5vdCBzdXBwb3J0IGhpdCBjb25kaXRpb25hbCBicmVha3BvaW50cy5cblx0XHRyZXNwb25zZS5ib2R5LnN1cHBvcnRzSGl0Q29uZGl0aW9uYWxCcmVha3BvaW50cyA9IGZhbHNlO1xuXG5cdFx0Ly8gVGhpcyBkZWZhdWx0IGRlYnVnIGFkYXB0ZXIgZG9lcyBub3Qgc3VwcG9ydCBmdW5jdGlvbiBicmVha3BvaW50cy5cblx0XHRyZXNwb25zZS5ib2R5LnN1cHBvcnRzRnVuY3Rpb25CcmVha3BvaW50cyA9IGZhbHNlO1xuXG5cdFx0Ly8gVGhpcyBkZWZhdWx0IGRlYnVnIGFkYXB0ZXIgaW1wbGVtZW50cyB0aGUgJ2NvbmZpZ3VyYXRpb25Eb25lJyByZXF1ZXN0LlxuXHRcdHJlc3BvbnNlLmJvZHkuc3VwcG9ydHNDb25maWd1cmF0aW9uRG9uZVJlcXVlc3QgPSB0cnVlO1xuXG5cdFx0Ly8gVGhpcyBkZWZhdWx0IGRlYnVnIGFkYXB0ZXIgZG9lcyBub3Qgc3VwcG9ydCBob3ZlcnMgYmFzZWQgb24gdGhlICdldmFsdWF0ZScgcmVxdWVzdC5cblx0XHRyZXNwb25zZS5ib2R5LnN1cHBvcnRzRXZhbHVhdGVGb3JIb3ZlcnMgPSBmYWxzZTtcblxuXHRcdC8vIFRoaXMgZGVmYXVsdCBkZWJ1ZyBhZGFwdGVyIGRvZXMgbm90IHN1cHBvcnQgdGhlICdzdGVwQmFjaycgcmVxdWVzdC5cblx0XHRyZXNwb25zZS5ib2R5LnN1cHBvcnRzU3RlcEJhY2sgPSBmYWxzZTtcblxuXHRcdC8vIFRoaXMgZGVmYXVsdCBkZWJ1ZyBhZGFwdGVyIGRvZXMgbm90IHN1cHBvcnQgdGhlICdzZXRWYXJpYWJsZScgcmVxdWVzdC5cblx0XHRyZXNwb25zZS5ib2R5LnN1cHBvcnRzU2V0VmFyaWFibGUgPSBmYWxzZTtcblxuXHRcdC8vIFRoaXMgZGVmYXVsdCBkZWJ1ZyBhZGFwdGVyIGRvZXMgbm90IHN1cHBvcnQgdGhlICdyZXN0YXJ0RnJhbWUnIHJlcXVlc3QuXG5cdFx0cmVzcG9uc2UuYm9keS5zdXBwb3J0c1Jlc3RhcnRGcmFtZSA9IGZhbHNlO1xuXG5cdFx0Ly8gVGhpcyBkZWZhdWx0IGRlYnVnIGFkYXB0ZXIgZG9lcyBub3Qgc3VwcG9ydCB0aGUgJ3N0ZXBJblRhcmdldHMnIHJlcXVlc3QuXG5cdFx0cmVzcG9uc2UuYm9keS5zdXBwb3J0c1N0ZXBJblRhcmdldHNSZXF1ZXN0ID0gZmFsc2U7XG5cblx0XHQvLyBUaGlzIGRlZmF1bHQgZGVidWcgYWRhcHRlciBkb2VzIG5vdCBzdXBwb3J0IHRoZSAnZ290b1RhcmdldHMnIHJlcXVlc3QuXG5cdFx0cmVzcG9uc2UuYm9keS5zdXBwb3J0c0dvdG9UYXJnZXRzUmVxdWVzdCA9IGZhbHNlO1xuXG5cdFx0Ly8gVGhpcyBkZWZhdWx0IGRlYnVnIGFkYXB0ZXIgZG9lcyBub3Qgc3VwcG9ydCB0aGUgJ2NvbXBsZXRpb25zJyByZXF1ZXN0LlxuXHRcdHJlc3BvbnNlLmJvZHkuc3VwcG9ydHNDb21wbGV0aW9uc1JlcXVlc3QgPSBmYWxzZTtcblxuXHRcdC8vIFRoaXMgZGVmYXVsdCBkZWJ1ZyBhZGFwdGVyIGRvZXMgbm90IHN1cHBvcnQgdGhlICdyZXN0YXJ0JyByZXF1ZXN0LlxuXHRcdHJlc3BvbnNlLmJvZHkuc3VwcG9ydHNSZXN0YXJ0UmVxdWVzdCA9IGZhbHNlO1xuXG5cdFx0Ly8gVGhpcyBkZWZhdWx0IGRlYnVnIGFkYXB0ZXIgZG9lcyBub3Qgc3VwcG9ydCB0aGUgJ2V4Y2VwdGlvbk9wdGlvbnMnIGF0dHJpYnV0ZSBvbiB0aGUgJ3NldEV4Y2VwdGlvbkJyZWFrcG9pbnRzJyByZXF1ZXN0LlxuXHRcdHJlc3BvbnNlLmJvZHkuc3VwcG9ydHNFeGNlcHRpb25PcHRpb25zID0gZmFsc2U7XG5cblx0XHQvLyBUaGlzIGRlZmF1bHQgZGVidWcgYWRhcHRlciBkb2VzIG5vdCBzdXBwb3J0IHRoZSAnZm9ybWF0JyBhdHRyaWJ1dGUgb24gdGhlICd2YXJpYWJsZXMnLCAnZXZhbHVhdGUnLCBhbmQgJ3N0YWNrVHJhY2UnIHJlcXVlc3QuXG5cdFx0cmVzcG9uc2UuYm9keS5zdXBwb3J0c1ZhbHVlRm9ybWF0dGluZ09wdGlvbnMgPSBmYWxzZTtcblxuXHRcdC8vIFRoaXMgZGVidWcgYWRhcHRlciBkb2VzIG5vdCBzdXBwb3J0IHRoZSAnZXhjZXB0aW9uSW5mbycgcmVxdWVzdC5cblx0XHRyZXNwb25zZS5ib2R5LnN1cHBvcnRzRXhjZXB0aW9uSW5mb1JlcXVlc3QgPSBmYWxzZTtcblxuXHRcdC8vIFRoaXMgZGVidWcgYWRhcHRlciBkb2VzIG5vdCBzdXBwb3J0IHRoZSAnVGVybWluYXRlRGVidWdnZWUnIGF0dHJpYnV0ZSBvbiB0aGUgJ2Rpc2Nvbm5lY3QnIHJlcXVlc3QuXG5cdFx0cmVzcG9uc2UuYm9keS5zdXBwb3J0VGVybWluYXRlRGVidWdnZWUgPSBmYWxzZTtcblxuXHRcdC8vIFRoaXMgZGVidWcgYWRhcHRlciBkb2VzIG5vdCBzdXBwb3J0IGRlbGF5ZWQgbG9hZGluZyBvZiBzdGFjayBmcmFtZXMuXG5cdFx0cmVzcG9uc2UuYm9keS5zdXBwb3J0c0RlbGF5ZWRTdGFja1RyYWNlTG9hZGluZyA9IGZhbHNlO1xuXG5cdFx0Ly8gVGhpcyBkZWJ1ZyBhZGFwdGVyIGRvZXMgbm90IHN1cHBvcnQgdGhlICdsb2FkZWRTb3VyY2VzJyByZXF1ZXN0LlxuXHRcdHJlc3BvbnNlLmJvZHkuc3VwcG9ydHNMb2FkZWRTb3VyY2VzUmVxdWVzdCA9IGZhbHNlO1xuXG5cdFx0Ly8gVGhpcyBkZWJ1ZyBhZGFwdGVyIGRvZXMgbm90IHN1cHBvcnQgdGhlICdsb2dNZXNzYWdlJyBhdHRyaWJ1dGUgb2YgdGhlIFNvdXJjZUJyZWFrcG9pbnQuXG5cdFx0cmVzcG9uc2UuYm9keS5zdXBwb3J0c0xvZ1BvaW50cyA9IGZhbHNlO1xuXG5cdFx0Ly8gVGhpcyBkZWJ1ZyBhZGFwdGVyIGRvZXMgbm90IHN1cHBvcnQgdGhlICd0ZXJtaW5hdGVUaHJlYWRzJyByZXF1ZXN0LlxuXHRcdHJlc3BvbnNlLmJvZHkuc3VwcG9ydHNUZXJtaW5hdGVUaHJlYWRzUmVxdWVzdCA9IGZhbHNlO1xuXG5cdFx0Ly8gVGhpcyBkZWJ1ZyBhZGFwdGVyIGRvZXMgbm90IHN1cHBvcnQgdGhlICdzZXRFeHByZXNzaW9uJyByZXF1ZXN0LlxuXHRcdHJlc3BvbnNlLmJvZHkuc3VwcG9ydHNTZXRFeHByZXNzaW9uID0gZmFsc2U7XG5cblx0XHQvLyBUaGlzIGRlYnVnIGFkYXB0ZXIgZG9lcyBub3Qgc3VwcG9ydCB0aGUgJ3Rlcm1pbmF0ZScgcmVxdWVzdC5cblx0XHRyZXNwb25zZS5ib2R5LnN1cHBvcnRzVGVybWluYXRlUmVxdWVzdCA9IGZhbHNlO1xuXG5cdFx0Ly8gVGhpcyBkZWJ1ZyBhZGFwdGVyIGRvZXMgbm90IHN1cHBvcnQgZGF0YSBicmVha3BvaW50cy5cblx0XHRyZXNwb25zZS5ib2R5LnN1cHBvcnRzRGF0YUJyZWFrcG9pbnRzID0gZmFsc2U7XG5cblx0XHQvKiogVGhpcyBkZWJ1ZyBhZGFwdGVyIGRvZXMgbm90IHN1cHBvcnQgdGhlICdyZWFkTWVtb3J5JyByZXF1ZXN0LiAqL1xuXHRcdHJlc3BvbnNlLmJvZHkuc3VwcG9ydHNSZWFkTWVtb3J5UmVxdWVzdCA9IGZhbHNlO1xuXG5cdFx0LyoqIFRoZSBkZWJ1ZyBhZGFwdGVyIGRvZXMgbm90IHN1cHBvcnQgdGhlICdkaXNhc3NlbWJsZScgcmVxdWVzdC4gKi9cblx0XHRyZXNwb25zZS5ib2R5LnN1cHBvcnRzRGlzYXNzZW1ibGVSZXF1ZXN0ID0gZmFsc2U7XG5cblx0XHQvKiogVGhlIGRlYnVnIGFkYXB0ZXIgZG9lcyBub3Qgc3VwcG9ydCB0aGUgJ2NhbmNlbCcgcmVxdWVzdC4gKi9cblx0XHRyZXNwb25zZS5ib2R5LnN1cHBvcnRzQ2FuY2VsUmVxdWVzdCA9IGZhbHNlO1xuXG5cdFx0LyoqIFRoZSBkZWJ1ZyBhZGFwdGVyIGRvZXMgbm90IHN1cHBvcnQgdGhlICdicmVha3BvaW50TG9jYXRpb25zJyByZXF1ZXN0LiAqL1xuXHRcdHJlc3BvbnNlLmJvZHkuc3VwcG9ydHNCcmVha3BvaW50TG9jYXRpb25zUmVxdWVzdCA9IGZhbHNlO1xuXG5cdFx0LyoqIFRoZSBkZWJ1ZyBhZGFwdGVyIGRvZXMgbm90IHN1cHBvcnQgdGhlICdjbGlwYm9hcmQnIGNvbnRleHQgdmFsdWUgaW4gdGhlICdldmFsdWF0ZScgcmVxdWVzdC4gKi9cblx0XHRyZXNwb25zZS5ib2R5LnN1cHBvcnRzQ2xpcGJvYXJkQ29udGV4dCA9IGZhbHNlO1xuXG5cdFx0LyoqIFRoZSBkZWJ1ZyBhZGFwdGVyIGRvZXMgbm90IHN1cHBvcnQgc3RlcHBpbmcgZ3JhbnVsYXJpdGllcyBmb3IgdGhlIHN0ZXBwaW5nIHJlcXVlc3RzLiAqL1xuXHRcdHJlc3BvbnNlLmJvZHkuc3VwcG9ydHNTdGVwcGluZ0dyYW51bGFyaXR5ID0gZmFsc2U7XG5cblx0XHQvKiogVGhlIGRlYnVnIGFkYXB0ZXIgZG9lcyBub3Qgc3VwcG9ydCB0aGUgJ3NldEluc3RydWN0aW9uQnJlYWtwb2ludHMnIHJlcXVlc3QuICovXG5cdFx0cmVzcG9uc2UuYm9keS5zdXBwb3J0c0luc3RydWN0aW9uQnJlYWtwb2ludHMgPSBmYWxzZTtcblxuXHRcdHRoaXMuc2VuZFJlc3BvbnNlKHJlc3BvbnNlKTtcblx0fVxuXG5cdHByb3RlY3RlZCBkaXNjb25uZWN0UmVxdWVzdChyZXNwb25zZTogRGVidWdQcm90b2NvbC5EaXNjb25uZWN0UmVzcG9uc2UsIGFyZ3M6IERlYnVnUHJvdG9jb2wuRGlzY29ubmVjdEFyZ3VtZW50cywgcmVxdWVzdD86IERlYnVnUHJvdG9jb2wuUmVxdWVzdCk6IHZvaWQge1xuXHRcdHRoaXMuc2VuZFJlc3BvbnNlKHJlc3BvbnNlKTtcblx0XHR0aGlzLnNodXRkb3duKCk7XG5cdH1cblxuXHRwcm90ZWN0ZWQgbGF1bmNoUmVxdWVzdChyZXNwb25zZTogRGVidWdQcm90b2NvbC5MYXVuY2hSZXNwb25zZSwgYXJnczogRGVidWdQcm90b2NvbC5MYXVuY2hSZXF1ZXN0QXJndW1lbnRzLCByZXF1ZXN0PzogRGVidWdQcm90b2NvbC5SZXF1ZXN0KTogdm9pZCB7XG5cdFx0dGhpcy5zZW5kUmVzcG9uc2UocmVzcG9uc2UpO1xuXHR9XG5cblx0cHJvdGVjdGVkIGF0dGFjaFJlcXVlc3QocmVzcG9uc2U6IERlYnVnUHJvdG9jb2wuQXR0YWNoUmVzcG9uc2UsIGFyZ3M6IERlYnVnUHJvdG9jb2wuQXR0YWNoUmVxdWVzdEFyZ3VtZW50cywgcmVxdWVzdD86IERlYnVnUHJvdG9jb2wuUmVxdWVzdCk6IHZvaWQge1xuXHRcdHRoaXMuc2VuZFJlc3BvbnNlKHJlc3BvbnNlKTtcblx0fVxuXG5cdHByb3RlY3RlZCB0ZXJtaW5hdGVSZXF1ZXN0KHJlc3BvbnNlOiBEZWJ1Z1Byb3RvY29sLlRlcm1pbmF0ZVJlc3BvbnNlLCBhcmdzOiBEZWJ1Z1Byb3RvY29sLlRlcm1pbmF0ZUFyZ3VtZW50cywgcmVxdWVzdD86IERlYnVnUHJvdG9jb2wuUmVxdWVzdCk6IHZvaWQge1xuXHRcdHRoaXMuc2VuZFJlc3BvbnNlKHJlc3BvbnNlKTtcblx0fVxuXG5cdHByb3RlY3RlZCByZXN0YXJ0UmVxdWVzdChyZXNwb25zZTogRGVidWdQcm90b2NvbC5SZXN0YXJ0UmVzcG9uc2UsIGFyZ3M6IERlYnVnUHJvdG9jb2wuUmVzdGFydEFyZ3VtZW50cywgcmVxdWVzdD86IERlYnVnUHJvdG9jb2wuUmVxdWVzdCk6IHZvaWQge1xuXHRcdHRoaXMuc2VuZFJlc3BvbnNlKHJlc3BvbnNlKTtcblx0fVxuXG5cdHByb3RlY3RlZCBzZXRCcmVha1BvaW50c1JlcXVlc3QocmVzcG9uc2U6IERlYnVnUHJvdG9jb2wuU2V0QnJlYWtwb2ludHNSZXNwb25zZSwgYXJnczogRGVidWdQcm90b2NvbC5TZXRCcmVha3BvaW50c0FyZ3VtZW50cywgcmVxdWVzdD86IERlYnVnUHJvdG9jb2wuUmVxdWVzdCk6IHZvaWQge1xuXHRcdHRoaXMuc2VuZFJlc3BvbnNlKHJlc3BvbnNlKTtcblx0fVxuXG5cdHByb3RlY3RlZCBzZXRGdW5jdGlvbkJyZWFrUG9pbnRzUmVxdWVzdChyZXNwb25zZTogRGVidWdQcm90b2NvbC5TZXRGdW5jdGlvbkJyZWFrcG9pbnRzUmVzcG9uc2UsIGFyZ3M6IERlYnVnUHJvdG9jb2wuU2V0RnVuY3Rpb25CcmVha3BvaW50c0FyZ3VtZW50cywgcmVxdWVzdD86IERlYnVnUHJvdG9jb2wuUmVxdWVzdCk6IHZvaWQge1xuXHRcdHRoaXMuc2VuZFJlc3BvbnNlKHJlc3BvbnNlKTtcblx0fVxuXG5cdHByb3RlY3RlZCBzZXRFeGNlcHRpb25CcmVha1BvaW50c1JlcXVlc3QocmVzcG9uc2U6IERlYnVnUHJvdG9jb2wuU2V0RXhjZXB0aW9uQnJlYWtwb2ludHNSZXNwb25zZSwgYXJnczogRGVidWdQcm90b2NvbC5TZXRFeGNlcHRpb25CcmVha3BvaW50c0FyZ3VtZW50cywgcmVxdWVzdD86IERlYnVnUHJvdG9jb2wuUmVxdWVzdCk6IHZvaWQge1xuXHRcdHRoaXMuc2VuZFJlc3BvbnNlKHJlc3BvbnNlKTtcblx0fVxuXG5cdHByb3RlY3RlZCBjb25maWd1cmF0aW9uRG9uZVJlcXVlc3QocmVzcG9uc2U6IERlYnVnUHJvdG9jb2wuQ29uZmlndXJhdGlvbkRvbmVSZXNwb25zZSwgYXJnczogRGVidWdQcm90b2NvbC5Db25maWd1cmF0aW9uRG9uZUFyZ3VtZW50cywgcmVxdWVzdD86IERlYnVnUHJvdG9jb2wuUmVxdWVzdCk6IHZvaWQge1xuXHRcdHRoaXMuc2VuZFJlc3BvbnNlKHJlc3BvbnNlKTtcblx0fVxuXG5cdHByb3RlY3RlZCBjb250aW51ZVJlcXVlc3QocmVzcG9uc2U6IERlYnVnUHJvdG9jb2wuQ29udGludWVSZXNwb25zZSwgYXJnczogRGVidWdQcm90b2NvbC5Db250aW51ZUFyZ3VtZW50cywgcmVxdWVzdD86IERlYnVnUHJvdG9jb2wuUmVxdWVzdCkgOiB2b2lkIHtcblx0XHR0aGlzLnNlbmRSZXNwb25zZShyZXNwb25zZSk7XG5cdH1cblxuXHRwcm90ZWN0ZWQgbmV4dFJlcXVlc3QocmVzcG9uc2U6IERlYnVnUHJvdG9jb2wuTmV4dFJlc3BvbnNlLCBhcmdzOiBEZWJ1Z1Byb3RvY29sLk5leHRBcmd1bWVudHMsIHJlcXVlc3Q/OiBEZWJ1Z1Byb3RvY29sLlJlcXVlc3QpIDogdm9pZCB7XG5cdFx0dGhpcy5zZW5kUmVzcG9uc2UocmVzcG9uc2UpO1xuXHR9XG5cblx0cHJvdGVjdGVkIHN0ZXBJblJlcXVlc3QocmVzcG9uc2U6IERlYnVnUHJvdG9jb2wuU3RlcEluUmVzcG9uc2UsIGFyZ3M6IERlYnVnUHJvdG9jb2wuU3RlcEluQXJndW1lbnRzLCByZXF1ZXN0PzogRGVidWdQcm90b2NvbC5SZXF1ZXN0KSA6IHZvaWQge1xuXHRcdHRoaXMuc2VuZFJlc3BvbnNlKHJlc3BvbnNlKTtcblx0fVxuXG5cdHByb3RlY3RlZCBzdGVwT3V0UmVxdWVzdChyZXNwb25zZTogRGVidWdQcm90b2NvbC5TdGVwT3V0UmVzcG9uc2UsIGFyZ3M6IERlYnVnUHJvdG9jb2wuU3RlcE91dEFyZ3VtZW50cywgcmVxdWVzdD86IERlYnVnUHJvdG9jb2wuUmVxdWVzdCkgOiB2b2lkIHtcblx0XHR0aGlzLnNlbmRSZXNwb25zZShyZXNwb25zZSk7XG5cdH1cblxuXHRwcm90ZWN0ZWQgc3RlcEJhY2tSZXF1ZXN0KHJlc3BvbnNlOiBEZWJ1Z1Byb3RvY29sLlN0ZXBCYWNrUmVzcG9uc2UsIGFyZ3M6IERlYnVnUHJvdG9jb2wuU3RlcEJhY2tBcmd1bWVudHMsIHJlcXVlc3Q/OiBEZWJ1Z1Byb3RvY29sLlJlcXVlc3QpIDogdm9pZCB7XG5cdFx0dGhpcy5zZW5kUmVzcG9uc2UocmVzcG9uc2UpO1xuXHR9XG5cblx0cHJvdGVjdGVkIHJldmVyc2VDb250aW51ZVJlcXVlc3QocmVzcG9uc2U6IERlYnVnUHJvdG9jb2wuUmV2ZXJzZUNvbnRpbnVlUmVzcG9uc2UsIGFyZ3M6IERlYnVnUHJvdG9jb2wuUmV2ZXJzZUNvbnRpbnVlQXJndW1lbnRzLCByZXF1ZXN0PzogRGVidWdQcm90b2NvbC5SZXF1ZXN0KSA6IHZvaWQge1xuXHRcdHRoaXMuc2VuZFJlc3BvbnNlKHJlc3BvbnNlKTtcblx0fVxuXG5cdHByb3RlY3RlZCByZXN0YXJ0RnJhbWVSZXF1ZXN0KHJlc3BvbnNlOiBEZWJ1Z1Byb3RvY29sLlJlc3RhcnRGcmFtZVJlc3BvbnNlLCBhcmdzOiBEZWJ1Z1Byb3RvY29sLlJlc3RhcnRGcmFtZUFyZ3VtZW50cywgcmVxdWVzdD86IERlYnVnUHJvdG9jb2wuUmVxdWVzdCkgOiB2b2lkIHtcblx0XHR0aGlzLnNlbmRSZXNwb25zZShyZXNwb25zZSk7XG5cdH1cblxuXHRwcm90ZWN0ZWQgZ290b1JlcXVlc3QocmVzcG9uc2U6IERlYnVnUHJvdG9jb2wuR290b1Jlc3BvbnNlLCBhcmdzOiBEZWJ1Z1Byb3RvY29sLkdvdG9Bcmd1bWVudHMsIHJlcXVlc3Q/OiBEZWJ1Z1Byb3RvY29sLlJlcXVlc3QpIDogdm9pZCB7XG5cdFx0dGhpcy5zZW5kUmVzcG9uc2UocmVzcG9uc2UpO1xuXHR9XG5cblx0cHJvdGVjdGVkIHBhdXNlUmVxdWVzdChyZXNwb25zZTogRGVidWdQcm90b2NvbC5QYXVzZVJlc3BvbnNlLCBhcmdzOiBEZWJ1Z1Byb3RvY29sLlBhdXNlQXJndW1lbnRzLCByZXF1ZXN0PzogRGVidWdQcm90b2NvbC5SZXF1ZXN0KSA6IHZvaWQge1xuXHRcdHRoaXMuc2VuZFJlc3BvbnNlKHJlc3BvbnNlKTtcblx0fVxuXG5cdHByb3RlY3RlZCBzb3VyY2VSZXF1ZXN0KHJlc3BvbnNlOiBEZWJ1Z1Byb3RvY29sLlNvdXJjZVJlc3BvbnNlLCBhcmdzOiBEZWJ1Z1Byb3RvY29sLlNvdXJjZUFyZ3VtZW50cywgcmVxdWVzdD86IERlYnVnUHJvdG9jb2wuUmVxdWVzdCkgOiB2b2lkIHtcblx0XHR0aGlzLnNlbmRSZXNwb25zZShyZXNwb25zZSk7XG5cdH1cblxuXHRwcm90ZWN0ZWQgdGhyZWFkc1JlcXVlc3QocmVzcG9uc2U6IERlYnVnUHJvdG9jb2wuVGhyZWFkc1Jlc3BvbnNlLCByZXF1ZXN0PzogRGVidWdQcm90b2NvbC5SZXF1ZXN0KTogdm9pZCB7XG5cdFx0dGhpcy5zZW5kUmVzcG9uc2UocmVzcG9uc2UpO1xuXHR9XG5cblx0cHJvdGVjdGVkIHRlcm1pbmF0ZVRocmVhZHNSZXF1ZXN0KHJlc3BvbnNlOiBEZWJ1Z1Byb3RvY29sLlRlcm1pbmF0ZVRocmVhZHNSZXNwb25zZSwgYXJnczogRGVidWdQcm90b2NvbC5UZXJtaW5hdGVUaHJlYWRzQXJndW1lbnRzLCByZXF1ZXN0PzogRGVidWdQcm90b2NvbC5SZXF1ZXN0KTogdm9pZCB7XG5cdFx0dGhpcy5zZW5kUmVzcG9uc2UocmVzcG9uc2UpO1xuXHR9XG5cblx0cHJvdGVjdGVkIHN0YWNrVHJhY2VSZXF1ZXN0KHJlc3BvbnNlOiBEZWJ1Z1Byb3RvY29sLlN0YWNrVHJhY2VSZXNwb25zZSwgYXJnczogRGVidWdQcm90b2NvbC5TdGFja1RyYWNlQXJndW1lbnRzLCByZXF1ZXN0PzogRGVidWdQcm90b2NvbC5SZXF1ZXN0KTogdm9pZCB7XG5cdFx0dGhpcy5zZW5kUmVzcG9uc2UocmVzcG9uc2UpO1xuXHR9XG5cblx0cHJvdGVjdGVkIHNjb3Blc1JlcXVlc3QocmVzcG9uc2U6IERlYnVnUHJvdG9jb2wuU2NvcGVzUmVzcG9uc2UsIGFyZ3M6IERlYnVnUHJvdG9jb2wuU2NvcGVzQXJndW1lbnRzLCByZXF1ZXN0PzogRGVidWdQcm90b2NvbC5SZXF1ZXN0KTogdm9pZCB7XG5cdFx0dGhpcy5zZW5kUmVzcG9uc2UocmVzcG9uc2UpO1xuXHR9XG5cblx0cHJvdGVjdGVkIHZhcmlhYmxlc1JlcXVlc3QocmVzcG9uc2U6IERlYnVnUHJvdG9jb2wuVmFyaWFibGVzUmVzcG9uc2UsIGFyZ3M6IERlYnVnUHJvdG9jb2wuVmFyaWFibGVzQXJndW1lbnRzLCByZXF1ZXN0PzogRGVidWdQcm90b2NvbC5SZXF1ZXN0KTogdm9pZCB7XG5cdFx0dGhpcy5zZW5kUmVzcG9uc2UocmVzcG9uc2UpO1xuXHR9XG5cblx0cHJvdGVjdGVkIHNldFZhcmlhYmxlUmVxdWVzdChyZXNwb25zZTogRGVidWdQcm90b2NvbC5TZXRWYXJpYWJsZVJlc3BvbnNlLCBhcmdzOiBEZWJ1Z1Byb3RvY29sLlNldFZhcmlhYmxlQXJndW1lbnRzLCByZXF1ZXN0PzogRGVidWdQcm90b2NvbC5SZXF1ZXN0KTogdm9pZCB7XG5cdFx0dGhpcy5zZW5kUmVzcG9uc2UocmVzcG9uc2UpO1xuXHR9XG5cblx0cHJvdGVjdGVkIHNldEV4cHJlc3Npb25SZXF1ZXN0KHJlc3BvbnNlOiBEZWJ1Z1Byb3RvY29sLlNldEV4cHJlc3Npb25SZXNwb25zZSwgYXJnczogRGVidWdQcm90b2NvbC5TZXRFeHByZXNzaW9uQXJndW1lbnRzLCByZXF1ZXN0PzogRGVidWdQcm90b2NvbC5SZXF1ZXN0KTogdm9pZCB7XG5cdFx0dGhpcy5zZW5kUmVzcG9uc2UocmVzcG9uc2UpO1xuXHR9XG5cblx0cHJvdGVjdGVkIGV2YWx1YXRlUmVxdWVzdChyZXNwb25zZTogRGVidWdQcm90b2NvbC5FdmFsdWF0ZVJlc3BvbnNlLCBhcmdzOiBEZWJ1Z1Byb3RvY29sLkV2YWx1YXRlQXJndW1lbnRzLCByZXF1ZXN0PzogRGVidWdQcm90b2NvbC5SZXF1ZXN0KTogdm9pZCB7XG5cdFx0dGhpcy5zZW5kUmVzcG9uc2UocmVzcG9uc2UpO1xuXHR9XG5cblx0cHJvdGVjdGVkIHN0ZXBJblRhcmdldHNSZXF1ZXN0KHJlc3BvbnNlOiBEZWJ1Z1Byb3RvY29sLlN0ZXBJblRhcmdldHNSZXNwb25zZSwgYXJnczogRGVidWdQcm90b2NvbC5TdGVwSW5UYXJnZXRzQXJndW1lbnRzLCByZXF1ZXN0PzogRGVidWdQcm90b2NvbC5SZXF1ZXN0KTogdm9pZCB7XG5cdFx0dGhpcy5zZW5kUmVzcG9uc2UocmVzcG9uc2UpO1xuXHR9XG5cblx0cHJvdGVjdGVkIGdvdG9UYXJnZXRzUmVxdWVzdChyZXNwb25zZTogRGVidWdQcm90b2NvbC5Hb3RvVGFyZ2V0c1Jlc3BvbnNlLCBhcmdzOiBEZWJ1Z1Byb3RvY29sLkdvdG9UYXJnZXRzQXJndW1lbnRzLCByZXF1ZXN0PzogRGVidWdQcm90b2NvbC5SZXF1ZXN0KTogdm9pZCB7XG5cdFx0dGhpcy5zZW5kUmVzcG9uc2UocmVzcG9uc2UpO1xuXHR9XG5cblx0cHJvdGVjdGVkIGNvbXBsZXRpb25zUmVxdWVzdChyZXNwb25zZTogRGVidWdQcm90b2NvbC5Db21wbGV0aW9uc1Jlc3BvbnNlLCBhcmdzOiBEZWJ1Z1Byb3RvY29sLkNvbXBsZXRpb25zQXJndW1lbnRzLCByZXF1ZXN0PzogRGVidWdQcm90b2NvbC5SZXF1ZXN0KTogdm9pZCB7XG5cdFx0dGhpcy5zZW5kUmVzcG9uc2UocmVzcG9uc2UpO1xuXHR9XG5cblx0cHJvdGVjdGVkIGV4Y2VwdGlvbkluZm9SZXF1ZXN0KHJlc3BvbnNlOiBEZWJ1Z1Byb3RvY29sLkV4Y2VwdGlvbkluZm9SZXNwb25zZSwgYXJnczogRGVidWdQcm90b2NvbC5FeGNlcHRpb25JbmZvQXJndW1lbnRzLCByZXF1ZXN0PzogRGVidWdQcm90b2NvbC5SZXF1ZXN0KTogdm9pZCB7XG5cdFx0dGhpcy5zZW5kUmVzcG9uc2UocmVzcG9uc2UpO1xuXHR9XG5cblx0cHJvdGVjdGVkIGxvYWRlZFNvdXJjZXNSZXF1ZXN0KHJlc3BvbnNlOiBEZWJ1Z1Byb3RvY29sLkxvYWRlZFNvdXJjZXNSZXNwb25zZSwgYXJnczogRGVidWdQcm90b2NvbC5Mb2FkZWRTb3VyY2VzQXJndW1lbnRzLCByZXF1ZXN0PzogRGVidWdQcm90b2NvbC5SZXF1ZXN0KTogdm9pZCB7XG5cdFx0dGhpcy5zZW5kUmVzcG9uc2UocmVzcG9uc2UpO1xuXHR9XG5cblx0cHJvdGVjdGVkIGRhdGFCcmVha3BvaW50SW5mb1JlcXVlc3QocmVzcG9uc2U6IERlYnVnUHJvdG9jb2wuRGF0YUJyZWFrcG9pbnRJbmZvUmVzcG9uc2UsIGFyZ3M6IERlYnVnUHJvdG9jb2wuRGF0YUJyZWFrcG9pbnRJbmZvQXJndW1lbnRzLCByZXF1ZXN0PzogRGVidWdQcm90b2NvbC5SZXF1ZXN0KTogdm9pZCB7XG5cdFx0dGhpcy5zZW5kUmVzcG9uc2UocmVzcG9uc2UpO1xuXHR9XG5cblx0cHJvdGVjdGVkIHNldERhdGFCcmVha3BvaW50c1JlcXVlc3QocmVzcG9uc2U6IERlYnVnUHJvdG9jb2wuU2V0RGF0YUJyZWFrcG9pbnRzUmVzcG9uc2UsIGFyZ3M6IERlYnVnUHJvdG9jb2wuU2V0RGF0YUJyZWFrcG9pbnRzQXJndW1lbnRzLCByZXF1ZXN0PzogRGVidWdQcm90b2NvbC5SZXF1ZXN0KTogdm9pZCB7XG5cdFx0dGhpcy5zZW5kUmVzcG9uc2UocmVzcG9uc2UpO1xuXHR9XG5cblx0cHJvdGVjdGVkIHJlYWRNZW1vcnlSZXF1ZXN0KHJlc3BvbnNlOiBEZWJ1Z1Byb3RvY29sLlJlYWRNZW1vcnlSZXNwb25zZSwgYXJnczogRGVidWdQcm90b2NvbC5SZWFkTWVtb3J5QXJndW1lbnRzLCByZXF1ZXN0PzogRGVidWdQcm90b2NvbC5SZXF1ZXN0KTogdm9pZCB7XG5cdFx0dGhpcy5zZW5kUmVzcG9uc2UocmVzcG9uc2UpO1xuXHR9XG5cblx0cHJvdGVjdGVkIGRpc2Fzc2VtYmxlUmVxdWVzdChyZXNwb25zZTogRGVidWdQcm90b2NvbC5EaXNhc3NlbWJsZVJlc3BvbnNlLCBhcmdzOiBEZWJ1Z1Byb3RvY29sLkRpc2Fzc2VtYmxlQXJndW1lbnRzLCByZXF1ZXN0PzogRGVidWdQcm90b2NvbC5SZXF1ZXN0KTogdm9pZCB7XG5cdFx0dGhpcy5zZW5kUmVzcG9uc2UocmVzcG9uc2UpO1xuXHR9XG5cblx0cHJvdGVjdGVkIGNhbmNlbFJlcXVlc3QocmVzcG9uc2U6IERlYnVnUHJvdG9jb2wuQ2FuY2VsUmVzcG9uc2UsIGFyZ3M6IERlYnVnUHJvdG9jb2wuQ2FuY2VsQXJndW1lbnRzLCByZXF1ZXN0PzogRGVidWdQcm90b2NvbC5SZXF1ZXN0KTogdm9pZCB7XG5cdFx0dGhpcy5zZW5kUmVzcG9uc2UocmVzcG9uc2UpO1xuXHR9XG5cblx0cHJvdGVjdGVkIGJyZWFrcG9pbnRMb2NhdGlvbnNSZXF1ZXN0KHJlc3BvbnNlOiBEZWJ1Z1Byb3RvY29sLkJyZWFrcG9pbnRMb2NhdGlvbnNSZXNwb25zZSwgYXJnczogRGVidWdQcm90b2NvbC5CcmVha3BvaW50TG9jYXRpb25zQXJndW1lbnRzLCByZXF1ZXN0PzogRGVidWdQcm90b2NvbC5SZXF1ZXN0KTogdm9pZCB7XG5cdFx0dGhpcy5zZW5kUmVzcG9uc2UocmVzcG9uc2UpO1xuXHR9XG5cblx0cHJvdGVjdGVkIHNldEluc3RydWN0aW9uQnJlYWtwb2ludHNSZXF1ZXN0KHJlc3BvbnNlOiBEZWJ1Z1Byb3RvY29sLlNldEluc3RydWN0aW9uQnJlYWtwb2ludHNSZXNwb25zZSwgYXJnczogRGVidWdQcm90b2NvbC5TZXRJbnN0cnVjdGlvbkJyZWFrcG9pbnRzQXJndW1lbnRzLCByZXF1ZXN0PzogRGVidWdQcm90b2NvbC5SZXF1ZXN0KTogdm9pZCB7XG5cdFx0dGhpcy5zZW5kUmVzcG9uc2UocmVzcG9uc2UpO1xuXHR9XG5cblx0LyoqXG5cdCAqIE92ZXJyaWRlIHRoaXMgaG9vayB0byBpbXBsZW1lbnQgY3VzdG9tIHJlcXVlc3RzLlxuXHQgKi9cblx0cHJvdGVjdGVkIGN1c3RvbVJlcXVlc3QoY29tbWFuZDogc3RyaW5nLCByZXNwb25zZTogRGVidWdQcm90b2NvbC5SZXNwb25zZSwgYXJnczogYW55LCByZXF1ZXN0PzogRGVidWdQcm90b2NvbC5SZXF1ZXN0KTogdm9pZCB7XG5cdFx0dGhpcy5zZW5kRXJyb3JSZXNwb25zZShyZXNwb25zZSwgMTAxNCwgJ3VucmVjb2duaXplZCByZXF1ZXN0JywgbnVsbCwgRXJyb3JEZXN0aW5hdGlvbi5UZWxlbWV0cnkpO1xuXHR9XG5cblx0Ly8tLS0tIHByb3RlY3RlZCAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cblx0cHJvdGVjdGVkIGNvbnZlcnRDbGllbnRMaW5lVG9EZWJ1Z2dlcihsaW5lOiBudW1iZXIpOiBudW1iZXIge1xuXHRcdGlmICh0aGlzLl9kZWJ1Z2dlckxpbmVzU3RhcnRBdDEpIHtcblx0XHRcdHJldHVybiB0aGlzLl9jbGllbnRMaW5lc1N0YXJ0QXQxID8gbGluZSA6IGxpbmUgKyAxO1xuXHRcdH1cblx0XHRyZXR1cm4gdGhpcy5fY2xpZW50TGluZXNTdGFydEF0MSA/IGxpbmUgLSAxIDogbGluZTtcblx0fVxuXG5cdHByb3RlY3RlZCBjb252ZXJ0RGVidWdnZXJMaW5lVG9DbGllbnQobGluZTogbnVtYmVyKTogbnVtYmVyIHtcblx0XHRpZiAodGhpcy5fZGVidWdnZXJMaW5lc1N0YXJ0QXQxKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fY2xpZW50TGluZXNTdGFydEF0MSA/IGxpbmUgOiBsaW5lIC0gMTtcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXMuX2NsaWVudExpbmVzU3RhcnRBdDEgPyBsaW5lICsgMSA6IGxpbmU7XG5cdH1cblxuXHRwcm90ZWN0ZWQgY29udmVydENsaWVudENvbHVtblRvRGVidWdnZXIoY29sdW1uOiBudW1iZXIpOiBudW1iZXIge1xuXHRcdGlmICh0aGlzLl9kZWJ1Z2dlckNvbHVtbnNTdGFydEF0MSkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2NsaWVudENvbHVtbnNTdGFydEF0MSA/IGNvbHVtbiA6IGNvbHVtbiArIDE7XG5cdFx0fVxuXHRcdHJldHVybiB0aGlzLl9jbGllbnRDb2x1bW5zU3RhcnRBdDEgPyBjb2x1bW4gLSAxIDogY29sdW1uO1xuXHR9XG5cblx0cHJvdGVjdGVkIGNvbnZlcnREZWJ1Z2dlckNvbHVtblRvQ2xpZW50KGNvbHVtbjogbnVtYmVyKTogbnVtYmVyIHtcblx0XHRpZiAodGhpcy5fZGVidWdnZXJDb2x1bW5zU3RhcnRBdDEpIHtcblx0XHRcdHJldHVybiB0aGlzLl9jbGllbnRDb2x1bW5zU3RhcnRBdDEgPyBjb2x1bW4gOiBjb2x1bW4gLSAxO1xuXHRcdH1cblx0XHRyZXR1cm4gdGhpcy5fY2xpZW50Q29sdW1uc1N0YXJ0QXQxID8gY29sdW1uICsgMSA6IGNvbHVtbjtcblx0fVxuXG5cdHByb3RlY3RlZCBjb252ZXJ0Q2xpZW50UGF0aFRvRGVidWdnZXIoY2xpZW50UGF0aDogc3RyaW5nKTogc3RyaW5nIHtcblx0XHRpZiAodGhpcy5fY2xpZW50UGF0aHNBcmVVUklzICE9PSB0aGlzLl9kZWJ1Z2dlclBhdGhzQXJlVVJJcykge1xuXHRcdFx0aWYgKHRoaXMuX2NsaWVudFBhdGhzQXJlVVJJcykge1xuXHRcdFx0XHRyZXR1cm4gRGVidWdTZXNzaW9uLnVyaTJwYXRoKGNsaWVudFBhdGgpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmV0dXJuIERlYnVnU2Vzc2lvbi5wYXRoMnVyaShjbGllbnRQYXRoKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIGNsaWVudFBhdGg7XG5cdH1cblxuXHRwcm90ZWN0ZWQgY29udmVydERlYnVnZ2VyUGF0aFRvQ2xpZW50KGRlYnVnZ2VyUGF0aDogc3RyaW5nKTogc3RyaW5nIHtcblx0XHRpZiAodGhpcy5fZGVidWdnZXJQYXRoc0FyZVVSSXMgIT09IHRoaXMuX2NsaWVudFBhdGhzQXJlVVJJcykge1xuXHRcdFx0aWYgKHRoaXMuX2RlYnVnZ2VyUGF0aHNBcmVVUklzKSB7XG5cdFx0XHRcdHJldHVybiBEZWJ1Z1Nlc3Npb24udXJpMnBhdGgoZGVidWdnZXJQYXRoKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJldHVybiBEZWJ1Z1Nlc3Npb24ucGF0aDJ1cmkoZGVidWdnZXJQYXRoKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIGRlYnVnZ2VyUGF0aDtcblx0fVxuXG5cdC8vLS0tLSBwcml2YXRlIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuXHRwcml2YXRlIHN0YXRpYyBwYXRoMnVyaShwYXRoOiBzdHJpbmcpOiBzdHJpbmcge1xuXG5cdFx0aWYgKHByb2Nlc3MucGxhdGZvcm0gPT09ICd3aW4zMicpIHtcblx0XHRcdGlmICgvXltBLVpdOi8udGVzdChwYXRoKSkge1xuXHRcdFx0XHRwYXRoID0gcGF0aFswXS50b0xvd2VyQ2FzZSgpICsgcGF0aC5zdWJzdHIoMSk7XG5cdFx0XHR9XG5cdFx0XHRwYXRoID0gcGF0aC5yZXBsYWNlKC9cXFxcL2csICcvJyk7XG5cdFx0fVxuXHRcdHBhdGggPSBlbmNvZGVVUkkocGF0aCk7XG5cblx0XHRsZXQgdXJpID0gbmV3IFVSTChgZmlsZTpgKTtcdC8vIGlnbm9yZSAncGF0aCcgZm9yIG5vd1xuXHRcdHVyaS5wYXRobmFtZSA9IHBhdGg7XHQvLyBub3cgdXNlICdwYXRoJyB0byBnZXQgdGhlIGNvcnJlY3QgcGVyY2VudCBlbmNvZGluZyAoc2VlIGh0dHBzOi8vdXJsLnNwZWMud2hhdHdnLm9yZylcblx0XHRyZXR1cm4gdXJpLnRvU3RyaW5nKCk7XG5cdH1cblxuXHRwcml2YXRlIHN0YXRpYyB1cmkycGF0aChzb3VyY2VVcmk6IHN0cmluZyk6IHN0cmluZyB7XG5cblx0XHRsZXQgdXJpID0gbmV3IFVSTChzb3VyY2VVcmkpO1xuXHRcdGxldCBzID0gZGVjb2RlVVJJQ29tcG9uZW50KHVyaS5wYXRobmFtZSk7XG5cdFx0aWYgKHByb2Nlc3MucGxhdGZvcm0gPT09ICd3aW4zMicpIHtcblx0XHRcdGlmICgvXlxcL1thLXpBLVpdOi8udGVzdChzKSkge1xuXHRcdFx0XHRzID0gc1sxXS50b0xvd2VyQ2FzZSgpICsgcy5zdWJzdHIoMik7XG5cdFx0XHR9XG5cdFx0XHRzID0gcy5yZXBsYWNlKC9cXC8vZywgJ1xcXFwnKTtcblx0XHR9XG5cdFx0cmV0dXJuIHM7XG5cdH1cblxuXHRwcml2YXRlIHN0YXRpYyBfZm9ybWF0UElJUmVnZXhwID0gL3soW159XSspfS9nO1xuXG5cdC8qXG5cdCogSWYgYXJndW1lbnQgc3RhcnRzIHdpdGggJ18nIGl0IGlzIE9LIHRvIHNlbmQgaXRzIHZhbHVlIHRvIHRlbGVtZXRyeS5cblx0Ki9cblx0cHJpdmF0ZSBzdGF0aWMgZm9ybWF0UElJKGZvcm1hdDpzdHJpbmcsIGV4Y2x1ZGVQSUk6IGJvb2xlYW4sIGFyZ3M6IHtba2V5OiBzdHJpbmddOiBzdHJpbmd9KTogc3RyaW5nIHtcblx0XHRyZXR1cm4gZm9ybWF0LnJlcGxhY2UoRGVidWdTZXNzaW9uLl9mb3JtYXRQSUlSZWdleHAsIGZ1bmN0aW9uKG1hdGNoLCBwYXJhbU5hbWUpIHtcblx0XHRcdGlmIChleGNsdWRlUElJICYmIHBhcmFtTmFtZS5sZW5ndGggPiAwICYmIHBhcmFtTmFtZVswXSAhPT0gJ18nKSB7XG5cdFx0XHRcdHJldHVybiBtYXRjaDtcblx0XHRcdH1cblx0XHRcdHJldHVybiBhcmdzW3BhcmFtTmFtZV0gJiYgYXJncy5oYXNPd25Qcm9wZXJ0eShwYXJhbU5hbWUpID9cblx0XHRcdFx0YXJnc1twYXJhbU5hbWVdIDpcblx0XHRcdFx0bWF0Y2g7XG5cdFx0fSlcblx0fVxufVxuIl19

/***/ }),

/***/ 44:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
class Message {
    constructor(type) {
        this.seq = 0;
        this.type = type;
    }
}
exports.Message = Message;
class Response extends Message {
    constructor(request, message) {
        super('response');
        this.request_seq = request.seq;
        this.command = request.command;
        if (message) {
            this.success = false;
            this.message = message;
        }
        else {
            this.success = true;
        }
    }
}
exports.Response = Response;
class Event extends Message {
    constructor(event, body) {
        super('event');
        this.event = event;
        if (body) {
            this.body = body;
        }
    }
}
exports.Event = Event;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVzc2FnZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvbWVzc2FnZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Z0dBR2dHOztBQUtoRyxNQUFhLE9BQU87SUFJbkIsWUFBbUIsSUFBWTtRQUM5QixJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQztRQUNiLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0lBQ2xCLENBQUM7Q0FDRDtBQVJELDBCQVFDO0FBRUQsTUFBYSxRQUFTLFNBQVEsT0FBTztJQUtwQyxZQUFtQixPQUE4QixFQUFFLE9BQWdCO1FBQ2xFLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNsQixJQUFJLENBQUMsV0FBVyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUM7UUFDL0IsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDO1FBQy9CLElBQUksT0FBTyxFQUFFO1lBQ1osSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7WUFDZixJQUFLLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztTQUM5QjthQUFNO1lBQ04sSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7U0FDcEI7SUFDRixDQUFDO0NBQ0Q7QUFoQkQsNEJBZ0JDO0FBRUQsTUFBYSxLQUFNLFNBQVEsT0FBTztJQUdqQyxZQUFtQixLQUFhLEVBQUUsSUFBVTtRQUMzQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDZixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixJQUFJLElBQUksRUFBRTtZQUNILElBQUssQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1NBQ3hCO0lBQ0YsQ0FBQztDQUNEO0FBVkQsc0JBVUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICogIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS4gU2VlIExpY2Vuc2UudHh0IGluIHRoZSBwcm9qZWN0IHJvb3QgZm9yIGxpY2Vuc2UgaW5mb3JtYXRpb24uXG4gKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuaW1wb3J0IHsgRGVidWdQcm90b2NvbCB9IGZyb20gJ3ZzY29kZS1kZWJ1Z3Byb3RvY29sJztcblxuXG5leHBvcnQgY2xhc3MgTWVzc2FnZSBpbXBsZW1lbnRzIERlYnVnUHJvdG9jb2wuUHJvdG9jb2xNZXNzYWdlIHtcblx0c2VxOiBudW1iZXI7XG5cdHR5cGU6IHN0cmluZztcblxuXHRwdWJsaWMgY29uc3RydWN0b3IodHlwZTogc3RyaW5nKSB7XG5cdFx0dGhpcy5zZXEgPSAwO1xuXHRcdHRoaXMudHlwZSA9IHR5cGU7XG5cdH1cbn1cblxuZXhwb3J0IGNsYXNzIFJlc3BvbnNlIGV4dGVuZHMgTWVzc2FnZSBpbXBsZW1lbnRzIERlYnVnUHJvdG9jb2wuUmVzcG9uc2Uge1xuXHRyZXF1ZXN0X3NlcTogbnVtYmVyO1xuXHRzdWNjZXNzOiBib29sZWFuO1xuXHRjb21tYW5kOiBzdHJpbmc7XG5cblx0cHVibGljIGNvbnN0cnVjdG9yKHJlcXVlc3Q6IERlYnVnUHJvdG9jb2wuUmVxdWVzdCwgbWVzc2FnZT86IHN0cmluZykge1xuXHRcdHN1cGVyKCdyZXNwb25zZScpO1xuXHRcdHRoaXMucmVxdWVzdF9zZXEgPSByZXF1ZXN0LnNlcTtcblx0XHR0aGlzLmNvbW1hbmQgPSByZXF1ZXN0LmNvbW1hbmQ7XG5cdFx0aWYgKG1lc3NhZ2UpIHtcblx0XHRcdHRoaXMuc3VjY2VzcyA9IGZhbHNlO1xuXHRcdFx0KDxhbnk+dGhpcykubWVzc2FnZSA9IG1lc3NhZ2U7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMuc3VjY2VzcyA9IHRydWU7XG5cdFx0fVxuXHR9XG59XG5cbmV4cG9ydCBjbGFzcyBFdmVudCBleHRlbmRzIE1lc3NhZ2UgaW1wbGVtZW50cyBEZWJ1Z1Byb3RvY29sLkV2ZW50IHtcblx0ZXZlbnQ6IHN0cmluZztcblxuXHRwdWJsaWMgY29uc3RydWN0b3IoZXZlbnQ6IHN0cmluZywgYm9keT86IGFueSkge1xuXHRcdHN1cGVyKCdldmVudCcpO1xuXHRcdHRoaXMuZXZlbnQgPSBldmVudDtcblx0XHRpZiAoYm9keSkge1xuXHRcdFx0KDxhbnk+dGhpcykuYm9keSA9IGJvZHk7XG5cdFx0fVxuXHR9XG59XG4iXX0=

/***/ }),

/***/ 5:
/***/ (function(module, exports) {

module.exports = require("child_process");

/***/ }),

/***/ 604:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*---------------------------------------------------------
 * Copyright 2020 The Go Authors. All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
// This file is for running the godlvdap debug adapter as a standalone program
// in a separate process (e.g. when working in --server mode).
//
// NOTE: we must not include this file when we switch to the inline debug adapter
// launch mode. This installs a process-wide uncaughtException handler
// which can result in the extension host crash.
const vscode_debugadapter_1 = __webpack_require__(82);
const goDlvDebug_1 = __webpack_require__(605);
process.on('uncaughtException', (err) => {
    const errMessage = err && (err.stack || err.message);
    vscode_debugadapter_1.logger.error(`Unhandled error in debug adapter: ${errMessage}`);
    throw err;
});
goDlvDebug_1.GoDlvDapDebugSession.run(goDlvDebug_1.GoDlvDapDebugSession);


/***/ }),

/***/ 605:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*---------------------------------------------------------
 * Copyright 2020 The Go Authors. All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoDlvDapDebugSession = void 0;
// NOTE: This debug adapter is experimental, in-development code. If you
// actually need to debug Go code, please use the default adapter.
const child_process_1 = __webpack_require__(5);
const fs = __webpack_require__(8);
const net = __webpack_require__(22);
const os = __webpack_require__(26);
const path = __webpack_require__(2);
const vscode_debugadapter_1 = __webpack_require__(82);
const goPath_1 = __webpack_require__(12);
const processUtils_1 = __webpack_require__(21);
const dapClient_1 = __webpack_require__(606);
function logArgsToString(args) {
    return args
        .map((arg) => {
        return typeof arg === 'string' ? arg : JSON.stringify(arg);
    })
        .join(' ');
}
function log(...args) {
    vscode_debugadapter_1.logger.warn(logArgsToString(args));
}
function logError(...args) {
    vscode_debugadapter_1.logger.error(logArgsToString(args));
}
// GoDlvDapDebugSession implements a DAP debug adapter to talk to the editor.
//
// This adapter serves as a DAP proxy between the editor and the DAP server
// inside Delve. It relies on functionality inherited from DebugSession to
// implement the server side interfacing the editor, and on DapClient to
// implement the client side interfacing Delve:
//
//      Editor                GoDlvDapDebugSession                 Delve
//  +------------+        +--------------+-----------+         +------------+
//  | DAP Client | <====> | DebugSession | DAPClient |  <====> | DAP Server |
//  +------------+        +--------------+-----------+         +------------+
class GoDlvDapDebugSession extends vscode_debugadapter_1.LoggingDebugSession {
    constructor() {
        super();
        this.DEFAULT_DELVE_HOST = '127.0.0.1';
        this.DEFAULT_DELVE_PORT = 42042;
        this.logLevel = vscode_debugadapter_1.Logger.LogLevel.Error;
        this.dlvClient = null;
        // Child process used to track debugee launched without debugging (noDebug
        // mode). Either debugProcess or dlvClient are null.
        this.debugProcess = null;
        // Invoke logger.init here because we want logging to work in 'inline'
        // DA mode. It's typically called in the start() method of our parent
        // class, but this method isn't called in 'inline' mode.
        vscode_debugadapter_1.logger.init((e) => this.sendEvent(e));
        // this debugger uses zero-based lines and columns
        this.setDebuggerLinesStartAt1(false);
        this.setDebuggerColumnsStartAt1(false);
    }
    initializeRequest(response, args, request) {
        log('InitializeRequest');
        response.body.supportsConfigurationDoneRequest = true;
        // We respond to InitializeRequest here, because Delve hasn't been
        // launched yet. Delve will start responding to DAP requests after
        // LaunchRequest is received, which tell us how to start it.
        // TODO: we could send an InitializeRequest to Delve when
        // it launches, wait for its response and sanity check the capabilities
        // it reports. Once DAP support in Delve is complete, this can be part
        // of making sure that the "dlv" binary we find is sufficiently
        // up-to-date to talk DAP with us.
        this.sendResponse(response);
        log('InitializeResponse');
    }
    launchRequest(response, args, request) {
        // Setup logger now that we have the 'trace' level passed in from
        // LaunchRequestArguments.
        this.logLevel =
            args.trace === 'verbose'
                ? vscode_debugadapter_1.Logger.LogLevel.Verbose
                : args.trace === 'log'
                    ? vscode_debugadapter_1.Logger.LogLevel.Log
                    : vscode_debugadapter_1.Logger.LogLevel.Error;
        const logPath = this.logLevel !== vscode_debugadapter_1.Logger.LogLevel.Error ? path.join(os.tmpdir(), 'vscode-godlvdapdebug.txt') : undefined;
        vscode_debugadapter_1.logger.setup(this.logLevel, logPath);
        log('launchRequest');
        // In noDebug mode with the 'debug' launch mode, we don't launch Delve
        // but run the debugee directly.
        // For other launch modes we currently still defer to Delve, for
        // compatibility with the old debugAdapter.
        // See https://github.com/golang/vscode-go/issues/336
        if (args.noDebug && args.mode === 'debug') {
            try {
                this.launchNoDebug(args);
            }
            catch (e) {
                logError(`launchNoDebug failed: "${e}"`);
                // TODO: define error constants
                // https://github.com/golang/vscode-go/issues/305
                this.sendErrorResponse(response, 3000, `Failed to launch "${e}"`);
            }
            return;
        }
        if (!args.port) {
            args.port = this.DEFAULT_DELVE_PORT;
        }
        if (!args.host) {
            args.host = this.DEFAULT_DELVE_HOST;
        }
        this.dlvClient = new DelveClient(args);
        this.dlvClient.on('stdout', (str) => {
            log('dlv stdout:', str);
        });
        this.dlvClient.on('stderr', (str) => {
            log('dlv stderr:', str);
        });
        this.dlvClient.on('connected', () => {
            // Once the client is connected to Delve, forward it the launch
            // request to begin the actual debugging session.
            this.dlvClient.send(request);
        });
        this.dlvClient.on('close', (rc) => {
            if (rc !== 0) {
                // TODO: define error constants
                // https://github.com/golang/vscode-go/issues/305
                this.sendErrorResponse(response, 3000, 'Failed to continue: Check the debug console for details.');
            }
            log('Sending TerminatedEvent as delve is closed');
            this.sendEvent(new vscode_debugadapter_1.TerminatedEvent());
        });
        // Relay events and responses back to vscode. In the future we will
        // add middleware here to intercept specific kinds of responses/events
        // for special handling.
        this.dlvClient.on('event', (event) => {
            this.sendEvent(event);
        });
        this.dlvClient.on('response', (resp) => {
            this.sendResponse(resp);
        });
    }
    attachRequest(response, args, request) {
        this.dlvClient.send(request);
    }
    disconnectRequest(response, args, request) {
        log('DisconnectRequest');
        // How we handle DisconnectRequest depends on whether Delve was launched
        // at all.
        // * In noDebug node, the Go program was spawned directly without
        //   debugging: this.debugProcess will be non-null, and this.dlvClient
        //   will be null.
        // * Otherwise, Delve was spawned: this.debugProcess will be null, and
        //   this.dlvClient will be non-null.
        if (this.debugProcess !== null) {
            log(`killing debugee (pid: ${this.debugProcess.pid})...`);
            // Kill the debugee and notify the client when the killing is
            // completed, to ensure a clean shutdown sequence.
            processUtils_1.killProcessTree(this.debugProcess, log).then(() => {
                super.disconnectRequest(response, args);
                log('DisconnectResponse');
            });
        }
        else if (this.dlvClient !== null) {
            // Forward this DisconnectRequest to Delve.
            this.dlvClient.send(request);
        }
        else {
            logError(`both debug process and dlv client are null`);
            // TODO: define all error codes as constants
            // https://github.com/golang/vscode-go/issues/305
            this.sendErrorResponse(response, 3000, 'Failed to disconnect: Check the debug console for details.');
        }
    }
    terminateRequest(response, args, request) {
        this.dlvClient.send(request);
    }
    restartRequest(response, args, request) {
        this.dlvClient.send(request);
    }
    setBreakPointsRequest(response, args, request) {
        this.dlvClient.send(request);
    }
    setFunctionBreakPointsRequest(response, args, request) {
        this.dlvClient.send(request);
    }
    setExceptionBreakPointsRequest(response, args, request) {
        this.dlvClient.send(request);
    }
    configurationDoneRequest(response, args, request) {
        this.dlvClient.send(request);
    }
    continueRequest(response, args, request) {
        this.dlvClient.send(request);
    }
    nextRequest(response, args, request) {
        this.dlvClient.send(request);
    }
    stepInRequest(response, args, request) {
        this.dlvClient.send(request);
    }
    stepOutRequest(response, args, request) {
        this.dlvClient.send(request);
    }
    stepBackRequest(response, args, request) {
        this.dlvClient.send(request);
    }
    reverseContinueRequest(response, args, request) {
        this.dlvClient.send(request);
    }
    restartFrameRequest(response, args, request) {
        this.dlvClient.send(request);
    }
    gotoRequest(response, args, request) {
        this.dlvClient.send(request);
    }
    pauseRequest(response, args, request) {
        this.dlvClient.send(request);
    }
    sourceRequest(response, args, request) {
        this.dlvClient.send(request);
    }
    threadsRequest(response, request) {
        this.dlvClient.send(request);
    }
    terminateThreadsRequest(response, args, request) {
        this.dlvClient.send(request);
    }
    stackTraceRequest(response, args, request) {
        this.dlvClient.send(request);
    }
    scopesRequest(response, args, request) {
        this.dlvClient.send(request);
    }
    variablesRequest(response, args, request) {
        this.dlvClient.send(request);
    }
    setVariableRequest(response, args, request) {
        this.dlvClient.send(request);
    }
    setExpressionRequest(response, args, request) {
        this.dlvClient.send(request);
    }
    evaluateRequest(response, args, request) {
        this.dlvClient.send(request);
    }
    stepInTargetsRequest(response, args, request) {
        this.dlvClient.send(request);
    }
    gotoTargetsRequest(response, args, request) {
        this.dlvClient.send(request);
    }
    completionsRequest(response, args, request) {
        this.dlvClient.send(request);
    }
    exceptionInfoRequest(response, args, request) {
        this.dlvClient.send(request);
    }
    loadedSourcesRequest(response, args, request) {
        this.dlvClient.send(request);
    }
    dataBreakpointInfoRequest(response, args, request) {
        this.dlvClient.send(request);
    }
    setDataBreakpointsRequest(response, args, request) {
        this.dlvClient.send(request);
    }
    readMemoryRequest(response, args, request) {
        this.dlvClient.send(request);
    }
    disassembleRequest(response, args, request) {
        this.dlvClient.send(request);
    }
    cancelRequest(response, args, request) {
        this.dlvClient.send(request);
    }
    breakpointLocationsRequest(response, args, request) {
        this.dlvClient.send(request);
    }
    setInstructionBreakpointsRequest(response, args, request) {
        this.dlvClient.send(request);
    }
    // Launch the debugee process without starting a debugger.
    // This implements the `Run > Run Without Debugger` functionality in vscode.
    // Note: this method currently assumes launchArgs.mode === 'debug'.
    launchNoDebug(launchArgs) {
        if (launchArgs.mode !== 'debug') {
            throw new Error('launchNoDebug requires "debug" mode');
        }
        const { program, dirname, programIsDirectory } = parseProgramArgSync(launchArgs);
        const goRunArgs = ['run'];
        if (launchArgs.buildFlags) {
            goRunArgs.push(launchArgs.buildFlags);
        }
        if (programIsDirectory) {
            goRunArgs.push('.');
        }
        else {
            goRunArgs.push(program);
        }
        if (launchArgs.args) {
            goRunArgs.push(...launchArgs.args);
        }
        // Read env from disk and merge into env variables.
        const fileEnvs = [];
        if (typeof launchArgs.envFile === 'string') {
            fileEnvs.push(goPath_1.parseEnvFile(launchArgs.envFile));
        }
        if (Array.isArray(launchArgs.envFile)) {
            launchArgs.envFile.forEach((envFile) => {
                fileEnvs.push(goPath_1.parseEnvFile(envFile));
            });
        }
        const launchArgsEnv = launchArgs.env || {};
        const programEnv = Object.assign({}, process.env, ...fileEnvs, launchArgsEnv);
        log(`Current working directory: ${dirname}`);
        const goExe = goPath_1.getBinPathWithPreferredGopathGoroot('go', []);
        log(`Running: ${goExe} ${goRunArgs.join(' ')}`);
        this.debugProcess = child_process_1.spawn(goExe, goRunArgs, {
            cwd: dirname,
            env: programEnv
        });
        this.debugProcess.stderr.on('data', (str) => {
            this.sendEvent(new vscode_debugadapter_1.OutputEvent(str.toString(), 'stderr'));
        });
        this.debugProcess.stdout.on('data', (str) => {
            this.sendEvent(new vscode_debugadapter_1.OutputEvent(str.toString(), 'stdout'));
        });
        this.debugProcess.on('close', (rc) => {
            this.sendEvent(new vscode_debugadapter_1.TerminatedEvent());
        });
    }
}
exports.GoDlvDapDebugSession = GoDlvDapDebugSession;
// DelveClient provides a DAP client to talk to a DAP server in Delve.
//
// After creation, it emits the following events:
//
//    'connected':            client is connected to delve
//    'request (request)':    delve sent request
//    'response (response)':  delve sent response
//    'event (event)':        delve sent event
//    'stdout' (str):         delve emitted str to stdout
//    'stderr' (str):         delve emitted str to stderr
//    'close' (rc):           delve exited with return code rc
class DelveClient extends dapClient_1.DAPClient {
    constructor(launchArgs) {
        super();
        this.serverStarted = false;
        const launchArgsEnv = launchArgs.env || {};
        const env = Object.assign({}, process.env, launchArgsEnv);
        // Let users override direct path to delve by setting it in the env
        // map in launch.json; if unspecified, fall back to dlvToolPath.
        let dlvPath = launchArgsEnv['dlvPath'];
        if (!dlvPath) {
            dlvPath = launchArgs.dlvToolPath;
        }
        if (!fs.existsSync(dlvPath)) {
            log(`Couldn't find dlv at the Go tools path, ${process.env['GOPATH']}${env['GOPATH'] ? ', ' + env['GOPATH'] : ''} or ${goPath_1.envPath}`);
            throw new Error(`Cannot find Delve debugger. Install from https://github.com/go-delve/delve/ & ensure it is in your Go tools path, "GOPATH/bin" or "PATH".`);
        }
        const dlvArgs = new Array();
        dlvArgs.push('dap');
        dlvArgs.push(`--listen=${launchArgs.host}:${launchArgs.port}`);
        if (launchArgs.showLog) {
            dlvArgs.push('--log=' + launchArgs.showLog.toString());
        }
        if (launchArgs.logOutput) {
            dlvArgs.push('--log-output=' + launchArgs.logOutput);
        }
        log(`Running: ${dlvPath} ${dlvArgs.join(' ')}`);
        this.debugProcess = child_process_1.spawn(dlvPath, dlvArgs, {
            cwd: parseProgramArgSync(launchArgs).dirname,
            env
        });
        this.debugProcess.stderr.on('data', (chunk) => {
            const str = chunk.toString();
            this.emit('stderr', str);
        });
        this.debugProcess.stdout.on('data', (chunk) => {
            const str = chunk.toString();
            this.emit('stdout', str);
            if (!this.serverStarted) {
                this.serverStarted = true;
                this.connectSocketToServer(launchArgs.port, launchArgs.host);
            }
        });
        this.debugProcess.on('close', (rc) => {
            if (rc) {
                logError(`Process exiting with code: ${rc} signal: ${this.debugProcess.killed}`);
            }
            else {
                log(`Process exiting normally ${this.debugProcess.killed}`);
            }
            this.emit('close', rc);
        });
        this.debugProcess.on('error', (err) => {
            throw err;
        });
    }
    // Connect this client to the server. The server is expected to be listening
    // on host:port.
    connectSocketToServer(port, host) {
        // Add a slight delay to ensure that Delve started up the server.
        setTimeout(() => {
            const socket = net.createConnection(port, host, () => {
                this.connect(socket, socket);
                this.emit('connected');
            });
            socket.on('error', (err) => {
                throw err;
            });
        }, 200);
    }
}
// Helper function to parse a program from LaunchRequestArguments. Returns:
// {
//    program: the program arg,
//    dirname: the directory containing the program (or 'program' itself if
//             it's already a directory),
//    programIsDirectory: is the program a directory?
// }
//
// The program argument is taken as-is from launchArgs. If the program path
// is relative, dirname will also be relative. If the program path is absolute,
// dirname will also be absolute.
//
// Throws an exception in case args.program is not a valid file or directory.
// This function can block because it calls a blocking fs function.
function parseProgramArgSync(launchArgs) {
    const program = launchArgs.program;
    if (!program) {
        throw new Error('The program attribute is missing in the debug configuration in launch.json');
    }
    let programIsDirectory = false;
    try {
        programIsDirectory = fs.lstatSync(program).isDirectory();
    }
    catch (e) {
        throw new Error('The program attribute must point to valid directory, .go file or executable.');
    }
    if (!programIsDirectory && path.extname(program) !== '.go') {
        throw new Error('The program attribute must be a directory or .go file in debug mode');
    }
    const dirname = programIsDirectory ? program : path.dirname(program);
    return { program, dirname, programIsDirectory };
}


/***/ }),

/***/ 606:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.DAPClient = void 0;
/*---------------------------------------------------------
 * Copyright 2020 The Go Authors. All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------*/
const events_1 = __webpack_require__(31);
// DapClient implements a simple client for the DAP protocol.
// It's initialized with a pair of streams that the caller creats and enables
// sending and receiving DAP messages over these streams.
// After calling connect():
//
//  - For sending messages call send().
//  - For receiving messages, subscibe to events this class emits.
//      - 'event', 'respones', 'request' - each carrying an appropriate
//        DebugProtocol type as an argument.
class DAPClient extends events_1.EventEmitter {
    constructor() {
        super();
        this.rawData = Buffer.alloc(0);
        this.contentLength = -1;
    }
    send(req) {
        const json = JSON.stringify(req);
        this.outputStream.write(`Content-Length: ${Buffer.byteLength(json, 'utf8')}\r\n\r\n${json}`, 'utf8');
    }
    // Connect this client to a server, which is represented by read and write
    // streams. Before this method is called, send() won't work and no messages
    // from the server will be delivered.
    connect(readable, writable) {
        this.outputStream = writable;
        readable.on('data', (data) => {
            this.handleData(data);
        });
    }
    // Implements parsing of the DAP protocol. We cannot use ProtocolClient
    // from the vscode-debugadapter package, because it's not exported and
    // is not meant for external usage.
    // See https://github.com/microsoft/vscode-debugadapter-node/issues/232
    handleData(data) {
        this.rawData = Buffer.concat([this.rawData, data]);
        while (true) {
            if (this.contentLength >= 0) {
                if (this.rawData.length >= this.contentLength) {
                    const message = this.rawData.toString('utf8', 0, this.contentLength);
                    this.rawData = this.rawData.slice(this.contentLength);
                    this.contentLength = -1;
                    if (message.length > 0) {
                        this.dispatch(message);
                    }
                    continue; // there may be more complete messages to process
                }
            }
            else {
                const idx = this.rawData.indexOf(DAPClient.TWO_CRLF);
                if (idx !== -1) {
                    const header = this.rawData.toString('utf8', 0, idx);
                    const lines = header.split('\r\n');
                    for (const line of lines) {
                        const pair = line.split(/: +/);
                        if (pair[0] === 'Content-Length') {
                            this.contentLength = +pair[1];
                        }
                    }
                    this.rawData = this.rawData.slice(idx + DAPClient.TWO_CRLF.length);
                    continue;
                }
            }
            break;
        }
    }
    dispatch(body) {
        const rawData = JSON.parse(body);
        if (rawData.type === 'event') {
            const event = rawData;
            this.emit('event', event);
        }
        else if (rawData.type === 'response') {
            const response = rawData;
            this.emit('response', response);
        }
        else if (rawData.type === 'request') {
            const request = rawData;
            this.emit('request', request);
        }
        else {
            throw new Error(`unknown message ${JSON.stringify(rawData)}`);
        }
    }
}
exports.DAPClient = DAPClient;
DAPClient.TWO_CRLF = '\r\n\r\n';


/***/ }),

/***/ 65:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var childProcess = __webpack_require__(5);
const { existsSync } = __webpack_require__(8);
var spawn = childProcess.spawn;
var exec = childProcess.exec;

module.exports = function (pid, signal, callback) {
    if (typeof signal === 'function' && callback === undefined) {
        callback = signal;
        signal = undefined;
    }

    pid = parseInt(pid);
    if (Number.isNaN(pid)) {
        if (callback) {
            return callback(new Error("pid must be a number"));
        } else {
            throw new Error("pid must be a number");
        }
    }

    var tree = {};
    var pidsToProcess = {};
    tree[pid] = [];
    pidsToProcess[pid] = 1;

    switch (process.platform) {
    case 'win32':
        exec('taskkill /pid ' + pid + ' /T /F', callback);
        break;
    case 'darwin':
        buildProcessTree(pid, tree, pidsToProcess, function (parentPid) {
            return spawn(pathToPgrep(), ['-P', parentPid]);
        }, function () {
            killAll(tree, signal, callback);
        });
        break;
    // case 'sunos':
    //     buildProcessTreeSunOS(pid, tree, pidsToProcess, function () {
    //         killAll(tree, signal, callback);
    //     });
    //     break;
    default: // Linux
        buildProcessTree(pid, tree, pidsToProcess, function (parentPid) {
          return spawn('ps', ['-o', 'pid', '--no-headers', '--ppid', parentPid]);
        }, function () {
            killAll(tree, signal, callback);
        });
        break;
    }
};

function killAll (tree, signal, callback) {
    var killed = {};
    try {
        Object.keys(tree).forEach(function (pid) {
            tree[pid].forEach(function (pidpid) {
                if (!killed[pidpid]) {
                    killPid(pidpid, signal);
                    killed[pidpid] = 1;
                }
            });
            if (!killed[pid]) {
                killPid(pid, signal);
                killed[pid] = 1;
            }
        });
    } catch (err) {
        if (callback) {
            return callback(err);
        } else {
            throw err;
        }
    }
    if (callback) {
        return callback();
    }
}

function killPid(pid, signal) {
    try {
        process.kill(parseInt(pid, 10), signal);
    }
    catch (err) {
        if (err.code !== 'ESRCH') throw err;
    }
}

function buildProcessTree (parentPid, tree, pidsToProcess, spawnChildProcessesList, cb) {
    var ps = spawnChildProcessesList(parentPid);
    var allData = '';
    ps.stdout.on('data', function (data) {
        var data = data.toString('ascii');
        allData += data;
    });

    var onClose = function (code) {
        delete pidsToProcess[parentPid];

        if (code != 0) {
            // no more parent processes
            if (Object.keys(pidsToProcess).length == 0) {
                cb();
            }
            return;
        }

        allData.match(/\d+/g).forEach(function (pid) {
          pid = parseInt(pid, 10);
          tree[parentPid].push(pid);
          tree[pid] = [];
          pidsToProcess[pid] = 1;
          buildProcessTree(pid, tree, pidsToProcess, spawnChildProcessesList, cb);
        });
    };

    ps.on('close', onClose);
}

var pgrep = '';
function pathToPgrep () {
    if (pgrep) {
        return pgrep;
    }
    // Use the default pgrep, available since os x mountain lion.
    // proctools' pgrep does not implement `-P` correctly and returns
    // unrelated processes.
    // https://github.com/golang/vscode-go/issues/90#issuecomment-634430428
    try {
        pgrep = existsSync('/usr/bin/pgrep') ? '/usr/bin/pgrep' : 'pgrep';
    } catch (e) {
        pgrep = 'pgrep';
    }
    return pgrep;
}

/***/ }),

/***/ 66:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __webpack_require__(8);
const path = __webpack_require__(2);
const mkdirp = __webpack_require__(123);
const debugSession_1 = __webpack_require__(43);
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["Verbose"] = 0] = "Verbose";
    LogLevel[LogLevel["Log"] = 1] = "Log";
    LogLevel[LogLevel["Warn"] = 2] = "Warn";
    LogLevel[LogLevel["Error"] = 3] = "Error";
    LogLevel[LogLevel["Stop"] = 4] = "Stop";
})(LogLevel = exports.LogLevel || (exports.LogLevel = {}));
class Logger {
    constructor() {
        this._pendingLogQ = [];
    }
    log(msg, level = LogLevel.Log) {
        msg = msg + '\n';
        this._write(msg, level);
    }
    verbose(msg) {
        this.log(msg, LogLevel.Verbose);
    }
    warn(msg) {
        this.log(msg, LogLevel.Warn);
    }
    error(msg) {
        this.log(msg, LogLevel.Error);
    }
    dispose() {
        if (this._currentLogger) {
            const disposeP = this._currentLogger.dispose();
            this._currentLogger = null;
            return disposeP;
        }
        else {
            return Promise.resolve();
        }
    }
    /**
     * `log` adds a newline, `write` doesn't
     */
    _write(msg, level = LogLevel.Log) {
        // [null, undefined] => string
        msg = msg + '';
        if (this._pendingLogQ) {
            this._pendingLogQ.push({ msg, level });
        }
        else if (this._currentLogger) {
            this._currentLogger.log(msg, level);
        }
    }
    /**
     * Set the logger's minimum level to log in the console, and whether to log to the file. Log messages are queued before this is
     * called the first time, because minLogLevel defaults to Warn.
     */
    setup(consoleMinLogLevel, _logFilePath, prependTimestamp = true) {
        const logFilePath = typeof _logFilePath === 'string' ?
            _logFilePath :
            (_logFilePath && this._logFilePathFromInit);
        if (this._currentLogger) {
            const options = {
                consoleMinLogLevel,
                logFilePath,
                prependTimestamp
            };
            this._currentLogger.setup(options).then(() => {
                // Now that we have a minimum logLevel, we can clear out the queue of pending messages
                if (this._pendingLogQ) {
                    const logQ = this._pendingLogQ;
                    this._pendingLogQ = null;
                    logQ.forEach(item => this._write(item.msg, item.level));
                }
            });
        }
    }
    init(logCallback, logFilePath, logToConsole) {
        // Re-init, create new global Logger
        this._pendingLogQ = this._pendingLogQ || [];
        this._currentLogger = new InternalLogger(logCallback, logToConsole);
        this._logFilePathFromInit = logFilePath;
    }
}
exports.Logger = Logger;
exports.logger = new Logger();
/**
 * Manages logging, whether to console.log, file, or VS Code console.
 * Encapsulates the state specific to each logging session
 */
class InternalLogger {
    constructor(logCallback, isServer) {
        /** Dispose and allow exit to continue normally */
        this.beforeExitCallback = () => this.dispose();
        this._logCallback = logCallback;
        this._logToConsole = isServer;
        this._minLogLevel = LogLevel.Warn;
        this.disposeCallback = (signal, code) => {
            this.dispose();
            // Exit with 128 + value of the signal code.
            // https://nodejs.org/api/process.html#process_exit_codes
            code = code || 2; // SIGINT
            code += 128;
            process.exit(code);
        };
    }
    setup(options) {
        return __awaiter(this, void 0, void 0, function* () {
            this._minLogLevel = options.consoleMinLogLevel;
            this._prependTimestamp = options.prependTimestamp;
            // Open a log file in the specified location. Overwritten on each run.
            if (options.logFilePath) {
                if (!path.isAbsolute(options.logFilePath)) {
                    this.log(`logFilePath must be an absolute path: ${options.logFilePath}`, LogLevel.Error);
                }
                else {
                    const handleError = err => this.sendLog(`Error creating log file at path: ${options.logFilePath}. Error: ${err.toString()}\n`, LogLevel.Error);
                    try {
                        yield mkdirpPromise(path.dirname(options.logFilePath));
                        this.log(`Verbose logs are written to:\n`, LogLevel.Warn);
                        this.log(options.logFilePath + '\n', LogLevel.Warn);
                        this._logFileStream = fs.createWriteStream(options.logFilePath);
                        this.logDateTime();
                        this.setupShutdownListeners();
                        this._logFileStream.on('error', err => {
                            handleError(err);
                        });
                    }
                    catch (err) {
                        handleError(err);
                    }
                }
            }
        });
    }
    logDateTime() {
        let d = new Date();
        let dateString = d.getUTCFullYear() + '-' + `${d.getUTCMonth() + 1}` + '-' + d.getUTCDate();
        const timeAndDateStamp = dateString + ', ' + getFormattedTimeString();
        this.log(timeAndDateStamp + '\n', LogLevel.Verbose, false);
    }
    setupShutdownListeners() {
        process.addListener('beforeExit', this.beforeExitCallback);
        process.addListener('SIGTERM', this.disposeCallback);
        process.addListener('SIGINT', this.disposeCallback);
    }
    removeShutdownListeners() {
        process.removeListener('beforeExit', this.beforeExitCallback);
        process.removeListener('SIGTERM', this.disposeCallback);
        process.removeListener('SIGINT', this.disposeCallback);
    }
    dispose() {
        return new Promise(resolve => {
            this.removeShutdownListeners();
            if (this._logFileStream) {
                this._logFileStream.end(resolve);
                this._logFileStream = null;
            }
            else {
                resolve();
            }
        });
    }
    log(msg, level, prependTimestamp = true) {
        if (this._minLogLevel === LogLevel.Stop) {
            return;
        }
        if (level >= this._minLogLevel) {
            this.sendLog(msg, level);
        }
        if (this._logToConsole) {
            const logFn = level === LogLevel.Error ? console.error :
                level === LogLevel.Warn ? console.warn :
                    null;
            if (logFn) {
                logFn(trimLastNewline(msg));
            }
        }
        // If an error, prepend with '[Error]'
        if (level === LogLevel.Error) {
            msg = `[${LogLevel[level]}] ${msg}`;
        }
        if (this._prependTimestamp && prependTimestamp) {
            msg = '[' + getFormattedTimeString() + '] ' + msg;
        }
        if (this._logFileStream) {
            this._logFileStream.write(msg);
        }
    }
    sendLog(msg, level) {
        // Truncate long messages, they can hang VS Code
        if (msg.length > 1500) {
            const endsInNewline = !!msg.match(/(\n|\r\n)$/);
            msg = msg.substr(0, 1500) + '[...]';
            if (endsInNewline) {
                msg = msg + '\n';
            }
        }
        if (this._logCallback) {
            const event = new LogOutputEvent(msg, level);
            this._logCallback(event);
        }
    }
}
function mkdirpPromise(folder) {
    return new Promise((resolve, reject) => {
        mkdirp(folder, err => {
            if (err) {
                reject(err);
            }
            else {
                resolve();
            }
        });
    });
}
class LogOutputEvent extends debugSession_1.OutputEvent {
    constructor(msg, level) {
        const category = level === LogLevel.Error ? 'stderr' :
            level === LogLevel.Warn ? 'console' :
                'stdout';
        super(msg, category);
    }
}
exports.LogOutputEvent = LogOutputEvent;
function trimLastNewline(str) {
    return str.replace(/(\n|\r\n)$/, '');
}
exports.trimLastNewline = trimLastNewline;
function getFormattedTimeString() {
    let d = new Date();
    let hourString = _padZeroes(2, String(d.getUTCHours()));
    let minuteString = _padZeroes(2, String(d.getUTCMinutes()));
    let secondString = _padZeroes(2, String(d.getUTCSeconds()));
    let millisecondString = _padZeroes(3, String(d.getUTCMilliseconds()));
    return hourString + ':' + minuteString + ':' + secondString + '.' + millisecondString + ' UTC';
}
function _padZeroes(minDesiredLength, numberToPad) {
    if (numberToPad.length >= minDesiredLength) {
        return numberToPad;
    }
    else {
        return String('0'.repeat(minDesiredLength) + numberToPad).slice(-minDesiredLength);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2xvZ2dlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7OzREQUU0RDs7Ozs7Ozs7OztBQUU1RCx5QkFBeUI7QUFDekIsNkJBQTZCO0FBQzdCLGlDQUFpQztBQUNqQyxpREFBMkM7QUFFM0MsSUFBWSxRQU1YO0FBTkQsV0FBWSxRQUFRO0lBQ25CLDZDQUFXLENBQUE7SUFDWCxxQ0FBTyxDQUFBO0lBQ1AsdUNBQVEsQ0FBQTtJQUNSLHlDQUFTLENBQUE7SUFDVCx1Q0FBUSxDQUFBO0FBQ1QsQ0FBQyxFQU5XLFFBQVEsR0FBUixnQkFBUSxLQUFSLGdCQUFRLFFBTW5CO0FBZ0JELE1BQWEsTUFBTTtJQUFuQjtRQUlTLGlCQUFZLEdBQWUsRUFBRSxDQUFDO0lBMkV2QyxDQUFDO0lBekVBLEdBQUcsQ0FBQyxHQUFXLEVBQUUsS0FBSyxHQUFHLFFBQVEsQ0FBQyxHQUFHO1FBQ3BDLEdBQUcsR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ3pCLENBQUM7SUFFRCxPQUFPLENBQUMsR0FBVztRQUNsQixJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDakMsQ0FBQztJQUVELElBQUksQ0FBQyxHQUFXO1FBQ2YsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzlCLENBQUM7SUFFRCxLQUFLLENBQUMsR0FBVztRQUNoQixJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDL0IsQ0FBQztJQUVELE9BQU87UUFDTixJQUFJLElBQUksQ0FBQyxjQUFjLEVBQUU7WUFDeEIsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUMvQyxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQztZQUMzQixPQUFPLFFBQVEsQ0FBQztTQUNoQjthQUFNO1lBQ04sT0FBTyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7U0FDekI7SUFDRixDQUFDO0lBRUQ7O09BRUc7SUFDSyxNQUFNLENBQUMsR0FBVyxFQUFFLEtBQUssR0FBRyxRQUFRLENBQUMsR0FBRztRQUMvQyw4QkFBOEI7UUFDOUIsR0FBRyxHQUFHLEdBQUcsR0FBRyxFQUFFLENBQUM7UUFDZixJQUFJLElBQUksQ0FBQyxZQUFZLEVBQUU7WUFDdEIsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztTQUN2QzthQUFNLElBQUksSUFBSSxDQUFDLGNBQWMsRUFBRTtZQUMvQixJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDcEM7SUFDRixDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsS0FBSyxDQUFDLGtCQUE0QixFQUFFLFlBQTZCLEVBQUUsbUJBQTRCLElBQUk7UUFDbEcsTUFBTSxXQUFXLEdBQUcsT0FBTyxZQUFZLEtBQUssUUFBUSxDQUFDLENBQUM7WUFDckQsWUFBWSxDQUFDLENBQUM7WUFDZCxDQUFDLFlBQVksSUFBSSxJQUFJLENBQUMsb0JBQW9CLENBQUMsQ0FBQztRQUU3QyxJQUFJLElBQUksQ0FBQyxjQUFjLEVBQUU7WUFDeEIsTUFBTSxPQUFPLEdBQUc7Z0JBQ2Ysa0JBQWtCO2dCQUNsQixXQUFXO2dCQUNYLGdCQUFnQjthQUNoQixDQUFDO1lBQ0YsSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRTtnQkFDNUMsc0ZBQXNGO2dCQUN0RixJQUFJLElBQUksQ0FBQyxZQUFZLEVBQUU7b0JBQ3RCLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUM7b0JBQy9CLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO29CQUN6QixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2lCQUN4RDtZQUNGLENBQUMsQ0FBQyxDQUFDO1NBRUg7SUFDRixDQUFDO0lBRUQsSUFBSSxDQUFDLFdBQXlCLEVBQUUsV0FBb0IsRUFBRSxZQUFzQjtRQUMzRSxvQ0FBb0M7UUFDcEMsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsWUFBWSxJQUFJLEVBQUUsQ0FBQztRQUM1QyxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksY0FBYyxDQUFDLFdBQVcsRUFBRSxZQUFZLENBQUMsQ0FBQztRQUNwRSxJQUFJLENBQUMsb0JBQW9CLEdBQUcsV0FBVyxDQUFDO0lBQ3pDLENBQUM7Q0FDRDtBQS9FRCx3QkErRUM7QUFFWSxRQUFBLE1BQU0sR0FBRyxJQUFJLE1BQU0sRUFBRSxDQUFDO0FBUW5DOzs7R0FHRztBQUNILE1BQU0sY0FBYztJQW1CbkIsWUFBWSxXQUF5QixFQUFFLFFBQWtCO1FBVHpELGtEQUFrRDtRQUMxQyx1QkFBa0IsR0FBRyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7UUFTakQsSUFBSSxDQUFDLFlBQVksR0FBRyxXQUFXLENBQUM7UUFDaEMsSUFBSSxDQUFDLGFBQWEsR0FBRyxRQUFRLENBQUM7UUFFOUIsSUFBSSxDQUFDLFlBQVksR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDO1FBRWxDLElBQUksQ0FBQyxlQUFlLEdBQUcsQ0FBQyxNQUFjLEVBQUUsSUFBWSxFQUFFLEVBQUU7WUFDdkQsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBRWYsNENBQTRDO1lBQzVDLHlEQUF5RDtZQUN6RCxJQUFJLEdBQUcsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLFNBQVM7WUFDM0IsSUFBSSxJQUFJLEdBQUcsQ0FBQztZQUVaLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDcEIsQ0FBQyxDQUFDO0lBQ0gsQ0FBQztJQUVZLEtBQUssQ0FBQyxPQUErQjs7WUFDakQsSUFBSSxDQUFDLFlBQVksR0FBRyxPQUFPLENBQUMsa0JBQWtCLENBQUM7WUFDL0MsSUFBSSxDQUFDLGlCQUFpQixHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQztZQUVsRCxzRUFBc0U7WUFDdEUsSUFBSSxPQUFPLENBQUMsV0FBVyxFQUFFO2dCQUN4QixJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLEVBQUU7b0JBQzFDLElBQUksQ0FBQyxHQUFHLENBQUMseUNBQXlDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsRUFBRSxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7aUJBQ3pGO3FCQUFNO29CQUNOLE1BQU0sV0FBVyxHQUFHLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxvQ0FBb0MsT0FBTyxDQUFDLFdBQVcsWUFBWSxHQUFHLENBQUMsUUFBUSxFQUFFLElBQUksRUFBRSxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBRS9JLElBQUk7d0JBQ0gsTUFBTSxhQUFhLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQzt3QkFDdkQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxnQ0FBZ0MsRUFBRSxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7d0JBQzFELElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLFdBQVcsR0FBRyxJQUFJLEVBQUUsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO3dCQUVwRCxJQUFJLENBQUMsY0FBYyxHQUFHLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7d0JBQ2hFLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQzt3QkFDbkIsSUFBSSxDQUFDLHNCQUFzQixFQUFFLENBQUM7d0JBQzlCLElBQUksQ0FBQyxjQUFjLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsRUFBRTs0QkFDckMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO3dCQUNsQixDQUFDLENBQUMsQ0FBQztxQkFDSDtvQkFBQyxPQUFPLEdBQUcsRUFBRTt3QkFDYixXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7cUJBQ2pCO2lCQUNEO2FBQ0Q7UUFDRixDQUFDO0tBQUE7SUFFTyxXQUFXO1FBQ2xCLElBQUksQ0FBQyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7UUFDbkIsSUFBSSxVQUFVLEdBQUcsQ0FBQyxDQUFDLGNBQWMsRUFBRSxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxXQUFXLEVBQUUsR0FBRyxDQUFDLEVBQUUsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQzVGLE1BQU0sZ0JBQWdCLEdBQUcsVUFBVSxHQUFHLElBQUksR0FBRyxzQkFBc0IsRUFBRSxDQUFDO1FBQ3RFLElBQUksQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxFQUFFLFFBQVEsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDNUQsQ0FBQztJQUVPLHNCQUFzQjtRQUM3QixPQUFPLENBQUMsV0FBVyxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQztRQUMzRCxPQUFPLENBQUMsV0FBVyxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDckQsT0FBTyxDQUFDLFdBQVcsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO0lBQ3JELENBQUM7SUFFTyx1QkFBdUI7UUFDOUIsT0FBTyxDQUFDLGNBQWMsQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFDOUQsT0FBTyxDQUFDLGNBQWMsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQ3hELE9BQU8sQ0FBQyxjQUFjLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztJQUN4RCxDQUFDO0lBRU0sT0FBTztRQUNiLE9BQU8sSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUU7WUFDNUIsSUFBSSxDQUFDLHVCQUF1QixFQUFFLENBQUM7WUFDL0IsSUFBSSxJQUFJLENBQUMsY0FBYyxFQUFFO2dCQUN4QixJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDakMsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUM7YUFDM0I7aUJBQU07Z0JBQ04sT0FBTyxFQUFFLENBQUM7YUFDVjtRQUNGLENBQUMsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQUVNLEdBQUcsQ0FBQyxHQUFXLEVBQUUsS0FBZSxFQUFFLGdCQUFnQixHQUFHLElBQUk7UUFDL0QsSUFBSSxJQUFJLENBQUMsWUFBWSxLQUFLLFFBQVEsQ0FBQyxJQUFJLEVBQUU7WUFDeEMsT0FBTztTQUNQO1FBRUQsSUFBSSxLQUFLLElBQUksSUFBSSxDQUFDLFlBQVksRUFBRTtZQUMvQixJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztTQUN6QjtRQUVELElBQUksSUFBSSxDQUFDLGFBQWEsRUFBRTtZQUN2QixNQUFNLEtBQUssR0FDVixLQUFLLEtBQUssUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUMxQyxLQUFLLEtBQUssUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUN4QyxJQUFJLENBQUM7WUFFTixJQUFJLEtBQUssRUFBRTtnQkFDVixLQUFLLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7YUFDNUI7U0FDRDtRQUVELHNDQUFzQztRQUN0QyxJQUFJLEtBQUssS0FBSyxRQUFRLENBQUMsS0FBSyxFQUFFO1lBQzdCLEdBQUcsR0FBRyxJQUFJLFFBQVEsQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztTQUNwQztRQUVELElBQUksSUFBSSxDQUFDLGlCQUFpQixJQUFJLGdCQUFnQixFQUFFO1lBQy9DLEdBQUcsR0FBRyxHQUFHLEdBQUcsc0JBQXNCLEVBQUUsR0FBRyxJQUFJLEdBQUcsR0FBRyxDQUFDO1NBQ2xEO1FBRUQsSUFBSSxJQUFJLENBQUMsY0FBYyxFQUFFO1lBQ3hCLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQy9CO0lBQ0YsQ0FBQztJQUVPLE9BQU8sQ0FBQyxHQUFXLEVBQUUsS0FBZTtRQUMzQyxnREFBZ0Q7UUFDaEQsSUFBSSxHQUFHLENBQUMsTUFBTSxHQUFHLElBQUksRUFBRTtZQUN0QixNQUFNLGFBQWEsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUNoRCxHQUFHLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsT0FBTyxDQUFDO1lBQ3BDLElBQUksYUFBYSxFQUFFO2dCQUNsQixHQUFHLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQzthQUNqQjtTQUNEO1FBRUQsSUFBSSxJQUFJLENBQUMsWUFBWSxFQUFFO1lBQ3RCLE1BQU0sS0FBSyxHQUFHLElBQUksY0FBYyxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUM3QyxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ3pCO0lBQ0YsQ0FBQztDQUNEO0FBRUQsU0FBUyxhQUFhLENBQUMsTUFBYztJQUNwQyxPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO1FBQ3RDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLEVBQUU7WUFDcEIsSUFBSSxHQUFHLEVBQUU7Z0JBQ1IsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ1o7aUJBQU07Z0JBQ04sT0FBTyxFQUFFLENBQUM7YUFDVjtRQUNGLENBQUMsQ0FBQyxDQUFDO0lBQ0osQ0FBQyxDQUFDLENBQUM7QUFDSixDQUFDO0FBRUQsTUFBYSxjQUFlLFNBQVEsMEJBQVc7SUFDOUMsWUFBWSxHQUFXLEVBQUUsS0FBZTtRQUN2QyxNQUFNLFFBQVEsR0FDYixLQUFLLEtBQUssUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDckMsS0FBSyxLQUFLLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUNyQyxRQUFRLENBQUM7UUFDVixLQUFLLENBQUMsR0FBRyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ3RCLENBQUM7Q0FDRDtBQVJELHdDQVFDO0FBRUQsU0FBZ0IsZUFBZSxDQUFDLEdBQVc7SUFDMUMsT0FBTyxHQUFHLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRSxFQUFFLENBQUMsQ0FBQztBQUN0QyxDQUFDO0FBRkQsMENBRUM7QUFFRCxTQUFTLHNCQUFzQjtJQUM5QixJQUFJLENBQUMsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDO0lBQ25CLElBQUksVUFBVSxHQUFHLFVBQVUsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDeEQsSUFBSSxZQUFZLEdBQUcsVUFBVSxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUM1RCxJQUFJLFlBQVksR0FBRyxVQUFVLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQzVELElBQUksaUJBQWlCLEdBQUcsVUFBVSxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLGtCQUFrQixFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ3RFLE9BQU8sVUFBVSxHQUFHLEdBQUcsR0FBRyxZQUFZLEdBQUcsR0FBRyxHQUFHLFlBQVksR0FBRyxHQUFHLEdBQUcsaUJBQWlCLEdBQUcsTUFBTSxDQUFDO0FBQ2hHLENBQUM7QUFFRCxTQUFTLFVBQVUsQ0FBQyxnQkFBd0IsRUFBRSxXQUFtQjtJQUNoRSxJQUFJLFdBQVcsQ0FBQyxNQUFNLElBQUksZ0JBQWdCLEVBQUU7UUFDM0MsT0FBTyxXQUFXLENBQUM7S0FDbkI7U0FBTTtRQUNOLE9BQU8sTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxXQUFXLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0tBQ25GO0FBQ0YsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBDb3B5cmlnaHQgKEMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG5pbXBvcnQgKiBhcyBmcyBmcm9tICdmcyc7XG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0ICogYXMgbWtkaXJwIGZyb20gJ21rZGlycCc7XG5pbXBvcnQge091dHB1dEV2ZW50fSBmcm9tICcuL2RlYnVnU2Vzc2lvbic7XG5cbmV4cG9ydCBlbnVtIExvZ0xldmVsIHtcblx0VmVyYm9zZSA9IDAsXG5cdExvZyA9IDEsXG5cdFdhcm4gPSAyLFxuXHRFcnJvciA9IDMsXG5cdFN0b3AgPSA0XG59XG5cbmV4cG9ydCB0eXBlIElMb2dDYWxsYmFjayA9IChvdXRwdXRFdmVudDogT3V0cHV0RXZlbnQpID0+IHZvaWQ7XG5cbmludGVyZmFjZSBJTG9nSXRlbSB7XG5cdG1zZzogc3RyaW5nO1xuXHRsZXZlbDogTG9nTGV2ZWw7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSUxvZ2dlciB7XG5cdGxvZyhtc2c6IHN0cmluZywgbGV2ZWw/OiBMb2dMZXZlbCk6IHZvaWQ7XG5cdHZlcmJvc2UobXNnOiBzdHJpbmcpOiB2b2lkO1xuXHR3YXJuKG1zZzogc3RyaW5nKTogdm9pZDtcblx0ZXJyb3IobXNnOiBzdHJpbmcpOiB2b2lkO1xufVxuXG5leHBvcnQgY2xhc3MgTG9nZ2VyIHtcblx0cHJpdmF0ZSBfbG9nRmlsZVBhdGhGcm9tSW5pdDogc3RyaW5nO1xuXG5cdHByaXZhdGUgX2N1cnJlbnRMb2dnZXI6IEludGVybmFsTG9nZ2VyO1xuXHRwcml2YXRlIF9wZW5kaW5nTG9nUTogSUxvZ0l0ZW1bXSA9IFtdO1xuXG5cdGxvZyhtc2c6IHN0cmluZywgbGV2ZWwgPSBMb2dMZXZlbC5Mb2cpOiB2b2lkIHtcblx0XHRtc2cgPSBtc2cgKyAnXFxuJztcblx0XHR0aGlzLl93cml0ZShtc2csIGxldmVsKTtcblx0fVxuXG5cdHZlcmJvc2UobXNnOiBzdHJpbmcpOiB2b2lkIHtcblx0XHR0aGlzLmxvZyhtc2csIExvZ0xldmVsLlZlcmJvc2UpO1xuXHR9XG5cblx0d2Fybihtc2c6IHN0cmluZyk6IHZvaWQge1xuXHRcdHRoaXMubG9nKG1zZywgTG9nTGV2ZWwuV2Fybik7XG5cdH1cblxuXHRlcnJvcihtc2c6IHN0cmluZyk6IHZvaWQge1xuXHRcdHRoaXMubG9nKG1zZywgTG9nTGV2ZWwuRXJyb3IpO1xuXHR9XG5cblx0ZGlzcG9zZSgpOiBQcm9taXNlPHZvaWQ+IHtcblx0XHRpZiAodGhpcy5fY3VycmVudExvZ2dlcikge1xuXHRcdFx0Y29uc3QgZGlzcG9zZVAgPSB0aGlzLl9jdXJyZW50TG9nZ2VyLmRpc3Bvc2UoKTtcblx0XHRcdHRoaXMuX2N1cnJlbnRMb2dnZXIgPSBudWxsO1xuXHRcdFx0cmV0dXJuIGRpc3Bvc2VQO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIGBsb2dgIGFkZHMgYSBuZXdsaW5lLCBgd3JpdGVgIGRvZXNuJ3Rcblx0ICovXG5cdHByaXZhdGUgX3dyaXRlKG1zZzogc3RyaW5nLCBsZXZlbCA9IExvZ0xldmVsLkxvZyk6IHZvaWQge1xuXHRcdC8vIFtudWxsLCB1bmRlZmluZWRdID0+IHN0cmluZ1xuXHRcdG1zZyA9IG1zZyArICcnO1xuXHRcdGlmICh0aGlzLl9wZW5kaW5nTG9nUSkge1xuXHRcdFx0dGhpcy5fcGVuZGluZ0xvZ1EucHVzaCh7IG1zZywgbGV2ZWwgfSk7XG5cdFx0fSBlbHNlIGlmICh0aGlzLl9jdXJyZW50TG9nZ2VyKSB7XG5cdFx0XHR0aGlzLl9jdXJyZW50TG9nZ2VyLmxvZyhtc2csIGxldmVsKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogU2V0IHRoZSBsb2dnZXIncyBtaW5pbXVtIGxldmVsIHRvIGxvZyBpbiB0aGUgY29uc29sZSwgYW5kIHdoZXRoZXIgdG8gbG9nIHRvIHRoZSBmaWxlLiBMb2cgbWVzc2FnZXMgYXJlIHF1ZXVlZCBiZWZvcmUgdGhpcyBpc1xuXHQgKiBjYWxsZWQgdGhlIGZpcnN0IHRpbWUsIGJlY2F1c2UgbWluTG9nTGV2ZWwgZGVmYXVsdHMgdG8gV2Fybi5cblx0ICovXG5cdHNldHVwKGNvbnNvbGVNaW5Mb2dMZXZlbDogTG9nTGV2ZWwsIF9sb2dGaWxlUGF0aD86IHN0cmluZ3xib29sZWFuLCBwcmVwZW5kVGltZXN0YW1wOiBib29sZWFuID0gdHJ1ZSk6IHZvaWQge1xuXHRcdGNvbnN0IGxvZ0ZpbGVQYXRoID0gdHlwZW9mIF9sb2dGaWxlUGF0aCA9PT0gJ3N0cmluZycgP1xuXHRcdFx0X2xvZ0ZpbGVQYXRoIDpcblx0XHRcdChfbG9nRmlsZVBhdGggJiYgdGhpcy5fbG9nRmlsZVBhdGhGcm9tSW5pdCk7XG5cblx0XHRpZiAodGhpcy5fY3VycmVudExvZ2dlcikge1xuXHRcdFx0Y29uc3Qgb3B0aW9ucyA9IHtcblx0XHRcdFx0Y29uc29sZU1pbkxvZ0xldmVsLFxuXHRcdFx0XHRsb2dGaWxlUGF0aCxcblx0XHRcdFx0cHJlcGVuZFRpbWVzdGFtcFxuXHRcdFx0fTtcblx0XHRcdHRoaXMuX2N1cnJlbnRMb2dnZXIuc2V0dXAob3B0aW9ucykudGhlbigoKSA9PiB7XG5cdFx0XHRcdC8vIE5vdyB0aGF0IHdlIGhhdmUgYSBtaW5pbXVtIGxvZ0xldmVsLCB3ZSBjYW4gY2xlYXIgb3V0IHRoZSBxdWV1ZSBvZiBwZW5kaW5nIG1lc3NhZ2VzXG5cdFx0XHRcdGlmICh0aGlzLl9wZW5kaW5nTG9nUSkge1xuXHRcdFx0XHRcdGNvbnN0IGxvZ1EgPSB0aGlzLl9wZW5kaW5nTG9nUTtcblx0XHRcdFx0XHR0aGlzLl9wZW5kaW5nTG9nUSA9IG51bGw7XG5cdFx0XHRcdFx0bG9nUS5mb3JFYWNoKGl0ZW0gPT4gdGhpcy5fd3JpdGUoaXRlbS5tc2csIGl0ZW0ubGV2ZWwpKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHR9XG5cdH1cblxuXHRpbml0KGxvZ0NhbGxiYWNrOiBJTG9nQ2FsbGJhY2ssIGxvZ0ZpbGVQYXRoPzogc3RyaW5nLCBsb2dUb0NvbnNvbGU/OiBib29sZWFuKTogdm9pZCB7XG5cdFx0Ly8gUmUtaW5pdCwgY3JlYXRlIG5ldyBnbG9iYWwgTG9nZ2VyXG5cdFx0dGhpcy5fcGVuZGluZ0xvZ1EgPSB0aGlzLl9wZW5kaW5nTG9nUSB8fCBbXTtcblx0XHR0aGlzLl9jdXJyZW50TG9nZ2VyID0gbmV3IEludGVybmFsTG9nZ2VyKGxvZ0NhbGxiYWNrLCBsb2dUb0NvbnNvbGUpO1xuXHRcdHRoaXMuX2xvZ0ZpbGVQYXRoRnJvbUluaXQgPSBsb2dGaWxlUGF0aDtcblx0fVxufVxuXG5leHBvcnQgY29uc3QgbG9nZ2VyID0gbmV3IExvZ2dlcigpO1xuXG5pbnRlcmZhY2UgSUludGVybmFsTG9nZ2VyT3B0aW9ucyB7XG5cdGNvbnNvbGVNaW5Mb2dMZXZlbDogTG9nTGV2ZWw7XG5cdGxvZ0ZpbGVQYXRoPzogc3RyaW5nO1xuXHRwcmVwZW5kVGltZXN0YW1wPzogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBNYW5hZ2VzIGxvZ2dpbmcsIHdoZXRoZXIgdG8gY29uc29sZS5sb2csIGZpbGUsIG9yIFZTIENvZGUgY29uc29sZS5cbiAqIEVuY2Fwc3VsYXRlcyB0aGUgc3RhdGUgc3BlY2lmaWMgdG8gZWFjaCBsb2dnaW5nIHNlc3Npb25cbiAqL1xuY2xhc3MgSW50ZXJuYWxMb2dnZXIge1xuXHRwcml2YXRlIF9taW5Mb2dMZXZlbDogTG9nTGV2ZWw7XG5cdHByaXZhdGUgX2xvZ1RvQ29uc29sZTogYm9vbGVhbjtcblxuXHQvKiogTG9nIGluZm8gdGhhdCBtZWV0cyBtaW5Mb2dMZXZlbCBpcyBzZW50IHRvIHRoaXMgY2FsbGJhY2suICovXG5cdHByaXZhdGUgX2xvZ0NhbGxiYWNrOiBJTG9nQ2FsbGJhY2s7XG5cblx0LyoqIFdyaXRlIHN0ZWFtIGZvciBsb2cgZmlsZSAqL1xuXHRwcml2YXRlIF9sb2dGaWxlU3RyZWFtOiBmcy5Xcml0ZVN0cmVhbTtcblxuXHQvKiogRGlzcG9zZSBhbmQgYWxsb3cgZXhpdCB0byBjb250aW51ZSBub3JtYWxseSAqL1xuXHRwcml2YXRlIGJlZm9yZUV4aXRDYWxsYmFjayA9ICgpID0+IHRoaXMuZGlzcG9zZSgpO1xuXG5cdC8qKiBEaXNwb3NlIGFuZCBleGl0ICovXG5cdHByaXZhdGUgZGlzcG9zZUNhbGxiYWNrO1xuXG5cdC8qKiBXaGV0aGVyIHRvIGFkZCBhIHRpbWVzdGFtcCB0byBtZXNzYWdlcyBpbiB0aGUgbG9nZmlsZSAqL1xuXHRwcml2YXRlIF9wcmVwZW5kVGltZXN0YW1wOiBib29sZWFuO1xuXG5cdGNvbnN0cnVjdG9yKGxvZ0NhbGxiYWNrOiBJTG9nQ2FsbGJhY2ssIGlzU2VydmVyPzogYm9vbGVhbikge1xuXHRcdHRoaXMuX2xvZ0NhbGxiYWNrID0gbG9nQ2FsbGJhY2s7XG5cdFx0dGhpcy5fbG9nVG9Db25zb2xlID0gaXNTZXJ2ZXI7XG5cblx0XHR0aGlzLl9taW5Mb2dMZXZlbCA9IExvZ0xldmVsLldhcm47XG5cblx0XHR0aGlzLmRpc3Bvc2VDYWxsYmFjayA9IChzaWduYWw6IHN0cmluZywgY29kZTogbnVtYmVyKSA9PiB7XG5cdFx0XHR0aGlzLmRpc3Bvc2UoKTtcblxuXHRcdFx0Ly8gRXhpdCB3aXRoIDEyOCArIHZhbHVlIG9mIHRoZSBzaWduYWwgY29kZS5cblx0XHRcdC8vIGh0dHBzOi8vbm9kZWpzLm9yZy9hcGkvcHJvY2Vzcy5odG1sI3Byb2Nlc3NfZXhpdF9jb2Rlc1xuXHRcdFx0Y29kZSA9IGNvZGUgfHwgMjsgLy8gU0lHSU5UXG5cdFx0XHRjb2RlICs9IDEyODtcblxuXHRcdFx0cHJvY2Vzcy5leGl0KGNvZGUpO1xuXHRcdH07XG5cdH1cblxuXHRwdWJsaWMgYXN5bmMgc2V0dXAob3B0aW9uczogSUludGVybmFsTG9nZ2VyT3B0aW9ucyk6IFByb21pc2U8dm9pZD4ge1xuXHRcdHRoaXMuX21pbkxvZ0xldmVsID0gb3B0aW9ucy5jb25zb2xlTWluTG9nTGV2ZWw7XG5cdFx0dGhpcy5fcHJlcGVuZFRpbWVzdGFtcCA9IG9wdGlvbnMucHJlcGVuZFRpbWVzdGFtcDtcblxuXHRcdC8vIE9wZW4gYSBsb2cgZmlsZSBpbiB0aGUgc3BlY2lmaWVkIGxvY2F0aW9uLiBPdmVyd3JpdHRlbiBvbiBlYWNoIHJ1bi5cblx0XHRpZiAob3B0aW9ucy5sb2dGaWxlUGF0aCkge1xuXHRcdFx0aWYgKCFwYXRoLmlzQWJzb2x1dGUob3B0aW9ucy5sb2dGaWxlUGF0aCkpIHtcblx0XHRcdFx0dGhpcy5sb2coYGxvZ0ZpbGVQYXRoIG11c3QgYmUgYW4gYWJzb2x1dGUgcGF0aDogJHtvcHRpb25zLmxvZ0ZpbGVQYXRofWAsIExvZ0xldmVsLkVycm9yKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNvbnN0IGhhbmRsZUVycm9yID0gZXJyID0+IHRoaXMuc2VuZExvZyhgRXJyb3IgY3JlYXRpbmcgbG9nIGZpbGUgYXQgcGF0aDogJHtvcHRpb25zLmxvZ0ZpbGVQYXRofS4gRXJyb3I6ICR7ZXJyLnRvU3RyaW5nKCl9XFxuYCwgTG9nTGV2ZWwuRXJyb3IpO1xuXG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0YXdhaXQgbWtkaXJwUHJvbWlzZShwYXRoLmRpcm5hbWUob3B0aW9ucy5sb2dGaWxlUGF0aCkpO1xuXHRcdFx0XHRcdHRoaXMubG9nKGBWZXJib3NlIGxvZ3MgYXJlIHdyaXR0ZW4gdG86XFxuYCwgTG9nTGV2ZWwuV2Fybik7XG5cdFx0XHRcdFx0dGhpcy5sb2cob3B0aW9ucy5sb2dGaWxlUGF0aCArICdcXG4nLCBMb2dMZXZlbC5XYXJuKTtcblxuXHRcdFx0XHRcdHRoaXMuX2xvZ0ZpbGVTdHJlYW0gPSBmcy5jcmVhdGVXcml0ZVN0cmVhbShvcHRpb25zLmxvZ0ZpbGVQYXRoKTtcblx0XHRcdFx0XHR0aGlzLmxvZ0RhdGVUaW1lKCk7XG5cdFx0XHRcdFx0dGhpcy5zZXR1cFNodXRkb3duTGlzdGVuZXJzKCk7XG5cdFx0XHRcdFx0dGhpcy5fbG9nRmlsZVN0cmVhbS5vbignZXJyb3InLCBlcnIgPT4ge1xuXHRcdFx0XHRcdFx0aGFuZGxlRXJyb3IoZXJyKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSBjYXRjaCAoZXJyKSB7XG5cdFx0XHRcdFx0aGFuZGxlRXJyb3IoZXJyKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHByaXZhdGUgbG9nRGF0ZVRpbWUoKTogdm9pZCB7XG5cdFx0bGV0IGQgPSBuZXcgRGF0ZSgpO1xuXHRcdGxldCBkYXRlU3RyaW5nID0gZC5nZXRVVENGdWxsWWVhcigpICsgJy0nICsgYCR7ZC5nZXRVVENNb250aCgpICsgMX1gICsgJy0nICsgZC5nZXRVVENEYXRlKCk7XG5cdFx0Y29uc3QgdGltZUFuZERhdGVTdGFtcCA9IGRhdGVTdHJpbmcgKyAnLCAnICsgZ2V0Rm9ybWF0dGVkVGltZVN0cmluZygpO1xuXHRcdHRoaXMubG9nKHRpbWVBbmREYXRlU3RhbXAgKyAnXFxuJywgTG9nTGV2ZWwuVmVyYm9zZSwgZmFsc2UpO1xuXHR9XG5cblx0cHJpdmF0ZSBzZXR1cFNodXRkb3duTGlzdGVuZXJzKCk6IHZvaWQge1xuXHRcdHByb2Nlc3MuYWRkTGlzdGVuZXIoJ2JlZm9yZUV4aXQnLCB0aGlzLmJlZm9yZUV4aXRDYWxsYmFjayk7XG5cdFx0cHJvY2Vzcy5hZGRMaXN0ZW5lcignU0lHVEVSTScsIHRoaXMuZGlzcG9zZUNhbGxiYWNrKTtcblx0XHRwcm9jZXNzLmFkZExpc3RlbmVyKCdTSUdJTlQnLCB0aGlzLmRpc3Bvc2VDYWxsYmFjayk7XG5cdH1cblxuXHRwcml2YXRlIHJlbW92ZVNodXRkb3duTGlzdGVuZXJzKCk6IHZvaWQge1xuXHRcdHByb2Nlc3MucmVtb3ZlTGlzdGVuZXIoJ2JlZm9yZUV4aXQnLCB0aGlzLmJlZm9yZUV4aXRDYWxsYmFjayk7XG5cdFx0cHJvY2Vzcy5yZW1vdmVMaXN0ZW5lcignU0lHVEVSTScsIHRoaXMuZGlzcG9zZUNhbGxiYWNrKTtcblx0XHRwcm9jZXNzLnJlbW92ZUxpc3RlbmVyKCdTSUdJTlQnLCB0aGlzLmRpc3Bvc2VDYWxsYmFjayk7XG5cdH1cblxuXHRwdWJsaWMgZGlzcG9zZSgpOiBQcm9taXNlPHZvaWQ+IHtcblx0XHRyZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG5cdFx0XHR0aGlzLnJlbW92ZVNodXRkb3duTGlzdGVuZXJzKCk7XG5cdFx0XHRpZiAodGhpcy5fbG9nRmlsZVN0cmVhbSkge1xuXHRcdFx0XHR0aGlzLl9sb2dGaWxlU3RyZWFtLmVuZChyZXNvbHZlKTtcblx0XHRcdFx0dGhpcy5fbG9nRmlsZVN0cmVhbSA9IG51bGw7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXNvbHZlKCk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblxuXHRwdWJsaWMgbG9nKG1zZzogc3RyaW5nLCBsZXZlbDogTG9nTGV2ZWwsIHByZXBlbmRUaW1lc3RhbXAgPSB0cnVlKTogdm9pZCB7XG5cdFx0aWYgKHRoaXMuX21pbkxvZ0xldmVsID09PSBMb2dMZXZlbC5TdG9wKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0aWYgKGxldmVsID49IHRoaXMuX21pbkxvZ0xldmVsKSB7XG5cdFx0XHR0aGlzLnNlbmRMb2cobXNnLCBsZXZlbCk7XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMuX2xvZ1RvQ29uc29sZSkge1xuXHRcdFx0Y29uc3QgbG9nRm4gPVxuXHRcdFx0XHRsZXZlbCA9PT0gTG9nTGV2ZWwuRXJyb3IgPyBjb25zb2xlLmVycm9yIDpcblx0XHRcdFx0bGV2ZWwgPT09IExvZ0xldmVsLldhcm4gPyBjb25zb2xlLndhcm4gOlxuXHRcdFx0XHRudWxsO1xuXG5cdFx0XHRpZiAobG9nRm4pIHtcblx0XHRcdFx0bG9nRm4odHJpbUxhc3ROZXdsaW5lKG1zZykpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIElmIGFuIGVycm9yLCBwcmVwZW5kIHdpdGggJ1tFcnJvcl0nXG5cdFx0aWYgKGxldmVsID09PSBMb2dMZXZlbC5FcnJvcikge1xuXHRcdFx0bXNnID0gYFske0xvZ0xldmVsW2xldmVsXX1dICR7bXNnfWA7XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMuX3ByZXBlbmRUaW1lc3RhbXAgJiYgcHJlcGVuZFRpbWVzdGFtcCkge1xuXHRcdFx0bXNnID0gJ1snICsgZ2V0Rm9ybWF0dGVkVGltZVN0cmluZygpICsgJ10gJyArIG1zZztcblx0XHR9XG5cblx0XHRpZiAodGhpcy5fbG9nRmlsZVN0cmVhbSkge1xuXHRcdFx0dGhpcy5fbG9nRmlsZVN0cmVhbS53cml0ZShtc2cpO1xuXHRcdH1cblx0fVxuXG5cdHByaXZhdGUgc2VuZExvZyhtc2c6IHN0cmluZywgbGV2ZWw6IExvZ0xldmVsKTogdm9pZCB7XG5cdFx0Ly8gVHJ1bmNhdGUgbG9uZyBtZXNzYWdlcywgdGhleSBjYW4gaGFuZyBWUyBDb2RlXG5cdFx0aWYgKG1zZy5sZW5ndGggPiAxNTAwKSB7XG5cdFx0XHRjb25zdCBlbmRzSW5OZXdsaW5lID0gISFtc2cubWF0Y2goLyhcXG58XFxyXFxuKSQvKTtcblx0XHRcdG1zZyA9IG1zZy5zdWJzdHIoMCwgMTUwMCkgKyAnWy4uLl0nO1xuXHRcdFx0aWYgKGVuZHNJbk5ld2xpbmUpIHtcblx0XHRcdFx0bXNnID0gbXNnICsgJ1xcbic7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMuX2xvZ0NhbGxiYWNrKSB7XG5cdFx0XHRjb25zdCBldmVudCA9IG5ldyBMb2dPdXRwdXRFdmVudChtc2csIGxldmVsKTtcblx0XHRcdHRoaXMuX2xvZ0NhbGxiYWNrKGV2ZW50KTtcblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24gbWtkaXJwUHJvbWlzZShmb2xkZXI6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuXHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXHRcdG1rZGlycChmb2xkZXIsIGVyciA9PiB7XG5cdFx0XHRpZiAoZXJyKSB7XG5cdFx0XHRcdHJlamVjdChlcnIpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmVzb2x2ZSgpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9KTtcbn1cblxuZXhwb3J0IGNsYXNzIExvZ091dHB1dEV2ZW50IGV4dGVuZHMgT3V0cHV0RXZlbnQge1xuXHRjb25zdHJ1Y3Rvcihtc2c6IHN0cmluZywgbGV2ZWw6IExvZ0xldmVsKSB7XG5cdFx0Y29uc3QgY2F0ZWdvcnkgPVxuXHRcdFx0bGV2ZWwgPT09IExvZ0xldmVsLkVycm9yID8gJ3N0ZGVycicgOlxuXHRcdFx0bGV2ZWwgPT09IExvZ0xldmVsLldhcm4gPyAnY29uc29sZScgOlxuXHRcdFx0J3N0ZG91dCc7XG5cdFx0c3VwZXIobXNnLCBjYXRlZ29yeSk7XG5cdH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRyaW1MYXN0TmV3bGluZShzdHI6IHN0cmluZyk6IHN0cmluZyB7XG5cdHJldHVybiBzdHIucmVwbGFjZSgvKFxcbnxcXHJcXG4pJC8sICcnKTtcbn1cblxuZnVuY3Rpb24gZ2V0Rm9ybWF0dGVkVGltZVN0cmluZygpOiBzdHJpbmcge1xuXHRsZXQgZCA9IG5ldyBEYXRlKCk7XG5cdGxldCBob3VyU3RyaW5nID0gX3BhZFplcm9lcygyLCBTdHJpbmcoZC5nZXRVVENIb3VycygpKSk7XG5cdGxldCBtaW51dGVTdHJpbmcgPSBfcGFkWmVyb2VzKDIsIFN0cmluZyhkLmdldFVUQ01pbnV0ZXMoKSkpO1xuXHRsZXQgc2Vjb25kU3RyaW5nID0gX3BhZFplcm9lcygyLCBTdHJpbmcoZC5nZXRVVENTZWNvbmRzKCkpKTtcblx0bGV0IG1pbGxpc2Vjb25kU3RyaW5nID0gX3BhZFplcm9lcygzLCBTdHJpbmcoZC5nZXRVVENNaWxsaXNlY29uZHMoKSkpO1xuXHRyZXR1cm4gaG91clN0cmluZyArICc6JyArIG1pbnV0ZVN0cmluZyArICc6JyArIHNlY29uZFN0cmluZyArICcuJyArIG1pbGxpc2Vjb25kU3RyaW5nICsgJyBVVEMnO1xufVxuXG5mdW5jdGlvbiBfcGFkWmVyb2VzKG1pbkRlc2lyZWRMZW5ndGg6IG51bWJlciwgbnVtYmVyVG9QYWQ6IHN0cmluZyk6IHN0cmluZyB7XG5cdGlmIChudW1iZXJUb1BhZC5sZW5ndGggPj0gbWluRGVzaXJlZExlbmd0aCkge1xuXHRcdHJldHVybiBudW1iZXJUb1BhZDtcblx0fSBlbHNlIHtcblx0XHRyZXR1cm4gU3RyaW5nKCcwJy5yZXBlYXQobWluRGVzaXJlZExlbmd0aCkgKyBudW1iZXJUb1BhZCkuc2xpY2UoLW1pbkRlc2lyZWRMZW5ndGgpO1xuXHR9XG59XG4iXX0=

/***/ }),

/***/ 8:
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),

/***/ 82:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

Object.defineProperty(exports, "__esModule", { value: true });
const debugSession_1 = __webpack_require__(43);
exports.DebugSession = debugSession_1.DebugSession;
exports.InitializedEvent = debugSession_1.InitializedEvent;
exports.TerminatedEvent = debugSession_1.TerminatedEvent;
exports.StoppedEvent = debugSession_1.StoppedEvent;
exports.ContinuedEvent = debugSession_1.ContinuedEvent;
exports.OutputEvent = debugSession_1.OutputEvent;
exports.ThreadEvent = debugSession_1.ThreadEvent;
exports.BreakpointEvent = debugSession_1.BreakpointEvent;
exports.ModuleEvent = debugSession_1.ModuleEvent;
exports.LoadedSourceEvent = debugSession_1.LoadedSourceEvent;
exports.CapabilitiesEvent = debugSession_1.CapabilitiesEvent;
exports.ProgressStartEvent = debugSession_1.ProgressStartEvent;
exports.ProgressUpdateEvent = debugSession_1.ProgressUpdateEvent;
exports.ProgressEndEvent = debugSession_1.ProgressEndEvent;
exports.Thread = debugSession_1.Thread;
exports.StackFrame = debugSession_1.StackFrame;
exports.Scope = debugSession_1.Scope;
exports.Variable = debugSession_1.Variable;
exports.Breakpoint = debugSession_1.Breakpoint;
exports.Source = debugSession_1.Source;
exports.Module = debugSession_1.Module;
exports.CompletionItem = debugSession_1.CompletionItem;
exports.ErrorDestination = debugSession_1.ErrorDestination;
const loggingDebugSession_1 = __webpack_require__(122);
exports.LoggingDebugSession = loggingDebugSession_1.LoggingDebugSession;
const Logger = __webpack_require__(66);
exports.Logger = Logger;
const messages_1 = __webpack_require__(44);
exports.Event = messages_1.Event;
exports.Response = messages_1.Response;
const handles_1 = __webpack_require__(124);
exports.Handles = handles_1.Handles;
const logger = Logger.logger;
exports.logger = logger;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Z0dBR2dHO0FBQ2hHLFlBQVksQ0FBQzs7QUFFYixpREFNd0I7QUFTdkIsdUJBZEEsMkJBQVksQ0FjQTtBQUlaLDJCQWpCQSwrQkFBZ0IsQ0FpQkE7QUFBRSwwQkFqQkEsOEJBQWUsQ0FpQkE7QUFBRSx1QkFqQkEsMkJBQVksQ0FpQkE7QUFBRSx5QkFqQkEsNkJBQWMsQ0FpQkE7QUFBRSxzQkFqQkEsMEJBQVcsQ0FpQkE7QUFBRSxzQkFqQkEsMEJBQVcsQ0FpQkE7QUFBRSwwQkFqQkEsOEJBQWUsQ0FpQkE7QUFBRSxzQkFqQkEsMEJBQVcsQ0FpQkE7QUFBRSw0QkFqQkEsZ0NBQWlCLENBaUJBO0FBQUUsNEJBakJBLGdDQUFpQixDQWlCQTtBQUFFLDZCQWpCQSxpQ0FBa0IsQ0FpQkE7QUFBRSw4QkFqQkEsa0NBQW1CLENBaUJBO0FBQUUsMkJBakJBLCtCQUFnQixDQWlCQTtBQUN4TixpQkFqQkEscUJBQU0sQ0FpQkE7QUFBRSxxQkFqQkEseUJBQVUsQ0FpQkE7QUFBRSxnQkFqQkEsb0JBQUssQ0FpQkE7QUFBRSxtQkFqQkEsdUJBQVEsQ0FpQkE7QUFDbkMscUJBakJBLHlCQUFVLENBaUJBO0FBQUUsaUJBakJBLHFCQUFNLENBaUJBO0FBQUUsaUJBakJBLHFCQUFNLENBaUJBO0FBQUUseUJBakJBLDZCQUFjLENBaUJBO0FBQzFDLDJCQWpCQSwrQkFBZ0IsQ0FpQkE7QUFmakIsK0RBQTBEO0FBU3pELDhCQVRPLHlDQUFtQixDQVNQO0FBUnBCLG1DQUFtQztBQVNsQyx3QkFBTTtBQVJQLHlDQUE2QztBQWM1QyxnQkFkUSxnQkFBSyxDQWNSO0FBQUUsbUJBZFEsbUJBQVEsQ0FjUjtBQWJoQix1Q0FBb0M7QUFjbkMsa0JBZFEsaUJBQU8sQ0FjUjtBQVpSLE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUM7QUFNNUIsd0JBQU0iLCJzb3VyY2VzQ29udGVudCI6WyIvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuIFNlZSBMaWNlbnNlLnR4dCBpbiB0aGUgcHJvamVjdCByb290IGZvciBsaWNlbnNlIGluZm9ybWF0aW9uLlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG4ndXNlIHN0cmljdCc7XG5cbmltcG9ydCB7XG5cdERlYnVnU2Vzc2lvbixcblx0SW5pdGlhbGl6ZWRFdmVudCwgVGVybWluYXRlZEV2ZW50LCBTdG9wcGVkRXZlbnQsIENvbnRpbnVlZEV2ZW50LCBPdXRwdXRFdmVudCwgVGhyZWFkRXZlbnQsIEJyZWFrcG9pbnRFdmVudCwgTW9kdWxlRXZlbnQsIExvYWRlZFNvdXJjZUV2ZW50LCBDYXBhYmlsaXRpZXNFdmVudCwgUHJvZ3Jlc3NTdGFydEV2ZW50LCBQcm9ncmVzc1VwZGF0ZUV2ZW50LCBQcm9ncmVzc0VuZEV2ZW50LFxuXHRUaHJlYWQsIFN0YWNrRnJhbWUsIFNjb3BlLCBWYXJpYWJsZSxcblx0QnJlYWtwb2ludCwgU291cmNlLCBNb2R1bGUsIENvbXBsZXRpb25JdGVtLFxuXHRFcnJvckRlc3RpbmF0aW9uXG59IGZyb20gJy4vZGVidWdTZXNzaW9uJztcbmltcG9ydCB7TG9nZ2luZ0RlYnVnU2Vzc2lvbn0gZnJvbSAnLi9sb2dnaW5nRGVidWdTZXNzaW9uJztcbmltcG9ydCAqIGFzIExvZ2dlciBmcm9tICcuL2xvZ2dlcic7XG5pbXBvcnQgeyBFdmVudCwgUmVzcG9uc2UgfSBmcm9tICcuL21lc3NhZ2VzJztcbmltcG9ydCB7IEhhbmRsZXMgfSBmcm9tICcuL2hhbmRsZXMnO1xuXG5jb25zdCBsb2dnZXIgPSBMb2dnZXIubG9nZ2VyO1xuXG5leHBvcnQge1xuXHREZWJ1Z1Nlc3Npb24sXG5cdExvZ2dpbmdEZWJ1Z1Nlc3Npb24sXG5cdExvZ2dlcixcblx0bG9nZ2VyLFxuXHRJbml0aWFsaXplZEV2ZW50LCBUZXJtaW5hdGVkRXZlbnQsIFN0b3BwZWRFdmVudCwgQ29udGludWVkRXZlbnQsIE91dHB1dEV2ZW50LCBUaHJlYWRFdmVudCwgQnJlYWtwb2ludEV2ZW50LCBNb2R1bGVFdmVudCwgTG9hZGVkU291cmNlRXZlbnQsIENhcGFiaWxpdGllc0V2ZW50LCBQcm9ncmVzc1N0YXJ0RXZlbnQsIFByb2dyZXNzVXBkYXRlRXZlbnQsIFByb2dyZXNzRW5kRXZlbnQsXG5cdFRocmVhZCwgU3RhY2tGcmFtZSwgU2NvcGUsIFZhcmlhYmxlLFxuXHRCcmVha3BvaW50LCBTb3VyY2UsIE1vZHVsZSwgQ29tcGxldGlvbkl0ZW0sXG5cdEVycm9yRGVzdGluYXRpb24sXG5cdEV2ZW50LCBSZXNwb25zZSxcblx0SGFuZGxlc1xufVxuIl19

/***/ })

/******/ });
//# sourceMappingURL=debugAdapter2.js.map