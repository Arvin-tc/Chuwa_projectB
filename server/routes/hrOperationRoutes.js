import express from 'express';
import Application from '../models/application.js';
import { authenticate, authorizeRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Fetch all employees
router.get('/employees', async (req, res) => {
    try {
        const employees = await Application.find().sort({ 'details.lastName': 1 });
        res.status(200).json(employees);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching employee profiles', error: err.message });
    }
});

// Fetch detailed profile of a specific employee
router.get('/employees/:id', async (req, res) => {
    try {
      const employee = await Application.findById(req.params.id);
      if (!employee) {
        return res.status(404).json({ message: 'Employee not found' });
      }
      res.status(200).json(employee);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching employee profile', error: err.message });
    }
});


router.get('/dashboard-summary', authenticate, authorizeRole('hr'), async (req, res) => {
  try {
    const totalEmployees = await Application.countDocuments();
    const pendingApplications = await Application.countDocuments({ status: 'Pending' });
    const approvedApplications = await Application.countDocuments({ status: 'Approved' });
    const rejectedApplications = await Application.countDocuments({ status: 'Rejected' });

    res.json({
      totalEmployees,
      pendingApplications,
      approvedApplications,
      rejectedApplications,
    });
  } catch (error) {
    console.error('Error fetching dashboard summary:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


export default router;
