import * as actionTypes from '../constants/actionTypes';

export const createTimesheetRequest = (form, resolve, reject, isArray) => ({
  type: actionTypes.TIMESHEET_CREATE_REQUEST,
  payload: {
    form,
    resolve,
    reject,
    isArray
  }
});

export const createTimesheetSuccess = timesheets => ({
  type: actionTypes.TIMESHEET_CREATE_SUCCESS,
  payload: {
    timesheets
  }
});

export const createTimesheetFailure = message => ({
  type: actionTypes.TIMESHEET_CREATE_FAILURE,
  payload: {
    message
  }
});

export const fetchTimesheetRequest = (userId, year, month) => ({
  type: actionTypes.TIMESHEET_FETCH_REQUEST,
  payload: {
    userId,
    year,
    month
  }
});

export const fetchTimesheetSuccess = (timesheets, leaves, holidays) => ({
  type: actionTypes.TIMESHHET_FETCH_SUCCESS,
  payload: {
    timesheets,
    leaves,
    holidays
  }
});

export const fetchTimesheetFailure = message => ({
  type: actionTypes.TIMESHHET_FETCH_FAILURE,
  payload: {
    message
  }
});

export const updateTimesheetRequest = (form, resolve, reject) => ({
  type: actionTypes.TIMESHEET_UPDATE_REQUEST,
  payload: {
    form,
    resolve,
    reject
  }
});

export const updateTimesheetSuccess = timesheets => ({
  type: actionTypes.TIMESHEET_UPDATE_SUCCESS,
  payload: {
    timesheets
  }
});

export const updateTimesheetFailure = message => ({
  type: actionTypes.TIMESHEET_UPDATE_FAILURE,
  payload: {
    message
  }
});

export const deleteTimesheetRequest = timesheetId => ({
  type: actionTypes.TIMESHEET_DELETE_REQUEST,
  payload: {
    timesheetId
  }
});

export const deleteTimesheetSuccess = timesheetId => ({
  type: actionTypes.TIMESHEET_DELETE_SUCCESS,
  payload: {
    timesheetId
  }
});

export const deleteTimesheetFailure = message => ({
  type: actionTypes.TIMESHEET_DELETE_FAILURE,
  payload: {
    message
  }
});

export const updateInput = (key, value) => ({
  type: actionTypes.UPDATE_INPUT,
  payload: {
    key,
    value
  }
});
