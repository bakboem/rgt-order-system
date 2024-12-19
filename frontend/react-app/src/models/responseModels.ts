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

export class UserResponseModel {

  id: string;
  name: string;
  role: string;

  constructor(id: string,name:string,role : string) {
  
    this.id = id;
    this.name = name;
    this.role = role;
  }
}


export class BizResponseModel {
  id: string;
  biz_name: string;
  role: string;

  constructor(id: string,biz_name:string,role : string) {
  
    this.id = id;
    this.biz_name = biz_name;
    this.role = role;
  }
}