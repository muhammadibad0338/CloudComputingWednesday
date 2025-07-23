import { configureStore } from '@reduxjs/toolkit'
import AzureSlice from './slices/azureSlice'
import AwsSlice from './slices/awsSlice'
import ServicesFilterSlice from './slices/filtersSlice'



export const makeStore = () => {
    return configureStore({
        reducer: {
            azure: AzureSlice,
            aws: AwsSlice,
            comparisionFilter: ServicesFilterSlice
        }
    })
}