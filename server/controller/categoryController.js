//external module
const slugify = require('slugify');
const categoryModel = require('../model/categoryModel');



// create category
const createCategoryController = async (req, res) => {
    try {
        const { name } = req.body;
        const existingCategory = await categoryModel.findOne({ slug: slugify(name) });
        if (existingCategory) {
            return res.status(400).send({
                success: false,
                message: 'Category already existed'
            })
        }
        const category = await new categoryModel({ name, slug: slugify(name) }).save();
        res.status(201).send({
            success: true,
            message: 'Category created successfully',
            category
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error occured creating a category',
            error
        })
    }
}

//update category
const updateCategoryController = async (req, res) => {
    try {
        const { name } = req.body;
        const { cid } = req.params;
        const category = await categoryModel.findByIdAndUpdate(cid, { name, slug: slugify(name) }, { new: true });
        if (!category) {
            return res.send({
                success: true,
                message: 'Cannot update the category or no category found'
            })
        }
        res.status(200).send({
            success: true,
            message: 'Category updated successfully',
            category
        })


    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error occured updating a category',
            error

        })
    }
}

//delete a category
const deleteCategoryController = async (req, res) => {
    try {
        const { cid } = req.params;
        const category = await categoryModel.findByIdAndDelete(cid);
        if (!category) {
            return res.status(400).send({
                success: false,
                message: 'Error occured deleting category',
            })
        }
        res.status(200).send({
            success: true,
            message: 'Category deleted successfully'
        })


    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error occured deleting category',
            error
        })
    }

}

//get all categories
const getAllCategoryController = async (req, res) => {
    try {
        const category = await categoryModel.find({});
        res.status(200).send({
            success: true,
            message: 'All category fetch success',
            category
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: true,
            message: 'Error occured during all category fetch',
            error
        })
    }
}

//get a single category
const getCategoryController = async (req, res) => {
    try {
        const category = await categoryModel.findOne({ slug: req.params.slug });
        if (!category) {
            return res.send({
                success: true,
                message: "There is no such category"
            })
        }
        res.status(200).send({
            success: true,
            message: "Category fetch success",
            category
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: true,
            message: 'Error occured fetching a category',
            error
        })
    }
}




exports.createCategoryController = createCategoryController;
exports.updateCategoryController = updateCategoryController;
exports.deleteCategoryController = deleteCategoryController;
exports.getAllCategoryController = getAllCategoryController;
exports.getCategoryController = getCategoryController;