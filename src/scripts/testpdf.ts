import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "./pdf_vfs";
import {TDocumentDefinitions} from "pdfmake/interfaces";
(<any>pdfMake).addVirtualFileSystem(pdfFonts);

const fonts = {
  Arial: {
    normal: `ARIAL.TTF`,
    bold: `ARIALBD.TTF`,
    italic: `ARIALI.TTF`,
    bolditalic: `ARIALBI.TTF`,
  }
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

// Function to fetch student data
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
async function generateStudentPDF() {
  try {
    // Hardcoded student ID for testing
    const studentId = "google_109534508256206924555";

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
      {text: `${studentData.studentFirstName.S} ${studentData.studentLastName.S}`, alignment: "center", bold: true, style: ['headerOne']},
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
              { text: `${studentData.studentTown.S}` || "N/A" }
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
          { text: `${studentData.universityAcceptance?.S}`|| "N/A" }
        ],
        margin: [0, 0, 0, 20],
        pageBreak: "after"
      },

      // PAGE BREAK

      // Athletic Participation
      {text: "Athletic Participation", bold: true, style: ['headerTwo'], margin: [0, 20, 0, 10]},
      {
        layout: 'headerLineOnly',
        table: {
          headerRows: 1,
          widths: ['40%', '26%', '33%'],
          body: [
            ["Sport Name", "Grades", "Special Achievements"],
            ["", "", ""], // Empty row as placeholder
          ]
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
          body: [
            ["Activity", "Grades", "Hrs/Year"],
            ["", "", ""], // Empty row as placeholder
          ]
        },
        margin: [0, 0, 0, 20]
      },

      // Work Experience
      {text: "Work Experience", bold: true, style: ['headerTwo'], margin: [0, 0, 0, 10]},
      {
        layout: 'headerLineOnly',
        table: {
          headerRows: 1,
          widths: ['30%', '30%', '20%', '20%'],
          body: [
            ["Job Title", "Employer", "Approx. Dates of Employment", "Hrs/Week"],
            ["", "", "", ""], // Empty row as placeholder
          ]
        },
        margin: [0, 0, 0, 20]
      },

      // Extracurricular Activities
      {text: "Extracurricular Activities", bold: true, style: ['headerTwo'], margin: [0, 0, 0, 10]},
      {
        layout: 'headerLineOnly',
        table: {
          headerRows: 1,
          widths: ['38%', '12%', '10%', '12%', '28%'],
          body: [
            ["Activity", "Grades", "Hrs/Week", "Weeks", "Special Involvement"],
            ["", "", "", "", ""], // Empty row as placeholder
          ]
        },
        margin: [0, 0, 0, 20]
      },

    ],
    defaultStyle: {
      lineHeight: 1.15,
      font: "Arial"
    },

    // Footer
    footer: function(currentPage, pageCount) {
      if (currentPage === 1) {
        return {}; // No footer on page 1
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
      generator.open();
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
  }
}

// Run with hardcoded student ID
generateStudentPDF();