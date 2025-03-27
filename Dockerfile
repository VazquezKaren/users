# Usar la imagen oficial de Node.js 18
FROM node:18

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar package.json y package-lock.json para instalar dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el código fuente al contenedor
COPY . .

# Exponer el puerto en el que corre el servicio
EXPOSE 3003

# Comando para iniciar el servicio
CMD ["node", "index.js"]
