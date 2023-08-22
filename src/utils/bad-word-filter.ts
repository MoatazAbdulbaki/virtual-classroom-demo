
import * as BadWordsFilter from "bad-words";
import { BAD_WORDS } from "../data/bad-words";
import { CONSTANTS } from "./constants";

const reEscape = (s: any) => s.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
const badWords = CONSTANTS.DEFAULTS.BAD_WORDS; // Fix this line
const badWordsRE = new RegExp(badWords.map(reEscape).join("|"));

export function BadWordFilter(word: string) {
  try {
    const filter = new BadWordsFilter();
    filter.addWords(...BAD_WORDS);
    return filter.clean(word);
  } catch (error) {
    try {
      const match = word.match(badWordsRE)?.join("");
      if (match) {
        let stars = "",
          i = match.length;
        while (i != 0) {
          i--;
          stars += "*";
        }
        return word.replace(match, stars);
      }
      return word;
    } catch (error) {
      console.log(error);
      return word;
    }
  }
}
