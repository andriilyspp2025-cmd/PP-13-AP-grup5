from typing import List
from datetime import datetime, timedelta
from jose import jwt
from app.core.config import settings
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


def create_verification_token(email: str) -> str:
    """Create email verification token."""
    expire = datetime.utcnow() + timedelta(hours=24)
    to_encode = {"sub": email, "exp": expire, "type": "email_verification"}
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def verify_token(token: str) -> str:
    """Verify email verification token and return email."""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        token_type: str = payload.get("type")
        
        if token_type != "email_verification":
            return None
        return email
    except:
        return None


def send_verification_email(email: str, token: str):
    """Send verification email to user."""
    # В production використовуйте справжній SMTP сервер
    # Зараз просто логуємо токен
    verification_url = f"{settings.FRONTEND_URL}/verify-email?token={token}"
    
    print(f"\n{'='*60}")
    print(f"📧 EMAIL VERIFICATION")
    print(f"{'='*60}")
    print(f"To: {email}")
    print(f"Subject: Підтвердження email - Rozklad")
    print(f"\nПерейдіть за посиланням для підтвердження:")
    print(f"{verification_url}")
    print(f"{'='*60}\n")
    
    # Якщо налаштований SMTP:
    try:
        if settings.MAIL_USERNAME and settings.MAIL_PASSWORD:
            print(f"📤 Відправка email через SMTP...")
            send_smtp_email(
                to_email=email,
                subject="Підтвердження email - Rozklad",
                body=f"""
                <html>
                <body style="font-family: Arial, sans-serif; padding: 20px;">
                    <div style="max-width: 600px; margin: 0 auto; background: #f9fafb; padding: 30px; border-radius: 10px;">
                        <h1 style="color: #0ea5e9;">Вітаємо в Rozklad!</h1>
                        <p style="font-size: 16px; color: #374151;">
                            Дякуємо за реєстрацію! Будь ласка, підтвердіть свою email адресу, натиснувши на кнопку нижче:
                        </p>
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="{verification_url}" 
                               style="background: #0ea5e9; color: white; padding: 15px 30px; 
                                      text-decoration: none; border-radius: 5px; font-weight: bold;
                                      display: inline-block;">
                                Підтвердити Email
                            </a>
                        </div>
                        <p style="color: #6b7280; font-size: 14px;">
                            Або скопіюйте це посилання у браузер:<br>
                            <a href="{verification_url}" style="color: #0ea5e9;">{verification_url}</a>
                        </p>
                        <p style="color: #9ca3af; font-size: 12px; margin-top: 30px;">
                            Посилання дійсне протягом 24 годин.
                        </p>
                    </div>
                </body>
                </html>
                """
            )
            print(f"✅ Email успішно відправлено на {email}!")
        else:
            print(f"⚠️ SMTP не налаштований. Email НЕ відправлено.")
    except Exception as e:
        print(f"❌ Помилка відправки email: {e}")
        import traceback
        traceback.print_exc()


def send_smtp_email(to_email: str, subject: str, body: str):
    """Send email using SMTP."""
    msg = MIMEMultipart('alternative')
    msg['Subject'] = subject
    msg['From'] = settings.MAIL_FROM
    msg['To'] = to_email
    
    html_part = MIMEText(body, 'html')
    msg.attach(html_part)
    
    with smtplib.SMTP(settings.MAIL_SERVER, settings.MAIL_PORT) as server:
        if settings.MAIL_TLS:
            server.starttls()
        server.login(settings.MAIL_USERNAME, settings.MAIL_PASSWORD)
        server.send_message(msg)


def send_password_reset_email(email: str, token: str):
    """Send password reset email."""
    reset_url = f"{settings.FRONTEND_URL}/reset-password?token={token}"
    
    print(f"\n{'='*60}")
    print(f"🔐 PASSWORD RESET")
    print(f"{'='*60}")
    print(f"To: {email}")
    print(f"Subject: Скидання паролю - Rozklad")
    print(f"\nПерейдіть за посиланням для скидання паролю:")
    print(f"{reset_url}")
    print(f"{'='*60}\n")

