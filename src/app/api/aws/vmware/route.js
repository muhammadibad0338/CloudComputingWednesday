// /app/api/aws/vmware/route.js

import { NextResponse } from 'next/server';
import { PricingClient, GetProductsCommand, } from "@aws-sdk/client-pricing";
import connectMongoDB from '../../mongodb';
import VmwarePricing from '../../models/vmwarePricing';
import RDSPricing from '../../models/rdsModel'
import SThreeGlacierPricing from '../../models/sThreeGlacierModel'
import SThreePricing from '../../models/sThreeModel'












// Create the client configuration
const config = {
    region: "us-east-1", // Required for pricing API
    credentials: {
        accessKeyId: "AKIAYPQUME54MDNZYAHP",       // Use dummy credentials for public pricing data
        secretAccessKey: "ERBJeQCseMCB+ley8YedqbvD+2aegegp+B9m4+Qs"
    }
};

// Instantiate the client
const client = new PricingClient(config);


export async function POST() {
    try {
        await connectMongoDB();

        // const client = new PricingClient({ region: 'us-east-1' });

        let nextToken = null;
        let allItems = [];

        do {
            const command = new GetProductsCommand({
                ServiceCode: 'VMwareCloudOnAWS',
                FormatVersion: 'aws_v1',
                MaxResults: 100,
                ...(nextToken && { NextToken: nextToken })
            });

            const response = await client.send(command);
            const rawItems = response.PriceList.map(flattenVmwareAwsItem);

            allItems.push(...rawItems);
            nextToken = response.NextToken;


        } while (nextToken);

        // Optional: filter duplicates before insert (based on SKU + rateCode)
        // const filteredItems = allItems.filter(item => item.sku && item.rateCode);

        const inserted = await VmwarePricing.insertMany(allItems, { ordered: false });

        return NextResponse.json({
            // data: allItems
            message: `${inserted.length} VMware pricing records inserted.`,
        }, { status: 201 });

    } catch (error) {
        console.error("AWS Pricing API Error:", error);
        return NextResponse.json(
            { error: "Failed to retrieve or store VMware Cloud on AWS pricing data." },
            { status: 500 }
        );
    }
}


function flattenVmwareAwsItem(rawItem) {
    const singleSKU = JSON.parse(rawItem);
    let {
        product,
        serviceCode,
        terms,
        version,
        publicationDate
    } = singleSKU

    let { productFamily, sku, attributes } = product

    // let termsOnDemand = terms?.OnDemand[Object.keys(terms?.OnDemand)[0]]


    // let priceDimensions = Object.keys(Object.keys(terms?.OnDemand)[0].priceDimensions)[0]

    // Step 1: Get the first OnDemand term
    let onDemandTerms = terms?.OnDemand;
    let firstOnDemandKey = Object.keys(onDemandTerms)[0];
    let termsOnDemand = onDemandTerms[firstOnDemandKey];

    // Step 2: Get the first price dimension
    let priceDimensions = termsOnDemand.priceDimensions;
    let firstPriceKey = Object.keys(priceDimensions)[0];
    let { pricePerUnit, beginRange, rateCode, appliesTo, endRange, unit } = priceDimensions[firstPriceKey];

    return {
        productFamily,
        sku,
        ...attributes,
        serviceCode,
        beginRange, rateCode, appliesTo, endRange, unit,
        effectiveDate: termsOnDemand?.effectiveDate,
        offerTermCode: termsOnDemand?.offerTermCode,
        pricePerUnitUSD: pricePerUnit?.USD,
        version,
        publicationDate

    };
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
            "sku",
            "productFamily",
            "serviceCode",
            "usagetype",
            "description",
            "locationType",
            "productsubgroup",
            "regionCode",
            "location",
            "servicename",
            "operation",
            "unit",
            "beginRange",
            "endRange",
            'countryName',
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
            VmwarePricing.find(mongoFilter).skip(skip).limit(limit),
            VmwarePricing.countDocuments(mongoFilter),
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
        console.error('GET /api/aws/vmware error:', error);
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

        // const data = await VmwarePricing.distinct("offerTermCode");
        // const countryName = await Azure.distinct("countryName");

        const result = await VmwarePricing.updateMany(
            {},
            { $set: { type: 'Consumption' } }
        );

        return NextResponse.json(
            // { message: "✅ Country names added successfully based on armRegionName." },
            {
                result,
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
