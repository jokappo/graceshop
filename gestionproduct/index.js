import fs from "fs";
import path from "path";

const baseDir = "C:/Users/kouta/Downloads/Image/product/product"; // Remplacez par le chemin de votre dossier racine

const readDirectory = (dirPath) => {
  const categories = [];
  const categoryDirs = fs.readdirSync(dirPath);

  categoryDirs.forEach((categoryName) => {
    const categoryPath = path.join(dirPath, categoryName);

    if (fs.statSync(categoryPath).isDirectory()) {
      const subCategories = [];
      const subCategoryDirs = fs.readdirSync(categoryPath);

      subCategoryDirs.forEach((subCategoryName) => {
        const subCategoryPath = path.join(categoryPath, subCategoryName);

        if (fs.statSync(subCategoryPath).isDirectory()) {
          const products = [];
          const productDirs = fs.readdirSync(subCategoryPath);

          productDirs.forEach((productName) => {
            const productPath = path.join(subCategoryPath, productName);

            if (fs.statSync(productPath).isDirectory()) {
              const files = fs.readdirSync(productPath);
              const images = files.filter((file) =>
                /\.(jpg|jpeg|png|gif)$/i.test(file)
              );
              const wordFile = files.find((file) =>
                /\.(doc|docx)$/i.test(file)
              );

              products.push({
                productName,
                images: images.map((image) => path.join(productPath, image)),
                wordFile: wordFile ? path.join(productPath, wordFile) : null,
              });
            }
          });

          subCategories.push({
            subCategoryName,
            products,
          });
        }
      });

      categories.push({
        categoryName,
        subCategories,
      });
    }
  });

  return categories;
};

// Appel principal
const data = readDirectory(baseDir);

// Afficher les données ou les enregistrer dans une base de données
console.log(JSON.stringify(data, null, 2));
