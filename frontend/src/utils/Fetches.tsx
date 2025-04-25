export const getHi = async () => {
    const response = await fetch("/hi", {
        method: "GET"
    });
    if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.detail || "Failed to get data";
        throw new Error(errorMessage);
    }
    const data = await response.json();
    return data.message;
}