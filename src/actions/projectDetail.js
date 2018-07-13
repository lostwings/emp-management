import * as actionTypes from '../constants/actionTypes';

export const fetchProjectDetailRequest = projectId => ({
  type: actionTypes.PROJECT_DETAIL_FETCH_REQUEST,
  payload: {
    projectId
  }
});

export const fetchProjectDetailSuccess = projectDetail => ({
  type: actionTypes.PROJECT_DETAIL_FETCH_SUCCESS,
  payload: {
    projectDetail
  }
});

export const fetchProjectDetailFailure = message => ({
  type: actionTypes.PROJECT_DETAIL_FETCH_FAILURE,
  payload: {
    message
  }
});

export const updateProjectDetailRequest = (form, resolve, reject) => ({
  type: actionTypes.PROJECT_DETAIL_UPDATE_REQUEST,
  payload: {
    form,
    resolve,
    reject
  }
});

export const updateProjectDetailSuccess = projectDetail => ({
  type: actionTypes.PROJECT_DETAIL_UPDATE_SUCCESS,
  payload: {
    projectDetail
  }
});

export const updateProjectDetailFailure = message => ({
  type: actionTypes.PROJECT_DETAIL_UPDATE_FAILURE,
  payload: {
    message
  }
});

export const createMemberRequest = (form, resolve, reject) => ({
  type: actionTypes.MEMBER_CREATE_REQUEST,
  payload: {
    form,
    resolve,
    reject
  }
});

export const createMemberSuccess = members => ({
  type: actionTypes.MEMBER_CREATE_SUCCESS,
  payload: {
    members
  }
});

export const createMemberFailure = message => ({
  type: actionTypes.MEMBER_CREATE_FAILURE,
  payload: {
    message
  }
});

export const deleteMemberRequest = (userId, projectId) => ({
  type: actionTypes.MEMBER_DELETE_REQUEST,
  payload: {
    userId,
    projectId
  }
});

export const deleteMemberSuccess = members => ({
  type: actionTypes.MEMBER_DELETE_SUCCESS,
  payload: {
    members
  }
});

export const deleteMemberFailure = message => ({
  type: actionTypes.MEMBER_DELETE_FAILURE,
  payload: {
    message
  }
});
