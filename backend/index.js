import dotenv from 'dotenv';
dotenv.config()
import app from './app.js';
import client from './config/client.js'
const PORT = process.env.PORT || 3000;



app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});