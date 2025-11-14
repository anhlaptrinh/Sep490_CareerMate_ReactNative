import { SignUpRequest } from "../../domain/models/Authentication";


export interface SignUpRepo {
    signUp(payload: SignUpRequest): Promise<void>;
}
