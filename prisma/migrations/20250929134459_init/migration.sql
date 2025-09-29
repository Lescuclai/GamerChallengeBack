-- DropForeignKey
ALTER TABLE "public"."vote_user_entry" DROP CONSTRAINT "vote_user_entry_entry_id_fkey";

-- AddForeignKey
ALTER TABLE "public"."vote_user_entry" ADD CONSTRAINT "vote_user_entry_entry_id_fkey" FOREIGN KEY ("entry_id") REFERENCES "public"."entry"("entry_id") ON DELETE CASCADE ON UPDATE CASCADE;
