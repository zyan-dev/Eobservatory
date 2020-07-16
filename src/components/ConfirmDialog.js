import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from "prop-types";


class ConfirmDialog extends React.Component {


  render() {

    const { onCancel, onConfirm, open, contentText } = this.props;

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
              { contentText}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={onCancel} color="primary">
              Cancel
            </Button>
            <Button onClick={onConfirm} color="primary" autoFocus>
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );

  }
}

ConfirmDialog.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  contentText: PropTypes.string.isRequired,
};

export default ConfirmDialog;
