'use server'

import { revalidateTag } from "next/cache"

export async function createRouteAction( state: { error?: string, success?: boolean } | null, formData: FormData )
{
    const { sourceId, destinationId } = Object.fromEntries( formData )
    const directionsResponse = await fetch( `${ process.env.NEST_API_URL }/directions?originId=${ sourceId }&destinationId=${ destinationId }` )
    if ( !directionsResponse.ok )
        return { error: 'Failed to fetch directions' }
    const directionsData = await directionsResponse.json()
    const startAddress = directionsData.routes[0].legs[0].start_address
    const endAddress = directionsData.routes[0].legs[0].end_address

    const response = await fetch( `${ process.env.NEST_API_URL }/routes`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify( {
            name: `${ startAddress } - ${ endAddress }`,
            sourceId,
            destinationId
        } )

    } )
    if ( !response.ok )
        return { error: 'Failed to create new route' }
    revalidateTag( "routes" )
    return { success: true }
}