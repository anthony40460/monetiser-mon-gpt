import React from 'react';
import styled, { keyframes } from 'styled-components';
import PropTypes from 'prop-types';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: ${({ fullscreen }) => (fullscreen ? '100vh' : '100%')};
`;

const LoaderSpinner = styled.div`
  border: 4px solid ${({ theme }) => theme.colors.light};
  border-top: 4px solid ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: ${spin} 1s linear infinite;
`;

const Loader = ({ fullscreen = false }) => {
  return (
    <LoaderWrapper fullscreen={fullscreen}>
      <LoaderSpinner />
    </LoaderWrapper>
  );
};

Loader.propTypes = {
  fullscreen: PropTypes.bool,
};

export default Loader;