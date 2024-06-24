import express from 'express';
import { createListing, deleteListing, updateListing, getListing, getListings, getPendingListings, disapproveListing } from '../controllers/listing.controller.js';
import { verifyToken } from '../utils/verifyUser.js';
import { approveListing } from './../controllers/listing.controller.js';

const router = express.Router();

router.post('/create', verifyToken, createListing);
router.delete('/delete/:id', verifyToken, deleteListing);
router.post('/update/:id', verifyToken, updateListing);
router.get('/get/:id', getListing);
router.get('/get', getListings);
router.get('/pending', getPendingListings);
router.patch('/approve/:id', verifyToken, approveListing);
router.patch('/disapprove/:id', verifyToken, disapproveListing); 


export default router;
