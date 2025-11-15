// JdSkill Repository Interface - Data Layer contract

export interface JdSkill {
  id: number;
  name: string;
}

export interface JdSkillRepo {
  getTopUsedSkills(): Promise<JdSkill[]>;
}
