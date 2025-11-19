/**
 * Notification utility functions
 * Based on the backend notification guide implementation
 */

import { Notification, NotificationEventType, NotificationMetadata } from '../domain/models/Notification';

/**
 * Extract action URL from notification metadata
 * Used for admin actions and deep linking
 */
export const getNotificationActionUrl = (notification: Notification): string | null => {
  const { metadata } = notification;
  
  // Direct action URL from backend
  if (metadata.actionUrl) {
    return metadata.actionUrl;
  }
  
  // Generate action URLs based on notification type and metadata
  switch (notification.eventType) {
    case NotificationEventType.PROFILE_UPDATE_REQUEST:
      if (metadata.requestId) {
        return `/api/admin/recruiter-update-requests/${metadata.requestId}`;
      }
      break;
      
    case NotificationEventType.APPLICATION_RECEIVED:
      if (metadata.applicationId) {
        return `/api/applications/${metadata.applicationId}`;
      }
      break;
      
    case NotificationEventType.JOB_POSTING_APPROVED:
    case NotificationEventType.JOB_POSTING_REJECTED:
      if (metadata.jobId) {
        return `/api/jobs/${metadata.jobId}`;
      }
      break;
  }
  
  return null;
};

/**
 * Check if notification requires admin action
 */
export const requiresAdminAction = (notification: Notification): boolean => {
  const adminActionTypes = [
    NotificationEventType.PROFILE_UPDATE_REQUEST,
  ];
  
  return adminActionTypes.includes(notification.eventType);
};

/**
 * Get notification context information for display
 */
export const getNotificationContext = (notification: Notification): {
  primaryText: string;
  secondaryText: string;
  actionText?: string;
} => {
  const { eventType, metadata } = notification;
  
  switch (eventType) {
    case NotificationEventType.PROFILE_UPDATE_REQUEST:
      return {
        primaryText: `Profile update from ${metadata.companyName || 'Unknown Company'}`,
        secondaryText: `Recruiter: ${metadata.email || 'N/A'}`,
        actionText: 'Review Request',
      };
      
    case NotificationEventType.PROFILE_UPDATE_APPROVED:
      return {
        primaryText: 'Profile Update Approved',
        secondaryText: metadata.adminNote || 'Your profile has been updated successfully',
      };
      
    case NotificationEventType.PROFILE_UPDATE_REJECTED:
      return {
        primaryText: 'Profile Update Rejected',
        secondaryText: metadata.rejectionReason || 'Please review and resubmit',
      };
      
    case NotificationEventType.APPLICATION_RECEIVED:
      return {
        primaryText: `New Application for ${metadata.jobTitle || 'Job Position'}`,
        secondaryText: `Application ID: ${metadata.applicationId || 'N/A'}`,
        actionText: 'View Application',
      };
      
    case NotificationEventType.APPLICATION_STATUS_CHANGED:
      return {
        primaryText: `Application Status Updated`,
        secondaryText: `Status changed from ${metadata.oldStatus || 'N/A'} to ${metadata.newStatus || 'N/A'}`,
      };
      
    case NotificationEventType.JOB_POSTING_APPROVED:
      return {
        primaryText: 'Job Posting Approved',
        secondaryText: `Job: ${metadata.jobTitle || 'N/A'}`,
      };
      
    case NotificationEventType.JOB_POSTING_REJECTED:
      return {
        primaryText: 'Job Posting Rejected',
        secondaryText: metadata.rejectionReason || 'Please review and resubmit',
      };
      
    case NotificationEventType.ACCOUNT_APPROVED:
      return {
        primaryText: 'Account Approved',
        secondaryText: 'Welcome to CareerMate! Your account is now active.',
      };
      
    case NotificationEventType.ACCOUNT_REJECTED:
      return {
        primaryText: 'Account Rejected',
        secondaryText: metadata.rejectionReason || 'Please contact support for assistance',
      };
      
    default:
      return {
        primaryText: notification.title,
        secondaryText: notification.message,
      };
  }
};

/**
 * Get notification badge style based on priority and read status
 */
export const getNotificationBadgeStyle = (notification: Notification) => {
  const baseStyle = {
    padding: 4,
    borderRadius: 12,
    minHeight: 24,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  };
  
  if (!notification.isRead) {
    return {
      ...baseStyle,
      backgroundColor: '#3DD5DC',  // App theme color for unread
    };
  }
  
  return {
    ...baseStyle,
    backgroundColor: 'transparent',
  };
};

/**
 * Get notification time display preference
 */
export const getTimeDisplay = (notification: Notification): {
  display: string;
  isRecent: boolean;
} => {
  const now = new Date();
  const createdAt = new Date(notification.createdAt);
  const diffMs = now.getTime() - createdAt.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  const isRecent = diffMins < 60; // Less than 1 hour is considered recent
  
  let display: string;
  if (diffMins < 1) {
    display = 'Just now';
  } else if (diffMins < 60) {
    display = `${diffMins}m ago`;
  } else if (diffHours < 24) {
    display = `${diffHours}h ago`;
  } else if (diffDays < 7) {
    display = `${diffDays}d ago`;
  } else {
    display = createdAt.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  }
  
  return { display, isRecent };
};