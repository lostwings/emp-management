import moment from 'moment';

import * as actionTypes from '../constants/actionTypes';

const now = moment();

const initialState = {
  lists: [],
  leaves: [],
  holidays: [],
  year: now.format('YYYY'),
  month: now.format('MM'),
  startDay: 1,
  endDay: now.daysInMonth()
};

const timesheet = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.UPDATE_INPUT:
      return {
        ...state,
        [action.payload.key]: action.payload.value
      };
    case actionTypes.TIMESHEET_CREATE_REQUEST:
      return {
        ...state,
        form: action.payload.form
      };
    case actionTypes.TIMESHEET_CREATE_SUCCESS:
      return {
        ...state,
        lists: action.payload.timesheets
      };
    case actionTypes.TIMESHEET_CREATE_FAILURE:
      return {
        ...state,
        message: action.payload.message
      };
    case actionTypes.TIMESHEET_FETCH_REQUEST:
      return {
        ...state,
        isFetching: true,
        userId: action.payload.userId,
        year: action.payload.year,
        month: action.payload.month,
        endDay: moment(action.payload.month).daysInMonth()
      };
    case actionTypes.TIMESHHET_FETCH_SUCCESS:
      return {
        ...state,
        isFetching: false,
        lists: action.payload.timesheets,
        leaves: action.payload.leaves,
        holidays: action.payload.holidays
      };
    case actionTypes.TIMESHEET_UPDATE_REQUEST:
      return {
        ...state,
        form: action.payload.form
      };
    case actionTypes.TIMESHEET_UPDATE_SUCCESS:
      return {
        ...state,
        lists: action.payload.timesheets
      };
    case actionTypes.TIMESHEET_UPDATE_FAILURE:
      return {
        ...state,
        message: action.payload.message
      };
    default:
      return state;
  }
};

export default timesheet;
