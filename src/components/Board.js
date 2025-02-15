import React from 'react';
import { Grid, Button } from '@mui/material';
import { styled } from '@mui/system';

const StyledButton = styled(Button)(({ theme }) => ({
  width: '100%',
  height: '100%',
  fontSize: '2rem',
  fontWeight: 'bold',
  aspectRatio: '1 / 1',
}));

const Board = ({ board, onMove }) => {
  const renderSquare = (index) => (
    <StyledButton
      variant="outlined"
      onClick={() => onMove(index)}
      aria-label={`Square ${index + 1}, ${board[index] || 'empty'}`}
    >
      {board[index]}
    </StyledButton>
  );

  return (
    <Grid container spacing={2}>
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