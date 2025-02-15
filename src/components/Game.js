import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Paper, Typography, Box, Container, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
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
  textAlign: 'center',
}));

const Game = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [player, setPlayer] = useState('');
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [playerO, setPlayerO] = useState('');
  const [playerX, setPlayerX] = useState('');
  const [winner, setWinner] = useState(null);
  const [announcement, setAnnouncement] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [draw, setDraw] = useState(false);
  const [waitingForPlayer, setWaitingForPlayer] = useState(false);
  const winnerAnnounced = useRef(false);
  const { id: gameId } = useParams();
  const navigate = useNavigate();
  const username = localStorage.getItem('username');

  useEffect(() => {
    fetchGameState();
    const interval = setInterval(fetchGameState, 1000);
    return () => clearInterval(interval);
  }, [gameId]);

  useEffect(() => {
    if (announcement) {
      const timer = setTimeout(() => setAnnouncement(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [announcement]);

  const fetchGameState = async () => {
    try {
      const { board, currentPlayer, winner, playerO, playerX } = await getGameState(gameId);
      setBoard(board);
      setCurrentPlayer(currentPlayer);
      setPlayer(playerX === username ? 'X' : 'O');
      setPlayerO(playerO);
      setPlayerX(playerX);
      setWinner(winner);
      setDraw(winner === 'draw');
      
      // Check if there is only one player
      if (playerO == null || playerX == null) {
        setWaitingForPlayer(true);
        setAnnouncement("Waiting for another player...");
      } else {
        setWaitingForPlayer(false);
      }

      if (winner === 'draw' && !winnerAnnounced.current) {
        setAnnouncement("It's a draw! 🤝");
        setOpenModal(true);
        winnerAnnounced.current = true;
      } else if (winner && !winnerAnnounced.current) {
        setAnnouncement(`Congratulations! ${winner === "X" ? (playerX === username ? 'You (X)' : playerX + " (X)") : (playerO === username ? 'You (O)' : playerO + " (O)")} wins! 🎉`);
        setOpenModal(true);
        winnerAnnounced.current = true;
      } else if (!winner) {
        setAnnouncement(`${currentPlayer}'s turn.`);
      }
    } catch (error) {
      console.error('Error fetching game state:', error);
      setAnnouncement('Error loading game. Please try again.');
    }
  };

  const handleMove = async (index) => {
    if (board[index] || winner || waitingForPlayer) return;

    try {
      const { board: newBoard, winner: newWinner } = await makeMove(gameId, player, index);
      setBoard(newBoard);
      setCurrentPlayer("");
      setWinner(newWinner);
      setDraw(newWinner === 'draw');

      if (newWinner === 'draw' && !winnerAnnounced.current) {
        setAnnouncement("It's a draw! 🤝");
        setOpenModal(true);
        winnerAnnounced.current = true;
      } else if (newWinner && !winnerAnnounced.current) {
        setAnnouncement(`Congratulations! ${winner === "X" ? (playerX === username ? 'You (X)' : playerX + " (X)") : (playerO === username ? 'You (O)' : playerO + " (O)")} wins! 🎉`);
        setOpenModal(true);
        winnerAnnounced.current = true;
      } else {
        setAnnouncement(`${currentPlayer}'s turn.`);
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
        <Box mb={3} display="flex" justifyContent="space-between">
          <Button 
            variant="outlined" 
            color="primary" 
            onClick={handleBackToSessions} 
            aria-label="Back to sessions"
          >
            Back to Sessions
          </Button>
        </Box>
        <Typography variant="h4" component="h2" gutterBottom>
          {winner ? (winner === 'draw' ? "🤝 It's a Draw! 🤝" : `🎉 ${winner === "X" ? (playerX === username ? 'You (X)' : playerX + " (X)") : (playerO === username ? 'You (O)' : playerO + " (O)")} Wins! 🎉`) : `Current Player: ${currentPlayer === "X" ? (playerX === username ? 'You (X)' : playerX + " (X)") : (playerO === username ? 'You (O)' : playerO + " (O)")}`}
        </Typography>
        
        {/* Announcement to screen reader */}
        <Box
          role="status"
          aria-live="polite"
          sx={{ position: 'absolute', left: '-9999px' }}
        >
          {announcement}
        </Box>

        {/* Player turn and opponent information for screen reader */}
        <Typography variant="h6" component="p" color="textSecondary">
          {waitingForPlayer && (
            "Waiting for another player..."
          )}
        </Typography>
        
        <Board board={board} onMove={handleMove} />
      </StyledPaper>

      {/* Winner/Draw Announcement Modal */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} aria-labelledby="game-modal-title">
        <Box p={2}>
          <DialogTitle id="game-modal-title" sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '1.5rem' }}>
            {draw ? "🤝 It's a Draw! 🤝" : "🎉 Congratulations! 🎉"}
          </DialogTitle>
          <DialogContent>
            <Typography variant="h6" align="center">
              {draw ? "The game ended in a tie! Well played!" : `${winner === "X" ? (playerX === username ? 'You (X)' : playerX + " (X)") : (playerO === username ? 'You (O)' : playerO + " (O)")} is the champion! 🏆`}
            </Typography>
          </DialogContent>
          <DialogActions sx={{ display: 'flex', justifyContent: 'center', pb: 2 }}>
            <Button variant="contained" color="primary" onClick={handleBackToSessions} aria-label="Back to sessions">
              Back to Sessions
            </Button>
            <Button variant="outlined" color="secondary" onClick={() => setOpenModal(false)} aria-label="Close announcement modal">
              Close
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </StyledContainer>
  );
};

export default Game;
