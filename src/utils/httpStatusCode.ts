/** ステータスコード */
export const HTTP_STATUS_CODE = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  /** 認証 */
  UNAUTHORIZED: 401,
  /** 認可、許可されていない系に使う */
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;
