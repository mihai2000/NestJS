import { MigrationInterface, QueryRunner } from "typeorm";

export class FirstMigrations1730126281596 implements MigrationInterface {
    name = 'FirstMigrations1730126281596'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."upload_entity_type_enum" AS ENUM('image')`);
        await queryRunner.query(`CREATE TABLE "upload_entity" ("id" SERIAL NOT NULL, "name" character varying(1024) NOT NULL, "path" character varying(1024) NOT NULL, "type" "public"."upload_entity_type_enum" NOT NULL DEFAULT 'image', "mime" character varying(128) NOT NULL, "size" character varying(1024) NOT NULL, "createDate" TIMESTAMP NOT NULL DEFAULT now(), "updateDate" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_45b55f0d0d97b85632a607cf039" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "upload_entity"`);
        await queryRunner.query(`DROP TYPE "public"."upload_entity_type_enum"`);
    }

}
