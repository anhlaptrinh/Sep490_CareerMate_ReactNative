import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface CompanyCardProps {
  companyName: string;
  description: string;
  jobCount?: number;
  tags: string[];
  logo?: string;
  onPress?: () => void;
  onBookmarkPress?: () => void;
  isBookmarked?: boolean;
}

export default function CompanyCard({
  companyName,
  description,
  jobCount,
  tags,
  logo,
  onPress,
  onBookmarkPress,
  isBookmarked = false,
}: CompanyCardProps) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.cardContent}>
        {/* Company Image with Gradient */}
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.companyImage}
        >
          <Ionicons name="briefcase" size={60} color="rgba(255,255,255,0.3)" />
        </LinearGradient>

        {/* Logo Badge */}
        {logo ? (
          <Image
            source={{ uri: logo }}
            style={[styles.logoBadge, { width: 50, height: 50, borderRadius: 16 }]}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.logoBadge}>
            <Ionicons name="business" size={24} color="#3DD5DC" />
          </View>
        )}

        {/* Company Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.companyName} numberOfLines={1}>
            {companyName}
          </Text>
          <Text style={styles.description} numberOfLines={2}>
            {description}
          </Text>

          {/* Job Count */}
          {jobCount !== undefined &&
            <View style={styles.jobCountContainer}>
              <Ionicons name="briefcase-outline" size={16} color="#666" />
              <Text style={styles.jobCount}>{jobCount} jobs</Text>
            </View>
          }


          {/* Tags */}
          <View style={styles.tagsContainer}>
            {tags.slice(0, 5).map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Bookmark Button */}
        <TouchableOpacity
          style={styles.bookmarkButton}
          onPress={onBookmarkPress}
          activeOpacity={0.7}
        >
          <Ionicons
            name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
            size={24}
            color={isBookmarked ? '#3DD5DC' : '#999'}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  cardContent: {
    position: 'relative',
  },
  companyImage: {
    width: '100%',
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoBadge: {
    position: 'absolute',
    top: 120,
    left: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoPlaceholder: {
    width: 50,
    height: 50,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    padding: 16,
    paddingTop: 40,
  },
  companyName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3DD5DC',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#333333',
    lineHeight: 20,
    marginBottom: 12,
  },
  jobCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  jobCount: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 6,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 12,
    color: '#666666',
  },
  bookmarkButton: {
    position: 'absolute',
    top: 120,
    right: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
