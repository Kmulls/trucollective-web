// Voice spots ("DJ breaks") that play between songs on the radio.
// Add one with:  python3 scripts/add-radio-spot.py "/path/to/recording.m4a"
// (it levels the recording to match the music, saves it under public/radio-spots/,
// and rewrites the generated list below). Then redeploy.

/** A spot plays after every this-many songs, and once more at the end of each loop. */
export const SPOT_EVERY = 6;

/** Shown as the "artist" while a spot is on air. */
export const DJ_NAME = "Tru Collective Radio";

/** `promo` clips (the app promo) are scheduled separately, roughly every 6th break. */
export type RadioSpot = { id: string; file: string; duration: number; promo?: boolean };

// BEGIN GENERATED (scripts/add-radio-spot.py)
export const RADIO_SPOTS: RadioSpot[] = [
  { id: "dj-01", file: "dj-01.mp3", duration: 4.799 },
  { id: "dj-02", file: "dj-02.mp3", duration: 4.543 },
  { id: "dj-03", file: "dj-03.mp3", duration: 19.135 },
  { id: "dj-04", file: "dj-04.mp3", duration: 3.177 },
  { id: "dj-05", file: "dj-05.mp3", duration: 4.116 },
  { id: "dj-06", file: "dj-06.mp3", duration: 17.001 },
  { id: "dj-07", file: "dj-07.mp3", duration: 4.287 },
  { id: "dj-08", file: "dj-08.mp3", duration: 2.324 },
  { id: "dj-09", file: "dj-09.mp3", duration: 3.433 },
  { id: "dj-10", file: "dj-10.mp3", duration: 2.324 },
  { id: "dj-11", file: "dj-11.mp3", duration: 3.263 },
  { id: "dj-12", file: "dj-12.mp3", duration: 4.799 },
  { id: "dj-13", file: "dj-13.mp3", duration: 8.383 },
  { id: "promo-01", file: "promo-01.mp3", duration: 10.516, promo: true },
];
// END GENERATED
