import { createMuiTheme } from "@material-ui/core";
import { indigo, deepPurple } from "@material-ui/core/colors";

export const GlobalTheme = createMuiTheme({
  props: {
    // Name of the component ⚛️
    MuiButton: {
      disableElevation: true,
      size: "small",
      variant: "contained",
    },
    MuiTextField: {
      variant: "outlined",
      size: "small",
    },
  },
  palette: {
    primary: deepPurple,
    secondary: indigo,
    type: "dark",
  },
});
