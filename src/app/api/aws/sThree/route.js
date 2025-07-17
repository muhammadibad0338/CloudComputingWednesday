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
        let response = {}


        do {
            const command = new GetProductsCommand({
                ServiceCode: 'AmazonS3',
                FormatVersion: 'aws_v1',
                MaxResults: 100,
                ...(nextToken && { NextToken: nextToken })
            });

            response = await client.send(command);
            // const rawItems = response.PriceList.map(flattenVmwareAwsItem);

            // allItems.push(...rawItems);
            // nextToken = response.NextToken;


        } while (false);

        // Optional: filter duplicates before insert (based on SKU + rateCode)
        // const filteredItems = allItems.filter(item => item.sku && item.rateCode);

        // const inserted = await VmwarePricing.insertMany(allItems, { ordered: false });

        const rawItems = response.PriceList.map(flattenVmwareAwsItem);

        return NextResponse.json({
            data: rawItems,
            // message: `${inserted.length} VMware pricing records inserted.`,
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
    return singleSKU
}