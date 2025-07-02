import mongoose, { Schema } from "mongoose";

const azureSchema = new Schema(
    {
        title: String,
        description: String,
    },
    {
        timestamps: true,
    }
);

const Azure = mongoose.models.Azure || mongoose.model("Azure", azureSchema);

export default Azure;



// import mongoose from 'mongoose';

// const SavingsPlanSchema = new mongoose.Schema({
//   unitPrice: Number,
//   retailPrice: Number,
//   term: String,
// }, { _id: true });

// const AzurePricingSchema = new mongoose.Schema({
//   currencyCode: String,
//   tierMinimumUnits: Number,
//   retailPrice: Number,
//   unitPrice: Number,
//   armRegionName: String,
//   location: String,
//   effectiveStartDate: Date,
//   meterId: String,
//   meterName: String,
//   productId: String,
//   skuId: String,
//   productName: String,
//   skuName: String,
//   serviceName: String,
//   serviceId: String,
//   serviceFamily: String,
//   unitOfMeasure: String,
//   type: String,
//   isPrimaryMeterRegion: Boolean,
//   armSkuName: String,
//   savingsPlan: [SavingsPlanSchema]
// }, { timestamps: true });

// export default mongoose.models.AzurePricing || mongoose.model('AzurePricing', AzurePricingSchema);
