import { configureStore } from '@reduxjs/toolkit'
import AzureSlice from './features/azureSlice'




export const makeStore = () => {
    return configureStore({
        reducer: {
            azure: AzureSlice,
        }
    })
}