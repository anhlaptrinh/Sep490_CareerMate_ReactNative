import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { companyStyles } from '../styles/CompanyStyles';
import { CompanyListSectionProps } from '../types/company';


export default function CompanyListSection({
  companies,
  onCompanyPress,
  onViewMorePress,
  onBookmarkPress,
}: CompanyListSectionProps) {
  const styles = companyStyles;
  const [pressedCompanyId, setPressedCompanyId] = useState<string | null>(null);

  const handleCompanyPress = (company: any) => {
    onCompanyPress(company);
  };

  return (
    <>
      {/* Company List Header with Toggle */}
      <View style={styles.companyListHeader}>
        <Text style={styles.companyListTitle}>Popular Companies</Text>
      </View>

      {/* Filters */}
      <View style={styles.filterSection}>
        <View style={styles.filterRow}>
          <TouchableOpacity
            style={styles.filterButton}
            activeOpacity={1}
          >
            <Text style={styles.filterText}>Location</Text>
            <Text style={styles.filterSubText}>All locations</Text>
            <Ionicons name="chevron-down" size={16} color="#666" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Company Cards */}
      <View style={styles.companyList}>
        {companies.map((company) => (
          <TouchableOpacity
            key={company.id}
            onPressIn={() => setPressedCompanyId(company.id)}
            onPressOut={() => setPressedCompanyId(null)}
            style={[
              styles.companyCard,
              pressedCompanyId === company.id && {
                borderWidth: 2,
                borderColor: '#3DD5DC',
              }
            ]}
            onPress={() => handleCompanyPress(company)}
            activeOpacity={1}
          >
            <View style={styles.companyHeader}>
              <View style={styles.companyLogo}>
                <Image
                  source={{ uri: company.logoUrl }}
                  style={styles.companyLogo}
                />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.companyName} numberOfLines={2}>{company.companyName}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
                  <Ionicons name="briefcase-outline" size={14} color="#666" />
                  <Text style={[styles.companyInfoText, { marginLeft: 4 }]} numberOfLines={1}>
                    {company.jobCount || 0} job(s)
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                  <Ionicons name="location-outline" size={14} color="#666" />
                  <Text style={[styles.companyInfoText, { marginLeft: 4 }]} numberOfLines={1}>
                    {company.companyAddress}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.bookmarkButton}
                onPress={() => onBookmarkPress?.(company)}
              >
                <Ionicons name="bookmark-outline" size={20} color="#666" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* View More Button */}
      <TouchableOpacity
        style={styles.seeMoreButton}
        onPress={onViewMorePress}
        activeOpacity={0.5}
      >
        <Text style={styles.seeMoreButtonText}>View More Companies</Text>
      </TouchableOpacity>
    </>
  );
}
