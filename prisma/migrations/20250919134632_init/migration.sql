/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `game` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "game_title_key" ON "public"."game"("title");
