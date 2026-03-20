import { IUser } from "@/models.ts/user.model";
import { createSlice } from "@reduxjs/toolkit";

interface IUserSlicer{
    userData : IUser | null
}

const initialState : IUserSlicer = {
    userData : null
}

const userSlice = createSlice({
    name : "user",
    initialState,
    reducers:{
        setUserData : (state,action) => {
            state.userData = action.payload
        }
    }
})

export const {setUserData} = userSlice.actions
export default userSlice.reducer