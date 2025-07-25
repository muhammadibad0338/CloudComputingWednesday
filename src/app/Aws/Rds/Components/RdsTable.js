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


const RdsTable = () => {

    const classes = useStyles();

    const { awsRds, loading, error } = useSelector((state) => state.aws);
    const { comparisionService, filterloading, page, limit } = useSelector((state) => state.comparisionFilter);

    return (
        <>
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer sx={{ maxHeight: '40vh' }} >
                    <Table stickyHeader  >
                        <TableHead sx={{ '& th': { backgroundImage: 'linear-gradient(rgba(76, 207, 248, 1), rgba(74, 75, 227, 1),rgba(35, 52, 156, 1)) !important', border: 'none' } }}  >
                            <TableRow className={classes.tableHead} >
                                <TableCell className={classes.tableCell} >
                                    SKU ID
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
                                    Product Name
                                </TableCell>
                                <TableCell className={classes.tableCell}>
                                    Network Performance
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
                            {awsRds?.data.length == 0 ?
                                <Typography className={classes.noFound} variant='h6' >No Match Result Found </Typography> :
                                awsRds?.data?.map((service, ind) => {
                                    return (
                                        <StyledTableRow key={ind}  >
                                            <TableCell>
                                                <Typography className={classes.tableCellBody} >{service?.sku}</Typography>
                                            </TableCell>
                                            <TableCell >
                                                <Typography className={classes.tableCellBody} >{service?.regionCode}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography className={classes.tableCellBody} >{service?.location}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography className={classes.tableCellBody} >{service?.servicename}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography className={classes.tableCellBody} >{service?.productFamily}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography className={classes.tableCellBody} >{service?.type}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography className={classes.tableCellBody} >{service?.unit}</Typography>
                                            </TableCell>
                                            <TableCell  >
                                                <Typography className={classes.tableCellBody} >
                                                    {Number(service?.pricePerUnitUSD) > 0
                                                        ? Number(service?.pricePerUnitUSD).toFixed(6)
                                                        : 'Zero-rated'}
                                                </Typography>
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

export default RdsTable