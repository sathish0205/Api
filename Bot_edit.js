const { databseConnection } = require("../databaseConnectors/databseConnection");

const BotEditData = ({ app }) => {

    // Endpoint to delete a bot
    app.post('/deletebot', async (req, res) => {
        const { bot_id } = req.body;

        if (!bot_id) {
            return res.status(400).send("Please provide the bot_id.");
        }

        const sqlQuery = "DELETE FROM ludo.bot_details WHERE bot_id = ?;";
        const values = [bot_id];

        try {
            const conn = await databseConnection();
            if (!conn) {
                return res.status(400).send("Database connection error.");
            }

            conn.query(sqlQuery, values, (err, result) => {
                if (err) {
                    return res.status(400).send(`Error deleting bot: ${err}`);
                }
                if (result.affectedRows > 0) {
                    res.send("Bot deleted successfully.");
                } else {
                    res.status(404).send("Bot ID not found.");
                }
            });
        } catch (error) {
            console.error("Error deleting bot:", error);
            res.status(500).send("Internal Server Error");
        }
    });

    // Endpoint to fetch bot data by ID
    app.post('/fetchbotdata', async (req, res) => {
        const { bot_id } = req.body;

        if (!bot_id) {
            return res.status(400).send("Please provide the bot_id.");
        }

        const sqlQuery = "SELECT * FROM ludo.bot_details WHERE bot_id = ?;";
        const values = [bot_id];

        try {
            const conn = await databseConnection();
            if (!conn) {
                return res.status(400).send("Database connection failed.");
            }

            conn.query(sqlQuery, values, (err, result) => {
                if (err) {
                    return res.status(400).send("Error fetching bot data.");
                }
                if (result.length > 0) {
                    res.send(result);
                } else {
                    res.status(404).send("No bot found with the given bot_id.");
                }
            });
        } catch (error) {
            console.error("Error fetching bot data:", error);
            res.status(500).send("Internal Server Error");
        }
    });

    // Endpoint to update bot data
    app.put('/botupdate', async (req, res) => {
        const { bot_id } = req.body;

        if (!bot_id) {
            return res.status(400).send("Please provide the bot_id.");
        }

        const sqlQuery = "SELECT * FROM ludo.bot_details WHERE bot_id = ?;";
        const values = [bot_id];

        try {
            const conn = await databseConnection();
            if (!conn) {
                return res.status(400).send("Database connection failed.");
            }

            // Fetch existing bot details
            conn.query(sqlQuery, values, (err, result) => {
                if (err) {
                    console.error("Error fetching bot details:", err);
                    return res.status(500).send("Error fetching bot details.");
                }
                if (result.length > 0) {
                    let updateQuery = "UPDATE ludo.bot_details SET ";
                    const updateValues = [];
                    const keys = Object.keys(req.body);

                    keys.forEach(key => {
                        const value = req.body[key];
                        if (key !== "bot_id" && value !== undefined) {
                            updateQuery += `${key} = ?, `;
                            updateValues.push(value);
                        }
                    });

                    updateQuery = updateQuery.slice(0, -2) + " WHERE bot_id = ?";
                    updateValues.push(bot_id);

                    // Update bot details
                    conn.query(updateQuery, updateValues, (err, result) => {
                        if (err) {
                            console.error("Error updating bot details:", err);
                            return res.status(500).send("Error updating bot details.");
                        }
                        if (result.affectedRows > 0) {
                            res.send("Bot details updated successfully.");
                        } else {
                            res.status(404).send("No bot found with the given bot_id.");
                        }
                    });
                } else {
                    res.status(404).send("No bot details found with the given bot_id.");
                }
            });
        } catch (error) {
            console.error("Error during bot update:", error);
            res.status(500).send("Internal Server Error");
        }
    });
};

module.exports = { BotEditData };
