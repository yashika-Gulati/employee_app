const express = require('express');
const bodyParser = require('body-parser');
const db = require('./models');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('Server is healthy');
});

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Root route
app.get('/', (req, res) => {
  res.status(200).send('Welcome to the Employee Management API');
});

// Create a new department
app.post('/department', async (req, res) => {
  try {
    const department = await db.Department.create(req.body);
    res.status(201).json(department);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Create a new employee
app.post('/employee', async (req, res) => {
  try {
    const employee = await db.Employee.create(req.body);
    res.status(201).json(employee);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Assign Employee to Department
app.put('/employee/:id/department/:deptId', async (req, res) => {
  try {
    const employee = await db.Employee.findByPk(req.params.id);
    if (employee) {
      employee.departmentId = req.params.deptId;
      await employee.save();
      res.status(200).json(employee);
    } else {
      res.status(404).json({ error: 'Employee not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Fetch all departments
app.get('/departments', async (req, res) => {
    try {
      const departments = await db.Department.findAll();
      res.status(200).json(departments);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  
// Fetch all employees
app.get('/employees', async (req, res) => {
try {
    const employees = await db.Employee.findAll({
    include: db.Department
    });
    res.status(200).json(employees);
} catch (error) {
    res.status(400).json({ error: error.message });
}
});
  

// Sync with the database and start the server
db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});