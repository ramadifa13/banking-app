import Swal from 'sweetalert2';

export const showAlert = ({ icon, title, text }) => {
  Swal.fire({
    icon: icon,
    title: title,
    text: text,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
  });
};
