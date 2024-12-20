export class CreateOrderModel {
    menu_id: string;
    quantity: number;
  
    constructor(menu_id: string,quantity:number) {
    
      this.menu_id = menu_id;
      this.quantity = quantity;
    }
  }
