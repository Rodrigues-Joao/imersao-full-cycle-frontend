import { RouteModel } from "../../utils/models";
import { MapDriver } from "../Components/MapDriver";
// import { StartRouteForm } from "./StartRouteForm";

export async function getRoutes()
{
    const response = await fetch( `http://localhost:3000/routes`, {
        cache: "force-cache",
        next: {
            tags: ["routes"],
        },
    } );
    //revalidate por demanda
    return response.json();
}
export async function getRoute( routeId: string ): Promise<RouteModel>
{
    const response = await fetch( `http://localhost:3000/routes/${ routeId }`, {
        cache: "force-cache",
        next: {
            tags: [`routes-${ routeId }`, "routes"],
        },
    } );
    //revalidate por demanda
    return response.json();
}

export async function DriverPage( { searchParams }: { searchParams: Promise<{ routeId: string }> } )
{
    const routes = await getRoutes();
    const { routeId } = await searchParams
    let startLocation = null
    let endLocation = null
    if ( routeId )
    {
        const route = await getRoute( routeId );
        const leg = route.directions.routes[0].legs[0]
        console.log( "route ", route )
        startLocation = leg.start_location
        endLocation = leg.end_location
    }
    return (
        <div className="flex flex-1 w-full h-full">
            <div className="w-1/3 p-2 h-full">
                <h4 className="text-3xl text-contrast mb-2">Inicie uma rota</h4>
                <div className="flex flex-col">
                    {/* <StartRouteForm>
                        </StartRouteForm> */}
                    <form method="get">
                        <select
                            id="routeId"
                            name="routeId"
                            className="mb-2 p-2 border rounded bg-default text-contrast"
                        >
                            <option key="0" value="">
                                Selecione uma rota
                            </option>
                            {routes.map( ( route: RouteModel ) => (
                                <option key={route.id} value={route.id}>
                                    {route.name}
                                </option>
                            ) )}
                        </select>
                        <button
                            className="bg-main text-primary p-2 rounded text-xl font-bold"
                            style={{ width: "100%" }}
                        >
                            Iniciar a viagem
                        </button>
                    </form>
                </div>
            </div>
            {/* <MapDriver routeIdElementId={"route_id"} /> */}
            <MapDriver routeId={routeId}
                startLocation={startLocation}
                endLocation={endLocation} />
        </div>
    );
}

export default DriverPage;