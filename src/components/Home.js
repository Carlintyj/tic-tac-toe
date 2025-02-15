import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Typography, Box, Modal, TextField } from '@mui/material';
import { styled } from '@mui/system';
import { useUser } from '../context/UserContext';

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

const PopupModal = styled(Modal)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const PopupBox = styled(Box)(({ theme }) => ({
  background: theme.palette.background.paper,
  padding: theme.spacing(4),
  borderRadius: '8px',
  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
  textAlign: 'center',
  maxWidth: '400px',
  width: '100%',
}));

const Home = () => {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [username, setUsername] = useState('');
  const [generatedUsername, setGeneratedUsername] = useState('');

  const { saveUsername } = useUser();

  const handlePlayClick = () => {
    setOpenModal(true);
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleContinueAsAnonymous = () => {
    const anonymousName = `anonymous_${Math.floor(Math.random() * 10000)}`;
    setGeneratedUsername(anonymousName);
    setOpenModal(false);
    saveUsername(anonymousName);
    navigate(`/sessions?username=${anonymousName}`);
  };

  const handleSubmitUsername = () => {
    if (username.trim()) {
      setGeneratedUsername(username);
      saveUsername(username);
    } else {
      setGeneratedUsername('anonymous');
      saveUsername('anonymous');
    }
    setOpenModal(false);
    navigate(`/sessions?username=${generatedUsername}`);
  };

  return (
    <StyledContainer maxWidth={false}>
      <Box>
        <Title variant="h1" component="h1" aria-label="Accessible Tic-Tac-Toe Game">
          Accessible Tic-Tac-Toe
        </Title>
        <PlayButton
          variant="contained"
          color="secondary"
          size="large"
          onClick={handlePlayClick}
          aria-label="Start a new game"
          role="button"
          tabIndex={0}
        >
          Play Now
        </PlayButton>
      </Box>

      {/* Popup Modal */}
      <PopupModal open={openModal} onClose={() => setOpenModal(false)}>
        <PopupBox>
          <Typography variant="h5" component="h2" gutterBottom>
            Enter Username
          </Typography>
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            value={username}
            onChange={handleUsernameChange}
            margin="normal"
            aria-label="Enter your username"
          />
          <Box>
            <Button variant="contained" color="primary" onClick={handleSubmitUsername} fullWidth>
              Submit Username
            </Button>
            <Button
              variant="outlined"
              onClick={handleContinueAsAnonymous}
              fullWidth
              sx={{ marginTop: '10px' }}
            >
              Continue as Anonymous
            </Button>
          </Box>
        </PopupBox>
      </PopupModal>
    </StyledContainer>
  );
};

export default Home;
