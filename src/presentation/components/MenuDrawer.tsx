import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Dimensions,
  Animated,
  Platform,
  StatusBar,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../state/useAuthStore';

const { width: screenWidth } = Dimensions.get('window');

interface MenuDrawerProps {
  visible: boolean;
  onClose: () => void;
  isLoggedIn?: boolean;
  userName?: string;
  onNavigateToLogin?: () => void;
}

const menuItems = [
  { id: 'home', title: 'Home', icon: 'briefcase-outline' as const },
  { id: 'jobs', title: 'All Jobs', icon: 'document-text-outline' as const },
  { id: 'companies', title: 'Companies', icon: 'business-outline' as const },
  { id: 'blogs', title: 'Blogs', icon: 'newspaper-outline' as const },
  { id: 'tools', title: 'Tools', icon: 'construct-outline' as const },
  { id: 'profile', title: 'Profile', icon: 'person-outline' as const },
  { id: 'personality', title: 'Workplace Personality Test', icon: 'school-outline' as const },
];

export default function MenuDrawer({ visible, onClose, isLoggedIn = false, userName = 'Guest User', onNavigateToLogin }: MenuDrawerProps) {
  const navigation = useNavigation<any>();
  const { logout } = useAuthStore();
  const [isVisible, setIsVisible] = React.useState(visible);
  const slideAnim = React.useRef(new Animated.Value(-screenWidth * 0.85)).current;
  const backdropOpacity = React.useRef(new Animated.Value(0)).current;

  const handleLogout = () => {
    Alert.alert(
      'Đăng xuất',
      'Bạn có chắc chắn muốn đăng xuất?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Đăng xuất',
          style: 'destructive',
          onPress: async () => {
            onClose();
            await logout();
            // Navigate to Welcome screen after logout
            setTimeout(() => {
              navigation.reset({
                index: 0,
                routes: [{ name: 'Auth', params: { screen: 'Welcome' } }],
              });
            }, 300);
          },
        },
      ]
    );
  };

  React.useEffect(() => {
    if (visible) {
      setIsVisible(true);
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -screenWidth * 0.85,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIsVisible(false);
      });
    }
  }, [visible]);

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <View style={styles.container}>
        <Animated.View 
          style={[
            styles.backdrop,
            { opacity: backdropOpacity }
          ]}
        >
          <TouchableOpacity 
            style={StyleSheet.absoluteFill}
            activeOpacity={1} 
            onPress={onClose}
          />
        </Animated.View>
        
        <Animated.View 
          style={[
            styles.drawer,
            { transform: [{ translateX: slideAnim }] }
          ]}
        >
          {/* Header */}
          <View style={styles.drawerHeader}>
            <TouchableOpacity 
              onPress={onClose} 
              style={styles.closeButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close" size={28} color="#666666" />
            </TouchableOpacity>
            <Text style={styles.drawerTitle}>Menu</Text>
            <View style={{ width: 28 }} />
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* User Info / Auth Section */}
            {isLoggedIn ? (
              <View style={styles.userSection}>
                <View style={styles.avatar}>
                  <Ionicons name="person" size={32} color="#FFFFFF" />
                </View>
                <Text style={styles.userName}>{userName}</Text>
              </View>
            ) : (
              <View style={styles.authSection}>
                <TouchableOpacity 
                  style={styles.authButton}
                  onPress={() => {
                    onClose();
                    onNavigateToLogin?.();
                  }}
                >
                  <Text style={styles.authButtonText}>SIGN UP / SIGN IN</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Menu Items */}
            <View style={styles.menuSection}>
              <Text style={styles.sectionTitle}>Menu</Text>
              {menuItems.map((item) => (
                <TouchableOpacity key={item.id} style={styles.menuItem}>
                  <Ionicons name={item.icon} size={24} color="#666666" />
                  <Text style={styles.menuItemText}>{item.title}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Sign Out (only when logged in) */}
            {isLoggedIn && (
              <TouchableOpacity 
                style={styles.signOutButton}
                onPress={handleLogout}
              >
                <Text style={styles.signOutText}>Sign Out</Text>
              </TouchableOpacity>
            )}

            {/* Version */}
            <Text style={styles.versionText}>v2.4.0 (2025021001)</Text>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  drawer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: screenWidth * 0.85,
    height: '100%',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 16,
    zIndex: 1000,
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 50 : (StatusBar.currentHeight || 0) + 10,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  closeButton: {
    padding: 8,
    zIndex: 10,
  },
  drawerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
  },
  authSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  authButton: {
    backgroundColor: '#3DD5DC',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  authButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  menuSection: {
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  menuItemText: {
    fontSize: 16,
    color: '#333333',
    marginLeft: 16,
  },
  signOutButton: {
    marginHorizontal: 20,
    marginVertical: 20,
    paddingVertical: 14,
    alignItems: 'center',
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF3B30',
  },
  versionText: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'center',
    paddingVertical: 20,
  },
});
