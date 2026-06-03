/**
 * Image Optimization Script
 * Usage: npm run optimize-images
 * 
 * Optimizes AVIF images for faster page load times
 * Uses sharp library for high-quality compression
 */

import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';

const imageDir = './image';
const optimizedDir = './image/optimized';

// Hero images - above the fold, need highest priority
const HERO_IMAGES = [
  { 
    input: 'TongTheDem.avif', 
    output: 'TongTheDem_opt.avif', 
    maxWidth: 1920, 
    quality: 72 
  },
  { 
    input: 'logo/mobileTongTheDemFix.avif', 
    output: 'logo/mobileTongTheDemFix_opt.avif', 
    maxWidth: 768, 
    quality: 72 
  },
];

// Gallery images - below fold, can be lazy loaded
const GALLERY_IMAGES = [
  { dir: 'anhTintuc', files: ['01.avif', '02.avif', '03.avif', '04.avif', '05.avif', '06.avif', '07.avif'], maxWidth: 1200, quality: 70 },
  { dir: 'sanpham/shophouse', files: ['slide_7.avif', 'slide_8.avif', 'slide_9.avif'], maxWidth: 1200, quality: 70 },
  { dir: 'sanpham/nhapholienke', files: ['slide_15.avif', 'slide_16.avif', 'slide_17.avif', 'slide_18.avif', 'slide_19.avif', 'slide_20.avif', 'slide_21.avif'], maxWidth: 1200, quality: 70 },
  { dir: 'sanpham/bietthusonglap', files: ['slide_24.avif', 'slide_25.avif', 'slide_26.avif'], maxWidth: 1200, quality: 70 },
  { dir: 'sanpham/bietthuonlap', files: ['slide_29.avif', 'slide_30.avif', 'slide_31.avif'], maxWidth: 1200, quality: 70 },
  { dir: 'sanpham/congtrinhbieutuong', files: ['slide_34.avif', 'slide_36.avif', 'slide_38.avif'], maxWidth: 1200, quality: 70 },
];

async function optimizeImage(inputPath, outputPath, maxWidth, quality) {
  try {
    const inputFullPath = path.resolve(inputPath);
    const outputFullPath = path.resolve(outputPath);
    
    // Check if input exists
    try {
      await fs.access(inputFullPath);
    } catch {
      console.log(`⏭️  Skipping (not found): ${inputPath}`);
      return { skipped: true };
    }

    // Ensure output directory exists
    await fs.mkdir(path.dirname(outputFullPath), { recursive: true });

    // Get metadata
    const metadata = await sharp(inputFullPath).metadata();
    const originalWidth = metadata.width || 0;
    const targetWidth = Math.min(originalWidth || maxWidth, maxWidth);

    // Optimize
    let pipeline = sharp(inputFullPath);
    
    // Resize only if larger than target
    if (originalWidth > targetWidth) {
      pipeline = pipeline.resize(targetWidth, null, { 
        withoutEnlargement: true,
        fit: 'inside'
      });
    }
    
    // Compress to AVIF
    await pipeline
      .avif({ 
        quality: quality, 
        effort: 4 // Balance between speed and compression
      })
      .toFile(outputFullPath);

    // Get file sizes
    const inputStats = await fs.stat(inputFullPath);
    const outputStats = await fs.stat(outputFullPath);
    const savings = ((inputStats.size - outputStats.size) / inputStats.size * 100).toFixed(1);
    
    const inputKB = (inputStats.size / 1024).toFixed(1);
    const outputKB = (outputStats.size / 1024).toFixed(1);
    
    console.log(`✅ Optimized: ${inputPath}`);
    console.log(`   ${inputKB}KB → ${outputKB}KB (${savings}% reduction)`);
    
    return { 
      success: true, 
      inputSize: inputStats.size, 
      outputSize: outputStats.size,
      savings: parseFloat(savings)
    };
  } catch (err) {
    console.error(`❌ Error optimizing ${inputPath}:`, err.message);
    return { error: err.message };
  }
}

async function main() {
  console.log('🚀 Starting image optimization...\n');
  console.log('📁 Image directory:', path.resolve(imageDir));
  console.log('📁 Output directory:', path.resolve(optimizedDir), '\n');

  let totalOriginalSize = 0;
  let totalOptimizedSize = 0;
  let optimizedCount = 0;
  let skippedCount = 0;

  // Optimize hero images (highest priority)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🎯 OPTIMIZING HERO IMAGES (Above-the-fold)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  for (const img of HERO_IMAGES) {
    const result = await optimizeImage(
      path.join(imageDir, img.input),
      path.join(optimizedDir, img.output),
      img.maxWidth,
      img.quality
    );
    
    if (result.success) {
      totalOriginalSize += result.inputSize;
      totalOptimizedSize += result.outputSize;
      optimizedCount++;
    } else if (result.skipped) {
      skippedCount++;
    }
  }

  // Optimize gallery images
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🖼️  OPTIMIZING GALLERY IMAGES');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  for (const category of GALLERY_IMAGES) {
    console.log(`\n📂 ${category.dir}/`);
    
    for (const file of category.files) {
      const result = await optimizeImage(
        path.join(imageDir, category.dir, file),
        path.join(optimizedDir, category.dir, file),
        category.maxWidth,
        category.quality
      );
      
      if (result.success) {
        totalOriginalSize += result.inputSize;
        totalOptimizedSize += result.outputSize;
        optimizedCount++;
      } else if (result.skipped) {
        skippedCount++;
      }
    }
  }

  // Summary
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✨ OPTIMIZATION COMPLETE');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📊 Total images processed: ${optimizedCount}`);
  if (skippedCount > 0) {
    console.log(`⏭️  Skipped (not found): ${skippedCount}`);
  }
  console.log(`💾 Total size: ${(totalOriginalSize / 1024).toFixed(1)}KB → ${(totalOptimizedSize / 1024).toFixed(1)}KB`);
  console.log(`📉 Overall reduction: ${((totalOriginalSize - totalOptimizedSize) / totalOriginalSize * 100).toFixed(1)}%`);
  console.log('\n📝 Next steps:');
  console.log('   1. Review optimized images in /image/optimized/');
  console.log('   2. Update component imports to use optimized versions');
  console.log('   3. Run: npm run build && npm run deploy');
}

main().catch(console.error);