

async function botDetail_inserted(connection, { bot_active, bot_level, bot_image, bot_name, bot_id }) {

    try {
        const mysqlInsert_query = `
            INSERT INTO bot_details (bot_id, bot_name, bot_image, bot_level, bot_active)
            VALUES (?, ?, ?, ?, ?)`;

        const values = [bot_id, bot_name, bot_image, bot_level, bot_active];
        return new Promise((resolve, reject) => {
            connection.query(mysqlInsert_query, values, (err, result) => {
                if (err) {
                    console.error("Error inserting:", err);
                    return reject(err);
                } else {
                    if (result.affectedRows > 0) {
                        resolve(result);
                    }else{
                        resolve("0 rows affected")
                    }
                    // Resolve with the result of the query
                }
            });
        });
    } catch (error) {
        console.error("Unexpected error:", error);
        throw error;  // Rethrow the error for handling in the calling function
    }
}

module.exports = { botDetail_inserted };
