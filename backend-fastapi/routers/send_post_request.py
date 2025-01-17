from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import JSONResponse
from pydantic import EmailStr
from loguru import logger
from service.email.code_send_email import EmailSender

email_sender = EmailSender()
router = APIRouter(tags=['EmailService'], prefix='/api/v1')

# Маршрут для отправки email
@router.get("/send_email", response_class=JSONResponse)
async def send_email(email: EmailStr = Query(...)):
    """
    Отправляет письмо с кодом
    """
    try:
        code = await email_sender.send_code_to_email(email)
        return JSONResponse(
            status_code=200,
            content=code
        )
    except Exception as e:
        return JSONResponse(
            status_code=400,
            content={"message": f"Произошла ошибка: {str(e)}"}
        )

# Маршрут для проверки кода
@router.get('/verify_code')
async def verify_code(code: int):
    """
    Проверяет код с почты
    """
    try:
        is_valid = await email_sender.compare_code(user_code=code)
        if is_valid:
            return True
        else:
            return False
    except Exception as e:
        logger.warning({str(e)})
        raise HTTPException(status_code=500, detail=f"Ошибка при проверке кода: {str(e)}")

