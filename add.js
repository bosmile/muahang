/* =========================
   ADD ROW
========================= */
function addRow() {
  const tbody = document.getElementById("itemsBody");
  const tr = document.createElement("tr");

  tr.innerHTML = `
    <td><input type="text" class="name" placeholder="Tên hàng"></td>
    <td><input type="number" class="qty" value="1" min="1"></td>
    <td><input type="number" class="price" value="0" min="0"></td>
    <td class="total">0</td>
    <td>
      <button type="button" onclick="removeRow(this)">❌</button>
    </td>
  `;

  tbody.appendChild(tr);

  tr.querySelector(".qty").addEventListener("input", calcTotal);
  tr.querySelector(".price").addEventListener("input", calcTotal);

  calcTotal();
}

/* =========================
   REMOVE ROW
========================= */
function removeRow(btn) {
  btn.closest("tr").remove();
  calcTotal();
}

/* =========================
   CALCULATE TOTAL
========================= */
function calcTotal() {
  let sum = 0;

  document.querySelectorAll("#itemsBody tr").forEach(tr => {
    const qty = Number(tr.querySelector(".qty").value) || 0;
    const price = Number(tr.querySelector(".price").value) || 0;
    const total = qty * price;

    tr.querySelector(".total").innerText = total.toLocaleString();
    sum += total;
  });

  document.getElementById("grandTotal").innerText =
    sum.toLocaleString();
}

/* =========================
   SAVE INVOICE
========================= */
async function saveInvoice() {
  const ok = confirm("Bạn có chắc muốn lưu hóa đơn không?");
  if (!ok) return;

  const rows = document.querySelectorAll("#itemsBody tr");
  if (rows.length === 0) {
    alert("Chưa có hàng hóa nào");
    return;
  }

  const items = [];
  rows.forEach(tr => {
    items.push({
      name: tr.querySelector(".name").value,
      quantity: Number(tr.querySelector(".qty").value),
      price: Number(tr.querySelector(".price").value),
      total:
        Number(tr.querySelector(".qty").value) *
        Number(tr.querySelector(".price").value)
    });
  });

  const data = {
    invoice_id: "HD_" + Date.now(),
    date: document.getElementById("date").value,
    category: document.getElementById("category").value,
    note: document.getElementById("note").value,
    grand_total: items.reduce((s, i) => s + i.total, 0),
    items
  };

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    if (!res.ok) {
      throw new Error("Không kết nối được Google Apps Script");
    }

    const result = await res.json();

    if (!result.success) {
      throw new Error(result.message || "Lưu thất bại");
    }

    alert("✅ Đã lưu hóa đơn!");
    resetForm();

  } catch (err) {
    alert("❌ Lỗi khi lưu hóa đơn:\n" + err.message);
  }
}

/* =========================
   RESET FORM AFTER SAVE
========================= */
function resetForm() {
  document.getElementById("date").value = "";
  document.getElementById("note").value = "";
  document.getElementById("category").value = "BIGC";

  document.getElementById("itemsBody").innerHTML = "";
  document.getElementById("grandTotal").innerText = "0";

  addRow();
}

/* =========================
   INIT
========================= */
addRow();
