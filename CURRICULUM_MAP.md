# MathStars curriculum map and audit report

Status legend: **VERIFIED** = I read the official document myself and the item matches. **PARTLY** = official file read, but the title or concept was inferred from the first page of each chapter, not from a contents page. **NOT VERIFIED** = official source could not be read, so nothing is claimed.

## 1. Sources and what was actually checked

| Source | What I did | Status |
|---|---|---|
| NCERT, *National Curriculum Framework for Foundational Stage 2022* (ncert.nic.in flipbook, pp. 59 and 61) | Read the mathematics competencies C-8.1 to C-8.13 (cognitive domain, ages 3 to 8) | **VERIFIED** (competency text). The document does **not** assign competencies to IK1, IK2, IK3, LKG or UKG separately. That split in the app is my judgement, not official. |
| NCERT *Joyful Mathematics* Class 1 (13 chapters) | Chapter titles from the CIET portal (ciet.ncert.gov.in/audio-book/118) and the first page of every chapter PDF on ncert.nic.in | **VERIFIED** |
| NCERT *Joyful Mathematics* Class 2 (11 chapters) | CIET portal (audio-book/121) and chapter PDFs | **VERIFIED** (titles). Concepts per chapter inferred from first pages: **PARTLY** |
| NCERT *Maths Mela* Class 3 (14 chapters) | All 14 chapter PDFs downloaded, first page read. Titles taken from the official contents page as reported by a search tool, not read by me | **PARTLY** |
| NCERT *Maths Mela* Class 4 (14 chapters) and Class 5 (15 chapters) | All chapter PDFs downloaded, first page read. CIET lists only "Chapter-N". Titles not extracted, concepts inferred | **PARTLY** |
| NCERT *Ganita Prakash* Class 6 (10 chapters) | All chapter PDFs read (first page) | Titles of ch. 1, 2, 3, 8, 9, 10 **VERIFIED**; ch. 4 to 7 (data, prime time, perimeter and area, fractions) inferred: **PARTLY** |
| NCERT *Ganita Prakash* Class 7 Part 1 (8) and Part 2 (7) | All chapter PDFs read | Part 2 titles **VERIFIED**; Part 1 titles mostly from page headers: **PARTLY** |
| NCERT *Ganita Prakash* Class 8 Part 1 (7 chapters) | Chapter PDFs read | **PARTLY**. **Part 2 was not retrieved: NOT VERIFIED** |
| Telangana SCERT | scert.telangana.gov.in opens, but its textbook and syllabus pages are ASP.NET post-back pages and the PDFs linked from the home page are administrative documents, not textbooks | **NOT VERIFIED** |
| CBSE | CBSE schools use NCERT textbooks. I did not read a CBSE syllabus document | **NOT VERIFIED** (only inferred from NCERT) |
| ICSE / CISCE | cisce.org returned HTTP 403 to automated access. Only third-party summaries were found | **NOT VERIFIED** |

The curriculum selector in the app (SCERT, NCERT, CBSE, ICSE) currently changes only the label. Questions are the same for all four. I did not build separate SCERT, CBSE or ICSE question sets because I could not read their documents.

## 2. Mapping: official chapter or competency to app topic

### IK1, IK2, IK3, LKG, UKG (NCF-FS 2022 competencies)

| Competency (official wording shortened) | App topic and question types | Notes |
|---|---|---|
| C-8.1 Sorts objects by one or more properties | Counting: `sortTwo`; Shapes: `oddShape` | |
| C-8.2 Identifies and extends simple patterns | Patterns: colour, shape, missing, growing, `patCount`, `patOdd`, `patUnit` | IK1 has no patterns topic |
| C-8.3 Counts forwards and backwards, in groups of 10s | Counting: `countObj`, `beforeAfter`, `countBack`, `skip10` | The competency goes up to 99. The app goes to about 20, plus tens up to 100 in UKG |
| C-8.4 Arranges numbers in order | Counting: `orderNums` | |
| C-8.5 Numerals and place value | Counting: `numWord`, `tensOnes` (Class 1) | Partial in UKG |
| C-8.6 Adds and subtracts 2-digit numbers | UKG addition and subtraction (pictures, `bond10`, number stories) | Partial |
| C-8.7 Multiplication as repeated addition, division as equal sharing | UKG "Equal Groups and Sharing": `eqGroups`, `repAdd`, `eqShare` | |
| C-8.8 Basic geometric shapes and properties | Shapes: names, sides, solids, position | |
| C-8.9 Measures length, weight, volume | Measurement: `cmpAttr`, `capacityCmp`, `lenCompare` | Comparison only. No measuring tools before Class 1 |
| C-8.10 Time | Measurement: `dayRoutine`, `seqDay`, `clock`, `timeFacts` | |
| C-8.11 Money up to INR 100 | UKG "Coins and Money": coins, prices, change | |
| C-8.12, C-8.13 Vocabulary, problem solving | Story questions in every topic | Not tested separately |

### Class 1 to Class 8

| Class | Official chapters (see status above) | App topics | Gap or note |
|---|---|---|---|
| 1 Joyful Mathematics | Finding the Furry Cat!; What is Long? What is Round?; Mango Treat; Making 10; How Many?; Vegetable Farm; Lina's Family; Fun with Numbers; Utsav; How do I Spend my Day?; How Many Times?; How Much Can We Spend?; So Many Toys | Numbers and Place Value, Addition, Subtraction, Shapes and Space, Length Weight Capacity, Patterns and Time, **How Many Times? (new)**, **How Much Can We Spend? (new)**, Everyday Maths | Position words (`position`), Making 10 (`bond10`) and calendar (`calendar`) added. Class 1 multiplication keeps only 3 levels |
| 2 Joyful Mathematics | A Day at the Beach; Shapes Around Us; Fun with Numbers; Shadow Story (Togalu); Playing with Lines; Decoration for Festival; Rani's Gift; Grouping and Sharing; Which Season is it?; Fun at the Fair; Data Handling | Numbers, Addition, Subtraction, Equal Groups and Tables, Sharing and Grouping, Shapes and Patterns, Measurement, Money, **Data Handling (new)**, Word Problems | Shadows are not covered. Shapes has few levels |
| 3 Maths Mela | What's in a Name?; Toy Joy; Double Century; Vacation with My Nani Maa; Fun with Shapes; House of Hundreds I and II; Raksha Bandhan; Fair Share; Fun at Class Party!; Filling and Lifting; Give and Take; Time Goes On; The Surajkund Fair | Numbers, Add, Subtract, Multiply, Divide, Fractions, Shapes and Geometry, Measurement and Time, Data, **Money (new, Give and Take)**, Problem Solving | Titles PARTLY verified. Concept per chapter inferred |
| 4 Maths Mela | 14 chapters. Concepts seen on first pages: building and views, counting large numbers, langar word problems, parts and wholes, length, school trip, weight and capacity, animal jumps (multiples), number game, symmetry, calendar and leap years, mystery matrix (multiplication), data questions | Large Numbers, Add, Subtract, Multiply, Divide, Fractions, Geometry and Symmetry, Measurement, Data, Word Problems | `leapYear`, `funcMachine`, `directions`, `turnFacts` added. No "views from the top" questions |
| 5 Maths Mela | 15 chapters. Concepts: travelling (distance and time), fractions, angles and turns, number sums, far and near (length), the dairy farm, shapes and patterns, weight and capacity, division facts, symmetry, perimeter (quilt), time in seconds, animal jumps, maps and directions, data through pictures | Numbers, Add, Subtract, Multiply, Divide, Fractions and Decimals, Geometry, Measurement and Perimeter, Data, Problem Solving | `directions`, `funcMachine`, `timeFacts` added |
| 6 Ganita Prakash | Patterns in Mathematics; Lines and Angles; Number Play; Data Handling and Presentation; Prime Time; Perimeter and Area; Fractions; Playing with Constructions; Symmetry; The Other Side of Zero (integers) | all ten app topics follow these chapters | `symm`, HCF/LCM word problems, co-prime and common-factor questions added. Constructions are not drawn |
| 7 Ganita Prakash | Part 1: Large Numbers Around Us; Arithmetic Expressions; A Peek Beyond the Point; Expressions using Letter-Numbers; Parallel and Intersecting Lines; Number Play; A Tale of Three Intersecting Lines; Working with Fractions. Part 2: Geometric Twins; Operations with Integers; Finding Common Ground; Another Peek Beyond the Point; Connecting the Dots; Constructions and Tilings; Finding the Unknown | app topics follow these chapters; **Finding Common Ground (new, HCF and LCM)** | `congSSS` (congruent triangles, drawn to scale) added. "Connecting the Dots", constructions and tilings not covered |
| 8 Ganita Prakash | Part 1 only: ch. 1 (a puzzle about a will, probably squares and cubes), Power Play, A Story of Numbers, Quadrilaterals, Number Play, We Distribute Yet Things Multiply, Proportional Reasoning | Number Systems and Powers, Linear Equations, Comparing Quantities, Algebraic Expressions, Factorisation, Ratios, Quadrilaterals and Pythagoras, Mensuration, Data | Part 2 chapters unknown, so coverage of them is unchecked. `divTest` and percentage, profit and interest questions added |

## 3. Changes made in `index.html`

- **New topics:** Measurement for IK1 to UKG; Coins and Money and Equal Groups and Sharing for UKG; How Many Times? and How Much Can We Spend? for Class 1; Data Handling for Class 2; Money for Class 3; Finding Common Ground for Class 7.
- **New question types** (in `richQ`, registered in the `T` table): `sortTwo`, `cmpAttr`, `dayRoutine`, `seqDay`, `calendar`, `countBack`, `skip10`, `numWord`, `bond10`, `position`, `eqGroups`, `repAdd`, `eqShare`, `groupInto`, `arrayQ`, `costCmp`, `buyTwo`, `addPic`, `subPic`, `faces`, `rolls`, `objShape`, `shapeCmp`, `fSetOf`, `fMoreLess`, `timeFacts`, `lenStory`, `capacityCmp`, `patCount`, `patOdd`, `patUnit`, `leapYear`, `directions`, `funcMachine`, `congSSS`, `hcfBig`, `lcmBig`, `hcfWord`, `lcmWord`, `commonFactor`, `coprime`, `findPct`, `wholeFromPct`, `pctChange`, `profitPct`, `simpleInt`, `turnFacts`.
- **Level pools are now deterministic.** Pools are built with a seeded random generator per class, curriculum and topic. Two fresh page loads give the same level numbers, so saved progress per level stays consistent.
- **Level cards** show Basic, Easy, Medium, Hard or Advanced by position. Children can open any available level.
- **Progress** is still saved per class, curriculum, topic and original level number.

## 4. Audit results (curriculum SCERT label; all four labels give the same questions)

Run with `tools/` (needs `npm i jsdom`; `node audit.js ../index.html SCERT`).

- 104 class and topic combinations, **1,834 published levels**, every level has at least 10 unique questions.
- **0 questions repeated across levels** within a class and topic (wording, picture, and numbers-plus-answer all compared).
- **Independent answer checks** (`verify.js`, `verify2.js`): about 6,400 question instances recomputed from their text or picture (arithmetic, number bonds, skip counting, equal groups, arrays, sorting counts, fractions of a set, HCF and LCM, percentages, interest, leap years, directions, congruence, solid faces). **0 failures** after fixing one invalid triangle (3, 4, 7) that the checks caught. Many older generators (clock, fractions, geometry diagrams) have **no independent check**, so their correctness is not proven.
- Option checks: every question has unique options that include the answer.
- Difficulty progression: in 83 of 92 earlier combinations the second half of the levels uses numbers at least as large as the first half. Levels are not graded for reasoning difficulty beyond the order of question types.

Levels per class and topic (of 20):

| Class | Levels |
|---|---|
| IK1 | counting 20, shapes 20, measurement 2 |
| IK2 | counting 20, patterns 7, shapes 20, measurement 5 |
| IK3 | counting 20, patterns 20, shapes 20, measurement 5 |
| LKG | counting 20, shapes 20, patterns 20, measurement 20 |
| UKG | counting 20, addition 16, subtraction 15, shapes 20, patterns 20, measurement 20, money 20, multiplication 3 |
| 1 | counting 20, addition 15, subtraction 14, shapes 20, measurement 8, patterns 20, multiplication 3, money 20, mixed 7 |
| 2 | counting 20, addition 20, subtraction 20, multiplication 10, division 7, shapes 3, measurement 14, money 20, data 20, mixed 20 |
| 3 | counting 20, addition 20, subtraction 20, multiplication 17, division 18, fractions 12, shapes 12, measurement 20, data 20, money 20, mixed 20 |
| 4 | all 20 except fractions 20, shapes 7 |
| 5 | all 20 except geometry 17 |
| 6 | all 20 except multiplication 18, division 12 |
| 7 | all 20 (including Finding Common Ground) |
| 8 | all 20 except subtraction 18, division 13, mixed 16 |

## 5. Still incomplete

- Telangana SCERT, CBSE and ICSE/CISCE syllabi are **not verified**. Class 8 Part 2 chapters are not read.
- Per-class competency assignment for IK1 to UKG is my choice, not official.
- Thin topics: IK1 measurement (2 levels), IK2 and IK3 measurement (5), Class 2 shapes (3), Class 1 and UKG multiplication (3), Class 4 shapes (7), Class 1 and Class 2 division and mixed (7).
- Difficulty rises mainly through number size and the order of question types. It has not been designed or checked level by level for conceptual reasoning.
- Question grammar was checked by pattern rules, not by a dictionary or a person.
- Voice narration, timers and animations were not retested in a real browser with sound.

## 6. Browser test (headless Edge)

520 questions displayed across 13 class and topic combinations at 1280×800 and 390×844, first and last level of each. No page or console errors, every question had at least 3 answer options, and no question or answer text overflowed. The automatic overflow check flagged Class 2 and Class 3 data (picture charts) and one UKG addition question. Screenshots showed the charts fully visible but shrunk with `zoom` to fit, so they are readable but small. Not tested: sound, voice-over timing, the video recording, and real phones.
