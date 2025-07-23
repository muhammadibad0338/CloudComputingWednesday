'use client';

import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { getAzureData } from '@/lib/actions/azureActions';
import { Box, colors, Container, Grid, Typography } from '@mui/material';
import { makeStyles } from "@mui/styles";
import { styled } from '@mui/system';
import AzureTable from './Components/AzureTable';




const MainCntnr = styled(Grid)(({ theme }) => ({
    padding: '24px 24px 24px 24px',
    borderRadius: '30px',
    border: '1px solid rgba(255, 255, 255, 0.20)',
    background: 'rgba(255, 255, 255, 0.10)',
    boxShadow: '0px 4px 12px 0px rgba(0, 0, 0, 0.25)',
    backdropFilter: 'blur(10px)',
}));



export default function AzurePage() {
    const dispatch = useDispatch();





    const { azure, loading, error } = useSelector((state) => state.azure);
    const { comparisionService, filterloading, page, limit } = useSelector((state) => state.comparisionFilter);


    // const [paramData, setParamData] = useState({
    //     'page': page,
    //     'limit': limit,

    // })

    // useEffect(() => {
    //     dispatch(getAzureData(paramData));
    // }, [dispatch, page, limit]);


    // Map comparisionService to actual filters
    useEffect(() => {
        const mappedData = { page, limit };

        if (comparisionService === 'VMWARE') {
            mappedData.serviceName = 'Virtual Machines';
        } else if (comparisionService === 'RDBMS') {
            mappedData.serviceName = 'SQL Database';
        } else if (comparisionService === 'STORAGE') {
            mappedData.productName = 'Blob Storage';
        }

        dispatch(getAzureData(mappedData));

    }, [comparisionService, page, limit])


    if (loading || Object.keys(azure).length == 0) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;



    return (
        <MainCntnr container  >
            <Grid size={{ xs: 12 }} mb={2} >
                <Typography variant='h4' >Azure Pricing </Typography>
            </Grid>
            <Grid size={{ xs: 12 }} >
                <AzureTable />
            </Grid>
        </MainCntnr>
    );
}
