import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';
import {
  fetchLeaveRequest,
  updateLeaveRequest,
  fetchLeaveHistoryRequest
} from '../../actions/leave';
import { openModal } from '../../actions/modal';
import * as modalNames from '../../constants/modalNames';
import { getVisibilityLeaves } from '../../selectors/leave';
import Leave from '../../components/Leave';
import Loader from '../../components/Loader';

const LeavePage = ({ isFetching, isHistoryFetching, leaves, onAddClick, onCancelClick, userId, year, month, fetchLeave, leaveHistory }) => (
  <div>
    {(isFetching || isHistoryFetching) ?
      <Loader /> :
      <Leave
        userId={userId}
        leaves={leaves}
        leaveHistory={leaveHistory}
        onAddClick={onAddClick}
        onCancelClick={onCancelClick}
        fetchLeave={fetchLeave}
        year={year}
        month={month}
      />}
  </div>
);

LeavePage.defaultProps = {
  isFetching: true,
  isHistoryFetching: true
};

LeavePage.propTypes = {
  isFetching: PropTypes.bool,
  isHistoryFetching: PropTypes.bool,
  leaves: PropTypes.array.isRequired,
  leaveHistory: PropTypes.object.isRequired,
  onAddClick: PropTypes.func.isRequired,
  onCancelClick: PropTypes.func.isRequired,
  userId: PropTypes.number.isRequired,
  fetchLeave: PropTypes.func.isRequired,
  year: PropTypes.string.isRequired,
  month: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  isFetching: state.leave.isFetching,
  isHistoryFetching: state.leave.isHistoryFetching,
  leaveHistory: state.leave.leaveHistory,
  leaves: state.leave.lists,
  userId: state.auth.id,
  year: state.leave.year,
  month: state.leave.month
});

const mapDispatchToProps = dispatch => ({
  fetchLeave: (userId, year, month) => dispatch(fetchLeaveRequest(userId, year, month)),
  fetchLeaveHistory: (userId, year) => dispatch(fetchLeaveHistoryRequest(userId, year)),
  onAddClick: () => dispatch(openModal(modalNames.CREATE_LEAVE_REQUEST)),
  onCancelClick: (userId, leave) => dispatch(openModal(modalNames.CONFIRM, {
    header: 'Cancel confirmation',
    description: 'Are you sure to cancel this leave request ?',
    onConfirm: () => dispatch(updateLeaveRequest(userId, { ...leave, status: 'Cancel' }))
  }))
});

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  lifecycle({
    componentDidMount() {
      const { fetchLeave, fetchLeaveHistory, userId, year, month } = this.props;
      fetchLeave(userId, year, month);
      fetchLeaveHistory(userId, year);
    }
  })
);

export default enhance(LeavePage);
