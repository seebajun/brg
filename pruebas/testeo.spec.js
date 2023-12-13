const request = require("supertest");
const server = require("../index");

describe("Pruebas lógicas de Endpoints", () => {
  it("POST /vender agregar un producto", async () => {
    const testProducto = {
      titulo: "Nuevo Producto 2",
      formato: "Digital",
      imagen: "url_de_la_imagen",
      precio: 2000,
    };
    console.log(server);
    const response = await request(server).post("/vender").send(testProducto);
    expect(response.status).toBe(201);
  });

  it("GET /producto:titulo consultar un producto existente", async () => {
    const productoExistente = {
      titulo: "ProductoExistente",
      formato: "Digital",
      imagen: "url_de_la_imagen",
      precio: 2000,
    };
    await request(server).post("/vender").send(productoExistente);
    const response = await request(server).get(`/producto/${productoExistente.titulo}`);
    expect(response.status).toBe(200);
  });
});
