// Voice spots ("DJ breaks") that play between songs on the radio.
// Add one with:  python3 scripts/add-radio-spot.py "/path/to/recording.m4a"
// (it levels the recording to match the music, saves it under public/radio-spots/,
// and rewrites the generated list below). Then redeploy.

/** A spot plays after every this-many songs, and once more at the end of each loop. */
export const SPOT_EVERY = 8;

/** Shown as the "artist" while a spot is on air. */
export const DJ_NAME = "Tru Collective Radio";

export type RadioSpot = { id: string; file: string; duration: number };

// BEGIN GENERATED (scripts/add-radio-spot.py)
export const RADIO_SPOTS: RadioSpot[] = [
  { id: "dj-01", file: "dj-01.mp3", duration: 4.799 },
];
// END GENERATED
