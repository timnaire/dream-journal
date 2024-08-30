import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

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

export class S3Service {
  // Retrieve file from s3
  get = async (filename: string) => {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: filename,
    });

    try {
      return await s3Client.send(command);
      // The Body object also has 'transformToByteArray' and 'transformToWebStream' methods.
      // const str = await response.Body?.transformToString();
      // console.log(str);
    } catch (error) {
      console.error(`Error retrieving file ${filename}:`, error);
      throw error;
    }
  };

  // Upload a file to s3
  upload = async (filename: string, file: File, ContentType: string) => {
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: filename,
      Body: file,
      ContentType,
    });

    try {
      return await s3Client.send(command);
    } catch (error) {
      console.error(`Error uploading file ${filename}:`, error);
      throw error;
    }
  };
}
