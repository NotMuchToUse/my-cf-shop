import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

export type ToastType = "success" | "error" | "warning" | "info";

const backgroundColors: Record<ToastType, string> = {
  success: "linear-gradient(to right, #00b09b, #96c93d)",
  error: "linear-gradient(to right, #ff5f6d, #ffc371)",
  warning: "linear-gradient(to right, #f2994a, #f2c94c)",
  info: "linear-gradient(to right, #2193b0, #6dd5ed)",
};

export const showToast = (message: string, type: ToastType = "info") => {
  Toastify({
    text: message,
    duration: 3000,
    close: true,
    gravity: "top",
    position: "right",
    stopOnFocus: true,

    style: {
      background: backgroundColors[type],
      borderRadius: "8px",
      fontSize: "14px",
      fontWeight: "500",
      boxShadow: "0 4px 15px rgba(0, 0, 0, 0.15)",
      padding: "12px 20px",
      fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    },

    onClick: function () {},
  }).showToast();
};
