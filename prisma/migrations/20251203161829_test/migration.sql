/*
  Warnings:

  - You are about to drop the column `secretSantaId` on the `Participant` table. All the data in the column will be lost.
  - Added the required column `adminId` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Draw" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "eventId" TEXT NOT NULL,
    "giverId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Draw_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Draw_giverId_fkey" FOREIGN KEY ("giverId") REFERENCES "Participant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Draw_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "Participant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Exclusion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "giverId" TEXT NOT NULL,
    "excludedId" TEXT NOT NULL,
    CONSTRAINT "Exclusion_giverId_fkey" FOREIGN KEY ("giverId") REFERENCES "Participant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Exclusion_excludedId_fkey" FOREIGN KEY ("excludedId") REFERENCES "Participant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Event" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "adminId" TEXT NOT NULL,
    CONSTRAINT "Event_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Event" ("date", "id", "name") SELECT "date", "id", "name" FROM "Event";
DROP TABLE "Event";
ALTER TABLE "new_Event" RENAME TO "Event";
CREATE TABLE "new_LoginToken" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "token" TEXT NOT NULL,
    "participantId" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usedAt" DATETIME,
    CONSTRAINT "LoginToken_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_LoginToken" ("expiresAt", "id", "participantId", "token") SELECT "expiresAt", "id", "participantId", "token" FROM "LoginToken";
DROP TABLE "LoginToken";
ALTER TABLE "new_LoginToken" RENAME TO "LoginToken";
CREATE UNIQUE INDEX "LoginToken_token_key" ON "LoginToken"("token");
CREATE TABLE "new_Participant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "avatar" TEXT,
    "eventId" TEXT NOT NULL,
    "hasDrawn" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Participant_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Participant" ("email", "eventId", "id", "name") SELECT "email", "eventId", "id", "name" FROM "Participant";
DROP TABLE "Participant";
ALTER TABLE "new_Participant" RENAME TO "Participant";
CREATE UNIQUE INDEX "Participant_email_key" ON "Participant"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Draw_eventId_giverId_key" ON "Draw"("eventId", "giverId");

-- CreateIndex
CREATE UNIQUE INDEX "Draw_eventId_receiverId_key" ON "Draw"("eventId", "receiverId");

-- CreateIndex
CREATE UNIQUE INDEX "Exclusion_giverId_excludedId_key" ON "Exclusion"("giverId", "excludedId");
