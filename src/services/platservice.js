import axios from 'axios';

const API_URL = 'http://172.20.10.5:8080/plats';

export const getPlatsByCategory = async (categoryId, fournisseurId) => {
  try {
    const response = await axios.get(`${API_URL}/parCategorie`, {
      params: { categoryId, fournisseurId },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching plats by category:', error);
    throw error;
  }
};

export const createPlat = async (plat) => {
  try {
    const response = await axios.post(`${API_URL}/create`, plat, {
      params: { fournisseurId: plat.fournisseurId },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating plat:', error);
    throw error;
  }
};

export const updatePlat = async (plat) => {
  try {
    const response = await axios.put(`${API_URL}/update`, plat, {
      params: { fournisseurId: plat.fournisseurId },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating plat:', error);
    throw error;
  }
};

export const deletePlat = async (documentId, fournisseurId) => {
  try {
    const response = await axios.delete(`${API_URL}/delete/${documentId}`, {
      params: { fournisseurId },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting plat:', error);
    throw error;
  }
};