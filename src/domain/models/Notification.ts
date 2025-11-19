/**
 * Notification domain models
 * Based on Kafka notification implementation guide
 */

/**
 * Notification event types from Kafka topics
 */
export enum NotificationEventType {
  // Job Posting Events
  JOB_POSTING_APPROVED = 'JOB_POSTING_APPROVED',
  JOB_POSTING_REJECTED = 'JOB_POSTING_REJECTED',

  // Application Events
  APPLICATION_RECEIVED = 'APPLICATION_RECEIVED',
  APPLICATION_STATUS_CHANGED = 'APPLICATION_STATUS_CHANGED',

  // Profile Events
  PROFILE_VERIFICATION = 'PROFILE_VERIFICATION',
  PROFILE_UPDATE_REQUEST = 'PROFILE_UPDATE_REQUEST',      // Admin receives
  PROFILE_UPDATE_APPROVED = 'PROFILE_UPDATE_APPROVED',    // Recruiter receives
  PROFILE_UPDATE_REJECTED = 'PROFILE_UPDATE_REJECTED',    // Recruiter receives

  // Account Events
  ACCOUNT_APPROVED = 'ACCOUNT_APPROVED',
  ACCOUNT_REJECTED = 'ACCOUNT_REJECTED',

  // System Events
  SYSTEM_NOTIFICATION = 'SYSTEM_NOTIFICATION',

  // Test Events
  TEST_ADMIN_NOTIFICATION = 'TEST_ADMIN_NOTIFICATION',
  TEST_RECRUITER_NOTIFICATION = 'TEST_RECRUITER_NOTIFICATION',
  TEST_CANDIDATE_NOTIFICATION = 'TEST_CANDIDATE_NOTIFICATION',
}

/**
 * Notification priority levels
 */
export enum NotificationPriority {
  HIGH = 1,
  MEDIUM = 2,
  LOW = 3,
}

/**
 * Notification categories
 */
export enum NotificationCategory {
  PROFILE_UPDATE = 'PROFILE_UPDATE',
  JOB_POSTING = 'JOB_POSTING', 
  APPLICATION = 'APPLICATION',
  ACCOUNT = 'ACCOUNT',
  SYSTEM = 'SYSTEM',
  ADMIN_ACTION_REQUIRED = 'ADMIN_ACTION_REQUIRED',
}

/**
 * Main notification model
 */
export interface Notification {
  id: number;
  eventId: string;
  eventType: NotificationEventType;
  recipientId: string;
  title: string;
  subject?: string;               // Email subject line (from backend)
  message: string;
  category: NotificationCategory;
  metadata: NotificationMetadata;  // Enhanced typed metadata
  priority: NotificationPriority;
  isRead: boolean;
  createdAt: string;
  readAt?: string;
}

/**
 * Enhanced metadata structure based on backend implementation
 */
export interface NotificationMetadata {
  // Common fields
  actionUrl?: string;              // Deep link URL for admin actions
  
  // Profile-related metadata
  requestId?: number;              // Profile update request ID
  recruiterId?: number;            // Recruiter user ID
  candidateId?: number;            // Candidate user ID
  companyName?: string;            // Company name
  email?: string;                  // User email
  adminNote?: string;              // Admin feedback note
  rejectionReason?: string;        // Reason for rejection
  status?: string;                 // APPROVED, REJECTED, PENDING
  
  // Job-related metadata
  jobId?: number;                  // Job posting ID
  jobTitle?: string;               // Job title
  
  // Application-related metadata
  applicationId?: number;          // Application ID
  oldStatus?: string;              // Previous application status
  newStatus?: string;              // New application status
  
  // System metadata
  actionType?: string;             // Type of action required
  severity?: string;               // For system notifications
  
  // Generic additional data
  [key: string]: any;              // For any other backend fields
}

/**
 * Notification query parameters
 */
export interface NotificationQueryParams {
  page?: number;
  size?: number;
  isRead?: boolean;
  eventType?: NotificationEventType;
  category?: NotificationCategory;
  priority?: NotificationPriority;
}

/**
 * Page response for paginated notifications
 */
export interface NotificationPageResponse {
  content: Notification[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

/**
 * API response wrapper
 */
export interface NotificationApiResponse<T> {
  code: number;
  message?: string;
  result: T;
}

/**
 * Notification event from Kafka (used for understanding backend structure)
 */
export interface NotificationEvent {
  eventId: string;
  eventType: NotificationEventType;
  recipientId: string;
  recipientEmail: string;
  title: string;
  subject: string;                 // Email subject line
  message: string;
  category: NotificationCategory;
  metadata: NotificationMetadata;
  timestamp: string;
  priority: NotificationPriority;
}

/**
 * Unread count response
 */
export interface UnreadCountResponse {
  count: number;
}

/**
 * Helper type for notification icons
 */
export interface NotificationIcon {
  emoji: string;
  color: string;
}

/**
 * Helper type for priority colors
 */
export interface PriorityColors {
  [key: number]: string;
}