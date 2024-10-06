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

// const updateCar = async (req, res) => {
//     try {
//         console.log('Request Body:', req.body);
//         const carId = new ObjectId(req.params.id);

//         const car = {
//             brand: req.body.brand,
//             name: req.body.name,
//             year: req.body.year,
//             bodyStyle: req.body.bodyStyle,
//             color: req.body.color
//         };

//         if (!car.brand && !car.name && !car.year && !car.bodyStyle && !car.color) {
//             return res.status(400).json({ message: 'No valid fields to update.' });
//         }

//         const response = await mongodb.getDatabase().db().collection('cars').replaceOne({ _id: carId }, car);

//         if (response.modifiedCount > 0) {
//             res.status(200).send('Car updated successfully');
//         } else {
//             res.status(404).json({ message: 'Car not found or no changes made.' });
//         }
//     } catch (error) {
//         console.error('Error occurred during car update:', error.message);
//         res.status(400).json({ message: 'Invalid ID format or update error.' });
//     }
// };

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
        res.status(500).json(response.error || 'Some error occured while updating the specs.')
    }
};

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
