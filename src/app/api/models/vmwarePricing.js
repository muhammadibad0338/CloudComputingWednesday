import mongoose from 'mongoose';

const vmwareSchema = new mongoose.Schema({
    sku: String,
    productFamily: String,
    productgroupid: String,
    brioproductid: String,
    usagetype: String,
    locationType: String,
    productsubgroup: String,
    iscommitcpsku: String,
    regionCode: String,
    servicecode: String,
    chargeid: String,
    location: String,
    servicename: String,
    operation: String,
    vmwareproductid: String,
    vmwareregion: String,

    // Pricing
    rateCode: String,
    description: String,
    unit: String,
    beginRange: String,
    endRange: String,
    priceUSD: String,

    // Term
    offerTermCode: String,
    effectiveDate: Date
}, { timestamps: true });

export default mongoose.models.VmwarePricing || mongoose.model("VmwarePricing", vmwareSchema);
