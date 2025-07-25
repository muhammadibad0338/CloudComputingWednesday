'use client';
import React from 'react'
import { styled } from '@mui/system';
import { makeStyles } from "@mui/styles";

import { getAwsRdsData, } from '@/lib/actions/awsAction';

import { Box, colors, Container, Grid, Typography } from '@mui/material';

import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import RdsTable from './Components/RdsTable';

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


    const { awsRds, loading, error } = useSelector((state) => state.aws);
    const { comparisionService, filterloading, page, limit, countryName, type } = useSelector((state) => state.comparisionFilter);

    const [paramData, setParamData] = useState({
        'page': page,
        'limit': limit,
        'countryName': countryName
    })

    useEffect(() => {
        const mappedData = { page, limit, countryName, type };
        dispatch(getAwsRdsData(mappedData));
    }, [page, limit, countryName, type]);


    if (loading || Object.keys(awsRds).length == 0) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;


    return (
        <>
            <RdsTable />
        </>
    )
}

export default Page