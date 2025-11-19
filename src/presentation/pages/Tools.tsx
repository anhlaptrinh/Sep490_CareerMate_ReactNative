import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Platform,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { toolsStyles } from '../styles/ToolsStyles';

const tools = [
  {
    id: '1',
    title: 'CV / Cover Letter',
    description: 'Would you like you to have a job that suits you. Create cv on CareerMate, we will suggest you the most suitable jobs',
    icon: 'briefcase-outline' as const,
    buttonText: 'UPLOAD/CREATE NEW CV',
    colors: ['#667eea', '#764ba2'] as [string, string],
  },
  {
    id: '2',
    title: 'Workplace Personality Test',
    description: 'Analyze your personal characteristics and abilities to determine whether you suitable for IT jobs on the market.',
    icon: 'school-outline' as const,
    buttonText: 'TAKE THE TEST',
    colors: ['#f093fb', '#f5576c'] as [string, string],
  },
  {
    id: '3',
    title: 'Salary Converter',
    description: 'Avoid unnecessary misunderstandings and protect your own rights when signing a labor contract by understanding Gross & Net salary.',
    icon: 'cash-outline' as const,
    buttonText: 'CALCULATE YOUR SALARY',
    colors: ['#4facfe', '#00f2fe'] as [string, string],
  },
];

export default function ToolsScreen({ navigation }: { navigation: any }) {
  const scrollY = useRef(new Animated.Value(0)).current;

  const styles = toolsStyles;

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.9],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#3DD5DC" />
      
      {/* Header */}
      <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
        <Text style={styles.headerTitle}>CareerMate Tools</Text>
      </Animated.View>

      <Animated.ScrollView
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {tools.map((tool) => (
          <View key={tool.id} style={styles.toolCard}>
            <LinearGradient
              colors={tool.colors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.iconContainer}
            >
              <Ionicons name={tool.icon} size={40} color="#FFFFFF" />
            </LinearGradient>

            <View style={styles.toolContent}>
              <Text style={styles.toolTitle}>{tool.title}</Text>
              <Text style={styles.toolDescription}>{tool.description}</Text>

              <TouchableOpacity style={styles.toolButton}>
                <Text style={styles.buttonText}>{tool.buttonText}</Text>
                <Ionicons name="add-circle" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* Test Tools Section */}
        <View style={styles.testSection}>
          <Text style={styles.testSectionTitle}>🧪 Development & Testing</Text>
          
          <TouchableOpacity
            style={styles.testButton}
            onPress={() => navigation.navigate('NotificationTest')}
          >
            <View style={styles.testButtonContent}>
              <MaterialCommunityIcons name="bell-ring" size={24} color="#3DD5DC" />
              <View style={styles.testButtonText}>
                <Text style={styles.testButtonTitle}>Notification System Test</Text>
                <Text style={styles.testButtonDescription}>
                  Test candidate notification functionality
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
        </View>

        {/* Extra padding for bottom tab bar */}
        <View style={{ height: Platform.OS === 'ios' ? 20 : 10 }} />
      </Animated.ScrollView>
    </View>
  );
}
