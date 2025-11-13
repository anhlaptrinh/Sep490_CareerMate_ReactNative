// src/screens/JobScreen.tsx
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
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
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { JobStackParamList } from '../navigation/JobStackNavigator';

const { width: screenWidth } = Dimensions.get('window');

// Định nghĩa type navigation cho JobScreen
// Giúp TypeScript hiểu rằng navigate có thể đến các screen trong JobStackParamList
// 'JobScreen' ở đây chỉ định: “Mình đang viết code trong JobScreen, nên navigation này áp dụng từ JobScreen.”
type JobScreenNavigationProp = NativeStackNavigationProp<JobStackParamList, 'JobScreen'>;

export default function JobScreen() {
  const PAGE_SIZE = 5;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const scrollY = useRef(new Animated.Value(0)).current;
  const styles = jobStyles;
  // Dùng useNavigation với type đã khai báo
  const navigation = useNavigation<JobScreenNavigationProp>();

  // ✅ Fake API response
  const fakeApiResponse = {
    result: {
      content: [
        {
          id: 54,
          title: 'Mobile Engineer (Flutter)',
          description:
            'Join our mobile team to develop cross-platform mobile applications using Flutter...',
          address: 'Ho Chi Minh City',
          expirationDate: '2025-12-06',
          postTime: '2025-11-06',
          skills: [
            { id: 17, name: 'BrSE', mustToHave: true },
            { id: 14, name: 'Kubernetes', mustToHave: true },
            { id: 16, name: 'TensorFlow', mustToHave: false },
            { id: 18, name: 'Python', mustToHave: false },
            { id: 19, name: 'Pandas', mustToHave: false },
            { id: 20, name: 'Django', mustToHave: false },
          ],
          yearsOfExperience: 2,
          workModel: 'Hybrid',
          salaryRange: '$1300 - $2800 USD',
          recruiterInfo: {
            recruiterId: 33,
            companyName: 'Nvidia',
            website: 'https://www.nvidia.com',
            logoUrl:
              'https://images.unsplash.com/photo-1662947683395-1ce33bdcd094?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=2128',
            about:
              'NVIDIA Corporation is a global leader in graphics processing units (GPUs) and AI computing.',
          },
        },
        {
          id: 43,
          title: 'Mobile Developer (Flutter)',
          description: 'Hiring a Mobile Developer proficient in Flutter or React Native.',
          address: 'Ho Chi Minh City',
          expirationDate: '2025-12-31',
          postTime: '2025-11-03',
          skills: [{ id: 2, name: 'C#', mustToHave: true }],
          yearsOfExperience: 2,
          workModel: 'Hybrid',
          salaryRange: '1000-1500 USD',
          recruiterInfo: {
            recruiterId: 33,
            companyName: 'Nvidia',
            website: 'https://www.nvidia.com',
            logoUrl:
              'https://images.unsplash.com/photo-1662947683395-1ce33bdcd094?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=2128',
            about:
              'NVIDIA Corporation is a global leader in graphics processing units (GPUs) and AI computing.',
          },
        },
        {
          "id": 42,
          "title": "QA Engineer (Automation)",
          "description": "Looking for a QA Engineer to ensure software quality and test automation.",
          "address": "Da Nang",
          "expirationDate": "2025-12-31",
          "postTime": "2025-11-03",
          "skills": [
            {
              "id": 1,
              "name": "java",
              "mustToHave": true
            }
          ],
          "yearsOfExperience": 2,
          "workModel": "Onsite",
          "salaryRange": "800-1200 USD",
          "reason": "Quality assurance improvement",
          "jobPackage": "Basic",
          "recruiterInfo": {
            "recruiterId": 31,
            "companyName": "FPT",
            "website": "https://fptsoftware.com",
            "logoUrl": "https://images.unsplash.com/photo-1760625142154-0d899eacedb7?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=3087",
            "about": "string"
          }
        },
        {
          id: 58,
          title: 'Mobile Engineer (Flutter)',
          description:
            'Join our mobile team to develop cross-platform mobile applications using Flutter...',
          address: 'Ho Chi Minh City',
          expirationDate: '2025-12-06',
          postTime: '2025-11-06',
          skills: [
            { id: 17, name: 'BrSE', mustToHave: true },
            { id: 14, name: 'Kubernetes', mustToHave: true },
            { id: 16, name: 'TensorFlow', mustToHave: false },
            { id: 18, name: 'Python', mustToHave: false },
            { id: 19, name: 'Pandas', mustToHave: false },
            { id: 20, name: 'Django', mustToHave: false },
          ],
          yearsOfExperience: 2,
          workModel: 'Hybrid',
          salaryRange: '$1300 - $2800 USD',
          recruiterInfo: {
            recruiterId: 33,
            companyName: 'Nvidia',
            website: 'https://www.nvidia.com',
            logoUrl:
              'https://images.unsplash.com/photo-1662947683395-1ce33bdcd094?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=2128',
            about:
              'NVIDIA Corporation is a global leader in graphics processing units (GPUs) and AI computing.',
          },
        },
        {
          id: 59,
          title: 'Mobile Developer (Flutter)',
          description: 'Hiring a Mobile Developer proficient in Flutter or React Native.',
          address: 'Ho Chi Minh City',
          expirationDate: '2025-12-31',
          postTime: '2025-11-03',
          skills: [{ id: 2, name: 'C#', mustToHave: true }],
          yearsOfExperience: 2,
          workModel: 'Hybrid',
          salaryRange: '1000-1500 USD',
          recruiterInfo: {
            recruiterId: 33,
            companyName: 'Nvidia',
            website: 'https://www.nvidia.com',
            logoUrl:
              'https://images.unsplash.com/photo-1662947683395-1ce33bdcd094?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=2128',
            about:
              'NVIDIA Corporation is a global leader in graphics processing units (GPUs) and AI computing.',
          },
        },
        {
          "id": 60,
          "title": "QA Engineer (Automation)",
          "description": "Looking for a QA Engineer to ensure software quality and test automation.",
          "address": "Da Nang",
          "expirationDate": "2025-12-31",
          "postTime": "2025-11-03",
          "skills": [
            {
              "id": 1,
              "name": "java",
              "mustToHave": true
            }
          ],
          "yearsOfExperience": 2,
          "workModel": "Onsite",
          "salaryRange": "800-1200 USD",
          "reason": "Quality assurance improvement",
          "jobPackage": "Basic",
          "recruiterInfo": {
            "recruiterId": 31,
            "companyName": "FPT",
            "website": "https://fptsoftware.com",
            "logoUrl": "https://images.unsplash.com/photo-1760625142154-0d899eacedb7?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=3087",
            "about": "string"
          }
        },
        {
          id: 61,
          title: 'Mobile Engineer (Flutter)',
          description:
            'Join our mobile team to develop cross-platform mobile applications using Flutter...',
          address: 'Ho Chi Minh City',
          expirationDate: '2025-12-06',
          postTime: '2025-11-06',
          skills: [
            { id: 17, name: 'BrSE', mustToHave: true },
            { id: 14, name: 'Kubernetes', mustToHave: true },
            { id: 16, name: 'TensorFlow', mustToHave: false },
            { id: 18, name: 'Python', mustToHave: false },
            { id: 19, name: 'Pandas', mustToHave: false },
            { id: 20, name: 'Django', mustToHave: false },
          ],
          yearsOfExperience: 2,
          workModel: 'Hybrid',
          salaryRange: '$1300 - $2800 USD',
          recruiterInfo: {
            recruiterId: 33,
            companyName: 'Nvidia',
            website: 'https://www.nvidia.com',
            logoUrl:
              'https://images.unsplash.com/photo-1662947683395-1ce33bdcd094?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=2128',
            about:
              'NVIDIA Corporation is a global leader in graphics processing units (GPUs) and AI computing.',
          },
        },
        {
          id: 62,
          title: 'Mobile Developer (Flutter)',
          description: 'Hiring a Mobile Developer proficient in Flutter or React Native.',
          address: 'Ho Chi Minh City',
          expirationDate: '2025-12-31',
          postTime: '2025-11-03',
          skills: [{ id: 2, name: 'C#', mustToHave: true }],
          yearsOfExperience: 2,
          workModel: 'Hybrid',
          salaryRange: '1000-1500 USD',
          recruiterInfo: {
            recruiterId: 33,
            companyName: 'Nvidia',
            website: 'https://www.nvidia.com',
            logoUrl:
              'https://images.unsplash.com/photo-1662947683395-1ce33bdcd094?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=2128',
            about:
              'NVIDIA Corporation is a global leader in graphics processing units (GPUs) and AI computing.',
          },
        },
        {
          "id": 63,
          "title": "QA Engineer (Automation)",
          "description": "Looking for a QA Engineer to ensure software quality and test automation.",
          "address": "Da Nang",
          "expirationDate": "2025-12-31",
          "postTime": "2025-11-03",
          "skills": [
            {
              "id": 1,
              "name": "java",
              "mustToHave": true
            }
          ],
          "yearsOfExperience": 2,
          "workModel": "Onsite",
          "salaryRange": "800-1200 USD",
          "reason": "Quality assurance improvement",
          "jobPackage": "Basic",
          "recruiterInfo": {
            "recruiterId": 31,
            "companyName": "FPT",
            "website": "https://fptsoftware.com",
            "logoUrl": "https://images.unsplash.com/photo-1760625142154-0d899eacedb7?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=3087",
            "about": "string"
          }
        },
        {
          id: 64,
          title: 'Mobile Developer (Flutter)',
          description: 'Hiring a Mobile Developer proficient in Flutter or React Native.',
          address: 'Ho Chi Minh City',
          expirationDate: '2025-12-31',
          postTime: '2025-11-03',
          skills: [{ id: 2, name: 'C#', mustToHave: true }],
          yearsOfExperience: 2,
          workModel: 'Hybrid',
          salaryRange: '1000-1500 USD',
          recruiterInfo: {
            recruiterId: 33,
            companyName: 'Nvidia',
            website: 'https://www.nvidia.com',
            logoUrl:
              'https://images.unsplash.com/photo-1662947683395-1ce33bdcd094?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=2128',
            about:
              'NVIDIA Corporation is a global leader in graphics processing units (GPUs) and AI computing.',
          },
        },
        {
          "id": 65,
          "title": "QA Engineer (Automation)",
          "description": "Looking for a QA Engineer to ensure software quality and test automation.",
          "address": "Da Nang",
          "expirationDate": "2025-12-31",
          "postTime": "2025-11-03",
          "skills": [
            {
              "id": 1,
              "name": "java",
              "mustToHave": true
            }
          ],
          "yearsOfExperience": 2,
          "workModel": "Onsite",
          "salaryRange": "800-1200 USD",
          "reason": "Quality assurance improvement",
          "jobPackage": "Basic",
          "recruiterInfo": {
            "recruiterId": 31,
            "companyName": "FPT",
            "website": "https://fptsoftware.com",
            "logoUrl": "https://images.unsplash.com/photo-1760625142154-0d899eacedb7?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=3087",
            "about": "string"
          }
        },
      ],
    },
  };
  const jobData = fakeApiResponse.result.content;

  // Map data
  const jobs = fakeApiResponse.result.content.slice(0, PAGE_SIZE).map((job) => ({
    id: job.id,
    title: job.title,
    company: job.recruiterInfo.companyName,
    description: job.description,
    about: job.recruiterInfo.about,
    logoUrl: job.recruiterInfo.logoUrl,
    website: job.recruiterInfo.website,
    salary: job.salaryRange,
    location: job.address,
    workModel: job.workModel,
    tags: job.skills.map((s) => `${s.mustToHave ? '⭐ ' : ''}${s.name}`),
    postedTime: job.postTime,
    expirationDate: job.expirationDate,
    yearsOfExperience: job.yearsOfExperience,
  }));

  const companies = Object.values(
    jobs.reduce((acc: Record<string, any>, job) => {
      if (!acc[job.company]) {
        acc[job.company] = {
          id: job.id,
          name: job.company,
          about: job.about.length > 100 ? job.about.slice(0, 100) + '...' : job.about,
          jobCount: 1,
          tags: job.tags,
          logoUrl: job.logoUrl,
          website: job.website,
        };
      } else {
        acc[job.company].jobCount += 1;
      }
      return acc;
    }, {} as Record<string, any>)
  );

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
            {companies.map((company: any) => (
              <View key={company.id} style={styles.companyCardWrapper}>
                <CompanyCard
                  companyName={company.name}
                  description={company.about}
                  jobCount={company.jobCount}
                  tags={company.tags}
                  logo={company.logoUrl}
                  onPress={() => console.log('Company pressed:', company.name)}
                  onBookmarkPress={() => console.log('Bookmark pressed:', company.name)}
                />
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Latest Jobs */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Latest Jobs</Text>
            <TouchableOpacity onPress={() => navigation.navigate('LatestJobsScreen', { jobsData: jobData })}>
              <Text style={styles.seeMoreText}>See More</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.jobsList}>
            {jobs.map((job: any) => {
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
