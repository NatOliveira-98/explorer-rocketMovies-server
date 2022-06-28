export enum StatusCode {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

interface AppErrorTypes {
  description: string;
  httpCode: StatusCode;
}

export class AppError extends Error {
  readonly httpCode: StatusCode;

  constructor(args: AppErrorTypes) {
    super(args.description);

    Object.setPrototypeOf(this, new.target.prototype);

    this.httpCode = args.httpCode;

    Error.captureStackTrace(this);
  }
}
