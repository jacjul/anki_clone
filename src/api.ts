const API_BASE_URL = "";  // Use Vite proxy instead of direct localhost:5000

export async function getAPI(url: string) {
    
     
    try {
        const response = await fetch(`${url}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
            
            mode: "cors",
            credentials: "omit",
        });
        if (!response.ok) {
            throw new Error(`Network response was not ok, ${response.status}`);
        }
        const data = await response.json();
        
        return data;
    } catch (error) {
        console.error("GET error:", error);
        throw error;
    }
}

export async function postAPI(url: string, body?: any) {
    
    try {
        const response = await fetch(`${url}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: body !== undefined ? JSON.stringify(body) : undefined,
            mode: "cors",
            credentials: "omit",
        });



        if (!response.ok) {
            throw new Error(`Network response was not ok, ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("POST error:", error);
        throw error;
    }
}