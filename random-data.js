import { faker } from '@faker-js/faker'
import fs from 'fs'

const randomCategories = (numberOfCategories) => {
	if (numberOfCategories < 1) return []
	const categories = []
	for (let i = 0; i < numberOfCategories; i++) {
		const category = {
			id: faker.string.uuid(),
			name: faker.commerce.department(),
			createdAt: Date.now(),
			updatedAt: Date.now(),
		}
		categories.push(category)
	}
	return categories
}

const randomProducts = (categories) => {
	const products = []
	categories.forEach((category) => {
		const numberOfProducts = Math.floor(Math.random() * 10 + 1)
		for (let i = 0; i < numberOfProducts; i++) {
			const product = {
				categoryId: category.id,
				id: faker.string.uuid(),
				name: faker.commerce.productName(),
				description: faker.commerce.productDescription(),
				price: faker.commerce.price(),
				createdAt: Date.now(),
				updatedAt: Date.now(),
			}
			products.push(product)
		}
	})
	return products
}

const categories = randomCategories(10)
const products = randomProducts(categories)

const data = {
	categories,
	products,
}

fs.writeFile('db.json', JSON.stringify(data), (err) => {
	if (err) throw err
	else console.log('Write data to db.json successfully')
})
