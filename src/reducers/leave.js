import moment from 'moment';
import * as actionTypes from '../constants/actionTypes';

const initialState = {
  lists: [],
  leaveHistory: {},
  year: moment().format('YYYY'),
  month: moment().format('MM')
};

const leave = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.LEAVE_CREATE_REQUEST:
      return {
        ...state,
        form: action.payload.form
      };
    case actionTypes.LEAVE_CREATE_SUCCESS:
      return {
        ...state,
        lists: action.payload.leaves
      };
    case actionTypes.LEAVE_CREATE_FAILURE:
      return {
        ...state,
        message: action.payload.message
      };
    case actionTypes.LEAVE_FETCH_REQUEST:
      return {
        ...state,
        isFetching: true,
        year: action.payload.year,
        month: action.payload.month
      };
    case actionTypes.LEAVE_FETCH_SUCCESS:
      return {
        ...state,
        isFetching: false,
        lists: action.payload.leaves
      };
    case actionTypes.LEAVE_FETCH_FAILURE:
      return {
        ...state,
        isFetching: false,
        message: action.payload.message
      };
    case actionTypes.LEAVE_UPDATE_REQUEST:
      return {
        ...state,
        leave: action.payload.leave
      };
    case actionTypes.LEAVE_UPDATE_SUCCESS:
      return {
        ...state,
        lists: action.payload.leaves
      };
    case actionTypes.LEAVE_UPDATE_FAILURE:
      return {
        ...state,
        message: action.payload.message
      };
    case actionTypes.LEAVE_HISTORY_FETCH_REQUEST:
      return {
        ...state,
        isHistoryFetching: true,
        year: action.payload.year
      };
    case actionTypes.LEAVE_HISTORY_FETCH_SUCCESS:
      return {
        ...state,
        isHistoryFetching: false,
        leaveHistory: action.payload.leaveHistory
      };
    case actionTypes.LEAVE_HISTORY_FETCH_FAILURE:
      return {
        ...state,
        isHistoryFetching: false,
        message: action.payload.message
      };
    default:
      return state;
  }
};

export default leave;
