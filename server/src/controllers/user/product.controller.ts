import type { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import ProductModel from '../../models/product.model';
import { FetchingConfig } from '../../config/fetching';
import { ProductsResponse } from '../../types/product.type';
import { constructorProductsFilter, ProductsSearchQuery } from '../../filters/user/products.filter';

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
    // search query
    const query: ProductsSearchQuery = req?.query ? constructorProductsFilter(req?.query) : {};

    // pagination
    const pageSize = FetchingConfig.pageSize;
    const pageNumber = parseInt(req.query.page ? req.query.page.toString() : '1');
    const skip = (pageNumber - 1) * pageSize;
    const total = await ProductModel.countDocuments();

    const products = await ProductModel.find(query).sort().skip(skip).limit(pageSize);

    const response: ProductsResponse = {
      data: products,
      pagination: {
        page: pageNumber,
        pages: Math.ceil(total / pageSize),
        total: total,
        hasNext: pageNumber * pageSize < total,
        hasPrev: pageNumber > 1,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching products:', (error as Error)?.message);
    return res.status(500).json({ error: 'Internal server error!' });
  }
};
