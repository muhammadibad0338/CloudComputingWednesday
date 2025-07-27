'use client';
import { useEffect, useState } from 'react';
import Image from "next/image";
import AzurePage from "./Azure/page";
import AwsPage from "./Aws/Page"

import { setServiceMainFilter } from '@/lib/slices/filtersSlice';

import { Box, colors, Container, Grid, OutlinedInput, MenuItem, Select, Button } from '@mui/material';
import Snackbar, { SnackbarOrigin } from '@mui/material/Snackbar';
import { display, flexWrap, justifyContent, styled } from '@mui/system';

import { useDispatch, useSelector } from 'react-redux';
import ComparisionSelect from './Components/ComparisionSelectBox';
import LocationSelect from './Components/LocationSelect';
import TypeSelect from './Components/TypeSelect';
import MeasureUnitSelectBox from './Components/MeasureUnitSelectBox';
import RestoreIcon from '@mui/icons-material/Restore';

import { setCountryName, setType, setGeneralizeMeasureUnit } from '@/lib/slices/filtersSlice';
import RegionPriceChart from './Components/RegionPriceChart';


const WarningSnackbar = styled(Snackbar)(({ theme }) => ({
  color: '#fff'
}));


const AWSChart = () => {
  const { azure, loading, } = useSelector((state) => state.aws);
}



export default function Home() {

  const dispatch = useDispatch();
  const { comparisionService, countryName } = useSelector((state) => state.comparisionFilter);

  const { azure, loading, } = useSelector((state) => state.azure);

  const [isSnackbarOpen, setIsSnackbarOpen] = useState(true)


  const resetFilters = () => {
    dispatch(setCountryName(''));
    dispatch(setType(''));
    dispatch(setGeneralizeMeasureUnit(''));
  }




  return (
    <Container maxWidth='fl'  >
      <Grid container >
        <Grid size={{ xs: 12 }}   >
          <Box  >
            <WarningSnackbar
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
              open={isSnackbarOpen}
              autoHideDuration={8000}
              onClose={() => setIsSnackbarOpen(false)}
              message="This pricing list is for informational purposes only. 
                            All prices are subject to the additional terms outlined on the official pricing and service pages"
            />
          </Box>
        </Grid>
        <Grid size={{ xs: 12 }} >
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', gap: 2, mt: 2 }}>
            <ComparisionSelect />
            {comparisionService && <LocationSelect />}
            {comparisionService && <TypeSelect />}
            {comparisionService && <MeasureUnitSelectBox />}
            {comparisionService && <Button onClick={resetFilters} sx={{ color: 'red' }} variant="contained" endIcon={<RestoreIcon />}>
              Reset Filters
            </Button>}
          </Box>
        </Grid>
        {comparisionService.trim().length != 0 && <Grid size={{ xs: 12 }} mt={2}  >
          <AzurePage />
        </Grid>}
        {comparisionService.trim().length != 0 && <Grid size={{ xs: 12 }} mt={2} mb={2} >
          <AwsPage />
        </Grid>}
        {countryName.trim().length == 0 && <Grid size={{ xs: 12 }} >
          {(!loading && azure?.data?.length > 0) && <RegionPriceChart
            regions={[...new Set(azure?.data?.map(item => item.countryName))]}
            prices={azure?.data?.map(item => parseFloat(item.unitPrice))}
          />}
        </Grid>}
      </Grid>
    </Container>
  );
}
