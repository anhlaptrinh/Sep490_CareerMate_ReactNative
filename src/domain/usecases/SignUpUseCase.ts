import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { SignUpRepo } from "../../data/repository/SignUpRepo";
import { SignUpRequest } from "../models/Authentication";

@injectable()
export class SignUpUseCase {
  constructor(@inject(TYPES.SignUpRepo) private signUpRepo: SignUpRepo) {}

  /**
   * Validate and execute sign up
   * @throws Error if validation fails
   */
  async execute(payload: SignUpRequest): Promise<void> {
    // Validate email format
    this.validateEmail(payload.email);

    // Validate password strength
    this.validatePassword(payload.password);

    // Validate full name
    this.validateFullName(payload.fullName);

    // Validate date of birth (must be >= 18 years old)
    this.validateDateOfBirth(payload.dateOfBirth);

    // Call repository to sign up
    await this.signUpRepo.signUp(payload);
  }

  private validateEmail(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email format");
    }
  }

  private validatePassword(password: string): void {
    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters long");
    }
  }

  private validateFullName(fullName: string): void {
    if (!fullName || fullName.trim().length < 2) {
      throw new Error("Full name must be at least 2 characters long");
    }
  }

  private validateDateOfBirth(dateOfBirth: string): void {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    
    // Calculate age
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age < 18) {
      throw new Error("You must be at least 18 years old to sign up");
    }

    // Check if date is in the future
    if (birthDate > today) {
      throw new Error("Date of birth cannot be in the future");
    }

    // Check if date is too far in the past (e.g., > 120 years)
    if (age > 120) {
      throw new Error("Please enter a valid date of birth");
    }
  }
}
