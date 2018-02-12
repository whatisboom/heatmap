import { SET_LOCATION_DATA } from "../actions/types";

export function data(data = [], action) {
  console.log(data, action)
  switch (action.type) {
    case SET_LOCATION_DATA:
      return action.data;
    default:
      return data;
  }
}