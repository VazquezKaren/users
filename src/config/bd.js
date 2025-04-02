import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_NAME, 
    process.env.DB_USER, 
    process.env.DB_PASSWORD, 
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT, // PUERTO POR DEFECTO
        dialect: 'mysql',
        logging: false, 
    }
);

sequelize.authenticate()
    .then(() => {
        console.log('Conexión exitosa');
    })
    .catch((error) => {
        console.error('Error al conectar a la base de datos:', error);
    });
export default sequelize;
