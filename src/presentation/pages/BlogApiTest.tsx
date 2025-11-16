import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { container } from '../../di/dependencies';
import { TYPES } from '../../di/types';
import { GetBlogsUseCase } from '../../domain/usecases/GetBlogsUseCase';
import { ApiClient } from '../../data/apis/apiClient';

/**
 * Blog API Test Component
 * Use this to test if the blog API is working correctly
 */
export default function BlogApiTest() {
  const [results, setResults] = useState<string[]>([]);

  const addResult = (message: string) => {
    setResults((prev) => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testApiConnection = async () => {
    addResult('🧪 Testing API connection...');
    try {
      const apiClient = container.get<ApiClient>(TYPES.ApiClient);
      const response = await apiClient.get('/api/blogs?page=0&size=1');
      addResult('✅ API Connection Success!');
      addResult(JSON.stringify(response, null, 2));
    } catch (error: any) {
      addResult('❌ API Connection Failed!');
      addResult(`Error: ${error.message}`);
      addResult(`Details: ${JSON.stringify(error.response?.data || error, null, 2)}`);
    }
  };

  const testGetBlogs = async () => {
    addResult('🧪 Testing GetBlogsUseCase...');
    try {
      const useCase = container.get<GetBlogsUseCase>(TYPES.GetBlogsUseCase);
      const response = await useCase.execute({ page: 0, size: 5 });
      addResult('✅ GetBlogs Success!');
      addResult(`Found ${response.result?.content?.length || 0} blogs`);
      addResult(JSON.stringify(response, null, 2));
    } catch (error: any) {
      addResult('❌ GetBlogs Failed!');
      addResult(`Error: ${error.message}`);
    }
  };

  const testGetBlogsByCategory = async () => {
    addResult('🧪 Testing GetBlogsByCategory (TECHNOLOGY)...');
    try {
      const apiClient = container.get<ApiClient>(TYPES.ApiClient);
      const response = await apiClient.get('/api/blogs/category/TECHNOLOGY?page=0&size=5');
      addResult('✅ GetBlogsByCategory Success!');
      addResult(JSON.stringify(response, null, 2));
    } catch (error: any) {
      addResult('❌ GetBlogsByCategory Failed!');
      addResult(`Error: ${error.message}`);
      addResult(`Details: ${JSON.stringify(error.response?.data || error, null, 2)}`);
    }
  };

  const clearResults = () => {
    setResults([]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Blog API Tester</Text>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={testApiConnection}>
          <Text style={styles.buttonText}>Test API Connection</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={testGetBlogs}>
          <Text style={styles.buttonText}>Test GetBlogs</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={testGetBlogsByCategory}>
          <Text style={styles.buttonText}>Test GetByCategory</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.clearButton]} onPress={clearResults}>
          <Text style={styles.buttonText}>Clear Results</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.resultsContainer}>
        <Text style={styles.resultsTitle}>Results:</Text>
        {results.map((result, index) => (
          <Text key={index} style={styles.resultText}>
            {result}
          </Text>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#3DD5DC',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  clearButton: {
    backgroundColor: '#FF6B6B',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  resultsContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  resultText: {
    fontSize: 12,
    marginBottom: 5,
    color: '#333',
    fontFamily: 'monospace',
  },
});
