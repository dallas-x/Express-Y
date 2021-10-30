import { Router } from 'express';

const carRouter = Router();

carRouter.route('').get((req, res) => {
  res.json({ usage: 'details about cars and our inventory!' });
});

carRouter.route('/list').get((req, res) => {
  res.json({ cars: [{ make: 'Chevrolet', model: 'Camaro', year: '2017' }] });
});

export default carRouter;
