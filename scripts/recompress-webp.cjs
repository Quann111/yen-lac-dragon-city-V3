const sharp = require('sharp');
const fs = require('fs');

const imagesToOptimize = [
  'image/anhTintuc/01.webp',
  'image/anhTintuc/02.webp',
  'image/anhTintuc/03.webp',
  'image/anhTintuc/04.webp',
  'image/anhTintuc/05.webp',
  'image/anhTintuc/06.webp',
  'image/anhTintuc/07.webp',
];

async function main() {
  console.log('Re-compressing WebP news images...\n');
  let totalBefore = 0;
  let totalAfter = 0;

  for (const input of imagesToOptimize) {
    if (!fs.existsSync(input)) {
      console.log(`Skip: ${input} (not found)`);
      continue;
    }

    try {
      const statsBefore = fs.statSync(input);
      const sizeBeforeKB = (statsBefore.size / 1024).toFixed(2);

      const output = input.replace('.webp', '_new.avif');

      await sharp(input)
        .resize(1200, null, { withoutEnlargement: true, fit: 'inside' })
        .avif({ quality: 75, effort: 4 })
        .toFile(output);

      const statsAfter = fs.statSync(output);
      const sizeAfterKB = (statsAfter.size / 1024).toFixed(2);
      const saved = (((statsBefore.size - statsAfter.size) / statsBefore.size) * 100).toFixed(1);

      console.log(`${sizeBeforeKB}KB -> ${sizeAfterKB}KB (${saved}%) - ${require('path').basename(input)}`);
      totalBefore += parseFloat(sizeBeforeKB);
      totalAfter += parseFloat(sizeAfterKB);

      // Xóa webp cũ và đổi tên avif mới
      fs.unlinkSync(input);
      fs.renameSync(output, input.replace('.webp', '.avif'));
    } catch (error) {
      console.log(`ERROR: ${input} - ${error.message}`);
    }
  }

  const totalSaved = (((totalBefore - totalAfter) / totalBefore) * 100).toFixed(1);
  console.log(`\nTotal: ${totalBefore.toFixed(2)}KB -> ${totalAfter.toFixed(2)}KB (saved ${totalSaved}%)`);
}

main().catch(console.error);