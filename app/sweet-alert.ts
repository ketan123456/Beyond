"use client";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

export const AppSwal = Swal.mixin({
  background: "#ffffff",
  color: "#1f2937",
  buttonsStyling: false,
  showClass: {
    popup: "swal2-show beyond-swal-enter",
  },
  hideClass: {
    popup: "swal2-hide beyond-swal-exit",
  },
  customClass: {
    popup: "beyond-swal",
    confirmButton: "beyond-swal-confirm",
    cancelButton: "beyond-swal-cancel",
  },
});
export const confirmDelete = (
  title: string,
  text = "This action cannot be undone.",
) =>
  AppSwal.fire({
    icon: "warning",
    title,
    text,
    showCancelButton: true,
    confirmButtonText: "Yes, delete",
    cancelButtonText: "Cancel",
    reverseButtons: true,
    focusCancel: true,
  });
export const popupSuccess = (title: string, text?: string) =>
  AppSwal.fire({
    icon: "success",
    title,
    text,
    confirmButtonText: "Great!",
    timer: 2200,
    timerProgressBar: true,
  });
export const popupError = (title: string, text?: string) =>
  AppSwal.fire({ icon: "error", title, text, confirmButtonText: "Okay" });
