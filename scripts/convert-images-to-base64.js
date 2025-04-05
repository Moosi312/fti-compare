const fs = require("fs");
const path = require("path");

// Folder containing the images
const imagesFolder = "./public/docs/img"; // Change if needed
const outputFile = "./src/app/shared/image-repository/images-base64.json"; // Output JSON file

// Supported image extensions
const supportedExtensions = [".png", ".jpg", ".jpeg", ".gif", ".bmp", ".webp"];

const result = {};

fs.readdir(imagesFolder, (err, files) => {
  if (err) {
    return console.error("Error reading directory:", err);
  }

  files.forEach((file) => {
    const ext = path.extname(file).toLowerCase();
    if (!supportedExtensions.includes(ext)) return;

    const pdfName = file.substring(0, file.length - ext.length);
    const filePath = path.join(imagesFolder, file);
    const fileData = fs.readFileSync(filePath);
    const base64String = fileData.toString("base64");
    const mimeType = `image/${ext === ".jpg" ? "jpeg" : ext.slice(1)}`;
    result[pdfName] = `data:${mimeType};base64,${base64String}`;
  });

  fs.writeFileSync(outputFile, JSON.stringify(result, null, 2));
  console.log(`✅ Base64 strings written to ${outputFile}`);
});
