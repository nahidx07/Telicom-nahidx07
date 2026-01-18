import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

const Settings = () => {
    const updateAppInfo = async (name, logoUrl) => {
        const settingsRef = doc(db, "app_settings", "general");
        await updateDoc(settingsRef, {
            appName: name,
            logo: logoUrl
        });
        alert("App Settings Updated!");
    };

    return (
        <div className="p-10">
            <h2 className="text-xl font-bold mb-4">App Customization</h2>
            <input id="appName" placeholder="App Name" className="border p-2 w-full mb-4" />
            <input id="logoUrl" placeholder="Logo URL (Image Link)" className="border p-2 w-full mb-4" />
            <button onClick={() => updateAppInfo(
                document.getElementById('appName').value,
                document.getElementById('logoUrl').value
            )} className="bg-black text-white p-3 rounded-lg">Save Changes</button>
        </div>
    );
};
