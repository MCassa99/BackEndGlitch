import { Router } from 'express';
import { CartManager } from '../config/cartManager.js';

const cartManager = new CartManager('./src/data/cart.json');
const cartRouter = Router();

//Validar el estado de la respuesta y devolver un mensaje
function validateStatus(status, msg) {
    const errorsvalues = {
        200: `Producto ${msg} con exito`,
        404: 'El producto no existe',
        400: `Error en los ${msg} ingresados`,
        500: `Error interno del servidor al ${msg} el producto`,
    }
    return errorsvalues[status];
}

//Listar todos los productos
cartRouter.get('/', async (req, res) => {
    try {
        const cart = await cartManager.getCart();
        return res.status(200).send(cart);
    } catch (error) {
        return res.status(500).send('Error interno del servidor al mostrar el carrito');
    }
});

//Agregar un producto al carrito
cartRouter.post('/:id', async (req, res) => {
    try {
        const productID = req.params.id;
        const quantity = req.body.quantity;
        const status = await cartManager.addProductToCart(productID, quantity);
        return res.status(status).send(validateStatus(status, 'agregado'));
    } catch (error) {
        return res.status(500).send('Error interno del servidor al agregar el producto');
    }
});

//SE AGREGARON A PARTE DE LO PEDIDO ESTOS 2 ENDPOINTS
//Eliminar un producto del carrito
cartRouter.delete('/:id', async (req, res) => {
    try {
        const productID = req.params.id;
        const status = await cartManager.deleteProductFromCart(productID);
        return res.status(status).send(validateStatus(status, 'eliminado'));
    } catch (error) {
        return res.status(500).send('Error interno del servidor al eliminar el producto');
    }
});

//Vaciar carrito
cartRouter.delete('/', async (req, res) => {
    try {
        const status = await cartManager.deleteCart();
        return res.status(status).send(validateStatus(status, 'vaciar'));
    } catch (error) {
        return res.status(500).send('Error interno del servidor al vaciar el carrito');
    }
});


export default cartRouter;