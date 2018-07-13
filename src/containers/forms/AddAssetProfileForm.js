import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { Form } from 'semantic-ui-react';
import Input from '../../components/Input';
import * as validator from '../../utils/validator';
import { masterTableToOptions } from '../../utils/helper';

const ownFlagOptions = [
  { key: 'myself', value: true, text: 'Myself' },
  { key: 'company', value: false, text: 'Company' }
];

const AddAssetProfileForm = ({ masterTable, handleSubmit, submitting, ownFlag }) => (
  <Form onSubmit={handleSubmit}>
    <Field
      name="assetTypeId"
      as={Form.Select}
      component={Input}
      label="Asset type"
      options={masterTableToOptions(masterTable.assetTypes)}
      disabled={submitting}
      validate={validator.required}
    />
    <Field
      name="ownFlag"
      as={Form.Select}
      component={Input}
      label="Owner"
      options={ownFlagOptions}
    />
    {ownFlag ?
      <Field
        name="name"
        as={Form.Input}
        component={Input}
        label="Asset name"
        disabled={submitting}
        validate={validator.required}
      /> :
      <Field
        name="assetId"
        as={Form.Select}
        component={Input}
        label="Asset name"
        options={masterTableToOptions(masterTable.assets)}
        disabled={submitting}
        validate={validator.required}
      />
    }
    {ownFlag &&
      <Field
        name="serialNumber"
        as={Form.Input}
        component={Input}
        label="Serial No."
        disabled={submitting}
        validate={validator.required}
      />
    }
    <Field
      name="assetDate"
      as={Form.Input}
      component={Input}
      type="date"
      label="Date"
      disabled={submitting}
      validate={[validator.required, validator.date]}
    />
    {ownFlag &&
      <Field
        name="description"
        as={Form.TextArea}
        component={Input}
        autoHeight
        label="Description"
        disabled={submitting}
      />
    }
  </Form>
);

AddAssetProfileForm.propTypes = {
  masterTable: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  ownFlag: PropTypes.bool.isRequired
};

const selector = formValueSelector('addAssetProfile');

const mapStateToProps = state => ({
  masterTable: state.masterTable,
  initialValues: {
    userId: state.profile.userId,
    ownFlag: true
  },
  ownFlag: selector(state, 'ownFlag')
});

const enhance = compose(
  connect(mapStateToProps),
  reduxForm({
    form: 'addAssetProfile',
  })
);

export default enhance(AddAssetProfileForm);
