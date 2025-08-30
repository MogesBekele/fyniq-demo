import fs from "fs";
import path from "path";

// Full path to logs.json in the backend root
const logFilePath = path.join(process.cwd(), "logs.json");

// Read logs safely
const readLogs = () => {
  if (!fs.existsSync(logFilePath)) return [];
  const data = fs.readFileSync(logFilePath, "utf-8");
  try {
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
};

// Append log (immutable)
export const logAction = ({ action, file, user }) => {
  const logs = readLogs();

  const newLog = {
    id: Date.now(),
    action,
    file,
    user,
    timestamp: new Date().toISOString(),
  };

  logs.push(newLog);

  fs.writeFileSync(logFilePath, JSON.stringify(logs, null, 2), "utf-8");
  console.log(`Logged action: ${action} - ${file} by ${user}`);
};
