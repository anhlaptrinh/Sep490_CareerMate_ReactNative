import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CompanyScreen from '../pages/Company';
import CompanyListScreen from '../pages/CompanyList';
import CompanyDetailScreen from '../pages/CompanyDetail';
import JobDetailScreen from '../pages/JobDetail';

// ✅ Khai báo kiểu cho navigator
export type CompanyStackParamList = {
  CompanyScreen: undefined;
  CompanyListScreen: { companyAddress?: string };
  CompanyDetailScreen: { companyData: any };
  JobDetailScreen: { jobId: number };
};

// ✅ Tạo stack navigator với type đã khai báo
const CompanyStack = createNativeStackNavigator<CompanyStackParamList>();

export default function CompanyStackNavigator() {
  return (
    <CompanyStack.Navigator screenOptions={{ headerShown: false }}>
      {/* CompanyScreen là màn hình chính */}
      <CompanyStack.Screen
        name="CompanyScreen"
        component={CompanyScreen}
        options={{ title: 'Companies' }}
      />
      {/* CompanyListScreen hiển thị danh sách công ty với phân trang */}
      <CompanyStack.Screen
        name="CompanyListScreen"
        component={CompanyListScreen}
        options={{
          title: 'Companies List',
          headerShown: true,
          headerStyle: { backgroundColor: '#00B8C5' },
          headerTintColor: '#fff',
        }}
      />
      {/* CompanyDetailScreen hiển thị chi tiết công ty */}
      <CompanyStack.Screen
        name="CompanyDetailScreen"
        component={CompanyDetailScreen}
        options={{
          title: 'Company Detail',
          headerShown: true,
          headerStyle: { backgroundColor: '#00B8C5' },
          headerTintColor: '#fff',
        }}
      />
      {/* JobDetailScreen hiển thị chi tiết công việc */}
      <CompanyStack.Screen
        name="JobDetailScreen"
        component={JobDetailScreen}
        options={{
          title: 'Job Detail',
          headerShown: true,
          headerStyle: { backgroundColor: '#00B8C5' },
          headerTintColor: '#fff',
        }}
      />
    </CompanyStack.Navigator>
  );
}
