import { createNativeStackNavigator } from '@react-navigation/native-stack';
import JobScreen from '../pages/Job';
import LatestJobsScreen from '../pages/LatestJobs';
import JobDetailScreen from '../pages/JobDetail';
import CompanyDetailScreen from '../pages/CompanyDetail';

// Khai báo kiểu cho navigator
// JobStackParamList định nghĩa tất cả screen trong JobStack và các params của chúng
export type JobStackParamList = {
  JobScreen: undefined;          // JobScreen không nhận param
  LatestJobsScreen: { jobsData: any }; // cho phép truyền dữ liệu
  JobDetailScreen: { jobId: number }; // JobDetailScreen nhận jobId kiểu number
  CompanyDetailScreen: { companyData: any }; // CompanyDetailScreen nhận company data
};

// Tạo stack navigator với type đã khai báo
const JobStack = createNativeStackNavigator<JobStackParamList>();

export default function JobStackNavigator() {
  return (
    <JobStack.Navigator screenOptions={{ headerShown: false }}>
      {/* JobScreen là màn hình chính */}
      <JobStack.Screen name="JobScreen" component={JobScreen} options={{ title: 'Jobs' }} />
      {/* LatestJobsScreen sẽ hiển thị danh sách job chi tiết */}
      <JobStack.Screen name="LatestJobsScreen" component={LatestJobsScreen} options={{
        title: 'Latest Jobs',
        headerShown: true,
        headerStyle: { backgroundColor: '#00B8C5' },
        headerTintColor: '#fff',
      }} />
      {/* JobDetailScreen hiển thị chi tiết công việc */}
      <JobStack.Screen name="JobDetailScreen" component={JobDetailScreen} options={{
        title: 'Job Detail',
        headerShown: true,
        headerStyle: { backgroundColor: '#00B8C5' },
        headerTintColor: '#fff',
      }} />
      {/* CompanyDetailScreen hiển thị chi tiết công ty và các job của công ty */}
      <JobStack.Screen name="CompanyDetailScreen" component={CompanyDetailScreen} options={{
        title: 'Company Detail',
        headerShown: true,
        headerStyle: { backgroundColor: '#00B8C5' },
        headerTintColor: '#fff',
      }} />
    </JobStack.Navigator>
  );
}
