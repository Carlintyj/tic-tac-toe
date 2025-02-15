import axios from 'axios';

const API_URL = 'http://localhost:4000/api';

export const createGame = async () => {
  const response = await axios.post(`${API_URL}/games`);
  return response.data;
};

export const makeMove = async (gameId, player, position) => {
  const response = await axios.post(`${API_URL}/games/${gameId}/move`, { player, position });
  return response.data;
};

export const getGameState = async (gameId) => {
  const response = await axios.get(`${API_URL}/games/${gameId}`);
  return response.data;
};

export const listGames = async () => {
  const response = await axios.get(`${API_URL}/games`);
  return response.data;
};