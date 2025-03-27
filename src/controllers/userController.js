import User from "../models/userModel.js";

export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error al listar usuarios:", error);
    res.status(500).json({ message: "Error al listar usuarios" });
  }
};

export const createUser = async (req, res) => {
  const { password, username, phone } = req.body;

  if (!phone || !username) {
    return res.status(400).json({ message: "Telefono y correo obligatorios" });
  }

  try {
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: "Usuario ya existe" });
    }

    const existingPhone = await User.findOne({ where: { phone } });
    if (existingPhone) {
      return res.status(400).json({ message: "El teléfono ya existe" });
    }
  } catch (error) {
    console.error("Error al verificar usuario o teléfono:", error);
    return res
      .status(500)
      .json({ message: "Error al verificar usuario o teléfono" });
  }

  function isValidEmail(email) {
    if (typeof email !== "string" || email.trim() === "") {
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  if (!isValidEmail(username)) {
    return res.status(400).json({ message: "Correo no válido" });
  }

  if (!password || password.length < 8) {
    return res
      .status(400)
      .json({ message: "La contraseña debe tener al menos 8 caracteres" });
  }

  if (!/^\d{10}$/.test(phone)) {
    return res
      .status(400)
      .json({ message: "El teléfono debe tener 10 dígitos" });
  }

  try {
    const newUser = await User.create({
      username,
      phone, 
      password,
      status: true,
      creationDate: new Date(),
    });

    console.log(newUser);
    await userCreatedEvent(newUser);
    return res
      .status(201)
      .json({ message: "Usuario creado correctamente", data: newUser });
  } catch (error) {
    console.error("Error al crear usuario:", error);
    res.status(500).json({ message: "Error al crear usuario" });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { password, phone } = req.body;

  try {
      const user = await User.findByPk(id);

      if (!user) {
          return res.status(400).json({ message: 'Usuario no encontrado' });
      }

      if (password && password.length<8) {
        return res.status(400).json({ message: 'La contrasena debe ser minimo 8 caracteres' });
      }
      if (phone) {
        const existingPhone = await User.findOne({where: {phone}});
        if (existingPhone && existingPhone.id !== id) {
          return res.status(400).json({message: "El teléfono ya existe"});
        }
      }
      await user.update({
          phone: phone || user.phone,
          password: password || user.password,
      });

      return res.status(200).json({ message: 'Usuario actualizado' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al actualizar el usuario', error: error.message });
  }

};


export const deleteStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      if (status === false && user.status === false){
        return res.status(200).json({message: "Este usuario ya fue dado de baja", user});
      }
    
      await user.update({
      status: status || user.status,
    });
    return res.status(200).json({ message: 'Usuario actualizado' });

  } catch (error){
    console.error(error);
    return res.status(500).json({ message: "Error al eliminar usuario", error: error.message})
  }
  


};

import jwt from "jsonwebtoken";
import { userCreatedEvent } from "../services/rabbitServiceEvent.js";


export const login = async (req, res) => {
  try {
    const SECRET_KEY = "aJksd9QzPl+sVdK7vYc/L4dK8HgQmPpQ5K9yApUsj3w="; 

    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Usuario y contraseña son obligatorios" });
    }

    const user = await User.findOne({ where: { username } });

    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    return res.status(200).json({ message: "Inicio de sesión exitoso", token });
  } catch (error) {
    console.error("Error en el inicio de sesión:", error);
    return res.status(500).json({ message: "Error en el servidor", error: error.message });
  }
};
