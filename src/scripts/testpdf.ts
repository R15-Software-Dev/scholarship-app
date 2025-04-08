import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "./pdf_vfs";
import { downloadZip } from "client-zip";
import {Content, TDocumentDefinitions} from "pdfmake/interfaces";
(<any>pdfMake).addVirtualFileSystem(pdfFonts);

const fonts = {
  Arial: {
    normal: `ARIAL.TTF`,
    bold: `ARIALBD.TTF`,
    italic: `ARIALI.TTF`,
    bolditalic: `ARIALBI.TTF`,
  }
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
async function fetchStudentData(studentId: string): Promise<any> {
  try {
    const response = await fetch(`/admin/get/student/${studentId}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error("Error fetching student data:", error);
    throw error;
  }
}

// Main function to generate PDF with student data
async function generateStudentPDF(studentId: string) {
  try {
    // Fetch student data
    const studentData = await fetchStudentData(studentId);

    // Get image
    getImage("/images/R15_logo.png", (imageString) => {
      if (imageString == null)
        throw new Error("Couldn't read image file, aborting.");

  let definition: TDocumentDefinitions = {
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

    // Footer
    footer: function(currentPage, pageCount): Content {
      if (currentPage === 1) {
        return ""; // No footer on page 1
      }
      return {
        columns: [
          {
            text: `${studentData.studentFirstName.S} ${studentData.studentLastName.S}`,
            alignment: 'left',
            style: 'footerStyle'
          },
          {
            text: `Page ${currentPage - 1} of ${pageCount - 1}`, // Adjusted numbering to start from 1 for page 2
            alignment: 'right',
            style: 'footerStyle'
          }
        ],
        margin: [40, 0, 40, 0] // [left, top, right, bottom]
      };
    },

    styles: {
      headerOne: {
        fontSize: 25
      },
      headerTwo: {
        fontSize: 19
      },
      headerThree: {
        fontSize: 15
      },

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
      generator.open();
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("generate-pdf-btn") as HTMLButtonElement;
  button.addEventListener("click", async () => {
    try {
      // Disable button while processing
      button.disabled = true;

      // Generate all PDF blobs for hardcoded student IDs
      const pdfBlobs = await generateAllStudentPDFBlobs();

      // Log success or handle blobs as needed
      console.log("Successfully generated PDF blobs:", pdfBlobs.length);

      // Optional: Alert user of success
      alert(`Successfully generated ${pdfBlobs.length} PDF blobs`);

    } catch (error) {
      console.error("Error generating PDF blobs:", error);
      alert("An error occurred while generating PDFs");
    } finally {
      // Re-enable button
      button.disabled = false;
    }
  });
});

// Blob

// Hardcoded student IDs
const studentIds = [
  "google_113247439743075864879",
  "google_104614194630890037781",
  "google_108183436557107611778",
  "google_100858426950294094725"
];

/**
 * Generates PDFs for all hardcoded students and returns them as blobs
 * @returns Promise resolving to an array of objects containing studentId and blob
 */
async function generateAllStudentPDFBlobs(): Promise<{studentId: string, blob: Blob, studentData: any}[]> {
  try {
    // Array to store all blob promises
    const pdfPromises = studentIds.map(async (studentId) => {
      // Fetch student data
      const studentData = await fetchStudentData(studentId);

      // Return a promise that resolves with the blob
      return new Promise<{studentId: string, blob: Blob}>((resolve, reject) => {
        // Get image
        getImage("/images/R15_logo.png", (imageString) => {
          try {
            if (!imageString) {
              throw new Error(`Couldn't read image file for student ${studentId}`);
            }
            // PDF definition (using the same definition from your original code)
            let definition: TDocumentDefinitions = {
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
            generator.getBlob((blob: Blob) => {
              resolve({
                studentId: studentId,
                blob: blob,
                studentData: studentData // Include studentData in the resolved object
              });
            });
          } catch (error) {
            reject(new Error(`Error generating PDF for ${studentId}: ${error}`));
          }
        });
      });
    });

    return await Promise.all(pdfPromises);
  } catch (error) {
    console.error("Error generating student PDF blobs:", error);
    throw error;
  }
}

// Testing
// async function testBlobGeneration() {
//   try {
//     const pdfBlobs = await generateAllStudentPDFBlobs();
//
//     // Log results to verify
//     pdfBlobs.forEach((pdf, index) => {
//       console.log(`PDF ${index + 1}:`);
//       console.log(`Student ID: ${pdf.studentId}`);
//       console.log(`Blob size: ${pdf.blob.size} bytes`);
//       console.log(`Blob type: ${pdf.blob.type}`);
//     });
//
//     return pdfBlobs;
//
//   } catch (error) {
//     console.error("Test failed:", error);
//   }
// }
//
// // Call the test function
// testBlobGeneration();

/**
 * Converts blobs to files, puts each in its own folder, and zips them
 * @param pdfBlobs Array of objects containing studentId, blob, and studentData
 * @returns Promise resolving to a zipped Blob
 */
async function zipStudentPDFs(pdfBlobs: {studentId: string, blob: Blob, studentData: any}[]): Promise<Blob> {
  const files = pdfBlobs.map(({ blob, studentData }) => {
    const firstName = capitalizeAndTrim(studentData.studentFirstName?.S )|| "Unknown";
    const lastName = capitalizeAndTrim(studentData.studentLastName?.S) || "Student";
    const folderName = `${lastName}${firstName}`;
    const fileName = `${lastName}${firstName}ScholarshipApplication.pdf`;

    return {
      name: `${folderName}/${fileName}`,
      input: new File([blob], fileName, {
        type: "application/pdf",
        lastModified: Date.now()
      })
    };
  });

  const zipBlob = await downloadZip(files).blob();
  return zipBlob;
}

// Event listener, HTML button for testing all the hardcoded values
// Button generates blobs, zips the PDFs and downloads the zip folder
document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("generate-pdf-btn") as HTMLButtonElement;
  button.addEventListener("click", async () => {
    try {
      button.disabled = true;

      // Generate PDF blobs
      const pdfBlobs = await generateAllStudentPDFBlobs();

      // Convert to files and zip
      const zipBlob = await zipStudentPDFs(pdfBlobs);

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
});