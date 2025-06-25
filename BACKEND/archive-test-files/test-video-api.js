const fetch = require('node-fetch');

async function testVideoAPI() {
  console.log('🎥 Testing Video API...\n');
  
  // URLs a probar
  const urls = [
    'http://localhost:1337/api/heros?populate[0]=video',
    'https://ashlar-house-production.up.railway.app/api/heros?populate[0]=video'
  ];
  
  for (const url of urls) {
    try {
      console.log(`\n📡 Testing: ${url}`);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'test-video-api'
        }
      });
      
      console.log(`Status: ${response.status} ${response.statusText}`);
      console.log('Headers:', Object.fromEntries(response.headers.entries()));
      
      if (response.ok) {
        const data = await response.json();
        console.log('Response data available:', !!data);
        
        if (data.data && data.data.length > 0) {
          const heroData = data.data[0];
          if (heroData.video) {
            const videoUrl = heroData.video.url;
            console.log(`📹 Video URL found: ${videoUrl}`);
            
            // Probar acceso directo al video
            const baseUrl = url.split('/api')[0];
            const fullVideoUrl = videoUrl.startsWith('http') ? videoUrl : baseUrl + videoUrl;
            console.log(`🔗 Full video URL: ${fullVideoUrl}`);
            
            // Test del video
            const videoResponse = await fetch(fullVideoUrl, {
              method: 'HEAD'
            });
            console.log(`📹 Video response: ${videoResponse.status} ${videoResponse.statusText}`);
            console.log('Video headers:', Object.fromEntries(videoResponse.headers.entries()));
          } else {
            console.log('❌ No video found in hero data');
          }
        } else {
          console.log('❌ No hero data found');
        }
      } else {
        console.log('❌ API request failed');
      }
      
    } catch (error) {
      console.error(`❌ Error testing ${url}:`, error.message);
    }
  }
}

// Ejecutar test
testVideoAPI().catch(console.error);
