import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Linking, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { jobStyles } from '../styles/JobStyles';
import { errorStyles } from '../styles/ErrorStyles';
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
  const styles = jobStyles;
  const errorStyle = errorStyles;

  // ✅ UseEffect - Fetch job detail khi component mount
  useEffect(() => {
    const loadJobDetail = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Gọi API để lấy chi tiết job
        const jobData = await jobRepository.getJobById(jobId);
        setJobDetail(jobData);

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
      <View style={[styles.container, errorStyle.loadingContainer]}>
        <ActivityIndicator size="large" color="#3DD5DC" />
        <Text style={errorStyle.loadingText}>Loading job details...</Text>
      </View>
    );
  }

  // ✅ Render error state
  if (error || !jobDetail) {
    return (
      <View style={[styles.container, errorStyle.errorContainer]}>
        <Ionicons name="alert-circle-outline" size={48} color="#3DD5DC" />
        <Text style={errorStyle.errorTitle}>Error loading job</Text>
        <Text style={errorStyle.errorMessage}>{error}</Text>
      </View>
    );
  }

  const companyData = {
    id: jobDetail.recruiterInfo.recruiterId,
    name: jobDetail.recruiterInfo.companyName,
    about: jobDetail.recruiterInfo.about,
    website: jobDetail.recruiterInfo.website,
    logoUrl: jobDetail.recruiterInfo.logoUrl,
    jobs: [],
  };

  return (
    <ScrollView style={styles.container}>
      {/* === recruiterInfo Header Card === */}
      <View style={styles.detailCard}>
        <View style={styles.detailHeader}>
          <Image
            source={{ uri: jobDetail.recruiterInfo.logoUrl }}
            style={styles.companyLogo}
          />
          <View style={styles.headerTextContainer}>
            <Text style={styles.detailJobTitle}>{jobDetail.title}</Text>
            <Text style={styles.detailJobCompany}>{jobDetail.recruiterInfo.companyName}</Text>
          </View>
        </View>

        <View style={styles.salaryBadge}>
          <Text style={styles.salaryText}>💰 {jobDetail.salaryRange}</Text>
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
              <Text style={styles.infoValue}>{jobDetail.address}</Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoIcon}>💼</Text>
            <View>
              <Text style={styles.infoLabel}>Work Model</Text>
              <Text style={styles.infoValue}>{jobDetail.workModel}</Text>
            </View>
          </View>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Text style={styles.infoIcon}>⏱️</Text>
            <View>
              <Text style={styles.infoLabel}>Experience</Text>
              <Text style={styles.infoValue}>{jobDetail.yearsOfExperience} years</Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoIcon}>📅</Text>
            <View>
              <Text style={styles.infoLabel}>Expiration</Text>
              <Text style={styles.infoValue}>{jobDetail.expirationDate}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* === Job Description Card === */}
      <View style={styles.detailCard}>
        <Text style={styles.cardTitle}>Job Description</Text>
        <Text style={styles.descriptionText}>{jobDetail.description}</Text>
      </View>

      {/* === Benefits Card === */}
      {(jobDetail.reason || jobDetail.jobPackage) && (
        <View style={styles.detailCard}>
          <Text style={styles.cardTitle}>Why Join Us?</Text>

          {jobDetail.reason && (
            <View style={styles.benefitItem}>
              <Text style={styles.benefitIcon}>✨</Text>
              <Text style={styles.benefitText}>{jobDetail.reason}</Text>
            </View>
          )}

          {jobDetail.jobPackage && (
            <View style={styles.benefitItem}>
              <Text style={styles.benefitIcon}>🎁</Text>
              <Text style={styles.benefitText}>{jobDetail.jobPackage}</Text>
            </View>
          )}
        </View>
      )}

      {/* === Skills Card === */}
      {jobDetail.skills.length > 0 && (
        <View style={styles.detailCard}>
          <Text style={styles.cardTitle}>Required Skills</Text>
          <View style={styles.skillsContainer}>
            {jobDetail.skills.map((skill: string, index: number) => (
              <View key={index} style={styles.skillTag}>
                <Text style={styles.skillTagText}>{skill}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* === Company Profile === */}
      <View style={styles.section}>
        <Text style={styles.cardTitle}>About Company</Text>
        <CompanyCard
          companyName={jobDetail.recruiterInfo.companyName}
          description={jobDetail.recruiterInfo.about}
          tags={jobDetail.skills}
          logo={jobDetail.recruiterInfo.logoUrl}
          onPress={() => {
            navigation.navigate('CompanyDetailScreen', { companyData });
          }}
          onBookmarkPress={() => console.log('Bookmark pressed:', jobDetail.recruiterInfo.companyName)}
        />
      </View>

      {/* === Website Link Card === */}
      {jobDetail.recruiterInfo.website && (
        <TouchableOpacity
          style={styles.websiteCard}
          onPress={() => Linking.openURL(jobDetail.recruiterInfo.website)}
        >
          <Text style={styles.websiteIcon}>🌐</Text>
          <View style={styles.websiteTextContainer}>
            <Text style={styles.websiteLabel}>Company Website</Text>
            <Text style={styles.websiteLink}>{jobDetail.recruiterInfo.website}</Text>
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