import Sister from 'sister';
import rebound from 'rebound';
import Card from './card';
import util from './util';

let Stack;

/**
 * @param {Object} config
 */
Stack = (config) => {
    let stack,
        springSystem,
        eventEmitter,
        index;

    stack = {};
    springSystem = new rebound.SpringSystem();
    eventEmitter = Sister();
    index = [];

    /**
     * Get the configuration object.
     *
     * @return {Object}
     */
    stack.config = () => config;

    /**
     * Get a singleton instance of the SpringSystem physics engine.
     *
     * @return {Sister}
     */
    stack.springSystem = () => springSystem;

    /**
     * Proxy to the instance of the event emitter.
     *
     * @param {String} eventName
     * @param {String} listener
     */
    stack.on = (eventName, listener) => {
        eventEmitter.on(eventName, listener);
    };

    /**
     * Creates an instance of Card and associates it with an element.
     *
     * @param {HTMLElement} element
     * @return {Card}
     */
    stack.createCard = (element) => {
        let card,
            events;

        card = Card(stack, element);

        events = [
            'throwout',
            'throwoutend',
            'throwoutleft',
            'throwoutright',
            'throwin',
            'throwinend',
            'dragstart',
            'dragmove',
            'dragend'
        ];

        // Proxy Card events to the Stack.
        events.forEach((name) => {
            card.on(name, (data) => {
                eventEmitter.trigger(name, data);
            });
        });

        index.push({
            element,
            card
        });

        return card;
    };

    /**
     * Returns an instance of Card associated with an element.
     *
     * @param {HTMLElement} element
     * @return {Card|undefined}
     */
    stack.getCard = (element) => {
        return util.find(index, {
            element: element
        });
    };

    /**
     * Remove an instance of Card from the stack index.
     *
     * @param {Card} card
     */
    stack.destroyCard = (card) => {
        return util.remove(index, card);
    };

    return stack;
};

export default Stack;
