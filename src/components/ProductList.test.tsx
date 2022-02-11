import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ProductList from './ProductList'

describe('ProductList component', () => {

    it('renders without crashing', () => {
        render( <ProductList /> )
    })

    it('shows at least 6 products', () => {
        render( <ProductList /> )

        const products = screen.getAllByRole('listitem')
        expect(products.length).toBeGreaterThanOrEqual(6)
    })

    it('adds product to cart', () => {
        render( <ProductList /> )

        // Simulate a user adding a product to cart, then opening the cart
        const [buyButton] = screen.getAllByText(/Add to Cart/)
        fireEvent.click(buyButton)
        const [cartButton] = screen.getAllByText('Cart')
        fireEvent.click(cartButton)

        // Check if there's 1 product in cart
        const products = screen.getAllByRole('listitem')
        expect(products).toHaveLength(1)
    })

    it('adds more of the same product to cart', () => {
        render( <ProductList /> )

        const [cartButton] = screen.getAllByText('Cart')
        fireEvent.click(cartButton)

        // Click the add product button twice, for a total of 3 products
        const addButton = screen.getByText('+')
        fireEvent.click(addButton)
        fireEvent.click(addButton)

        // Check if the product now says 3 x
        const product = screen.getByText(/3 x/)
        expect(product).toBeInTheDocument()
    })

    it('reduces amount of the same product in cart', () => {
        render( <ProductList /> )

        const [cartButton] = screen.getAllByText('Cart')
        fireEvent.click(cartButton)

        // Remove one product
        const addButton = screen.getByText('-')
        fireEvent.click(addButton)

        // Check if the product now says 2 x
        const product = screen.getByText(/2 x/)
        expect(product).toBeInTheDocument()
    })

    it('removes product from cart', () => {
        render( <ProductList /> )

        const [cartButton] = screen.getAllByText('Cart')
        fireEvent.click(cartButton)

        const deleteButton = screen.getByText('X')
        fireEvent.click(deleteButton)

        const products = screen.queryAllByRole('listitem')
        expect(products).toHaveLength(0)
    })

    it('renders the search bar', () => {
        render( <ProductList /> )

        const searchbar = screen.getByTestId('search-input')
        expect(searchbar).toBeInTheDocument()
        expect(searchbar).toHaveAttribute("type", "text")
    })

    it('filters products after search', () => {
        render( <ProductList /> )

        const searchbar = screen.getByTestId('search-input')
        userEvent.type(searchbar, "squirrel")

        const products = screen.getAllByRole('listitem')
        expect(products).toHaveLength(1)
    })

    it('informs the user if the username is incorrect', () => {
        render( <ProductList /> )

        const signinNavButton = screen.getByText('Sign In')
        fireEvent.click(signinNavButton)

        const userInput = screen.getByTestId('username-input')
        userEvent.type(userInput, "wronguser")

        const pwInput = screen.getByTestId('password-input')
        userEvent.type(pwInput, "wrongpw")

        const loginButton = screen.getByRole('button', { name: 'Log in'})
        fireEvent.click(loginButton)

        const errorMsg = screen.getByText('That username does not exist.')
        expect(errorMsg).toBeInTheDocument()
    })

    it('informs the user if the password is incorrect', () => {
        render( <ProductList /> )

        const signinNavButton = screen.getByText('Sign In')
        fireEvent.click(signinNavButton)

        const userInput = screen.getByTestId('username-input')
        userEvent.type(userInput, "user")

        const pwInput = screen.getByTestId('password-input')
        userEvent.type(pwInput, "wrongpw")

        const loginButton = screen.getByRole('button', { name: 'Log in'})
        fireEvent.click(loginButton)

        const errorMsg = screen.getByText('Password does not match username.')
        expect(errorMsg).toBeInTheDocument()
    })

    it('renders a greeting when logged in', () => {
        render( <ProductList /> )

        const signinNavButton = screen.getByText('Sign In')
        fireEvent.click(signinNavButton)

        const userInput = screen.getByTestId('username-input')
        userEvent.type(userInput, "user")

        const pwInput = screen.getByTestId('password-input')
        userEvent.type(pwInput, "user")

        const loginButton = screen.getByRole('button', { name: 'Log in'})
        fireEvent.click(loginButton)

        const greeting = screen.getByText('Welcome, David!')
        expect(greeting).toBeInTheDocument()
    })
})