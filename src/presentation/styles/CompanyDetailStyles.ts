import { StyleSheet, Platform } from 'react-native';

// ✅ CompanyDetail Screen Styles
// Các styles riêng cho màn hình chi tiết công ty (CompanyDetailScreen)
export const companyDetailStyles = StyleSheet.create({
  // ✅ Company Detail - Visit Website Button (Header)
  visitWebsiteButton: {
    backgroundColor: '#3DD5DC',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    marginLeft: 'auto',
  },
  visitWebsiteButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 12,
  },

  // ✅ Tab Navigation Container
  tabNavigationContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingHorizontal: 16,
  },

  // ✅ Tab Button Base Style (with conditional props for active state)
  tabButtonBase: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 3,
  },

  tabButtonText: {
    fontSize: 15,
  },

  // ✅ About Tab Content Container
  aboutTabContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    gap: 16,
  },

  // ✅ Company Description Section
  companyDescriptionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 8,
  },

  companyDescriptionText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },

  // ✅ Divider Section (with top border)
  dividerSection: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 16,
  },

  contactInformationTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 12,
  },

  // ✅ Website Link Text
  websiteLinkText: {
    fontSize: 14,
    color: '#3DD5DC',
    textDecorationLine: 'underline',
  },

  // ✅ Job Count Text
  jobCountText: {
    fontSize: 14,
    color: '#666666',
  },

  // ✅ Visit Website Button Large (in About tab)
  visitWebsiteButtonLarge: {
    backgroundColor: '#3DD5DC',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },

  visitWebsiteButtonLargeText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },

  // ✅ Empty Jobs Content
  emptyJobsContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },

  // ✅ Bottom Padding for Tab Bar
  bottomPadding: {
    height: Platform.OS === 'ios' ? 20 : 10,
  },

  // ✅ Header Logo Background
  headerLogoBackground: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },

  // ✅ Company Info Row with margin
  companyInfoRowWithMargin: {
    marginTop: 12,
  },

  // ✅ Tab Button Dynamic Styles
  tabButtonActive: {
    fontWeight: '700',
    color: '#3DD5DC',
  },

  tabButtonInactive: {
    fontWeight: '600',
    color: '#999999',
  },

  tabBorderActive: {
    borderBottomColor: '#3DD5DC',
  },

  tabBorderInactive: {
    borderBottomColor: 'transparent',
  },

  // ✅ Job Card Selected Style
  jobCardSelected: {
    borderWidth: 2,
    borderColor: '#3DD5DC',
  },

  jobCardUnselected: {
    borderWidth: 2,
    borderColor: 'transparent',
  },
});
