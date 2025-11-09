import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface BottomNavItem {
  key: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  activeIcon?: keyof typeof Ionicons.glyphMap;
}

interface BottomNavigationProps {
  items: BottomNavItem[];
  activeTab: string;
  onTabPress: (tabKey: string) => void;
  activeColor?: string;
  inactiveColor?: string;
  backgroundColor?: string;
}

export default function BottomNavigation({
  items,
  activeTab,
  onTabPress,
  activeColor = '#FF6B35',
  inactiveColor = '#999999',
  backgroundColor = '#FFFFFF',
}: BottomNavigationProps) {
  return (
    <View style={[styles.container, { backgroundColor }]}>
      {items.map((item) => {
        const isActive = activeTab === item.key;
        const iconName = isActive && item.activeIcon ? item.activeIcon : item.icon;
        
        return (
          <TouchableOpacity
            key={item.key}
            style={styles.tab}
            onPress={() => onTabPress(item.key)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={iconName}
              size={24}
              color={isActive ? activeColor : inactiveColor}
            />
            <Text
              style={[
                styles.label,
                {
                  color: isActive ? activeColor : inactiveColor,
                  fontWeight: isActive ? '600' : '400',
                },
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingBottom: Platform.OS === 'ios' ? 20 : 8,
    paddingTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  label: {
    fontSize: 12,
    marginTop: 4,
  },
});
