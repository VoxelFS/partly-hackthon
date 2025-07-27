import {createPartFromUri, createUserContent, GoogleGenAI} from "@google/genai";

const prompt =`
Describe whether or not parts of the car are damaged, being very harsh. The left and right directions should be from the point of view of someone sitting in the car. Rate each part as "As new", A, B, C, and "Unsalvageable". Use the provided JSON of car parts below. Return the exact same JSON with the field name "grade" corresponding to the part rating. If the part is not in the image, or the part is not clearly visible, set the grade as null.

Part JSON:
[
  {
    "name": "Mid Cut",
    "image": "images/mid_cut.jpg",
    "parts": [
      {
        "name": "Door Mirrors",
        "image": "images/door_mirrors.jpg",
        "parts": [
          {
            "name": "Door Mirror, Left",
            "image": "images/door_mirror_left.jpg",
            "parts": []
          },
          {
            "name": "Door Mirror, Right",
            "image": "images/door_mirror_right.jpg",
            "parts": []
          }
        ]
      },
      {
        "name": "Front Doors",
        "image": "images/front_doors.jpg",
        "parts": [
          {
            "name": "Door, Front Left",
            "image": "images/door_front_left.jpg",
            "parts": []
          },
          {
            "name": "Door, Front Right",
            "image": "images/door_front_right.jpg",
            "parts": []
          }
        ]
      },
      {
        "name": "Rear Doors",
        "image": "images/rear_doors.jpg",
        "parts": [
          {
            "name": "Door, Rear Left",
            "image": "images/door_rear_left.jpg",
            "parts": []
          },
          {
            "name": "Door, Rear Right",
            "image": "images/door_rear_right.jpg",
            "parts": []
          }
        ]
      }
    ]
  },
  {
    "name": "Front Cut",
    "image": "images/front_cut.jpg",
    "parts": [
      {
        "name": "Headlights",
        "image": "images/headlights.jpg",
        "parts": [
          {
            "name": "Headlight, Left",
            "image": "images/headlight_left.jpg",
            "parts": []
          },
          {
            "name": "Headlight, Right",
            "image": "images/headlight_right.jpg",
            "parts": []
          }
        ]
      },
      {
        "name": "Front Bumper",
        "image": "images/front_bumper.jpg",
        "parts": []
      },
      {
        "name": "Hood",
        "image": "images/hood.jpg",
        "parts": []
      },
      {
        "name": "Front Fenders",
        "image": "images/front_fenders.jpg",
        "parts": [
          {
            "name": "Fender, Left",
            "image": "images/fender_left.jpg",
            "parts": []
          },
          {
            "name": "Fender, Right",
            "image": "images/fender_right.jpg",
            "parts": []
          }
        ]
      }
    ]
  }
]
`

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

export default async function analyzeImageWithGemini(filePath: string) {
    const myfile = await ai.files.upload({
        file: filePath,
        config: { mimeType: "image/jpeg" },
    });

    const result = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: createUserContent([
            createPartFromUri(myfile.uri || "", myfile.mimeType || ""),
            prompt
        ]),
    });

    return result.text;
}