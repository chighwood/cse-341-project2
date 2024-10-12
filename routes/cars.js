const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const carsController = require('../controllers/cars');

const { isAuthenticated } = require('../middleware/authenticate');

const carsValidation = [
    body('brand').isString().withMessage('Required'),
    body('name').isString().withMessage('Required'),
    body('year').isInt({ min: 1886, max: new Date().getFullYear() }).withMessage('Required'),
    body('bodyStyle').optional().isString().withMessage('Optional'),
    body('color').isString().withMessage('Required'),
];

const carsUpdateValidation = [
    body('brand').optional().isString().withMessage('Please enter a brand'),
    body('name').optional().isString().withMessage('Please enter the name of the vehicle'),
    body('year').optional().isInt({ min: 1886, max: new Date().getFullYear() }).withMessage('Please enter the year of the vehicle'),
    body('bodyStyle').optional().isString().withMessage('Optional'),
    body('color').optional().isString().withMessage('Enter a color'),
];

router.get('/', carsController.getAll);
router.get('/:id', carsController.getSingle);
router.post('/', isAuthenticated, carsValidation, carsController.createCar);
router.put('/:id', isAuthenticated, carsUpdateValidation, carsController.updateCar);
router.delete('/:id', isAuthenticated, carsController.deleteCar);

module.exports = router;
