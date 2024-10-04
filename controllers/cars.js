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
    const carVin = new ObjectId(req.params.vin);
    const result = await mongodb.getDatabase().db().collection('cars').find({ _vin: carVin });
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
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        favoriteColor: req.body.favoriteColor,
        birthday: req.body.birthday
    };
    const response = await mongodb.getDatabase().db().collection('cars').insertOne(car);
    if (response.acknowledged) {
        res.status(200).send();
    } else {
        res.status(500).json(response.error || 'Error accured when adding the car.')
    }
};

const updateCar = async (req, res) => {
    const carVin = new ObjectId(req.params.vin);
    const car = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        favoriteColor: req.body.favoriteColor,
        birthday: req.body.birthday
    };
    const response = await mongodb.getDatabase().db().collection('cars').replaceOne({ _vin: carVin }, car);
    if (response.modifiedCount > 0) {
        res.status(200).send();
    } else {
        res.status(500).json(response.error || 'An error occured while updating the car specs.')
    }
}

const deleteCar = async (req, res) => {
    const carNumber = new ObjectId(req.params.vin);
    const response = await mongodb.getDatabase().db().collection('cars').deleteOne({ _vin: carNumber });
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
