const mongodb = require('../database/database');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
    try {
        const result = await mongodb.getDatabase().db().collection('cars').find();
        const cars = await result.toArray();
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(cars);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve cars', error: error.message });
    }
};

const getSingle = async (req, res) => {
    try {
        const carId = new ObjectId(req.params.id);

        const result = await mongodb.getDatabase().db().collection('cars').findOne({ _id: carId });

        if (result) {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(result);
        } else {
            res.status(404).json({ message: 'Car not found.' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Invalid ID format.' });
    }
};

const createCar = async (req, res) => {
    const { brand, name, year, bodyStyle, color } = req.body;

    if (!brand || !name || !year || !bodyStyle || !color) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    const car = { brand, name, year, bodyStyle, color };

    try {
        const response = await mongodb.getDatabase().db().collection('cars').insertOne(car);
        if (response.acknowledged) {
            res.status(201).json({ message: 'Car created successfully.', carId: response.insertedId });
        } else {
            res.status(500).json(response.error || 'Error occurred when adding the car.');
        }
    } catch (error) {
        res.status(500).json({ message: 'Error occurred when adding the car.', error: error.message });
    }
};

const updateCar = async (req, res) => {
    const carId = new ObjectId(req.params.id);
    const car = {
        brand: req.body.brand,
        name: req.body.name,
        year: req.body.year,
        bodyStyle: req.body.bodyStyle,
        color: req.body.color
    };

    try {
        const existingCar = await mongodb.getDatabase().db().collection('cars').findOne({ _id: carId });
        if (!existingCar) {
            return res.status(404).json({ message: 'Car not found.' });
        }

        const response = await mongodb.getDatabase().db().collection('cars').replaceOne({ _id: carId }, car);
        if (response.modifiedCount > 0) {
            res.status(204).send();
        } else {
            res.status(400).json({ message: 'No changes made.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating car.', error });
    }
};

const deleteCar = async (req, res) => {
    const carId = new ObjectId(req.params.id);
    try {
        const response = await mongodb.getDatabase().db().collection('cars').deleteOne({ _id: carId });
        if (response.deletedCount > 0) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'Car not found.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while deleting the car.', error: error.message });
    }
};

module.exports = {
    getAll,
    getSingle,
    createCar,
    updateCar,
    deleteCar
};
