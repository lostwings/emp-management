import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { submit, isSubmitting } from 'redux-form';
import { closeModal } from '../../actions/modal';
import Modal from '../../components/Modal';
import AddEmployeeForm from '../forms/AddEmployeeForm';
import { createEmployeeRequest } from '../../actions/employee';
import { handleReduxFormSubmit } from '../../utils/helper';

const AddEmployeeModal = ({ onClose, onClick, onSubmit, submitting }) => (
  <Modal
    header="Add new employee"
    onClose={onClose}
    onClick={onClick}
    submitting={submitting}
  >
    <AddEmployeeForm onSubmit={values => onSubmit(values)} />
  </Modal>
);

AddEmployeeModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  submitting: isSubmitting('addEmployee')(state)
});

const mapDispatchToProps = dispatch => ({
  onClose: () => dispatch(closeModal()),
  onSubmit: values => handleReduxFormSubmit(dispatch, createEmployeeRequest, values),
  onClick: () => dispatch(submit('addEmployee'))
});

export default connect(mapStateToProps, mapDispatchToProps)(AddEmployeeModal);
