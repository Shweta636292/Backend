
import { useEffect, useState } from "react";
import { Settings as SettingsIcon, Moon, Sun, Bell, RotateCcw, Save } from "lucide-react";
import "./Settings.css";

function Settings() {
  const [settings, setSettings] = useState({
    theme: "light",
    emailNotifications: true,
    borrowingReminders: true,
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    const savedSettings = localStorage.getItem("librarySettings");

    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleChange = (name, value) => {
    setSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
    setMessage("");
  };

  const handleSave = () => {
    localStorage.setItem("librarySettings", JSON.stringify(settings));
    setMessage("Settings saved successfully!");
  };

  const handleReset = () => {
    const defaultSettings = {
      theme: "light",
      emailNotifications: true,
      borrowingReminders: true,
    };

    setSettings(defaultSettings);
    localStorage.setItem("librarySettings", JSON.stringify(defaultSettings));
    setMessage("Settings reset successfully!");
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <div>
          <h1><SettingsIcon size={27} /> Settings</h1>
          <p>Customize your Little Library experience.</p>
        </div>
      </div>

      <div className="settings-card">
        <h2>Appearance</h2>
        <p>Choose how your library dashboard looks.</p>

        <div className="setting-row">
          <div className="setting-info">
            {settings.theme === "light" ? <Sun /> : <Moon />}
            <div>
              <h3>Theme</h3>
              <span>Select your preferred appearance</span>
            </div>
          </div>

          <select
            value={settings.theme}
            onChange={(e) => handleChange("theme", e.target.value)}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
      </div>

      <div className="settings-card">
        <h2>Notifications</h2>
        <p>Manage your notification preferences.</p>

        <div className="setting-row">
          <div className="setting-info">
            <Bell />
            <div>
              <h3>Email Notifications</h3>
              <span>Receive library updates through email</span>
            </div>
          </div>

          <input
            type="checkbox"
            checked={settings.emailNotifications}
            onChange={(e) =>
              handleChange("emailNotifications", e.target.checked)
            }
          />
        </div>

        <div className="setting-row">
          <div className="setting-info">
            <Bell />
            <div>
              <h3>Borrowing Reminders</h3>
              <span>Get reminders about book return dates</span>
            </div>
          </div>

          <input
            type="checkbox"
            checked={settings.borrowingReminders}
            onChange={(e) =>
              handleChange("borrowingReminders", e.target.checked)
            }
          />
        </div>
      </div>

      <div className="settings-actions">
        <button className="save-settings" onClick={handleSave}>
          <Save size={18} /> Save Settings
        </button>

        <button className="reset-settings" onClick={handleReset}>
          <RotateCcw size={18} /> Reset
        </button>
      </div>

      {message && <p className="settings-message">{message}</p>}
    </div>
  );
}

export default Settings;
