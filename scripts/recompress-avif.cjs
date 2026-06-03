const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Tạo thư mục optimized nếu chưa có
const optimizedDirs = [
  'image/optimized/logo',
  'image/optimized/anhTintuc',
];

optimizedDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const imagesToOptimize = [
  { input: 'image/TongTheDem.avif', output: 'image/TongTheDem_new.avif' },
  { input: 'image/sanpham/shophouse/slide_7.avif', output: 'image/sanpham/shophouse/slide_7_new.avif' },
  { input: 'image/sanpham/shophouse/slide_8.avif', output: 'image/sanpham/shophouse/slide_8_new.avif' },
  { input: 'image/sanpham/shophouse/slide_9.avif', output: 'image/sanpham/shophouse/slide_9_new.avif' },
  { input: 'image/sanpham/nhapholienke/slide_15.avif', output: 'image/sanpham/nhapholienke/slide_15_new.avif' },
  { input: 'image/sanpham/nhapholienke/slide_16.avif', output: 'image/sanpham/nhapholienke/slide_16_new.avif' },
  { input: 'image/sanpham/nhapholienke/slide_17.avif', output: 'image/sanpham/nhapholienke/slide_17_new.avif' },
  { input: 'image/sanpham/nhapholienke/slide_18.avif', output: 'image/sanpham/nhapholienke/slide_18_new.avif' },
  { input: 'image/sanpham/nhapholienke/slide_19.avif', output: 'image/sanpham/nhapholienke/slide_19_new.avif' },
  { input: 'image/sanpham/nhapholienke/slide_20.avif', output: 'image/sanpham/nhapholienke/slide_20_new.avif' },
  { input: 'image/sanpham/nhapholienke/slide_21.avif', output: 'image/sanpham/nhapholienke/slide_21_new.avif' },
  { input: 'image/sanpham/bietthusonglap/slide_24.avif', output: 'image/sanpham/bietthusonglap/slide_24_new.avif' },
  { input: 'image/sanpham/bietthusonglap/slide_25.avif', output: 'image/sanpham/bietthusonglap/slide_25_new.avif' },
  { input: 'image/sanpham/bietthusonglap/slide_26.avif', output: 'image/sanpham/bietthusonglap/slide_26_new.avif' },
  { input: 'image/sanpham/bietthuonlap/slide_29.avif', output: 'image/sanpham/bietthuonlap/slide_29_new.avif' },
  { input: 'image/sanpham/bietthuonlap/slide_30.avif', output: 'image/sanpham/bietthuonlap/slide_30_new.avif' },
  { input: 'image/sanpham/bietthuonlap/slide_31.avif', output: 'image/sanpham/bietthuonlap/slide_31_new.avif' },
  { input: 'image/sanpham/congtrinhbieutuong/slide_34.avif', output: 'image/sanpham/congtrinhbieutuong/slide_34_new.avif' },
  { input: 'image/sanpham/congtrinhbieutuong/slide_36.avif', output: 'image/sanpham/congtrinhbieutuong/slide_36_new.avif' },
  { input: 'image/sanpham/congtrinhbieutuong/slide_38.avif', output: 'image/sanpham/congtrinhbieutuong/slide_38_new.avif' },
];

async function main() {
  console.log('Re-compressing existing AVIF files...\n');
  let totalBefore = 0;
  let totalAfter = 0;

  for (const item of imagesToOptimize) {
    if (!fs.existsSync(item.input)) {
      console.log(`Skip: ${item.input} (not found)`);
      continue;
    }

    try {
      const statsBefore = fs.statSync(item.input);
      const sizeBeforeKB = (statsBefore.size / 1024).toFixed(2);

      await sharp(item.input)
        .resize(1200, null, { withoutEnlargement: true, fit: 'inside' })
        .avif({ quality: 75, effort: 4 })
        .toFile(item.output);

      const statsAfter = fs.statSync(item.output);
      const sizeAfterKB = (statsAfter.size / 1024).toFixed(2);
      const saved = (((statsBefore.size - statsAfter.size) / statsBefore.size) * 100).toFixed(1);

      console.log(`${sizeBeforeKB}KB -> ${sizeAfterKB}KB (${saved}%) - ${path.basename(item.input)}`);
      totalBefore += parseFloat(sizeBeforeKB);
      totalAfter += parseFloat(sizeAfterKB);

      // Xóa file cũ và đổi tên file mới
      fs.unlinkSync(item.input);
      fs.renameSync(item.output, item.input);
    } catch (error) {
      console.log(`ERROR: ${item.input} - ${error.message}`);
    }
  }

  const totalSaved = (((totalBefore - totalAfter) / totalBefore) * 100).toFixed(1);
  console.log(`\nTotal: ${totalBefore.toFixed(2)}KB -> ${totalAfter.toFixed(2)}KB (saved ${totalSaved}%)`);
  console.log('Done!');
}

main().catch(console.error);