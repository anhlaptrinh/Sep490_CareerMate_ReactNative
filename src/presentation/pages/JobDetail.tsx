import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Linking } from 'react-native';
import { jobStyles } from '../styles/JobStyles';
import { CompanyCard } from '../components';
import { JobStackParamList } from '../navigation/JobStackNavigator';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Job } from './types';
const styles = jobStyles;

const fetchData = {
  "result": {
    "id": 1,
    "title": "Frontend Developer",
    "description": "Create responsive web interfaces, implement UI/UX designs, and optimize web performance ",
    "address": "Ho Chi Minh",
    "expirationDate": "2025-12-15",
    "postTime": "2025-11-06",
    "skills": [],
    "yearsOfExperience": 2,
    "workModel": "At office",
    "salaryRange": "2000 - 3000 USD",
    "reason": "Premium AON healthcare insurance",
    "jobPackage": "Professional, open minded and supportive working enviroment",
    "recruiterInfo": {
      "recruiterId": 1,
      "companyName": "Google",
      "website": "https://google.com",
      "logoUrl": "https://images.unsplash.com/photo-1762108977165-5e7bb9b63e93?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw3fHx8ZW58MHx8fHx8&auto=format&fit=crop&q=60&w=600",
      "about": "Google is an American multinational technology company primarily known for its search engine, which organizes the world's information and makes it universally accessible"
    }
  }
}

type Props = NativeStackScreenProps<JobStackParamList, 'JobDetailScreen'>;

const res: Job = fetchData.result;

export default function JobDetailScreen({ route, navigation }: Props) {
  const { jobId } = route.params;
  const [relatedJobs, setRelatedJobs] = useState<any[]>([]);

  const job = {
    id: res.id,
    title: res.title,
    company: res.recruiterInfo.companyName,
    description: res.description,
    about: res.recruiterInfo.about,
    logoUrl: res.recruiterInfo.logoUrl,
    website: res.recruiterInfo.website,
    salary: res.salaryRange,
    location: res.address,
    workModel: res.workModel,
    tags: res.skills?.map((s) => `${s.mustToHave ? '⭐ ' : ''}${s.name}`) ?? [],
    postedTime: res.postTime,
    expirationDate: res.expirationDate,
    yearsOfExperience: res.yearsOfExperience,
    reason: res.reason,
    jobPackage: res.jobPackage,
  };

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
            {job.tags.map((tag, index) => (
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