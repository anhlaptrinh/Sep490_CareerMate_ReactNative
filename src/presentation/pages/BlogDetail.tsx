import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform,
  StatusBar,
  Animated,
  ActivityIndicator,
  Image,
  Share,
  Dimensions,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { blogDetailStyles } from '../styles';
import { useBlogStore } from '../state/useBlogStore';
import { Blog } from '../../domain/models/Blog';
import { RootStackParamList } from '../navigation/types';
import { BlogContentRenderer } from '../components';

type BlogDetailRouteProp = RouteProp<RootStackParamList, 'BlogDetail'>;

export default function BlogDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<BlogDetailRouteProp>();
  const { blogId } = route.params;
  
  const scrollY = useRef(new Animated.Value(0)).current;
  const [imageLoaded, setImageLoaded] = useState(false);
  const [readTime, setReadTime] = useState('5 min read');
  
  const styles = blogDetailStyles;
  const { width: screenWidth } = Dimensions.get('window');

  const {
    currentBlog,
    relatedBlogs,
    isLoading,
    error,
    fetchBlogById,
    fetchRelatedBlogs,
    clearCurrentBlog,
  } = useBlogStore();

  useEffect(() => {
    loadBlogDetail();
    
    // Cleanup when component unmounts
    return () => {
      clearCurrentBlog();
    };
  }, [blogId]);

  const loadBlogDetail = async () => {
    try {
      await fetchBlogById(blogId);
      await fetchRelatedBlogs(blogId, 5);
    } catch (error) {
      console.error('Error loading blog detail:', error);
    }
  };

  // Header animation
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100, 200],
    outputRange: [0, 0.5, 1],
    extrapolate: 'clamp',
  });

  const imageTranslateY = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [0, -50],
    extrapolate: 'clamp',
  });

  const imageScale = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [1, 1.1],
    extrapolate: 'clamp',
  });

  const handleShare = async () => {
    if (currentBlog) {
      try {
        const shareOptions = {
          title: currentBlog.title,
          message: `Check out this blog: ${currentBlog.title}\\n\\n${currentBlog.excerpt}`,
          url: currentBlog.canonicalUrl || '',
        };
        await Share.share(shareOptions);
      } catch (error) {
        console.error('Error sharing:', error);
      }
    }
  };

  const handleRelatedBlogPress = (blog: Blog) => {
    // Navigate to the related blog
    navigation.navigate('BlogDetail', { blogId: blog.id });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

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

  const getCategoryColor = (category: string): string => {
    switch (category) {
      case 'TECHNOLOGY':
        return '#FF6B6B';
      case 'HR':
        return '#4ECDC4';
      case 'IT_MARKET':
        return '#667eea';
      case 'CAREER':
        return '#56CCF2';
      case 'TUTORIAL':
        return '#11998e';
      case 'BUSINESS':
        return '#f39c12';
      default:
        return '#3DD5DC';
    }
  };

  if (isLoading && !currentBlog) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#3DD5DC" />
        <Text style={styles.loadingText}>Loading blog...</Text>
      </View>
    );
  }

  if (error || !currentBlog) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <MaterialCommunityIcons name="alert-circle-outline" size={64} color="#FF6B6B" />
        <Text style={styles.errorTitle}>Oops! Something went wrong</Text>
        <Text style={styles.errorMessage}>
          {error || 'Blog not found. Please try again later.'}
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadBlogDetail}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Animated Header */}
      <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
        <TouchableOpacity style={styles.headerButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {currentBlog.title}
        </Text>
        <TouchableOpacity style={styles.headerButton} onPress={handleShare}>
          <Ionicons name="share-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </Animated.View>

      <Animated.ScrollView
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Image */}
        <View style={styles.heroContainer}>
          <Animated.View 
            style={[
              styles.heroImageContainer,
              {
                transform: [
                  { translateY: imageTranslateY },
                  { scale: imageScale }
                ]
              }
            ]}
          >
            {currentBlog.thumbnailUrl ? (
              <Image
                source={{ uri: currentBlog.thumbnailUrl }}
                style={styles.heroImage}
                onLoad={() => setImageLoaded(true)}
                resizeMode="cover"
              />
            ) : (
              <LinearGradient
                colors={['#3DD5DC', '#2BB3BB']}
                style={styles.heroImagePlaceholder}
              >
                <MaterialCommunityIcons 
                  name={getCategoryIcon(currentBlog.category)} 
                  size={80} 
                  color="#FFFFFF" 
                />
              </LinearGradient>
            )}
            
            {/* Gradient Overlay */}
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.3)']}
              style={styles.heroGradient}
            />
          </Animated.View>

          {/* Floating Back Button */}
          <View style={styles.floatingButtons}>
            <TouchableOpacity style={styles.floatingButton} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.floatingButton} onPress={handleShare}>
              <Ionicons name="share-outline" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Category Badge */}
          <View 
            style={[
              styles.categoryBadge,
              { backgroundColor: getCategoryColor(currentBlog.category) }
            ]}
          >
            <Text style={styles.categoryText}>{currentBlog.category}</Text>
          </View>

          {/* Title */}
          <Text style={styles.title}>{currentBlog.title}</Text>

          {/* Meta Information */}
          <View style={styles.meta}>
            <View style={styles.metaRow}>
              <MaterialCommunityIcons name="account-circle" size={16} color="#666" />
              <Text style={styles.metaText}>{currentBlog.authorName || 'Unknown Author'}</Text>
            </View>
            <View style={styles.metaRow}>
              <Ionicons name="calendar-outline" size={16} color="#666" />
              <Text style={styles.metaText}>{formatDate(currentBlog.createdAt)}</Text>
            </View>
            <View style={styles.metaRow}>
              <Ionicons name="time-outline" size={16} color="#666" />
              <Text style={styles.metaText}>{currentBlog.readingTimeMinutes || 5} min read</Text>
            </View>
          </View>

          {/* Stats */}
          <View style={styles.stats}>
            <View style={styles.statItem}>
              <Ionicons name="eye-outline" size={18} color="#3DD5DC" />
              <Text style={styles.statText}>{currentBlog.viewCount || 0} views</Text>
            </View>
            {(currentBlog.averageRating || 0) > 0 && (
              <View style={styles.statItem}>
                <Ionicons name="star" size={18} color="#FFD700" />
                <Text style={styles.statText}>
                  {(currentBlog.averageRating || 0).toFixed(1)} ({currentBlog.ratingCount || 0})
                </Text>
              </View>
            )}
            {(currentBlog.commentCount || 0) > 0 && (
              <View style={styles.statItem}>
                <Ionicons name="chatbubble-outline" size={18} color="#3DD5DC" />
                <Text style={styles.statText}>{currentBlog.commentCount || 0} comments</Text>
              </View>
            )}
          </View>

          {/* Excerpt */}
          {currentBlog.excerpt && (
            <Text style={styles.excerpt}>{currentBlog.excerpt}</Text>
          )}

          {/* Content */}
          <View style={styles.blogContent}>
            {currentBlog.content ? (
              <BlogContentRenderer htmlContent={currentBlog.content} />
            ) : (
              <Text style={styles.contentText}>Content not available</Text>
            )}
          </View>

          {/* Tags */}
          {currentBlog.tags && currentBlog.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              <Text style={styles.tagsTitle}>Tags</Text>
              <View style={styles.tags}>
                {currentBlog.tags.map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>#{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Related Blogs */}
          {relatedBlogs.length > 0 && (
            <View style={styles.relatedSection}>
              <Text style={styles.sectionTitle}>Related Articles</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {relatedBlogs.map((blog, index) => (
                  <TouchableOpacity
                    key={blog.id}
                    style={styles.relatedCard}
                    onPress={() => handleRelatedBlogPress(blog)}
                  >
                    <LinearGradient
                      colors={['#3DD5DC', '#2BB3BB']}
                      style={styles.relatedImage}
                    >
                      {blog.thumbnailUrl ? (
                        <Image source={{ uri: blog.thumbnailUrl }} style={styles.relatedImageContent} />
                      ) : (
                        <MaterialCommunityIcons 
                          name={getCategoryIcon(blog.category)} 
                          size={30} 
                          color="#FFFFFF" 
                        />
                      )}
                    </LinearGradient>
                    <View style={styles.relatedContent}>
                      <Text style={styles.relatedTitle} numberOfLines={2}>
                        {blog.title}
                      </Text>
                      <Text style={styles.relatedMeta}>
                        {blog.readingTimeMinutes || 5} min • {blog.authorName || 'Unknown'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Bottom Padding */}
          <View style={{ height: Platform.OS === 'ios' ? 40 : 20 }} />
        </View>
      </Animated.ScrollView>
    </View>
  );
}