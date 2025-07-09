// /app/api/aws/vmware/route.js

import { NextResponse } from 'next/server';
import { PricingClient, GetProductsCommand } from "@aws-sdk/client-pricing";
import VmwarePricing from '../../models/vmwarePricing';
import connectMongoDB from '../../mongodb';












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


export async function GET() {
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
        const filteredItems = allItems.filter(item => item.sku && item.rateCode);

        const inserted = await VmwarePricing.insertMany(filteredItems, { ordered: false });

        return NextResponse.json({
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
    const item = JSON.parse(rawItem);
    const product = item.product || {};
    const attributes = product.attributes || {};
    const sku = product.sku;

    const terms = item.terms?.OnDemand || {};
    const termKey = Object.keys(terms)[0];
    const term = terms[termKey];

    const priceDimensionKey = Object.keys(term?.priceDimensions || {})[0];
    const dimension = term?.priceDimensions?.[priceDimensionKey];

    return {
        sku,
        productFamily: product.productFamily,
        productgroupid: attributes.productgroupid,
        brioproductid: attributes.brioproductid,
        usagetype: attributes.usagetype,
        locationType: attributes.locationType,
        productsubgroup: attributes.productsubgroup,
        iscommitcpsku: attributes.iscommitcpsku,
        regionCode: attributes.regionCode,
        servicecode: attributes.servicecode,
        chargeid: attributes.chargeid,
        location: attributes.location,
        servicename: attributes.servicename,
        operation: attributes.operation,
        vmwareproductid: attributes.vmwareproductid,
        vmwareregion: attributes.vmwareregion,

        rateCode: dimension?.rateCode,
        description: dimension?.description,
        unit: dimension?.unit,
        beginRange: dimension?.beginRange,
        endRange: dimension?.endRange,
        priceUSD: dimension?.pricePerUnit?.USD,

        offerTermCode: term?.offerTermCode,
        effectiveDate: term?.effectiveDate ? new Date(term?.effectiveDate) : null
    };
}


// export async function GET() {
//     try {
//         // Define the GetProductsRequest input
//         const input = {
//             ServiceCode: "VMwareCloudOnAWS", // required

//             FormatVersion: "aws_v1",         // optional
//             MaxResults: 100                  // max results per page
//         };

//         // Create the command
//         const command = new GetProductsCommand(input);

//         // Send the request
//         const response = await client.send(command);

//         // Return raw AWS Pricing response
//         return NextResponse.json({
//             prices: response.PriceList.map((item) => JSON.parse(item)),
//             nextToken: response.NextToken,
//         }, { status: 200 });

//     } catch (error) {
//         console.error("AWS Pricing API Error:", error);
//         return NextResponse.json(
//             { error: "Failed to retrieve VMware Cloud on AWS pricing data." },
//             { status: 500 }
//         );
//     }
// }
