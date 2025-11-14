import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Linking, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { jobStyles } from '../styles/JobStyles';
import { CompanyCard } from '../components';
import { JobStackParamList } from '../navigation/JobStackNavigator';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { container } from '../../di/dependencies';
import { TYPES } from '../../di/types';
import { JobRepo } from '../../data/repository/job';
import { mapJobsForUI } from '../../domain/usecases/GetJobsUseCase';

const styles = jobStyles;

type Props = NativeStackScreenProps<JobStackParamList, 'JobDetailScreen'>;

export default function JobDetailScreen({ route, navigation }: Props) {
  const { jobId } = route.params;
  const [jobDetail, setJobDetail] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedJobs, setRelatedJobs] = useState<any[]>([]);

  // ✅ Get JobRepo từ DI container
  const jobRepository = container.get<JobRepo>(TYPES.JobRepo);

  // ✅ UseEffect - Fetch job detail khi component mount
  useEffect(() => {
    const loadJobDetail = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Gọi API để lấy chi tiết job
        const jobData = await jobRepository.getJobById(jobId);

        // Map job data to UI format
        const mappedJob = mapJobsForUI([jobData])[0];
        setJobDetail(mappedJob);

        console.log('✅ Job detail loaded successfully:', jobData.id);
      } catch (err) {
        console.error('❌ Error loading job detail:', err);
        setError(err instanceof Error ? err.message : 'Failed to load job detail');
      } finally {
        setIsLoading(false);
      }
    };

    loadJobDetail();
  }, [jobId]);

  // ✅ Render loading state
  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#3DD5DC" />
        <Text style={{ marginTop: 16, color: '#999999' }}>Loading job details...</Text>
      </View>
    );
  }

  // ✅ Render error state
  if (error || !jobDetail) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Ionicons name="alert-circle-outline" size={48} color="#FF6B35" />
        <Text style={{ marginTop: 16, color: '#FF6B35', fontSize: 16, fontWeight: '600' }}>
          Error loading job
        </Text>
        <Text style={{ marginTop: 8, color: '#666666', textAlign: 'center' }}>{error}</Text>
      </View>
    );
  }

  const job = jobDetail;

  return (
    <ScrollView style={styles.container}>
      {/* === Job Header Card === */}
      <View style={styles.detailCard}>
        <View style={styles.detailHeader}>
          <Image
            source={{ uri: job.logoUrl }}
            style={styles.companyLogo}
          />
          <View style={styles.headerTextContainer}>
            <Text style={styles.detailJobTitle}>{job.title}</Text>
            <Text style={styles.detailJobCompany}>{job.company}</Text>
          </View>
        </View>

        <View style={styles.salaryBadge}>
          <Text style={styles.salaryText}>💰 {job.salary}</Text>
        </View>
      </View>

      {/* === Job Info Card === */}
      <View style={styles.detailCard}>
        <Text style={styles.cardTitle}>Job Information</Text>

        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Text style={styles.infoIcon}>📍</Text>
            <View>
              <Text style={styles.infoLabel}>Location</Text>
              <Text style={styles.infoValue}>{job.location}</Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoIcon}>💼</Text>
            <View>
              <Text style={styles.infoLabel}>Work Model</Text>
              <Text style={styles.infoValue}>{job.workModel}</Text>
            </View>
          </View>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Text style={styles.infoIcon}>⏱️</Text>
            <View>
              <Text style={styles.infoLabel}>Experience</Text>
              <Text style={styles.infoValue}>{job.yearsOfExperience} years</Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoIcon}>📅</Text>
            <View>
              <Text style={styles.infoLabel}>Expiration</Text>
              <Text style={styles.infoValue}>{job.expirationDate}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* === Job Description Card === */}
      <View style={styles.detailCard}>
        <Text style={styles.cardTitle}>Job Description</Text>
        <Text style={styles.descriptionText}>{job.description}</Text>
      </View>

      {/* === Benefits Card === */}
      {(job.reason || job.jobPackage) && (
        <View style={styles.detailCard}>
          <Text style={styles.cardTitle}>Why Join Us?</Text>

          {job.reason && (
            <View style={styles.benefitItem}>
              <Text style={styles.benefitIcon}>✨</Text>
              <Text style={styles.benefitText}>{job.reason}</Text>
            </View>
          )}

          {job.jobPackage && (
            <View style={styles.benefitItem}>
              <Text style={styles.benefitIcon}>🎁</Text>
              <Text style={styles.benefitText}>{job.jobPackage}</Text>
            </View>
          )}
        </View>
      )}

      {/* === Skills Card === */}
      {job.tags.length > 0 && (
        <View style={styles.detailCard}>
          <Text style={styles.cardTitle}>Required Skills</Text>
          <View style={styles.skillsContainer}>
            {job.tags.map((tag: string, index: number) => (
              <View key={index} style={styles.skillTag}>
                <Text style={styles.skillTagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* === Company Profile === */}
      <View style={styles.section}>
        <Text style={styles.cardTitle}>About Company</Text>
        <CompanyCard
          companyName={job.company}
          description={job.about}
          tags={job.tags}
          logo={job.logoUrl}
          onPress={() => console.log('Company pressed:', job.company)}
          onBookmarkPress={() => console.log('Bookmark pressed:', job.company)}
        />
      </View>

      {/* === Website Link Card === */}
      {job.website && (
        <TouchableOpacity
          style={styles.websiteCard}
          onPress={() => Linking.openURL(job.website)}
        >
          <Text style={styles.websiteIcon}>🌐</Text>
          <View style={styles.websiteTextContainer}>
            <Text style={styles.websiteLabel}>Company Website</Text>
            <Text style={styles.websiteLink}>{job.website}</Text>
          </View>
          <Text style={styles.websiteArrow}>›</Text>
        </TouchableOpacity>
      )}

      {/* === Related Jobs === */}
      {relatedJobs.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Other jobs from this company</Text>
          {relatedJobs.map((j) => (
            <TouchableOpacity
              key={j.id}
              style={styles.relatedJobCard}
              onPress={() => navigation.push('JobDetailScreen', { jobId: j.id })}
            >
              <Text style={styles.jobTitle}>{j.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}