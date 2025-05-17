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
		"highestQualificationId" VARCHAR NULL,
		"streamId" VARCHAR NULL,
		"otherQualification" VARCHAR NULL,
		"otherStream" VARCHAR NULL,
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
		"eligibleForStudent" BOOLEAN DEFAULT FALSE,
		"isDeleted" BOOLEAN DEFAULT FALSE,
		"createdAt" BIGINT NULL,
		"createdBy" VARCHAR NULL,
		"updatedAt" BIGINT NULL,
		"updatedBy" VARCHAR NULL
	);

ALTER TABLE "highest_qualification_stream" ADD CONSTRAINT "highest_qualification_stream_id_fk" FOREIGN KEY ("parentQualificationId") REFERENCES "highest_qualification_stream" ("id") ON DELETE CASCADE;

-- END 20-04-2025
-- START 25-04-2025
ALTER TABLE "user" ADD CONSTRAINT "highest_qualification_stream_id_fk" FOREIGN KEY ("highestQualificationId") REFERENCES "highest_qualification_stream" ("id") ON DELETE CASCADE,
ADD CONSTRAINT "stream_id_fk" FOREIGN KEY ("streamId") REFERENCES "highest_qualification_stream" ("id") ON DELETE CASCADE;

-- END 25-04-2025
-- START 17-05-2025
CREATE TABLE
	"media" (
		"id" VARCHAR PRIMARY KEY NOT NULL,
		"mediaUrl" VARCHAR NOT NULL,
		"mediaType" VARCHAR NOT NULL,
		"mimeType" VARCHAR NOT NULL,
		"fileName" VARCHAR NOT NULL,
		"fullPath" VARCHAR NOT NULL,
		"duration" NUMERIC(1000, 2) DEFAULT 0,
		"isDeleted" BOOLEAN DEFAULT FALSE,
		"createdAt" BIGINT NULL,
		"createdBy" VARCHAR NULL,
		"updatedAt" BIGINT NULL,
		"updatedBy" VARCHAR NULL
	);