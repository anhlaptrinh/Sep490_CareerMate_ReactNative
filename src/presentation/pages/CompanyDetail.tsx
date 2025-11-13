import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Linking,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { companyStyles } from '../styles/CompanyStyles';
import { companyDetailStyles } from '../styles/CompanyDetailStyles';
import { jobStyles } from '../styles/JobStyles';
import { JobStackParamList } from '../navigation/JobStackNavigator';
import { CompanyData } from '../types/company';

type CompanyDetailScreenNavigationProp = NativeStackNavigationProp<JobStackParamList, 'CompanyDetailScreen'>;


export default function CompanyDetailScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<CompanyDetailScreenNavigationProp>();
  const styles = companyStyles;
  const detailStyles = companyDetailStyles;
  const jobListStyles = jobStyles;
  const [activeTab, setActiveTab] = useState<'about' | 'jobs'>('about');
  // State để theo dõi job được chọn - dùng để highlight border khi user nhấn
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);

  const { companyData } = route.params as { companyData: CompanyData };

  const jobCount = useMemo(() => companyData.jobs.length, [companyData.jobs]);

  const handleVisitWebsite = () => {
    if (companyData.website) {
      Linking.openURL(companyData.website);
    }
  };

  const handleJobPress = (jobId: number) => {
    navigation.navigate('JobDetailScreen', { jobId });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
      >
        {/* Company Header Banner */}
        <View style={styles.spotlightCard}>
          <View
            style={[
              styles.spotlightImage,
              { backgroundColor: '#fff' },
            ]}
          >
            <Image
              source={{ uri: companyData.logoUrl }}
              style={styles.companyDetailLogo}
              onError={() => console.log('Image load error')}
            />
          </View>

          <View style={styles.spotlightOverlay}>
            <Text style={styles.spotlightName}>{companyData.name}</Text>

            <View style={styles.spotlightFooter}>
              <View style={styles.spotlightJobCount}>
                <Ionicons name="briefcase-outline" size={16} color="#666666" />
                <Text style={styles.spotlightJobText}>{jobCount} job(s)</Text>
              </View>

              <TouchableOpacity
                style={detailStyles.visitWebsiteButton}
                onPress={handleVisitWebsite}
              >
                <Text style={detailStyles.visitWebsiteButtonText}>
                  Visit Website
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Tab Navigation */}
        <View style={detailStyles.tabNavigationContainer}>
          <TouchableOpacity
            style={[
              detailStyles.tabButtonBase,
              {
                borderBottomColor: activeTab === 'about' ? '#3DD5DC' : 'transparent',
              },
            ]}
            onPress={() => setActiveTab('about')}
          >
            <Text
              style={[
                detailStyles.tabButtonText,
                {
                  fontWeight: activeTab === 'about' ? '700' : '600',
                  color: activeTab === 'about' ? '#3DD5DC' : '#999999',
                },
              ]}
            >
              About
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              detailStyles.tabButtonBase,
              {
                borderBottomColor: activeTab === 'jobs' ? '#3DD5DC' : 'transparent',
              },
            ]}
            onPress={() => setActiveTab('jobs')}
          >
            <Text
              style={[
                detailStyles.tabButtonText,
                {
                  fontWeight: activeTab === 'jobs' ? '700' : '600',
                  color: activeTab === 'jobs' ? '#3DD5DC' : '#999999',
                },
              ]}
            >
              Jobs ({jobCount})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        {activeTab === 'about' ? (
          // About Tab
          <View style={styles.section}>
            <View style={detailStyles.aboutTabContent}>
              {/* Company Description Section */}
              <View>
                <Text style={detailStyles.companyDescriptionTitle}>
                  Company Description
                </Text>
                <Text style={detailStyles.companyDescriptionText}>
                  {companyData.about}
                </Text>
              </View>

              {/* Contact Information Section */}
              <View style={detailStyles.dividerSection}>
                <Text style={detailStyles.contactInformationTitle}>
                  Contact Information
                </Text>

                <View style={styles.companyInfoRow}>
                  <Ionicons name="globe-outline" size={20} color="#3DD5DC" />
                  <TouchableOpacity onPress={handleVisitWebsite}>
                    <Text
                      style={detailStyles.websiteLinkText}
                      numberOfLines={1}
                    >
                      {companyData.website}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={[styles.companyInfoRow, { marginTop: 12 }]}>
                  <Ionicons name="briefcase-outline" size={20} color="#3DD5DC" />
                  <Text style={detailStyles.jobCountText}>
                    {jobCount} Open Position{jobCount !== 1 ? 's' : ''}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={detailStyles.visitWebsiteButtonLarge}
                onPress={handleVisitWebsite}
              >
                <Text style={detailStyles.visitWebsiteButtonLargeText}>
                  Visit Company Website
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          // ✅ Jobs Tab - Hiển thị danh sách công việc với layout giống Job.tsx
          <View style={jobListStyles.section}>
            <View style={jobListStyles.jobsList}>
              {companyData.jobs.length > 0 ? (
                companyData.jobs.map((job) => {
                  // Kiểm tra xem job hiện tại có đang được chọn không
                  const isSelected = selectedJobId === job.id;
                  return (
                    <TouchableOpacity
                      key={job.id}
                      // Trigger khi user nhấn vào card
                      onPressIn={() => setSelectedJobId(job.id)}
                      // Hủy highlight khi user thả phím
                      onPressOut={() => setSelectedJobId(null)}
                      style={[
                        jobListStyles.jobCard,
                        {
                          // Thêm border màu cyan khi card được chọn
                          borderWidth: 2,
                          borderColor: isSelected ? '#3DD5DC' : 'transparent',
                        },
                      ]}
                      activeOpacity={1}
                      onPress={() => {
                        // Điều hướng tới JobDetailScreen với jobId
                        handleJobPress(job.id);
                      }}
                    >
                      {/* Job Card Header: Title, Badge, Bookmark Button */}
                      <View style={jobListStyles.jobHeader}>
                        <View style={jobListStyles.jobTitleContainer}>
                          <Text style={jobListStyles.jobTitle}>{job.title}</Text>
                          {/* Work Model Badge (Onsite/Hybrid/Remote) */}
                          <View style={jobListStyles.jobTypeBadge}>
                            <Text style={jobListStyles.jobTypeText}>{job.workModel}</Text>
                          </View>
                        </View>
                        {/* Bookmark Button */}
                        <TouchableOpacity>
                          <Ionicons name="bookmark-outline" size={22} color="#666" />
                        </TouchableOpacity>
                      </View>

                      {/* Company Name */}
                      <Text style={jobListStyles.jobCompany}>{companyData.name}</Text>

                      {/* Location & Salary Info */}
                      <View style={jobListStyles.jobInfo}>
                        <View style={jobListStyles.jobInfoItem}>
                          <Ionicons name="location-outline" size={16} color="#666" />
                          <Text style={jobListStyles.jobInfoText}>{job.address}</Text>
                        </View>
                        <View style={jobListStyles.jobInfoItem}>
                          <Ionicons name="cash-outline" size={16} color="#666" />
                          <Text style={jobListStyles.jobInfoText}>{job.salaryRange}</Text>
                        </View>
                      </View>

                      {/* Experience & Expiration */}
                      <Text style={jobListStyles.jobInfoText}>
                        Experience: {job.yearsOfExperience}+ years
                      </Text>
                      <Text style={jobListStyles.jobInfoText}>
                        Expiration: {job.expirationDate}
                      </Text>

                      {/* Skills Tags */}
                      <View style={jobListStyles.jobTags}>
                        {job.skills.map((skill: any, index: number) => (
                          <View key={index} style={jobListStyles.jobTag}>
                            <Text style={jobListStyles.jobTagText}>
                              {skill.mustToHave ? '⭐ ' : ''}{skill.name}
                            </Text>
                          </View>
                        ))}
                      </View>

                      {/* Posted Time */}
                      <Text style={jobListStyles.jobPostedTime}>{job.postTime}</Text>
                    </TouchableOpacity>
                  );
                })
              ) : (
                // Empty State - Không có công việc
                <View style={detailStyles.emptyJobsContent}>
                  <Ionicons name="briefcase-outline" size={40} color="#CCCCCC" />
                  <Text
                    style={{
                      fontSize: 14,
                      color: '#999999',
                      marginTop: 12,
                      textAlign: 'center',
                    }}
                  >
                    No open positions at the moment
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

        <View style={{ height: Platform.OS === 'ios' ? 20 : 10 }} />
      </ScrollView>
    </View>
  );
}
