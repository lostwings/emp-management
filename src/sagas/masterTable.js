import { call, put, takeEvery, all } from 'redux-saga/effects';
import * as actionTypes from '../constants/actionTypes';
import { fetchMasterTableSucesss, fetchMasterTableFailure } from '../actions/masterTable';
import api from '../services/api';

export function* fetchMasterTableTask() {
  try {
    const masterTable = yield call(api.fetchMasterTable);
    yield put(fetchMasterTableSucesss(masterTable));
  }
  catch (error) {
    yield put(fetchMasterTableFailure(error));
  }
}

export function* watchFetchMasterTableRequest() {
  yield takeEvery(actionTypes.MASTER_TABLE_FETCH_REQUEST, fetchMasterTableTask);
}

export default function* profileSaga() {
  yield all([
    watchFetchMasterTableRequest()
  ]);
}
