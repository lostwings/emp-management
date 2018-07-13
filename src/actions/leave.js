import * as actionTypes from '../constants/actionTypes';

export const createLeaveRequest = (form, resolve, reject) => ({
  type: actionTypes.LEAVE_CREATE_REQUEST,
  payload: {
    form,
    resolve,
    reject
  }
});

export const createLeaveSuccess = leaves => ({
  type: actionTypes.LEAVE_CREATE_SUCCESS,
  payload: {
    leaves
  }
});

export const createLeaveFailure = message => ({
  type: actionTypes.LEAVE_CREATE_FAILURE,
  payload: {
    message
  }
});

export const fetchLeaveRequest = (userId, year, month) => ({
  type: actionTypes.LEAVE_FETCH_REQUEST,
  payload: {
    userId,
    year,
    month
  }
});

export const fetchLeaveSuccess = leaves => ({
  type: actionTypes.LEAVE_FETCH_SUCCESS,
  payload: {
    leaves
  }
});

export const fetchLeaveFailure = message => ({
  type: actionTypes.LEAVE_FETCH_FAILURE,
  payload: {
    message
  }
});

export const updateLeaveRequest = (userId, leave) => ({
  type: actionTypes.LEAVE_UPDATE_REQUEST,
  payload: {
    userId,
    leave
  }
});

export const updateLeaveSuccess = leaves => ({
  type: actionTypes.LEAVE_UPDATE_SUCCESS,
  payload: {
    leaves
  }
});

export const updateLeaveFailure = message => ({
  type: actionTypes.LEAVE_UPDATE_FAILURE,
  payload: {
    message
  }
});

export const fetchLeaveHistoryRequest = (userId, year) => ({
  type: actionTypes.LEAVE_HISTORY_FETCH_REQUEST,
  payload: {
    userId,
    year
  }
});

export const fetchLeaveHistorySuccess = leaveHistory => ({
  type: actionTypes.LEAVE_HISTORY_FETCH_SUCCESS,
  payload: {
    leaveHistory
  }
});

export const fetchLeaveHistoryFailure = message => ({
  type: actionTypes.LEAVE_HISTORY_FETCH_FAILURE,
  payload: {
    message
  }
});
