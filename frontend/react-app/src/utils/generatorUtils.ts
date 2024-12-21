export function generateDefaultOrder(params: {
  order_id: string;
  state: string;
  biz_id: string;
}) {
  const model = {
    id: params.order_id,
    state: params.state,
    quantity: 0,
    menu_id: '',
    biz_id: params.biz_id,
    menu: {
      id: '',
      name: '',
      image_url: '',
      price: 0,
      stock: 0,
    },
  };
  return model;
}
