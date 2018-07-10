import * as actionTypes from '../constants/actionTypes';

export const updateProbationStore = item =>({
  type: actionTypes.UPDATE_PROBATION_STORE,
  payload:{
    item
  }
});

export const fetchProfileRequest = id => ({
  type: actionTypes.PROFILE_FETCH_REQUEST,
  payload: {
    id
  }
});

export const fetchProfileSuccess = profile => ({
  type: actionTypes.PROFILE_FETCH_SUCCESS,
  payload: {
    profile
  }
});

export const fetchProfileFailure = message => ({
  type: actionTypes.PROFILE_FETCH_FAILURE,
  payload: {
    message
  }
});

export const updateProfileRequest = (form, resolve, reject, type) => ({
  type: actionTypes.PROFILE_UPDATE_REQUEST,
  payload: {
    form,
    resolve,
    reject,
    type
  }
});

export const updateProfileSuccess = profile => ({
  type: actionTypes.PROFILE_UPDATE_SUCCESS,
  payload: {
    profile
  }
});

export const updateProfileFailure = message => ({
  type: actionTypes.PROFILE_FETCH_FAILURE,
  payload: {
    message
  }
});

export const deleteProfileRequest = (profileType, profileId) => ({
  type: actionTypes.PROFILE_DELETE_REQUEST,
  payload: {
    profileType,
    profileId
  }
});

export const deleteProfileSuccess = (profileType, profileId) => ({
  type: actionTypes.PROFILE_DELETE_SUCCESS,
  payload: {
    profileType,
    profileId
  }
});

export const deleteProfileFailure = message => ({
  type: actionTypes.PROFILE_DELETE_FAILURE,
  payload: {
    message
  }
});

export const fetchProbationRequest = (id,probationId) => ({
  type: actionTypes.PROBATION_FETCH_REQUEST,
  payload:{
    id,
    probationId
  }
});

export const fetchProbationSuccess = profile => ({
  type: actionTypes.PROBATION_FETCH_SUCCESS,
  payload: {
    profile
  }
});

export const fetchProbationFailure = message => ({
  type: actionTypes.PROBATION_FETCH_FAILURE,
  payload: {
    message
  }
});

export const fetchPerformanceRequest = (id,year) => ({
  type: actionTypes.PERFORMANCE_FETCH_REQUEST,
  payload:{
    id,
    year
  }
});

export const fetchPerformanceSuccess = profile => ({
  type: actionTypes.PERFORMANCE_FETCH_SUCCESS,
  payload: {
    profile
  }
});

export const fetchPerformanceFailure = message => ({
  type: actionTypes.PERFORMANCE_FETCH_FAILURE,
  payload: {
    message
  }
});

export const clearProbationStore = () => ({
  type: actionTypes.CLEAR_PROBATION_STORE,
});
