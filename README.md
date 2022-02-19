# Ogle: Word-finding game for the web

SVG processing [to do]
~ Inkscape and 'optimized' SVG files


## License

Ogle has copyright ©2022 Jeremy Kelly.

Open-source license [to do]


## Conventions

All class variables should be initialized and commented in the constructor. If meaningful values are not available at this point, the variables can be set to `null`.

ES2019 [to do]

Identifier naming conventions [to do]

Coordinate origin in lower-left corner [to do]


## Project structure

The project was created with _create-react-app_.


## PWA setup

I did not use the `cra-template-pwa` option when I ran `create-react-app`; instead, I used the default template, and later added `service-worker.js` and `serviceWorkerRegistration.js`, as copied from the [cra-template/pwa](https://github.com/cra-template/pwa/tree/main/packages/cra-template-pwa/template/src) repository. Then I added a `register` call to `index.js`. Instructions can be found [here](https://dev.to/myfatemi04/turn-your-create-react-app-into-a-progressive-web-app-in-100-seconds-3c11).


## Design notes

Class components versus hooks [to do]
~ Classes can derive from PureComponent
~ Classes require method binding

'useCallback' makes function components difficult to read, so I am skipping that until I encounter actual performance problems.

'Real' and 'nominal' data [to do]

Implicit duck typing sometimes, explicit parameter type checks other times [to do]
~ 'instanceof' fails silently when checking against imported class

Allow optional parameters, but avoid parameters that can have different types [to do]

'ForTest' exports [to do]


### Classes versus closures

A class like `tPoolDie` could easily be replaced with a factory function that returns a die-generating function. Many JavaScript developers would consider that more idiomatic, but how is it actually better? The class implementation:

- Cleanly separates initialization code from output-generating code;

- Allows object state to be investigated in the debugger without expanding Variables window entries, or visiting the factory function;

- Allows additional methods to be added without restructuring.

The class does expose private data that could have been hidden in a closure, but it seems a bit late to worry about JavaScript's 'anything goes' paradigm. The lesson here? _Not everything has to be a function_.


## Credits

The following creators contributed code or other resources to Ogle.

React, et cetera [to do]


### Sanitize CSS reset

https://github.com/csstools/sanitize.css [to do]


### 'bryc' random number utilities

The _xmur3_ and _mullberry32_ random number utilities were developed by [bryc](https://github.com/bryc/code/blob/master/jshash/PRNGs.md). They are in the public domain.


### SCOWL word list

The Ogle word list derives from [SCOWL](http://wordlist.aspell.net/), copyright ©2000-2004 Kevin Atkinson. The use and distribution of SCOWL is subject to the terms of the SCOWL License:

> SCOWL copyright 2000-2004 Kevin Atkinson
>
> Permission to use, copy, modify, distribute and sell these word lists, the
> associated scripts, the output created from the scripts, and its documentation
> for any purpose is hereby granted without fee, provided that the above
> copyright notice appears in all copies and that both that copyright notice and
> this permission notice appear in supporting documentation. Kevin Atkinson
> makes no representations about the suitability of this array for any purpose.
> It is provided "as is" without express or implied warranty.
