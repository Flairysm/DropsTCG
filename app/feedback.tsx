import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, TextInput, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Feedback() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState<number | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSubmit = () => {
    // TODO: Submit feedback to API
    console.log('Feedback submitted:', { feedback, rating });
    setShowSuccessModal(true);
    setFeedback('');
    setRating(null);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Feedback</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.introText}>
          We'd love to hear your thoughts! Your feedback helps us improve the app.
        </Text>

        {/* Rating */}
        <View style={styles.ratingContainer}>
          <Text style={styles.label}>Rate your experience</Text>
          <View style={styles.ratingStars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => setRating(star)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={rating && star <= rating ? 'star' : 'star-outline'}
                  size={40}
                  color={rating && star <= rating ? '#FFD700' : 'rgba(255, 255, 255, 0.3)'}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Feedback Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Your feedback</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Tell us what you think..."
            placeholderTextColor="rgba(255, 255, 255, 0.4)"
            value={feedback}
            onChangeText={setFeedback}
            multiline
            numberOfLines={8}
            textAlignVertical="top"
          />
        </View>

        <TouchableOpacity
          style={[styles.submitButton, (!feedback || !rating) && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={!feedback || !rating}
        >
          <Text style={styles.submitButtonText}>Submit Feedback</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Ionicons name="checkmark-circle" size={64} color="#10B981" />
            <Text style={styles.modalTitle}>Thank You!</Text>
            <Text style={styles.modalMessage}>
              Your feedback has been submitted successfully. We appreciate your input!
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setShowSuccessModal(false)}
            >
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0019',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#12042b',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(64, 255, 220, 0.1)',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
  },
  headerRight: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  introText: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.8,
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: 24,
  },
  ratingContainer: {
    backgroundColor: '#12042b',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(64, 255, 220, 0.2)',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 16,
  },
  ratingStars: {
    flexDirection: 'row',
    gap: 12,
  },
  inputContainer: {
    marginBottom: 24,
  },
  textInput: {
    backgroundColor: '#12042b',
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    color: '#ffffff',
    minHeight: 200,
    borderWidth: 1,
    borderColor: 'rgba(64, 255, 220, 0.2)',
    marginTop: 12,
  },
  submitButton: {
    backgroundColor: '#40ffdc',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: 'rgba(64, 255, 220, 0.3)',
    opacity: 0.5,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0a0019',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    backgroundColor: '#12042b',
    borderRadius: 20,
    padding: 32,
    width: '85%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(64, 255, 220, 0.3)',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginTop: 16,
    marginBottom: 12,
  },
  modalMessage: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.8,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  modalButton: {
    backgroundColor: '#40ffdc',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0a0019',
  },
});

