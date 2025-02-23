
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
  readingScoreSAT: number;
  mathScoreSAT: number;
  highScoreACT?: number;
  attendBAS: string;
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
  studentCareer: string;
  universityAcceptance: string;
  tuitionCost: string;
  roomBoard: string;
  travelCosts?: string;
  miscCosts?: string;

}

export type InstitutionalResources = {
  grantsAwarded?: string;
  totalSelfHelp?: string;
  loansValue?: string;
}