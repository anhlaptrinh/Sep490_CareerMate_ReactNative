export const TYPES = {
  ApiClient: Symbol.for("ApiClient"),
  LoginRepo: Symbol.for("LoginRepo"),
  CandidateRepo: Symbol.for("CandidateRepo"),
  JobRepo: Symbol.for("JobRepo"),
  CompanyRepo: Symbol.for("CompanyRepo"),
  JdSkillRepo: Symbol.for("JdSkillRepo"),
  LoginUseCase: Symbol.for("LoginUseCase"),
  LogoutRepo: Symbol.for("LogoutRepo"),
  SignUpRepo: Symbol.for("SignUpRepo"),
  SignUpUseCase: Symbol.for("SignUpUseCase"),
  LogoutUseCase: Symbol.for("LogoutUseCase"),
  
  // Blog
  BlogRepo: Symbol.for("BlogRepo"),
  GetBlogsUseCase: Symbol.for("GetBlogsUseCase"),
  GetBlogByIdUseCase: Symbol.for("GetBlogByIdUseCase"),
  GetBlogsByCategoryUseCase: Symbol.for("GetBlogsByCategoryUseCase"),
  GetRelatedBlogsUseCase: Symbol.for("GetRelatedBlogsUseCase"),
};
