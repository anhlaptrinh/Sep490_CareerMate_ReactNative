export const TYPES = {
  ApiClient: Symbol.for("ApiClient"),
  PythonApiClient: Symbol.for("PythonApiClient"),
  LoginRepo: Symbol.for("LoginRepo"),
  CandidateRepo: Symbol.for("CandidateRepo"),
  JobRepo: Symbol.for("JobRepo"),
  CompanyRepo: Symbol.for("CompanyRepo"),
  JdSkillRepo: Symbol.for("JdSkillRepo"),
  AIRepo: Symbol.for("AIRepo"),
  LoginUseCase: Symbol.for("LoginUseCase"),
  LogoutRepo: Symbol.for("LogoutRepo"),
  SignUpRepo: Symbol.for("SignUpRepo"),
  SignUpUseCase: Symbol.for("SignUpUseCase"),
  LogoutUseCase: Symbol.for("LogoutUseCase"),
  GetJobRecommendationsUseCase: Symbol.for("GetJobRecommendationsUseCase"),
  
  // Blog
  BlogRepo: Symbol.for("BlogRepo"),
  GetBlogsUseCase: Symbol.for("GetBlogsUseCase"),
  GetBlogByIdUseCase: Symbol.for("GetBlogByIdUseCase"),
  GetBlogsByCategoryUseCase: Symbol.for("GetBlogsByCategoryUseCase"),
  GetRelatedBlogsUseCase: Symbol.for("GetRelatedBlogsUseCase"),
  SearchBlogsUseCase: Symbol.for("SearchBlogsUseCase"),

  // Notifications
  NotificationRepo: Symbol.for("NotificationRepo"),
  GetNotificationsUseCase: Symbol.for("GetNotificationsUseCase"),
  GetUnreadCountUseCase: Symbol.for("GetUnreadCountUseCase"),
  MarkNotificationAsReadUseCase: Symbol.for("MarkNotificationAsReadUseCase"),
  DeleteNotificationUseCase: Symbol.for("DeleteNotificationUseCase"),
  GetNotificationByIdUseCase: Symbol.for("GetNotificationByIdUseCase"),
  MarkAllNotificationsAsReadUseCase: Symbol.for("MarkAllNotificationsAsReadUseCase"),
};
