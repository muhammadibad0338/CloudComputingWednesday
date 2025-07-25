'use client';
import { useEffect, useState } from 'react';
import Image from "next/image";
import AzurePage from "./Azure/page";
import AwsPage from "./Aws/Page"

import { setServiceMainFilter } from '@/lib/slices/filtersSlice';

import { Box, colors, Container, Grid, OutlinedInput, MenuItem, Select } from '@mui/material';
import Snackbar, { SnackbarOrigin } from '@mui/material/Snackbar';
import { styled } from '@mui/system';

import { useDispatch, useSelector } from 'react-redux';
import ComparisionSelect from './Components/ComparisionSelectBox';
import LocationSelect from './Components/LocationSelect';
import TypeSelect from './Components/TypeSelect';


const WarningSnackbar = styled(Snackbar)(({ theme }) => ({
  color: '#fff'
}));




export default function Home() {

  const dispatch = useDispatch();
  const { comparisionService, loading, error } = useSelector((state) => state.comparisionFilter);

  const [isSnackbarOpen, setIsSnackbarOpen] = useState(true)






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
        <Grid size={{ xs: 12 }}   >
          <ComparisionSelect />
          <LocationSelect/>
          <TypeSelect />
        </Grid>
        {comparisionService.trim().length != 0 && <Grid size={{ xs: 12 }} mt={2}  >
          <AzurePage />
        </Grid>}
        {comparisionService.trim().length != 0 && <Grid size={{ xs: 12 }} mt={2} mb={2} >
          <AwsPage />
        </Grid>}
      </Grid>
    </Container>
  );
}
