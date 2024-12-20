from fastapi import APIRouter, HTTPException
from pydantic import EmailStr
from loguru import logger
from .code_send_email import email_sender

router = APIRouter(tags=['EmailService'], prefix='/api/v1')

# Функция для отправки кода
async def send_email(user_email: str):
    try:
        code = await email_sender.send_code_to_email(user_email)
        return code
    except Exception as e:
        logger.warning({str(e)})
        raise HTTPException(status_code=500, detail=f"Ошибка при отправке кода: {str(e)}")

# Функция для сравнения кода
async def comparison(verify_code: int):
    try:
        is_valid = await email_sender.compare_code(verify_code)
        return is_valid
    except Exception as e:
        logger.warning({str(e)})
        raise HTTPException(status_code=500, detail=f"Ошибка при проверке кода: {str(e)}")

# Маршрут для отправки email
@router.post('/send_email')
async def send_email_code(email: EmailStr):  # Валидируем email
    code = await send_email(user_email=email)
    return code

# Маршрут для проверки кода
@router.post('/verify_code')
async def verify_code(code: int):
    is_valid = await comparison(verify_code=code)
    if is_valid:
        return True
    else:
        raise HTTPException(status_code=400, detail="Неверный код")
