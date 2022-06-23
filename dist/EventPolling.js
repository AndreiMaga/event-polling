"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventPoller = void 0;
class EventPoller {
    /**
     * @param deleteContents Delete the event from the poller when it's finished.
     * Set on false for better performance, however at the expense of memory
     */
    constructor(deleteContents = true) {
        this.eventMaps = new Map();
        this.deleteContents = deleteContents;
    }
    /**
     * Function to poll an event, at the end of the timeout, callback will be called. However, if another call to poll is made
     * with another event that has the same ID, it will reset the timer and will
     * @param event The event to be polled
     */
    poll(event) {
        this.internalPoll(event);
    }
    /**
     * Function to stop the timer for a given ID, this will run the latest configuration of the event.
     * @param id The ID to be stopped
     */
    stop(id) {
        const event = this.eventMaps.get(id);
        this.reject(event);
        if (event === null || event === void 0 ? void 0 : event.runner) {
            this.resolve(event);
        }
    }
    /**
     * Function to stop the timer for a given ID, this will not run callback at the end.
     * @param id The ID to be force stopped
     */
    forceStop(id) {
        this.reject(this.eventMaps.get(id));
    }
    getUnusedID() { }
    internalPoll(event) {
        this.reject(this.eventMaps.get(event.id));
        this.eventMaps.set(event.id, Object.assign(Object.assign({}, event), { runner: this.runner(event) }));
    }
    runner(event) {
        return setTimeout(this.resolve.bind(this), event.timeout || 3000, event);
    }
    resolve(event) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.deleteContents)
                this.eventMaps.delete(event.id);
            const _return = yield (event.args
                ? event.callback(...event.args)
                : event.callback());
            if (event.returnCallback)
                event.returnCallback(_return);
        });
    }
    reject(event) {
        if (event)
            clearTimeout(event.runner);
    }
}
exports.EventPoller = EventPoller;
exports.default = new EventPoller();
