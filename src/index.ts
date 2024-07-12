// Include files here to pack using Webpack.

import { ActionButton } from "./ActionButton";
import { OutlinedTextField } from "./OutlinedTextField";
import { FormSection, FormQuestion } from "./Forms";
import { TabBar, Tab } from "./Tabs";

function init(): void {
  const btn = new ActionButton();
  const section = new FormSection();
  const question = new FormQuestion();
  const text = new OutlinedTextField();
  const tab = new Tab();
  const tabBar = new TabBar();
}

declare global {
  interface HTMLElementTagMap {
    "action-button": ActionButton,
    "form-section": FormSection,
    "form-question": FormQuestion,
    "outlined-text-field": OutlinedTextField,
    "custom-tab": Tab,
    "tab-bar": TabBar
  }
}
