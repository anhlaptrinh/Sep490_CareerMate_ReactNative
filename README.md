# CareerMate Mobile

Ứng dụng di động CareerMate được xây dựng bằng React Native và Expo.

## Yêu cầu hệ thống

Trước khi bắt đầu, hãy đảm bảo bạn đã cài đặt:

- [Node.js](https://nodejs.org/) (phiên bản 18 trở lên)
- [npm](https://www.npmjs.com/) hoặc [yarn](https://yarnpkg.com/)
- [Git](https://git-scm.com/)

### Để chạy trên thiết bị thực hoặc máy ảo:

- **iOS**: Cài đặt [Expo Go](https://apps.apple.com/app/expo-go/id982107779) từ App Store
- **Android**: Cài đặt [Expo Go](https://play.google.com/store/apps/details?id=host.exp.exponent) từ Google Play Store

### Để chạy trên máy ảo (tuỳ chọn):

- **iOS**: [Xcode](https://developer.apple.com/xcode/) (chỉ trên macOS)
- **Android**: [Android Studio](https://developer.android.com/studio) với Android SDK

## Cài đặt

1. **Clone repository**
   ```bash
   git clone https://github.com/anhlaptrinh/Sep490_CareerMate_ReactNative.git
   cd Sep490_CareerMate_ReactNative
   ```

2. **Chuyển sang nhánh develop**
   ```bash
   git checkout develop
   ```

3. **Cài đặt dependencies**
   ```bash
   npm install
   ```
   
   Hoặc nếu bạn sử dụng yarn:
   ```bash
   yarn install
   ```

## Chạy ứng dụng

### Cách 1: Chạy với Expo Go (Khuyến nghị cho người mới bắt đầu)

1. **Khởi động Expo Development Server**
   ```bash
   npm start
   ```
   
   Hoặc:
   ```bash
   npx expo start
   ```

2. **Quét mã QR**
   - Trên **Android**: Mở ứng dụng Expo Go và quét mã QR từ terminal hoặc trình duyệt
   - Trên **iOS**: Mở Camera app và quét mã QR, sau đó nhấn vào thông báo để mở trong Expo Go

### Cách 2: Chạy trực tiếp trên nền tảng cụ thể

#### Chạy trên Android
```bash
npm run android
```

Lệnh này sẽ:
- Tự động mở ứng dụng trên Android emulator (nếu đã chạy)
- Hoặc tự động mở trên thiết bị Android thực đã kết nối qua USB (với USB debugging bật)

#### Chạy trên iOS (chỉ trên macOS)
```bash
npm run ios
```

Lệnh này sẽ tự động mở ứng dụng trên iOS Simulator.

#### Chạy trên Web
```bash
npm run web
```

Ứng dụng sẽ tự động mở trong trình duyệt web.

## Scripts có sẵn

- `npm start` - Khởi động Expo development server
- `npm run android` - Chạy ứng dụng trên Android
- `npm run ios` - Chạy ứng dụng trên iOS (chỉ macOS)
- `npm run web` - Chạy ứng dụng trên trình duyệt web

## Cấu trúc thư mục

```
careermate_mobile/
├── src/
│   ├── data/           # Data layer (API, Repository)
│   ├── domain/         # Domain layer (Models, Use cases)
│   ├── presentation/   # Presentation layer (Components, Pages, Styles)
│   ├── di/            # Dependency Injection
│   └── utils/         # Utilities
├── assets/            # Hình ảnh và tài nguyên tĩnh
├── App.tsx           # Entry point chính
└── package.json      # Dependencies và scripts
```

## Công nghệ sử dụng

- **React Native** - Framework phát triển mobile cross-platform
- **Expo** - Toolchain và platform cho React Native
- **TypeScript** - Ngôn ngữ lập trình
- **React Navigation** - Thư viện điều hướng
- **Expo Linear Gradient** - Hiệu ứng gradient
- **Expo Fonts** - Quản lý fonts (Poppins)

## Xử lý sự cố

### Lỗi "Metro bundler"
```bash
# Xóa cache và khởi động lại
npx expo start -c
```

### Lỗi khi cài đặt dependencies
```bash
# Xóa node_modules và lock file, sau đó cài lại
rm -rf node_modules package-lock.json
npm install
```

### Lỗi kết nối với Expo Go
- Đảm bảo máy tính và điện thoại cùng kết nối vào một mạng WiFi
- Tắt firewall hoặc VPN nếu có
- Thử chuyển sang chế độ "Tunnel" trong Expo Dev Tools

## Đóng góp

1. Fork repository
2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. Commit thay đổi (`git commit -m 'Add some AmazingFeature'`)
4. Push lên branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## Liên hệ

Repository: [https://github.com/anhlaptrinh/Sep490_CareerMate_ReactNative](https://github.com/anhlaptrinh/Sep490_CareerMate_ReactNative)

## License

Dự án này là phần mềm độc quyền (private).
