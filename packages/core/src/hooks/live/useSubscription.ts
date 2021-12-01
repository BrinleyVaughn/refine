import { useContext, useEffect } from "react";
import { useQueryClient } from "react-query";
import { useCacheQueries } from "@hooks";
import {
    ILiveContext,
    ILiveModeContext,
    LiveEvent,
    LiveModeProps,
} from "../../interfaces";
import { LiveContext, LiveModeContext } from "@contexts/live";

export type UseSubscriptionProps = {
    channel: string;
    params?: {
        id?: string;
        [key: string]: any;
    };
    resource: string;
    enabled?: boolean;
} & LiveModeProps;

export type PublishType = {
    (event: LiveEvent): void;
};

export const useSubscription = ({
    resource,
    params,
    channel,
    enabled = true,
    liveMode: liveModeFromProp,
    onLiveEvent,
}: UseSubscriptionProps): void => {
    const queryClient = useQueryClient();
    const getAllQueries = useCacheQueries();
    const liveDataContext = useContext<ILiveContext>(LiveContext);
    const {
        liveMode: liveModeFromContext,
        onLiveEvent: onLiveEventContextCallback,
    } = useContext<ILiveModeContext>(LiveModeContext);

    const liveMode = liveModeFromProp ?? liveModeFromContext;

    useEffect(() => {
        let subscription: any;

        if (liveMode && enabled) {
            subscription = liveDataContext?.subscribe({
                channel,
                params,
                type: "*",
                callback: (event) => {
                    if (liveMode === "immediate") {
                        getAllQueries(resource).forEach((query) => {
                            queryClient.invalidateQueries(query.queryKey);
                        });
                    } else if (liveMode === "controlled") {
                        onLiveEvent?.(event);
                    }

                    onLiveEventContextCallback?.(event);
                },
            });

            console.log("subscribed", channel);
        }

        return () => {
            if (subscription) {
                liveDataContext?.unsubscribe(subscription);

                console.log("unsubscribed", channel);
            }
        };
    }, [enabled]);
};