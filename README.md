# Code-Sync: Virginia Admissions

A mobile app that helps Virginia high school students understand how their
academic profile compares with what Virginia universities publish about the
students they admit. Built for the Congressional App Challenge.

## The problem

Students hear "acceptance rates" and "average GPAs" without knowing where those
numbers come from, which students they describe, or what's missing. Many
admissions calculators turn this into a single "% chance" that the data can't
actually support. That can scare off qualified students or give false
confidence.

## What the app does

- **Uses only official data.** Every number comes from the university's own
  Common Data Set (CDS), and the app shows the source, year, and the group of
  students each number describes.
- **Compares one measure at a time.** For SAT, ACT, GPA, and class rank, it
  says whether a student is below, within, or above the published middle 50%,
  and estimates their percentile among the college's enrolled students.
- **Gives an Academic Match score.** The average of those percentiles, from 0
  to 100: "on average, your numbers are higher than about 60% of this
  college's students." Every input traces back to published data; the app
  invents no weights.
- **Never predicts admission.** Academic Match describes how a student's
  numbers compare with past students. It isn't a chance of admission, because
  the Common Data Set only describes students who were admitted, not those who
  weren't.
- **Explains instead of guessing.** If a college hasn't published a figure, or
  the student's GPA is on a different scale than the college's, the app says so
  instead of filling in a guess.
- **Highlights Virginia residency.** Virginia's public universities admit
  in-state and out-of-state students at very different rates (for example, UVA
  admitted about 26% of Virginia applicants and 14% of out-of-state applicants
  for Fall 2024). The app shows the rate for the student's own residency.
- **Keeps student data private.** Nothing a student enters is saved or sent
  anywhere.

## Universities included

| University | Data source | Cycle |
|---|---|---|
| University of Virginia | Common Data Set 2024–25 | Fall 2024 |
| Virginia Tech | Common Data Set 2025–26 | Fall 2025 |
| William & Mary | Common Data Set 2025–26 | Fall 2025 |
| James Madison University | Common Data Set 2025–26 | Fall 2025 |
| Old Dominion University | Common Data Set 2025–26 | Fall 2025 |

Links to each source document are in [`data/colleges.ts`](data/colleges.ts) and
on the app's About screen.

## How it's built

- [Expo](https://expo.dev) and React Native with TypeScript, so it runs on iOS,
  Android, and the web from one codebase
- `lib/admissions.ts`: the comparison logic, percentile estimates, and
  Academic Match
- `lib/profileForm.ts`: turns what the student types into a checked profile
- `lib/validation.ts`: checks on student input and on the college data itself,
  so a typo in the data fails a test instead of showing a wrong number
- `data/colleges.ts`: every figure stored with its source, year, and cohort;
  missing data is stored as "not published," never as zero

## Run it

```bash
npm install
npx expo start      # then press w for web, or scan the QR code with Expo Go
npm test            # run the tests
```

## Limits

- The figures describe past admitted or enrolled students. They can't tell
  you how your own application will be decided.
- Percentiles are estimates. Between the published percentiles the app draws
  straight lines, and within a GPA or class rank group it assumes students are
  spread evenly.
- UVA's data is one year older than the other schools' because its 2025–26
  Common Data Set wasn't available yet.
- Some colleges don't publish every figure. JMU, for example, publishes no
  GPA data.
