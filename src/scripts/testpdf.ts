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

getImage("/images/R15_logo.png", (imageString) => {

  // console.log(imageString);

  if (imageString == null)
    throw new Error("Couldn't read image file, aborting.");

  let definition: TDocumentDefinitions = {
    content: [
      {text: " ", lineHeight: 4, style: ['headerThree']},
      {text: "Region 15", alignment: "center", bold: true, style: ['headerThree']},
      {text: "General Scholarship Application", alignment: "center", bold: true, lineHeight: 2, style: ['headerThree']},
      {text: "Kaitlyn Alegria", alignment: "center", bold: true, style: ['headerOne']},
      {text: "234 Judd Rd, Southbury CT", alignment: "center", style: ['headerTwo']},
      {text: "kalegria@region15.org", alignment: "center", style: ['headerThree']},
      {text: "(203) 262 3200", alignment: "center", style: ['headerThree']},
      {text: " ", lineHeight: 4, style: ['headerThree']},
      {image: imageString, height: 300, width: 300, alignment: "center", pageBreak: "after" },
      {
        layout: 'headerLineOnly',
        table: {
          headerRows: 1,
          widths: ['*', '*', '*'],
          body: [
            ["Stuff", "and", "things"],
            ["Test", "value", "one"],
            ["Test2", "value2", "two"],
          ]
        }
      }
    ],

    defaultStyle: {
      lineHeight: 1.15,
      font: "Arial"
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
      }
    }
  };

  const generator = pdfMake.createPdf(definition, null, fonts);
  generator.open();
});