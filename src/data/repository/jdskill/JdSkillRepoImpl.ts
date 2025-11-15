// JdSkill Repository Implementation - uses ApiClient from DI
import { ApiClient } from "../../apis/apiClient";
import { TYPES } from "../../../di/types";
import { JdSkillRepo, JdSkill } from "./JdSkillRepo";
import { injectable, inject } from "inversify";
import "reflect-metadata";

@injectable()
class JdSkillRepoImpl implements JdSkillRepo {
  private apiClient: ApiClient;

  constructor(@inject(TYPES.ApiClient) apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  /**
   * Lấy danh sách các kỹ năng được sử dụng nhiều nhất
   * API: GET /jdskill/top-used
   * Response: { code, message, result: [ { id, name }, ... ] }
   * Danh sách đã được sắp xếp theo tần suất sử dụng
   */
  async getTopUsedSkills(): Promise<JdSkill[]> {
    try {
      const response = await this.apiClient.get<any>(
        "/jdskill/top-used"
      );
      const skills = response.result || [];
      console.log('✅ Top used skills loaded:', skills.length, 'skills');
      return skills;
    } catch (error) {
      console.error('JdSkillRepoImpl.getTopUsedSkills Error:', error);
      throw error;
    }
  }
}

export default JdSkillRepoImpl;
