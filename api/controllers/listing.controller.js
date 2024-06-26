import Listing from '../models/listing.model.js';
import { errorHandler } from '../utils/error.js';

// Create a new listing with a default status of 'pending'
export const createListing = async (req, res, next) => {
  try {
    const newListing = {
      ...req.body,
      status: 'approved',
    };
    
    const listing = await Listing.create(newListing);
    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

// Delete a listing, ensuring the user is authorized
export const deleteListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return next(errorHandler(404, 'Listing not found!'));
    }

    if (req.user.id !== listing.userRef.toString()) {
      return next(errorHandler(401, 'You can only delete your own listings!'));
    }

    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json('Listing has been deleted!');
  } catch (error) {
    next(error);
  }
};

// Update a listing, ensuring the user is authorized
export const updateListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return next(errorHandler(404, 'Listing not found!'));
    }

    if (req.user.id !== listing.userRef.toString()) {
      return next(errorHandler(401, 'You can only update your own listings!'));
    }

    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
};

// Get a single listing by ID
export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return next(errorHandler(404, 'Listing not found!'));
    }

    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

// Get multiple listings with filtering, sorting, and pagination
export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;

    let kitchen = req.query.kitchen === 'true' ? true : { $in: [false, true] };
    let furnished = req.query.furnished === 'true' ? true : { $in: [false, true] };
    let parking = req.query.parking === 'true' ? true : { $in: [false, true] };
    let aircondition = req.query.aircondition === 'true' ? true : { $in: [false, true] };
    let hotwater = req.query.hotwater === 'true' ? true : { $in: [false, true] };

    let type = req.query.type && req.query.type !== 'all' 
               ? req.query.type 
               : { $in: ['hostel', 'singleroom','sharedroom', 'guesthouse', 'annex', 'bungalow', 'fullhouseholiday', 'fullhouserent'] };

    let rentType = req.query.rentType && req.query.rentType !== 'all' 
                   ? req.query.rentType 
                   : { $in: ['monthly', 'weekly', 'daily'] };

    const searchTerm = req.query.searchTerm || '';
    const sort = req.query.sort || 'createdAt';
    const order = req.query.order || 'desc';

    // Add district and city filters
    const district = req.query.district || '';
    const city = req.query.city || '';

    const minPrice = parseInt(req.query.minPrice) || 0;
    const maxPrice = parseInt(req.query.maxPrice) || Number.MAX_SAFE_INTEGER;

    // Add the status filter
    const status = 'approved';

    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: 'i' },
      kitchen,
      hotwater,
      aircondition,
      furnished,
      parking,
      type,
      rentType,
      rent: { $gte: minPrice, $lte: maxPrice },
      district: district !== '' ? district : { $exists: true },
      city: city !== '' ? city : { $exists: true },
      status,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};



// Get all listings with status 'pending'
export const getPendingListings = async (req, res, next) => {
  try {
    const listings = await Listing.find({ status: 'pending' });
    res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};

// Approve a listing, ensuring the user is authorized
export const approveListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ success: false, message: 'Listing not found!' });
    }

   

    listing.status = 'approved';
    await listing.save();

    res.status(200).json({ success: true, message: 'Listing has been approved!', listing });
  } catch (error) {
    next(error);
  }
};

export const disapproveListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ success: false, message: 'Listing not found!' });
    }


    listing.status = 'pending';
    await listing.save();

    res.status(200).json({ success: true, message: 'Listing has been disapproved!', listing });
  } catch (error) {
    next(error);
  }
};

export const totalListings =  async (req, res) => {
  try {
    const totalListings = await Listing.countDocuments({ status: 'approved' });
    res.json({ totalListings });
  } catch (error) {
    console.error('Error fetching total listings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
