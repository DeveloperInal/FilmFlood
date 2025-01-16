import {
    Post,
    UploadedFile,
    UseInterceptors,
    Controller,
    Res,
} from '@nestjs/common';
import { FileInterceptor } from "@nestjs/platform-express"
import { S3Service } from "./s3.service";
import { Response } from "express"

@Controller('s3-client')
export class S3Controller {
    constructor(private readonly s3Service: S3Service) {}

    @Post('upload-file')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response
    ) {
    try {
        if (!file) {
            return res.status(400).json({ error: 'File is missing' });
        }
        await this.s3Service.upload(file.originalname, file.buffer);
        return res.json({ message: 'File uploaded successfully' });
    } catch (error) {
            console.error('Error during file upload:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}