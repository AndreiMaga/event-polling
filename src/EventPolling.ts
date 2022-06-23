type IEventPollingID = number | string;
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

type IInternalEventPolling = IEventPolling<any> & { runner?: NodeJS.Timeout };

export class EventPoller {
  eventMaps: Map<IEventPollingID, IInternalEventPolling>;
  deleteContents: boolean;

  /**
   * @param deleteContents Delete the event from the poller when it's finished.
   * Set on false for better performance, however at the expense of memory
   */
  constructor(deleteContents: boolean = true) {
    this.eventMaps = new Map<IEventPollingID, IInternalEventPolling>();
    this.deleteContents = deleteContents;
  }

  /**
   * Function to poll an event, at the end of the timeout, callback will be called. However, if another call to poll is made
   * with another event that has the same ID, it will reset the timer and will
   * @param event The event to be polled
   */
  poll(event: IEventPolling<any>) {
    this.internalPoll(event);
  }

  /**
   * Function to stop the timer for a given ID, this will run the latest configuration of the event.
   * @param id The ID to be stopped
   */
  stop(id: IEventPollingID) {
    const event = this.eventMaps.get(id);
    this.reject(event);
    if (event?.runner) {
      this.resolve(event);
    }
  }

  /**
   * Function to stop the timer for a given ID, this will not run callback at the end.
   * @param id The ID to be force stopped
   */
  forceStop(id: IEventPollingID) {
    this.reject(this.eventMaps.get(id));
  }

  public getUnusedID() {}

  private internalPoll(event: IEventPolling<any>) {
    this.reject(this.eventMaps.get(event.id));
    this.eventMaps.set(event.id, { ...event, runner: this.runner(event) });
  }

  private runner(event: IEventPolling<any>): NodeJS.Timeout {
    return setTimeout(this.resolve.bind(this), event.timeout || 3000, event);
  }

  private async resolve(event: IEventPolling<any>) {
    if (this.deleteContents) this.eventMaps.delete(event.id);

    const _return = await (event.args
      ? event.callback(...event.args)
      : event.callback());
    if (event.returnCallback) event.returnCallback(_return);
  }

  private reject(event: IInternalEventPolling | undefined) {
    if (event) clearTimeout(event.runner!);
  }
}

export default new EventPoller();
