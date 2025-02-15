import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

export const createGame = async () => {
  const response = await axios.post(`${API_URL}/games`);
  return response.data;
};

export const joinGame = async (gameId, username) => {
  try {
    const response = await axios.post(`${API_URL}/games/${gameId}/join`, { username });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Error joining the game';
  }
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
