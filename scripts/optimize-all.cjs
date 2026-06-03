const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imagesToOptimize = [
  { input: 'image/logo/mobileTongTheDemFix.png', maxWidth: 1920, quality: 70 },
  { input: 'image/TT006_optimized.jpg', maxWidth: 1920, quality: 70 },
  { input: 'image/thumnaill.jpg', maxWidth: 1200, quality: 80 },
  { input: 'image/logo/Location_image_optimized.webp', maxWidth: 1200, quality: 75 },
  { input: 'image/TongTheDem.avif', maxWidth: 1920, quality: 70 },
  { input: 'image/anhTintuc/01.webp', maxWidth: 1200, quality: 75 },
  { input: 'image/anhTintuc/02.webp', maxWidth: 1200, quality: 75 },
  { input: 'image/anhTintuc/03.webp', maxWidth: 1200, quality: 75 },
  { input: 'image/anhTintuc/04.webp', maxWidth: 1200, quality: 75 },
  { input: 'image/anhTintuc/05.webp', maxWidth: 1200, quality: 75 },
  { input: 'image/anhTintuc/06.webp', maxWidth: 1200, quality: 75 },
  { input: 'image/anhTintuc/07.webp', maxWidth: 1200, quality: 75 },
  { input: 'image/sanpham/shophouse/slide_7.avif', maxWidth: 1200, quality: 75 },
  { input: 'image/sanpham/shophouse/slide_8.avif', maxWidth: 1200, quality: 75 },
  { input: 'image/sanpham/shophouse/slide_9.avif', maxWidth: 1200, quality: 75 },
  { input: 'image/sanpham/nhapholienke/slide_15.avif', maxWidth: 1200, quality: 75 },
  { input: 'image/sanpham/nhapholienke/slide_16.avif', maxWidth: 1200, quality: 75 },
  { input: 'image/sanpham/nhapholienke/slide_17.avif', maxWidth: 1200, quality: 75 },
  { input: 'image/sanpham/nhapholienke/slide_18.avif', maxWidth: 1200, quality: 75 },
  { input: 'image/sanpham/nhapholienke/slide_19.avif', maxWidth: 1200, quality: 75 },
  { input: 'image/sanpham/nhapholienke/slide_20.avif', maxWidth: 1200, quality: 75 },
  { input: 'image/sanpham/nhapholienke/slide_21.avif', maxWidth: 1200, quality: 75 },
  { input: 'image/sanpham/bietthusonglap/slide_24.avif', maxWidth: 1200, quality: 75 },
  { input: 'image/sanpham/bietthusonglap/slide_25.avif', maxWidth: 1200, quality: 75 },
  { input: 'image/sanpham/bietthusonglap/slide_26.avif', maxWidth: 1200, quality: 75 },
  { input: 'image/sanpham/bietthuonlap/slide_29.avif', maxWidth: 1200, quality: 75 },
  { input: 'image/sanpham/bietthuonlap/slide_30.avif', maxWidth: 1200, quality: 75 },
  { input: 'image/sanpham/bietthuonlap/slide_31.avif', maxWidth: 1200, quality: 75 },
  { input: 'image/sanpham/congtrinhbieutuong/slide_34.avif', maxWidth: 1200, quality: 75 },
  { input: 'image/sanpham/congtrinhbieutuong/slide_36.avif', maxWidth: 1200, quality: 75 },
  { input: 'image/sanpham/congtrinhbieutuong/slide_38.avif', maxWidth: 1200, quality: 75 },
];

async function optimizeImage(item) {
  if (!fs.existsSync(item.input)) {
    console.log(`Skip: ${item.input} (not found)`);
    return null;
  }

  try {
    const ext = path.extname(item.input).toLowerCase();
    const baseName = path.basename(item.input, ext);
    const dirName = path.dirname(item.input);
    const outputPath = path.join(dirName, baseName + '.avif');

    const statsBefore = fs.statSync(item.input);
    const sizeBeforeKB = (statsBefore.size / 1024).toFixed(2);

    let sharpInstance = sharp(item.input).resize(item.maxWidth, null, { withoutEnlargement: true, fit: 'inside' });
    
    await sharpInstance.avif({ quality: item.quality, effort: 4 }).toFile(outputPath);

    const statsAfter = fs.statSync(outputPath);
    const sizeAfterKB = (statsAfter.size / 1024).toFixed(2);
    const savedPercent = (((statsBefore.size - statsAfter.size) / statsBefore.size) * 100).toFixed(1);

    console.log(`${sizeBeforeKB}KB -> ${sizeAfterKB}KB (${savedPercent}%) - ${item.input}`);
    return { before: sizeBeforeKB, after: sizeAfterKB };
  } catch (error) {
    console.log(`ERROR ${item.input}: ${error.message}`);
    return null;
  }
}

async function main() {
  console.log('Optimizing large images...\n');
  let totalBefore = 0;
  let totalAfter = 0;

  for (const item of imagesToOptimize) {
    const result = await optimizeImage(item);
    if (result) {
      totalBefore += parseFloat(result.before);
      totalAfter += parseFloat(result.after);
    }
  }

  const totalSaved = (((totalBefore - totalAfter) / totalBefore) * 100).toFixed(1);
  console.log(`\nTotal: ${totalBefore.toFixed(2)}KB -> ${totalAfter.toFixed(2)}KB (saved ${totalSaved}%)`);
}

main().catch(console.error);