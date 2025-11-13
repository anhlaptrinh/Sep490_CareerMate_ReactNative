
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Platform,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CompanyCard from '../components/CompanyCard';
import AppHeader from '../components/AppHeader';
import { jobStyles } from '../styles/JobStyles';
import { useRequireAuth } from '../hooks/useRequireAuth';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function JobScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const scrollY = useRef(new Animated.Value(0)).current;
  const styles = jobStyles;
  const withAuth = useRequireAuth();

  // Handler functions with auth protection
  const handleBookmarkCompany = withAuth((companyId: string) => {
    // TODO: Call API to save company bookmark
  }, 'Please login to bookmark companies');

  const handleBookmarkJob = withAuth((jobId: string) => {
    // TODO: Call API to save job bookmark
  }, 'Please login to bookmark jobs');

  // Mock data for companies
  const companies = [
    {
      id: '1',
      name: 'CÔNG TY TNHH DIGITAL INNOVATION',
      description:
        'Digital Innovation (DION) là công ty công nghệ tại Hà Nội, chuyên cung cấp dịch vụ phát triển...',
      jobCount: 16,
      tags: ['PHP', 'Java', 'NodeJS', '.NET', 'Tester'],
    },
    {
      id: '2',
      name: 'CÔNG TY TNHH TECH SOLUTIONS',
      description:
        'Tech Solutions chuyên về giải pháp công nghệ thông tin, phát triển phần mềm và ứng dụng di động...',
      jobCount: 12,
      tags: ['React Native', 'Flutter', 'iOS', 'Android'],
    },
    {
      id: '3',
      name: 'CÔNG TY CỔ PHẦN VNEXT SOFTWARE',
      description:
        'VNext Software là công ty phát triển phần mềm hàng đầu với nhiều dự án lớn trong và ngoài nước...',
      jobCount: 24,
      tags: ['Java', 'Python', 'AWS', 'DevOps'],
    },
  ];

  // Mock data for latest jobs
  const latestJobs = [
    {
      id: 'j1',
      title: 'Senior React Native Developer',
      company: 'Digital Innovation',
      location: 'Hanoi, Vietnam',
      salary: '$1,500 - $2,500',
      type: 'Full-time',
      tags: ['React Native', 'JavaScript', 'Mobile'],
      postedTime: '2 hours ago',
    },
    {
      id: 'j2',
      title: 'Frontend Developer (ReactJS)',
      company: 'Tech Solutions',
      location: 'Ho Chi Minh City',
      salary: '$1,200 - $2,000',
      type: 'Full-time',
      tags: ['ReactJS', 'TypeScript', 'CSS'],
      postedTime: '5 hours ago',
    },
    {
      id: 'j3',
      title: 'Backend Developer (Node.js)',
      company: 'VNext Software',
      location: 'Da Nang, Vietnam',
      salary: '$1,800 - $3,000',
      type: 'Remote',
      tags: ['Node.js', 'MongoDB', 'AWS'],
      postedTime: '1 day ago',
    },
  ];

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const searchBarTop = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -60],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      <AppHeader 
        scrollY={scrollY}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        showSearch={true}
      />

      {/* Main ScrollView */}
      <Animated.ScrollView
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner Card */}
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

        {/* Jobs at Top Companies Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Jobs at Top Companies</Text>
            <TouchableOpacity>
              <Text style={styles.seeMoreText}>See More</Text>
            </TouchableOpacity>
          </View>

          {/* What's New */}
          <Text style={styles.subsectionTitle}>What's new</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {companies.map((company) => (
              <View key={company.id} style={styles.companyCardWrapper}>
                <CompanyCard
                  companyName={company.name}
                  description={company.description}
                  jobCount={company.jobCount}
                  tags={company.tags}
                  onPress={() => {/* TODO: Navigate to company detail */}}
                  onBookmarkPress={() => handleBookmarkCompany(company.id)}
                />
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Latest Jobs Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Latest Jobs</Text>
            <TouchableOpacity>
              <Text style={styles.seeMoreText}>See More</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.jobsList}>
            {latestJobs.map((job) => (
              <TouchableOpacity key={job.id} style={styles.jobCard}>
                <View style={styles.jobHeader}>
                  <View style={styles.jobTitleContainer}>
                    <Text style={styles.jobTitle}>{job.title}</Text>
                    <View style={styles.jobTypeBadge}>
                      <Text style={styles.jobTypeText}>{job.type}</Text>
                    </View>
                  </View>
                  <TouchableOpacity onPress={() => handleBookmarkJob(job.id)}>
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

                <View style={styles.jobTags}>
                  {job.tags.map((tag, index) => (
                    <View key={index} style={styles.jobTag}>
                      <Text style={styles.jobTagText}>{tag}</Text>
                    </View>
                  ))}
                </View>

                <Text style={styles.jobPostedTime}>{job.postedTime}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Extra padding for bottom tab bar */}
        <View style={{ height: Platform.OS === 'ios' ? 20 : 10 }} />
      </Animated.ScrollView>
    </View>
  );
}
