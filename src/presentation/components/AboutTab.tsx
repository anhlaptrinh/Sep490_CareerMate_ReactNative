import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { companyStyles } from '../styles/CompanyStyles';
import { companyDetailStyles } from '../styles/CompanyDetailStyles';

interface AboutTabProps {
  companyDetail: any;
  jobCount: number;
  onVisitWebsite: () => void;
}

export default function AboutTab({
  companyDetail,
  jobCount,
  onVisitWebsite,
}: AboutTabProps) {
  const styles = companyStyles;
  const detailStyles = companyDetailStyles;

  return (
    <View style={styles.section}>
      <View style={detailStyles.aboutTabContent}>
        {/* Company Description Section */}
        <View>
          <Text style={detailStyles.companyDescriptionTitle}>
            Company Description
          </Text>
          <Text style={detailStyles.companyDescriptionText}>
            {companyDetail?.about || 'No description available'}
          </Text>
        </View>

        {/* Contact Information Section */}
        <View style={detailStyles.dividerSection}>
          <Text style={detailStyles.contactInformationTitle}>
            Contact Information
          </Text>

          {companyDetail?.website && (
            <View style={styles.companyInfoRow}>
              <Ionicons name="globe-outline" size={20} color="#3DD5DC" />
              <TouchableOpacity onPress={onVisitWebsite}>
                <Text
                  style={detailStyles.websiteLinkText}
                  numberOfLines={1}
                >
                  {companyDetail.website}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={[styles.companyInfoRow, detailStyles.companyInfoRowWithMargin]}>
            <Ionicons name="briefcase-outline" size={20} color="#3DD5DC" />
            <Text style={detailStyles.jobCountText}>
              {jobCount} Open Position{jobCount !== 1 ? 's' : ''}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={detailStyles.visitWebsiteButtonLarge}
          onPress={onVisitWebsite}
        >
          <Text style={detailStyles.visitWebsiteButtonLargeText}>
            Visit Company Website
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
