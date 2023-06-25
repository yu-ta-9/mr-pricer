declare namespace NodeJS {
  interface ProcessEnv {
    /** next.js host */
    readonly NEXT_PUBLIC_BASE_URL: string;
    /** next-authの設定値 */
    readonly NEXTAUTH_URL: string;
    /** next-authの設定値 */
    readonly NEXTAUTH_SECRET: string;
    /** google OAuthの設定値  */
    readonly GOOGLE_CLIENT_ID: string;
    /** google OAuthの設定値 */
    readonly GOOGLE_CLIENT_SECRET: string;
    /** DB URL */
    readonly DATABASE_URL: string;
    /** AWSのアクセスキー */
    readonly AWS_ACCESS_KEY: string;
    /** AWSのシークレット */
    readonly AWS_SECRET_KEY: string;
    /** AWSのリージョン */
    readonly AWS_REGION: string;
    /** s3 bucket name */
    readonly S3_BUCKET_NAME: string;
  }
}
