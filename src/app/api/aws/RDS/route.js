import { NextResponse } from 'next/server';
import { PricingClient, GetProductsCommand } from "@aws-sdk/client-pricing";
import connectMongoDB from '../../mongodb';
import RDSPricing from '../../models/rdsModel'


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


        } while (nextToken);


        const inserted = await RDSPricing.insertMany(allItems, { ordered: false });


        return NextResponse.json({
            // data: allItems,
            message: `${inserted.length} AmazonRDS pricing records inserted.`,
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
    let {
        product,
        serviceCode,
        terms,
        version,
        publicationDate
    } = singleSKU

    let { productFamily, sku, attributes } = product


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
        publicationDate,
        reserved: transformReservedPricing(terms?.Reserved || null)

    };
}

function transformReservedPricing(reservedTerms) {
    const transformed = [];

    if (!reservedTerms) return transformed;

    for (const reservedKey of Object.keys(reservedTerms)) {
        const reserved = reservedTerms[reservedKey];
        const { offerTermCode, effectiveDate, termAttributes = {} } = reserved;

        const priceDimensions = reserved.priceDimensions || {};

        for (const pdKey of Object.keys(priceDimensions)) {
            const pd = priceDimensions[pdKey];

            transformed.push({
                unit: pd.unit || null,
                endRange: pd.endRange || null,
                description: pd.description || "",
                appliesTo: pd.appliesTo || [],
                rateCode: pd.rateCode,
                beginRange: pd.beginRange || null,
                pricePerUnitUSD: pd.pricePerUnit?.USD || null,
                offerTermCode: offerTermCode,
                effectiveDate: new Date(effectiveDate),
                termAttributes_LeaseContractLength: termAttributes.LeaseContractLength || null,
                termAttributes_OfferingClass: termAttributes.OfferingClass || null,
                termAttributes_PurchaseOption: termAttributes.PurchaseOption || null,
            });
        }
    }

    return transformed;
}
