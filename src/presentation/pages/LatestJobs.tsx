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
  const PAGE_SIZE = 10;
  const [jobsData, setJobsData] = useState<JobPosting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleJobs, setVisibleJobs] = useState<any[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);

  // ✅ Get JobRepo từ DI container
  const jobRepository = container.get<JobRepo>(TYPES.JobRepo);

  // ✅ UseEffect - Fetch jobs từ API khi component mount
  useEffect(() => {
    const loadJobs = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Gọi repository để lấy jobs với pagination
        const response = await jobRepository.getJobs(0, 50, 'createAt', 'desc');
        const allJobs = response.result.content;
        setJobsData(allJobs);

        // Map và format jobs cho UI
        const mappedJobs = mapJobsForUI(allJobs);
        const paginatedJobs = mappedJobs.slice(0, PAGE_SIZE);
        setVisibleJobs(paginatedJobs);

        console.log('✅ Latest jobs loaded successfully:', allJobs.length);
      } catch (err) {
        console.error('❌ Error loading jobs:', err);
        setError(err instanceof Error ? err.message : 'Failed to load jobs');
      } finally {
        setIsLoading(false);
      }
    };

    loadJobs();
  }, []);

  // Mỗi lần nhấn sẽ hiển thị thêm PAGE_SIZE job
  const handleViewMore = () => {
    const mappedJobs = mapJobsForUI(jobsData);
    const currentLength = visibleJobs.length;
    const nextJobs = mappedJobs.slice(currentLength, currentLength + PAGE_SIZE);
    setVisibleJobs([...visibleJobs, ...nextJobs]);
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

      {/* Nút "View More" chỉ hiện nếu còn job chưa hiển thị */}
      {visibleJobs.length < mapJobsForUI(jobsData).length && (
        <TouchableOpacity style={styles.viewMoreButton} onPress={handleViewMore}>
          <Text style={styles.viewMoreText}>View More</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
