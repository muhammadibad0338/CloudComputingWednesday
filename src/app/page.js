'use client';
import { useEffect, useState } from 'react';
import Image from "next/image";
import AzurePage from "./Azure/page";
import AwsPage from "./Aws/Page"


import { Box, colors, Container, Grid } from '@mui/material';
import Snackbar, { SnackbarOrigin } from '@mui/material/Snackbar';
import { styled } from '@mui/system';


const WarningSnackbar = styled(Snackbar)(({ theme }) => ({
  color: '#fff'
}));


export default function Home() {

  const [isSnackbarOpen, setIsSnackbarOpen] = useState(true)


  return (
    <Container maxWidth='fl'  >
      <Grid container sx={{ backgroundColor: '#E7EAEE' }} >
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
        <Grid size={{ xs: 12 }} mt={2}  >
          <AzurePage />
        </Grid>
        <Grid size={{ xs: 12 }} mt={2} >
          <AwsPage />
        </Grid>
      </Grid>
    </Container>
  );
}
