const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imagesToOptimize = [
  {
    input: 'image/TT006_optimized.jpg',
    output: 'image/optimized/TT006_optimized.avif',
    maxWidth: 1920,
    quality: 75
  },
  {
    input: 'image/TongTheDem.jpg',
    output: 'image/TongTheDem.avif',
    maxWidth: 1920,
    quality: 75
  },
  {
    input: 'image/sanpham/bietthuonlap/slide_29.jpg',
    output: 'image/sanpham/bietthuonlap/slide_29.avif',
    maxWidth: 1200,
    quality: 75
  },
  {
    input: 'image/sanpham/nhapholienke/slide_15.jpg',
    output: 'image/sanpham/nhapholienke/slide_15.avif',
    maxWidth: 1200,
    quality: 75
  },
  {
    input: 'image/sanpham/nhapholienke/slide_17.jpg',
    output: 'image/sanpham/nhapholienke/slide_17.avif',
    maxWidth: 1200,
    quality: 75
  },
  {
    input: 'image/anhTintuc/06.jpg',
    output: 'image/optimized/anhTintuc/06.avif',
    maxWidth: 1200,
    quality: 75
  },
  {
    input: 'image/anhTintuc/03.jpg',
    output: 'image/optimized/anhTintuc/03.avif',
    maxWidth: 1200,
    quality: 75
  },
  {
    input: 'image/sanpham/bietthuonlap/slide_31.jpg',
    output: 'image/sanpham/bietthuonlap/slide_31.avif',
    maxWidth: 1200,
    quality: 75
  },
  {
    input: 'image/sanpham/bietthusonglap/slide_26.jpg',
    output: 'image/sanpham/bietthusonglap/slide_26.avif',
    maxWidth: 1200,
    quality: 75
  },
  {
    input: 'image/sanpham/shophouse/slide_7.jpg',
    output: 'image/sanpham/shophouse/slide_7.avif',
    maxWidth: 1200,
    quality: 75
  },
  {
    input: 'image/sanpham/shophouse/slide_8.jpg',
    output: 'image/sanpham/shophouse/slide_8.avif',
    maxWidth: 1200,
    quality: 75
  },
  {
    input: 'image/sanpham/shophouse/slide_9.jpg',
    output: 'image/sanpham/shophouse/slide_9.avif',
    maxWidth: 1200,
    quality: 75
  },
  {
    input: 'image/sanpham/nhapholienke/slide_16.jpg',
    output: 'image/sanpham/nhapholienke/slide_16.avif',
    maxWidth: 1200,
    quality: 75
  },
  {
    input: 'image/sanpham/nhapholienke/slide_18.jpg',
    output: 'image/sanpham/nhapholienke/slide_18.avif',
    maxWidth: 1200,
    quality: 75
  },
  {
    input: 'image/sanpham/nhapholienke/slide_19.jpg',
    output: 'image/sanpham/nhapholienke/slide_19.avif',
    maxWidth: 1200,
    quality: 75
  },
  {
    input: 'image/sanpham/nhapholienke/slide_20.jpg',
    output: 'image/sanpham/nhapholienke/slide_20.avif',
    maxWidth: 1200,
    quality: 75
  },
  {
    input: 'image/sanpham/nhapholienke/slide_21.jpg',
    output: 'image/sanpham/nhapholienke/slide_21.avif',
    maxWidth: 1200,
    quality: 75
  },
  {
    input: 'image/sanpham/bietthusonglap/slide_24.jpg',
    output: 'image/sanpham/bietthusonglap/slide_24.avif',
    maxWidth: 1200,
    quality: 75
  },
  {
    input: 'image/sanpham/bietthusonglap/slide_25.jpg',
    output: 'image/sanpham/bietthusonglap/slide_25.avif',
    maxWidth: 1200,
    quality: 75
  },
  {
    input: 'image/sanpham/congtrinhbieutuong/slide_34.jpg',
    output: 'image/sanpham/congtrinhbieutuong/slide_34.avif',
    maxWidth: 1200,
    quality: 75
  },
  {
    input: 'image/sanpham/congtrinhbieutuong/slide_36.jpg',
    output: 'image/sanpham/congtrinhbieutuong/slide_36.avif',
    maxWidth: 1200,
    quality: 75
  },
  {
    input: 'image/sanpham/congtrinhbieutuong/slide_38.jpg',
    output: 'image/sanpham/congtrinhbieutuong/slide_38.avif',
    maxWidth: 1200,
    quality: 75
  },
  {
    input: 'image/logo/backgroundMobile.jpg',
    output: 'image/logo/backgroundMobile.avif',
    maxWidth: 1200,
    quality: 75
  },
  {
    input: 'image/logo/Location_image_optimized.jpg',
    output: 'image/optimized/logo/Location_image_optimized.avif',
    maxWidth: 1200,
    quality: 75
  },
  {
    input: 'image/anhTintuc/01.jpg',
    output: 'image/optimized/anhTintuc/01.avif',
    maxWidth: 1200,
    quality: 75
  },
  {
    input: 'image/anhTintuc/02.jpg',
    output: 'image/optimized/anhTintuc/02.avif',
    maxWidth: 1200,
    quality: 75
  },
  {
    input: 'image/anhTintuc/04.jpg',
    output: 'image/optimized/anhTintuc/04.avif',
    maxWidth: 1200,
    quality: 75
  },
  {
    input: 'image/anhTintuc/05.jpg',
    output: 'image/optimized/anhTintuc/05.avif',
    maxWidth: 1200,
    quality: 75
  },
  {
    input: 'image/anhTintuc/07.jpg',
    output: 'image/optimized/anhTintuc/07.avif',
    maxWidth: 1200,
    quality: 75
  },
  {
    input: 'image/sanpham/bietthuonlap/slide_30.jpg',
    output: 'image/sanpham/bietthuonlap/slide_30.avif',
    maxWidth: 1200,
    quality: 75
  }
];

async function optimizeImage(item) {
  const inputPath = item.input;
  const outputPath = item.output;

  if (!fs.existsSync(inputPath)) {
    console.log(`Skip: ${inputPath} (not found)`);
    return null;
  }

  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  try {
    const statsBefore = fs.statSync(inputPath);
    const sizeBeforeKB = (statsBefore.size / 1024).toFixed(2);

    await sharp(inputPath)
      .resize(item.maxWidth, null, { withoutEnlargement: true, fit: 'inside' })
      .avif({ quality: item.quality, effort: 4 })
      .toFile(outputPath);

    const statsAfter = fs.statSync(outputPath);
    const sizeAfterKB = (statsAfter.size / 1024).toFixed(2);
    const savedKB = (statsBefore.size - statsAfter.size) / 1024;
    const savedPercent = ((savedKB / statsBefore.size) * 100).toFixed(1);

    console.log(`OK ${inputPath} - ${sizeBeforeKB}KB -> ${sizeAfterKB}KB (saved ${savedPercent}%)`);
    return { input: inputPath, before: sizeBeforeKB, after: sizeAfterKB, saved: savedPercent };
  } catch (error) {
    console.log(`ERROR ${inputPath}: ${error.message}`);
    return null;
  }
}

async function main() {
  console.log('Optimizing images...\n');
  const results = [];

  for (const item of imagesToOptimize) {
    const result = await optimizeImage(item);
    if (result) results.push(result);
  }

  console.log('\n=== SUMMARY ===');
  let totalBefore = 0;
  let totalAfter = 0;

  results.forEach((r, i) => {
    console.log(`${i + 1}. ${r.before}KB -> ${r.after}KB (${r.saved}%) ${r.input}`);
    totalBefore += parseFloat(r.before);
    totalAfter += parseFloat(r.after);
  });

  const totalSaved = ((totalBefore - totalAfter) / totalBefore * 100).toFixed(1);
  console.log(`\nTotal: ${totalBefore.toFixed(2)}KB -> ${totalAfter.toFixed(2)}KB (saved ${totalSaved}%)`);
  console.log('Done!');
}

main().catch(console.error);