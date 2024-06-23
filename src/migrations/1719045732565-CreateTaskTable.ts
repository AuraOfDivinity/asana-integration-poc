import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTaskTable1719045732565 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'task',
        columns: [
          {
            name: 'taskId',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'taskTitle',
            type: 'varchar',
          },
          {
            name: 'taskDescription',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'taskOwner',
            type: 'varchar',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('task');
  }
}
