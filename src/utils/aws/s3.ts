import process from 'process';

import { S3Client, GetObjectCommand, DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

/**
 * プロフィールアイコンのs3Key
 */
const getProfileIconS3Key = (userId: string, profileId: string, key: string) => {
  return `${userId}/${profileId}/${key}`;
};

/**
 * s3の署名付きURLを取得する
 * @param key
 * @returns
 */
export const getS3PresignedUrl = async (userId: string, profileId: string, key: string) => {
  const client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });
  const command = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: getProfileIconS3Key(userId, profileId, key),
  });
  return await getSignedUrl(client as any, command as any, { expiresIn: 3600 });
};

export const uploadFileToS3 = async (file: File, userId: string, profileId: string, key: string) => {
  const client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });

  const data = await file.arrayBuffer();
  await client.send(
    new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: getProfileIconS3Key(userId, profileId, key),
      // MEMO: arrayBufferでないと正常にアップロードできないがSDKの型に阻まれるのでanyでキャストする
      Body: data as any,
    }),
  );
};

/**
 * S3からファイルを削除する
 */
export const deleteFileOnS3 = async (userId: string, profileId: string, key: string) => {
  const client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });

  await client.send(
    new DeleteObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: getProfileIconS3Key(userId, profileId, key),
    }),
  );
};
