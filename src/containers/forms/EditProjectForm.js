import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { Field, reduxForm, formValueSelector, change } from 'redux-form';
import { Form } from 'semantic-ui-react';
import Input from '../../components/Input';
import * as validator from '../../utils/validator';

const validate = (values) => {
  const errors = {};
  errors.startDate = validator.required(values.startDate);
  errors.endDate = validator.required(values.endDate);
  return errors;
};

const paymentTypeOptions = [
  { key: 'Man-month', value: 'Man-month', text: 'Man-month' },
  { key: 'Man-day', value: 'Man-day', text: 'Man-day' },
];

const workingDayOptions = [
  { key: 22, value: 22, text: '22 days per month' },
  { key: 20, value: 20, text: '20 days per month' },
];

const statusOptions = [
  { key: 'In Progress', value: 'In Progress', text: 'In Progress' },
  { key: 'Done', value: 'Done', text: 'Done' }
];

const EditProjectForm = ({ handleSubmit, submitting, setWorkingDay, paymentType }) => (
  <Form onSubmit={handleSubmit}>
    <Field name="name" as={Form.Input} component={Input} label="Name" placeholder="Name" disabled={submitting} />
    <Form.Group widths="equal">
      <Field name="quotationId" as={Form.Input} component={Input} label="Quotation No." placeholder="Quotation No." disabled={submitting} />
      <Field name="customer" as={Form.Input} component={Input} label="Customer" placeholder="Customer" disabled={submitting} />
    </Form.Group>
    <Form.Group widths="equal">
      <Field name="purchasedOrder" as={Form.Input} component={Input} label="  order No." placeholder="Purchesed order No." disabled={submitting} />
      <Field name="amount" as={Form.Input} component={Input} label="amount" placeholder="amount" disabled={submitting} />
    </Form.Group>
    <Form.Group widths="equal">
      <Field name="startDate" as={Form.Input} component={Input} label="From" placeholder="From" type="date" disabled={submitting} />
      <Field name="endDate" as={Form.Input} component={Input} label="To" placeholder="To" type="date" disabled={submitting} />
    </Form.Group>
    <Field name="status" as={Form.Select} component={Input} label="Status" placeholder="Status" options={statusOptions} disabled={submitting} />
import { statusOptions, paymentTypeOptions, workingDayOptions } from '../../utils/options';

const validate = (values) => {
  const errors = {};
  errors.id = validator.required(values.id);
  errors.name = validator.required(values.name);
  errors.quotationId = validator.required(values.quotationId);
  errors.customer = validator.required(values.customer);
  errors.purchasedOrder = validator.required(values.purchasedOrder);
  errors.amount = validator.required(values.amount);
  errors.startDate = validator.dateBefore(values.startDate, values.endDate);
  errors.endDate = validator.dateAfter(values.endDate, values.startDate);
  errors.status = validator.required(values.status);
  errors.paymentType = validator.required(values.paymentType);
  return errors;
};

const EditProjectForm = ({ handleSubmit, submitting, setWorkingDay, paymentType }) => (
  <Form onSubmit={handleSubmit}>
    <Field
      name="name"
      as={Form.Input}
      component={Input}
      label="Name"
      placeholder="Name"
      disabled={submitting}
    />
    <Form.Group widths="equal">
      <Field
        name="quotationId"
        as={Form.Input}
        component={Input}
        label="Quotation No."
        placeholder="Quotation No."
        disabled={submitting}
      />
      <Field
        name="customer"
        as={Form.Input}
        component={Input}
        label="Customer"
        placeholder="Customer"
        disabled={submitting}
      />
    </Form.Group>
    <Form.Group widths="equal">
      <Field
        name="purchasedOrder"
        as={Form.Input}
        component={Input}
        label="PO No."
        placeholder="PO No."
        disabled={submitting}
      />
      <Field
        name="amount"
        as={Form.Input}
        component={Input}
        label="Amount"
        placeholder="Amount"
        disabled={submitting}
      />
    </Form.Group>
    <Form.Group widths="equal">
      <Field
        name="startDate"
        as={Form.Input}
        component={Input}
        label="From"
        placeholder="From"
        type="date"
        disabled={submitting}
        validate={validator.required}
      />
      <Field
        name="endDate"
        as={Form.Input}
        component={Input}
        label="To"
        placeholder="To"
        type="date"
        disabled={submitting}
        validate={validator.required}
      />
    </Form.Group>
    <Field
      name="status"
      as={Form.Select}
      component={Input}
      label="Status"
      placeholder="Status"
      options={statusOptions}
      disabled={submitting}
    />
    <Field
      name="paymentType"
      as={Form.Select}
      component={Input}
      label="Payment type"
      placeholder="Payment type"
      options={paymentTypeOptions}
      onChange={(event, newValue) => setWorkingDay(newValue === 'Man-month' ? 22 : null)}
      disabled={submitting}
    />
    {paymentType === 'Man-month' && <Field name="workingDay" as={Form.Select} component={Input} label="Working day" placeholder="Working day" options={workingDayOptions} disabled={submitting} />}
    <Field name="description" as={Form.TextArea} component={Input} autoHeight label="Description" placeholder="Description" disabled={submitting} />
      onChange={(e, newValue) => setWorkingDay(newValue === 'Man-month' ? 22 : null)}
      disabled={submitting}
    />
    {paymentType === 'Man-month' && <Field
      name="workingDay"
      as={Form.Select}
      component={Input}
      label="Working day"
      placeholder="Working day"
      options={workingDayOptions}
      disabled={submitting}
    />}
    <Field
      name="description"
      as={Form.TextArea}
      component={Input}
      autoHeight
      label="Description"
      placeholder="Description"
      disabled={submitting}
    />
  </Form>
);

EditProjectForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  setWorkingDay: PropTypes.func.isRequired,
  paymentType: PropTypes.string.isRequired,
};

const selector = formValueSelector('editProject');

const mapStateToProps = state => ({
  paymentType: selector(state, 'paymentType'),
  workingDay: selector(state, 'workingDay'),
  initialValues: {
    id: state.projectDetail.id,
    name: state.projectDetail.name,
    quotationId: state.projectDetail.quotationId,
    customer: state.projectDetail.customer,
    purchasedOrder: state.projectDetail.purchasedOrder,
    amount: state.projectDetail.amount,
    startDate: state.projectDetail.startDate,
    endDate: state.projectDetail.endDate,
    status: state.projectDetail.status,
    paymentType: state.projectDetail.paymentType,
    workingDay: state.projectDetail.workingDay
  }
});

const mapDispatchToProps = dispatch => ({
  setWorkingDay: value => dispatch(change('editProject', 'workingDay', value))
});

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  reduxForm({
    form: 'editProject',
    validate
  })
);

export default enhance(EditProjectForm);
