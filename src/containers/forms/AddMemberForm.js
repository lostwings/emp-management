import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';
import { Field, reduxForm } from 'redux-form';
import { Form } from 'semantic-ui-react';
import { fetchEmployeeRequest } from '../../actions/employee';
import { employeesToOptions } from '../../selectors/employee';
import Input from '../../components/Input';
import * as validator from '../../utils/validator';

const validate = (values) => {
  const errors = {};
  errors.startDate = validator.required(values.startDate);
  errors.endDate = validator.required(values.endDate);
  errors.userId = validator.required(values.userId);
  errors.role = validator.required(values.role);
  return errors;
};

const AddMemberForm = ({ handleSubmit, submitting, employeesOptions }) => (
  <Form onSubmit={handleSubmit}>
    <Form.Group widths="equal">
      <Field name="userId" as={Form.Dropdown} component={Input} search selection options={employeesOptions} label="Member" placeholder="Member" disabled={submitting} />
      <Field name="role" as={Form.Input} component={Input} label="Role" placeholder="Role" disabled={submitting} />
    </Form.Group>
  </Form>
);

AddMemberForm.defaultProps = {
  employeesOptions: []
};

AddMemberForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  employeesOptions: PropTypes.array
};

const mapStateToProps = state => ({
  employeesOptions: employeesToOptions(state),
  initialValues: {
    projectId: state.projectDetail.id
  }
});

const mapDispatchToProps = dispatch => ({
  fetchEmployee: () => dispatch(fetchEmployeeRequest())
});

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  lifecycle({
    componentDidMount() {
      const { fetchEmployee } = this.props;
      fetchEmployee();
    }
  }),
  reduxForm({
    form: 'addProject',
    initialValues: {
      from: null,
      to: null,
      description: null
    },
    form: 'addMember',
    validate
  })
);

export default enhance(AddMemberForm);
