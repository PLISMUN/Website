-- CreateTable
CREATE TABLE "users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "isStaff" BOOLEAN NOT NULL DEFAULT false,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "phone" TEXT,
    "birthdate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nationality" TEXT NOT NULL,
    "dietary" TEXT,
    "position" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "otherInfo" TEXT,
    "userLink" TEXT
);

-- CreateTable
CREATE TABLE "Session" (
    "jti" TEXT NOT NULL PRIMARY KEY,
    "iat" INTEGER NOT NULL,
    "exp" INTEGER NOT NULL,
    "aud" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "AppliedUser" (
    "delegateId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "delegationId" INTEGER,
    "choice1committee" INTEGER NOT NULL,
    "choice1country" TEXT NOT NULL,
    "choice2committee" INTEGER NOT NULL,
    "choice2country" TEXT NOT NULL,
    "choice3committee" INTEGER NOT NULL,
    "choice3country" TEXT NOT NULL,
    "experience" TEXT NOT NULL,
    "motivation" TEXT NOT NULL,
    "school" TEXT,
    "finalCommittee" INTEGER,
    "finalCountry" TEXT,
    "paymentStatus" TEXT NOT NULL,
    "shirtSize" TEXT,
    "phone" TEXT,
    "diet" TEXT,
    "denied" BOOLEAN NOT NULL DEFAULT false,
    "userSource" TEXT,
    "notes" TEXT
);

-- CreateTable
CREATE TABLE "ChairApplication" (
    "chairId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "delegationId" INTEGER,
    "choice1committee" INTEGER NOT NULL,
    "choice2committee" INTEGER NOT NULL,
    "choice3committee" INTEGER NOT NULL,
    "experience" TEXT NOT NULL,
    "motivation" TEXT NOT NULL,
    "school" TEXT,
    "finalCommittee" INTEGER,
    "paymentStatus" TEXT NOT NULL,
    "shirtSize" TEXT,
    "phone" TEXT NOT NULL,
    "diet" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Delegation" (
    "delegationId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "delegationLeaderId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "estimatedDelegates" INTEGER NOT NULL,
    "delegates" INTEGER,
    "shirtSize" TEXT,
    "phone" TEXT NOT NULL,
    "diet" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Committee" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "displayname" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "hasChairs" BOOLEAN NOT NULL DEFAULT false,
    "topic1" TEXT,
    "topic2" TEXT,
    "para1" TEXT,
    "para2" TEXT,
    "dataFolder" TEXT,
    "presentedBy" TEXT
);

-- CreateTable
CREATE TABLE "CommitteeCountries" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "committeeId" INTEGER NOT NULL,
    "country" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "userId" INTEGER
);

-- CreateTable
CREATE TABLE "StaffMember" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "image" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "AppliedUser_userId_key" ON "AppliedUser"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ChairApplication_userId_key" ON "ChairApplication"("userId");

