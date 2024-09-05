-- CreateTable
CREATE TABLE "categories" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(256) NOT NULL,
    "cover_photo" TEXT,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(512) NOT NULL,
    "short_description" VARCHAR(512) NOT NULL,
    "description" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "discount" INTEGER,
    "quantity" INTEGER NOT NULL,
    "mark_as_new" BOOLEAN,
    "cover_photo" TEXT NOT NULL,
    "additional_photos" TEXT[],
    "sizes" VARCHAR[],
    "colors" VARCHAR[],
    "category_id" INTEGER,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "fk_category" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
