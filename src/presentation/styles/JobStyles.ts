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
  bannerCard: {
    backgroundColor: '#0099FF',
    borderRadius: 16,
    padding: 20,
  },
  bannerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  bannerDescription: {
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 20,
    marginBottom: 15,
  },
  bannerButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  bannerButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0099FF',
  },
  section: {
    paddingVertical: 10,
    backgroundColor: '#F5F5F5',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
  },
  seeMoreText: {
    fontSize: 14,
    color: '#0099FF',
    fontWeight: '600',
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666666',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  horizontalScroll: {
    paddingLeft: 16,
    paddingRight: 16,
    gap: 15,
  },
  companyCardWrapper: {
    width: screenWidth * 0.85,
  },
  jobsList: {
    paddingHorizontal: 16,
    gap: 12,
  },
  jobCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  jobTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
    flex: 1,
  },
  jobTypeBadge: {
    backgroundColor: '#E8F8F9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  jobTypeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3DD5DC',
  },
  jobCompany: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
    marginBottom: 12,
  },
  jobInfo: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  jobInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  jobInfoText: {
    fontSize: 13,
    color: '#666666',
  },
  jobTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  jobTag: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  jobTagText: {
    fontSize: 12,
    color: '#666666',
  },
  jobPostedTime: {
    fontSize: 12,
    color: '#999999',
    marginTop: 4,
  },
});
