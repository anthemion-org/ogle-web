# Ogle: Word-finding game for the web

Ogle is a free word-finding game for the web and mobile. It derives from a tabletop game you’ve probably played, but the pace is much faster. [_Play it now_.](https://www.anthemion.org/play-ogle/)

![Ogle screenshots](Art/screens_ogle.png)

I created the [first version](https://github.com/anthemion-org/ogle) of this app years back, when I was learning C#. I created this version when I was learning React.

Ogle is a progressive web app, so you can install it on your phone somewhat like a native app. If you navigate to the [play address](https://www.anthemion.org/play-ogle/), your phone should offer to install it. Your phone’s browser will also display _Install app_ (or similar) in its page menu.

If you find a bug, write to [support@anthemion.org](mailto://support@anthemion.org).


## License

Ogle has copyright ©2006-2023 Jeremy Kelly. You may view the source code here, or copy it to your device, but _you may not reuse or redistribute it_. I may open-source it some day.

The Ogle word list derives from [SCOWL](https://wordlist.sourceforge.net/), copyright ©2000-2004 Kevin Atkinson. Use and distribution of SCOWL are subject to the terms of the [SCOWL License](Misc/scowl_license.txt).


## Project structure

The project was created with _create-react-app_.

The `src` folder includes these subfolders:

- `Board` contains types representing game boards and individual letter dice, plus board-generating code;

- `Round` contains types that represent a ‘round’ of play;

- `Search` contains types that represent the Ogle and user lexicons, plus word search functionality;

- `Store` contains the Redux store and slices;

- `UI` contains page-level React components;

- `Util` contains general-purpose types and utilities.

In this project, **views** are top-level components that represent pages or windows. Most views correspond to `StsApp` values. **Dialogs** are smaller windows that are superimposed over views. Some people call these ‘modals’, even though they aren’t always modal. **Looks** are components that display complex data within a view or dialog. Some examples are `LookDie` (which renders a single letter die) and `LookBoard` (which renders the entire board).


## Architecture

#### State management and persistence

Ogle uses Redux Toolkit to manage much of its state. Most of that data is persistent, so I used the store’s `subscribe` method to write state data to the browser’s local storage after each update. This produces two criteria for adding data to the store, both of which should be met:

1. The data must be used when rendering pages;

2. The data must be read or written by multiple components, _or_ it must require persistence.

Persistent data that are _not_ used for rendering should be persisted directly with the `Persist` module. Render data that is _not_ shared or persisted should be managed with `useState` or `setState`.

The `Persist` module serializes data as JSON, which stupidly fails to accommodate `NaN` or `Infinity` values, so `Persist` uses the `UtilJSON.uNumFix` function to convert these to strings automatically. Every persistable type provides a `uFromParse` function that converts these JSON-damaged objects back to their correct forms.


### PWA functionality

For the convenience of mobile users, Ogle is a progressive web app (PWA). I did not use the `cra-template-pwa` option when I ran `create-react-app`; I used the default template, and later added `service-worker.js` and `serviceWorkerRegistration.js`, as copied from the [cra-template/pwa](https://github.com/cra-template/pwa/tree/main/packages/cra-template-pwa/template/src) repository. Then I added a `register` call to `index.js`. Instructions can be found [here](https://dev.to/myfatemi04/turn-your-create-react-app-into-a-progressive-web-app-in-100-seconds-3c11).

The PWA works fairly well on Android, but the experience does not match that of a native app. The ‘install’ process seems awkward, and there is a bug in the Android version of Chrome that sometimes causes the Play view to grow larger than the viewport, so that unwanted scrolling occurs.


### Class and function components

Aside from `ViewSets` (and the error boundary) all components are implemented as functions, and most use hooks. That works well for simple components, but class components might have been better. `useEffect` is ugly, and it pulls all sorts of non-rendering functionality into what was just a render function. Handlers (if they do almost anything relevant) also must be defined there. `useCallback` adds another layer of nesting and indentation to this now massive function.

Bigger problems are produced by `useSelector` and `useDispatch`. These hooks — though convenient — couple the render code to specific selectors and actions, producing components that are _inherently less flexible_ than those wrapped by Redux’s (admittedly confusing) `connect` function. It’s easy to say that those are just bad hooks, and you can still use `connect` with your function components. However, if we eliminate the convenience of `useSelector` and `useDispatch`, there isn’t as much reason to prefer functions over classes.


## Programming conventions

### Identifier naming

The Ogle source code uses an identifier naming convention I have been developing for a while. It was inspired by the [Split notation](https://www.anthemion.org/split_notation.html) I use with C# and C++, but JavaScript differs so much from those languages, it seems impossible to make the notations compatible.


#### Identifier prefixes

Every identifier begins with zero or more prefixes, in the following order, with at most one prefix from each table:

| Prefix | Meaning                                 |
|:------:|-----------------------------------------|
| `_`    | ‘Private’ variable or function          |

| Prefix | Meaning                                 |
|:------:|-----------------------------------------|
| `a`    | Function parameter                      |
| `o`    | Local variable or function              |

| Prefix | Meaning                                 |
|:------:|-----------------------------------------|
| `t`    | Class                                   |
| `u`    | Function                                |

| Prefix | Meaning                                 |
|:------:|-----------------------------------------|
| `i`    | Generator/iterator function or object   |
| `j`    | Index variable                          |
| `n`    | Property name variable                  |

| Prefix | Meaning                                 |
|:------:|-----------------------------------------|
| `w`    | Asynchronous function or promise object |

| Prefix | Meaning                                 |
|:------:|-----------------------------------------|
| `z`    | Special (see below)                     |

Most prefixes identify a scope or a ‘mode of address’ — a distinct way of referencing some data. Other prefixes mark technical details that require special attention. The `z` prefix has no set meaning; it can be used to resolve name collisions with third-party code, or for any other reason.

Using these prefixes, a class defining a ‘private’ function (really one we would _like_ to be private) that accepts an `async` function parameter might begin with:

```
class tBuff {
  _uFromRead(auwRead) {
    ...
```


#### Identifier roots

After the prefixes, most identifiers include a Pascal-cased string that describes the business concern or other high-level concept that is being referenced. This is called the _root_. Because each identifier’s scope and mode of address is documented in the prefixes, the same root can be reused — without name collisions — as the concept is referenced in different ways. Imagine a function that reads account data associated with a numeric index, logs the account retrieval, and then returns the data:

```
export function uAcct(ajAcct) {
  const oAcct = Accts[ajAcct];
  uLog_AccessAcct(oAcct);
  return oAcct;
}
```

The function `uAcct`, the array index `ajAcct`, and the returned object `oAcct` all reference the same entity in different ways, yet the names do not conflict. In fact, their commonality is _emphasized_, rather than hidden, making it easier to spot conceptual mismatches.

To maintain that emphasis, the noun or verb that defines the concept most basically is listed _first_ within the root, making it easier to see what a given identifier represents. Modifiers follow in _decreasing order of importance_. This ensures that the most important words remain visible. In the following example, the fact that we accidentally copied a credit card number (rather than the hash of that number) should draw immediate attention:

```
const oHashNumCardDef = aNumCardUser;
```

When we name things the way most developers do, the problem is hidden:

```
const oDefCardNumHash = aUserCardNum;
```

It is sometimes acceptable to omit the root, producing an identifier of prefixes only, as in the loop index below:

```
for (let oj = 0; oj < aEls.length; ++oj) {
  ...
```

This should be reserved for short functions, where the context is simple and obvious.


##### Function roots

Functions are often named with a verb. If that verb acts on a direct object, the verb and its modifiers are listed _first_, these are followed by an underscore, then the verb’s _object_ is given, along with its modifiers. This clarifies which modifiers apply to the verb, and which to the object. As an example, a function that performs a ‘full update’ on the ‘read cache’ might be named:

```
function uUpdFull_CacheRead() {
  ...
```

These ‘verb’ functions usually produce side effects.

Other times, functions are named only with nouns. When this is done, the noun is _what the function returns_. These ‘noun’ functions usually do _not_ produce side effects, though they can. When the result is assigned to a variable, that variable generally has a similar root, making it easier to spot crossed wires:

```
const oBuff = aStm.uBuff();
```

Roots representing boolean values typically begin with `Ck`. This provides a consistent replacement for the `is` and `has` prefixes that some developers use for boolean identifiers.

When a function returns a boolean, the `Ck` root honors the rule that noun names tell the reader _what_ is being returned — specifically, a ‘check’ of some sort. This avoids many ambiguities. Consider a method named `uReady`. Does this method tell us _whether_ the instance is ready, or does it cause the instance to _become_ ready? In this case, if the method were answering a ‘yes/no’ question, it would be called `uCkReady`, so the verb usage must be intended. Distinguishing ‘noun’ functions from ‘verb’ functions makes both names more meaningful, and it allows `uReady` and `uCkReady` to be defined in the same instance without colliding.

English being what it is, ambiguities can yet arise. For instance, is ‘Cache’ a noun or a verb? When read as a noun, `uCache` perhaps returns a caching object. When read as a verb, the same function caches some unspecified value. It might help to suffix standalone verbs with an underscore (continuing the ‘verb/underscore/object’ pattern described earlier) but I have never tried that. Most ambiguities are solved by the verb/noun distinction, but this is something to watch for, and sometimes I chose different names to avoid it.

Factory functions often have roots that begin with ‘From’; the noun is implicit, as these functions are meant to be invoked after specifying the containing class or module:

```
import * as Board from "./Board.js";

function uExec(aParseBoard) {
  const oBoard = Board.uFromParse(aParseBoard);
  ...
```


#### Abbreviations and containers

Long names produce long expressions that are hard to read, especially when their length causes the line to wrap, so longer words are abbreviated within identifiers, file and folder names, _et cetera_. Some developers, after being confounded by a few poorly-chosen abbreviations, forswear identifier abbreviation altogether. I sympathize, truly, but every team and every industry abbreviates things, so the question is not _whether_ to abbreviate, it is _when_ and _how_ to abbreviate. The obvious answer: terms that are longer, or used more often, are more deserving of abbreviation. Note that the more you use a given term, the more you gain by abbreviating it, and the safer it is to abbreviate, as the repetition makes it easier to remember. My projects frequently use the word ‘Position’, so I abbreviate aggressively to produce `Pos`. When using a less common word, it is better to choose something longer, or leave it unabbreviated. A word that is abbreviated once must be abbreviated everywhere in the project (outside of comments) and _always the same way_.

Though they might contain the same type of data, a container of values differs fundamentally from a single value. For this reason, containers must be given plural names:

```
let oID = aIDs[0];
```

It is usually unnecessary to indicate the type of the container. However, I name maps (whether instances of the `Map` class, or plain objects used as maps) with a plural noun describing what the map contains, suffixed with ‘By’, and followed with a singular noun that describes the input to the map. The result is something like `CtsByID`, which maps from ‘ID’ keys to ‘count’ values. This places the content at the beginning of the name, like other container names, while reminding the reader how the map is used. It also places the value noun on the side from which the map will be read, and the key noun on the side from which it will be dereferenced:

```
const oCt = oCtsByID[aID];
```

If the name of the variable you’re writing to fails to match the left side, or if the variable you’re using to dereference the map fails to match the right, you’re probably using the map incorrectly.

It is sometimes necessary to pluralize a term that ends with ‘s’. Adding a second ‘s’ could produce something that looks like a different word or abbreviation (consider that `Pos` would become `Poss`) so I add the letter ‘i’, which seems to cause fewer problems:

```
const oPos = aPos[0];
```

That’s a bit awkward, but the pluralization belongs in the root. It might be better to avoid abbreviations that end with ‘s’, or to pluralize these with ‘z’ instead.

It is _never acceptable_ to use or change an abbreviation to avoid a name collision. If names do collide:

- You have failed to apply the correct prefixes (possibly because you were forced to — see [Notation exceptions](#Notation-exceptions) below); or,

- You have failed to include descriptive modifiers in your roots.


#### Notation exceptions

At times, it is impractical to apply certain prefixes:

- Many developers define parameters or other variables that sometimes reference functions, and sometimes reference non-function values, and there is no way to prefix these correctly. Though this is a common practice, it is usually wrong to use variables this way, because they cannot be named accurately, no matter what your notation. I considered a prefix for identifiers that _sometimes_ reference functions, but it doesn’t seem worth it;

- React requires that component names be capitalized, so component classes _cannot_ be prefixed with `t`;

- Some prefixes do not work well with destructuring, particularly `a` and `o`.

When destructuring is used to implement named parameters:

```
function uAdd({ Card, Ent, CkAddFollow, CkSkipAdd }) {
  ...
```

applying the `a` prefix requires that parameters be renamed in the destructuring pattern, which is very noisy:

```
function uAdd({
  Card: aCard, Ent: aEnt, CkAddFollow: aCkAddFollow, CkSkipAdd: aCkSkipAdd
}) {
  ...
```

Note that it would _not_ be correct to apply the prefix within the pattern:

```
function uAdd({ aCard, aEnt, aCkAddFollow, aCkSkipAdd }) {
  ...
```

as the names would look like function parameters (on the caller side) when specified by the caller:

```
uAdd({ aCard: oCard, aEnt: oEnt, aCkAddFollow: true, aCkSkipAdd: true })
```

It is appropriate to omit prefixes in these cases. This _can_ cause names to collide with imports (some of which use no prefix).

Obviously, third-party code also fails to use the prefixes, and that is fine. Working with such code always requires adaptation, to different names and metaphors, different programming styles, _et cetera_. The notation does not exist to give OCD sufferers an outlet for their manic energies. It is meant to make things _better_, not _perfect_.

Having said that, _I’m not convinced that the prefixes work in this language_. They are very helpful in C# and C++, but they disagree to some extent with the flexibility of JavaScript — which after all is the language’s only good quality. I’m still thinking about it.

[todo] Many nested functions in JavaScript, these diminish benefit of `a` and `o`


### Function parameter checks

As something of an experiment, the `Misc` module defines a `uCkThrow_Params` function that is used to check parameter types in many functions. For the most part, I have reserved it for public class methods and API functions. The check is a bit slow, so it is excluded from the critical path within the word search, and from low-level types like Pt2. It is disabled entirely within the production environment.


### Classes, methods, and plain objects

Many JavaScript developers share a bizarre prejudice against classes, and the more I learn about their rationale, the more obvious it becomes that they _don’t understand classes_ in the first place. This has unfortunate implications for the entire community.

Let’s start by vaporizing some common misconceptions:

- _Prototypal inheritance is better than classes_: This one is staggering, and I’ve seen it more than once. Class declarations _produce traditional prototypal inheritance relations_. The two approaches are essentially synonymous, and the few non-syntactic changes introduced by the declaration are certainly improvements;

- _Classes mean lots of inheritance_: JavaScript classes do use prototypal inheritance to share non-static methods with instances, but it is not necessary to exceed this single layer of inheritance. That is a design choice, and much benefit can be gained without ever typing `extends`. I have seldom created deep inheritance hierarchies, even after years of UI development with C++, C#, and Java;

- _Factory functions are better than `new`_: Factories _are_ better in many cases, but you can still use them with classes. My preference is to define a simple, low-logic constructor that accepts all the arguments necessary to initialize any instance, and then `new` that constructor from static factory methods with descriptive names and specialized logic, for use by clients of the class. For truly foolproof encapsulation, it _was_ necessary to use closures, but that can now be accomplished with private slots;

- _Classes mean mutable data_: Class instances need not be mutable, any more than plain objects. In this project, many classes are frozen in the constructor. That won’t work if you start subclassing (the subclass constructor won’t be able to add properties after calling `super`) but `Object.freeze` can be moved to a factory, if necessary. If a subclass is immutable, the Liskov substitution principle requires that the superclass be immutable as well. Our reasons for making the subclass immutable probably apply to the parent class already, so I’m not bothered by that.

Let’s attempt an objective comparison of classes and plain objects. We’ll also compare method APIs to procedural APIs, and we’ll do this separately, since methods _can_ be attached to plain objects to produce what I call **fancy objects**.


#### Class advantages

First, _type information is useful_. Whether you use TypeScript or not, type checks are a good way to verify the correctness of your program, and — even without compile-time checking — they are much easier when your objects contain type data (by way of the `constructor` property). If they check anything at all, most JavaScript developers perform ‘duck type checking’, where they receive an object, look for the members they need, then throw if one is missing. That _is_ more flexible, but it’s also more work, and it produces noisy code.

Type data also provides useful context for the developer. When you see the content of a plain object, do you know what the object represents? Maybe, or maybe the name of the object reference tells you, but it’s not always clear. The class name _tells you what kind of data this is_ — something the reference name often only hints at. Even _talking_ about these objects is easier when you can summarize them with class names. This is true whether you’re writing comments or discussing with collaborators.

The class name also makes it easy to find the comments and methods associated with your data, and the places where it may have been instantiated. IDEs like VSCode display some of this information when you mouse over class names, and they can offer code completion when you’re referencing class members. Incidentally, where do you comment the members of your plain object? I know, _JavaScript developers don’t write comments_.

Typescript interfaces can provide some of these advantages, but they describe the requirements of a _system_ (by restricting the arguments that may be passed through a given parameter, for instance). Classes, by contrast, produce metadata that attaches to and describes specific _objects_. Both are useful, but these are not the same.

Classes — and more specifically, prototypal inheritance — provide efficient support for method APIs by allowing a single set of method instances to be shared throughout the class. Methods can be attached directly to plain objects, but this causes separate instances to be allocated _for every object_. Even `bind` creates a new function instance, one that wraps the function from which it was called. This could waste a lot of memory, and it is also very slow. This project requires high performance in the word search, so I tested a number of fancy object creation strategies in the Pt2 module, which is used extensively in that search. The first two allow methods to target the object with `this`, while the last captures object state in a closure, making `this` unnecessary:

- Defining the API within the Pt2 object literal returned from `uNew` caused the ‘SearchBoard uExec: Speed’ test (over five trials, each set to 2000 iterations) to run 33% longer than the ‘stereotype’ implementation;

- Using `bind` to attach an externally-defined API after the object was instantiated caused the test to run 38% longer. Note that `bind` is _slower_ than the function definitions themselves;

- Converting `uNew` to a closure-producing factory caused the test to run 40% longer.

There are only five methods in the Pt2 API, so these results are not encouraging.

Speaking of closures, a class like `tPoolDie` could be replaced with a factory that returns a die-generating function, with the state in the class being converted to a closure. Many JavaScript developers would consider that more idiomatic, but is it better? The class implementation has an obvious structure that requires no knowledge of closures, it cleanly separates initialization code from the class’s API, and it allows instance state to be viewed in the debugger without expanding _Variables_ window entries, or visiting the factory function.

Classes provide efficient support for methods. They also neatly package your data, the methods that operate on that data, and the documentation for both.


#### Method advantages

Why should we care about methods? Because they provide a concise and expressive way to manipulate objects. Let’s make basic use of two APIs, one a procedural API that works with plain objects:

```
import * as Serv from "Serv.js";

function uStart(aServ) {
  const oSess = Serv.uSess(aServ);
  const oBuff = Serv.uBuffRead(aServ, oSess);
  ...
```

and another that uses methods:

```
function uStart(aServ) {
  const oSess = aServ.uSess();
  const oBuff = aServ.uBuffRead(oSess);
  ...
```

Method invocations like `aServ.uSess()` are obviously more compact than `Serv.uSess(aServ)`, unless the procedural API is imported with something like:

```
import { uSess, uBuffRead } from "Serv.js";
```

which is certain to produce name collisions.

The method invocation is also inherently polymorphic, allowing any object with the necessary methods (in this case, `uSess` and `uBuffRead`) to be manipulated by an algorithm that calls those methods. When using a procedural API, the calling code must couple itself to a _specific_ API. Other types cannot be processed without something like:

```
function uStart(aTypeServ, aServ) {
  const oSess = aTypeServ.uSess(aServ);
  const oBuff = aTypeServ.uBuffRead(aServ, oSess);
  ...
```

and even that fails if the algorithm operates on a collection of heterogenous types.


#### Plain object advantages

Plain objects do have some advantages. They are easy to understand, and they are directly supported by the language. They facilitate duck typing, which is a simple and flexible approach to reuse, even if it fails to help when verifying correctness.

They _should_ be easily serializable, unlike class instances, fancy objects, or state-capturing closures, which cannot be deserialized without factory functions, and which sometimes also require help when serializing. Unfortunately, the format of choice fails to realize this advantage:

- JSON fails to support `NaN` and `Infinite` values, so it becomes necessary to add special handling (`UtilJSON.uNumFix` and `uFromParse` in this project) for these values;

- JSON cannot represent reference cycles, and though it can serialize shared instances, it does this by duplicating them. That doesn’t harm correctness, if the instances are immutable, and it probably doesn’t waste much memory, since large datasets are unlikely to be serialized as JSON. It _does_ make it impossible to optimize equality checks with simple reference comparisons, however.

When we deserialize data, we want the same data that we started with, so it’s hard to count this as a win. Plain objects _do_ meet Redux’s serializability requirements, however.

When not attached as methods, object APIs must be implemented procedurally, and the target object must be passed to each procedure as it is used. This is less concise than a method invocation (see above) but it does allow calls to the API to be identified unambiguously, with a text search of the import name. Tools like VSCode offer ‘Find All References’ functionality that can find some method invocations, but these features _don’t work consistently_. Therefore, unless a method is named uniquely across all APIs, calls cannot be identified without knowing the type of each object that invokes the name, which can be difficult during code analysis. Note that this is the converse of the polymorphism advantage attributed to methods earlier.

Procedural APIs do not rely on `this`, so a certain amount of binding confusion also disappears. `this` is the _way_ that methods achieve their concision, so that is a bit like telling an amputee that they get to save money on fingernail clippers. In any event, cases where `this` _would_ have been bound:

```
const oWork = new tWork();
const oHandClick = oWork.uReset.bind(oWork);
```

are now likely to require that an instance be captured in a closure:

```
const oWork = Work.uNew();
const oHandClick = () => Work.uReset(oWork);
```


#### Redux

Having said all that, Redux makes it difficult to represent state data with classes.

First, Redux requires that everything in the store be serializable, presumably with `JSON.stringify` and `JSON.parse`. Redux generates warnings when it detects non-serializable objects, and of course it does nothing to restore methods or class metadata that are lost during serialization. It is possible to [disable those warnings](https://redux-toolkit.js.org/usage/usage-guide#working-with-non-serializable-data) by adding Redux middleware, but the documentation discourages this, [saying](https://redux.js.org/faq/organizing-state#can-i-put-functions-promises-or-other-non-serializable-items-in-my-store-state) “things like persistence and time-travel debugging” may not work after.

The Redux FAQ explains that these features rely on serialization, and claims that classes make serialization “tricky”. In another project, I implemented a serialization system that supports typed objects, shared instances, and reference cycles, and while it _was_ a bit tricky, it was not a big problem. It could have been done in Redux, and with less effort than was expended on the many strange quirks of the `connect` function, to pick one confounding example. Redux’s class incompatibility was a _design decision_, not a technical inevitability.

It’s not actually clear what the documentation means by “things like persistence” (perhaps the `rt2zz/redux-persist` package?) but even if that is disregarded, and if time-travel debugging is not wanted, it seems possible that something else could break in a future version of Redux, if class instances are used.

Plain objects could be used in the store, and then converted to class instances or fancy objects when selected. These slow operations would be acceptable at the selector level, which passes smaller amounts of data, but this approach seems awkward, and it would be necessary to convert class instances to plain objects before using them as Redux action objects. Moreover, this wouldn’t allow method APIs to be used within Redux reducers.

Ultimately, I chose to use procedural APIs for types in the Redux store. Because this project uses the store to persist data, this includes all persistent types as well. These aren’t free-form objects, however; much as if they were classes, I define specific content for each

I am calling these **stereotypes**, to distinguish them from _ad hoc_ objects that are not widely shared. An example is found in the `Util/Rect.js` module. Every stereotype defines one or more factory functions, including one called `uNew`, which is called by other factories, if there are such. Stereotype members are assigned and documented in `uNew`, and instances are usually frozen there as well. Functions that would have been implemented as methods accept a stereotype instance as their first parameter, to stand in for `this`.


### Constructors and function overloading

All class variables are initialized and commented in the constructor. If meaningful values are not available, variables are set to `null`.

JavaScript does not allow function overloading in the traditional sense. Some developers emulate overloading by checking parameter values and types at the start of the function, in order to define missing parameters, or call different implementations. That can become surprisingly complex, however.

Overloading is most useful when constructing classes; a rectangle might be constructed from two points, or a point and two lengths, or a JSON string, _et cetera_. In this project, constructors are never overloaded; instead, each constructor accepts all the parameters it is possible to set from outside the class. Static factory functions with descriptive names are then used to invoke that constructor with varying inputs. See `Card.js` for an example; it provides three factory functions, including `uNewEmpty`, which creates a new card from no inputs. Factory functions often have roots that begin with `From`. The text following `From` identifies the input expected by that factory.


### Mutability and cloning

JavaScript lacks the detailed `const` protections found in C++, so sharing object references with and from functions can expose internal data that should not be mutated by the caller. This is prevented most directly by using immutable types, but immutability can make some operations slower, or harder to implement.

In this project, every class or stereotype is explicitly documented as ‘immutable’ or ‘mutable’. Most immutable class instances and stereotypes are frozen in their constructors or factory functions. `Object.freeze` is amazingly slow, however, so Pt2 and other low-level stereotypes do this only in the development build. In Node, when Pt2 did freeze, the word search took more than twice as long. When I created non-writable Pt2 instances by passing property descriptors to `Object.create`, the search took _ten times_ as long. Redux automatically freezes the objects returned by `useSelector`, so these are protected even though they are deserialized and instantiated elsewhere.

Functions that accept mutable object parameters must clone those objects before storing them in class instances, stereotypes, or globals, in case the caller mutates the arguments afterward. For similar reasons, functions must not return mutable objects from class instances, stereotypes, or globals; they must return clones instead. This is called ‘defensive copying’. When cloning is required, mutable types implement a `uClone` function that returns a deep copy of the instance.

As an aside, React and Redux also make an issue of mutability, but different problems are posed there, and different solutions provided.

React uses reference equality to detect changes in object hierarchies without visiting and comparing every node. This is why immutability matters to React: mutating an instance would leave its reference unchanged, React would not detect the change, and the page would not be updated to reflect the new state.

It is not desirable to update page content that hasn’t changed, so Redux Toolkit uses Immer to enforce ‘structural sharing’ when updating store data. When a value changes, its ancestor instances are replaced, but its sibling instances (along with any siblings of those ancestors) are _reused_ to show that they have not changed. This also avoids the expense of reallocating every object in the tree.

So, if the store begins with these instances:

```
          A
     +----+--+
     |    |  |
     B    C  D
  +--+--+
  |  |  |
  E  F  G
```

A change to value `E` will produce:

```
          A'
     +----+--+
     |    |  |
     B'   C  D
  +--+--+
  |  |  |
  E' F  G
```

Defensive copying is about _ownership_ and _encapsulation_, rather than change detection. It allows mutable types to be used while (to a limited extent) also controlling who gets to mutate those instances.


## Testing

Selected functionality in this project is tested with [Jest](https://jestjs.io/).

Some developers believe every function must be policed by a squad of mostly superfluous, never-failing tests. I think those developers would be more pragmatic if they were writing the checks, rather than cashing them. It makes more sense to reserve automated tests for functionality that:

- Changes often, perhaps to meet performance requirements; or,

- Is difficult to test, perhaps because it has a large range of inputs and outputs with a non-obvious mapping; or,

- Is safety-critical.

I would like to automate testing at the UI level, but it is difficult to do that in a meaningful way. Ultimately, hands-on QA work is the only way to test your UI.

For testing purposes, it is sometimes necessary to export types or functions that would otherwise be private to the implementing module. Instead of exporting these directly, I have packaged and exported them within `ForTest` objects. These should _not_ be used outside of testing.


## Miscellanea

### Game design

[todo]
Time limit
	Exciting
	Unproductive games shorter
	Feasible only in computer game
Scoring
	One point for all words
		Computer score overwhelming otherwise
	Followed words
Other ideas
	'Triple word score'
	Dynamic board
	Searching is fun part


### Word search algorithm

[todo]


### SVG in React

I used Inkscape to create various SVG images, but Inkscape SVGs cannot be used in React without modification, even when they are deployed statically and embedded with the `img` tag. When that is attempted, Webpack complains that ‘Namespace tags are not supported by default’. Inkscape also produces very verbose SVG. Saving as ‘Optimized SVG’ helps only somewhat.

I translated some Inkscape SVG into JSX with [svg2jsx](https://svg2jsx.com/), then I simplified and extended the JSX by hand. For simple images, it is easier to write the SVG from scratch.


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
