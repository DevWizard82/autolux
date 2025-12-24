import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

export const toast = {
  success(message) {
    iziToast.success({
      title: "Success",
      message,
      position: "topRight",
      timeout: 4000,
      progressBar: true,
    });
  },
  error(message) {
    iziToast.error({
      title: "Error",
      message,
      position: "topRight",
      timeout: 5000,
      progressBar: true,
    });
  },
};
