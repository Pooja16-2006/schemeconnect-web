const bcrypt = require("bcryptjs");
const {
  sampleApplications,
  sampleNotifications,
  sampleSchemes,
  sampleUsers,
} = require("./sampleData");

const memoryUsers = [];
const memoryApplications = [];
const memoryCitizenProfiles = [];
const memorySchemes = [];
const memoryNotifications = [];

function seedSampleData() {
  if (!memorySchemes.length) {
    memorySchemes.push(...sampleSchemes);
  }

  if (!memoryCitizenProfiles.length) {
    memoryCitizenProfiles.push(...sampleUsers);
  }

  if (!memoryApplications.length) {
    memoryApplications.push(...sampleApplications);
  }

  if (!memoryNotifications.length) {
    memoryNotifications.push(...sampleNotifications);
  }
}

async function seedDemoAdmin() {
  seedSampleData();

  if (memoryUsers.some((user) => user.email === "admin@schemeconnect.in")) {
    return;
  }

  const password = await bcrypt.hash("admin123", 10);
  memoryUsers.push({
    id: "mem-admin-1",
    name: "SchemeConnect Admin",
    email: "admin@schemeconnect.in",
    password: password,
    role: "admin",
    createdAt: new Date().toISOString(),
  });
}

module.exports = {
  memoryUsers,
  memoryApplications,
  memoryCitizenProfiles,
  memorySchemes,
  memoryNotifications,
  seedDemoAdmin,
  seedSampleData,
};
