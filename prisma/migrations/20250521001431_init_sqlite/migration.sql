-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" DATETIME,
    "password" TEXT,
    "image" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" DATETIME NOT NULL,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "GameState" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "paperclips" REAL NOT NULL DEFAULT 0,
    "money" REAL NOT NULL DEFAULT 0,
    "wire" REAL NOT NULL DEFAULT 1000,
    "autoclippers" INTEGER NOT NULL DEFAULT 0,
    "autoclipper_cost" REAL NOT NULL DEFAULT 10,
    "clicks_per_second" REAL NOT NULL DEFAULT 0,
    "clickMultiplier" INTEGER NOT NULL DEFAULT 1,
    "totalClicks" INTEGER NOT NULL DEFAULT 0,
    "totalPaperclipsMade" REAL NOT NULL DEFAULT 0,
    "revenuePerSecond" REAL NOT NULL DEFAULT 0,
    "productionMultiplier" REAL NOT NULL DEFAULT 1,
    "megaClippers" INTEGER NOT NULL DEFAULT 0,
    "megaClipperCost" REAL NOT NULL DEFAULT 5000,
    "megaClippersUnlocked" BOOLEAN NOT NULL DEFAULT false,
    "spoolCost" REAL NOT NULL DEFAULT 5,
    "wirePerSpool" REAL NOT NULL DEFAULT 1000,
    "autoWireBuyer" BOOLEAN NOT NULL DEFAULT false,
    "autoWireBuyerCost" REAL NOT NULL DEFAULT 100,
    "spoolSizeUpgradeCost" REAL NOT NULL DEFAULT 125,
    "spoolSizeLevel" INTEGER NOT NULL DEFAULT 1,
    "lastWirePurchaseTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "wirePurchaseCount" INTEGER NOT NULL DEFAULT 0,
    "paperclipPrice" REAL NOT NULL DEFAULT 0.25,
    "marketDemand" REAL NOT NULL DEFAULT 10,
    "paperclipsSold" REAL NOT NULL DEFAULT 0,
    "totalSales" REAL NOT NULL DEFAULT 0,
    "basePaperclipPrice" REAL NOT NULL DEFAULT 0.25,
    "elasticity" REAL NOT NULL DEFAULT 3,
    "marketTrend" REAL NOT NULL DEFAULT 0,
    "seasonalMultiplier" REAL NOT NULL DEFAULT 1,
    "volatility" REAL NOT NULL DEFAULT 0.15,
    "maxDemand" REAL NOT NULL DEFAULT 50,
    "minDemand" REAL NOT NULL DEFAULT 1,
    "marketDemandLevel" INTEGER NOT NULL DEFAULT 1,
    "marketDemandUpgradeCost" REAL NOT NULL DEFAULT 200,
    "marketingLevel" INTEGER NOT NULL DEFAULT 0,
    "marketingCost" REAL NOT NULL DEFAULT 200,
    "demandMultiplier" REAL NOT NULL DEFAULT 1.0,
    "researchPoints" REAL NOT NULL DEFAULT 0,
    "researchPointsPerSecond" REAL NOT NULL DEFAULT 0.5,
    "unlockedResearch" TEXT NOT NULL DEFAULT '[]',
    "stockMarketUnlocked" BOOLEAN NOT NULL DEFAULT false,
    "tradingBots" INTEGER NOT NULL DEFAULT 0,
    "tradingBotCost" REAL NOT NULL DEFAULT 1000,
    "botIntelligence" INTEGER NOT NULL DEFAULT 1,
    "botIntelligenceCost" REAL NOT NULL DEFAULT 1500,
    "botTradingBudget" REAL NOT NULL DEFAULT 0,
    "botLastTradeTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "botTradingProfit" REAL NOT NULL DEFAULT 0,
    "botTradingLosses" REAL NOT NULL DEFAULT 0,
    "stockMarketReturns" REAL NOT NULL DEFAULT 0,
    "stockMarketInvestment" REAL NOT NULL DEFAULT 0,
    "stockMarketLastUpdate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "stockPortfolio" TEXT NOT NULL DEFAULT '[]',
    "stockPriceHistory" TEXT NOT NULL DEFAULT '{}',
    "portfolioValue" REAL NOT NULL DEFAULT 0,
    "cpuLevel" INTEGER NOT NULL DEFAULT 1,
    "cpuCost" REAL NOT NULL DEFAULT 100,
    "memory" REAL NOT NULL DEFAULT 1,
    "memoryMax" REAL NOT NULL DEFAULT 1,
    "memoryCost" REAL NOT NULL DEFAULT 100,
    "memoryRegenRate" REAL NOT NULL DEFAULT 1,
    "trust" REAL NOT NULL DEFAULT 0,
    "trustLevel" INTEGER NOT NULL DEFAULT 0,
    "nextTrustAt" REAL NOT NULL DEFAULT 100000,
    "ops" REAL NOT NULL DEFAULT 10,
    "opsMax" REAL NOT NULL DEFAULT 10,
    "creativity" REAL NOT NULL DEFAULT 0,
    "creativityUnlocked" BOOLEAN NOT NULL DEFAULT false,
    "unlockedOpsUpgrades" TEXT NOT NULL DEFAULT '[]',
    "unlockedCreativityUpgrades" TEXT NOT NULL DEFAULT '[]',
    "metricsUnlocked" BOOLEAN NOT NULL DEFAULT false,
    "lastSaved" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastPriceUpdate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "GameState_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "GameState_userId_key" ON "GameState"("userId");
