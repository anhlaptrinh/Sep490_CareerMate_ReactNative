import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { companyDetailStyles } from '../styles/CompanyDetailStyles';
import { jobStyles } from '../styles/JobStyles';
import { errorStyles } from '../styles/ErrorStyles';
import { JobsTabProps } from '../types/job';

export default function JobsTab({
  companyJobs,
  selectedJobId,
  isLoadingJobs,
  error,
  hasMoreJobs,
  onJobPress,
  onPressIn,
  onPressOut,
  onViewMore,
}: JobsTabProps) {
  const detailStyles = companyDetailStyles;
  const jobListStyles = jobStyles;
  const errorStyle = errorStyles;

  if (isLoadingJobs && companyJobs.length === 0) {
    return (
      <View style={[jobListStyles.container, errorStyle.loadingContainer, errorStyle.emptyContainer]}>
        <ActivityIndicator size="large" color="#3DD5DC" />
        <Text style={errorStyle.loadingText}>Loading jobs...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[jobListStyles.container, errorStyle.errorContainer, errorStyle.emptyContainer]}>
        <Ionicons name="alert-circle-outline" size={48} color="#3DD5DC" />
        <Text style={[errorStyle.errorTitle, { color: '#3DD5DC' }]}>
          Error loading jobs
        </Text>
      </View>
    );
  }

  return (
    <View style={jobListStyles.section}>
      <View style={jobListStyles.jobsList}>
        {companyJobs.length > 0 ? (
          <>
            {companyJobs.map((job: any) => (
              <TouchableOpacity
                key={job.id}
                onPressIn={() => onPressIn(job.id)}
                onPressOut={onPressOut}
                style={[
                  jobListStyles.jobCard,
                  selectedJobId === job.id ? detailStyles.jobCardSelected : detailStyles.jobCardUnselected,
                ]}
                activeOpacity={1}
                onPress={() => onJobPress(job.id)}
              >
                <View style={jobListStyles.jobHeader}>
                  <View style={jobListStyles.jobTitleContainer}>
                    <Text style={jobListStyles.jobTitle}>{job.title}</Text>
                    <View style={jobListStyles.jobTypeBadge}>
                      <Text style={jobListStyles.jobTypeText}>{job.workModel}</Text>
                    </View>
                  </View>
                  <TouchableOpacity>
                    <Ionicons name="bookmark-outline" size={22} color="#666" />
                  </TouchableOpacity>
                </View>

                <View style={jobListStyles.jobInfo}>
                  <View style={jobListStyles.jobInfoItem}>
                    <Ionicons name="location-outline" size={16} color="#666" />
                    <Text style={jobListStyles.jobInfoText}>{job.location}</Text>
                  </View>
                  <View style={jobListStyles.jobInfoItem}>
                    <Ionicons name="cash-outline" size={16} color="#666" />
                    <Text style={jobListStyles.jobInfoText}>{job.salary}</Text>
                  </View>
                </View>

                <Text style={jobListStyles.jobInfoText}>
                  Experience: {job.yearsOfExperience}+ years
                </Text>
                <Text style={jobListStyles.jobInfoText}>
                  Expiration: {job.expirationDate}
                </Text>

                {job.tags && job.tags.length > 0 && (
                  <View style={jobListStyles.jobTags}>
                    {job.tags.map((tag: string, index: number) => (
                      <View key={index} style={jobListStyles.jobTag}>
                        <Text style={jobListStyles.jobTagText}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                )}

                <Text style={jobListStyles.jobPostedTime}>{job.postedTime}</Text>
              </TouchableOpacity>
            ))}

            {hasMoreJobs && !isLoadingJobs && (
              <TouchableOpacity style={jobListStyles.viewMoreButton} onPress={onViewMore}>
                <Text style={jobListStyles.viewMoreText}>View More</Text>
              </TouchableOpacity>
            )}

            {isLoadingJobs && (
              <View style={errorStyle.loadingMoreContainer}>
                <ActivityIndicator size="small" color="#3DD5DC" />
                <Text style={errorStyle.loadingMoreText}>Loading more...</Text>
              </View>
            )}
          </>
        ) : (
          <View style={detailStyles.emptyJobsContent}>
            <Ionicons name="briefcase-outline" size={40} color="#CCCCCC" />
            <Text style={errorStyle.emptyText}>
              No open positions at the moment
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
