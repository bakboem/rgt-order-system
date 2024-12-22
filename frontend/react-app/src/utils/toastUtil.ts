import { toast } from "react-toastify";

export function showSuccessToast  (msg:string){
    toast.success(msg,
        {
          position: 'top-right',
          autoClose: 3000
        },
      );
}
export function showWarnToast  (msg:string){
    toast.warn(msg,
        {
          position: 'top-right',
          autoClose: 3000
        },
      );
}
export function showErrorToast  (msg:string){
    toast.error(msg,
        {
          position: 'top-right',
          autoClose: 3000
        },
      );
}