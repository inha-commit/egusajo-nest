import { Injectable } from '@nestjs/common';
import AWS, { S3 } from 'aws-sdk';
import sharp from 'sharp';

@Injectable()
export class ImagesService {
  private readonly s3: S3;

  constructor() {
    AWS.config.update({
      region: process.env.S3_REGION,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_KEY,
      },
    });
    this.s3 = new AWS.S3();
  }

  async uploadImages(
    files: Express.MulterS3.File[],
    type: string,
  ): Promise<string[]> {
    const ImageSrc: string[] = [];

    await Promise.all(
      files.map(async (file: Express.MulterS3.File) => {
        const key = `${type}/${Date.now() + file.originalname}`;

        const resizedBuffer = this.resizeImage(file.buffer);

        const fileUrl = `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${key}`;

        ImageSrc.push(fileUrl);

        const params = {
          Bucket: process.env.S3_BUCKET_NAME,
          ACL: 'private',
          Key: key,
          Body: resizedBuffer,
          ContentEncoding: 'base64',
          ContentType: file.mimetype,
          ContentDisposition: 'inline',
        };

        await this.uploadImage(params);
      }),
    );

    return ImageSrc;
  }

  /**
   * 이미지 resize
   * @param buffer
   */
  async resizeImage(buffer: Buffer): Promise<Buffer> {
    return sharp(buffer).resize().withMetadata().toBuffer();
  }

  /**
   * 이미지 s3에 upload
   * @param params
   */
  async uploadImage(params: S3.PutObjectRequest): Promise<void> {
    await this.s3.putObject(params).promise();
  }
}
