import mongoose, { Schema } from "mongoose";

const SavingsPlanSchema = new mongoose.Schema({
    unitPrice: Number,
    retailPrice: Number,
    term: String,
}, { _id: true });

const azureSchema = new mongoose.Schema({
    currencyCode: String,
    tierMinimumUnits: Number,
    retailPrice: Number,
    unitPrice: Number,
    armRegionName: String,
    location: String,
    effectiveStartDate: Date,
    meterId: String,
    meterName: String,
    productId: String,
    skuId: String,
    productName: String,
    skuName: String,
    serviceName: String,
    serviceId: String,
    serviceFamily: String,
    unitOfMeasure: String,
    type: String,
    isPrimaryMeterRegion: Boolean,
    armSkuName: String,
    ssavingsPlan: {
        type: [SavingsPlanSchema],
        required: false, // optional — you can also remove this line
        default: undefined // optional: don't include field if it's not provided
    }
}, { timestamps: true });


const Azure = mongoose.models.Azure || mongoose.model("Azure", azureSchema);

export default Azure;