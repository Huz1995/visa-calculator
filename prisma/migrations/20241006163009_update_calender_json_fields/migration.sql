-- CreateTable
CREATE TABLE "Calender" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "startDate" TEXT NOT NULL,
    "endDate" TEXT NOT NULL,
    "highlightedRange" TEXT NOT NULL,
    "selectedDays" TEXT NOT NULL
);
