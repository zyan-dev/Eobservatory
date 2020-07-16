import * as types from '../types';

const INITIAL_STATE = {
  width: 0,
  height: 0,
  visibleSideBar: true
};

const screenReducer = (state = INITIAL_STATE, action) => {
  switch(action.type) {
    case types.SET_DIMENSION:
      return {
        ...state,
        width: action.payload.width,
        height: action.payload.height,
        visibleSideBar: action.payload.width < 640 ? false : true
      }
    case types.SET_VISIBLE_SIDEBAR:
      return {
        ...state,
        visibleSideBar: action.payload
      }
    default: 
      return state;
  }
}

export default screenReducer;