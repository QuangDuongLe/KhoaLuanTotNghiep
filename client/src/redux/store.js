import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './Slide/counterSlide'
import userReducer from './Slide/userSlice'
export const store = configureStore({
  reducer: {
    counter: counterReducer,
    user: userReducer
  },
})

