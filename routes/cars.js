const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const carsController = require('../controllers/cars');

const carsValidation = [
    body('brand').isString().withMessage('Required'),
    body('name').isString().withMessage('Required'),
    body('year').isString().matches(/^\d{4}$/).withMessage('Required'),
    body('bodyStyle').optional().isString().withMessage('Optional'),
    body('color').isString().withMessage('Required'),
];

const carsUpdateValidation = [
    body('brand').optional().isString().withMessage('Please enter a brand'),
    body('name').optional().isString().withMessage('Please enter the name of the vehicle'),
    body('year').optional().matches(/^\d{4}$/).withMessage('Please enter the year of the vehicle'),
    body('bodyStyle').optional().isString().withMessage('Optional'),
    body('color').optional().isString().withMessage('Enter a color'),
];

router.get('/', carsController.getAll);

router.get('/:vin', carsController.getSingle);

router.post('/', carsValidation, carsController.createCar);

router.put('/:vin', carsUpdateValidation, carsController.updateCar);

router.delete('/:vin', carsController.deleteCar);

module.exports = router;
