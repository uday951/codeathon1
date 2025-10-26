"use strict";
/**
 * Main entry point for the unified-oauth package
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpClient = exports.logger = exports.Logger = exports.RedditProvider = exports.LinkedInProvider = exports.InstagramProvider = exports.TwitterProvider = exports.FacebookProvider = exports.GitHubProvider = exports.GoogleProvider = exports.OAuthManager = void 0;
// Core exports
var OAuthManager_1 = require("./core/OAuthManager");
Object.defineProperty(exports, "OAuthManager", { enumerable: true, get: function () { return OAuthManager_1.OAuthManager; } });
// Provider exports
var google_1 = require("./providers/google");
Object.defineProperty(exports, "GoogleProvider", { enumerable: true, get: function () { return google_1.GoogleProvider; } });
var github_1 = require("./providers/github");
Object.defineProperty(exports, "GitHubProvider", { enumerable: true, get: function () { return github_1.GitHubProvider; } });
var facebook_1 = require("./providers/facebook");
Object.defineProperty(exports, "FacebookProvider", { enumerable: true, get: function () { return facebook_1.FacebookProvider; } });
var twitter_1 = require("./providers/twitter");
Object.defineProperty(exports, "TwitterProvider", { enumerable: true, get: function () { return twitter_1.TwitterProvider; } });
var instagram_1 = require("./providers/instagram");
Object.defineProperty(exports, "InstagramProvider", { enumerable: true, get: function () { return instagram_1.InstagramProvider; } });
var linkedin_1 = require("./providers/linkedin");
Object.defineProperty(exports, "LinkedInProvider", { enumerable: true, get: function () { return linkedin_1.LinkedInProvider; } });
var reddit_1 = require("./providers/reddit");
Object.defineProperty(exports, "RedditProvider", { enumerable: true, get: function () { return reddit_1.RedditProvider; } });
// Type exports
__exportStar(require("./types"), exports);
// Error exports
__exportStar(require("./errors/CustomError"), exports);
// Utility exports
var logger_1 = require("./utils/logger");
Object.defineProperty(exports, "Logger", { enumerable: true, get: function () { return logger_1.Logger; } });
Object.defineProperty(exports, "logger", { enumerable: true, get: function () { return logger_1.logger; } });
var httpClient_1 = require("./utils/httpClient");
Object.defineProperty(exports, "HttpClient", { enumerable: true, get: function () { return httpClient_1.HttpClient; } });
//# sourceMappingURL=index.js.map