from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.send_email_router import router as email_router
from loguru import logger
import uvicorn

async def lifespan(app: FastAPI):
    logger.info("FastApi Started")
    yield
    logger.info("FastApi Stopped")

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(email_router)

if __name__ == '__main__':
    uvicorn.run(
        app="main:app",
        reload=True,
)