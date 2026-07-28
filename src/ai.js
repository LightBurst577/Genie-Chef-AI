const SYSTEM_PROMPT = `
You are an assistant that receives a list of ingredients that a user has and suggests a recipe they could make with some or all of those ingredients. You don't need to use every ingredient they mention in your recipe. The recipe can include additional ingredients they didn't mention, but try not to include too many extra ingredients. Format your response in markdown to make it easier to render to a web page

WARNING NOTE:
IF IT'S A TROLL INPUT OR SOMETHING UNRELATED TO RECIPES OR INGREDIENTS, THEN OUTPUT: Haha I don't understand! PLZ ONLY RECIPES 🙏💀📃
IF SOMETHING UNREALATED TO RECIPES OR INGREDIENTS IS MENTIONED IN THE USER INPUT, THEN OUTPUT: PLZ ONLY GIVE ME RECIPES 🙏😭
IF THE INPUT WAS NOT (ingredients) or something else THEN OUTPUT: PLZ PUT INGREDIENTS 🙏😭
`;

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

const MODELS = [
  "openrouter/owl-alpha", // main primary choice
  "google/gemma-2-9b-it:free", // Backup 1
  "meta-llama/llama-3-8b-instruct:free", // Backup 2
  "mistralai/mistral-7b-instruct:free", // Backup 3
  "inclusionai/ling-3.0-flash:free", // Backup 4
  "poolside/laguna-s-2.1:free", // Backup 5
];

export async function getRecipeFromMistral(ingredientsArr) {
  const ingredientsString = ingredientsArr.join(", ");

  // Loop through each model in the list
  for (const modelName of MODELS) {
    try {
      console.log(`Attempting to generate recipe using model: ${modelName}`);

      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: modelName, // Use the current model from the loop
            messages: [
              { role: "system", content: SYSTEM_PROMPT },
              {
                role: "user",
                content: `I have ${ingredientsString}. Please give me a recipe you'd recommend I make!`,
              },
            ],
          }),
        },
      );

      // Returns a bad status trigger the catch block
      if (!response.ok) {
        throw new Error(
          `Genin has it limits! He need some rest 🙏🛏️ ISSUE CODE: ${response.status}`,
        );
      }

      const data = await response.json();

      // Double check OpenRouter didn't send a hidden internal error object inside a successful 200 response
      if (data.error) {
        throw new Error(
          `Sorry something is not working (Not your end) Error: ${data.error.message}`,
        );
      }

      // 4. Success! Return the recipe content immediately and exit the function/loop
      return data.choices[0].message.content;
    } catch (err) {
      // 5. If an error happens, log it and let the loop move to the next model automatically
      console.warn(
        `I'm sorry! I Failed to think a recipe. Try again plz...`,
        err,
      );
    }
  }

  // 6. If the loop finishes completely and ALL models failed, throw a final error
  alert("Please try again in a hour. I think I need to see a doctor  😭🍳");
  throw new Error("All backup attempts failed.");
}
