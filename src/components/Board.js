import React from 'react';
import { Grid, Button } from '@mui/material';
import { styled } from '@mui/system';

const StyledButton = styled(Button)(({ theme }) => ({
  width: '100%',
  height: '100%',
  fontSize: '2rem',
  fontWeight: 'bold',
  aspectRatio: '1 / 1',
  backgroundColor: theme.palette.grey[100], 
  '&:hover': {
    backgroundColor: theme.palette.primary.main, 
  },
  '&:focus': {
    outline: '2px solid ' + theme.palette.primary.main,
  },
}));

const Board = ({ board, onMove }) => {
  const handleKeyDown = (e, index) => {
    if (e.key === 'Enter' || e.key === ' ') {
      onMove(index);
    }
  };

  const renderSquare = (index) => (
    <StyledButton
      variant="outlined"
      onClick={() => onMove(index)}
      onKeyDown={(e) => handleKeyDown(e, index)}
      aria-label={`Square ${index + 1}, ${board[index] || 'empty'}`}
      role="button"
      aria-pressed={board[index] ? 'true' : 'false'}
      tabIndex={0}
    >
      {board[index]}
    </StyledButton>
  );

  return (
    <Grid container spacing={2} role="grid" aria-labelledby="game-board" aria-live="polite">
      {[0, 1, 2].map((row) => (
        <Grid container item key={row} spacing={2}>
          {[0, 1, 2].map((col) => (
            <Grid item xs={4} key={col}>
              {renderSquare(row * 3 + col)}
            </Grid>
          ))}
        </Grid>
      ))}
    </Grid>
  );
};

export default Board;
