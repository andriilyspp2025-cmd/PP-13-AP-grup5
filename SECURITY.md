# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability in Rozklad, please follow these steps:

### 1. **DO NOT** open a public issue

Security vulnerabilities should not be disclosed publicly until a fix is available.

### 2. Report privately

Send an email to: **security@rozklad.com** (or create a private security advisory on GitHub)

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

### 3. Response time

- **Initial response**: Within 48 hours
- **Status update**: Within 7 days
- **Fix timeline**: Depends on severity

### 4. Disclosure process

1. We'll confirm the vulnerability
2. We'll develop and test a fix
3. We'll release a security patch
4. Public disclosure after fix is available

## Security Best Practices

### For Developers

- Never commit sensitive data (passwords, API keys, tokens)
- Use environment variables for secrets
- Review code for SQL injection, XSS, CSRF vulnerabilities
- Keep dependencies updated
- Use prepared statements for database queries
- Validate and sanitize all user inputs

### For Deployment

**Critical security steps before production:**

1. **Change default credentials**
   ```bash
   # Default admin: admin/admin123
   # MUST be changed in production!
   ```

2. **Configure strong SECRET_KEY**
   ```bash
   # In backend/.env
   SECRET_KEY=use-a-long-random-string-at-least-32-characters
   ```

3. **Enable HTTPS/SSL**
   - Use SSL certificates
   - Redirect HTTP to HTTPS
   - Set secure cookie flags

4. **Configure CORS properly**
   ```python
   # In backend/app/core/config.py
   ALLOWED_ORIGINS = ["https://yourdomain.com"]  # NOT "*"
   ```

5. **Secure database**
   - Use strong database passwords
   - Restrict database access
   - Enable SSL for database connections
   - Regular backups

6. **Environment variables**
   - Never commit `.env` files
   - Use secrets management (AWS Secrets, HashiCorp Vault, etc.)
   - Rotate credentials regularly

7. **Rate limiting**
   - Implement API rate limiting
   - Protect against brute force attacks
   - Use CAPTCHA for sensitive operations

8. **Security headers**
   ```python
   # Add security headers to responses
   X-Content-Type-Options: nosniff
   X-Frame-Options: DENY
   X-XSS-Protection: 1; mode=block
   Strict-Transport-Security: max-age=31536000
   ```

## Known Security Features

✅ **Already implemented:**
- JWT-based authentication
- Password hashing with bcrypt
- Email verification
- Role-based access control (RBAC)
- SQL injection protection (SQLAlchemy ORM)
- Input validation (Pydantic)

⚠️ **Requires configuration:**
- HTTPS/SSL (production deployment)
- Rate limiting (production deployment)
- Email verification (SMTP setup)
- Secure session management

## Security Checklist

Before going to production:

- [ ] Change default admin password
- [ ] Set strong SECRET_KEY
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS properly
- [ ] Use strong database password
- [ ] Enable email verification
- [ ] Implement rate limiting
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy
- [ ] Review all environment variables
- [ ] Test authentication flows
- [ ] Scan for vulnerabilities (OWASP ZAP, etc.)
- [ ] Set up automatic security updates

## Dependencies

Keep all dependencies updated:

```bash
# Backend
pip list --outdated
pip install --upgrade package-name

# Frontend
npm outdated
npm update

# Security audit
npm audit
pip-audit  # Install: pip install pip-audit
```

## References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [FastAPI Security](https://fastapi.tiangolo.com/tutorial/security/)
- [React Security Best Practices](https://snyk.io/blog/10-react-security-best-practices/)

## Questions?

For security-related questions (non-vulnerabilities), open a GitHub Discussion or contact the maintainers.

---

**Thank you for helping keep Rozklad secure!** 🔒


