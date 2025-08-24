CREATE TYPE "public"."role" AS ENUM('admin', 'user');--> statement-breakpoint
CREATE TABLE "sub_tenants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tenants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_sub_tenant_maps" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"sub_tenant_id" uuid NOT NULL,
	"role" "role" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"totp_secret" text,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "sub_tenants" ADD CONSTRAINT "sub_tenants_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_sub_tenant_maps" ADD CONSTRAINT "user_sub_tenant_maps_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_sub_tenant_maps" ADD CONSTRAINT "user_sub_tenant_maps_sub_tenant_id_sub_tenants_id_fk" FOREIGN KEY ("sub_tenant_id") REFERENCES "public"."sub_tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "sub_tenant_name_idx" ON "sub_tenants" USING btree ("name");--> statement-breakpoint
CREATE INDEX "sub_tenant_tenant_id_idx" ON "sub_tenants" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "tenant_name_idx" ON "tenants" USING btree ("name");--> statement-breakpoint
CREATE INDEX "user_sub_tenant_user_id_idx" ON "user_sub_tenant_maps" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_sub_tenant_sub_tenant_id_idx" ON "user_sub_tenant_maps" USING btree ("sub_tenant_id");--> statement-breakpoint
CREATE INDEX "email_idx" ON "users" USING btree ("email");--> statement-breakpoint
INSERT INTO "users" ("email", "password") VALUES ('daggamaul@gmail.com', '$2b$12$Cdz6lyY.wUCclq/C7nP1yeA2M0HwHwJs4FyPJxZzFcIeQmvjFDFHu');