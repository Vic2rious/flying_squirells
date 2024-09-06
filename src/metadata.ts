/* eslint-disable */
export default async () => {
  const t = {};
  return {
    '@nestjs/swagger': {
      models: [
        [
          import('./dto/create-order.dto'),
          {
            CreateOrderDto: {
              first_name: {
                required: true,
                type: () => String,
                minLength: 2,
                maxLength: 256,
              },
              last_name: {
                required: true,
                type: () => String,
                minLength: 2,
                maxLength: 256,
              },
              company_name: {
                required: false,
                type: () => String,
                minLength: 2,
                maxLength: 256,
              },
              country: {
                required: true,
                type: () => String,
                minLength: 2,
                maxLength: 256,
              },
              city: {
                required: true,
                type: () => String,
                minLength: 2,
                maxLength: 256,
              },
              address: {
                required: true,
                type: () => String,
                minLength: 2,
                maxLength: 512,
              },
              postal_code: {
                required: true,
                type: () => String,
                pattern: '/^[0-9]{4}$/',
              },
              phone_number: { required: true, type: () => String },
              email: { required: true, type: () => String },
              additional_info: {
                required: false,
                type: () => String,
                minLength: 0,
                maxLength: 1024,
              },
              product_ids: { required: true, type: () => [Number] },
              amounts: { required: true, type: () => [Number] },
            },
          },
        ],
        [
          import('./cats/dto/create-cat.dto'),
          {
            CreateCatDto: {
              name: { required: true, type: () => String },
              age: { required: true, type: () => Number },
              breed: { required: true, type: () => String },
            },
          },
        ],
      ],
      controllers: [
        [import('./app.controller'), { AppController: { handleNotFound: {} } }],
        [
          import('./categories.controller'),
          {
            CategoriesController: {
              getHello: { type: String },
              getCategoryById: {},
              getAllCategories: {},
              createCategory: {},
              updateCategory: {},
              deleteCategory: {},
            },
          },
        ],
        [
          import('./products.controller'),
          {
            ProductsController: {
              getProductById: {},
              getPaginatedProducts: {},
              createProduct: {},
              updateProduct: {},
              deleteProduct: {},
            },
          },
        ],
        [
          import('./orders.controller'),
          {
            OrdersController: {
              getAllOrders: {},
              getOrderById: {},
              createOrder: {},
              updateOrder: {},
              deleteOrder: {},
            },
          },
        ],
        [
          import('./feedback.controller'),
          {
            FeedbackController: {
              createFeedback: {},
              getAllFeedback: {},
              getFeedbackById: {},
              archiveFeedback: {},
            },
          },
        ],
        [
          import('./review.controller'),
          {
            ReviewController: {
              getAllReviews: {},
              getReviewById: {},
              createReview: {},
            },
          },
        ],
        [
          import('./cats/cats.controller'),
          {
            CatsController: {
              findAll: { type: String },
              findOne: { type: String },
              remove: { type: String },
            },
          },
        ],
      ],
    },
  };
};
