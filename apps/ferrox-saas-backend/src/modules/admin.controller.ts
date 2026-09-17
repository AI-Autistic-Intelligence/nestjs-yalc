import { Controller, Get, Roles } from '../../../../ferrox-node/dist/index';

@Controller('/api/v1/admin')
@Roles('admin')
export class AdminController {
  @Get('/users')
  getUsers() {
    return [
      { id: 'usr_001', email: 'alice@ferrox.dev', role: 'admin' },
      { id: 'usr_002', email: 'bob@ferrox.dev', role: 'user' },
    ];
  }

  @Get('/audit-logs')
  getAuditLogs() {
    return [
      { id: 'log_101', event: 'PASETO_TOKEN_ISSUED', ip: '127.0.0.1', timestamp: new Date().toISOString() },
      { id: 'log_102', event: 'TOTP_2FA_VERIFIED', ip: '127.0.0.1', timestamp: new Date().toISOString() },
    ];
  }
}
