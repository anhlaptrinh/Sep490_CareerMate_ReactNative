import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { JobApplicationData, JobApplicationStatus } from '../../domain/models/Candidate';

interface AppliedJobCardProps {
  application: JobApplicationData;
  onPress?: () => void;
}

const STATUS_CONFIG: Record<JobApplicationStatus, { label: string; color: string; icon: string }> = {
  SUBMITTED: { label: 'Submitted', color: '#3DD5DC', icon: 'checkmark-circle' },
  REVIEWING: { label: 'Reviewing', color: '#FFA500', icon: 'time' },
  APPROVED: { label: 'Approved', color: '#4CAF50', icon: 'checkmark-circle' },
  REJECTED: { label: 'Rejected', color: '#FF6B6B', icon: 'close-circle' },
  BANNED: { label: 'Banned', color: '#8B0000', icon: 'ban' },
};

const STATUS_ORDER: JobApplicationStatus[] = ['SUBMITTED', 'REVIEWING', 'APPROVED'];

export const AppliedJobCard: React.FC<AppliedJobCardProps> = ({ application, onPress }) => {
  const currentStatus = application.status;
  const currentIndex = STATUS_ORDER.indexOf(currentStatus);
  const isRejected = currentStatus === 'REJECTED' || currentStatus === 'BANNED';

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Job Info */}
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons name="briefcase" size={24} color="#3DD5DC" />
        </View>
        <View style={styles.jobInfo}>
          <Text style={styles.jobTitle} numberOfLines={1}>
            {application.jobTitle}
          </Text>
          <Text style={styles.appliedDate}>
            Applied: {formatDate(application.createAt)}
          </Text>
        </View>
      </View>

      {/* Status Timeline */}
      {!isRejected ? (
        <View style={styles.timelineContainer}>
          {STATUS_ORDER.map((status, index) => {
            const config = STATUS_CONFIG[status];
            const isActive = index <= currentIndex;
            const isCurrent = status === currentStatus;

            return (
              <React.Fragment key={status}>
                <View style={styles.statusStep}>
                  <View
                    style={[
                      styles.statusDot,
                      isActive && styles.statusDotActive,
                      isCurrent && { backgroundColor: config.color },
                    ]}
                  >
                    {isActive && (
                      <Ionicons
                        name={config.icon as any}
                        size={12}
                        color="#FFFFFF"
                      />
                    )}
                  </View>
                  <Text
                    style={[
                      styles.statusLabel,
                      isActive && styles.statusLabelActive,
                      isCurrent && { color: config.color },
                    ]}
                  >
                    {config.label}
                  </Text>
                </View>
                {index < STATUS_ORDER.length - 1 && (
                  <View
                    style={[
                      styles.statusLine,
                      isActive && index < currentIndex && styles.statusLineActive,
                    ]}
                  />
                )}
              </React.Fragment>
            );
          })}
        </View>
      ) : (
        <View style={styles.rejectedContainer}>
          <Ionicons
            name={STATUS_CONFIG[currentStatus].icon as any}
            size={20}
            color={STATUS_CONFIG[currentStatus].color}
          />
          <Text style={[styles.rejectedText, { color: STATUS_CONFIG[currentStatus].color }]}>
            {STATUS_CONFIG[currentStatus].label}
          </Text>
        </View>
      )}

      {/* Expiration Date */}
      <View style={styles.footer}>
        <Ionicons name="calendar-outline" size={14} color="#999" />
        <Text style={styles.expirationText}>
          Expires: {formatDate(application.expirationDate)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  jobInfo: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 4,
  },
  appliedDate: {
    fontSize: 13,
    color: '#666666',
  },
  timelineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  statusStep: {
    alignItems: 'center',
    flex: 1,
  },
  statusDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  statusDotActive: {
    backgroundColor: '#3DD5DC',
  },
  statusLabel: {
    fontSize: 11,
    color: '#999999',
    fontWeight: '600',
    textAlign: 'center',
  },
  statusLabelActive: {
    color: '#333333',
  },
  statusLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#E0E0E0',
    marginHorizontal: -8,
    marginBottom: 30,
  },
  statusLineActive: {
    backgroundColor: '#3DD5DC',
  },
  rejectedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFF5F5',
    borderRadius: 8,
    marginBottom: 12,
    gap: 8,
  },
  rejectedText: {
    fontSize: 14,
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  expirationText: {
    fontSize: 12,
    color: '#999999',
  },
});
