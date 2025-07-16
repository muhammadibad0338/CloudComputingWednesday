import mongoose from "mongoose";

const vmwarePricing = new mongoose.Schema({
    sku: { type: String, unique: true },
    productFamily: String,
    serviceCode: String,
    version: String,
    publicationDate: Date,

    // Flattened product.attributes
    productgroupid: String,
    brioproductid: String,
    usagetype: String,
    description: String,
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

    // From terms.OnDemand
    offerTermCode: String,
    effectiveDate: Date,

    // From priceDimensions
    priceRateCode: String,
    beginRange: String,
    endRange: String,
    unit: String,
    pricePerUnitUSD: String,
    appliesTo: [String],
    rateCode: String,

}, { timestamps: true });

export default mongoose.models.VmwarePricing || mongoose.model("VmwarePricing", vmwarePricing);

// export default mongoose.models.VmwarePricing || mongoose.model("VmwarePricing", vmwareSchema);
