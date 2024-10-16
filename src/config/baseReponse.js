import { DEFINE_STATUS_RESPONSE } from "./statusResponse";

export class BaseResponse {
  constructor({ status, data, message }) {
    this.status = status;
    this.message = message;
    this.data = data;
  }
}

export class BaseResponseList extends BaseResponse {
  constructor({ status, list, totalCount, message }) {
    const data = { content: list, totalCount }
    super({ status, data, message });
  }
}

export class BaseErrorResponse extends BaseResponse {
  constructor({ message }) {
    super(null, message);
    this.status = DEFINE_STATUS_RESPONSE.ERROR;
  }
}

export class BaseSuccessResponse extends BaseResponse {
  constructor({ data, message }) {
    super(data ?? null, message);
    this.status = DEFINE_STATUS_RESPONSE.SUCCESS;
  }
}
