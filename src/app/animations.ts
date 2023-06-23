import { animate, style, transition, trigger, sequence, query, state, stagger, animateChild } from '@angular/animations';

export const listAnimation = trigger('listAnimation', [
    transition('* => *', [
        query(':enter',
            [
                style({ opacity: 0, transform: 'translateY(-10%)' }),
                stagger('100ms',
                    animate('500ms ease-out',
                        style({ opacity: 1, transform: 'translateY(0)' })
                    ))
            ], { optional: true })
    ])
]);

export const fadeInAnimation = trigger('fadeInAnimation', [
    transition(':enter', [
        style({ opacity: 0 }),  // start state
        animate('1000ms ease', style({ opacity: 1 }))  // end state
    ]),
    transition(':leave', [
        style({ opacity: 1 }),  // start state
        animate('1000ms ease', style({ opacity: 0 }))  // end state
    ]),
]);
