const mongoose = require("mongoose");
const contactSchema = mongoose.Schema({
    "Username": {
        type: String
    },
    "isActive": {
        type: Boolean
    },
    "ContactDetail": {
        "ApiID": {
            type: String
        },
        "ContactName": {
            type: String
        },
        "OutletName": {
            type: String
        },
        "ProfileImageUrl": {
            type: String
        },
        "OutletAddress": {
            type: String
        },
        "OutletPhone": {
            type: String
        },
        "OutletFax": {
            type: String
        },
        "Language": {
            type: String
        },
        "CountryOfOrigin": {
            type: String
        },
        "Email": {
            type: String
        },
        "JobTitle": {
            type: String
        },
        "EmploymentPeriod": {
            type: String
        },
        "RelationshipType": {
            type: String
        },
        "Subjects": {
            type: String
        },
        "SocialMediaAccounts": {
            type: Boolean
        },
        "JobRoles": {
            type: Array
        },
        "CurrentLists": {
            type: Array
        },
    }
})

contactSchema.virtual('ApiId').get(function(){
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
contactSchema.set('toJSON', {
    virtuals: true
});


const Contact = mongoose.model("Contacts",contactSchema);

module.exports = Contact;