import { Expose, Transform } from "class-transformer";



export class StaffModel {
    @Expose({ name: "username" })
    userName: string;
    constructor(
      userName: string,
    ) {
      this.userName = userName;
    }
  }