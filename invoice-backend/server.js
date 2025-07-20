const express = require('express');
const cors = require('cors');  // Import the cors middleware
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2');
const knex = require('knex');
const dayjs = require('dayjs');

const app = express();

const connection = mysql.createConnection({
  host: 'localhost',  // Replace with your database host
  user: 'root',  // Replace with your MySQL username
  password: '',  // Replace with your MySQL password
  database: 'invoice_management'  // Replace with your database name
});

const db = knex({
  client: 'mysql2',
  connection: {
    host: 'localhost',  // Replace with your database host
    user: 'root',  // Replace with your MySQL username
    password: '',  // Replace with your MySQL password
    database: 'invoice_management'
  }
});
// Enable CORS for all routes
app.use(cors());

app.use(express.json());

// Create a 'data' directory if it doesn't exist
const dataFolder = path.join(__dirname, 'data');
if (!fs.existsSync(dataFolder)) {
  fs.mkdirSync(dataFolder);
}

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database');
});

app.get('/list-invoices-mysql', async (req, res) => {
  // Query the database to get invoices

  // try {
  //   const invoices = await db('invoices').select('*'); // Replace 'invoices' with your table name
  //   // Replace 'invoices' with your table name
  //   res.json(invoices);
  // } catch (err) {
  //   console.error('Error fetching invoices:', err);
  //   res.status(500).send('Server error');
  // }

  try {
  const rows = await db('invoices')
    .leftJoin('invoice_items', 'invoices.id', 'invoice_items.invoiceId')
    .select(
      'invoices.id',
      'invoices.invoiceNumber',
      'invoices.clientName',
      'invoices.invoiceDate',
      'invoices.dueDate',
      'invoices.status',
      'invoice_items.id as item_id',
      'invoice_items.invoiceId',
      'invoice_items.description',
      'invoice_items.quantity',
      'invoice_items.price',
    );

  // return res.json(rows)
  // Grouping logic
  const grouped = {};

  for (const row of rows) {
    const invoiceId = row.id;

    if (!grouped[invoiceId]) {
      grouped[invoiceId] = {
        id: invoiceId,
        invoiceNumber: row.invoiceNumber,
        clientName: row.clientName,
        clientEmail: row.clientEmail,
        invoiceDate: dayjs(row.invoiceDate).format("YYYY-MM-DD"),
        dueDate: dayjs(row.dueDate).format("YYYY-MM-DD"),
        status: row.status,
        items: []
      };
    }

    if (row.invoiceId) {
      grouped[invoiceId].items.push({
        id: row.id,
        invoiceId: row.invoiceId,
        quantity: row.quantity,
        price: parseFloat(row.price)
      });
    }
  }

  const invoices = Object.values(grouped);
  res.json(invoices);
} catch (err) {
  console.error('Error fetching invoices:', err);
  res.status(500).send('Server error');
}



  // const query = 'SELECT * FROM invoices'; // Replace 'invoices' with your table name

  // connection.query(query, (err, results) => {
  //   if (err) {
  //     console.error('Error executing query:', err);
  //     res.status(500).send('Server error');
  //     return;
  //   }

  //   // Send the results as the response
  //   res.json(results);
  // });
});


app.post('/invoice-create-mysql', async (req, res) => {
  // // Query the database to get invoices
  const { invoiceNumber, invoiceDate, dueDate, clientName, clientEmail, status } = req.body;
  const { description, quantity, price } = req.body.items;
  // // Create the SQL query to insert a new invoice
  // const query = `
  //   INSERT INTO invoices (invoiceNumber, invoiceDate, dueDate, clientName, status)
  //   VALUES (?, ?, ?, ?, ?)
  // `;

  // return res.status(500).send({ description, quantity, price })
  // // Execute the query with the provided values
  // connection.query(query, [invoiceNumber, invoiceDate, dueDate, clientName, status], (err, results) => {
  //   if (err) {
  //     console.error('Error creating invoice:', err);
  //     res.status(500).send(err.sqlMessage);
  //     return;
  //   }

  //   // Send back the ID of the newly created invoice
  //   res.status(201).json({
  //     message: 'Invoice created successfully',
  //     invoice_id: results.insertId
  //   });
  // });
  const invoiceData = {
    invoiceNumber, 
    invoiceDate, 
    dueDate, 
    clientName, 
    clientEmail, 
    status
  }
  try {
    let invoiceId = 0;
    console.log('ddfdf',invoiceId && req.body.items.length)  
    const invoices = await db('invoices').insert(invoiceData).then((res) => {
                              invoiceId = res[0]
                              console.log('invoices Record inserted', res[0])
                            }); // Replace 'invoices' with your table name
                          console.log('ddfdf',invoiceId && req.body.items.length)  
    if (invoiceId && req.body.items.length) {
      await req.body.items.forEach(async (item) =>{
        console.log({
              invoiceId: parseInt(invoiceId),
              description: item.description, 
              quantity: item.quantity, 
              price: item.price
            }
          )
        // await db('invoice_items').insert(
        //   {
        //     invoiceId: invoiceId,
        //     description: item.description, 
        //     quantity: item.quantity, 
        //     price: item.price
        //   }
        // )
        // .then((res) => {
        //         console.log('invoicesItems Record inserted', res[0])
        // }); 
      })
    } 

    res.status(201).json({
      message: 'Invoice created successfully',
      invoice_id: invoices
    });
  } catch (err) {
    console.error('Error fetching invoices:', err);
    res.status(500).send('Server error');
  }
});

app.get('/invoices/:invoiceNumber', async (req, res) => {
  const invoiceNumber = req.params.invoiceNumber;

  try {
    // Step 1: Invoice খুঁজে বের করা
    const invoice = await db('invoices')
      .where('invoiceNumber', invoiceNumber)
      .first();

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    // Step 2: এই invoice-এর items খুঁজে বের করা
    const items = await db('invoice_items')
      .where('invoiceId', invoice.id)
      .select('description', 'quantity', 'price');

    // Step 3: JSON তৈরি করা
    const result = {
      invoiceNumber: invoice.invoiceNumber,
      invoiceDate: dayjs(invoice.invoiceDate).format("YYYY-MM-DD"),
      dueDate: dayjs(invoice.dueDate).format("YYYY-MM-DD"),
      clientName: invoice.clientName,
      clientEmail: invoice.clientEmail,
      status: invoice.status,
      items: items
    };

    res.json(result);
  } catch (err) {
    console.error('Error fetching invoice:', err);
    res.status(500).json({ error: 'Server error' });
  }
});


// Endpoint to save an invoice
app.post('/save-invoice', async (req, res) => {
  const { invoiceNumber, invoiceDate, dueDate, clientName, clientEmail, status } = req.body;
  const { description, quantity, price } = req.body.items;

  const invoiceData = {
    invoiceNumber, 
    invoiceDate, 
    dueDate, 
    clientName, 
    clientEmail, 
    status
  }
  try {
    let invoiceId = 0;
    const invoices = await db('invoices').insert(invoiceData).then((res) => {
                              invoiceId = res[0]
                              console.log('invoices Record inserted', res[0])
                            }); // Replace 'invoices' with your table name

    req.body.items.forEach(async (item) =>{
      await db('invoice_items').insert(
        {
          invoiceId: invoiceId,
          description: item.description, 
          quantity: item.quantity, 
          price: item.price
        }
      ).then((res) => {
              invoiceId = res[0]
              console.log('invoicesItems Record inserted', res[0])
            }); 
        })
    res.status(201).json({
      message: 'Invoice created successfully',
      invoice_id: invoices
    });
  } catch (err) {
    console.error('Error fetching invoices:', err);
    res.status(500).send('Server error');
  }
});


app.get('/count-invoices', (req, res) => {
  fs.readdir(dataFolder, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read invoice directory' });
    }

    // Filter out only .json files
    const invoiceFiles = files.filter(file => file.endsWith('.json'));

    let totalCount = 0;
    let pendingCount = 0;
    let overdueCount = 0;
    let paidCount = 0;

    let filesRead = 0;

    // Read each invoice file and count based on status
    invoiceFiles.forEach(file => {
      const filePath = path.join(dataFolder, file);

      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to read invoice file' });
        }

        try {
          const invoice = JSON.parse(data);
          
          totalCount++;

          // Count based on invoice status
          if (invoice.status === 'pending') {
            pendingCount++;
          } else if (invoice.status === 'overdue') {
            overdueCount++;
          } else if (invoice.status === 'paid') {
            paidCount++;
          }
        } catch (parseError) {
          return res.status(500).json({ error: 'Failed to parse invoice file' });
        }

        filesRead++;

        // When all files are read, send the response
        if (filesRead === invoiceFiles.length) {
          res.json({
            totalCount: totalCount,
            pendingCount: pendingCount,
            overdueCount: overdueCount,
            paidCount: paidCount
          });
        }
      });
    });

    // If there are no invoice files, send counts as zero
    if (invoiceFiles.length === 0) {
      res.json({
        totalCount: 0,
        pendingCount: 0,
        overdueCount: 0,
        paidCount: 0
      });
    }
  });
});


app.put('/invoices/:invoiceNumber', async (req, res) => {
  const invoiceNumber = req.params.invoiceNumber;
  const updatedInvoice = req.body;

  if (!updatedInvoice || updatedInvoice.invoiceNumber !== invoiceNumber) {
    return res.status(400).json({ error: 'Invoice number mismatch or invalid data' });
  }

  try {
    // Step 1: Get the invoice from DB
    const invoice = await db('invoices')
      .where({ invoiceNumber })
      .first();

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    // Step 2: Update the invoice table
    await db('invoices')
      .where({ invoiceNumber })
      .update({
        invoiceDate: updatedInvoice.invoiceDate,
        dueDate: updatedInvoice.dueDate,
        clientName: updatedInvoice.clientName,
        clientEmail: updatedInvoice.clientEmail,
        status: updatedInvoice.status
      });

    // Step 3: Delete old items for this invoice
    await db('invoice_items').where({ invoiceId: invoice.id }).del();

    // Step 4: Insert new items
    const items = updatedInvoice.items || [];
    if (items.length > 0) {
      const itemInserts = items.map(item => ({
        invoiceId: invoice.id,
        description: item.description,
        quantity: item.quantity,
        price: item.price
      }));

      await db('invoice_items').insert(itemInserts);
    }

    return res.json({ message: 'Invoice updated successfully' });
  } catch (err) {
    console.error('Error updating invoice:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/invoices/:invoiceNumber', async (req, res) => {
  const invoiceNumber = req.params.invoiceNumber;

  try {
    // Step 1: Get the invoice record by invoiceNumber
    const invoice = await db('invoices')
      .where({ invoiceNumber })
      .first();

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    // Step 2: Begin a transaction to ensure atomicity
    await db.transaction(async trx => {
      // Step 3: Delete all items related to the invoice
      await trx('invoice_items').where({ invoiceId: invoice.id }).del();

      // Step 4: Delete the invoice itself
      await trx('invoices').where({ id: invoice.id }).del();
    });

    res.json({ message: 'Invoice deleted successfully' });
  } catch (err) {
    console.error('Error deleting invoice:', err);
    res.status(500).json({ error: 'Server error' });
  }
});



// app.get('/list-invoices', (req, res) => {
//   fs.readdir(dataFolder, (err, files) => {
//     if (err) {
//       return res.status(500).json({ error: 'Failed to read invoice directory' });
//     }

//     // Filter out only .json files
//     const invoiceFiles = files.filter(file => file.endsWith('.json'));

//     // Read each invoice file and collect their content
//     const invoices = [];
//     let filesRead = 0;

//     invoiceFiles.forEach(file => {
//       const filePath = path.join(dataFolder, file);

//       fs.readFile(filePath, 'utf8', (err, data) => {
//         if (err) {
//           return res.status(500).json({ error: 'Failed to read invoice file' });
//         }

//         invoices.push(JSON.parse(data));
//         filesRead++;

//         // When all files are read, send the response
//         if (filesRead === invoiceFiles.length) {
//           invoices.sort((a, b) => a.invoiceNumber - b.invoiceNumber);
//           res.json({ invoices : invoices });
//         }
//       });
//     });

//     // If there are no invoice files, send an empty list
//     if (invoiceFiles.length === 0) {
//       res.json({ invoices: [] });
//     }
//   });
// });


// edit invoice view
// app.get('/invoices/:invoiceNumber', (req, res) => {
//   const invoiceNumber = req.params.invoiceNumber;
//   const filePath = path.join(dataFolder, `${invoiceNumber}.json`);

//   fs.readFile(filePath, 'utf8', (err, data) => {
//     if (err) {
//       if (err.code === 'ENOENT') {
//         return res.status(404).json({ error: 'Invoice not found' });
//       } else {
//         return res.status(500).json({ error: 'Failed to read invoice' });
//       }
//     }

//     try {
//       const invoice = JSON.parse(data);
//       res.json({ invoice });
//     } catch (parseError) {
//       res.status(500).json({ error: 'Failed to parse invoice' });
//     }
//   });
// });

// app.post('/save-invoice', async (req, res) => {
//   const invoice = req.body;
//   const invoiceNumber = invoice.invoiceNumber;

//   if (!invoiceNumber) {
//     return res.status(400).json({ error: 'Invoice number is required' });
//   }

//   const filePath = path.join(dataFolder, `${invoiceNumber}.json`);

//   fs.writeFile(filePath, JSON.stringify(invoice, null, 2), (err) => {
//     if (err) {
//       return res.status(500).json({ error: 'Failed to save invoice' });
//     }
//     res.json({ message: 'Invoice saved successfully' });
//   });
// });


// app.put('/invoices/:invoiceNumber', (req, res) => {
//   const invoiceNumber = req.params.invoiceNumber;
//   const updatedInvoice = req.body;

//   // Ensure the invoiceNumber in the URL matches the one in the body (if present)
//   if (!updatedInvoice || updatedInvoice.invoiceNumber !== invoiceNumber) {
//     return res.status(400).json({ error: 'Invoice number mismatch or invalid data' });
//   }

//   const filePath = path.join(dataFolder, `${invoiceNumber}.json`);

//   // Check if the invoice exists before updating
//   fs.access(filePath, fs.constants.F_OK, (err) => {
//     if (err) {
//       if (err.code === 'ENOENT') {
//         return res.status(404).json({ error: 'Invoice not found' });
//       } else {
//         return res.status(500).json({ error: 'Failed to access invoice' });
//       }
//     }

//     // If the invoice exists, update it with the new data
//     fs.writeFile(filePath, JSON.stringify(updatedInvoice, null, 2), (err) => {
//       if (err) {
//         return res.status(500).json({ error: 'Failed to update invoice' });
//       }
//       res.json({ message: 'Invoice updated successfully' });
//     });
//   });
// });



// app.delete('/invoices/:invoiceNumber', (req, res) => {
//   const invoiceNumber = req.params.invoiceNumber;
//   const filePath = path.join(dataFolder, `${invoiceNumber}.json`);

//   // Check if the invoice file exists before attempting to delete it
//   fs.access(filePath, fs.constants.F_OK, (err) => {
//     if (err) {
//       if (err.code === 'ENOENT') {
//         return res.status(404).json({ error: 'Invoice not found' });
//       } else {
//         return res.status(500).json({ error: 'Failed to access invoice' });
//       }
//     }

//     // If the file exists, delete it
//     fs.unlink(filePath, (err) => {
//       if (err) {
//         return res.status(500).json({ error: 'Failed to delete invoice' });
//       }
//       res.json({ message: 'Invoice deleted successfully' });
//     });
//   });
// });



// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
