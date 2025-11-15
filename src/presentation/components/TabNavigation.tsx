import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { companyDetailStyles } from '../styles/CompanyDetailStyles';
import { TabNavigationProps } from '../types/company';


export default function TabNavigation({
  activeTab,
  jobsCount,
  onAboutPress,
  onJobsPress,
}: TabNavigationProps) {
  const detailStyles = companyDetailStyles;

  return (
    <View style={detailStyles.tabNavigationContainer}>
      <TouchableOpacity
        style={[
          detailStyles.tabButtonBase,
          activeTab === 'about' ? detailStyles.tabBorderActive : detailStyles.tabBorderInactive,
        ]}
        onPress={onAboutPress}
      >
        <Text
          style={[
            detailStyles.tabButtonText,
            activeTab === 'about' ? detailStyles.tabButtonActive : detailStyles.tabButtonInactive,
          ]}
        >
          About
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          detailStyles.tabButtonBase,
          activeTab === 'jobs' ? detailStyles.tabBorderActive : detailStyles.tabBorderInactive,
        ]}
        onPress={onJobsPress}
      >
        <Text
          style={[
            detailStyles.tabButtonText,
            activeTab === 'jobs' ? detailStyles.tabButtonActive : detailStyles.tabButtonInactive,
          ]}
        >
          Jobs ({jobsCount})
        </Text>
      </TouchableOpacity>
    </View>
  );
}
