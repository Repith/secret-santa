/*
  Warnings:

  - You are about to drop the column `email` on the `Admin` table. All the data in the column will be lost.
  - Added the required column `password_hash` to the `Admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `Admin` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Admin" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "name" TEXT NOT NULL
);
INSERT INTO "new_Admin" ("id", "name") SELECT "id", "name" FROM "Admin";
DROP TABLE "Admin";
ALTER TABLE "new_Admin" RENAME TO "Admin";
CREATE UNIQUE INDEX "Admin_username_key" ON "Admin"("username");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
