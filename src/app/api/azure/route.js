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

        // const type = await Azure.distinct("type");
        // const countryName = await Azure.distinct("countryName");

        const result = await Azure.updateMany(
            { type: 'DevTestConsumption' },
            { $set: { type: 'Consumption' } }
        );

        return NextResponse.json(
            // { message: "✅ Country names added successfully based on armRegionName." },
            {
                result,
                // type,
                // countryName
            },
            { status: 200 }
        );


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


