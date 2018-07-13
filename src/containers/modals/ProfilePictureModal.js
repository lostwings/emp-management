import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Image, Modal } from 'semantic-ui-react';
import { closeModal } from '../../actions/modal';

const ProfilePictureModal = ({ profilePicture, onClose }) => (
  <Modal
    dimmer="blurring"
    size="small"
    closeIcon
    open
    onClose={onClose}
  >
    <Modal.Header>
      Profile Picture
    </Modal.Header>
    <Modal.Content image>
      <Image centered src={profilePicture} />
    </Modal.Content>
  </Modal>
);

ProfilePictureModal.propTypes = {
  profilePicture: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  onClose: () => dispatch(closeModal())
});

export default connect(null, mapDispatchToProps)(ProfilePictureModal);
