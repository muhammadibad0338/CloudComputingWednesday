import connectMongoDB from "../mongodb";
import Azure from "../models/azureModel";
import { NextResponse } from "next/server";

import mongoose, { Schema } from "mongoose";



const PAGE_SIZE = 1000;
const TOTAL_PAGES = 1000; // 1000 pages × 1000 records = 1,000,000

export async function POST() {
    try {
        await connectMongoDB();

        for (let i = 0; i < TOTAL_PAGES; i++) {
            const skip = i * PAGE_SIZE;
            const url = `https://prices.azure.com/api/retail/prices?api-version=2023-01-01-preview&$skip=${skip}`;

            const response = await fetch(url);
            if (!response.ok) {
                console.error(`❌ Failed to fetch page ${i + 1}:`, response.statusText);
                continue;
            }

            const data = await response.json();
            const items = data.Items || [];

            // Convert effectiveStartDate to Date objects
            const cleanedItems = items.map(item => ({
                ...item,
                effectiveStartDate: new Date(item.effectiveStartDate),
            }));

            // Insert into MongoDB, skip duplicates
            try {
                await Azure.insertMany(cleanedItems, { ordered: false });
                console.log(`✅ Inserted page ${i + 1} (${items.length} records)`);
            } catch (insertErr) {
                console.warn(`⚠️ Insert error on page ${i + 1}:`, insertErr?.writeErrors?.length ?? insertErr);
            }

            // Optional delay to avoid rate limits (adjust as needed)
            await new Promise(res => setTimeout(res, 200)); // 200ms pause
        }

        return NextResponse.json(
            { message: "✅ Successfully fetched and inserted 1M Azure pricing records." },
            { status: 200 }
        );

    } catch (err) {
        console.error("❌ Error in Azure data import:", err);
        return NextResponse.json(
            { error: "Failed to fetch or insert Azure pricing data." },
            { status: 500 }
        );
    }
}




// GET API with pagination

export async function GET(req) {
    try {
        await connectMongoDB();

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = parseInt(searchParams.get('limit')) || 25;
        const skip = (page - 1) * limit;

        const ALLOWED_FILTERS = [
            'armRegionName',
            'productName',
            'serviceName',
            'serviceFamily',
            'priceType',
            'currencyCode',
            'skuName',
            'unitOfMeasure',
            'type',
            'countryName'
        ];

        const mongoFilter = {};

        for (const key of searchParams.keys()) {
            if (ALLOWED_FILTERS.includes(key)) {
                const value = searchParams.get(key);
                if (value.trim().length > 0) {
                    if (value.includes(',')) {
                        // Support multiple values as array (e.g., ?armRegionName=westus,eastus)
                        mongoFilter[key] = { $in: value.split(',').map(v => v.trim()) };
                    } else {
                        mongoFilter[key] = value.trim();
                    }
                }
            }
        }

        const [data, total] = await Promise.all([
            Azure.find(mongoFilter).skip(skip).limit(limit),
            Azure.countDocuments(mongoFilter),
        ]);

        const totalPages = Math.ceil(total / limit);

        return NextResponse.json({
            success: true,
            // filtersUsed: mongoFilter,
            currentPage: page,
            totalPages,
            totalItems: total,
            perPage: limit,
            data,
        }, { status: 200 });

    } catch (error) {
        console.error('GET /api/azure error:', error);
        return NextResponse.json({
            success: false,
            message: 'Server Error',
        }, { status: 500 });
    }
}



// For Filtering
export async function PUT(req) {
    try {
        await connectMongoDB();

        // const unitOfMeasure = await Azure.distinct("unitOfMeasure");
        // const countryName = await Azure.distinct("countryName");

        // const result = await Azure.updateMany(
        //     { type: 'DevTestConsumption' },
        //     { $set: { type: 'Consumption' } }
        // );
        const updates = [
            {
                units: [
                    "1 Hour",
                    "1 GB Hour",
                    "1 GiB Hour",
                    "1 GB/Hour",
                    "1 GiB/Hour",
                    "1/Hour",
                    "100/Hour",
                    "10K/Hour",
                    "100 Hours"
                ],
                value: "Hour"
            },
            {
                units: [
                    "1 Month",
                    "1/Month",
                    "100/Month",
                    "10K/Month",
                    "1K/Month",
                    "1M/Month",
                    "5/Month",
                    "1 GB/Month",
                    "1 GiB/Month",
                    "1 TB/Month",
                    "1 MB/Day"
                ],
                value: "Month"
            },
            {
                units: [
                    "1 GB",
                    "1 GiB"
                ],
                value: "GB"
            },
            {
                units: [
                    "1 API Calls"
                ],
                value: "API Calls"
            },
            {
                units: [
                    "1 IOPS/Month"
                ],
                value: "IOs"
            },
            {
                units: [
                    "1",
                    "1 Count",
                    "1 Rotation",
                    "10",
                    "100",
                    "100K",
                    "10K",
                    "10M",
                    "1K",
                    "25K",
                    "50K"
                ],
                value: "Quantity"
            },
            {
                units: [
                    "1 Day",
                    "1 GB/Day",
                    "1K/Day",
                    "1/Day"
                ],
                value: "Day"
            },
            {
                units: [
                    "1 Second",
                    "1 GB Second",
                    "1 GiB Second",
                    "100 Seconds",
                    "100 GB Seconds"
                ],
                value: "Second"
            },
            {
                units: [
                    "1 Minute"
                ],
                value: "Minute"
            },
            {
                units: [
                    "1/Year"
                ],
                value: "Year"
            },
            {
                units: [
                    "1 MB",
                    "1 MB/Month"
                ],
                value: "MB"
            }
        ];


        let totalUpdated = 0;

        for (const update of updates) {
            const result = await Azure.updateMany(
                {
                    unitOfMeasure: { $in: update.units },
                    $or: [
                        { generalizeMeasureUnit: { $exists: false } },
                        { generalizeMeasureUnit: "" }
                    ]
                },
                { $set: { generalizeMeasureUnit: update.value } }
            );

            totalUpdated += result.modifiedCount;
        }

        return NextResponse.json({
            success: true,
            updatedCount: totalUpdated,
            message: `Updated ${totalUpdated} AZURE pricing documents with generalizeMeasureUnit`,
        }, { status: 200 })





        // return NextResponse.json(
        //     // { message: "✅ Country names added successfully based on armRegionName." },
        //     {
        //         unitOfMeasure,
        //         // type,
        //         // countryName
        //     },
        //     { status: 200 }
        // );


    } catch (err) {
        console.error("❌ Error fetching services and products:", err);
        return NextResponse.json({
            error: "Failed to fetch unique service and product names."
        }, { status: 500 });
    }
}


function mapAwsToAzureType(awsItem) {
    const term = awsItem.offerTermCode?.toUpperCase() || "";
    const usage = awsItem.usagetype?.toLowerCase() || "";
    const desc = awsItem.description?.toLowerCase() || "";

    if (term === 'JRTCKXETXF') return 'Consumption';
    if (/ri[1-5]/i.test(term) || ['0006P', 'B63B'].includes(term)) return 'Reservation';
    if (usage.includes('devtest') || desc.includes('devtest')) return 'DevTestConsumption';

    return 'Consumption'; // fallback default
}


