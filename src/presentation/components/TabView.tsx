import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ViewStyle,
  TextStyle,
} from 'react-native';

export interface Tab {
  key: string;
  title: string;
}

interface TabViewProps {
  tabs: Tab[];
  onTabChange?: (tabKey: string, index: number) => void;
  activeColor?: string;
  inactiveColor?: string;
  backgroundColor?: string;
  indicatorColor?: string;
  tabStyle?: ViewStyle;
  tabTextStyle?: TextStyle;
  containerStyle?: ViewStyle;
}

export default function TabView({
  tabs,
  onTabChange,
  activeColor = '#FF6B35',
  inactiveColor = '#666666',
  backgroundColor = '#FFFFFF',
  indicatorColor = '#FF6B35',
  tabStyle,
  tabTextStyle,
  containerStyle,
}: TabViewProps) {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabPress = (index: number) => {
    setActiveTab(index);
    if (onTabChange) {
      onTabChange(tabs[index].key, index);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor }, containerStyle]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, tabStyle]}
            onPress={() => handleTabPress(index)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.tabText,
                tabTextStyle,
                {
                  color: activeTab === index ? activeColor : inactiveColor,
                  fontWeight: activeTab === index ? '600' : '400',
                },
              ]}
            >
              {tab.title}
            </Text>
            {activeTab === index && (
              <View
                style={[
                  styles.indicator,
                  { backgroundColor: indicatorColor },
                ]}
              />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  scrollContent: {
    paddingHorizontal: 10,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginHorizontal: 5,
    position: 'relative',
  },
  tabText: {
    fontSize: 15,
  },
  indicator: {
    position: 'absolute',
    bottom: 0,
    left: 5,
    right: 5,
    height: 3,
    borderRadius: 2,
  },
});
