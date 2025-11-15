import { StyleSheet } from 'react-native';

export const errorStyles = StyleSheet.create({
  // === Loading State ===
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: '#999999',
  },

  // === Error State ===
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorTitle: {
    marginTop: 16,
    color: '#3DD5DC',
    fontSize: 16,
    fontWeight: '600',
  },
  errorMessage: {
    marginTop: 8,
    color: '#666666',
    textAlign: 'center',
    paddingHorizontal: 16,
  },

  // === Empty State ===
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#999999',
    marginTop: 12,
    textAlign: 'center',
  },

  // === Loading More ===
  loadingMoreContainer: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  loadingMoreText: {
    marginTop: 8,
    color: '#999999',
    fontSize: 12,
  },
});
