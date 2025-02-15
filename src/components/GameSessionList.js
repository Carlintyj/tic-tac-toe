import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Container, Typography, List, ListItem, ListItemText, Button, CircularProgress, 
  Box, Tabs, Tab, Paper, Avatar
} from '@mui/material';
import { styled } from '@mui/system';
import { listGames, createGame } from '../services/api';

const StyledContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
  backgroundColor: theme.palette.background.default,
}));

const StyledList = styled(List)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
}));

const GameSessionList = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabIndex, setTabIndex] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const username = params.get('username'); // Extract username from the query string

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

  const ongoingGames = games.filter(game => !game.winner);
  const completedGames = games.filter(game => game.winner);

  return (
    <StyledContainer maxWidth="md">
      {/* Display Username */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h2" color="textPrimary">
          Welcome, {username || 'Guest'}
        </Typography>
        <Avatar alt={username || 'Anonymous'} sx={{ bgcolor: 'primary.main' }}>
          {username ? username.charAt(0).toUpperCase() : 'A'}
        </Avatar>
      </Box>

      <Typography variant="h2" component="h1" gutterBottom color="textPrimary">
        Game Sessions
      </Typography>

      <Paper elevation={3} sx={{ mb: 3 }}>
        <Tabs
          value={tabIndex}
          onChange={(event, newValue) => setTabIndex(newValue)}
          aria-label="Game session tabs"
          variant="fullWidth"
        >
          <Tab label="Ongoing Games" aria-label="Ongoing games tab" />
          <Tab label="Completed Games" aria-label="Completed games tab" />
        </Tabs>
      </Paper>

      {tabIndex === 0 && (
        <StyledList>
          {ongoingGames.length > 0 ? (
            ongoingGames.map((game) => (
              <ListItem key={game._id} role="listitem">
                <ListItemText
                  primary={`Game ${game.roomId}`}
                  secondary={`Created: ${new Date(game.createdAt).toLocaleString()}`}
                />
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={() => handleJoinGame(game._id)}
                  aria-label={`Join Game ${game.roomId}`}
                >
                  Join
                </Button>
              </ListItem>
            ))
          ) : (
            <Typography variant="body1" align="center" color="textSecondary">
              No ongoing games available.
            </Typography>
          )}
        </StyledList>
      )}

      {tabIndex === 1 && (
        <StyledList>
          {completedGames.length > 0 ? (
            completedGames.map((game) => (
              <ListItem key={game._id} role="listitem">
                <ListItemText
                  primary={`Game ${game.roomId}`}
                  secondary={`Winner: ${game.winner}`}
                />
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={() => handleJoinGame(game._id)}
                  aria-label={`View Game ${game.roomId}`}
                >
                  View
                </Button>
              </ListItem>
            ))
          ) : (
            <Typography variant="body1" align="center" color="textSecondary">
              No completed games available.
            </Typography>
          )}
        </StyledList>
      )}

      <Box mt={4} display="flex" justifyContent="center">
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleCreateNewGame}
          aria-label="Create a new game"
        >
          Create New Game
        </Button>
      </Box>
    </StyledContainer>
  );
};

export default GameSessionList;
