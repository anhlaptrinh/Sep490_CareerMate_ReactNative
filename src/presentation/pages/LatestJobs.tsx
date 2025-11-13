import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { jobStyles } from '../styles/JobStyles';
import { Job } from './types';
import { useNavigation } from '@react-navigation/native';
import { JobStackParamList } from '../navigation/JobStackNavigator';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

const styles = jobStyles;


const fakeApiResponse = {
  result: {
    content: [
      {
        id: 1,
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
        id: 2,
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
        "id": 3,
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
        id: 4,
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
        id: 5,
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
        "id": 6,
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
        id: 7,
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
        id: 8,
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
        "id": 9,
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
        id: 10,
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
        "id": 11,
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
const jobsData = fakeApiResponse.result.content;

type Props = NativeStackScreenProps<JobStackParamList, 'LatestJobsScreen'>;


export default function LatestJobsScreen({ navigation }: Props) {
  const PAGE_SIZE = 10; // số job hiển thị mỗi lần

  // Map toàn bộ dữ liệu từ API thành định dạng dùng trong UI
  const jobs = jobsData.map((job: Job) => ({
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
    tags: job.skills?.map((s) => `${s.mustToHave ? '⭐ ' : ''}${s.name}`) ?? [],
    postedTime: job.postTime,
    expirationDate: job.expirationDate,
    yearsOfExperience: job.yearsOfExperience,
  }));

  // chỉ lấy 10 job đầu tiên để hiển thị ban đầu
  const [visibleJobs, setVisibleJobs] = useState(
    jobs.slice(0, PAGE_SIZE)
  );
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);

  // Mỗi lần nhấn sẽ hiển thị thêm PAGE_SIZE job
  const handleViewMore = () => {
    const currentLength = visibleJobs.length;
    const nextJobs = jobs.slice(currentLength, currentLength + PAGE_SIZE);
    setVisibleJobs([...visibleJobs, ...nextJobs]);
  };

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

      {/* Nút “View More” chỉ hiện nếu còn job chưa hiển thị */}
      {visibleJobs.length < jobs.length && (
        <TouchableOpacity style={styles.viewMoreButton} onPress={handleViewMore}>
          <Text style={styles.viewMoreText}>View More</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
