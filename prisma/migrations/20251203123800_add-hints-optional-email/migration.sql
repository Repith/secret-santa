-- CreateTable
CREATE TABLE "WantedHint" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "participantId" TEXT NOT NULL,
    "hint" TEXT NOT NULL,
    CONSTRAINT "WantedHint_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UnwantedHint" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "participantId" TEXT NOT NULL,
    "hint" TEXT NOT NULL,
    CONSTRAINT "UnwantedHint_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "WantedHint_participantId_idx" ON "WantedHint"("participantId");

-- CreateIndex
CREATE INDEX "UnwantedHint_participantId_idx" ON "UnwantedHint"("participantId");