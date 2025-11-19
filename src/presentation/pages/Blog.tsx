import React, { useRef, useState, useEffect } from 'react';
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
  ActivityIndicator,
  RefreshControl,
  Linking,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { AppHeader } from '../components';
import { blogStyles } from '../styles/BlogStyles';
import { useBlogStore } from '../state/useBlogStore';
import { Blog } from '../../domain/models/Blog';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';

const { width: screenWidth } = Dimensions.get('window');

// Hardcoded interesting videos
const FEATURED_VIDEOS = [
  {
    id: '1',
    title: 'Revolutionizing Java Unit Testing with fully Autonomous AI Diffblue Cover',
    url: 'https://youtu.be/X8pGlWi4bHA?si=Z5dywsdmhKjusQ1G',
    thumbnail: 'https://img.youtube.com/vi/X8pGlWi4bHA/maxresdefault.jpg',
    category: 'Java & Testing',
    gradient: ['#FF6B6B', '#FFA500'] as [string, string],
  },
  {
    id: '2',
    title: 'Java in 100 Seconds',
    url: 'https://youtu.be/l9AzO1FMgM8?si=6O3uLzo7rdtX3fS7',
    thumbnail: 'https://img.youtube.com/vi/l9AzO1FMgM8/maxresdefault.jpg',
    category: 'Programming',
    gradient: ['#667eea', '#764ba2'] as [string, string],
  },
  {
    id: '3',
    title: 'Kotlin in 100 Seconds',
    url: 'https://youtu.be/xT8oP0wy-A0?si=G_yJZ4vyE7UZthnF',
    thumbnail: 'https://img.youtube.com/vi/xT8oP0wy-A0/maxresdefault.jpg',
    category: 'Programming',
    gradient: ['#4ECDC4', '#44A08D'] as [string, string],
  },
  {
    id: '4',
    title: 'React Native vs Flutter - I built the same chat app with both',
    url: 'https://youtu.be/X8ipUgXH6jw?si=AHIILRK1s5f5KRo0',
    thumbnail: 'https://img.youtube.com/vi/X8ipUgXH6jw/maxresdefault.jpg',
    category: 'Mobile Development',
    gradient: ['#f093fb', '#f5576c'] as [string, string],
  },
];

export default function BlogScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFeatured, setActiveFeatured] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const styles = blogStyles;

  // Get blog state and actions from store
  const {
    blogs,
    isLoading,
    error,
    fetchBlogs,
    searchBlogs,
  } = useBlogStore();

  // Fetch blogs on component mount
  useEffect(() => {
    loadInitialData();
  }, []);

  // Handle search with debouncing
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchQuery.trim()) {
        console.log('🔍 Searching for:', searchQuery);
        searchBlogs(searchQuery.trim(), { 
          page: 0, 
          size: 20 
        });
      } else {
        // If search is cleared, reload initial data
        loadInitialData();
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(delayedSearch);
  }, [searchQuery]);

  const loadInitialData = async () => {
    try {
      console.log('🔄 Loading blog data...');
      // Just fetch basic blogs first - no complex filtering
      await fetchBlogs({ page: 0, size: 10 });
    } catch (error) {
      console.error('Error loading blog data:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadInitialData();
    setRefreshing(false);
  };

  const handleBlogPress = (blog: Blog) => {
    navigation.navigate('BlogDetail', { blogId: blog.id });
  };

  const openYouTubeVideo = async (url: string) => {
    try {
      // Extract video ID from URL
      const videoId = url.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=|youtube\.com\/embed\/)([^?&]+)/)?.[1];
      
      if (videoId) {
        // Try YouTube app first
        const youtubeAppUrl = `vnd.youtube://${videoId}`;
        const canOpenApp = await Linking.canOpenURL(youtubeAppUrl);
        
        if (canOpenApp) {
          await Linking.openURL(youtubeAppUrl);
          return;
        }
      }
      
      // Fallback to browser
      await Linking.openURL(url);
    } catch (error) {
      console.error('Error opening YouTube video:', error);
      // Last resort - try direct browser open
      try {
        await Linking.openURL(url);
      } catch (e) {
        console.error('Failed to open URL in browser:', e);
      }
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const handleFeaturedScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const cardWidth = screenWidth - 32 + 12; // card width + gap
    const index = Math.round(scrollPosition / cardWidth);
    setActiveFeatured(index);
  };

  // Get category icon based on category
  const getCategoryIcon = (category: string): any => {
    switch (category) {
      case 'TECHNOLOGY':
        return 'git';
      case 'HR':
        return 'account-group';
      case 'IT_MARKET':
        return 'chart-line';
      case 'CAREER':
        return 'briefcase';
      case 'TUTORIAL':
        return 'school';
      case 'BUSINESS':
        return 'domain';
      default:
        return 'book-open-variant';
    }
  };

  // Get gradient colors based on index
  const getGradientColors = (index: number): [string, string] => {
    const gradients: [string, string][] = [
      ['#FF6B6B', '#FFA500'],
      ['#4ECDC4', '#44A08D'],
      ['#667eea', '#764ba2'],
      ['#56CCF2', '#2F80ED'],
      ['#11998e', '#38ef7d'],
    ];
    return gradients[index % gradients.length];
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
  };

  // Use featured blogs from store (first 4 blogs) or fallback data
  const featuredBlogs = blogs.length > 0 ? blogs.slice(0, 4) : [];
  const displayBlogs = blogs.length > 0 ? blogs : [];
  const isSearching = searchQuery.trim().length > 0;

  if (isLoading && blogs.length === 0) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#3DD5DC" />
        <Text style={{ marginTop: 12, color: '#666' }}>Loading blogs...</Text>
      </View>
    );
  }

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
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#3DD5DC']} />
        }
      >
        {/* Show error message if there's an error */}
        {error && (
          <View style={{ padding: 16, backgroundColor: '#FFE6E6', margin: 16, borderRadius: 8 }}>
            <Text style={{ color: '#D32F2F', textAlign: 'center' }}>
              {error}
            </Text>
            <TouchableOpacity onPress={onRefresh} style={{ marginTop: 8 }}>
              <Text style={{ color: '#3DD5DC', textAlign: 'center', fontWeight: '600' }}>
                Tap to retry
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Search Results Header */}
        {isSearching && (
          <View style={{ padding: 16, backgroundColor: '#F0F8FF', margin: 16, borderRadius: 8 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ color: '#3DD5DC', fontSize: 16, fontWeight: '600', flex: 1 }}>
                {isLoading ? 'Searching...' : `Found ${displayBlogs.length} result(s) for "${searchQuery}"`}
              </Text>
              <TouchableOpacity onPress={clearSearch} style={{ padding: 4 }}>
                <Ionicons name="close-circle" size={24} color="#3DD5DC" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Empty Search State */}
        {isSearching && !isLoading && displayBlogs.length === 0 && (
          <View style={{ padding: 40, alignItems: 'center' }}>
            <Ionicons name="search-outline" size={64} color="#CCC" />
            <Text style={{ fontSize: 18, color: '#666', marginTop: 16, textAlign: 'center' }}>
              No blogs found for "{searchQuery}"
            </Text>
            <Text style={{ fontSize: 14, color: '#999', marginTop: 8, textAlign: 'center' }}>
              Try searching with different keywords
            </Text>
          </View>
        )}

        {/* Featured Blog Section - show only when not searching and have blogs */}
        {!isSearching && featuredBlogs.length > 0 && (
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
                  onPress={() => handleBlogPress(blog)}
                >
                  <LinearGradient
                    colors={getGradientColors(index)}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.featuredImage}
                  >
                    {blog.thumbnailUrl ? (
                      <Image 
                        source={{ uri: blog.thumbnailUrl }} 
                        style={{ width: '100%', height: '100%' }}
                        resizeMode="cover"
                      />
                    ) : (
                      <MaterialCommunityIcons 
                        name={getCategoryIcon(blog.category)} 
                        size={80} 
                        color="#FFFFFF" 
                      />
                    )}
                  </LinearGradient>
                  <View style={styles.featuredContent}>
                    <Text style={styles.featuredTitle}>{blog.title}</Text>
                    <Text style={styles.featuredDescription} numberOfLines={3}>
                      {blog.excerpt}
                    </Text>
                    <Text style={styles.blogMeta}>
                      {blog.authorName} • {formatDate(blog.createdAt)} • {blog.readingTimeMinutes} min read
                    </Text>
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
        )}

        {/* Blog List Section - show if we have blogs */}
        {displayBlogs.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                {isSearching ? 'Search Results' : 'Latest Blogs'}
              </Text>
              {!isSearching && (
                <TouchableOpacity>
                  <Text style={styles.seeMoreText}>See More</Text>
                </TouchableOpacity>
              )}
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalScroll}
            >
              {displayBlogs.map((blog, index) => (
                <TouchableOpacity 
                  key={blog.id} 
                  style={styles.blogCard}
                  onPress={() => handleBlogPress(blog)}
                >
                  <LinearGradient
                    colors={getGradientColors(index)}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.blogImage}
                  >
                    {blog.thumbnailUrl ? (
                      <Image 
                        source={{ uri: blog.thumbnailUrl }} 
                        style={{ width: '100%', height: '100%' }}
                        resizeMode="cover"
                      />
                    ) : (
                      <MaterialCommunityIcons 
                        name={getCategoryIcon(blog.category)} 
                        size={60} 
                        color="#FFFFFF" 
                      />
                    )}
                  </LinearGradient>
                  <View style={styles.blogContent}>
                    <Text style={styles.blogCategory}>{blog.category}</Text>
                    <Text style={styles.blogTitle} numberOfLines={2}>{blog.title}</Text>
                    <Text style={styles.blogDescription} numberOfLines={2}>{blog.excerpt}</Text>
                    <Text style={styles.blogMeta}>
                      {blog.authorName} • {formatDate(blog.createdAt)}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* TopDev TV Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>CareerMate TV</Text>
            <TouchableOpacity 
              style={styles.youtubeButton}
              onPress={() => openYouTubeVideo('https://www.youtube.com')}
            >
              <Text style={styles.youtubeButtonText}>Open Youtube</Text>
              <Ionicons name="logo-youtube" size={20} color="#FF0000" />
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {FEATURED_VIDEOS.map((video, index) => (
              <TouchableOpacity 
                key={video.id} 
                style={styles.videoCard}
                onPress={() => openYouTubeVideo(video.url)}
              >
                <View style={styles.videoThumbnail}>
                  <Image 
                    source={{ uri: video.thumbnail }} 
                    style={{ width: '100%', height: '100%', borderRadius: 12 }}
                    resizeMode="cover"
                  />
                  <View style={styles.playButtonOverlay}>
                    <Ionicons name="play-circle" size={60} color="#FFFFFF" />
                  </View>
                </View>
                <View style={styles.videoContent}>
                  <Text style={styles.videoCategory}>{video.category}</Text>
                  <Text style={styles.videoTitle} numberOfLines={2}>
                    {video.title}
                  </Text>
                  <View style={styles.youtubeTag}>
                    <Ionicons name="logo-youtube" size={14} color="#FF0000" />
                    <Text style={styles.youtubeTagText}>Watch on YouTube</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Show placeholder if no blogs available */}
        {displayBlogs.length === 0 && !isLoading && (
          <View style={{ padding: 40, alignItems: 'center' }}>
            <MaterialCommunityIcons name="book-open-variant" size={80} color="#CCC" />
            <Text style={{ fontSize: 18, color: '#666', marginTop: 16, textAlign: 'center' }}>
              No blogs available yet
            </Text>
            <Text style={{ fontSize: 14, color: '#999', marginTop: 8, textAlign: 'center' }}>
              Check back later for new content
            </Text>
            <TouchableOpacity onPress={onRefresh} style={{ marginTop: 16, padding: 12, backgroundColor: '#3DD5DC', borderRadius: 8 }}>
              <Text style={{ color: '#FFF', fontWeight: '600' }}>Refresh</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Extra padding for bottom tab bar */}
        <View style={{ height: Platform.OS === 'ios' ? 20 : 10 }} />
      </Animated.ScrollView>
    </View>
  );
}
