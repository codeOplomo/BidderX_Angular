import { ProfileVM } from "../../models/view-models/profile";

export interface UserState {
  user: ProfileVM | null; // Use the User type
  loading: boolean;
  error: any;
}

export const initialState: UserState = {
  user: null,
  loading: false,
  error: null
};
