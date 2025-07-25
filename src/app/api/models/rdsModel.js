import mongoose from "mongoose";



const reservedPricingSchema = new mongoose.Schema({
    unit: String,
    endRange: String,
    description: String,
    appliesTo: [String],
    rateCode: String,
    beginRange: String,
    pricePerUnitUSD: String,
    offerTermCode: String,
    effectiveDate: Date,
    termAttributes_LeaseContractLength: String,
    termAttributes_OfferingClass: String,
    termAttributes_PurchaseOption: String,
}, { timestamps: true });



const rdsPricing = new mongoose.Schema({
    sku: { type: String },
    productFamily: String,
    serviceCode: String,
    version: String,
    publicationDate: Date,

    // Flattened product.attributes
    engineCode: String,
    instanceTypeFamily: String,
    memory: String,
    vcpu: String,
    instanceType: String,
    usagetype: String,
    locationType: String,
    storage: String,
    normalizationSizeFactor: String,
    instanceFamily: String,
    databaseEngine: String,
    regionCode: String,
    physicalProcessor: String,
    licenseModel: String,
    currentGeneration: String,
    networkPerformance: String,
    deploymentOption: String,
    location: String,
    servicename: String,
    processorArchitecture: String,
    operation: String,
    group: String,
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

    reserved: [reservedPricingSchema],

}, { timestamps: true });

export default mongoose.models.RDSPricing || mongoose.model("RDSPricing", rdsPricing);
