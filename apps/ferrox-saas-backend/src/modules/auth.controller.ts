import { Controller, Post, PasetoAuthService, TotpAuthService } from '../../../../ferrox-node/dist/index';

@Controller('/api/v1/auth')
export class AuthController {
  private pasetoService: PasetoAuthService;
  private totpService: TotpAuthService;

  constructor(secretKey: string = 'ferrox-saas-master-paseto-secret-32b') {
    this.pasetoService = new PasetoAuthService(secretKey);
    this.totpService = new TotpAuthService();
  }

  @Post('/register')
  register(req: any) {
    const { email } = req.body || {};
    return {
      success: true,
      message: 'User registered successfully',
      email: email || 'user@ferrox.dev',
      totpSetupRequired: true,
    };
  }

  @Post('/login')
  login(req: any) {
    const { email } = req.body || {};
    const token = this.pasetoService.generateV4LocalToken(
      {
        sub: email || 'usr_ferrox_demo',
        roles: ['user', 'admin', 'founder'],
      },
      3600
    );

    return {
      tokenType: 'PASETO v4.local',
      token,
      expiresIn: 3600,
    };
  }

  @Post('/totp/setup')
  totpSetup(req: any) {
    const email = req.body?.email || 'user@ferrox.dev';
    const secret = this.totpService.generateSecret();
    const uri = this.totpService.generateOtpAuthUri(email, secret, 'FerroxSaaS');

    return {
      secret,
      otpAuthUri: uri,
    };
  }

  @Post('/totp/verify')
  totpVerify(req: any) {
    const { secret, code } = req.body || {};
    const isValid = this.totpService.verifyTotpCode(secret || '', code || '');
    return {
      isValid,
      status: isValid ? 'VERIFIED' : 'FAILED',
    };
  }
}
