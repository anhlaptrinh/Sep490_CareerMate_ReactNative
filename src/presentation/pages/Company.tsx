import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Platform,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AppHeader from '../components/AppHeader';
import TopKeywordSection from '../components/TopKeywordSection';
import CompanyListSection from '../components/CompanyListSection';
import { companyStyles } from '../styles/CompanyStyles';
import { CompanyStackParamList } from '../navigation/CompanyStackNavigator';
import { container } from '../../di/dependencies';
import { TYPES } from '../../di/types';
import { CompanyRepo } from '../../data/repository/company';

type CompanyScreenNavigationProp = NativeStackNavigationProp<CompanyStackParamList, 'CompanyScreen'>;

export default function CompanyScreen() {
  const scrollY = useRef(new Animated.Value(0)).current;
  const [companies, setCompanies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation<CompanyScreenNavigationProp>();
  const styles = companyStyles;
  const PAGE_SIZE = 5;

  // ✅ Get CompanyRepo from DI container
  const companyRepository = container.get<CompanyRepo>(TYPES.CompanyRepo);

  // ✅ Load companies on component mount
  useEffect(() => {
    loadCompanies();
  }, []);

  // ✅ Load first 5 companies from API
  const loadCompanies = async () => {
    try {
      setIsLoading(true);
      const response = await companyRepository.getCompanies(0, PAGE_SIZE);
      const companiesData = response.result.content || [];

      setCompanies(companiesData);
      console.log('✅ Companies loaded:', companiesData.length);
    } catch (error) {
      console.error('❌ Error loading companies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Navigate to CompanyDetailScreen
  const handleCompanyPress = (company: any) => {
    // ✅ Pass only company.id to CompanyDetailScreen
    navigation.navigate('CompanyDetailScreen', {
      companyData: {
        id: company.id,
        name: company.name || '',
        about: '',
        website: '',
        logoUrl: company.logoUrl || '',
        jobs: [],
      }
    });
  };

  // Navigate to CompanyListScreen for full pagination
  const handleViewMore = () => {
    navigation.navigate('CompanyListScreen', {});
  };

  // ✅ Show loading state
  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#3DD5DC" />
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
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Top Keyword Section */}
        <TopKeywordSection />

        {/* Company List Section with Filter */}
        <CompanyListSection
          companies={companies}
          onCompanyPress={handleCompanyPress}
          onViewMorePress={handleViewMore}
        />

        {/* Extra padding for bottom tab bar */}
        <View style={{ height: Platform.OS === 'ios' ? 20 : 10 }} />
      </Animated.ScrollView>
    </View>
  );
}
