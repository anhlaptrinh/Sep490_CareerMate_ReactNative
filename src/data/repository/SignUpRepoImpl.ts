
//implementation of SignUpRepo
import { injectable, inject } from "inversify";
import { ApiClient } from "../apis/apiClient";
import { TYPES } from "../../di/types";
import { SignUpRepo } from "./SignUpRepo";
import "reflect-metadata";
import { SignUpRequest } from "../../domain/models/Authentication";

@injectable()
class SignUpRepoImpl implements SignUpRepo {
    private apiClient: ApiClient;

    constructor(@inject(TYPES.ApiClient) apiClient: ApiClient) {
        this.apiClient = apiClient;
    }

    async signUp(payload: SignUpRequest): Promise<void> {
        await this.apiClient.post("/users/sign-up", payload);
    }
}

export { SignUpRepoImpl };