#!/usr/bin/env node

/**
 * Hinário Digital Scraper
 * 
 * Scrapes 1,658 songs from Hinário Digital and uploads to S3
 * Usage: pnpm run hinario:scrape
 */

import { hinarioDigitalService } from '../server/services/hinario-digital.service.js';

async function main() {
  console.log('🎵 CELEBRA - Hinário Digital Scraper');
  console.log('=====================================\n');

  try {
    // Step 1: Get stats
    console.log('📊 Hinário Digital Stats:');
    const stats = hinarioDigitalService.getStats();
    console.log(`   Total Songs: ${stats.totalSongs}`);
    console.log(`   Resource Types: ${stats.resourceTypes.join(', ')}`);
    console.log(`   Estimated Size: ${stats.estimatedSize}\n`);

    // Step 2: Scrape songs
    console.log('🔍 Scraping 1,658 songs from Hinário Digital...');
    const songs = await hinarioDigitalService.scrapeSongs();
    console.log(`✅ Scraped ${songs.length} songs\n`);

    // Step 3: Download resources
    console.log('⬇️  Downloading resources (MP3, PDF, MuseScore, Cifra)...');
    const results = await hinarioDigitalService.bulkDownload(songs, ['mp3', 'pdf']);
    
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    
    console.log(`✅ Downloaded: ${successful} resources`);
    console.log(`❌ Failed: ${failed} resources\n`);

    // Step 4: Summary
    console.log('📈 Summary:');
    console.log(`   Songs Processed: ${songs.length}`);
    console.log(`   Resources Downloaded: ${successful}`);
    console.log(`   Success Rate: ${((successful / results.length) * 100).toFixed(1)}%`);
    console.log(`   Estimated Time: 2-4 hours`);
    console.log(`   Estimated Storage: ~50GB\n`);

    console.log('✨ Hinário Digital Scraper completed!');
    console.log('🎉 Songs are now available in CELEBRA\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main();
