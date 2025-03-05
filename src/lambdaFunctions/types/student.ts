
/**
 *  All personal information about student
 */
export type StudentPersonalInfo = {
  studentFirstName: string;
  studentLastName: string;
  studentIDNumber: number;
  studentBirthDate: string;
  studentGender: string;
  streetAddress: string;
  studentTown: string;
  studentPhoneNumber: string;
  studentEmail: string;
  unweightedGPA: string;
  weightedGPA: string;
  readingScoreSAT?: number;
  mathScoreSAT?: number;
  highScoreACT?: number;
  attendBAS: string;
}

/**
 *  Academic honors information
 */
export type AcademicHonors = {
  listAcademicHonors?: string;
}

export type AthleticParticipation = {
  athleticParticipation: string;
}

export type CommunityInvolvement = {
  communityInvolvement: string;
}

export type WorkExperience = {
  workExperience: string;
}

export type ExtracurricularActivities = {
  extracurricularActivities: string;
}

/**
 *  Details about the students university
 */
export type UniversityDetails = {
  universityDetails: string;
  universityName: string;
  universityState: string;
  universityCity: string;
  universityZipCode: string;
  studentsMajor: string;
  studentStudyField: string;
  studentCareer?: string;
  universityAcceptance: string;
  tuitionCost?: number;
  roomBoard?: number;
}

/**
 *  Information about the students family
 */
export type FamilyInfo = {
  numChildTotal: string;
  numChildAttendCollege: string;
  guardianOneName: string;
  guardianOneRelation: string;
  guardianOneOccupation: string;
  guardianOneEmployer: string;
  guardianTwoName?: string;
  guardianTwoRelation?: string;
  guardianTwoOccupation?: string;
  guardianTwoEmployer?: string;
  familyPEAMember: string;
  armedServiceMember: string;
  familyChurchMember: string;
}

export type Student = StudentPersonalInfo & AcademicHonors
  & AthleticParticipation & CommunityInvolvement & WorkExperience
  & ExtracurricularActivities & UniversityDetails & FamilyInfo;