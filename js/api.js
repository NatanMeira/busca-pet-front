async function apiRequest(url, options = {}) {
  const BASE_URL = "http://localhost:5000/api";
  const config = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    ...options,
  };

  try {
    const response = await fetch(`${BASE_URL}${url}`, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error = new Error(
        errorData.message || `HTTP Error: ${response.status}`
      );
      error.status = response.status;
      error.data = errorData;
      throw error;
    }

    return await response.json();
  } catch (error) {
    if (error.status) {
      throw error;
    }

    const networkError = new Error(error.message || "Network error occurred");
    networkError.status = 0;
    networkError.data = { network: error.message };
    throw networkError;
  }
}

window.apiRequest = apiRequest;
