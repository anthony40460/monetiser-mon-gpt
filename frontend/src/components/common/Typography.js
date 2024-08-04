import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const StyledText = styled.p`
  font-family: ${({ theme, variant }) =>
    variant === 'heading' ? theme.fonts.heading : theme.fonts.body};
  font-size: ${({ theme, size }) => theme.fontSizes[size]};
  font-weight: ${({ weight }) => weight};
  color: ${({ theme, color }) => theme.colors[color] || color};
  margin: 0;
  line-height: 1.5;
  ${({ truncate }) =>
    truncate &&
    `
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  `}
`;

const Typography = ({
  variant = 'body',
  size = 'medium',
  weight = 'normal',
  color = 'text',
  truncate = false,
  as,
  children,
  ...props
}) => {
  const Component = as || (variant === 'heading' ? 'h2' : 'p');
  
  return (
    <StyledText
      as={Component}
      variant={variant}
      size={size}
      weight={weight}
      color={color}
      truncate={truncate}
      {...props}
    >
      {children}
    </StyledText>
  );
};

Typography.propTypes = {
  variant: PropTypes.oneOf(['body', 'heading']),
  size: PropTypes.oneOf(['small', 'medium', 'large', 'xlarge', 'xxlarge']),
  weight: PropTypes.oneOf(['normal', 'bold', '300', '400', '500', '600', '700']),
  color: PropTypes.string,
  truncate: PropTypes.bool,
  as: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default Typography;