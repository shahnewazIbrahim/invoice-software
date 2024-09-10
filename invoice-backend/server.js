const express = require('express');
const cors = require('cors');  // Import the cors middleware
const fs = require('fs');
const path = require('path');

const app = express();

// Enable CORS for all routes
app.use(cors());

app.use(express.json());

// Create a 'data' directory if it doesn't exist
const dataFolder = path.join(__dirname, 'data');
if (!fs.existsSync(dataFolder)) {
  fs.mkdirSync(dataFolder);
}

// Endpoint to save an invoice
app.post('/save-invoice', (req, res) => {
  const invoice = req.body;
  const invoiceNumber = invoice.invoiceNumber;

  if (!invoiceNumber) {
    return res.status(400).json({ error: 'Invoice number is required' });
  }

  const filePath = path.join(dataFolder, `${invoiceNumber}.json`);

  fs.writeFile(filePath, JSON.stringify(invoice, null, 2), (err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to save invoice' });
    }
    res.json({ message: 'Invoice saved successfully' });
  });
});

app.get('/count-invoices', (req, res) => {
  fs.readdir(dataFolder, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read invoice directory' });
    }

    // Filter out only .json files
    const invoiceFiles = files.filter(file => file.endsWith('.json'));
    const invoiceCount = invoiceFiles.length;

    res.json({ count: invoiceCount });
  });
});


app.get('/list-invoices', (req, res) => {
  fs.readdir(dataFolder, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read invoice directory' });
    }

    // Filter out only .json files
    const invoiceFiles = files.filter(file => file.endsWith('.json'));

    // Read each invoice file and collect their content
    const invoices = [];
    let filesRead = 0;

    invoiceFiles.forEach(file => {
      const filePath = path.join(dataFolder, file);

      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to read invoice file' });
        }

        invoices.push(JSON.parse(data));
        filesRead++;

        // When all files are read, send the response
        if (filesRead === invoiceFiles.length) {
          invoices.sort((a, b) => a.invoiceNumber - b.invoiceNumber);
          res.json({ invoices : invoices });
        }
      });
    });

    // If there are no invoice files, send an empty list
    if (invoiceFiles.length === 0) {
      res.json({ invoices: [] });
    }
  });
});


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
