import mongoose from "mongoose";

const sThreePricing = new mongoose.Schema({
    sku: { type: String, unique: true },
    productFamily: String,
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
    productgroupid: String,
    operation: String,
    group: String,
    // second
    fromLocationType: String,
    toRegionCode: String,
    fromRegionCode: String,
    transferType: String,
    fromLocation: String,
    toLocationType: String,
    toLocation: String,
    countryName: {
        type: String,
        default: ''
    },
    type: {
        type: String,
        default: ''
    },
    generalizeMeasureUnit: {
        type: String,
        default: ''
    },





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

export default mongoose.models.SThreePricing || mongoose.model("SThreePricing", sThreePricing);