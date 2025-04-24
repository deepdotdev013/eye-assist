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
		"preferredLanguage" VARCHAR NULL,
		"aboutMe" VARCHAR NULL,
		"isDeleted" BOOLEAN DEFAULT FALSE,
		"createdAt" BIGINT NULL,
		"createdBy" VARCHAR NULL,
		"updatedAt" BIGINT NULL,
		"updatedBy" VARCHAR NULL
	);

-- END 21-12-2024
-- START 20-04-2025
CREATE TABLE
	"highest_qualification_stream" (
		"id" VARCHAR PRIMARY KEY NOT NULL,
		"qualification" VARCHAR NULL,
		"value" SMALLINT NULL,
		"stream" VARCHAR NULL,
		"parentQualificationId" VARCHAR NULL,
		"other" VARCHAR NULL,
		"eligibleForStudent" BOOLEAN DEFAULT FALSE,
		"isDeleted" BOOLEAN DEFAULT FALSE,
		"createdAt" BIGINT NULL,
		"createdBy" VARCHAR NULL,
		"updatedAt" BIGINT NULL,
		"updatedBy" VARCHAR NULL
	);

ALTER TABLE "highest_qualification_stream" ADD CONSTRAINT "highest_qualification_stream_id_fk" FOREIGN KEY ("parentQualificationId") REFERENCES "highest_qualification_stream" ("id") ON DELETE CASCADE;