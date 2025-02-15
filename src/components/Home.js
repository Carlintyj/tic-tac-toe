import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Typography, Box } from '@mui/material';
import { styled } from '@mui/system';

const StyledContainer = styled(Container)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  textAlign: 'center',
  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
}));

const Title = styled(Typography)(({ theme }) => ({
  color: theme.palette.common.white,
  marginBottom: theme.spacing(4),
  textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
}));

const PlayButton = styled(Button)(({ theme }) => ({
  fontSize: '1.5rem',
  padding: theme.spacing(2, 6),
  borderRadius: '50px',
  boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
}));

const Home = () => {
  const navigate = useNavigate();

  const handlePlayClick = () => {
    navigate('/sessions');
  };

  return (
    <StyledContainer maxWidth={false}>
      <Box>
        <Title variant="h1" component="h1">
          Accessible Tic-Tac-Toe
        </Title>
        <PlayButton
          variant="contained"
          color="secondary"
          size="large"
          onClick={handlePlayClick}
        >
          Play Now
        </PlayButton>
      </Box>
    </StyledContainer>
  );
};

export default Home;