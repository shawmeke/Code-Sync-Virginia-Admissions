# Middle Fifty

Middle Fifty shows Virginia high school students how their GPA, test scores and class rank compare with the students who enrolled at 15 Virginia colleges. Every number comes from the college's own Common Data Set. The name comes from the middle 50% range colleges publish for their students, which is what the app compares you to. We're team Code-Sync, and we built it for the 2026 Congressional App Challenge.

## Why we made it

Most college "chance" calculators give you one percentage and never say where it came from. The data colleges publish can't back up a number like that, since it only describes the students who got in. We wanted an app that shows the real published numbers, says which students they describe, and admits when a number is missing.

## What it does

You enter your GPA, an SAT or ACT score, and your class rank (your rank and your class size; the app works out the percent). For each college, Middle Fifty checks each measure against the middle 50% the college published and estimates your percentile among its enrolled students. The average of those percentiles is your Academic Match, from 0 to 100. A match of 60 means your numbers are higher than about 60% of that college's students. It isn't a chance of getting in, and the app never calls it one.

When something can't be compared, the app tells you why. A college might not publish a figure, or it might report weighted GPAs when you entered an unweighted one. Test-blind schools like Radford leave test scores out of the match.

It also shows:

- admit rates for Virginia and out-of-state applicants, which are far apart at schools like UVA (26% and 14% for Fall 2024)
- application fees, deadlines, and early decision and early action dates
- what students study at each school, from its share of bachelor's degrees in each field, and how big your intended major is there
- a Compare tab for two schools side by side, and a saved list

Nothing you type is saved or sent anywhere. blehhhhhhhhhhhhhhhhħ

## Schools

| School | Common Data Set | Admissions figures for |
|---|---|---|
| George Mason University | 2025–26 | Fall 2025 |
| James Madison University | 2025–26 | Fall 2025 |
| Old Dominion University | 2025–26 | Fall 2025 |
| Radford University | 2025–26 | Fall 2025 |
| Regent University | 2024–25 | Fall 2024 |
| Shenandoah University | 2024–25 | Fall 2024 |
| University of Mary Washington | 2025–26 | Fall 2025 |
| University of Richmond | 2025–26 | Fall 2025 |
| University of Virginia | 2024–25 | Fall 2024 |
| Virginia Commonwealth University | 2024–25 | Fall 2024 |
| Virginia Military Institute | 2024–25 | Fall 2024 |
| Virginia State University | 2025–26 | Fall 2025 |
| Virginia Tech | 2025–26 | Fall 2025 |
| Washington and Lee University | 2025–26 | Fall 2025 |
| William & Mary | 2025–26 | Fall 2025 |

Links to every source document are in [`data/colleges.ts`](data/colleges.ts) and on the app's About screen.

## Running it

You need [Node.js](https://nodejs.org). In Terminal:

```bash
git clone https://github.com/shawmeke/Code-Sync-Virginia-Admissions.git
cd Code-Sync-Virginia-Admissions
npm install
npx expo start
```

When it's ready, press `w` to open the app in your browser, or scan the QR code with the Expo Go app on your phone. To run the tests, use `npm test` in the same folder.

## How it's built

It's TypeScript with React Native and Expo, so the same code runs on iPhone, Android and the web. The comparison math is in `lib/admissions.ts`. `lib/validation.ts` checks what students type and also checks the college data itself, so a typo in `data/colleges.ts` fails a test instead of reaching a student as a wrong number. Missing figures are stored as `null`, never as zero, because "not published" and "zero" mean different things.

## Limits

- These numbers describe past students. They can't tell you how your own application will be decided.
- Percentiles are estimates. Between published percentiles the app draws straight lines, and inside a GPA or class rank group it assumes students are spread evenly.
- UVA, VCU, VMI, Regent and Shenandoah use their 2024–25 Common Data Sets, a year older than the rest, because newer ones weren't posted yet.
- Colleges leave things out. JMU publishes no GPA data and its class rank table doesn't add up, so we left both out. Washington and Lee publishes no GPA data either. William & Mary leaves its in-state and out-of-state table and its degrees-by-field table blank.
- The Common Data Set doesn't say whether GPAs are weighted. Virginia Tech, William & Mary and UVA report averages above 4.0 or most students at 4.0, so we treat their GPAs as weighted. That's our reading of their numbers.
- Most figures combine in-state and out-of-state students, even at schools where the two groups get in at very different rates.
- Our copy of UVA's Common Data Set lost its table layout in the section on what the school weighs, so those factors and its early decision answer are blank.

## Photo credits

Campus photos are from Wikimedia Commons, resized for the app. We use photos instead of school logos because logos are trademarks.

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
