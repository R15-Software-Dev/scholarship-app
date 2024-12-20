
/**
 * All the "header" information about a scholarship.
 */
export type ScholarshipInfo = {
  scholarshipTitle: string;
  scholarshipSponsor: string;
  scholarshipNumAwards: number;
  scholarshipAwardsTotal: number;
  scholarshipAmountPerAward: number;
}

/**
 * Any eligibility information about a scholarship.
 */
export type ScholarshipEligibility = {
  studentResidence: string;
  scholarshipNonPHS: boolean;
  studyRequirement: boolean;
  financialRequirement: boolean;
  eligibilityOther?: string;
}

/**
 * Contact information for the scholarship provider.
 * This is scholarship specific, and not necessarily the user's contact info.
 */
export type ScholarshipContactInfo = {
  contactName: string;
  homePhone?: string;
  businessPhone: string;
  cellPhone?: string;
  contactEmail: string;
  sponsorAddress: string;
  sponsorCity: string;
  sponsorZipCode: string;
  sponsorState: string;
  additionalInfo?: string;
}

/**
 * Requirements for the scholarship application.
 */
export type ScholarshipRequirements = {
  studentAidReport: boolean;
  studentInterviews: boolean;
  recipientSelection: string;
  transcriptRequirements: boolean;
  awardTo: boolean;
  scholarshipReApplication: boolean;
  essayRequirement: boolean;
  essaySelection: string[];
  awardNightRemarks: string;
}

/**
 * All scholarship information, in one object.
 */
export type Scholarship =
  ScholarshipInfo & ScholarshipEligibility
  & ScholarshipContactInfo & ScholarshipRequirements;