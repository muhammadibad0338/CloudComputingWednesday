import React from 'react'
import {
    Typography,
    Paper,
    Box,
    TableFooter,
    TableRow,
    TablePagination
} from '@mui/material';
import { makeStyles, } from "@mui/styles";
import { styled } from '@mui/system';


import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

const useStyles = makeStyles((theme) => ({
    paginationBtnCntnr: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '20px'
    },
    light: {
        width: '99px',
        height: '99px'
    },
    paginationIcon: {
        height: '12px',
        width: '12px'
    },
    lightCntnr: {
        border: ' 2px solid #4CCFF8',
        borderRadius: '30px',
        background: 'linear-gradient(142deg, rgba(35, 52, 156, 0.10) 0%, rgba(74, 75, 227, 0.50) 100%)',
        backdropFilter: 'blur(10px)'
    }
}));

const PaginationCntnr = styled(Box)(({ theme }) => ({
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
}));

const PaginationBtn = styled('button')(({ theme }) => ({
    borderRadius: '36px',
    border: '1px solid rgba(255, 255, 255, 0.20)',
    background: 'rgba(255, 255, 255, 0.10)',
    backdropFilter: 'blur(12px)',
    color: '#FFF',
    padding: '9px',
    cursor: 'pointer'
}));

const CustomTablePagination = ({
    setPage,
    setRowsPerPage,
    page,
    rowsPerPage,
    count
}) => {
    const classes = useStyles();


    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(1);
    };

    return (
        <>
            <TableFooter>
                <TableRow>
                    <TablePagination
                        rowsPerPageOptions={[100, 200, 300]}
                        component="div"
                        count={count}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </TableRow>
            </TableFooter>
        </>
    )
}

export default CustomTablePagination