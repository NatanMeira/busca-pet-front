const MODAL_ELEMENTS_CACHE = {};

function getModalElements() {
  if (!MODAL_ELEMENTS_CACHE.modal) {
    MODAL_ELEMENTS_CACHE.modal = {
      modal: document.getElementById("petModal"),
      modalTitle: document.getElementById("petModalLabel"),
      submitBtn: document.getElementById("submitBtn"),
      cancelBtn: document.getElementById("cancelBtn"),
      form: document.getElementById("petForm"),
      preview: document.getElementById("preview"),
      dataDesaparecimentoInput: document.getElementById("data_desaparecimento"),
      fotoInput: document.getElementById("foto"),
    };
  }
  return MODAL_ELEMENTS_CACHE.modal;
}

async function openModal(mode, petIndex = null) {
  window.currentMode = mode;
  window.currentPetIndex = petIndex;

  const modalElements = getModalElements();
  const modal = new bootstrap.Modal(modalElements.modal);

  modalElements.form.reset();
  modalElements.form.classList.remove("was-validated");

  const sexoRadios = modalElements.form.querySelectorAll('input[name="sexo"]');
  const sexoInvalidFeedback = modalElements.form
    .querySelector('input[name="sexo"]')
    .closest(".mb-3")
    .querySelector(".invalid-feedback");

  sexoRadios.forEach((radio) => {
    radio.setCustomValidity("");
    radio.classList.remove("is-invalid");
  });

  if (sexoInvalidFeedback) {
    sexoInvalidFeedback.style.display = "none";
  }

  modalElements.preview.src =
    "https://placehold.co/220x220?text=Pré-visualização";

  if (modalElements.dataDesaparecimentoInput) {
    const today = new Date().toISOString().split("T")[0];
    modalElements.dataDesaparecimentoInput.max = today;
  }

  if (mode === "create") {
    modalElements.modalTitle.textContent = "Cadastro de Pet";
    modalElements.submitBtn.textContent = "Cadastrar";
    modalElements.submitBtn.className = "btn btn-primary";
    modalElements.submitBtn.onclick = () => submitForm();
    modalElements.cancelBtn.textContent = "Cancelar";
    setFormMode(false, false);
    modalElements.fotoInput.setAttribute("required", "required");
  }

  const pet = await PetService.getPetById(window.pets[petIndex].id);
  populateForm(pet);
  console.log("pet ", pet);

  if (mode === "edit") {
    modalElements.modalTitle.textContent = "Editar Pet";
    modalElements.submitBtn.textContent = "Salvar Alterações";
    modalElements.submitBtn.className = "btn btn-warning";
    modalElements.submitBtn.onclick = () => submitForm();
    modalElements.cancelBtn.textContent = "Cancelar";
    setFormMode(false, false);
    if (pet && pet.foto) {
      modalElements.fotoInput.removeAttribute("required");
    } else {
      modalElements.fotoInput.setAttribute("required", "required");
    }
  }

  if (mode === "view") {
    modalElements.modalTitle.textContent = "Detalhes do Pet";
    modalElements.submitBtn.textContent = "Editar";
    modalElements.submitBtn.className = "btn btn-warning";
    modalElements.submitBtn.onclick = () => switchToEditMode();
    modalElements.cancelBtn.textContent = "Fechar";
    setFormMode(true, true);
  }

  modal.show();
}

function switchToEditMode() {
  window.currentMode = "edit";

  const modalElements = getModalElements();

  modalElements.modalTitle.textContent = "Editar Pet";
  modalElements.submitBtn.textContent = "Salvar Alterações";
  modalElements.submitBtn.className = "btn btn-warning";
  modalElements.submitBtn.style.display = "inline-block";
  modalElements.submitBtn.onclick = () => submitForm();
  modalElements.cancelBtn.textContent = "Cancelar";

  setFormMode(false, false);

  const pet = window.pets[window.currentPetIndex];
  if (pet && pet.foto) {
    modalElements.fotoInput.removeAttribute("required");
  } else {
    modalElements.fotoInput.setAttribute("required", "required");
  }

  showToast("Modo de edição ativado!", "Edição", "info");
}

function setFormMode(readonly, disabled) {
  const form = document.getElementById("petForm");
  const inputs = form.querySelectorAll("input, select, textarea");

  inputs.forEach((input) => {
    if (readonly) {
      input.disabled = true;

      if (
        input.type !== "file" &&
        input.type !== "radio" &&
        input.tagName !== "SELECT"
      ) {
        input.setAttribute("readonly", true);
      }
    } else {
      input.disabled = false;
      input.removeAttribute("readonly");
    }
  });

  const addressFields = ["rua", "bairro", "cidade", "estado", "pais"];
  addressFields.forEach((fieldId) => {
    const field = document.getElementById(fieldId);
    if (field) {
      if (readonly) {
        field.disabled = true;
      } else if (
        window.currentMode === "edit" ||
        window.currentMode === "create"
      ) {
        field.disabled = window.currentMode === "create" ? true : false;
      }
    }
  });

  const fileInput = document.getElementById("foto");
  const fileLabel = document.querySelector('label[for="foto"]');

  if (readonly && disabled) {
    fileInput.style.display = "none";
    if (fileLabel) fileLabel.style.display = "none";
  } else {
    fileInput.style.display = "block";
    if (fileLabel) fileLabel.style.display = "block";
  }
}

function populateForm(pet) {
  console.log("populateForm pet ", pet);
  document.getElementById("nome").value = pet.nome || "";
  document.getElementById("idade").value = pet.idade || "";
  document.getElementById("raca").value = pet.raca || "";
  document.getElementById("tipo").value = pet.tipo || "Cachorro";
  document.getElementById("porte").value = pet.porte || "";
  document.getElementById("info_contato").value = pet.info_contato || "";
  document.getElementById("descricao").value = pet.descricao || "";
  document.getElementById("observacoes").value = pet.observacoes || "";

  const dataDesaparecimentoInput = document.getElementById(
    "data_desaparecimento"
  );
  if (dataDesaparecimentoInput) {
    const dateValue = pet.data_desaparecimento;
    if (dateValue) {
      const date = new Date(dateValue);
      if (!isNaN(date.getTime())) {
        dataDesaparecimentoInput.value = date.toISOString().split("T")[0];
      }
    }
  }

  if (pet.sexo) {
    const genderRadio = document.querySelector(
      `input[name="sexo"][value="${pet.sexo}"]`
    );
    if (genderRadio) genderRadio.checked = true;
  }

  document.getElementById("cep").value = pet.cep || "";
  document.getElementById("rua").value = pet.rua || "";
  document.getElementById("bairro").value = pet.bairro || "";
  document.getElementById("cidade").value = pet.cidade || "";
  document.getElementById("estado").value = pet.estado || "";
  document.getElementById("pais").value = pet.pais || "Brasil";

  const imagePreview = document.getElementById("preview");
  const imageInput = document.getElementById("foto");

  if (pet.foto) {
    const imageSrc = window.getImageDisplaySrc(pet.foto);
    imagePreview.src = imageSrc;

    if (window.isBase64Image(pet.foto)) {
      imagePreview.setAttribute("data-base64", pet.foto);
    } else {
      imagePreview.removeAttribute("data-base64");
    }
  } else {
    imagePreview.src = "https://via.placeholder.com/220x220?text=Sem+foto";
    imagePreview.removeAttribute("data-base64");
  }

  if (imageInput) {
    imageInput.value = "";
  }
}

async function submitForm() {
  if (window.currentMode === "view") {
    bootstrap.Modal.getInstance(document.getElementById("petModal")).hide();
    return;
  }

  const form = document.getElementById("petForm");

  if (window.currentMode === "edit") {
    const fotoInput = document.getElementById("foto");
    const preview = document.getElementById("preview");
    const pet = window.pets[window.currentPetIndex];

    if (!fotoInput.files || fotoInput.files.length === 0) {
      if (pet && pet.foto && !preview.src.includes("placeholder")) {
        fotoInput.setCustomValidity("");
      } else if (!pet || !pet.foto) {
        fotoInput.setCustomValidity("Selecione uma foto para o pet");
      }
    } else {
      fotoInput.setCustomValidity("");
    }
  }

  const sexoRadios = form.querySelectorAll('input[name="sexo"]');
  const sexoSelected = Array.from(sexoRadios).some((radio) => radio.checked);
  const sexoInvalidFeedback = form
    .querySelector('input[name="sexo"]')
    .closest(".mb-3")
    .querySelector(".invalid-feedback");

  if (!sexoSelected) {
    sexoRadios.forEach((radio) => {
      radio.setCustomValidity("Escolha o sexo do pet");
      radio.classList.add("is-invalid");
    });

    if (sexoInvalidFeedback) {
      sexoInvalidFeedback.style.display = "block";
    }
  } else {
    sexoRadios.forEach((radio) => {
      radio.setCustomValidity("");
      radio.classList.remove("is-invalid");
    });

    if (sexoInvalidFeedback) {
      sexoInvalidFeedback.style.display = "none";
    }
  }

  if (!form.checkValidity()) {
    form.classList.add("was-validated");
    return;
  }

  const submitBtn = document.getElementById("submitBtn");
  const originalText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = "Processando...";

  try {
    const formData = new FormData(form);
    const petData = {};

    for (let [key, value] of formData.entries()) {
      petData[key] = value;
    }

    const preview = document.getElementById("preview");
    const fotoInput = document.getElementById("foto");

    if (preview.hasAttribute("data-base64")) {
      petData.foto = preview.getAttribute("data-base64");
    } else if (preview.src && !preview.src.includes("placeholder")) {
      if (preview.src.startsWith("data:")) {
        petData.foto = preview.src;
      } else {
        petData.foto = preview.src;
      }
    } else if (fotoInput.files && fotoInput.files[0]) {
      try {
        petData.foto = await window.convertFileToBase64(fotoInput.files[0]);
      } catch (error) {
        showToast(
          "Erro ao processar a imagem. Tente novamente.",
          "Erro",
          "danger"
        );
        return;
      }
    }

    if (window.currentMode === "create") {
      await window.createPet(petData);
    } else if (window.currentMode === "edit") {
      const pet = window.pets[window.currentPetIndex];
      if (pet && pet.id) {
        await window.updatePet(pet.id, petData);
      } else {
        window.pets[window.currentPetIndex] = {
          ...window.pets[window.currentPetIndex],
          ...petData,
        };
        window.refreshPetsList();
        showToast("Pet atualizado com sucesso!", "Sucesso", "success");
      }
    }

    bootstrap.Modal.getInstance(document.getElementById("petModal")).hide();
  } catch (error) {
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }
}

function setupAddressHandling() {
  const cepInput = document.getElementById("cep");
  const ruaInput = document.getElementById("rua");
  const bairroInput = document.getElementById("bairro");
  const cidadeInput = document.getElementById("cidade");
  const estadoInput = document.getElementById("estado");
  const paisInput = document.getElementById("pais");

  if (!cepInput) {
    return false;
  }

  function setEnderecoDisabled(disabled) {
    ruaInput.disabled = disabled;
    bairroInput.disabled = disabled;
    cidadeInput.disabled = disabled;
    estadoInput.disabled = disabled;
    paisInput.disabled = disabled;
  }

  setEnderecoDisabled(true);

  cepInput.addEventListener("input", function () {
    const cep = cepInput.value.replace(/\D/g, "");
    if (cep.length === 8) {
      fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then((response) => response.json())
        .then((data) => {
          if (!data.erro) {
            ruaInput.value = data.logradouro || "";
            bairroInput.value = data.bairro || "";
            cidadeInput.value = data.localidade || "";
            estadoInput.value = data.uf || "";
            paisInput.value = "Brasil";
            setEnderecoDisabled(false);
          } else {
            ruaInput.value = "";
            bairroInput.value = "";
            cidadeInput.value = "";
            estadoInput.value = "";
            paisInput.value = "Brasil";
            setEnderecoDisabled(true);
            showToast("CEP não encontrado.", "Aviso", "warning");
          }
        })
        .catch(() => {
          setEnderecoDisabled(true);
          showToast("Erro ao buscar o CEP.", "Erro", "danger");
        });
    } else {
      ruaInput.value = "";
      bairroInput.value = "";
      cidadeInput.value = "";
      estadoInput.value = "";
      paisInput.value = "Brasil";
      setEnderecoDisabled(true);
    }
  });

  const petModal = document.getElementById("petModal");
  if (petModal) {
    petModal.addEventListener("show.bs.modal", function () {
      if (window.currentMode === "create") {
        setEnderecoDisabled(true);
      }
    });
  }

  return true;
}

function setupImagePreview() {
  const fotoInput = document.getElementById("foto");
  if (!fotoInput) {
    return false;
  }

  fotoInput.addEventListener("change", function (event) {
    const [file] = event.target.files;
    const preview = document.getElementById("preview");

    fotoInput.setCustomValidity("");

    if (file) {
      if (!file.type.startsWith("image/")) {
        showToast(
          "Por favor, selecione apenas arquivos de imagem.",
          "Aviso",
          "warning"
        );
        fotoInput.value = "";
        preview.src = "https://placehold.co/220x220?text=Pré-visualização";
        return;
      }

      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        showToast("A imagem deve ter no máximo 5MB.", "Aviso", "warning");
        fotoInput.value = "";
        preview.src = "https://placehold.co/220x220?text=Pré-visualização";
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target.result;
        preview.src = base64String;
        preview.setAttribute("data-base64", base64String);
      };
      reader.onerror = () => {
        showToast(
          "Erro ao processar a imagem. Tente novamente.",
          "Erro",
          "danger"
        );
        preview.src = "https://placehold.co/220x220?text=Pré-visualização";
      };
      reader.readAsDataURL(file);
    } else {
      preview.src = "https://placehold.co/220x220?text=Pré-visualização";
      preview.removeAttribute("data-base64");
    }
  });

  return true;
}

function setupFormValidation() {
  const form = document.getElementById("petForm");
  if (!form) {
    return false;
  }

  const sexoRadios = form.querySelectorAll('input[name="sexo"]');
  const sexoInvalidFeedback = form
    .querySelector('input[name="sexo"]')
    .closest(".mb-3")
    .querySelector(".invalid-feedback");

  sexoRadios.forEach((radio) => {
    radio.addEventListener("change", function () {
      sexoRadios.forEach((r) => {
        r.setCustomValidity("");
        r.classList.remove("is-invalid");
      });

      if (sexoInvalidFeedback) {
        sexoInvalidFeedback.style.display = "none";
      }
    });
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    submitForm();
  });

  return true;
}

function showConfirmationModal(
  message,
  title = "Confirmar Ação",
  type = "warning",
  onConfirm = null
) {
  const confirmationModal = document.getElementById("confirmationModal");
  const confirmationModalLabel = document.getElementById(
    "confirmationModalLabel"
  );
  const confirmationMessage = document.getElementById("confirmationMessage");
  const confirmActionBtn = document.getElementById("confirmActionBtn");

  confirmationMessage.textContent = message;

  let icon = "fas fa-exclamation-triangle";
  let iconClass = "text-warning";
  let btnClass = "btn-warning";
  let btnText = "Confirmar";

  switch (type) {
    case "danger":
      icon = "fas fa-exclamation-triangle";
      iconClass = "text-danger";
      btnClass = "btn-danger";
      btnText = "Remover";
      break;
    case "success":
      icon = "fas fa-check-circle";
      iconClass = "text-success";
      btnClass = "btn-success";
      btnText = "Confirmar";
      break;
    case "info":
      icon = "fas fa-info-circle";
      iconClass = "text-info";
      btnClass = "btn-info";
      btnText = "Continuar";
      break;
    default:
      icon = "fas fa-exclamation-triangle";
      iconClass = "text-warning";
      btnClass = "btn-warning";
      btnText = "Confirmar";
  }

  confirmationModalLabel.innerHTML = `<i class="${icon} ${iconClass} me-2"></i>${title}`;

  confirmActionBtn.className = `btn ${btnClass}`;
  confirmActionBtn.innerHTML = `<i class="fas fa-check me-1"></i>${btnText}`;

  confirmActionBtn.onclick = function () {
    const modal = bootstrap.Modal.getInstance(confirmationModal);
    modal.hide();

    if (onConfirm && typeof onConfirm === "function") {
      onConfirm();
    }
  };

  const modal = new bootstrap.Modal(confirmationModal);
  modal.show();
}

window.getModalElements = getModalElements;
window.openModal = openModal;
window.switchToEditMode = switchToEditMode;
window.setFormMode = setFormMode;
window.populateForm = populateForm;
window.submitForm = submitForm;
window.setupAddressHandling = setupAddressHandling;
window.setupImagePreview = setupImagePreview;
window.setupFormValidation = setupFormValidation;
