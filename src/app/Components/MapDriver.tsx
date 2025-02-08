"use client";

import { useEffect, useRef } from "react";
import { useMap } from "../../hooks/useMap";
import { socket } from "@/utils/socket-io";

export type MapDriverProps = {
    routeIdElement?: string,

}

export function MapDriver( props: MapDriverProps )
{
    const { routeIdElement } = props
    const mapContainerRef = useRef<HTMLDivElement>( null );
    const map = useMap( mapContainerRef );

    useEffect( () =>
    {
        // if ( !map || !routeId )
        // {
        //     return;
        // }
        if ( !map || !routeIdElement )
        {
            return;
        }
        console.log( "MapDriver" )

        const selectElement = document.querySelector(
            `#${ routeIdElement }`
        )!;
        socket.connect();
        const handler = async ( event: any ) =>
        {
            const routeId = event.target!.value
            socket.offAny();


            console.log( `handler routeId = ${ routeId }` )
            socket.on(
                `server:new-points/${ routeId }:list`, async ( data: { routeId: string, lat: number, lng: number } ) =>
            {
                console.log( data )

                if ( !map.hasRoute( data.routeId ) )
                {
                    const response = await fetch(
                        `${ process.env.NEXT_PUBLIC_NEXT_API_URL }/routes/${ data.routeId }`
                    );
                    const route = await response.json();
                    map.addRouteWithIcons( {
                        routeId: data.routeId,
                        startMarkerOptions: {
                            position: route.directions.routes[0].legs[0].start_location,
                        },
                        endMarkerOptions: {
                            position: route.directions.routes[0].legs[0].end_location,
                        },
                        carMarkerOptions: {
                            position: route.directions.routes[0].legs[0].start_location,
                        },
                    } );
                }
                map.moveCar( data.routeId, { lat: data.lat, lng: data.lng } );
            } )
        }
        selectElement.addEventListener( "change", handler );
        return () =>
        {
            selectElement.removeEventListener( "change", handler );
            socket.disconnect();
        };
    }, [map, routeIdElement] );

    return <div className="w-2/3 h-full" ref={mapContainerRef} />;
}