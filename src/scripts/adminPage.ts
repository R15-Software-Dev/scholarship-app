import { Buffer } from "buffer/index";
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "./pdf_vfs";
import {downloadZip} from "client-zip";
import {Content, TDocumentDefinitions} from "pdfmake/interfaces";
import {AttributeValue} from "@aws-sdk/client-dynamodb";
import {CheckListView, CheckListViewEntry} from "../customElements/CheckListView"; // This will work when it's put in.
(<any>pdfMake).addVirtualFileSystem(pdfFonts);

const fonts = {
  Arial: {
    normal: `ARIAL.TTF`,
    bold: `ARIALBD.TTF`,
    italic: `ARIALI.TTF`,
    bolditalic: `ARIALBI.TTF`,
  }
}

type StudentDataBlob = {
  blob: Blob,
  studentData: Record<string, AttributeValue>,
  isFafsa: boolean
}

// Event listener, HTML button for testing all the hardcoded values
// Button generates blobs, zips the PDFs and downloads the zip folder
document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("generate-pdf-btn") as HTMLButtonElement;
  const checklist = document.getElementById("checkListView") as CheckListView;
  const includeFafsaCheck = document.getElementById('includeFafsaCheck') as HTMLInputElement;
  button.addEventListener("click", async () => {
    try {
      console.log("beginning pdf generation");
      button.disabled = true;

      const entries: Record<string, AttributeValue>[] = [];
      checklist.entryElements.forEach((e) => {
        if (e.selected) entries.push(e.data);
      });

      console.log(`Found ${entries.length} entries`);
      console.log(`Including FAFSA information: ${includeFafsaCheck.checked}`);

      // Convert to files and zip
      const zipBlob = await zipStudentPDFs(entries, includeFafsaCheck.checked);

      // Trigger download
      const link = document.createElement("a");
      link.href = URL.createObjectURL(zipBlob);
      link.download = "student_applications.zip";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);

      console.log("Successfully generated and zipped PDFs");
      alert("PDFs have been zipped and downloaded");

    } catch (error) {
      console.error("Error processing PDFs:", error);
      alert("An error occurred while processing PDFs");
    } finally {
      button.disabled = false;
    }
  });

  // Get all the student applications and put them into the CheckListView.
  getAllStudentApplications().then((applications) => {
    console.log("Adding student applications to CheckListView");
    console.log("Application data: ");
    console.log(applications);
    const checkListView = document.getElementById("checkListView") as CheckListView;
    applications.forEach((application) => {
      checkListView.addNewElement(application);
    });
  });
});

/**
* Fetches all student applications from the server.
* @returns All of the valid student applications.
*/
async function getAllStudentApplications(): Promise<Record<string, AttributeValue>[]> {
  const response = await fetch("/admin/get/student/all");
  const data = await response.json();
  return data.items;
}

/**
 * Converts first string character to uppercase and removes whitespace
 * @param str The string to capitalize and trim
 * @returns The capitalize and trimmed string
 */
function capitalizeAndTrim(str: string | undefined): string {
  if (!str) return "Unknown"; // Fallback for undefined or empty strings
  return str.trim().charAt(0).toUpperCase() + str.trim().slice(1).toLowerCase();
}

/**
* Fetches an image from a given path and calls a callback with the image data URL.
* @param path The path to the image.
* @param callback The callback function to be called with the image data URL.
*/
function getImage(path: string, callback: (arg0: string) => void) {
  fetch(path, {
    method: "GET"
  }).then(async res => await res.blob())
    .then(blob => {
      const reader = new FileReader();
      reader.onloadend = () => callback(reader.result as string);
      reader.readAsDataURL(blob);
    });
}

/**
 * Fetches student data from API
 * @param studentId The ID of the student.
 */
async function fetchStudentData(studentId: string): Promise<Record<string, AttributeValue>> {
  try {
    const response = await fetch(`/admin/get/student/${studentId}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json() as Record<string, AttributeValue>;
    return data;

  } catch (error) {
    console.error("Error fetching student data:", error);
    throw error;
  }
}

/**
 * Generates a PDF document for a student based on their data. Automatically
 * fetches the student's data and generates a PDF document.
 * @param studentId The ID of the student to generate the PDF for.
 */
async function generateStudentPDF(studentData: Record<string, AttributeValue>, includeFafsa: boolean):
  Promise<StudentDataBlob> {
  return new Promise<StudentDataBlob>(async (resolve, reject) => {
    try {
      // Get image
      getImage("/images/R15_logo.png", (imageString) => {
        if (imageString == null)
          throw new Error("Couldn't read image file, aborting.");

        const definition: TDocumentDefinitions = {
          content: [
            {text: " ", lineHeight: 4, style: ['headerThree']},
            {text: "Region 15", alignment: "center", bold: true, style: ['headerThree']},
            {text: "General Scholarship Application", alignment: "center", bold: true, lineHeight: 2, style: ['headerThree']},
            {text: `${capitalizeAndTrim(studentData.studentFirstName?.S)} ${capitalizeAndTrim(studentData.studentLastName?.S)}`, alignment: "center", bold: true, style: ['headerOne']},
            {text: `${studentData.streetAddress.S}`+ ", " + `${studentData.studentTown.SS}`, alignment: "center", style: ['headerTwo']},
            {text: `${studentData.studentEmail.S}`, alignment: "center", style: ['headerThree']},
            {text: `${studentData.studentPhoneNumber.S}`, alignment: "center", style: ['headerThree']},
            {text: " ", lineHeight: 4, style: ['headerThree']},
            {image: imageString, height: 300, width: 300, alignment: "center", pageBreak: "after" },


            {text: "Student Information", bold: true, style:['headerTwo'], margin:[0, 20, 0, 10]},

            {
              text: [
                { text: "Student Name: ", bold: true },
                { text:`${studentData.studentFirstName.S || ""} ${studentData.studentLastName.S || ""}` }
              ],
              margin: [0, 0, 0, 10]
            },
            {
              columns: [
                {
                  text: [
                    { text: "Student ID #: ", bold: true },
                    { text: `${studentData.studentIDNumber.N}` || ""}
                  ]
                },
                {
                  text: [
                    { text: "DOB: ", bold: true },
                    { text: `${studentData.studentBirthDate.S}` || "" }
                  ]
                }
              ],
              margin: [0, 0, 0, 10]
            },
            {
              columns: [
                {
                  text: [
                    { text: "Street: ", bold: true },
                    { text: `${studentData.streetAddress.S}` || "N/A" }
                  ]
                },
                {
                  text: [
                    { text: "Email Address: ", bold: true },
                    { text: `${studentData.studentEmail.S}` || "N/A" }
                  ]
                }
              ],
              margin: [0, 0, 0, 10]
            },
            {
              columns: [
                {
                  text: [
                    { text: "Town: ", bold: true },
                    { text: `${studentData.studentTown.SS}` || "N/A" }
                  ]
                },
                {
                  text: [
                    { text: "Phone Number: ", bold: true },
                    { text: `${studentData.studentPhoneNumber.S}` || "N/A" }
                  ]
                }
              ],
              margin: [0, 0, 0, 10]
            },

            {
              text: [
                { text: "High School: ", bold: true },
                { text: "Pomperaug High School" }
              ],
              margin: [0, 20, 0, 20]
            },

            {text: "Guardians", bold: true, style:['headerThree'], margin:[0, 10, 0, 10]},
            {
              text: [
                { text: "Parent/Guardian 1 Name: ", bold: true },
                { text: `${studentData.guardianOneName?.S}` || "N/A"}
              ],
              margin: [0, 0, 0, 10],
            },
            {
              text: [
                { text: "Relationship: ", bold: true },
                { text: `${studentData.guardianOneRelation?.S}` || "N/A" }
              ],
              margin: [0, 0, 0, 20],
            },

            {
              text: [
                { text: "Parent/Guardian 2 Name: ", bold: true },
                { text: `${studentData.guardianTwoName?.S}` || "N/A"}
              ],
              margin: [0, 0, 0, 10],
            },
            {
              text: [
                { text: "Relationship: ", bold: true },
                { text: `${studentData.guardianTwoRelation?.S}` || "N/A" }
              ],
              margin: [0, 0, 0, 10],
              pageBreak: "after"
            },

            // PAGE BREAK

            // Academic Information
            {text: "Academic Information", bold: true, style: ['headerTwo'], margin: [0, 20, 0, 10]},
            {
              text: [
                { text: "Unweighted GPA: ", bold: true },
                { text: `${studentData.unweightedGPA?.S}` || "N/A"}
              ],
              margin: [0, 0, 0, 10],
            },
            {
              text: [
                { text: "SAT Reading Score: ", bold: true },
                { text: `${studentData.readingScoreSAT?.N}` || "N/A" }
              ],
              margin: [0, 0, 0, 10],
            },
            {
              text: [
                { text: "SAT Math Score: ", bold: true },
                { text: `${studentData.mathScoreSAT?.N}` || "N/A" }
              ],
              margin: [0, 0, 0, 10],
            },
            {
              text: [
                { text: "ACT Score: ", bold: true },
                { text: `${studentData.highScoreACT?.N}`|| "N/A" }
              ],
              margin: [0, 0, 0, 20],
            },

            // Academic Honors
            {text: "Academic Honors", bold: true, style: ['headerTwo'], margin: [0, 10, 0, 10]},
            {text: `${studentData.listAcademicHonors?.S || "N/A"}`, margin: [0, 0, 0, 20]},

            // Post-Secondary Education
            {text: "Post-Secondary Education", bold: true, style: ['headerTwo'], margin: [0, 10, 0, 10]},
            {
              text: [
                { text: "College/University Name: ", bold: true },
                { text: `${studentData.universityName?.S}` || "N/A"}
              ],
              margin: [0, 0, 0, 10],
            },
            {
              text: [
                { text: "Intended Major: ", bold: true },
                { text: `${studentData.studentsMajor?.S}` || "N/A"}
              ],
              margin: [0, 0, 0, 10],
            },
            {
              text: [
                { text: "Intended Field of Study: ", bold: true },
                { text: `${studentData.studentStudyField?.S}` || "N/A" }
              ],
              margin: [0, 0, 0, 10],
            },
            {
              text: [
                { text: "Intended Career: ", bold: true },
                { text: `${studentData.studentCareer?.S}`|| "N/A" }
              ],
              margin: [0, 0, 0, 10],
            },
            {
              text: [
                { text: "Acceptance: ", bold: true },
                { text: `${studentData.universityAcceptance?.SS}`|| "N/A" }
              ],
              margin: [0, 0, 0, 20],
              pageBreak: "after"
            },

            // PAGE BREAK

            // Athletic Participation["Sport Name", "Grades", "Special Achievements"],
            {text: "Athletic Participation", bold: true, style: ['headerTwo'], margin: [0, 20, 0, 10]},
            {
              layout: 'headerLineOnly',
              table: {
                headerRows: 1,
                widths: ['40%', '26%', '33%'],
                body: (() => {
                  // Start with the header row
                  const tableBody = [["Sports Name", "Grades", "Special Achievements"]];

                  // Check if athleticParticipation exists and parse it
                  let sportsData = [];
                  try {
                    if (studentData.athleticParticipation?.S) {
                      sportsData = JSON.parse(studentData.athleticParticipation.S);
                    }
                  } catch (error) {
                    console.error("Error parsing community involvement data:", error);
                  }

                  // If no data or parsing failed, return table with empty row
                  if (!Array.isArray(sportsData) || sportsData.length === 0) {
                    tableBody.push(["No sports listed", "", ""]);
                    return tableBody;
                  }

                  // Loop through each activity object and add to table
                  sportsData.forEach(sport => {
                    let grades: string[];
                    try {
                      // Parse the grades string (stored as JSON array)
                      grades = JSON.parse(sport.sportParticipated)
                        .map((grade: string) => grade.replace(/"/g, '')) // Remove quotes
                        .join(", "); // Join with comma and space
                    } catch (error) {
                      console.error("Error parsing grades:", error);
                      grades = sport.sportParticipated || ""; // Fallback to raw string
                    }

                    tableBody.push([
                      sport.sport || "",
                      grades,
                      sport.sportAchievements || ""
                    ]);
                  });

                  return tableBody;
                })()
              },
              margin: [0, 0, 0, 20]
            },

            // Community Involvement
            {text: "Community Involvement", bold: true, style: ['headerTwo'], margin: [0, 0, 0, 10]},
            {
              layout: 'headerLineOnly',
              table: {
                headerRows: 1,
                widths: ['65%', '20%', '15%'],
                body: (() => {
                  // Start with the header row
                  const tableBody = [["Activity", "Grades", "Hrs/Year"]];

                  // Check if communityInvolvement exists and parse it
                  let involvementData = [];
                  try {
                    if (studentData.communityInvolvement?.S) {
                      involvementData = JSON.parse(studentData.communityInvolvement.S);
                    }
                  } catch (error) {
                    console.error("Error parsing community involvement data:", error);
                  }

                  // If no data or parsing failed, return table with empty row
                  if (!Array.isArray(involvementData) || involvementData.length === 0) {
                    tableBody.push(["No activities listed", "", ""]);
                    return tableBody;
                  }

                  // Loop through each activity object and add to table
                  involvementData.forEach(activity => {
                    let grades;
                    try {
                      // Parse the grades string (stored as JSON array)
                      grades = JSON.parse(activity.activityParticipated)
                        .map((grade: string) => grade.replace(/"/g, '')) // Remove quotes
                        .join(", "); // Join with comma and space
                    } catch (error) {
                      console.error("Error parsing grades:", error);
                      grades = activity.activityParticipated || ""; // Fallback to raw string
                    }

                    tableBody.push([
                      activity.activity || "",
                      grades,
                      activity.activityHours || ""
                    ]);
                  });

                  return tableBody;
                })()
              },
              margin: [0, 0, 0, 20]
            },

            // Work Experience
            {text: "Work Experience", bold: true, style: ['headerTwo'], margin: [0, 0, 0, 10]},
            {
              layout: 'headerLineOnly',
              table: {
                headerRows: 1,
                widths: ['25%', '30%', '25%', '20%'],
                body: (() => {
                  // Header row
                  const tableBody = [["Job Title", "Employer", "Approx. Dates of Employment", "Hrs/Week"]];

                  // Check if workExperience exists
                  let workData = []; // Empty array to parse data into
                  try {
                    if (studentData.workExperience?.S) {
                      workData = JSON.parse(studentData.workExperience.S);
                    }
                  } catch (error) {
                    console.error("Error parsing work experience data:", error);
                  }

                  // If there's no data or parsing failed, return empty row
                  if(!Array.isArray(workData) || workData.length === 0) {
                    tableBody.push(["No work experience listed", "", "", ""]);
                  }

                  // Loop through each object and add to table
                  workData.forEach((job: any) => {
                    const employmentDates = `${job.jobStartDate || ""} - ${job.jobEndDate || ""}`;

                    tableBody.push([
                      job.jobTitle || "",
                      job.studentEmployer || "",
                      employmentDates,
                      job.weeklyWorkHours || ""
                    ]);
                  });
                  return tableBody;
                })()
              },
              margin: [0, 0, 0, 20]
            },



            // Extracurricular Activities
            {text: "Extracurricular Activities", bold: true, style: ['headerTwo'], margin: [0, 0, 0, 10]},
            {
              layout: 'headerLineOnly',
              table: {
                headerRows: 1,
                widths: ['35%', '17%', '10%', '10%', '28%'],
                body:(() => {
                  // Header row
                  const tableBody = [["Activity", "Grades", "Hrs/Week", "Weeks", "Special Involvement"]];

                  // Check if extracurricularActivities exists

                  let extracurricularData = []; // Empty array to parse data into
                  try {
                    if(studentData.extracurricularActivities?.S) {
                      extracurricularData = JSON.parse(studentData.extracurricularActivities.S);
                    }
                  } catch (error) {
                    console.error("Error parsing extracurricular data:", error);
                  }

                  // If there's no data or parsing failed, return empty row
                  if (!Array.isArray(extracurricularData) || extracurricularData.length === 0) {
                    tableBody.push(["No extracurricular activities", "", "", "", ""])
                    return tableBody;
                  }

                  extracurricularData.forEach(activity => {
                    let grades;
                    try{
                      grades = JSON.parse(activity.extraActivityParticipated)
                        .map((grade: string) => grade.replace(/"/g, ''))
                        .join(", ");
                    } catch (error) {
                      console.error("Error parsing grades: ", error);
                      grades = activity.extraActivityParticipated || "";
                    }

                    tableBody.push([
                      activity.extraActivity || "",
                      grades,
                      activity.extraActivityHours || "",
                      activity.extraWeeksParticipated || "",
                      activity.extraSpecialInvolvement || ""
                    ]);
                  });
                  return tableBody;
                })()
              },
              margin: [0, 0, 0, 40]
            },

          ],
          defaultStyle: {
            lineHeight: 1.15,
            font: "Arial"
          },
          footer: function(currentPage, pageCount): Content {
            if (currentPage === 1) {
              return "";
            }
            return {
              columns: [
                {
                  text: `${studentData.studentFirstName.S} ${studentData.studentLastName.S}`,
                  alignment: 'left',
                  style: 'footerStyle'
                },
                {
                  text: `Page ${currentPage - 1} of ${pageCount - 1}`,
                  alignment: 'right',
                  style: 'footerStyle'
                }
              ],
              margin: [40, 0, 40, 0]
            };
          },
          styles: {
            headerOne: { fontSize: 25 },
            headerTwo: { fontSize: 19 },
            headerThree: { fontSize: 15 },
          }
        };

        const generator = pdfMake.createPdf(definition, null, fonts);

        // Create filename
        const firstName = studentData.studentFirstName?.S || "Unknown";
        const lastName = studentData.studentLastName?.S || "Student";
        const fileName = `${firstName}${lastName}ScholarshipApplication.pdf`;

        // Download the PDF
        // generator.download(fileName);
        // Open PDF in new tab
        generator.getBlob((blob: Blob) => {
          // Do something with the blob
          resolve({ blob, studentData, isFafsa: false});
        });
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  });
}

/**
 * Get the specified student's FAFSA document from our S3 bucket.
 * @param studentData The student to get the data for.
 */
async function getStudentFafsa(studentData: Record<string, AttributeValue>): Promise<StudentDataBlob> {
  return new Promise<StudentDataBlob>(async (resolve, reject) => {
    if (studentData.studentFafsaKey.S) {
      console.log(`Student ${studentData.studentFirstName.S} ${studentData.studentLastName.S} (${studentData.Email.S}) has FAFSA key ${studentData.studentFafsaKey.S}`);
      await fetch(`/admin/get/fafsa/${studentData.Email.S}`)
        .then(async res => {
          if (!res.ok) {
            console.error(`Error ${res.status} while getting student data for student ID ${studentData.Email.S}`);
            resolve({blob: null, studentData, isFafsa: true});
          } else {
            console.log("valid request, continuing");
            let base64string = await res.text();
            base64string = base64string.trim().replace(/\s/g, "");

            // The data body will be a file in base64 format.
            // We need to convert this into a blob, then return it.
            // Supposedly this is very easy, but this is javascript so nothing ever is.
            console.info(base64string);
            const byteCharacters = atob(base64string);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);

            const result = {blob: new Blob([byteArray], {type: "application/pdf"}), studentData, isFafsa: true};
            console.log(`PDF return for ${studentData.studentFirstName.S}:`);
            console.log(result);
            resolve(result);
          }
        })
        .catch(e => {
          console.error("Exception in FAFSA fetch: " + e);
        })
    } else {
      console.warn(`Couldn't find FAFSA key.`);
      resolve({blob: null, studentData, isFafsa: true});
    }
  });
}

/**
 * Converts blobs to files, puts each in its own folder, and zips them
 * @param studentData The array of student data to process.
 * @param includeFafsa Indicates whether to get and package FAFSA information.
 * @returns Promise resolving to a zipped Blob.
 */
async function zipStudentPDFs(studentData: Record<string, AttributeValue>[], includeFafsa: boolean): Promise<Blob> {
  try {
    const promises: Promise<StudentDataBlob>[] = [];
    studentData.map((student) => {
      promises.push(generateStudentPDF(student, includeFafsa));
      if (includeFafsa)
        promises.push(getStudentFafsa(student));
    });

    const pdfBlobs = await Promise.all(promises);

    console.log(`total blobs:`);
    console.log(pdfBlobs);

    const files = pdfBlobs
      .map((entry) => {
        console.log(entry);
        const firstName = capitalizeAndTrim(entry.studentData?.studentFirstName?.S) || "Student";
        const lastName = capitalizeAndTrim(entry.studentData?.studentLastName?.S) || "Unknown";
        const folderName = `${lastName}${firstName}`;
        let fileName = "";
        if (entry.isFafsa) {
          fileName = `${lastName}${firstName}_FAFSASubmission.pdf`;
        } else {
          fileName = `${lastName}${firstName}ScholarshipApplication.pdf`;
        }

        console.log(`Setting up file with path ${folderName}/${fileName} for zipping`);

        if (!entry.blob) return;

        return {
          name: `${folderName}/${fileName}`,
          input: new File([entry.blob], fileName, {
            type: "application/pdf",
            lastModified: Date.now()
          })
        };
      });

    return await downloadZip(files).blob();
  } catch (e) {
    console.error("Error in zipStudentPDFs: " + e);
  }
}
