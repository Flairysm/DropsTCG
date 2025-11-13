import React from 'react';
import { Modal, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styled, { useTheme } from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';

const ModalOverlay = styled(TouchableOpacity)`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: flex-end;
`;

const PanelContainer = styled.View`
  background-color: ${(props) => props.theme.colors.secondary};
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  max-height: 80%;
  padding-top: 20px;
`;

const PanelHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-horizontal: 20px;
  padding-bottom: 16px;
  border-bottom-width: 1px;
  border-bottom-color: ${(props) => props.theme.colors.borderLight};
`;

const PanelTitle = styled.Text`
  font-size: 20px;
  font-weight: 700;
  color: ${(props) => props.theme.colors.text};
`;

const CloseButton = styled(TouchableOpacity)`
  padding: 4px;
`;

const PanelContent = styled.View`
  padding: 20px;
`;

const EmptyState = styled.View`
  align-items: center;
  justify-content: center;
  padding-vertical: 40px;
`;

const EmptyText = styled.Text`
  font-size: 14px;
  color: ${(props) => props.theme.colors.text};
  opacity: 0.6;
  margin-top: 12px;
`;

export default function NotificationsPanel({ visible, onClose }) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <ModalOverlay activeOpacity={1} onPress={onClose}>
        <PanelContainer
          style={{ paddingBottom: Math.max(insets.bottom, 20) }}
          onStartShouldSetResponder={() => true}
        >
          <PanelHeader>
            <PanelTitle>Notifications</PanelTitle>
            <CloseButton onPress={onClose}>
              <Ionicons name="close" size={24} color={theme.colors.text} />
            </CloseButton>
          </PanelHeader>
          <PanelContent>
            <EmptyState>
              <Ionicons name="notifications-outline" size={48} color={theme.colors.accent} />
              <EmptyText>No notifications</EmptyText>
            </EmptyState>
          </PanelContent>
        </PanelContainer>
      </ModalOverlay>
    </Modal>
  );
}

