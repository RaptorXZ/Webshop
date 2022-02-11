import React, { useEffect, useState } from 'react';
import { Products } from '../models/Products'
import '../styling/ProductList.css'
import bluetit from '../images/bluetit.jpeg'
import greattit from '../images/greattit.jpeg'
import bullfinch from '../images/bullfinch.jpeg'
import robin from '../images/robin.jpeg'
import rabbit from '../images/rabbit.jpeg'
import squirrel from '../images/squirrel.jpeg'
import sparrow from '../images/treesparrow.jpeg'
import starling from '../images/starling.jpeg'

const data: Products[] = [
    {
        id: 'mrn54SKlp',
        image: bluetit,
        name: 'Carved Blue Tit',
        price: 225,
        inStock: 15,
        inCart: 0
    },
    {
        id: 'hjt73GUvm',
        image: greattit,
        name: 'Carved Great Tit',
        price: 250,
        inStock: 8,
        inCart: 0
    },
    {
        id: 'osd83SWdl',
        image: bullfinch,
        name: 'Carved Eurasian Bullfinch',
        price: 275,
        inStock: 12,
        inCart: 0
    },
    {
        id: 'pak29DHeu',
        image: robin,
        name: 'Carved Robin',
        price: 275,
        inStock: 14,
        inCart: 0
    },
    {
        id: 'eud48GUcj',
        image: rabbit,
        name: 'Carved Rabbit',
        price: 475,
        inStock: 1,
        inCart: 0
    },
    {
        id: 'gut19DYqk',
        image: squirrel,
        name: 'Carved Squirrel',
        price: 475,
        inStock: 2,
        inCart: 0
    },
    {
        id: 'ude31GAnb',
        image: sparrow,
        name: 'Carved European Tree Sparrow',
        price: 225,
        inStock: 18,
        inCart: 0
    },
    {
        id: 'cne05OUse',
        image: starling,
        name: 'Carved Starling',
        price: 275,
        inStock: 0,
        inCart: 0
    }
]

const cart: Products[] = []

function ProductList() {
    const [products, setProducts] = useState<Products[]>(data)
    const [cartProducts, setCartProducts] = useState<Products[]>(cart)
    const [filteredProducts, setFilteredProducts] = useState<Products[]>(data)
    const [showList, setShowList] = useState<Boolean>(true)
    const [loggedIn, setLoggedIn] = useState<Boolean>(false)
    const [showCart, setShowCart] = useState<Boolean>(false)
    const [showLogin, setShowLogin] = useState<Boolean>(false)
    const [wrongUser, setWrongUser] = useState<Boolean>(false)
    const [wrongPw, setWrongPw] = useState<Boolean>(false)

    useEffect( () => {
        let storage: [] = []
        const storedProducts = localStorage.getItem('products')
        if (storedProducts !== null) {
            storage = JSON.parse(storedProducts)
            setProducts(storage)
            setFilteredProducts(storage)
        }

        const storedCart = localStorage.getItem('cart')
        if (storedCart !== null) {
            storage = JSON.parse(storedCart)
            setCartProducts(storage)
        }

        const loggedIn = localStorage.getItem('login')
        if (loggedIn !== null) {
            setLoggedIn(true)
        }
    }, [])

    const loginNav = () => {
        if(loggedIn) {
            setLoggedIn(false)
            localStorage.removeItem('login')
        }
        else {
            setShowList(false)
            setShowCart(false)
            setShowLogin(true)
        }
    }

    const showProductList = () => {
        setShowCart(false)
        setShowLogin(false)
        setShowList(true)
        let storage: [] = []
        const productStorage = localStorage.getItem('products')
        if(productStorage !== null) {
            storage = JSON.parse(productStorage)
            setProducts(storage)
            setFilteredProducts(storage)
        } else {
            setProducts(data)
            setFilteredProducts(data)
        }
    }

    const toggleCart = () => {
        if(!showCart) {
            setShowCart(true)
            setShowLogin(false)
            setShowList(false)
        }
        else {
            setShowCart(false)
            setShowLogin(false)
            setShowList(true)
        }
    }

    const logIn = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const data = new FormData((e.target as HTMLFormElement))
        const username: string = data.get('username') as string
        const password: string = data.get('password') as string
        
        if(username !== 'user') {
            setWrongUser(true)
            setWrongPw(false)
            return
        }
        else if(password !== 'user') {
            setWrongPw(true)
            setWrongUser(false)
            return
        }
        else if(username === 'user' && password === 'user') {
            setLoggedIn(true)
            setShowLogin(false)
            setShowList(true)
            setWrongUser(false)
            setWrongPw(false)
            localStorage.setItem('login', 'true')
        }
    }

    const productSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const searchterm: string = e.target.value

        let filteredProducts: Products[] = []

        // If the input field is empty, show all products
        if (searchterm === "") {
            let storage: [] = []
            const productStorage = localStorage.getItem('products')
            if(productStorage !== null) {
                storage = JSON.parse(productStorage)
                setProducts(storage)
                setFilteredProducts(storage)
            } else {
                setProducts(data)
                setFilteredProducts(data)
            }
            return
        }
        else {
            filteredProducts = products.filter(product => {
                if(product.name.toLowerCase().includes(searchterm.toLowerCase()))
                return true
                else return false
            })
            setFilteredProducts(filteredProducts)
        }
    }

    const addProductToCart = (product: Products) => {
       // Check if amount of product in cart is less than what's available in stock
        // Also counts if product is out of stock
        if(product.inCart >= product.inStock) {
            return // Exit the function
        }

       // Check if the product is already in the cart and update it
       const found = cartProducts.find(element => element.id === product.id)
       if(found) {
            const updatedCart = cartProducts.map(p =>
                p.id === product.id
                ? { ...p, inCart: product.inCart + 1}
                : p
            )
            setCartProducts(updatedCart)
            saveCart(updatedCart)
        }
        // If the product is not in the cart, add it
        else {
            const newCartProduct = {
                id: product.id,
                name: product.name,
                image: product.image,
                price: product.price,
                inStock: product.inStock,
                inCart: 1
            }
            cartProducts.push(newCartProduct)
            saveCart(cartProducts)
        }

        // Update the product in the product list as well
        let updatedList = products.map(p =>
            p.id === product.id
            ? { ...p, inCart: product.inCart + 1}
            : p
        )
        
        setProducts(updatedList)
        saveProducts(updatedList)
        updateFilteredProducts(product.inCart + 1, product)
    }

    const removeOneFromCart = (product: Products) => {
        const found = cartProducts.find(element => element.id === product.id)
        if(found) {
            if(found.inCart > 1) {
                const updatedCart = cartProducts.map(p =>
                    p.id === found.id
                      ? { ...p, inCart: found.inCart - 1 }
                      : p
                  )
                setCartProducts(updatedCart)
                saveCart(updatedCart)

                // Update the product in the product list as well
                let updatedList = products.map(p =>
                    p.id === product.id
                    ? { ...p, inCart: product.inCart - 1}
                    : p
                )
                
                setProducts(updatedList)
                saveProducts(updatedList)
                updateFilteredProducts(product.inCart - 1, product)
            }
            else {
                removeProductFromCart(product)
            }
        }
    }

    const removeProductFromCart = (product: Products) => {
        const found = cartProducts.find(element => element.id === product.id)
        if(found) {
            const updatedCart = cartProducts.filter(element => element.id !== found.id)
            setCartProducts(updatedCart)
            saveCart(updatedCart)

            // Update the product in the product list as well
            let updatedList = products.map(p =>
                p.id === product.id
                ? { ...p, inCart: product.inCart = 0}
                : p
            )
            
            setProducts(updatedList)
            saveProducts(updatedList)
            updateFilteredProducts(0, product)
        }
    }

    const updateFilteredProducts = (value: number, product: Products) => {
        const updatedList = filteredProducts.map(p =>
            p.id === product.id
            ? { ...p, inCart: product.inCart = value}
            : p
        )
        setFilteredProducts(updatedList)
    }

    const saveCart = (cart: Products[]) => {
        localStorage.setItem('cart', JSON.stringify(cart))
    }
    const saveProducts = (items: Products[]) => {
        localStorage.setItem('products', JSON.stringify(items))
    }

    return(<div>
            <div className='nav-wrapper'>
                <button onClick={() => toggleCart()} className='nav-btn'>Cart</button>
                <button onClick={loggedIn ? () => loginNav() : () => loginNav()} className='nav-btn'>{loggedIn ? 'Sign Out' : 'Sign In'}</button>
            </div>
            <div className='search-wrapper'>
                <h2 onClick={() => showProductList()} className='title clickable'>Products</h2>
                {showList ? (
                    <div className="searchbar" >
                    <input data-testid="search-input" type="text" id="search-input" name="searchterm" placeholder="What are you looking for?" onChange={event => productSearch(event)} />
                    </div>
                ) : null}
                {loggedIn ? <h2 className='title'>Welcome, David!</h2> : null}
            </div>

            {showList ? (
                <div>
                    <ul className='product-list'>
                    {filteredProducts.map(product => (
                        <li key={product.id} className='product-item'>
                            <div className="row-spacebetween">
                                <h3>{product.name}</h3>
                                {product.inCart > 0 ? (
                                <button onClick={() => removeProductFromCart(product)} className="remove-btn">X</button>
                                ) : null}
                            </div>
                            <img src={product.image} alt={product.name} height="100px" />
                            <p>{product.price} SEK</p>
                            <span>
                                <p>{product.inStock <= 0 ? 'Out of Stock' : 'In stock: ' + product.inStock}</p>
                                {product.inCart < 1 ? (
                                <button onClick={() => addProductToCart(product)} className={product.inStock <= 0 ? 'buy-btn greyed-out-btn' : 'buy-btn'}>Add to Cart</button>
                                ) : null}
                                {product.inCart > 0 ? (
                                <span className='editcart-span'>
                                    <button onClick={() => removeOneFromCart(product)} className='editcart-btn'>-</button>
                                    <p>{product.inCart}</p>
                                    <button onClick={() => addProductToCart(product)} className={product.inCart >= product.inStock ? 'editcart-btn greyed-out-btn' : 'editcart-btn'}>+</button>
                                </span>
                                ) : null}
                            </span>
                        </li>
                    ))}
                    </ul>
                </div>
            ) : null}

            {showCart ? (
                <div>
                    <h2 className='title'>Cart</h2>
                    <ul className='product-list'>
                    {cartProducts.map(product => (
                        <li key={product.id} className='product-item'>
                            <div className="row-spacebetween">
                                <h3>{product.name}</h3>
                                <button onClick={() => removeProductFromCart(product)} className="remove-btn">X</button>
                            </div>
                            <img src={product.image} alt={product.name} height="100px" />
                            <p>{product.price * product.inCart} SEK</p>
                            <p>{product.inStock <= 0 ? 'Out of Stock' : 'In stock: ' + product.inStock}</p>
                            <span>
                                <p>{product.inCart} x {product.price} SEK</p>
                                <button onClick={() => removeOneFromCart(product)} className="editcart-btn">-</button>
                                <button onClick={() => addProductToCart(product)} className={product.inCart >= product.inStock ? 'editcart-btn greyed-out-btn' : 'editcart-btn'}>+</button>
                            </span>
                        </li>
                    ))}
                    </ul>
                </div>
            ) : null}

            {showLogin ? (
                <div className="login-wrapper">
                    <h2 className="title">Login</h2>
                    <form onSubmit={event => logIn(event)}>
                        <label htmlFor="username">{'Username: '}
                            <input data-testid="username-input" className={wrongUser ? 'error-border' : ''} type="text" placeholder="Username" name="username" autoComplete="username" required></input>
                        </label>
                        {wrongUser ? <p>That username does not exist.</p> : null}
                        <label htmlFor="password">{'Password: '}
                            <input data-testid="password-input" className={wrongPw ? 'error-border' : ''} type="password" placeholder="Password" name="password" autoComplete='current-password' required></input>
                        </label>
                        {wrongPw ? <p>Password does not match username.</p> : null}
                        <button type="submit" className="login-btn">Log in</button>
                    </form>
                </div>
            ) : null}
        </div>
        
    )
}

export default ProductList