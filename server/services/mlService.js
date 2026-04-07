const axios = require("axios");

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://localhost:8001";

function getMlServiceUrl() {
  if (process.env.NODE_ENV === "production" && !process.env.ML_SERVICE_URL) {
    throw new Error("ML_SERVICE_URL is required in production.");
  }

  return ML_SERVICE_URL;
}

async function callMlService(path, payload) {
  const response = await axios.post(`${getMlServiceUrl()}${path}`, payload, {
    headers: { "Content-Type": "application/json" },
    timeout: 15000,
  });

  return response.data;
}

async function getHealth() {
  const response = await axios.get(`${getMlServiceUrl()}/health`, { timeout: 5000 });
  return response.data;
}

module.exports = {
  callMlService,
  getHealth,
};
