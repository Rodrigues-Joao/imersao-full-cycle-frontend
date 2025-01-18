"use client";

import { useEffect, useRef } from "react";
import { useMap } from "../../hooks/useMap";
import { socket } from "@/utils/socket-io";

export type MapDriverProps = {
    routeId?: string,
    startLocation: {
        lat: number;
        lng: number;
    } | null,
    endLocation?: {
        lat: number;
        lng: number;
    } | null
}

export function MapDriver( props: MapDriverProps )
{
    const { routeId, startLocation, endLocation } = props
    const mapContainerRef = useRef<HTMLDivElement>( null );
    const map = useMap( mapContainerRef );

    useEffect( () =>
    {
        // if ( !map || !routeId )
        // {
        //     return;
        // }
        if ( !map || !routeId || !startLocation || !endLocation )
        {
            return;
        }

        // const selectElement = document.querySelector(
        //     `#${ routeIdElementId }`
        // )!;

        socket.offAny();
        socket.connect();
        //     selectElement.addEventListener( "change", handler );
        socket.on( 'connect', () =>
        {
            console.log( "connected " )
            socket.emit( `client:new-points`, { routeId } )
        } )
        socket.on(
            `server:new-points/${ routeId }:list`, ( data: { routeId: string, lat: number, lng: number } ) =>
        {
            console.log( data )
            if ( !map.hasRoute( data.routeId ) )
            {
                map.addRouteWithIcons( {
                    routeId: data.routeId,
                    startMarkerOptions: {
                        position: startLocation
                    },
                    endMarkerOptions: {
                        position: endLocation
                    },
                    carMarkerOptions: {
                        position: startLocation
                    },
                } );
            }
            map.moveCar( data.routeId, { lat: data.lat, lng: data.lng } )
        } )
        return () =>
        {
            //   selectElement.removeEventListener( "change", handler );
            // socket.disconnect();
        };
    }, [map, startLocation, endLocation, routeId] );

    return <div className="w-2/3 h-full" ref={mapContainerRef} />;
}