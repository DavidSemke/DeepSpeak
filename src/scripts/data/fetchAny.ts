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
    order: 'asc' | 'desc' = 'asc', 
    limit: number | null = null, 
    offset: number | null = null,
    populate: string | null = null,
    ids: string[] | null = null
): Promise<FetchReturn | null> {
    // If ids is not null, only those rooms having the given ids
    // should be fetched
    // If ids is an empty array, no need for a request
    if (ids !== null && !ids.length) {
        return null
    }

    let url = consts.SERVER_URL + pathToCollection
    const queryParamValuePairs = [
        ['order-by', orderBy],
        ['order', order],
        ['limit', limit],
        ['offset', offset],
        ['populate', populate],
        ['ids', ids?.join(',')],
    ]
    const querySegments: string[] = []

    for (const [param, value] of queryParamValuePairs) {
        if (value !== null && value !== undefined) {
            querySegments.push(`${param}=${value}`) 
        }
    }

    if (querySegments.length) {
        url += '?' + querySegments.join('&')
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