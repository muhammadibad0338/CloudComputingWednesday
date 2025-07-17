import mongoose from "mongoose";

const sThreeGlacierPricing = new mongoose.Schema({
    sku: { type: String, unique: true },
    // productFamily: String,
    serviceCode: String,
    version: String,
    publicationDate: Date,

    // Flattened product.attributes
    regionCode: String,
    servicecode: String,
    groupDescription: String,
    usagetype: String,
    locationType: String,
    location: String,
    servicename: String,
    // productgroupid: String,
    operation: String,
    group: String,





    // From terms.OnDemand
    offerTermCode: String,
    effectiveDate: Date,

    // From priceDimensions
    unit: String,
    endRange: String,
    description: String,
    appliesTo: [String],
    rateCode: String,
    beginRange: String,
    pricePerUnitUSD: String,

}, { timestamps: true });

export default mongoose.models.SThreeGlacierPricing || mongoose.model("SThreeGlacierPricing", sThreeGlacierPricing);