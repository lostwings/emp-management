import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Segment, Header, Icon } from 'semantic-ui-react';
import ProfileBox from '../components/ProfileBox';
import { openModal } from '../actions/modal';
import * as modalNames from '../constants/modalNames';

const WorkProfileBox = ({ workProfile, onEditClick, can }) => {
  let lists = [
    { key: 'levelId', title: 'Level', value: workProfile.levelName },
    { key: 'departmentId', title: 'Department', value: workProfile.departmentName },
    { key: 'positionId', title: 'Position', value: workProfile.positionName }
  ];
  if (can.employeeWorkViewAll) {
    lists = lists.concat([
      { key: 'contractId', title: 'Contract', value: workProfile.contractName },
      { key: 'startDate', title: 'Start date', value: workProfile.startDate },
      { key: 'endDate', title: 'End date', value: workProfile.endDate },
      { key: 'probationDate', title: 'Probation date', value: workProfile.probationDate }
    ]);
  }
  return (
    <Segment.Group raised size="large">
      <Segment padded>
        <Header as="h2">
          <Icon name="suitcase" />
          <Header.Content>
            Work
          </Header.Content>
        </Header>
      </Segment>
      <ProfileBox title="Work" icon="suitcase" lists={lists} onEditClick={onEditClick} edited={can.employeeWorkEdit} />
    </Segment.Group>
  );
};

WorkProfileBox.defaultProps = {
  workProfile: null
};

WorkProfileBox.propTypes = {
  workProfile: PropTypes.object,
  onEditClick: PropTypes.func.isRequired,
  can: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  can: state.accessControl.can
});

const mapDispatchToProps = dispatch => ({
  onEditClick: () => dispatch(openModal(modalNames.EDIT_WORK_PROFILE))
});

export default connect(mapStateToProps, mapDispatchToProps)(WorkProfileBox);
