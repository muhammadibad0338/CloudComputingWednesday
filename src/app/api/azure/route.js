// import Azure from "@/server/models/azureModel";
// import connectMongoDB from "@/server/mongodb";
// import { NextResponse } from "next/server";

import connectMongoDB from "../mongodb";
import Azure from "../models/azureModel";
import { NextResponse } from "next/server";


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