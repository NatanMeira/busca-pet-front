function criarCardPet(pet, index) {
  return `
    <div class="col-12 col-sm-6 col-md-4 col-lg-3">
      <div class="card h-100 shadow-sm">
        <img src="${
          pet.foto || "https://via.placeholder.com/220x220?text=Pet"
        }" class="card-img-top" alt="Foto de ${
    pet.nome
  }" style="object-fit:cover; height:220px;">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title mb-2">${pet.nome}</h5>
          <p class="mb-1"><strong>Idade:</strong> ${pet.idade}</p>
          <p class="mb-1"><strong>Raça:</strong> ${pet.raca}</p>
          <p class="mb-1"><strong>Bairro/Cidade:</strong> ${pet.bairro} / ${
    pet.cidade
  }</p>
          <p class="mb-3 text-danger"><strong>${window.diasDesaparecido(
            pet.data_desaparecimento
          )}</strong></p>
          <div class="mt-auto">
            <div class="btn-group-vertical w-100" role="group">
              <div class="btn-group mb-2" role="group">
                <button class="btn btn-outline-primary btn-sm" onclick="openModal('view', ${index})">
                  <i class="fas fa-eye"></i> Ver
                </button>
                <button class="btn btn-outline-secondary btn-sm" onclick="openModal('edit', ${index})">
                  <i class="fas fa-edit"></i> Editar
                </button>
              </div>
              <button class="btn btn-outline-danger btn-sm" onclick="confirmDeletePet(${index})">
                <i class="fas fa-trash"></i> Remover
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function refreshPetsList() {
  const lista = document.getElementById("lista-pets");

  if (window.pets?.length === 0) {
    lista.innerHTML = `
      <div class="col-12">
        <div class="text-center py-5">
          <div class="mb-4">
            <i class="fas fa-heart-broken text-muted" style="font-size: 4rem;"></i>
          </div>
          <h4 class="text-muted mb-3">Nenhum pet cadastrado</h4>
          <p class="text-muted mb-4">
            Ainda não há pets desaparecidos cadastrados em nossa plataforma.<br>
            Seja o primeiro a cadastrar e ajude a reunir famílias!
          </p>
          <button 
            class="btn btn-primary btn-lg" 
            onclick="openModal('create')"
          >
            <i class="fas fa-plus-circle me-2"></i>
            Cadastrar Pet Perdido
          </button>
        </div>
      </div>
    `;
  } else {
    lista.innerHTML = window.pets
      .map((pet, index) => criarCardPet(pet, index))
      .join("");
  }
}

function confirmDeletePet(petIndex) {
  const pet = window.pets[petIndex];
  if (!pet) return;

  window.showConfirmationModal(
    `Tem certeza que deseja remover o pet "${pet.nome}"?`,
    "Remover Pet",
    "danger",
    function () {
      if (pet.id) {
        window.deletePet(pet.id, petIndex);
      } else {
        window.pets.splice(petIndex, 1);
        refreshPetsList();
        showToast("Pet removido com sucesso!", "Sucesso", "success");
      }
    }
  );
}

window.criarCardPet = criarCardPet;
window.refreshPetsList = refreshPetsList;
window.confirmDeletePet = confirmDeletePet;
