import React, { useState } from "react";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("password");

  const [passwords, setPasswords] = useState({
    current: "",
    next: "",
    confirm: "",
  });
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
  });



  const handlePasswordSave = (e) => {
    e.preventDefault();
    if (!passwords.next || passwords.next !== passwords.confirm) {
      return alert("Passwords do not match");
    }
    alert("Password updated (local only)");
    setPasswords({ current: "", next: "", confirm: "" });
  };

  const handleNotificationsSave = (e) => {
    e.preventDefault();
    alert("Notification preferences saved (local only)");
  };

  const TabButton = ({ id, label }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={
        `mr-2 rounded-md border px-3 py-2 text-sm transition-colors ` +
        (activeTab === id
          ? " bg-[var(--two2m)] text-white hover:bg-[var(--two4m)] cursor-pointer"
          : "border-gray-300 bg-white text-gray-900 hover:bg-gray-50")
      }
      type="button"
    >
      {label}
    </button>
  );

  const Section = ({ title, children }) => (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <h3 className="mt-0 text-lg font-medium text-gray-900">{title}</h3>
      {children}
    </div>
  );

  return (
    <div className="mx-auto bg-[var(--two5m)] h-[100vh] p-4 ">
      <div className="mb-4">
       
        <TabButton id="password" label="Password" />
        <TabButton id="notifications" label="Notifications" />
      </div>

     

      {activeTab === "password" && (
        <Section title="Password">
          <form onSubmit={handlePasswordSave} className="grid gap-3">
            <label className="block">
              <div className="mb-1 text-sm font-medium text-gray-700">
                Current password
              </div>
              <input
                type="password"
                value={passwords.current}
                onChange={(e) =>
                  setPasswords({ ...passwords, current: e.target.value })
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[var(--two2m)] "
              />
            </label>
            <label className="block">
              <div className="mb-1 text-sm font-medium text-gray-700">
                New password
              </div>
              <input
                type="password"
                value={passwords.next}
                onChange={(e) =>
                  setPasswords({ ...passwords, next: e.target.value })
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[var(--two2m)] "
              />
            </label>
            <label className="block">
              <div className="mb-1 text-sm font-medium text-gray-700">
                Confirm password
              </div>
              <input
                type="password"
                value={passwords.confirm}
                onChange={(e) =>
                  setPasswords({ ...passwords, confirm: e.target.value })
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[var(--two2m)] "
              />
            </label>
            <div>
              <button
                type="submit"
                className="rounded-md border bg-[var(--two2m)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--two4m)]"
              >
                Update password
              </button>
            </div>
          </form>
        </Section>
      )}

      {activeTab === "notifications" && (
        <Section title="Notifications">
          <form onSubmit={handleNotificationsSave} className="grid gap-3">
            <label className="flex items-center gap-2 text-sm text-gray-800">
              <input
                type="checkbox"
                checked={notifications.email}
                onChange={(e) =>
                  setNotifications({
                    ...notifications,
                    email: e.target.checked,
                  })
                }
                className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:bg-[var(--two2m)] focus:outline-none focus:ring-1 focus:ring-sky-600"
              />
              Email notifications
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-800">
              <input
                type="checkbox"
                checked={notifications.sms}
                onChange={(e) =>
                  setNotifications({ ...notifications, sms: e.target.checked })
                }
                className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:bg-[var(--two2m)] focus:outline-none focus:ring-1 focus:ring-sky-600"
              />
              SMS notifications
            </label>
            <div>
              <button
                type="submit"
                className="rounded-md border bg-[var(--two2m)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--two4m)]"
              >
                Save preferences
              </button>
            </div>
          </form>
        </Section>
      )}
    </div>
  );
};

export default Settings;
