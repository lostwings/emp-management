import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { Form } from 'semantic-ui-react';
import FileInput from '../../components/FileInput';
import * as validator from '../../utils/validator';

const validate = (values) => {
  const errors = {};
  errors.startDate = validator.required(values.startDate);
  return errors;
};

const EditProfilePictureForm = ({ handleSubmit, submitting }) => (
  <Form onSubmit={handleSubmit}>
    <Field name="profilePicture" component={FileInput} disabled={submitting} />
  </Form>
);

EditProfilePictureForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired
};

export default reduxForm({
  form: 'editProfilePicture',
  validate
})(EditProfilePictureForm);
