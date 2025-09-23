function diasDesaparecido(dataDesaparecimento) {
  const hoje = new Date();
  const data = new Date(dataDesaparecimento);
  const diff = Math.floor((hoje - data) / (1000 * 60 * 60 * 24));
  if (diff === 0) return "Desaparecido hoje";
  if (diff === 1) return "Desaparecido há 1 dia";
  return `Desaparecido há ${diff} dias`;
}

function convertFileToBase64(file) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("Arquivo deve ser uma imagem"));
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      reject(new Error("Imagem deve ter no máximo 5MB"));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Erro ao ler o arquivo"));
    reader.readAsDataURL(file);
  });
}

function isBase64Image(str) {
  if (!str || typeof str !== "string") return false;
  return str.startsWith("data:image/") && str.includes("base64,");
}

function getImageDisplaySrc(imageSrc) {
  if (!imageSrc) {
    return "https://via.placeholder.com/220x220?text=Sem+foto";
  }

  if (isBase64Image(imageSrc)) {
    return imageSrc;
  }

  return imageSrc;
}

function scrollToList() {
  const target = document.getElementById("lista-pets");
  if (target) {
    window.scrollTo({
      top: target.getBoundingClientRect().top + window.scrollY - 40,
      behavior: "smooth",
    });
  }
}

window.diasDesaparecido = diasDesaparecido;
window.convertFileToBase64 = convertFileToBase64;
window.isBase64Image = isBase64Image;
window.getImageDisplaySrc = getImageDisplaySrc;
window.scrollToList = scrollToList;
