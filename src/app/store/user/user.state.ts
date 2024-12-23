import { User } from "./user.model";

export interface UserState {
  user: User | null; // Use the User type
  loading: boolean;
  error: any;
}

export const initialState: UserState = {
  user: null,
  loading: false,
  error: null
};
