import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
  Animated,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AppHeader from '../components/AppHeader';
import { companyStyles } from '../styles/CompanyStyles';

const screenWidth = Dimensions.get('window').width;

// Mock data for companies
const topKeywords = [
  'PHP', 'Business Analyst', 'Front-End', 'Java',
  'Back-End', 'JavaScript', 'React', 'Tester'
];

const spotlightCompanies = [
  {
    id: '1',
    name: 'ABBANK',
    fullName: 'Ngân hàng TMCP An Bình (ABBANK)',
    description: 'Ngân hàng TMCP An Bình (ABBANK) được thành lập ngày 13/05/1993, với tầm nhìn trở th...',
    jobCount: 0,
    tags: ['Java', 'Python', 'UX Design', 'DevOps'],
  },
  {
    id: '2',
    name: 'VPBank',
    fullName: 'Ngân hàng TMCP Việt Nam Thịnh Vượng',
    description: 'VPBank là ngân hàng bán lẻ hàng đầu Việt Nam với hơn 20 triệu khách hàng...',
    jobCount: 536,
    tags: ['Java', 'React', 'Angular', 'DevOps'],
  },
  {
    id: '3',
    name: 'ACB',
    fullName: 'Ngân Hàng Á Châu',
    description: 'ACB là một trong những ngân hàng thương mại hàng đầu tại Việt Nam...',
    jobCount: 42,
    tags: ['Oracle', 'Java', 'JavaScript', 'C#'],
  },
  {
    id: '4',
    name: 'Tech Corp',
    fullName: 'Technology Corporation Vietnam',
    description: 'Leading technology company specializing in AI and Machine Learning solutions...',
    jobCount: 128,
    tags: ['Python', 'AI', 'Machine Learning', 'Docker'],
  },
];

const companies = [
  {
    id: '1',
    name: 'Ngân hàng TMCP Việt Nam Thịnh Vượng (VPBank)',
    logo: 'https://via.placeholder.com/60',
    tags: ['Java'],
    location: 'Quận Đống Đa, Hà Nội - Quận 1, Hồ Chí Minh',
    employees: 'Hơn 1000',
    jobCount: 536,
    industry: 'Ngân Hàng',
  },
  {
    id: '2',
    name: 'NGÂN HÀNG THƯƠNG MẠI CỔ PHẦN LỘC PHÁT VIỆT NAM LPBANK',
    logo: 'https://via.placeholder.com/60',
    tags: ['Oracle', 'Java', 'Full-Stack'],
    location: 'Quận Hoàn Kiếm, Hà Nội - Quận 1, Hồ...',
    employees: '10.000-19...',
    jobCount: 257,
    industry: 'Ngân Hàng',
  },
  {
    id: '3',
    name: 'NGÂN HÀNG Á CHÂU (ACB)',
    logo: 'https://via.placeholder.com/60',
    tags: ['Oracle', 'Java', 'JavaScript', 'C#'],
    location: 'Quận 3, Hồ Chí Minh - Quận 3, Hồ Chí...',
    employees: 'Hơn 1000',
    jobCount: 42,
    industry: 'Ngân Hàng',
  },
];

const listHot = [
  {
    id: '1',
    title: 'Korean IT Companies',
    companyCount: 73,
    image: 'https://via.placeholder.com/800x300',
  },
  {
    id: '2',
    title: 'Top 50+10 LEADING IT COMPANIES VIET...',
    companyCount: 51,
    image: 'https://via.placeholder.com/800x300',
  },
];

export default function CompanyScreen() {
  const scrollY = useRef(new Animated.Value(0)).current;
  const [isRecruiting, setIsRecruiting] = React.useState(false);
  const [activeSpotlight, setActiveSpotlight] = React.useState(0);
  const [searchQuery, setSearchQuery] = React.useState('');
  const styles = companyStyles;

  const handleSpotlightScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const cardWidth = screenWidth - 44 + 12; // card width + gap
    const index = Math.round(scrollPosition / cardWidth);
    setActiveSpotlight(index);
  };

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const stickySearchOpacity = scrollY.interpolate({
    inputRange: [50, 100],
    outputRange: [0, 1],
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

      <Animated.ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Top Keyword Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Keyword</Text>
          <View style={styles.keywordContainer}>
            {topKeywords.map((keyword, index) => (
              <TouchableOpacity key={index} style={styles.keywordTag}>
                <Text style={styles.keywordText}>{keyword}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Spotlight Search Page Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Spotlight Search Page</Text>
          <ScrollView
            horizontal
            pagingEnabled={false}
            showsHorizontalScrollIndicator={false}
            snapToInterval={screenWidth - 32}
            decelerationRate="fast"
            contentContainerStyle={styles.spotlightScroll}
            onScroll={handleSpotlightScroll}
            scrollEventThrottle={16}
          >
            {spotlightCompanies.map((company, index) => (
              <TouchableOpacity 
                key={company.id} 
                style={[
                  styles.spotlightCard, 
                  { 
                    width: screenWidth - 44, 
                    marginRight: index < spotlightCompanies.length - 1 ? 12 : 0 
                  }
                ]}
              >
                <LinearGradient
                  colors={
                    index % 4 === 0 ? ['#3DD5DC', '#0099FF'] :
                    index % 4 === 1 ? ['#667eea', '#764ba2'] :
                    index % 4 === 2 ? ['#f093fb', '#f5576c'] :
                    ['#4facfe', '#00f2fe']
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.spotlightImage}
                >
                  <Ionicons name="business" size={80} color="rgba(255,255,255,0.3)" />
                </LinearGradient>
                <View style={styles.spotlightOverlay}>
                  <View style={styles.spotlightLogoContainer}>
                    <View style={styles.logoPlaceholder}>
                      <Ionicons name="briefcase" size={32} color="#3DD5DC" />
                    </View>
                  </View>
                  <Text style={styles.spotlightName}>{company.fullName}</Text>
                  <Text style={styles.spotlightDescription} numberOfLines={2}>
                    {company.description}
                  </Text>
                  <View style={styles.spotlightFooter}>
                    <View style={styles.spotlightJobCount}>
                      <Ionicons name="briefcase-outline" size={16} color="#666" />
                      <Text style={styles.spotlightJobText}>{company.jobCount} job</Text>
                    </View>
                    <View style={styles.spotlightTags}>
                      {company.tags.map((tag, tagIndex) => (
                        <View key={tagIndex} style={styles.spotlightTag}>
                          <Text style={styles.spotlightTagText}>{tag}</Text>
                        </View>
                      ))}
                    </View>
                    <TouchableOpacity>
                      <Ionicons name="bookmark-outline" size={20} color="#666" />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View style={styles.paginationDots}>
            {spotlightCompanies.map((_, index) => (
              <View 
                key={index} 
                style={[styles.dot, index === activeSpotlight && styles.activeDot]} 
              />
            ))}
          </View>
        </View>

        {/* Company List Header with Toggle */}
        <View style={styles.companyListHeader}>
          <Text style={styles.companyListTitle}>Công ty phổ biến</Text>
          <View style={styles.recruitingToggle}>
            <Text style={styles.recruitingText}>Đang tuyển</Text>
            <Switch
              value={isRecruiting}
              onValueChange={setIsRecruiting}
              trackColor={{ false: '#E0E0E0', true: '#3DD5DC' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Filters */}
        <View style={styles.filterSection}>
          <View style={styles.filterRow}>
            <TouchableOpacity style={styles.filterButton}>
              <Text style={styles.filterText}>Địa điểm</Text>
              <Text style={styles.filterSubText}>Tất cả địa...</Text>
              <Ionicons name="chevron-down" size={16} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterButton}>
              <Text style={styles.filterText}>Lĩnh vực</Text>
              <Text style={styles.filterSubText}>All</Text>
              <Ionicons name="chevron-down" size={16} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Company Cards */}
        <View style={styles.companyList}>
          {companies.map((company) => (
            <TouchableOpacity key={company.id} style={styles.companyCard}>
              <View style={styles.companyHeader}>
                <View style={styles.companyLogo}>
                  <Ionicons name="business" size={32} color="#3DD5DC" />
                </View>
                <TouchableOpacity style={styles.bookmarkButton}>
                  <Ionicons name="bookmark-outline" size={20} color="#666" />
                </TouchableOpacity>
              </View>
              <Text style={styles.companyName}>{company.name}</Text>
              <View style={styles.companyTags}>
                {company.tags.map((tag, index) => (
                  <View key={index} style={styles.companyTag}>
                    <Text style={styles.companyTagText}>{tag}</Text>
                  </View>
                ))}
              </View>
              <View style={styles.companyInfo}>
                <View style={styles.companyInfoItem}>
                  <Ionicons name="location-outline" size={14} color="#666" />
                  <Text style={styles.companyInfoText} numberOfLines={1}>
                    {company.location}
                  </Text>
                </View>
                <View style={styles.companyInfoRow}>
                  <View style={styles.companyInfoItem}>
                    <Ionicons name="people-outline" size={14} color="#666" />
                    <Text style={styles.companyInfoText}>{company.employees}</Text>
                  </View>
                  <View style={styles.companyInfoItem}>
                    <Ionicons name="briefcase-outline" size={14} color="#666" />
                    <Text style={styles.companyInfoText}>{company.jobCount} việc làm</Text>
                  </View>
                </View>
                <View style={styles.companyInfoItem}>
                  <Ionicons name="folder-outline" size={14} color="#666" />
                  <Text style={styles.companyInfoText}>{company.industry}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* See More Button */}
        <TouchableOpacity style={styles.seeMoreButton}>
          <Text style={styles.seeMoreButtonText}>Xem thêm công ty</Text>
        </TouchableOpacity>

        {/* List Hot Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>List Hot</Text>
          <View style={styles.listHotContainer}>
            {listHot.map((item, index) => (
              <TouchableOpacity key={item.id} style={styles.listHotCard}>
                <LinearGradient
                  colors={index === 0 ? ['#667eea', '#764ba2'] : ['#f093fb', '#f5576c']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.listHotImage}
                >
                  <Ionicons 
                    name={index === 0 ? "globe-outline" : "trophy-outline"} 
                    size={60} 
                    color="rgba(255,255,255,0.4)" 
                  />
                </LinearGradient>
                <View style={styles.listHotOverlay}>
                  <Text style={styles.listHotTitle}>{item.title}</Text>
                  <Text style={styles.listHotCount}>{item.companyCount} công ty</Text>
                </View>
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
