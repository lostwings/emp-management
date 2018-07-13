import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { Field, reduxForm } from 'redux-form';
import { Form } from 'semantic-ui-react';
import Input from '../../components/Input';
import * as validator from '../../utils/validator';
import { genderOptions } from '../../utils/options';

const EditGeneralProfileForm = ({ handleSubmit, can }) => (
  <Form onSubmit={handleSubmit}>
    <Form.Group widths="equal">
      <Field
        name="firstName"
        component={Input}
        as={Form.Input}
        label="First name"
        validate={[validator.required, validator.englishName]}
      />
      <Field
        name="lastName"
        component={Input}
        as={Form.Input}
        label="Last name"
        validate={[validator.required, validator.englishName]}
      />
    </Form.Group>
    <Form.Group widths="equal">
      <Field
        name="firstNameTh"
        component={Input}
        as={Form.Input}
        label="ชื่อ"
        validate={[validator.required, validator.thai]}
      />
      <Field
        name="lastNameTh"
        component={Input}
        as={Form.Input}
        label="นามสกุล"
        validate={[validator.required, validator.thai]}
      />
    </Form.Group>
    <Field
      name="nickName"
      component={Input}
      as={Form.Input}
      label="Nick name"
      validate={validator.required}
    />
    {can.employeeInfoEditAll &&
    <Field
      name="birthday"
      component={Input}
      as={Form.Input}
      type="date"
      label="Birth date"
      validate={validator.date}
    />}
    <Field
      name="gender"
      component={Input}
      as={Form.Select}
      label="Gender"
      options={genderOptions}
      validate={validator.required}
    />
    {can.employeeInfoEditAll &&
    <Field
      name="citizenId"
      component={Input}
      as={Form.Input}
      label="Citizen ID"
      validate={[validator.required, validator.length13]}
    />}
    <Field
      name="mobileNumber"
      component={Input}
      as={Form.Input}
      label="Mobile No."
      validate={[validator.required, validator.length10]}
    />
    <Field
      name="email"
      component={Input}
      as={Form.Input}
      label="Email"
      validate={[validator.required, validator.email]}
    />
    <Field
      name="facebookId"
      component={Input}
      as={Form.Input}
      label="Facebook"
    />
    <Field
      name="lineId"
      component={Input}
      as={Form.Input}
      label="Line ID"
      validate={validator.lineId}
    />
    <Field
      name="address"
      component={Input}
      as={Form.TextArea}
      autoHeight
      label="Address"
    />
  </Form>
);

EditGeneralProfileForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  can: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  initialValues: {
    userId: state.profile.general.userId,
    firstName: state.profile.general.firstName,
    lastName: state.profile.general.lastName,
    firstNameTh: state.profile.general.firstNameTh,
    lastNameTh: state.profile.general.lastNameTh,
    nickName: state.profile.general.nickName,
    citizenId: state.profile.general.citizenId,
    gender: state.profile.general.gender,
    mobileNumber: state.profile.general.mobileNumber,
    email: state.profile.general.email,
    facebookId: state.profile.general.facebookId,
    lineId: state.profile.general.lineId,
    birthday: state.profile.general.birthday,
    address: state.profile.general.address,
    picture: state.profile.general.picture
  },
  can: state.accessControl
});

const enhance = compose(
  connect(mapStateToProps),
  reduxForm({
    form: 'editGeneralProfile'
  })
);

export default enhance(EditGeneralProfileForm);
