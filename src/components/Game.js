import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Paper, Typography, Box, Container } from '@mui/material';
import { styled } from '@mui/system';
import Board from './Board';
import { makeMove, getGameState } from '../services/api';

const StyledContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
}));

const Game = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [winner, setWinner] = useState(null);
  const [announcement, setAnnouncement] = useState('');
  const { id: gameId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchGameState();
  }, []); // Removed gameId dependency

  useEffect(() => {
    if (announcement) {
      const timer = setTimeout(() => setAnnouncement(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [announcement]);

  const fetchGameState = async () => {
    try {
      const { board, currentPlayer, winner } = await getGameState(gameId);
      setBoard(board);
      setCurrentPlayer(currentPlayer);
      setWinner(winner);
      setAnnouncement(`Game loaded. ${winner ? `Player ${winner} has won!` : `Player ${currentPlayer}'s turn.`}`);
    } catch (error) {
      console.error('Error fetching game state:', error);
      setAnnouncement('Error loading game. Please try again.');
    }
  };

  const handleMove = async (index) => {
    if (board[index] || winner) return;

    try {
      const { board: newBoard, nextPlayer, winner: newWinner } = await makeMove(gameId, currentPlayer, index);
      setBoard(newBoard);
      setCurrentPlayer(nextPlayer);
      setWinner(newWinner);

      if (newWinner) {
        setAnnouncement(`Player ${newWinner} wins!`);
      } else {
        setAnnouncement(`Player ${nextPlayer}'s turn.`);
      }
    } catch (error) {
      console.error('Error making move:', error);
      setAnnouncement('Error making move. Please try again.');
    }
  };

  const handleBackToSessions = () => {
    navigate('/sessions');
  };

  return (
    <StyledContainer maxWidth="sm">
      <StyledPaper elevation={3}>
        <Typography variant="h4" component="h2" gutterBottom align="center">
          {winner ? `Winner: ${winner}` : `Current player: ${currentPlayer}`}
        </Typography>
        <Box
          role="status"
          aria-live="polite"
          sx={{ position: 'absolute', left: '-9999px' }}
        >
          {announcement}
        </Box>
        <Board board={board} onMove={handleMove} />
        <Box mt={3} display="flex" justifyContent="space-between">
          <Button
            variant="outlined"
            color="primary"
            onClick={handleBackToSessions}
          >
            Back to Sessions
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={fetchGameState}
          >
            Refresh Game
          </Button>
        </Box>
      </StyledPaper>
    </StyledContainer>
  );
};

export default Game;