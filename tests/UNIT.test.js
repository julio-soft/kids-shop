// TEST UNITARIOS

const db = require("../src/models");
const initial = require("../src/models/init");
const {
  sell_product,
  getPageOffset,
} = require("../src/controllers/shop/helper");

beforeAll(() => {
  return db.sequelize.sync({ force: true }).then(async () => {
    await initial();
  });
});

afterAll(() => {
  return db.sequelize.close();
});

describe("UNIT TEST", () => {
  it("Product was sell successfully.", async () => {
    const sku = 1;
    const result = await sell_product(sku, 1);
    expect(result).toEqual(true);
  });

  it("Can't sell. The product is sold out!", async () => {
    const sku = 20;
    const result = await sell_product(sku, 1);
    expect(result).toEqual({ message: "Can't sell. The product is sold out!" });
  });

  it("Can't sell. The product does not exist !", async () => {
    const sku = 33;
    const result = await sell_product(sku, 1);
    expect(result).toHaveProperty("message");
  });

  it("Can't sell. The user does not exist !", async () => {
    const sku = 1;
    const result = await sell_product(sku, 54);
    expect(result).toHaveProperty("message");
  });

  it("Test pagination.", async () => {
    let page = 0;
    let pageSize = 10;

    let result = getPageOffset({ page, pageSize });
    expect(result.offset).toEqual(0);
    expect(result.pageSize).toEqual(10);

    result = getPageOffset({ page });
    expect(result.offset).toEqual(0);
    expect(result.pageSize).toEqual(10);

    result = getPageOffset(null);
    expect(result.offset).toEqual(0);
    expect(result.pageSize).toEqual(10);

    page = 3;
    result = getPageOffset({ page, pageSize });
    expect(result.offset).toEqual(20);
    expect(result.pageSize).toEqual(10);

    page = 3;
    pageSize = 5;
    result = getPageOffset({ page, pageSize });
    expect(result.offset).toEqual(10);
    expect(result.pageSize).toEqual(5);
  });
});
