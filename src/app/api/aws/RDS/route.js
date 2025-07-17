import { NextResponse } from 'next/server';
import { PricingClient, GetProductsCommand } from "@aws-sdk/client-pricing";
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
                ServiceCode: 'AmazonRDS',
                FormatVersion: 'aws_v1',
                MaxResults: 100,
                ...(nextToken && { NextToken: nextToken })
            });

            response = await client.send(command);
            const rawItems = response.PriceList.map(flattenSThreeAwsItem);

            allItems.push(...rawItems);
            nextToken = response.NextToken;


        } while (false);


        // const inserted = await SThreePricing.insertMany(allItems, { ordered: false });


        return NextResponse.json({
            data: allItems,
            // message: `${inserted.length} AmazonRDS pricing records inserted.`,
        }, { status: 201 });

    } catch (error) {
        console.error("AWS AmazonRDS Pricing API Error:", error);
        return NextResponse.json(
            { error: "Failed to retrieve or store AmazonRDS Cloud on AWS pricing data." },
            { status: 500 }
        );
    }
}


function flattenSThreeAwsItem(rawItem) {
    const singleSKU = JSON.parse(rawItem);
    return singleSKU
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
    let { pricePerUnit, beginRange, rateCode, appliesTo, endRange, unit, description } = priceDimensions[firstPriceKey];

    return {
        productFamily,
        sku,
        ...attributes,
        serviceCode,
        beginRange, rateCode, description, appliesTo, endRange, unit,
        effectiveDate: termsOnDemand?.effectiveDate,
        offerTermCode: termsOnDemand?.offerTermCode,
        pricePerUnitUSD: pricePerUnit?.USD,
        version,
        publicationDate

    };
}