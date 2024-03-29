import React, { Component } from 'react'

import Aux from '../../hoc/Aux'
import Burger from '../../components/Burger/Burger'
import BuildControls from '../../components/Burger/BuildControls/BuildControls'
import Modal from '../../components/UI/Modal/Modal'
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary'
import axios from '../../axios-orders'
import Spinner from '../../components/UI/Spinner/Spinner'

const INGREDIENT_PRICES = {
	salad: 0.5,
	cheese: 0.4,
	meat: 1.3,
	bacon: 0.7,
}

class BurgerBuilder extends Component {
	state = {
		ingredients: {
			salad: 0,
			bacon: 0,
			cheese: 0,
			meat: 0,
		},
		totalPrice: 4,
		purchasable: false,
		purchasing: false,
		loading: false,
	}

	updatePurchaseState(ingredients) {
		if (
			ingredients.salad !== 0 ||
			ingredients.bacon !== 0 ||
			ingredients.cheese !== 0 ||
			ingredients.meat !== 0
		)
			this.setState({ purchasable: true })
		else this.setState({ purchasable: false })
	}

	addIngredientHandler = (type) => {
		const oldCount = this.state.ingredients[type]
		const updatedCount = oldCount + 1
		const updatedIngredients = { ...this.state.ingredients }
		updatedIngredients[type] = updatedCount

		const priceAddition = INGREDIENT_PRICES[type]
		const oldPrice = this.state.totalPrice
		const newPrice = oldPrice + priceAddition

		this.updatePurchaseState(updatedIngredients)
		this.setState({ totalPrice: newPrice, ingredients: updatedIngredients })
	}

	removeIngredientHandler = (type) => {
		const oldCount = this.state.ingredients[type]

		if (oldCount <= 0) return
		const updatedCount = oldCount - 1
		const updatedIngredients = { ...this.state.ingredients }
		updatedIngredients[type] = updatedCount

		const priceDeduction = INGREDIENT_PRICES[type]
		const oldPrice = this.state.totalPrice
		const newPrice = oldPrice - priceDeduction

		this.updatePurchaseState(updatedIngredients)
		this.setState({ totalPrice: newPrice, ingredients: updatedIngredients })
	}

	purchaseHandler = () => {
		this.setState({ purchasing: true })
	}

	purchaseCancelHandler = () => {
		this.setState({ purchasing: false })
	}

	purchaseContinueHandler = () => {
		const order = {
			ingredients: this.state.ingredients,
			price: this.state.price,
			customer: {
				name: 'Mubeen',
				address: {
					street: 'Tower street',
					zipCode: '333455',
					country: 'PK',
				},
				email: 'mrjazib1@gmail.com',
			},
			deliveryMethod: 'fastest',
		}

		this.setState({ loading: true })

		axios
			.post('/orders.json', order)
			.then((response) => {
				console.log(response)
				this.setState({ loading: false, purchasing: false })
			})
			.catch((error) => {
				console.log(error)
				this.setState({ loading: false, purchasing: false })
			})
	}

	render() {
		const disabledInfo = {
			...this.state.ingredients,
		}
		for (let key in disabledInfo) disabledInfo[key] = disabledInfo[key] <= 0

		let orderSummary = (
			<OrderSummary
				ingredients={this.state.ingredients}
				purchaseCanceled={this.purchaseCancelHandler}
				purchaseContinued={this.purchaseContinueHandler}
				totalPrice={this.state.totalPrice}
			/>
		)

		if (this.state.loading) {
			orderSummary = <Spinner />
		}

		return (
			<Aux>
				<Modal
					show={this.state.purchasing}
					modalClosed={this.purchaseCancelHandler}
				>
					{orderSummary}
				</Modal>
				<Burger ingredients={this.state.ingredients} />
				<BuildControls
					ingredientAdded={this.addIngredientHandler}
					ingredientRemoved={this.removeIngredientHandler}
					disabled={disabledInfo}
					price={this.state.totalPrice}
					purchasable={this.state.purchasable}
					ordered={this.purchaseHandler}
				/>
			</Aux>
		)
	}
}

export default BurgerBuilder
