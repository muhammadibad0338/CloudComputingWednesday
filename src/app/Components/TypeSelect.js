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

import { setType } from '@/lib/slices/filtersSlice';

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


const unifiedType = [
    "Consumption",
    "Reservation"
]

const TypeSelect = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const { type } = useSelector((state) => state.comparisionFilter);

    const handleChange = (event) => {
        const { value } = event.target;
        dispatch(setType(value));
    };

    return (
        <Select
            displayEmpty
            value={type || ''}
            onChange={handleChange}
            input={<OutlinedInput />}
            renderValue={(selected) =>
                selected ? (
                    <Typography>{type}</Typography>
                ) : (
                    <em>Select Type</em>
                )
            }
            MenuProps={MenuProps}
            inputProps={{ 'aria-label': 'Select Type' }}
            sx={{ width: '250px', borderRadius: 2 }}
        >
            <MenuItem disabled value="">
                <em>Select Type</em>
            </MenuItem>
            {unifiedType.map((name) => (
                <MenuItem key={name} value={name}>
                    {name}
                </MenuItem>
            ))}
        </Select>
    );
}

export default TypeSelect