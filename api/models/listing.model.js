import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    rules: {
      type: String,
    },
    address: {
      type: String,
      required: true,
      
    },
    district: {
      type: String,
      required: true,
      
    },
    city: {
      type: String,
      required: true,
      
    },
    rent: {
      type: Number,
      required: true,
    },
    rentType: {
      type: String,
      required:true,
    },
    
    bathrooms: {
      type: Number,
      required: true,
    },
    bedrooms: {
      type: Number,
      required: true,
    },
    furnished: {
      type: Boolean,
      required: true,
    },
    parking: {
      type: Boolean,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    kitchen: {
      type: Boolean,
      required: true,
    },
    aircondition: {
      type: Boolean,
      required: true,
    },
    hotwater: {
      type: Boolean,
      required: true,
    },
    imageUrls: {
      type: Array,
      required: true,
    },
    userRef: {
      type: String,
      required: true,
    },
    status: { 
      type: String, 
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending' 
    },
  },
  { timestamps: true }
);

const Listing = mongoose.model('Listing', listingSchema);

export default Listing;
