import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { useContext } from 'react';
import { AppContext } from '../../core/context/AppContext';

// S3 Client Configuration
const s3Config = {
  region: 'ap-southeast-1',
  credentials: {
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY || '',
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_KEY || '',
  },
};

// Initialize the S3 Client
const s3Client = new S3Client(s3Config);
const BUCKET_NAME = 'dream-journal-blob';

export enum BlobType {
  Image,
  Audio,
}

export class S3Service {
  app = useContext(AppContext);

  // Retrieve file from s3
  get = async (filename: string, blobType: BlobType = BlobType.Image) => {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: this.generatePath(filename, blobType),
    });

    try {
      return await s3Client.send(command);
    } catch (error) {
      console.error(`Error retrieving file ${filename}:`, error);
      throw error;
    }
  };

  // Upload a file to s3
  upload = async (filename: string, file: File, ContentType: string, blobType: BlobType = BlobType.Image) => {
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: this.generatePath(filename, blobType),
      Body: file,
      ContentType,
    });

    const fileUrl = `https://${BUCKET_NAME}.s3.${s3Config.region}.amazonaws.com/${this.generatePath(filename, blobType)}`;

    try {
      await s3Client.send(command);

      return { fileUrl, filename };
    } catch (error) {
      console.error(`Error uploading file ${filename}:`, error);
      throw error;
    }
  };

  private generatePath(filename: string, type: BlobType): string {
    let path = `users`;

    switch (type) {
      case BlobType.Image:
        path = `${path}/${this.app.user?.id}/media/${filename}`;
        break;
      case BlobType.Audio:
        path = `${path}/${this.app.user?.id}/audio/${filename}`;
        break;
      default:
        path = filename;
    }

    return path;
  }
}
