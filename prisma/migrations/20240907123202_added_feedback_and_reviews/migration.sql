-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "fk_category";

-- CreateTable
CREATE TABLE "order_products" (
    "order_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,

    CONSTRAINT "order_products_pkey" PRIMARY KEY ("order_id","product_id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" SERIAL NOT NULL,
    "first_name" VARCHAR(256) NOT NULL,
    "last_name" VARCHAR(256) NOT NULL,
    "company_name" VARCHAR(256),
    "country" VARCHAR(256) NOT NULL,
    "city" VARCHAR(256) NOT NULL,
    "address" VARCHAR(512) NOT NULL,
    "postal_code" VARCHAR(10) NOT NULL,
    "phone_number" VARCHAR(15) NOT NULL,
    "email" VARCHAR(320) NOT NULL,
    "additional_info" VARCHAR(1024),
    "price" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feedback" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(256) NOT NULL,
    "email" VARCHAR(256) NOT NULL,
    "subject" VARCHAR(256) NOT NULL,
    "message" TEXT NOT NULL,
    "is_archived" BOOLEAN DEFAULT false,

    CONSTRAINT "feedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "value" INTEGER NOT NULL,
    "comment" VARCHAR(256),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "order_products" ADD CONSTRAINT "order_products_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "order_products" ADD CONSTRAINT "order_products_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
