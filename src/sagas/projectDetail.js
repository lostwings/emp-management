import { call, put, takeEvery, all } from 'redux-saga/effects';
import * as actionTypes from '../constants/actionTypes';
import {
  fetchProjectDetailSuccess,
  fetchProjectDetailFailure,
  updateProjectDetailSuccess,
  updateProjectDetailFailure,
  createMemberSuccess,
  createMemberFailure,
  deleteMemberSuccess,
  deleteMemberFailure
} from '../actions/projectDetail';
import { closeModal } from '../actions/modal';
import api from '../services/api';

function* fetchProjectDetailTask(action) {
  try {
    const projectDetail = yield call(api.fetchProjectDetail, action.payload.projectId);
    yield put(fetchProjectDetailSuccess(projectDetail));
  }
  catch (error) {
    yield put(fetchProjectDetailFailure(error));
  }
}
function* updateProjectDetailTask(action) {
  try {
    const projectDetail = yield call(api.updateProjectDetail, { project: action.payload.form });
    yield put(updateProjectDetailSuccess(projectDetail));
    yield put(closeModal());
    action.payload.resolve();
  }
  catch (error) {
    yield put(updateProjectDetailFailure(error));
    action.payload.reject();
  }
}

function* createMemberTask(action) {
  try {
    const members = yield call(api.createMember, { hasProject: action.payload.form });
    yield put(createMemberSuccess(members));
    yield put(closeModal());
    action.payload.resolve();
  }
  catch (error) {
    yield put(createMemberFailure(error));
    action.payload.reject();
  }
}
function* deleteMemberTask(action) {
  try {
    const members = yield call(api.deleteMember, {
      userId: action.payload.userId,
      projectId: action.payload.projectId
    });
    yield put(deleteMemberSuccess(members));
    yield put(closeModal());
  }
  catch (error) {
    yield put(deleteMemberFailure(error));
  }
}

function* watchFetchProjectDetailRequest() {
  yield takeEvery(actionTypes.PROJECT_DETAIL_FETCH_REQUEST, fetchProjectDetailTask);
}

function* watchUpdateProjectDetailRequest() {
  yield takeEvery(actionTypes.PROJECT_DETAIL_UPDATE_REQUEST, updateProjectDetailTask);
}

function* watchCreateMemberRequest() {
  yield takeEvery(actionTypes.MEMBER_CREATE_REQUEST, createMemberTask);
}

function* watchDeleteMemberRequest() {
  yield takeEvery(actionTypes.MEMBER_DELETE_REQUEST, deleteMemberTask);
}

export default function* projectDetailSaga() {
  yield all([
    watchFetchProjectDetailRequest(),
    watchUpdateProjectDetailRequest(),
    watchCreateMemberRequest(),
    watchDeleteMemberRequest()
  ]);
}
