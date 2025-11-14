import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import styled, { useTheme } from 'styled-components/native';

const Container = styled.View`
  padding-top: ${(props) => props.theme.spacing.xxl}px;
  padding-bottom: ${(props) => props.theme.spacing.lg}px;
  padding-horizontal: ${(props) => props.theme.layout.horizontalPadding}px;
`;

const Content = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${(props) => props.theme.colors.secondary};
  border-radius: ${(props) => props.theme.borderRadius.xl}px;
  padding: ${(props) => props.theme.spacing.lg}px;
  border-width: 1px;
  border-color: ${(props) => props.theme.colors.border};
`;

const IconWrapper = styled.View`
  margin-right: ${(props) => props.theme.spacing.md}px;
`;

const TextContainer = styled.View`
  flex: 1;
`;

const WelcomeText = styled.Text`
  font-size: ${(props) => props.theme.typography.sizes['2xl']}px;
  font-weight: ${(props) => props.theme.typography.weights.semibold};
  color: ${(props) => props.theme.colors.text};
  margin-bottom: ${(props) => props.theme.spacing.xs}px;
`;

const NameText = styled.Text`
  color: ${(props) => props.theme.colors.accent};
  font-weight: ${(props) => props.theme.typography.weights.bold};
`;

const SubtitleText = styled.Text`
  font-size: ${(props) => props.theme.typography.sizes.base}px;
  color: ${(props) => props.theme.colors.text};
  opacity: 0.7;
`;

const WelcomeSection = React.memo(({ userName }) => {
  const theme = useTheme();
  // Default to "Player" if no username provided
  const displayName = userName || 'Player';

  return (
    <Container>
      <Content>
        <IconWrapper>
          <Ionicons name="sparkles" size={24} color={theme.colors.accent} />
        </IconWrapper>
        <TextContainer>
          <WelcomeText>
            Welcome back, <NameText>{displayName}</NameText>!
          </WelcomeText>
          <SubtitleText>Ready to discover your next rare pull?</SubtitleText>
        </TextContainer>
      </Content>
    </Container>
  );
});

WelcomeSection.displayName = 'WelcomeSection';

export default WelcomeSection;
