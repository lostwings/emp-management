import { call, put, takeEvery, all } from 'redux-saga/effects';
import * as actionTypes from '../constants/actionTypes';
import {
  createTimesheetSuccess,
  createTimesheetFailure,
  fetchTimesheetSuccess,
  fetchTimesheetFailure,
  updateTimesheetSuccess,
  updateTimesheetFailure
} from '../actions/timesheet';
import { closeModal } from '../actions/modal';
import history from '../history';
import api from '../services/api';

export function* createTimesheetTask(action) {
  try {
    const timesheets = yield call(
      api.createTimesheet,
      action.payload.isArray ? action.payload.form : { timesheets: [action.payload.form] }
    );
    yield put(createTimesheetSuccess(timesheets));
    yield put(closeModal());
    action.payload.resolve();
    if (action.payload.isArray) history.push('/timesheet');
  }
  catch (error) {
    yield put(createTimesheetFailure(error));
    action.payload.reject();
  }
}

export function* fetchTimesheetTask(action) {
  try {
    const timesheets = yield call(api.fetchTimesheet, action.payload.userId, action.payload.year, action.payload.month);
    const leaves = yield call(api.fetchLeave, action.payload.userId, action.payload.year, action.payload.month);
    const holidays = yield call(api.fetchHolidays, action.payload.year, action.payload.month);
    yield put(fetchTimesheetSuccess(timesheets, leaves, holidays));
  }
  catch (error) {
    yield put(fetchTimesheetFailure(error));
  }
}

export function* updateTimesheetTask(action) {
  try {
    const timesheets = yield call(api.updateTimesheet, { timesheet: action.payload.form });
    yield put(closeModal());
    yield put(updateTimesheetSuccess(timesheets));
    action.payload.resolve();
  }
  catch (error) {
    yield put(updateTimesheetFailure(error));
    action.payload.reject();
  }
}

export function* watchCreateTimesheetRequest() {
  yield takeEvery(actionTypes.TIMESHEET_CREATE_REQUEST, createTimesheetTask);
}

export function* watchFetchTimesheetRequest() {
  yield takeEvery(actionTypes.TIMESHEET_FETCH_REQUEST, fetchTimesheetTask);
}

export function* watchUpdateTimesheetRequest() {
  yield takeEvery(actionTypes.TIMESHEET_UPDATE_REQUEST, updateTimesheetTask);
}

export default function* timesheetSaga() {
  yield all([
    watchCreateTimesheetRequest(),
    watchFetchTimesheetRequest(),
    watchUpdateTimesheetRequest()
  ]);
}
