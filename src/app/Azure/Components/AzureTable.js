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
    Collapse
} from '@mui/material';
import { makeStyles, } from "@mui/styles";
import { styled } from '@mui/system';
import { useDispatch, useSelector } from 'react-redux'


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

    return (
        <>
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer sx={{ maxHeight: '40vh' }} >
                    <Table stickyHeader  >
                        <TableHead sx={{ '& th': { backgroundImage: 'linear-gradient(rgba(76, 207, 248, 1), rgba(74, 75, 227, 1),rgba(35, 52, 156, 1)) !important',border:'none'  } }}  >
                            <TableRow className={classes.tableHead} >
                                <TableCell className={classes.tableCell} >
                                    ID
                                    {/* Product ID */}
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
                                azure?.data?.map((service, ind) => {
                                    return (
                                        <StyledTableRow key={ind}  >
                                            <TableCell>
                                                <Typography className={classes.tableCellBody} >{service?.productId}</Typography>
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
            </Paper>
        </>
    )
}

export default AzureTable