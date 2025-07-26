'use client';
import React from 'react'
import {
    Table,
    TableCell,
    TableContainer,
    TableHead,
    Typography,
    Paper,
    Box,
    TableBody,
    TableRow,
    tableCellClasses,
    Checkbox,
    IconButton,
    Collapse,
    TableFooter
} from '@mui/material';
import { makeStyles, } from "@mui/styles";
import { padding, styled, textAlign } from '@mui/system';
import { useDispatch, useSelector } from 'react-redux'
import CustomTablePagination from './CustomTablePagination';
import { setAzurePage, setAzureLimit } from '@/lib/slices/filtersSlice';


const useStyles = makeStyles((theme) => ({
    tableContainer: {
        fontFamily: "inherit",
    },
    tableRow: {
        cursor: 'pointer',
        "&:hover": {
            color: "#09926E",
            backgroundColor: "#f5f5f5",
        },
    },
    tableCell: {
        fontFamily: "inherit",
        // backgroundColor: "#0095FF",
        color: "#ffff !important",
        textAlign: "left",
        fontWeight: "bold",
        textTransform: "upperCase",
    },
    tableCellBody: {
        textAlign: "left",
        fontSize: '15px !important'
    },
    tableHead: {
        cursor: 'pointer',
        // backgroundImage: 'linear-gradient(rgba(76, 207, 248, 1), rgba(74, 75, 227, 1),rgba(35, 52, 156, 1)) !important',
    },
    noFound: {
        padding: '10px 20px',
        textAlign: 'center'
    }

}));


const TableHeadCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        borderRadius: "0px !important",
        border: 'none !important'
    },
    [`&.${tableCellClasses.body}`]: {
        // fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: '#EFEFEF',
    },
    '&:nth-of-type(even)': {
        backgroundColor: '#FFFFFF',
    },
}));




const AzureTable = () => {

    const classes = useStyles();

    const { azure, loading, error } = useSelector((state) => state.azure);
    const dispatch = useDispatch();

    return (
        <>
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer sx={{ maxHeight: '40vh' }} >
                    <Table stickyHeader  >
                        <TableHead sx={{ '& th': { backgroundImage: 'linear-gradient(rgba(76, 207, 248, 1), rgba(74, 75, 227, 1),rgba(35, 52, 156, 1)) !important', border: 'none' } }}  >
                            <TableRow className={classes.tableHead} >
                                <TableCell className={classes.tableCell} >
                                    SKU ID
                                </TableCell>
                                <TableCell className={classes.tableCell}>
                                    Region
                                </TableCell>
                                <TableCell className={classes.tableCell}>
                                    Location
                                </TableCell>
                                <TableCell className={classes.tableCell}>
                                    Service Name
                                </TableCell>
                                <TableCell className={classes.tableCell}>
                                    Product Name
                                </TableCell>
                                <TableCell className={classes.tableCell}>
                                    Type
                                </TableCell>
                                <TableCell className={classes.tableCell}>
                                    Unit of Measure
                                </TableCell>
                                <TableCell className={classes.tableCell}>
                                    Price
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                azure?.data.length == 0 ?
                                    <Typography className={classes.noFound} variant='h6' >No Match Result Found </Typography> :
                                    azure?.data?.map((service, ind) => {
                                        return (
                                            <StyledTableRow key={ind}  >
                                                <TableCell>
                                                    <Typography className={classes.tableCellBody} >{service?.skuId}</Typography>
                                                </TableCell>
                                                <TableCell >
                                                    <Typography className={classes.tableCellBody} >{service?.armRegionName}</Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography className={classes.tableCellBody} >{service?.location}</Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography className={classes.tableCellBody} >{service?.serviceName}</Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography className={classes.tableCellBody} >{service?.productName}</Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography className={classes.tableCellBody} >{service?.type}</Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography className={classes.tableCellBody} >{service?.unitOfMeasure}</Typography>
                                                </TableCell>
                                                <TableCell  >
                                                    <Typography className={classes.tableCellBody} >{service?.unitPrice}</Typography>
                                                </TableCell>
                                            </StyledTableRow>
                                        )
                                    })
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
                <CustomTablePagination
                    // data={azure?.data}
                    loading={loading}
                    page={azure?.currentPage}
                    rowsPerPage={azure?.perPage}
                    count={azure?.totalItems}
                    setPage={(page) => dispatch(setAzurePage(page))}
                    setRowsPerPage={(limit) => dispatch(setAzureLimit(limit))}
                />
            </Paper>
        </>
    )
}

export default AzureTable