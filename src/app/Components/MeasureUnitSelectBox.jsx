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

import { setGeneralizeMeasureUnit } from '@/lib/slices/filtersSlice';

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


let unifiedMeasureUnits = [
    "Hour",
    "Month",
    "GB",
    "API Calls",
    "IOs",
    "Quantity",
    "Day",
    "Second",
    "Minute",
    "Year",
    "MB",
]

const MeasureUnitSelectBox = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const { generalizeMeasureUnit } = useSelector((state) => state.comparisionFilter);

    const handleChange = (event) => {
        const { value } = event.target;
        dispatch(setGeneralizeMeasureUnit(value));
    };

    return (
        <Select
            displayEmpty
            value={generalizeMeasureUnit || ''}
            onChange={handleChange}
            input={<OutlinedInput />}
            renderValue={(selected) =>
                selected ? (
                    <Typography>{generalizeMeasureUnit}</Typography>
                ) : (
                    <em>Select Measure Unit</em>
                )
            }
            MenuProps={MenuProps}
            inputProps={{ 'aria-label': 'Select Measure Unit' }}
            sx={{ width: '250px', borderRadius: 2 }}
        >
            <MenuItem disabled value="">
                <em>Select Measure Unit</em>
            </MenuItem>
            {unifiedMeasureUnits.map((name) => (
                <MenuItem key={name} value={name}>
                    {name}
                </MenuItem>
            ))}
        </Select>
    );
}

export default MeasureUnitSelectBox