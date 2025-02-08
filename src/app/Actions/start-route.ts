'use server'

export async function startRouteAction( state: { error?: string, success?: boolean } | null, formData: FormData )
{
    const { routeId } = Object.fromEntries( formData )
    const response = await fetch( `${ process.env.NEST_API_URL }/routes/${ routeId }/start`, {
        method: "POST",

    } )
    if ( !response.ok )
        return { error: 'Failed to start route' }

    return { success: true }
}