function updatePaginationControls() {
  const paginationContainer = document.getElementById("pagination-container");
  const pagination = document.getElementById("pagination");
  const paginationInfo = document.getElementById("pagination-info");

  if (!pagination || !paginationInfo) {
    return;
  }

  if (!window.window.pets.length) {
    paginationContainer.style.display = "none";
    paginationInfo.style.display = "none";
    return;
  }

  paginationContainer.style.display = "flex";
  paginationInfo.style.display = "block";
  pagination.innerHTML = "";

  const prevDisabled = window.currentPage === 1;
  pagination.innerHTML += `
    <li class="page-item ${prevDisabled ? "disabled" : ""}">
      <button class="page-link" onclick="changePage(${
        window.currentPage - 1
      })" ${prevDisabled ? "disabled" : ""}>
        <i class="fas fa-chevron-left"></i> Anterior
      </button>
    </li>
  `;

  const startPage = Math.max(1, window.currentPage - 2);
  const endPage = Math.min(window.totalPages, window.currentPage + 2);

  if (startPage > 1) {
    pagination.innerHTML += `
      <li class="page-item">
        <button class="page-link" onclick="changePage(1)">1</button>
      </li>
    `;
    if (startPage > 2) {
      pagination.innerHTML += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    const isActive = i === window.currentPage;
    pagination.innerHTML += `
      <li class="page-item ${isActive ? "active" : ""}">
        <button class="page-link" onclick="changePage(${i})">${i}</button>
      </li>
    `;
  }

  if (endPage < window.totalPages) {
    if (endPage < window.totalPages - 1) {
      pagination.innerHTML += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
    }
    pagination.innerHTML += `
      <li class="page-item">
        <button class="page-link" onclick="changePage(${window.totalPages})">${window.totalPages}</button>
      </li>
    `;
  }

  const nextDisabled = window.currentPage === window.totalPages;
  pagination.innerHTML += `
    <li class="page-item ${nextDisabled ? "disabled" : ""}">
      <button class="page-link" onclick="changePage(${
        window.currentPage + 1
      })" ${nextDisabled ? "disabled" : ""}>
        Próxima <i class="fas fa-chevron-right"></i>
      </button>
    </li>
  `;

  const startItem = (window.currentPage - 1) * window.pageSize + 1;
  const endItem = Math.min(
    window.currentPage * window.pageSize,
    window.totalPets
  );
  paginationInfo.innerHTML = `
    Mostrando <strong>${startItem}</strong> a <strong>${endItem}</strong> de <strong>${window.totalPets}</strong> pets
  `;
}

async function changePage(newPage) {
  if (
    newPage < 1 ||
    newPage > window.totalPages ||
    newPage === window.currentPage
  )
    return;

  const lista = document.getElementById("lista-pets");
  lista.innerHTML = `
    <div class="col-12 text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Carregando...</span>
      </div>
      <p class="mt-2">Carregando pets...</p>
    </div>
  `;

  await window.loadPets(window.currentFilters || {}, newPage, window.pageSize);

  const target = document.getElementById("lista-pets");
  if (target) {
    window.scrollTo({
      top: target.getBoundingClientRect().top + window.scrollY - 100,
      behavior: "smooth",
    });
  }
}

window.updatePaginationControls = updatePaginationControls;
window.changePage = changePage;
