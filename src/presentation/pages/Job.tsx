// src/screens/JobScreen.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Platform,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CompanyCard from '../components/CompanyCard';
import AppHeader from '../components/AppHeader';
import { jobStyles } from '../styles/JobStyles';
import { errorStyles } from '../styles/ErrorStyles';
import { useRequireAuth } from '../hooks/useRequireAuth';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { JobStackParamList } from '../navigation/JobStackNavigator';
// ✅ Import từ Domain & Data layer
import { mapJobsForUI, getPaginatedJobs, groupJobsByCompany } from '../../domain/usecases/GetJobsUseCase';
import { container } from '../../di/dependencies';
import { TYPES } from '../../di/types';
import { JobRepo } from '../../data/repository/job';
import { JobPosting } from '../../domain/models/JobModel';

const { width: screenWidth } = Dimensions.get('window');

// Định nghĩa type navigation cho JobScreen
// Giúp TypeScript hiểu rằng navigate có thể đến các screen trong JobStackParamList
// 'JobScreen' ở đây chỉ định: “Mình đang viết code trong JobScreen, nên navigation này áp dụng từ JobScreen.”
type JobScreenNavigationProp = NativeStackNavigationProp<JobStackParamList, 'JobScreen'>;

export default function JobScreen() {
  const PAGE_SIZE = 5;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [jobsData, setJobsData] = useState<JobPosting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const scrollY = useRef(new Animated.Value(0)).current;
  const styles = jobStyles;
  const errorStyle = errorStyles;
  const withAuth = useRequireAuth();

  // ✅ Get JobRepo từ DI container
  const jobRepository = container.get<JobRepo>(TYPES.JobRepo);

  // Handler functions with auth protection
  const handleBookmarkCompany = withAuth((companyId: string) => {
    // TODO: Call API to save company bookmark
  }, 'Please login to bookmark companies');

  const handleBookmarkJob = withAuth((jobId: string) => {
    // TODO: Call API to save job bookmark
  }, 'Please login to bookmark jobs');

  const navigation = useNavigation<JobScreenNavigationProp>();

  // ✅ UseEffect - Fetch jobs từ API khi component mount
  useEffect(() => {
    const loadJobs = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Gọi repository để lấy jobs
        const response = await jobRepository.getJobs(0, PAGE_SIZE, 'createAt', 'desc');
        setJobsData(response.result.content);
        console.log('✅ Jobs loaded successfully:', response.result.content.length);
      } catch (err) {
        console.error('❌ Error loading jobs:', err);
        setError(err instanceof Error ? err.message : 'Failed to load jobs');
      } finally {
        setIsLoading(false);
      }
    };

    loadJobs();
  }, []);

  // ✅ Map jobs từ API response thành format UI
  const mappedJobs = mapJobsForUI(getPaginatedJobs(jobsData, PAGE_SIZE));

  // ✅ Group jobs theo company
  const companies = Object.values(groupJobsByCompany(mappedJobs));

  // ✅ Render loading state
  if (isLoading) {
    return (
      <View style={[styles.container, errorStyle.loadingContainer]}>
        <ActivityIndicator size="large" color="#3DD5DC" />
        <Text style={errorStyle.loadingText}>Loading jobs...</Text>
      </View>
    );
  }

  // ✅ Render error state
  if (error) {
    return (
      <View style={[styles.container, errorStyle.errorContainer]}>
        <Ionicons name="alert-circle-outline" size={48} color="#3DD5DC" />
        <Text style={errorStyle.errorTitle}>Error loading jobs</Text>
        <Text style={errorStyle.errorMessage}>{error}</Text>
      </View>
    );
  }

  // Cấu trúc dữ liệu phục vụ cho việc sử dụng jobsData trong navigation
  const jobDataForNav = jobsData;

  return (
    <View style={styles.container}>
      <AppHeader
        scrollY={scrollY}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        showSearch={true}
      />

      <Animated.ScrollView
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner */}
        <View style={styles.bannerSection}>
          <View style={styles.bannerCard}>
            <Text style={styles.bannerTitle}>Find Top IT Jobs for you</Text>
            <Text style={styles.bannerDescription}>
              Looking for new opportunities? Check it here & make your IT career outstanding
            </Text>
            <TouchableOpacity style={styles.bannerButton}>
              <Text style={styles.bannerButtonText}>Click here to find more</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Jobs at Top Companies */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Jobs at Top Companies</Text>
            <TouchableOpacity>
              <Text style={styles.seeMoreText}>See More</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {companies.map((company: any) => {
              const companyJobs = jobsData.filter((job) => job.recruiterInfo.companyName === company.name);
              const companyData = {
                id: companyJobs[0]?.recruiterInfo.recruiterId || 0,
                name: company.name,
                about: companyJobs[0]?.recruiterInfo.about || '',
                website: companyJobs[0]?.recruiterInfo.website || '',
                logoUrl: company.logoUrl,
                jobs: companyJobs,
              };
              return (
                <View key={company.id} style={styles.companyCardWrapper}>
                  <CompanyCard
                    companyName={company.name}
                    description={company.about}
                    jobCount={company.jobCount}
                    tags={company.tags}
                    logo={company.logoUrl}
                    onPress={() => {
                      navigation.navigate('CompanyDetailScreen', { companyData });
                    }}
                    onBookmarkPress={() => console.log('Bookmark pressed:', company.name)}
                  />
                </View>
              );
            })}
          </ScrollView>
        </View>

        {/* Latest Jobs */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Latest Jobs</Text>
            <TouchableOpacity onPress={() => navigation.navigate('LatestJobsScreen', { jobsData: jobsData })}>
              <Text style={styles.seeMoreText}>See More</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.jobsList}>
            {mappedJobs.map((job: any) => {
              const isSelected = selectedJobId === job.id;
              return (
                <TouchableOpacity
                  key={job.id}
                  onPressIn={() => setSelectedJobId(job.id)}
                  onPressOut={() => setSelectedJobId(null)}
                  style={[
                    styles.jobCard,
                    {
                      borderWidth: 2,
                      borderColor: isSelected ? '#3DD5DC' : 'transparent',
                    },
                  ]}
                  activeOpacity={1}
                  onPress={() => {
                    navigation.navigate('JobDetailScreen', { jobId: job.id });
                  }}

                >
                  <View style={styles.jobHeader}>
                    <View style={styles.jobTitleContainer}>
                      <Text style={styles.jobTitle}>{job.title}</Text>
                      <View style={styles.jobTypeBadge}>
                        <Text style={styles.jobTypeText}>{job.workModel}</Text>
                      </View>
                    </View>
                    <TouchableOpacity>
                      <Ionicons name="bookmark-outline" size={22} color="#666" />
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.jobCompany}>{job.company}</Text>

                  <View style={styles.jobInfo}>
                    <View style={styles.jobInfoItem}>
                      <Ionicons name="location-outline" size={16} color="#666" />
                      <Text style={styles.jobInfoText}>{job.location}</Text>
                    </View>
                    <View style={styles.jobInfoItem}>
                      <Ionicons name="cash-outline" size={16} color="#666" />
                      <Text style={styles.jobInfoText}>{job.salary}</Text>
                    </View>
                  </View>

                  <Text style={styles.jobInfoText}>
                    Experience: {job.yearsOfExperience}+ years
                  </Text>
                  <Text style={styles.jobInfoText}>
                    Expiration: {job.expirationDate}
                  </Text>

                  <View style={styles.jobTags}>
                    {job.tags.map((tag: String, index: number) => (
                      <View key={index} style={styles.jobTag}>
                        <Text style={styles.jobTagText}>{tag}</Text>
                      </View>
                    ))}
                  </View>

                  <Text style={styles.jobPostedTime}>{job.postedTime}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={{ height: Platform.OS === 'ios' ? 20 : 10 }} />
      </Animated.ScrollView>
    </View>
  );
}
