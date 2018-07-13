import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { Field, reduxForm, formValueSelector, change } from 'redux-form';
import { Form } from 'semantic-ui-react';
import Input from '../../components/Input';
import * as validator from '../../utils/validator';
import { leaveTypesOptions, durationsOptions } from '../../utils/options';

const validate = (values) => {
  const errors = {};
  errors.leaveType = validator.required(values.leaveType);
  errors.leaveFrom = validator.required(values.leaveFrom);
  errors.leaveFrom = validator.dateBefore(values.leaveFrom, values.leaveTo);
  errors.leaveTo = validator.required(values.leaveTo);
  errors.leaveTo = validator.dateAfter(values.leaveTo, values.leaveFrom);
  errors.timeIn = validator.required(values.timeIn);
  errors.timeIn = validator.timeBefore(values.timeIn, values.timeOut);
  errors.timeOut = validator.required(values.timeOut);
  errors.timeOut = validator.timeAfter(values.timeOut, values.timeIn);
  errors.purpose = validator.required(values.purpose);
  return errors;
};

const remark = `1. พนักงานจะใช้สิทธิ์ลาได้ เมื่อผู้บังคับบัญชาอนุมัติก่อนเท่านั้น โดยต้องปฏิบัติตามระเบียบข้อบังคับของบริษัทอย่างเคร่งครัด

2. การลากิจทุกประเภทและลาพักร้อนต้องลาล่วงหน้าอย่างน้อย 3 วัน (ยกเว้นกรณีฉุกเฉิน คือ งานศพบิดา มารดา คู่สมรส บุตร ที่สามารถแจ้งขออนุมัติ ผู้บังคับบัญชาก่อนแล้วต้องเขียนใบลาทันทีที่กลับมาเริ่มงาน)

3. โปรดระบุเหตุผลที่ขอลาให้ชัดเจนว่ามีธุรกิจจำเป็นเรื่องอะไร จำเป็นมากน้อยเพียงใด`;

const CreateLeaveRequestForm = ({ handleSubmit, submitting, duration, resetStartTime, resetEndTime }) => (
  <Form onSubmit={handleSubmit}>
    <Field name="leaveType" as={Form.Select} component={Input} label="Leave type" placeholder="Leave type" options={leaveTypesOptions} disabled={submitting} />
    <Form.Group widths="equal">
      <Field name="leaveFrom" as={Form.Input} component={Input} type="date" label="From" placeholder="From" disabled={submitting} />
      <Field name="leaveTo" as={Form.Input} component={Input} type="date" label="To" placeholder="To" disabled={submitting} />
    </Form.Group>
    <Field
      name="duration"
      as={Form.Select}
      component={Input}
      label="Duration"
      placeholder="Duration"
      options={durationsOptions}
      onChange={() => { resetStartTime(); resetEndTime(); }}
      disabled={submitting}
    />
    {duration === 'Specific time' &&
    <Form.Group widths="equal">
      <Field name="startTime" as={Form.Input} component={Input} type="time" label="Start time" placeholder="Start time" disabled={submitting} />
      <Field name="endTime" as={Form.Input} component={Input} type="time" label="End time" placeholder="End time" disabled={submitting} />
    </Form.Group>}
    <Field name="purpose" as={Form.TextArea} component={Input} autoHeight label="Purpose" placeholder="Purpose" disabled={submitting} />
    <Form.TextArea autoHeight readOnly label="Remark" value={remark} />
  </Form>
);

CreateLeaveRequestForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  duration: PropTypes.string.isRequired,
  resetStartTime: PropTypes.func.isRequired,
  resetEndTime: PropTypes.func.isRequired
};

const selector = formValueSelector('createLeaveRequest');

const mapStateToProps = state => ({
  duration: selector(state, 'duration'),
  initialValues: {
    userId: state.auth.id,
    duration: 'Full day',
    startTime: '09:00:00',
    endTime: '18:00:00'
  }
});

const mapDispatchToProps = dispatch => ({
  resetStartTime: () => dispatch(change('createLeaveRequest', 'startTime', '09:00:00')),
  resetEndTime: () => dispatch(change('createLeaveRequest', 'endTime', '18:00:00')),
});

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  reduxForm({
    form: 'createLeaveRequest',
    validate
  })
);

export default enhance(CreateLeaveRequestForm);
