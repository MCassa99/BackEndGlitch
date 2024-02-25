import { Router } from "express";
import { ProductManager } from '../config/productManager.js';

const productManager = new ProductManager('./src/data/products.json');
const productRouter = Router();

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
productRouter.get('/', async (req, res) => {
    try {
        const { limit } = req.query;
        const products = await productManager.getProducts();
        // Consulto si hay un limite en la cantidad de productos a mostrar
        if (limit) {
            if (parseInt(limit) && parseInt(limit) > 0)
                // Deberia devolver 'Listado de productos: ' + products.slice(0, limit)
                res.send(products.slice(0, limit));
            else
                res.status(400).send(validateStatus(400, 'limites'))
        } else 
            // Deberia devolver 'Listado de productos: ' + products
            /*El metodo slice() devuelve una copia de una parte del array dentro de un nuevo 
                array empezando por inicio hasta fin(para que se formatee nuevamente el array de productos)*/
                res.status(200).render('templates/home', {
                    mostrarProductos: true,
                    productos: products,
                    css: 'home.css'
                });
    } catch (error) {
        res.status(500).render('templates/error', {
            error: error,
            productos: products,
            css: 'error.css'
        });
    }
})

//Buscar un producto por ID
productRouter.get('/:id', async (req, res) => {
    try {
        const idProuducto = req.params.id;
        const product = await productManager.getProductById(idProuducto);
        if (product)
            // Deberia devolver 'Producto solicitado con id: ' + idProuducto + '\nEs: ' + product
            res.status(200).send(product);
        else
            res.status(404).send(validateStatus(404, ''));
    } catch (error) {
        res.status(500).send(validateStatus(500, 'buscar') + error);
    }
})

//Agregar un producto
productRouter.post('/', async (req, res) => {
    try {
        const product = req.body;
        const status = await productManager.addProduct(product);
        //Simplificar el mensaje de error
        res.status(status).send(validateStatus(status, 'creados'));
    } catch (error) {
        res.status(500).send(validateStatus(500, 'crear') + error);
    }
})

//Modificar un producto
productRouter.put('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updateProduct = req.body;
        const status = await productManager.modifyProduct(id, updateProduct);
        //Simplificar el mensaje de error
        res.status(status).send(validateStatus(status, 'modificado'));
    } catch (error) {
        res.status(500).send(validateStatus(500, 'modificar') + error);
    }
})

//Eliminar un producto
productRouter.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const status = await productManager.deleteProduct(id);
        //Simplificar el mensaje de error
        res.status(status).send(validateStatus(status, 'eliminado'));
    } catch (error) {
        res.status(500).send(validateStatus(500, 'eliminar') + error);
    }
})

export default productRouter;