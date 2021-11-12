import React, { useContext } from "react";
import { QueryObserverResult, useQuery, UseQueryOptions } from "react-query";
import { ArgsProps } from "antd/lib/notification";

import { DataContext } from "@contexts/data";
import {
    GetListResponse,
    IDataContext,
    CrudFilters,
    Pagination,
    BaseRecord,
    HttpError,
    CrudSorting,
    MetaDataQuery,
} from "../../interfaces";
import { useCheckError, useTranslate } from "@hooks";
import { handleNotification } from "@definitions";
import { createClient } from "@supabase/supabase-js";

interface UseListConfig {
    pagination?: Pagination;
    sort?: CrudSorting;
    filters?: CrudFilters;
}

export type UseListProps<TData, TError> = {
    resource: string;
    config?: UseListConfig;
    queryOptions?: UseQueryOptions<GetListResponse<TData>, TError>;
    successNotification?: ArgsProps | false;
    errorNotification?: ArgsProps | false;
    metaData?: MetaDataQuery;
};

/**
 * `useList` is a modified version of `react-query`'s {@link https://react-query.tanstack.com/guides/queries `useQuery`} used for retrieving items from a `resource` with pagination, sort, and filter configurations.
 *
 * It uses the `getList` method as the query function from the `dataProvider` which is passed to `<Refine>`.
 *
 * @see {@link https://refine.dev/docs/api-references/hooks/data/useList} for more details.
 *
 * @typeParam TData - Result data of the query extends {@link https://refine.dev/docs/api-references/interfaceReferences#baserecord `BaseRecord`}
 * @typeParam TError - Custom error object that extends {@link https://refine.dev/docs/api-references/interfaceReferences#httperror `HttpError`}
 *
 */
export const useList = <
    TData = BaseRecord,
    TError extends HttpError = HttpError,
>({
    resource,
    config,
    queryOptions,
    successNotification,
    errorNotification,
    metaData,
}: UseListProps<TData, TError>): QueryObserverResult<
    GetListResponse<TData>,
    TError
> => {
    const { getList } = useContext<IDataContext>(DataContext);
    const translate = useTranslate();
    const { mutate: checkError } = useCheckError();

    const SUPABASE_URL = "https://iwdfzvfqbtokqetmbmbp.supabase.co";
    const SUPABASE_KEY =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYzMDU2NzAxMCwiZXhwIjoxOTQ2MTQzMDEwfQ._gr6kXGkQBi9BM9dx5vKaNKYj_DJN1xlkarprGpM_fU";

    React.useEffect(() => {
        console.log("here");

        const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
        const subscription = supabase
            .from("*")
            .on("*", (payload) => {
                console.log("Change received!", payload);
            })
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const queryResponse = useQuery<GetListResponse<TData>, TError>(
        [`resource/list/${resource}`, { ...config }],
        () => getList<TData>({ resource, ...config, metaData }),
        {
            ...queryOptions,
            onSuccess: (data) => {
                queryOptions?.onSuccess?.(data);
                handleNotification(successNotification);
            },
            onError: (err: TError) => {
                checkError(err);
                queryOptions?.onError?.(err);

                handleNotification(errorNotification, {
                    key: `${resource}-useList-notification`,
                    message: translate(
                        "common:notifications.error",
                        { statusCode: err.statusCode },
                        `Error (status code: ${err.statusCode})`,
                    ),
                    description: err.message,
                    type: "error",
                });
            },
        },
    );

    return queryResponse;
};
