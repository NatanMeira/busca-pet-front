function collectFilters() {
  const form = document.getElementById("filterForm");
  if (!form) return {};

  const formData = new FormData(form);
  const filters = {};

  for (let [key, value] of formData.entries()) {
    if (value && value.trim() !== "") {
      filters[key] = value.trim();
    }
  }

  return filters;
}

async function applyFilters() {
  const lista = document.getElementById("lista-pets");
  lista.innerHTML = `
    <div class="col-12 text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Aplicando filtros...</span>
      </div>
      <p class="mt-2">Aplicando filtros...</p>
    </div>
  `;

  window.currentFilters = collectFilters();
  window.currentPage = 1;

  await window.loadPets(
    window.currentFilters,
    window.currentPage,
    window.pageSize
  );

  window.scrollToList();
  showToast("Filtros aplicados com sucesso!", "Busca", "success");
}

function clearFilters() {
  const form = document.getElementById("filterForm");
  if (form) {
    form.reset();
  }

  window.currentFilters = {};
  window.currentPage = 1;

  window.loadPets({}, window.currentPage, window.pageSize);
  updateActiveFiltersDisplay();
  showToast("Filtros removidos!", "Busca", "info");
}

function updateActiveFiltersDisplay() {
  const activeFiltersContainer = document.getElementById("activeFilters");
  const activeFiltersList = document.getElementById("activeFiltersList");

  if (!activeFiltersContainer || !activeFiltersList) return;

  const hasActiveFilters = Object.keys(window.currentFilters || {}).length > 0;

  if (!hasActiveFilters) {
    activeFiltersContainer.style.display = "none";
    return;
  }

  activeFiltersContainer.style.display = "block";
  activeFiltersList.innerHTML = "";

  Object.entries(window.currentFilters).forEach(([key, value]) => {
    let displayKey = key;
    let displayValue = value;

    switch (key) {
      case "nome":
        displayKey = "Nome";
        break;
      case "tipo":
        displayKey = "Tipo";
        break;
      case "cidade":
        displayKey = "Cidade";
        break;
      case "start_date":
        displayKey = "Data inicial";
        displayValue = formatDate(value);
        break;
      case "end_date":
        displayKey = "Data final";
        displayValue = formatDate(value);
        break;
    }

    const badge = document.createElement("span");
    badge.className = "badge bg-secondary me-2 mb-2";
    badge.innerHTML = `
      ${displayKey}: ${displayValue}
      <button type="button" class="btn-close btn-close-white ms-1" 
              style="font-size: 0.6em;" 
              onclick="removeFilter('${key}')"
              aria-label="Remover filtro"></button>
    `;

    activeFiltersList.appendChild(badge);
  });
}

function removeFilter(filterKey) {
  delete window.currentFilters[filterKey];

  const form = document.getElementById("filterForm");
  if (form) {
    const field = form.querySelector(`[name="${filterKey}"]`);
    if (field) {
      field.value = "";
    }
  }

  window.currentPage = 1;
  window.loadPets(window.currentFilters, window.currentPage, window.pageSize);
}

function formatDate(dateString) {
  if (!dateString) return dateString;

  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  } catch (error) {
    return dateString;
  }
}

function setupFilterForm() {
  const filterForm = document.getElementById("filterForm");
  if (!filterForm) return false;

  const collapseElement = document.getElementById("filterCollapse");
  const toggleIcon = document.getElementById("filterToggleIcon");
  const toggleText = document.getElementById("filterToggleText");

  if (collapseElement && toggleIcon && toggleText) {
    collapseElement.addEventListener("show.bs.collapse", function () {
      toggleIcon.classList.remove("fa-chevron-down");
      toggleIcon.classList.add("fa-chevron-up");
      toggleText.textContent = "Ocultar Filtros";
    });

    collapseElement.addEventListener("hide.bs.collapse", function () {
      toggleIcon.classList.remove("fa-chevron-up");
      toggleIcon.classList.add("fa-chevron-down");
      toggleText.textContent = "Mostrar Filtros";
    });
  }

  filterForm.addEventListener("submit", function (event) {
    event.preventDefault();
    applyFilters();
  });

  const inputs = filterForm.querySelectorAll("input");
  inputs.forEach((input) => {
    input.addEventListener("keypress", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        applyFilters();
      }
    });
  });

  const startDateInput = document.getElementById("filterStartDate");
  const endDateInput = document.getElementById("filterEndDate");

  if (startDateInput && endDateInput) {
    function validateDateRange() {
      const startDate = startDateInput.value;
      const endDate = endDateInput.value;

      if (startDate && endDate && startDate > endDate) {
        showToast(
          "A data inicial não pode ser posterior à data final.",
          "Aviso",
          "warning"
        );
        startDateInput.setCustomValidity("Data inicial inválida");
        endDateInput.setCustomValidity("Data final inválida");
      } else {
        startDateInput.setCustomValidity("");
        endDateInput.setCustomValidity("");
      }
    }

    startDateInput.addEventListener("change", validateDateRange);
    endDateInput.addEventListener("change", validateDateRange);
  }

  return true;
}

window.collectFilters = collectFilters;
window.applyFilters = applyFilters;
window.clearFilters = clearFilters;
window.updateActiveFiltersDisplay = updateActiveFiltersDisplay;
window.removeFilter = removeFilter;
window.formatDate = formatDate;
window.setupFilterForm = setupFilterForm;
