import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from "typeorm";

export class InitialSchema20260201000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasTables = await queryRunner.hasTable("user");
    if(hasTables) return;
    // Create users table
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    await queryRunner.createTable(
      new Table({
        name: "user",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "uuid",
          },
          {
            name: "username",
            type: "varchar",
            isUnique: true,
          },
          {
            name: "password_hash",
            type: "varchar",
          },
          {
            name: "role",
            type: "varchar",
          },
          {
            name: "createdAt",
            type: "timestamp",
            default: "now()",
          },
          {
            name: "updatedAt",
            type: "timestamp",
            default: "now()",
          },
        ],
      }),
      true
    );

    // Create short_url table
    await queryRunner.createTable(
      new Table({
        name: "short_url",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "uuid",
          },
          {
            name: "code",
            type: "varchar",
            isUnique: true,
          },
          {
            name: "targetUrl",
            type: "varchar",
          },
          {
            name: "clicks",
            type: "int",
            default: 0,
          },
          {
            name: "expiresAt",
            type: "timestamp",
            isNullable: true,
          },
          {
            name: "createdAt",
            type: "timestamp",
            default: "now()",
          },
          {
            name: "updatedAt",
            type: "timestamp",
            default: "now()",
          },
          {
            name: "ownerId",
            type: "uuid",
          },
        ],
      }),
      true
    );

    // Foreign key: short_url.ownerId -> user.id
    await queryRunner.createForeignKey(
      "short_url",
      new TableForeignKey({
        columnNames: ["ownerId"],
        referencedTableName: "user",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      }),
    );

    // Create click table
    await queryRunner.createTable(
      new Table({
        name: "click",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "uuid",
          },
          {
            name: "shortUrlId",
            type: "uuid",
          },
          {
            name: "ipAddress",
            type: "varchar",
          },
          {
            name: "timestamp",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
        ],
      }),
      true
    );

    // Foreign key: click.shortUrlId -> short_url.id
    await queryRunner.createForeignKey(
      "click",
      new TableForeignKey({
        columnNames: ["shortUrlId"],
        referencedTableName: "short_url",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("click");
    await queryRunner.dropTable("short_url");
    await queryRunner.dropTable("user");
  }
}
