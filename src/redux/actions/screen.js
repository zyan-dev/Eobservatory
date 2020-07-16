import * as types from '../types';

export const setDimension = (dimension) => ({
  type: types.SET_DIMENSION,
  payload: dimension
})

export const setVisibleSideBar = (visible) => ({
  type: types.SET_VISIBLE_SIDEBAR,
  payload: visible
})