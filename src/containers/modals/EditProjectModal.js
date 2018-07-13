import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { submit, isSubmitting } from 'redux-form';
import { closeModal } from '../../actions/modal';
import { updateProjectDetailRequest } from '../../actions/projectDetail';
import Modal from '../../components/Modal';
import EditProjectForm from '../forms/EditProjectForm';
import { handleReduxFormSubmit } from '../../utils/helper';

const EditProjectModal = ({ onClose, onSubmit, submitting, onClick }) => (
  <Modal
    header="Edit project"
    onClose={onClose}
    onClick={onClick}
    submitting={submitting}
  >
    <EditProjectForm onSubmit={values => onSubmit(values)} />
  </Modal>
);

EditProjectModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  modalName: state.modal.name,
  submitting: isSubmitting('editProject')(state)
});

const mapDispatchToProps = dispatch => ({
  onClose: () => dispatch(closeModal()),
  onSubmit: values => handleReduxFormSubmit(dispatch, updateProjectDetailRequest, values),
  onClick: () => dispatch(submit('editProject'))
});

export default connect(mapStateToProps, mapDispatchToProps)(EditProjectModal);
