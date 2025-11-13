
//implementation of SignUpRepo
import { injectable, inject } from "inversify";
import { ApiClient } from "../apis/ApiClient";
import { TYPES } from "../../di/types";
import { SignUpRepo } from "./SignUpRepo";
import "reflect-metadata";

@injectable()
class SignUpRepoImpl implements SignUpRepo {
    private apiClient: ApiClient;

    constructor(@inject(TYPES.ApiClient) apiClient: ApiClient) {
        this.apiClient = apiClient;
    }

    async signUp(username: string, password: string, email: string): Promise<void> {
        await this.apiClient.post("/auth/signup", { username, password, email });
    }
}

export { SignUpRepoImpl };