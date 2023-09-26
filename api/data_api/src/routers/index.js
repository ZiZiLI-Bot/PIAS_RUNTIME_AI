import express from 'express';
import UploadRouter from './Upload.router';

const Router = express.Router();

Router.use('/uploads', UploadRouter);

export default Router;
