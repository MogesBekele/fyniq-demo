// auditLogger.js
export const logAction = ({ action, file, user }) => {
  const logs = JSON.parse(localStorage.getItem("logs") || "[]");
  logs.push({
    id: Date.now(),
    action,
    file,
    user,
    timestamp: new Date().toISOString(),
  });
  localStorage.setItem("logs", JSON.stringify(logs));
};
