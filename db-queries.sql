-- START 21-12-2024
CREATE TABLE
	"user" (
		"id" VARCHAR PRIMARY KEY NOT NULL,
		"profilePhotoId" VARCHAR NULL,
		"username" VARCHAR NOT NULL,
		"firstName" VARCHAR NOT NULL,
		"lastName" VARCHAR NULL,
		"email" VARCHAR NOT NULL,
		"password" VARCHAR NOT NULL,
		"role" VARCHAR NOT NULL,
		"dob" DATE NULL,
		"country" VARCHAR NULL,
		"age" SMALLINT NULL,
		"gender" VARCHAR NULL,
		"mobileNumber" VARCHAR NULL,
		"token" VARCHAR NULL,
		"isEmailVerified" BOOLEAN DEFAULT FALSE,
		"verificationToken" VARCHAR NULL,
		"stepComplete" SMALLINT DEFAULT 0,
		"highestQualification" VARCHAR NULL,
		"stream" VARCHAR NULL,
		"aboutMe" VARCHAR NULL,
		"isDeleted" BOOLEAN DEFAULT FALSE,
		"createdAt" BIGINT NULL,
		"createdBy" VARCHAR NULL,
		"updatedAt" BIGINT NULL,
		"updatedBy" VARCHAR NULL
	)
