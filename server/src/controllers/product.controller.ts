import type { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { v2 as cloudinary } from 'cloudinary';
import ProductModel from '../models/product.model';
import { FetchingConfig } from '../config/fetching';
import { ProductsResponse } from '../types/products.response';
import { Product } from '../types/product.type';

/**
 * @async Function that uploads the Product Images
 *
 * @param imageFiles Array of Files
 * @returns Array of uploaded File's URLs
 */
const uploadImages = async (imageFiles: Express.Multer.File[]) => {
  const uploadPromises = imageFiles.map(async (image) => {
    const b64 = Buffer.from(image.buffer).toString('base64');
    let dataURI = `data:${image.mimetype};base64,${b64}`;
    const response = await cloudinary.uploader.upload(dataURI);

    return response.url;
  });

  return await Promise.all(uploadPromises);
};

/**
 * Function that creates new product, permitted to [Admin] only.
 * @Path /api/admin/products/new
 *
 * @param req Express Request
 * @param res Express Response
 * @returns 400 - bad request
 *          201 - product created
 *          500 - server error
 */
export const newProduct = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ error: errors.array()[0]?.msg });

  try {
    const imageFiles = req.files as Express.Multer.File[];

    const productData: Product = req.body;
    const images = await uploadImages(imageFiles);

    productData.images = images;
    const product = new ProductModel(productData);

    await product.save();

    return res.status(201).json({ message: 'Product added successfully.' });
  } catch (error) {
    console.error('Error creating new product:', (error as Error)?.message);
    return res.status(500).json({ error: 'Something went wrong during new product creation!' });
  }
};

/**
 * Function that updates a product, permitted to [Admin] only.
 * @Path /api/admin/products/update/:productId
 *
 * @param req Express Request
 * @param res Express Response
 * @returns 400 - bad request
 *          404 - product not found
 *          201 - created or update
 *          500 - server error
 */
export const updateProduct = async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) return res.status(400).json({ error: errors.array()[0]?.msg });

  try {
    const productId = req.params.productId;
    if (!productId) return res.status(400).json({ error: 'Product ID not provided!' });

    const { name, price, description, images } = req.body;

    const product = await ProductModel.findByIdAndUpdate(productId, {
      name: name,
      description: description,
      price: price,
      images: images,
    });

    if (!product) return res.status(404).json({ error: 'Product not found!' });

    return res.status(201).json({ product });
  } catch (error) {
    console.error('Error updating product:', (error as Error)?.message);
    return res.status(500).json({ error: 'Error updating product!' });
  }
};

/**
 * Function that deletes a product using its ID, permitted to [Admin] only.
 * @Path /api/admin/products/delete/:productId
 *
 * @param req Express Request
 * @param res Express Response
 * @returns 400 - bad request
 *          404 - product not found
 *          200 - product deleted
 *          500 - server error
 */
export const deleteProduct = async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) return res.status(400).json({ error: errors.array()[0]?.msg });

  try {
    const productId = req.params.productId;
    if (!productId) return res.status(400).json({ error: 'Product ID not provided!' });

    const product = await ProductModel.findByIdAndDelete(productId);
    if (!product) return res.status(404).json({ error: 'Product not found!' });

    return res.status(200).json({ product });
  } catch (error) {
    console.error('Error deleting product:', (error as Error)?.message);
    return res.status(500).json({ error: 'Error deleting product!' });
  }
};

/**
 * Function that fetches a product by its ID, permitted to [Everyone].
 * @Path /api/products/:productId
 *
 * @param req Express Request
 * @param res Express Response
 * @returns 400 - bad request
 *          404 - product not found
 *          200 - product
 *          500 - server error
 */
export const getProduct = async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) return res.status(400).json({ error: errors.array()[0]?.msg });

  try {
    const productId = req.params.productId;
    if (!productId) return res.status(400).json({ error: 'Product ID not provided!' });

    const product = await ProductModel.findOne({ _id: productId });
    if (!product) return res.status(404).json({ error: 'Product not found!' });

    return res.status(200).json({ product });
  } catch (error) {
    console.error('Error fetching product:', (error as Error)?.message);
    return res.status(500).json({ error: 'Error fetching product!' });
  }
};

/**
 * Function that fetches all products, permitted to [Everyone].
 * @Path /api/products
 *
 * @param req Express Request
 * @param res Express Response
 * @returns 200 - products
 *          500 - server error
 */
export const allProducts = async (req: Request, res: Response) => {
  try {
    const pageSize = FetchingConfig.pageSize;
    const pageNumber = parseInt(req.query.page ? req.query.page.toString() : '1');
    const skip = (pageNumber - 1) * pageSize;
    const total = await ProductModel.countDocuments();

    const products = await ProductModel.find().sort().skip(skip).limit(pageSize);

    const response: ProductsResponse = {
      data: products,
      pagination: {
        page: pageNumber,
        pages: Math.ceil(total / pageSize),
        total: total,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching products:', (error as Error)?.message);
    return res.status(500).json({ error: 'Error fetching products!' });
  }
};
