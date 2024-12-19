import { Expose, Transform } from 'class-transformer';

export class UserModel {
  @Expose({ name: 'username' })
  userName: string;
  constructor(userName: string) {
    this.userName = userName;
  }
}
