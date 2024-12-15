
/**
 * All the "header" information about a scholarship.
 */
export type ScholarshipInfo = {

}

/**
 * All the information about the scholarship.
 * Includes info from all the other requests.
 */
export type Scholarship = {

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
