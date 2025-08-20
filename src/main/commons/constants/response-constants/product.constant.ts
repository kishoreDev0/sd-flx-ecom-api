export const PRODUCT_RESPONSES = {
  PRODUCT_CREATED: (data: any) => ({
    success: true,
    statusCode: 201,
    message: 'Product created successfully',
    data,
  }),
   PRODUCT_BY_ID_FETCHED: (data: any, id:number) => ({
    success: true,
    statusCode: 201,
    message: `Product fetched successfully with id ${id}`,
    data,
  }),
  PRODUCTS_FETCHED: (data: any[]) => ({
    success: true,
    statusCode: 200,
    message: 'Products fetched successfully',
    data,
  }),
  PRODUCT_UPDATED: (data: any) => ({
    success: true,
    statusCode: 200,
    message: 'Product updated successfully',
    data,
  }),
  PRODUCT_DELETED: (id: number) => ({
    success: true,
    statusCode: 200,
    message: `Product with ID ${id} deleted successfully`,
  }),
  PRODUCT_NOT_FOUND: () => ({
    success: false,
    statusCode: 404,
    message: 'Product not found',
  }),
  PRODUCTS_NOT_FOUND: () => ({
    success: false,
    statusCode: 404,
    message: 'No products found',
  }),
};
