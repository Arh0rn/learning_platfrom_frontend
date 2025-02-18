// /**
//  * "Radical" approach:
//  *
//  * 1) Split the string into lines on real newlines.
//  * 2) For each line:
//  *    - Find leading spaces/tabs.
//  *    - Convert every group of 4 spaces -> "\t", every actual tab -> "\t".
//  * 3) Rejoin lines with literal "\n".
//  * 4) (Optional) Escape double quotes if your server needs that.
//  *
//  * Example:
//  *   If the user typed:
//  *       (4 spaces)import (
//  *           "fmt"
//  *       )
//  *   Then we produce:
//  *       "\\timport (\\n\\t\\t\"fmt\"\\n)\\n"
//  *   so your final JSON has literal double backslashes.
//  */
// export function encodeCodeForRequest(source) {
//     // Split on real newlines
//     const lines = source.split("\n");

//     const transformedLines = lines.map((line) => {
//         // 1) Extract leading whitespace
//         const match = line.match(/^(\s*)/);
//         const leadingWS = match ? match[1] : "";
//         const remainder = line.slice(leadingWS.length);

//         let leadingResult = "";
//         let i = 0;

//         // 2) Walk through the leading whitespace
//         while (i < leadingWS.length) {
//             // If we see a group of 4 spaces, turn it into literal "\t"
//             if (
//                 i + 4 <= leadingWS.length &&
//                 leadingWS.slice(i, i + 4) === "   " // 4 spaces
//             ) {
//                 leadingResult += "\\t"; // literal backslash-t
//                 i += 4;
//             }
//             // If it's an actual tab character
//             else if (leadingWS[i] === "\t") {
//                 leadingResult += "\\t";
//                 i += 1;
//             }
//             // Otherwise, keep the whitespace as-is (e.g. single space)
//             else {
//                 leadingResult += leadingWS[i];
//                 i += 1;
//             }
//         }

//         // 3) Rebuild the line => leading + remainder
//         return leadingResult + remainder;
//     });

//     // 4) Join lines with literal "\n"
//     let finalString = transformedLines.join("\n");

//     // 5) (Optional) If you need to escape quotes:
//     // finalString = finalString.replace(/"/g, '\\"');

//     return finalString;
// }
