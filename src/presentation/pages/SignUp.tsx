import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  StatusBar,
  Alert,
  Platform,
} from "react-native";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { signUpStyles } from '../styles/SignUpStyles';
import { container } from '../../di/dependencies';
import { TYPES } from '../../di/types';
import { SignUpUseCase } from '../../domain/usecases/SignUpUseCase';
import { LoginRepo } from '../../data/repository/LoginRepo';
import { useAuthStore } from '../state/useAuthStore';

export default function SignUpScreen() {
  const navigation = useNavigation<any>();
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState(new Date(2000, 0, 1)); // Default to Jan 1, 2000
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const styles = signUpStyles;

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios'); // Keep open on iOS
    if (selectedDate) {
      setDateOfBirth(selectedDate);
    }
  };

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleSignUp = async () => {
    // Validate inputs
    if (!fullName || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const signUpUseCase = container.get<SignUpUseCase>(TYPES.SignUpUseCase);
      const loginRepo = container.get<LoginRepo>(TYPES.LoginRepo);

      // Format date to YYYY-MM-DD
      const formattedDate = formatDate(dateOfBirth);

      // Call Sign Up UseCase (validates age >= 18)
      await signUpUseCase.execute({
        email,
        password,
        fullName,
        dateOfBirth: formattedDate,
      });

      // If signup successful, auto login (this saves accessToken & refreshToken)
      await loginRepo.login(email, password);

      // Update auth store with user info
      await checkAuth();

      Alert.alert(
        "Success",
        "Sign up successful! You are now logged in.",
        [
          {
            text: "OK",
            onPress: () => navigation.navigate('MainApp'),
          },
        ]
      );
    } catch (error: any) {
      console.error("Sign up error:", error);
      const errorMessage = error?.message || "Sign up failed. Please try again.";
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('Welcome');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#3DD5DC" />
      
      {/* Back Button */}
      <TouchableOpacity 
        style={styles.backButton}
        onPress={handleBack}
      >
        <Ionicons name="arrow-back" size={28} color="#FFFFFF" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header Section with Dragon */}
        <View style={styles.headerSection}>
          <Text style={styles.headerText}>
            Create Your Account{"\n"}and Simplify Your{"\n"}Workday
          </Text>
          <Image
            source={require("../../../assets/img/login.png")}
            style={styles.dragonImage}
            resizeMode="contain"
          />
        </View>

        {/* SignUp Card */}
        <View style={styles.signupCard}>
          {/* SignUp Title */}
          <Text style={styles.signupTitle}>Sign up</Text>
          <Text style={styles.loginText}>
            Already Have An Account?{" "}
            <Text 
              style={styles.loginLink}
              onPress={() => navigation.navigate('Login')}
            >
              Sign In
            </Text>
          </Text>

          {/* Full Name Input */}
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color="#999" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              placeholderTextColor="#999"
              value={fullName}
              onChangeText={setFullName}
            />
          </View>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color="#999" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Enter your email address"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Date of Birth Input */}
          <TouchableOpacity 
            style={styles.inputContainer}
            onPress={() => setShowDatePicker(true)}
          >
            <Ionicons name="calendar-outline" size={20} color="#999" style={styles.icon} />
            <Text style={[styles.input, { paddingTop: 12 }]}>
              {formatDate(dateOfBirth)}
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={dateOfBirth}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onDateChange}
              maximumDate={new Date()} // Cannot select future dates
              minimumDate={new Date(1900, 0, 1)} // Min date
            />
          )}

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#999" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons 
                name={showPassword ? "eye-outline" : "eye-off-outline"} 
                size={20} 
                color="#999" 
              />
            </TouchableOpacity>
          </View>

          {/* Confirm Password Input */}
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#999" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Confirm password"
              placeholderTextColor="#999"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <Ionicons 
                name={showConfirmPassword ? "eye-outline" : "eye-off-outline"} 
                size={20} 
                color="#999" 
              />
            </TouchableOpacity>
          </View>

          {/* Remember Me & Forgot Password */}
          <View style={styles.optionsRow}>
            <TouchableOpacity
              style={styles.rememberMeContainer}
              onPress={() => setRememberMe(!rememberMe)}
            >
              <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                {rememberMe && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.rememberMeText}>Remember Me</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.forgotPasswordText}>Forget Password?</Text>
            </TouchableOpacity>
          </View>

          {/* Sign Up Button */}
          <TouchableOpacity 
            style={[styles.loginButton, loading && { opacity: 0.6 }]} 
            onPress={handleSignUp}
            disabled={loading}
          >
            <Text style={styles.loginButtonText}>{loading ? "Signing up..." : "Sign Up"}</Text>
          </TouchableOpacity>

          {/* Or Continue With */}
          <Text style={styles.orText}>Or Continue With</Text>

          {/* Social Login Buttons */}
          <View style={styles.socialButtonsRow}>
            <TouchableOpacity style={styles.socialButton}>
              <AntDesign name="apple" size={20} color="#FFFFFF" />
              <Text style={styles.socialButtonText}>Apple</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.socialButton, styles.googleButton]}>
              <AntDesign name="google" size={20} color="#DB4437" />
              <Text style={[styles.socialButtonText, { color: "#000000" }]}>Google</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
