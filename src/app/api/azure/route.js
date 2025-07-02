import connectMongoDB from "../mongodb";
import Azure from "../models/azureModel";
import { NextResponse } from "next/server";
import data from './data.json'




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