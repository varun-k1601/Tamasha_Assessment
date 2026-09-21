# Onboarding Wizard

A four-step onboarding flow built with Vite + React 18 in plain JavaScript.
State is held in a single React Context backed by `useReducer`; validation is a
set of hand-written pure functions. There are no dependencies beyond React and
Vite — no state library, no form library, no UI kit.

## Setup

```bash
npm install
npm run dev
```

The dev server prints a local URL (http://localhost:5173 by default).

```bash
npm run build     # production build
npm run preview   # serve the production build
```

## The flow

1. **Personal info** — name (required), email (required, must look like an
   email), portfolio/GitHub URL (optional, but must be a real URL if filled in).
2. **Preferences** — primary track and experience level, both required.
3. **Tech stack** — checkboxes driven by the track chosen in step 2, at least one
   required.
4. **Review & submit** — a summary of every answer with an Edit button per
   section that jumps back to that step. Submit logs the payload and shows a
   success state.

Answers auto-save to `localStorage` 500ms after you stop typing, and are restored
on refresh.

## Architecture

### State shape

One object, owned by one reducer:

```js
{
  currentStep: 1,
  formData: {
    personal:    { name: '', email: '', portfolioUrl: '' },
    preferences: { track: '', experience: '' },
    techStack:   []            // array of selected tech ids
  },
  errors: {},                  // { 'personal.email': 'message' }
  touched: {},                 // { 'personal.email': true }
  isDraftSaved: false,
  isSubmitted: false
}
```

`errors` and `touched` are flat maps keyed `"section.field"` (`"techStack"` for
step 3, which has no section). Keys are always built with the `fieldKey()` helper
exported from the reducer, so a typo in one place cannot silently create a key
that nothing reads.

### Data flow

```
step component  --dispatch(action)-->  reducer  --new state-->  context  -->  step component
                                          ^
                    utils/validation.js --+  (pure, called by the steps and the wizard)
```

- **`src/context/reducer.js`** is the only place state changes. Every case
  spreads at each level (`state` -> `formData` -> `personal`), so nothing is ever
  mutated in place.
- **`src/context/OnboardingContext.jsx`** owns the single `useReducer`, lazily
  initialises it from `localStorage`, runs the auto-save hook, and exposes
  `{ state, dispatch }` through `useOnboarding()`.
- **Step components are presentational.** They read from context, dispatch
  actions, and render the shared inputs in `src/components/ui/`. None of them
  holds form state of its own, and none of them contains a validation rule.
- **`src/utils/validation.js`** is pure: no React, no context. `validateStep()`
  returns an object shaped exactly like `state.errors`, so
  `Object.keys(...).length === 0` means "this step is valid".
- **`src/config/techOptions.js`** holds every option list the wizard offers. Step
  3's conditional behaviour is a lookup in that map, not a branch in JSX.

### Why Context + useReducer instead of Redux

For an app this size, the useful part of Redux is the reducer, and React gives us
that for free. There is exactly one consumer tree, one store, no middleware, no
async thunks and no cross-slice coordination, so Redux's real strengths — the
devtools, middleware, and splitting a large store into slices — would mean paying
setup cost and a dependency for something we never use. What this app actually
needed was a single source of truth with named, testable transitions, and
`useReducer` gives exactly that: `reducer.js` is a plain function you can call in
isolation, which is how every behaviour here was checked. The one thing Context
does not give us is Redux's per-selector re-render bailout — every consumer
re-renders when state changes — and with one small form on screen at a time, that
is not worth a library.

## Assumptions

- **Fullstack tech list.** The brief lists options for Frontend, Backend and
  UI/UX Design but not Fullstack, so Fullstack gets the union of Frontend and
  Backend (8 options). It is one line in `src/config/techOptions.js`.
- **The portfolio URL is genuinely optional.** Empty is valid. If it is filled
  in, it must parse with `new URL()`, so `https://github.com/ada` passes and a
  bare `github.com/ada` does not — the latter has no scheme and is not a URL. The
  field's hint says so up front, before the user is corrected.
- **`isSubmitted` was added to the given state shape.** Step 4 needs a success
  state and the specified shape had nowhere to put it. The alternative — a fake
  `currentStep: 5` — would have broken the step indicator.
- **Track and experience options live in `config/techOptions.js`** alongside the
  tech options, because step 2 renders those labels and step 4 reads them back to
  display the summary. Keeping them in the step file would have meant two copies
  of one list that could drift apart.
- **Email validation is deliberately simple:** `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`. It
  catches the mistakes people actually make (no `@`, no dot, a space in the
  middle) and does not attempt the full RFC grammar, which no regex should.
- **`errors` and `touched` are not persisted.** They describe the current editing
  session rather than the user's answers, so a restored draft starts with a clean
  slate and re-validates as the user moves through it.
- **The draft is not cleared on submit.** There is no backend, so there is
  nothing to hand the data off to; clearing it would throw the only copy away.
- **Only `formData` and `currentStep` are written to storage**, under the
  versioned key `onboarding-draft-v1`. Bumping to `-v2` would make old drafts be
  ignored rather than misread if the shape ever changed.

## Answers to review questions

### a) How is the debounce timer structured, and what happens on unmount?

`useDebouncedEffect(callback, deps, delay)` in `src/hooks/useDebouncedEffect.js`
is a `useEffect` whose body does one thing — `setTimeout(callback, delay)` — and
which returns `() => clearTimeout(timeoutId)` as its cleanup. React runs that
cleanup in two situations: immediately before re-running the effect because a
dependency changed, and once when the component unmounts. On a dependency change
it means the previous, not-yet-fired timer is thrown away and replaced, so five
keystrokes inside 500ms leave exactly one live timer and produce one
`localStorage` write containing the final value, instead of five writes. On
unmount it means a still-pending timer is cancelled, so a write cannot land after
the component is gone — writing stale data, or in a larger app dispatching into
something that no longer exists. `callback` is intentionally left out of the
dependency array, because it is a new closure on every render and including it
would restart the timer on every render rather than only when the values we care
about change. A pleasant side effect: React 18's StrictMode mounts effects twice
in development, and the cleanup means the throwaway first timer is cancelled and
exactly one write still happens.

### b) What happens to step 3's selections when the track changes in step 2?

Changing the track clears `techStack`, along with the step 3 error and its
touched flag. Re-selecting the *same* track changes nothing — the reducer
compares the incoming value against the current one and only invalidates on a
real change, so clicking "Frontend" when Frontend is already selected leaves your
picks alone. This lives in the `SET_PREFERENCE` case of the reducer rather than
in a `useEffect` inside step 2, because clearing the tech stack is part of the
same state transition as changing the track: one dispatch produces one new state
in which the two already agree. Doing it in an effect would mean at least one
render where the track says "Backend" while `techStack` still holds
`['react', 'vue']` — a window in which the review screen could render impossible
data — and it would put a rule about what the state *means* inside a component
that is meant to be purely presentational. The reasoning is commented at the case
itself, since it is the kind of thing a future reader would otherwise be tempted
to "clean up".

### c) Why on-blur + on-submit validation rather than pure on-change?

Because on-change validation tells people they are wrong while they are still
answering. Typing the `j` of `jane@example.com` would immediately produce "enter
a valid email address", which is useless and discouraging, and by the time the
message is accurate the user has been told off three or four times. Blur is the
natural moment — the user has signalled "I'm done with this field", so checking
it is fair — and clicking Next is the other fair moment, which marks every field
in the step touched at once so nothing stays silently missing. The one place
on-change validation *is* right is a field that is already showing an error: the
user is actively fixing it and deserves the message to disappear the moment it is
fixed, so the change handlers re-validate only when a field is both touched and
currently in error. This is also exactly why `errors` and `touched` are separate
maps: `errors` is what is wrong, `touched` is what the user has earned the right
to be told about, and a field renders in an error state only when both are true.

## A note on the Next button

The Next button's `disabled` state is derived by calling `validateStep()` during
render, not by reading `state.errors`. The two answer different questions:
`validateStep()` is whether the step is *really* valid right now, while
`state.errors` is only the set of messages the user has already been shown. On a
blank, untouched form those disagree on purpose — Next is disabled and no error
messages are visible. Clicking Next still marks the whole step touched and writes
the errors before deciding whether to advance, so the failure path surfaces
messages rather than silently doing nothing.

## Accessibility

Each field renders its error inline with `role="alert"`, and the input carries
`aria-invalid="true"` plus an `aria-describedby` pointing at that message (and at
the hint, when there is one). Radio and checkbox groups are `fieldset`/`legend`
and put `aria-invalid`/`aria-describedby` on the group rather than on individual
inputs, because "nothing selected" is a fact about the group. The step indicator
marks the active step with `aria-current="step"`, and the three "Edit" buttons on
the review screen carry `aria-label="Edit <section>"` so they are not three
identical, ambiguous buttons.

Required fields are marked with a red `*` beside the label or legend. The marker
is `aria-hidden`, so a screen reader is not read a stray "star"; required text
inputs carry `aria-required="true"` and the track/experience radio groups carry
it on the group instead. The tech-stack checkbox group shows the `*` but has no
`aria-required`, because ARIA does not allow that attribute on a plain group -
its "at least one" rule is carried by the inline error message instead. The
optional portfolio URL is deliberately unmarked and says "Optional" in its hint.
