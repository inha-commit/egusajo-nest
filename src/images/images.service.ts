import { Injectable } from '@nestjs/common';
import AWS, { S3 } from 'aws-sdk';

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
    files.map(async (file: Express.MulterS3.File) => {
      const key = `${type}/${Date.now() + file.originalname}`;
      const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        ACL: 'private',
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      };

      const fileUrl = `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${key}`;

      ImageSrc.push(fileUrl);

      await this.s3.putObject(params).promise();
    });

    return ImageSrc;
  }
}
