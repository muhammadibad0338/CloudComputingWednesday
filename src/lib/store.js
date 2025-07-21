import { configureStore } from '@reduxjs/toolkit'
import AzureSlice from './slices/azureSlice'




export const makeStore = () => {
    return configureStore({
        reducer: {
            azure: AzureSlice,
        }
    })
}