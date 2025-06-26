import express from 'express'

const router=express.Router();

import {signup, signin} from '../controllers/auth.controller.js';

import { google } from '../controllers/auth.controller.js';

router.post('/signup', signup);

router.post('/signin', signin);

router.post('/google', google);

export default router;