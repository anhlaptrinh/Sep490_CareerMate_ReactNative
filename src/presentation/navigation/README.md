# Navigation Structure

## Cấu trúc Navigation đã được tối ưu hóa

### 📁 File Structure
```
src/presentation/navigation/
├── AppNavigation.tsx      # Root Stack Navigator
├── AuthNavigation.tsx     # Auth Stack (Welcome, Login, SignUp)
├── InAppNavigation.tsx    # Bottom Tabs (Jobs, Companies, Blog, Tools, Profile)
├── types.ts              # TypeScript definitions
└── index.ts              # Export file
```

### 🏗️ Navigation Hierarchy

```
AppNavigation (Root Stack)
├── Auth (Stack Navigator)
│   ├── Welcome
│   ├── Login
│   └── SignUp
│
├── MainApp (Bottom Tab Navigator)
│   ├── JobTab
│   ├── CompanyTab
│   ├── BlogTab
│   ├── ToolsTab
│   └── ProfileTab
│
└── Notification (Modal)
```

### 🎯 Cách sử dụng Navigation

#### 1. Từ Auth screens (Welcome, Login, SignUp)
```typescript
// Navigate trong Auth flow
navigation.navigate('Login');
navigation.navigate('SignUp');
navigation.navigate('Welcome');

// Navigate tới Main App
navigation.navigate('MainApp');
```

#### 2. Từ Main App screens (Jobs, Companies, Blog, Tools, Profile)
```typescript
// Navigate về Auth flow
navigation.navigate('Auth', { screen: 'Login' });

// Navigate tới Notification modal
navigation.navigate('Notification');

// Switch giữa các tabs (automatic)
// Bottom tabs tự động xử lý navigation giữa các tab
```

#### 3. Go Back
```typescript
navigation.goBack();
```

### 🔄 Navigation Flow Examples

#### Flow 1: New User
```
Welcome → Login → MainApp (JobTab)
```

#### Flow 2: Guest Mode
```
Welcome → [Explore] → MainApp (JobTab)
```

#### Flow 3: Logout
```
ProfileTab → [Sign Out] → Auth (Login)
```

#### Flow 4: Open Notification
```
Any Tab → Notification (Modal) → Back to Tab
```

### ✨ Lợi ích của cấu trúc mới

✅ **Tách biệt rõ ràng**: Auth flow và Main app flow độc lập
✅ **Dễ bảo trì**: Mỗi navigator có file riêng
✅ **TypeScript support**: Type-safe navigation
✅ **Scalable**: Dễ thêm screens/flows mới
✅ **Better UX**: Animations được tối ưu cho từng flow
✅ **Clean code**: Không còn nested navigators phức tạp

### 📝 Notes

- **Auth Navigator**: Sử dụng Stack cho authentication flow
- **InApp Navigator**: Sử dụng Bottom Tabs cho main app
- **Root Navigator**: Quản lý chuyển đổi giữa Auth và MainApp
- **Modal screens**: Notification hiển thị như modal overlay

### 🚀 Migration từ code cũ

#### Before:
```typescript
navigation.navigate('MainTabs');  // ❌ Old
```

#### After:
```typescript
navigation.navigate('MainApp');   // ✅ New
```

### 🔧 Future Enhancements

Có thể thêm:
- Deep linking configuration
- Authentication state management
- Protected routes
- Navigation guards
- Custom transitions
