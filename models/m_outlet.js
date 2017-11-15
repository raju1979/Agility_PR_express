const mongoose = require('mongoose');

Schema = mongoose.Schema;

const outletSchema = mongoose.Schema({
    index: {
        type: Number,
        required: true
    },
    guid: {
        type: String
    },
    isActive: {
        type: Boolean
    },
    ProfileImageUrl: {
        type: String
    },
    Publisher: {
        type: String
    },
    OutletName: {
        type: String
    },
    OutletType: {
        type: String
    },
    EditorialProfile: {
        type: String
    },
    company: {
        type: String
    },
    Email: {
        type: String
    },
    OutletPhone: {
        type: String
    },
    OutletFax: {
        type: String
    },
    OutletAddress: {
        type: String
    },
    Language: {
        type: String
    },
    registered: {
        type: String
    },
    followers: {
        type: Number
    },
    following: {
        type: Number
    },
    latitude: {
        type: Number
    },
    longitude: {
        type: Number
    },
    tags: {
        type: Array
    },
    FormatAdRate: {
        type: Schema.Types.Mixed
    },
    Contacts: {
        type: Array
    },
    OutletWebSite: {
        type: String
    },
    TwitterHandle: {
        type: String
    }
})

//outletSchema.index({"OutletType":"text"})

const Outlet = mongoose.model("Outlets",outletSchema);

module.exports = Outlet;