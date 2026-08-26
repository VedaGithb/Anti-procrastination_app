import axios from "axios";

const TestConnections = () => {
    const testConnection = async () => {
        try {
            const res = await axios.get('/sessions/leaderboard');
            console.log(res.data);
            alert("Successfully connected to the server");
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div style={{ padding: "50px", textAlign: "center" }}>
            <h1>FocusUp Connection Test</h1>
            <button onClick={testConnection} style={{ padding: "10px 20px", cursor: "pointer" }}>Test Connect</button>
        </div>
    )
}

export default TestConnections;