'use client';

import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

import { Box, colors, Container, Grid, Typography, OutlinedInput } from '@mui/material';
import { makeStyles } from "@mui/styles";
import { styled } from '@mui/system';
import SearchIcon from '@mui/icons-material/Search';

import VMWarePage from "./VMware/Page"
import RdsPage from "./Rds/page"
import SThreePage from "./SThree/page"


const MainCntnr = styled(Grid)(({ theme }) => ({
    padding: '24px 24px 24px 24px',
    borderRadius: '30px',
    border: '1px solid rgba(255, 255, 255, 0.20)',
    background: 'rgba(255, 255, 255, 0.10)',
    boxShadow: '0px 4px 12px 0px rgba(0, 0, 0, 0.25)',
    backdropFilter: 'blur(10px)',
}));

let AwsServiceComponent = {
    'VMWARE': <VMWarePage />,
    'RDBMS': <RdsPage />,
    'STORAGE': <SThreePage />,
}

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



const Page = () => {
    const classes = useStyles();

    const { comparisionService, filterloading, page, limit } = useSelector((state) => state.comparisionFilter);




    return (
        <MainCntnr container >
            <Grid size={{ xs: 12 }} mb={2} >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', }}>
                    <Typography variant='h4' >AWS Pricing </Typography>
                    <OutlinedInput
                        className={classes.searchBar}
                        startAdornment={
                            <SearchIcon className={classes.searchIcon} />
                        }
                        placeholder='Search Product Name, SKU ID...'
                    />
                </Box>
            </Grid>
            <Grid size={{ xs: 12 }} >
                {AwsServiceComponent[comparisionService]}
            </Grid>

        </MainCntnr>
    )
}

export default Page