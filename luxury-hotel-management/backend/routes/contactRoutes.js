import express from 'express';
import { createContact, getAllContacts } from '../controllers/contactController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .post(createContact)
  .get(protect, admin, getAllContacts);

export default router;
