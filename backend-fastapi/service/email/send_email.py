from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from fastapi.templating import Jinja2Templates
from pydantic import EmailStr
from random import randint
from loguru import logger
from core.config import config_smtp_server

templates = Jinja2Templates(directory="templates")

class EmailSender:
    def __init__(self):
        self.conf = ConnectionConfig(
            MAIL_USERNAME=config_smtp_server.MAIL_USERNAME,
            MAIL_PASSWORD=config_smtp_server.MAIL_PASSWORD,
            MAIL_FROM=config_smtp_server.MAIL_FROM,
            MAIL_PORT=config_smtp_server.MAIL_PORT,
            MAIL_SERVER=config_smtp_server.MAIL_SERVER,
            MAIL_STARTTLS=True,  # Или False, в зависимости от вашего сервера
            MAIL_SSL_TLS=False,  # Или True, если используете SSL/TLS
            USE_CREDENTIALS=True
        )
        self.mailer = FastMail(self.conf)
        self.generated_code: int | None = None

    async def generate_code(self) -> int:
        """Генерирует случайный шестизначный код."""
        self.generated_code = randint(100000, 999999)
        return self.generated_code

    async def send_code_to_email(self, to_email: EmailStr):
        """Отправляет код подтверждения на указанный email."""
        code = await self.generate_code()
        self.generated_code = code

        # Рендеринг HTML-шаблона с переданными данными
        template = templates.get_template('code.html')
        rendered_html = template.render(code=code)

        message = MessageSchema(
            subject="Your Verification Code",
            recipients=[to_email],
            body=rendered_html,
            subtype="html"
        )

        try:
            await self.mailer.send_message(message)
            logger.info("Письмо успешно отправлено на %s", to_email)
        except Exception as exc:
            logger.error("Ошибка при отправке письма: %s", exc)
            raise

        return code

    async def compare_code(self, user_code: int) -> bool:
        """Функция для сравнения введенного кода со сгенерированным."""
        if self.generated_code is None:
            raise ValueError("Код еще не был сгенерирован.")
        return user_code == self.generated_code
