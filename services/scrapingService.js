const Recipe = require("../models/recipeModel");
const puppeteer = require("puppeteer");

exports.scrapeDataFromUrl = async (url) => {
  const data = await getDataFromWebPage(url);
  try {
    const newRecipe = await Recipe.create(data);
    //const newRecipe = Recipe(data);
    console.log("Receta creada");
    console.log("Scrapeado finalizado sin errores");
    return newRecipe;
  } catch (err) {
    console.error("Error al crear la receta:", err);
    return { error: "Error al crear la receta" };
  };
};

async function getDataFromWebPage(url) {
  const browser = await puppeteer.launch({ headless: true, slowMo: 0 });
  const page = await browser.newPage();

  await page.setExtraHTTPHeaders({
    "user-agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
    "upgrade-insecure-requests": "1",
    accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
  });

  await page.goto(url);

  const data = await page.evaluate(() => {
    const title = document.querySelector("h1").innerText;
    const metaTagsImage = Array.from(
      document.querySelectorAll("meta[property='og:image']")
    );
    const imagen =
      metaTagsImage.length > 0
        ? metaTagsImage[0].getAttribute("content")
        : null;
    const metaTagsUrl = Array.from(
      document.querySelectorAll("meta[property='og:url']")
    );
    const uri =
      metaTagsUrl.length > 0 ? metaTagsUrl[0].getAttribute("content") : null;

    const recipeDataElement = document.querySelector(".recipe_data");
    const difficulty = recipeDataElement.querySelector("span:nth-child(1)").innerText.trim();
    const portions = recipeDataElement
      .querySelector("span:nth-child(2)")
      .innerText.replace(/\n/g, " ")
      .trim();

    const prepTimeElement =
      recipeDataElement.querySelector("span:nth-child(3)");
    const prepTime = prepTimeElement
      ? prepTimeElement.innerText.replace(/\n/g, " ").trim()
      : "0 min.";

    const cookTimeElement =
      recipeDataElement.querySelector("span:nth-child(4)");
    const cookTime = cookTimeElement
      ? cookTimeElement.innerText.replace(/\n/g, " ").trim()
      : "0 min.";

    const specialNeedsElement = document.querySelector(
      ".special_needs_container"
    );
    const specialNeeds = specialNeedsElement
      ? Array.from(specialNeedsElement.querySelectorAll("span")).map(
          (span) => span.innerText
        )
      : [];

    const nutritionalInfoElement = document.querySelector(".nutrition_content");
    const totalKcal =
      nutritionalInfoElement.querySelector(".kcal_ration span").innerText;
    const fatsData = Array.from(
      nutritionalInfoElement.querySelectorAll(".fats td")
    ).map((td) => td.innerText);
    const carbohydratesData = Array.from(nutritionalInfoElement.querySelectorAll(".hydrates td")).map(td => td.innerText);
    const proteinsData = Array.from(
      nutritionalInfoElement.querySelectorAll(".proteins td")
    ).map((td) => td.innerText);

    const additionalInfoElement = document.querySelector(".nutrition_data");
    const sugars =
      additionalInfoElement.querySelector("td:nth-child(2)").innerText;
    const fiber = additionalInfoElement.querySelector(
      "tr:nth-child(2) td:nth-child(2)"
    ).innerText;
    const saturatedFats = additionalInfoElement.querySelector(
      "tr:nth-child(3) td:nth-child(2)"
    ).innerText;
    const salt = additionalInfoElement.querySelector(
      "tr:nth-child(4) td:nth-child(2)"
    ).innerText;

    const recipeIngredientsElement = document.querySelector(
      ".dropdown_content.ingredients"
    );
    const recipeIngredients = recipeIngredientsElement
      ? Array.from(recipeIngredientsElement.querySelectorAll("ul li")).map(
          (li) => li.innerText
        )
      : [];

    const keywordsMeta = document
      .querySelector("meta[name='keywords']")
      .getAttribute("content");
    const tags = keywordsMeta.split(",").map((keyword) => keyword.trim());

    const recipeInstructionsElement = document.querySelector(
      ".dropdown_content.elaboration_text"
    );
    const directions = recipeInstructionsElement
      ? Array.from(recipeInstructionsElement.querySelectorAll("p")).map(
          (p) => p.innerText
        )
      : [];

    const portionByAgeElement = document.querySelector(".dishes_container");
    const adultPortion =
      portionByAgeElement.querySelector(".adult p.text").innerText;
    const threeToEightPortion =
      portionByAgeElement.querySelector(".child p.text").innerText;
    const nineToTwelvePortion =
      portionByAgeElement.querySelector(".preteen p.text").innerText;
    const teenPortion =
      portionByAgeElement.querySelector(".teen p.text").innerText;

      let chefTips = '';
      try {
          const chefTipElement = document.querySelector(".chef_trick > span").nextSibling;
          if (chefTipElement) {
              chefTips = chefTipElement.textContent.trim();
          }
      } catch (error) {
          console.error("Error al scrapear la receta:", error);
      }
      
      

    return {
      title,
      uri,
      image: imagen,
      recipeData: {
        difficulty,
        yield: portions,
        preparationTime: prepTime,
        cockingTime: cookTime,
      },
      specialNeeds,
      nutritionalInfo: {
        totalKcal,
        fat: { kcal: fatsData[0], gr: fatsData[1], porcentage: fatsData[2] },
        carbohydrates: {
          kcal: carbohydratesData[0],
          gr: carbohydratesData[1],
          porcentage: carbohydratesData[2],
        },
        protein: {
          kcal: proteinsData[0],
          gr: proteinsData[1],
          porcentage: proteinsData[2],
        },
        additionalInfo: { sugars, fiber, saturatedFats, salt },
      },
      yieldPerAge: {
        adult: adultPortion,
        threeToEight: threeToEightPortion,
        nineToTwelve: nineToTwelvePortion,
        teen: teenPortion,
      },
      ingredientLines: recipeIngredients,
      directions,
      chefTips,
      tags,
    };
  });
  await browser.close();
  return data;
}
