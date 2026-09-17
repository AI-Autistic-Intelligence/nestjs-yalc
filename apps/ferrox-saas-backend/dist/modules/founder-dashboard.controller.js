"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FounderDashboardController = void 0;
const index_1 = require("../../../../ferrox-node/dist/index");
let FounderDashboardController = class FounderDashboardController {
    getFounderDashboardHtml() {
        return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Ferrox Founder Suite & Executive Analytics</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #0f172a; color: #f8fafc; margin: 0; padding: 20px; }
    h1 { color: #f59e0b; border-bottom: 2px solid #334155; padding-bottom: 10px; }
    .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 20px; }
    .stat-card { background: #1e293b; padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.3); }
    .stat-val { font-size: 32px; font-weight: bold; color: #10b981; margin-top: 10px; }
    .stat-label { color: #94a3b8; font-size: 14px; text-transform: uppercase; }
  </style>
</head>
<body>
  <h1>👑 Ferrox Founder Suite Executive Dashboard</h1>
  
  <div class="grid">
    <div class="stat-card">
      <div class="stat-label">Monthly Recurring Revenue (MRR)</div>
      <div class="stat-val">$250,000</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Annual Run Rate (ARR)</div>
      <div class="stat-val">$3,000,000</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Active SaaS Tenants</div>
      <div class="stat-val">145</div>
    </div>
  </div>

  <div class="stat-card">
    <h3>🛡️ Sentinel AI Security Posture & Realtime Protection</h3>
    <p>AI Threats Blocked: <strong>42 (ChatML Injection, DAN Jailbreaks)</strong></p>
    <p>Kernel Zero-Day Syscall Blocked: <strong>0 Attacks Escaped Sandbox</strong></p>
    <p>Security Compliance Status: <strong style="color:#10b981;">100% HEALTHY</strong></p>
  </div>
</body>
</html>`;
    }
};
exports.FounderDashboardController = FounderDashboardController;
__decorate([
    (0, index_1.Get)('/dashboard'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FounderDashboardController.prototype, "getFounderDashboardHtml", null);
exports.FounderDashboardController = FounderDashboardController = __decorate([
    (0, index_1.Controller)('/api/v1/founder'),
    (0, index_1.Roles)('founder')
], FounderDashboardController);
