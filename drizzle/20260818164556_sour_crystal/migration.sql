CREATE TYPE "user_system_enum" AS ENUM('system', 'user');--> statement-breakpoint
CREATE TABLE "chats" (
	"id" serial PRIMARY KEY,
	"pdf_name" text NOT NULL,
	"pdf_url" text NOT NULL,
	"user_id" varchar(256) NOT NULL UNIQUE,
	"created_at" timestamp DEFAULT now(),
	"file_key" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" serial PRIMARY KEY,
	"chat_id" integer NOT NULL,
	"content" text NOT NULL,
	"role" "user_system_enum" NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_chat_id_chats_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "chats"("id");