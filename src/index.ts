// Include files here to pack using Webpack.

import { ActionButton } from "./ActionButton";
import { FormSection } from "./FormSection";
import { FormQuestion } from "./FormQuestion";
import { OutlinedTextField } from "./OutlinedTextField";


declare global {
  interface HTMLElementTagMap {
    "action-button": ActionButton,
    "form-section": FormSection,
    "form-question": FormQuestion,
    "outlined-text-field": OutlinedTextField
  }
}
