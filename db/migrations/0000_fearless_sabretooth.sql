CREATE TABLE IF NOT EXISTS "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"place" varchar(255) NOT NULL,
	"product_name" varchar(255) NOT NULL,
	"brand" varchar(255) NOT NULL,
	"price" integer NOT NULL,
	"product_image_1" text DEFAULT '',
	"product_image_2" text DEFAULT '',
	"product_image_3" text DEFAULT ''
);
