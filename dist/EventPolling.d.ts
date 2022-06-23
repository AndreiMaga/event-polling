/// <reference types="node" />
declare type IEventPollingID = number | string;
/**
 * An interface to facilitate the EventPoller functions
 */
export interface IEventPolling<R = void, S = any> {
    /**
     * ID to identify the event, this should be unique for each event
     */
    id: IEventPollingID;
    /**
     * The callback to run when the polling ends
     */
    callback: (...args: S[]) => R | Promise<R>;
    /**
     * The arguments for the function that is called at the end of the polling
     */
    args?: S[];
    /**
     * The function to call if callback returns something. \
     * Check the documentation on how to do this outside of the EventPoller
     */
    returnCallback?: ((args: Promise<R>) => void) | ((args: R) => void);
    /**
     * The amount of time in miliseconds to poll for. \
     * Default : 3000 ms
     */
    timeout?: number;
}
declare type IInternalEventPolling = IEventPolling<any> & {
    runner?: NodeJS.Timeout;
};
export declare class EventPoller {
    eventMaps: Map<IEventPollingID, IInternalEventPolling>;
    deleteContents: boolean;
    /**
     * @param deleteContents Delete the event from the poller when it's finished.
     * Set on false for better performance, however at the expense of memory
     */
    constructor(deleteContents?: boolean);
    /**
     * Function to poll an event, at the end of the timeout, callback will be called. However, if another call to poll is made
     * with another event that has the same ID, it will reset the timer and will
     * @param event The event to be polled
     */
    poll(event: IEventPolling<any>): void;
    /**
     * Function to stop the timer for a given ID, this will run the latest configuration of the event.
     * @param id The ID to be stopped
     */
    stop(id: IEventPollingID): void;
    /**
     * Function to stop the timer for a given ID, this will not run callback at the end.
     * @param id The ID to be force stopped
     */
    forceStop(id: IEventPollingID): void;
    getUnusedID(): void;
    private internalPoll;
    private runner;
    private resolve;
    private reject;
}
declare const _default: EventPoller;
export default _default;
