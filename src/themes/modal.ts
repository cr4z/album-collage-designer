import { createMuiTheme } from "@material-ui/core";

export const ModalTheme = createMuiTheme({
  palette: {
    type: "light",
  },
  props: {
    MuiButton: {
      variant: "contained",
      disableElevation: true,
      size: "large",
    },
  },
});
