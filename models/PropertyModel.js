import mongoose from 'mongoose'


 const PropertySchema = new mongoose.Schema({
        owner: {
          type: ObjectId,
          ref: "User",
          required: true,
        },
        property_title: {
          type: String,
          required: true,
        },
        property_type: {
          type: String,
          required: true,
        },
        expected_Rent: {
          type: Number,
          required: true,
        },
        property_details: {
          type: String,
          required: true,
        },
        doc: {
          type: String,
          required: true,
        },
        ImageUrls: {
          type: [String],
          required: true,
        },
        ratings: [
          {
            type: ObjectId,
            ref: "Review",
          },
        ],
        property_location: {
          country: {
            type: String,
          },
          state: {
            type: String,
          },
          district: {
            type: String,
          },

          address: {
            type: String,
          },
          zip_code: {
            type: Number,
          },
        },
        details: {
          built_up_area: {
            type: Number,
          },
          number_bedrooms: {
            type: Number,
          },
          number_bathrooms: {
            type: Number,
          },
          number_balconies: {
            type: Number,
          },
          water_accessibilty: {
            type: String,
          },
          number_floors: {
            type: Number,
          },
        },
        is_available: {
          type: Boolean,
          default: true,
        },
        isApproved: {
          type: Boolean,
          default: false,
        },
        is_Reserved: {
          type: Boolean,
          default: false,
        },
        is_Booked: {
          type: Boolean,
          default: false,
        },
      },
      { timestamps: true })

      const Property = mongoose.model('Property', PropertySchema)

      export default Property