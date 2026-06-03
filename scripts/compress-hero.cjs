const sharp = require('sharp');
const fs = require('fs');

const input = 'image/logo/mobileTongTheDemFix.png';
const output = 'image/logo/mobileTongTheDemFix_new.avif';

(async () => {
  if (!fs.existsSync(input)) {
    console.log('File not found:', input);
    return;
  }

  const statsBefore = fs.statSync(input);
  console.log(`Before: ${(statsBefore.size / 1024).toFixed(2)} KB`);

  await sharp(input)
    .resize(1200, null, { withoutEnlargement: true, fit: 'inside' })
    .avif({ quality: 65, effort: 5 })
    .toFile(output);

  const statsAfter = fs.statSync(output);
  console.log(`After: ${(statsAfter.size / 1024).toFixed(2)} KB`);
  console.log(`Saved: ${(((statsBefore.size - statsAfter.size) / statsBefore.size) * 100).toFixed(1)}%`);

  fs.unlinkSync(input);
  fs.renameSync(output, input.replace('.png', '.avif'));
  console.log('Done!');
})();