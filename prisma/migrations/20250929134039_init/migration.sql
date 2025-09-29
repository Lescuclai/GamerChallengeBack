-- DropForeignKey
ALTER TABLE "public"."entry" DROP CONSTRAINT "entry_challenge_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."vote_user_challenge" DROP CONSTRAINT "vote_user_challenge_challenge_id_fkey";

-- AddForeignKey
ALTER TABLE "public"."entry" ADD CONSTRAINT "entry_challenge_id_fkey" FOREIGN KEY ("challenge_id") REFERENCES "public"."challenge"("challenge_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."vote_user_challenge" ADD CONSTRAINT "vote_user_challenge_challenge_id_fkey" FOREIGN KEY ("challenge_id") REFERENCES "public"."challenge"("challenge_id") ON DELETE CASCADE ON UPDATE CASCADE;
