
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