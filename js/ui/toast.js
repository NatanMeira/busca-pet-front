function showToast(message, title = "Notificação", type = "info") {
  const toastElement = document.getElementById("alertToast");
  const toastTitle = document.getElementById("toastTitle");
  const toastMessage = document.getElementById("toastMessage");
  const toastIcon = document.getElementById("toastIcon");

  if (!toastElement || !toastTitle || !toastMessage || !toastIcon) {
    console.error(`Toast cannot display message: "${title}: ${message}"`);
    return;
  }

  toastTitle.textContent = title;
  toastMessage.textContent = message;

  toastElement.className = "toast";
  toastIcon.className = "me-2";

  switch (type) {
    case "success":
      toastElement.classList.add("text-bg-success");
      toastIcon.classList.add("fas", "fa-check-circle");
      break;
    case "danger":
      toastElement.classList.add("text-bg-danger");
      toastIcon.classList.add("fas", "fa-exclamation-circle");
      break;
    case "warning":
      toastElement.classList.add("text-bg-warning");
      toastIcon.classList.add("fas", "fa-exclamation-triangle");
      break;
    default:
      toastElement.classList.add("text-bg-info");
      toastIcon.classList.add("fas", "fa-info-circle");
  }

  const toast = new bootstrap.Toast(toastElement, {
    autohide: true,
    delay: type === "danger" ? 5000 : 3000,
  });
  toast.show();
}

function showErrorToast(error, fallbackMessage = "Ocorreu um erro inesperado") {
  const message = error.message || fallbackMessage;
  console.log("Showing error toast:", message);
  showToast(message, "Erro", "danger");
  console.error("API Error:", error);
}

function showSuccessToast(
  response,
  defaultMessage = "Operação realizada com sucesso"
) {
  const message = response.message || defaultMessage;
  console.log("Showing success toast:", message);
  showToast(message, "Sucesso", "success");
}

window.showToast = showToast;
window.showErrorToast = showErrorToast;
window.showSuccessToast = showSuccessToast;
