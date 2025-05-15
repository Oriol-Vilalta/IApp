
export const getRequest = async (url) => {
    return await fetch(API_URL + url, {
        mode: 'cors',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
};