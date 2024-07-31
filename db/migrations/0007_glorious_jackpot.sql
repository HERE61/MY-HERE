ALTER TABLE "accounts" ADD COLUMN "kakao_provider_id" varchar(255);--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "google_provider_id" varchar(255);--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "last_signed_in_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "created_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "accounts" DROP COLUMN IF EXISTS "accountType";--> statement-breakpoint
ALTER TABLE "accounts" DROP COLUMN IF EXISTS "provider";--> statement-breakpoint
ALTER TABLE "accounts" DROP COLUMN IF EXISTS "provider_account_id";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN IF EXISTS "email_verified";