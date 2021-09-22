import axios from 'axios';

const ENDPOINT_URL = '/recipes/{recipeId}/';

const get = async ({ recipeId }) => {
  const response = await axios.get(ENDPOINT_URL.replace('{recipeId}', recipeId), {
    headers: {
      'Accept': 'application/json',
    },
  });
  return response.data;
};

const patch = async ({ recipeId, recipe }) => {
  const response = await axios.patch(ENDPOINT_URL.replace('{recipeId}', recipeId), recipe, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });
  return response.data;
};

const remove = async ({ recipeId }) => { // "delete" is a reserved word
  const response = await axios.delete(ENDPOINT_URL.replace('{recipeId}', recipeId), {
    headers: {
      'Accept': 'application/json',
    },
  });
  return response.data;
};

export default {
  get,
  patch,
  remove,
};
