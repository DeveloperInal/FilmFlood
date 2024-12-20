import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from loguru import logger
from random import randint
from core.settings import settings

class EmailSender:
    def __init__(
            self,
            smtp_host: str,
            smtp_port: int,
            email: str,
            password: str,
            use_ssl: bool = False
    ):
        self.smtp_host = smtp_host
        self.smtp_port = smtp_port
        self.email = email
        self.password = password
        self.use_ssl = use_ssl
        self.generated_code = None

    @staticmethod
    async def generate_code():
        random_number = randint(100000, 999999)
        return random_number

    async def create_message(
            self,
            to_email: str,
            subject: str,
            html_content: str,
    ) -> MIMEMultipart:
        msg = MIMEMultipart("alternative")
        msg["From"] = self.email
        msg["To"] = to_email
        msg["Subject"] = subject

        html_part = MIMEText(html_content, "html")
        msg.attach(html_part)

        return msg

    async def send(self, msg: MIMEMultipart):
        try:
            if self.use_ssl:
                with smtplib.SMTP_SSL(self.smtp_host, self.smtp_port) as server:
                    server.login(self.email, self.password)
                    server.sendmail(msg["From"], msg["To"], msg.as_string())
            else:
                with smtplib.SMTP(self.smtp_host, self.smtp_port) as server:
                    server.ehlo()
                    server.starttls()
                    server.login(self.email, self.password)
                    server.sendmail(msg["From"], msg["To"], msg.as_string())
            logger.info("Письмо успешно отправлено %s", msg["To"])
        except smtplib.SMTPException as exc:
            logger.error("Не удалось отправить почту из-за ошибки SMTP: %s", exc)
            raise
        except Exception as exc:
            logger.error("Ошибка отправки письма: %s", exc)
            raise

    async def send_code_to_email(self, to_email: str):
        code = await self.generate_code()
        self.generated_code = code
        subject = "Your Verification Code"
        html_content = f"<h3>Твой верификационный код: {code}</h3>"
        msg = await self.create_message(to_email, subject, html_content)
        await self.send(msg)
        return code

    async def compare_code(self, user_code: int) -> bool:
        """Функция для сравнения введенного кода со сгенерированным."""
        if self.generated_code is None:
            raise ValueError("Код еще не был сгенерирован.")
        return user_code == self.generated_code

# Пример использования
email_sender = EmailSender(
        smtp_host=settings.smtp.host,
        smtp_port=settings.smtp.port,
        email=settings.smtp.username,
        password=settings.smtp.smtp_pass
)