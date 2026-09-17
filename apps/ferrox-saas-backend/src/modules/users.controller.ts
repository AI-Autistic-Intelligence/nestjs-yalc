import { Controller, Get } from '../../../../ferrox-node/dist/index';

@Controller('/api/v1/users')
export class UsersController {
  @Get('/me')
  getProfile() {
    return {
      id: 'usr_ferrox_001',
      email: 'founder@ferrox.dev',
      roles: ['user', 'admin', 'founder'],
      securityTier: 'HIGH_SECURITY',
      twoFactorEnabled: true,
    };
  }
}
