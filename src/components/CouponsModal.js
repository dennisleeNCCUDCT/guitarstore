import axios from "axios";
import { useEffect, useState } from "react";

function CouponsModal({ closeModal, getCoupons, type, tempCoupon }) {
  const [tempData, setTempData] = useState({
    title: "超級特惠價格",
    is_enabled: 1,
    percent: 80,
    due_date: 1555459200,
    code: "testCode",
  });
  //
  const [date, setDate] = useState(new Date());

  //
  useEffect(() => {
    console.log("type=" + type);
    if (type === "create") {
      setTempData({
        title: "超級特惠價格",
        is_enabled: 1,
        percent: 80,
        due_date: 1555459200,
        code: "testCode",
      });
      setDate(new Date());
    } else if (type === "edit") {
      setTempData(tempCoupon);
      setDate(new Date(tempCoupon.due_date));
    }
  }, [type, tempCoupon]);

  //
  const handleChange = (e) => {
    const { value, name } = e.target;
    if (["price", "origin_price"].includes(name)) {
      setTempData({ ...tempData, [name]: Number(value) });
    } else if (name === "is_enabled") {
      setTempData({ ...tempData, [name]: +e.target.checked });
    } else {
      setTempData({ ...tempData, [name]: value });
    }
  };
  //
  const submit = async () => {
    try {
      let api = `/v2/api/${process.env.REACT_APP_API_PATH}/admin/coupon`;
      let method = "post";
      if (type === "edit") {
        api = `/v2/api/${process.env.REACT_APP_API_PATH}/admin/coupon/${tempCoupon.id}`;
        method = "put";
      }
      const res = await axios[method](api, {
        data: { ...tempData, due_date: date.getTime() },
      });

      alert("加入/修改產品成功！");
      closeModal();
      getCoupons();
    } catch (error) {
      console.log(error);
    }
  };
  //
  return (
    <div
      className="modal fade"
      tabIndex="-1"
      id="productModal"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="exampleModalLabel">
              {type === "create" ? "建立新優惠卷" : `編輯${tempData.title}`}
            </h1>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={closeModal}
            />
          </div>
          <div className="modal-body">
            <div className="row">
              <div className="col-sm-4"></div>
              <div className="col-sm-8"></div>
              <div className="mb-2">
                <label className="w-100" htmlFor="title" value={tempData.title}>
                  標題
                  <input
                    type="text"
                    id="title"
                    placeholder="請輸入標題"
                    name="title"
                    className="form-control mt-1"
                  />
                </label>
              </div>
              <div className="row">
                <div className="col-md-6 mb-2">
                  <label className="w-100" htmlFor="percent">
                    折扣（%）
                    <input
                      type="text"
                      name="percent"
                      id="percent"
                      placeholder="請輸入折扣（%）"
                      className="form-control mt-1"
                      value={tempData.percent}
                      onChange={handleChange}
                    />
                  </label>
                </div>
                <div className="col-md-6 mb-2">
                  <label
                    className="w-100"
                    htmlFor="due_date"
                    //
                    value={`${date.getFullYear().toString()}-${(
                      date.getMonth() + 1
                    )
                      .toString()
                      .padStart(2, 0)}-${date
                      .getDate()
                      .toString()
                      .padStart(2, 0)}`}
                    //
                    onChange={(e) => {
                      setDate(new Date(e.target.value));
                    }}
                  >
                    到期日
                    <input
                      type="date"
                      id="due_date"
                      name="due_date"
                      placeholder="請輸入到期日"
                      className="form-control mt-1"
                      //
                    />
                  </label>
                </div>
                <div className="col-md-6 mb-2">
                  <label className="w-100" htmlFor="code">
                    優惠碼
                    <input
                      type="text"
                      id="code"
                      name="code"
                      placeholder="請輸入優惠碼"
                      className="form-control mt-1"
                      value={tempData.code}
                      onChange={handleChange}
                    />
                  </label>
                </div>
              </div>
              <label className="form-check-label" htmlFor="is_enabled">
                <input
                  className="form-check-input me-2"
                  type="checkbox"
                  id="is_enabled"
                  name="is_enabled"
                  value={tempData.is_enabled}
                  onChange={handleChange}
                />
                是否啟用
              </label>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={closeModal}
              >
                關閉
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={submit}
              >
                儲存
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CouponsModal;
