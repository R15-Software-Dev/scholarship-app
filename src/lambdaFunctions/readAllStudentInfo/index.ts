import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
import {AWSRequest, AWSResponse, Student} from "../types/types";

// Create a dynamo client
const client = new DynamoDBClient({ region: "us-east-1" });

export async function handler(event: AWSRequest): Promise<AWSResponse> {
  // Get all the information about a student and parse it into
  // a reasonable form.

  // Get the student email from the passed cookie
  const studentEmail = event.headers.Cookie.match(/studentEmail=([^;]*)/)[1];

  // Create a command to get all the student's information
  const command = new GetItemCommand({
    TableName: "student-applications",
    Key: {
      Email: { S: studentEmail }
    },
    AttributesToGet: [
      "studentFirstName",
      "studentLastName",
      "studentIDNumber",
      "studentBirthDate",
      "studentGender",
      "streetAddress",
      "studentTown",
      "studentPhoneNumber",
      "studentEmail",
      "unweightedGPA",
      "readingScoreSAT",
      "mathScoreSAT",
      "highScoreACT",
      "attendBAS",
      "listAcademicHonors",
      "athleticParticipation",
      "communityInvolvement",
      "workExperience",
      "extracurricularActivities",
      "universityDetails",
      "universityName",
      "universityState",
      "universityCity",
      "universityZipCode",
      "studentsMajor",
      "studentStudyField",
      "studentCareer",
      "universityAcceptance",
      "tuitionCost",
      "roomBoard",
      "travelCosts",
      "miscCosts",
      "numChildTotal",
      "numChildAttendCollege",
      "guardianOneName",
      "guardianOneRelation",
      "guardianOneOccupation",
      "guardianOneEmployer",
      "guardianTwoName",
      "guardianTwoRelation",
      "guardianTwoOccupation",
      "guardianTwoEmployer",
      "familyPEAMember",
      "armedServiceMember",
      "familyChurchMember",
      "grantsAwarded",
      "totalSelfHelp",
      "loansValue"
    ]
  });

  // Send the command and wait for an Item.
  // If there's no item, this will throw an error.
  const dbresponse = await client.send(command);
  const dbitem = dbresponse.Item;

  console.log(dbitem);

  // Construct the response
  // TODO Find a better way of getting SS values
  const response: Student = {
    studentFirstName: dbitem?.studentFirstName?.S ?? null,
    studentLastName: dbitem?.studentLastName?.S ?? null,
    studentIDNumber: checkNullOrNumber(dbitem?.studentIDNumber?.N ?? null),
    studentBirthDate: dbitem?.studentBirthDate?.S ?? null,
    //@ts-ignore
    studentGender: dbitem?.studentGender?.SS ?? null,
    streetAddress: dbitem?.streetAddress?.S ?? null,
    //@ts-ignore
    studentTown: dbitem?.studentTown?.SS ?? null,
    studentPhoneNumber: dbitem?.studentPhoneNumber?.S ?? null,
    studentEmail: dbitem?.studentEmail?.S ?? null,
    unweightedGPA: dbitem?.unweightedGPA?.S ?? null,
    readingScoreSAT: checkNullOrNumber(dbitem?.readingScoreSAT?.N ?? null),
    mathScoreSAT: checkNullOrNumber(dbitem?.mathScoreSAT?.N ?? null),
    highScoreACT: checkNullOrNumber(dbitem?.highScoreACT?.N ?? null),
    //@ts-ignore
    attendBAS: dbitem?.attendBAS?.SS ?? null,
    listAcademicHonors: dbitem?.listAcademicHonors?.S ?? null,
    athleticParticipation: dbitem?.athleticParticipation?.S ?? null,
    communityInvolvement: dbitem?.communityInvolvement?.S ?? null,
    workExperience: dbitem?.workExperience?.S ?? null,
    extracurricularActivities: dbitem?.extracurricularActivities?.S ?? null,
    universityDetails: dbitem?.universityDetails?.S ?? null,
    universityName: dbitem?.universityName?.S ?? null,
    universityState: dbitem?.universityState?.S ?? null,
    universityCity: dbitem?.universityCity?.S ?? null,
    universityZipCode: dbitem?.universityZipCode?.S ?? null,
    studentsMajor: dbitem?.studentsMajor?.S ?? null,
    studentStudyField: dbitem?.studentStudyField?.S ?? null,
    studentCareer: dbitem?.studentCareer?.S ?? null,
    //@ts-ignore
    universityAcceptance: dbitem?.universityAcceptance?.SS ?? null,
    tuitionCost: checkNullOrNumber(dbitem?.tuitionCost?.N ?? null),
    roomBoard: checkNullOrNumber(dbitem?.roomBoard?.N ?? null),
    travelCosts: checkNullOrNumber(dbitem?.travelCosts?.N ?? null),
    miscCosts: checkNullOrNumber(dbitem?.miscCosts?.N ?? null),
    numChildTotal: dbitem?.numChildTotal?.S ?? null,
    numChildAttendCollege: dbitem?.numChildAttendCollege?.S ?? null,
    guardianOneName: dbitem?.guardianOneName?.S ?? null,
    guardianOneRelation: dbitem?.guardianOneRelation?.S ?? null,
    guardianOneOccupation: dbitem?.guardianOneOccupation?.S ?? null,
    guardianOneEmployer: dbitem?.guardianOneEmployer?.S ?? null,
    guardianTwoName: dbitem?.guardianTwoName?.S ?? null,
    guardianTwoRelation: dbitem?.guardianTwoRelation?.S ?? null,
    guardianTwoOccupation: dbitem?.guardianTwoOccupation?.S ?? null,
    guardianTwoEmployer: dbitem?.guardianTwoEmployer?.S ?? null,
    //@ts-ignore
    familyPEAMember: dbitem?.familyPEAMember?.SS ?? null,
    //@ts-ignore
    armedServiceMember: dbitem?.armedServiceMember?.SS ?? null,
    //@ts-ignore
    familyChurchMember: dbitem?.familyChurchMember?.SS ?? null,
    grantsAwarded: checkNullOrNumber(dbitem?.grantsAwarded?.N ?? null),
    totalSelfHelp: checkNullOrNumber(dbitem?.totalSelfHelp?.N ?? null),
    loansValue: checkNullOrNumber(dbitem?.loansValue?.N ?? null)
  }

  // Return the information
  return {
    statusCode: 200,
    body: JSON.stringify(response)
  }
}

function checkNullOrNumber(num: string | null): number | null {
  if (Number(num ?? null) === 0)
    return null;
  else return Number(num);
}
