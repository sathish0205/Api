const express = require('express');
const { databseConnection } = require('./databaseConnectors/databseConnection');
const { botDetail_inserted } = require('./botDetails/botData');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const { BotEditData } = require('./botDetails/botEdit');

const app = express();
const port = 5000;
const host_name = "localhost"; 

app.use(express.json());
app.use(express.text());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const uploads = multer({ storage });

//******************************************************************** BOT DETAILS API *************************************************************** */
app.post('/botInserteApi', uploads.single('bot_image'), async (req, res) => {
    console.log('Request body:', req.body); // Log the request body
    const { bot_id, bot_name, bot_level, bot_active } = req.body;
    const bot_image = req.file ? req.file.path : null;

    try {
        const connection = await databseConnection();
        const response = await botDetail_inserted(connection, {
            bot_id,
            bot_name,
            bot_image,
            bot_level,
            bot_active,
        });

        res.send(response);
        await connection.end(); // Close the connection
    } catch (error) {
        console.error('Error inserting bot details:', error);
        res.status(500).send('Database operation failed');
    }
});

// GET API to fetch all bot details
app.get('/bot/data', async (req, res) => {
    const query = 'SELECT * FROM bot_details';

    try {
        const connection = await databseConnection(); // Ensure a new connection for the query
        connection.query(query, (err, results) => {
            if (err) {
                console.error('Error fetching bot details:', err);
                return res.status(500).json({ error: 'Database query failed' });
            }
            res.json(results); // Send the results back as JSON
        });
    } catch (error) {
        console.error('Error connecting to the database:', error);
        res.status(500).json({ error: 'Database connection failed' });
    } finally {
        if (connection) {
            await connection.end(); // Close the connection after the query
        }
    }
});

//************************************************* BOT EDIT DATA ************************************************ */
BotEditData({ app });
//************************************************* BOT DELETE DATA ************************************************ */

//***************************************************************************************************************************************** */
app.listen(port, () => {
    console.log(`Server is running at http://${host_name}:${port}`);
});
