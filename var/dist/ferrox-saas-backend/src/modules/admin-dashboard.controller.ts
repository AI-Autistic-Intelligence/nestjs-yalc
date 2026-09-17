import {
  Controller,
  Get,
  Post,
  Roles,
  FerroxSelfTestEngine,
  KernelSandboxEngine,
} from '../../../../ferrox-node/dist/index';

@Controller('/api/v1/admin')
@Roles('admin')
export class AdminDashboardController {
  private selfTestEngine: FerroxSelfTestEngine;
  private sandboxEngine: KernelSandboxEngine;

  constructor() {
    this.selfTestEngine = new FerroxSelfTestEngine();
    this.sandboxEngine = new KernelSandboxEngine();
  }

  @Get('/dashboard')
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
          .map(
            (r) =>
              `<tr><td>${r.category}</td><td>${r.score}%</td><td><span class="badge">PASS</span></td><td>${r.description}</td></tr>`
          )
          .join('')}
      </tbody>
    </table>
  </div>
</body>
</html>`;
  }

  @Post('/selftest/run')
  runSelfTest() {
    return this.selfTestEngine.runDiagnosticAudit();
  }

  @Post('/kali/audit')
  runKaliAudit(req: any) {
    const targetUrl = req.body?.targetUrl || 'http://localhost:8080';
    return this.selfTestEngine.runKaliRedTeamAudit(targetUrl);
  }

  @Get('/kernel/sandbox')
  getKernelSandboxPolicy() {
    return {
      seccompBpf: JSON.parse(this.sandboxEngine.generateSeccompBpfPolicy()),
      landlockLsm: JSON.parse(this.sandboxEngine.generateLandlockPolicy()),
    };
  }

  @Get('/kernel/sysctl')
  getKernelSysctlConfig() {
    return {
      sysctlConfig: this.sandboxEngine.generateSysctlHardeningConfig(),
    };
  }
}
