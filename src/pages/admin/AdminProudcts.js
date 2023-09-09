import { useEffect, useState, useRef } from "react";
import axios from "axios";
import ProductModal from "../../components/ProductModal";
import DeleteModal from "../../components/DeleteModal";
import Pagination from "../../components/Pagination";
import { Modal } from "bootstrap";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({});
  //
  const productModal = useRef(null);
  const deleteModal = useRef(null);

  //
  const [type, setType] = useState("create");
  const [tempProduct, setTempProduct] = useState({});
  //

  useEffect(() => {
    productModal.current = new Modal("#productModal", { backdrop: "static" });
    // getProducts();
    deleteModal.current = new Modal("#deleteModal", { backdrop: "static" });
    //  getProducts();
  }, []);
  //
  const getProducts = async (page = 1) => {
    (async () => {
      const productRes = await axios.get(
        `/v2/api/${process.env.REACT_APP_API_PATH}/admin/products?page=${page}`
      );
      console.log(productRes);
      setProducts(productRes.data.products);
      setPagination(productRes.data.pagination);
    })();
  };

  //
  const openProductModal = (type, product) => {
    setType(type);
    setTempProduct(product);
    productModal.current.show();
  };
  const closeProductModal = () => {
    productModal.current.hide();
  };
  //
  const deleteProduct = async (id) => {
    try {
      const res = await axios.delete(
        `/v2/api/${process.env.REACT_APP_API_PATH}/admin/product/${id}`
      );
      console.log(res);

      //
      if (res.data.success) {
        getProducts();
        alert("刪除產品成功！");
        deleteModal.current.hide();
      } else {
        alert(res.data.success);
      }
      //
    } catch (error) {}
  };
  //
  //
  const opendeleteProductModal = (product) => {
    //setType(type);
    setTempProduct(product);
    deleteModal.current.show();
  };
  const closedeleteModal = () => {
    deleteModal.current.hide();
  };
  //
  return (
    <div className="p-3">
      <DeleteModal
        close={closedeleteModal}
        text={tempProduct.title}
        handleDelete={deleteProduct}
        id={tempProduct.id}
      />
      <ProductModal
        closeProductModal={closeProductModal}
        getProducts={getProducts}
        tempProduct={tempProduct}
        type={type}
      />
      <h3>產品列表</h3>
      <hr />
      <div className="text-end">
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={() => openProductModal("create", {})}
        >
          建立新商品
        </button>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">分類</th>
            <th scope="col">名稱</th>
            <th scope="col">售價</th>
            <th scope="col">啟用狀態</th>
            <th scope="col">編輯</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            return (
              <tr key={product.id}>
                <td>{product.category}</td>
                <td>{product.title}</td>
                <td>{product.price}</td>
                <td>{product.is_enabled ? "啟用" : "未啟用"}</td>
                <td>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => openProductModal("edit", product)}
                  >
                    編輯
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm ms-2"
                    onClick={() => opendeleteProductModal(product)}
                  >
                    刪除
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <Pagination pagination={pagination} changePage={getProducts} />
    </div>
  );
}

export default AdminProducts;
