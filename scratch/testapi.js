const https = require('https');

const options = {
  hostname: 'api.healthybazar.com',
  port: 443,
  path: '/api/v2/products',
  method: 'GET',
  headers: {
    'Origin': 'http://localhost:4200',
    'apikey': 'e28390d3-8f65-4f24-9d85-b2650cf0433b'
  }
};

const req = https.request(options, (res) => {
  console.log('Status Code:', res.statusCode);
  console.log('Headers:', JSON.stringify(res.headers, null, 2));

  let body = '';
  res.on('data', (d) => {
    body += d;
  });

  res.on('end', () => {
    console.log('Body Length:', body.length);
    try {
      const json = JSON.parse(body);
      console.log('Success:', json.success);
      if (json.data && json.data.products) {
        console.log('Products Count:', json.data.products.length);
        if (json.data.products.length > 0) {
          console.log('First Product Name:', json.data.products[0].name);
        }
      } else {
        console.log('Data or Products missing. Keys in JSON:', Object.keys(json));
      }
    } catch (e) {
      console.log('Failed to parse JSON body');
    }
  });
});

req.on('error', (e) => {
  console.error('Error:', e);
});

req.end();
