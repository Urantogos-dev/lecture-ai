CREATE TABLE "transcripts" (
	"id" serial PRIMARY KEY NOT NULL,
	"lecture_id" integer NOT NULL,
	"raw_content" text NOT NULL,
	"clean_content" text,
	"language" varchar(10) DEFAULT 'mn' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "transcripts" ADD CONSTRAINT "transcripts_lecture_id_lectures_id_fk" FOREIGN KEY ("lecture_id") REFERENCES "public"."lectures"("id") ON DELETE no action ON UPDATE no action;