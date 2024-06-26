import express from 'express';
import { google, signin, signOut, signup } from '../controllers/auth.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/google",google);
router.get('/signout', signOut);
router.get("/verify-token", verifyToken);
router.post('/logout', (req, res, next) => {
    try {
      res.clearCookie('access_token'); // Clear the cookie
      res.status(200).json({ success: true, message: 'User has been logged out!' });
    } catch (error) {
      next(error); // Pass errors to the error handler middleware
    }
  });

export default router;