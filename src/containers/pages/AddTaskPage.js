import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';
import { Grid, Form, Divider, Segment } from 'semantic-ui-react';
import moment from 'moment';
import PageHeader from '../../components/PageHeader';
import AddTaskForm from '../forms/AddTaskForm';
import { taskOptions, getRangeOptions } from '../../utils/options';
import { updateInput, createTimesheetRequest } from '../../actions/timesheet';
import { handleReduxFormSubmit } from '../../utils/helper';
import { projectsToOptions } from '../../selectors/project';
import { fetchProjectRequest } from '../../actions/project';

const AddTaskPage = ({ month, startDay, endDay, change, submit, projectOptions }) => (
  <div>
    <PageHeader text="New Task" icon="user" />
    <Segment raised >
      <Grid padded>
        <Grid.Row >
          <Grid.Column width={16}>
            <Form>
              <Form.Group widths="equal">
                <Form.Select fluid label="Project" placeholder="Project" options={projectOptions} onChange={(e, { value }) => change('projectId', value)} />
                <Form.Select fluid label="Task Name" placeholder="Task" options={taskOptions} onChange={(e, { value }) => change('task', value)} />
                <Form.Select label="Start Date" placeholder="start" defaultValue={startDay} options={getRangeOptions(1, endDay)} onChange={(e, { value }) => change('startDay', value)} />
                <Form.Select label="End Date" placeholder="end" defaultValue={endDay} options={getRangeOptions(startDay, moment(month, 'MM').daysInMonth())} onChange={(e, { value }) => change('endDay', value)} />
              </Form.Group>
            </Form>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Segment>
    <Divider />
    <AddTaskForm onSubmit={submit} />
  </div>
);

AddTaskPage.propTypes = {
  month: PropTypes.string.isRequired,
  startDay: PropTypes.number.isRequired,
  endDay: PropTypes.number.isRequired,
  change: PropTypes.func.isRequired,
  submit: PropTypes.func.isRequired,
  projectOptions: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  month: state.timesheet.month,
  startDay: state.timesheet.startDay,
  endDay: state.timesheet.endDay,
  projectOptions: projectsToOptions(state)
});

const mapDispatchToProps = dispatch => ({
  change: (key, value) => dispatch(updateInput(key, value)),
  fetchProject: () => dispatch(fetchProjectRequest()),
  submit: values => handleReduxFormSubmit(dispatch, createTimesheetRequest, values, true)
});

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  lifecycle({
    componentDidMount() {
      const { fetchProject } = this.props;
      fetchProject();
    }
  })
);

export default enhance(AddTaskPage);
