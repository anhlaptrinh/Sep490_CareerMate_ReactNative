import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { JobRecommendationItem } from '../../domain/models/AIModels';

interface JobRecommendationCardProps {
  job: JobRecommendationItem;
  onPress?: () => void;
}

export const JobRecommendationCard: React.FC<JobRecommendationCardProps> = ({ job, onPress }) => {
  const matchPercentage = Math.round(job.final_score * 100);
  
  // Parse skills - handle both string and array formats
  const skillsArray: string[] = typeof job.skills === 'string' 
    ? job.skills.split(',').map((s: string) => s.trim()).filter((s: string) => s.length > 0)
    : Array.isArray(job.skills) 
    ? job.skills 
    : [];
  
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      {/* Match Badge */}
      <View style={[styles.matchBadge, { backgroundColor: getMatchColor(matchPercentage) }]}>
        <Text style={styles.matchText}>{matchPercentage}% Match</Text>
      </View>

      {/* Job Title */}
      <Text style={styles.jobTitle} numberOfLines={2}>
        {job.title}
      </Text>

      {/* Skills */}
      {skillsArray.length > 0 && (
        <View style={styles.skillsContainer}>
          {skillsArray.slice(0, 3).map((skill: string, index: number) => (
            <View key={index} style={styles.skillChip}>
              <Text style={styles.skillText}>{skill}</Text>
            </View>
          ))}
          {skillsArray.length > 3 && (
            <View style={styles.skillChip}>
              <Text style={styles.skillText}>+{skillsArray.length - 3}</Text>
            </View>
          )}
        </View>
      )}

      {/* Description */}
      <Text style={styles.description} numberOfLines={2}>
        {job.description}
      </Text>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Ionicons name="git-merge-outline" size={16} color="#3DD5DC" />
          <Text style={styles.statText}>
            {Math.round(Math.max(0, job.skill_overlap * 100))}% Skills
          </Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="sparkles-outline" size={16} color="#3DD5DC" />
          <Text style={styles.statText}>
            Score: {job.final_score.toFixed(2)}
          </Text>
        </View>
      </View>

      {/* View Details */}
      <View style={styles.footer}>
        <Text style={styles.viewDetails}>View Details</Text>
        <Ionicons name="arrow-forward" size={16} color="#3DD5DC" />
      </View>
    </TouchableOpacity>
  );
};

const getMatchColor = (percentage: number): string => {
  if (percentage >= 80) return '#4CAF50';
  if (percentage >= 60) return '#FFA500';
  if (percentage >= 40) return '#FF9800';
  return '#FF6B6B';
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  matchBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 12,
  },
  matchText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 12,
    lineHeight: 24,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  skillChip: {
    backgroundColor: '#F0F9FA',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  skillText: {
    fontSize: 12,
    color: '#3DD5DC',
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    marginBottom: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 13,
    color: '#666666',
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 6,
  },
  viewDetails: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3DD5DC',
  },
});
