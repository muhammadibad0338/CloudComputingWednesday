'use client';
import React from 'react'
import { styled } from '@mui/system';
import { makeStyles } from "@mui/styles";

import { getAwsVMwareData, } from '@/lib/actions/awsAction';

import { Box, colors, Container, Grid, Typography } from '@mui/material';

import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

import VMwareTable from './Components/VMwareTable';


const MainCntnr = styled(Grid)(({ theme }) => ({
    padding: '24px 24px 24px 24px',
    borderRadius: '30px',
    border: '1px solid rgba(255, 255, 255, 0.20)',
    background: 'rgba(255, 255, 255, 0.10)',
    boxShadow: '0px 4px 12px 0px rgba(0, 0, 0, 0.25)',
    backdropFilter: 'blur(10px)',
}));




const Page = () => {

    const dispatch = useDispatch();


    const { awsVmware, loading, error } = useSelector((state) => state.aws);
    const { comparisionService, filterloading, page, limit, countryName, type, generalizeMeasureUnit } = useSelector((state) => state.comparisionFilter);

    const [paramData, setParamData] = useState({
        'page': page,
        'limit': limit,
        'countryName': countryName
    })

    useEffect(() => {
        const mappedData = { page, limit, countryName, type, generalizeMeasureUnit };
        dispatch(getAwsVMwareData(mappedData));
    }, [page, limit, countryName, type, generalizeMeasureUnit]);


    if (loading || Object.keys(awsVmware).length == 0) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;


    return (
        <>
            <VMwareTable />
        </>
    )
}

export default Page