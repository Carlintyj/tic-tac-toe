import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Typography, List, ListItem, ListItemText, Button, CircularProgress,
  Box, Tabs, Tab, Paper, Avatar, Divider
} from '@mui/material';
import { styled } from '@mui/system';
import { listGames, createGame, joinGame } from '../services/api';

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
  const username = localStorage.getItem('username');

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

  const handleJoinGame = async (gameId) => {
    try {
      const { player } = await joinGame(gameId, username);
      navigate(`/game/${gameId}`, { state: { player } });
    } catch (error) {
      console.error('Error joining game:', error.response?.data?.error || error.message);
    }
  };

  const handleCreateNewGame = async () => {
    try {
      const { gameId } = await createGame();
      const { player } = await joinGame(gameId, username);
      navigate(`/game/${gameId}`, { state: { player } });
    } catch (error) {
      console.error('Error creating and joining the game:', error);
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
  const allCompletedGames = games.filter(game => game.winner);
  const completedGames = allCompletedGames.filter(game => game.playerX === username || game.playerO === username);

  // Splitting games into categories
  const yourGames = ongoingGames.filter(game => game.playerX === username || game.playerO === username);
  const availableGames = ongoingGames.filter(game => !game.playerX || !game.playerO);
  const fullGames = ongoingGames.filter(game => game.playerX && game.playerO && (game.playerX !== username && game.playerO !== username));

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
        <>
          {/* Your Games */}
          <Typography variant="h6" component="h2" gutterBottom color="textSecondary">
            Your Games
          </Typography>
          <StyledList aria-live="polite">
            {yourGames.length > 0 ? (
              yourGames.map((game) => (
                <ListItem key={game._id} role="listitem">
                  <ListItemText
                    primary={`Game ${game.roomId}`}
                    secondary={`Created: ${new Date(game.createdAt).toLocaleString()}`}
                  />
                  <Box display="flex" flexDirection="column" mr={4}>
                    <Typography variant="body2" color="textSecondary">
                      Player X: {game.playerX}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Player O: {game.playerO || 'Waiting for player...'}
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleJoinGame(game._id)}
                    aria-label={`Rejoin Game ${game.roomId}`}
                  >
                    {game.playerX && game.playerO ? 'Rejoin' : 'Waiting for Players...'}
                  </Button>
                </ListItem>
              ))
            ) : (
              <Typography variant="body1" align="center" color="textSecondary">
                No games you're currently involved in.
              </Typography>
            )}
          </StyledList>

          <Divider sx={{ my: 2 }} />

          {/* Available Games */}
          <Typography variant="h6" component="h2" gutterBottom color="textSecondary">
            Available Games
          </Typography>
          <StyledList aria-live="polite">
            {availableGames.length > 0 ? (
              availableGames.map((game) => (
                <ListItem key={game._id} role="listitem">
                  <ListItemText
                    primary={`Game ${game.roomId}`}
                    secondary={`Created: ${new Date(game.createdAt).toLocaleString()}`}
                  />
                  <Box display="flex" flexDirection="column" mr={4}>
                    <Typography variant="body2" color="textSecondary">
                      Player X: {game.playerX || 'Waiting for player...'}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Player O: {game.playerO || 'Waiting for player...'}
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleJoinGame(game._id)}
                    disabled={game.playerX && game.playerO}
                    aria-label={`Join Game ${game.roomId}`}
                  >
                    {game.playerX && game.playerO ? 'Full' : 'Join'}
                  </Button>
                </ListItem>
              ))
            ) : (
              <Typography variant="body1" align="center" color="textSecondary">
                No available games.
              </Typography>
            )}
          </StyledList>

          <Divider sx={{ my: 2 }} />

          {/* Full Games */}
          <Typography variant="h6" component="h2" gutterBottom color="textSecondary">
            Full Games
          </Typography>
          <StyledList aria-live="polite">
            {fullGames.length > 0 ? (
              fullGames.map((game) => (
                <ListItem key={game._id} role="listitem">
                  <ListItemText
                    primary={`Game ${game.roomId}`}
                    secondary={`Created: ${new Date(game.createdAt).toLocaleString()}`}
                  />
                  <Box display="flex" flexDirection="column" mr={4}>
                    <Typography variant="body2" color="textSecondary">
                      Player X: {game.playerX}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Player O: {game.playerO}
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    color="primary"
                    disabled
                    aria-label={`View Game ${game.roomId}`}
                  >
                    Full
                  </Button>
                </ListItem>
              ))
            ) : (
              <Typography variant="body1" align="center" color="textSecondary">
                No full games available.
              </Typography>
            )}
          </StyledList>
        </>
      )}

      {tabIndex === 1 && (
        <StyledList aria-live="polite">
          {completedGames.length > 0 ? (
            completedGames.map((game) => (
              <ListItem key={game._id} role="listitem">
                <ListItemText
                  primary={`Game ${game.roomId}`}
                  secondary={`Winner: ${game.winner}`}
                />
                <Box display="flex" flexDirection="column" mr={4}>
                  <Typography variant="body2" color="textSecondary">
                    Player X: {game.playerX || 'Waiting for player...'}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Player O: {game.playerO || 'Waiting for player...'}
                  </Typography>
                </Box>
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
          aria-label="Create and Join New Game"
        >
          Create New Game
        </Button>
      </Box>
    </StyledContainer>
  );
};

export default GameSessionList;
