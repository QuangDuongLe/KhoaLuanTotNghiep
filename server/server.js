require('dotenv').config();
const app = require('./app');
const connect2DB = require('./config/data');

connect2DB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is now running on PORT: ${PORT}`);
});
