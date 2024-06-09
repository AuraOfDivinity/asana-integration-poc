import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserTable1717954577526 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "user" (
        "id" SERIAL NOT NULL,
        "fullName" character varying NOT NULL,
        "email" character varying NOT NULL,
        "asanaToken" character varying,
        CONSTRAINT "UQ_email" UNIQUE ("email"),
        CONSTRAINT "PK_id" PRIMARY KEY ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE "user"
    `);
  }
}
