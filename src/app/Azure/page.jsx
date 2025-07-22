'use client';

import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { getAzureData } from '@/lib/actions/azureActions';
import { Box, colors, Container, Grid } from '@mui/material';
import { makeStyles } from "@mui/styles";
import { styled } from '@mui/system';




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
    const [paramData, setParamData] = useState({
        'page': 2,
        'limit': 20
    })

    useEffect(() => {
        dispatch(getAzureData(paramData));
    }, [dispatch, paramData]);


    if (loading || Object.keys(azure).length == 0) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;



    return (
        <MainCntnr container >

            <Grid size={{xs:12}} >
                <h2>Azure Pricing</h2>
                <pre>{JSON.stringify(azure, null, 2)}</pre>
            </Grid>
        </MainCntnr>
    );
}
