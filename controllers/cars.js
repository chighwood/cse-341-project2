const mongodb = require('../database/database');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
    const result = await mongodb.getDatabase().db().collection('cars').find();
    result.toArray().then((cars) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(cars);
    });
};

const getSingle = async (req, res) => {
    const carVin = new ObjectId(req.params.id);
    const result = await mongodb.getDatabase().db().collection('cars').find({ _id: carId });
    result.toArray().then((cars) => {
        if (cars.length > 0) {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(cars[0]);
        } else {
            res.status(404).json({ message: 'Car not found.' });
        }
    });
};

const createCar = async (req, res) => {
    const car = {
        brand: req.body.brand,    
        name: req.body.name,      
        year: req.body.year,      
        bodyStyle: req.body.bodyStyle,
        color: req.body.color     
    };
    const response = await mongodb.getDatabase().db().collection('cars').insertOne(car);
    if (response.acknowledged) {
        res.status(200).send();
    } else {
        res.status(500).json(response.error || 'Error accured when adding the car.')
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
    const response = await mongodb.getDatabase().db().collection('cars').replaceOne({ _id: carId }, car);
    if (response.modifiedCount > 0) {
        res.status(200).send();
    } else {
        res.status(500).json(response.error || 'An error occured while updating the car specs.')
    }
}

const deleteCar = async (req, res) => {
    const carId = new ObjectId(req.params.id);
    const response = await mongodb.getDatabase().db().collection('cars').deleteOne({ _id: carId });
    if (response.deletedCount > 0) {
        res.status(200).send();
    } else {
        res.status(500).json(response.error || 'An error occured while deleting the car.')
    }
}
module.exports = {
    getAll,
    getSingle,
    createCar,
    updateCar,
    deleteCar
};
