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

import { setCountryName } from '@/lib/slices/filtersSlice';

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


const unifiedCountries = [
    "Asia",
    "Australia",
    "Austria",
    "Belgium",
    "Brazil",
    "Canada",
    "Chile",
    "Europe",
    "France",
    "Germany",
    "Global",
    "Hong Kong",
    "India",
    "Indonesia",
    "Ireland",
    "Israel",
    "Italy",
    "Japan",
    "Malaysia",
    "Mexico",
    "Middle East & Africa",
    "Netherlands",
    "New Zealand",
    "North America",
    "Norway",
    "Oceania",
    "Poland",
    "Qatar",
    "Singapore",
    "South Africa",
    "South America",
    "South Korea",
    "Spain",
    "Sweden",
    "Switzerland",
    "Taiwan",
    "USA",
    "United Arab Emirates",
    "United Kingdom",
    "Unknown",
    "Thailand",
    "China",
    "Bahrain"
];


const LocationSelect = () => {

    const theme = useTheme();
    const dispatch = useDispatch();
    const { countryName } = useSelector((state) => state.comparisionFilter);

    const handleChange = (event) => {
        const { value } = event.target;
        dispatch(setCountryName(value));
    };

    return (
        <Select
            displayEmpty
            value={countryName || ''}
            onChange={handleChange}
            input={<OutlinedInput />}
            renderValue={(selected) =>
                selected ? (
                    <Typography>{countryName}</Typography>
                ) : (
                    <em>Select Geography</em>
                )
            }
            MenuProps={MenuProps}
            inputProps={{ 'aria-label': 'Select Geography' }}
            sx={{ width: '250px', borderRadius: 2 }}
        >
            <MenuItem disabled value="">
                <em>Select Geography</em>
            </MenuItem>
            {unifiedCountries.map((name) => (
                <MenuItem key={name} value={name}>
                    {name}
                </MenuItem>
            ))}
        </Select>
    );
}

export default LocationSelect