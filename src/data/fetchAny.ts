const baseUrl = 'https://deepspeakapi.fly.dev'

export async function fetchMany( 
    pathToCollection: string, 
    orderBy='topic', 
    order='asc', 
    limit=10, 
    offset=0
): Promise<Object | boolean> {
    const url = `${baseUrl}${pathToCollection}?`
        + `order-by=${orderBy}`
        + `&order=${order}`
        + `&limit=${limit}`
        + `&offset=${offset}` 

    const res = await fetch(url, { mode: "cors" });

    // json is returned in all cases
    try {
        return await res.json();
    } 
    catch (error) {
        return false;
    }
}

export async function fetchPost(
    pathToCollection: string, 
    body: Object
): Promise<Object | boolean> {
    const res = await fetch(
        `${baseUrl}${pathToCollection}`, 
        { 
            mode: "cors",
            method: 'POST',
            body: JSON.stringify(body)
        }
    );

    // api does not return json on success
    if (res.ok) {
        return true
    }

    try {
        return await res.json();
    } 
    catch (error) {
        return false;
    }
}

export async function fetchDelete(
    pathToCollection: string, 
    user: string
): Promise<Object | boolean> {
    const res = await fetch(
        `${baseUrl}${pathToCollection}/${user}`,
        { 
            mode: "cors",
            method: 'DELETE',
        }
    );

    // api does not return json on success
    if (res.ok) {
        return true
    }

    try {
        return await res.json();
    } 
    catch (error) {
        return false;
    }
}