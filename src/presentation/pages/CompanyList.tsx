import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { companyStyles } from '../styles/CompanyStyles';
import { errorStyles } from '../styles/ErrorStyles';
import { CompanyStackParamList } from '../navigation/CompanyStackNavigator';
import { container } from '../../di/dependencies';
import { TYPES } from '../../di/types';
import { CompanyRepo } from '../../data/repository/company';

type Props = NativeStackScreenProps<CompanyStackParamList, 'CompanyListScreen'>;

export default function CompanyListScreen({ navigation }: Props) {
  const PAGE_SIZE = 5;
  const [companies, setCompanies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMoreCompanies, setHasMoreCompanies] = useState(true);
  const [selectedAddress, setSelectedAddress] = useState<string | undefined>();

  const styles = companyStyles;
  const errorStyle = errorStyles;

  // ✅ Get CompanyRepo từ DI container
  const companyRepository = container.get<CompanyRepo>(TYPES.CompanyRepo);

  // ✅ Load companies khi component mount hoặc address filter thay đổi
  useEffect(() => {
    loadCompanies(0, true);
  }, [selectedAddress]);

  // ✅ Hàm load companies từ API
  const loadCompanies = async (page: number, isFirst: boolean = false) => {
    try {
      if (isFirst) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }
      setError(null);

      // ✅ Call actual API with optional address filter
      const response = await companyRepository.getCompanies(page, PAGE_SIZE, selectedAddress);
      const companiesData = response.result.content || [];

      if (isFirst) {
        setCompanies(companiesData);
      } else {
        setCompanies(prev => [...prev, ...companiesData]);
      }

      const totalPages = response.result.totalPages || 0;
      setCurrentPage(page);
      setHasMoreCompanies(page + 1 < totalPages);

      console.log('✅ Companies loaded, page:', page, 'count:', companiesData.length);
    } catch (err) {
      console.error('❌ Error loading companies:', err);
      setError(err instanceof Error ? err.message : 'Failed to load companies');
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  // ✅ Handle View More button
  const handleViewMore = async () => {
    if (isLoadingMore || !hasMoreCompanies) return;
    await loadCompanies(currentPage + 1, false);
  };

  const handleCompanyPress = (company: any) => {
    // ✅ Pass only company.id to CompanyDetailScreen
    navigation.navigate('CompanyDetailScreen', {
      companyData: {
        id: company.id,
      }
    });
  };

  // ✅ Render loading state
  if (isLoading) {
    return (
      <View style={[styles.container, errorStyle.loadingContainer]}>
        <ActivityIndicator size="large" color="#3DD5DC" />
        <Text style={errorStyle.loadingText}>Loading companies...</Text>
      </View>
    );
  }

  // ✅ Render error state
  if (error) {
    return (
      <View style={[styles.container, errorStyle.errorContainer]}>
        <Ionicons name="alert-circle-outline" size={48} color="#3DD5DC" />
        <Text style={errorStyle.errorTitle}>Error loading companies</Text>
        <Text style={errorStyle.errorMessage}>{error}</Text>
      </View>
    );
  }

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.companyCard}
      onPress={() => handleCompanyPress(item)}
    >
      <View style={styles.companyHeader}>
        <View style={styles.companyLogo}>
          <Ionicons name="business" size={32} color="#3DD5DC" />
        </View>
        <TouchableOpacity style={styles.bookmarkButton}>
          <Ionicons name="bookmark-outline" size={20} color="#666" />
        </TouchableOpacity>
      </View>
      <Text style={styles.companyName}>{item.name}</Text>
      <View style={styles.companyTags}>
        {item.tags?.map((tag: string, index: number) => (
          <View key={index} style={styles.companyTag}>
            <Text style={styles.companyTagText}>{tag}</Text>
          </View>
        ))}
      </View>
      <View style={styles.companyInfo}>
        <View style={styles.companyInfoItem}>
          <Ionicons name="location-outline" size={14} color="#666" />
          <Text style={styles.companyInfoText} numberOfLines={1}>
            {item.companyAddress}
          </Text>
        </View>
        <View style={styles.companyInfoRow}>
          <View style={styles.companyInfoItem}>
            <Ionicons name="people-outline" size={14} color="#666" />
            <Text style={styles.companyInfoText}>{item.employees}</Text>
          </View>
          <View style={styles.companyInfoItem}>
            <Ionicons name="briefcase-outline" size={14} color="#666" />
            <Text style={styles.companyInfoText}>{item.jobCount} jobs</Text>
          </View>
        </View>
        <View style={styles.companyInfoItem}>
          <Ionicons name="folder-outline" size={14} color="#666" />
          <Text style={styles.companyInfoText}>{item.industry}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingHorizontal: 16, paddingVertical: 10 }]}>
      {/* Filter Section */}
      <View style={styles.filterSection}>
        <View style={styles.filterRow}>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterText}>Location</Text>
            <Text style={styles.filterSubText}>All locations</Text>
            <Ionicons name="chevron-down" size={16} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterText}>Industry</Text>
            <Text style={styles.filterSubText}>All</Text>
            <Ionicons name="chevron-down" size={16} color="#666" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Company List */}
      <FlatList
        data={companies}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 8 }}
      />

      {/* View More Button */}
      {hasMoreCompanies && !isLoadingMore && companies.length > 0 && (
        <TouchableOpacity style={styles.seeMoreButton} onPress={handleViewMore}>
          <Text style={styles.seeMoreButtonText}>View More</Text>
        </TouchableOpacity>
      )}

      {/* Loading More Indicator */}
      {isLoadingMore && (
        <View style={errorStyle.loadingMoreContainer}>
          <ActivityIndicator size="small" color="#3DD5DC" />
          <Text style={errorStyle.loadingMoreText}>Loading more...</Text>
        </View>
      )}

      {/* Empty State */}
      {companies.length === 0 && !isLoading && (
        <View style={[styles.container, errorStyle.emptyContainer]}>
          <Ionicons name="business-outline" size={40} color="#CCCCCC" />
          <Text style={errorStyle.emptyText}>
            No companies found
          </Text>
        </View>
      )}
    </View>
  );
}
