-- Add missing fields to GameState table
-- These fields are used in the application but missing from the database

-- Add diamond/premium fields
ALTER TABLE "GameState" ADD COLUMN "diamonds" REAL DEFAULT 0;
ALTER TABLE "GameState" ADD COLUMN "totalDiamondsSpent" REAL DEFAULT 0;
ALTER TABLE "GameState" ADD COLUMN "totalDiamondsPurchased" REAL DEFAULT 0;
ALTER TABLE "GameState" ADD COLUMN "premiumUpgrades" TEXT DEFAULT '[]';

-- Add prestige fields
ALTER TABLE "GameState" ADD COLUMN "prestigeLevel" INTEGER DEFAULT 0;
ALTER TABLE "GameState" ADD COLUMN "prestigePoints" REAL DEFAULT 0;
ALTER TABLE "GameState" ADD COLUMN "lifetimePaperclips" REAL DEFAULT 0;
ALTER TABLE "GameState" ADD COLUMN "prestigeRewards" TEXT DEFAULT '{}';

-- Add other missing fields
ALTER TABLE "GameState" ADD COLUMN "activePlayTime" REAL DEFAULT 0;
ALTER TABLE "GameState" ADD COLUMN "lastDiamondRewardTime" REAL DEFAULT 0;