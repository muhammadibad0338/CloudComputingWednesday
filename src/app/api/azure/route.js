import connectMongoDB from "../mongodb";
import Azure from "../models/azureModel";
import { NextResponse } from "next/server";
import data from './data.json'

export async function POST(request) {
    try {
        const { title, description } = await request.json();
        await connectMongoDB();
        await Azure.create({ title, description });
        return NextResponse.json({ message: "Azure Created" }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create Azure" }, { status: 500 });
    }
}


// export async function GET() {
//     try {
//         const response = await fetch("https://prices.azure.com/api/retail/prices?api-version=2023-01-01-preview");

//         if (!response.ok) {
//             throw new Error("Failed to fetch Azure pricing");
//         }

//         const data = await response.json();

//         return NextResponse.json(data, { status: 200 });
//     } catch (error) {
//         console.error("Azure API fetch error:", error);
//         return NextResponse.json(
//             { error: "Failed to fetch Azure pricing" },
//             { status: 500 }
//         );
//     }
// }


// export async function GET() {
//     try {
//         // 1. Connect to MongoDB
//         await connectMongoDB();

//         // 2. Fetch only the first page
//         const response = await fetch(
//             "https://prices.azure.com/api/retail/prices?api-version=2023-01-01-preview"
//         );

//         if (!response.ok) {
//             throw new Error("Failed to fetch Azure pricing data.");
//         }

//         // 3. Parse data and get items
//         const jsonData = await response.json();
//         // const items = jsonData.Items;
//         const items = jsonData.Items.slice(0, 4);



//         for (const item of items) {
//             const doc = {
//                 ...item,
//                 effectiveStartDate: new Date(item.effectiveStartDate),
//             };
//             console.log('DOC',doc)
//             await Azure.create(doc);
//         }

//         return NextResponse.json({ message: `${items.length} records inserted.` }, { status: 201 });

//         // 4. Insert into MongoDB
//         // const inserted = await Azure.insertMany(items);

//         return NextResponse.json(inserted, { status: 200 });

//         // 5. Return success response
//         // return NextResponse.json({
//         //     message: `${inserted.length} records inserted into MongoDB.`,
//         // }, { status: 201 });

//     } catch (error) {
//         console.error("Error saving Azure pricing data:", error);
//         return NextResponse.json(
//             { error: "Failed to fetch or insert Azure data." },
//             { status: 500 }
//         );
//     }
// }



export async function GET() {
    try {
        // 1. Connect to MongoDB
        await connectMongoDB();

        // 2. Fetch data
        const res = await fetch("https://prices.azure.com/api/retail/prices?api-version=2023-01-01-preview");
        const data = await res.json();
        const items = data.Items;

        // 3. Insert each item one by one
        let insertedCount = 0;

        console.log("Azure model schema:", Azure.schema.obj);

        for (let i = 0; i < 4; i++) {
            const item = items[i];

            // Create a new Azure document
            const doc = new Azure({
                title: item.currencyCode,
                description: item.tierMinimumUnits,
                retailPrice: item.retailPrice,
                unitPrice: item.unitPrice,
                armRegionName: item.armRegionName,
                location: item.location,
                effectiveStartDate: new Date(item.effectiveStartDate),
                meterId: item.meterId,
                meterName: item.meterName,
                productId: item.productId,
                skuId: item.skuId,
                productName: item.productName,
                skuName: item.skuName,
                serviceName: item.serviceName,
                serviceId: item.serviceId,
                serviceFamily: item.serviceFamily,
                unitOfMeasure: item.unitOfMeasure,
                type: item.type,
                isPrimaryMeterRegion: item.isPrimaryMeterRegion,
                armSkuName: item.armSkuName,
                savingsPlan: item.savingsPlan // may be undefined and that's OK
            });

            // Save to MongoDB
            await Azure.create(doc);
            insertedCount++;
        }

        return NextResponse.json(
            { message: `${insertedCount} items inserted.` },
            { status: 201 }
        );

    } catch (error) {
        console.error("Error saving items:", error);
        return NextResponse.json(
            { error: "Failed to fetch or insert items." },
            { status: 500 }
        );
    }
}
