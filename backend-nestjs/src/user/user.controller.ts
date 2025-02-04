import { Controller, Get, Post, Req, Res, UploadedFile, UseInterceptors, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { FileInterceptor } from "@nestjs/platform-express"
import { Request, Response } from 'express';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}

  @Get('profile/:userId')
  async getProfile(
    @Param('userId') userId: string
  ) {
    return this.userService.getUserProfile(userId);
  }

  @Post('comment/:userId')
  async createComment(
    @Req() req: Request,
    @Param('userId') userId: string
  ) {
    const { filmName, text, rating } = req.body;
    return this.userService.createComment(filmName, userId, text, rating);
  }

  @Post('image/:userId')
  @UseInterceptors(FileInterceptor('file'))
  async createUserImage(
    @Res() res: Response,
    @Param('userId') userId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      if (!file) {
        return res.status(400).json({ errorMessage: 'File is missing' });
      }
      await this.userService.createUserImage(file.buffer, userId);
      return res.status(200).json({ message: 'Image uploaded successfully' });
    }
    catch (error) {
      console.error('Error during image upload:', error);
      return res.status(500).json({ errorMessage: 'Internal Server Error', error });
    }
  }
}
