# HƯỚNG DẪN CHUYỂN ĐỔI SANG RESPONSIVE

## Cách chuyển đổi cực kỳ đơn giản:

### TRƯỚC (JobStyles.ts):
```typescript
import { StyleSheet, Dimensions } from 'react-native';

export const jobStyles = StyleSheet.create({
  container: {
    padding: 20,
    fontSize: 16,
  },
});
```

### SAU (JobStyles.ts):
```typescript
import { createResponsiveStyles } from '../../utils/responsive';
// HOẶC: import { ResponsiveStyleSheet } from '../../utils/responsive';

// Cách 1: Dùng createResponsiveStyles
export const jobStyles = createResponsiveStyles({
  container: {
    padding: 20,        // ← Giữ nguyên số, tự động scale!
    fontSize: 16,       // ← Giữ nguyên số, tự động scale!
  },
});

// Cách 2: Dùng ResponsiveStyleSheet (giống StyleSheet.create)
export const jobStyles = ResponsiveStyleSheet.create({
  container: {
    padding: 20,
    fontSize: 16,
  },
});
```

## CHỈ CẦN THAY ĐỔI 2 DÒNG CODE:

1. **Thay dòng import:**
   ```typescript
   // Xóa dòng này:
   import { StyleSheet, Dimensions } from 'react-native';
   
   // Thêm dòng này:
   import { createResponsiveStyles } from '../../utils/responsive';
   ```

2. **Thay StyleSheet.create thành createResponsiveStyles:**
   ```typescript
   // Xóa:
   export const jobStyles = StyleSheet.create({
   
   // Thay bằng:
   export const jobStyles = createResponsiveStyles({
   ```

3. **XONG! Tất cả các số sẽ tự động scale!**

## CÁC FILE CẦN CHUYỂN ĐỔI:

✅ Chuyển đổi tất cả các file trong `src/presentation/styles/`:
- [ ] BlogStyles.ts
- [ ] CompanyStyles.ts
- [ ] JobStyles.ts ← VÍ DỤ DƯỚI ĐÂY
- [ ] LoginStyles.ts
- [ ] NotificationStyles.ts
- [ ] ProfileStyles.ts
- [ ] SignUpStyles.ts
- [ ] ToolsStyles.ts
- [ ] WelcomeStyles.ts

## VÍ DỤ CHUYỂN ĐỔI JOBSTYLES.TS:

### TRƯỚC:
\`\`\`typescript
import { StyleSheet, Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

export const jobStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  bannerSection: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 20,
    marginTop: -10,
    backgroundColor: '#F5F5F5',
  },
  bannerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  // ... các styles khác
});
\`\`\`

### SAU (Chỉ thay 2 dòng!):
\`\`\`typescript
import { createResponsiveStyles, deviceInfo } from '../../utils/responsive';

export const jobStyles = createResponsiveStyles({
  container: {
    flex: 1,                    // KHÔNG scale (flex luôn giữ nguyên)
    backgroundColor: '#F5F5F5', // KHÔNG scale (string)
  },
  bannerSection: {
    paddingHorizontal: 16,      // → TỰ ĐỘNG scale theo chiều ngang
    paddingTop: 8,              // → TỰ ĐỘNG scale theo chiều dọc
    paddingBottom: 20,          // → TỰ ĐỘNG scale theo chiều dọc
    marginTop: -10,             // → TỰ ĐỘNG scale (cả số âm)
    backgroundColor: '#F5F5F5', // KHÔNG scale
  },
  bannerTitle: {
    fontSize: 22,               // → TỰ ĐỘNG scale font (có giới hạn 0.85-1.3)
    fontWeight: '700',          // KHÔNG scale
    color: '#FFFFFF',           // KHÔNG scale
    marginBottom: 10,           // → TỰ ĐỘNG scale theo chiều dọc
  },
  // ... giữ nguyên các styles khác, chỉ thay 2 dòng đầu!
});
\`\`\`

### NẾU CẦN DÙNG SCREEN WIDTH:
\`\`\`typescript
import { createResponsiveStyles, deviceInfo } from '../../utils/responsive';

export const jobStyles = createResponsiveStyles({
  // Thay vì: width: screenWidth * 0.85
  // Dùng: width từ deviceInfo
  companyCardWrapper: {
    width: deviceInfo.width * 0.85,  // deviceInfo.width thay cho screenWidth
  },
});
\`\`\`

## LỢI ÍCH:

✅ Chỉ thay 2 dòng code
✅ Không cần nhập `scale()`, `hs()`, `vs()`, `scaleFont()` từng chỗ
✅ Tự động scale theo màn hình
✅ Hoạt động trên mọi thiết bị (cũ & mới)
✅ Giữ nguyên code cũ, chỉ thêm auto-scaling

## LƯU Ý:

- `flex`, `opacity`, `zIndex`, `elevation`, `fontWeight` → KHÔNG scale (giữ nguyên)
- `fontSize` → Scale với giới hạn (0.85x - 1.3x)
- `padding/margin` → Scale thông minh (horizontal/vertical/chung)
- `width/height` → Scale theo chiều tương ứng
- String, màu sắc → Giữ nguyên

## TEST:

1. Chuyển đổi 1 file (ví dụ: JobStyles.ts)
2. Chạy app: `npm start`
3. Test trên nhiều thiết bị khác nhau
4. Nếu OK → Chuyển đổi các file còn lại

## CÂU HỎI THƯỜNG GẶP:

**Q: File cũ có bị mất không?**
A: Không, bạn chỉ thay 2 dòng code trong file

**Q: Có cần xóa `const screenWidth = Dimensions.get('window').width;`?**
A: Có thể xóa và thay bằng `deviceInfo.width`

**Q: Làm sao biết nó scale đúng?**
A: Test trên emulator với nhiều kích thước màn hình khác nhau

**Q: Có ảnh hưởng đến các component đang dùng styles không?**
A: Không, vì export name giữ nguyên (`jobStyles`)
