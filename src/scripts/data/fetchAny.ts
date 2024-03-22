import { 
    ArrayValidationError, isValidationObject,
} from "../errors/validationError";


const baseUrl = 'https://deepspeakapi.fly.dev'

export async function fetchMany( 
    pathToCollection: string, 
    orderBy='topic', 
    order='asc', 
    limit=10, 
    offset=0
): Promise<Object> {
    const url = `${baseUrl}${pathToCollection}?`
        + `order-by=${orderBy}`
        + `&order=${order}`
        + `&limit=${limit}`
        + `&offset=${offset}` 

    const res = await fetch(url, { mode: "cors" });
    
    return await res.json(); 
}

export async function fetchGet(
    pathToCollection: string, 
    documentId: string
): Promise<Object> {
    const res = await fetch(
        `${baseUrl}${pathToCollection}/${documentId}`, 
        { mode: "cors" }
    );

    return await res.json();
}

export async function fetchPost(
    pathToCollection: string, 
    body: FormData,
    headers: { [key: string]: string } = {}
): Promise<Object> {
    const res = await fetch(
        `${baseUrl}${pathToCollection}`, 
        { 
            mode: "cors",
            method: 'POST',
            body,
            headers
        }
    );

    return await res.json();
}

export async function fetchDelete(
    pathToCollection: string, 
    user: string,
    headers: { [key: string]: string } = {}
): Promise<Object | null> {
    const res = await fetch(
        `${baseUrl}${pathToCollection}/${user}`,
        { 
            mode: "cors",
            method: 'DELETE',
            headers
        }
    );

    // Res might include json
    const contentType = res.headers.get('content-type');

    if (
        contentType 
        && contentType.includes('application/json')
    ) {
        return await res.json();
    }
    
    return null
}

export function fetchArrayValidationError(
    json: Object
): ArrayValidationError {
    if (
        'errors' in json 
        && Array.isArray(json.errors)
        && isValidationObject(json.errors[0])
    ) {
        return new ArrayValidationError(json.errors)
    }

    throw fetchError(json)
}

function fetchError(json: Object): Error {
    if (
        'errors' in json
        && Array.isArray(json.errors)
        && 'message' in json.errors[0]
    ) {
        return new Error(json.errors[0].message)
    }

    return new Error('Error receiving JSON')
}