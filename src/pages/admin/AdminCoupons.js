import { useEffect, useState, useRef } from "react";
import axios from "axios";
import CouponsModal from "../../components/CouponsModal";
import DeleteModal from "../../components/DeleteModal";
import Pagination from "../../components/Pagination";
import { Modal } from "bootstrap";

function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [pagination, setPagination] = useState({});
  //
  const couponModal = useRef(null);
  const deleteModal = useRef(null);

  //
  const [type, setType] = useState("create");
  const [tempCoupon, setTempCoupon] = useState({});
  //

  useEffect(() => {
    couponModal.current = new Modal("#productModal", { backdrop: "static" });
    // getProducts();
    deleteModal.current = new Modal("#deleteModal", { backdrop: "static" });
    //  getProducts();
  }, []);
  //
  const getCoupons = async (page = 1) => {
    (async () => {
      const res = await axios.get(
        `/v2/api/${process.env.REACT_APP_API_PATH}/admin/coupons?page=${page}`
      );
      console.log(res);
      setCoupons(res.data.coupons);
      setPagination(res.data.pagination);
    })();
  };

  //
  const openCouponModal = (type, item) => {
    setType(type);
    setTempCoupon(item);
    couponModal.current.show();
  };
  const closeModal = () => {
    couponModal.current.hide();
  };
  //
  const deleteCoupon = async (id) => {
    try {
      const res = await axios.delete(
        `/v2/api/${process.env.REACT_APP_API_PATH}/admin/coupon/${id}`
      );
      console.log(res);

      //
      if (res.data.success) {
        getCoupons();
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
    setTempCoupon(product);
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
        text={tempCoupon.title}
        handleDelete={deleteCoupon}
        id={tempCoupon.id}
      />
      <CouponsModal
        closeModal={closeModal}
        getCoupons={getCoupons}
        tempCoupon={tempCoupon}
        type={type}
      />
      <h3>優惠卷列表</h3>
      <hr />
      <div className="text-end">
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={() => openCouponModal("create", {})}
        >
          建立新優惠卷
        </button>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">標題</th>
            <th scope="col">折扣</th>
            <th scope="col">到期日</th>
            <th scope="col">優惠碼</th>
            <th scope="col">啟用狀態</th>
            <th scope="col">編輯</th>
          </tr>
        </thead>
        <tbody>
          {coupons.map((product) => {
            return (
              <tr key={product.id}>
                <td>{product.title}</td>
                <td>{product.percent}</td>
                <td>{new Date(product.due_date).toDateString()}</td>
                <td>{product.code}</td>
                <td>{product.is_enabled ? "啟用" : "未啟用"}</td>
                <td>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => openCouponModal("edit", product)}
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
      <Pagination pagination={pagination} changePage={getCoupons} />
    </div>
  );
}

export default AdminCoupons;
