import { Expose } from "class-transformer";

export class ResponseModel<T> {
  message: string;
  statusCode: number;
  data: T;

  constructor(message: string, statusCode: number, data: T) {
    this.message = message;
    this.statusCode = statusCode;
    this.data = data;
  }
}


export class LoginResponseModel {
  @Expose({ name: "access_token" })
  access_token: string;

  constructor(access_token: string) {
  
    this.access_token = access_token;
  }
}