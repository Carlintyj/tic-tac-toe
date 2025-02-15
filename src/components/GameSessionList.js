import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, List, ListItem, ListItemText, Button, CircularProgress, Box } from '@mui/material';
import { styled } from '@mui/system';
import { listGames, createGame } from '../services/api';

const StyledContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
}));

const StyledList = styled(List)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
}));

const GameSessionList = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const fetchedGames = await listGames();
      setGames(fetchedGames);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching games:', error);
      setLoading(false);
    }
  };

  const handleJoinGame = (gameId) => {
    navigate(`/game/${gameId}`);
  };

  const handleCreateNewGame = async () => {
    try {
      const { gameId } = await createGame();
      navigate(`/game/${gameId}`);
    } catch (error) {
      console.error('Error creating new game:', error);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <StyledContainer maxWidth="md">
      <Typography variant="h2" component="h1" gutterBottom>
        Game Sessions
      </Typography>
      <StyledList>
        {games.map((game) => (
          <ListItem
            key={game._id}
            button
            onClick={() => handleJoinGame(game._id)}
          >
            <ListItemText
              primary={`Game ${game._id.slice(-6)}`}
              secondary={`Created: ${new Date(game.createdAt).toLocaleString()}`}
            />
          </ListItem>
        ))}
      </StyledList>
      <Box mt={4} display="flex" justifyContent="center">
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleCreateNewGame}
        >
          Create New Game
        </Button>
      </Box>
    </StyledContainer>
  );
};

export default GameSessionList;