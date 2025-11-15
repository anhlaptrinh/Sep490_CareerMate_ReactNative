import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { companyStyles } from '../styles/CompanyStyles';
import { errorStyles } from '../styles/ErrorStyles';
import { container } from '../../di/dependencies';
import { TYPES } from '../../di/types';
import { JdSkillRepo } from '../../data/repository/jdskill';

interface TopKeywordSectionProps {
  onKeywordPress?: (keyword: string) => void;
}

export default function TopKeywordSection({ onKeywordPress }: TopKeywordSectionProps) {
  const styles = companyStyles;
  const errorStyle = errorStyles;
  const [skills, setSkills] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const skillRepository = container.get<JdSkillRepo>(TYPES.JdSkillRepo);

  // ✅ Load top used skills on component mount
  useEffect(() => {
    const loadTopSkills = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const topSkills = await skillRepository.getTopUsedSkills();
        setSkills(topSkills);
        console.log('✅ Top keywords loaded:', topSkills.length, 'skills');
      } catch (err) {
        console.error('❌ Error loading top skills:', err);
        setError(err instanceof Error ? err.message : 'Failed to load skills');
        // Fallback to empty list on error
        setSkills([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadTopSkills();
  }, []);

  // ✅ Show loading state
  if (isLoading) {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Top Keyword</Text>
        <View style={[styles.keywordContainer, { justifyContent: 'center', alignItems: 'center', paddingVertical: 16 }]}>
          <ActivityIndicator size="small" color="#3DD5DC" />
        </View>
      </View>
    );
  }

  // ✅ Show error state
  if (error) {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Top Keyword</Text>
        <View style={[styles.keywordContainer, { justifyContent: 'center', alignItems: 'center', paddingVertical: 16 }]}>
          <Text style={errorStyle.errorMessage}>Failed to load keywords</Text>
        </View>
      </View>
    );
  }

  // ✅ Show empty state
  if (skills.length === 0) {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Top Keyword</Text>
        <View style={[styles.keywordContainer, { justifyContent: 'center', alignItems: 'center', paddingVertical: 16 }]}>
          <Text style={errorStyle.errorMessage}>No keywords available</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Top in-demand skills</Text>
      <View style={styles.keywordContainer}>
        {skills.map((skill, index) => (
          <TouchableOpacity
            key={skill.id || index}
            style={styles.keywordTag}
            onPress={() => onKeywordPress?.(skill.name)}
          >
            <Text style={styles.keywordText}>{skill.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
