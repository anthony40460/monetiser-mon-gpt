import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Typography from './Typography';

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const Header = styled.header`
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.light};
  padding: ${({ theme }) => theme.spacing.medium};
`;

const Main = styled.main`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.large};
`;

const Footer = styled.footer`
  background-color: ${({ theme }) => theme.colors.dark};
  color: ${({ theme }) => theme.colors.light};
  padding: ${({ theme }) => theme.spacing.medium};
  text-align: center;
`;

const Layout = ({ children }) => {
  return (
    <LayoutContainer>
      <Header>
        <Typography variant="heading" size="large">
          Monetiser-mon-gpts
        </Typography>
      </Header>
      <Main>{children}</Main>
      <Footer>
        <Typography size="small">
          © {new Date().getFullYear()} Monetiser-mon-gpts. Tous droits réservés.
        </Typography>
      </Footer>
    </LayoutContainer>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;