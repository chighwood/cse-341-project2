const express = require('express');
const router = express.Router();
const { body } = router('express-validator')

const carsController = require('../controllers/cars');

const carsValidation = [
    body('firstName').isLength({ min: 1 }).withMessage('Required'),
    body('lastName').isLength({ min: 1 }).withMessage('Required'),
    body('email').isEmail().withMessage('Invalid email format'),
    body('favoriteColor').isString().withMessage('Enter any color'),
    body('birthday').optional().isISO8601().withMessage('Invalid date format'),
];

const carsUpdateValidation = [
    body('firstName').optional().isLength({ min: 1 }).withMessage('First name must be at least 1 character'),
    body('lastName').optional().isLength({ min: 1 }).withMessage('Last name must be at least 1 character'),
    body('email').optional().isEmail().withMessage('Invalid email format'),
    body('favoriteColor').optional().isString().withMessage('Enter any color'),
    body('birthday').optional().isISO8601().withMessage('Invalid date format'),
];

router.get('/', carsController.getAll);

router.get('/:vin', carsController.getSingle);

router.post('/', carsValidation, carsController.createCar);

router.put('/:vin', carsUpdateValidation, carsController.updateCar);

router.delete('/:vin', carsController.deleteCar);

module.exports = router;
