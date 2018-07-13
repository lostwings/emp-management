import * as actionTypes from '../constants/actionTypes';

const projectDetail = (state = {}, action) => {
  switch (action.type) {
    case actionTypes.PROJECT_DETAIL_FETCH_REQUEST:
      return {
        ...state,
        isFetching: true,
        projectId: action.payload.projectId
      };
    case actionTypes.PROJECT_DETAIL_FETCH_SUCCESS:
      return {
        ...state,
        isFetching: false,
        ...action.payload.projectDetail
      };
    case actionTypes.PROJECT_DETAIL_FETCH_FAILURE:
      return {
        ...state,
        isFetching: false,
      };
    case actionTypes.PROJECT_DETAIL_UPDATE_REQUEST:
      return {
        ...state,
        form: action.payload.form
      };
    case actionTypes.PROJECT_DETAIL_UPDATE_SUCCESS:
      return {
        ...state,
        ...action.payload.projectDetail
      };
    case actionTypes.PROJECT_DETAIL_UPDATE_FAILURE:
      return {
        ...state,
        message: action.payload.message
      };
    case actionTypes.MEMBER_CREATE_REQUEST:
      return {
        ...state,
        form: action.payload.form
      };
    case actionTypes.MEMBER_CREATE_SUCCESS:
      return {
        ...state,
        members: action.payload.members
      };
    case actionTypes.MEMBER_CREATE_FAILURE:
      return {
        ...state,
        message: action.payload.message
      };
    case actionTypes.MEMBER_DELETE_REQUEST:
      return {
        ...state
      };
    case actionTypes.MEMBER_DELETE_SUCCESS:
      return {
        ...state,
        members: action.payload.members
      };
    case actionTypes.MEMBER_DELETE_FAILURE:
      return {
        ...state,
        message: action.payload.message
      };
    default:
      return state;
  }
};

export default projectDetail;
