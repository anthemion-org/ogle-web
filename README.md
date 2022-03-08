# Ogle: Word-finding game for the web

Ogle is a free word-finding game for the web and mobile. It derives from a tabletop game you’ve probably played, but the pace is much faster. [_Play it now_.](https://www.anthemion.org/play-ogle/)

![Ogle screenshots](Art/screens_ogle.png)

I created the [first version](https://github.com/anthemion-org/ogle) of this app years back, when I was learning C#. I created this version when I was learning React.

Ogle is a progressive web app, so you can install and use it on your phone much like any other app. If you navigate to the [play address](https://www.anthemion.org/play-ogle/), your phone should offer to install it. Your phone’s browser will also display _Install app_ (or similar) in its page menu.

If you find a bug, [let me know](mailto://support@anthemion.org).


## License

Ogle has copyright ©2006-2022 Jeremy Kelly. You can view the source code here, but — for now, at least — _you may not modify, reuse, or redistribute it_. I may open-source the project some day.

The Ogle word lists derive from [SCOWL](https://wordlist.sourceforge.net/), copyright ©2000-2004 Kevin Atkinson. Use and distribution of SCOWL are subject to the terms of the [SCOWL License](Misc/scowl_license.txt).


## Conventions

### Identifier naming conventions

The Ogle source code uses a new identifier naming convention I am still developing. This convention was inspired by the [Split notation](https://www.anthemion.org/split_notation.html) I have used with C# and C++, but JavaScript differs so much from those languages, it seems impossible to make the notations compatible.

Every identifer begins with zero or more prefixes, in the following order, with at most one prefix selected from each table:

| Prefix | Meaning                                |
|:------:|----------------------------------------|
| `z`    | Special                                |

| Prefix | Meaning                                |
|:------:|----------------------------------------|
| `g`    | Mutable import                         |
| `_`    | Private class member                   |
| `a`    | Function parameter                     |
| `o`    | Local variable or function             |

| Prefix | Meaning                                |
|:------:|----------------------------------------|
| `s`    | Class-static variable or function      |

| Prefix | Meaning                                |
|:------:|----------------------------------------|
| `t`    | Class                                  |
| `u`    | Function                               |

| Prefix | Meaning                                |
|:------:|----------------------------------------|
| `w`    | Asynchronous function or promise object|

| Prefix | Meaning                                |
|:------:|----------------------------------------|
| `i`    | Generator/iterator function or object  |
| `j`    | Index variable                         |
| `n`    | Property name variable                 |

The `z` prefix has no set meaning. It can be used to resolve name collisions with reserved words or third-party code, or for any other reason.

Using these prefixes, a class defining a static function that accepts an `async` function parameter might begin with:

```
class tBuff {
  static suFromRead(auwRead) {
    ...
```

React requires that component names be capitalized, so component classes are _not_ prefixed with `t`.

Most prefixes are followed by a _root_ word describing the business concern or other high-level concept that is being referenced. The goal is to distinguish scope and other technical details in the prefixes, allowing the same root to be reused — without name collisions — as the concept is referenced in different ways. As an example, imagine a function that reads account data associated with a numeric index, logs the account retrieval, and then returns the data:

```
export function uAcct(ajAcct) {
  const oAcct = Accts[ajAcct];
  uLog_AccessAcct(oAcct);
  return oAcct;
}
```

`uAcct`, `ajAcct`, and `oAcct` all reference the same entity, but in different ways. For this reason, they all share the same root, yet the names do not conflict.

Within the root, the noun or verb that defines the concept most basically is listed _first_; modifiers follow in decreasing order of importance.

Functions are often defined by a verb; if that verb acts on a noun, the verb and its modifiers are listed _first_, these are followed by an underscore, and then the noun is given, along with its modifiers. This clarifies which modifiers apply to the verb and which to the noun. A function that performs a ‘full update’ on the ‘read cache’ (whatever that might mean) would be named:

```
function uUpdFull_CacheRead(aData) {
  ...
```

Other times, functions are named only with nouns. When this is done, the noun is what the function returns.

Longer words are abbreviated within identifier roots, file and folder names, _et cetera_. A word that is abbreviated once must be abbreviated the same way in every identifier.


### Programming conventions

#### Constructors and function overloading

All class variables should be initialized and commented in the constructor. If meaningful values are not available, variables should be set to `null`.

JavaScript does not allow function overloading in the traditional sense. Some developers emulate overloading by checking parameter values and types at the start of the function, in order to define missing parameters, or call different implementations. That can become surprisingly complex, however.

Overloading is most useful when constructing classes; a rectangle might be constructed from two points, or a point and two dimensions, or a JSON string, _et cetera_. In this project, constructors are never overloaded; instead, every constructor accepts all the parameters it is possible to set from outside the class. Static factory methods are then used to invoke that constructor with varying inputs. See `tCard` for an example; it provides three factory methods, including `suNew`, which creates a new card from no inputs. Other factory methods have roots that begin with `From`. The text following `From` identifies the input expected by that factory.


#### POD data and persistence

Ogle persists user data as JSON in the browser's local storage. The `Store` module uses `JSON.parse` to convert stored JSON to ‘plain-old-data’ (POD) objects. These have two shortcomings:

- `JSON.parse` restores the properties of each object, but not its class;

- JSON cannot represent `NaN` or `Infinity` values. `JSON.stringify` stores these as `null`.

For these reasons, every class that is stored must provide a `suFromPOD` method that converts POD data to a class instance. This method should infer `NaN` and `Infinity` values, as appropriate, and recursively invoke `suFromPOD` on contained class instances.


#### Mutability and cloning

JavaScript does not offer the detailed `const` protections found in C++, so returning a reference type from a function can expose internal data that should not be mutated by the caller. This is prevented most directly by using immutable types, but immutability can make some operations slower or harder to implement. In this project, every class is explicitly documented as ‘mutable’ or ‘immutable’. Functions that return mutable types must clone persistent data before returning it. When this is needed, the mutable class must implement a `uClone` method that produces a deep copy of the instance.


## Project structure

The project was created with _create-react-app_.

The `src` folder these subfolders:

- `Board` contains classes representing game boards and individual letter dice, plus board-generation code;

- `Round` contains classes that configure or store the results of ‘rounds’ of play;

- `Search` contains classes that represent the Ogle and user lexicons, plus board search functionality;

- `UI` contains page-level React components;

- `Util` contains general-purpose classes and utilities.

In Ogle, ‘views’ are top-level components that represent pages. Each view corresponds to a `StsApp` value. ‘Dialogs’ are superimposed over views. `LookBoard` and `LookDie` display game boards and individual dice. I called these ‘looks’ because ‘view’ was already taken.


## PWA setup

I did not use the `cra-template-pwa` option when I ran `create-react-app`; I used the default template instead, and later added `service-worker.js` and `serviceWorkerRegistration.js`, as copied from the [cra-template/pwa](https://github.com/cra-template/pwa/tree/main/packages/cra-template-pwa/template/src) repository. Then I added a `register` call to `index.js`. Instructions can be found [here](https://dev.to/myfatemi04/turn-your-create-react-app-into-a-progressive-web-app-in-100-seconds-3c11).


## SVG in React

Inkscape SVG files cannot be used in React without processing, even when they are deployed statically and embedded with the `img` tag. When that is done, Webpack complains that ‘Namespace tags are not supported by default’.

Also, Inkscape produces very verbose SVG files. One file contained definitions for filters that had been applied once, but were no longer in use. Saving as ‘Optimized SVG’ within Inkscape helps somewhat, but the output is still difficult to use.

I translated some Inkscape SVG into JSX with [svg2jsx](https://svg2jsx.com/), then I simplified and extended the JSX by hand. For simple images, it is easier to write the SVG from scratch.


## Design notes

### Classes versus closures

A class like `tPoolDie` could easily be replaced with a factory function that returns a die-generating function. Many JavaScript developers would consider that more idiomatic, but is it really better? The class implementation:

- Cleanly separates initialization code from output-generating code;

- Allows object state to be investigated in the debugger without expanding _Variables_ window entries, or visiting the factory function;

- Allows additional methods to be added without restructuring the factory.

The class does expose private data that could have been hidden in a closure, but private variables are prefixed with underscores in this project, and developers who abuse private data deserve what they get. In summary, class implementations are often easier to understand, and easier to use.


### React hooks

Aside from `ViewSetup`, all components are implemented with hooks. That works well for simple components, but I'm starting to have doubts about their use in more complex ones, like `ViewPlay`. `useEffect` is particularly awkward and difficult to use.

`useCallback` makes components harder to read, so I am skipping that until I encounter actual performance problems.


### Testing

Selected functionality in this project is tested with [Jest](https://jestjs.io/).

Some developers believe every function must be chaperoned by a squad of tests; I think those developers would be more pragmatic if they were writing the checks, rather than cashing them. I see no reason to create tests for simple functions that do not change. Commercial software has become _less reliable_ over the last twenty years, not more. TDD did not cause that problem, but I don't think it solves it, either.

I would like to automate testing at the UI level, but it is usually too difficult to do that in a meaningful way. Ultimately, hands-on QA work is the only way to ensure that your app works.

For testing purposes, it is sometimes necessary to export classes or functions that would otherwise be private to the implementing module. Instead of exporting these directly, I have packaged and exported them within `ForTest` objects. Those should not be used outside of testing.


## Credits

Along with [React](https://reactjs.org/) and [Jest](https://jestjs.io/), the following resources were used to create Ogle. Thanks to everyone who contributed!


### Sanitize CSS reset

Ogle uses [sanitize.css](https://github.com/csstools/sanitize.css) to ‘normalize’ the default CSS styles. This library is distributed under the [Creative Commons Zero v1.0 Universal](https://github.com/csstools/sanitize.css/blob/main/LICENSE.md) license.


### ‘bryc’ random number utilities

The _xmur3_ and _mullberry32_ utilities provide seedable random number generation. They were developed by [bryc](https://github.com/bryc/code/blob/master/jshash/PRNGs.md). They are in the public domain.


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


### Other resources

Ogle icons and screenshots were created with [Inkscape](https://inkscape.org/) and [Gimp](https://www.gimp.org/).
