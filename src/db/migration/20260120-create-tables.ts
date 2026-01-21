import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateTables20240610 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          { name: 'id', type: 'serial', isPrimary: true },
          { name: 'username', type: 'varchar', isUnique: true, isNullable: false },
          { name: 'password_hash', type: 'varchar', isNullable: false },
          { name: 'role', type: 'varchar', isNullable: false },
        ],
      }),
      true
    );

    await queryRunner.createTable(
      new Table({
        name: 'short_urls',
        columns: [
          { name: 'id', type: 'serial', isPrimary: true },
          { name: 'code', type: 'varchar', isUnique: true, isNullable: false },
          { name: 'target_url', type: 'varchar', isNullable: false },
          { name: 'clicks', type: 'int', default: '0', isNullable: false },
          { name: 'expires_at', type: 'timestamp', isNullable: true },
          { name: 'created_at', type: 'timestamp', default: 'now()' },
          { name: 'updated_at', type: 'timestamp', default: 'now()' },
        ],
      }),
      true
    );

    await queryRunner.createTable(
      new Table({
        name: 'clicks',
        columns: [
          { name: 'id', type: 'serial', isPrimary: true },
          { name: 'short_url_id', type: 'int', isNullable: false },
          { name: 'ip_address', type: 'varchar', isNullable: false },
          { name: 'timestamp', type: 'timestamp', default: 'now()' },
        ],
      }),
      true
    );

    await queryRunner.createForeignKey(
      'clicks',
      new TableForeignKey({
        columnNames: ['short_url_id'],
        referencedTableName: 'short_urls',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('clicks');
    await queryRunner.dropTable('short_urls');
    await queryRunner.dropTable('users');
  }
}
