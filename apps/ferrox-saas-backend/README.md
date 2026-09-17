# `ferrox-saas-backend` (Node.js Port)

> Enterprise SaaS Backend Port from Rust Ferrox (`ferrox-saas-backend`) to Node.js / TypeScript, powered by `@ferrox/node`.

## 🚀 Features & Modules

1. **AuthModule (`/api/v1/auth`)**:
   - PASETO v4 Token Authentication (`v4.local` AEAD encryption & `v4.public` ed25519 signatures).
   - TOTP 2FA secret generation, QR Code otpauth URI formatting, and validation.

2. **UsersModule (`/api/v1/users`)**:
   - Profile management and role resolution.

3. **AdminModule (`/api/v1/admin`)**:
   - Protected by `@Roles('admin')`.
   - Security audit logs and user management.

4. **MailerModule (`/api/v1/mailer`)**:
   - Transactional email dispatch service.

5. **NotificationsModule (`/api/v1/notifications`)**:
   - Realtime SSE event streaming.

6. **FounderModule (`/api/v1/founder`)**:
   - Protected by `@Roles('founder')`.
   - SaaS revenue metrics (MRR/ARR) and AI security posture telemetry.

7. **HealthModule (`/health`)**:
   - System diagnostics and self-test verification.

## 📜 License

MIT © Ferrox Security & AI Autistic Intelligence Team
