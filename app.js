const fs = require('fs');
const axios = require('axios');

let totalMessagesSent = 0;
let cooldown = 0;
async function sendMessages(urls, customText) {
  try {
    console.log(`[-(*)-]Sending: "say.txt" - Total Message Sent(${totalMessagesSent})`);
    const requests = urls.map((url, index) =>
      axios
        .get(`${url}${encodeURIComponent(customText)}`)
        .then((response) => {
          if (response.status === 200) {
            return `[-(v)-]Link ${index + 1}: OK`;
          } else {
            return `[-(x)-]Link ${index + 1}: Unexpected status code: ${response.status}`;
          }
        })
        .catch((error) => {
          // console.log(error)
          if (error.response.data.parameters.retry_after) {
            // cooldown = parseInt(error.response.data.parameters.retry_after) * 1000;
            return `[-(x)-]Link ${index + 1}: API Cooldown!: ${error.response.data.parameters.retry_after}`;
          }else{
            return `[-(x)-]Link ${index + 1}: API down!: ${error.response.data.status}`;
          }
        })
    );
    const results = await Promise.allSettled(requests);
    results.forEach((result) => {
      console.log(result.value);
    });
    totalMessagesSent++;
    console.log('+' + '='.repeat(50) + '+');    
  } catch (error) {
    console.error('[ x ]Error:', error.message);
  }
}

async function main() {
  try {
    const urls = fs
      .readFileSync('urls.txt', 'utf8')
      .trim()
      .split('\n');
    const customText = fs
    .readFileSync('say.txt', 'utf8')
    .trim()
    .split('\n');; // Custom text
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    while (true) {
      await sendMessages(urls, customText);
    }
  } catch (error) {
    console.error('[ x ]Error:', error.message);
  }
}

main();
