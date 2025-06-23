export type UserState = {
  _id: null | string;
  email: null | string;
  first_name: null | string;
  last_name: null | string;
  isAuthenticated: boolean;
};

export type Action =
  | {
      type: "SET_USER";
      payload: UserState;
    }
  | {
      type: "LOGOUT";
    };

export type ProviderState = {
  user: UserState;
  dispatch: React.Dispatch<any>;
};
