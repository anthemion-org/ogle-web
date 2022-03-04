# Ogle: Word-finding game for the web

Ogle is a free word-finding game for the web and mobile. It derives from a tabletop game you’ve probably played, but the pace is much faster. [Play it now.](https://www.anthemion.org/play-ogle/)

![Ogle screenshots](Art/screens_ogle.png)

I created the [first version](https://github.com/anthemion-org/ogle) of this app years back, when I was learning C#. I created this version when I was learning React.

Ogle is a progressive web app, so you can install and use it on your phone much like any other app. If you navigate to the play address, your phone should offer to install it. Your phone’s browser will also display _Install app_ (or similar) in its page menu.

If you find a bug, [let me know](mailto://support@anthemion.org).


## License

Ogle has copyright ©2007-2022 Jeremy Kelly. You can view the source code here, but — for now, at least — _you may not modify, reuse, or redistribute it_. I may open-source the project some day.

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

So, a class defining a static function that accepts an `async` function parameter might begin with:

```
class tBuff {
  suFromRead(auwRead) {
    ...
```

React requires that component names be capitalized, so component classes are _not_ prefixed with `t`.

The prefixes are followed (in most cases) by a _root_ word describing the business concern or other high-level concept that is being referenced. The goal is to distinguish scope and other technical details in the prefixes, allowing the same root to be reused — without name collisions — as the concept is referenced in different ways. As an example, imagine a function that reads account data associated with a numeric index, logs the account retrieval, and then returns the data:

```
function uAcct(ajAcct) {
	const oAcct = Accts[ajAcct];
	uLog_AccessAcct(oAcct);
	return oAcct;
}
```

In this case, `uAcct`, `ajAcct`, and `oAcct` all reference the same entity, but in different ways. For this reason, they all share the same root, yet there are no name collisions.

Within a root, the noun or verb that defines the concept most basically is listed _first_; modifiers follow in decreasing order of importance.

Functions are often defined by a verb; if that verb acts on a noun, the verb and its modifiers are listed _first_, these are followed by an underscore, and then the noun is given, along with its modifiers. This clarifies which modifiers apply to the verb and which to the noun. A function that performs a ‘full update’ on the ‘read cache’ (whatever that might mean) would be named:

```
function uUpdFull_CacheRead(aData) {
  ...
```

Other times, functions are named after nouns. When this is done, the noun is what the function returns.

Longer words are abbreviated within identifier roots, file and folder names, _et cetera_. A word that is abbreviated once must be abbreviated the same way in every identifier.


### Programming conventions

Coordinate origin in lower-left corner [to do]

All class variables should be initialized and commented in the constructor. If meaningful values are not available at this point, the variables can be set to `null`.

Factory methods and constructors [to do]


## Project structure

The project was created with _create-react-app_.

In Ogle, top-level components representing pages are known as ‘views’.

'Dlg', 'Look', et cetera [to do]


## PWA setup

I did not use the `cra-template-pwa` option when I ran `create-react-app`; instead, I used the default template, and later added `service-worker.js` and `serviceWorkerRegistration.js`, as copied from the [cra-template/pwa](https://github.com/cra-template/pwa/tree/main/packages/cra-template-pwa/template/src) repository. Then I added a `register` call to `index.js`. Instructions can be found [here](https://dev.to/myfatemi04/turn-your-create-react-app-into-a-progressive-web-app-in-100-seconds-3c11).

[realfavicongenerator.net](realfavicongenerator.net) creates a `site.webmanifest` file and a `link` element that references it, but we already have `manifest.json`. I used `site.webmanifest` to update `manifest.json`, then I deleted it, along with the `link`. I replaced `play-ogle` in the other generated links with `%PUBLIC_URL%`.


## Design notes

`useCallback` makes function components difficult to read, so I am skipping that until I encounter actual performance problems.

‘Real’ and ‘nominal’ data [to do]

Implicit duck typing sometimes, explicit parameter type checks other times [to do]
~ `instanceof` fails silently when checking against imported class

Allow optional parameters, but avoid parameters that can have different types [to do]

`ForTest` exports [to do]


### Classes versus closures

A class like `tPoolDie` could easily be replaced with a factory function that returns a die-generating function. Many JavaScript developers would consider that more idiomatic, but how is it actually better? The class implementation:

- Cleanly separates initialization code from output-generating code;

- Allows object state to be investigated in the debugger without expanding Variables window entries, or visiting the factory function;

- Allows additional methods to be added without restructuring.

The class does expose private data that could have been hidden in a closure, but it seems a bit late to worry about JavaScript’s ‘anything goes’ paradigm. The lesson here? _Not everything has to be a function_.


## Credits

The following creators contributed code or other resources to Ogle.

React, et cetera [to do]


### Sanitize CSS reset

https://github.com/csstools/sanitize.css [to do]


### ‘bryc’ random number utilities

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
