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
- **Shows alignment at a glance.** Each school gets a dotted bar from "Below
  typical" to "Above typical", with a gold mark at the student's match.
- **Shows what students study.** Each school's page lists its most common
  fields of study, from the share of bachelor's degrees in each field (CDS
  section J1). Pick a major and the app shows how big that field is at every
  school.
- **Compares and saves schools.** A Compare tab puts two schools side by side,
  and students can save schools while they browse.

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
- Some colleges don't publish every figure. JMU publishes no GPA data, and its
  class rank table doesn't add up, so the app leaves both out. William & Mary
  leaves its in-state and out-of-state table blank.
- The Common Data Set doesn't say whether GPAs are weighted. Virginia Tech,
  William & Mary and UVA report averages above 4.0 or most students in the
  4.0 group, so the app treats their GPAs as weighted. That's my inference.
- Figures combine in-state and out-of-state students. At UVA and William &
  Mary, the two groups are admitted at very different rates.
- My copy of UVA's Common Data Set lost its table layout in the section on
  what the school weighs, so those factors and its early decision answer are
  left blank.

## Photo credits

Campus photographs from Wikimedia Commons, each resized and recompressed for the app:

- University of Virginia: [The Rotunda and Lawn University of Virginia Charlottesville VA March 2011](https://commons.wikimedia.org/wiki/File:The_Rotunda_and_Lawn_University_of_Virginia_Charlottesville_VA_March_2011.jpg) by Phil Roeder, [CC BY 2.0](https://creativecommons.org/licenses/by/2.0), resized
- Virginia Tech: [Virginia Tech Burruss Hall from Drillfield](https://commons.wikimedia.org/wiki/File:Virginia_Tech_Burruss_Hall_from_Drillfield.JPG) by Eric T Gunther, [CC BY 3.0](https://creativecommons.org/licenses/by/3.0), resized
- William & Mary: [The Wren Building (3501325643)](https://commons.wikimedia.org/wiki/File:The_Wren_Building_(3501325643).jpg) by benuski from Richmond, VA, USA, [CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0), resized
- James Madison University: [Wilson Hall closeup](https://commons.wikimedia.org/wiki/File:Wilson_Hall_closeup.JPG) by Rtcpenguin, [CC BY-SA 2.5](https://creativecommons.org/licenses/by-sa/2.5), resized
- Old Dominion University: [Kaufman Mall and the Webb University Center (cropped)](https://commons.wikimedia.org/wiki/File:Kaufman_Mall_and_the_Webb_University_Center_(cropped).JPG) by Cmett003, [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0), resized
- George Mason University: [An aerial view of the Johnson Center at dawn.](https://commons.wikimedia.org/wiki/File:An_aerial_view_of_the_Johnson_Center_at_dawn..jpg) by Nicolas Tan/Creative Services/George Mason University, [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0), resized
- Virginia Commonwealth University: [Grace E. Harris Hall, VCU](https://commons.wikimedia.org/wiki/File:Grace_E._Harris_Hall,_VCU.jpg) by Eli Christman, [CC BY 2.0](https://creativecommons.org/licenses/by/2.0), resized
- Radford University: [Muse Hall, Radford University](https://commons.wikimedia.org/wiki/File:Muse_Hall,_Radford_University.jpg) by Nyttend, [Public domain](https://commons.wikimedia.org/wiki/File:Muse_Hall,_Radford_University.jpg), resized
- University of Richmond: [BoatwrightTower](https://commons.wikimedia.org/wiki/File:BoatwrightTower.jpg) by TrunkJunk, [Public domain](https://commons.wikimedia.org/wiki/File:BoatwrightTower.jpg), resized
- Washington and Lee University: [Washington Hall, Washington and Lee University, Lexington, VA](https://commons.wikimedia.org/wiki/File:Washington_Hall,_Washington_and_Lee_University,_Lexington,_VA.jpg) by Zeete, [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0), resized
- Virginia Military Institute: [VMI Barracks](https://commons.wikimedia.org/wiki/File:VMI_Barracks.JPG) by Nick40ghs, [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0), resized
- Regent University: [Regent University Robertson Hall](https://commons.wikimedia.org/wiki/File:Regent_University_Robertson_Hall.jpg) by DebateLord, [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0), resized
- University of Mary Washington: [Monroe Hall UMW](https://commons.wikimedia.org/wiki/File:Monroe_Hall_UMW.jpg) by Jte288, [Public domain](https://commons.wikimedia.org/wiki/File:Monroe_Hall_UMW.jpg), resized
- Shenandoah University: [Shenandoah U; Ohrstrom-Bryant Theatre](https://commons.wikimedia.org/wiki/File:Shenandoah_U;_Ohrstrom-Bryant_Theatre.JPG) by Eruditefello, [CC BY-SA 3.0](http://creativecommons.org/licenses/by-sa/3.0/), resized
- Virginia State University: [Vawter Hall at VSU](https://commons.wikimedia.org/wiki/File:Vawter_Hall_at_VSU.jpg) by Jweaver28, [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0), resized

Each school appears as a small campus photo, never an official logo (logos are trademarks). On a college's own page, where the photo is already the header, it shows the school's initials in its colors instead.
