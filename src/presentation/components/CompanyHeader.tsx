import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { companyStyles } from '../styles/CompanyStyles';
import { companyDetailStyles } from '../styles/CompanyDetailStyles';
import { CompanyHeaderProps } from '../types/company';



export default function CompanyHeader({
  companyDetail,
  jobCount,
  onVisitWebsite,
}: CompanyHeaderProps) {
  const styles = companyStyles;
  const detailStyles = companyDetailStyles;

  return (
    <View style={styles.spotlightCard}>
      <View style={detailStyles.headerLogoBackground}>
        {companyDetail?.logoUrl && (
          <Image
            source={{ uri: companyDetail.logoUrl }}
            style={styles.companyDetailLogo}
            onError={() => console.log('Image load error')}
          />
        )}
      </View>

      <View style={styles.spotlightOverlay}>
        <Text style={styles.spotlightName}>{companyDetail?.companyName || 'Company'}</Text>

        <View style={styles.spotlightFooter}>
          <View style={styles.spotlightJobCount}>
            <Ionicons name="briefcase-outline" size={16} color="#666666" />
            <Text style={styles.spotlightJobText}>{jobCount} job(s)</Text>
          </View>

          <TouchableOpacity
            style={detailStyles.visitWebsiteButton}
            onPress={onVisitWebsite}
          >
            <Text style={detailStyles.visitWebsiteButtonText}>
              Visit Website
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
