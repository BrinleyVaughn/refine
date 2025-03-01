import React from "react";
import {
    useRefineContext,
    LayoutWrapper,
    ErrorComponent,
    useResource,
    LoginPage as DefaultLoginPage,
    CanAccess,
} from "@pankod/refine";
import type { ResourceRouterParams } from "@pankod/refine";

import { RouterProvider } from "./routerProvider";

const { useHistory, useLocation, useParams } = RouterProvider;

type NextRouteComponentProps = {
    initialData?: any;
};

export const NextRouteComponent: React.FC<NextRouteComponentProps> = ({
    initialData,
    children,
    ...rest
}) => {
    const { resources } = useResource();
    const { push } = useHistory();
    const {
        resource: routeResourceName,
        action,
        id,
    } = useParams<ResourceRouterParams>();

    const { pathname } = useLocation();
    const { DashboardPage, catchAll, LoginPage } = useRefineContext();

    const resource = resources.find((res) => res.route === routeResourceName);

    const isServer = typeof window !== "undefined";

    if (routeResourceName === "login") {
        return LoginPage ? <LoginPage /> : <DefaultLoginPage />;
    }

    if (pathname === "/") {
        if (DashboardPage) {
            return (
                <LayoutWrapper>
                    <CanAccess
                        resource="dashboard"
                        action="list"
                        fallback={catchAll ?? <ErrorComponent />}
                    >
                        <DashboardPage />
                    </CanAccess>
                </LayoutWrapper>
            );
        } else {
            if (isServer) push(`/${resources[0].route}`);
            return null;
        }
    }

    if (resource) {
        const {
            list,
            create,
            edit,
            show,
            name,
            canCreate,
            canEdit,
            canShow,
            canDelete,
        } = resource;

        const List = list ?? (() => null);
        const Create = create ?? (() => null);
        const Edit = edit ?? (() => null);
        const Show = show ?? (() => null);

        const renderCrud = () => {
            switch (action) {
                case undefined: {
                    return (
                        <CanAccess
                            resource={name}
                            action="list"
                            fallback={catchAll ?? <ErrorComponent />}
                        >
                            <List
                                name={name}
                                canCreate={canCreate}
                                canEdit={canEdit}
                                canDelete={canDelete}
                                canShow={canShow}
                                initialData={initialData}
                                {...rest}
                            />
                        </CanAccess>
                    );
                }

                case "create":
                case "clone": {
                    return (
                        <CanAccess
                            resource={name}
                            action="create"
                            fallback={catchAll ?? <ErrorComponent />}
                        >
                            <Create
                                name={name}
                                canCreate={canCreate}
                                canEdit={canEdit}
                                canDelete={canDelete}
                                canShow={canShow}
                                initialData={initialData}
                                {...rest}
                            />
                        </CanAccess>
                    );
                }

                case "edit": {
                    return (
                        <CanAccess
                            resource={name}
                            action="edit"
                            params={{ id }}
                            fallback={catchAll ?? <ErrorComponent />}
                        >
                            <Edit
                                name={name}
                                canCreate={canCreate}
                                canEdit={canEdit}
                                canDelete={canDelete}
                                canShow={canShow}
                                initialData={initialData}
                                {...rest}
                            />
                        </CanAccess>
                    );
                }

                case "show": {
                    return (
                        <CanAccess
                            resource={name}
                            action="show"
                            params={{ id }}
                            fallback={catchAll ?? <ErrorComponent />}
                        >
                            <Show
                                name={name}
                                canCreate={canCreate}
                                canEdit={canEdit}
                                canDelete={canDelete}
                                canShow={canShow}
                                initialData={initialData}
                                {...rest}
                            />
                        </CanAccess>
                    );
                }
            }
        };

        return <LayoutWrapper>{renderCrud()}</LayoutWrapper>;
    }
    return catchAll ? (
        <>{catchAll}</>
    ) : (
        <LayoutWrapper>
            <ErrorComponent />
        </LayoutWrapper>
    );
};
