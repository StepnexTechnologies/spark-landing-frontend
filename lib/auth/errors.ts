// Error envelope shared across every /v1/creator/auth/* response. Server
// always returns { message_code, message_params, detail?, errors? } on 4xx;
// AuthApiError carries the parsed envelope plus the HTTP status so callers
// can branch on either.

export type MessageCode =
  | "INVALID_OTP"
  | "OTP_EXPIRED"
  | "EMAIL_ALREADY_IN_USE"
  | "PHONE_ALREADY_IN_USE"
  | "USER_NOT_FOUND"
  | "VALIDATION_ERROR"
  | "EMAIL_REQUIRED_FOR_EMAIL_CHANNEL"
  | "PHONE_REQUIRED_FOR_PHONE_CHANNEL"
  | "REFRESH_TOKEN_NOT_FOUND"
  | "INVALID_REFRESH_TOKEN"
  | "NETWORK_ERROR"
  | (string & {});

export interface AuthApiFieldError {
  field: string;
  type: string;
  message: string;
}

export class AuthApiError extends Error {
  readonly status: number;
  readonly messageCode: MessageCode;
  readonly detail?: string;
  readonly errors?: AuthApiFieldError[];

  constructor(
    status: number,
    messageCode: MessageCode,
    detail?: string,
    errors?: AuthApiFieldError[],
  ) {
    super(detail ?? messageCode);
    this.name = "AuthApiError";
    this.status = status;
    this.messageCode = messageCode;
    this.detail = detail;
    this.errors = errors;
  }
}
