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
        ];

        const mongoFilter = {};

        for (const key of searchParams.keys()) {
            if (ALLOWED_FILTERS.includes(key)) {
                const value = searchParams.get(key);
                if (value.includes(',')) {
                    // Support multiple values as array (e.g., ?armRegionName=westus,eastus)
                    mongoFilter[key] = { $in: value.split(',').map(v => v.trim()) };
                } else {
                    mongoFilter[key] = value.trim();
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

        // const uniqueServices = await Azure.distinct("armRegionName");
        // const uniqueProducts = await Azure.distinct("location");

        const azureRegionCountries = [
            { code: "", countryName: "Unknown" },
            { code: "Asia", countryName: "Asia" },
            { code: "Azure Stack", countryName: "Global" },
            { code: "Azure Stack US Gov", countryName: "USA" },
            { code: "Europe", countryName: "Europe" },
            { code: "Global", countryName: "Global" },
            { code: "India", countryName: "India" },
            { code: "Intercontinental", countryName: "Global" },
            { code: "Middle East And Africa", countryName: "Middle East & Africa" },
            { code: "North America", countryName: "North America" },
            { code: "Oceania", countryName: "Oceania" },
            { code: "South America", countryName: "South America" },
            { code: "US Gov", countryName: "USA" },
            { code: "US Gov Zone 1", countryName: "USA" },
            { code: "US Gov Zone 2", countryName: "USA" },
            { code: "Zone 1", countryName: "USA" },
            { code: "Zone 2", countryName: "USA" },
            { code: "Zone 3", countryName: "USA" },
            { code: "Zone 4", countryName: "USA" },
            { code: "Zone 5", countryName: "USA" },
            { code: "Zone 6", countryName: "USA" },
            { code: "Zone 7", countryName: "USA" },
            { code: "Zone 8", countryName: "USA" },
            { code: "attatlanta1", countryName: "USA" },
            { code: "attdallas1", countryName: "USA" },
            { code: "attdetroit1", countryName: "USA" },
            { code: "attnewyork1", countryName: "USA" },
            { code: "australiacentral", countryName: "Australia" },
            { code: "australiacentral2", countryName: "Australia" },
            { code: "australiaeast", countryName: "Australia" },
            { code: "australiasoutheast", countryName: "Australia" },
            { code: "austriaeast", countryName: "Austria" },
            { code: "belgiumcentral", countryName: "Belgium" },
            { code: "brazilsouth", countryName: "Brazil" },
            { code: "brazilsoutheast", countryName: "Brazil" },
            { code: "canadacentral", countryName: "Canada" },
            { code: "canadaeast", countryName: "Canada" },
            { code: "centralindia", countryName: "India" },
            { code: "centralus", countryName: "USA" },
            { code: "centraluseuap", countryName: "USA" },
            { code: "chilecentral", countryName: "Chile" },
            { code: "deloscloudgermanynorth", countryName: "Germany" },
            { code: "eastasia", countryName: "Asia Pacific" },
            { code: "eastus", countryName: "USA" },
            { code: "eastus2", countryName: "USA" },
            { code: "eastus2euap", countryName: "USA" },
            { code: "francecentral", countryName: "France" },
            { code: "francesouth", countryName: "France" },
            { code: "germanynorth", countryName: "Germany" },
            { code: "germanywestcentral", countryName: "Germany" },
            { code: "indonesiacentral", countryName: "Indonesia" },
            { code: "israelcentral", countryName: "Israel" },
            { code: "israelnorthwest", countryName: "Israel" },
            { code: "italynorth", countryName: "Italy" },
            { code: "japaneast", countryName: "Japan" },
            { code: "japanwest", countryName: "Japan" },
            { code: "jioindiacentral", countryName: "India" },
            { code: "jioindiawest", countryName: "India" },
            { code: "koreacentral", countryName: "South Korea" },
            { code: "koreasouth", countryName: "South Korea" },
            { code: "malaysiasouth", countryName: "Malaysia" },
            { code: "malaysiawest", countryName: "Malaysia" },
            { code: "mexicocentral", countryName: "Mexico" },
            { code: "newzealandnorth", countryName: "New Zealand" },
            { code: "northcentralus", countryName: "USA" },
            { code: "northeurope", countryName: "Europe" },
            { code: "norwayeast", countryName: "Norway" },
            { code: "norwaywest", countryName: "Norway" },
            { code: "perth", countryName: "Australia" },
            { code: "polandcentral", countryName: "Poland" },
            { code: "portland", countryName: "USA" },
            { code: "qatarcentral", countryName: "Qatar" },
            { code: "sgxsingapore1", countryName: "Singapore" },
            { code: "southafricanorth", countryName: "South Africa" },
            { code: "southafricawest", countryName: "South Africa" },
            { code: "southcentralus", countryName: "USA" },
            { code: "southcentralus2", countryName: "USA" },
            { code: "southcentralusstg", countryName: "USA" },
            { code: "southeastasia", countryName: "Singapore" },
            { code: "southeastus", countryName: "USA" },
            { code: "southindia", countryName: "India" },
            { code: "spaincentral", countryName: "Spain" },
            { code: "swedencentral", countryName: "Sweden" },
            { code: "swedensouth", countryName: "Sweden" },
            { code: "switzerlandnorth", countryName: "Switzerland" },
            { code: "switzerlandwest", countryName: "Switzerland" },
            { code: "taiwannorth", countryName: "Taiwan" },
            { code: "taiwannorthwest", countryName: "Taiwan" },
            { code: "uaecentral", countryName: "UAE" },
            { code: "uaenorth", countryName: "UAE" },
            { code: "uksouth", countryName: "UK" },
            { code: "ukwest", countryName: "UK" },
            { code: "usgovarizona", countryName: "USA" },
            { code: "usgoviowa", countryName: "USA" },
            { code: "usgovtexas", countryName: "USA" },
            { code: "usgovvirginia", countryName: "USA" },
            { code: "westcentralus", countryName: "USA" },
            { code: "westeurope", countryName: "Netherlands" },
            { code: "westindia", countryName: "India" },
            { code: "westus", countryName: "USA" },
            { code: "westus2", countryName: "USA" },
            { code: "westus3", countryName: "USA" }
        ];

        for (const region of azureRegionCountries) {
            const result = await Azure.updateMany(
                { armRegionName: region.code },
                { $set: { countryName: region.countryName } }
            );

            console.log(`🔄 Updated region ${region.code} => ${region.countryName}, Matched: ${result.matchedCount}, Modified: ${result.modifiedCount}`);
        }


        return NextResponse.json(
            { message: "✅ Country names added successfully based on armRegionName." },
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


