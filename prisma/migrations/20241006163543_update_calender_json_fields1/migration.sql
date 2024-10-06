/*
  Warnings:

  - You are about to alter the column `endDate` on the `Calender` table. The data in that column could be lost. The data in that column will be cast from `String` to `DateTime`.
  - You are about to alter the column `startDate` on the `Calender` table. The data in that column could be lost. The data in that column will be cast from `String` to `DateTime`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Calender" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "highlightedRange" TEXT NOT NULL,
    "selectedDays" TEXT NOT NULL
);
INSERT INTO "new_Calender" ("endDate", "highlightedRange", "id", "name", "selectedDays", "startDate") SELECT "endDate", "highlightedRange", "id", "name", "selectedDays", "startDate" FROM "Calender";
DROP TABLE "Calender";
ALTER TABLE "new_Calender" RENAME TO "Calender";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
