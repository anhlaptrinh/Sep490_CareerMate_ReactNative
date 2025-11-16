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

        {/* CareerMate TV Section */}
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
