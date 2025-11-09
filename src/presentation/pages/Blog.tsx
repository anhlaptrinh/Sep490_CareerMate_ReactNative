import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Platform,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { AppHeader } from '../components';
import { blogStyles } from '../styles/BlogStyles';

const { width: screenWidth } = Dimensions.get('window');

// Mock data for featured blog
const featuredBlogs = [
  {
    id: '1',
    title: 'Experience Working with Git in Projects',
    description: 'Article approved by experts Son Duong\nGit is an indispensable tool in software development...',
    category: 'Technology',
    icon: 'git' as const,
    colors: ['#FF6B6B', '#FFA500'] as [string, string],
  },
  {
    id: '2',
    title: 'Python Programming Best Practices',
    description: 'Learn the most effective ways to write clean Python code...',
    category: 'Technology',
    icon: 'language-python' as const,
    colors: ['#4ECDC4', '#44A08D'] as [string, string],
  },
  {
    id: '3',
    title: 'React Native Development Guide',
    description: 'Build powerful mobile apps with React Native framework...',
    category: 'Mobile Development',
    icon: 'react' as const,
    colors: ['#667eea', '#764ba2'] as [string, string],
  },
  {
    id: '4',
    title: 'DevOps and CI/CD Pipeline',
    description: 'Automate your deployment process with modern DevOps tools...',
    category: 'DevOps',
    icon: 'pipe' as const,
    colors: ['#56CCF2', '#2F80ED'] as [string, string],
  },
];

// Mock data for blogs
const blogs = [
  {
    id: '1',
    category: 'Technology',
    title: '7 Useful Experiences When Working with GIT in Projects',
    description: 'Article approved by experts Son Duong...',
    author: 'TopDev Editorial',
    date: '10-21-2024',
    image: 'git-tips',
  },
  {
    id: '2',
    category: 'Technology',
    title: 'Python Tutorial from Basic to Advanced',
    description: 'Python is a high-level programming language, widely used...',
    author: 'TopDev Editorial',
    date: '10-21-2024',
    image: 'python-tutorial',
  },
];

// Mock data for IT reports
const itReports = [
  {
    id: '1',
    title: 'Vietnam IT Landscape 2020 – New Opportunities for Vietnamese IT Industry',
    description: 'Hello, I am a developer from CareerMate',
    date: '08-01-2021',
    image: 'it-landscape',
  },
];

// Mock data for HR topics
const hrTopics = [
  {
    id: '1',
    category: 'HR',
    title: 'IT Recruitment Trends in Vietnam 2024 - 2025: Leading Wave Number',
    description: '',
    author: 'TopDev Editorial',
    date: '10-07-2024',
    image: 'hr-trends',
  },
];

export default function BlogScreen() {
  const scrollY = useRef(new Animated.Value(0)).current;
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFeatured, setActiveFeatured] = useState(0);

  const styles = blogStyles;

  const handleFeaturedScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const cardWidth = screenWidth - 32 + 12; // card width + gap
    const index = Math.round(scrollPosition / cardWidth);
    setActiveFeatured(index);
  };

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
        {/* Featured Blog Section */}
        <View style={styles.featuredSection}>
          <ScrollView
            horizontal
            pagingEnabled={false}
            showsHorizontalScrollIndicator={false}
            snapToInterval={screenWidth - 20}
            decelerationRate="fast"
            contentContainerStyle={styles.featuredScroll}
            onScroll={handleFeaturedScroll}
            scrollEventThrottle={16}
          >
            {featuredBlogs.map((blog, index) => (
              <TouchableOpacity 
                key={blog.id} 
                style={[
                  styles.featuredCard,
                  { 
                    width: screenWidth - 32,
                    marginRight: index < featuredBlogs.length - 1 ? 12 : 0 
                  }
                ]}
              >
                <LinearGradient
                  colors={blog.colors}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.featuredImage}
                >
                  <MaterialCommunityIcons name={blog.icon} size={80} color="#FFFFFF" />
                </LinearGradient>
                <View style={styles.featuredContent}>
                  <Text style={styles.featuredTitle}>{blog.title}</Text>
                  <Text style={styles.featuredDescription}>{blog.description}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Pagination dots */}
          <View style={styles.paginationDots}>
            {featuredBlogs.map((_, index) => (
              <View 
                key={index}
                style={[
                  styles.dot, 
                  activeFeatured === index && styles.activeDot
                ]} 
              />
            ))}
          </View>
        </View>

        {/* Technology Blog Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Technology Blog</Text>
            <TouchableOpacity>
              <Text style={styles.seeMoreText}>See More</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {blogs.map((blog, index) => (
              <TouchableOpacity key={blog.id} style={styles.blogCard}>
                <LinearGradient
                  colors={index % 2 === 0 ? ['#FF6B6B', '#FFA500'] : ['#4ECDC4', '#44A08D']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.blogImage}
                >
                  <MaterialCommunityIcons 
                    name={index % 2 === 0 ? "git" : "language-python"} 
                    size={60} 
                    color="#FFFFFF" 
                  />
                </LinearGradient>
                <View style={styles.blogContent}>
                  <Text style={styles.blogCategory}>{blog.category}</Text>
                  <Text style={styles.blogTitle} numberOfLines={2}>{blog.title}</Text>
                  <Text style={styles.blogDescription} numberOfLines={2}>{blog.description}</Text>
                  <Text style={styles.blogMeta}>{blog.author} • {blog.date}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* TopDev TV Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>CareerMate TV</Text>
            <TouchableOpacity style={styles.youtubeButton}>
              <Text style={styles.youtubeButtonText}>Open Youtube</Text>
              <Ionicons name="logo-youtube" size={20} color="#FF0000" />
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            <TouchableOpacity style={styles.videoCard}>
              <LinearGradient
                colors={['#667eea', '#764ba2']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.videoThumbnail}
              >
                <Ionicons name="play-circle" size={80} color="#FFFFFF" />
                <Text style={styles.videoOverlayText}>Kotlin Tips & Tricks</Text>
              </LinearGradient>
              <View style={styles.videoContent}>
                <Text style={styles.videoTitle} numberOfLines={2}>
                  CareerMate TV - Ep 30 | Kotlin Essential Skills
                </Text>
                <Text style={styles.videoMeta}>CareerMate TV • 420 views • 09-01-2021</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.videoCard}>
              <LinearGradient
                colors={['#f093fb', '#f5576c']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.videoThumbnail}
              >
                <Ionicons name="play-circle" size={80} color="#FFFFFF" />
                <Text style={styles.videoOverlayText}>React Native Guide</Text>
              </LinearGradient>
              <View style={styles.videoContent}>
                <Text style={styles.videoTitle} numberOfLines={2}>
                  Building Mobile Apps with React Native
                </Text>
                <Text style={styles.videoMeta}>CareerMate TV • 350 views • 08-15-2021</Text>
              </View>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* IT Market Reports */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>IT Market Reports</Text>
            <TouchableOpacity>
              <Text style={styles.seeMoreText}>See More</Text>
            </TouchableOpacity>
          </View>

          {itReports.map((report) => (
            <TouchableOpacity key={report.id} style={styles.reportCard}>
              <View style={styles.reportContent}>
                <Text style={styles.reportTitle}>{report.title}</Text>
                <Text style={styles.reportDescription}>{report.description}</Text>
                <Text style={styles.reportDate}>{report.date}</Text>
              </View>
              <LinearGradient
                colors={['#56CCF2', '#2F80ED']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.reportImage}
              >
                <Ionicons name="stats-chart" size={40} color="#FFFFFF" />
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        {/* HR Professional Topics */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>HR Professional Topics</Text>
            <TouchableOpacity>
              <Text style={styles.seeMoreText}>See More</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {hrTopics.map((topic) => (
              <TouchableOpacity key={topic.id} style={styles.hrCard}>
                <LinearGradient
                  colors={['#11998e', '#38ef7d']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.hrImage}
                >
                  <MaterialCommunityIcons name="account-group" size={60} color="#FFFFFF" />
                  <Text style={styles.hrOverlayText}>IT RECRUITMENT TRENDS 2024-2025</Text>
                </LinearGradient>
                <View style={styles.hrContent}>
                  <Text style={styles.hrCategory}>{topic.category}</Text>
                  <Text style={styles.hrTitle} numberOfLines={2}>{topic.title}</Text>
                  <Text style={styles.hrMeta}>{topic.author} • {topic.date}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Extra padding for bottom tab bar */}
        <View style={{ height: Platform.OS === 'ios' ? 20 : 10 }} />
      </Animated.ScrollView>
    </View>
  );
}
