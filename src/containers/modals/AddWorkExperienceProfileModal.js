import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { submit, isSubmitting } from 'redux-form';
import { closeModal } from '../../actions/modal';
import { updateProfileRequest } from '../../actions/profile';
import Modal from '../../components/Modal';
import AddworkExperienceProfileForm from '../forms/AddworkExperienceProfileForm';
import { handleReduxFormSubmit } from '../../utils/helper';

const AddWorkExperienceProfileModal = ({ onClose, onSubmit, submitting, onClick }) => (
  <Modal
    header="Add work experience profile"
    onClose={onClose}
    onClick={onClick}
    submitting={submitting}
  >
    <AddworkExperienceProfileForm onSubmit={values => onSubmit(values)} />
  </Modal>
);

AddWorkExperienceProfileModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  modalName: state.modal.name,
  submitting: isSubmitting('addWorkExperienceProfile')(state)
});

const mapDispatchToProps = dispatch => ({
  onClose: () => dispatch(closeModal()),
  onSubmit: values => handleReduxFormSubmit(dispatch, updateProfileRequest, values, 'addWorkExperienceProfile'),
  onClick: () => dispatch(submit('addWorkExperienceProfile'))
});

export default connect(mapStateToProps, mapDispatchToProps)(AddWorkExperienceProfileModal);
