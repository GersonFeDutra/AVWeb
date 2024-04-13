const express = require("express");
const app = express();
const debug = require("debug")("myapp:debug");
const mongoose = require("mongoose");
require("dotenv").config();

const Food = require("./model/Food");
const PORT = 3000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
app.get("/", (req, res) => {
  res.send("<html><body><h1>Home Page<h1></body></html>");
  debug("\x1b[33mhome page\x1b[m");
});
app.post("/api/foods", async (req, res) => {
  const food = new Food({
    name: req.body.name,
    category: req.body.category,
    quantity: req.body.quantity,
    expirationDate: req.body.expirationDate,
    price: req.body.price,
  });

  try {
    const newFood = await food.save(); // Salva o novo alimento no banco de dados
    res.status(201).json(newFood); // Retorna o alimento criado em JSON
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
app.get("/api/foods", async (req, res) => {
  try {
    const foods = await Food.find(); // Busca todos os alimentos no banco de dados
    res.json(foods); // Retorna a lista de alimentos em JSON
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
app.get("/api/foods/:id", async (req, res) => {
  try {
    const food = await Food.findById(req.params.id); // Busca o alimento pelo ID
    if (!food) {
      return res.status(404).json({ message: "Alimento não encontrado" });
    }
    res.json(food); // Retorna os detalhes do alimento em JSON
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
app.put("/api/foods/:id", async (req, res) => {
  try {
    const food = await Food.findById(req.params.id); // Busca o alimento pelo ID
    if (!food) {
      return res.status(404).json({ message: "Alimento não encontrado" });
    }

    if (req.body.name) {
      food.name = req.body.name;
    }
    if (req.body.category) {
      food.category = req.body.category;
    }
    if (req.body.quantity) {
      food.quantity = req.body.quantity;
    }
    if (req.body.expirationDate) {
      food.expirationDate = req.body.expirationDate;
    }
    if (req.body.price) {
      food.price = req.body.price;
    }

    const updatedFood = await food.save(); // Salva as alterações no alimento
    res.json(updatedFood); // Retorna o alimento atualizado em JSON
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
app.delete("/api/foods/:id", async (req, res) => {
  try {
    const deletedFood = await Food.findByIdAndDelete(req.params.id); // Busca e exclui o alimento pelo ID
    if (!deletedFood) {
      return res.status(404).json({ message: "Alimento não encontrado" });
    }
    res.json({ message: "Alimento excluído" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Conectar ao Banco de Dados - usar URL fornecida pelo Atlas
mongoose.connect(process.env.DB_CONNECT);

// Servidor
app.listen(PORT, (port = PORT) => {
  console.log(`Server is running on port ${port}!`);
});
