import Swal from "sweetalert2";
export function showLoadingAlert(message)
{
  // to show loading message and spinner
    Swal.fire({
        title: message,
        allowOutsideClick: false,
        allowEscapeKey: false,
        showCancelButton: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
}