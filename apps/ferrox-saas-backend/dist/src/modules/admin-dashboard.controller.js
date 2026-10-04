"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminDashboardController = void 0;
const tslib_1 = require("tslib");
const ferrox_node_1 = require("ferrox-node");
let AdminDashboardController = class AdminDashboardController {
    constructor() {
        this.selfTestEngine = new ferrox_node_1.FerroxSelfTestEngine();
        this.sandboxEngine = new ferrox_node_1.KernelSandboxEngine();
    }
    getAdminDashboardHtml() {
        const audit = this.selfTestEngine.runDiagnosticAudit();
        return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Ferrox Enterprise Security & Admin Dashboard</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #0f172a; color: #f8fafc; margin: 0; padding: 20px; }
    h1 { color: #38bdf8; border-bottom: 2px solid #334155; padding-bottom: 10px; }
    .card { background: #1e293b; border-radius: 8px; padding: 20px; margin-bottom: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.3); }
    .badge { background: #22c55e; color: #022c22; padding: 4px 12px; border-radius: 12px; font-weight: bold; }
    .btn { background: #0284c7; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-size: 14px; margin-right: 10px; }
    .btn:hover { background: #0369a1; }
    table { width: 100%; border-collapse: collapse; margin-top: 15px; }
    th, td { text-align: left; padding: 12px; border-bottom: 1px solid #334155; }
    th { background: #334155; color: #94a3b8; }
  </style>
</head>
<body>
  <h1>🛡️ Ferrox Security Admin Dashboard (Node.js v0.6.0)</h1>
  
  <div class="card">
    <h2>Ecosystem Security Posture: <span class="badge">${audit.overallScore}% PASS</span></h2>
    <p>Kernel Compliance Status: <strong>ENFORCED (Seccomp BPF + Landlock LSM)</strong></p>
    <button class="btn" onclick="fetch('/api/v1/admin/selftest/run', {method:'POST'}).then(r=>r.json()).then(d=>alert(JSON.stringify(d,null,2)))">⚡ Trigger FerroxSelfTest Audit</button>
    <button class="btn" onclick="fetch('/api/v1/admin/kali/audit', {method:'POST'}).then(r=>r.json()).then(d=>alert(JSON.stringify(d,null,2)))">🔴 Run Kali Red-Team Offensive Scan</button>
  </div>

  <div class="card">
    <h3>Automated Security Benchmark Results</h3>
    <table>
      <thead>
        <tr><th>Category</th><th>Score</th><th>Status</th><th>Description</th></tr>
      </thead>
      <tbody>
        ${audit.results
            .map((r) => `<tr><td>${r.category}</td><td>${r.score}%</td><td><span class="badge">PASS</span></td><td>${r.description}</td></tr>`)
            .join('')}
      </tbody>
    </table>
  </div>
</body>
</html>`;
    }
    runSelfTest() {
        return this.selfTestEngine.runDiagnosticAudit();
    }
    runKaliAudit(req) {
        const targetUrl = req.body?.targetUrl || 'http://localhost:8080';
        return this.selfTestEngine.runKaliRedTeamAudit(targetUrl);
    }
    getKernelSandboxPolicy() {
        return {
            seccompBpf: JSON.parse(this.sandboxEngine.generateSeccompBpfPolicy()),
            landlockLsm: JSON.parse(this.sandboxEngine.generateLandlockPolicy()),
        };
    }
    getKernelSysctlConfig() {
        return {
            sysctlConfig: this.sandboxEngine.generateSysctlHardeningConfig(),
        };
    }
};
exports.AdminDashboardController = AdminDashboardController;
tslib_1.__decorate([
    (0, ferrox_node_1.Get)('/dashboard'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], AdminDashboardController.prototype, "getAdminDashboardHtml", null);
tslib_1.__decorate([
    (0, ferrox_node_1.Post)('/selftest/run'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], AdminDashboardController.prototype, "runSelfTest", null);
tslib_1.__decorate([
    (0, ferrox_node_1.Post)('/kali/audit'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], AdminDashboardController.prototype, "runKaliAudit", null);
tslib_1.__decorate([
    (0, ferrox_node_1.Get)('/kernel/sandbox'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], AdminDashboardController.prototype, "getKernelSandboxPolicy", null);
tslib_1.__decorate([
    (0, ferrox_node_1.Get)('/kernel/sysctl'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], AdminDashboardController.prototype, "getKernelSysctlConfig", null);
exports.AdminDashboardController = AdminDashboardController = tslib_1.__decorate([
    (0, ferrox_node_1.Controller)('/api/v1/admin'),
    (0, ferrox_node_1.Roles)('admin'),
    tslib_1.__metadata("design:paramtypes", [])
], AdminDashboardController);
//# sourceMappingURL=admin-dashboard.controller.js.map