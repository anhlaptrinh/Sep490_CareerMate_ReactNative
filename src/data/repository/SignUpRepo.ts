

export interface SignUpRepo {
    signUp(username: string, password: string, email: string): Promise<void>;
}
