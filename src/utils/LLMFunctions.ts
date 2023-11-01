/**
 * LLM Function definitions in this file follow the standard JSON Schema, documented here:
 * https://json-schema.org/understanding-json-schema/reference.
 *
 * The JSON Schema is implemented by Open AI's funciton call API, documented here:
 * https://platform.openai.com/docs/guides/gpt/function-calling
 */

export type Ingredient = {
  ingredientName: string;
  amount: number;
  unit: string;
};

/**
 * saveUnformattedIngredientsList accepts an object with a single parameter, unformattedIngredients, an array
 * of unformatted ingredients of type string
 */
export const saveUnformattedIngredientsListDef = {
  name: "saveUnformattedIngredientsList",
  parameters: {
    type: "object",
    properties: {
      unformattedIngredients: {
        type: "array",
        items: {
          type: "string",
          description: "A single row from the raw ingredients",
        },
        description: "A list of unformatted ingredients.",
      },
    },
    required: ["unformattedIngredients"],
  },
};

/**
 * saveIngredientsList accepts an object with a single parameter, formattedIngredients, an array
 * of formatted ingredients of type Ingredient
 */
export const saveFormattedIngredientsListDef = {
  name: "saveFormattedIngredientsList",
  parameters: {
    type: "object",
    properties: {
      formattedIngredients: {
        type: "array",
        items: {
          type: "object",
          properties: {
            ingredientName: {
              type: "string",
              description: "The name of the ingredient.",
            },
            amount: {
              type: "number",
              description: "The amount of the ingredient.",
            },
            unit: {
              type: "string",
              description: "Unit of measurement.",
            },
          },
          required: ["amount", "ingredientName", "unit"],
        },
        description: "A list of formatted ingredients.",
      },
    },
    required: ["formattedIngredients"],
  },
};

// TODO
export const saveUnformattedIngredientsList = (args: string) => {
  try {
    const jsonArgs = JSON.parse(args);
    console.log("RAW:", jsonArgs);
    const { unformattedIngredients } = jsonArgs;
    console.log("UNFORMATTED:", unformattedIngredients);
  } catch (err) {
    console.error(err);
  }
};

// TODO
export const saveFormattedIngredientsList = (args: string) => {
  try {
    const jsonArgs = JSON.parse(args);
    console.log("RAW:", jsonArgs);
    const { formattedIngredients } = jsonArgs;
    console.log("FORMATTED:", formattedIngredients);
  } catch (err) {
    console.error(err);
  }
};

export const functionDefinitions = [
  saveUnformattedIngredientsListDef,
  saveFormattedIngredientsListDef,
];

export const availableFunctions: Record<string, (obj: any) => void> = {
  saveUnformattedIngredientsList,
  saveFormattedIngredientsList,
};
