class PetService {
  static async loadPets(filters = {}, page = 1, size = 12) {
    try {
      const paginationFilters = {
        ...filters,
        page_size: size,
        page_number: page,
      };

      const response = await this.getAllPets(paginationFilters);

      let pets = [];
      if (response.data && Array.isArray(response.data)) {
        pets = response.data.map((pet) => this.transformAPIToForm(pet));
      }

      const pagination = {
        currentPage: response.pagination?.page_number || page,
        totalPages: response.pagination?.total_pages || 1,
        totalPets: response.pagination?.total_count || pets.length,
        pageSize: response.pagination?.page_size || size,
      };

      return { pets, pagination };
    } catch (error) {
      showErrorToast(error);
      return {
        pets: [],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalPets: 0,
          pageSize: size,
        },
      };
    }
  }

  static async createPet(formData) {
    try {
      const apiData = this.transformFormToAPI(formData);
      const validation = this.validatePetData(apiData, false);
      if (!validation.isValid) {
        const validationError = new Error(validation.errors.join(", "));
        validationError.status = 400;
        throw validationError;
      }
      const response = await apiRequest("/pets", {
        method: "POST",
        body: JSON.stringify(apiData),
      });
      showSuccessToast(response, "Pet cadastrado com sucesso!");
      return response;
    } catch (error) {
      showErrorToast(error);
      throw error;
    }
  }

  static async updatePet(petId, formData) {
    try {
      const apiData = this.transformFormToAPI(formData);
      const validation = this.validatePetData(apiData, true);
      if (!validation.isValid) {
        const validationError = new Error(validation.errors.join(", "));
        validationError.status = 400;
        throw validationError;
      }
      const response = await apiRequest(`/pets/${petId}`, {
        method: "PUT",
        body: JSON.stringify(apiData),
      });
      showSuccessToast(response, "Pet atualizado com sucesso!");
      return response;
    } catch (error) {
      showErrorToast(error);
      throw error;
    }
  }

  static async deletePet(petId) {
    try {
      await apiRequest(`/pets/${petId}`, {
        method: "DELETE",
      });
      showToast("Pet removido com sucesso!", "Sucesso", "success");
    } catch (error) {
      showErrorToast(error);
      throw error;
    }
  }

  static transformFormToAPI(formData) {
    const data = {};

    if (formData instanceof FormData) {
      for (let [key, value] of formData.entries()) {
        data[key] = value;
      }
    } else {
      Object.assign(data, formData);
    }

    const transformed = {
      nome: data.nome,
      tipo: data.tipo,
      idade: data.idade,
      porte: data.porte,
      raca: data.raca,
      info_contato: data.info_contato,
      sexo: data.sexo,
      descricao: data.descricao,
      observacoes: data.observacoes,
      foto: data.foto,
      data_desaparecimento: data.data_desaparecimento
        ? new Date(data.data_desaparecimento).toISOString()
        : undefined,
      endereco_desaparecimento: {
        cep: data.cep,
        rua: data.rua,
        bairro: data.bairro,
        cidade: data.cidade,
        estado: data.estado,
        pais: data.pais || "Brasil",
      },
    };

    Object.keys(transformed).forEach((key) => {
      if (
        transformed[key] === undefined ||
        transformed[key] === null ||
        transformed[key] === ""
      ) {
        delete transformed[key];
      }
    });

    const address = transformed.endereco_desaparecimento;
    Object.keys(address).forEach((key) => {
      if (
        address[key] === undefined ||
        address[key] === null ||
        address[key] === ""
      ) {
        delete address[key];
      }
    });

    if (Object.keys(address).length === 0) {
      delete transformed.endereco_desaparecimento;
    }

    return transformed;
  }

  static transformAPIToForm(apiData) {
    const pet = apiData.data || apiData;

    return {
      id: pet.id,
      nome: pet.nome,
      tipo: pet.tipo,
      idade: pet.idade,
      porte: pet.porte,
      raca: pet.raca,
      info_contato: pet.info_contato,
      sexo: pet.sexo,
      descricao: pet.descricao,
      observacoes: pet.observacoes,
      foto: pet.foto,
      data_desaparecimento: pet.data_desaparecimento
        ? new Date(pet.data_desaparecimento).toISOString()
        : undefined,
      cep: pet.endereco?.cep || pet.cep,
      rua: pet.endereco?.rua || pet.rua,
      bairro: pet.endereco?.bairro || pet.bairro,
      cidade: pet.endereco?.cidade || pet.cidade,
      estado: pet.endereco?.estado || pet.estado,
      pais: pet.endereco?.pais || pet.pais || "Brasil",
    };
  }

  static validatePetData(petData, isUpdate = false) {
    const errors = [];
    const requiredFields = isUpdate
      ? []
      : [
          "nome",
          "tipo",
          "idade",
          "porte",
          "raca",
          "info_contato",
          "sexo",
          "descricao",
          "data_desaparecimento",
        ];

    requiredFields.forEach((field) => {
      if (!petData[field] || petData[field].trim() === "") {
        errors.push(`Campo '${field}' é obrigatório`);
      }
    });

    const validTypes = ["Cachorro", "Gato", "Ave", "Outro"];
    if (petData.tipo && !validTypes.includes(petData.tipo)) {
      errors.push("Tipo deve ser: Cachorro, Gato, Ave ou Outro");
    }

    const validAges = ["Filhote", "Adulto", "Idoso"];
    if (petData.idade && !validAges.includes(petData.idade)) {
      errors.push("Idade deve ser: Filhote, Adulto ou Idoso");
    }

    const validSizes = ["Pequeno", "Medio", "Grande"];
    if (petData.porte && !validSizes.includes(petData.porte)) {
      errors.push("Porte deve ser: Pequeno, Medio ou Grande");
    }

    if (petData.sexo && !["Macho", "Femea"].includes(petData.sexo)) {
      errors.push("Sexo deve ser: Macho ou Femea");
    }

    if (petData.data_desaparecimento) {
      const datePattern = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2})?/;
      if (!datePattern.test(petData.data_desaparecimento)) {
        errors.push(
          "Data de desaparecimento deve estar no formato ISO (YYYY-MM-DD ou YYYY-MM-DDTHH:mm:ss)"
        );
      }
    }

    if (!isUpdate && petData.endereco_desaparecimento) {
      const requiredAddressFields = [
        "cep",
        "rua",
        "bairro",
        "cidade",
        "estado",
      ];
      requiredAddressFields.forEach((field) => {
        if (
          !petData.endereco_desaparecimento[field] ||
          petData.endereco_desaparecimento[field].trim() === ""
        ) {
          errors.push(`Campo de endereço '${field}' é obrigatório`);
        }
      });
    }

    return {
      isValid: errors.length === 0,
      errors: errors,
    };
  }

  static async getAllPets(filters = {}) {
    const queryParams = new URLSearchParams();

    Object.keys(filters).forEach((key) => {
      if (
        filters[key] !== null &&
        filters[key] !== undefined &&
        filters[key] !== ""
      ) {
        queryParams.append(key, filters[key]);
      }
    });

    const queryString = queryParams.toString();
    const url = queryString ? `/pets?${queryString}` : "/pets";

    return await apiRequest(url, {
      method: "GET",
    });
  }

  static async getPetById(petId) {
    if (!petId || isNaN(petId)) {
      const error = new Error("Pet ID is required and must be a number");
      error.status = 400;
      throw error;
    }

    const response = await apiRequest(`/pets/${petId}`, {
      method: "GET",
    });

    return this.transformAPIToForm(response.data);
  }
}
