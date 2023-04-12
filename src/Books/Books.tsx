/*
* This page shows all eBooks with their images
* upon redirection from login -> home -> (Books).
*/

import { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Popover from 'react-bootstrap/Popover'
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import book1 from '../images/bookPhoto-1.jpg'
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { useShoppingCart } from "../context/shoppingCartContext";

const Books = (): JSX.Element => {
    const [ebooks, setEbooks] = useState<Book[]>([]);
    const { getItemQuantity, increaseCartQuantity, decreaseCartQuantity, removeFromCart } = useShoppingCart() as any;


    const popover = (ebook: Book) => (
        <Popover id="popover-basic">
            <Popover.Header as="h3">About</Popover.Header>
            <Popover.Body>
                <strong>Author:</strong> {ebook.auth} <br />
                <strong>ISBN:</strong> {ebook.isbn} <br />
                <strong>Publication:</strong> {ebook.pub} <br />
            </Popover.Body>
        </Popover>
    )

    const fetchBooks = async () => {
        await getDocs(collection(db, 'Books'))
            .then((querySnapshot) => {
                const data = querySnapshot.docs
                    .map((doc) => ({ ...doc.data(), id: doc.id }))
                setEbooks(data as Book[])
                // console.log(data, ebooks)
            })
    }

    useEffect(() => {
        fetchBooks()
    }, [])

    //console.log(ebooks[1].title)


    return (
        <Container>
            <h1 className='pt-5' style={{ color: 'white' }}>All eBooks Available for Purchase</h1>
            <hr style={{color: 'white'}}/>
            <div className="row">
                {ebooks.map((ebook: Book) => (
                    <div key={ebook.id} className="col-md-3 mb-5">
                        <Card style={{ height: 'auto', width: '18rem' }} text="dark">
                            <Card.Img style={{ width: '17.9rem', height: '25rem' }} variant="top" src={ebook.imageN} />
                            <Card.Body>
                                <Card.Title>{ebook.title}</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">
                                    {ebook.auth}
                                    <br/>
                                    $ {parseFloat(ebook.price)}
                                </Card.Subtitle>
                                <OverlayTrigger trigger='focus' placement='bottom' overlay={popover(ebook)}>
                                    <Button variant="info"> View Details </Button>
                                </OverlayTrigger>
                                { getItemQuantity(ebook.isbn) === 0 ? (
                                    <Button className='ms-3'
                                        style={{}}
                                        variant="primary"
                                        onClick={() => {
                                            increaseCartQuantity(ebook.isbn, ebook)
                                        }}>Add to Cart</Button>
                                ) :
                                    <div className='d-flex mt-3 align-items-center flex-column' style={{ gap: ".5rem" }}>

                                        <div className='d-flex align-items-center justify-content-center' style={{ gap: ".5rem" }}>
                                            <Button variant="outline-danger" onClick={() => {
                                                decreaseCartQuantity(ebook.isbn)
                                            }}>-</Button>
                                            <div className=''>
                                                <span className="fs-3">{getItemQuantity(ebook.isbn)}</span>
                                                in cart
                                            </div>
                                            <Button variant="outline-success" onClick={() =>{ 
                                                increaseCartQuantity(ebook.isbn, ebook)
                                                }}>+</Button>

                                        </div>
                                        <Button variant="danger" size="sm" onClick={() => {
                                            removeFromCart(ebook.isbn)
                                        }}>Remove</Button>
                                    </div>
                                }
                            </Card.Body>
                        </Card>
                    </div>
                ))}
            </div>
        </Container>
    );
};

export default Books;