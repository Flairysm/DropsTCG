import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

const StyledSafeArea = styled(SafeAreaView)`
  flex: 1;
  ${({ backgroundColor }) => backgroundColor && `background-color: ${backgroundColor};`}
`;

export const SafeArea = ({ children, edges = ['top', 'bottom', 'left', 'right'], backgroundColor, style }) => {
  return (
    <StyledSafeArea edges={edges} backgroundColor={backgroundColor} style={style}>
      {children}
    </StyledSafeArea>
  );
};

export default SafeArea;

