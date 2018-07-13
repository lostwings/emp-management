import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { Field, reduxForm } from 'redux-form';
import { Form } from 'semantic-ui-react';
import Input from '../../components/Input';
import * as validator from '../../utils/validator';

const AddworkExperienceProfileForm = ({ handleSubmit, submitting }) => (
  <Form onSubmit={handleSubmit}>
    <Field
      name="company"
      as={Form.Input}
      component={Input}
      label="Company"
      disabled={submitting}
      validator={validator.required}
    />
    <Field
      name="position"
      as={Form.Input}
      component={Input}
      label="Position"
      disabled={submitting}
      validator={validator.required}
    />
    <Field
      name="duration"
      as={Form.Input}
      component={Input}
      label="Duration"
      disabled={submitting}
      validator={validator.required}
    />
  </Form>
);

AddworkExperienceProfileForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  initialValues: {
    userId: state.profile.userId
  }
});

const enhance = compose(
  connect(mapStateToProps),
  reduxForm({
    form: 'addWorkExperienceProfile'
  })
);

export default enhance(AddworkExperienceProfileForm);
