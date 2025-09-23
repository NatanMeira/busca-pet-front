window.pets = [];
window.currentMode = "create";
window.currentPetIndex = null;
window.currentPage = 1;
window.pageSize = 12;
window.totalPages = 1;
window.totalPets = 0;
window.currentFilters = {};

async function loadPets(filters = {}, page = 1, size = window.pageSize) {
  const result = await PetService.loadPets(filters, page, size);
  window.pets = result.pets;
  window.currentPage = result.pagination.currentPage;
  window.totalPages = result.pagination.totalPages;
  window.totalPets = result.pagination.totalPets;
  window.pageSize = result.pagination.pageSize;
  refreshPetsList();
  updatePaginationControls();
  updateActiveFiltersDisplay();
  return window.pets;
}

async function createPet(formData) {
  await PetService.createPet(formData);
  await reloadCurrentPage();
}

async function updatePet(petId, formData) {
  await PetService.updatePet(petId, formData);
  await reloadCurrentPage();
}

async function deletePet(petId) {
  await PetService.deletePet(petId);
  await reloadCurrentPage();
}

async function reloadCurrentPage() {
  await loadPets(window.currentFilters, window.currentPage, window.pageSize);
}

document.addEventListener("DOMContentLoaded", function () {
  loadPets({}, 1, window.pageSize).catch((error) => {
    window.pets = [];
    refreshPetsList();
    updatePaginationControls();
  });

  const setupFunctions = [
    setupAddressHandling,
    setupImagePreview,
    setupFormValidation,
    setupFilterForm,
  ];

  function initializeApp() {
    const allReady = setupFunctions.every((fn) => fn());
    if (!allReady) {
      setTimeout(initializeApp, 100);
    }
  }

  initializeApp();

  window.loadPets = loadPets;
  window.createPet = createPet;
  window.updatePet = updatePet;
  window.deletePet = deletePet;
  window.reloadCurrentPage = reloadCurrentPage;
});
