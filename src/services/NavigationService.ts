import {createNavigationContainerRef} from '@react-navigation/native';
import {RootStackParamList} from '../presentation/navigation/types';

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export function navigate(name: keyof RootStackParamList, params?: any) {
  if (navigationRef.isReady()) {
    (navigationRef as any).navigate(name, params);
  } else {
    console.warn('Navigation not ready:', name);
  }
}

export function replace(name: keyof RootStackParamList, params?: any) {
  if (navigationRef.isReady()) {
    (navigationRef as any).reset({
      index: 0,
      routes: [{name, params}],
    });
  } else {
    console.warn('Navigation not ready:', name);
  }
}

export function goBack() {
  if (navigationRef.isReady() && navigationRef.canGoBack()) {
    navigationRef.goBack();
  }
}
