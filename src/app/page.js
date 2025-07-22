'use client';
import { useEffect, useState } from 'react';
import Image from "next/image";
import AzurePage from "./Azure/page";



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
          <AzurePage />
        </Grid>
      </Grid>
    </Container>
  );
}
