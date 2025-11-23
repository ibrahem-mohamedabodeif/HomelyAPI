/* eslint-disable @typescript-eslint/no-unsafe-assignment */
export class DefaultResponseDto {
  constructor(payload: { message: string; data?: any }) {
    this.message = payload.message;
    this.data = payload.data;
  }
  message: string;
  data?: any;
}
