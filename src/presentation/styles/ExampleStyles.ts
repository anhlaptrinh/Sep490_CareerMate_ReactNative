/**
 * VÍ DỤ SỬ DỤNG createResponsiveStyles
 * 
 * TỰ ĐỘNG SCALE TẤT CẢ STYLES - KHÔNG CẦN CHỈNH TỪNG PROPERTY!
 * 
 * Chỉ cần thay đổi:
 * StyleSheet.create() → createResponsiveStyles()
 * 
 * Tất cả các kích thước sẽ tự động scale theo màn hình
 */

import { createResponsiveStyles } from '../../utils/responsive';

// ❌ CÁCH CŨ - Phải nhập từng chỗ
// import { scaleFont, scale, hs, vs } from '../../utils/responsive';
// export const styles = StyleSheet.create({
//   container: {
//     padding: scale(20),
//     fontSize: scaleFont(16),
//     ...
//   }
// });

// ✅ CÁCH MỚI - Tự động scale tất cả!
export const exampleStyles = createResponsiveStyles({
  container: {
    padding: 20,              // → Tự động scale
    margin: 15,               // → Tự động scale
    backgroundColor: '#FFF',  // → Giữ nguyên (không phải số)
  },
  
  text: {
    fontSize: 16,             // → Tự động scale theo font
    lineHeight: 24,           // → Tự động scale theo chiều dọc
    color: '#000',            // → Giữ nguyên
  },
  
  box: {
    width: 200,               // → Tự động scale theo chiều ngang
    height: 150,              // → Tự động scale theo chiều dọc
    borderRadius: 12,         // → Tự động scale
    borderWidth: 2,           // → Tự động scale
  },
  
  button: {
    paddingHorizontal: 20,    // → Tự động scale theo chiều ngang
    paddingVertical: 12,      // → Tự động scale theo chiều dọc
    marginTop: 10,            // → Tự động scale theo chiều dọc
  },
  
  // Các properties này KHÔNG được scale (giữ nguyên)
  flexContainer: {
    flex: 1,                  // → KHÔNG scale
    flexGrow: 2,              // → KHÔNG scale
    opacity: 0.8,             // → KHÔNG scale
    zIndex: 10,               // → KHÔNG scale
  },
  
  shadow: {
    shadowColor: '#000',      // → Giữ nguyên
    shadowOffset: {
      width: 0,               // → Tự động scale
      height: 2,              // → Tự động scale
    },
    shadowOpacity: 0.25,      // → KHÔNG scale
    shadowRadius: 4,          // → Tự động scale
    elevation: 5,             // → KHÔNG scale
  },
});

/**
 * CÁCH 2: Sử dụng ResponsiveStyleSheet (giống StyleSheet.create)
 */
import { ResponsiveStyleSheet } from '../../utils/responsive';

export const exampleStyles2 = ResponsiveStyleSheet.create({
  container: {
    padding: 20,
    margin: 15,
  },
  text: {
    fontSize: 16,
  },
});

/**
 * CÁCH 3: Nếu cần scale thủ công một số chỗ
 */
import { scale, scaleFont, hs, vs } from '../../utils/responsive';

export const customValue = {
  iconSize: scale(24),
  titleFont: scaleFont(20),
  horizontalMargin: hs(16),
  verticalPadding: vs(12),
};

/**
 * ĐỂ SỬ DỤNG:
 * 
 * 1. Import styles:
 *    import { exampleStyles } from './ExampleStyles';
 * 
 * 2. Sử dụng như bình thường:
 *    <View style={exampleStyles.container}>
 *      <Text style={exampleStyles.text}>Hello</Text>
 *    </View>
 */
