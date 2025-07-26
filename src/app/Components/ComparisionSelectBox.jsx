'use client';

import React from 'react';
import {
    Select,
    MenuItem,
    OutlinedInput,
    Box,
    Typography,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';

import { setAzurePage, setAzureLimit, setPage, setLimit } from '@/lib/slices/filtersSlice';

import { setServiceMainFilter } from '@/lib/slices/filtersSlice';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const ComparisionSelect = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const { comparisionService } = useSelector((state) => state.comparisionFilter);

    const handleChange = (event) => {
        const { value } = event.target;
        dispatch(setServiceMainFilter(value));
    };

    const comparision = [
        { name: 'Aws VMWARE VS Azure Virtual Machine', value: 'VMWARE' },
        { name: 'Aws S3 VS Azure Blob Storage', value: 'STORAGE' },
        { name: 'Aws RDS VS Azure SQL Database', value: 'RDBMS' },
    ];

    const resetPagination = () => {
        dispatch(setPage(1));
        dispatch(setLimit(100));
        dispatch(setAzurePage(1));
        dispatch(setAzureLimit(100));
    }

    return (
        <Select
            displayEmpty
            value={comparisionService || ''}
            onChange={handleChange}
            input={<OutlinedInput />}
            renderValue={(selected) =>
                selected ? (
                    <Typography>{comparision.find(item => item.value === selected)?.name}</Typography>
                ) : (
                    <em>Select Comparison Service</em>
                )
            }
            MenuProps={MenuProps}
            inputProps={{ 'aria-label': 'Select Comparison Service' }}
            sx={{ width: '350px', borderRadius: 2 }}
        >
            <MenuItem disabled value="">
                <em>Select Comparison Service</em>
            </MenuItem>
            {comparision.map(({ name, value }) => (
                <MenuItem key={value} value={value}>
                    {name}
                </MenuItem>
            ))}
        </Select>
    );
};

export default ComparisionSelect;
