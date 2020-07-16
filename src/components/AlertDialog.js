import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { withStyles } from '@material-ui/core/styles';

const styles = {
  buttonDisabled: {
    opacity: 0.7,
    pointerEvents: 'none'
  }
}

class AlertDialog extends React.Component {

  render() {

    const { classes, onCancel, onConfirm, count, open, blockButton } = this.props;

    return (
      <div>
        <Dialog
          open={open}
          onClose={onCancel}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Campaign mailing"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to send this campaign to the {count} companies in your email list?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={onCancel} className={blockButton ? classes.buttonDisabled : ''} color="primary">
              Cancel
            </Button>
            <Button onClick={onConfirm} className={blockButton ? classes.buttonDisabled : ''} color="primary" autoFocus>
              { blockButton ? 'Sending...' : 'Confirm' }
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );

  }
}

export default withStyles(styles)(AlertDialog);
