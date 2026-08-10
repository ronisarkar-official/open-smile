# SECURITY.md

> Security policy and checklist. Adapt the placeholders for your project.

## 1. Reporting a Vulnerability

If you discover a security issue, please report it privately instead of opening a public issue.

- **Contact:** security@yourdomain.com
- **Response time:** within 48 hours
- **Disclosure policy:** coordinated disclosure — please allow time for a fix before going public.

## 2. Supported Versions

| Version | Supported |
|---|---|
| main / latest | ✅ |
| older releases | ❌ |

## 3. Authentication & Authorization

- [ ] Passwords hashed with bcrypt/argon2 — never stored in plain text
- [ ] Sessions/tokens use secure, httpOnly, sameSite cookies (or short-lived JWTs + refresh tokens)
- [ ] Role-based access control enforced on the server, not just hidden in UI
- [ ] Rate limiting on login, signup, and password-reset endpoints
- [ ] Account lockout / backoff after repeated failed logins

## 4. Input Validation & Data Handling

- [ ] All user input validated and sanitized server-side (never trust client-side validation alone)
- [ ] Parameterized queries / ORM used — no raw string-concatenated SQL
- [ ] Output encoding to prevent XSS (escape user content before rendering)
- [ ] File uploads restricted by type, size, and scanned/validated before storage
- [ ] CSRF protection on state-changing requests

## 5. Secrets Management

- [ ] No API keys, DB credentials, or secrets committed to the repo
- [ ] `.env` files gitignored, `.env.example` kept updated
- [ ] Secrets rotated periodically and on any suspected leak
- [ ] Use a secrets manager (Vercel/Netlify env vars, AWS Secrets Manager, etc.) in production

## 6. Transport & Headers

- [ ] HTTPS enforced everywhere (HSTS enabled)
- [ ] Security headers set: `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`
- [ ] CORS configured to allow only trusted origins

## 7. Dependencies

- [ ] Dependencies kept up to date
- [ ] Automated vulnerability scanning enabled (e.g. `npm audit`, Dependabot, Snyk)
- [ ] Unused packages removed regularly

## 8. Database Security

- [ ] Principle of least privilege for DB users/roles
- [ ] Regular backups, tested restore process
- [ ] Sensitive fields (PII) encrypted at rest where applicable

## 9. Logging & Monitoring

- [ ] Failed login attempts and suspicious activity logged
- [ ] No sensitive data (passwords, tokens, full card numbers) ever logged
- [ ] Alerts set up for unusual traffic or error spikes

## 10. Infrastructure

- [ ] Admin/dashboard routes protected and not publicly indexable
- [ ] Server/hosting platform kept patched
- [ ] Staging and production environments isolated

## 11. Incident Response

1. Identify and contain the issue.
2. Rotate any exposed credentials immediately.
3. Patch the vulnerability.
4. Notify affected users if data was compromised.
5. Document the incident and the fix in this file's changelog.

## 12. Changelog

- **YYYY-MM-DD** — Security update or incident note.
