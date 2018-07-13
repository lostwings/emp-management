import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { Field, reduxForm, change } from 'redux-form';
import { Form } from 'semantic-ui-react';
import moment from 'moment';
import Input from '../../components/Input';
import * as validator from '../../utils/validator';
import { masterTableToOptions } from '../../utils/helper';
import { genderOptions, engineerOptions } from '../../utils/options';

const AddEmployeeForm = ({ handleSubmit, submitting, masterTable, setDefaultProbationDate }) => (
  <Form onSubmit={handleSubmit}>
    <Field
      name="type"
      as={Form.Select}
      component={Input}
      label="User type"
      options={masterTableToOptions(masterTable.accessTypes)}
      disabled={submitting}
      validate={validator.required}
    />
    <Form.Group widths="equal">
      <Field
        name="firstName"
        as={Form.Input}
        component={Input}
        label="First name"
        disabled={submitting}
        validate={[validator.required, validator.englishName]}
      />
      <Field
        name="lastName"
        as={Form.Input}
        component={Input}
        label="Last name"
        disabled={submitting}
        validate={[validator.required, validator.englishName]}
      />
    </Form.Group>
    <Field
      name="username"
      as={Form.Input}
      component={Input}
      label="Username"
      placeholder="example@playtorium.co.th"
      disabled={submitting}
      validate={[validator.required, validator.email]}
    />
    <Field
      name="citizenId"
      as={Form.Input}
      component={Input}
      label="Citizen ID"
      disabled={submitting}
      validate={[validator.required, validator.number, validator.length13]}
    />
    <Field
      name="gender"
      as={Form.Select}
      component={Input}
      label="Gender"
      options={genderOptions}
      disabled={submitting}
      validate={validator.required}
    />
    <Field
      name="levelId"
      as={Form.Select}
      component={Input}
      label="Level"
      options={masterTableToOptions(masterTable.levels)}
      disabled={submitting}
      validate={validator.required}
    />
    <Field
      name="departmentId"
      as={Form.Select}
      component={Input}
      label="Department"
      options={masterTableToOptions(masterTable.departments)}
      disabled={submitting}
      validate={validator.required}
    />
    <Field
      name="engineer"
      as={Form.Select}
      component={Input}
      label="Engineer"
      options={engineerOptions}
      disabled={submitting}
      validate={validator.required}
    />
    <Field
      name="startDate"
      as={Form.Input}
      component={Input}
      type="date"
      label="Start date"
      onChange={(e, newValue) => setDefaultProbationDate(newValue)}
      disabled={submitting}
      validate={[validator.required, validator.date]}
    />
    <Field
      name="probationDate"
      as={Form.Input}
      component={Input}
      type="date"
      label="Probation date"
      disabled={submitting}
      validator={[validator.required, validator.date]}
    />
    <button type="submit">test</button>
  </Form>
);

AddEmployeeForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  masterTable: PropTypes.object.isRequired,
  setDefaultProbationDate: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  masterTable: state.masterTable
});

const mapDispatchToProps = dispatch => ({
  setDefaultProbationDate: startDate => dispatch(change('addEmployee', 'probationDate', moment(startDate).add(120, 'days').format('YYYY-MM-DD')))
});

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  reduxForm({
    form: 'addEmployee'
  })
);

export default enhance(AddEmployeeForm);
