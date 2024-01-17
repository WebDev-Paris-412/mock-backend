const fs = require("fs")
const { setTimeout } = require("timers/promises")
const alphabet = ["a", "b", "c"]

const db = {
	recipes: [],
}
async function seed() {
	try {
		for (const letter of alphabet) {
			console.log("sleeping")
			await sleep(1000)
			console.log("fetching")
			const raw = await fetch(
				"https://www.themealdb.com/api/json/v1/1/search.php?f=" + letter
			)
			const res = await raw.json()
			for (const rawMeal of res.meals) {
				const meal = {
					id: Number(rawMeal.idMeal),
					name: rawMeal.strMeal,
					category: rawMeal.strCategory,
					region: rawMeal.strArea,
					instructions: rawMeal.strInstructions?.split("\n"),
					picture: rawMeal.strMealThumb,
					tags: rawMeal.strTags?.split(",") || [],
				}
				db.recipes.push(meal)
			}
		}
		fs.writeFileSync("db.json", JSON.stringify(db), "utf8")
	} catch (error) {
		console.log(error)
	}
}

function sleep(time = 500) {
	return new Promise((accept, reject) => {
		setTimeout(() => {
			console.log(time)
			accept("hhh")
		}, time)
	})
}

seed()
