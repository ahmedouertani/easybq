import swal from 'sweetalert2';

const displayAlert = (
  title: string,
  text: string,
  confirmButtonText: string,
  icon: 'success' | 'error' | 'warning' | 'info' | 'question',
  footer?: string,
): void => {
  swal.fire({
    title,
    text,
    icon,
    confirmButtonText,
    footer,
    confirmButtonColor: '#5086ec'
  });
};

export const displayLoading = (
  title: string,
  text: string,
): void => {
  swal.fire({
    title,
    text,
    showConfirmButton: false,
    allowOutsideClick: false,
    allowEscapeKey: false,
    allowEnterKey: false,
    backdrop: true,
  });
};

export const handleResponseSuccessWithAlerts = (
  title: string,
  message: string,
  close: string,
  bootstrap: () => void = () => { },
  footer?: string,
) => {
  bootstrap();
  displayAlert(
    title,
    message,
    close,
    'success',
    footer,
  );
};

export const handleResponseErrorWithAlerts = (
  title: string,
  message: string,
  close: string,
  footer?: string,
): void => {
  displayAlert(
    title,
    message,
    close,
    'error',
    footer,
  );
};

export const displayConfirmationAlert = (
  title: string,
  confirmButtonText: string,
  cancelButtonText: string,
) => {
  return swal.fire({
    title,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#5086ec',
    cancelButtonColor: '#d33',
    confirmButtonText,
    cancelButtonText,
  });
}

export const handleResponseWithAlerts = (
  title: string,
  message: string,
  close: string,
  bootstrap: () => void = () => { },
  footer?: string,
) => {
  bootstrap();
  displayAlert(
    title,
    message,
    close,
    'error',
    footer,
  );
};


export const closeDialogs = swal.close;
