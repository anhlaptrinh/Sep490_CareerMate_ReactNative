import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { jobStyles } from '../styles/JobStyles';
import { useNavigation } from '@react-navigation/native';
import { JobStackParamList } from '../navigation/JobStackNavigator';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { container } from '../../di/dependencies';
import { TYPES } from '../../di/types';
import { JobRepo } from '../../data/repository/job';
import { JobPosting } from '../../domain/models/JobModel';
import { mapJobsForUI, getPaginatedJobs } from '../../domain/usecases/GetJobsUseCase';

const styles = jobStyles;

type Props = NativeStackScreenProps<JobStackParamList, 'LatestJobsScreen'>;

export default function LatestJobsScreen({ navigation }: Props) {
  const PAGE_SIZE = 5;
  const [visibleJobs, setVisibleJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMoreJobs, setHasMoreJobs] = useState(true);

  // ✅ Get JobRepo từ DI container
  const jobRepository = container.get<JobRepo>(TYPES.JobRepo);

  // ✅ UseEffect - Fetch jobs khi component mount (page 0)
  useEffect(() => {
    const loadJobs = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Gọi API lần đầu: page 0, size PAGE_SIZE
        const response = await jobRepository.getJobs(0, PAGE_SIZE, 'createAt', 'desc');
        const jobs = response.result.content;
        
        const mappedJobs = mapJobsForUI(jobs);
        setVisibleJobs(mappedJobs);
        setCurrentPage(1);
        
        // Nếu số jobs < PAGE_SIZE thì không còn jobs để load
        setHasMoreJobs(jobs.length === PAGE_SIZE);

        console.log('✅ Latest jobs loaded successfully:', jobs.length);
      } catch (err) {
        console.error('❌ Error loading jobs:', err);
        setError(err instanceof Error ? err.message : 'Failed to load jobs');
      } finally {
        setIsLoading(false);
      }
    };

    loadJobs();
  }, []);

  // ✅ Gọi API để lấy thêm jobs khi bấm "View More"
  const handleViewMore = async () => {
    if (isLoadingMore || !hasMoreJobs) return;

    try {
      setIsLoadingMore(true);
      
      // Gọi API: page = currentPage, size = PAGE_SIZE
      const response = await jobRepository.getJobs(currentPage, PAGE_SIZE, 'createAt', 'desc');
      const newJobs = response.result.content;
      
      const mappedNewJobs = mapJobsForUI(newJobs);
      
      // Thêm jobs mới vào danh sách cũ
      setVisibleJobs([...visibleJobs, ...mappedNewJobs]);
      setCurrentPage(currentPage + 1);
      
      // Nếu số jobs < PAGE_SIZE thì đã hết
      setHasMoreJobs(newJobs.length === PAGE_SIZE);
      
      console.log('✅ Loaded more jobs, page:', currentPage);
    } catch (err) {
      console.error('❌ Error loading more jobs:', err);
      setError(err instanceof Error ? err.message : 'Failed to load more jobs');
    } finally {
      setIsLoadingMore(false);
    }
  };

  // ✅ Render loading state
  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#3DD5DC" />
        <Text style={{ marginTop: 16, color: '#999999' }}>Loading jobs...</Text>
      </View>
    );
  }

  // ✅ Render error state
  if (error) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Ionicons name="alert-circle-outline" size={48} color="#FF6B35" />
        <Text style={{ marginTop: 16, color: '#FF6B35', fontSize: 16, fontWeight: '600' }}>
          Error loading jobs
        </Text>
        <Text style={{ marginTop: 8, color: '#666666', textAlign: 'center' }}>{error}</Text>
      </View>
    );
  }

  const renderItem = ({ item }: any) => {
    const isSelected = selectedJobId === item.id;

    return (
      <TouchableOpacity
        key={item.id}
        onPressIn={() => setSelectedJobId(item.id)}
        onPressOut={() => setSelectedJobId(null)}
        onPress={() => navigation.navigate('JobDetailScreen', { jobId: item.id })}
        style={[
          styles.jobCard,
          { borderWidth: 2, borderColor: isSelected ? '#3DD5DC' : 'transparent', marginBottom: 16 },
        ]}
        activeOpacity={1}
      >
        <View style={styles.jobHeader}>
          <Text style={styles.jobTitle}>{item.title}</Text>
        </View>

        <Text style={styles.jobCompany}>{item.company}</Text>

        <View style={styles.jobInfo}>
          <Ionicons name="location-outline" size={16} color="#666" />
          <Text style={styles.jobInfoText}>{item.location}</Text>

          <Ionicons
            name="cash-outline"
            size={16}
            color="#666"
          />
          <Text style={styles.jobInfoText}>{item.salary}</Text>
        </View>

        <View style={styles.jobTags}>
          {item.tags.map((tag: string, index: number) => (
            <View key={index} style={styles.jobTag}>
              <Text style={styles.jobTagText}>{tag}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.jobPostedTime}>{item.postedTime}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { padding: 16 }]}>
      <FlatList
        data={visibleJobs}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
      />

      {/* Nút "View More" chỉ hiện nếu còn job để load */}
      {hasMoreJobs && !isLoadingMore && (
        <TouchableOpacity style={styles.viewMoreButton} onPress={handleViewMore}>
          <Text style={styles.viewMoreText}>View More</Text>
        </TouchableOpacity>
      )}

      {/* Loading indicator khi đang load thêm jobs */}
      {isLoadingMore && (
        <View style={{ paddingVertical: 16, alignItems: 'center' }}>
          <ActivityIndicator size="small" color="#3DD5DC" />
          <Text style={{ marginTop: 8, color: '#999999', fontSize: 12 }}>Loading more...</Text>
        </View>
      )}
    </View>
  );
}
