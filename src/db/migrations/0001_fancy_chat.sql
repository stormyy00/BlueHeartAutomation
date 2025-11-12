CREATE TABLE "invitation" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"inviter_id" text NOT NULL,
	"organization_id" text NOT NULL,
	"role" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "organization" RENAME COLUMN "icon" TO "logo";--> statement-breakpoint
ALTER TABLE "organization_member" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "organization" ADD COLUMN "slug" text NOT NULL;--> statement-breakpoint
ALTER TABLE "organization" ADD COLUMN "metadata" jsonb DEFAULT '{}'::jsonb;--> statement-breakpoint
ALTER TABLE "organization" ADD COLUMN "keep_current_active_organization" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "invitation" ADD CONSTRAINT "invitation_inviter_id_user_id_fk" FOREIGN KEY ("inviter_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invitation" ADD CONSTRAINT "invitation_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organization" DROP COLUMN "media";--> statement-breakpoint
ALTER TABLE "organization" DROP COLUMN "themes";--> statement-breakpoint
ALTER TABLE "organization" DROP COLUMN "notes";--> statement-breakpoint
ALTER TABLE "organization" DROP COLUMN "donors";--> statement-breakpoint
ALTER TABLE "organization" DROP COLUMN "links";--> statement-breakpoint
ALTER TABLE "organization" DROP COLUMN "groups";--> statement-breakpoint
ALTER TABLE "organization" ADD CONSTRAINT "organization_slug_unique" UNIQUE("slug");