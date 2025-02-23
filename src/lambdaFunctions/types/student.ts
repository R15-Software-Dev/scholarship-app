
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