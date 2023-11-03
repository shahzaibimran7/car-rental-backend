const Car = require("../models/car");
const Category = require("../models/category");


const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const category = await Category.create({ name });
    return res.status(201).json(category);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error creating category" });
  }
};
const getCarsByCategory = async (req, res) => {
    try {
      const { categoryId } = req.params;
  
      const category = await Category.findByPk(categoryId);
      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }
      const cars = await Car.findAll({
        include: [
          {
            model: Category,
            where: { id: category.id }, 
            through: { attributes: [] }, 
          },
        ],
      })
  
      return res.status(200).json(cars);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error retrieving cars for the category' });
    }
  };

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    return res.status(200).json(categories);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error retrieving categories" });
  }
};


const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    return res.status(200).json(category);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error retrieving category" });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    category.name = name;
    await category.save();
    return res.status(200).json(category);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error updating category" });
  }
};


const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    await category.destroy();
    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error deleting category" });
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  getCarsByCategory,
  deleteCategory,
};
