import Swal from 'sweetalert2';

const SweetAlertComponent = {
  success: (title , text) => {
    return Swal.fire({
      icon: 'success',
      title: title,
      text: text,
    });
  },

  error: (title , text ) => {
    return Swal.fire({
      icon: 'error',
      title: title,
      text: text,
    });
  },

};

export default SweetAlertComponent;
