import axios from 'axios';

const ENDPOINT_URL = '/recipes/';

const get = async ({ queryParams }) => {
  const response = await axios.get(ENDPOINT_URL, {
    headers: {
      'Accept': 'application/json',
    },
    params: queryParams,
  });
  return response.data;
};

const post = async ({ recipe }) => {
  const response = await axios.post(ENDPOINT_URL, recipe, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });
  return response.data;
};

export default {
  get,
  post,
};
