"use client";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

export const AppSwal = Swal.mixin({
  background: "#0b2948",
  color: "#eef7ff",
  confirmButtonColor: "#ffbd18",
  cancelButtonColor: "#38536d",
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
    timer: 2200,
    timerProgressBar: true,
  });
export const popupError = (title: string, text?: string) =>
  AppSwal.fire({ icon: "error", title, text });
