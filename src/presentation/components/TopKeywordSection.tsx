import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { companyStyles } from '../styles/CompanyStyles';

const topKeywords = [
  'PHP', 'Business Analyst', 'Front-End', 'Java',
  'Back-End', 'JavaScript', 'React', 'Tester'
];

interface TopKeywordSectionProps {
  onKeywordPress?: (keyword: string) => void;
}

export default function TopKeywordSection({ onKeywordPress }: TopKeywordSectionProps) {
  const styles = companyStyles;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Top Keyword</Text>
      <View style={styles.keywordContainer}>
        {topKeywords.map((keyword, index) => (
          <TouchableOpacity
            key={index}
            style={styles.keywordTag}
            onPress={() => onKeywordPress?.(keyword)}
          >
            <Text style={styles.keywordText}>{keyword}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
