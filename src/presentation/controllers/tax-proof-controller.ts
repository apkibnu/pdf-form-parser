import {
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  ParseFilePipe,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { IMulterFile } from 'src/libs/multer';
import { TaxProofService } from 'src/services/tax-proof-service';
import { Response } from 'express';

@Controller('tax-proof')
export class TaxProofController {
  constructor(private taxProofService: TaxProofService) {}

  @Get()
  @UseInterceptors(
    FileInterceptor('file', {
      dest: 'upload',
    }),
  )
  async upload(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 2097152 }),
          new FileTypeValidator({ fileType: 'pdf' }),
        ],
      }),
    )
    file: IMulterFile,
    @Res() res: Response,
  ): Promise<Response> {
    const pdfBuffer = await this.taxProofService.extractForm(file.path);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=extracted-data.pdf`,
    );
    return res.status(200).send(pdfBuffer);
  }
}
