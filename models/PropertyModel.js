import mongoose from 'mongoose';

const PropertySchema = new mongoose.Schema({

  name: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    required: true
  },
  Rent: {
    type: Number,
    required: true,
  },
  details: {
    type: String,
    required: true
  },
  bathrooms: {
    type: Number,
    required: true
  },
  bedrooms: {
    type: Number,
    required: true
  },
  furnished: {
    type: Boolean,
    required: true,
  },
  parking: {
    type: Boolean,
    required: true
  },
  imageUrls: {
    type: Array,
  },
  videoUrls: {
    type: Array,
  },
  buildUpArea: {
    type: String,
    required: true
  },
  FloorCount: {
    type: Number,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  ownerRef: {
    type: String,
    required: true
  },
  balcony: {
    type: Number,
    required: true
  },
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  is_verified: {
    type: Boolean,
  },
  is_Booked: {
    type: Boolean,
  },
  is_hide: {
    type: Boolean,
    default: false
  },
  is_pending: {
    type: Boolean,
    default: true
  },
}, { timestamps: true });

const Property = mongoose.model('Property', PropertySchema);

export default Property;
