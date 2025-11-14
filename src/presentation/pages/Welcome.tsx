import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StatusBar,
  Animated,
} from "react-native";
import { useFonts, Poppins_700Bold, Poppins_400Regular, Poppins_600SemiBold } from "@expo-google-fonts/poppins";
import { useNavigation } from '@react-navigation/native';
import { welcomeStyles } from '../styles/WelcomeStyles';

export default function WelcomeScreen() {
  const navigation = useNavigation<any>();
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const contentSlideAnim = useRef(new Animated.Value(100)).current;
  const swayAnim = useRef(new Animated.Value(0)).current;

  let [fontsLoaded] = useFonts({
    Poppins_700Bold,
    Poppins_400Regular,
    Poppins_600SemiBold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      // Parallel animations for smooth entrance
      Animated.parallel([
        // Fade in
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        // Slide up illustration
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
        // Scale up illustration
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        // Slide up content from bottom
        Animated.timing(contentSlideAnim, {
          toValue: 0,
          duration: 900,
          delay: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Start swaying animation after initial animations complete
        Animated.loop(
          Animated.sequence([
            Animated.timing(swayAnim, {
              toValue: 1,
              duration: 2000,
              useNativeDriver: true,
            }),
            Animated.timing(swayAnim, {
              toValue: -1,
              duration: 4000,
              useNativeDriver: true,
            }),
            Animated.timing(swayAnim, {
              toValue: 0,
              duration: 2000,
              useNativeDriver: true,
            }),
          ])
        ).start();
      });
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  const styles = welcomeStyles;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#3DD5DC" />
      
      {/* Illustration Section */}
      <Animated.View 
        style={[
          styles.illustrationContainer,
          {
            opacity: fadeAnim,
            transform: [
              { translateY: slideAnim },
              { scale: scaleAnim },
              { 
                rotate: swayAnim.interpolate({
                  inputRange: [-1, 1],
                  outputRange: ['-8deg', '8deg']
                })
              }
            ]
          }
        ]}
      >
        <Image
          source={require("../../../assets/img/welcome.png")}
          style={styles.illustration}
          resizeMode="contain"
        />
      </Animated.View>

      {/* Content Section */}
      <Animated.View 
        style={[
          styles.contentContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: contentSlideAnim }]
          }
        ]}
      >
        <Text style={styles.appName}>CAREER MATE</Text>
        <Text style={styles.title}>Let's Get You Set Up{"\n"}for Success</Text>
        <Text style={styles.description}>
          Organize your workflow and manage tasks easily{"\n"}all in one simple, powerful app.
        </Text>

        {/* Get Started Button */}
        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.buttonText}>Get started</Text>
        </TouchableOpacity>

        {/* Explore the App Button */}
        <TouchableOpacity 
          style={styles.exploreButton}
          onPress={() => navigation.replace('MainApp')}
        >
          <Text style={styles.exploreButtonText}>Explore the app</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}
