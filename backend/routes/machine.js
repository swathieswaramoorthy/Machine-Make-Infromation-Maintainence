import express from 'express';
import { getDb } from '../Databaseconnection.js';
import { MongoClient } from 'mongodb';
import {ObjectId} from 'mongodb';

const Machine_Router = express.Router();

Machine_Router.post('', async (req, res) => {
    const db = await getDb();
    const collections = await Promise.all([db.collection('machines'), db.collection('hospitals')]);
    
    try {
        const { name, treate_type, make, hsptl_name , dateOfManufacture, purchaseDate, warrantyDate, count} = req.body;

        // Check if the hospital exists
        const validBranch = await collections[1].findOne({ hsptl_name });
        if (!validBranch) {
            return res.status(409).json({ message: 'No Branch Exists.' });
        }

        // Validations
        if (new Date(purchaseDate) <= new Date(dateOfManufacture)) {
            return res.status(400).json({ message: 'Purchase date must be after date of manufacture.' });
        }

        if (new Date(warrantyDate) <= new Date(purchaseDate)) {
            return res.status(400).json({ message: 'Warranty date must be after purchase date.' });
        }

        if (count <= 0) {
            return res.status(400).json({ message: 'Count must be greater than 0.' });
        }

        // Insert machine
        await collections[0].insertOne({
            name: name,
            make: make,
            treate_type: treate_type,
            hospitalId: validBranch._id,
            dateOfManufacture: new Date(dateOfManufacture),
            purchaseDate: new Date(purchaseDate),
            warrantyDate: new Date(warrantyDate),
            count: count,
             // Storing the hospital's ID as a foreign key reference
        });

        return res.status(201).json({ message: 'Machine added successfully.' });
    } catch (error) {
        console.error('Error adding machine:', error);
        return res.status(500).json({ message: 'An error occurred while adding the machine.' });
    }
});
Machine_Router.get('/:hospitalId', async (req, res) => {
    const hospitalId = req.params.hospitalId;
    const db = await getDb();
    console.log(hospitalId);
    try {
        const machines = await db.collection('machines').find({ hospitalId: new ObjectId(hospitalId) }).toArray();       
         res.json(machines);
        console.log(machines);
    } catch (error) {
        console.error('Error fetching machines:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

Machine_Router.delete('/:id', async (req, res) => {
    try {
        const machineId = req.params.id;
        const db = await getDb();
        const result = await db.collection('machines').deleteOne({ _id: new ObjectId(machineId) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Machine not found' });
        }

        res.status(200).json({ message: 'Machine deleted successfully' });
    } catch (error) {
        console.error('Error deleting machine:', error);
        res.status(500).json({ message: 'Failed to delete machine' });
    }
});

Machine_Router.put('/update/:machineId', async (req, res) => {
    const { machineId } = req.params;
    const { make } = req.body;
    const db= await getDb();
    try {
        const collection = await db.collection('machines');
        const result = await collection.updateOne(
            { _id: new ObjectId(machineId) }, // Query to find the machine by ID
            { $set: { make } } // Update operation to set the new make
        );
       
        res.json({ message: 'Machine updated successfully' });
    } catch (error) {
        console.error('Error updating machine:', error);
        res.status(500).json({ error: 'Failed to update machine' });
    }
});


export default Machine_Router;
