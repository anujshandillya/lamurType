import type { Action, UserState } from "./types";

const reducer = (state: UserState, action: Action) => {
    switch (action.type) {
        case "SET_USER":
            return { ...state, ...action.payload };
        case "LOGOUT":
            return { ...state, _id: null, email: null, first_name: null, last_name: null, isAuthenticated: false };
        default:
            throw new Error(`Unhandled action type: ${action}`);
    }
}

export default reducer;