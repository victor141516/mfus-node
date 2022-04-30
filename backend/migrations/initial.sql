-- -------------------------------------------------------------
-- TablePlus 4.6.4(414)
--
-- https://tableplus.com/
--
-- Database: mfus
-- Generation Time: 2022-04-24 14:50:48.1970
-- -------------------------------------------------------------


-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS link_types_id_seq;

-- Table Definition
CREATE TABLE "public"."link_types" (
    "id" int4 NOT NULL DEFAULT nextval('link_types_id_seq'::regclass),
    "code" varchar NOT NULL,
    "is_long" bool NOT NULL,
    "created_at" timestamptz NOT NULL DEFAULT now(),
    "updated_at" timestamptz NOT NULL DEFAULT now(),
    "deleted_at" timestamptz,
    "long_code_id" int4,
    "short_code_id" int4,
    PRIMARY KEY ("id")
);

-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS long_code_links_id_seq;

-- Table Definition
CREATE TABLE "public"."long_code_links" (
    "id" int4 NOT NULL DEFAULT nextval('long_code_links_id_seq'::regclass),
    "code" varchar NOT NULL,
    "url" varchar NOT NULL,
    "created_at" timestamptz NOT NULL DEFAULT now(),
    "updated_at" timestamptz NOT NULL DEFAULT now(),
    "deleted_at" timestamptz,
    PRIMARY KEY ("id")
);

-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS short_code_links_id_seq;

-- Table Definition
CREATE TABLE "public"."short_code_links" (
    "id" int4 NOT NULL DEFAULT nextval('short_code_links_id_seq'::regclass),
    "url" varchar NOT NULL,
    "created_at" timestamptz NOT NULL DEFAULT now(),
    "updated_at" timestamptz NOT NULL DEFAULT now(),
    "deleted_at" timestamptz,
    PRIMARY KEY ("id")
);

ALTER TABLE "public"."link_types" ADD FOREIGN KEY ("long_code_id") REFERENCES "public"."long_code_links"("id");
ALTER TABLE "public"."link_types" ADD FOREIGN KEY ("short_code_id") REFERENCES "public"."short_code_links"("id");
ALTER TABLE "public"."long_code_links" ADD CONSTRAINT "long_code_lings_code_unique_constraint" UNIQUE ("code");
