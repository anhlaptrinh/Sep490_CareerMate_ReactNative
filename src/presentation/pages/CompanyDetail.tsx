import React, { useMemo, useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Linking,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { companyStyles } from '../styles/CompanyStyles';
import { companyDetailStyles } from '../styles/CompanyDetailStyles';
import { errorStyles } from '../styles/ErrorStyles';
import { CompanyStackParamList } from '../navigation/CompanyStackNavigator';
import { CompanyData } from '../types/company';
import { container } from '../../di/dependencies';
import { TYPES } from '../../di/types';
import { JobRepo } from '../../data/repository/job';
import { CompanyRepo } from '../../data/repository/company';
import CompanyHeader from '../components/CompanyHeader';
import TabNavigation from '../components/TabNavigation';
import AboutTab from '../components/AboutTab';
import JobsTab from '../components/JobsTab';

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
    if (companyDetail?.website) {
      Linking.openURL(companyDetail.website);
    }
  };

  // ✅ Show loading state
  if (isLoadingDetail) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#3DD5DC" />
        <Text style={errorStyle.loadingText}>Loading company details...</Text>
      </View>
    );
  }

  // ✅ Show error state if company detail failed to load
  if (error || !companyDetail) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Ionicons name="alert-circle-outline" size={48} color="#3DD5DC" />
        <Text style={[errorStyle.errorTitle, { color: '#3DD5DC' }]}>
          Error loading company
        </Text>
        <Text style={errorStyle.errorMessage}>{error || 'Company not found'}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
      >
        {/* Company Header - Component */}
        <CompanyHeader
          companyDetail={companyDetail}
          jobCount={jobCount}
          onVisitWebsite={handleVisitWebsite}
        />

        {/* Tab Navigation - Component */}
        <TabNavigation
          activeTab={activeTab}
          jobsCount={companyJobs.length}
          onAboutPress={() => setActiveTab('about')}
          onJobsPress={handleJobsTabPress}
        />

        {/* Tab Content */}
        {activeTab === 'about' ? (
          <AboutTab
            companyDetail={companyDetail}
            jobCount={jobCount}
            onVisitWebsite={handleVisitWebsite}
          />
        ) : (
          <JobsTab
            companyJobs={companyJobs}
            selectedJobId={selectedJobId}
            isLoadingJobs={isLoadingJobs}
            error={error}
            hasMoreJobs={hasMoreJobs}
            onJobPress={(jobId) => navigation.navigate('JobDetailScreen', { jobId })}
            onPressIn={setSelectedJobId}
            onPressOut={() => setSelectedJobId(null)}
            onViewMore={handleViewMore}
          />
        )}

        <View style={detailStyles.bottomPadding} />
      </ScrollView>
    </View>
  );
}
