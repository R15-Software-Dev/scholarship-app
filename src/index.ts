// Include files here to pack using Webpack.

import { ActionButton } from "./ActionButton";


declare global {
  interface HTMLElementTagMap {
    "action-button": ActionButton;
  }
}
