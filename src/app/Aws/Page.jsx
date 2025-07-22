'use client';

import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

import { Box, colors, Container, Grid, Typography } from '@mui/material';
import { makeStyles } from "@mui/styles";
import { styled } from '@mui/system';


import VMWarePage from "./VMware/Page"


const MainCntnr = styled(Grid)(({ theme }) => ({
    padding: '24px 24px 24px 24px',
    borderRadius: '30px',
    border: '1px solid rgba(255, 255, 255, 0.20)',
    background: 'rgba(255, 255, 255, 0.10)',
    boxShadow: '0px 4px 12px 0px rgba(0, 0, 0, 0.25)',
    backdropFilter: 'blur(10px)',
}));




const Page = () => {






    return (
        <MainCntnr container >
            <Grid size={{ xs: 12 }} mb={2} >
                <Typography variant='h4' >AWS Pricing </Typography>
            </Grid>
            <Grid size={{ xs: 12 }} >
                <VMWarePage />
            </Grid>

        </MainCntnr>
    )
}

export default Page