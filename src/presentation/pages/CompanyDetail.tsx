import React, { useMemo, useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Linking,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { companyStyles } from '../styles/CompanyStyles';
import { companyDetailStyles } from '../styles/CompanyDetailStyles';
import { jobStyles } from '../styles/JobStyles';
import { errorStyles } from '../styles/ErrorStyles';
import { CompanyStackParamList } from '../navigation/CompanyStackNavigator';
import { CompanyData } from '../types/company';
import { container } from '../../di/dependencies';
import { TYPES } from '../../di/types';
import { JobRepo } from '../../data/repository/job';
import { CompanyRepo } from '../../data/repository/company';

// ✅ Transform company job data từ API sang format UI
const mapCompanyJobForUI = (job: any) => ({
  id: job.id,
  title: job.title,
  company: '',
  location: job.address,
  salary: job.salaryRange,
  yearsOfExperience: job.yearsOfExperience,
  expirationDate: job.expirationDate,
  workModel: job.workModel,
  tags: job.skills || [],
  postedTime: job.postTime,
});

type CompanyDetailScreenNavigationProp = NativeStackNavigationProp<CompanyStackParamList, 'CompanyDetailScreen'>;

export default function CompanyDetailScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<CompanyDetailScreenNavigationProp>();
  const styles = companyStyles;
  const detailStyles = companyDetailStyles;
  const jobListStyles = jobStyles;
  const errorStyle = errorStyles;
  const [activeTab, setActiveTab] = useState<'about' | 'jobs'>('about');
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [companyDetail, setCompanyDetail] = useState<any>(null);
  const [companyJobs, setCompanyJobs] = useState<any[]>([]);
  const [isLoadingDetail, setIsLoadingDetail] = useState(true);
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMoreJobs, setHasMoreJobs] = useState(true);

  const { companyData } = route.params as { companyData: CompanyData };
  const PAGE_SIZE = 5;

  // ✅ Get JobRepo và CompanyRepo từ DI container
  const jobRepository = container.get<JobRepo>(TYPES.JobRepo);
  const companyRepository = container.get<CompanyRepo>(TYPES.CompanyRepo);

  // ✅ Load company detail khi component mount
  useEffect(() => {
    const loadCompanyDetail = async () => {
      try {
        setIsLoadingDetail(true);
        setError(null);

        // Gọi API để lấy chi tiết công ty
        const detail = await companyRepository.getCompanyDetail(companyData.id);
        setCompanyDetail(detail);
        console.log('✅ Company detail loaded:', detail);
      } catch (err) {
        console.error('❌ Error loading company detail:', err);
        setError(err instanceof Error ? err.message : 'Failed to load company detail');
      } finally {
        setIsLoadingDetail(false);
      }
    };

    if (companyData.id) {
      loadCompanyDetail();
    }
  }, [companyData.id]);

  // ✅ Load company jobs khi nhấn tab Jobs
  const handleJobsTabPress = async () => {
    setActiveTab('jobs');

    if (companyJobs.length === 0 && !isLoadingJobs) {
      await loadCompanyJobs(0, true);
    }
  };

  // ✅ Hàm load company jobs
  const loadCompanyJobs = async (page: number, isFirst: boolean = false) => {
    try {
      setIsLoadingJobs(true);
      setError(null);

      // Gọi API để lấy danh sách jobs của công ty
      const response = await jobRepository.getCompanyJobs(companyData.id, page, PAGE_SIZE);
      const jobs = response.result.content;
      const mappedJobs = jobs.map(mapCompanyJobForUI);

      if (isFirst) {
        setCompanyJobs(mappedJobs);
      } else {
        setCompanyJobs(prev => [...prev, ...mappedJobs]);
      }

      setCurrentPage(page + 1);
      setHasMoreJobs(jobs.length === PAGE_SIZE);

      console.log('✅ Company jobs loaded, page:', page, 'count:', jobs.length);
    } catch (err) {
      console.error('❌ Error loading company jobs:', err);
      setError(err instanceof Error ? err.message : 'Failed to load jobs');
    } finally {
      setIsLoadingJobs(false);
    }
  };

  // ✅ Handle View More button
  const handleViewMore = async () => {
    if (isLoadingJobs || !hasMoreJobs) return;
    await loadCompanyJobs(currentPage, false);
  };

  const jobCount = useMemo(() => companyJobs.length, [companyJobs]);

  const handleVisitWebsite = () => {
    if (companyData.website) {
      Linking.openURL(companyData.website);
    }
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
          <View style={detailStyles.headerLogoBackground}>
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
              activeTab === 'about' ? detailStyles.tabBorderActive : detailStyles.tabBorderInactive,
            ]}
            onPress={() => setActiveTab('about')}
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
            onPress={handleJobsTabPress}
          >
            <Text
              style={[
                detailStyles.tabButtonText,
                activeTab === 'jobs' ? detailStyles.tabButtonActive : detailStyles.tabButtonInactive,
              ]}
            >
              Jobs ({companyJobs.length})
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

                <View style={[styles.companyInfoRow, detailStyles.companyInfoRowWithMargin]}>
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
          // ✅ Jobs Tab - Load từ API với phân trang
          <View style={jobListStyles.section}>
            {isLoadingJobs && companyJobs.length === 0 ? (
              <View style={[jobListStyles.container, errorStyle.loadingContainer, errorStyle.emptyContainer]}>
                <ActivityIndicator size="large" color="#3DD5DC" />
                <Text style={errorStyle.loadingText}>Loading jobs...</Text>
              </View>
            ) : error ? (
              <View style={[jobListStyles.container, errorStyle.errorContainer, errorStyle.emptyContainer]}>
                <Ionicons name="alert-circle-outline" size={48} color="#FF6B35" />
                <Text style={[errorStyle.errorTitle, { color: '#FF6B35' }]}>
                  Error loading jobs
                </Text>
              </View>
            ) : (
              <View style={jobListStyles.jobsList}>
                {companyJobs.length > 0 ? (
                  <>
                    {companyJobs.map((job: any) => {
                      const isSelected = selectedJobId === job.id;
                      return (
                        <TouchableOpacity
                          key={job.id}
                          onPressIn={() => setSelectedJobId(job.id)}
                          onPressOut={() => setSelectedJobId(null)}
                          style={[
                            jobListStyles.jobCard,
                            selectedJobId === job.id ? detailStyles.jobCardSelected : detailStyles.jobCardUnselected,
                          ]}
                          activeOpacity={1}
                          onPress={() => {
                            navigation.navigate('JobDetailScreen', { jobId: job.id });
                          }}
                        >
                          <View style={jobListStyles.jobHeader}>
                            <View style={jobListStyles.jobTitleContainer}>
                              <Text style={jobListStyles.jobTitle}>{job.title}</Text>
                              <View style={jobListStyles.jobTypeBadge}>
                                <Text style={jobListStyles.jobTypeText}>{job.workModel}</Text>
                              </View>
                            </View>
                            <TouchableOpacity>
                              <Ionicons name="bookmark-outline" size={22} color="#666" />
                            </TouchableOpacity>
                          </View>

                          <View style={jobListStyles.jobInfo}>
                            <View style={jobListStyles.jobInfoItem}>
                              <Ionicons name="location-outline" size={16} color="#666" />
                              <Text style={jobListStyles.jobInfoText}>{job.location}</Text>
                            </View>
                            <View style={jobListStyles.jobInfoItem}>
                              <Ionicons name="cash-outline" size={16} color="#666" />
                              <Text style={jobListStyles.jobInfoText}>{job.salary}</Text>
                            </View>
                          </View>

                          <Text style={jobListStyles.jobInfoText}>
                            Experience: {job.yearsOfExperience}+ years
                          </Text>
                          <Text style={jobListStyles.jobInfoText}>
                            Expiration: {job.expirationDate}
                          </Text>

                          {job.tags && job.tags.length > 0 && (
                            <View style={jobListStyles.jobTags}>
                              {job.tags.map((tag: string, index: number) => (
                                <View key={index} style={jobListStyles.jobTag}>
                                  <Text style={jobListStyles.jobTagText}>{tag}</Text>
                                </View>
                              ))}
                            </View>
                          )}

                          <Text style={jobListStyles.jobPostedTime}>{job.postedTime}</Text>
                        </TouchableOpacity>
                      );
                    })}

                    {hasMoreJobs && !isLoadingJobs && (
                      <TouchableOpacity style={jobListStyles.viewMoreButton} onPress={handleViewMore}>
                        <Text style={jobListStyles.viewMoreText}>View More</Text>
                      </TouchableOpacity>
                    )}

                    {isLoadingJobs && (
                      <View style={errorStyle.loadingMoreContainer}>
                        <ActivityIndicator size="small" color="#3DD5DC" />
                        <Text style={errorStyle.loadingMoreText}>Loading more...</Text>
                      </View>
                    )}
                  </>
                ) : (
                  <View style={detailStyles.emptyJobsContent}>
                    <Ionicons name="briefcase-outline" size={40} color="#CCCCCC" />
                    <Text style={errorStyle.emptyText}>
                      No open positions at the moment
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>
        )}

        <View style={detailStyles.bottomPadding} />
      </ScrollView>
    </View>
  );
}
