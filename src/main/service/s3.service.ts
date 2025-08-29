import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';

@Injectable()
export class S3Service {
  private readonly s3: S3Client;
  private readonly bucketName: string;
  private readonly publicBaseUrl?: string;

  constructor(private readonly configService: ConfigService) {
    const region = this.configService.get<string>('AWS_REGION');
    const accessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.get<string>('AWS_SECRET_ACCESS_KEY');
    this.bucketName = this.configService.get<string>('AWS_S3_BUCKET');
    this.publicBaseUrl = this.configService.get<string>('AWS_S3_BASE_URL');

    this.s3 = new S3Client({
      region,
      credentials: accessKeyId && secretAccessKey ? { accessKeyId, secretAccessKey } : undefined,
    });
  }

  async uploadBuffer(params: {
    buffer: Buffer;
    contentType: string;
    keyPrefix?: string;
    originalName?: string;
    acl?: 'private' | 'public-read';
  }): Promise<{ key: string; url: string }>
  {
    const ext = params.originalName?.split('.').pop() || params.contentType?.split('/').pop() || 'bin';
    const key = `${params.keyPrefix || 'products'}/${randomUUID()}.${ext}`;

    await this.s3.send(new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: params.buffer,
      ContentType: params.contentType,
      ACL: params.acl || 'public-read',
    }));

    const url = this.publicBaseUrl
      ? `${this.publicBaseUrl.replace(/\/$/, '')}/${key}`
      : `https://${this.bucketName}.s3.${this.configService.get<string>('AWS_REGION')}.amazonaws.com/${key}`;

    return { key, url };
  }
}


