import React, { useEffect } from "react";
import Snackbar from "@material-ui/core/Snackbar";
import Slide from "@material-ui/core/Slide";
import MuiAlert from '@material-ui/lab/Alert';
function SlideTransition(props) {
  return <Slide {...props} direction="up" />;
}
function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}
  
export default function TransitionsSnackbar(props) {
  return (
    <div>
      <Snackbar open={props.open} TransitionComponent={SlideTransition} message={props.msg}>
      </Snackbar>
    </div>
  );
}
