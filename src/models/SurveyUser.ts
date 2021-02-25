import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";

@Entity("surveys_users")
class SurveyUser {
  @PrimaryColumn()
  readonly id: string;

  @Column()
  user_id: string;

  @Column()
  survey_id: string;

  @Column()
  value: number;

  @CreateDateColumn()
  created_at: Date;
}

export { SurveyUser };
