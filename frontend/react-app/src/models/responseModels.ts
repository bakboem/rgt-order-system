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



export class MenuRequestModel {
  name: string;
  price: number;
  image_url:string|null;
  stock: number;
  constructor(name:string,price :number,stock:number,image_url:string = '') {
    this.name = name;
    this.price = price;
    this.stock = stock;
    this.image_url = image_url
  }
}

export class MenuResponseModel {
  id: string;
  name: string;
  image_url: string;
  price: number;
  stock: number;

  constructor(id: string,name:string,image_url : string,price :number,stock:number) {
  
    this.id = id;
    this.name = name;
    this.image_url = image_url;
    this.price = price;
    this.stock = stock;
  }
}

export class OrderResponseModel {
  id: string;
  state : string
  quantity: number;
  menu_id: string;
  biz_id: string;
  menu: MenuResponseModel;

  constructor(id: string,state:string,quantity:number,menu_id : string,biz_id :string,menu: MenuResponseModel) {
  
    this.id = id;
    this.state = state
    this.quantity = quantity;
    this.menu_id = menu_id;
    this.biz_id = biz_id;
    this.menu = menu;
  }
}

export class CommonResponseModel {
  message: string;


  constructor(message:string) {
  
    this.message = message;

  }
}