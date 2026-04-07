const axios = require("axios");

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://localhost:8001";

async function callMlService(path, payload) {
  const response = await axios.post(`${ML_SERVICE_URL}${path}`, payload, {
    headers: { "Content-Type": "application/json" },
    timeout: 15000,
  });

  return response.data;
}

async function getHealth() {
  const response = await axios.get(`${ML_SERVICE_URL}/health`, { timeout: 5000 });
  return response.data;
}

module.exports = {
  callMlService,
  getHealth,
};
