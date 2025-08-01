'use client';

import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { getAzureData } from '@/lib/actions/azureActions';
import { Box, colors, Container, Grid, Typography, OutlinedInput } from '@mui/material';
import { makeStyles } from "@mui/styles";
import { styled } from '@mui/system';
import AzureTable from './Components/AzureTable';
import SearchIcon from '@mui/icons-material/Search';
import RegionPriceChart from '../Components/RegionPriceChart';



const MainCntnr = styled(Grid)(({ theme }) => ({
    padding: '24px 24px 24px 24px',
    borderRadius: '30px',
    border: '1px solid rgba(255, 255, 255, 0.20)',
    background: 'rgba(255, 255, 255, 0.10)',
    boxShadow: '0px 4px 12px 0px rgba(0, 0, 0, 0.25)',
    backdropFilter: 'blur(10px)',
}));

const useStyles = makeStyles((theme) => ({
    searchBar: {
        background: "linear-gradient(136deg, rgba(245, 245, 245, 0.9) 0%, rgba(255, 255, 255, 0.9) 100%)",
        border: '1px solid #ccc !important',
        borderRadius: '20px !important',
        color: '#333 !important',
        fontSize: '12px !important',
        outline: 'none !important',
        width: '250px !important',
        '& .MuiOutlinedInput-notchedOutline': {
            border: 'none !important',
        },
        '& input': {
            color: '#333 !important',
        },
        '& .MuiInputBase-root': {
            color: '#333 !important',
        }
    },
    searchIcon: {
        width: '24px',
        height: '24px'
    },
    selectFlex: {
        display: 'flex',
        justifyContent: 'space-between',
    }
}));


export default function AzurePage() {
    const dispatch = useDispatch();
    const classes = useStyles();





    const { azure, loading, error } = useSelector((state) => state.azure);
    const { comparisionService, filterloading, azurePage, azureLimit, countryName, type, generalizeMeasureUnit } = useSelector((state) => state.comparisionFilter);


    // Map comparisionService to actual filters
    useEffect(() => {
        const mappedData = { 'page': azurePage, 'limit': azureLimit, countryName, type, generalizeMeasureUnit };

        if (comparisionService === 'VMWARE') {
            mappedData.serviceName = 'Virtual Machines';
        } else if (comparisionService === 'RDBMS') {
            mappedData.serviceName = 'SQL Database';
        } else if (comparisionService === 'STORAGE') {
            mappedData.productName = 'Blob Storage';
        }

        dispatch(getAzureData(mappedData));

    }, [comparisionService, azurePage, azureLimit, countryName, type, generalizeMeasureUnit])


    if (loading || Object.keys(azure).length == 0) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;



    return (
        <MainCntnr container  >
            <Grid size={{ xs: 12 }} mb={2} >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', }}>
                    <Typography variant='h4' >Azure Pricing </Typography>
                    <OutlinedInput
                        className={classes.searchBar}
                        startAdornment={
                            <SearchIcon className={classes.searchIcon} />
                        }
                        placeholder='Search Product Name, SKU ID...'
                    />
                </Box>
            </Grid>
            <Grid size={{ xs: 12 }} mb={2} >
                {/* <RegionPriceChart
                    regions={[...new Set(azure?.data?.map(item => item.countryName))]}
                    prices={azure?.data?.map(item => parseFloat(item.unitPrice))}
                /> */}
            </Grid>
            <Grid size={{ xs: 12 }} >
                <AzureTable />
            </Grid>
        </MainCntnr>
    );
}
