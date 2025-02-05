// EmailVerification
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as process from "node:process";

@Injectable()
export class EmailService {
    async sendEmail(email: string) {
        const url = process.env.FASTAPI_URL// Функция отправки кода на почту
        const sendUrl = `${url}/api/v1/send_email?email=`;
        const email_post = await axios.get(`${sendUrl}${email}`);
        return email_post.data;
    }

    async compration_code(code: number): Promise<boolean> {
        const url = process.env.FASTAPI_URL// Функция отправки кода на почту// Функия проверки кода
        const comprationUrl = `${url}/api/v1/verify_code?code=`;
        const response = await axios.get(`${comprationUrl}${code}`);
        return response.data === true;
    }
}
