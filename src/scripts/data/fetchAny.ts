import { 
    ArrayValidationError, 
    isValidationObject,
} from "../errors/validationError";
import consts from "./constants";


type JsonObject = { [key: string]: unknown }
type FetchReturn = {
    status: number,
    json: JsonObject
}

export async function fetchMany( 
    pathToCollection: string, 
    orderBy='topic', 
    order='asc', 
    limit=10, 
    offset=0,
    populate: string | undefined = undefined
): Promise<FetchReturn> {
    let url = `${consts.SERVER_URL}${pathToCollection}?`
        + `order-by=${orderBy}`
        + `&order=${order}`
        + `&limit=${limit}`
        + `&offset=${offset}`
    
    if (populate !== undefined) {
        url += `&populate=${populate}` 
    } 

    const res = await fetch(url, { mode: "cors" });
    const json = await res.json()
    const status = res.status

    return { status, json };
}

export async function fetchGet(
    pathToCollection: string, 
    documentId: string
): Promise<FetchReturn> {
    const res = await fetch(
        `${consts.SERVER_URL}${pathToCollection}/${documentId}`, 
        { mode: "cors" }
    );
    const json = await res.json()
    const status = res.status

    return { status, json };
}

export async function fetchPost(
    pathToCollection: string, 
    body: FormData,
    headers: { [key: string]: string } = {}
): Promise<FetchReturn> {
    const res = await fetch(
        `${consts.SERVER_URL}${pathToCollection}`, 
        { 
            mode: "cors",
            method: 'POST',
            body,
            headers
        }
    );
    const json = await res.json()
    const status = res.status

    return { status, json };
}

export async function fetchDelete(
    pathToCollection: string, 
    user: string,
    headers: { [key: string]: string } = {}
): Promise<FetchReturn | null> {
    const res = await fetch(
        `${consts.SERVER_URL}${pathToCollection}/${user}`,
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
        const json = await res.json()
        const status = res.status

        return { status, json };
    }
    
    return null
}

export function fetchArrayValidationError(
    json: JsonObject
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

function fetchError(json: JsonObject): Error {
    if (
        'errors' in json
        && Array.isArray(json.errors)
        && 'message' in json.errors[0]
    ) {
        return new Error(json.errors[0].message)
    }

    return new Error('Error receiving JSON')
}